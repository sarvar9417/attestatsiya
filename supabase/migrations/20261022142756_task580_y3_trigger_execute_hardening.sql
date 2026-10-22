-- TASK-580: a trigger helper added after the general RPC hardening migration
-- inherited PostgreSQL's default PUBLIC EXECUTE privilege. It must execute only
-- through trg_guard_y3_explicit_task_goal, never as a PostgREST client RPC.

BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '30s';

DO $preflight$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'guard_y3_explicit_task_goal'
      AND p.prorettype = 'pg_catalog.trigger'::regtype
      AND p.prosecdef
  ) THEN
    RAISE EXCEPTION 'TASK580_PREFLIGHT: expected SECURITY DEFINER trigger helper is missing';
  END IF;
END;
$preflight$;

REVOKE ALL ON FUNCTION public.guard_y3_explicit_task_goal()
  FROM PUBLIC, anon, authenticated;

DO $postflight$
BEGIN
  IF has_function_privilege('anon', 'public.guard_y3_explicit_task_goal()', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.guard_y3_explicit_task_goal()', 'EXECUTE')
  THEN
    RAISE EXCEPTION 'TASK580_POSTFLIGHT: trigger helper remains client-executable';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE n.nspname = 'public'
      AND c.relname = 'questions'
      AND t.tgname = 'trg_guard_y3_explicit_task_goal'
      AND p.proname = 'guard_y3_explicit_task_goal'
      AND NOT t.tgisinternal
      AND t.tgenabled IN ('O', 'A')
  ) THEN
    RAISE EXCEPTION 'TASK580_POSTFLIGHT: Y3 quality trigger is not active';
  END IF;
END;
$postflight$;

COMMIT;
