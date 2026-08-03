import { supabase, isCloudSyncConfigured } from "./supabaseClient";

/**
 * Auth for the "shared login" model: Pak Humam + 1-2 trusted people
 * (e.g. TU/co-teacher) all sign in with the SAME email/password, created
 * once in Supabase (Authentication → Users → Add user). This is not a
 * per-teacher account system — everyone who has the shared credentials
 * sees and edits the same data, which matches how this group actually
 * works (not overlapping, not needing separate views).
 *
 * When cloud sync isn't configured, these are all no-ops that report
 * "signed in" so the rest of the app behaves exactly as it did before
 * (no login screen, local/artifact storage only).
 */

export async function getSession() {
  if (!isCloudSyncConfigured) return { signedIn: true, email: null };
  const { data } = await supabase.auth.getSession();
  return { signedIn: !!data.session, email: data.session?.user?.email || null };
}

export function onAuthChange(callback) {
  if (!isCloudSyncConfigured) return () => {};
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    callback({ signedIn: !!session, email: session?.user?.email || null });
  });
  return () => sub.subscription.unsubscribe();
}

export async function signIn(email, password) {
  if (!isCloudSyncConfigured) return { error: null };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error ? error.message : null };
}

export async function signOut() {
  if (!isCloudSyncConfigured) return;
  await supabase.auth.signOut();
}
