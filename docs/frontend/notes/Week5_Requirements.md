# Week 5: Dashboard Layout Implementation

## Overview
This week focuses on building the responsive dashboard layout, implementing the navigation menu, and creating reusable components (Navbar, Sidebar, Cards) that will serve as the foundation for subsequent feature implementations.

---

## Tasks

### 1. Build Responsive Dashboard Layout
**Steps:**
- [ ] Design dashboard grid layout structure
- [ ] Create main dashboard container with responsive breakpoints
- [ ] Implement header/navbar area
- [ ] Implement sidebar navigation area
- [ ] Create main content area with proper spacing
- [ ] Design footer section (optional)
- [ ] Ensure mobile, tablet, and desktop responsiveness
- [ ] Test layout at various screen sizes
- [ ] Optimize whitespace and visual hierarchy
- [ ] Document layout structure

**Layout Structure:**
- **Header/Navbar**: User profile, notifications, logout
- **Sidebar**: Navigation menu with role-based options
- **Main Content**: Dynamic content area
- **Footer**: Links and company info (optional)

**Responsive Breakpoints:**
- **Desktop**: 1200px+ (3-column or full sidebar)
- **Tablet**: 768px-1199px (sidebar may collapse)
- **Mobile**: Below 768px (side drawer or hamburger menu)

**Key Features:**
- Sticky header for accessibility
- Collapsible sidebar on smaller screens
- Hamburger menu toggle for mobile
- Breadcrumb navigation
- User profile section
- Notifications indicator
- Role-based menu visibility

---

### 2. Implement Navigation Menu
**Steps:**
- [ ] Create navigation menu component
- [ ] Design navigation item styling
- [ ] Implement active route highlighting
- [ ] Add role-based menu visibility
- [ ] Create submenu functionality (if needed)
- [ ] Add icons to menu items
- [ ] Implement smooth transitions
- [ ] Test keyboard navigation
- [ ] Add accessibility attributes (ARIA)
- [ ] Create mobile-friendly navigation toggle

**Navigation Menu Items (by role):**

#### Admin Navigation
- Dashboard
- All Requests (View/manage all disaster requests)
- All Volunteers (Manage volunteer roster)
- Users (User management)
- Settings (System settings)
- Analytics (Reports and statistics)
- Logout

#### Volunteer Navigation
- Dashboard
- My Tasks (Assigned tasks)
- Available Requests (Browse open requests)
- My Profile (Edit profile)
- Help/Support
- Logout

#### Organization Staff Navigation
- Dashboard
- Submit Request (Create new disaster request)
- My Requests (View submitted requests)
- Team Members (Manage org team)
- Organization Settings
- Logout

**Navigation Features:**
- Active page highlighting
- Smooth scroll behavior
- Icon + label or icon-only (collapsible)
- Keyboard accessible (Tab, Enter, Escape)
- WCAG 2.1 compliant

---

### 3. Create Reusable Components
**Steps:**
- [ ] Create Card component for content containers
- [ ] Create Navbar component for header
- [ ] Create Sidebar/Navigation component
- [ ] Create Button variants (primary, secondary, danger)
- [ ] Create Badge/Status indicator component
- [ ] Create Modal/Dialog component templates
- [ ] Create Form input helpers
- [ ] Create Loading spinner component
- [ ] Document component props
- [ ] Create Storybook or component showcase (optional)

**Component Specifications:**

#### Card Component
```jsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```
- Props: elevation, onClick, className, children
- Variants: basic, elevated, outlined
- Support for header, body, footer sections

#### Navbar Component
```jsx
<Navbar>
  <Navbar.Brand>DRRCS</Navbar.Brand>
  <Navbar.Menu>
    <Navbar.Item>Profile</Navbar.Item>
  </Navbar.Menu>
</Navbar>
```
- Props: fixed, sticky, className
- Contains user info, notifications, logout
- Responsive hamburger menu

#### Sidebar Component
```jsx
<Sidebar collapsed={isMobile}>
  <SidebarMenu>
    <SidebarItem icon={icon} label="Dashboard" active />
  </SidebarMenu>
</Sidebar>
```
- Props: collapsed, width, onChange
- Toggle-able on mobile
- Animated transitions

#### Badge Component
```jsx
<Badge variant="success">Active</Badge>
```
- Props: variant (success, warning, danger, info), children
- Small indicator for status
- Support for different colors

#### Status Indicator
- Shows user status, request status, volunteer availability
- Color-coded (available, in-progress, completed, inactive)
- Accessible color + text combination

**Component Organization:**
```
src/components/
├── common/
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── Loading.jsx
│   └── StatusIndicator.jsx
├── layout/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── MainLayout.jsx
└── ...existing auth components
```

---

### 4. Dashboard Page Implementation
**Steps:**
- [ ] Create main Dashboard page component
- [ ] Implement dashboard route
- [ ] Integrate navbar and sidebar
- [ ] Create dashboard grid layout
- [ ] Add various widget areas (cards)
- [ ] Create role-specific dashboard views
- [ ] Implement responsive behavior
- [ ] Add navigation between dashboard sections
- [ ] Create placeholder content areas
- [ ] Test with different user roles

**Dashboard Components:**
- Welcome message with user name
- Quick stats cards (role-dependent)
- Recent activity section
- Navigation to role-specific features
- Quick action buttons
- Notifications area

**Role-Specific Dashboards:**

#### Admin Dashboard
- System statistics (total users, requests, volunteers)
- Recent disaster requests
- Pending approvals
- System health/status
- Quick links to management areas

#### Volunteer Dashboard
- Available tasks/requests
- Volunteer statistics
- My availability status
- Recent activity
- Points/achievements (if applicable)

#### Organization Dashboard
- My submitted requests
- Request status summary
- Team member overview
- Recent team activity
- Create new request button

---

## Deliverables

### 1. Functional Dashboard Layout
- Complete dashboard layout with navbar and sidebar
- Responsive design working on all screen sizes
- Proper spacing and visual hierarchy
- Navigation functionality working
- User profile display visible
- Logout functionality working

**Checklist:**
- [ ] Layout renders without errors
- [ ] Desktop view looks professional
- [ ] Mobile/tablet responsive
- [ ] Sidebar collapses on mobile
- [ ] Navigation menu is functional
- [ ] User info displays correctly
- [ ] Logout button works
- [ ] No layout shifting on page load
- [ ] Performance is acceptable
- [ ] Accessibility requirements met

### 2. Reusable Component Library
- Card component working with variants
- Navbar component with all features
- Sidebar component with toggle
- Badge/Status components
- Button component variants
- All components properly documented
- Components tested with various props

**Checklist:**
- [ ] Card component renders correctly
- [ ] Navbar responsive and functional
- [ ] Sidebar toggles on mobile
- [ ] Badge displays all variants
- [ ] Components have proper prop validation
- [ ] Styling is consistent
- [ ] Components are reusable across pages
- [ ] Documentation updated in README
- [ ] All components have default props

### 3. Navigation Menu
- Complete navigation menu for all roles
- Active route highlighting
- Responsive menu (hamburger on mobile)
- Keyboard accessible
- Proper styling and animations
- Role-based visibility working
- Icons displaying correctly

**Checklist:**
- [ ] All menu items render
- [ ] Active page is highlighted
- [ ] Menu responsive on mobile
- [ ] Hamburger toggle works
- [ ] Submenu items (if any) work
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Menu items have icons
- [ ] Smooth transitions
- [ ] Logout works

### 4. Dashboard Page
- Main dashboard page renders
- Role-appropriate content displays
- All navigation working
- Layout is responsive
- Cards/widgets display properly
- User info visible
- Quick action buttons functional

**Checklist:**
- [ ] Dashboard page loads
- [ ] Dashboard layout matches wireframes
- [ ] Role-specific content shows
- [ ] Navigation from dashboard works
- [ ] Cards are properly styled
- [ ] Content is responsive
- [ ] No console errors
- [ ] Performance is good
- [ ] Accessibility checked

---

## Technical Implementation Notes

### File Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Card.jsx
│   │   ├── Card.css
│   │   ├── Badge.jsx
│   │   ├── Badge.css
│   │   ├── Loading.jsx
│   │   ├── StatusIndicator.jsx
│   │   ├── Button.jsx
│   │   └── Button.css
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── Sidebar.jsx
│   │   ├── Sidebar.css
│   │   ├── MainLayout.jsx
│   │   └── MainLayout.css
│   └── auth/ (existing)
├── pages/
│   ├── DashboardPage.jsx
│   ├── DashboardPage.css
│   └── ...existing auth pages
├── hooks/
│   ├── useAuth.js (existing)
│   └── useNavigation.js (new)
└── styles/ (existing)
```

### Key Styling Considerations
- Use CSS Grid for layout
- CSS Flexbox for component alignment
- CSS Variables for theming colors
- Media queries for responsive design
- Smooth transitions for interactions
- Consistent spacing (8px grid system)

### Responsive Design
- Mobile-first approach
- Hamburger menu on small screens
- Sidebar collapses to icons or drawer
- Stack content vertically on mobile
- Touch-friendly tap targets (minimum 44x44px)

### Accessibility
- ARIA labels for navigation
- Keyboard navigation support
- Color contrast compliance
- Focus indicators visible
- Semantic HTML structure
- Screen reader friendly

### Performance
- Lazy load components if needed
- Optimize re-renders with React.memo
- Use CSS modules or scoped styles
- Avoid unnecessary state updates
- Optimize images and assets

---

## Testing Checklist

### Functional Testing
- [ ] Login redirects to dashboard
- [ ] Logout redirects to login
- [ ] Navigation menu items are clickable
- [ ] Active route is highlighted
- [ ] Role-based menu items show/hide correctly
- [ ] Components render without errors
- [ ] No console errors or warnings

### Responsive Testing
- [ ] Desktop layout (1200px+)
- [ ] Tablet layout (768px-1199px)
- [ ] Mobile layout (<768px)
- [ ] Sidebar collapse/expand
- [ ] Menu toggle works on mobile
- [ ] Touch interactions work on mobile
- [ ] No horizontal scroll

### Accessibility Testing
- [ ] Keyboard navigation works (Tab, Shift+Tab)
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Screen reader friendly
- [ ] Form inputs accessible

### Browser Testing
- [ ] Chrome/Chromium latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest
- [ ] Mobile browsers

---

## Notes
- Keep components modular and reusable
- Document component props and usage
- Maintain consistent styling across components
- Plan for future feature additions
- Consider accessibility from the start
- Test responsive design frequently
- Use browser DevTools for debugging
- Optimize performance as you build
