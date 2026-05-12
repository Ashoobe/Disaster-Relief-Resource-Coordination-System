/**
 * Emergency request form optimized for fast public submission.
 */

import React, { useEffect, useState } from 'react';
import { validateRequestForm } from '../../utils/requestValidation';
import { saveDraft, loadDraft, clearDraft, submitRequest } from '../../services/requestService';
import './RequestForm.css';

const HELP_OPTIONS = [
  { key: 'food', label: 'Food or water' },
  { key: 'medical', label: 'Medical help' },
  { key: 'shelter', label: 'Shelter' },
  { key: 'searchRescue', label: 'Rescue' },
  { key: 'transportation', label: 'Transportation' },
  { key: 'clothing', label: 'Supplies' },
];

const createInitialFormData = () => ({
  title: '',
  description: '',
  disasterType: '',
  location: {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    latitude: '',
    longitude: '',
    affectedAreaSize: '',
  },
  resourceNeeds: {
    food: { needed: false },
    medical: { needed: false },
    shelter: { needed: false },
    searchRescue: { needed: false },
    transportation: { needed: false },
    clothing: { needed: false },
    other: '',
  },
  contact: {
    primaryName: '',
    primaryPhone: '',
    primaryEmail: '',
  },
  priority: '',
});

const RequestForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(createInitialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  useEffect(() => {
    const draft = loadDraft('request-form');
    if (draft?.data) {
      setFormData((prev) => ({
        ...prev,
        ...draft.data,
        location: { ...prev.location, ...(draft.data.location || {}) },
        resourceNeeds: { ...prev.resourceNeeds, ...(draft.data.resourceNeeds || {}) },
        contact: { ...prev.contact, ...(draft.data.contact || {}) },
      }));
    }
    setHasLoadedDraft(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft) return;
    const timer = setTimeout(() => saveDraft('request-form', formData), 1000);
    return () => clearTimeout(timer);
  }, [formData, hasLoadedDraft]);

  const clearError = (key) => {
    if (!errors[key]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
    clearError(`location.${field}`);
  };

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
    clearError(`contact.${field}`);
    clearError('contact.primaryPhone');
    clearError('contact.primaryEmail');
  };

  const toggleHelp = (key, checked) => {
    setFormData((prev) => ({
      ...prev,
      resourceNeeds: {
        ...prev.resourceNeeds,
        [key]: {
          ...(prev.resourceNeeds[key] || {}),
          needed: checked,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const validation = validateRequestForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const response = await submitRequest(formData);
      clearDraft('request-form');
      setFormData(createInitialFormData());
      setErrors({});

      if (onSuccess) {
        onSuccess(response);
      } else {
        setSubmitSuccess(`Request submitted. Tracking code: ${response.trackingCode || response.requestId}`);
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="request-form simple-request-form" onSubmit={handleSubmit}>
      {submitError && (
        <div className="form-alert error">
          <strong>Error:</strong> {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="form-alert success">
          <strong>Success:</strong> {submitSuccess}
        </div>
      )}

      <div className="simple-form-grid">
        <div className="form-group">
          <label htmlFor="disasterType">Emergency type *</label>
          <select
            id="disasterType"
            value={formData.disasterType}
            onChange={(e) => handleInputChange('disasterType', e.target.value)}
            className={errors.disasterType ? 'error' : ''}
          >
            <option value="">Select type</option>
            <option value="flood">Flood</option>
            <option value="wildfire">Wildfire</option>
            <option value="hurricane">Hurricane</option>
            <option value="tornado">Tornado</option>
            <option value="earthquake">Earthquake</option>
            <option value="other">Other</option>
          </select>
          {errors.disasterType && <div className="field-error">{errors.disasterType}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority *</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className={errors.priority ? 'error' : ''}
          >
            <option value="">Select priority</option>
            <option value="critical">Critical - life threatening</option>
            <option value="high">High - urgent</option>
            <option value="medium">Medium - needs help soon</option>
            <option value="low">Low - can wait</option>
          </select>
          {errors.priority && <div className="field-error">{errors.priority}</div>}
        </div>

        <div className="form-group simple-form-full">
          <label htmlFor="title">Short summary *</label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Flooded homes need shelter and food"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            maxLength="100"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <div className="field-error">{errors.title}</div>}
        </div>

        <div className="form-group simple-form-full">
          <label htmlFor="description">What help is needed? *</label>
          <textarea
            id="description"
            placeholder="Describe what happened, who is affected, and what responders should know."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            maxLength="1000"
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <div className="field-error">{errors.description}</div>}
        </div>

        <fieldset className="simple-checkbox-group simple-form-full">
          <legend>Help needed</legend>
          <div className="simple-checkbox-grid">
            {HELP_OPTIONS.map((option) => (
              <label key={option.key} className="simple-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(formData.resourceNeeds[option.key]?.needed)}
                  onChange={(e) => toggleHelp(option.key, e.target.checked)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-group simple-form-full">
          <label htmlFor="address">Address or nearby landmark *</label>
          <input
            id="address"
            type="text"
            placeholder="Street address, shelter, school, intersection, or landmark"
            value={formData.location.address}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            className={errors['location.address'] ? 'error' : ''}
          />
          {errors['location.address'] && <div className="field-error">{errors['location.address']}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="city">City *</label>
          <input
            id="city"
            type="text"
            placeholder="City"
            value={formData.location.city}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            className={errors['location.city'] ? 'error' : ''}
          />
          {errors['location.city'] && <div className="field-error">{errors['location.city']}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">ZIP code *</label>
          <input
            id="zipCode"
            type="text"
            inputMode="numeric"
            placeholder="60446"
            value={formData.location.zipCode}
            onChange={(e) => handleLocationChange('zipCode', e.target.value)}
            maxLength="10"
            className={errors['location.zipCode'] ? 'error' : ''}
          />
          {errors['location.zipCode'] && <div className="field-error">{errors['location.zipCode']}</div>}
        </div>

        <div className="form-group simple-form-full">
          <label htmlFor="state">State or region (optional)</label>
          <input
            id="state"
            type="text"
            placeholder="State or region"
            value={formData.location.state}
            onChange={(e) => handleLocationChange('state', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="primaryName">Your name *</label>
          <input
            id="primaryName"
            type="text"
            placeholder="Full name"
            value={formData.contact.primaryName}
            onChange={(e) => handleContactChange('primaryName', e.target.value)}
            className={errors['contact.primaryName'] ? 'error' : ''}
          />
          {errors['contact.primaryName'] && <div className="field-error">{errors['contact.primaryName']}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="primaryPhone">Phone</label>
          <input
            id="primaryPhone"
            type="tel"
            placeholder="(123) 456-7890"
            value={formData.contact.primaryPhone}
            onChange={(e) => handleContactChange('primaryPhone', e.target.value)}
            className={errors['contact.primaryPhone'] ? 'error' : ''}
          />
          {errors['contact.primaryPhone'] && <div className="field-error">{errors['contact.primaryPhone']}</div>}
        </div>

        <div className="form-group simple-form-full">
          <label htmlFor="primaryEmail">Email</label>
          <input
            id="primaryEmail"
            type="email"
            placeholder="name@example.com"
            value={formData.contact.primaryEmail}
            onChange={(e) => handleContactChange('primaryEmail', e.target.value)}
            className={errors['contact.primaryEmail'] ? 'error' : ''}
          />
          {errors['contact.primaryEmail'] && <div className="field-error">{errors['contact.primaryEmail']}</div>}
        </div>
      </div>

      <div className="form-actions simple-form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-cancel"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
