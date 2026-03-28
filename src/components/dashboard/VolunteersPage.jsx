import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import './VolunteersPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const statusVariant = { active: 'success', inactive: 'default' };

const VolunteersPage = () => {
  const { token } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/v1/users/allusers?size=200`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to load volunteers (${res.status})`);
        const json = await res.json();
        const allUsers = (json?.data?.content ?? json?.data ?? []);
        // Keep only volunteer-role users
        const vols = allUsers.filter(u => {
          const roles = Array.isArray(u.role) ? u.role : [u.role];
          return roles.some(r => String(r).replace('ROLE_', '').toUpperCase() === 'VOLUNTEER');
        }).map(u => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          status: u.enabled ? 'active' : 'inactive',
        }));
        setVolunteers(vols);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchVolunteers();
  }, [token]);

  const filtered = volunteers.filter(v => {
    const q = search.toLowerCase();
    const matchesSearch = !q || v.fullName.toLowerCase().includes(q) || v.email.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActive = volunteers.filter(v => v.status === 'active').length;

  return (
    <div className="volunteers-page">
      <div className="volunteers-header">
        <div>
          <h1>Volunteers</h1>
          <p>Manage and monitor volunteer assignments</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Invite volunteer flow coming soon.')}>
          ➕ Invite Volunteer
        </button>
      </div>

      {/* Summary cards */}
      <div className="volunteers-stats">
        <Card elevation="elevated">
          <Card.Body>
            <div className="vol-stat">
              <div className="vol-stat-value">{volunteers.length}</div>
              <div className="vol-stat-label">Total Volunteers</div>
            </div>
          </Card.Body>
        </Card>
        <Card elevation="elevated">
          <Card.Body>
            <div className="vol-stat">
              <div className="vol-stat-value success">{totalActive}</div>
              <div className="vol-stat-label">Active</div>
            </div>
          </Card.Body>
        </Card>
        <Card elevation="elevated">
          <Card.Body>
            <div className="vol-stat">
              <div className="vol-stat-value">{volunteers.length - totalActive}</div>
              <div className="vol-stat-label">Inactive</div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Filters */}
      <Card elevation="flat">
        <Card.Body>
          <div className="vol-filters">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="filter-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setStatusFilter('all'); }}>Clear</button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card elevation="elevated">
        <Card.Body>
          {loading ? (
            <div className="vol-empty"><p>Loading volunteers…</p></div>
          ) : error ? (
            <div className="vol-empty"><p className="text-danger">{error}</p></div>
          ) : filtered.length === 0 ? (
            <div className="vol-empty">
              <div className="empty-icon">🙋</div>
              <h3>No volunteers found</h3>
              <p>{volunteers.length === 0 ? 'No users with the Volunteer role exist yet.' : 'Try adjusting your filters.'}</p>
            </div>
          ) : (
            <div className="vol-table-wrapper">
              <table className="vol-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(vol => (
                    <tr key={vol.id}>
                      <td>
                        <div className="vol-info">
                          <div className="vol-avatar">{vol.fullName.charAt(0)}</div>
                          <div>
                            <div className="vol-name">{vol.fullName}</div>
                            <div className="vol-email">{vol.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant={statusVariant[vol.status] || 'default'}>
                          {vol.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="vol-actions">
                          <button className="btn-icon-action" title="View profile" onClick={() => alert(`Profile for ${vol.fullName}`)}>👁️</button>
                          <button className="btn-icon-action" title="Assign task" onClick={() => alert(`Assign task to ${vol.fullName}`)}>📋</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="vol-footer">
            <p className="vol-count">Showing {filtered.length} of {volunteers.length} volunteers</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VolunteersPage;
