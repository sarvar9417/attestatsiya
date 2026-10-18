-- Security prerequisite before importing M14 closed question drafts.
-- The legacy question_options_readable policy had USING(true) for anon and
-- authenticated, bypassing status-based protections for REVIEW question choices.
-- Preserve the existing options_read policy for published items/editor/admin.
BEGIN;
DO $precondition$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='question_options'
      AND policyname='options_read' AND cmd='SELECT'
  ) THEN
    RAISE EXCEPTION 'Missing expected status-aware options_read policy; refusing unsafe policy change';
  END IF;
END
$precondition$;

ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS question_options_readable ON public.question_options;

DO $assert$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='question_options'
      AND policyname='question_options_readable'
  ) THEN
    RAISE EXCEPTION 'Unsafe unscoped question_options policy still active';
  END IF;
END
$assert$;
COMMIT;
