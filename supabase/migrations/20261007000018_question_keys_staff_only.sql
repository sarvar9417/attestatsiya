-- T-007 security hardening: question_keys is staff-only.
--
-- Runtime invariant:
-- - learner/anon never reads answer keys directly;
-- - editor/admin can manage keys through the authenticated admin UI;
-- - service_role keeps sync/import access.
--
-- The previous 00013 policy allowed a learner to read a key when the
-- question appeared in their own exam. That conflicts with the platform's
-- server-authoritative scoring boundary, so this migration removes it.

begin;

alter table public.question_keys enable row level security;

drop policy if exists "question_keys_readable" on public.question_keys;
drop policy if exists "question_keys_staff_manage" on public.question_keys;

create policy "question_keys_staff_manage"
  on public.question_keys
  for all
  to authenticated
  using (public.auth_role() in ('editor', 'admin'))
  with check (public.auth_role() in ('editor', 'admin'));

-- Authenticated is a shared PostgreSQL role. Table grants enable the admin
-- client, while RLS above keeps ordinary users at zero visible/mutable rows.
grant select, insert, update, delete on public.question_keys to authenticated;

revoke all on public.question_keys from anon;

commit;
