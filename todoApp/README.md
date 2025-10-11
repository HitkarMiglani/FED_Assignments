# Todo Application

A full-stack Todo application with user authentication and session management.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Session Management**: Persistent login sessions with token verification
- **Personal Todo Lists**: Each user can only see and manage their own tasks
- **CRUD Operations**: Create, read, update, and delete tasks
- **Task Status Management**: Mark tasks as pending or completed
- **Responsive UI**: Clean and user-friendly interface

## Technology Stack

### Backend

- Node.js with Express.js
- JWT for authentication
- bcryptjs for password hashing
- JSON file storage for users and tasks
- CORS enabled for frontend communication

### Frontend

- React with Vite
- React Router for navigation
- Axios for API communication
- Context API for state management
- Responsive CSS styling

## Project Structure

```
todoApp/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── users.json          # User data storage
│   └── tasks.json          # Task data storage
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── components/
│       │   ├── ProtectedRoute.jsx
│       │   └── Navbar.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Signup.jsx
│           └── Dashboard.jsx
├── package.json            # Root package.json for scripts
├── users.json             # Legacy file (backend has its own)
└── tasks.json             # Legacy file (backend has its own)
```

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Option 1: Install All Dependencies at Once

```bash
# From the todoApp root directory
npm install
npm run install-all
```

### Option 2: Install Manually

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install root dependencies (optional - for concurrently)
cd ..
npm install
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together

```bash
# From the todoApp root directory
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000) concurrently.

### Option 2: Run Separately

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/signup` - Register a new user
- `POST /api/login` - User login
- `GET /api/verify` - Verify JWT token

### Tasks (Protected Routes)

- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Usage

1. **Sign Up**: Create a new account with a unique username and password
2. **Login**: Access your account with your credentials
3. **Dashboard**: View your personal task list
4. **Add Tasks**: Create new tasks with titles
5. **Manage Tasks**:
   - Mark tasks as completed or pending
   - Edit task titles
   - Delete tasks
6. **Logout**: Securely end your session

## Data Structure

### User Object

```json
{
  "id": "unique-uuid",
  "username": "string",
  "password": "hashed-password"
}
```

### Task Object

```json
{
  "id": "unique-uuid",
  "userId": "user-uuid",
  "title": "string",
  "status": "pending|completed",
  "createdAt": "ISO-date-string",
  "updatedAt": "ISO-date-string"
}
```

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens for secure authentication
- Protected routes requiring valid tokens
- Users can only access their own tasks
- Token verification on each protected request

## Development

### Backend Development

The backend uses nodemon for automatic restarts during development:

```bash
cd backend
npm run dev
```

### Frontend Development

The frontend uses Vite's hot module replacement:

```bash
cd frontend
npm run dev
```

## Production Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

The backend is ready for production. Make sure to:

1. Change the JWT_SECRET to a secure random string
2. Use environment variables for configuration
3. Consider using a proper database instead of JSON files

## Troubleshooting

1. **Port conflicts**: Backend runs on port 5000, frontend on port 3000
2. **CORS issues**: The backend is configured to accept requests from the frontend
3. **Token issues**: Tokens are stored in localStorage and included in API requests
4. **File permissions**: Ensure the backend can read/write to JSON files
