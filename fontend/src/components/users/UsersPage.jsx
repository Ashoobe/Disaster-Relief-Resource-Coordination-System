import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Loading from '../common/Loading';
import {
  getAllUsers,
  createUser,
  deleteUser,
  changeUserRole,
  toggleUserStatus,
} from '../../services/userService';
import './UsersPage.css';

const UsersPage = () => {
  const { user: currentUser, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'volunteer',
    password: '',
    confirmPassword: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [pendingRole, setPendingRole] = useState('');

  // Load users on mount, when filters change, or when token becomes available
  useEffect(() => {
    if (token) loadUsers();
  }, [filters, token]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllUsers(token, filters);
      if (response.success) {
        setUsers(response.users);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setActionLoading(true);
    setError(null);

    try {
      const response = await createUser(formData, token);
      if (response.success) {
        setShowAddModal(false);
        setFormData({ fullName: '', email: '', role: 'volunteer', password: '', confirmPassword: '' });
        await loadUsers();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to create user');
      console.error('Create user error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const response = await deleteUser(userId, token);
      if (response.success) {
        await loadUsers();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to delete user');
      console.error('Delete user error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = (userId, currentRole) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    setRoleModalUser(target);
    setPendingRole(currentRole);
  };

  const handleConfirmRoleChange = async () => {
    if (!roleModalUser) return;
    if (!pendingRole || pendingRole === roleModalUser.role) {
      setRoleModalUser(null);
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const response = await changeUserRole(roleModalUser.id, pendingRole, token);
      if (response.success) {
        setRoleModalUser(null);
        await loadUsers();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to change user role');
      console.error('Change role error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const response = await toggleUserStatus(userId, token);
      if (response.success) {
        await loadUsers();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to toggle user status');
      console.error('Toggle status error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      admin: 'danger',
      coordinator: 'warning',
      volunteer: 'success',
      organization_staff: 'info',
    };
    return variants[role] || 'default';
  };

  const getStatusBadgeVariant = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getRoleDisplayName = (role) => {
    const names = {
      admin: 'Admin',
      coordinator: 'Coordinator',
      volunteer: 'Volunteer',
      organization_staff: 'Organization Staff',
    };
    return names[role] || role;
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-page">
        <Loading message="Loading users..." />
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div className="users-title">
          <h1>User Management</h1>
          <p>Manage system users, roles, and permissions</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          disabled={actionLoading}
        >
          <span className="btn-icon">➕</span>
          Add User
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
          <button
            className="alert-close"
            onClick={() => setError(null)}
            aria-label="Close alert"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <Card elevation="flat">
        <Card.Body>
          <div className="users-filters">
            <div className="filter-group">
              <label htmlFor="search">Search</label>
              <input
                id="search"
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="role-filter">Role</label>
              <select
                id="role-filter"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="volunteer">Volunteer</option>
                <option value="organization_staff">Organization Staff</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="status-filter">Status</label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setFilters({ search: '', role: 'all', status: 'all' })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card elevation="elevated">
        <Card.Body>
          {users.length === 0 ? (
            <div className="users-empty">
              <div className="empty-icon">👥</div>
              <h3>No users found</h3>
              <p>Try adjusting your filters or add a new user</p>
            </div>
          ) : (
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{user.fullName}</div>
                            {user.id === currentUser?.id && (
                              <span className="user-badge">You</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleDisplayName(user.role)}
                        </Badge>
                      </td>
                      <td>
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="text-muted">{formatDate(user.lastLogin)}</td>
                      <td>
                        <div className="user-actions">
                          <button
                            className="btn-icon-action"
                            onClick={() => handleChangeRole(user.id, user.role)}
                            disabled={actionLoading || user.id === currentUser?.id}
                            title="Change role"
                            aria-label="Change role"
                          >
                            🔄
                          </button>
                          <button
                            className="btn-icon-action"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            disabled={actionLoading || user.id === currentUser?.id}
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                            aria-label={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                          >
                            {user.status === 'active' ? '🔒' : '🔓'}
                          </button>
                          <button
                            className="btn-icon-action btn-icon-danger"
                            onClick={() => handleDeleteUser(user.id, user.fullName)}
                            disabled={actionLoading || user.id === currentUser?.id}
                            title="Delete user"
                            aria-label="Delete user"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {users.length > 0 && (
            <div className="users-footer">
              <p className="users-count">
                Showing {users.length} {users.length === 1 ? 'user' : 'users'}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add User Modal */}
      {/* Change Role Modal */}
      {roleModalUser && (
        <div className="modal-overlay" onClick={() => setRoleModalUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Role</h2>
              <button
                className="modal-close"
                onClick={() => setRoleModalUser(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '1rem' }}>
                Changing role for <strong>{roleModalUser.fullName}</strong>
              </p>
              <div className="form-group">
                <label htmlFor="new-role">New Role</label>
                <select
                  id="new-role"
                  className="form-select"
                  value={pendingRole}
                  onChange={(e) => setPendingRole(e.target.value)}
                >
                  <option value="volunteer">Volunteer</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="organization_staff">Organization Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setRoleModalUser(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmRoleChange}
                disabled={actionLoading || pendingRole === roleModalUser.role}
              >
                {actionLoading ? 'Saving...' : 'Save Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="form-input"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="form-input"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role *</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    className="form-select"
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="organization_staff">Organization Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="form-input"
                    placeholder="At least 6 characters"
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="form-input"
                    placeholder="Re-enter password"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
