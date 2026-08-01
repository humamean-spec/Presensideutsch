/**
 * Data-access layer (audit finding C3).
 *
 * Before this file existed, `window.storage.get/set` was called directly
 * inside the root App component. That meant:
 *   - every view/component that needed persistence had to know the exact
 *     storage API shape
 *   - swapping the backend later (a real database, once Cloud Sync /
 *     Multi-Teacher / Multi-School are built) meant touching every call site
 *
 * This module is the one place that knows how data is actually persisted.
 * Call sites use `loadDB()` / `saveDB(db)` and don't know or care whether
 * that's `window.storage` (inside the Claude.ai artifact sandbox) or
 * `localStorage` (a normal browser, e.g. running this project with Vite).
 *
 * IMPORTANT — scope of this change: this does NOT yet change *what* is
 * stored (still the entire app state as one JSON blob under one key, same
 * as before). Splitting that into per-entity records is a larger, separate
 * change (see the architecture audit, findings C3/M5) intentionally left
 * out of this minimal refactor pass.
 */

const STORAGE_KEY = "pd_db_v1";

function hasArtifactStorage() {
  return typeof window !== "undefined" && !!window.storage && typeof window.storage.get === "function";
}

function hasLocalStorage() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

/** Reads the persisted app state. Returns `null` if nothing is stored yet. */
export async function loadDB() {
  if (hasArtifactStorage()) {
    try {
      const res = await window.storage.get(STORAGE_KEY, false);
      return res && res.value ? JSON.parse(res.value) : null;
    } catch {
      return null;
    }
  }
  if (hasLocalStorage()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  return null;
}

/** Persists the given app state. Fire-and-forget; failures are swallowed
 *  the same way the original inline implementation did (no user-facing
 *  error surface exists yet for storage failures). */
export async function saveDB(db) {
  const serialized = JSON.stringify(db);
  if (hasArtifactStorage()) {
    try {
      await window.storage.set(STORAGE_KEY, serialized, false);
    } catch {
      /* no-op, matches prior behavior */
    }
    return;
  }
  if (hasLocalStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      /* no-op */
    }
  }
}

export { STORAGE_KEY };
