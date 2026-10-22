-- TASK-581: ktd_quality.guard_ktd_publication() is a trigger-only
-- SECURITY DEFINER helper. Its schema is private, but the function retained
-- PostgreSQL's default PUBLIC EXECUTE ACL. Remove direct client execution while
-- preserving the publication gate attached to public.questions.

BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '30s';

DO $preflight$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'ktd_quality'
      AND p.proname = 'guard_ktd_publication'
      AND p.prorettype = 'pg_catalog.trigger'::regtype
      AND p.prosecdef
  ) THEN
    RAISE EXCEPTION 'TASK581_PREFLIGHT: KTD SECURITY DEFINER trigger helper is missing';
  END IF;
END;
$preflight$;

REVOKE ALL ON FUNCTION ktd_quality.guard_ktd_publication()
  FROM PUBLIC, anon, authenticated;

DO $postflight$
BEGIN
  IF has_function_privilege('anon', 'ktd_quality.guard_ktd_publication()', 'EXECUTE')
     OR has_function_privilege('authenticated', 'ktd_quality.guard_ktd_publication()', 'EXECUTE')
  THEN
    RAISE EXCEPTION 'TASK581_POSTFLIGHT: KTD trigger helper remains client-executable';
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
    RAISE EXCEPTION 'TASK581_POSTFLIGHT: KTD publication guard trigger is not active';
  END IF;
END;
$postflight$;

COMMIT;
