import { prisma } from '../config/db.js';

export const lookupBarcode = async (barcodeString) => {
  if (!barcodeString) return null;

  const batch = await prisma.medicineBatch.findFirst({
    where: { barcode: barcodeString },
    include: {
      medicine: true,
    },
  });

  if (batch) {
    return {
      found: true,
      batchNumber: batch.batchNumber,
      medicine: batch.medicine,
      expiryDate: batch.expiryDate,
      verificationStatus: batch.verificationStatus,
    };
  }

  return {
    found: false,
    barcode: barcodeString,
    message: 'Barcode string not found in master database.',
  };
};
