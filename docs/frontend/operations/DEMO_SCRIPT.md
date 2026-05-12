# Demo Script

## Goal

Present the DRRCS frontend as a complete flow:

1. a public user can discover the system and submit a request
2. the request can be tracked publicly
3. internal users can manage the request through role-based dashboards

This script is designed for a short live demo or recorded walkthrough.

---

## Demo Setup

Before starting, prepare:

- frontend running locally or from a deployed URL
- backend API reachable through `VITE_API_BASE_URL`
- one admin account
- one volunteer account
- one organization staff account
- at least one existing request record if you want to avoid creating everything live

Recommended backup plan:

- keep one browser tab logged in as admin
- keep one browser tab or private window ready for volunteer or organization staff
- keep one tracking code available in a notes file in case live submission is slow

---

## Demo Flow

### 1) Introduce the Public Site

Route:
- `/`

Talking points:
- This is the public landing page for the Disaster Relief Resource Coordination System.
- Visitors can learn about the platform, view services, check live activity, and submit requests.
- The public experience uses shared navigation and footer components for consistency across pages.

### 2) Show Services and Public Information

Route:
- `/services`

Talking points:
- The services page summarizes the main response capabilities exposed by the platform.
- This supports the public side of the app and gives users a clearer understanding of what help can be requested.

Optional additional route:
- `/live-activity`

Talking points:
- The live activity page demonstrates integration with external disaster and weather feeds.
- It helps users and responders monitor active conditions.

### 3) Submit an Emergency Request

Route:
- `/submit-emergency-request`

Action:
- Fill in a representative request with location, contact, disaster type, and resource needs.

Talking points:
- This is the main public intake form.
- The frontend validates the request before submitting it to the backend.
- After submission, the app returns a tracking code that the requester can use later.

Important:
- Pause long enough to show the success state and tracking code.

### 4) Track the Request

Route:
- `/track`

Action:
- Enter the new tracking code, or use the request email or phone if that path is working in the current environment.

Talking points:
- Public users do not need a dashboard account just to check the status of a submitted request.
- This lowers friction for affected users during an emergency workflow.

### 5) Show Authentication

Route:
- `/login`

Talking points:
- Internal platform users authenticate before accessing operational dashboards.
- Route protection is role-aware, so users are redirected to the correct experience after login.

### 6) Admin Dashboard and Request Oversight

Route:
- `/dashboard`
- `/admin/requests`

Action:
- Log in as admin.
- Open the request list and locate the submitted or prepared request.

Talking points:
- Admins get the broadest visibility across requests, users, analytics, and settings.
- The request list centralizes operational review, filtering, and response management.

### 7) Open Request Detail and Assign Work

Route:
- `/requests/:id`

Action:
- Open a request detail page.
- If practical in the environment, assign it to a volunteer or update its status.

Talking points:
- The detail view supports deeper workflow actions such as status updates and assignment.
- The frontend normalizes backend request data so the UI can stay consistent even when backend payloads vary.

### 8) Show Volunteer Experience

Route:
- `/volunteer/tasks` or `/volunteer/requests`

Action:
- Log in as volunteer.
- Show that the volunteer sees only the relevant task or assigned request view.

Talking points:
- The volunteer interface is role-scoped.
- Volunteers should not see admin-only management pages.
- The frontend permission layer restricts access and routes users to the correct default page.

### 9) Show Organization Staff Experience

Route:
- `/org/requests`

Action:
- Log in as organization staff.

Talking points:
- Organization staff can review organization-relevant request flows without full admin privileges.
- This demonstrates the multi-role structure of the platform.

### 10) Close With Supporting Features

Optional routes:
- `/notifications`
- `/admin/analytics`
- `/contact`

Talking points:
- Notifications support awareness of request lifecycle events.
- Analytics and support pages round out the system beyond the core request flow.
- The frontend also supports light and dark themes and responsive behavior across the public site and dashboards.

---

## Short Version

If only 3 to 5 minutes are available, use this order:

1. Home page
2. Request submission
3. Request tracking
4. Admin request list
5. Request detail
6. Volunteer or organization staff role view

---

## Contingency Notes

- If live external feeds are slow, skip the live activity page and continue with the request workflow.
- If creating a request live fails, switch to a previously created tracking code and existing admin-visible request.
- If role switching is slow in one browser, use separate browser profiles or private windows.
- If the backend is unstable, explain that the frontend includes fallback handling for some request-management flows and continue with available screens.

---

## Demo Close

Suggested closing statement:

The DRRCS frontend now supports the full lifecycle from public request intake to internal role-based management, with final documentation and presentation materials prepared for submission.
