-- TASK-205: extra publish gate for original AI-authored M09 / MS Access V2 bank.
-- Does not alter existing published questions, attempt history or unrelated modules.
CREATE OR REPLACE FUNCTION public.guard_m09_v2_question_publish()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'published' AND NEW.source_reference LIKE 'MSACCESS-V2/%' THEN
    IF NEW.source_lesson_id IS NULL THEN
      RAISE EXCEPTION 'TASK-205: source lesson is required before publication'
        USING ERRCODE = '23514';
    END IF;

    IF NEW.source_reference LIKE '%NATIVE_CONVERSION_REQUIRED%' THEN
      RAISE EXCEPTION 'TASK-205: paper matching/ordering format requires native Y2/Y3 conversion and independent review'
        USING ERRCODE = '23514';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM jsonb_array_elements(COALESCE(NEW.assets, '[]'::jsonb)) AS asset
      WHERE asset->>'type' = 'source_visual_review_required'
    ) THEN
      RAISE EXCEPTION 'TASK-205: original table/diagram asset must be verified and attached before publication'
        USING ERRCODE = '23514';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.question_editorial_checks qc
      WHERE qc.question_id = NEW.id
        AND qc.answer_verified
        AND qc.reference_verified
        AND qc.wording_verified
        AND qc.original_authorship_verified
        AND length(trim(qc.reviewer_notes)) >= 20
    ) THEN
      RAISE EXCEPTION 'TASK-205: independent human editorial signoff required'
        USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_m09_v2_question_publish_guard ON public.questions;
CREATE TRIGGER trg_m09_v2_question_publish_guard
BEFORE INSERT OR UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.guard_m09_v2_question_publish();
