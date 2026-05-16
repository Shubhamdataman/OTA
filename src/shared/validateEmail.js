// Enhanced version with options
export const validateEmail = (email, options = {}) => {
  const { isRequired = false, allowEmpty = true } = options;
  
  // Handle empty email
  if (!email || email.trim() === '') {
    return !isRequired; // Return true if not required, false if required
  }
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email) && email.length <= 254;
};
