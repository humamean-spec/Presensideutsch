# Presensi Deutsch

German Teacher Dashboard for SMA Negeri 1 Sewon — Attendance, Teaching Journal,
Reports, Students, Classes, Schedule, and Settings.

This is the **reorganized** version of the app: same features, same UI, same
workflows as the original single-file build — restructured into a real
project so it's maintainable as the roadmap grows (Gradebook, AI Assistant,
Materials, Cloud Sync, Auth, Multi-Teacher, Multi-School). See
`ARCHITECTURE.md` for what changed and why.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production
bundle in `dist/`.

## Installing it as an app (PWA)

Once deployed (see below) or running via `npm run build && npm run preview`,
the app is installable:

- **Android / Desktop Chrome/Edge:** open the site → browser shows an
  "Install" icon in the address bar (or menu → "Install Presensi
  Deutsch"). It then opens like a normal app, with its own icon, no browser
  address bar.
- **iPhone/iPad (Safari):** open the site → Share button → "Add to Home
  Screen".

After the first successful load, the app keeps working **offline** — the
interface itself is cached by a service worker (`public/sw.js`); your actual
data is separately persisted via `localStorage` (see below), so attendance
you take while offline is still saved and simply syncs to storage as usual.

Note: the service worker only registers in a production build
(`npm run build` / `npm run preview`), not in `npm run dev` — this avoids
caching issues while developing.

## Where data is stored

- **Inside the Claude.ai artifact sandbox:** the app automatically uses the
  sandbox's built-in persistent storage (private to your account).
- **Running standalone** (`npm run dev` / a real deployment): the app falls
  back to the browser's `localStorage` automatically — no configuration
  needed. See `src/lib/storage.js`.

## Project layout

```
src/
  main.jsx              Vite entry point
  App.jsx                Root component: routing, global state, toasts
  lib/                    Pure helpers — no JSX, no app state
    constants.js          Status metadata, form option lists, nav config
    dateUtils.js           Date/period/calendar formatting
    idUtils.js              uid / initials / deepClone / toggleInArray
    aggregations.js        Attendance-rate math, alerts, session lookups
    storage.js              Persistence abstraction (see above)
  data/
    seedData.js             Real classes/students/schedule fixture data
    logo.js                  School logo (base64)
  styles/
    globalStyles.js          The app's CSS design system
  components/
    common/                  Reusable primitives (Modal, StatCard, ...)
    layout/                  Sidebar, TopBar, BottomNav
  hooks/
    useEntityCrud.js          Shared modal/confirm/save/delete boilerplate
  features/
    dashboard/  schedule/  classes/  students/
    attendance/  journal/  reports/  settings/
```

Each `features/*` folder is one screen's components. Shared UI lives in
`components/`, shared logic in `lib/`.
