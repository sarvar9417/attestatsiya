-- TASK-354 regression. Isolation: all synthetic users/exams/questions are rolled back.
BEGIN;
DO $$
BEGIN
 IF to_regprocedure('public.finish_exam_batch(uuid,jsonb)') IS NOT NULL THEN
   IF has_function_privilege('authenticated','public.finish_exam_batch(uuid,jsonb)','EXECUTE')
     OR has_function_privilege('anon','public.finish_exam_batch(uuid,jsonb)','EXECUTE') THEN
     RAISE EXCEPTION 'unsafe batch-finish must not be exposed';
   END IF;
 END IF;
 IF has_function_privilege('authenticated','public.persist_final_mastery_evidence(uuid)','EXECUTE')
 THEN RAISE EXCEPTION 'internal evidence helper callable by learner'; END IF;
 IF position('v_available < v_target' in pg_get_functiondef('public.generate_topic_test(uuid)'::regprocedure))=0
 THEN RAISE EXCEPTION 'topic count silently reduced'; END IF;
END $$;
INSERT INTO auth.users(id,email) VALUES
 ('67000000-0000-4000-8000-000000000001','final-v2@example.invalid'),
 ('67000000-0000-4000-8000-000000000002','legacy-v1@example.invalid');
INSERT INTO public.questions
 (id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,status)
SELECT '67000000-0000-4000-8000-000000000101',c.subject_id,c.id,c.group_code,
 'Y1'::public.question_format,'bilish'::public.cognitive_level,1,
 'Final answer integrity fixture','published'::public.content_status
FROM public.constructs c WHERE c.is_active ORDER BY c.code LIMIT 1;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md) VALUES
 ('67000000-0000-4000-8000-000000000111','67000000-0000-4000-8000-000000000101','a',1,'Correct'),
 ('67000000-0000-4000-8000-000000000112','67000000-0000-4000-8000-000000000101','a',2,'Wrong'),
 ('67000000-0000-4000-8000-000000000113','67000000-0000-4000-8000-000000000101','a',3,'Other');
INSERT INTO public.question_keys(question_id,payload,explanation_md)
VALUES('67000000-0000-4000-8000-000000000101',
 '{"correct_option_id":"67000000-0000-4000-8000-000000000111"}','Fixture explanation verified');
INSERT INTO public.exams(id,user_id,kind,selection_meta) VALUES
 ('67000000-0000-4000-8000-000000000201','67000000-0000-4000-8000-000000000001','mavzu','{}'),
 ('67000000-0000-4000-8000-000000000202','67000000-0000-4000-8000-000000000002','mavzu','{}');
INSERT INTO public.exam_items(id,exam_id,question_id,construct_id,order_idx)
SELECT '67000000-0000-4000-8000-000000000301',
 '67000000-0000-4000-8000-000000000201',q.id,q.construct_id,1
FROM public.questions q WHERE q.id='67000000-0000-4000-8000-000000000101';
INSERT INTO public.exam_items(id,exam_id,question_id,construct_id,order_idx)
SELECT '67000000-0000-4000-8000-000000000302',
 '67000000-0000-4000-8000-000000000202',q.id,q.construct_id,1
FROM public.questions q WHERE q.id='67000000-0000-4000-8000-000000000101';
SELECT set_config('request.jwt.claim.sub','67000000-0000-4000-8000-000000000001',false);
SET ROLE authenticated;
DO $$
DECLARE r jsonb; v_construct uuid;
BEGIN
 r:=public.submit_answer('67000000-0000-4000-8000-000000000201',
  '67000000-0000-4000-8000-000000000101',
  '{"option_id":"67000000-0000-4000-8000-000000000112","_client_revision":1001}',5);
 IF r->>'saved'<>'true' THEN RAISE EXCEPTION 'first revision rejected: %',r; END IF;
 r:=public.submit_answer('67000000-0000-4000-8000-000000000201',
  '67000000-0000-4000-8000-000000000101',
  '{"option_id":"67000000-0000-4000-8000-000000000111","_client_revision":1002}',6);
 IF r->>'saved'<>'true' THEN RAISE EXCEPTION 'second revision rejected: %',r; END IF;
 r:=public.submit_answer('67000000-0000-4000-8000-000000000201',
  '67000000-0000-4000-8000-000000000101',
  '{"option_id":"67000000-0000-4000-8000-000000000112","_client_revision":1001}',7);
 IF r->>'already_answered'<>'true' THEN RAISE EXCEPTION 'stale overwrite not rejected: %',r; END IF;
 IF exists(select 1 from public.mastery_evidence where exam_id='67000000-0000-4000-8000-000000000201')
 THEN RAISE EXCEPTION 'pre-finish evidence leaked first answer'; END IF;
 SELECT construct_id INTO v_construct FROM public.exam_items WHERE exam_id='67000000-0000-4000-8000-000000000201';
 IF exists(select 1 from public.user_construct_stats WHERE user_id='67000000-0000-4000-8000-000000000001'
    AND construct_id=v_construct AND attempts<>0)
 THEN RAISE EXCEPTION 'pre-finish SM2 counted provisional choice'; END IF;
 r:=public.finish_exam('67000000-0000-4000-8000-000000000201');
 IF (r->>'total_score')::int<>2 THEN RAISE EXCEPTION 'final choice not scored: %',r; END IF;
 PERFORM public.finish_exam('67000000-0000-4000-8000-000000000201');
 IF (select attempts from public.user_construct_stats
   WHERE user_id='67000000-0000-4000-8000-000000000001' AND construct_id=v_construct)<>1
   OR (select correct from public.user_construct_stats
   WHERE user_id='67000000-0000-4000-8000-000000000001' AND construct_id=v_construct)<>1
   OR (select bilish_correct from public.user_construct_stats
   WHERE user_id='67000000-0000-4000-8000-000000000001' AND construct_id=v_construct)<>1
   OR (select count(*) from public.mastery_evidence
   WHERE exam_id='67000000-0000-4000-8000-000000000201' AND is_correct)=0
 THEN RAISE EXCEPTION 'final evidence/SM2 wrong or double-counted'; END IF;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','67000000-0000-4000-8000-000000000002',false);
SET ROLE authenticated;
DO $$
DECLARE r jsonb; v_construct uuid;
BEGIN
 r:=public.submit_answer('67000000-0000-4000-8000-000000000202',
  '67000000-0000-4000-8000-000000000101',
  '{"option_id":"67000000-0000-4000-8000-000000000111"}',3);
 IF r->>'correct'<>'true' THEN RAISE EXCEPTION 'legacy feedback changed: %',r; END IF;
 SELECT construct_id INTO v_construct FROM public.exam_items WHERE exam_id='67000000-0000-4000-8000-000000000202';
 IF (select attempts from public.user_construct_stats
   WHERE user_id='67000000-0000-4000-8000-000000000002' AND construct_id=v_construct)<>1
 THEN RAISE EXCEPTION 'legacy first-answer SM2 changed'; END IF;
 PERFORM public.finish_exam('67000000-0000-4000-8000-000000000202');
 IF (select attempts from public.user_construct_stats
   WHERE user_id='67000000-0000-4000-8000-000000000002' AND construct_id=v_construct)<>1
 THEN RAISE EXCEPTION 'legacy first-answer counted twice'; END IF;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','',false);
SELECT 'exam_final_answer_integrity_ok' AS result;
ROLLBACK;
