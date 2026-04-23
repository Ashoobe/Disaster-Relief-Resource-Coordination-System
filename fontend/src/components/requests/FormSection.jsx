/**
 * Form Section Component
 * Reusable wrapper for form sections with title, description, and children
 */

import React from 'react';

const FormSection = ({
  title,
  description,
  children,
  className = '',
  required = false
}) => {
  return (
    <div className={`form-section ${className}`}>
      <div className="form-section-header">
        <h3 className="form-section-title">
          {title}
          {required && <span className="required-indicator">*</span>}
        </h3>
        {description && (
          <p className="form-section-description">{description}</p>
        )}
      </div>
      <div className="form-section-content">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
