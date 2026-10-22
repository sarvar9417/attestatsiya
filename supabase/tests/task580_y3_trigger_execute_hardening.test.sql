-- TASK-580: keep the Y3 publication guard active without exposing its
-- SECURITY DEFINER trigger function as a client RPC.
DO $task580_test$
BEGIN
  IF has_function_privilege('anon', 'public.guard_y3_explicit_task_goal()', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.guard_y3_explicit_task_goal()', 'EXECUTE')
  THEN
    RAISE EXCEPTION 'TASK580_TEST: trigger-only helper is client-executable';
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
    RAISE EXCEPTION 'TASK580_TEST: Y3 publication guard trigger is inactive';
  END IF;

  IF NOT has_function_privilege('anon', 'public.auth_role()', 'EXECUTE') THEN
    RAISE EXCEPTION 'TASK580_TEST: intentional auth_role RLS exception was changed';
  END IF;

  RAISE NOTICE 'TASK580 PASS: Y3 guard active and direct client EXECUTE revoked';
END;
$task580_test$;
