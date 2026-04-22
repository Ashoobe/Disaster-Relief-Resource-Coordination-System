import { DashboardStats, EmergencyRequest } from '../types';
import { mockRequests } from './mockData';

const DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'drrcs_token';
const REMOVED_BROWSER_DATA_KEYS = [
  'drrcs_requests_store',
  'drrcs_request_overrides',
  'drrcs_notifications',
  'drrcs_role_requests',
  'drrcs_request_form_payloads',
  'drrcs_tracking_index',
  'draft_request-form',
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

if (typeof window !== 'undefined') {
  for (const key of REMOVED_BROWSER_DATA_KEYS) {
    window.localStorage.removeItem(key);
  }
}

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const apiFetch = async (path: string, options: RequestInit = {}): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/v1${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }

  if (res.status === 204) {
    return null;
  }

  const json = await res.json().catch(() => null);
  return json?.data ?? json;
};

const normalizeStatus = (value: unknown): EmergencyRequest['status'] => {
  const normalized = String(value ?? 'pending').toLowerCase().replace(/_/g, '-');

  switch (normalized) {
    case 'resolved':
      return 'completed';
    case 'assigned':
      return 'assigned';
    case 'in-progress':
      return 'in-progress';
    case 'cancelled':
      return 'cancelled';
    case 'pending-verification':
    case 'pending':
    default:
      return 'pending';
  }
};

const toBackendStatus = (status: string): string => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case 'completed':
      return 'RESOLVED';
    case 'in-progress':
      return 'IN_PROGRESS';
    case 'assigned':
      return 'ASSIGNED';
    case 'cancelled':
      return 'CANCELLED';
    case 'pending':
    default:
      return 'PENDING';
  }
};

const normalizeDisasterType = (value: unknown): EmergencyRequest['disasterType'] => {
  const normalized = String(value ?? '').toLowerCase().replace(/_/g, '-');
  return ['flood', 'earthquake', 'hurricane', 'wildfire', 'tornado'].includes(normalized)
    ? normalized as EmergencyRequest['disasterType']
    : 'other';
};

const deriveCategory = (value: unknown): EmergencyRequest['category'] => {
  const normalized = String(value ?? '').toLowerCase().replace(/_/g, '-');

  if (normalized === 'medical') return 'medical';
  if (normalized === 'shelter') return 'shelter';
  if (['food', 'water', 'clothing', 'transportation', 'supplies'].includes(normalized)) return 'supplies';
  if (normalized === 'rescue') return 'rescue';
  if (normalized === 'evacuation') return 'evacuation';

  return 'other';
};

const mapEmergencyRecord = (raw: any): EmergencyRequest => {
  const location = raw.location ?? {};
  const latitude = location.latitude ?? location.lalitude ?? location.coordinates?.lat;
  const longitude = location.longitude ?? location.coordinates?.lng;

  return {
    id: raw.id,
    trackingCode: raw.trackingCode,
    title: raw.title,
    timestamp: raw.timestamp ?? raw.createdAt ?? new Date().toISOString(),
    disasterType: normalizeDisasterType(raw.disasterType ?? raw.type),
    category: deriveCategory(raw.category ?? raw.type ?? raw.disasterType),
    priority: String(raw.priority ?? 'medium').toLowerCase() as EmergencyRequest['priority'],
    status: normalizeStatus(raw.status),
    location: {
      address:
        location.address ||
        [location.city, location.state, location.country].filter(Boolean).join(', ') ||
        raw.address ||
        'Address not specified',
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      country: location.country,
      ...(latitude != null && longitude != null ? { coordinates: { lat: latitude, lng: longitude } } : {}),
    },
    description: raw.description ?? '',
    contactName: raw.contactName ?? raw.reportedBy ?? raw.requesterName ?? 'Unknown',
    contactPhone: raw.contactPhone ?? raw.requesterPhone ?? '',
    assignedResources: raw.assignedResources ?? raw.requiredResources ?? [],
    assignedTo: raw.assignedTo ?? raw.assignedVolunteerId,
    assigneeName: raw.assigneeName,
    assigneeEmail: raw.assigneeEmail,
    notes: raw.notes,
    completionNotes: raw.completionNotes ?? raw.notes,
    completedAt: raw.completedAt ?? raw.resolvedAt,
    completedBy: raw.completedBy,
    updatedAt: raw.updatedAt,
    createdByUserId: raw.createdByUserId,
  };
};

const simulateDelay = () => delay(300);

export const api = {
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    if (!DEMO_MODE) {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      return { token: data.token, user: data };
    }

    await simulateDelay();
    if (!username || !password) {
      throw new Error('Invalid credentials');
    }

    return {
      token: `mock-jwt-token-${Date.now()}`,
      user: {
        id: '1',
        username,
        name: 'Admin User',
        role: 'admin',
      },
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
    if (DEMO_MODE) {
      await simulateDelay();
    }
  },

  async getRequests(): Promise<EmergencyRequest[]> {
    if (!DEMO_MODE) {
      const data = await apiFetch('/emergencies?page=0&size=200&sortBy=createdAt&sortDirection=DESC');
      const items: any[] = Array.isArray(data) ? data : (data?.content ?? data?.items ?? []);
      return items.map(mapEmergencyRecord);
    }

    await simulateDelay();
    return [...mockRequests];
  },

  async getRequestById(id: string): Promise<EmergencyRequest | null> {
    if (!DEMO_MODE) {
      const data = await apiFetch(`/emergencies/${id}`);
      return mapEmergencyRecord(data);
    }

    await simulateDelay();
    return mockRequests.find((request) => request.id === id || request.trackingCode === id) || null;
  },

  async createRequest(request: Omit<EmergencyRequest, 'id' | 'timestamp'> & Record<string, any>): Promise<EmergencyRequest> {
    if (!DEMO_MODE) {
      const hasToken = !!getToken();
      const path = hasToken ? '/emergencies' : '/emergencies/public/requests';
      const data = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return mapEmergencyRecord(data);
    }

    await simulateDelay();
    return {
      ...request,
      id: `REQ-2026-${String(mockRequests.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
    };
  },

  async updateRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    if (!DEMO_MODE) {
      if (updates.assignedTo) {
        return this.assignVolunteer(id, updates.assignedTo, {
          assigneeName: updates.assigneeName,
          assigneeEmail: updates.assigneeEmail,
        });
      }

      if (updates.status) {
        return this.updateRequestStatus(id, updates.status);
      }

      throw new Error('This backend does not support generic request updates from the frontend.');
    }

    await simulateDelay();
    throw new Error('Demo mode updateRequest is not supported in this flow.');
  },

  async updateRequestStatus(id: string, status: string): Promise<EmergencyRequest> {
    if (!DEMO_MODE) {
      const data = await apiFetch(`/emergencies/${id}/status?status=${encodeURIComponent(toBackendStatus(status))}`, {
        method: 'PATCH',
      });
      return mapEmergencyRecord(data);
    }

    await simulateDelay();
    throw new Error('Demo mode updateRequestStatus is not supported in this flow.');
  },

  async assignVolunteer(
    emergencyId: string,
    volunteerId: string,
    _metadata: { assigneeName?: string; assigneeEmail?: string } = {}
  ): Promise<EmergencyRequest> {
    if (!DEMO_MODE) {
      const data = await apiFetch(`/emergencies/${emergencyId}/${volunteerId}`, {
        method: 'PATCH',
      });
      return mapEmergencyRecord(data);
    }

    await simulateDelay();
    throw new Error('Demo mode assignVolunteer is not supported in this flow.');
  },

  async getDashboardStats(): Promise<DashboardStats> {
    if (!DEMO_MODE) {
      const data = await apiFetch('/emergencies/stats');
      return {
        totalRequests: data.total ?? 0,
        pendingRequests: data.pending ?? 0,
        inProgressRequests: data.in_progress ?? 0,
        completedRequests: data.resolved ?? 0,
        criticalRequests: 0,
        averageResponseTime: data.averageResponseTime ?? 'N/A',
      };
    }

    await simulateDelay();
    return {
      totalRequests: mockRequests.length,
      pendingRequests: mockRequests.filter((request) => request.status === 'pending').length,
      inProgressRequests: mockRequests.filter((request) => request.status === 'in-progress').length,
      completedRequests: mockRequests.filter((request) => request.status === 'completed').length,
      criticalRequests: mockRequests.filter((request) => request.priority === 'critical').length,
      averageResponseTime: '24 min',
    };
  },
};
