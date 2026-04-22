/**
 * Request Form Component
 * Complete disaster request submission form with validation and conditional fields
 */

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import FormSection from './FormSection';
import DisasterTypeSelector from './DisasterTypeSelector';
import ResourceNeedsSection from './ResourceNeedsSection';
import { validateRequestForm } from '../../utils/requestValidation';
import { submitRequest } from '../../services/requestService';
import './RequestForm.css';

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

const RequestForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    disasterType: '',
    location: {
      address: '',
      state: '',
      city: '',
      latitude: '',
      longitude: '',
      affectedAreaSize: '',
    },
    disasterDetails: {},
    resourceNeeds: {
      food: { needed: false, people: '', dietary: '' },
      medical: { needed: false, supplies: [], hospitalAvailable: null },
      shelter: { needed: false, families: '', requirements: '' },
      searchRescue: { needed: false, missing: '', description: '' },
      other: '',
    },
    contact: {
      primaryName: '',
      primaryPhone: '',
      primaryEmail: '',
      backupName: '',
      backupPhone: '',
    },
    priority: '',
    urgencyReason: '',
    authorizedBy: '',
    authorizationDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));

    const errorKey = `location.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));

    const errorKey = `contact.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const handleResourceNeedsChange = (updatedNeeds) => {
    setFormData((prev) => ({
      ...prev,
      resourceNeeds: updatedNeeds,
    }));
  };

  const handleDisasterTypeChange = (type) => {
    handleInputChange('disasterType', type);
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
      setSubmitSuccess(`Request submitted successfully. Tracking Code: ${response.trackingCode || response.requestId}`);
      setFormData({
        title: '',
        description: '',
        disasterType: '',
        location: { address: '', state: '', city: '', latitude: '', longitude: '', affectedAreaSize: '' },
        disasterDetails: {},
        resourceNeeds: {
          food: { needed: false, people: '', dietary: '' },
          medical: { needed: false, supplies: [], hospitalAvailable: null },
          shelter: { needed: false, families: '', requirements: '' },
          searchRescue: { needed: false, missing: '', description: '' },
          other: '',
        },
        contact: { primaryName: '', primaryPhone: '', primaryEmail: '', backupName: '', backupPhone: '' },
        priority: '',
        urgencyReason: '',
        authorizedBy: '',
        authorizationDate: new Date().toISOString().split('T')[0],
      });
      setErrors({});

      if (onSuccess) {
        setTimeout(() => onSuccess(response), 2000);
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form className="request-form" onSubmit={handleSubmit}>
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

      <FormSection
        title="Basic Information"
        description="Provide essential details about the disaster situation"
        required
      >
        <div className="form-group">
          <label htmlFor="title">Disaster/Request Title *</label>
          <input
            id="title"
            type="text"
            placeholder="Brief title for the disaster or relief request"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            maxLength="100"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <div className="field-error">{errors.title}</div>}
          <span className="char-count">{formData.title.length}/100</span>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            placeholder="Detailed description of the disaster situation and aid needed"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            maxLength="1000"
            rows="5"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <div className="field-error">{errors.description}</div>}
          <span className="char-count">{formData.description.length}/1000</span>
        </div>

        <div className="form-group">
          <label>Disaster Type *</label>
          <DisasterTypeSelector
            value={formData.disasterType}
            onChange={handleDisasterTypeChange}
            error={errors.disasterType}
          />
        </div>
      </FormSection>

      <FormSection
        title="Location Information"
        description="Where is the disaster occurring?"
        required
      >
        <div className="form-group">
          <label htmlFor="address">Exact Address *</label>
          <input
            id="address"
            type="text"
            placeholder="Street address, apartment/unit, building, or landmark details"
            value={formData.location.address}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            className={errors['location.address'] ? 'error' : ''}
          />
          {errors['location.address'] && <div className="field-error">{errors['location.address']}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State/Region *</label>
            <select
              id="state"
              value={formData.location.state}
              onChange={(e) => handleLocationChange('state', e.target.value)}
              className={errors['location.state'] ? 'error' : ''}
            >
              <option value="">-- Select State --</option>
              {STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors['location.state'] && <div className="field-error">{errors['location.state']}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              id="city"
              type="text"
              placeholder="City or town"
              value={formData.location.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              className={errors['location.city'] ? 'error' : ''}
            />
            {errors['location.city'] && <div className="field-error">{errors['location.city']}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitude">Latitude *</label>
            <input
              id="latitude"
              type="number"
              placeholder="e.g., 40.7128"
              step="0.0001"
              min="-90"
              max="90"
              value={formData.location.latitude}
              onChange={(e) => handleLocationChange('latitude', e.target.value)}
              className={errors['location.coordinates'] ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude *</label>
            <input
              id="longitude"
              type="number"
              placeholder="e.g., -74.0060"
              step="0.0001"
              min="-180"
              max="180"
              value={formData.location.longitude}
              onChange={(e) => handleLocationChange('longitude', e.target.value)}
              className={errors['location.coordinates'] ? 'error' : ''}
            />
            {errors['location.coordinates'] && <div className="field-error">{errors['location.coordinates']}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="affectedAreaSize">Affected Area Size (optional)</label>
          <input
            id="affectedAreaSize"
            type="text"
            placeholder="e.g., 500 sq km, 2 city blocks"
            value={formData.location.affectedAreaSize}
            onChange={(e) => handleLocationChange('affectedAreaSize', e.target.value)}
            className={errors['location.affectedAreaSize'] ? 'error' : ''}
          />
          {errors['location.affectedAreaSize'] && <div className="field-error">{errors['location.affectedAreaSize']}</div>}
        </div>
      </FormSection>

      <FormSection
        title="Resource Needs"
        description="Select the resources your organization needs for relief efforts"
      >
        <ResourceNeedsSection
          resourceNeeds={formData.resourceNeeds}
          onChange={handleResourceNeedsChange}
          errors={errors}
        />
      </FormSection>

      <FormSection
        title="Contact Information"
        description="How can we reach you regarding this request?"
        required
      >
        <div className="form-group">
          <label htmlFor="primaryName">Primary Contact Name *</label>
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="primaryPhone">Primary Phone *</label>
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

          <div className="form-group">
            <label htmlFor="primaryEmail">Primary Email *</label>
            <input
              id="primaryEmail"
              type="email"
              placeholder="email@example.com"
              value={formData.contact.primaryEmail}
              onChange={(e) => handleContactChange('primaryEmail', e.target.value)}
              className={errors['contact.primaryEmail'] ? 'error' : ''}
            />
            {errors['contact.primaryEmail'] && <div className="field-error">{errors['contact.primaryEmail']}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="backupName">Backup Contact Name (optional)</label>
          <input
            id="backupName"
            type="text"
            placeholder="Full name"
            value={formData.contact.backupName}
            onChange={(e) => handleContactChange('backupName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="backupPhone">Backup Contact Phone (optional)</label>
          <input
            id="backupPhone"
            type="tel"
            placeholder="(123) 456-7890"
            value={formData.contact.backupPhone}
            onChange={(e) => handleContactChange('backupPhone', e.target.value)}
            className={errors['contact.backupPhone'] ? 'error' : ''}
          />
          {errors['contact.backupPhone'] && <div className="field-error">{errors['contact.backupPhone']}</div>}
        </div>
      </FormSection>

      <FormSection
        title="Priority & Urgency"
        description="How urgent is this request?"
        required
      >
        <div className="form-group">
          <label>Priority Level *</label>
          <div className="radio-group-container">
            {['critical', 'high', 'medium', 'low'].map((level) => (
              <label key={level} className="radio-label">
                <input
                  type="radio"
                  name="priority"
                  value={level}
                  checked={formData.priority === level}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                />
                <span className={`priority-badge priority-${level}`}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </span>
              </label>
            ))}
          </div>
          {errors.priority && <div className="field-error">{errors.priority}</div>}
        </div>

        {(formData.priority === 'critical' || formData.priority === 'high') && (
          <div className="form-group">
            <label htmlFor="urgencyReason">Urgency Reason *</label>
            <textarea
              id="urgencyReason"
              placeholder="Explain why this request is critical or high priority"
              value={formData.urgencyReason}
              onChange={(e) => handleInputChange('urgencyReason', e.target.value)}
              maxLength="500"
              rows="3"
              className={errors.urgencyReason ? 'error' : ''}
            />
            {errors.urgencyReason && <div className="field-error">{errors.urgencyReason}</div>}
            <span className="char-count">{formData.urgencyReason.length}/500</span>
          </div>
        )}
      </FormSection>

      <FormSection
        title="Organization Authorization"
        description="Authorization details for this request"
        required
      >
        <div className="form-group readonly">
          <label htmlFor="organizationName">Organization Name</label>
          <input
            id="organizationName"
            type="text"
            value={user?.organizationName || 'Not provided'}
            readOnly
            disabled
          />
          <small>Auto-filled from your account</small>
        </div>

        <div className="form-group">
          <label htmlFor="authorizedBy">Authorized By *</label>
          <input
            id="authorizedBy"
            type="text"
            placeholder="Name of person authorizing this request"
            value={formData.authorizedBy}
            onChange={(e) => handleInputChange('authorizedBy', e.target.value)}
            className={errors.authorizedBy ? 'error' : ''}
          />
          {errors.authorizedBy && <div className="field-error">{errors.authorizedBy}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="authorizationDate">Authorization Date *</label>
          <input
            id="authorizationDate"
            type="date"
            value={formData.authorizationDate}
            onChange={(e) => handleInputChange('authorizationDate', e.target.value)}
            className={errors.authorizationDate ? 'error' : ''}
          />
          {errors.authorizationDate && <div className="field-error">{errors.authorizationDate}</div>}
        </div>
      </FormSection>

      <div className="form-actions">
        <div className="left-actions"></div>

        <div className="right-actions">
          <button
            type="button"
            onClick={handleCancel}
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
            {loading ? 'Submitting...' : 'Submit Emergency Request'}
          </button>
        </div>
      </div>

      <div className="form-legend">
        <p><span className="required-indicator">*</span> Indicates required field</p>
      </div>
    </form>
  );
};

export default RequestForm;
