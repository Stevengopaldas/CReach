# CReach — Accessibility Suite

A modular accessibility and productivity suite that empowers inclusive workspaces. CReach ships with multiple focused modules (navigation aids, translation, communication hubs, ergonomic guidance, and more) behind a simple dashboard.

---

## Highlights

- Accessible, responsive UI built with shadcn/ui + Tailwind
- Central dashboard to switch modules
- Rich module set (examples):
  - Workplace Assistant
  - Smart Navigation
  - Communication Hub
  - Focus Comfort
  - Buddy Assist (with buddy registration/find buddy flows)
  - Social Circle
  - Ergonomic Coach
  - Career Tracker
  - Feedback App
  - Translator
  - Request/My Requests
  - Calendar & Emotional Check-in modals

---

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- lucide-react icons
- React Router

---

## Development

Port: `5174` (configured in `vite.config.ts`)

From repository root (recommended):

```bash
# install once at the repo root
npm install

# start CReach only
npm run dev:creach
# → http://localhost:5174

# or start all apps for demo
npm run dev:all
```

Run directly from this folder:

```bash
cd creach
npm install
npm run dev
```

Build and preview this app only:

```bash
npm run build
npm run preview
```

---

## Project Structure

```
creach/
├─ src/
│  ├─ components/
│  │  ├─ Navigation.tsx          # Left navigation for modules
│  │  ├─ Dashboard.tsx           # Entry dashboard
│  │  ├─ Chatbot.tsx
│  │  └─ modules/                # Feature modules
│  │     ├─ WorkplaceAssistant.tsx
│  │     ├─ SmartNavigation.tsx
│  │     ├─ CommunicationHub.tsx
│  │     ├─ FocusComfort.tsx
│  │     ├─ BuddyAssist.tsx
│  │     ├─ SocialCircle.tsx
│  │     ├─ ErgonomicCoach.tsx
│  │     ├─ CareerTracker.tsx
│  │     ├─ FeedbackApp.tsx
│  │     ├─ Translator.tsx
│  │     ├─ RequestHelpModal.tsx / MyRequestsModal.tsx
│  │     ├─ BuddyRegistrationModal.tsx / FindBuddyModal.tsx
│  │     └─ CalendarModal.tsx / EmotionalCheckinModal.tsx
│  ├─ pages/Index.tsx            # Module switcher entry
│  └─ main.tsx / App.tsx
└─ vite.config.ts                # Port 5174
```

---

## Notes

- This app is independent; it can be deployed on its own or used via the CP9 landing page.
- Accessibility (keyboard nav, focus states) is a design priority across components.
