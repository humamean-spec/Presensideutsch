import { createClient } from "@supabase/supabase-js";

/**
 * Cloud sync (Supabase) — optional.
 *
 * If VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set (e.g. running
 * inside the Claude.ai artifact sandbox, or before a teacher has done the
 * Supabase setup), `supabase` is `null` and the rest of the app falls back
 * to the storage it already had (window.storage / localStorage — see
 * src/lib/storage.js). Nothing about existing behavior changes unless
 * these two values are explicitly configured.
 */

const url = typeof import.meta !== "undefined" ? import.meta.env.VITE_SUPABASE_URL : undefined;
const anonKey = typeof import.meta !== "undefined" ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined;

export const isCloudSyncConfigured = Boolean(url && anonKey);

export const supabase = isCloudSyncConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
