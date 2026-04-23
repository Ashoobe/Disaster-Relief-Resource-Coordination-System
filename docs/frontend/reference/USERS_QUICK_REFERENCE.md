# Users Management Quick Reference

## 🚀 Quick Start

### Access Users Page
1. Login as admin (hlayaliotte@lewisu.edu / Password@123)
2. Click "Users" in sidebar
3. View/manage all users

## 📋 Features Summary

| Feature | Action | Icon |
|---------|--------|------|
| **Add User** | Click "Add User" button | ➕ |
| **Search** | Type in search box | 🔍 |
| **Filter Role** | Select from dropdown | 📝 |
| **Filter Status** | Select from dropdown | ✓ |
| **Change Role** | Click role icon | 🔄 |
| **Toggle Status** | Click lock icon | 🔒/🔓 |
| **Delete User** | Click trash icon | 🗑️ |

## 🎯 Common Tasks

### Add a New User
```
1. Click "Add User" button (top right)
2. Enter full name
3. Enter email
4. Select role (Volunteer, Organization Staff, or Admin)
5. Click "Create User"
```

### Change User Role
```
1. Find user in table
2. Click 🔄 (role change icon)
3. Enter new role in prompt
4. Valid roles: admin, volunteer, organization_staff
5. Confirm
```

### Deactivate User
```
1. Find user in table
2. Click 🔒 (lock icon)
3. Confirm action
4. User status changes to "Inactive"
```

### Delete User
```
1. Find user in table
2. Click 🗑️ (trash icon)
3. Confirm deletion
4. User permanently removed
```

## 🔐 Security Rules

- ❌ **Cannot delete yourself**
- ❌ **Cannot change your own role**
- ❌ **Cannot deactivate yourself**
- ✅ **Can manage all other users**

## 🎨 User Roles

| Role | Badge Color | Description |
|------|-------------|-------------|
| **Admin** | Red | Full system access |
| **Volunteer** | Green | Field worker |
| **Organization Staff** | Blue | Organization representative |

## 🔍 Filter Examples

### Find all volunteers
```
Role: Volunteer
Status: All Status
Search: (empty)
```

### Find active admins
```
Role: Admin
Status: Active
Search: (empty)
```

### Search for specific user
```
Role: All Roles
Status: All Status
Search: john
```

## 📱 Responsive Design

| Screen Size | Layout |
|-------------|--------|
| **Desktop** | Full table with all columns |
| **Tablet** | Adjusted spacing, stacked filters |
| **Mobile** | Card layout, touch-friendly buttons |

## ⚡ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate through fields/buttons |
| `Enter` | Submit form |
| `Esc` | Close modal |

## 🐛 Troubleshooting

### "Email already exists"
- Choose a different email address
- Check if user already in system

### "Invalid role"
- Use only: admin, volunteer, or organization_staff
- Check spelling exactly

### Cannot perform action
- Check if you're trying to modify yourself
- Ensure you're logged in as admin

## 📊 Mock Data Users

| Name | Email | Role | Status |
|------|-------|------|--------|
| Hlay Aliotte | hlayaliotte@lewisu.edu | Admin | Active |
| Prithu Kathet | prithukathet@lewisu.edu | Admin | Active |
| Sree Soumith | sreesoumiththanigo@lewisu.edu | Admin | Active |
| John Volunteer | john.volunteer@example.com | Volunteer | Active |
| Sarah Organizer | sarah.org@example.com | Org Staff | Active |
| Mike Helper | mike.helper@example.com | Volunteer | Inactive |

## 🔧 Technical Details

### Files Created
```
src/services/userService.js          - User CRUD operations
src/components/users/UsersPage.jsx   - Main UI component
src/components/users/UsersPage.css   - Styling
```

### Files Modified
```
src/Router.jsx                       - Added /users route
src/components/layout/Sidebar.jsx   - Updated Users link
```

### Route
```
/users - User management page (admin only)
```

## 💡 Tips

1. **Use filters** to quickly find users instead of scrolling
2. **Clear filters** button resets all filters at once
3. **Confirmation dialogs** prevent accidental deletions
4. **Auto-refresh** - list updates after every action
5. **Mobile-friendly** - fully responsive on all devices

## 🎓 Best Practices

✅ **DO**:
- Use search for large user lists
- Confirm before deleting users
- Use appropriate roles for users
- Keep user information up to date

❌ **DON'T**:
- Delete users without confirmation
- Use duplicate email addresses
- Assign admin role unnecessarily
- Modify your own account

## 📞 Support

Questions? Contact the dev team:
- hlayaliotte@lewisu.edu
- prithukathet@lewisu.edu
- sreesoumiththanigo@lewisu.edu
