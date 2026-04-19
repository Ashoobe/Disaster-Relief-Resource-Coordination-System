/**
 * Form Validation Utilities for DRRCS Authentication
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REQUIREMENTS = {
  minLength: PASSWORD_MIN_LENGTH,
  hasUppercase: true,
  hasLowercase: true,
  hasNumber: true,
  hasSpecialChar: true,
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, error: string | null }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true, error: null };
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, error: string | null, strength: 'weak' | 'medium' | 'strong' }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required', strength: 'weak' };
  }

  const errors = [];
  let strength = 0;

  // Check minimum length
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`at least ${PASSWORD_MIN_LENGTH} characters`);
  } else {
    strength++;
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  } else {
    strength++;
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  } else {
    strength++;
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('one number');
  } else {
    strength++;
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('one special character');
  } else {
    strength++;
  }

  const isValid = errors.length === 0;
  const strengthLevel = strength <= 2 ? 'weak' : strength <= 4 ? 'medium' : 'strong';

  return {
    isValid,
    error: isValid ? null : `Password must contain ${errors.join(', ')}`,
    strength: strengthLevel,
  };
};

/**
 * Validates that passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} - { isValid: boolean, error: string | null }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true, error: null };
};

/**
 * Validates required text field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of field for error message
 * @param {number} minLength - Minimum length (optional)
 * @returns {object} - { isValid: boolean, error: string | null }
 */
export const validateRequired = (value, fieldName, minLength = 1) => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (minLength && value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  return { isValid: true, error: null };
};

/**
 * Validates login form
 * @param {object} data - Form data { email, password, rememberMe }
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateLoginForm = (data) => {
  const errors = {};

  // Login is username-based even though older screens referred to email.
  if (!data.username || data.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  // For login, just check if password is provided (not strength validation)
  if (!data.password || data.password.trim() === '') {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates registration form
 * @param {object} data - Form data { fullName, email, password, confirmPassword, role, termsAccepted }
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateRegistrationForm = (data) => {
  const errors = {};

  const nameValidation = validateRequired(data.fullName, 'Full name', 2);
  if (!nameValidation.isValid) {
    errors.fullName = nameValidation.error;
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  const matchValidation = validatePasswordMatch(data.password, data.confirmPassword);
  if (!matchValidation.isValid) {
    errors.confirmPassword = matchValidation.error;
  }

  if (!data.termsAccepted) {
    errors.termsAccepted = 'You must accept the terms and conditions';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates forgot password form
 * @param {object} data - Form data { email }
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateForgotPasswordForm = (data) => {
  const errors = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  validateLoginForm,
  validateRegistrationForm,
  validateForgotPasswordForm,
};
