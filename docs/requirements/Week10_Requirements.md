# Week 10: API Integration Phase 2

## Overview
Week 10 focused on extending the backend integration into dashboard operations, request tracking, role-aware visibility, and dynamic updates. This phase made the frontend behave like a connected system instead of a mock-only interface.

---

## Week 10 Requirements (Implemented)

### 1) Integrate Admin and Volunteer Endpoints
**Status:** Completed

**Implemented:**
- Connected dashboard request loading to backend emergency endpoints.
- Added role-aware request visibility for admins, coordinators, volunteers, and organization users.
- Preserved request assignment/update flows using backend APIs.
- Kept dashboard request detail access tied to real backend records.

**Files:**
- `src/lib/api.ts`
- `src/components/dashboard/DashboardPage.jsx`
- `src/pages/RequestDetailPage.jsx`
- `backend/src/main/java/com/lewis/disaster_relief_platform/emergency/controller/EmergencyController.java`
- `backend/src/main/java/com/lewis/disaster_relief_platform/emergency/repository/EmergencyRepository.java`
- `backend/src/main/java/com/lewis/disaster_relief_platform/emergency/service/EmergencyService.java`

---

### 2) Implement Dynamic Updates
**Status:** Completed

**Implemented:**
- Dashboard request cards now load real request records.
- Analytics charts now derive values from live request data instead of placeholders.
- Request tracking uses real backend data and real tracking codes.
- Assignment and status updates persist through backend APIs and appear on later fetches.

**Files:**
- `src/lib/api.ts`
- `src/services/requestService.js`
- `src/components/dashboard/DashboardPage.jsx`
- `src/pages/AnalyticsPage.tsx`
- `src/pages/RequestTrackingPage.jsx`

---

### 3) Connect Tracking to Backend Request Records
**Status:** Completed

**Implemented:**
- Connected public tracking page to the backend public tracking endpoint.
- Updated request tracking examples and placeholder text to match the real tracking format.
- Changed tracking code generation to use the submitter’s name instead of a hardcoded prefix.
- Verified tracking works with returned backend-generated tracking codes.

**Files:**
- `src/pages/RequestTrackingPage.jsx`
- `src/services/requestService.js`
- `backend/src/main/java/com/lewis/disaster_relief_platform/emergency/service/EmergencyService.java`

---

### 4) Improve Connected UI Reliability and Readability
**Status:** Completed

**Implemented:**
- Improved dark/light mode readability on auth, request, dashboard, and modal screens.
- Added better navigation between auth pages and the public website.
- Cleaned up connected request pages so backend-driven states remain readable and usable.

**Files:**
- `src/styles/index.css`
- `src/pages/AuthPages.css`
- `src/components/auth/AuthForms.css`
- `src/components/users/UsersPage.css`
- `src/pages/RequestSubmissionPage.css`
- `src/pages/RequestTrackingPage.css`

---

## How the Frontend and Backend Are Connected

### Authentication
- Frontend login calls the backend auth API.
- Auth state is then used to protect dashboard routes.

### Emergency Requests
- Public request form submits to backend public request endpoints.
- The backend validates and stores requests in MongoDB.

### Dashboard
- Dashboard pages load backend-provided request records.
- The frontend maps backend fields into the UI display model.

### Tracking
- Tracking page calls the backend public tracking endpoint.
- Returned tracking IDs and request states are displayed to the user.

### Dynamic Data
- Charts, recent requests, and detail views now depend on persisted request data rather than placeholder values.

---

## Notes for Teammates / Handoff

- The main goal was to connect the frontend to the backend while preserving the existing backend ideas and workflow structure.
- Backend-side changes were limited to connection support, validation alignment, request visibility, tracking, and local reliability.
- MongoDB-backed submission and retrieval were verified in the connected flow.
- Kafka was disabled for local development so request submission would not fail when Kafka is not running.
- Deployment/environment notes were added separately for future hosting.

---

## Functional Outcomes

- Admin and volunteer-related request views are connected to backend data.
- Request tracking uses real backend request records.
- Tracking IDs now follow the request creator name pattern.
- Dashboard and analytics now reflect real request data.
- Connected pages are more usable in both light and dark mode.

---

## Deliverables Checklist

- [x] Admin endpoints integrated
- [x] Volunteer/request visibility integrated
- [x] Dynamic updates implemented
- [x] Tracking connected to backend
- [x] Live data rendering improved across dashboard surfaces
- [x] Teammate handoff notes documented

---

## Recommended Next Steps

- Have the backend owner review the integration-level backend changes.
- Deploy frontend, backend, and MongoDB together for production use.
- Run final end-to-end validation on login, submission, tracking, visibility, and assignment.
