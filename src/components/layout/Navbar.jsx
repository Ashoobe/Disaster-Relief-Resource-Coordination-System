import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRoleLabel } from '../../lib/permissions';
import ThemeToggle from '../common/ThemeToggle';
import { getUnreadNotificationCount, notificationEvents } from '../../services/notificationService';
import './Navbar.css';

export const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const userInitial = user?.fullName?.trim()?.charAt(0)?.toUpperCase() || 'U';

  useEffect(() => {
    const syncCount = () => {
      setUnreadNotifications(getUnreadNotificationCount(user));
    };

    syncCount();
    window.addEventListener('storage', syncCount);
    window.addEventListener(notificationEvents.updated, syncCount);

    return () => {
      window.removeEventListener('storage', syncCount);
      window.removeEventListener(notificationEvents.updated, syncCount);
    };
  }, [user]);

  useEffect(() => {
    if (!showUserMenu) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button
          type="button"
          className="navbar-toggle"
          onClick={() => onMenuToggle?.()}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/" className="navbar-brand" aria-label="Go to home page">
          <h1>DRRCS</h1>
        </Link>

        <div className="navbar-actions">
          <div className="navbar-action">
            <button type="button" className="main-site-link" onClick={() => navigate('/')}>
              Main Site
            </button>
          </div>

          <div className="navbar-action">
            <ThemeToggle />
          </div>

          <div className="navbar-action">
            <button
              type="button"
              className="notification-bell"
              aria-label="View notifications"
              onClick={() => navigate('/notifications')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>
          </div>

          <div className="navbar-action user-menu" ref={userMenuRef}>
            <button
              type="button"
              className="user-menu-toggle"
              onClick={() => setShowUserMenu((current) => !current)}
              aria-label="Toggle user menu"
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
            >
              <div className="user-avatar" aria-hidden="true">{userInitial}</div>
              <span className="user-name">{user?.fullName || 'User'}</span>
            </button>

            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="menu-header">
                  <div className="user-info">
                    <div className="user-avatar-large" aria-hidden="true">{userInitial}</div>
                    <div>
                      <div className="user-name-full">{user?.fullName}</div>
                      <div className="user-email">{user?.email}</div>
                      <div className="user-role">{getRoleLabel(user?.role)}</div>
                    </div>
                  </div>
                </div>

                <div className="menu-divider"></div>

                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/profile');
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile Settings
                </button>

                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate(
                      user?.role === 'admin'
                        ? '/admin/settings'
                        : user?.role === 'organization_staff'
                          ? '/org/settings'
                          : '/volunteer/help'
                    );
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                  More Options
                </button>

                <div className="menu-divider"></div>

                <button type="button" className="menu-item menu-item-danger" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
