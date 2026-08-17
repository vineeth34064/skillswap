# SkillSwap — Peer-to-Peer Skill-Exchange Platform

> **Tagline**: *Exchange Skills, Not Money.*

SkillSwap is a production-quality peer-to-peer skill exchange platform where people exchange their time and knowledge instead of paying money.

---

## 🌟 Vision & Core Concept

1. **Direct Skill Swaps**: Reciprocal 1-on-1 swaps (e.g. User A teaches User B C++ for 1 hour, User B teaches User A Photoshop for 1 hour).
2. **Time Credit Economy**: Indirect skill exchanges using a time wallet system:
   $$\text{Teach 1 hour} \rightarrow +1.0 \text{ Credit}$$
   $$\text{Learn 1 hour} \rightarrow -1.0 \text{ Credit}$$
   New users receive a signup gift of **2.0 Free Time Credits** so they can start learning immediately!

---

## 🏗 Monorepo Architecture

```text
skillswap/
├── apps/
│   ├── web/               # React + Vite + Tailwind CSS + Framer Motion + Socket.IO + PWA
│   │   ├── src/
│   │   │   ├── api/        # Axios API Client
│   │   │   ├── context/    # AuthContext & SocketContext
│   │   │   ├── components/ # Navbar, Footer, MatchCard, TimeCreditBadge, LocationMapVisualizer, etc.
│   │   │   └── pages/      # LandingPage, Dashboard, Discover, Matches, Sessions, Chat, Profile, Admin
│   │   └── public/        # PWA manifest.json & sw.js
│   │
│   └── mobile/            # React Native + Expo + Expo Router + NativeWind + FloatingActionButton
│       └── app/
│           └── (tabs)/    # Home, Discover, Matches, Messages, Profile
│
├── server/                # Node.js + Express.js + Socket.IO + Mongoose
│   ├── config/            # DB Connection with MongoDB Memory Server auto-fallback
│   ├── controllers/       # Auth, User, Skill, Match, Session, Credit, Chat, Review, Admin
│   ├── models/            # User, Skill, UserSkill, Match, Session, CreditTransaction, Chat, Review, Dispute
│   ├── services/          # Multi-Factor Matching Engine & Trust Score Calculator
│   ├── sockets/           # Real-Time Socket.IO Handler
│   └── seed.js            # Comprehensive Seed Script
│
├── shared/                # Shared constants, categories, skill levels, and transaction types
├── package.json           # Monorepo workspace configuration
└── README.md              # Project documentation
```

---

## 🚀 Quick Setup & Local Execution

### 1. Installation
Install all root and workspace dependencies:

```bash
npm run install:all
```

### 2. Seed Database
Populate database with 10+ demo users, 20+ core skills, reciprocal matches, sample sessions, credit transactions, reviews, and chat history:

```bash
npm run seed
```

### 3. Run Development Servers
To run the backend Express server:
```bash
npm run dev:server
```

To run the React Web frontend (Vite):
```bash
npm run dev:web
```

To start the Expo Mobile application:
```bash
npm run dev:mobile
```

---

## ⚡ Time Credit & Anti-Fraud Engine

- **Immutable Ledger**: Every credit balance update is logged in the `CreditTransaction` collection (`EARN`, `SPEND`, `BONUS`, `REFUND`, `PENALTY`).
- **Dual Confirmation Rule**: Session credits (+1.0 to teacher, -1.0 from learner) are **ONLY** released when **BOTH** participants click "Confirm Session Completion" after finishing the meeting.
- **Dispute System**: If a session goes wrong or experiences a no-show, users can open a dispute for admin review.

---

## 🔍 Matching Algorithm

Match scores (0–100%) are calculated dynamically based on:

1. **Skill Compatibility (40%)**: Reciprocal 1-on-1 swap or 1-way demand match.
2. **Availability Overlap (20%)**: Overlapping days of the week and time ranges.
3. **Location / Distance (10%)**: Proximity in km calculated using the Haversine formula (< 5km = 100%).
4. **Learning Preference (10%)**: Online vs In-person vs Both.
5. **Skill Level Compatibility (10%)**: Teacher level >= Learner requested level.
6. **Rating & Trust Score (10%)**: Peer reviews and trust score gauge.

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | User signup + 2.0 Time Credits bonus |
| `POST` | `/api/auth/login` | JWT sign in |
| `GET` | `/api/auth/me` | Fetch authenticated profile |
| `GET` | `/api/skills` | List centralized skills directory |
| `POST` | `/api/skills` | Submit skill / AI skill normalization |
| `GET` | `/api/matches` | Run multi-factor matching engine |
| `GET` | `/api/sessions` | Fetch user upcoming & completed sessions |
| `POST` | `/api/sessions/request` | Schedule session request |
| `PATCH` | `/api/sessions/:id/confirm` | Dual-confirmation credit release |
| `GET` | `/api/credits/wallet` | Fetch Time Credit balance & ledger history |
| `GET` | `/api/chat/conversations` | Get active chat threads |
| `POST` | `/api/chat/messages` | Send real-time message |
| `POST` | `/api/reviews` | Submit post-session review & rating |
| `GET` | `/api/admin/stats` | Platform overview metrics (Admin only) |

---

## 🌐 Deployment Instructions

- **Web Frontend**: Deploy `apps/web` to **Vercel** or **Netlify**.
- **Backend API**: Deploy `server` to **Render**, **Railway**, or **Fly.io**.
- **Database**: Connect to **MongoDB Atlas** database cluster.
- **Mobile Application**: Build and publish via **Expo Application Services (EAS)**.

---

## 🛡 Privacy & Security

- Password hashing using **bcryptjs** (salt factor 10).
- JWT authentication with secure HTTP-only cookies on web and SecureStore on mobile.
- Approximate distance calculation; **never** exposes exact user home addresses.
- Rate limiting, Helmet security headers, CORS protection, and input sanitization.
