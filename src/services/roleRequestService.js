/**
 * Role Upgrade Request Service
 * Handles requests from users who want to be promoted to coordinator or organization_staff.
 * Admin must approve before the role change takes effect.
 */

const ROLE_REQUESTS_KEY = 'drrcs_role_requests';

const UPGRADEABLE_ROLES = ['coordinator', 'organization_staff'];

const getRoleRequests = () => {
  try {
    const data = localStorage.getItem(ROLE_REQUESTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveRoleRequests = (requests) => {
  try {
    localStorage.setItem(ROLE_REQUESTS_KEY, JSON.stringify(requests));
  } catch { /* ignore */ }
};

/**
 * Submit a role upgrade request.
 * A user can only have one pending request at a time.
 */
export const submitRoleRequest = (user, requestedRole, reason = '') => {
  if (!UPGRADEABLE_ROLES.includes(requestedRole)) {
    return { success: false, message: 'Invalid role requested.' };
  }

  const requests = getRoleRequests();
  const existing = requests.find(
    (r) => r.userId === user.id && r.status === 'pending'
  );

  if (existing) {
    return {
      success: false,
      message: 'You already have a pending role upgrade request. Please wait for admin review.',
    };
  }

  const newRequest = {
    id: `ROLE-${Date.now()}`,
    userId: user.id,
    userEmail: user.email,
    userName: user.fullName || user.email,
    currentRole: user.role,
    requestedRole,
    reason: reason.trim(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedBy: null,
    reviewedAt: null,
    denyReason: null,
  };

  requests.push(newRequest);
  saveRoleRequests(requests);

  return {
    success: true,
    request: newRequest,
    message: 'Role upgrade request submitted successfully. An admin will review it shortly.',
  };
};

/** Return all requests with status === 'pending' (for admin view) */
export const getPendingRoleRequests = () => {
  return getRoleRequests().filter((r) => r.status === 'pending');
};

/** Return every role request (for admin history view) */
export const getAllRoleRequests = () => {
  return getRoleRequests();
};

/** Return the active pending request for a specific user, or null */
export const getUserRoleRequest = (userId) => {
  return getRoleRequests().find((r) => r.userId === userId && r.status === 'pending') || null;
};

/** Admin approves a request */
export const approveRoleRequest = (requestId, adminUser) => {
  const requests = getRoleRequests();
  const req = requests.find((r) => r.id === requestId);
  if (!req) return { success: false, message: 'Request not found.' };

  req.status = 'approved';
  req.reviewedBy = adminUser?.email || 'admin';
  req.reviewedAt = new Date().toISOString();

  saveRoleRequests(requests);
  return { success: true, request: req };
};

/** Admin denies a request */
export const denyRoleRequest = (requestId, adminUser, reason = '') => {
  const requests = getRoleRequests();
  const req = requests.find((r) => r.id === requestId);
  if (!req) return { success: false, message: 'Request not found.' };

  req.status = 'denied';
  req.denyReason = reason.trim();
  req.reviewedBy = adminUser?.email || 'admin';
  req.reviewedAt = new Date().toISOString();

  saveRoleRequests(requests);
  return { success: true, request: req };
};

export default {
  submitRoleRequest,
  getPendingRoleRequests,
  getAllRoleRequests,
  getUserRoleRequest,
  approveRoleRequest,
  denyRoleRequest,
};
