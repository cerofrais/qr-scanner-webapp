-- moodboard (27 Sep 2026, SAS I Towers) starts on a clean table.
--
-- 1. Every existing registration (LittlePreneurs, 2 Aug 2026) is copied
--    into entries_archive as a full-row jsonb snapshot, so nothing is lost.
-- 2. Only rows that made it into the archive are removed from entries.
-- 3. The family-shaped columns (adults/kids jsonb, legacy child_name/age)
--    are dropped. A registration is now: name, email, phone number.

create table if not exists public.entries_archive (
  id uuid primary key,
  event text not null,
  data jsonb not null,
  created_at timestamptz,
  archived_at timestamptz not null default now()
);

-- RLS on with no policies: the archive is unreachable with the public
-- (publishable) key. Read it from the Supabase dashboard / SQL editor.
alter table public.entries_archive enable row level security;

-- Only rows that pre-date the moodboard launch, so a registration that
-- lands between the deploy and this migration isn't archived away.
insert into public.entries_archive (id, event, data, created_at)
select e.id, 'littlepreneurs-2026-08-02', to_jsonb(e), e.created_at
from public.entries e
where e.created_at < timestamptz '2026-09-18 00:00:00+05:30'
on conflict (id) do nothing;

delete from public.entries
where id in (select id from public.entries_archive);

alter table public.entries
  drop column if exists adults,
  drop column if exists kids,
  drop column if exists child_name,
  drop column if exists age;

-- Safe now that the table is empty. `number` keeps its existing unique
-- index (entries_number_key) and is stored as E.164, e.g. +919876543210.
alter table public.entries
  alter column name set not null,
  alter column email set not null,
  alter column number set not null;

-- When the pass was scanned, so the door can say "already scanned at …".
alter table public.entries
  add column if not exists checked_in_at timestamptz;

notify pgrst, 'reload schema';
