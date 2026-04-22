import { EmergencyRequest } from '../types';

export const mockRequests: EmergencyRequest[] = [
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
    description: 'Elderly couple needs immediate evacuation to shelter. Home damaged by hurricane winds.',
    contactName: 'Robert Martinez',
    contactPhone: '+1-555-0103',
    notes: 'Mobility issues - wheelchair required.'
  },
  {
    id: 'REQ-2026-004',
    timestamp: '2026-02-25T06:30:00Z',
    disasterType: 'wildfire',
    category: 'evacuation',
    priority: 'critical',
    status: 'completed',
    location: {
      address: '321 Forest Lane, San Diego, CA 92101',
      coordinates: { lat: 32.7157, lng: -117.1611 }
    },
    description: 'Immediate evacuation needed for neighborhood of 50+ families. Fire spreading rapidly.',
    contactName: 'Jennifer Davis',
    contactPhone: '+1-555-0104',
    assignedResources: ['Evacuation Bus Fleet', 'Police Unit 7', 'Fire Department'],
    assignedTo: 'Team Charlie',
    completedAt: '2026-02-25T08:45:00Z',
    updatedAt: '2026-02-25T08:45:00Z'
  },
  {
    id: 'REQ-2026-005',
    timestamp: '2026-02-25T10:00:00Z',
    disasterType: 'flood',
    category: 'food',
    priority: 'medium',
    status: 'pending',
    location: {
      address: '654 Main Street, New Orleans, LA 70112',
      coordinates: { lat: 29.9511, lng: -90.0715 }
    },
    description: 'Shelter with 200 people needs food and water supplies urgently.',
    contactName: 'David Thompson',
    contactPhone: '+1-555-0105'
  },
  {
    id: 'REQ-2026-006',
    timestamp: '2026-02-25T05:15:00Z',
    disasterType: 'tornado',
    category: 'medical',
    priority: 'high',
    status: 'completed',
    location: {
      address: '987 Park Avenue, Oklahoma City, OK 73102',
      coordinates: { lat: 35.4676, lng: -97.5164 }
    },
    description: 'Tornado damage. Multiple minor injuries and one critical injury requiring immediate transport.',
    contactName: 'Lisa Anderson',
    contactPhone: '+1-555-0106',
    assignedResources: ['Ambulance Unit 2', 'Medical Team Delta'],
    assignedTo: 'Team Delta',
    completedAt: '2026-02-25T07:00:00Z',
    updatedAt: '2026-02-25T07:00:00Z'
  },
  {
    id: 'REQ-2026-007',
    timestamp: '2026-02-25T09:45:00Z',
    disasterType: 'earthquake',
    category: 'supplies',
    priority: 'medium',
    status: 'assigned',
    location: {
      address: '147 Hill Street, San Francisco, CA 94102',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    description: 'Community center serving as temporary shelter needs blankets, first aid kits, and water.',
    contactName: 'Maria Garcia',
    contactPhone: '+1-555-0107',
    assignedResources: ['Supply Truck 4'],
    assignedTo: 'Team Echo',
    updatedAt: '2026-02-25T10:15:00Z'
  },
  {
    id: 'REQ-2026-008',
    timestamp: '2026-02-25T08:00:00Z',
    disasterType: 'flood',
    category: 'rescue',
    priority: 'high',
    status: 'in-progress',
    location: {
      address: '258 Valley Road, Houston, TX 77003',
      coordinates: { lat: 29.7604, lng: -95.3698 }
    },
    description: 'Elderly person trapped in home. Cannot evacuate without assistance.',
    contactName: 'James Wilson',
    contactPhone: '+1-555-0108',
    assignedResources: ['Rescue Team C'],
    assignedTo: 'Team Foxtrot',
    updatedAt: '2026-02-25T09:00:00Z'
  },
  {
    id: 'REQ-2026-009',
    timestamp: '2026-02-25T07:00:00Z',
    disasterType: 'hurricane',
    category: 'shelter',
    priority: 'low',
    status: 'completed',
    location: {
      address: '369 Coastal Drive, Tampa, FL 33602',
      coordinates: { lat: 27.9506, lng: -82.4572 }
    },
    description: 'Family of 3 needs shelter placement after home flooding.',
    contactName: 'Patricia Brown',
    contactPhone: '+1-555-0109',
    assignedResources: ['Shelter Coordinator'],
    assignedTo: 'Team Golf',
    completedAt: '2026-02-25T08:30:00Z',
    updatedAt: '2026-02-25T08:30:00Z'
  },
  {
    id: 'REQ-2026-010',
    timestamp: '2026-02-25T10:30:00Z',
    disasterType: 'wildfire',
    category: 'other',
    priority: 'low',
    status: 'pending',
    location: {
      address: '741 Mountain View, Denver, CO 80202',
      coordinates: { lat: 39.7392, lng: -104.9903 }
    },
    description: 'Need pet rescue assistance. 2 dogs and 1 cat need evacuation.',
    contactName: 'Christopher Lee',
    contactPhone: '+1-555-0110'
  }
];
