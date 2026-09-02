# ⚡ SkillSwap — Complete Features & Functionality Manual (`features.md`)

> **Version**: 2.0.0  
> **Status**: Official Platform Specifications & Feature Manual  
> **Target Audience**: Developers, Product Managers, End Users, Auditors  

---

## 📖 Executive Overview

**SkillSwap** is a reciprocal peer-to-peer knowledge exchange and time-banking platform designed to democratize learning without financial barriers. The system operates on a strict **1-to-1 Time Banking Model** where 1 hour of teaching earns 1 Time Credit, and 1 hour of learning transfers 1 Time Credit to the mentor upon dual session confirmation.

This document details **every feature**, its **underlying technical functionality**, and a **concrete real-world example** illustrating user inputs, system operations, API payloads, and expected outcomes.

---

## 📋 Table of Contents

1. [Feature 1: Reciprocal Time Credit Banking System](#feature-1-reciprocal-time-credit-banking-system)
2. [Feature 2: Smart Reciprocal Peer Matching Engine](#feature-2-smart-reciprocal-peer-matching-engine)
3. [Feature 3: 5-Criterion Peer Rating & Trust Engine](#feature-3-5-criterion-peer-rating--trust-engine)
4. [Feature 4: Integrated Google Meet & 5-Minute Calendar Reminders](#feature-4-integrated-google-meet--5-minute-calendar-reminders)
5. [Feature 5: Dedicated Swap Requests Workspace (`/requests`)](#feature-5-dedicated-swap-requests-workspace-requests)
6. [Feature 6: Community Leaderboard & Trust Badges (`/leaderboard`)](#feature-6-community-leaderboard--trust-badges-leaderboard)
7. [Feature 7: Real-Time Socket.io Direct Messaging & WebSockets (`/chat`)](#feature-7-real-time-socketio-direct-messaging--websockets-chat)
8. [Feature 8: Liquid Glassmorphism Design System & Command Palette (`Cmd+K`)](#feature-8-liquid-glassmorphism-design-system--command-palette-cmdk)
9. [Feature 9: Multi-Step Interactive Onboarding Wizard](#feature-9-multi-step-interactive-onboarding-wizard)
10. [Feature 10: Admin Moderation & Platform Analytics Dashboard (`/admin`)](#feature-10-admin-moderation--platform-analytics-dashboard-admin)

---

## 1. ⏱️ Feature 1: Reciprocal Time Credit Banking System

### ⚙️ Functionality
- **Signup Bonus**: Upon registration, every new user account is automatically credited with **+2.0 Time Credits**.
- **Credit Balance Locking & Verification**: When a user initiates a skill swap request, the backend verifies that `requester.timeCredits >= durationHours`. If insufficient credits exist, the transaction is rejected with an informative error.
- **Dual Confirmation Settlement**:
  1. The student clicks **"Confirm Session Completion"**.
  2. The mentor clicks **"Confirm Session Completion"**.
  3. Once both boolean flags (`requesterConfirmed: true`, `mentorConfirmed: true`) are set, an atomic database transaction occurs:
     - `requester.timeCredits -= 1.0`
     - `mentor.timeCredits += 1.0`
     - `requester.hoursLearned += 1.0`
     - `mentor.hoursTaught += 1.0`
     - A permanent `CreditTransaction` log entry is recorded with status `SUCCESS`.

### 💡 Concrete Real-World Example
- **Scenario**: Sarah Jenkins (UI/UX Designer, initial balance **2.0 Credits**) wants to learn React from Vineet Kumar (Full-Stack Dev, initial balance **1.5 Credits**).
- **Step 1 (Request)**: Sarah schedules a 1.0-hour session. Backend checks `Sarah.timeCredits >= 1.0` (Passes: 2.0 >= 1.0).
- **Step 2 (Session Execution)**: Both join the Google Meet call and complete the 1-hour workshop.
- **Step 3 (Dual Confirmation)**:
  - Sarah clicks "Confirm Session Completion" (`requesterConfirmed = true`).
  - Vineet clicks "Confirm Session Completion" (`mentorConfirmed = true`).
- **Result**:
  - Sarah's Balance: **1.0 Credit** (2.0 - 1.0)
  - Vineet's Balance: **2.5 Credits** (1.5 + 1.0)
  - Audit Log: `CreditTransaction` created with ID `tx_849201` linking both user IDs.

---

## 2. 🎯 Feature 2: Smart Reciprocal Peer Matching Engine

### ⚙️ Functionality
The platform computes a multi-factor **Reciprocal Match Score (0–100%)** between any two users by evaluating three weighted vectors:

$$\text{Match Score} = (W_{\text{skill}} \times S_{\text{skill}}) + (W_{\text{trust}} \times S_{\text{trust}}) + (W_{\text{geo}} \times S_{\text{geo}})$$

1. **Skill Reciprocity (60%)**: Checks if User A's `TEACH` skills match User B's `LEARN` skills AND User B's `TEACH` skills match User A's `LEARN` skills (Dual Mutual Match = 100% skill score).
2. **Trust Alignment (25%)**: Compares the average Trust Score of both users to ensure high quality.
3. **Geographic / Mode Preferences (15%)**: Evaluates overlap in location (city/country) and meeting mode (`Online`, `In-Person`, `Both`).

### 💡 Concrete Real-World Example
- **User A (Alex)**:
  - *Teaches*: Python, Data Science
  - *Wants to Learn*: Spanish, Guitar
  - *Trust Score*: 92%
- **User B (Maria)**:
  - *Teaches*: Spanish, Acoustic Guitar
  - *Wants to Learn*: Python
  - *Trust Score*: 96%
- **System Action**:
  - Skill Reciprocity: Alex teaches Python (Maria wants Python) & Maria teaches Spanish/Guitar (Alex wants Spanish/Guitar) ➔ **100% Skill Match**.
  - Trust Alignment: Both > 90% ➔ **95% Trust Score Match**.
  - Final Computed Score: **98% Reciprocal Match**.
- **UI Output**: Displayed on `/matches` page with a glowing **98% Reciprocal Match Ring** and one-click "Request Skill Swap" trigger.

---

## 3. 🌟 Feature 3: 5-Criterion Peer Rating & Trust Engine

### ⚙️ Functionality
After a session is completed, peers evaluate each other across 5 core pedagogical and professional dimensions (1 to 5 stars):
1. 💡 **Explanation & Clarity**: Ability to breakdown complex topics cleanly.
2. 🎓 **Teaching Methodology**: Structured curriculum, practical examples, and depth.
3. 💬 **Communication Skill**: Active listening, friendliness, and responsiveness.
4. ⭐ **Behavior & Respect**: Professional etiquette and mutual respect.
5. ⏰ **Punctuality & Reliability**: Arriving on time and completing scheduled duration.

The user's overall **Trust Score (0–100%)** is dynamically recalculated on every review submission:

$$\text{Trust Score} = \left( \frac{\sum_{i=1}^{N} \text{AvgRating}_i}{5 \times N} \right) \times 100$$

### 💡 Concrete Real-World Example
- **Scenario**: Maria completes a session with Alex and opens the `PeerRatingModal`.
- **Ratings Submitted**:
  - Explanation: 5/5
  - Methodology: 5/5
  - Communication: 4/5
  - Respect: 5/5
  - Punctuality: 5/5
- **Calculation**: Average Rating = $(5+5+4+5+5)/5 = 4.8 / 5.0$.
- **Database Update**:
  - Review object saved to `Review` collection.
  - Alex's cumulative Trust Score recalculates from 88.0% ➔ **92.4%**.
  - Automatically awards the **"Top Mentor"** badge on Alex's public profile card.

---

## 4. 📅 Feature 4: Integrated Google Meet & 5-Minute Calendar Reminders

### ⚙️ Functionality
- **Instant Meeting URL Generation**: When a session request is accepted, the system generates a unique video meeting room URL (or accepts a custom Google Meet link).
- **Google Calendar URL Generator**: Formats a 1-click Google Calendar integration link using ISO-8601 timestamps and calendar template query params (`action=TEMPLATE`).
- **5-Minute Notification Pre-fill**: The generated calendar invite automatically sets a **5-minute push notification alert** prior to the meeting start time.

### 💡 Concrete Real-World Example
- **User Action**: Click **"Calendar (5m Notice)"** on an accepted session card in `/sessions` or `/requests`.
- **Generated Link**:
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=SkillSwap+Session:+React&details=Google+Meet+Link:+https://meet.google.com/abc-defg-hij&location=https://meet.google.com/abc-defg-hij&dates=20260903T140000Z/20260903T150000Z`
- **Result**: Opens Google Calendar with pre-populated event details, Meet URL in location field, and a 5-minute pre-meeting reminder ready to save in 1 click.

---

## 5. 📥 Feature 5: Dedicated Swap Requests Workspace (`/requests`)

### ⚙️ Functionality
A centralized workspace containing 3 filterable tabs and batch management utilities:
1. 📥 **Incoming Requests**: Swap requests sent to the logged-in user by peers. Includes **Accept (`✓`)** and **Decline (`✕`)** action buttons.
2. 📤 **Sent Requests**: Requests created by the logged-in user awaiting mentor response.
3. ⚡ **Active Accepted Swaps**: Confirmed sessions ready to launch via Google Meet.
4. 🗑️ **Clear Past Meetings**: Purges completed and declined sessions from the user's view.

### 💡 Concrete Real-World Example
- **User Flow**: Vineet navigates to `/requests`.
- **Step 1**: Sees an incoming request from Sarah to learn Node.js on Friday at 4:00 PM.
- **Step 2**: Clicks **Accept (`✓`)**.
- **Backend Response**: Session status changes from `PENDING` ➔ `ACCEPTED`.
- **Real-Time Update**: Socket.io emits `session_status_changed` to Sarah's browser. Sarah's screen updates instantly without refreshing.

---

## 6. 🏆 Feature 6: Community Leaderboard & Trust Badges (`/leaderboard`)

### ⚙️ Functionality
- **Dynamic Leaderboard Rankings**: Ranks community mentors based on a composite score of Trust Score (%), total hours taught, and total completed swaps.
- **Category Filter**: Filter top mentors by domain (`All Categories`, `Tech & Coding`, `Design & Creative`, `Languages`, `Music & Arts`, `Business`).
- **Trust Badges**:
  - 👑 **Top Mentor**: Trust Score $\ge 95\%$ and $\ge 10$ sessions.
  - 🛡️ **Verified Pro**: Verified email & credentials.
  - ⚡ **Fast Responder**: Responds to swap requests within 1 hour.

### 💡 Concrete Real-World Example
- **User Action**: Visitor clicks "Leaderboard" in navbar.
- **View**: Selects "Tech & Coding" filter.
- **Output**: Displayed list shows Vineet Kumar ranked #1 with **99% Trust Score**, 42 Hours Taught, and badges 👑 *Top Mentor* and 🛡️ *Verified Pro*.

---

## 7. 💬 Feature 7: Real-Time Socket.io Direct Messaging & WebSockets (`/chat`)

### ⚙️ Functionality
- **Bi-Directional Messaging**: Instant 1-on-1 chat over WebSockets (`ws://`).
- **Live Typing Indicators**: Broadcasts `typing` and `stop_typing` events to the active conversation room.
- **Online/Offline Status**: Displays real-time presence indicators (green glowing dot for active users).
- **Unread Badge Counts**: Shows pending request counts and unread message badges in the floating Glass Dock Navbar.

### 💡 Concrete Real-World Example
- **Scenario**: Sarah opens `/chat` and selects Vineet.
- **Action**: Sarah types *"Hi Vineet, looking forward to our session!"*.
- **Socket Event**: `send_message` payload sent to server ➔ server broadcasts `receive_message` to Vineet's client in <50ms.
- **UI Output**: Message appears instantly with read receipt checks (`✓✓`).

---

## 8. 💎 Feature 8: Liquid Glassmorphism Design System & Command Palette (`Cmd+K`)

### ⚙️ Functionality
- **Smoked Crystal Glass Material**: Uses CSS `backdrop-filter: blur(28px) saturate(160%)`, multi-layered specular borders (`rgba(255,255,255,0.18)`), and ambient radial glow borders (`glass-edge-card`).
- **Global Command Palette (`Ctrl+K` / `Cmd+K`)**: Modal accessible anywhere in the application providing keyboard-first search for routes, mentors, and skills.
- **Responsive Glass Dock Navbar**: Floating bottom/top navigation dock adapting smoothly to desktop and mobile screens.

### 💡 Concrete Real-World Example
- **User Action**: Press `Ctrl+K` on any page.
- **UI Output**: Frosted glass search overlay appears. Typing `"React"` displays shortcuts to *Discover React Mentors*, *View Active React Sessions*, or *Navigate to Leaderboard*. Pressing `Enter` navigates instantly.

---

## 9. 🧙 Feature 9: Multi-Step Interactive Onboarding Wizard

### ⚙️ Functionality
A 3-step wizard that guides new users through profile completion:
- **Step 1 (Skills You Teach)**: Select from existing skill catalog OR type ANY custom skill (instantly created on DB via `/api/skills/custom`).
- **Step 2 (Skills You Want to Learn)**: Select learning goals.
- **Step 3 (Preferences & Availability)**: Set preferred meeting mode (`Online`, `In-Person`, `Both`) and weekly availability days (`Saturday`, `Sunday`, etc.).

### 💡 Concrete Real-World Example
- **Scenario**: New user registers account. `OnboardingWizard` opens automatically.
- **Action**: User types `"Quantum Computing"` (a custom skill not in DB).
- **System Execution**: Backend creates skill object `_id: "sk_9410"`, maps it under user's `teachSkills`, awards +2.0 starter Time Credits, and redirects to Dashboard.

---

## 10. 🛡️ Feature 10: Admin Moderation & Platform Analytics Dashboard (`/admin`)

### ⚙️ Functionality
- **Platform Analytics**: Displays real-time platform health stats (Total Users, Total Time Credits in Circulation, Active Sessions Count, Global Trust Index).
- **User Management**: Search users, toggle verification status, grant bonus credits, or suspend fraudulent accounts.
- **Dispute & Report Resolution**: Inspect reported sessions, review audit logs, and resolve credit transfer disputes.

### 💡 Concrete Real-World Example
- **Scenario**: Admin logs in at `/admin`.
- **View**: Platform metrics display **1,240 Active Users**, **3,480.0 Total Time Credits**, and **98.2% Platform Satisfaction**.
- **Action**: Admin verifies a mentor credential, toggles `isVerified = true`, granting the user a 🛡️ *Verified Pro* badge.

---

*SkillSwap Specifications & Feature Manual — Maintained by Antigravity AI & SkillSwap Engineering Team.*
