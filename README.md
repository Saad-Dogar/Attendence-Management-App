# 📋 Attendance Register

A full-stack attendance management system built in a single focused sprint — FastAPI + SQLAlchemy on the backend, React (Vite) + Tailwind on the frontend, with JWT-based role authentication separating Student and Admin (Teacher) workflows.

## 🚀 Live Demo & Test Accounts

Experience the live application here: **[Attendance Management App](https://attendence-management-app-1.onrender.com/login)**

The deployed database is populated with realistic test data, including 30 days of randomized historical attendance. Feel free to explore using the following credentials:

**Admin (Teacher) View**
* **Username:** `teacher2` (or `teacher3`)
* **Password:** `pass123`
* *Test:* View the global dashboard and filter historical attendance by date.

**Student View**
* **Username:** `student1` (through `student10`)
* **Password:** `pass123`
* *Test:* Mark today's attendance and view your personal history.

## What it does

Two roles, two distinct experiences, one shared register:

**Students**
- Sign up and log in
- Mark today's attendance with a single click (server-enforced — one record per day, no double-marking)
- View their personal attendance history

**Admins (Teachers)**
- Log in to a separate dashboard
- View a grid of every student's attendance across all dates
- Filter the grid by a specific date

Every status in the UI renders as a slightly rotated, mono-font "stamp" badge — a deliberate design choice meant to echo a real paper attendance register being stamped present, rather than a generic colored status dot.

## Tech stack

| Layer | Tools |
|---|---|
| Backend | FastAPI, SQLAlchemy, Pydantic, python-jose (JWT), Passlib (bcrypt) |
| Database | SQLite locally, PostgreSQL in production |
| Frontend | React + Vite, React Router, Axios, Tailwind CSS v4 |
| Auth | OAuth2 password flow + JWT bearer tokens, role-gated on both client and server |
| Deployment | Render (Web Service + Static Site + Postgres) |

## Architecture, briefly

The backend is a stateless REST API — every protected route resolves the current user from the JWT via a FastAPI dependency, never from anything the client sends in the request body, so a student can never spoof another user's identity or mark someone else's attendance. Role checks (`require_admin`) live in one reusable dependency rather than being duplicated per route. The frontend mirrors this with a `ProtectedRoute` wrapper that redirects based on the authenticated user's role, so a student can't even render the admin grid, let alone call its API.

## Getting started — backend

To run the backend locally:

1. Navigate to the backend folder and activate your virtual environment:
   `cd backend`
   `python3 -m venv venv`
   `source venv/bin/activate`
   `pip install -r requirements.txt`

2. Create a `.env` file in `backend/` with the following variables:
   `SECRET_KEY=<your_generated_secret_key>`
   `ALGORITHM=HS256`
   `ACCESS_TOKEN_EXPIRE_MINUTES=60`
   `DATABASE_URL=sqlite:///./attendance.db`

3. Run the server:
   `uvicorn main:app --reload --port 8000`

Interactive API docs: **http://localhost:8000/docs**

## Getting started — frontend

See `frontend/README.md` for client setup instructions.

## API overview

| Method | Route | Who | Purpose |
|---|---|---|---|
| POST | `/signup` | Public | Create a student or admin account |
| POST | `/login` | Public | Exchange credentials for a JWT |
| GET | `/me` | Authenticated | Return the current user's profile |
| POST | `/attendance/mark` | Student | Mark today's attendance |
| GET | `/attendance/me` | Student | View own attendance history |
| GET | `/admin/attendance` | Admin | View/filter the full attendance grid |

## Project structure

Attendance-App/
├── backend/
│   ├── main.py        # routes
│   ├── models.py      # SQLAlchemy models — User, Attendance
│   ├── schemas.py     # Pydantic request/response shapes
│   ├── auth.py        # hashing, JWT, role-gate dependencies
│   └── database.py    # SQLite/Postgres engine config
└── frontend/
    └── src/
        ├── api.js              # Axios instance, JWT auto-attach
        ├── AuthContext.jsx     # current-user state, login/logout
        ├── App.jsx             # routing + role-protected routes
        ├── Login.jsx
        ├── StudentDashboard.jsx
        └── AdminDashboard.jsx

## About the developer

Built by **Muhammad Saad Saleem** ([@Saad-Dogar](https://github.com/Saad-Dogar)) — Computer Science student at **FAST-NUCES**. Currently a Technical Intern at **TechRealm** (since June 2026), contributing to **Preserve My World**, a non-profit NeRF/3D scene reconstruction initiative.

Core background is strictly in C++ — focusing on pointer arithmetic, dynamic memory allocation using `new` and `delete[]`, and low-level systems thinking — visible in other repos like [ONYX-16](https://github.com/Saad-Dogar/ONYX-16), a 16-bit virtual computer with a custom bilingual assembler, and a raw Win32/GDI text editor. This project was a deliberate stretch in the other direction: a complete full-stack web application.

## License

Built for academic/portfolio purposes. Feel free to fork and adapt.
