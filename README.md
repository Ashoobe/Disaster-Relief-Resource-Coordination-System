# DRRCS Full Stack App

Disaster Relief Resource Coordination System with a React frontend, Spring Boot backend, and MongoDB persistence.

## Structure

```text
.
├── frontend/                 # React + Vite app and frontend tooling
├── backend/                  # Spring Boot API
├── docs/
│   ├── guides/               # How-to docs, user/admin notes, deployment
│   ├── planning/             # Planning artifacts and drafts
│   └── requirements/         # Weekly requirement snapshots
├── archive/                  # Non-active prototype material
└── .github/                  # Repo automation and workflow support
```

## Frontend

- App root: `frontend/`
- Entry HTML: `frontend/index.html`
- Source: `frontend/src/`
- Static assets: `frontend/public/`
- Local env files: `frontend/.env`, `frontend/.env.local`, `frontend/.env.example`

Run it with:

```bash
cd frontend
npm install
npm run dev
```

Build it with:

```bash
cd frontend
npm run build
```

## Backend

- App root: `backend/`
- Source: `backend/src/main/java`
- Config: `backend/src/main/resources/application.yml`
- Env template: `backend/.env.example`
- Dev runner: `backend/run-dev.ps1`

Run it with:

```powershell
cd backend
Copy-Item .env.example .env
.\run-dev.ps1
```

## Docs

- Deployment: [docs/guides/DEPLOYMENT.md](docs/guides/DEPLOYMENT.md)
- Accessibility audit: [docs/guides/ADA_ACCESSIBILITY_AUDIT.md](docs/guides/ADA_ACCESSIBILITY_AUDIT.md)
- User flows: [docs/guides/User_Flows.md](docs/guides/User_Flows.md)
- Weekly requirements: [docs/requirements](docs/requirements)

## Notes

- `archive/application-prototype/` is not part of the live app.
- `frontend/` is now the actual frontend root, not just a nested source folder.
- `backend/` stays separate because it is a different application with its own runtime and deployment path.
