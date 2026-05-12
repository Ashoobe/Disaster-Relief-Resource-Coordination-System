# Week 6: Request Submission Interface

## Overview
This week focused on delivering the disaster request submission experience for organization users, including:
- a full multi-section request form,
- field validation and conditional logic,
- draft save/load behavior,
- request submission flow with success/error states,
- and integration-ready service functions for API wiring.

---

## Week 6 Requirements (Implemented)

### 1) Build Disaster Request Form UI
**Status:** ✅ Completed

**Implemented:**
- Built a full request form with structured sections:
  - Basic Information
  - Location Information
  - Resource Needs
  - Contact Information
  - Priority and Authorization
- Added sectioned layout and reusable form section wrappers.
- Added a dedicated request submission page container.

**Files:**
- `src/pages/RequestSubmissionPage.jsx`
- `src/components/requests/RequestForm.jsx`
- `src/components/requests/FormSection.jsx`
- `src/components/requests/RequestForm.css`
- `src/pages/RequestSubmissionPage.css`

---

### 2) Implement Validation and Conditional Logic
**Status:** ✅ Completed

**Implemented:**
- Added validation rules for required fields and max lengths.
- Added disaster type and priority validation.
- Added coordinate and contact validation.
- Added conditional urgency-reason requirement for high/critical priority.
- Added inline field-level error handling and messaging.

**Files:**
- `src/utils/requestValidation.js`
- `src/components/requests/RequestForm.jsx`

---

### 3) Add Resource Needs Dynamic Inputs
**Status:** ✅ Completed

**Implemented:**
- Added resource-type toggles and contextual fields (food, medical, shelter, search & rescue, other).
- Added dynamic per-resource input blocks to reduce clutter and improve usability.

**Files:**
- `src/components/requests/ResourceNeedsSection.jsx`
- `src/components/requests/RequestForm.jsx`

---

### 4) Prepare API Integration Points
**Status:** ✅ Completed

**Implemented:**
- Added request service with submission and retrieval methods.
- Implemented mocked async submit flow (network delay simulation).
- Added request ID generation and normalized success response.
- Added helper methods for get/update/delete/status history.

**Files:**
- `src/services/requestService.js`

---

### 5) Save Draft + Recover Draft Behavior
**Status:** ✅ Completed

**Implemented:**
- Added local draft persistence helpers.
- Added draft load on form open.
- Added auto-save behavior on form changes.
- Added clear-draft behavior after successful submit or discard.

**Files:**
- `src/services/requestService.js`
- `src/components/requests/RequestForm.jsx`

---

### 6) Route Integration for Organization Users
**Status:** ✅ Completed

**Implemented:**
- Added/confirmed protected route for organization request submission.
- Added submit-request navigation entry in organization sidebar.

**Files:**
- `src/App.jsx`
- `src/Router.jsx`
- `src/components/layout/Sidebar.jsx`

---

## Functional Outcomes
- Organization users can open and complete a full disaster request form.
- Validation prevents invalid submissions and guides correction.
- Priority-based conditional logic is active.
- Drafts can be saved/recovered, reducing lost work risk.
- Submission returns confirmation with generated request ID.
- Request submission is available through the protected org route.

---

## Deliverables Checklist
- [x] Request submission page implemented
- [x] Multi-section request form implemented
- [x] Validation rules implemented
- [x] Conditional field logic implemented
- [x] Resource needs dynamic inputs implemented
- [x] Service layer integration points prepared
- [x] Draft save/load behavior implemented
- [x] Org route + sidebar entry integrated

---

## Notes for Week 7 (Recommended)
- Expand volunteer management pages and workflows.
- Add “My Requests” full list/detail workflow for organization users.
- Replace mock request service calls with backend API endpoints.
- Add integration tests for submit, validation, and draft recovery flows.
