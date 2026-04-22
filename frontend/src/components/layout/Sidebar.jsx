import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CheckSquare,
  CircleHelp,
  ClipboardList,
  FilePlus2,
  FileSearch,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { normalizeRole } from '../../lib/permissions';
import './Sidebar.css';

const MENU_ITEMS = {
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'All Requests', icon: ClipboardList, path: '/admin/requests' },
    { label: 'Volunteers', icon: Users, path: '/admin/volunteers' },
    { label: 'Users', icon: UserCircle2, path: '/users' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ],
  volunteer: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Tasks', icon: CheckSquare, path: '/volunteer/tasks' },
    { label: 'Available Requests', icon: FileSearch, path: '/volunteer/requests' },
    { label: 'My Profile', icon: UserCircle2, path: '/volunteer/profile' },
    { label: 'Help', icon: CircleHelp, path: '/volunteer/help' },
  ],
  organization_staff: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Submit Emergency Request', icon: FilePlus2, path: '/submit-emergency-request' },
    { label: 'My Requests', icon: ClipboardList, path: '/org/requests' },
    { label: 'Team Members', icon: Users, path: '/org/team' },
    { label: 'Settings', icon: Settings, path: '/org/settings' },
  ],
};

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = normalizeRole(user?.role);
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
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon className="nav-icon" aria-hidden="true" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="logout-button" onClick={handleLogout}>
            <LogOut className="nav-icon" aria-hidden="true" />
            <span className="nav-label">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
