/**
 * Authentication Service
 *
 * ORIGINAL: Authentication Service with Mocked API Calls
 *           This service handles all authentication-related API calls
 *           Backend integration ready for Week 9
 *
 * UPDATED:  Now connects to the real Spring Boot backend when VITE_ENABLE_DEMO_MODE
 *           is NOT "true" in the .env file.  All original mock code has been kept
 *           intact below each function as the demo / offline fallback.
 *
 * HOW TO SWITCH:
 *   - Real backend  → set  VITE_ENABLE_DEMO_MODE=false  in .env
 *   - Demo / mock   → set  VITE_ENABLE_DEMO_MODE=true   in .env
 */

// ─────────────────────────────────────────────────────────────────────────────
// NEW: Backend connection helpers
// ─────────────────────────────────────────────────────────────────────────────

// NEW: Base URL read from .env (VITE_API_BASE_URL) — falls back to the
//      default Spring Boot dev port if the variable is not set.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// NEW: Feature flag that lets teammates keep using mock data by setting
//      VITE_ENABLE_DEMO_MODE=true in .env — when true the real fetch calls
//      are skipped and every function falls through to its original mock block.
const DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

// NEW: Normalises Spring Security role strings so the frontend always receives
//      lowercase plain-English roles (e.g. 'admin', 'volunteer', 'organization_staff').
//      Handles formats: 'ROLE_ADMIN', 'ADMIN', 'admin', 'ORGANIZATION_STAFF', etc.
const _normalizeRole = (role = '') => {
  const r = role.toUpperCase().replace(/^ROLE_/, '');
  if (r === 'ADMIN') return 'admin';
  if (r === 'VOLUNTEER') return 'volunteer';
  if (r.startsWith('ORGANIZATION') || r === 'STAFF') return 'organization_staff';
  return role.toLowerCase();
};

// NEW: Reusable fetch helper for the backend.
//      - Automatically sets Content-Type and forwards any extra headers.
//      - Unwraps the Spring Boot ApiResponse<T> envelope when present.
//      - Throws a descriptive Error on non-2xx responses so callers can .catch().
const _apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`);
  return json;
};

// ─────────────────────────────────────────────────────────────────────────────
// ORIGINAL: Mock helpers (kept for demo / offline mode)
// ─────────────────────────────────────────────────────────────────────────────

// Mock delay to simulate network latency (used in demo mode only)
const MOCK_DELAY = 1000; // 1 second

// Browser-compatible base64 encoding/decoding
const btoa_compat = (str) => {
  try {
    return btoa(JSON.stringify(str));
  } catch {
    return btoa(unescape(encodeURIComponent(JSON.stringify(str))));
  }
};

const atob_compat = (str) => {
  try {
    return JSON.parse(atob(str));
  } catch {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
  }
};

const isNetworkError = (error) => {
  const message = error?.message?.toLowerCase?.() || '';
  return (
    error instanceof TypeError ||
    message.includes('failed to fetch') ||
    message.includes('load failed') ||
    message.includes('networkerror') ||
    message.includes('network request failed')
  );
};

const normalizeLoginIdentifier = (value = '') => value.trim().toLowerCase();

// Mock user database for testing
const MOCK_USERS = [
  {
    id: '1',
    fullName: 'Hlay Aliotte',
    username: 'hlayaliotte',
    email: 'hlayaliotte@lewisu.edu',
    password: 'Password@123',
    role: 'admin',
  },
  {
    id: '2',
    fullName: 'Prithu Kathet',
    username: 'prithukathet',
    email: 'prithukathet@lewisu.edu',
    password: 'Password@123',
    role: 'admin',
  },
  {
    id: '3',
    fullName: 'Sree Soumith Thanigondala',
    username: 'sreesoumiththanigo',
    email: 'sreesoumiththanigo@lewisu.edu',
    password: 'Password@123',
    role: 'admin',
  },
  {
    id: '4',
    fullName: 'Admin Demo',
    username: 'admin',
    email: 'admin@drrcs.test',
    password: 'Password@123',
    role: 'admin',
  },
  {
    id: '5',
    fullName: 'Volunteer Demo',
    username: 'volunteer',
    email: 'volunteer@drrcs.test',
    password: 'Volunteer@123',
    role: 'volunteer',
  },
  {
    id: '6',
    fullName: 'Organization Demo',
    username: 'orgstaff',
    email: 'org@drrcs.test',
    password: 'Organization@123',
    role: 'organization_staff',
  },
  {
    id: '7',
    fullName: 'Sowjanya Gottimukkala',
    username: 'sowjanya',
    email: 'sowjigottimukkala96@gmail.com',
    password: 'Password@123',
    role: 'admin',
  },
];

/**
 * Sleep utility for simulating async operations
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate mock JWT-like token (for testing only)
 */
const generateMockToken = (user) => {
  // Simple base64 encoding, NOT secure - for testing only
  const tokenData = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  };
  return btoa_compat(tokenData);
};

const findMockUser = (identifier, password) => {
  const normalizedIdentifier = normalizeLoginIdentifier(identifier);
  return MOCK_USERS.find((user) => {
    const matchesIdentifier =
      normalizeLoginIdentifier(user.email) === normalizedIdentifier ||
      normalizeLoginIdentifier(user.username) === normalizedIdentifier;

    return matchesIdentifier && user.password === password;
  });
};

const loginWithMockUser = async (identifier, password, message = 'Login successful') => {
  await sleep(MOCK_DELAY);

  const user = findMockUser(identifier, password);

  if (!user) {
    return {
      success: false,
      token: null,
      user: null,
      message: 'Invalid username or password',
    };
  }

  const token = generateMockToken(user);
  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    token,
    user: userWithoutPassword,
    message,
  };
};

const getMockUserFromToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const decoded = atob_compat(token);
    return (
      MOCK_USERS.find((user) => user.id === decoded.userId) ||
      MOCK_USERS.find((user) => normalizeLoginIdentifier(user.email) === normalizeLoginIdentifier(decoded.email)) ||
      null
    );
  } catch {
    return null;
  }
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
export const loginUser = async (email, password, rememberMe = false) => {
  // ── NEW: Real backend call ───────────────────────────────────────────────────
  // Calls POST /api/auth/login with username + password.
  // NEW FIX: backend LoginRequest expects { username, password } — not email.
  // The 'email' parameter now carries the username value typed in the login form.
  // role from backend is a Set<String> array like ["VOLUNTEER"], so we take first element.
  if (!DEMO_MODE) {
    try {
      const json = await _apiFetch('/v1/auth/login', {
        method: 'POST',
        // ORIGINAL: body: JSON.stringify({ email, password }),
        // NEW: backend expects username field
        body: JSON.stringify({ username: email, password }),
      });
      const p = json?.data ?? json; // unwrap ApiResponse<T> envelope if present
      return {
        success: true,
        token: p.token,
        user: {
          id: p.id ?? p.userId,
          username: p.username,
          email: p.email,
          fullName: p.fullName ?? p.name,
          // NEW FIX: role is a Set/array from backend e.g. ["VOLUNTEER"] — normalise first element
          role: _normalizeRole(Array.isArray(p.role) ? [...p.role][0] : p.role),
        },
        message: json.message ?? 'Login successful',
      };
    } catch (err) {
      if (isNetworkError(err)) {
        return loginWithMockUser(
          email,
          password,
          'Backend is unavailable, so you were signed in with local demo data.'
        );
      }

      return { success: false, token: null, user: null, message: err.message || 'An error occurred during login. Please try again.' };
    }
  }
  // ── ORIGINAL: Mock / demo fallback (active when VITE_ENABLE_DEMO_MODE=true) ──
  try {
    return await loginWithMockUser(email, password);
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      token: null,
      user: null,
      message: 'An error occurred during login. Please try again.',
    };
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
export const registerUser = async (fullName, username, email, password, role) => {
  // ── NEW: Real backend call ───────────────────────────────────────────────────
  // Calls POST /api/auth/register with { fullName, username, email, password }.
  // NEW FIX: backend RegisterRequest requires a username field.
  // role excluded — backend assigns VOLUNTEER to all self-registrations.
  if (!DEMO_MODE) {
    try {
      const json = await _apiFetch('/v1/auth/register', {
        method: 'POST',
        // ORIGINAL: body: JSON.stringify({ fullName, email, password, role }),
        // NEW FIX: backend RegisterRequest requires { fullName, username, email, password }
        body: JSON.stringify({ fullName, username, email, password }),
      });
      const p = json?.data ?? json; // unwrap ApiResponse<T> envelope if present
      return {
        success: true,
        token: p.token,
        user: {
          id: p.id ?? p.userId,
          username: p.username ?? username,
          email: p.email,
          fullName: p.fullName ?? fullName,
          // NEW FIX: role is a Set/array from backend e.g. ["VOLUNTEER"] — normalise first element
          role: _normalizeRole(Array.isArray(p.role) ? [...p.role][0] : p.role),
        },
        message: json.message ?? 'Registration successful!',
      };
    } catch (err) {
      return { success: false, token: null, user: null, message: err.message || 'An error occurred during registration. Please try again.' };
    }
  }
  // ── ORIGINAL: Mock / demo fallback (active when VITE_ENABLE_DEMO_MODE=true) ──
  try {
    // Simulate network delay
    await sleep(MOCK_DELAY);

    // Check if email already exists (mock unique constraint)
    const existingUser = MOCK_USERS.find((u) => u.email === email.toLowerCase());
    if (existingUser) {
      return {
        success: false,
        token: null,
        user: null,
        message: 'Email already registered. Please use a different email or log in.',
      };
    }

    // Validate role
    // All new self-registered users start as volunteer.
    // Coordinator / organization_staff require admin approval via a role upgrade request.
    const assignedRole = 'volunteer';

    // Create new user (in real app, backend would create this)
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password, // Never store plain text in real app!
      role: assignedRole,
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    // Generate token
    const token = generateMockToken(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Registration successful!',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      token: null,
      user: null,
      message: 'An error occurred during registration. Please try again.',
    };
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
  // ── NEW: Real backend call ───────────────────────────────────────────────────
  // Calls POST /api/auth/forgot-password.  Any fetch error is silently swallowed
  // so the response never reveals whether an account exists (security best practice).
  if (!DEMO_MODE) {
    try {
      await _apiFetch('/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    } catch { /* intentionally silent — do not reveal if email exists */ }
    return { success: true, message: 'If an account exists with this email, you will receive password reset instructions.' };
  }
  // ── ORIGINAL: Mock / demo fallback (active when VITE_ENABLE_DEMO_MODE=true) ──
  try {
    // Simulate network delay
    await sleep(MOCK_DELAY);

    // Check if email exists (don't reveal if it exists or not for security)
    const user = MOCK_USERS.find((u) => u.email === email.toLowerCase());

    // Always return success message for security (don't reveal if email exists)
    return {
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions.',
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
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
  try {
    // Simulate network delay
    await sleep(MOCK_DELAY / 2);

    // In a real app, validate and refresh the token
    // For now, just return a new token
    if (!token) {
      return {
        success: false,
        token: null,
        message: 'No token provided',
      };
    }

    // Decode mock token
    const decoded = atob_compat(token);

    // Generate new token with updated expiry
    const tokenData = {
      ...decoded,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    };
    const newToken = btoa_compat(tokenData);

    return {
      success: true,
      token: newToken,
      message: 'Token refreshed',
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      token: null,
      message: 'Failed to refresh token',
    };
  }
};

/**
 * Logout user (mainly for cleanup)
 * POST /api/auth/logout
 *
 * @returns {Promise} - { success: boolean, message: string }
 */
export const logoutUser = async () => {
  // ── NEW: Real backend handling ───────────────────────────────────────────────
  // JWTs are stateless — the token is invalidated client-side by removing it
  // from localStorage.  No HTTP call to the backend is required for logout.
  // (If the backend ever adds a token-blacklist endpoint, add the call here.)
  if (!DEMO_MODE) {
    return { success: true, message: 'Logged out successfully' };
  }
  // ── ORIGINAL: Mock / demo fallback (active when VITE_ENABLE_DEMO_MODE=true) ──
  try {
    // Simulate network delay
    await sleep(MOCK_DELAY / 2);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'An error occurred during logout',
    };
  }
};

/**
 * Get current user (refresh user data from backend)
 * GET /api/auth/me
 *
 * @param {string} token - Authentication token
 * @returns {Promise} - { success: boolean, user: object, message: string }
 */
export const getCurrentUser = async (token) => {
  // ── NEW: Real backend call ───────────────────────────────────────────────────
  // Calls GET /api/auth/me with the stored JWT in the Authorization header.
  // Used by AuthContext on app load to rehydrate the logged-in user from a
  // persisted token without requiring the user to log in again.
  if (!DEMO_MODE) {
    if (!token) return { success: false, user: null, message: 'No token provided' };
    try {
      const json = await _apiFetch('/v1/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const p = json?.data ?? json; // unwrap ApiResponse<T> envelope if present
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
      // Token may be expired or revoked — clear the session gracefully
      return { success: false, user: null, message: 'Session expired. Please log in again.' };
    }
  }
  // ── ORIGINAL: Mock / demo fallback (active when VITE_ENABLE_DEMO_MODE=true) ──
  try {
    // Simulate network delay
    await sleep(MOCK_DELAY / 2);

    if (!token) {
      return {
        success: false,
        user: null,
        message: 'No token provided',
      };
    }

    // Decode token and return user data
    const decoded = atob_compat(token);
    const user = MOCK_USERS.find((u) => u.id === decoded.userId);

    if (!user) {
      return {
        success: false,
        user: null,
        message: 'User not found',
      };
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      message: 'User data retrieved',
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      user: null,
      message: 'Failed to retrieve user data',
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
