-- P0 integration regression: mutable drafts must NOT update SM-2 or
-- mastery_evidence before finish. Final choice wins; second finish is idempotent.
-- Synthetic test account and exam are rolled back, never retained.
BEGIN;
DO $sm2_final$
DECLARE
 v_user uuid := '62000000-0000-4000-8000-000000000101';
 v_exam uuid := '62000000-0000-4000-8000-000000000102';
 v_q uuid;
 v_construct uuid;
 v_correct uuid;
 v_wrong uuid;
 v_before bigint := floor(extract(epoch from now()) * 1000)::bigint;
 v_meta jsonb;
 v_stats public.user_construct_stats%rowtype;
 v_evidence public.mastery_evidence%rowtype;
 v_count integer;
BEGIN
 SELECT q.id,q.construct_id,(k.payload->>'correct_option_id')::uuid,
   (SELECT o.id FROM public.question_options o
    WHERE o.question_id=q.id AND o.side='a'
      AND o.id::text<>k.payload->>'correct_option_id'
    ORDER BY o.order_idx,o.id LIMIT 1)
 INTO v_q,v_construct,v_correct,v_wrong
 FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published'::public.content_status
   AND q.format='Y1'::public.question_format
   AND EXISTS(SELECT 1 FROM public.question_options o
    WHERE o.question_id=q.id AND o.side='a'
      AND o.id::text=k.payload->>'correct_option_id')
   AND EXISTS(SELECT 1 FROM public.question_options o
    WHERE o.question_id=q.id AND o.side='a'
      AND o.id::text<>k.payload->>'correct_option_id')
 ORDER BY q.id LIMIT 1;
 IF v_q IS NULL OR v_wrong IS NULL THEN
   RAISE EXCEPTION 'SM2_FINAL_FIXTURE_NO_PUBLISHED_Y1';
 END IF;

 INSERT INTO auth.users(id,email)
 VALUES(v_user,'sm2-final-attempt@test.invalid');
 INSERT INTO public.exams(id,user_id,kind,duration_sec)
 VALUES(v_exam,v_user,'mavzu',7200);
 SELECT selection_meta INTO v_meta FROM public.exams WHERE id=v_exam;
 IF v_meta->>'sm2_commit_policy' IS DISTINCT FROM 'on_finish_v1' THEN
   RAISE EXCEPTION 'SM2_NEW_EXAM_NOT_TAGGED';
 END IF;
 INSERT INTO public.exam_items(exam_id,question_id,construct_id,order_idx)
 VALUES(v_exam,v_q,v_construct,1);

 PERFORM set_config('request.jwt.claim.sub',v_user::text,true);
 PERFORM public.submit_answer(v_exam,v_q,
   jsonb_build_object('option_id',v_wrong::text,'_client_revision',v_before),3);
 IF EXISTS(SELECT 1 FROM public.mastery_evidence e WHERE e.exam_id=v_exam)
    OR EXISTS(SELECT 1 FROM public.user_construct_stats s
       WHERE s.user_id=v_user AND s.attempts>0) THEN
   RAISE EXCEPTION 'SM2_OR_EVIDENCE_WRITTEN_BEFORE_FINISH';
 END IF;

 PERFORM public.submit_answer(v_exam,v_q,
   jsonb_build_object('option_id',v_correct::text,'_client_revision',v_before+1),6);
 IF EXISTS(SELECT 1 FROM public.mastery_evidence WHERE exam_id=v_exam) THEN
   RAISE EXCEPTION 'EVIDENCE_RECORDED_FOR_INTERMEDIATE_ANSWER';
 END IF;
 PERFORM public.finish_exam(v_exam);
 PERFORM public.finish_exam(v_exam);

 SELECT * INTO v_stats FROM public.user_construct_stats
 WHERE user_id=v_user AND construct_id=v_construct;
 IF v_stats.attempts<>1 OR v_stats.correct<>1 OR v_stats.independent_attempts<>1
    OR v_stats.review_stage<>1 THEN
   RAISE EXCEPTION 'SM2_DOUBLE_APPLY_OR_WRONG_FINAL_RESULT: %',row_to_json(v_stats);
 END IF;
 SELECT count(*) INTO v_count FROM public.mastery_evidence WHERE exam_id=v_exam;
 IF v_count<>1 THEN
   RAISE EXCEPTION 'SM2_EVIDENCE_COUNT_INVALID: %',v_count;
 END IF;
 SELECT * INTO v_evidence FROM public.mastery_evidence WHERE exam_id=v_exam;
 IF v_evidence.is_correct IS DISTINCT FROM true THEN
   RAISE EXCEPTION 'SM2_EVIDENCE_DID_NOT_TRACK_FINAL_CHOICE';
 END IF;
END;
$sm2_final$;
ROLLBACK;
