-- P0 regression: legacy batch finalization must never accept late answers.
-- Keep owner lock, finished attempt idempotency and no-answers finalization.
DO $$
DECLARE v_ddl text;
BEGIN
 IF to_regprocedure('public.finish_exam_batch(uuid,jsonb)') IS NULL THEN
   RAISE EXCEPTION 'FINISH_EXAM_BATCH_MISSING';
 END IF;
 SELECT lower(pg_get_functiondef('public.finish_exam_batch(uuid,jsonb)'::regprocedure))
 INTO v_ddl;
 IF position('user_id = v_user' IN v_ddl)=0
    OR position('for update' IN v_ddl)=0
    OR position('v_exam.finished_at is null' IN v_ddl)=0
    OR position('v_exam.duration_sec is not null' IN v_ddl)=0
    OR position('clock_timestamp() > v_exam.started_at' IN v_ddl)=0
    OR position('jsonb_array_length(p_answers) > 0' IN v_ddl)=0
    OR position('raise exception ''vaqt_tugadi''' IN v_ddl)=0
 THEN
   RAISE EXCEPTION 'FINISH_EXAM_BATCH_EXPIRED_ANSWER_GUARD_REGRESSED';
 END IF;
 IF has_function_privilege('anon','public.finish_exam_batch(uuid,jsonb)','EXECUTE') THEN
   RAISE EXCEPTION 'FINISH_EXAM_BATCH_ANON_EXECUTE_NOT_ALLOWED';
 END IF;
END $$;
