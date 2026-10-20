-- TASK-307: finished review is a privileged, owner-checked endpoint and
-- only this endpoint (not exam_payload) can show keys after finalization.
BEGIN;
DO $test$
DECLARE
  v_definition text;
BEGIN
  SELECT pg_get_functiondef('public.get_review(uuid)'::regprocedure)
    INTO v_definition;
  IF v_definition NOT ILIKE '%v_finished is null%'
     OR v_definition NOT ILIKE '%e.user_id = v_user%'
     OR v_definition NOT ILIKE '%not v_finished%'
     OR v_definition NOT ILIKE '%public.exam_payload(p_exam_id)%'
     OR v_definition NOT ILIKE '%''options''%'
     OR v_definition NOT ILIKE '%''assets''%' THEN
    RAISE EXCEPTION 'Review must verify ownership and finalization before returning answer options';
  END IF;

  IF has_function_privilege('anon','public.get_review(uuid)','EXECUTE') THEN
    RAISE EXCEPTION 'Anonymous users can read answer keys';
  END IF;
  IF NOT has_function_privilege('authenticated','public.get_review(uuid)','EXECUTE') THEN
    RAISE EXCEPTION 'Authenticated learners cannot review finalized exams';
  END IF;
  IF has_function_privilege('authenticated','public.exam_payload(uuid)','EXECUTE') THEN
    RAISE EXCEPTION 'Learners can enumerate exam payload outside the owner-gated review';
  END IF;
END
$test$;
SELECT 'task307_finalized_review_access_isolated' AS result;
ROLLBACK;
