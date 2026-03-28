const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch(path, token, options = {}) {
  const res = await fetch(`${API_BASE_URL}/v1${path}`, {
    headers: authHeaders(token),
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }
  // 204 No Content
  if (res.status === 204) return null;
  const json = await res.json();
  return json?.data ?? json;
}

/** Map backend UserResponse to the shape the UI expects */
function mapUser(u) {
  const roleSet = u.role ?? [];
  const rawRole = Array.isArray(roleSet) ? roleSet[0] : roleSet;
  const role = typeof rawRole === 'string'
    ? rawRole.replace(/^ROLE_/, '').toLowerCase()
    : 'user';
  return {
    id: u.id,
    fullName: u.fullName,
    username: u.username,
    email: u.email,
    role,
    status: u.enabled ? 'active' : 'inactive',
    lastLogin: u.lastLoginAt ?? null,
    createdAt: u.createdAt ?? null,
  };
}

// Create a new user — calls the same register endpoint used for sign-up
export async function createUser(data, token) {
  try {
    if (!data.fullName || !data.email || !data.password) {
      return { success: false, message: 'Full name, email, and password are required.' };
    }
    // Derive username from email prefix if not explicitly provided
    const username = data.username || data.email.split('@')[0];
    const body = JSON.stringify({ fullName: data.fullName, username, email: data.email, password: data.password });
    const res = await fetch(`${API_BASE_URL}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: json.message || `Registration failed (${res.status})` };
    }
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Get all users (paginated, ADMIN only)
export async function getAllUsers(token, filters = {}) {
  try {
    const page = filters.page ?? 0;
    const size = filters.size ?? 100;
    const data = await apiFetch(`/users/allusers?page=${page}&size=${size}`, token);
    let users = (data?.content ?? data ?? []).map(mapUser);

    // Client-side filtering (backend doesn't expose filter params yet)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      users = users.filter(
        u => u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    }
    if (filters.role && filters.role !== 'all') {
      users = users.filter(u => u.role === filters.role);
    }
    if (filters.status && filters.status !== 'all') {
      users = users.filter(u => u.status === filters.status);
    }

    return { success: true, users, total: data?.totalElements ?? users.length };
  } catch (err) {
    return { success: false, users: [], message: err.message };
  }
}

// Delete a user (ADMIN only)
export async function deleteUser(userId, token) {
  try {
    await apiFetch(`/users/users/${userId}`, token, { method: 'DELETE' });
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Change a user's role (ADMIN only)
export async function changeUserRole(userId, newRole, token) {
  try {
    // Map frontend role names to backend Role enum values
    const roleMap = {
      admin: 'ADMIN',
      volunteer: 'VOLUNTEER',
      coordinator: 'COORDINATOR',
      organization_staff: 'COORDINATOR',
      public: 'PUBLIC',
    };
    const backendRole = roleMap[newRole?.toLowerCase()] ?? newRole.toUpperCase();
    const data = await apiFetch(`/users/users/${userId}/role?role=${encodeURIComponent(backendRole)}`, token, { method: 'PATCH' });
    return { success: true, user: data ? mapUser(data) : null };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Toggle a user's active/inactive status — not yet implemented in backend
export async function toggleUserStatus(userId, token) {
  return { success: false, message: 'Status toggle is not yet supported by the server.' };
}

// Reset a user's password — not yet implemented in backend
export async function resetUserPassword(userId, newPassword, token) {
  return { success: false, message: 'Password reset is not yet supported by the server.' };
}