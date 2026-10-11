import { prisma } from '../config/db.js';
import { sendNotification } from '../services/notificationService.js';

export const createRequest = async (req, res, next) => {
  try {
    const { items, sourceType, sourceId, priority, reason } = req.body;
    const requesterId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request items array cannot be empty.',
        data: null,
      });
    }

    const request = await prisma.medicineRequest.create({
      data: {
        requesterId,
        sourceType: sourceType || 'DONATION',
        sourceId: sourceId || null,
        priority: priority || 'MEDIUM',
        reason: reason || 'Essential healthcare need',
        status: 'REQUESTED',
        items: {
          create: items.map((item) => ({
            medicineId: item.medicineId,
            quantity: parseInt(item.quantity) || 1,
          })),
        },
      },
      include: {
        items: {
          include: { medicine: true },
        },
      },
    });

    // Notify user
    await sendNotification({
      userId: requesterId,
      title: 'Medicine Request Created',
      message: `Your medicine request #${request.id.slice(0, 8)} has been submitted and is under review.`,
      type: 'REQUEST',
      link: `/requests/${request.id}`,
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: requesterId,
        action: 'REQUEST_CREATED',
        entity: 'MedicineRequest',
        entityId: request.id,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Medicine request submitted successfully.',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await prisma.medicineRequest.findMany({
      where: { requesterId: req.user.id },
      include: {
        items: {
          include: { medicine: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      message: 'User medicine requests retrieved.',
      data: { requests },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRequests = async (req, res, next) => {
  try {
    const requests = await prisma.medicineRequest.findMany({
      include: {
        requester: {
          include: { profile: true },
        },
        items: {
          include: { medicine: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      message: 'All medicine requests list.',
      data: { requests },
    });
  } catch (error) {
    next(error);
  }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const { id } = req.params;

    const allowedStatuses = ['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'ALLOCATED', 'READY', 'COMPLETED', 'REJECTED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid request status value.' });
    }

    const existingRequest = await prisma.medicineRequest.findUnique({
  where: { id },
});

if (!existingRequest) {
  return res.status(404).json({
    success: false,
    message: `Request not found for database ID: ${id}`,
  });
}

const request = await prisma.medicineRequest.update({
  where: { id: existingRequest.id },
      data: { status },
      include: { items: { include: { medicine: true } } },
    });

    // Send notification to requester
    await sendNotification({
      userId: request.requesterId,
      title: `Request Status Updated: ${status}`,
      message: `Your medicine request status has been changed to ${status}. ${note || ''}`,
      type: 'REQUEST',
      link: `/requests/${request.id}`,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: `REQUEST_STATUS_${status}`,
        entity: 'MedicineRequest',
        entityId: id,
        metadataJson: JSON.stringify({ note }),
      },
    });

    res.json({
      success: true,
      message: `Request status updated to ${status}.`,
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};
