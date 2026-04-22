export type DisasterType = 'flood' | 'earthquake' | 'hurricane' | 'wildfire' | 'tornado' | 'other';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type RequestStatus = 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
export type RequestCategory = 'medical' | 'shelter' | 'food' | 'rescue' | 'evacuation' | 'supplies' | 'other';

export interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyRequest {
  id: string;
  timestamp: string;
  disasterType: DisasterType;
  category: RequestCategory;
  priority: Priority;
  status: RequestStatus;
  location: Location;
  description: string;
  contactName: string;
  contactPhone: string;
  assignedResources?: string[];
  assignedTo?: string;
  notes?: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  criticalRequests: number;
  averageResponseTime: string;
}
