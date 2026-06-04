# 🎬 YouTube Watch Party

A real-time YouTube Watch Party application that allows multiple users to watch YouTube videos together in sync.

## 🚀 Live Demo

Frontend: https://your-frontend-url.vercel.app

Backend: https://your-backend-url.onrender.com

---

## Features

* Create Watch Party Rooms
* Join Rooms using Room Code
* Real-time Video Synchronization
* Play / Pause Synchronization
* Seek Synchronization
* Change Video Synchronization
* Role-Based Access Control
* Host, Moderator, Participant Roles
* Assign Roles
* Remove Participants
* Transfer Host
* Real-time Participant Updates using Socket.IO

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* Socket.IO Client
* React YouTube

### Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Architecture Overview

1. User creates or joins a room.
2. Frontend connects to the backend using Socket.IO.
3. Backend maintains room state and participant roles.
4. Host or Moderator actions are validated on the backend.
5. Events are broadcast to all users in the room.
6. YouTube player state remains synchronized for all participants.

---

## Installation

### Backend

```bash
cd backend
npm install
npm start
```

Create a .env file:

```env
PORT=4000
MONGO_URI=your_mongodb_uri
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a .env file:

```env
VITE_BACKEND_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

---

## WebSocket Events

### Client → Server

* join_room
* leave_room
* play
* pause
* seek
* change_video
* assign_role
* remove_participant
* transfer_host

### Server → Client

* sync_state
* user_joined
* user_left
* role_assigned
* participant_removed
* host_transferred

---

## Role Permissions

### Host

* Play / Pause
* Seek
* Change Video
* Assign Roles
* Remove Participants
* Transfer Host

### Moderator

* Play / Pause
* Seek
* Change Video

### Participant

* Watch Only

---

## Future Improvements

* Chat System
* Authentication
* Persistent Room State
* Emoji Reactions
* Redis Scaling

---

## Author

Abhishek Kumar
