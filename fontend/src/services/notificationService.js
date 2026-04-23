const NOTIFICATIONS_STORAGE_KEY = 'drrcs_notifications';
const NOTIFICATIONS_UPDATED_EVENT = 'drrcs:notifications-updated';

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
  const newNotification = {
    id: notification.id || `NOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    title: notification.title || 'Notification',
    body: notification.body || '',
    type: notification.type || 'general',
    requestId: notification.requestId || null,
    actionPath: notification.actionPath || null,
    read: false,
    readBy: Array.isArray(notification.readBy) ? notification.readBy : [],
    audience: notification.audience || 'all',
    roleAudience: Array.isArray(notification.roleAudience) ? notification.roleAudience : [],
    recipientUserIds: Array.isArray(notification.recipientUserIds) ? notification.recipientUserIds : [],
    recipientEmails: Array.isArray(notification.recipientEmails) ? notification.recipientEmails.map(normalizeEmail) : [],
    createdAt: notification.createdAt || new Date().toISOString(),
  };

  existing.unshift(newNotification);
  writeNotifications(existing);
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
};

export const createRequestSubmittedNotification = (request) => {
  return addNotification({
    type: 'request_submitted',
    requestId: request.id,
    actionPath: `/requests/${request.id}`,
    title: 'New Emergency Request Submitted',
    body: `${request.id} was submitted for ${request.location?.address || 'an unknown location'}.`,
    audience: 'roles',
    roleAudience: ['admin'],
  });
};

export const createRequestAssignedNotification = (request, assignee) => {
  return addNotification({
    type: 'request_assigned',
    requestId: request.id,
    actionPath: `/requests/${request.id}`,
    title: 'Request Assigned',
    body: `${request.id} was assigned to ${assignee?.fullName || 'a responder'}.`,
    audience: 'mixed',
    roleAudience: ['admin'],
    recipientUserIds: assignee?.id ? [assignee.id] : [],
    recipientEmails: assignee?.email ? [assignee.email] : [],
  });
};

export const createRequestCompletedNotification = (request, completedBy) => {
  return addNotification({
    type: 'request_completed',
    requestId: request.id,
    actionPath: `/requests/${request.id}`,
    title: 'Request Completed',
    body: `${request.id} was marked completed by ${completedBy}.`,
    audience: 'mixed',
    roleAudience: ['admin', 'organization_staff'],
    recipientUserIds: request?.assignedTo ? [request.assignedTo] : [],
    recipientEmails: request?.assigneeEmail ? [request.assigneeEmail] : [],
  });
};

export const notificationEvents = {
  updated: NOTIFICATIONS_UPDATED_EVENT,
};
