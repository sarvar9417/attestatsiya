-- TASK-208: demo-style database review bank must not publish without human signoff.
-- All private question stems/options/keys are stored only server-side.
CREATE OR REPLACE FUNCTION public.guard_m09_demo_style_publish()
RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE
  option_total integer;
  correct_id uuid;
BEGIN
  IF NEW.status IS DISTINCT FROM 'published'::content_status
      OR coalesce(NEW.source_reference,'') NOT LIKE 'MSACCESS-DEMO-STYLE-2026/%' THEN
    RETURN NEW;
  END IF;
  IF NEW.format <> 'Y1' OR NEW.source_lesson_id IS NULL OR NEW.construct_id IS NULL THEN
    RAISE EXCEPTION 'TASK-208: demo-style question must have Y1 source lesson and construct'
      USING ERRCODE='23514';
  END IF;
  SELECT COUNT(*) INTO option_total FROM public.question_options
  WHERE question_id=NEW.id AND side='a';
  SELECT (payload->>'correct_option_id')::uuid INTO correct_id FROM public.question_keys
  WHERE question_id=NEW.id;
  IF option_total<>4 OR NOT EXISTS (
      SELECT 1 FROM public.question_options
      WHERE question_id=NEW.id AND side='a' AND id=correct_id
  ) THEN
    RAISE EXCEPTION 'TASK-208: exactly 4 options and valid Y1 key required'
      USING ERRCODE='23514';
  END IF;
  IF NOT EXISTS (
     SELECT 1 FROM public.question_editorial_checks ec
     WHERE ec.question_id=NEW.id AND ec.answer_verified AND ec.reference_verified
       AND ec.wording_verified AND ec.original_authorship_verified
       AND length(trim(ec.reviewer_notes))>=20
  ) THEN
     RAISE EXCEPTION 'TASK-208: independent human editorial signoff required'
       USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_m09_demo_style_publish_guard ON public.questions;
CREATE TRIGGER trg_m09_demo_style_publish_guard
BEFORE INSERT OR UPDATE ON public.questions FOR EACH ROW
EXECUTE FUNCTION public.guard_m09_demo_style_publish();
