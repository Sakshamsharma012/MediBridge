import { checkExpiryStatus } from '../utils/safetyRules.js';

export const runVerificationEngine = ({
  userInputs,
  ocrResult,
  barcodeResult,
  matchedMedicine,
}) => {
  const flags = [];
  let score = 1.0;

  // 1. Expiry Check
  const expiryCheck = checkExpiryStatus(userInputs.expiryDate);
  if (!expiryCheck.isValid) {
    return {
      status: 'EXPIRED',
      score: 0.0,
      reason: expiryCheck.reason,
      recommendation: 'REJECT: Medicine is expired.',
      flags: ['EXPIRED'],
    };
  }

  // 2. OCR vs User Inputs comparison
  if (ocrResult && ocrResult.extractedFields) {
    const ocrFields = ocrResult.extractedFields;

    if (ocrFields.detectedName && userInputs.medicineName) {
      const sim = strSimilarity(ocrFields.detectedName, userInputs.medicineName);
      if (sim < 0.6) {
        flags.push(`OCR Name mismatch: Detected '${ocrFields.detectedName}', Entered '${userInputs.medicineName}'`);
        score -= 0.3;
      }
    }

    if (ocrFields.batchNumber && userInputs.batchNumber) {
      if (ocrFields.batchNumber.toUpperCase() !== userInputs.batchNumber.toUpperCase()) {
        flags.push(`Batch number conflict: OCR '${ocrFields.batchNumber}', Entered '${userInputs.batchNumber}'`);
        score -= 0.2;
      }
    }
  }

  // 3. Barcode cross-check
  if (barcodeResult && barcodeResult.found) {
    score += 0.2; // Boost confidence if registered barcode matched
  }

  // 4. Decision threshold logic
  let finalStatus = 'VERIFIED';
  let recommendation = 'APPROVE: Medicine data verified successfully.';

  if (flags.length > 0 || score < 0.8) {
    finalStatus = 'PENDING';
    recommendation = 'FLAGGED FOR ADMIN REVIEW: Conflicting or uncertain extraction details.';
  }

  return {
    status: finalStatus,
    score: Math.max(0, Math.min(1.0, score)),
    reason: flags.length ? flags.join(' | ') : 'All verification checks passed.',
    recommendation,
    flags,
  };
};

function strSimilarity(a, b) {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  return 0.4;
}
