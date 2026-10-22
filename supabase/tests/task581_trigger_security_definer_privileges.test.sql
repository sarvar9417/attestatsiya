-- TASK-581: no trigger-only SECURITY DEFINER helper in a user schema may be
-- directly executable by Data API client roles. This generic guard also blocks
-- future regressions beyond the KTD function fixed by TASK-581.
DO $task581_test$
DECLARE
  exposed text;
BEGIN
  SELECT string_agg(
    format('%I.%I(%s)', n.nspname, p.proname, pg_get_function_identity_arguments(p.oid)),
    ', ' ORDER BY n.nspname, p.proname, pg_get_function_identity_arguments(p.oid)
  )
  INTO exposed
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE p.prosecdef
    AND p.prorettype = 'pg_catalog.trigger'::regtype
    AND n.nspname NOT IN ('pg_catalog', 'information_schema')
    AND (
      has_function_privilege('anon', p.oid, 'EXECUTE')
      OR has_function_privilege('authenticated', p.oid, 'EXECUTE')
    );

  IF exposed IS NOT NULL THEN
    RAISE EXCEPTION 'TASK581_TEST: client-executable SECURITY DEFINER trigger helpers: %', exposed;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_proc p ON p.oid = t.tgfoid
    JOIN pg_namespace pn ON pn.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'questions'
      AND t.tgname = 'ktd_unverified_publication_guard'
      AND pn.nspname = 'ktd_quality'
      AND p.proname = 'guard_ktd_publication'
      AND NOT t.tgisinternal
      AND t.tgenabled IN ('O', 'A')
  ) THEN
    RAISE EXCEPTION 'TASK581_TEST: KTD publication trigger is inactive';
  END IF;

  RAISE NOTICE 'TASK581 PASS: trigger-only SECURITY DEFINER helpers are not client-executable';
END;
$task581_test$;
