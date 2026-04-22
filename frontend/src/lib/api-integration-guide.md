# Backend Integration Guide

This frontend application is designed to integrate with your Java Spring Boot backend. The mock API functions in `/src/app/lib/api.ts` need to be replaced with actual HTTP calls to your backend.

## API Endpoints to Implement

### Authentication
- `POST /api/auth/login` - Login with username/password, returns JWT token
- `POST /api/auth/logout` - Logout current user

### Emergency Requests
- `GET /api/requests` - Get all emergency requests
- `GET /api/requests/{id}` - Get specific request by ID
- `POST /api/requests` - Create new emergency request
- `PUT /api/requests/{id}` - Update entire request
- `PATCH /api/requests/{id}/status` - Update request status
- `PATCH /api/requests/{id}/assign` - Assign resources to request

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Request/Response Format

### Emergency Request Object
```json
{
  "id": "REQ-2026-001",
  "timestamp": "2026-02-25T08:15:00Z",
  "disasterType": "flood",
  "category": "rescue",
  "priority": "critical",
  "status": "in-progress",
  "location": {
    "address": "123 River Street, Houston, TX 77002",
    "coordinates": {
      "lat": 29.7604,
      "lng": -95.3698
    }
  },
  "description": "Family of 4 trapped...",
  "contactName": "Sarah Johnson",
  "contactPhone": "+1-555-0101",
  "assignedResources": ["Rescue Boat Team A", "Medical Unit 3"],
  "assignedTo": "Team Alpha",
  "notes": "Priority evacuation needed",
  "updatedAt": "2026-02-25T09:30:00Z",
  "completedAt": null
}
```

## JWT Authentication

The frontend expects JWT tokens to be stored in localStorage as `auth_token` and will send them in the Authorization header:

```
Authorization: Bearer {token}
```

## Kafka Events (Backend Only)

Your backend should publish these events to Kafka for async processing:
- `request.created` - When a new request is submitted
- `request.assigned` - When resources are assigned
- `request.status.updated` - When status changes
- `request.completed` - When a request is marked complete

## CORS Configuration

Make sure your Spring Boot backend allows CORS from your frontend origin:

```java
@CrossOrigin(origins = "http://localhost:5173") // Vite dev server
```

## MongoDB Collections

Suggested collections:
- `emergency_requests` - Main request data
- `users` - User accounts and authentication
- `audit_logs` - Track all changes for compliance

## Environment Variables

Create a `.env` file in the root with:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

Then update `/src/app/lib/api.ts` to use:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```
