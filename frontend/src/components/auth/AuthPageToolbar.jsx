import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

const AuthPageToolbar = () => {
  return (
    <div className="auth-page-toolbar">
      <Link to="/" className="auth-toolbar-link">
        Main Website
      </Link>
      <ThemeToggle />
    </div>
  );
};

export default AuthPageToolbar;
