export const MEDICAL_DISCLAIMER =
  "This information is for general educational purposes only and is not a substitute for professional medical advice. For serious, persistent, or emergency symptoms, consult a qualified healthcare professional.";

export const GENERIC_SUBSTITUTION_DISCLAIMER =
  "Confirm suitability with a qualified pharmacist or doctor before substituting any medicine, especially prescription items.";

/**
 * Expiry status calculation
 * - EXPIRED: expiry date < current date
 * - EXPIRING_SOON: within configurable threshold (default 30 days)
 * - VALID: > threshold days
 */
export const checkExpiryStatus = (expiryDate, thresholdDays = 30) => {
  const now = new Date();
  const exp = new Date(expiryDate);

  if (isNaN(exp.getTime())) {
    return { status: 'EXPIRED', daysRemaining: 0, isValid: false, reason: 'Invalid Expiry Date' };
  }

  const diffTime = exp.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return {
      status: 'EXPIRED',
      daysRemaining,
      isValid: false,
      reason: 'Medicine has expired and cannot be donated or listed.',
    };
  }

  if (daysRemaining <= thresholdDays) {
    return {
      status: 'EXPIRING_SOON',
      daysRemaining,
      isValid: true,
      reason: `Medicine expires within ${daysRemaining} days. Needs urgent allocation.`,
    };
  }

  return {
    status: 'VALID',
    daysRemaining,
    isValid: true,
    reason: 'Medicine expiry date is valid.',
  };
};

/**
 * Check overall eligibility for donation
 */
export const checkDonationEligibility = (batchData, condition) => {
  const expiryCheck = checkExpiryStatus(batchData.expiryDate);

  if (!expiryCheck.isValid) {
    return {
      eligible: false,
      reason: expiryCheck.reason,
    };
  }

  const allowedConditions = ['Sealed', 'Unopened', 'Original Packaging', 'New'];
  if (!allowedConditions.includes(condition)) {
    return {
      eligible: false,
      reason: `Condition '${condition}' is not accepted. Medicines must be unopened, sealed, in original packaging.`,
    };
  }

  return {
    eligible: true,
    reason: 'Medicine meets preliminary eligibility safety requirements.',
    expiryStatus: expiryCheck.status,
    daysRemaining: expiryCheck.daysRemaining,
  };
};
