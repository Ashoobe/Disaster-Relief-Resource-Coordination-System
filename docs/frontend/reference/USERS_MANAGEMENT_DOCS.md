# Users Management Feature Documentation

## Overview
This document summarizes the user management interface for administrators, including the current UI behavior and service integration points.

## Features Implemented

### 1. User List View
- **Display all users** in a responsive table with:
  - User avatar (initial of first name)
  - Full name
  - Email address
  - Role badge (Admin, Volunteer, Organization Staff)
  - Status badge (Active/Inactive)
  - Last login timestamp
  - Action buttons

### 2. Search & Filter
- **Search**: Filter users by name or email (real-time)
- **Role Filter**: Filter by role (All, Admin, Volunteer, Organization Staff)
- **Status Filter**: Filter by status (All, Active, Inactive)
- **Clear Filters**: Reset all filters to default

### 3. Add User
- Modal form to create new users
- Required fields:
  - Full Name
  - Email (validated for uniqueness)
  - Role selection
- Automatic status set to "active"
- Success/error feedback

### 4. Delete User
- Delete user with confirmation dialog
- Users cannot delete themselves (button disabled)
- Permanent deletion through the current service layer

### 5. Change Role
- Change user role via prompt dialog
- Valid roles: admin, volunteer, organization_staff
- Role validation before submission
- Users cannot change their own role

### 6. Toggle Status
- Activate/deactivate users
- Confirmation dialog for status changes
- Users cannot change their own status
- Visual feedback (lock/unlock icons)

## Files Created

### 1. `src/services/userService.js`
Service layer for all user management operations:
- `getAllUsers(token, filters)` - Get all users with optional filters
- `getUserById(userId, token)` - Get single user
- `createUser(userData, token)` - Create new user
- `updateUser(userId, updates, token)` - Update user fields
- `deleteUser(userId, token)` - Delete user
- `changeUserRole(userId, newRole, token)` - Change user role
- `toggleUserStatus(userId, token)` - Activate/deactivate user

### 2. `src/components/users/UsersPage.jsx`
Main user management component with:
- User list table
- Filter controls
- Add user modal
- Action handlers for all CRUD operations
- Loading states and error handling
- Responsive design

### 3. `src/components/users/UsersPage.css`
Complete styling for:
- Responsive table layout
- Modal dialogs
- Filters and search
- Action buttons
- Mobile-responsive design
- Dark mode support

## Files Modified

### 1. `src/Router.jsx`
Added route: `/users` - User management page (admin only)

### 2. `src/components/layout/Sidebar.jsx`
Updated Users menu link to point to `/users`

## Seed and Sample Users

The development environment includes sample users for validation and UI testing:
1. **Hlay Aliotte** (Admin) - hlayaliotte@lewisu.edu
2. **Prithu Kathet** (Admin) - prithukathet@lewisu.edu
3. **Sree Soumith Thanigondala** (Admin) - sreesoumiththanigo@lewisu.edu
4. **John Volunteer** (Volunteer) - john.volunteer@example.com
5. **Sarah Organizer** (Organization Staff) - sarah.org@example.com
6. **Mike Helper** (Volunteer, Inactive) - mike.helper@example.com

## User Flow

### Adding a User
1. Click "Add User" button
2. Fill in the form (name, email, role)
3. Click "Create User"
4. Modal closes, user list refreshes

### Deleting a User
1. Click trash icon (🗑️) in user row
2. Confirm deletion dialog
3. User removed, list refreshes

### Changing Role
1. Click role change icon (🔄) in user row
2. Enter new role in prompt
3. Role updated, list refreshes

### Toggling Status
1. Click lock/unlock icon (🔒/🔓) in user row
2. Confirm status change
3. Status updated, list refreshes

## Security & Validation

### Frontend Validation
- Email format validation
- Role validation (only valid roles accepted)
- Duplicate email detection
- Self-action prevention (users can't delete/modify themselves)

### Service Integration
All service methods follow the same API and error-handling structure:
- Token-based authentication
- RESTful API patterns
- Error handling
- Success/failure responses

### Backend Connection Pattern
The example below shows the request structure used for backend-connected service methods:

```javascript
export const getAllUsers = async (token, filters = {}) => {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`/api/users?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Get users error:', error);
    return { success: false, users: [], message: 'Failed to retrieve users' };
  }
};
```

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all actions
- **ARIA Labels**: All interactive elements labeled
- **Focus Management**: Proper focus handling in modals
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **Color Contrast**: WCAG AA compliant colors
- **Alt Text**: Meaningful labels for all icons

## Responsive Design

### Desktop (>1024px)
- Full table layout
- All columns visible
- Horizontal filters

### Tablet (768px - 1024px)
- Adjusted table spacing
- Stacked filters

### Mobile (<768px)
- Card-based layout
- Hidden table headers
- Stacked data with labels
- Touch-friendly buttons

## Testing Checklist

### Functional Tests
- ✅ Load user list
- ✅ Search by name
- ✅ Search by email
- ✅ Filter by role
- ✅ Filter by status
- ✅ Clear all filters
- ✅ Add new user
- ✅ Validate duplicate email
- ✅ Delete user
- ✅ Cannot delete self
- ✅ Change user role
- ✅ Cannot change own role
- ✅ Toggle user status
- ✅ Cannot toggle own status

### UI/UX Tests
- ✅ Responsive on mobile
- ✅ Modal open/close
- ✅ Loading states
- ✅ Error messages
- ✅ Success feedback
- ✅ Confirmation dialogs

### Accessibility Tests
- ✅ Keyboard navigation
- ✅ Screen reader compatible
- ✅ Focus indicators
- ✅ ARIA labels

## Known Limitations (Mock Data)

1. **No Password Management**: Users created without passwords (handled by backend)
2. **No Pagination**: All users displayed (would need pagination for large datasets)
3. **In-Memory Storage**: Data resets on page reload
4. **No Sorting**: Table columns not sortable (can be added)
5. **Basic Search**: Case-insensitive substring match (could use fuzzy search)

## Future Enhancements

1. **Bulk Actions**: Select multiple users for bulk operations
2. **Export**: Export user list to CSV/Excel
3. **Advanced Filters**: Date range, custom queries
4. **User Details Page**: Detailed view with activity history
5. **Password Reset**: Admin-initiated password reset
6. **Email Notifications**: Notify users on account changes
7. **Audit Log**: Track all user management actions
8. **Permissions**: Granular permission management

## API Endpoints (Backend Reference)

```
GET    /api/users              - Get all users (with filters)
GET    /api/users/:id          - Get user by ID
POST   /api/users              - Create new user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
PATCH  /api/users/:id/role     - Change user role
PATCH  /api/users/:id/status   - Toggle user status
```

## Usage Example

```javascript
import { getAllUsers, createUser } from '../../services/userService';

// Get all active admins
const response = await getAllUsers(token, {
  role: 'admin',
  status: 'active',
  search: 'john'
});

if (response.success) {
  console.log(response.users); // Array of users
  console.log(response.total); // Total count
}

// Create new volunteer
const newUser = await createUser({
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  role: 'volunteer'
}, token);
```

## Testing Instructions

1. **Login as Admin**:
   - Email: hlayaliotte@lewisu.edu
   - Password: Password@123

2. **Navigate to Users**:
   - Click "Users" in the sidebar

3. **Test Features**:
   - Try searching for "John"
   - Filter by "Volunteer" role
   - Add a new user
   - Change a user's role
   - Toggle user status
   - Try to delete/modify your own account (should be disabled)

## Support

For questions or issues, contact the development team:
- Hlay Aliotte - hlayaliotte@lewisu.edu
- Prithu Kathet - prithukathet@lewisu.edu
- Sree Soumith Thanigondala - sreesoumiththanigo@lewisu.edu
