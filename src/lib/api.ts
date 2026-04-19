import { EmergencyRequest, DashboardStats } from '../types';
import { mockRequests } from './mockData';

// API helpers for switching between backend data and local demo data.
// Demo mode keeps the local mock path available for UI work without the backend.
const DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const TOKEN_KEY = 'drrcs_token';
const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

// Attach the saved token automatically when the user is signed in.
const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Central request helper so auth headers and ApiResponse unwrapping stay consistent.
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
  const json = await res.json();
  return json?.data ?? json;
};

const mapEmergency = (e: any): EmergencyRequest => ({
  id: e.id,
  trackingCode: e.trackingCode,
  timestamp: e.timestamp ?? e.createdAt,
  disasterType: e.disasterType ?? e.type ?? e.emergencyType,
  category: e.category,
  priority: (e.priority ?? 'low').toLowerCase() as any,
  // Backend may use UPPER_CASE or UPPER-CASE statuses — normalise to lower-hyphen
  status: ((e.status ?? 'pending') as string).toLowerCase().replace(/_/g, '-') as any,
  location: e.location ?? { address: e.address ?? '' },
  description: e.description,
  contactName: e.contactName ?? e.requesterName ?? e.reportedBy,
  contactPhone: e.contactPhone ?? e.requesterPhone,
  assignedResources: e.assignedResources ?? e.resources ?? [],
  assignedTo: e.assignedTo ?? e.assignedVolunteerId,
  assigneeName: e.assigneeName,
  notes: e.notes,
  completionNotes: e.notes ?? e.completionNotes,
  updatedAt: e.updatedAt,
  completedAt: e.completedAt,
  completedBy: e.completedBy,
});

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
    notes: e.notes,
    completionNotes: e.completionNotes ?? e.notes,
    updatedAt: e.updatedAt,
    completedAt: e.completedAt,
    completedBy: e.completedBy,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Local storage helpers used only when demo mode is enabled.
// ─────────────────────────────────────────────────────────────────────────────
const REQUESTS_STORAGE_KEY = 'drrcs_requests_store';

const simulateDelay = () => delay(300);

const getStoredRequests = (): EmergencyRequest[] => {
  try {
    const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as EmergencyRequest[];
    }
  } catch {
    // Fall back to seeded data
  }

  const seeded = [...mockRequests];
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(seeded));
  } catch {
    // Ignore storage write failures and continue in-memory
  }
  return seeded;
};

const saveStoredRequests = (requests: EmergencyRequest[]): void => {
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // Ignore storage write failures in mock mode
  }
};

export const api = {
  // ── Authentication ──────────────────────────────────────────────────────────

  /**
   * Authenticate a user against the backend or the local demo store.
   */
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    if (!DEMO_MODE) {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      return { token: data.token, user: data };
    }
    await simulateDelay();
    if (username && password) {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          username,
          name: 'Admin User',
          role: 'admin'
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  /**
   * Clear the local session. JWT logout is handled client-side.
   */
  async logout(): Promise<void> {
    if (!DEMO_MODE) {
      localStorage.removeItem(TOKEN_KEY);
      return;
    }
    await simulateDelay();
    localStorage.removeItem('auth_token');
  },

// ── Emergency Requests ──────────────────────────────────────────────────────

  /**
   * Fetch requests visible to the current user.
   */
  async getRequests(): Promise<EmergencyRequest[]> {
    if (!DEMO_MODE) {
      const data = await apiFetch('/emergencies/visible');
      const items: any[] = Array.isArray(data) ? data : (data.content ?? data.items ?? []);
      return items.map(mapEmergencyRecord);
    }
    await simulateDelay();
    return [...getStoredRequests()];
  },

  /**
   * Fetch a single request. Returns null if it cannot be loaded.
   */
  async getRequestById(id: string): Promise<EmergencyRequest | null> {
    if (!DEMO_MODE) {
      try {
        const data = await apiFetch(`/emergencies/${id}`);
        return mapEmergencyRecord(data);
      } catch (err) {
        console.error(`getRequestById(${id}) failed:`, err);
        return null;
      }
    }
    await simulateDelay();
    const requests = getStoredRequests();
    return requests.find(req => req.id === id) || null;
  },

  /**
   * Create a new emergency request.
   */
  async createRequest(request: Omit<EmergencyRequest, 'id' | 'timestamp'>): Promise<EmergencyRequest> {
    if (!DEMO_MODE) {
      const data = await apiFetch('/emergencies/public/requests', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return mapEmergencyRecord(data);
    }
    await simulateDelay();
    const requests = getStoredRequests();
    const newRequest: EmergencyRequest = {
      ...request,
      id: `REQ-2026-${String(requests.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString()
    };
    requests.push(newRequest);
    saveStoredRequests(requests);
    return newRequest;
  },

  /**
   * Update a request record.
   */
  async updateRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    if (!DEMO_MODE) {
      const data = await apiFetch(`/emergencies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return mapEmergencyRecord(data);
    }
    await simulateDelay();
    const requests = getStoredRequests();
    const index = requests.findIndex(req => req.id === id);
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveStoredRequests(requests);
      return requests[index];
    }
    throw new Error('Request not found');
  },

  /**
   * Update only the request status.
   */
  async updateRequestStatus(id: string, status: string, notes?: string): Promise<EmergencyRequest> {
    if (!DEMO_MODE) {
      const backendStatus = status.toUpperCase().replace(/-/g, '_');
      const data = await apiFetch(`/emergencies/${id}/status?status=${backendStatus}`, {
        method: 'PATCH',
      });
      return mapEmergencyRecord(data);
    }
    await simulateDelay();
    return this.updateRequest(id, { 
      status: status as any, 
      notes,
      ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
    });
  },

  /**
   * Assign resources or an assignee to a request.
   */
  async assignResources(id: string, resources: string[], assignedTo?: string): Promise<EmergencyRequest> {
    if (!DEMO_MODE) {
      const data = await apiFetch(`/emergencies/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ resources, assignedTo }),
      });
      return mapEmergencyRecord(data);
    }
    await simulateDelay();
    return this.updateRequest(id, {
      assignedResources: resources,
      assignedTo,
      status: 'assigned'
    });
  },

  // ── Dashboard Stats ─────────────────────────────────────────────────────────

  /**
   * Load summary counts for dashboard cards.
   */
  async getDashboardStats(): Promise<DashboardStats> {
    if (!DEMO_MODE) {
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
        // Fall back to mock if user doesn't have ADMIN/COORDINATOR role
        const requests = getStoredRequests();
        return {
          totalRequests: requests.length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          inProgressRequests: requests.filter(r => r.status === 'in-progress').length,
          completedRequests: requests.filter(r => r.status === 'completed').length,
          criticalRequests: requests.filter(r => r.priority === 'critical').length,
          averageResponseTime: '24 min',
        };
      }
    }
    await simulateDelay();
    const requests = getStoredRequests();
    const pending = requests.filter(r => r.status === 'pending').length;
    const inProgress = requests.filter(r => r.status === 'in-progress').length;
    const completed = requests.filter(r => r.status === 'completed').length;
    const critical = requests.filter(r => r.priority === 'critical').length;

    return {
      totalRequests: requests.length,
      pendingRequests: pending,
      inProgressRequests: inProgress,
      completedRequests: completed,
      criticalRequests: critical,
      averageResponseTime: '24 min'
    };
  }
};
