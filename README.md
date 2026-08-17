# ⚡ SkillSwap — Peer-to-Peer Skill Barter & Time Banking Platform

<div align="center">

![SkillSwap Banner](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80)

[![React](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Backend-Node.js_%7C_Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-010101?style=for-the-badge&logo=socket.dot.io)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS_Liquid_Glass-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Animations-Framer_Motion-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

**Exchange knowledge, barter skills, and grow together without money. 1 hour taught = 1 Time Credit earned.**

</div>

---

## 🌟 Platform Highlights

SkillSwap is a reciprocal skill-sharing platform where community members trade talents through a **1-to-1 Time Banking system**. Whether learning Python, UX Design, Spanish, or Cooking, users exchange time, build trust ratings, and connect live via Google Meet.

### ✨ Key Features

- ⚡ **Time Credit Banking**:
  - New users receive **+2.0 free initial credits**.
  - Teaching 1 hour earns **+1.0 Time Credit**; learning transfers **1.0 Credit** to the mentor upon dual confirmation.
- 🎯 **Smart Reciprocal Matching Engine**:
  - Automatically matches users whose learning goals align with another user's teaching skills.
- 🎥 **Integrated Google Meet & Calendar Reminders**:
  - 1-click **Live Google Meet** creation for online video sessions.
  - **📅 5-Minute Google Calendar Notification**: Pre-fills calendar invites with Google Meet URLs and 5-minute alerts.
- 🌟 **5-Criterion Peer Rating & Trust Engine**:
  - After sessions, peers evaluate mentors across 5 key dimensions:
    1. 💡 *Explanation & Clarity*
    2. 🎓 *Teaching Methodology*
    3. 💬 *Communication Skill*
    4. ⭐ *Behavior & Respect*
    5. ⏰ *Punctuality & Reliability*
  - Automatically recalculates **Trust Scores (0–100%)** and updates Leaderboard standing.
- 📥 **Dedicated Swap Requests Workspace (`/requests`)**:
  - Filter by **Incoming Requests**, **Sent Requests**, and **Active Accepted Swaps**.
  - **Accept (`✓`)** or **Reject (`✕`)** swap requests with real-time status updates.
  - **`🗑️ Clear Past Meetings`**: Easily clean completed/declined sessions from history.
- 🏆 **Community Leaderboard**:
  - Filter top mentors by category (Design, Tech, Languages, Arts, Music) and trust badges (e.g. *Top Mentor*, *Verified Pro*).
- 💬 **Live Socket.io Direct Messaging**:
  - Instant 1-on-1 peer messaging with read receipts and active typing indicators.
- 💎 **Liquid Glassmorphism Aesthetic**:
  - Built with frosted glass backdrops, dynamic glowing gradients, and fluid Framer Motion micro-animations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, Lucide React, Axios |
| **Backend** | Node.js, Express.js, Socket.io, JSON Web Tokens (JWT), Bcrypt |
| **Database** | MongoDB, Mongoose ORM |
| **Design System** | Custom Liquid Glassmorphism, Specular Highlights, HSL Tailored Palettes |

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** >= v18.0.0
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/skillswap`) or MongoDB Atlas URI

---

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/<your-username>/skillswap.git
cd skillswap

# Install root & workspace dependencies
npm install
cd apps/web && npm install
cd ../../server && npm install
```

---

### 3. Configure Environment Variables

Create `.env` inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/skillswap
JWT_SECRET=skillswap_ultra_secure_jwt_secret_key_2026_!@#
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

---

### 4. Seed Database with Initial Test Data

Populate pre-configured skills, top mentors, and sample sessions:

```bash
cd server
node seed.js
```

> **Seeded Test Credentials**:
> - **Sarah Jenkins**: `sarah@skillswap.dev` / `password123` *(UI/UX Designer)*
> - **Vineet Kumar**: `vineet@skillswap.dev` / `password123` *(Full-Stack Developer)*
> - **Admin User**: `admin@skillswap.dev` / `password123`

---

### 5. Run the Application

Start backend & frontend concurrently:

```bash
# Terminal 1 — Express Backend API (Port 5000)
cd server
npm run start

# Terminal 2 — Vite React Frontend (Port 5173)
cd apps/web
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 📁 Repository Structure

```
skillswap/
├── apps/
│   └── web/                   # Vite React Frontend
│       ├── public/            # Static assets & PWA manifest
│       └── src/
│           ├── api/           # Axios HTTP client configuration
│           ├── components/    # Reusable UI & Modal components
│           │   ├── GlassDockNavbar.jsx
│           │   ├── SwapRequestModal.jsx
│           │   ├── PeerRatingModal.jsx
│           │   ├── OnboardingWizard.jsx
│           │   └── TimeCreditBadge.jsx
│           ├── context/       # Auth & Socket.io Context providers
│           └── pages/         # Page routes (Dashboard, Discover, Matches, Requests, Sessions, etc.)
├── server/                    # Node.js Express REST API & WebSockets
│   ├── config/                # MongoDB database connection
│   ├── controllers/           # Route logic (Auth, Sessions, Reviews, Matches, Leaderboard)
│   ├── middleware/            # JWT authentication & error handling
│   ├── models/                # Mongoose Schema Models (User, Skill, Session, Review, etc.)
│   ├── routes/                # Express API route declarations
│   ├── services/              # Trust Score & Reciprocal Matching algorithms
│   └── seed.js                # Database seeder script
├── shared/                    # Shared constants across workspaces
└── README.md
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account (+2.0 Time Credits) |
| `POST` | `/api/auth/login` | Email & password authentication |
| `GET` | `/api/users/profile` | Retrieve logged-in user profile & skills |
| `GET` | `/api/matches` | Retrieve reciprocal peer mentor matches |
| `GET` | `/api/sessions` | List user sessions (requests, active, completed) |
| `POST` | `/api/sessions/request` | Initiate a new skill swap session |
| `PATCH` | `/api/sessions/:id/respond` | Accept or Decline a swap request |
| `PATCH` | `/api/sessions/:id/confirm` | Confirm session completion & transfer credits |
| `DELETE` | `/api/sessions/:id` | Clear specific session from history |
| `DELETE` | `/api/sessions/clear-past` | Clear all past/declined meetings |
| `POST` | `/api/reviews` | Submit 5-criterion peer rating & update Trust Score |
| `GET` | `/api/leaderboard` | Top mentors ranked by trust score and hours taught |

---

## 📜 License

Distributed under the **MIT License**. Free to use, modify, and distribute.
