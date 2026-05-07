/**
 * Request Submission Page Component
 * Page container for the request submission form
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RequestForm from '../components/requests/RequestForm';
import { Card } from '../components/common/Card';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './HomePage.css';
import './RequestSubmissionPage.css';

const RequestSubmissionPage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFormSuccess = (response) => {
    setSuccessMessage(response);

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
      <PublicSiteHeader activeKey={null} />

      <main>
        {successMessage ? (
          <div className="request-submission-page success">
            <div className="success-container" data-animate="zoom-in">
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
            <div className="page-header" data-animate="fade-up">
              <h1>Submit Emergency Request</h1>
              <p>Please provide detailed information about your organization&apos;s relief needs.</p>
            </div>

            <div className="page-content">
              <div className="form-container" data-animate="fade-right">
                <RequestForm
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </div>

              <aside className="help-panel" data-animate="fade-left" data-delay="150">
                <Card>
                  <Card.Header>
                    <h3>Submission Guidance</h3>
                  </Card.Header>
                  <Card.Body>
                    <ul>
                      <li><strong>Be Specific:</strong> Provide detailed descriptions to help responders understand your needs</li>
                      <li><strong>Exact Address:</strong> Include the full service location so responders know where help is needed</li>
                      <li><strong>Include Details:</strong> Specify quantities and special requirements for resources</li>
                      <li><strong>Contact Information:</strong> Ensure contact details are accurate and monitored</li>
                      <li><strong>Verify Data:</strong> Double-check all information before submitting</li>
                      <li><strong>Disaster Type:</strong> Select the type of disaster accurately for proper categorization</li>
                      <li><strong>Tracking Code:</strong> Keep the tracking code after submission so you can check request status later</li>
                    </ul>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h3>Need Help?</h3>
                  </Card.Header>
                  <Card.Body>
                    <p>For assistance with submitting a request:</p>
                    <ul>
                      <li>Call our support team: 1-800-HELP-NOW</li>
                      <li>Email: support@drrcs.org</li>
                      <li>Live chat is available 24/7</li>
                    </ul>
                  </Card.Body>
                </Card>
              </aside>
            </div>
          </div>
        )}
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default RequestSubmissionPage;
