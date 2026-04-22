const UNSUPPORTED_MESSAGE = 'Role upgrade requests are not available because the current backend does not provide server-side storage for them.';

export const submitRoleRequest = () => ({
  success: false,
  message: UNSUPPORTED_MESSAGE,
});

export const getPendingRoleRequests = () => [];

export const getAllRoleRequests = () => [];

export const getUserRoleRequest = () => null;

export const approveRoleRequest = () => ({
  success: false,
  message: UNSUPPORTED_MESSAGE,
});

export const denyRoleRequest = () => ({
  success: false,
  message: UNSUPPORTED_MESSAGE,
});

export default {
  submitRoleRequest,
  getPendingRoleRequests,
  getAllRoleRequests,
  getUserRoleRequest,
  approveRoleRequest,
  denyRoleRequest,
};
