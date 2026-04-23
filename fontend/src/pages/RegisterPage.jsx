import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPageToolbar from '../components/auth/AuthPageToolbar';
import RegisterForm from '../components/auth/RegisterForm';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    console.log('Registration successful!');
    navigate('/dashboard');
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-page-content">
        <AuthPageToolbar />
        <div className="auth-container">
          <RegisterForm onSuccess={handleRegisterSuccess} onNavigateToLogin={handleNavigateToLogin} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
