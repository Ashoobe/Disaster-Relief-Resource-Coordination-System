# Week 9: API Integration Phase 1

## Overview
Week 9 focused on the first phase of live API integration. The goal was to replace mocked/demo behavior with real backend-connected flows for authentication and emergency request submission, while also improving validation and user-facing error handling.

---

## Week 9 Requirements (Implemented)

### 1) Connect Authentication Endpoints
**Status:** Completed

**Implemented:**
- Connected login flow to the backend authentication endpoint.
- Aligned frontend login payload to use the backend-supported `username` and `password` fields.
- Preserved protected route behavior through the auth context.
- Improved login redirect timing after successful authentication.

**Files:**
- `src/services/authService.js`
- `src/context/AuthContext.jsx`
- `src/components/auth/LoginForm.jsx`
- `src/pages/LoginPage.jsx`

---

### 2) Connect Request Submission Endpoints
**Status:** Completed

**Implemented:**
- Replaced request submission mock behavior with real backend submission.
- Mapped frontend form data into the backend emergency request format.
- Connected public emergency request submission to backend persistence.
- Verified submission storage through the backend into MongoDB.

**Files:**
- `src/services/requestService.js`
- `src/lib/api.ts`
- `src/components/requests/RequestForm.jsx`
- `backend/src/main/java/com/lewis/disaster_relief_platform/emergency/controller/EmergencyController.java`
- `backend/src/main/java/com/lewis/disaster_relief_platform/emergency/service/EmergencyService.java`

---

### 3) Implement Error Handling Messages
**Status:** Completed

**Implemented:**
- Added clearer login failure handling.
- Added visible request submission error feedback.
- Prevented silent failures when network/backend requests fail.
- Improved validation before submit so users see actionable messages earlier.

**Files:**
- `src/components/auth/LoginForm.jsx`
- `src/services/authService.js`
- `src/services/requestService.js`
- `src/utils/requestValidation.js`

---

### 4) Strengthen Request Validation for Real Submission
**Status:** Completed

**Implemented:**
- Added required exact address field for emergency requests.
- Enforced city as a required field.
- Aligned frontend validation with backend validation for location data.
- Ensured request payload sends the real address entered by the user.

**Files:**
- `src/components/requests/RequestForm.jsx`
- `src/utils/requestValidation.js`
- `src/services/requestService.js`
- `backend/src/main/java/com/lewis/disaster_relief_platform/emergency/dto/request/LocationRequest.java`
- `backend/src/main/java/com/lewis/disaster_relief_platform/emergency/service/EmergencyService.java`

---

## Functional Outcomes

- Users can log in through the backend instead of frontend-only mock behavior.
- Emergency requests submit through the backend and save to MongoDB.
- Users now receive visible feedback on invalid login, invalid form input, or request submission problems.
- Emergency requests now require an actionable exact address.

---

## Deliverables Checklist

- [x] Authentication endpoints connected
- [x] Request submission endpoints connected
- [x] Error handling improved
- [x] Request validation aligned with backend
- [x] MongoDB-backed request persistence verified

---

## Notes for Week 10

- Use real backend request data in dashboard and tracking views.
- Connect admin and volunteer request workflows.
- Replace placeholder summaries/charts with live request-driven data.
