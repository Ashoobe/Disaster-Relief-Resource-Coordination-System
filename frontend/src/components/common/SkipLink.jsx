/**
 * Skip Link Component
 * Accessibility feature to skip directly to main content
 */

import React from 'react';

export const SkipLink = () => {
  const handleClick = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a 
      href="#main-content" 
      className="skip-link"
      onClick={handleClick}
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
