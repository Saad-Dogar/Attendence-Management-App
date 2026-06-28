# Attendance Register — Frontend

The React client for the Attendance Register system. Talks to the FastAPI backend in [`../backend`](../backend) over a JWT-authenticated REST API — see the [root README](../README.md) for the full project overview, API reference, and developer background.

## Stack

- **React + Vite**
- **React Router** for role-based routing (`/login`, `/student`, `/admin`)
- **Axios** with a request interceptor that auto-attaches the JWT from `localStorage` to every call
- **Tailwind CSS v4** with a custom design token set

## Design concept

The direction is "paper attendance register," not a generic SaaS dashboard: a cool paper-white background, ink-navy text, a forest-teal accent for the student role and primary actions, and brass-gold for the admin/teacher role — so the two roles read as visually distinct at a glance, before reading a single word. The signature element is the attendance status badge: a slightly rotated, mono-font pill meant to evoke a stamp on a physical register.

Type pairing: **Space Grotesk** for display headings, **Inter** for body text, **IBM Plex Mono** for dates, timestamps, and status — the mono face reinforces the "ledger data" feel.

Tokens live in `src/index.css` via Tailwind's `@theme` directive (`--color-paper`, `--color-ink`, `--color-stamp`, `--color-brass`, `--color-alert`).

## Folder structure

frontend/
└── src/
├── api.js               # Axios instance + JWT interceptor
├── AuthContext.jsx      # auth state, survives page refresh via /me re-fetch
├── App.jsx              # router + ProtectedRoute (role-gated)
├── Login.jsx
├── StudentDashboard.jsx # mark attendance + personal history table
├── AdminDashboard.jsx   # full grid, filterable by date
└── index.css            # Tailwind import + theme tokens

## Setup

```bash
npm install
```

To point at a deployed backend, create a `.env` file in this folder (omit it for local dev — it falls back to `http://localhost:8000`):

## Run locally

```bash
npm run dev
```

The backend must be running separately on port 8000 — see the root README.

## Build for production

```bash
npm run build
```

Outputs a static bundle to `dist/`, ready for deployment as a static site.
