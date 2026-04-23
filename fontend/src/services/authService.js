/**
 * Authentication service used by the auth context.
 * Backend-only mode: all auth state is sourced from server responses.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Normalize backend role formats such as ROLE_ADMIN or ADMIN for frontend routing.
const _normalizeRole = (role = '') => {
  const r = String(role || '').toUpperCase().replace(/^ROLE_/, '');
  if (r === 'ADMIN') return 'admin';
  if (r === 'VOLUNTEER') return 'volunteer';
  if (r.startsWith('ORGANIZATION') || r === 'STAFF') return 'organization_staff';
  return String(role || '').toLowerCase();
};

// Shared fetch helper for auth endpoints.
const _apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`);
  return json;
};

/**
 * Login user with email/username and password
 * POST /api/auth/login
 *
 * @param {string} email - User email (parameter kept as 'email' but carries username value from form)
 * @param {string} password - User password
 * @param {boolean} rememberMe - Remember this device
 * @returns {Promise} - { success: boolean, token: string, user: object, message: string }
 */
export const loginUser = async (email, password, _rememberMe = false) => {
  try {
    // The first argument is still named "email" in older callers, but the backend
    // expects that value in the username field.
    const json = await _apiFetch('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: email, password }),
    });
    const p = json?.data ?? json;
    return {
      success: true,
      token: p.token,
      user: {
        id: p.id ?? p.userId,
        username: p.username,
        email: p.email,
        fullName: p.fullName ?? p.name,
        role: _normalizeRole(Array.isArray(p.role) ? [...p.role][0] : p.role),
      },
      message: json.message ?? 'Login successful',
    };
  } catch (err) {
    return { success: false, token: null, user: null, message: err.message || 'An error occurred during login. Please try again.' };
  }
};

/**
 * Register new user
 * POST /api/auth/register
 *
 * @param {string} fullName - User full name
 * @param {string} username - Username (required by backend RegisterRequest)
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (admin, volunteer, organization_staff)
 * @returns {Promise} - { success: boolean, token: string, user: object, message: string }
 */
export const registerUser = async (fullName, username, email, password, _role) => {
  try {
    const json = await _apiFetch('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, username, email, password }),
    });
    const p = json?.data ?? json;
    return {
      success: true,
      token: p.token,
      user: {
        id: p.id ?? p.userId,
        username: p.username ?? username,
        email: p.email,
        fullName: p.fullName ?? fullName,
        role: _normalizeRole(Array.isArray(p.role) ? [...p.role][0] : p.role),
      },
      message: json.message ?? 'Registration successful!',
    };
  } catch (err) {
    return { success: false, token: null, user: null, message: err.message || 'An error occurred during registration. Please try again.' };
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 *
 * @param {string} email - User email
 * @returns {Promise} - { success: boolean, message: string }
 */
export const forgotPassword = async (email) => {
  try {
    await _apiFetch('/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    return {
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions.',
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Password reset is currently unavailable.',
    };
  }
};

/**
 * Mock refresh token
 * POST /api/auth/refresh
 *
 * @param {string} token - Current token
 * @returns {Promise} - { success: boolean, token: string, message: string }
 */
export const refreshToken = async (token) => {
  if (!token) {
    return {
      success: false,
      token: null,
      message: 'No token provided',
    };
  }
  return {
    success: false,
    token: null,
    message: 'Token refresh endpoint is not available on the backend.',
  };
};

/**
 * Logout user (mainly for cleanup)
 * POST /api/auth/logout
 *
 * @returns {Promise} - { success: boolean, message: string }
 */
export const logoutUser = async () => {
  // JWT logout is client-side unless backend token revocation exists.
  return { success: true, message: 'Logged out successfully' };
};

/**
 * Get current user (refresh user data from backend)
 * GET /api/auth/me
 *
 * @param {string} token - Authentication token
 * @returns {Promise} - { success: boolean, user: object, message: string }
 */
export const getCurrentUser = async (token) => {
  if (!token) return { success: false, user: null, message: 'No token provided' };
  try {
    const json = await _apiFetch('/v1/users/me', { headers: { Authorization: `Bearer ${token}` } });
    const p = json?.data ?? json;
    return {
      success: true,
      user: {
        id: p.id ?? p.userId,
        username: p.username,
        email: p.email,
        fullName: p.fullName ?? p.name,
        role: _normalizeRole(Array.isArray(p.role) ? [...p.role][0] : p.role),
      },
      message: 'User data retrieved',
    };
  } catch {
    return {
      success: false,
      user: null,
      message: 'Session expired. Please log in again.',
    };
  }
};

export default {
  loginUser,
  registerUser,
  forgotPassword,
  refreshToken,
  logoutUser,
  getCurrentUser,
};
