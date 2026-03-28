/**
 * Request Form Validation Utilities
 * Validation rules and functions for disaster request submission form
 */

/**
 * Validate request title
 * @param {string} title - The request title
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Title is required' };
  }
  if (title.trim().length < 3) {
    return { isValid: false, error: 'Title must be at least 3 characters' };
  }
  if (title.length > 100) {
    return { isValid: false, error: 'Title must not exceed 100 characters' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate request description
 * @param {string} description - The request description
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateDescription = (description) => {
  if (!description || description.trim().length === 0) {
    return { isValid: false, error: 'Description is required' };
  }
  if (description.trim().length < 10) {
    return { isValid: false, error: 'Description must be at least 10 characters' };
  }
  if (description.length > 1000) {
    return { isValid: false, error: 'Description must not exceed 1000 characters' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate disaster type
 * @param {string} disasterType - The selected disaster type
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateDisasterType = (disasterType) => {
  const validTypes = ['earthquake', 'flood', 'wildfire', 'hurricane', 'tornado', 'other'];
  if (!disasterType || validTypes.indexOf(disasterType) === -1) {
    return { isValid: false, error: 'Please select a valid disaster type' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate state/region
 * @param {string} state - The selected state or region
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateState = (state) => {
  if (!state || state.trim().length === 0) {
    return { isValid: false, error: 'State/Region is required' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate exact street address
 * @param {string} address - The exact address
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAddress = (address) => {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'Exact address is required' };
  }
  if (address.trim().length < 5) {
    return { isValid: false, error: 'Please enter a more complete address' };
  }
  if (address.length > 200) {
    return { isValid: false, error: 'Address must not exceed 200 characters' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate city name
 * @param {string} city - The city name
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateCity = (city) => {
  if (!city || city.trim().length === 0) {
    return { isValid: false, error: 'City is required' };
  }
  if (city.trim().length < 2) {
    return { isValid: false, error: 'City must be at least 2 characters' };
  }
  if (city.length > 100) {
    return { isValid: false, error: 'City must not exceed 100 characters' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate latitude/longitude coordinates
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateCoordinates = (latitude, longitude) => {
  if (latitude === '' || latitude === null || latitude === undefined) {
    return { isValid: true, error: '' }; // Optional field
  }
  const lat = parseFloat(latitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return { isValid: false, error: 'Latitude must be between -90 and 90' };
  }
  if (longitude === '' || longitude === null || longitude === undefined) {
    return { isValid: true, error: '' }; // Optional field
  }
  const lng = parseFloat(longitude);
  if (isNaN(lng) || lng < -180 || lng > 180) {
    return { isValid: false, error: 'Longitude must be between -180 and 180' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate affected area size
 * @param {string} affectedAreaSize - The affected area size (optional)
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAffectedAreaSize = (affectedAreaSize) => {
  if (!affectedAreaSize || affectedAreaSize.trim().length === 0) {
    return { isValid: true, error: '' }; // Optional field
  }
  if (affectedAreaSize.length > 100) {
    return { isValid: false, error: 'Affected area description must not exceed 100 characters' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate phone number format
 * @param {string} phone - The phone number
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }
  // Simple phone validation: at least 10 digits
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  if (phoneDigits.length > 15) {
    return { isValid: false, error: 'Phone number is too long' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate optional phone number (can be empty)
 * @param {string} phone - The phone number
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePhoneOptional = (phone) => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: true, error: '' }; // Optional field
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  if (phoneDigits.length > 15) {
    return { isValid: false, error: 'Phone number is too long' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate email address
 * @param {string} email - The email address
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate contact name
 * @param {string} name - The contact name
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateContactName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  if (name.length > 100) {
    return { isValid: false, error: 'Name must not exceed 100 characters' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate priority level
 * @param {string} priority - The selected priority level
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePriority = (priority) => {
  const validPriorities = ['critical', 'high', 'medium', 'low'];
  if (!priority || validPriorities.indexOf(priority) === -1) {
    return { isValid: false, error: 'Please select a valid priority level' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate urgency reason (required for critical and high priority)
 * @param {string} urgencyReason - The urgency reason
 * @param {string} priority - The priority level
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateUrgencyReason = (urgencyReason, priority) => {
  if (priority === 'critical' || priority === 'high') {
    if (!urgencyReason || urgencyReason.trim().length === 0) {
      return { isValid: false, error: 'Urgency reason is required for critical/high priority' };
    }
    if (urgencyReason.trim().length < 10) {
      return { isValid: false, error: 'Urgency reason must be at least 10 characters' };
    }
    if (urgencyReason.length > 500) {
      return { isValid: false, error: 'Urgency reason must not exceed 500 characters' };
    }
  }
  return { isValid: true, error: '' };
};

/**
 * Validate authorization date
 * @param {string} authorizationDate - The authorization date
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAuthorizationDate = (authorizationDate) => {
  if (!authorizationDate || authorizationDate.trim().length === 0) {
    return { isValid: false, error: 'Authorization date is required' };
  }
  const date = new Date(authorizationDate);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Please select a valid date' };
  }
  // Check if date is not in the future
  if (date > new Date()) {
    return { isValid: false, error: 'Authorization date cannot be in the future' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate authorized by name
 * @param {string} authorizedBy - The name of who authorized the request
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAuthorizedBy = (authorizedBy) => {
  if (!authorizedBy || authorizedBy.trim().length === 0) {
    return { isValid: false, error: 'Authorized by name is required' };
  }
  if (authorizedBy.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  if (authorizedBy.length > 100) {
    return { isValid: false, error: 'Name must not exceed 100 characters' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate entire request form
 * @param {object} formData - The complete form data
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateRequestForm = (formData) => {
  const errors = {};

  // Basic information
  const titleError = validateTitle(formData.title);
  if (!titleError.isValid) errors.title = titleError.error;

  const descError = validateDescription(formData.description);
  if (!descError.isValid) errors.description = descError.error;

  const disasterTypeError = validateDisasterType(formData.disasterType);
  if (!disasterTypeError.isValid) errors.disasterType = disasterTypeError.error;

  // Location
  const addressError = validateAddress(formData.location.address);
  if (!addressError.isValid) errors['location.address'] = addressError.error;

  const stateError = validateState(formData.location.state);
  if (!stateError.isValid) errors['location.state'] = stateError.error;

  const cityError = validateCity(formData.location.city);
  if (!cityError.isValid) errors['location.city'] = cityError.error;

  const coordError = validateCoordinates(formData.location.latitude, formData.location.longitude);
  if (!coordError.isValid) {
    errors['location.coordinates'] = coordError.error;
  }

  const areaError = validateAffectedAreaSize(formData.location.affectedAreaSize);
  if (!areaError.isValid) errors['location.affectedAreaSize'] = areaError.error;

  // Contact information
  const primaryNameError = validateContactName(formData.contact.primaryName);
  if (!primaryNameError.isValid) errors['contact.primaryName'] = primaryNameError.error;

  const primaryPhoneError = validatePhone(formData.contact.primaryPhone);
  if (!primaryPhoneError.isValid) errors['contact.primaryPhone'] = primaryPhoneError.error;

  const primaryEmailError = validateEmail(formData.contact.primaryEmail);
  if (!primaryEmailError.isValid) errors['contact.primaryEmail'] = primaryEmailError.error;

  const backupPhoneError = validatePhoneOptional(formData.contact.backupPhone);
  if (!backupPhoneError.isValid) errors['contact.backupPhone'] = backupPhoneError.error;

  // Priority and urgency
  const priorityError = validatePriority(formData.priority);
  if (!priorityError.isValid) errors.priority = priorityError.error;

  const urgencyError = validateUrgencyReason(formData.urgencyReason, formData.priority);
  if (!urgencyError.isValid) errors.urgencyReason = urgencyError.error;

  // Organization
  const authorizedByError = validateAuthorizedBy(formData.authorizedBy);
  if (!authorizedByError.isValid) errors.authorizedBy = authorizedByError.error;

  const authDateError = validateAuthorizationDate(formData.authorizationDate);
  if (!authDateError.isValid) errors.authorizationDate = authDateError.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
