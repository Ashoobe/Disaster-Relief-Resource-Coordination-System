# Week 4: Authentication UI

## Overview
This week focuses on designing and implementing the login and registration pages with form validation and API integration placeholders. The authentication UI will be fully functional with mocked data while preparing for backend API integration in later weeks.

---

## Tasks

### 1. Design Login and Registration Pages
**Steps:**
- [ ] Create login page layout
- [ ] Create registration/sign-up page layout
- [ ] Design password reset page (optional)
- [ ] Design form elements and visual hierarchy
- [ ] Apply selected UI framework styling
- [ ] Ensure consistency with Week 2 wireframes
- [ ] Implement responsive design for mobile/tablet/desktop
- [ ] Create hover and focus states for form inputs
- [ ] Design error and success states
- [ ] Test accessibility (keyboard navigation, screen readers)

**Login Page Components:**
- Header/Logo section
- Email or Username input field
- Password input field
- "Remember me" checkbox
- Login button
- "Forgot password" link
- "Sign up" link
- Error message display area
- Loading state indicator
- Footer with help/support links

**Registration Page Components:**
- Header/Logo section
- Full name input field
- Email input field
- Password input field
- Confirm password input field
- Role selection dropdown (Admin, Volunteer, Organization Staff)
- Terms & conditions checkbox
- Sign up button
- "Already have an account?" login link
- Error message display area
- Loading state indicator
- Password strength indicator
- Success confirmation after signup

**Design Considerations:**
- Clear visual hierarchy
- Consistent spacing and typography
- Accessible color contrast ratios
- Mobile-first responsive design
- Loading and skeleton states
- Error state styling
- Success confirmation styling

---

### 2. Implement Form Validation
**Steps:**
- [ ] Set up form validation library (React Hook Form, Formik, or Yup/Zod)
- [ ] Implement email validation
- [ ] Implement password strength validation
- [ ] Add password confirmation validation
- [ ] Create required field validation
- [ ] Implement real-time validation feedback
- [ ] Add error message display
- [ ] Implement success messages
- [ ] Test validation with various inputs
- [ ] Add accessibility ARIA labels for errors
- [ ] Create validation helper functions

**Validation Rules:**

#### Login Form
- Email/Username: Required, valid email format
- Password: Required, minimum length (8 characters)
- Remember me: Optional checkbox

#### Registration Form
- Full Name: Required, minimum 2 characters
- Email: Required, unique (mocked check), valid email format
- Password: Required, minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Confirm Password: Required, must match password field
- Role: Required, dropdown selection
- Terms & Conditions: Required checkbox

**Error Handling:**
- Display inline error messages below fields
- Use color coding (typically red) for errors
- Show validation errors on blur or submit
- Clear error messages when user starts correcting
- Prevent form submission if validation fails
- Show success messages after successful submission

**Validation Feedback:**
- Real-time validation as user types
- Show password strength meter on registration
- Confirm password match status
- Provide helpful error messages
- Clear visual indicators of required fields

---

### 3. Prepare API Integration Placeholders
**Steps:**
- [ ] Create API service module (authService.js or similar)
- [ ] Define API endpoint structure (login, register, forgot-password)
- [ ] Create mock/placeholder API functions
- [ ] Set up request body structures
- [ ] Define expected response structures
- [ ] Implement error response handling
- [ ] Add console logging for debugging
- [ ] Create mock authentication tokens
- [ ] Set up local storage for token management
- [ ] Document API specifications
- [ ] Create context/state for authentication
- [ ] Test auth state management

**API Integration Structure:**

#### authService.js - Login
```
Function: loginUser(email, password)
Method: POST
Endpoint: /api/auth/login
Request Body: {email, password, rememberMe}
Response: {success, token, user, message}
Error Handling: Invalid credentials, server error
```

#### authService.js - Register
```
Function: registerUser(name, email, password, role)
Method: POST
Endpoint: /api/auth/register
Request Body: {name, email, password, role}
Response: {success, token, user, message}
Error Handling: Email exists, validation error, server error
```

#### authService.js - Forgot Password
```
Function: forgotPassword(email)
Method: POST
Endpoint: /api/auth/forgot-password
Request Body: {email}
Response: {success, message}
Error Handling: Email not found, server error
```

**Authentication Context/State:**
- [ ] Create AuthContext for global auth state
- [ ] Store user information (name, email, role)
- [ ] Store authentication token
- [ ] Implement login method
- [ ] Implement logout method
- [ ] Implement register method
- [ ] Track loading and error states
- [ ] Persist auth state to localStorage
- [ ] Create custom useAuth hook

**Mock Data for Testing:**
- Test user accounts with different roles
- Test error scenarios (invalid credentials, server errors)
- Test token generation and storage
- Test persistent login (localStorage)
- Test logout functionality

---

## Deliverables

### 1. Working Login/Register UI (Mocked)
- Fully styled login page
- Fully styled registration page
- All form fields implemented
- Responsive design working on mobile, tablet, desktop
- Forms are visually appealing and on-brand
- Loading states visible during submission
- Success and error messages display correctly

**Checklist:**
- [ ] Login page renders without errors
- [ ] Registration page renders without errors
- [ ] All form inputs are functional
- [ ] Responsive design tested at multiple breakpoints
- [ ] Hover and focus states work
- [ ] Tab navigation works correctly
- [ ] Forms look professional and polished
- [ ] Loading indicators display during form submission
- [ ] Success/error messages appear appropriately

### 2. Form Validation Implementation
- Email validation working
- Password validation with strength indicator
- Confirm password matching
- Required field validation
- Real-time validation feedback
- Error messages clear and helpful
- Form prevents submission if validation fails

**Checklist:**
- [ ] All required fields validated
- [ ] Email format validation works
- [ ] Password strength requirements enforced
- [ ] Password confirmation matching works
- [ ] Error messages display inline
- [ ] Validation triggers at appropriate times
- [ ] Form submission blocked on invalid data
- [ ] Success message displays on valid submission
- [ ] Validation rules match requirements

### 3. API Integration Placeholders
- authService.js created with mocked functions
- Login endpoint placeholder created
- Register endpoint placeholder created
- Forgot password endpoint placeholder (optional)
- Authentication context/state management set up
- Token storage in localStorage working
- Mocked API calls with simulated delays
- Error handling for auth failures
- Custom useAuth hook created

**Checklist:**
- [ ] authService.js module created
- [ ] Mock login function implemented
- [ ] Mock register function implemented
- [ ] AuthContext created with proper state
- [ ] useAuth custom hook working
- [ ] Token stored in localStorage
- [ ] Login persists across page refreshes
- [ ] Logout clears authentication state
- [ ] API structure documented for backend integration
- [ ] Error responses handled gracefully

---

## Technical Implementation Notes

### Recommended Libraries
- **Form Management**: React Hook Form (lightweight) or Formik
- **Validation**: Yup (schema validation) or Zod
- **State Management**: Context API (built-in) or useAuth hook
- **Async Handling**: Async/await with try-catch
- **Storage**: Browser localStorage for tokens

### Security Considerations
- Password fields should not show text by default
- Never log sensitive information (passwords, tokens)
- Implement CORS headers (coordinate with backend)
- Validate all inputs on frontend and backend
- Use secure token storage (acknowledge localStorage limitations)
- Implement token refresh mechanism placeholder

### Testing
- Test form submission with valid and invalid data
- Test validation error messages
- Test API call mocking behavior
- Test token storage and retrieval
- Test navigation after login/registration
- Test responsive design on various screen sizes

---

## Notes
- Keep API mocking simple but realistic (add simulated delays)
- Use TypeScript for better type safety if possible
- Document API endpoint expectations for backend team
- Ensure forms are accessible (WCAG 2.1 Level AA)
- Consider adding social login placeholders (Google, GitHub, etc.) for future implementation
- Test on actual mobile devices, not just browser DevTools
- Keep authentication logic separate and reusable
