import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notificationEvents,
  refreshNotificationsFromServer,
} from '../services/notificationService';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const syncNotifications = async () => {
      const notifications = await refreshNotificationsFromServer(user);
      if (!cancelled) {
        setItems(notifications);
      }
    };
    const syncLocalNotifications = () => {
      setItems(getNotifications(user));
    };

    syncNotifications();
    const intervalId = window.setInterval(syncNotifications, 30000);
    window.addEventListener('storage', syncLocalNotifications);
    window.addEventListener(notificationEvents.updated, syncLocalNotifications);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener('storage', syncLocalNotifications);
      window.removeEventListener(notificationEvents.updated, syncLocalNotifications);
    };
  }, [user]);

  const markAllRead = async () => {
    await markAllNotificationsRead(user);
    setItems(await refreshNotificationsFromServer(user));
  };

  const handleOpenNotification = async (notification) => {
    if (!notification.read) {
      await markNotificationRead(notification.id, user);
      setItems(await refreshNotificationsFromServer(user));
    }

    if (notification.actionPath) {
      navigate(notification.actionPath);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ marginBottom: 8 }}>Notifications</h1>
        <button onClick={markAllRead} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer' }}>Mark all as read</button>
      </div>
      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        {items.length === 0 && (
          <div style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-card)' }}>
            No notifications yet. New emergency requests will appear here.
          </div>
        )}
        {items.map(n => (
          <button
            key={n.id}
            type="button"
            onClick={() => handleOpenNotification(n)}
            style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-card)', opacity: n.read ? 0.7 : 1, textAlign: 'left', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{n.title}</strong>
              <span style={{ color: 'var(--color-muted-foreground)', fontSize: 12 }}>{new Date(n.createdAt).toLocaleString()}</span>
            </div>
            <div style={{ marginTop: 6 }}>{n.body}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
