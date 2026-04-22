# Week 3: Technology Setup

## Overview

This week focuses on initializing the React project, installing required dependencies, and configuring a scalable folder structure for the DRRCS frontend application.

---

## Tasks

### 1. Initialize React Project

**Steps:**
- [ ] Choose React initialization method
- [ ] Create the React project with the required configuration
- [ ] Set up Node.js and npm/yarn
- [ ] Initialize Git
- [ ] Create the initial commit
- [ ] Set up `.gitignore`
- [ ] Configure environment variables

**Initial Configuration Files:**
- [ ] `frontend/package.json` with project metadata and scripts
- [ ] `.gitignore` for Node modules and build artifacts
- [ ] `frontend/.env.example` for frontend environment variables
- [ ] `backend/.env.example` for backend environment variables
- [ ] `README.md` with setup instructions
- [ ] `frontend/package-lock.json` or `yarn.lock`

---

### 2. Install Required Libraries

**Steps:**
- [ ] Install React Router for client-side routing
- [ ] Install the HTTP client and UI dependencies
- [ ] Install testing libraries
- [ ] Install development tools such as ESLint and Prettier
- [ ] Verify all dependencies are properly installed

**Core Dependencies:**
- `react-router-dom`
- `@mui/material`
- `tailwindcss`
- `react-hook-form`
- `eslint`
- `prettier`

---

### 3. Configure Folder Structure

**Steps:**
- [ ] Create an organized directory structure
- [ ] Keep the frontend under its own app root
- [ ] Keep the backend under its own app root
- [ ] Move documentation into dedicated folders
- [ ] Document the structure in `README.md`

**Recommended Folder Structure:**

```text
recovery-app/
├── frontend/
│   ├── index.html
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   └── .env.example
├── docs/
│   ├── guides/
│   ├── planning/
│   └── requirements/
├── archive/
└── README.md
```

**Folder Purposes:**
- `frontend/public/`: Static assets served as-is
- `frontend/src/components/`: Reusable UI components organized by feature
- `frontend/src/pages/`: Full-page route components
- `frontend/src/services/`: API calls and external integrations
- `frontend/src/context/`: Global state management with React Context
- `frontend/src/hooks/`: Custom React hooks for logic reuse
- `frontend/src/utils/`: Helper functions and constants
- `frontend/src/styles/`: Global and shared styles
- `docs/`: Non-runtime project documentation
- `archive/`: Prototype or inactive material kept for reference

---

### 4. Set Up Development Workflow

**Steps:**
- [ ] Configure npm scripts
- [ ] Set up ESLint and Prettier rules
- [ ] Document development setup in `README.md`
- [ ] Create contribution guidance

**Frontend Commands:**
- `cd frontend && npm run dev`
- `cd frontend && npm run build`
- `cd frontend && npm run lint`
- `cd frontend && npm run format`

---

## Deliverables

### 1. Git Repository with Base React App
- Fully initialized React project
- Required dependencies installed
- Clear setup and run instructions
- Configuration files in place

### 2. Organized Folder Structure
- Frontend grouped under `frontend/`
- Backend grouped under `backend/`
- Documentation grouped under `docs/`
- Structure supports growth and clearer ownership

---

## Notes

- Use Vite for faster development workflow
- Keep `node_modules/` ignored
- Keep frontend and backend env templates in their own application folders
- Document custom scripts and configuration decisions in `README.md`
