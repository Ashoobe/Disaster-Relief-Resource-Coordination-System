const ROLE_CONFIG = {
  admin: {
    label: 'Admin',
    defaultRoute: '/dashboard',
    permissions: {
      manageUsers: true,
      assignRequests: true,
      updateAnyRequest: true,
    },
  },
  coordinator: {
    label: 'Coordinator',
    defaultRoute: '/org/requests',
    permissions: {
      manageUsers: false,
      assignRequests: true,
      updateAnyRequest: true,
    },
  },
  organization_staff: {
    label: 'Organization Staff',
    defaultRoute: '/org/requests',
    permissions: {
      manageUsers: false,
      assignRequests: false,
      updateAnyRequest: false,
    },
  },
  volunteer: {
    label: 'Volunteer',
    defaultRoute: '/volunteer/tasks',
    permissions: {
      manageUsers: false,
      assignRequests: false,
      updateAnyRequest: false,
    },
  },
};

export const normalizeRole = (role) => {
  if (!role || !ROLE_CONFIG[role]) {
    return 'volunteer';
  }

  return role;
};

export const getRoleLabel = (role) => {
  const normalizedRole = normalizeRole(role);
  return ROLE_CONFIG[normalizedRole].label;
};

export const hasRequiredRole = (user, allowedRoles = []) => {
  if (!allowedRoles.length) {
    return true;
  }

  const normalizedRole = normalizeRole(user?.role);
  return allowedRoles.includes(normalizedRole);
};

export const getDefaultRouteForRole = (user) => {
  const normalizedRole = normalizeRole(user?.role);
  return ROLE_CONFIG[normalizedRole].defaultRoute;
};

export const canManageUsers = (user) => {
  const normalizedRole = normalizeRole(user?.role);
  return ROLE_CONFIG[normalizedRole].permissions.manageUsers;
};

export const canAssignRequests = (user) => {
  const normalizedRole = normalizeRole(user?.role);
  return ROLE_CONFIG[normalizedRole].permissions.assignRequests;
};

export const isRequestAssignedToUser = (request, user) => {
  if (!request || !user) {
    return false;
  }

  return request.assignedTo === user.id || request.assigneeEmail === user.email;
};

export const canUpdateAssignedRequest = (user, request) => {
  const normalizedRole = normalizeRole(user?.role);

  if (ROLE_CONFIG[normalizedRole].permissions.updateAnyRequest) {
    return true;
  }

  if (normalizedRole === 'volunteer') {
    return isRequestAssignedToUser(request, user);
  }

  return false;
};

export const canViewRequestDetails = (user, request) => {
  const normalizedRole = normalizeRole(user?.role);

  if (normalizedRole === 'admin' || normalizedRole === 'organization_staff') {
    return true;
  }

  if (normalizedRole === 'volunteer') {
    return isRequestAssignedToUser(request, user);
  }

  return false;
};