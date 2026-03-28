import { EmergencyRequest, DashboardStats } from '../types';
import { mockRequests } from './mockData';

// ORIGINAL: Mock API functions that will be replaced with actual API calls to
//           Java Spring Boot backend.  The originals are preserved below each
//           method (commented out) so they can be quickly restored if needed.

// ─────────────────────────────────────────────────────────────────────────────
// NEW: Backend connection helpers
// ─────────────────────────────────────────────────────────────────────────────

// NEW: Feature flag — set VITE_ENABLE_DEMO_MODE=true in .env to skip all real
//      API calls and use local mock data instead (handy for offline UI work).
const DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

// ORIGINAL: kept as-is — read from .env or fall back to Spring Boot dev port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// NEW: Reads the JWT that AuthContext stores under 'drrcs_token' so every
//      request can send it in the Authorization header automatically.
const TOKEN_KEY = 'drrcs_token';
const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

// NEW: Builds the common request headers:
//      - Content-Type always set to JSON
//      - Authorization: Bearer <token> added whenever a token is present
const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// NEW: Thin fetch wrapper shared by all backend calls.
//      - Merges authHeaders() with any caller-supplied headers/options.
//      - Unwraps Spring Boot's optional ApiResponse<T> envelope (json.data)
//        so callers always receive the plain payload object.
//      - Throws a descriptive Error on non-2xx so callers can .catch().
// NOTE: all paths must include /v1/ to match backend RequestMapping
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
  // Unwrap envelope: Spring Boot returns { data: T, message: '...' } or just T
  return json?.data ?? json;
};

// NEW: Maps a raw backend emergency object to the frontend EmergencyRequest
//      shape.  Both camelCase variants of each field are tried so the mapping
//      stays resilient to small naming differences between backend versions.
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
// ORIGINAL: Mock helpers (kept for demo / offline mode)
// ─────────────────────────────────────────────────────────────────────────────
const REQUESTS_STORAGE_KEY = 'drrcs_requests_store';

// Simulate network delay
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
   * Login — POST /api/auth/login
   * NEW: When DEMO_MODE is off, calls the real backend and returns the JWT +
   *      user from Spring Security.  The mock path below is preserved for
   *      offline / demo use.
   */
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    // ── NEW: Real backend ──────────────────────────────────────────────────
    if (!DEMO_MODE) {
      // ORIGINAL: body: JSON.stringify({ email: username, password }),
      // NEW FIX: backend LoginRequest expects { username, password } not email
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      return { token: data.token, user: data };
    }
    // ── ORIGINAL: mock path (commented out — kept for reference / demo mode) ──
    await simulateDelay();
    // Mock JWT token - replace with actual API call
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
   * Logout — no backend call needed for stateless JWT.
   * NEW: When DEMO_MODE is off just clears localStorage; original mock kept.
   */
  async logout(): Promise<void> {
    // ── NEW: Real backend ──────────────────────────────────────────────────
    if (!DEMO_MODE) {
      // JWT is stateless — just remove the token from localStorage
      localStorage.removeItem(TOKEN_KEY);
      return;
    }
    // ── ORIGINAL: mock path ─────────────────────────────────────────────────
    await simulateDelay();
    // Replace with actual API call
    localStorage.removeItem('auth_token');
  },

// ── Emergency Requests ──────────────────────────────────────────────────────

  /**
   * Get all emergency requests — GET /api/emergencies
   * NEW: When DEMO_MODE is off, fetches the live list from the backend and
   *      maps each item to the frontend EmergencyRequest shape.
   */
  async getRequests(): Promise<EmergencyRequest[]> {
    // ── NEW: Real backend ──────────────────────────────────────────────────
    if (!DEMO_MODE) {
      // Backend: GET /api/v1/emergencies (ADMIN or COORDINATOR only)
      // Returns PageResponse<EmergencyResponse> — handle both paginated and plain array
      const data = await apiFetch('/emergencies/visible');
      const items: any[] = Array.isArray(data) ? data : (data.content ?? data.items ?? []);
      return items.map(mapEmergencyRecord);
    }
    // ── ORIGINAL: mock path ─────────────────────────────────────────────────
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests`, { headers: { Authorization: `Bearer ${token}` } })
    return [...getStoredRequests()];
  },

  /**
   * Get one emergency request by ID — GET /api/emergencies/{id}
   * NEW: Real backend call; original localStorage lookup kept below.
   */
  async getRequestById(id: string): Promise<EmergencyRequest | null> {
    // ── NEW: Real backend ──────────────────────────────────────────────────
    if (!DEMO_MODE) {
      try {
        const data = await apiFetch(`/emergencies/${id}`);
        return mapEmergencyRecord(data);
      } catch (err) {
        console.error(`getRequestById(${id}) failed:`, err);
        return null;
      }
    }
    // ── ORIGINAL: mock path ─────────────────────────────────────────────────
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    const requests = getStoredRequests();
    return requests.find(req => req.id === id) || null;
  },

  /**
   * Submit a new emergency request — POST /api/emergencies
   * NEW: Real backend call; original localStorage version kept below.
   */
  async createRequest(request: Omit<EmergencyRequest, 'id' | 'timestamp'>): Promise<EmergencyRequest> {
    // ── NEW: Real backend ──────────────────────────────────────────────────
    if (!DEMO_MODE) {
      // POST /api/v1/emergencies/public/requests — no auth required
      // The body must match backend EmergencyRequest exactly (see EmergencyRequest.java)
      const data = await apiFetch('/emergencies/public/requests', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return mapEmergencyRecord(data);
    }
    // ── ORIGINAL: mock path ─────────────────────────────────────────────────
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests`, { method: 'POST', body: JSON.stringify(request) })
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
   * Update an emergency request — PUT /api/emergencies/{id}
   * NEW: Real backend call; original localStorage version kept below.
   */
  async updateRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    // ── NEW: Real backend ──────────────────────────────────────────────────
    if (!DEMO_MODE) {
      const data = await apiFetch(`/emergencies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return mapEmergencyRecord(data);
    }
    // ── ORIGINAL: mock path ─────────────────────────────────────────────────
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
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
   * Update the status of an emergency request — PATCH /api/emergencies/{id}/status
   * NEW: Real backend PATCH call; original fallback kept below.
   */
  async updateRequestStatus(id: string, status: string, notes?: string): Promise<EmergencyRequest> {
    // ── NEW: Real backend ──────────────────────────────────────────────────
    if (!DEMO_MODE) {
      // Backend: PATCH /api/v1/emergencies/{id}/status?status=IN_PROGRESS
      // Status must be uppercase enum value matching backend Status enum
      const backendStatus = status.toUpperCase().replace(/-/g, '_');
      const data = await apiFetch(`/emergencies/${id}/status?status=${backendStatus}`, {
        method: 'PATCH',
      });
      return mapEmergencyRecord(data);
    }
    // ── ORIGINAL: mock path ─────────────────────────────────────────────────
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) })
    return this.updateRequest(id, { 
      status: status as any, 
      notes,
      ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
    });
  },

  /**
   * Assign resources to a request — PATCH /api/emergencies/{id}/assign
   * NEW: Real backend PATCH call; original fallback kept below.
   */
  async assignResources(id: string, resources: string[], assignedTo?: string): Promise<EmergencyRequest> {
    // ── NEW: Real backend ──────────────────────────────────────────────────
    if (!DEMO_MODE) {
      const data = await apiFetch(`/emergencies/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ resources, assignedTo }),
      });
      return mapEmergencyRecord(data);
    }
    // ── ORIGINAL: mock path ─────────────────────────────────────────────────
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ resources, assignedTo }) })
    return this.updateRequest(id, {
      assignedResources: resources,
      assignedTo,
      status: 'assigned'
    });
  },

  // ── Dashboard Stats ─────────────────────────────────────────────────────────

  /**
   * Get dashboard statistics — GET /api/dashboard/stats
   * NEW: Real backend call; original computed-from-localStorage version kept below.
   */
  async getDashboardStats(): Promise<DashboardStats> {
    // ── NEW: Real backend ──────────────────────────────────────────────────
    if (!DEMO_MODE) {
      // Backend: GET /api/v1/emergencies/stats (ADMIN or COORDINATOR)
      // Returns { total, pending, resolved, in_progress }
      // We map it to the frontend DashboardStats shape.
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
    // ── ORIGINAL: mock path (computes stats from localStorage) ─────────────
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
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
