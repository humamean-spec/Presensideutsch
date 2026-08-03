/**
 * Data-access layer (audit finding C3), now with optional cloud sync.
 *
 * Before this file existed, `window.storage.get/set` was called directly
 * inside the root App component. That meant every view/component that
 * needed persistence had to know the exact storage API shape, and swapping
 * the backend later meant touching every call site. This module is the one
 * place that knows how data is actually persisted — call sites use
 * `loadDB()` / `saveDB(db)` and don't know or care which backend is active.
 *
 * Backend selection (in priority order):
 *   1. Supabase — when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set
 *      (see src/lib/supabaseClient.js). This is the shared, synced backend:
 *      everyone signed in with the shared login reads/writes the same row.
 *   2. window.storage — when running inside the Claude.ai artifact sandbox.
 *   3. localStorage — plain standalone browser, no cloud sync configured.
 *
 * IMPORTANT — the *shape* of what's stored is unchanged in all three cases:
 * still the entire app state as one JSON object. Cloud sync stores that
 * object as a single row (id='main') in the `app_state` table rather than
 * splitting into per-entity tables — see supabase/schema.sql for why.
 */

import { supabase, isCloudSyncConfigured } from "./supabaseClient";

const STORAGE_KEY = "pd_db_v1";
const CLOUD_ROW_ID = "main";

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
  if (isCloudSyncConfigured) {
    try {
      const { data, error } = await supabase
        .from("app_state")
        .select("data")
        .eq("id", CLOUD_ROW_ID)
        .maybeSingle();
      if (error) throw error;
      return data ? data.data : null;
    } catch {
      // Network hiccup etc. — don't silently show stale/local data when
      // cloud sync is meant to be the source of truth; caller treats this
      // the same as "nothing stored yet" and will show the loading/seed path.
      return null;
    }
  }
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
export async function saveDB(db, who) {
  if (isCloudSyncConfigured) {
    try {
      await supabase.from("app_state").upsert({
        id: CLOUD_ROW_ID,
        data: db,
        updated_by: who || null,
      });
    } catch {
      /* no-op, matches prior behavior */
    }
    return;
  }
  const serialized = JSON.stringify(db);
  if (hasArtifactStorage()) {
    try {
      await window.storage.set(STORAGE_KEY, serialized, false);
    } catch {
      /* no-op */
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

/**
 * Subscribes to changes made by *other* signed-in devices/people, so this
 * screen can pick them up without a manual refresh. Only active when cloud
 * sync is configured. Returns an unsubscribe function; safe to call even
 * when cloud sync isn't configured (it's just a no-op then).
 */
export function subscribeToRemoteChanges(onRemoteChange) {
  if (!isCloudSyncConfigured) return () => {};

  const channel = supabase
    .channel("app_state_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "app_state", filter: `id=eq.${CLOUD_ROW_ID}` },
      (payload) => {
        if (payload.new && payload.new.data) onRemoteChange(payload.new.data);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export { STORAGE_KEY };
