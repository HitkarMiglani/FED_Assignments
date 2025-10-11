# Academy Gatekeeper (AcademyStudents_react)

This project is a small demo Gatekeeper app used by students to register and login. It uses a lightweight Node.js backend to store user records in a JSON file and a Vite + React frontend to provide Signup and Login UI.

Project structure

```
AcademyStudents_react/
├─ backend/      # Node.js API (Express)
│  ├─ server.js
│  ├─ authService.js
│  ├─ storage.js
│  ├─ users.json
│  └─ package.json
├─ frontend/     # Vite + React frontend
│  ├─ src/
│  │  ├─ pages/ (Signup, Login, Welcome)
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ package.json
│  └─ vite.config.js
└─ README.md
```

Quick overview

- Backend: Express server exposing two endpoints:
  - `POST /signup` — register a new user. Validates input, hashes password, stores user in `users.json`.
  - `POST /login` — validate user credentials and return basic user info.
- Frontend: Vite + React app with pages for Signup, Login, and a small Welcome/dashboard. The frontend stores the logged-in user in `localStorage` (key `academy_user`) and updates the header to show the user and Logout button.

Run locally (Windows PowerShell)

1. Start the backend

```powershell
cd 'c:\Users\Admin\Desktop\unisem5\frontend\assignments\AcademyStudents_react\backend'
npm install
node server.js
```

The backend listens by default on http://localhost:3000.

2. Start the frontend in a separate terminal

```powershell
cd 'c:\Users\Admin\Desktop\unisem5\frontend\assignments\AcademyStudents_react\frontend'
npm install
npm run dev
```

Open the Vite dev URL (usually http://localhost:5173).

Notes & features

- Data storage: `backend/users.json` stores users as an array. `authService.js` uses bcrypt for password hashing and `storage.js` to read/write the JSON file.
- CORS: backend enables CORS so the frontend can call it from Vite dev server.
- Session: frontend persists a minimal user object in localStorage; there's no token implementation yet.
- Dev UX: header updates immediately after login/signup via a small `authChange` event so you don't need to refresh the page.