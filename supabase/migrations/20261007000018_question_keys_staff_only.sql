-- Security hardening: answer keys are staff-only in the Data API.
--
-- Invariant:
-- - learner/anon clients never read question_keys directly;
-- - editor/admin may manage keys through authenticated admin tooling;
-- - scoring remains server-authoritative.
--
-- This intentionally supersedes 20260731000013_fix_question_keys_rls.sql,
-- whose SELECT policy allowed a learner to read a key for a question present
-- in their own exam.

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

-- Grants make the table reachable to the authenticated Data API role.
-- RLS above is the authorization boundary and leaves ordinary learners
-- with zero visible/mutable rows.
grant select, insert, update, delete on public.question_keys to authenticated;

revoke all on public.question_keys from anon;

commit;
