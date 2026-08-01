# What changed in this refactor pass

Scope: **maintainability/organization only**, per instruction — no new
features, no UI/workflow changes, no rewrite. Everything below is either a
mechanical move (same code, new location) or a small, additive, non-visible
safety net.

## 1. Split the single 2,694-line file into a real project (audit C1)
Every component, helper, and data structure moved into `src/lib`, `src/data`,
`src/styles`, `src/components/{common,layout}`, and `src/features/*` — one
file per component/module, grouped by layer and by feature. No component's
JSX, styling, or logic was rewritten; this was extraction, not redesign.

## 2. Data-access abstraction (audit C3)
`window.storage.get/set` calls (previously inline in the root component) now
go through `src/lib/storage.js` (`loadDB()` / `saveDB(db)`). Behavior is
identical — still one JSON blob under one key — but every view/component now
depends on this small interface instead of the raw sandbox API. Also added a
`localStorage` fallback so the project runs standalone outside the Claude.ai
sandbox with no code changes.
**Deliberately not done:** splitting storage into per-entity records/keys.
That's a larger, riskier change (audit C3/M5) than "minimal."

## 3. Business logic separated from UI (audit H2)
`dateUtils.js`, `aggregations.js`, and `idUtils.js` are now plain, importable,
side-effect-free (or clearly side-effected) modules with zero JSX — the same
functions as before, just no longer interleaved with component code in the
same file.

## 4. Error boundary (audit H4)
Added `components/common/ErrorBoundary.jsx`, wrapping the routed view in
`App.jsx`. Invisible unless a component throws; if one does, that section
shows a small "something went wrong / try again" card instead of taking
down the whole app.

## 5. Removed duplicated CRUD boilerplate (audit M1)
`hooks/useEntityCrud.js` centralizes the modal-open / confirm-delete /
confirm-archive state and the find-index/replace-or-push/filter mechanics
that `ScheduleView`, `ClassesView`, and `StudentsView` each previously
hand-rolled. Each view still owns its own form component and its own exact
toast wording — no user-visible text changed.
**Deliberately not done:** merging the three entity *forms* — their fields
genuinely differ (a schedule slot, a class, a student are not the same
shape), so forcing them into one generic form would be a bigger change than
"remove duplication," and risks the "preserve all UI/workflows" rule.

## 6. Deduplicated navigation reset logic (audit H6, partial)
Sidebar's and BottomNav's `setView` handlers each used to inline the same
"reset every sub-route" logic. That's now one `navigate()` function in
`App.jsx`, passed to both. The routing model itself (parallel `useState`s
instead of a router) was **not** replaced — that's a larger change (a real
router needs a bundler, which this refactor now has, but wiring it in is a
separate step) intentionally left out of this pass.

## What was left untouched (explicitly out of scope for this pass)
- **No TypeScript.** Converting ~2,700 lines to typed `.tsx` is a large,
  separate body of work (audit C2) — doing it "minimally" alongside a
  structural refactor risks both at once.
- **No multi-tenant fields** (`teacherId`/`schoolId`) — a schema/product
  decision (audit C4), not a refactor.
- **No inline-style sweep** — 241 `style={{...}}` occurrences (audit M2)
  were left as-is; touching them means touching nearly every component,
  which isn't "minimal."
- **No `db` rename** (audit M3) — trivial in risk but touches hundreds of
  call sites for a purely cosmetic win; deferred.
- **Seed data with real student PII** (audit M4) is still compiled into
  `data/seedData.js` as before.

## Addendum: PWA support (added after this refactor)
A separate, later addition (not part of the maintainability refactor above,
and not required by it): the app is now installable and works offline.
- `public/manifest.webmanifest` + `public/icons/*` — app name, theme color,
  and home-screen icons (generated to match the existing navy/red/gold
  brand identity already used in the UI).
- `public/sw.js` — a small hand-written service worker (no added
  dependency): network-first for the app shell so online users always get
  the latest build, cache-first with background revalidation for
  everything else, so the app keeps working offline after the first load.
- `src/main.jsx` registers it, production-build-only, behind a feature
  check, so it never blocks the app from loading where it isn't supported
  (including the Claude.ai artifact sandbox, which has nothing at `/sw.js`
  to register).
- No change to app data/state logic — offline data persistence continues
  to be handled by `src/lib/storage.js` (localStorage / artifact storage),
  which is unrelated to what the service worker caches (that's just the
  UI shell).

## Verification performed
- Every new file's JSX/imports were checked with `tsc` (syntax + module
  resolution) across the whole `src/` tree.
- Every top-level view was rendered with `react-dom/server` against the same
  real seed data (5 classes, 179 students) used in the original build,
  including a populated-data pass (attendance history, journal entries,
  alert conditions) — all rendered without errors, matching the original
  single-file version's behavior.
