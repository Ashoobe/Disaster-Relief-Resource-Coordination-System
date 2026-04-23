import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const MENU_ITEMS = {
  admin: [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'All Requests', icon: '📋', path: '/admin/requests' },
    { label: 'Volunteers', icon: '👥', path: '/admin/volunteers' },
    { label: 'Users', icon: '👤', path: '/users' },
    { label: 'Analytics', icon: '📈', path: '/admin/analytics' },
    { label: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ],
  volunteer: [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'My Tasks', icon: '✓', path: '/volunteer/tasks' },
    { label: 'Available Requests', icon: '📝', path: '/volunteer/requests' },
    { label: 'My Profile', icon: '👤', path: '/volunteer/profile' },
    { label: 'Help', icon: '❓', path: '/volunteer/help' },
  ],
  organization_staff: [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Submit Emergency Request', icon: '➕', path: '/submit-emergency-request' },
    { label: 'My Requests', icon: '📋', path: '/org/requests' },
    { label: 'Team Members', icon: '👥', path: '/org/team' },
    { label: 'Settings', icon: '⚙️', path: '/org/settings' },
  ],
};

export const Sidebar = ({ isOpen, onClose, currentPath = '/dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role || 'volunteer';
  const menuItems = MENU_ITEMS[userRole] || MENU_ITEMS.volunteer;

  const handleLogout = async () => {
    onClose?.();
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="logout-button" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
