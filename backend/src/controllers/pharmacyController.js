import { prisma } from '../config/db.js';

export const getPharmacyInventory = async (req, res, next) => {
  try {
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { userId: req.user.id },
    });

    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy profile not found for this user.' });
    }

    const inventory = await prisma.pharmacyInventory.findMany({
      where: { pharmacyId: pharmacy.id },
      include: { medicine: true },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      success: true,
      message: 'Pharmacy inventory list.',
      data: { pharmacy, inventory },
    });
  } catch (error) {
    next(error);
  }
};

export const addInventoryItem = async (req, res, next) => {
  try {
    const { medicineId, batchNumber, expiryDate, quantity, price, prescriptionRequired } = req.body;

    const pharmacy = await prisma.pharmacy.findUnique({
      where: { userId: req.user.id },
    });

    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy record not found.' });
    }

    const inventoryItem = await prisma.pharmacyInventory.create({
      data: {
        pharmacyId: pharmacy.id,
        medicineId,
        batchNumber: batchNumber || 'BATCH-' + Date.now(),
        expiryDate: new Date(expiryDate),
        quantity: parseInt(quantity) || 1,
        price: parseFloat(price) || 0,
        prescriptionRequired: prescriptionRequired === true,
        isAvailable: true,
      },
      include: { medicine: true },
    });

    res.status(201).json({
      success: true,
      message: 'Inventory item added.',
      data: { inventoryItem },
    });
  } catch (error) {
    next(error);
  }
};

export const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, price, isAvailable } = req.body;

    const inventoryItem = await prisma.pharmacyInventory.update({
      where: { id },
      data: {
        ...(quantity !== undefined && { quantity: parseInt(quantity) }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
      },
      include: { medicine: true },
    });

    res.json({
      success: true,
      message: 'Inventory updated.',
      data: { inventoryItem },
    });
  } catch (error) {
    next(error);
  }
};
