// Mock data for dashboard and requests
export const mockRequests = [
  {
    id: 'REQ-2026-001',
    timestamp: '2026-02-25T08:15:00Z',
    disasterType: 'flood',
    category: 'rescue',
    priority: 'critical',
    status: 'in-progress',
    location: {
      address: '123 River Street, Houston, TX 77002',
      coordinates: { lat: 29.7604, lng: -95.3698 }
    },
    description: 'Family of 4 trapped on second floor due to rising flood waters. Water level is at 6 feet.',
    contactName: 'Sarah Johnson',
    contactPhone: '+1-555-0101',
    assignedResources: ['Rescue Boat Team A', 'Medical Unit 3'],
    assignedTo: 'Team Alpha',
    notes: 'Priority evacuation needed. Children present.',
    updatedAt: '2026-02-25T09:30:00Z'
  },
  {
    id: 'REQ-2026-002',
    timestamp: '2026-02-25T07:45:00Z',
    disasterType: 'earthquake',
    category: 'medical',
    priority: 'critical',
    status: 'assigned',
    location: {
      address: '456 Oak Avenue, Los Angeles, CA 90012',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    description: 'Multiple injuries reported. Building partially collapsed. Approximately 8 people injured.',
    contactName: 'Michael Chen',
    contactPhone: '+1-555-0102',
    assignedResources: ['Ambulance Unit 5', 'Search & Rescue Team B'],
    assignedTo: 'Team Bravo',
    updatedAt: '2026-02-25T08:00:00Z'
  },
  {
    id: 'REQ-2026-003',
    timestamp: '2026-02-25T09:20:00Z',
    disasterType: 'hurricane',
    category: 'shelter',
    priority: 'high',
    status: 'pending',
    location: {
      address: '789 Beach Road, Miami, FL 33101',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    description: 'Family of 6 needs emergency shelter. Home damaged by hurricane winds.',
    contactName: 'Lisa Martinez',
    contactPhone: '+1-555-0103',
    updatedAt: '2026-02-25T09:20:00Z'
  },
  {
    id: 'REQ-2026-004',
    timestamp: '2026-02-25T10:05:00Z',
    disasterType: 'wildfire',
    category: 'evacuation',
    priority: 'high',
    status: 'completed',
    location: {
      address: '321 Forest Lane, Santa Rosa, CA 95401',
      coordinates: { lat: 38.4404, lng: -122.7141 }
    },
    description: 'Immediate evacuation needed. Wildfire approaching residential area.',
    contactName: 'David Kim',
    contactPhone: '+1-555-0104',
    assignedResources: ['Evacuation Bus 2', 'Fire Crew C'],
    assignedTo: 'Team Charlie',
    completedAt: '2026-02-25T11:30:00Z',
    updatedAt: '2026-02-25T11:30:00Z'
  },
  {
    id: 'REQ-2026-005',
    timestamp: '2026-02-25T11:15:00Z',
    disasterType: 'tornado',
    category: 'medical',
    priority: 'medium',
    status: 'pending',
    location: {
      address: '654 Main Street, Oklahoma City, OK 73102',
      coordinates: { lat: 35.4676, lng: -97.5164 }
    },
    description: 'Elderly couple needs medical attention. Minor injuries from tornado debris.',
    contactName: 'Robert Wilson',
    contactPhone: '+1-555-0105',
    updatedAt: '2026-02-25T11:15:00Z'
  },
  {
    id: 'REQ-2026-006',
    timestamp: '2026-02-25T06:30:00Z',
    disasterType: 'flood',
    category: 'food',
    priority: 'medium',
    status: 'completed',
    location: {
      address: '987 Valley Road, New Orleans, LA 70112',
      coordinates: { lat: 29.9511, lng: -90.0715 }
    },
    description: 'Neighborhood of 50 families needs food and water supplies.',
    contactName: 'Patricia Brown',
    contactPhone: '+1-555-0106',
    assignedResources: ['Supply Truck 4', 'Distribution Team D'],
    assignedTo: 'Team Delta',
    completedAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z'
  },
  {
    id: 'REQ-2026-007',
    timestamp: '2026-02-25T12:00:00Z',
    disasterType: 'earthquake',
    category: 'supplies',
    priority: 'low',
    status: 'assigned',
    location: {
      address: '147 Park Avenue, San Francisco, CA 94102',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    description: 'Community center needs emergency supplies: blankets, first aid kits.',
    contactName: 'Jennifer Lee',
    contactPhone: '+1-555-0107',
    assignedTo: 'Team Echo',
    updatedAt: '2026-02-25T12:15:00Z'
  }
];

export const mockDashboardStats = {
  totalRequests: 24,
  pendingRequests: 8,
  inProgressRequests: 5,
  completedRequests: 9,
  criticalRequests: 3,
  highPriorityRequests: 5,
  activeVolunteers: 156,
  availableResources: 42
};

export const requestTrendData = [
  { time: '00:00', requests: 2 },
  { time: '04:00', requests: 1 },
  { time: '08:00', requests: 5 },
  { time: '12:00', requests: 3 },
  { time: '16:00', requests: 2 },
  { time: '20:00', requests: 4 },
];

export const categoryData = [
  { name: 'Rescue', value: 5, color: '#ef4444' },
  { name: 'Medical', value: 6, color: '#f59e0b' },
  { name: 'Shelter', value: 4, color: '#3b82f6' },
  { name: 'Food', value: 3, color: '#10b981' },
  { name: 'Evacuation', value: 3, color: '#8b5cf6' },
  { name: 'Supplies', value: 3, color: '#6b7280' },
];

export const statusData = [
  { name: 'Pending', value: 8, color: '#eab308' },
  { name: 'Assigned', value: 2, color: '#3b82f6' },
  { name: 'In Progress', value: 5, color: '#8b5cf6' },
  { name: 'Completed', value: 9, color: '#10b981' },
];

export const priorityData = [
  { name: 'Critical', value: 3, color: '#ef4444' },
  { name: 'High', value: 5, color: '#f97316' },
  { name: 'Medium', value: 10, color: '#eab308' },
  { name: 'Low', value: 6, color: '#22c55e' },
];
