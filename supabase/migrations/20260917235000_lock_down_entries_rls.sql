-- Close public (anon) access to registrations.
--
-- The publishable key ships to browsers, so these policies let anyone read,
-- edit or delete every guest's name, email and phone straight from the REST
-- API, bypassing the staff passcode in proxy.ts. All database access now
-- goes through the server route handlers in app/api using the secret key,
-- which bypasses RLS.
--
-- ORDER MATTERS: SUPABASE_SECRET_KEY must be set in the deployment
-- environment and deployed BEFORE this runs, or registration and check-in
-- will start failing.

drop policy if exists "entries_select_all" on public.entries;
drop policy if exists "entries_insert_all" on public.entries;
drop policy if exists "entries_update_all" on public.entries;
drop policy if exists "entries_delete_all" on public.entries;

-- RLS stays enabled with zero policies: the anon and authenticated roles
-- can do nothing, the secret key is unaffected.
alter table public.entries enable row level security;

notify pgrst, 'reload schema';
