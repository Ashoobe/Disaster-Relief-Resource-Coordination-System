import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPageToolbar from '../components/auth/AuthPageToolbar';
import { validateEmail } from '../utils/validation';
import * as authService from '../services/authService';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    // Clear error when user starts typing
    if (errors.email) {
      setErrors({ email: null });
    }
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validate email
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setErrors({ email: validation.error });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await authService.forgotPassword(email);

      if (result.success) {
        setMessage(result.message);
        setSubmitted(true);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="auth-page forgot-password-page">
      <div className="auth-page-content">
        <AuthPageToolbar />
        <div className="auth-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Reset Your Password</h2>
            <p className="form-subtitle">
              Enter your email and we'll send you instructions to reset your password
            </p>

            {message && (
              <div className={`alert ${submitted ? 'alert-success' : 'alert-error'}`} role="alert">
                {message}
              </div>
            )}

            {!submitted ? (
              <>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={errors.email ? 'input-error' : ''}
                    disabled={loading}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <span className="error-message" id="email-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="button button-primary button-block"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="form-help">
                  Check your email for instructions on how to reset your password.
                </p>
                <p className="form-help" style={{ marginTop: '10px' }}>
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                      setMessage(null);
                    }}
                    disabled={loading}
                  >
                    try again
                  </button>
                </p>
              </div>
            )}

            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={handleNavigateToLogin}
                  disabled={loading}
                >
                  Log in
                </button>
              </p>
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={handleNavigateToRegister}
                  disabled={loading}
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
