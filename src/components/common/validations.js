export const validateEmail = email => {
  // Regular expression pattern for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
};

export const validatePhoneNumber = phoneNumber => {
  // Regular expression pattern for phone number validation
  const phoneNumberRegex = /^[0-9]{10}$/;

  if (phoneNumberRegex.test(phoneNumber)) {
    return true;
  } else {
    return false;
  }
};
