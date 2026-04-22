import React, { useEffect, useState } from 'react';
import { ClipboardList, Eye } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { getVolunteers } from '../../services/userService';
import './VolunteersPage.css';

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
        const response = await getVolunteers(token, { size: 200 });
        if (!response.success) {
          throw new Error(response.message || 'Failed to load volunteers.');
        }
        setVolunteers(response.volunteers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchVolunteers();
    }
  }, [token]);

  const filtered = volunteers.filter((volunteer) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || volunteer.fullName.toLowerCase().includes(query) || volunteer.email.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActive = volunteers.filter((volunteer) => volunteer.status === 'active').length;

  return (
    <div className="volunteers-page">
      <div className="volunteers-header">
        <div>
          <h1>Volunteers</h1>
          <p>Manage and monitor volunteer assignments</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Invite volunteer flow coming soon.')}>
          + Invite Volunteer
        </button>
      </div>

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
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select className="filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="filter-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
                Clear
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card elevation="elevated">
        <Card.Body>
          {loading ? (
            <div className="vol-empty">
              <p>Loading volunteers...</p>
            </div>
          ) : error ? (
            <div className="vol-empty">
              <p className="text-danger">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="vol-empty">
              <div className="empty-icon">V</div>
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
                  {filtered.map((volunteer) => (
                    <tr key={volunteer.id}>
                      <td data-label="Volunteer">
                        <div className="vol-info">
                          <div className="vol-avatar">{volunteer.fullName.charAt(0)}</div>
                          <div>
                            <div className="vol-name">{volunteer.fullName}</div>
                            <div className="vol-email">{volunteer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Status">
                        <Badge variant={statusVariant[volunteer.status] || 'default'}>
                          {volunteer.status}
                        </Badge>
                      </td>
                      <td data-label="Actions">
                        <div className="vol-actions">
                          <button className="btn-icon-action" title="View profile" onClick={() => alert(`Profile for ${volunteer.fullName}`)}>
                            <Eye size={16} />
                          </button>
                          <button className="btn-icon-action" title="Assign task" onClick={() => alert(`Assign task to ${volunteer.fullName}`)}>
                            <ClipboardList size={16} />
                          </button>
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
