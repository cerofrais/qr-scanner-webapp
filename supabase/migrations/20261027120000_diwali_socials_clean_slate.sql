-- Diwali Socials (1 Nov 2026, AKAN) starts on a clean table.
--
-- Same pattern as the moodboard clean slate: snapshot the previous
-- edition's registrations into entries_archive as jsonb, then clear them
-- out of entries. The schema is unchanged this time — name, email and
-- number carry over as-is — so this is data only and is safe to run
-- before or after the deploy.
--
-- The cutoff is the moment of the cleanup, so a Diwali registration that
-- lands after it is left alone.
--
-- Already applied to the live database on 27 Oct 2026 (205 rows archived
-- and verified, then cleared), so this is a no-op there and exists to keep
-- the repo and any fresh environment in step.

insert into public.entries_archive (id, event, data, created_at)
select e.id, 'moodboard-2026-09-27', to_jsonb(e), e.created_at
from public.entries e
where e.created_at < timestamptz '2026-10-27T06:30:51Z'
on conflict (id) do nothing;

delete from public.entries
where id in (select id from public.entries_archive);

notify pgrst, 'reload schema';
