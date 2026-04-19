# DRRCS Full Stack App

Disaster Relief Resource Coordination System with a React frontend, Spring Boot backend, and MongoDB persistence.

## Contributors

- Sowjanya Gottimukkala
- Prithu Kathet
- Sree Soumith Thanigondala
- Hlay Aliotte


## Project Overview

This repository now contains the full application stack for DRRCS, including authentication, emergency request submission, dashboard workflows, MongoDB-backed data storage, and request tracking.

## Deployment

Deployment instructions are in [DEPLOYMENT.md](DEPLOYMENT.md).

## Features

### Completed

- **Authentication**: Login, registration, and protected dashboard access
- **Emergency Requests**: Public submission flow, tracking, and dashboard visibility
- **Dashboard Workflows**: Request lists, detail views, analytics, and role-aware visibility
- **Form Validation**: Client-side validation with inline feedback
- **Responsive Design**: Mobile, tablet, and desktop support
- **Accessibility**: Keyboard-friendly forms and improved contrast handling
- **Theme Support**: Light and dark mode across public and dashboard pages

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx        # Login form component
│   │   ├── RegisterForm.jsx     # Registration form component
│   │   └── AuthForms.css        # Form styling
│   └── common/                   # Shared components (placeholder)
├── pages/
│   ├── LoginPage.jsx            # Login page container
│   ├── RegisterPage.jsx         # Registration page container
│   └── AuthPages.css            # Page styling
├── services/
│   └── authService.js           # Mock API service
├── context/
│   └── AuthContext.jsx          # Auth state management
├── hooks/
│   └── useAuth.js               # Custom auth hook
├── utils/
│   └── validation.js            # Form validation utilities
├── styles/
│   └── index.css                # Global styles
├── App.jsx                      # Main app component
├── App.css                      # App styling
└── main.jsx                     # Entry point

public/
└── index.html                   # HTML template
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Installation

1. **Clone or navigate to project directory**
   ```bash
   cd "Recovery App"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will open automatically at `http://localhost:3000`
   - Or navigate manually to the provided URL

### Environment Setup

1. **Copy environment template**
   ```bash
   # macOS/Linux
   cp frontend.environment .env.local

   # Windows PowerShell
   Copy-Item frontend.environment .env.local
   ```

2. **Configure the frontend**
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_ENABLE_DEMO_MODE=false
   ```

3. **Backend handoff for cloud database**
   ```bash
   # Share this template with backend and fill real values there
   # macOS/Linux: cp backend.environment .env
   # PowerShell: Copy-Item backend.environment .env
   ```

   Minimum backend variables for MongoDB Atlas:
   - `MONGODB_URI`
   - `MONGODB_DATABASE`
   - `CORS_ALLOWED_ORIGINS`

## Local Sign-In Accounts

The project includes local test accounts for development and validation. Use the credentials below on the login page (`/login`).

### Admin Accounts (added)
- **Sowjanya Gottimukkala**
   - Email: sowjigottimukkala96@gmail.com
   - Password: Password@123
   - Role: admin
- **Prithu Kathet**
   - Email: prithukathet@lewisu.edu
   - Password: Password@123
   - Role: admin
- **Sree Soumith Thanigondala**
   - Email: sreesoumiththanigo@lewisu.edu
   - Password: Password@123
   - Role: admin

### Existing Local Accounts
- **Admin**
   - Username: admin
   - Password: Password@123
   - Role: admin
- **Volunteer**
   - Username: volunteer
   - Password: Volunteer@123
   - Role: volunteer
- **Organization Staff**
   - Username: orgstaff
   - Password: Organization@123
   - Role: organization_staff

Signing in:
- Open the app and navigate to the Login page (`/login`).
- Enter the username and password for any local account above and submit the form.
- When the backend and MongoDB are running locally, authentication uses the backend API.
- Demo mode remains available only for offline UI work.

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot reload

### Build
```bash
npm run build
```
Creates an optimized production build in `dist/` folder

### Preview
```bash
npm run preview
```
Serves the production build locally for testing

### Linting
```bash
npm run lint
```
Check code quality with ESLint

### Fix Linting Issues
```bash
npm run lint:fix
```
Automatically fix linting issues

### Format Code
```bash
npm run format
```
Format code with Prettier

## Features Documentation

### Authentication Flow

1. **Login**
   - User enters username and password
   - Real-time validation provides feedback
   - Remember me checkbox stores preference
   - Session state is restored from saved auth data
   - Success redirects to dashboard

2. **Registration**
   - User enters full name, username, email, and password
   - Password strength indicator shows quality
   - Confirm password must match
   - Terms and conditions must be accepted
   - Registration follows the backend request contract
   - Successful registration signs the user in

3. **Session Management**
   - Authentication token stored in localStorage
   - User context provides global access to auth state
   - Persistent login across page refreshes
   - Logout clears auth state and storage

### Validation

- **Email**: Standard email format validation
- **Password**: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Confirm Password**: Must match password field
- **Full Name**: Required, minimum 2 characters
- **Terms**: Must be checked to register

### Components

#### LoginForm
```jsx
<LoginForm 
  onSuccess={handleSuccess}
  onNavigateToRegister={handleNavigate}
/>
```

#### RegisterForm
```jsx
<RegisterForm 
  onSuccess={handleSuccess}
  onNavigateToLogin={handleNavigate}
/>
```

### Custom Hooks

#### useAuth
```jsx
const { user, token, isAuthenticated, loading, login, register, logout } = useAuth();
```

### API Service

The `authService.js` provides these functions:
- `loginUser(email, password, rememberMe)`
- `registerUser(fullName, email, password, role)`
- `forgotPassword(email)`
- `refreshToken(token)`
- `logoutUser()`
- `getCurrentUser(token)`

## Styling

### CSS Architecture
- Global styles in `src/styles/index.css`
- Component-specific styles alongside components
- CSS variables for consistent theming
- Mobile-first responsive design
- Accessibility-focused color contrast

### Design System
- Primary color: #0066cc
- Success color: #28a745
- Error color: #dc3545
- Warning color: #ffc107
- Consistent spacing and typography

## Accessibility

- ARIA labels and descriptions on form fields
- Keyboard navigation support
- Screen reader friendly error messages
- Color contrast meets WCAG AA standards
- Focus indicators on interactive elements
- Semantic HTML structure

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Vite for fast development and optimized builds
- Code splitting for efficient loading
- Supports further feature expansion through the current routing and component structure
- Optimized CSS and JavaScript

## Future Enhancements (Week 9+)

- [ ] Real API integration
- [ ] JWT token refresh mechanism
- [ ] Password reset flow
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Email verification
- [ ] Account recovery
- [ ] Session timeout handling

## Troubleshooting

### Port Already in Use
```bash
# The dev server will try the next available port
# Or specify a custom port
npm run dev -- --port 3001
```

### Dependencies Not Installing
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload Not Working
- Check that `src/main.jsx` exists
- Verify vite.config.js is in project root
- Try restarting dev server

## API Integration Roadmap

### Current State
- Frontend and backend are connected for authentication and emergency request flows
- Local demo mode is still available for UI-only testing when needed
- Environment variables control which backend the frontend uses

### Backend Endpoints (Ready for integration)
```
POST   /api/auth/login          - User login
POST   /api/auth/register       - User registration
POST   /api/auth/logout         - User logout
POST   /api/auth/forgot-password - Password reset request
POST   /api/auth/refresh        - Refresh auth token
GET    /api/auth/me             - Get current user
```

## Contributing

1. Follow the project structure
2. Use proper component naming
3. Add validation for new forms
4. Keep authentication logic in context
5. Test on mobile and desktop
6. Check accessibility with keyboard navigation

## License

Disaster Relief Resource Coordination System © 2026

## Support

For questions or issues, contact the frontend team lead.
