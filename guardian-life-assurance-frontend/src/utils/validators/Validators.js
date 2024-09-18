import validator from 'validator';

export const required = (value) => {
  if (!value.toString().trim().length) {
    return 'This field cannot be left blank. Please fill it in.';
  }
  return null;
};

export const email = (value) => {
  if (!validator.isEmail(value)) {
    return 'Please provide a valid email address, e.g., example@domain.com.';
  }
  return null;
};

export const alphanumeric = (value) => {
  if (!validator.isAlphanumeric(value)) {
    return 'Please use only letters and numbers for this field.';
  }
  return null;
};

export const alphabetsOnly = (value) => {
  if (!validator.isAlpha(value)) {
    return 'This field can only contain alphabetic characters.';
  }
  return null;
};

export const positiveNumeric = (value) => {
  if (!validator.isNumeric(value) || parseFloat(value) <= 0) {
    return 'Please enter a valid positive number greater than zero.';
  }
  return null;
};

export const minLength = (value, length) => {
  if (value.length < length) {
    return `This field must be at least ${length} characters long.`;
  }
  return null;
};

export const isStrongPassword = (value) => {
  if (!validator.isStrongPassword(value, { minLength: 8, minUppercase: 1, minLowercase: 1, minSymbols: 1 })) {
    return 'Password must be 8+ characters, including an uppercase letter, a lowercase letter, and a special character.';
  }
  return null;
};
export const isEqual = (value1, value2) => {
  if (value1 !== value2) {
    return 'The values do not match.';
  }
  return null;
};
