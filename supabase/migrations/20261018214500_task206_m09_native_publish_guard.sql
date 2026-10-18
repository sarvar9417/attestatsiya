-- TASK-206: V2 Native Y2/Y3 bank must remain reviewed until independently approved.
-- Guards only the new `MSACCESS-V2-NATIVE/` provenance prefix.
CREATE OR REPLACE FUNCTION public.guard_m09_v2_native_publish()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  option_left int;
  option_right int;
  key_content jsonb;
BEGIN
  IF NEW.status <> 'published' OR NEW.source_reference NOT LIKE 'MSACCESS-V2-NATIVE/%' THEN
    RETURN NEW;
  END IF;
  IF NEW.format NOT IN ('Y2','Y3') OR NEW.source_lesson_id IS NULL THEN
    RAISE EXCEPTION 'TASK-206: valid native format and source lesson required' USING ERRCODE='23514';
  END IF;
  SELECT count(*) FILTER(WHERE side='a'), count(*) FILTER(WHERE side='b')
    INTO option_left,option_right
  FROM public.question_options WHERE question_id=NEW.id;
  SELECT payload INTO key_content FROM public.question_keys WHERE question_id=NEW.id;
  IF NEW.format='Y2' AND (option_left <> 4 OR option_right <> 4
       OR NOT (key_content ? 'pairs')
       OR (SELECT count(*) FROM jsonb_each_text(key_content->'pairs')) <> 4) THEN
    RAISE EXCEPTION 'TASK-206: invalid Y2 option/pair structure' USING ERRCODE='23514';
  END IF;
  IF NEW.format='Y3' AND (option_left <> 4 OR option_right <> 0
       OR NOT (key_content ? 'order')
       OR jsonb_array_length(key_content->'order') <> 4) THEN
    RAISE EXCEPTION 'TASK-206: invalid Y3 option/order structure' USING ERRCODE='23514';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.question_editorial_checks qc
    WHERE qc.question_id=NEW.id
      AND qc.answer_verified AND qc.reference_verified AND qc.wording_verified
      AND qc.original_authorship_verified AND length(trim(qc.reviewer_notes)) >= 20
  ) THEN
    RAISE EXCEPTION 'TASK-206: independent human editorial signoff required'
      USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_m09_v2_native_publish_guard ON public.questions;
CREATE TRIGGER trg_m09_v2_native_publish_guard
BEFORE INSERT OR UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.guard_m09_v2_native_publish();
