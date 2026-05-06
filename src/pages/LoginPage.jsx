import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPageToolbar from '../components/auth/AuthPageToolbar';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRouteForRole } from '../lib/permissions';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    navigate(getDefaultRouteForRole(user), { replace: true });
  }, [isAuthenticated, navigate, user]);

  const handleLoginSuccess = () => {
    // Redirect is handled by the auth-state effect above so it only runs
    // after the context has finished updating the logged-in user.
  };

  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  const handleNavigateToForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-page-content">
        <AuthPageToolbar />
        <div className="auth-container">
          <LoginForm
            onSuccess={handleLoginSuccess}
            onNavigateToRegister={handleNavigateToRegister}
            onNavigateToForgotPassword={handleNavigateToForgotPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
