-- ============================================================
-- Presensi Deutsch — cloud sync schema
-- ============================================================
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- It creates ONE table that holds the whole app's data as a single
-- shared record (same shape the app already used locally), protected so
-- only people who are logged in (the shared account) can read or write it.
--
-- This intentionally mirrors the existing local storage shape (a single
-- JSON blob) rather than splitting into many normalized tables — the
-- smallest change that gets multiple people reading/writing the same data.
-- Splitting into per-entity tables (students, attendance, journal, ...)
-- is a valid future improvement, not required to solve "keep everyone in
-- sync" for a small trusted group sharing one login.
-- ============================================================

create table if not exists app_state (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Row Level Security: nobody can read/write this table unless they are
-- authenticated (logged in through the app's shared login).
alter table app_state enable row level security;

drop policy if exists "authenticated read/write app_state" on app_state;
create policy "authenticated read/write app_state"
  on app_state
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Keep updated_at current automatically on every write.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists app_state_set_updated_at on app_state;
create trigger app_state_set_updated_at
  before update on app_state
  for each row
  execute function set_updated_at();

-- Enable realtime updates for this table (so other logged-in devices see
-- changes live, without needing to refresh). Wrapped so re-running this
-- script is safe even if it's already enabled.
do $$
begin
  alter publication supabase_realtime add table app_state;
exception
  when duplicate_object then
    null; -- already added, nothing to do
end $$;
