/**
 * Badge Component
 * Small indicator component for status, tags, etc.
 */

import React from 'react';
import './Badge.css';

export const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
