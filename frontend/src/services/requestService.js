/**
 * Request Service
 * Backend-backed request submission and tracking only.
 */

import { api } from '../lib/api';
import { createRequestSubmittedNotification } from './notificationService';

/**
 * Submit a new disaster request
 * @param {object} requestData - The request data to submit
 * @returns {Promise} - Promise resolving to response object
 */
export const submitRequest = async (requestData) => {
  if (!requestData.title || !requestData.description || !requestData.disasterType) {
    throw {
      success: false,
      message: 'Missing required fields',
      errors: ['title', 'description', 'disasterType'],
    };
  }

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

  const resolvePriority = (priority = '') => {
    const supported = { critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };
    return supported[priority.toLowerCase()] || 'MEDIUM';
  };

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
    const latitudeValue = requestData.location?.latitude;
    const longitudeValue = requestData.location?.longitude;
    const latitude = latitudeValue !== '' && latitudeValue != null
      ? parseFloat(latitudeValue)
      : NaN;
    const longitude = longitudeValue !== '' && longitudeValue != null
      ? parseFloat(longitudeValue)
      : NaN;

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw {
        success: false,
        message: 'Latitude and longitude are required because the backend expects both fields.',
      };
    }

    const backendPayload = {
      title: requestData.title,
      description: requestData.description,
      type: resolveType(requestData.disasterType),
      priority: resolvePriority(requestData.priority),
      location: {
        latitude,
        longitude,
        address: requestData.location?.address?.trim(),
        city: requestData.location?.city?.trim(),
        state: requestData.location?.state || undefined,
        zipCode: requestData.location?.zipCode || undefined,
        country: requestData.location?.country || 'USA',
      },
      reportedBy: requestData.contact?.primaryName || requestData.authorizedBy || 'Unknown',
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
    createRequestSubmittedNotification(createdRequest);

    return {
      success: true,
      requestId: createdRequest.id,
      trackingCode,
      message: `Request submitted. Tracking code: ${trackingCode}`,
      timestamp: createdRequest.timestamp,
      status: createdRequest.status,
      data: {
        requestId: createdRequest.id,
        trackingCode,
        ...requestData,
        submittedAt: createdRequest.timestamp,
        status: createdRequest.status,
      },
    };
  } catch (error) {
    throw {
      success: false,
      message: error?.message || 'Failed to submit request. Please try again.',
      error: error?.message || String(error),
    };
  }
};

/**
 * Look up a request by tracking code only.
 */
export const trackRequest = async (query) => {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return { success: false, message: 'Please enter a tracking code.' };
  }

  if (/^[a-f0-9]{24}$/i.test(trimmed)) {
    return {
      success: false,
      message: 'That looks like a database request ID. Enter the tracking code instead, such as DISASTER-2026-AB12CD34.',
    };
  }

  try {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api') + '/v1';
    const res = await fetch(`${apiBase}/emergencies/public/track/${encodeURIComponent(trimmed)}`);

    if (!res.ok) {
      return {
        success: false,
        message: 'No request was found for that tracking code.',
      };
    }

    const json = await res.json();
    const data = json?.data ?? json;
    return {
      success: true,
      request: {
        id: data.trackingCode,
        trackingCode: data.trackingCode,
        status: ((data.status || 'pending').toLowerCase().replace(/_/g, '-') === 'resolved'
          ? 'completed'
          : (data.status || 'pending').toLowerCase().replace(/_/g, '-')),
        title: data.title || '',
        priority: (data.priority || 'medium').toLowerCase(),
        disasterType: 'other',
        location: 'Not available from tracking endpoint',
        contactName: 'Not available from tracking endpoint',
        assignedTo: null,
        submittedAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
        description: data.statusMessage || '',
        notes: data.statusMessage || '',
      },
    };
  } catch {
    return { success: false, message: 'Failed to retrieve request tracking information.' };
  }
};

export const getRequest = async (requestId) => api.getRequestById(requestId);

export const getRequests = async () => api.getRequests();

export const updateRequest = async (requestId, updateData) => api.updateRequest(requestId, updateData);

export const deleteRequest = async () => ({
  success: false,
  message: 'Deleting requests is not supported by the current frontend flow.',
});

export const saveDraft = () => ({
  success: false,
  message: 'Draft saving was removed because it used browser-only storage.',
});

export const loadDraft = () => null;

export const clearDraft = () => ({
  success: true,
  message: 'No local draft is stored.',
});

export const getRequestStatusHistory = async () => [];

export default {
  submitRequest,
  trackRequest,
  getRequest,
  getRequests,
  updateRequest,
  deleteRequest,
  saveDraft,
  loadDraft,
  clearDraft,
  getRequestStatusHistory,
};
