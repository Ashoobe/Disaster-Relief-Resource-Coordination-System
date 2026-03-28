/**
 * Request Submission Page Component
 * Page container for the request submission form
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Phone, Mail, Menu, X } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import RequestForm from '../components/requests/RequestForm';
import { Card } from '../components/common/Card';
import './HomePage.css';
import './RequestSubmissionPage.css';

const futureNavItems = ['About', 'Services', 'Contact'];

const RequestSubmissionPage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFormSuccess = (response) => {
    setSuccessMessage(response);

    // Optionally redirect when embedded flow provides a navigation handler
    setTimeout(() => {
      if (onNavigate) {
        onNavigate('dashboard');
      }
    }, 3000);
  };

  const handleFormCancel = () => {
    if (onNavigate) {
      onNavigate('dashboard');
      return;
    }

    navigate('/');
  };

  return (
    <div className="home-page">
      <header className="public-header">
        <div className="public-header-content">
          <Link to="/" className="public-brand">
            <span className="public-brand-icon" aria-hidden="true">
              <Shield size={18} />
            </span>
            <span>DRRCS</span>
          </Link>

          <nav className="public-nav" aria-label="Public navigation">
            <Link to="/" className="public-nav-link public-nav-link-active">Home</Link>
            <Link to="/track" className="public-nav-link">Track Request</Link>
            {futureNavItems.map((item) => (
              <button
                key={item}
                type="button"
                className="public-nav-link public-nav-link-disabled"
                aria-disabled="true"
                title="Coming soon"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="public-auth-links">
            <div className="public-theme-toggle" aria-label="Theme toggle">
              <ThemeToggle />
            </div>
            <Link to="/login" className="public-auth-link">Sign In</Link>
            <Link to="/register" className="public-auth-link">Sign Up</Link>
            <Link to="/dashboard" className="public-auth-link public-auth-link-primary">Dashboard</Link>
          </div>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Toggle mobile navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="submit-request-mobile-nav"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div id="submit-request-mobile-nav" className="public-mobile-menu">
            <nav className="public-mobile-nav" aria-label="Mobile navigation">
              <Link to="/" className="public-nav-link public-nav-link-active" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/track" className="public-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Track Request
              </Link>
              {futureNavItems.map((item) => (
                <button
                  key={`mobile-${item}`}
                  type="button"
                  className="public-nav-link public-nav-link-disabled"
                  aria-disabled="true"
                  title="Coming soon"
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="public-mobile-auth">
              <div className="public-mobile-theme">
                <span>Theme</span>
                <ThemeToggle />
              </div>
              <Link to="/login" className="public-auth-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="public-auth-link" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              <Link to="/dashboard" className="public-auth-link public-auth-link-primary" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {successMessage ? (
          <div className="request-submission-page success">
            <div className="success-container">
              <div className="success-icon">✓</div>
              <h2>Request Submitted Successfully!</h2>
              <p>Thank you for submitting your emergency request.</p>
              <div className="request-id">
                <strong>Request ID:</strong>
                <span>{successMessage.requestId}</span>
              </div>
              {successMessage.trackingCode && successMessage.trackingCode !== successMessage.requestId && (
                <div className="request-id">
                  <strong>Tracking Code:</strong>
                  <span>{successMessage.trackingCode}</span>
                </div>
              )}
              <p className="redirect-message">
                Our response team has received your submission and will review and handle it as soon as possible.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                <Link
                  to={`/track?requestId=${encodeURIComponent(successMessage.trackingCode || successMessage.requestId)}`}
                  className="hero-btn hero-btn-secondary"
                >
                  Track This Request
                </Link>
              </div>
              {onNavigate && (
                <p className="redirect-message">Taking you back to the dashboard shortly...</p>
              )}
              <button
                type="button"
                className="success-close-btn"
                onClick={() => setSuccessMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="request-submission-page">
            <div className="page-header">
              <h1>Submit Emergency Request</h1>
              <p>Please provide detailed information about your organization's relief needs.</p>
            </div>

            <div className="page-content">
              <div className="form-container">
                <RequestForm
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </div>

              {/* Help/Information Panel */}
              <aside className="help-panel">
                <Card>
                  <Card.Header>
                    <h3>📋 Tips for Submission</h3>
                  </Card.Header>
                  <Card.Body>
                    <ul>
                      <li><strong>Be Specific:</strong> Provide detailed descriptions to help responders understand your needs</li>
                      <li><strong>Include Details:</strong> Specify quantities and special requirements for resources</li>
                      <li><strong>Contact Information:</strong> Ensure contact details are accurate and monitored</li>
                      <li><strong>Verify Data:</strong> Double-check all information before submitting</li>
                      <li><strong>Save Drafts:</strong> Use the Save Draft button to preserve your progress</li>
                      <li><strong>Disaster Type:</strong> Select the type of disaster accurately for proper categorization</li>
                    </ul>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h3>❓ Need Help?</h3>
                  </Card.Header>
                  <Card.Body>
                    <p>If you have questions about the submission process:</p>
                    <ul>
                      <li>📞 Call our support team: 1-800-HELP-NOW</li>
                      <li>📧 Email: support@drrcs.org</li>
                      <li>💬 Live chat available 24/7</li>
                    </ul>
                  </Card.Body>
                </Card>
              </aside>
            </div>
          </div>
        )}
      </main>

      <footer className="public-footer">
        <div className="public-footer-content">
          <div className="public-footer-grid">
            <section className="public-footer-about">
              <Link to="/" className="public-footer-brand" aria-label="Go to home page">
                <span className="public-brand-icon public-footer-brand-icon" aria-hidden="true">
                  <Shield size={18} />
                </span>
                <div>
                  <h3>DRRCS</h3>
                  <p>Relief &amp; Response</p>
                </div>
              </Link>
              <p>
                Dedicated to rapid and effective disaster response support for communities in need.
              </p>
            </section>

            <section>
              <h4>Quick Links</h4>
              <ul className="public-footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/track">Track Request</Link></li>
                <li><button type="button" className="public-footer-link-disabled" aria-disabled="true" title="Coming soon">About</button></li>
                <li><button type="button" className="public-footer-link-disabled" aria-disabled="true" title="Coming soon">Services</button></li>
                <li><button type="button" className="public-footer-link-disabled" aria-disabled="true" title="Coming soon">Contact</button></li>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </section>

            <section>
              <h4>Contact</h4>
              <ul className="public-footer-contact">
                <li>
                  <Phone size={14} />
                  <span>1-800-DISASTER</span>
                </li>
                <li>
                  <Mail size={14} />
                  <span>help@drrcs.org</span>
                </li>
              </ul>
            </section>
          </div>

          <div className="public-footer-bottom">
            <p>&copy; 2026 DRRCS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RequestSubmissionPage;
