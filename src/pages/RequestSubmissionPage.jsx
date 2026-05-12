/**
 * Request Submission Page Component
 * Page container for the request submission form
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RequestForm from '../components/requests/RequestForm';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './HomePage.css';
import './RequestSubmissionPage.css';

const SUBMISSION_CONFIRMATION_KEY = 'drrcs_last_submission_confirmation';

const readSubmissionConfirmation = () => {
  try {
    const raw = sessionStorage.getItem(SUBMISSION_CONFIRMATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeSubmissionConfirmation = (response) => {
  try {
    sessionStorage.setItem(SUBMISSION_CONFIRMATION_KEY, JSON.stringify(response));
  } catch {
    // The in-memory state still shows the confirmation if browser storage fails.
  }
};

const clearSubmissionConfirmation = () => {
  try {
    sessionStorage.removeItem(SUBMISSION_CONFIRMATION_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
};

const RequestSubmissionPage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(() => readSubmissionConfirmation());

  const handleFormSuccess = (response) => {
    writeSubmissionConfirmation(response);
    setSuccessMessage(response);
  };

  const handleFormCancel = () => {
    if (onNavigate) {
      onNavigate('dashboard');
      return;
    }

    navigate('/');
  };

  const submittedRequestId = successMessage?.requestId || successMessage?.id || successMessage?.data?.requestId;
  const submittedTrackingCode = successMessage?.trackingCode || successMessage?.data?.trackingCode;
  const submittedLookupCode = submittedTrackingCode || submittedRequestId || '';

  return (
    <div className="home-page">
      <PublicSiteHeader activeKey={null} />

      <main>
        {successMessage ? (
          <div className="request-submission-page success">
            <div className="success-container">
              <div className="success-icon">✓</div>
              <h2>Request Submitted Successfully!</h2>
              <p>Keep this tracking information so you can check the request later.</p>
              {submittedTrackingCode && (
                <div className="request-id">
                  <strong>Tracking Code:</strong>
                  <span>{submittedTrackingCode}</span>
                </div>
              )}
              {submittedRequestId && (
                <div className="request-id">
                  <strong>Request ID:</strong>
                  <span>{submittedRequestId}</span>
                </div>
              )}
              <p className="redirect-message">
                Our response team has received your submission and will review and handle it as soon as possible.
              </p>
              <div className="hero-actions success-actions">
                {submittedLookupCode && (
                  <Link
                    to={`/track?requestId=${encodeURIComponent(submittedLookupCode)}`}
                    className="hero-btn hero-btn-secondary"
                  >
                    Track This Request
                  </Link>
                )}
                <button
                  type="button"
                  className="success-close-btn"
                  onClick={() => {
                    clearSubmissionConfirmation();
                    setSuccessMessage(null);
                  }}
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="request-submission-page">
            <div className="page-header" data-animate="fade-up">
              <h1>Submit Emergency Request</h1>
              <p>Send the essentials now. Responders can follow up if they need more details.</p>
            </div>

            <div className="page-content">
              <div className="form-container" data-animate="fade-up">
                <RequestForm
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default RequestSubmissionPage;
