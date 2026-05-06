# DRRCS Frontend

React + Vite frontend for the Disaster Relief Resource Coordination System.

This README is for the runnable frontend app in `fontend/`. The separate README at `docs/frontend/README.md` is only a documentation index for notes, planning, reference, and final delivery files.

## Folder Layout

```text
fontend/
|-- src/
|   |-- components/
|   |-- context/
|   |-- hooks/
|   |-- lib/
|   |-- pages/
|   |-- services/
|   |-- styles/
|   |-- types/
|   |-- utils/
|   |-- App.jsx
|   `-- main.jsx
|-- index.html
|-- package.json
|-- vite.config.js
|-- frontend.environment
`-- README.md
```

Runtime app files stay in `fontend/`. Frontend documentation lives in `docs/frontend/`.

## Frontend Docs

- Notes: `../docs/frontend/notes`
- Planning: `../docs/frontend/planning`
- Reference: `../docs/frontend/reference`
- Operations: `../docs/frontend/operations`
- Deployment notes: `../docs/frontend/operations/DEPLOYMENT.md`

## Getting Started

```powershell
cd fontend
npm install
npm run dev
```

Vite prints the local URL in the terminal. It is usually `http://localhost:5173`, but it may use another port if that one is busy.

## Environment

Copy the frontend environment template:

```powershell
Copy-Item frontend.environment .env.local
```

Set at least:

```text
VITE_API_BASE_URL=http://127.0.0.1:8080/api
VITE_ENABLE_DEMO_MODE=false
```

Use `127.0.0.1` for local backend calls to avoid Windows resolving `localhost` to IPv6 `::1`.

## Useful Commands

```powershell
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Notes

- The app uses `src/App.jsx` for routing.
- Backend API calls are centralized in `src/lib/api.ts` and `src/services/`.
- Auth state is managed through `src/context/AuthContext.jsx`.
- Generated `dist/` output is build output, not source documentation.
