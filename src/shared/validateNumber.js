export const validateNumber = (value, maxDigit, maxDecimal) => {
  // 1. Basic validation - allow only numbers (and decimal point only if maxDecimal > 0)
  const decimalAllowed = maxDecimal > 0;
  const numberRegex = decimalAllowed ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;

  if (value !== '' && !numberRegex.test(value)) {
    return false;
  }

  // 2. Check for more than one decimal point (if decimals allowed)
  if (decimalAllowed && (value.match(/\./g) || []).length > 1) {
    return false;
  }

  // 3. Split into whole and decimal parts (if applicable)
  const parts = value.split('.');
  const wholePart = parts[0] || '';
  const decimalPart = parts[1] || '';

  // 4. Validate maximum digits (whole + decimal parts)
  if (wholePart.length + decimalPart.length > maxDigit) {
    return false;
  }

  // 5. Validate maximum decimal places (if decimals allowed)
  if (decimalAllowed && decimalPart.length > maxDecimal) {
    return false;
  }

  // 6. If maxDecimal is 0, reject any decimal point
  if (!decimalAllowed && value.includes('.')) {
    return false;
  }

  return true;
};