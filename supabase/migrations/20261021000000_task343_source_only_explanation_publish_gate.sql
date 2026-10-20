-- TASK-343: Reject source-only answer-key "explanations" on future publication.
-- Does not change any existing questions, keys, history, or status.
-- Existing published content must be replaced by an immutable revision.
BEGIN;

CREATE OR REPLACE FUNCTION public.question_explanation_is_source_only(p_explanation text)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = ''
AS $fn$
  SELECT
     p_explanation IS NULL
     OR length(btrim(p_explanation)) = 0
     OR btrim(p_explanation) ~* '^Pedmahorat[[:space:]]*\|[[:space:]]*Guli[[:space:]]+Telegram[[:space:]]+kanalida[[:space:]]+ekspert[[:space:]]+tomonidan'
     OR btrim(p_explanation) ~* '^Telegram[[:space:]]+kanalida[[:space:]]+ekspert[[:space:]]+tomonidan';
$fn$;

COMMENT ON FUNCTION public.question_explanation_is_source_only(text) IS
 'TASK-343: True for blank or Telegram-expert/key-only rationale, not for the pedagogical explanation expected by learners.';

CREATE OR REPLACE FUNCTION public.guard_source_only_question_explanation()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $fn$
DECLARE v_explanation text;
BEGIN
  -- Historical published rows and archival operations are intentionally untouched.
  IF NEW.status <> 'published'::public.content_status
      OR OLD.status = 'published'::public.content_status THEN
    RETURN NEW;
  END IF;
  SELECT k.explanation_md INTO v_explanation
  FROM public.question_keys k WHERE k.question_id=NEW.id;
  -- Missing keys are independently rejected by existing universal publish gates.
  IF FOUND AND public.question_explanation_is_source_only(v_explanation) THEN
    RAISE EXCEPTION USING ERRCODE='23514',
      MESSAGE='QUESTION_EDUCATIONAL_EXPLANATION_REQUIRED',
      DETAIL='Answer key provenance or Telegram checkmark is not a pedagogical explanation.';
  END IF;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_question_source_only_explanation_publish ON public.questions;
CREATE TRIGGER trg_question_source_only_explanation_publish
BEFORE UPDATE OF status ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.guard_source_only_question_explanation();

COMMIT;
