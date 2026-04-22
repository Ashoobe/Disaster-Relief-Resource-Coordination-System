import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notificationEvents,
} from '../services/notificationService';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const syncNotifications = () => {
      setItems(getNotifications(user));
    };

    syncNotifications();
    window.addEventListener('storage', syncNotifications);
    window.addEventListener(notificationEvents.updated, syncNotifications);

    return () => {
      window.removeEventListener('storage', syncNotifications);
      window.removeEventListener(notificationEvents.updated, syncNotifications);
    };
  }, [user]);

  const markAllRead = () => {
    markAllNotificationsRead(user);
    setItems(getNotifications(user));
  };

  const handleOpenNotification = (notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id, user);
      setItems(getNotifications(user));
    }

    if (notification.actionPath) {
      navigate(notification.actionPath);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p className="notifications-subtitle">Recent updates tied to requests and account activity.</p>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={markAllRead}>Mark all as read</button>
      </div>
      <div className="notifications-list">
        {items.length === 0 && (
          <div className="notifications-empty">
            No notifications yet. New emergency requests will appear here.
          </div>
        )}
        {items.map(n => (
          <button
            key={n.id}
            type="button"
            onClick={() => handleOpenNotification(n)}
            className={`notification-item ${n.read ? 'notification-item-read' : ''}`.trim()}
          >
            <div className="notification-row">
              <strong>{n.title}</strong>
              <span className="notification-time">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
            <div className="notification-body">{n.body}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
