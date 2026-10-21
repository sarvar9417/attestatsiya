-- TASK-386: prevent newly published Y3 questions from reverting to
-- taskless ordering prompts with duplicated enumerated actions.
-- Existing archived historical questions stay immutable.
BEGIN;
SET LOCAL lock_timeout='10s';

CREATE OR REPLACE FUNCTION public.guard_y3_explicit_task_goal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $fn$
BEGIN
  IF new.status = 'published'::public.content_status
     AND new.format = 'Y3'::public.question_format
     AND (
       new.stem_md LIKE 'Berilgan vazifani to‘g‘ri bajarish%'
       OR new.stem_md LIKE 'Amallarni to‘g‘ri ketma-ketlikda joylang.%'
     )
  THEN
    RAISE EXCEPTION USING
      errcode='23514',
      message='Y3_TASK_GOAL_MISSING: replace boilerplate with an explicit purpose and use the native sortable options instead of duplicating 1)-4) in the stem';
  END IF;
  RETURN new;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_guard_y3_explicit_task_goal ON public.questions;
CREATE TRIGGER trg_guard_y3_explicit_task_goal
  BEFORE INSERT OR UPDATE OF stem_md,status,format
  ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.guard_y3_explicit_task_goal();

DO $postflight$
BEGIN
 IF EXISTS(
  SELECT 1 FROM public.questions q
  WHERE q.status='published'::public.content_status
    AND q.format='Y3'::public.question_format
    AND (
      q.stem_md LIKE 'Berilgan vazifani to‘g‘ri bajarish%'
      OR q.stem_md LIKE 'Amallarni to‘g‘ri ketma-ketlikda joylang.%'
    )
 ) THEN
  RAISE EXCEPTION 'TASK-386 production still has taskless published Y3 templates';
 END IF;
END;
$postflight$;
COMMIT;