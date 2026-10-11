import { prisma } from '../config/db.js';
import { extractPackagingText } from '../services/ocrService.js';
import { lookupBarcode } from '../services/barcodeService.js';
import { runVerificationEngine } from '../services/verificationEngine.js';
import { checkDonationEligibility, checkExpiryStatus } from '../utils/safetyRules.js';
import { sendNotification } from '../services/notificationService.js';

export const createDonation = async (req, res, next) => {
  try {
    const {
      medicineName,
      genericName,
      strength,
      dosageForm,
      manufacturer,
      batchNumber,
      expiryDate,
      quantity,
      condition,
      storageCondition,
      pickupPreference,
      barcode,
    } = req.body;

    const donorId = req.user.id;
    const file = req.file;

    if (!medicineName || !batchNumber || !expiryDate || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Medicine name, batch number, expiry date, and quantity are required.',
        data: null,
      });
    }

    // Check expiry safety requirement
    const eligibility = checkDonationEligibility({ expiryDate }, condition || 'Sealed');
    if (!eligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: `Donation Rejected: ${eligibility.reason}`,
        data: null,
      });
    }

    // 1. OCR Extraction if file uploaded
    let ocrResult = null;
    let imageUrl = '/uploads/default-medicine.png';
    let originalFilename = 'package.jpg';

    if (file) {
      imageUrl = `/uploads/${file.filename}`;
      originalFilename = file.originalname;
      ocrResult = await extractPackagingText(file.path, file.originalname);
    }

    // 2. Barcode resolution
    let barcodeResult = null;
    if (barcode) {
      barcodeResult = await lookupBarcode(barcode);
    }

    // 3. Find or create master medicine entity
    let medicine = await prisma.medicine.findFirst({
      where: {
        OR: [
          { name: { equals: medicineName, mode: 'insensitive' } },
          { genericName: { equals: genericName || medicineName, mode: 'insensitive' } },
        ],
      },
    });

    if (!medicine) {
      medicine = await prisma.medicine.create({
        data: {
          name: medicineName,
          genericName: genericName || medicineName,
          strength: strength || '500 mg',
          dosageForm: dosageForm || 'Tablet',
          dosage: strength || '500 mg',
          manufacturer: manufacturer || 'Verified Pharma',
          category: 'General Healthcare',
          activeIngredient: genericName || medicineName,
          prescriptionRequired: false,
        },
      });
    }

    // 4. Run automated verification engine
    const verification = runVerificationEngine({
      userInputs: { medicineName, batchNumber, expiryDate, condition },
      ocrResult,
      barcodeResult,
      matchedMedicine: medicine,
    });

    // 5. Create Batch
    const batch = await prisma.medicineBatch.create({
      data: {
        medicineId: medicine.id,
        batchNumber,
        expiryDate: new Date(expiryDate),
        storageConditions: storageCondition || 'Cool & dry place',
        barcode: barcode || null,
        verificationStatus: verification.status,
        images: {
          create: {
            imageUrl,
            originalFilename,
          },
        },
      },
    });

    // 6. Create Donation
    const donation = await prisma.donation.create({
      data: {
        donorId,
        medicineBatchId: batch.id,
        quantity: parseInt(quantity),
        condition: condition || 'Sealed',
        storageCondition: storageCondition || 'Cool & dry place',
        pickupPreference: pickupPreference || 'SELF_DROP',
        status: verification.status === 'VERIFIED' ? 'PENDING_VERIFICATION' : 'PENDING_VERIFICATION',
        verificationReason: verification.recommendation,
        verifications: {
          create: {
            ocrDataJson: ocrResult ? JSON.stringify(ocrResult) : null,
            barcodeScanned: barcode || null,
            confidenceScore: verification.score,
            status: verification.status,
            notes: verification.reason,
          },
        },
      },
      include: {
        medicineBatch: {
          include: {
            medicine: true,
            images: true,
          },
        },
        verifications: true,
      },
    });

    // Notification
    await sendNotification({
      userId: donorId,
      title: 'Donation Submitted',
      message: `Your donation of ${medicineName} (${quantity} units) has been submitted and queued for verification.`,
      type: 'DONATION',
      link: `/donations/${donation.id}`,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: donorId,
        action: 'DONATION_SUBMITTED',
        entity: 'Donation',
        entityId: donation.id,
        metadataJson: JSON.stringify({ medicineName, quantity, status: donation.status }),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Medicine donation submitted successfully and is queued for verification.',
      data: {
        donation,
        ocrResult,
        verification,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDonations = async (req, res, next) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { donorId: req.user.id },
      include: {
        medicineBatch: {
          include: {
            medicine: true,
            images: true,
          },
        },
        verifications: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    res.json({
      success: true,
      message: 'User donations retrieved.',
      data: { donations },
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationById = async (req, res, next) => {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: req.params.id },
      include: {
        donor: { include: { profile: true } },
        medicineBatch: {
          include: {
            medicine: true,
            images: true,
          },
        },
        verifications: true,
        approvedBy: { include: { profile: true } },
      },
    });

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }

    res.json({
      success: true,
      message: 'Donation details.',
      data: { donation },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyDonation = async (req, res, next) => {
  try {
    const { status, verificationReason } = req.body; // 'APPROVED' | 'REJECTED'
    const donationId = req.params.id;
    const adminId = req.user.id;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be APPROVED or REJECTED.' });
    }

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { medicineBatch: true },
    });

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }

    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status,
        verificationReason: verificationReason || (status === 'APPROVED' ? 'Approved by Admin Verification Officer' : 'Rejected by Admin'),
        approvedById: adminId,
        approvedAt: new Date(),
      },
    });

    // Update batch verification status
    await prisma.medicineBatch.update({
      where: { id: donation.medicineBatchId },
      data: {
        verificationStatus: status === 'APPROVED' ? 'VERIFIED' : 'REJECTED',
      },
    });

    // Notify donor
    await sendNotification({
      userId: donation.donorId,
      title: `Donation ${status}`,
      message: `Your medicine donation has been ${status.toLowerCase()}. ${verificationReason || ''}`,
      type: 'DONATION',
      link: `/donations/${donation.id}`,
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: `DONATION_${status}`,
        entity: 'Donation',
        entityId: donationId,
        metadataJson: JSON.stringify({ verificationReason }),
      },
    });

    res.json({
      success: true,
      message: `Donation has been ${status.toLowerCase()}.`,
      data: { donation: updatedDonation },
    });
  } catch (error) {
    next(error);
  }
};
