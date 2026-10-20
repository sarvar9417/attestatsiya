-- TASK-306: trigger helpers are internal implementation details, not RPCs.
--
-- PostgreSQL grants EXECUTE on newly created functions to PUBLIC by default.
-- The main remediation replaced this pre-existing trigger function; explicitly
-- remove direct API execution while keeping trigger invocation intact.

begin;

revoke all on function public.fill_question_editorial_fingerprint()
  from public, anon, authenticated;

commit;
