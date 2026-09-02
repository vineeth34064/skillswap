# ⚡ SkillSwap V3 — Production-Ready Features & Functionality Manual (`FEATURES_AND_FUNCTIONALITY.md`)

> **Version**: 3.0.0 (Launch-Ready Production Grade)  
> **Status**: Official Platform Specifications, Architectural Schemas & Feature Manual  
> **Target Audience**: Developers, Product Managers, End Users, Auditors, Play Store Reviewers  

---

## 📖 Executive Overview

**SkillSwap V3** is a production-grade, reciprocal peer-to-peer knowledge exchange and time-banking platform designed to democratize learning without financial barriers. The system operates on a strict **1-to-1 Time Banking Model** where 1 hour of teaching earns 1 Time Credit, and 1 hour of learning transfers 1 Time Credit to the mentor upon dual session completion.

V3 introduces a complete **Minimal Luxury Liquid Glassmorphism UI**, a **Real Trust Layer Verification System**, **Short Educational Video Reels**, **Interactive Skill Roadmaps**, **Visual Wallet Ledgers**, and **Play Store Data Safety Compliance**.

---

## 📋 Table of Contents

1. [Feature 1: Reciprocal Time Credit Banking & Wallet Ledger (`/wallet`)](#feature-1-reciprocal-time-credit-banking--wallet-ledger-wallet)
2. [Feature 2: Smart Reciprocal Peer Matching Engine & Match Rationale (`/matches`)](#feature-2-smart-reciprocal-peer-matching-engine--match-rationale-matches)
3. [Feature 3: Redesigned User Profile & Real Trust Layer Verification (`/profile/:username`)](#feature-3-redesigned-user-profile--real-trust-layer-verification-profileusername)
4. [Feature 4: Upgraded Session Workspace with Live Countdown & Google Meet (`/sessions`)](#feature-4-upgraded-session-workspace-with-live-countdown--google-meet-sessions)
5. [Feature 5: 5-Criterion Multi-Dimensional Peer Rating & Trust Engine](#feature-5-5-criterion-multi-dimensional-peer-rating--trust-engine)
6. [Feature 6: Short Educational Video Reels Feed (`/reels`)](#feature-6-short-educational-video-reels-feed-reels)
7. [Feature 7: Custom Interactive Skill Learning Roadmaps (`/roadmaps`)](#feature-7-custom-interactive-skill-learning-roadmaps-roadmaps)
8. [Feature 8: Dedicated Swap Requests Workspace (`/requests`)](#feature-8-dedicated-swap-requests-workspace-requests)
9. [Feature 9: Community Leaderboard & Category Tabs (`/leaderboard`)](#feature-9-community-leaderboard--category-tabs-leaderboard)
10. [Feature 10: Real-Time Socket.io Messaging & Read Receipts (`/chat`)](#feature-10-real-time-socketio-messaging--read-receipts-chat)
11. [Feature 11: Safety Center & 1-Click Reporting/Blocking (`/safety`)](#feature-11-safety-center--1-click-reportingblocking-safety)
12. [Feature 12: Onboarding V2 Guided Wizard & +2.0 Starter Credit Incentive](#feature-12-onboarding-v2-guided-wizard--20-starter-credit-incentive)
13. [Feature 13: Global Intelligent Search & Command Palette (`Cmd+K`)](#feature-13-global-intelligent-search--command-palette-cmdk)
14. [Feature 14: Real-Time Socket Notification Center](#feature-14-real-time-socket-notification-center)
15. [Feature 15: Platform Settings & Play Store Data Safety (`/settings`, `/privacy`, `/terms`)](#feature-15-platform-settings--play-store-data-safety-settings-privacy-terms)
16. [Feature 16: Upgraded Admin Panel & CSV Export (`/admin`)](#feature-16-upgraded-admin-panel--csv-export-admin)
17. [Feature 17: Minimal Luxury Glassmorphism & Horizontally Scrollable Dock Navbar](#feature-17-minimal-luxury-glassmorphism--horizontally-scrollable-dock-navbar)
18. [Feature 18: Performance & 60 FPS Skeleton Loaders](#feature-18-performance--60-fps-skeleton-loaders)
19. [Feature 19: Premium Monetization & "Verified Pro" Tier](#feature-19-premium-monetization--verified-pro-tier)
20. [Feature 20: Comprehensive System Sitemap & Navigation Table](#feature-20-comprehensive-system-sitemap--navigation-table)

---

## 1. ⏱️ Feature 1: Reciprocal Time Credit Banking & Wallet Ledger (`/wallet`)

### ⚙️ Functionality
- **Signup Bonus**: Every new registered user automatically receives **+2.0 Starter Time Credits**.
- **Credit Balance Verification**: When requesting a swap, the backend checks `requester.timeCredits >= durationHours`.
- **Dual Confirmation Settlement**:
  1. Student clicks **"Confirm Completion"**.
  2. Mentor clicks **"Confirm Completion"**.
  3. When both confirm, an atomic MongoDB transaction executes:
     - `requester.timeCredits -= 1.0`
     - `mentor.timeCredits += 1.0`
     - `requester.learningHours += 1.0`
     - `mentor.teachingHours += 1.0`
     - Immutable `CreditTransaction` log entry recorded with status `SUCCESS`.
- **Visual Wallet Dashboard (`/wallet`)**: View lifetime hours taught vs. learned, pending credits, and filter transaction history log by `ALL`, `EARNED`, `SPENT`, or `PENDING`.

### 💡 Concrete Real-World Example
- **Scenario**: Sarah (UI Designer, balance **2.0 Credits**) learns React from Vineet (Dev, balance **1.5 Credits**).
- **Session**: 1.0 hour completed over Google Meet.
- **Settlement**: Both click "Confirm Completion".
- **Result**: Sarah's balance = **1.0 Credit**; Vineet's balance = **2.5 Credits**. Transaction logged under `/wallet`.

---

## 2. ⚡ Feature 2: Smart Reciprocal Peer Matching Engine & Match Rationale (`/matches`)

### ⚙️ Functionality
- **Reciprocity Algorithm**: Calculates 2-way match percentages ($0\% - 100\%$) based on:
  $$\text{MatchScore} = \text{ReciprocityScore} \times 0.5 + \text{TrustScore} \times 0.25 + \text{DistanceProximity} \times 0.15 + \text{RatingScore} \times 0.10$$
- **Match Rationale Breakdown**: Displays exact matching reasons:
  - Skill Reciprocity ("You teach Python ↔ She teaches Spanish")
  - Shared Availability ("Both available weekends")
  - Distance & Format ("Both prefer Online Google Meet")
- **Match Score Ring**: Visual animated progress ring rendered on each match card.

### 💡 Concrete Real-World Example
- **Scenario**: Sarah (teaches UI/UX, wants React) views `/matches`.
- **Result**: Vineet Kumar displays as a **98% Match** with a gold badge **"100% Direct Swap"**. Clicking *"Why Matched?"* opens the breakdown rationale card.

---

## 3. 🛡️ Feature 3: Redesigned User Profile & Real Trust Layer Verification (`/profile/:username`)

### ⚙️ Functionality
- **Cover Banner & Avatar**: Full-bleed cover banner with status badge and online indicator.
- **Real Trust Verification Layer**: Interactive verification badges for:
  - 📞 Phone Verification (SMS OTP)
  - ✉️ Email Verification (.edu or corporate)
  - 🎓 College / University Verification
  - 💼 LinkedIn Profile Verification
  - 🏆 Verified Mentor Status
- **Portfolio Gallery**: Interactive portfolio cards supporting project title, description, link, category tag, and direct `+ Add Project` modal.
- **Social Links**: Direct links to GitHub, LinkedIn, and personal website.
- **Safety Actions**: One-click `Report User` and `Block User` triggers.

### 💡 Concrete Real-World Example
- **User Action**: Sarah visits `/profile/vineet`.
- **View**: Displays cover banner, verified badges (Phone, Email, LinkedIn), 4 portfolio projects, GitHub link, 98% Trust Score, and a button to *"Request Skill Swap"*.

---

## 4. 📅 Feature 4: Upgraded Session Workspace with Live Countdown & Google Meet (`/sessions`)

### ⚙️ Functionality
- **Live Countdown Timer**: Real-time ticker displaying countdown until session start (`Starts in 02h 45m ⏱️`).
- **Google Meet Launcher**: Generates unique Google Meet room links for 1-click video calls.
- **Google Calendar (5m Notice)**: One-click export to Google Calendar with a built-in 5-minute pre-session reminder notification.
- **Shared Session Notes**: Editable notes area for meeting agendas.
- **Auto-Rating Trigger**: Triggers the 5-criterion peer rating modal upon session completion.

### 💡 Concrete Real-World Example
- **User Action**: Vineet opens `/sessions`.
- **View**: Sees upcoming session with Sarah starting in 15 minutes. Clicks *"Join Google Meet"* to enter video call, and *"Calendar (5m Notice)"* to sync with Google Calendar.

---

## 5. ⭐ Feature 5: 5-Criterion Multi-Dimensional Peer Rating & Trust Engine

### ⚙️ Functionality
- **Multi-Criterion Evaluation**: Peers evaluate each other on five 5-star criteria:
  1. Explanation & Clarity (⭐ 1–5)
  2. Teaching Quality & Methodology (⭐ 1–5)
  3. Communication (⭐ 1–5)
  4. Behavior & Respect (⭐ 1–5)
  5. Punctuality & Reliability (⭐ 1–5)
- **Trust Score Auto-Calculation**:
  $$\text{TrustScore} = (\text{AvgRating} \times 16) + (\text{CompletionRate} \times 0.15) + (\text{ResponseRate} \times 0.05) - (\text{CancellationRate} \times 0.20)$$

### 💡 Concrete Real-World Example
- **User Action**: Sarah completes session with Vineet. `PeerRatingModal` pops up.
- **Rating**: Gives 5 stars across all 5 criteria and writes *"Vineet explained React state hooks crystal clear!"*. Vineet's Trust Score increases to **99%**.

---

## 6. 🎬 Feature 6: Short Educational Video Reels Feed (`/reels`)

### ⚙️ Functionality
- **30-Second Micro-Learning Feed**: Vertical video feed showcasing quick skill clips uploaded by top mentors.
- **Engagement Controls**: Like, save clips, follow mentor, and click `"Request Skill Swap"` directly from any reel.

### 💡 Concrete Real-World Example
- **User Action**: User browses `/reels` and watches *"React Custom Hooks in 30 Seconds ⚡"*.
- **Action**: User likes reel and clicks *"Swap Skill"* button on the video card to open a swap request directly with the mentor.

---

## 7. 🗺️ Feature 7: Custom Interactive Skill Learning Roadmaps (`/roadmaps`)

### ⚙️ Functionality
- **Visual Milestone Checklists**: Create custom step-by-step skill roadmaps (e.g. *Full-Stack Web Dev*).
- **Progress Tracking**: Toggle milestone completion checkboxes; progress bar updates automatically ($0\% \rightarrow 100\%$).

### 💡 Concrete Real-World Example
- **User Action**: Student visits `/roadmaps` and creates *"Spanish Language Mastery"*.
- **Milestones**: 1. Present Tense -> 2. Past Preterite -> 3. Subjunctive Mood. Checking off steps increases progress to 67%.

---

## 8. 📥 Feature 8: Dedicated Swap Requests Workspace (`/requests`)

### ⚙️ Functionality
- **Categorized Tabs**: Filter requests by `Incoming Requests`, `Outgoing Requests`, and `Accepted Sessions`.
- **Response Actions**: 1-click **Accept** or **Decline** with real-time WebSocket notifications.

---

## 9. 🏆 Feature 9: Community Leaderboard & Category Tabs (`/leaderboard`)

### ⚙️ Functionality
- **Rankings**: Ranks mentors by Trust Score (%), Hours Taught, and Completion Rate.
- **Category Filters**: Filter rankings by domain (`Tech`, `Design`, `Languages`, `Business`).
- **Podium Design**: Gold (#1), Silver (#2), and Bronze (#3) top mentor cards.

---

## 10. 💬 Feature 10: Real-Time Socket.io Messaging & Read Receipts (`/chat`)

### ⚙️ Functionality
- **Instant Messaging**: Low-latency WebSockets communication.
- **Read Receipts (`✓✓`)**: Double check mark delivery and read indicators.
- **Online Presence**: Green dot indicator for active users.
- **Conversation Search**: Filter chat threads by contact name.

---

## 11. 🛡️ Feature 11: Safety Center & 1-Click Reporting/Blocking (`/safety`)

### ⚙️ Functionality
- **1-Click User Reporting**: Report profiles with reasons (`Spam`, `Harassment`, `No-Show`, `Inappropriate Behavior`).
- **User Blocking**: Blocked users are immediately prevented from messaging or sending swap requests.
- **Safety Center (`/safety`)**: Guidelines on safe peer video exchanges.

---

## 12. 🧙 Feature 12: Onboarding V2 Guided Wizard & +2.0 Starter Credit Incentive

### ⚙️ Functionality
- **5-Step Wizard**:
  1. Persona Selection (`Student`, `Professional`, `Freelancer`, `Teacher`)
  2. Skills You Can Teach (Pre-set catalog + custom skill entry)
  3. Skills You Want to Learn
  4. Preferred Mode (`Online`, `In-person`, `Both`) & Weekly Availability
  5. Profile Headline & Bio Setup ➔ Awards **+2.0 Starter Time Credits**.

---

## 13. 🔍 Feature 13: Global Intelligent Search & Command Palette (`Cmd+K`)

### ⚙️ Functionality
- **Keyboard Shortcut (`Cmd+K` / `Ctrl+K`)**: Opens floating command palette accessible on any page.
- **Instant Search**: Search people, skills, projects, and platform pages with keyboard navigation.

---

## 14. 🔔 Feature 14: Real-Time Socket Notification Center

### ⚙️ Functionality
- **Instant Alerts**: WebSocket notifications for swap requests, session responses, incoming messages, and credit transfers.
- **Badge Indicators**: Animated counters on the Floating Glass Dock Navbar.

---

## 15. ⚙️ Feature 15: Platform Settings & Play Store Data Safety (`/settings`, `/privacy`, `/terms`)

### ⚙️ Functionality
- **Preferences**: Toggle email alerts, push notifications, private profile, and timezone.
- **Data Export**: Export complete account data as a formatted `.json` file.
- **Account Deletion**: Play Store compliant account purge trigger.
- **Legal Routes**: Dedicated `/privacy` and `/terms` pages.

---

## 16. 📊 Feature 16: Upgraded Admin Panel & CSV Export (`/admin`)

### ⚙️ Functionality
- **Platform Analytics**: Total users, completed swaps, total hours exchanged, and pending reports counters.
- **Reports Moderation Queue**: Review reported profiles and suspend accounts with 1 click.
- **CSV Data Export**: Export entire user database to `.csv` file.

---

## 17. 💎 Feature 17: Minimal Luxury Glassmorphism & Horizontally Scrollable Dock Navbar

### ⚙️ Functionality
- **Design Tokens**: Void dark background (`#080E24`), indigo glass (`#101827`), primary blue (`#8B7CFF`), cyan highlight (`#72C7FF`), and gold accent (`#D6B36A`).
- **Horizontally Scrollable Navbar**: Center dock navigation bar scrollable via touch, mouse wheel, or Left/Right chevron scroll buttons.

---

## 18. ⚡ Feature 18: Performance & 60 FPS Skeleton Loaders

### ⚙️ Functionality
- **Optimized Rendering**: Zero layout shift, 60 FPS CSS animations, and `SkeletonCard` loading placeholders.

---

## 19. 👑 Feature 19: Premium Monetization & "Verified Pro" Tier

### ⚙️ Functionality
- **Free Core Engine**: All 1-to-1 skill swaps remain 100% free forever.
- **Verified Pro Tier**: Optional subscription for highlighted profile glow, priority matching rank, and unlimited custom roadmaps.

---

## 20. 🗺️ Feature 20: Comprehensive System Sitemap & Navigation Table

| Route | Page Component | Access | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `/` | `LandingPage` / `Dashboard` | Public / Auth | Hero introduction & active user home dashboard |
| `/dashboard` | `Dashboard.jsx` | Authenticated | Today's sessions, matches, wallet snippet, streak counter, Logout |
| `/discover` | `Discover.jsx` | Public / Auth | Global skill search, filters & location map visualizer |
| `/matches` | `Matches.jsx` | Authenticated | Reciprocal 2-way match score & match rationale cards |
| `/requests` | `RequestsPage.jsx` | Authenticated | Incoming, outgoing, and accepted swap requests |
| `/sessions` | `Sessions.jsx` | Authenticated | Live countdown, Google Meet launcher, Calendar 5m notice |
| `/wallet` | `WalletPage.jsx` | Authenticated | Visual time credit balance & transaction ledger log |
| `/reels` | `ReelsPage.jsx` | Public / Auth | 30s educational short video clips feed |
| `/roadmaps` | `RoadmapsPage.jsx` | Authenticated | Interactive skill roadmaps & milestone checklists |
| `/chat` | `Chat.jsx` | Authenticated | Socket messaging, read receipts (`✓✓`), online presence |
| `/profile/:username` | `Profile.jsx` | Public / Auth | Verified trust badges, portfolio gallery, social links |
| `/settings` | `SettingsPage.jsx` | Authenticated | Preferences, data export, account deletion, session logout |
| `/safety` | `SafetyCenterPage.jsx` | Public / Auth | Community safety rules, report & block guidelines |
| `/privacy` | `LegalPrivacyPage.jsx` | Public / Auth | Play Store Privacy Policy compliance document |
| `/terms` | `LegalPrivacyPage.jsx` | Public / Auth | Play Store Terms of Service compliance document |
| `/admin` | `AdminDashboard.jsx` | Admin Only | User database moderation, safety reports queue, CSV export |

---

*SkillSwap V3 Official Specifications & Feature Manual — Maintained by Antigravity AI & SkillSwap Engineering Team.*
