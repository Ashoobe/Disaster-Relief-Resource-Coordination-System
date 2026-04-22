/**
 * Status Indicator Component
 * Shows status with color coding
 */

import React from 'react';
import './StatusIndicator.css';

export const StatusIndicator = ({ status, label = '', className = '', ...props }) => {
  return (
    <div className={`status-indicator status-${status} ${className}`} {...props}>
      <span className="status-dot"></span>
      {label && <span className="status-label">{label}</span>}
    </div>
  );
};

export default StatusIndicator;
