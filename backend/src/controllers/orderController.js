import { prisma } from '../config/db.js';
import { paymentProvider } from '../services/paymentService.js';
import { sendNotification } from '../services/notificationService.js';

export const createOrder = async (req, res, next) => {
  try {
    const { pharmacyId, items, shippingAddress, paymentMethod = 'COD' } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items list is required.' });
    }

    // Auto-resolve pharmacyId if omitted
    let targetPharmacyId = pharmacyId;
    if (!targetPharmacyId) {
      const defaultPharmacy = await prisma.pharmacy.findFirst();
      if (defaultPharmacy) {
        targetPharmacyId = defaultPharmacy.id;
      } else {
        return res.status(400).json({ success: false, message: 'No registered pharmacy found to fulfill order.' });
      }
    }

    // Compute total amount
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const medicine = await prisma.medicine.findUnique({ where: { id: item.medicineId } });
      if (!medicine) continue;

      const price = parseFloat(item.pricePerUnit) || 45;
      const qty = parseInt(item.quantity) || 1;
      totalAmount += price * qty;

      orderItemsData.push({
        medicineId: item.medicineId,
        quantity: qty,
        pricePerUnit: price,
      });
    }

    if (orderItemsData.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid medicines found in the order.' });
    }

    // Handle Payment Method: COD (Cash on Delivery) vs Mock Online
    const isCOD = paymentMethod === 'COD' || paymentMethod === 'CASH_ON_DELIVERY';
    let paymentResult = {
      success: true,
      transactionId: `COD-${Date.now().toString().slice(-8)}`,
      paymentMethod: 'COD',
      message: 'Cash on Delivery selected. Pay upon receipt.',
    };

    if (!isCOD) {
      paymentResult = await paymentProvider.processPayment({
        amount: totalAmount,
        paymentMethod,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        pharmacyId: targetPharmacyId,
        totalAmount,
        shippingAddress: shippingAddress || req.user.profile?.address || 'Standard Delivery Address',
        paymentMethod: isCOD ? 'COD' : paymentMethod,
        paymentStatus: isCOD ? 'PENDING' : (paymentResult.success ? 'PAID' : 'FAILED'),
        status: 'CONFIRMED',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        pharmacy: true,
        items: { include: { medicine: true } },
      },
    });

    // Notify user
    await sendNotification({
      userId,
      title: isCOD ? 'Order Placed (Cash on Delivery)' : 'Order Placed Successfully',
      message: isCOD
        ? `Your order #${order.id.slice(0, 8)} for ₹${totalAmount.toFixed(2)} is confirmed with Cash on Delivery.`
        : `Your pharmacy order #${order.id.slice(0, 8)} for ₹${totalAmount.toFixed(2)} has been confirmed.`,
      type: 'ORDER',
      link: `/orders/${order.id}`,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ORDER_PLACED',
        entity: 'Order',
        entityId: order.id,
        metadataJson: JSON.stringify({ totalAmount, transactionId: paymentResult.transactionId }),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order created and payment processed via MockPaymentService.',
      data: {
        order,
        paymentResult,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        pharmacy: true,
        items: { include: { medicine: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      message: 'User orders list.',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export const getPharmacyOrders = async (req, res, next) => {
  try {
    let whereClause = {};
    if (req.user.role === 'PHARMACY') {
      const pharmacy = await prisma.pharmacy.findFirst({ where: { userId: req.user.id } });
      if (pharmacy) {
        whereClause.pharmacyId = pharmacy.id;
      }
    }
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        pharmacy: true,
        items: { include: { medicine: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      message: 'Pharmacy orders list.',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        items: { include: { medicine: true } },
      },
    });

    res.json({
      success: true,
      message: 'Order status updated successfully.',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};
