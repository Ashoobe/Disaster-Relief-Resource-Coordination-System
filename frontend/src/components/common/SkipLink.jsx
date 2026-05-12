/**
 * Skip Link Component
 * Accessibility feature to skip directly to main content
 */

import React from 'react';

export const SkipLink = () => {
  const handleClick = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
      if (!mainContent.hasAttribute('tabindex')) {
        mainContent.setAttribute('tabindex', '-1');
      }
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
