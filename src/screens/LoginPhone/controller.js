export const validatePhone = phone => {
  const replacedString = phone.replace(/\s/g, '');
  console.warn(replacedString);
  return !/[a-zA-Z]/.test(replacedString) && !/[^\d\-+]/.test(replacedString);
};

export const validateOtp = otp => {
  return !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(otp);
};
