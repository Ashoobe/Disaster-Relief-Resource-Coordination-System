const NOTIFICATIONS_STORAGE_KEY = 'drrcs_notifications';
const NOTIFICATIONS_UPDATED_EVENT = 'drrcs:notifications-updated';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'drrcs_token';

const getToken = () => localStorage.getItem(TOKEN_KEY);

const apiFetch = async (path, options = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('User must be logged in to sync notifications.');
  }

  const res = await fetch(`${API_BASE_URL}/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.message || `Notification request failed (${res.status})`);
  }
  return payload?.data ?? payload;
};

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');

const getViewerKeys = (user) => {
  const keys = [];

  if (user?.id) {
    keys.push(user.id);
  }

  const email = normalizeEmail(user?.email);
  if (email) {
    keys.push(email);
  }

  return keys;
};

const hasDirectAccess = (notification, user) => {
  const viewerKeys = getViewerKeys(user);
  if (!viewerKeys.length) {
    return false;
  }

  const recipientIds = Array.isArray(notification.recipientUserIds) ? notification.recipientUserIds : [];
  const recipientEmails = Array.isArray(notification.recipientEmails)
    ? notification.recipientEmails.map(normalizeEmail)
    : [];

  return viewerKeys.some((key) => recipientIds.includes(key) || recipientEmails.includes(key));
};

const hasRoleAccess = (notification, user) => {
  const roleAudience = Array.isArray(notification.roleAudience) ? notification.roleAudience : [];
  if (!roleAudience.length) {
    return false;
  }

  return !!user?.role && roleAudience.includes(user.role);
};

const isVisibleByDefaultRule = (notification, user) => {
  switch (notification.type) {
    case 'request_submitted':
      return user?.role === 'admin';
    case 'request_assigned':
      return user?.role === 'admin' || hasDirectAccess(notification, user);
    case 'request_completed':
      return user?.role === 'admin' || user?.role === 'organization_staff' || hasDirectAccess(notification, user);
    default:
      return true;
  }
};

const isNotificationVisibleToUser = (notification, user) => {
  if (notification.audience === 'all') {
    return true;
  }

  if (notification.audience === 'roles') {
    return hasRoleAccess(notification, user);
  }

  if (notification.audience === 'direct') {
    return hasDirectAccess(notification, user);
  }

  if (notification.audience === 'mixed') {
    return hasRoleAccess(notification, user) || hasDirectAccess(notification, user);
  }

  if (notification.roleAudience || notification.recipientUserIds || notification.recipientEmails) {
    return hasRoleAccess(notification, user) || hasDirectAccess(notification, user);
  }

  return isVisibleByDefaultRule(notification, user);
};

const isNotificationReadForUser = (notification, user) => {
  const viewerKeys = getViewerKeys(user);
  if (viewerKeys.length && Array.isArray(notification.readBy)) {
    return viewerKeys.some((key) => notification.readBy.includes(key));
  }

  return Boolean(notification.read);
};

const readNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeNotifications = (notifications) => {
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
};

const sortNewestFirst = (items) => {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const getTrackingId = (request) => request?.trackingCode || request?.trackingId || request?.requestId || request?.id || 'Unavailable';

const normalizeNotification = (notification) => ({
  id: notification.id || `NOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  title: notification.title || 'Notification',
  body: notification.body || '',
  type: notification.type || 'general',
  requestId: notification.requestId || null,
  trackingCode: notification.trackingCode || null,
  actionPath: notification.actionPath || null,
  read: Boolean(notification.read),
  readBy: Array.isArray(notification.readBy) ? notification.readBy : [],
  audience: notification.audience || 'all',
  roleAudience: Array.isArray(notification.roleAudience) ? notification.roleAudience : [],
  recipientUserIds: Array.isArray(notification.recipientUserIds) ? notification.recipientUserIds : [],
  recipientEmails: Array.isArray(notification.recipientEmails) ? notification.recipientEmails.map(normalizeEmail) : [],
  createdAt: notification.createdAt || new Date().toISOString(),
});

const replaceLocalNotification = (temporaryId, savedNotification) => {
  const current = readNotifications().filter((item) => item.id !== temporaryId);
  writeNotifications(sortNewestFirst([normalizeNotification(savedNotification), ...current]));
};

const persistNotificationToServer = async (notification) => {
  return apiFetch('/notifications', {
    method: 'POST',
    body: JSON.stringify({
      title: notification.title,
      body: notification.body,
      type: notification.type,
      requestId: notification.requestId,
      trackingCode: notification.trackingCode,
      actionPath: notification.actionPath,
      audience: notification.audience,
      roleAudience: notification.roleAudience,
      recipientUserIds: notification.recipientUserIds,
      recipientEmails: notification.recipientEmails,
    }),
  });
};

export const refreshNotificationsFromServer = async (user) => {
  try {
    const data = await apiFetch('/notifications/me');
    const serverItems = Array.isArray(data) ? data.map(normalizeNotification) : [];
    writeNotifications(serverItems);
    return getNotifications(user);
  } catch (error) {
    console.warn('Notification sync failed:', error);
    return getNotifications(user);
  }
};

export const getNotifications = (user) => {
  return sortNewestFirst(readNotifications())
    .filter((item) => isNotificationVisibleToUser(item, user))
    .map((item) => ({
      ...item,
      read: isNotificationReadForUser(item, user),
    }));
};

export const getUnreadNotificationCount = (user) => {
  return getNotifications(user).filter((item) => !item.read).length;
};

export const addNotification = (notification) => {
  const existing = readNotifications();
  const newNotification = normalizeNotification({
    id: notification.id || `NOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    title: notification.title || 'Notification',
    body: notification.body || '',
    type: notification.type || 'general',
    requestId: notification.requestId || null,
    trackingCode: notification.trackingCode || null,
    actionPath: notification.actionPath || null,
    read: false,
    readBy: Array.isArray(notification.readBy) ? notification.readBy : [],
    audience: notification.audience || 'all',
    roleAudience: Array.isArray(notification.roleAudience) ? notification.roleAudience : [],
    recipientUserIds: Array.isArray(notification.recipientUserIds) ? notification.recipientUserIds : [],
    recipientEmails: Array.isArray(notification.recipientEmails) ? notification.recipientEmails.map(normalizeEmail) : [],
    createdAt: notification.createdAt || new Date().toISOString(),
  });

  existing.unshift(newNotification);
  writeNotifications(existing);
  // Save notifications in MongoDB so a different logged-in user can see them after refresh or login.
  persistNotificationToServer(newNotification)
    .then((savedNotification) => replaceLocalNotification(newNotification.id, savedNotification))
    .catch((error) => console.warn('Notification persistence failed:', error));
  return newNotification;
};

export const markNotificationRead = (notificationId, user) => {
  const viewerKeys = getViewerKeys(user);
  if (!viewerKeys.length) {
    return;
  }

  const existing = readNotifications();
  const next = existing.map((item) => {
    if (item.id !== notificationId) {
      return item;
    }

    const readBy = Array.isArray(item.readBy) ? item.readBy : [];
    return {
      ...item,
      read: true,
      readBy: Array.from(new Set([...readBy, ...viewerKeys])),
    };
  });

  writeNotifications(next);
  return apiFetch(`/notifications/${notificationId}/read`, { method: 'PATCH' })
    .then(() => refreshNotificationsFromServer(user))
    .catch((error) => console.warn('Mark notification read failed:', error));
};

export const markAllNotificationsRead = (user) => {
  const viewerKeys = getViewerKeys(user);
  if (!viewerKeys.length) {
    return;
  }

  const existing = readNotifications();
  const next = existing.map((item) => {
    if (!isNotificationVisibleToUser(item, user)) {
      return item;
    }

    const readBy = Array.isArray(item.readBy) ? item.readBy : [];
    return {
      ...item,
      read: true,
      readBy: Array.from(new Set([...readBy, ...viewerKeys])),
    };
  });

  writeNotifications(next);
  return apiFetch('/notifications/read-all', { method: 'PATCH' })
    .then(() => refreshNotificationsFromServer(user))
    .catch((error) => console.warn('Mark all notifications read failed:', error));
};

export const createRequestSubmittedNotification = (request) => {
  const trackingId = getTrackingId(request);

  return addNotification({
    type: 'request_submitted',
    requestId: request.id,
    trackingCode: trackingId,
    actionPath: `/requests/${request.id}`,
    title: 'New Emergency Request Submitted',
    body: `Tracking ID ${trackingId} was submitted for ${request.location?.address || 'an unknown location'}.`,
    audience: 'roles',
    roleAudience: ['admin'],
  });
};

export const createRequestAssignedNotification = (request, assignee) => {
  const trackingId = getTrackingId(request);

  return addNotification({
    type: 'request_assigned',
    requestId: request.id,
    trackingCode: trackingId,
    actionPath: `/requests/${request.id}`,
    title: 'Request Assigned',
    body: `Tracking ID ${trackingId} was assigned to ${assignee?.fullName || 'a responder'}.`,
    audience: 'mixed',
    roleAudience: ['admin'],
    recipientUserIds: assignee?.id ? [assignee.id] : [],
    recipientEmails: assignee?.email ? [assignee.email] : [],
  });
};

export const createRequestCompletedNotification = (request, completedBy) => {
  const trackingId = getTrackingId(request);

  return addNotification({
    type: 'request_completed',
    requestId: request.id,
    trackingCode: trackingId,
    actionPath: `/requests/${request.id}`,
    title: 'Request Completed',
    body: `Tracking ID ${trackingId} was marked completed by ${completedBy}.`,
    audience: 'mixed',
    roleAudience: ['admin', 'organization_staff'],
    recipientUserIds: request?.assignedTo ? [request.assignedTo] : [],
    recipientEmails: request?.assigneeEmail ? [request.assigneeEmail] : [],
  });
};

export const notificationEvents = {
  updated: NOTIFICATIONS_UPDATED_EVENT,
};
