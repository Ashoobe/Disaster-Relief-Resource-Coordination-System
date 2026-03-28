import React, { useState } from 'react';
import { validateRegistrationForm, validatePassword, validateEmail } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';
import './AuthForms.css';

// Show password strength with color indicator
const PasswordStrengthIndicator = ({ strength }) => {
  if (!strength) return null;

  const strengthLevels = {
    weak: { label: 'Weak', color: '#dc3545' },
    medium: { label: 'Medium', color: '#ffc107' },
    strong: { label: 'Strong', color: '#28a745' },
  };

  const level = strengthLevels[strength] || strengthLevels.weak;

  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div className={`strength-indicator strength-${strength}`} style={{ backgroundColor: level.color }} />
      </div>
      <span className="strength-label" style={{ color: level.color }}>
        Strength: {level.label}
      </span>
    </div>
  );
};

const RegisterForm = ({ onSuccess, onNavigateToLogin }) => {
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    // NEW: username required by backend RegisterRequest
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [submittedError, setSubmittedError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    // Calculate password strength when password changes
    if (name === 'password' && value) {
      const validation = validatePassword(value);
      setPasswordStrength(validation.strength);
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    setSubmittedError(null);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedError(null);

    // Validate form
    const validation = validateRegistrationForm(formData);
    const allErrors = { ...validation.errors };
    // NEW: validate username (not included in validateRegistrationForm)
    if (!formData.username || formData.username.trim().length < 3) {
      allErrors.username = 'Username must be at least 3 characters';
    }
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    // Clear errors
    setErrors({});

    // Attempt registration
    // Role is always 'volunteer' on self-registration; pass empty string – server sets volunteer
    // NEW: pass username — backend RegisterRequest requires { fullName, username, email, password }
    const result = await register(formData.fullName, formData.username, formData.email, formData.password, 'volunteer');

    if (!result.success) {
      setSubmittedError(result.message);
    } else {
      // Success - callback to parent component
      onSuccess?.();
    }
  };

  return (
    <form className="auth-form register-form" onSubmit={handleSubmit}>
      <h2>Create Your Account</h2>
      <p className="form-subtitle">Join the Disaster Relief Resource Coordination System</p>

      {submittedError && (
        <div className="alert alert-error" role="alert">
          {submittedError}
        </div>
      )}

      {/* Full Name Field */}
      <div className="form-group">
        <label htmlFor="fullName">Full Name *</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          className={errors.fullName ? 'input-error' : ''}
          disabled={loading}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && (
          <span className="error-message" id="fullName-error">
            {errors.fullName}
          </span>
        )}
      </div>

      {/* Username Field */}
      {/* NEW: backend RegisterRequest requires a username field */}
      <div className="form-group">
        <label htmlFor="username">Username *</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Choose a username (min 3 characters)"
          className={errors.username ? 'input-error' : ''}
          disabled={loading}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'username-error' : undefined}
        />
        {errors.username && (
          <span className="error-message" id="username-error">
            {errors.username}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={() => {
            // Validate email format on blur
            const validation = validateEmail(formData.email);
            if (!validation.isValid && formData.email) {
              setErrors((prev) => ({
                ...prev,
                email: validation.error,
              }));
            }
          }}
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

      {/* Password Field */}
      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a strong password"
          className={errors.password ? 'input-error' : ''}
          disabled={loading}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : 'password-requirements'}
        />
        {passwordStrength && !errors.password && (
          <PasswordStrengthIndicator strength={passwordStrength} />
        )}
        {errors.password && (
          <span className="error-message" id="password-error">
            {errors.password}
          </span>
        )}
        {!errors.password && (
          <small id="password-requirements" className="form-help">
            Password must contain: 8+ characters, uppercase, lowercase, number, special character
          </small>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Re-enter your password"
          className={errors.confirmPassword ? 'input-error' : ''}
          disabled={loading}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
        />
        {errors.confirmPassword && (
          <span className="error-message" id="confirmPassword-error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      {/* Role Info */}
      <div className="form-group">
        {/* NEW: replaced fragile inline styles with .role-info-box class for proper dark mode support */}
        <div className="role-info-box">
          <strong>Starting role: Volunteer</strong>
          All new accounts start as <em>Volunteer</em>. To request a higher role
          (Coordinator or Organization Staff), use the <strong>Role Upgrade</strong> option
          in your profile after signing in — an admin will review and approve it.
        </div>
      </div>

      {/* Terms & Conditions Checkbox */}
      <div className="form-group checkbox">
        <input
          id="termsAccepted"
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleInputChange}
          disabled={loading}
          aria-invalid={!!errors.termsAccepted}
          aria-describedby={errors.termsAccepted ? 'terms-error' : undefined}
        />
        <label htmlFor="termsAccepted">
          I accept the <a href="#terms">Terms and Conditions</a> *
        </label>
        {errors.termsAccepted && (
          <span className="error-message" id="terms-error">
            {errors.termsAccepted}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="button button-primary button-block" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      {/* Login Link */}
      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onNavigateToLogin}
            disabled={loading}
          >
            Log in here
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
