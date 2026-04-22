import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import './OrgRequestsPage.css';

const statusVariant = { pending: 'warning', assigned: 'info', 'in-progress': 'warning', completed: 'success', cancelled: 'default' };
const priorityVariant = { critical: 'danger', high: 'warning', medium: 'info', low: 'success' };

const OrgRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let active = true;

    api.getRequests()
      .then((data) => {
        if (!active) {
          return;
        }

        const mine = data.filter((request) => request.createdByUserId === user?.id);
        setRequests(mine);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  const filtered = useMemo(() => {
    return statusFilter === 'all'
      ? requests
      : requests.filter((request) => request.status === statusFilter);
  }, [requests, statusFilter]);

  if (loading) {
    return <div className="org-req-page"><p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p></div>;
  }

  return (
    <div className="org-req-page">
      <div className="org-req-header">
        <div>
          <h1>My Requests</h1>
          <p>Track the emergency requests you submitted from your account</p>
        </div>
        <Link to="/submit-emergency-request" className="btn btn-primary">+ Submit Emergency Request</Link>
      </div>

      <div className="org-req-filters">
        {['all', 'pending', 'assigned', 'in-progress', 'completed'].map((status) => (
          <button
            key={status}
            className={`summary-chip ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status === 'all'
              ? `All (${requests.length})`
              : `${status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} (${requests.filter((request) => request.status === status).length})`}
          </button>
        ))}
      </div>

      <div className="org-req-list">
        {filtered.length === 0 && (
          <Card elevation="default">
            <Card.Body>
              <div className="org-req-empty">
                <div>Requests</div>
                <h3>No requests found</h3>
                <p>Submit a request while signed in to see it appear here.</p>
              </div>
            </Card.Body>
          </Card>
        )}

        {filtered.map((request) => (
          <Card key={request.id} elevation="default">
            <Card.Body>
              <div className="org-req-card">
                <div className="org-req-top">
                  <span className="org-req-id">{request.trackingCode || request.id}</span>
                  <div className="org-req-badges">
                    <Badge variant={priorityVariant[request.priority] || 'default'}>{request.priority}</Badge>
                    <Badge variant={statusVariant[request.status] || 'default'}>{request.status}</Badge>
                  </div>
                </div>

                <div className="org-req-meta">
                  <span className="org-req-type">{request.disasterType}</span>
                  <span> | </span>
                  <span>{request.category}</span>
                </div>

                <p className="org-req-desc">{request.description}</p>
                <p className="org-req-location">Location: {request.location?.address}</p>

                {request.assigneeName && (
                  <p className="org-req-assigned">Assigned to: {request.assigneeName}</p>
                )}

                <div className="org-req-footer">
                  <span className="org-req-date">
                    Submitted: {new Date(request.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <Link className="btn btn-secondary btn-sm" to={`/requests/${request.id}`}>
                    View Details
                  </Link>
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
