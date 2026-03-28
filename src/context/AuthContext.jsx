import React, { createContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  getCurrentUser,
} from '../services/authService';

export const AuthContext = createContext();

const TOKEN_KEY = 'drrcs_token';

// Manage authentication state across the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user has a saved session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      getCurrentUser(storedToken).then((result) => {
        if (result.success) {
          setUser(result.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setError(null);
    const result = await loginUser(email, password, rememberMe);
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem(TOKEN_KEY, result.token);
    } else {
      setError(result.message);
    }
    return result;
  };

  // NEW: added username parameter \u2014 backend RegisterRequest requires { fullName, username, email, password }
  const register = async (fullName, username, email, password, role) => {
    setError(null);
    const result = await registerUser(fullName, username, email, password, role);
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem(TOKEN_KEY, result.token);
    } else {
      setError(result.message);
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const requestPasswordReset = async (email) => {
    setError(null);
    return await forgotPassword(email);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    requestPasswordReset,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
