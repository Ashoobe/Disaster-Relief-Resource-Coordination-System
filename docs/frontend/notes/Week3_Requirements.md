# Week 3: Technology Setup

## Overview
This week focuses on initializing the React project, installing required dependencies, and configuring the folder structure for the DRRCS frontend application.

---

## Tasks

### 1. Initialize React Project
**Steps:**
- [ ] Choose React initialization method (Create React App, Vite, or custom)
- [ ] Create new React project with appropriate configuration
- [ ] Set up Node.js and npm/yarn environment
- [ ] Initialize Git repository
- [ ] Create initial commit with base React app
- [ ] Set up .gitignore file
- [ ] Configure environment variables (.env template)

**Recommended Setup:**
- Node.js version: LTS (v18 or higher)
- Package manager: npm or yarn
- Build tool: Vite (recommended) or Create React App
- Git repo hosting: GitHub, GitLab, or similar

**Initial Configuration Files:**
- [ ] package.json with project metadata and scripts
- [ ] .gitignore for Node modules and build artifacts
- [ ] frontend.environment for environment variables
- [ ] README.md with setup instructions
- [ ] package-lock.json or yarn.lock

---

### 2. Install Required Libraries
**Steps:**
- [ ] Install React Router for client-side routing
- [ ] Install Axios for HTTP requests
- [ ] Select and install UI framework (Material-UI, Chakra UI, Tailwind CSS, etc.)
- [ ] Install state management library (Redux, Zustand, Context API, etc.)
- [ ] Install testing libraries (Jest, React Testing Library)
- [ ] Install development tools (ESLint, Prettier)
- [ ] Install additional utility libraries as needed
- [ ] Verify all dependencies are properly installed

**Core Dependencies:**

#### Routing
- `react-router-dom`: Client-side routing and navigation

#### HTTP Client
- `axios`: Promise-based HTTP client for API calls

#### UI Framework (Choose one)
- `@mui/material` and `@emotion/react` (Material-UI)
- `@chakra-ui/react` and dependencies (Chakra UI)
- `tailwindcss` and `postcss` (Tailwind CSS)

#### State Management (Choose one or use Context API)
- `redux` and `react-redux`: Predictable state management
- `zustand`: Lightweight state management
- Context API: Built-in React solution

#### Testing
- `@testing-library/react`: Component testing utilities
- `@testing-library/jest-dom`: Jest matchers for DOM
- `jest`: Testing framework

#### Development Tools
- `eslint`: Code linting
- `prettier`: Code formatting
- `husky`: Git hooks
- `lint-staged`: Run linters on staged files

**Optional Utilities:**
- `lodash` or `underscore`: Utility functions
- `date-fns` or `moment`: Date manipulation
- `react-hook-form`: Form management
- `yup` or `zod`: Schema validation

---

### 3. Configure Folder Structure
**Steps:**
- [ ] Create organized directory structure
- [ ] Set up src/ directory with subdirectories
- [ ] Create public/ directory for static assets
- [ ] Set up configuration files directory
- [ ] Create documentation directory
- [ ] Create example/template files
- [ ] Document folder structure in README

**Recommended Folder Structure:**

```
recovery-app/
├── public/                 # Static files
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/         # Reusable React components
│   │   ├── common/         # Common/shared components
│   │   ├── auth/           # Authentication-related components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── admin/          # Admin panel components
│   │   └── volunteer/      # Volunteer-related components
│   ├── pages/              # Page components (routes)
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── RequestFormPage.jsx
│   │   ├── VolunteerPage.jsx
│   │   └── AdminPage.jsx
│   ├── services/           # API and external services
│   │   ├── api.js          # Axios instance and API calls
│   │   └── authService.js
│   ├── context/            # React Context files
│   │   ├── AuthContext.js
│   │   └── AppContext.js
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── utils/              # Utility functions
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── styles/             # Global styles
│   │   ├── index.css
│   │   └── variables.css
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── tests/                  # Test files
├── frontend.environment    # Environment variables reference
├── .gitignore              # Git ignore rules
├── .eslintrc.json          # ESLint configuration
├── .prettierrc              # Prettier configuration
├── vite.config.js          # Vite configuration (if using Vite)
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
└── README.md               # Project documentation
```

**Folder Purposes:**
- `public/`: Static assets served as-is
- `src/components/`: Reusable UI components organized by feature
- `src/pages/`: Full-page route components
- `src/services/`: API calls and external integrations
- `src/context/`: Global state management with React Context
- `src/hooks/`: Custom React hooks for logic reuse
- `src/utils/`: Helper functions and constants
- `src/styles/`: Global and shared styles

---

### 4. Set Up Development Workflow
**Steps:**
- [ ] Configure npm/yarn scripts (start, build, test, lint)
- [ ] Set up ESLint and Prettier rules
- [ ] Configure Git hooks with Husky
- [ ] Document development setup in README
- [ ] Create contribution guidelines
- [ ] Set up branch naming conventions
- [ ] Configure pre-commit hooks for code quality

**NPM Scripts to Configure:**
- `npm start` or `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run lint`: Check code quality
- `npm run format`: Format code with Prettier
- `npm run lint:fix`: Fix linting issues

---

## Deliverables

### 1. Git Repository with Base React App
- Fully initialized React project
- All required dependencies installed
- Git repository initialized with initial commit
- Repository hosted on GitHub/GitLab/etc.
- README with clear setup and run instructions
- All configuration files in place

**Checklist:**
- [ ] React app runs without errors
- [ ] `npm start` or `npm run dev` works correctly
- [ ] Build process works: `npm run build`
- [ ] All dependencies installed and locked
- [ ] Initial commit pushed to repository
- [ ] .gitignore prevents tracking unnecessary files

### 2. Organized Folder Structure
- All directories created as per specification
- Folder structure documented in README
- Example files in key directories
- Clear separation of concerns
- Structure supports scalability

**Checklist:**
- [ ] All folders created and initialized
- [ ] Example component files in place
- [ ] Styles and utilities organization clear
- [ ] Services layer ready for API integration
- [ ] Tests directory populated with example test
- [ ] Documentation reflects folder structure

---

## Notes
- Use Vite for faster development experience (recommended over Create React App)
- Consider using TypeScript for better type safety (optional but recommended)
- Install ESLint and Prettier to maintain code quality from the start
- Keep the node_modules/ directory in .gitignore
- Create frontend.environment to document required environment variables
- Ensure all team members use the same Node.js version (consider using .nvmrc or similar)
- Document any custom scripts or configurations in README
