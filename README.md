# Chat-App (Discord-style)

A real-time chat application with **user accounts**, **room list**, and **real-time messaging** — similar to Discord.

## Features

- **Sign up & log in** – username, email, password (JWT auth)
- **Dashboard** – list of rooms you’ve joined
- **Join room** – one field: Room ID (username comes from your account)
- **Create room** – optional custom Room ID or auto-generated
- **Real-time chat** – WebSocket (STOMP over SockJS)
- **Message history** – previous messages load when you open a room
- **Back to rooms** – leave chat and return to your room list

## Prerequisites

- **Node.js** (for frontend)
- **Java 21** and **Maven** (for backend)
- **MongoDB** at `mongodb://127.0.0.1:27017`

## Run the project

### 1. Backend

```bash
cd backend
mvn spring-boot:run
```

Runs at **http://localhost:8080**. Uses DB `chatapp`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:5173**.

### 3. Use the app

1. Open http://localhost:5173
2. **Sign up** (or **Sign in** if you have an account).
3. On the **dashboard** you’ll see “Your rooms” and two buttons:
   - **Join room** – enter a Room ID; you join as your logged-in username.
   - **Create room** – create a new room (optional custom ID).
4. Click a room to open it, or join/create one to open it.
5. Chat in real time. Use **Back to rooms** to return to the dashboard.

## Tech stack

- **Frontend**: React 19, Vite, React Router, Tailwind CSS, STOMP/SockJS, Axios, react-hot-toast
- **Backend**: Spring Boot 4, Spring Security, JWT, Spring WebSocket (STOMP), Spring Data MongoDB
