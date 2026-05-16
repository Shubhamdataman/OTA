// Helper function for consistent amount formatting
const formatAmount = (value, roundType = 'none') => {
  let roundedValue = value;
  
  // Apply rounding based on condition
  switch(roundType) {
    case 'ceil':
      roundedValue = Math.ceil(value * 100) / 100; // Round up to nearest 0.01
      break;
    case 'floor':
      roundedValue = Math.floor(value * 100) / 100; // Round down to nearest 0.01
      break;
    case 'round':
      roundedValue = Math.round(value * 100) / 100; // Standard rounding
      break;
    // 'none' falls through to default
    default:
      roundedValue = value; // No rounding, just formatting
  }
  
  // Format to exactly 2 decimal places
  return parseFloat(roundedValue.toFixed(2));
};