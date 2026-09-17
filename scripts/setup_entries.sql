-- Standalone schema for a fresh Supabase project (equivalent to running
-- every file in supabase/migrations/). Paste into the SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  number text not null,  -- E.164, e.g. +919876543210
  checkedin boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists entries_created_at_idx on public.entries (created_at desc);
create unique index if not exists entries_number_key on public.entries (number);

-- No policies for anon/authenticated: all access goes through the server
-- route handlers in app/api using SUPABASE_SECRET_KEY, which bypasses RLS.
alter table public.entries enable row level security;

-- Past-event registrations, snapshotted as jsonb. No policies, so the
-- public key can't read it.
create table if not exists public.entries_archive (
  id uuid primary key,
  event text not null,
  data jsonb not null,
  created_at timestamptz,
  archived_at timestamptz not null default now()
);

alter table public.entries_archive enable row level security;
