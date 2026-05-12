# Frontend Architecture

## Overview

The DRRCS frontend is a React and Vite single-page application that serves two main experiences:

- public-facing pages for disaster information, request submission, and request tracking
- authenticated dashboards for admins, volunteers, and organization staff

The app is organized around route-based pages, shared layout components, context providers for app-wide state, and a service layer that encapsulates API calls and browser storage behavior.

---

## Technology Stack

- React 18
- Vite
- React Router
- JavaScript and TypeScript mix
- Context API for shared state
- CSS modules by feature file plus shared theme styles
- Browser `fetch` for API access

Key package-level scripts are defined in `frontend/package.json`:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm test`

---

## Application Shell

The frontend entry flow is centered in `frontend/src/App.jsx`.

The shell layers are:

1. `BrowserRouter`
2. `ThemeProvider`
3. `AuthProvider`
4. `ScrollToTop`
5. `AppRouter`

This means routing, theme state, and authentication state are available across the entire app before any page is rendered.

### Shared Providers

`ThemeProvider`
- Stores light or dark theme preference in local storage under `app-theme`
- Applies theme state to the root document element
- Exposes `toggleTheme`, `setAutoTheme`, `isDark`, and `isLight`

`AuthProvider`
- Restores the saved JWT token from local storage key `drrcs_token`
- Calls the backend user endpoint on load to rehydrate the active session
- Exposes `user`, `token`, `loading`, `error`, `login`, `register`, `logout`, and password-reset behavior

---

## Route Architecture

The router uses a split between public routes and protected routes.

### Public Routes

- `/` -> home page
- `/about`
- `/services`
- `/live-activity`
- `/submit-emergency-request`
- `/track`
- `/contact`
- `/terms`
- `/privacy-policy`
- `/login`
- `/register`
- `/forgot-password`

These routes support site discovery, public emergency request creation, and request tracking without requiring an authenticated dashboard session.

### Protected Routes

All protected routes are wrapped with `ProtectedRoute`, which:

- waits for auth bootstrap to finish
- redirects unauthenticated users to `/login`
- enforces allowed roles where required
- redirects users without access to their role-default page

### Shared Authenticated Layout

Most dashboard pages are rendered inside `MainLayout`, which provides:

- top navigation through `Navbar`
- side navigation through `Sidebar`
- shared `.main-content` container for page content

This keeps the admin, volunteer, and organization-staff dashboards visually consistent.

### Role-Based Route Groups

Admin routes
- `/dashboard`
- `/users`
- `/admin/requests`
- `/admin/volunteers`
- `/admin/analytics`
- `/admin/settings`
- `/notifications`
- `/profile`

Volunteer routes
- `/volunteer/tasks`
- `/volunteer/requests`
- `/volunteer/profile`
- `/volunteer/help`

Organization staff routes
- `/org/submit-request`
- `/org/requests`
- `/org/team`
- `/org/settings`

Shared protected detail route
- `/requests/:id`

Role defaults are defined in `frontend/src/lib/permissions.js`.

---

## Page and Component Organization

The frontend is broadly separated into:

- `src/pages`: public pages and some shared app pages
- `src/components/layout`: layout shell and shared navigation
- `src/components/dashboard`: role-specific dashboard screens
- `src/components/requests`: request-form building blocks
- `src/components/users`: user-management UI
- `src/components/common`: small reusable UI pieces
- `src/services`: business-facing client helpers
- `src/context`: app-wide state providers
- `src/lib`: lower-level API and permission logic
- `src/styles`: shared CSS foundation

This structure keeps routing concerns, layout concerns, and service concerns separated.

---

## State Management

The app uses lightweight state management rather than a global external store.

### Global State

Managed through React context:

- authentication state in `AuthContext`
- theme state in `ThemeContext`

### Local Page State

Most page-specific interactions are handled with component state inside the page or feature component that owns the UI.

### Browser Persistence

The frontend intentionally uses local storage for several resilience and UX cases:

- `drrcs_token`: active auth token
- `app-theme`: theme preference
- `drrcs_request_overrides`: fallback request updates when backend updates fail or are inconsistent
- `drrcs_request_form_payloads`: saved request submission payload snapshots
- `drrcs_tracking_index`: tracking lookup helpers by request id, email, or phone
- `drrcs_notifications`: in-browser notification feed state
- `draft_*`: request-form draft saves

This design supports demos and protects some UX flows from temporary backend instability.

---

## API Integration Layer

The frontend separates API access across two levels.

### Auth Service

`frontend/src/services/authService.js`

Responsibilities:

- login
- registration
- forgot-password request
- current-user lookup
- role normalization from backend formats into frontend role keys

The auth service talks to endpoints under `VITE_API_BASE_URL` plus `/v1`.

### Core API Library

`frontend/src/lib/api.ts`

Responsibilities:

- authenticated fetch wrapper
- request record normalization into frontend-friendly shape
- request list and request detail retrieval
- request creation and updates
- status changes
- volunteer assignment
- dashboard stats retrieval
- fallback behavior when the backend returns unstable or generic failures

The request normalization layer is important because backend values such as status, category, disaster type, and location fields are not always shaped exactly how the UI needs them.

### Feature Services

`requestService.js`
- public request submission
- request tracking
- draft save and restore
- status history shaping

`notificationService.js`
- local notification persistence
- audience filtering by role, user id, and email
- read and unread state

`liveActivityService.js`
- NASA EONET event feed
- NOAA alert feed
- ZIP-based forecast lookup
- geocoding and distance calculations

---

## Permissions Model

Permissions are centralized in `frontend/src/lib/permissions.js`.

The current normalized roles are:

- `admin`
- `organization_staff`
- `volunteer`
- `coordinator`

The permissions utility controls:

- default landing route by role
- route admission for protected pages
- whether a user can manage users
- whether a user can assign requests
- whether a user can update a request directly
- whether a volunteer can view or update only requests assigned to them

This keeps route protection and page-level access logic aligned.

---

## Public-Site Architecture

The public site uses shared layout pieces instead of duplicating navigation and footer markup page by page.

Key shared components:

- `PublicSiteHeader`
- `PublicSiteFooter`

This pattern is used across public pages such as:

- home
- services
- live activity
- request tracking
- contact
- legal pages

The result is a more consistent visitor experience and lower maintenance cost for navigation changes.

---

## Error Handling and Resilience

The frontend includes several practical fallback patterns:

- auth bootstrap clears expired saved tokens
- request list retrieval falls back from a visible endpoint to a broader emergency list endpoint
- request update and assignment logic can persist local overrides when backend responses are unavailable or unreliable
- public tracking rewrites vague backend errors into user-readable messages
- notification and draft persistence failures are treated as non-fatal browser issues

This makes the app more tolerant of incomplete backend behavior during development, demos, and classroom evaluation.

---

## Deployment Notes

The frontend expects `VITE_API_BASE_URL` to point to the backend API base path.

Default local fallback:
- `http://127.0.0.1:8080/api`

Build output:
- `frontend/dist`

Recommended deployment guidance already exists in:
- `docs/frontend/operations/DEPLOYMENT.md`

---

## Maintenance Guidance

When the frontend changes, update these areas together:

- route list in this document when new pages are added
- screenshot guide when presentation-critical screens change
- demo script when the preferred walkthrough flow changes
- deployment doc when environment variables or hosting assumptions change

Keeping those three documents in sync is enough to preserve a useful final handoff package.
