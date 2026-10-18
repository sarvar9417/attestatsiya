-- Ensure unpublished question options cannot be enumerated by anon.
-- Uses real review options in the fresh CI database without exposing text/keys.
BEGIN;
DO $guard$
DECLARE v_id uuid; v_visible integer; v_review_count integer;
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='question_options'
      AND policyname='question_options_readable'
  ) THEN
    RAISE EXCEPTION 'Permissive question_options_readable policy not removed';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='question_options'
      AND policyname='options_read'
  ) THEN
    RAISE EXCEPTION 'Safe published-option policy missing';
  END IF;
  SELECT o.id INTO v_id
    FROM public.question_options o JOIN public.questions q ON q.id=o.question_id
    WHERE q.status='review'::public.content_status
    ORDER BY o.id LIMIT 1;
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'No review question option in CI: cannot verify confidential option policy';
  END IF;

  EXECUTE 'SET LOCAL ROLE anon';
  SELECT count(*) INTO v_visible FROM public.question_options WHERE id=v_id;
  EXECUTE 'RESET ROLE';
  IF v_visible<>0 THEN
    RAISE EXCEPTION 'Learner can enumerate a private review question option';
  END IF;
END
$guard$;
SELECT 'review_question_option_leak_blocked' AS result;
ROLLBACK;
