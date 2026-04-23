import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { api } from '../../lib/api';
import './OrgRequestsPage.css';

const statusVariant = { pending: 'warning', assigned: 'info', 'in-progress': 'warning', completed: 'success', cancelled: 'default' };
const priorityVariant = { critical: 'danger', high: 'warning', medium: 'info', low: 'success' };

const OrgRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api.getRequests().then(data => {
      setRequests(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter);

  if (loading) return <div className="org-req-page"><p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p></div>;

  return (
    <div className="org-req-page">
      <div className="org-req-header">
        <div>
          <h1>My Requests</h1>
          <p>Track all emergency requests submitted by your organization</p>
        </div>
        <a href="/submit-emergency-request" className="btn btn-primary">➕ Submit Emergency Request</a>
      </div>

      <div className="org-req-filters">
        {['all', 'pending', 'assigned', 'in-progress', 'completed'].map(s => (
          <button
            key={s}
            className={`summary-chip ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === 'all' ? `All (${requests.length})` : `${s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')} (${requests.filter(r => r.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="org-req-list">
        {filtered.length === 0 && (
          <Card elevation="default">
            <Card.Body>
              <div className="org-req-empty">
                <div>📋</div>
                <h3>No requests found</h3>
                <p>Submit a new request to get started.</p>
              </div>
            </Card.Body>
          </Card>
        )}
        {filtered.map(req => (
          <Card key={req.id} elevation="default">
            <Card.Body>
              <div className="org-req-card">
                <div className="org-req-top">
                  <span className="org-req-id">{req.trackingCode || req.id}</span>
                  <div className="org-req-badges">
                    <Badge variant={priorityVariant[req.priority] || 'default'}>{req.priority}</Badge>
                    <Badge variant={statusVariant[req.status] || 'default'}>{req.status}</Badge>
                  </div>
                </div>
                <div className="org-req-meta">
                  <span className="org-req-type">{req.disasterType}</span>
                  <span> • </span>
                  <span>{req.category}</span>
                </div>
                <p className="org-req-desc">{req.description}</p>
                <p className="org-req-location">📍 {req.location?.address}</p>
                {req.assignedTo && (
                  <p className="org-req-assigned">👤 Assigned to: {req.assignedTo}</p>
                )}
                <div className="org-req-footer">
                  <span className="org-req-date">
                    Submitted: {new Date(req.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert(`Viewing request ${req.trackingCode || req.id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrgRequestsPage;
