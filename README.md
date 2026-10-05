# Session

> A modern productivity and focus management web application built for developers, students, and professionals.

Session helps you manage your daily tasks, run focused work sessions, track productivity, and review your session history through a clean, modern dashboard.

---

## ✨ Features

### 📋 Task Management
- Create tasks
- Edit tasks
- Complete tasks
- Delete tasks
- Due-date support
- Tasks synchronize between Dashboard and Tasks page
- Completed tasks remain visible
- Persistent task data through the backend

### ⏱️ Focus Timer
- Focus session — 25 minutes
- Short break — 5 minutes
- Long break — 15 minutes
- Start session
- Pause session
- Resume session
- Cancel session
- Complete session
- Active task integration
- Session state persists through the backend

### 📊 Analytics
- Today's focus time
- Today's completed sessions
- Total focus time
- Average session duration
- Current streak
- Best streak
- Daily focus breakdown
- Productivity chart
- IST timezone-aware analytics

### 🕘 Session History
- View previous sessions
- Focus sessions
- Short breaks
- Long breaks
- Session duration
- Session status
- Date and time
- Pagination
- Persistent history

### 🔐 Authentication
- User registration
- User login
- Protected API routes
- User-specific data
- Persistent authentication

### 💾 Persistent Backend
All important application data is stored in the database:

- Users
- Tasks
- Focus sessions
- Session history

Refreshing the application does not lose your data.

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- JavaScript / TypeScript
- Responsive UI

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication

## Development

- Git
- GitHub
- REST API
- ESLint
- Next.js development server

---

# 🏗️ Project Architecture

Session follows a separated frontend/backend architecture.

```text
Session/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── analytics/
│   │   │   ├── focus/
│   │   │   ├── sessions/
│   │   │   ├── tasks/
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── components/
│   │   │
│   │   └── lib/
│   │       └── api.ts
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── model/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── ...
│
└── README.md
