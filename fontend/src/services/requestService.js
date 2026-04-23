/**
 * Request Service
 * API service for disaster request submission and management
 */

import { api } from '../lib/api';
import { createRequestSubmittedNotification } from './notificationService';

const REQUEST_FORM_PAYLOADS_KEY = 'drrcs_request_form_payloads';
const TRACKING_INDEX_KEY = 'drrcs_tracking_index';

const saveRequestFormPayload = (requestId, requestData) => {
  try {
    const existing = localStorage.getItem(REQUEST_FORM_PAYLOADS_KEY);
    const payloads = existing ? JSON.parse(existing) : {};
    payloads[requestId] = {
      ...requestData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(REQUEST_FORM_PAYLOADS_KEY, JSON.stringify(payloads));
  } catch {
    // Ignore payload persistence failures
  }
};

/**
 * Save a mapping so users can look up a request by its ID, email, or phone.
 */
const saveTrackingIndex = (requestId, email, phone) => {
  try {
    const existing = localStorage.getItem(TRACKING_INDEX_KEY);
    const index = existing ? JSON.parse(existing) : {};
    const normalizedEmail = email?.trim().toLowerCase() || null;
    const normalizedPhone = phone?.trim().replace(/\D/g, '') || null;

    // Store full info keyed by requestId
    index[requestId] = {
      requestId,
      email: normalizedEmail,
      phone: normalizedPhone,
      submittedAt: new Date().toISOString(),
    };

    // Reverse lookup by email and phone
    if (normalizedEmail) index[normalizedEmail] = requestId;
    if (normalizedPhone) index[normalizedPhone] = requestId;

    localStorage.setItem(TRACKING_INDEX_KEY, JSON.stringify(index));
  } catch { /* ignore */ }
};

/**
 * Submit a new disaster request
 * @param {object} requestData - The request data to submit
 * @returns {Promise} - Promise resolving to response object
 */
export const submitRequest = async (requestData) => {
  // Validate required fields early for consistent UI error handling
  if (!requestData.title || !requestData.description || !requestData.disasterType) {
    throw {
      success: false,
      message: 'Missing required fields',
      errors: ['title', 'description', 'disasterType']
    };
  }

  // Convert UI disaster labels to the backend enum used for routing and reporting.
  const resolveType = (disasterType = '') => {
    const map = {
      flood: 'RESCUE', earthquake: 'RESCUE', hurricane: 'RESCUE', tornado: 'RESCUE',
      wildfire: 'EVACUATION', 'wild fire': 'EVACUATION',
      medical: 'MEDICAL', health: 'MEDICAL',
      food: 'FOOD', water: 'WATER', shelter: 'SHELTER',
      clothing: 'CLOTHING', transportation: 'TRANSPORTATION',
    };
    return map[disasterType.toLowerCase()] || 'OTHER';
  };

  // Keep priority names aligned with the backend enum.
  const resolvePriority = (priority = '') => {
    const supported = { critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };
    return supported[priority.toLowerCase()] || 'MEDIUM';
  };

  // Flatten selected resource groups into the backend list format.
  const resolveRequiredResources = (resourceNeeds = {}) => {
    const resources = [];
    if (resourceNeeds.food?.needed) resources.push('FOOD');
    if (resourceNeeds.medical?.needed) resources.push('MEDICAL');
    if (resourceNeeds.shelter?.needed) resources.push('SHELTER');
    if (resourceNeeds.water?.needed) resources.push('WATER');
    if (resourceNeeds.searchRescue?.needed) resources.push('RESCUE');
    if (resourceNeeds.clothing?.needed) resources.push('CLOTHING');
    if (resourceNeeds.transportation?.needed) resources.push('TRANSPORTATION');
    return resources;
  };

  try {
    const parsedLatitude = parseFloat(requestData.location?.latitude);
    const parsedLongitude = parseFloat(requestData.location?.longitude);

    // Build the request body expected by the emergency submission endpoint.
    const backendPayload = {
      title: requestData.title,
      description: requestData.description,
      type: resolveType(requestData.disasterType),
      disasterType: requestData.disasterType,
      priority: resolvePriority(requestData.priority),
      location: {
        // Backend requires both latitude and longitude.
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        address: requestData.location?.address?.trim(),
        city: requestData.location?.city?.trim(),
        state: requestData.location?.state || undefined,
        zipCode: requestData.location?.zipCode || undefined,
        country: requestData.location?.country || undefined,
      },
      reportedBy: requestData.contact?.primaryName || requestData.authorizedBy || 'Unknown',
      // Backend accepts contactPhone only when it is exactly 10 digits.
      contactPhone: (() => {
        const digits = (requestData.contact?.primaryPhone || '').replace(/\D/g, '');
        return digits.length === 10 ? digits : undefined;
      })(),
      contactEmail: requestData.contact?.primaryEmail || undefined,
      affectedPeople: requestData.affectedPeople ? parseInt(requestData.affectedPeople, 10) : undefined,
      requiredResources: resolveRequiredResources(requestData.resourceNeeds),
    };

    const createdRequest = await api.createRequest(backendPayload);

    const trackingCode = createdRequest.trackingCode || createdRequest.id;
    saveRequestFormPayload(createdRequest.id, requestData);
    saveRequestFormPayload(trackingCode, requestData);
    saveTrackingIndex(
      trackingCode,
      requestData.contact?.primaryEmail,
      requestData.contact?.primaryPhone
    );
    createRequestSubmittedNotification(createdRequest);

    return {
      success: true,
      requestId: createdRequest.id,
      trackingCode,
      message: `Request submitted! Tracking code: ${trackingCode}`,
      timestamp: createdRequest.timestamp,
      status: createdRequest.status,
      data: {
        requestId: createdRequest.id,
        trackingCode,
        ...requestData,
        submittedAt: createdRequest.timestamp,
        status: createdRequest.status
      }
    };
  } catch (error) {
    throw {
      success: false,
      message: error?.message || 'Failed to submit request. Please try again.',
      error: error?.message || String(error)
    };
  }
};

/**
 * Look up a request by tracking ID, email, or phone number.
 * Available publicly — no authentication required.
 *
 * @param {string} query - Request ID, email address, or phone number
 */
export const trackRequest = async (query) => {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return { success: false, message: 'Please enter a tracking ID, email, or phone number.' };
  }

  const normalizeTrackingError = (rawMessage) => {
    const message = (rawMessage || '').trim();
    if (!message) {
      return 'No request found with that information. Please double-check your tracking ID, email, or phone number.';
    }

    // Backend can return a generic message on internal validation branches.
    // Convert it to a user-actionable prompt instead of surfacing a vague error.
    if (/an unexpected error occurred/i.test(message)) {
      return 'Could not find a request for that value. Try the tracking code shown after submission, or use the exact email/phone from the form.';
    }

    return message;
  };

  try {
    const API_BASE =
      (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api') + '/v1';
    const res = await fetch(
      `${API_BASE}/emergencies/public/track/${encodeURIComponent(trimmed)}`
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: normalizeTrackingError(json.message),
      };
    }
    const d = json?.data ?? json;

    return {
      success: true,
      request: {
        id: d.id,
        trackingCode: d.trackingCode,
        status: ((d.status || 'pending').toLowerCase().replace(/_/g, '-') === 'resolved'
          ? 'completed'
          : (d.status || 'pending').toLowerCase().replace(/_/g, '-')),
        title: d.title || '',
        priority: (d.priority || 'medium').toLowerCase(),
        disasterType: (d.disasterType || d.type || 'other').toLowerCase(),
        location: d.location?.address
          ? [d.location.address, d.location.city].filter(Boolean).join(', ')
          : 'Not specified',
        contactName: d.reportedBy || 'N/A',
        assignedTo: d.assignedTo || null,
        submittedAt: d.createdAt || d.timestamp || null,
        updatedAt: d.updatedAt || null,
        description: d.description || '',
        notes: d.title || '',
      },
    };
  } catch {
    return { success: false, message: 'Failed to retrieve request. Please try again.' };
  }
};

/**
 * Get request by ID
 * @param {string} requestId - The request ID
 * @returns {Promise} - Promise resolving to request data
 */
export const getRequest = async (requestId) => {
  const request = await api.getRequestById(requestId);
  if (!request) {
    throw new Error('Request not found');
  }
  return request;
};

/**
 * Get all requests for a user/organization
 * @param {object} options - Filter options (organizationId, status, priority, etc.)
 * @returns {Promise} - Promise resolving to array of requests
 */
export const getRequests = async (_options = {}) => {
  return await api.getRequests();
};

/**
 * Update an existing request
 * @param {string} requestId - The request ID
 * @param {object} updateData - Data to update
 * @returns {Promise} - Promise resolving to updated request
 */
export const updateRequest = async (requestId, updateData) => {
  return await api.updateRequest(requestId, updateData);
};

/**
 * Delete a request
 * @param {string} requestId - The request ID
 * @returns {Promise} - Promise resolving to confirmation
 */
export const deleteRequest = async (_requestId) => {
  throw new Error('Delete request is not currently supported by the backend API.');
};

/**
 * Save request as draft (to localStorage for now)
 * @param {string} draftKey - Key to store draft under
 * @param {object} formData - Form data to save
 */
export const saveDraft = (draftKey, formData) => {
  try {
    localStorage.setItem(`draft_${draftKey}`, JSON.stringify({
      data: formData,
      savedAt: new Date().toISOString()
    }));
    return { success: true, message: 'Draft saved' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Load request draft from localStorage
 * @param {string} draftKey - Key to retrieve draft from
 * @returns {object} - Draft data or null
 */
export const loadDraft = (draftKey) => {
  try {
    const draft = localStorage.getItem(`draft_${draftKey}`);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Clear request draft from localStorage
 * @param {string} draftKey - Key to delete draft from
 */
export const clearDraft = (draftKey) => {
  try {
    localStorage.removeItem(`draft_${draftKey}`);
    return { success: true, message: 'Draft cleared' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get request status history
 * @param {string} requestId - The request ID
 * @returns {Promise} - Promise resolving to status history array
 */
export const getRequestStatusHistory = async (requestId) => {
  const request = await api.getRequestById(requestId);
  if (!request) return [];

  const history = [];
  if (request.timestamp) {
    history.push({ status: 'pending', timestamp: request.timestamp, note: 'Request submitted' });
  }
  if (request.updatedAt) {
    history.push({ status: request.status, timestamp: request.updatedAt, note: 'Request updated' });
  }
  if (request.completedAt) {
    history.push({ status: 'completed', timestamp: request.completedAt, note: 'Request completed' });
  }
  return history;
};

export default {
  submitRequest,
  getRequest,
  getRequests,
  updateRequest,
  deleteRequest,
  saveDraft,
  loadDraft,
  clearDraft,
  getRequestStatusHistory
};
