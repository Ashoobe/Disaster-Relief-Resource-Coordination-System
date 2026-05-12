# User Flow Outline
**Project:** Disaster Relief Resource Coordination System (DRRCS)  
**Date:** February 16, 2026

---

## 1. Admin User Journey

### Initial Access
1. Navigate to DRRCS website
2. Click "Login" button
3. Enter admin credentials
4. System validates and redirects to Admin Dashboard

### Main Dashboard View
- View system overview (total requests, volunteers, organizations)
- See pending approvals count
- Access navigation menu

### Managing Disaster Requests
1. Click "Requests" in navigation
2. View list of all disaster requests
3. Filter by status (Pending, Approved, In Progress, Completed)
4. Click on a request to view details
5. Options:
   - Approve request
   - Reject request (with reason)
   - Assign volunteers
   - Add notes
   - Close request

### Managing Volunteers
1. Click "Volunteers" in navigation
2. View list of all volunteers
3. Filter by status (Pending, Approved, Active, Inactive)
4. Click on a volunteer to view profile
5. Options:
   - Approve volunteer application
   - Reject application (with reason)
   - View volunteer history
   - Edit volunteer information
   - Deactivate account

### Managing Organizations
1. Click "Organizations" in navigation
2. View list of all organizations
3. Filter and search organizations
4. Click on organization to view details
5. Options:
   - Approve new organizations
   - Edit organization information
   - View organization's request history
   - Deactivate organization

### Logout
1. Click user profile icon
2. Select "Logout"
3. System clears session and redirects to login

---

## 2. Volunteer User Journey

### Registration
1. Navigate to DRRCS website
2. Click "Register as Volunteer"
3. Fill out registration form:
   - Personal information (name, email, phone)
   - Location/address
   - Skills and experience
   - Availability
   - Emergency contact
4. Submit application
5. Receive confirmation message (pending approval)

### First Login (After Approval)
1. Receive approval notification (email)
2. Navigate to login page
3. Enter credentials
4. Redirected to Volunteer Dashboard

### Volunteer Dashboard
- View personal profile summary
- See available opportunities
- View upcoming assignments
- Check participation history

### Finding Opportunities
1. Click "Browse Opportunities" or "Available Requests"
2. View list of disaster relief requests needing volunteers
3. Filter by:
   - Location
   - Type of disaster
   - Skills required
   - Date range
4. Click on opportunity to view details
5. Options:
   - Express interest / Apply
   - Share opportunity
   - Save for later

### Managing Profile
1. Click "My Profile"
2. View and edit:
   - Personal information
   - Skills
   - Availability calendar
   - Certifications
3. Save changes

### Viewing Assignment History
1. Click "My History"
2. View past assignments
3. Filter by date, type, status
4. View details of completed work
5. Download participation certificates

### Logout
1. Click profile icon
2. Select "Logout"

---

## 3. Organization Staff User Journey

### Registration
1. Navigate to DRRCS website
2. Click "Register Organization"
3. Fill out organization registration form:
   - Organization name and type
   - Contact information
   - Address
   - Authorized representative details
   - Supporting documents (if required)
4. Submit application
5. Receive confirmation message (pending approval)

### First Login (After Approval)
1. Receive approval notification
2. Navigate to login page
3. Enter credentials
4. Redirected to Organization Dashboard

### Organization Dashboard
- View organization profile summary
- See active requests status
- View assigned volunteers
- Quick access to submit new request

### Submitting Disaster Request
1. Click "Submit New Request"
2. Fill out request form (Step-by-step):
   
   **Step 1: Disaster Information**
   - Type of disaster
   - Location
   - Date occurred
   - Severity level
   - Description
   
   **Step 2: Resource Needs**
   - Type of help needed
   - Number of volunteers needed
   - Skills required
   - Equipment needed
   - Duration of help needed
   
   **Step 3: Contact Information**
   - On-site contact person
   - Phone number
   - Alternative contact
   
   **Step 4: Additional Details**
   - Special requirements
   - Safety considerations
   - Access instructions
   - Upload photos (optional)
   
3. Review all information
4. Submit request
5. Receive confirmation with request ID

### Managing Requests
1. Click "My Requests"
2. View list of all submitted requests
3. Filter by status
4. Click on request to view details
5. Options:
   - View assigned volunteers
   - Edit request (if still pending)
   - Add updates/notes
   - Close request when completed
   - Download request report

### Communicating with Volunteers
1. From request detail page, view assigned volunteers
2. Click "Message Volunteers"
3. Send updates or instructions
4. View responses

### Viewing Organization Profile
1. Click "Organization Profile"
2. View organization information
3. Edit details (if authorized)
4. View request history
5. View analytics (total requests, completion rate)

### Logout
1. Click profile icon
2. Select "Logout"

---

## Common Paths

### Error Scenarios
- **Invalid login:** Show error message, offer password reset
- **Form validation errors:** Highlight fields, show clear error messages
- **Network errors:** Show retry option, save form data
- **Session timeout:** Redirect to login, show timeout message
- **Unauthorized access:** Redirect to appropriate page, show permission error

### Success Confirmations
- Form submissions show success message
- Actions show loading indicators
- Completed actions show confirmation
- Important actions require confirmation dialog

---

## Navigation Structure

### Public (Unauthenticated)
- Home
- About
- Login
- Register (Volunteer / Organization)

### Admin Navigation
- Dashboard
- Requests
- Volunteers
- Organizations
- Reports
- Settings
- Profile
- Logout

### Volunteer Navigation
- Dashboard
- Browse Opportunities
- My Assignments
- My History
- My Profile
- Logout

### Organization Navigation
- Dashboard
- Submit Request
- My Requests
- Organization Profile
- Logout

---

## Next Steps
- Create wireframes based on these user flows
- Identify reusable components
- Define API endpoints needed for each flow
- Plan state management approach
