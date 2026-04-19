# Week 11: UI Refinement and Request Sorting Improvements

## Overview
Week 11 focused on refining the request management interface based on presentation feedback from Tuesday, March 31, 2026. The main goal was to improve how requests are organized and viewed on the dashboard/request list by adding clearer sorting behavior, better location-aware handling, and more polished filter UI spacing.

---

## Week 11 Requirements (Implemented)

### 1) Add Request Sorting Controls
**Status:** Completed

**Implemented:**
- Added frontend sorting controls for emergency requests.
- Preserved time-based sorting with both newest-first and oldest-first options.
- Added sorting by city.
- Added sorting by ZIP code.

**Files:**
- `src/pages/RequestListPage.tsx`
- `src/lib/api.ts`
- `src/types/index.ts`

---

### 2) Improve Location-Based Request Handling
**Status:** Completed

**Implemented:**
- Extended the frontend request location model to preserve `city`, `state`, `zipCode`, and `country`.
- Updated request mapping so backend location data is available for frontend filtering and sorting.
- Enabled search matching against city and ZIP code in addition to address text.
- Prepared the request list for location-focused viewing without requiring backend changes for basic UI sorting/filtering.

**Files:**
- `src/lib/api.ts`
- `src/types/index.ts`
- `src/pages/RequestListPage.tsx`

---

### 3) Refine Filter Dropdown Usability
**Status:** Completed

**Implemented:**
- Added padding and spacing to dropdown menu items so sorting/filter options are easier to read.
- Improved dropdown content spacing and menu item height.
- Kept the refinement scoped to the request page so other app selects are unaffected.

**Files:**
- `src/pages/RequestListPage.tsx`
- `src/pages/request-list-fixes.css`

---

### 4) Improve Filter Action Layout
**Status:** Completed

**Implemented:**
- Refined the `Clear Filters` button styling to better match the filter controls.
- Improved spacing and alignment in the filter action row.
- Added wrapping support so the filter action area behaves better on narrower screens.

**Files:**
- `src/pages/RequestListPage.tsx`
- `src/pages/request-list-fixes.css`

---

## Functional Outcomes

- Users can now sort requests by time, city, and ZIP code.
- Request searching now works against address, city, and ZIP data.
- Filter dropdown menus are easier to read and interact with.
- The filter action area is more polished and visually consistent.

---

## Deliverables Checklist

- [x] Sorting by time added
- [x] Sorting by city added
- [x] Sorting by ZIP code added
- [x] Location fields preserved in frontend request model
- [x] Dropdown spacing improved
- [x] Filter action styling refined

---

## Notes for Week 12

- Add location filter modes such as current location, all locations, and selected location if needed.
- Expand the same sorting/filtering behavior into dashboard summary views if required.
- Test sorting/filtering behavior with larger request datasets and multiple user roles.
