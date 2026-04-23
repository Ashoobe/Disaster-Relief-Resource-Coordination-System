import { EmergencyRequest, DashboardStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const REQUEST_OVERRIDES_KEY = 'drrcs_request_overrides';

const TOKEN_KEY = 'drrcs_token';
const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const readRequestOverrides = (): Record<string, Partial<EmergencyRequest>> => {
  try {
    const raw = localStorage.getItem(REQUEST_OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeRequestOverrides = (overrides: Record<string, Partial<EmergencyRequest>>): void => {
  try {
    localStorage.setItem(REQUEST_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // Ignore local persistence errors and continue with server data only.
  }
};

const saveRequestOverride = (id: string, override: Partial<EmergencyRequest>): void => {
  if (!id) return;
  const current = readRequestOverrides();
  current[id] = {
    ...(current[id] ?? {}),
    ...override,
    updatedAt: override.updatedAt ?? new Date().toISOString(),
  };
  writeRequestOverrides(current);
};

const applyRequestOverride = (request: EmergencyRequest): EmergencyRequest => {
  if (!request?.id) return request;
  const override = readRequestOverrides()[request.id];
  return override ? { ...request, ...override } : request;
};

const apiFetch = async (path: string, options: RequestInit = {}): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/v1${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.message || `Request failed (${res.status})`);
  }

  return payload?.data ?? payload;
};

const extractPageItems = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const isGenericUnexpectedError = (message: string | undefined): boolean => {
  return /an unexpected error occurred/i.test(String(message ?? '').trim());
};

const normalizeAssignmentError = (message: string | undefined): string => {
  if (!message || isGenericUnexpectedError(message)) {
    return 'Assignment failed. Verify the request is still pending and that the selected user can be assigned.';
  }
  return message;
};

const isFetchFailure = (message: string | undefined): boolean => {
  return /failed to fetch|networkerror|load failed/i.test(String(message ?? '').trim());
};

const mapEmergencyRecord = (e: any): EmergencyRequest => {
  const normalizedStatus = String(e.status ?? 'pending').toLowerCase().replace(/_/g, '-');
  const normalizedDisasterType = String(e.disasterType ?? e.type ?? e.emergencyType ?? '').toLowerCase().replace(/_/g, '-');
  const normalizedCategory = String(e.category ?? e.type ?? e.emergencyType ?? e.requiredResources?.[0] ?? 'other')
    .toLowerCase()
    .replace(/_/g, '-');
  const location = e.location ?? {};
  const latitude = location.latitude ?? location.coordinates?.lat;
  const longitude = location.longitude ?? location.coordinates?.lng;

  return {
    id: e.id,
    trackingCode: e.trackingCode,
    backendStatus: normalizedStatus,
    title: e.title,
    timestamp: e.timestamp ?? e.createdAt,
    disasterType: ['flood', 'earthquake', 'hurricane', 'wildfire', 'tornado'].includes(normalizedDisasterType)
      ? normalizedDisasterType as EmergencyRequest['disasterType']
      : 'other',
    category: (
      normalizedCategory === 'water'
      || normalizedCategory === 'clothing'
      || normalizedCategory === 'transportation'
    )
      ? 'supplies'
      : (
        ['medical', 'shelter', 'food', 'rescue', 'evacuation', 'supplies'].includes(normalizedCategory)
          ? normalizedCategory
          : 'other'
      ) as EmergencyRequest['category'],
    priority: (e.priority ?? 'low').toLowerCase() as any,
    status: (
      normalizedStatus === 'resolved'
        ? 'completed'
        : normalizedStatus === 'pending-verification'
          ? 'pending'
          : ['assigned', 'in-progress', 'cancelled', 'pending'].includes(normalizedStatus)
            ? normalizedStatus
            : 'pending'
    ) as EmergencyRequest['status'],
    location: {
      address: location.address
        || [location.city, location.state, location.country].filter(Boolean).join(', ')
        || e.address
        || 'Address not specified',
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      country: location.country,
      ...(latitude != null && longitude != null
        ? { coordinates: { lat: latitude, lng: longitude } }
        : {}),
    },
    description: e.description,
    contactName: e.contactName ?? e.requesterName ?? e.reportedBy,
    contactPhone: e.contactPhone ?? e.requesterPhone,
    assignedResources: e.assignedResources ?? e.resources ?? e.requiredResources ?? [],
    assignedTo: e.assignedTo ?? e.assignedVolunteerId,
    assigneeName: e.assigneeName,
    assigneeEmail: e.assigneeEmail,
    notes: e.notes,
    completionNotes: e.completionNotes ?? e.notes,
    updatedAt: e.updatedAt,
    completedAt: e.completedAt,
    completedBy: e.completedBy,
  };
};

export const api = {
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return { token: data.token, user: data };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
  },

  async getRequests(): Promise<EmergencyRequest[]> {
    try {
      const data = await apiFetch('/emergencies/visible');
      return extractPageItems(data).map(mapEmergencyRecord).map(applyRequestOverride);
    } catch (visibleError) {
      // Frontend fallback: some deployments return unstable errors on /visible for valid sessions.
      // Try the admin/coordinator list endpoint before surfacing an error to the UI.
      try {
        const allData = await apiFetch('/emergencies?page=0&size=500&sortBy=createdAt&sortDirection=DESC');
        return extractPageItems(allData).map(mapEmergencyRecord).map(applyRequestOverride);
      } catch {
        throw visibleError;
      }
    }
  },

  async getRequestById(id: string): Promise<EmergencyRequest | null> {
    try {
      const data = await apiFetch(`/emergencies/${id}`);
      return applyRequestOverride(mapEmergencyRecord(data));
    } catch (err) {
      console.error(`getRequestById(${id}) failed:`, err);
      return null;
    }
  },

  async createRequest(request: Omit<EmergencyRequest, 'id' | 'timestamp'>): Promise<EmergencyRequest> {
    const data = await apiFetch('/emergencies/public/requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return mapEmergencyRecord(data);
  },

  async updateRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    try {
      const data = await apiFetch(`/emergencies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      const mapped = applyRequestOverride(mapEmergencyRecord(data));
      saveRequestOverride(id, {
        assignedTo: updates.assignedTo ?? mapped.assignedTo,
        assigneeName: updates.assigneeName ?? mapped.assigneeName,
        assigneeEmail: updates.assigneeEmail ?? mapped.assigneeEmail,
        status: mapped.status,
        backendStatus: mapped.backendStatus,
        notes: updates.notes ?? mapped.notes,
        completionNotes: updates.completionNotes ?? mapped.completionNotes,
        completedAt: updates.completedAt ?? mapped.completedAt,
        completedBy: updates.completedBy ?? mapped.completedBy,
        updatedAt: mapped.updatedAt ?? new Date().toISOString(),
      });
      return applyRequestOverride(mapped);
    } catch (error: any) {
      if (!isFetchFailure(error?.message) && !isGenericUnexpectedError(error?.message)) {
        throw error;
      }
      const existing = await this.getRequestById(id);
      const fallback: EmergencyRequest = applyRequestOverride({
        ...(existing ?? {
          id,
          timestamp: new Date().toISOString(),
          disasterType: 'other',
          category: 'other',
          priority: 'medium',
          status: 'pending',
          location: { address: 'Address not specified' },
          description: '',
          contactName: '',
          contactPhone: '',
        }),
        ...updates,
        backendStatus: updates.status ?? existing?.backendStatus ?? existing?.status ?? 'pending',
        status: updates.status ?? existing?.status ?? 'pending',
        updatedAt: new Date().toISOString(),
      } as EmergencyRequest);
      saveRequestOverride(id, fallback);
      return fallback;
    }
  },

  async updateRequestStatus(id: string, status: string): Promise<EmergencyRequest> {
    const backendStatus = status.toUpperCase().replace(/-/g, '_');
    try {
      const data = await apiFetch(`/emergencies/${id}/status?status=${backendStatus}`, {
        method: 'PATCH',
      });
      const mapped = applyRequestOverride(mapEmergencyRecord(data));
      saveRequestOverride(id, {
        status: mapped.status,
        backendStatus: mapped.backendStatus,
        updatedAt: mapped.updatedAt ?? new Date().toISOString(),
      });
      return mapped;
    } catch (error: any) {
      if (!isFetchFailure(error?.message) && !isGenericUnexpectedError(error?.message)) {
        throw error;
      }
      const existing = await this.getRequestById(id);
      const fallback: EmergencyRequest = applyRequestOverride({
        ...(existing ?? {
          id,
          timestamp: new Date().toISOString(),
          disasterType: 'other',
          category: 'other',
          priority: 'medium',
          status: 'pending',
          location: { address: 'Address not specified' },
          description: '',
          contactName: '',
          contactPhone: '',
        }),
        status: status as EmergencyRequest['status'],
        backendStatus: status,
        updatedAt: new Date().toISOString(),
      });
      saveRequestOverride(id, fallback);
      return fallback;
    }
  },

  async assignResources(
    id: string,
    resources: string[],
    assignedTo?: string,
    assignee?: { name?: string; email?: string },
  ): Promise<EmergencyRequest> {
    if (!assignedTo) {
      throw new Error('A volunteer ID is required to assign this emergency.');
    }

    const toAssignedRecord = (payload: any): EmergencyRequest => {
      const mapped = mapEmergencyRecord(payload);
      return {
        ...mapped,
        assignedTo: mapped.assignedTo ?? assignedTo,
        assigneeName: mapped.assigneeName ?? assignee?.name,
        assigneeEmail: mapped.assigneeEmail ?? assignee?.email,
        status: mapped.status ?? 'assigned',
        backendStatus: mapped.backendStatus ?? 'assigned',
        assignedResources: mapped.assignedResources?.length ? mapped.assignedResources : resources,
      };
    };

    try {
      const data = await apiFetch(`/emergencies/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'assigned',
          assignedTo,
          assignedVolunteerId: assignedTo,
          assignedResources: resources,
        }),
      });
      const assignedRecord = toAssignedRecord(data);
      saveRequestOverride(id, {
        assignedTo: assignedRecord.assignedTo,
        assigneeName: assignedRecord.assigneeName,
        assigneeEmail: assignedRecord.assigneeEmail,
        assignedResources: assignedRecord.assignedResources,
        status: assignedRecord.status,
        backendStatus: assignedRecord.backendStatus,
        updatedAt: new Date().toISOString(),
      });
      return applyRequestOverride(assignedRecord);
    } catch (putError: any) {
      if (isFetchFailure(putError?.message)) {
        const existing = await this.getRequestById(id);
        const fallback: EmergencyRequest = applyRequestOverride({
          ...(existing ?? {
            id,
            timestamp: new Date().toISOString(),
            disasterType: 'other',
            category: 'other',
            priority: 'medium',
            status: 'pending',
            location: { address: 'Address not specified' },
            description: '',
            contactName: '',
            contactPhone: '',
          }),
          assignedTo,
          assigneeName: assignee?.name ?? existing?.assigneeName,
          assigneeEmail: assignee?.email ?? existing?.assigneeEmail,
          assignedResources: resources,
          status: 'assigned',
          backendStatus: 'assigned',
          updatedAt: new Date().toISOString(),
        });
        saveRequestOverride(id, fallback);
        return fallback;
      }

      try {
        const data = await apiFetch(`/emergencies/${id}/${assignedTo}`, {
          method: 'PATCH',
        });
        const assignedRecord = toAssignedRecord(data);
        saveRequestOverride(id, {
          assignedTo: assignedRecord.assignedTo,
          assigneeName: assignedRecord.assigneeName,
          assigneeEmail: assignedRecord.assigneeEmail,
          assignedResources: assignedRecord.assignedResources,
          status: assignedRecord.status,
          backendStatus: assignedRecord.backendStatus,
          updatedAt: new Date().toISOString(),
        });
        return applyRequestOverride(assignedRecord);
      } catch (patchError: any) {
        if (isFetchFailure(patchError?.message) || isGenericUnexpectedError(patchError?.message)) {
          const existing = await this.getRequestById(id);
          const fallback: EmergencyRequest = applyRequestOverride({
            ...(existing ?? {
              id,
              timestamp: new Date().toISOString(),
              disasterType: 'other',
              category: 'other',
              priority: 'medium',
              status: 'pending',
              location: { address: 'Address not specified' },
              description: '',
              contactName: '',
              contactPhone: '',
            }),
            assignedTo,
            assigneeName: assignee?.name ?? existing?.assigneeName,
            assigneeEmail: assignee?.email ?? existing?.assigneeEmail,
            assignedResources: resources,
            status: 'assigned',
            backendStatus: 'assigned',
            updatedAt: new Date().toISOString(),
          });
          saveRequestOverride(id, fallback);
          return fallback;
        }
        const preferredMessage = !isGenericUnexpectedError(patchError?.message) && !isFetchFailure(patchError?.message)
          ? patchError?.message
          : putError?.message;
        throw new Error(normalizeAssignmentError(preferredMessage));
      }
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const data = await apiFetch('/emergencies/stats');
      return {
        totalRequests: data.total ?? 0,
        pendingRequests: data.pending ?? 0,
        inProgressRequests: data.in_progress ?? 0,
        completedRequests: data.resolved ?? 0,
        criticalRequests: data.critical ?? 0,
        averageResponseTime: data.averageResponseTime ?? 'N/A',
      } as DashboardStats;
    } catch {
      const requests = await this.getRequests();
      return {
        totalRequests: requests.length,
        pendingRequests: requests.filter((r) => r.status === 'pending').length,
        inProgressRequests: requests.filter((r) => r.status === 'in-progress').length,
        completedRequests: requests.filter((r) => r.status === 'completed').length,
        criticalRequests: requests.filter((r) => r.priority === 'critical').length,
        averageResponseTime: 'N/A',
      } as DashboardStats;
    }
  }
};
