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

-- Runtime acceptance: an expired exam cannot accept new answers through the
-- legacy batch RPC, yet may finalize already-saved answers with an empty array.
BEGIN;
DO $expired_batch$
DECLARE
 v_user uuid := '63000000-0000-4000-8000-000000000101';
 v_exam uuid := '63000000-0000-4000-8000-000000000102';
 v_q uuid;
 v_construct uuid;
 v_correct text;
 v_payload jsonb;
 v_failed boolean := false;
 v_answered integer;
 v_finished timestamptz;
 v_total integer;
BEGIN
 SELECT q.id,q.construct_id,k.payload->>'correct_option_id'
 INTO v_q,v_construct,v_correct
 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published'::public.content_status
   AND q.format='Y1'::public.question_format
   AND EXISTS (
     SELECT 1 FROM public.question_options o
     WHERE o.question_id=q.id AND o.side='a'
       AND o.id::text=k.payload->>'correct_option_id'
   )
 ORDER BY q.id LIMIT 1;
 IF v_q IS NULL THEN RAISE EXCEPTION 'BATCH_EXPIRY_FIXTURE_MISSING'; END IF;

 INSERT INTO auth.users(id,email) VALUES(v_user,'expired-batch@test.invalid');
 INSERT INTO public.exams(id,user_id,kind,duration_sec,started_at)
 VALUES(v_exam,v_user,'mavzu',60,now()-interval '5 minutes');
 INSERT INTO public.exam_items(exam_id,question_id,construct_id,order_idx)
 VALUES(v_exam,v_q,v_construct,1);
 PERFORM set_config('request.jwt.claim.sub',v_user::text,true);
 v_payload:=jsonb_build_array(jsonb_build_object(
   'question_id',v_q,'answer',jsonb_build_object('option_id',v_correct),
   'time_spent_sec',5
 ));
 BEGIN
   PERFORM public.finish_exam_batch(v_exam,v_payload);
 EXCEPTION WHEN OTHERS THEN
   IF SQLERRM LIKE '%vaqt_tugadi%' THEN v_failed:=true; ELSE RAISE; END IF;
 END;
 IF NOT v_failed THEN RAISE EXCEPTION 'EXPIRED_BATCH_DID_NOT_REJECT_ANSWER'; END IF;
 SELECT count(*) INTO v_answered
 FROM public.exam_items WHERE exam_id=v_exam AND answered_at IS NOT NULL;
 IF v_answered<>0 THEN RAISE EXCEPTION 'EXPIRED_BATCH_WROTE_ANSWER'; END IF;

 PERFORM public.finish_exam_batch(v_exam,'[]'::jsonb);
 SELECT finished_at,total_score INTO v_finished,v_total
 FROM public.exams WHERE id=v_exam;
 IF v_finished IS NULL OR v_total<>0 THEN
   RAISE EXCEPTION 'EXPIRED_BATCH_EMPTY_FINALIZATION_FAILED';
 END IF;
END;
$expired_batch$;
ROLLBACK;
