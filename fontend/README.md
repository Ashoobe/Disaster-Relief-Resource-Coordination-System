# DRRCS Frontend

React + Vite frontend for the Disaster Relief Resource Coordination System.

## Structure

```text
fontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md

docs/
└── frontend/
    ├── notes/
    ├── planning/
    ├── reference/
    └── operations/
```

Runtime app files stay in `fontend/`. Notes, planning documents, audits, and reference material live in `docs/frontend/`.

## Docs

- Notes: [../docs/frontend/notes](../docs/frontend/notes)
- Planning: [../docs/frontend/planning](../docs/frontend/planning)
- Reference: [../docs/frontend/reference](../docs/frontend/reference)
- Deployment: [../docs/frontend/operations/DEPLOYMENT.md](../docs/frontend/operations/DEPLOYMENT.md)

## Getting Started

```bash
cd fontend
npm install
npm run dev
```

Vite will print the local URL in the terminal. It is usually `http://localhost:5173`.

## Environment

Copy the frontend env template:

```powershell
Copy-Item frontend.environment .env.local
```

Set at least:

```text
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_DEMO_MODE=false
```

## Useful Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Cleanup Notes

- `src/Router.jsx` was removed because the live app uses `src/App.jsx`
- placeholder-only and unreferenced mock-data files were removed
- duplicate `public/index.html` was removed because Vite uses the root `index.html`
- generated `dist/` output was removed from the app folder
