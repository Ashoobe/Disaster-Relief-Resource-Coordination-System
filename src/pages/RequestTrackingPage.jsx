/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shield, Search, CheckCircle, Clock, AlertCircle, Loader, Menu, X } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import { trackRequest } from '../services/requestService';
import './RequestTrackingPage.css';

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'status-pending', icon: Clock },
  assigned: { label: 'Assigned', color: 'status-assigned', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'status-inprogress', icon: Loader },
  'in-review': { label: 'Under Review', color: 'status-assigned', icon: AlertCircle },
  completed: { label: 'Completed', color: 'status-completed', icon: CheckCircle },
  approved: { label: 'Approved', color: 'status-completed', icon: CheckCircle },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'priority-critical' },
  high: { label: 'High', color: 'priority-high' },
  medium: { label: 'Medium', color: 'priority-medium' },
  low: { label: 'Low', color: 'priority-low' },
};

const TIMELINE_STEPS = [
  { key: 'submitted', label: 'Submitted', statuses: ['pending', 'assigned', 'in-review', 'in-progress', 'completed', 'approved'] },
  { key: 'assigned', label: 'Assigned to Team', statuses: ['assigned', 'in-review', 'in-progress', 'completed', 'approved'] },
  { key: 'inprogress', label: 'In Progress', statuses: ['in-review', 'in-progress', 'completed', 'approved'] },
  { key: 'completed', label: 'Completed', statuses: ['completed', 'approved'] },
];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'status-pending', icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`tracking-badge ${cfg.color}`}>
      <Icon size={14} />
      {cfg.label}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || { label: priority, color: 'priority-medium' };
  return <span className={`tracking-badge ${cfg.color}`}>{cfg.label}</span>;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

const RequestTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const runTrackingSearch = async (value) => {
    setError(null);
    setResult(null);

    const normalizedValue = value.trim();
    if (!normalizedValue) {
      setError('Please enter a tracking ID, email address, or phone number.');
      return;
    }

    setLoading(true);
    try {
      const response = await trackRequest(normalizedValue);
      if (response.success) {
        setResult(response.request);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get('requestId') || searchParams.get('query') || '';
    if (!initialQuery) {
      return;
    }

    setQuery(initialQuery);
    runTrackingSearch(initialQuery);
  }, [searchParams]);

  const handleTrack = async (e) => {
    e.preventDefault();
    await runTrackingSearch(query);
  };

  const currentStatus = result?.status || 'pending';

  return (
    <div className="tracking-page">
      {/* Header */}
      <header className="public-header">
        <div className="public-header-content">
          <Link to="/" className="public-brand">
            <span className="public-brand-icon" aria-hidden="true"><Shield size={18} /></span>
            <span>DRRCS</span>
          </Link>

          <nav className="public-nav" aria-label="Public navigation">
            <Link to="/" className="public-nav-link">Home</Link>
            <Link to="/live-activity" className="public-nav-link">Live Activity</Link>
            <Link to="/track" className="public-nav-link public-nav-link-active">Track Request</Link>
          </nav>

          <div className="public-auth-links">
            <div className="public-theme-toggle"><ThemeToggle /></div>
            <Link to="/login" className="public-auth-link">Sign In</Link>
            <Link to="/register" className="public-auth-link">Sign Up</Link>
            <Link to="/submit-emergency-request" className="public-auth-link public-auth-link-primary">
              Submit Request
            </Link>
          </div>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Toggle mobile navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((p) => !p)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="public-mobile-menu">
            <nav className="public-mobile-nav" aria-label="Mobile navigation">
              <Link to="/" className="public-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/live-activity" className="public-nav-link" onClick={() => setMobileMenuOpen(false)}>Live Activity</Link>
              <Link to="/track" className="public-nav-link public-nav-link-active" onClick={() => setMobileMenuOpen(false)}>Track Request</Link>
            </nav>
            <div className="public-mobile-auth">
              <div className="public-mobile-theme"><span>Theme</span><ThemeToggle /></div>
              <Link to="/login" className="public-auth-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="public-auth-link" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          </div>
        )}
      </header>

      <main className="tracking-main">
        {/* Hero search section */}
        <section className="tracking-hero">
          <div className="tracking-hero-content">
            <div className="tracking-hero-icon">
              <Search size={32} />
            </div>
            <h1>Track Your Request</h1>
            <p>
              Enter the Tracking ID from your confirmation, or use the email address or
              phone number you provided when submitting.
            </p>

            <form className="tracking-form" onSubmit={handleTrack} noValidate>
              <div className="tracking-input-row">
                <input
                  type="text"
                  className="tracking-input"
                  placeholder="e.g. MARIA-2026-E564217D, email@example.com, or (555) 123-4567"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setError(null); }}
                  aria-label="Enter tracking ID, email, or phone"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="tracking-submit-btn"
                  disabled={loading || !query.trim()}
                >
                  {loading ? 'Searching…' : 'Track Now'}
                </button>
              </div>
              {error && (
                <p className="tracking-error" role="alert">
                  <AlertCircle size={15} /> {error}
                </p>
              )}
            </form>

            <div className="tracking-hints">
              <p>You can look up by:</p>
              <ul>
                <li><strong>Tracking ID</strong> — shown on your confirmation screen (for example <code>MARIA-2026-E564217D</code>)</li>
                <li><strong>Email address</strong> — used in the contact section of your request</li>
                <li><strong>Phone number</strong> — primary phone number entered at submission</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Results section */}
        {result && (
          <section className="tracking-results" aria-live="polite">
            <div className="tracking-results-inner">
              <div className="tracking-result-header">
                <div>
                  <h2>Request Found</h2>
                  <p className="tracking-request-id">{result.id}</p>
                </div>
                <StatusBadge status={result.status} />
              </div>

              {/* Status timeline */}
              <div className="tracking-timeline">
                {TIMELINE_STEPS.map((step, idx) => {
                  const active = step.statuses.includes(currentStatus);
                  return (
                    <div key={step.key} className={`timeline-step ${active ? 'timeline-step-active' : 'timeline-step-inactive'}`}>
                      <div className="timeline-dot">
                        {active ? <CheckCircle size={16} /> : <span className="timeline-dot-empty" />}
                      </div>
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <div className={`timeline-connector ${active ? 'connector-active' : 'connector-inactive'}`} />
                      )}
                      <span className="timeline-label">{step.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Request details */}
              <div className="tracking-details-grid">
                <div className="tracking-detail-card">
                  <h3>Request Details</h3>
                  <div className="tracking-detail-rows">
                    <div className="tracking-detail-row">
                      <span className="detail-label">Status</span>
                      <StatusBadge status={result.status} />
                    </div>
                    <div className="tracking-detail-row">
                      <span className="detail-label">Priority</span>
                      <PriorityBadge priority={result.priority} />
                    </div>
                    <div className="tracking-detail-row">
                      <span className="detail-label">Disaster Type</span>
                      <span className="detail-value" style={{ textTransform: 'capitalize' }}>{result.disasterType}</span>
                    </div>
                    <div className="tracking-detail-row">
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{result.location}</span>
                    </div>
                    {result.assignedTo && (
                      <div className="tracking-detail-row">
                        <span className="detail-label">Assigned To</span>
                        <span className="detail-value">{result.assignedTo}</span>
                      </div>
                    )}
                    {result.notes && (
                      <div className="tracking-detail-row">
                        <span className="detail-label">Summary</span>
                        <span className="detail-value">{result.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="tracking-detail-card">
                  <h3>Timeline</h3>
                  <div className="tracking-detail-rows">
                    <div className="tracking-detail-row">
                      <span className="detail-label">Submitted</span>
                      <span className="detail-value">{formatDate(result.submittedAt)}</span>
                    </div>
                    {result.updatedAt && (
                      <div className="tracking-detail-row">
                        <span className="detail-label">Last Updated</span>
                        <span className="detail-value">{formatDate(result.updatedAt)}</span>
                      </div>
                    )}
                    <div className="tracking-detail-row">
                      <span className="detail-label">Contact Name</span>
                      <span className="detail-value">{result.contactName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tracking-notice">
                <AlertCircle size={15} />
                <p>
                  If you need immediate assistance, call <strong>1-800-HELP-NOW</strong> or
                  email <strong>support@drrcs.org</strong>.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="public-footer">
        <p>© 2026 Disaster Relief Resource Coordination System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RequestTrackingPage;
