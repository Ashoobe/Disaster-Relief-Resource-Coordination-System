const NOTIFICATIONS_UPDATED_EVENT = 'drrcs:notifications-updated';

export const getNotifications = () => [];

export const getUnreadNotificationCount = () => 0;

export const addNotification = () => null;

export const markNotificationRead = () => {};

export const markAllNotificationsRead = () => {};

export const createRequestSubmittedNotification = () => null;

export const createRequestAssignedNotification = () => null;

export const createRequestCompletedNotification = () => null;

export const notificationEvents = {
  updated: NOTIFICATIONS_UPDATED_EVENT,
};
