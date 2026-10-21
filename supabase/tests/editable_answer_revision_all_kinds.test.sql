-- All test kinds must accept later valid answers, reject older async queue
-- writes, and keep finalized attempts immutable.
DO $$
DECLARE body text;
BEGIN
  IF to_regprocedure('public.submit_answer(uuid,uuid,jsonb,integer)') IS NULL THEN
    RAISE EXCEPTION 'SUBMIT_ANSWER_MISSING';
  END IF;
  SELECT lower(pg_get_functiondef('public.submit_answer(uuid,uuid,jsonb,integer)'::regprocedure))
  INTO body;
  IF position('and v_exam.kind <> ''mock''' in body)>0
     OR position('v_revision <=' in body)=0
     OR position('v_exam.finished_at is not null' in body)=0
     OR position('user_id = v_user' in body)=0
     OR position('question_id = p_question_id' in body)=0
     OR position('client_answered_at = to_timestamp(v_revision / 1000.0)' in body)=0
  THEN
    RAISE EXCEPTION 'EDITABLE_ANSWER_REVISION_CONTRACT_REGRESSED';
  END IF;
END $$;
