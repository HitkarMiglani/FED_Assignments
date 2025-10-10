# Academy Gatekeeper App

A lightweight Node.js service that lets Code Academy students sign up and log in using a shared `users.json` file instead of a database.

## Features

- **Signup door** – create an account with a name and password (minimum 6 characters).
- **Login door** – verify credentials and return the student profile (without password).
- **users.json storage** – clean JSON array persists the registered students.
- **Validation & hashing** – input validation plus bcrypt password hashing for safety.


## Quick start

```powershell
cd AcademyStudents
npm install
npm start
```

Then POST to the API:

- `POST /signup` with body `{ "name": "Alice", "password": "secret123" }`
- `POST /login` with body `{ "name": "Alice", "password": "secret123" }`

The server listens on `http://localhost:3000` by default.

### Optional: use the preview page

Open `preview.html` from this folder in your browser while the server is running. The page pings the API, lets you submit signup/login forms, and pretty-prints the responses so you can verify the gates without leaving the browser.

## Project structure

- `server.js` – Express API with signup & login routes.
- `authService.js` – core business logic and error definitions.
- `storage.js` – helpers to read/write `users.json` safely.
- `users.json` – persisted user records (array of objects).
- `preview.html` – simple client to try the endpoints from a browser.

## Notes

- Passwords are hashed with bcrypt before being saved.
- Error responses use appropriate HTTP status codes (400/401/409/500).
- To reset the storage, delete or empty `users.json`.

## Made By -> Hitkar Miglani
