/**
 * Loading Spinner Component
 * Shows loading indicator
 */

import React from 'react';
import './Loading.css';

export const Loading = ({ size = 'medium', fullscreen = false, className = '', ...props }) => {
  return (
    <div
      className={`loading-container ${fullscreen ? 'fullscreen' : ''} ${className}`}
      {...props}
    >
      <div className={`spinner spinner-${size}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
