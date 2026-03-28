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

## Features (Implementation)

###  Completed

- **Login Page**: Email/password login with validation
- **Registration Page**: User signup with role selection
- **Form Validation**: Client-side validation with real-time feedback
- **Password Strength Indicator**: Visual feedback for password quality
- **Authentication Context**: Global state management for auth
- **Mock API Service**: Simulated backend API calls
- **Responsive Design**: Mobile, tablet, and desktop support
- **Accessibility**: WCAG 2.1 compliant forms
- **Demo Accounts**: Pre-populated credentials for testing

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

2. **Configure if needed** (currently using mocked API)
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_ENABLE_DEMO_MODE=true
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

## Testing Demo Accounts and Signing In

The application includes pre-configured demo and admin accounts for local testing (mocked in `src/services/authService.js` and `src/services/userService.js`). Use the email/password pairs below to sign in via the login page (`/login`).

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

### Existing Demo Accounts
- **Admin Demo**
   - Email: admin@drrcs.test
   - Password: Admin@123456
   - Role: admin
- **Volunteer Demo**
   - Email: volunteer@drrcs.test
   - Password: Volunteer@123
   - Role: volunteer
- **Organization Demo**
   - Email: org@drrcs.test
   - Password: Organization@123
   - Role: organization_staff

Signing in:
- Open the app and navigate to the Login page (`/login`).
- Enter the email and password for any demo account above and submit the form.
- The app uses an in-memory mock service, so accounts are available only while the dev server is running.

Quick-fill and testing tips:
- The login form may include role quick-fill buttons — clicking them auto-populates demo credentials.
- To add or change mock accounts, edit `src/services/authService.js` or `src/services/userService.js` and restart the dev server.

Security note: These mock accounts store plain-text passwords for local testing only. Do not use these credentials in production.

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
   - User enters email and password
   - Real-time validation provides feedback
   - Remember me checkbox stores preference
   - Mocked API simulates server response
   - User data stored in localStorage
   - Success redirects to dashboard

2. **Registration**
   - User enters full name, email, password, and selects role
   - Password strength indicator shows quality
   - Confirm password must match
   - Terms and conditions must be accepted
   - Email uniqueness checked against mock database
   - Auto-login on successful registration

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
- **Role**: Required dropdown selection
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

### API Service (Mock)

The `authService.js` provides these functions:
- `loginUser(email, password, rememberMe)`
- `registerUser(fullName, email, password, role)`
- `forgotPassword(email)`
- `refreshToken(token)`
- `logoutUser()`
- `getCurrentUser(token)`

**Backend Integration Ready**: Replace mock implementations with real API calls in Week 9

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
- Lazy loading ready for future features
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

### Current State (Week 4)
- Mock API responses in `authService.js`
- Simulated network delays
- Test data stored in memory

### Week 9 Integration
- Replace mock functions with real HTTP calls
- Integrate with backend API
- Implement proper error handling
- Add request interceptors
- Token refresh mechanism

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
