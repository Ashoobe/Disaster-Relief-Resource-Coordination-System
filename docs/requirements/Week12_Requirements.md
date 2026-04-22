# Week 12: Public Site Consistency, Contact Experience, and Legal Pages

## Overview
Week 12 focused on improving the public-facing website experience by making navigation consistent across pages, refining the contact page to better match the provided design direction, improving footer presentation, and adding foundational legal pages for public use.

---

## Week 12 Requirements (Implemented)

### 1) Make Public Navigation Consistent Across Pages
**Status:** Completed

**Implemented:**
- Created a shared public header component so the same navigation is used across the public site.
- Standardized public navigation links for `Home`, `Live Activity`, `Track Request`, and `Contact`.
- Standardized right-side actions for theme toggle, sign in, sign up, and submit request.
- Ensured mobile navigation behavior is consistent across public pages.

**Files:**
- `src/components/layout/PublicSiteHeader.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/LiveActivityPage.jsx`
- `src/pages/RequestSubmissionPage.jsx`
- `src/pages/RequestTrackingPage.jsx`
- `src/pages/ContactPage.jsx`

---

### 2) Build and Refine the Public Contact Page
**Status:** Completed

**Implemented:**
- Added a dedicated public contact page route.
- Styled the contact page to align more closely with the provided mockup:
  - blue hero banner
  - contact information cards
  - message form section
  - FAQ section
- Updated the address block to use:
  - `1 University Pkwy, Romeoville, IL 60446`
- Fixed dark/light mode contrast issues so important contact content remains readable in both themes.
- Adjusted heading sizing and hero-title color behavior.

**Files:**
- `src/App.jsx`
- `src/pages/ContactPage.jsx`
- `src/pages/ContactPage.css`

---

### 3) Improve Public Footer Design
**Status:** Completed

**Implemented:**
- Created a shared footer component for the public site.
- Replaced repeated footer markup on public pages with a single reusable component.
- Improved footer visual structure, spacing, and grouping.
- Added sections for:
  - site exploration links
  - legal links
  - contact details
- Included the Romeoville address in the footer.

**Files:**
- `src/components/layout/PublicSiteFooter.jsx`
- `src/pages/HomePage.css`
- `src/pages/HomePage.jsx`
- `src/pages/LiveActivityPage.jsx`
- `src/pages/RequestSubmissionPage.jsx`
- `src/pages/RequestTrackingPage.jsx`
- `src/pages/ContactPage.jsx`

---

### 4) Add Legal Pages
**Status:** Completed

**Implemented:**
- Added a `Terms & Conditions` page.
- Added a `Privacy Policy` page.
- Added shared styling for legal/document pages.
- Wired both pages into the main application router.
- Linked legal pages from the shared public footer.

**Files:**
- `src/pages/TermsPage.jsx`
- `src/pages/PrivacyPolicyPage.jsx`
- `src/pages/LegalPage.css`
- `src/App.jsx`
- `src/components/layout/PublicSiteFooter.jsx`

---

## Functional Outcomes

- Public navigation now appears consistently across public pages.
- The contact page is available and visually closer to the provided reference design.
- Public footer content is more organized and reusable.
- Users can access legal information through dedicated public pages.
- Contact-page content remains readable in both dark and light mode.

---

## Deliverables Checklist

- [x] Shared public header created
- [x] Public navigation standardized
- [x] Contact page route added
- [x] Contact page redesigned
- [x] Contact address updated to Romeoville location
- [x] Shared public footer created
- [x] Footer design improved
- [x] Terms & Conditions page added
- [x] Privacy Policy page added
- [x] Dark/light mode readability fixes applied

---

## Notes for Week 13

- Add real backend handling for the contact form if submission storage or email delivery is required.
- Replace placeholder legal copy with instructor-approved or organization-approved language if needed.
- Consider creating shared public layout wrappers to reduce duplication even further.
- Review all public pages for dark-mode consistency and responsive spacing.
