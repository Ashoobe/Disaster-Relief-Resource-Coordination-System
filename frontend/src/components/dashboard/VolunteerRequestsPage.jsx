import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { api } from '../../lib/api';
import './VolunteerRequestsPage.css';

const priorityVariant = { critical: 'danger', high: 'warning', medium: 'info', low: 'success' };

const VolunteerRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadRequests = () => {
    setLoading(true);
    api.getRequests().then(data => {
      setRequests(data.filter(r => r.status === 'pending' || r.status === 'assigned'));
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.priority === filter);

  if (loading) {
    return (
      <div className="vol-requests-page">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="vol-requests-page">
      <div className="vol-req-header">
        <h1>Available Requests</h1>
        <p>Browse open emergency requests that are waiting for admin assignment</p>
      </div>

      {/* Priority filter */}
      <div className="vol-req-filters">
        {['all', 'critical', 'high', 'medium', 'low'].map(p => (
          <button
            key={p}
            className={`summary-chip ${filter === p ? 'active' : ''}`}
            onClick={() => setFilter(p)}
          >
            {p === 'all' ? `All (${requests.length})` : `${p.charAt(0).toUpperCase() + p.slice(1)} (${requests.filter(r => r.priority === p).length})`}
          </button>
        ))}
      </div>

      {/* Requests */}
      <div className="vol-req-list">
        {filtered.length === 0 && (
          <Card elevation="default">
            <Card.Body>
              <div className="vol-req-empty">
                <div className="empty-icon">🎉</div>
                <h3>No requests available</h3>
                <p>All requests have been assigned. Check back soon.</p>
              </div>
            </Card.Body>
          </Card>
        )}
        {filtered.map(req => (
          <Card key={req.id} elevation="default">
            <Card.Body>
              <div className="vol-req-card">
                <div className="vol-req-top">
                  <span className="vol-req-id">{req.id}</span>
                  <div className="vol-req-badges">
                    <Badge variant={priorityVariant[req.priority] || 'default'}>{req.priority}</Badge>
                    <Badge variant="default">{req.status}</Badge>
                  </div>
                </div>
                <div className="vol-req-type">
                  <span className="vol-req-disaster">{req.disasterType}</span>
                  <span className="vol-req-sep">•</span>
                  <span>{req.category}</span>
                </div>
                <p className="vol-req-desc">{req.description}</p>
                <p className="vol-req-location">📍 {req.location?.address}</p>
                <div className="vol-req-footer">
                  <span className="vol-req-contact">Contact: {req.contactName}</span>
                  <span className="vol-req-contact">Assignment is managed by admins.</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VolunteerRequestsPage;
