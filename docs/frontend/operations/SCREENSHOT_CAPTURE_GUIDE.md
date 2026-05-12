# Screenshot Capture Guide

## Purpose

This guide defines the recommended screenshots for the final report and class presentation. It is organized around the implemented frontend flow so the captured images reflect the real DRRCS application rather than disconnected screens.

---

## Capture Rules

- Use desktop width for primary report screenshots.
- Use the same theme across all screenshots unless the report specifically compares light and dark mode.
- Prefer seeded or realistic data instead of empty states.
- Capture full-page content when the section layout matters.
- Crop browser chrome when possible so the UI remains the focus.
- Avoid including personal email addresses, tokens, or local file paths in screenshots.

---

## Suggested Naming Convention

Use a stable filename format:

`01-home-page.png`
`02-services-page.png`
`03-live-activity-page.png`
`04-request-submission-form.png`

This keeps screenshots ordered for the report and slide deck.

---

## Recommended Screenshot Set

### 1) Public Home Page

- Route: `/`
- Role: public user
- Filename: `01-home-page.png`
- Show: hero section, primary navigation, and public call-to-action areas
- Purpose: establishes the public entry point and overall visual identity

### 2) Services Page

- Route: `/services`
- Role: public user
- Filename: `02-services-page.png`
- Show: services hero plus key service cards
- Purpose: demonstrates the dedicated public services experience added in later weeks

### 3) Live Activity Page

- Route: `/live-activity`
- Role: public user
- Filename: `03-live-activity-page.png`
- Show: live disaster or alert content with location-aware data if available
- Purpose: highlights external data integration and situational awareness features

### 4) Emergency Request Submission

- Route: `/submit-emergency-request`
- Role: public user
- Filename: `04-request-submission-form.png`
- Show: the request form with representative field values entered
- Purpose: documents the core disaster request intake workflow

### 5) Request Tracking Page

- Route: `/track`
- Role: public user
- Filename: `05-request-tracking.png`
- Show: a successful tracking result with request status visible
- Purpose: proves public follow-up capability after submission

### 6) Login Page

- Route: `/login`
- Role: public user
- Filename: `06-login-page.png`
- Show: login form and supporting auth layout
- Purpose: documents the authenticated entry point

### 7) Admin Dashboard

- Route: `/dashboard`
- Role: admin
- Filename: `07-admin-dashboard.png`
- Show: summary cards and main dashboard content
- Purpose: shows the authenticated command center for platform management

### 8) Admin Request Management

- Route: `/admin/requests`
- Role: admin
- Filename: `08-admin-request-list.png`
- Show: request table, filters, and sorting controls
- Purpose: demonstrates request oversight and operational management

### 9) Request Detail / Assignment View

- Route: `/requests/:id`
- Role: admin
- Filename: `09-request-detail.png`
- Show: an individual request with assignment or status controls visible
- Purpose: shows deeper workflow handling beyond list-level review

### 10) Volunteer Dashboard or Task View

- Route: `/volunteer/tasks` or `/volunteer/requests`
- Role: volunteer
- Filename: `10-volunteer-workflow.png`
- Show: volunteer-specific task/request content
- Purpose: proves the role-based experience is not limited to admins

### 11) Organization Staff Request View

- Route: `/org/requests`
- Role: organization staff
- Filename: `11-organization-requests.png`
- Show: organization request management screen
- Purpose: shows the third primary user role in the system

### 12) Notifications or Analytics

- Route: `/notifications` or `/admin/analytics`
- Role: admin
- Filename: `12-admin-support-feature.png`
- Show: notification feed or analytics dashboard
- Purpose: captures a supporting management capability beyond basic CRUD flows

### 13) Contact or Legal Page

- Route: `/contact`, `/terms`, or `/privacy-policy`
- Role: public user
- Filename: `13-public-support-page.png`
- Show: final polished public informational page
- Purpose: demonstrates completeness of the public-facing site

---

## Recommended Capture Order for the Report

1. Public home page
2. Public services page
3. Live activity page
4. Request submission form
5. Request tracking result
6. Login page
7. Admin dashboard
8. Admin request list
9. Request detail view
10. Volunteer workflow
11. Organization staff workflow
12. Notifications or analytics
13. Contact or legal page

This order matches a natural story: discover the platform, submit a request, track it, then show how the internal roles manage the response.

---

## Capture Notes

- If time is limited, prioritize screenshots 1 through 9 first.
- If the backend is not available, use stable demo data that still reflects the intended page state.
- If the report needs mobile evidence, capture one extra mobile screenshot for the home page or request form after the desktop set is complete.
