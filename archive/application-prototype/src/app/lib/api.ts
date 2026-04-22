import { EmergencyRequest, DashboardStats } from '../types';
import { mockRequests } from './mockData';

// Mock API functions that will be replaced with actual API calls to Java Spring Boot backend

const API_BASE_URL = 'http://localhost:8080/api'; // Replace with your backend URL
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate network delay
const simulateDelay = () => delay(300);

export const api = {
  // Authentication
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
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

  async logout(): Promise<void> {
    await simulateDelay();
    // Replace with actual API call
    localStorage.removeItem('auth_token');
  },

  // Emergency Requests
  async getRequests(): Promise<EmergencyRequest[]> {
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests`, { headers: { Authorization: `Bearer ${token}` } })
    return [...mockRequests];
  },

  async getRequestById(id: string): Promise<EmergencyRequest | null> {
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    return mockRequests.find(req => req.id === id) || null;
  },

  async createRequest(request: Omit<EmergencyRequest, 'id' | 'timestamp'>): Promise<EmergencyRequest> {
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests`, { method: 'POST', body: JSON.stringify(request) })
    const newRequest: EmergencyRequest = {
      ...request,
      id: `REQ-2026-${String(mockRequests.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString()
    };
    mockRequests.push(newRequest);
    return newRequest;
  },

  async updateRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
    const index = mockRequests.findIndex(req => req.id === id);
    if (index !== -1) {
      mockRequests[index] = {
        ...mockRequests[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return mockRequests[index];
    }
    throw new Error('Request not found');
  },

  async updateRequestStatus(id: string, status: string, notes?: string): Promise<EmergencyRequest> {
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) })
    return this.updateRequest(id, { 
      status: status as any, 
      notes,
      ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
    });
  },

  async assignResources(id: string, resources: string[], assignedTo?: string): Promise<EmergencyRequest> {
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/requests/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ resources, assignedTo }) })
    return this.updateRequest(id, {
      assignedResources: resources,
      assignedTo,
      status: 'assigned'
    });
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    await simulateDelay();
    // Replace with: fetch(`${API_BASE_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
    const requests = mockRequests;
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
