-- Release-readiness database regression for M02.
-- Executed on throwaway CI database only, and rolled back.
BEGIN;
DO $assert$
DECLARE
 v_lessons integer;
 v_invalid integer;
 v_construct_id uuid;
 v_subject_id uuid;
 v_lesson_id uuid;
 v_question_id uuid;
 v_candidate_source text;
BEGIN
 SELECT count(*) INTO v_lessons FROM public.lessons l
 JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M02' AND l.status='published'::public.content_status
 AND l.order_idx BETWEEN 1 AND 4;
 IF v_lessons<>4 THEN
   RAISE EXCEPTION 'M02 must expose four canonical published lessons, got %',v_lessons;
 END IF;

 SELECT count(*) INTO v_invalid FROM public.lessons l
 JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M02' AND l.status='published'::public.content_status
   AND l.order_idx BETWEEN 1 AND 4
   AND (l.topic_test_question_count<5 OR l.topic_test_question_count>20
      OR l.topic_test_question_count > (
         SELECT count(DISTINCT q.id)
         FROM public.lesson_constructs lc
         JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
         JOIN public.questions q ON q.construct_id=c.id
           AND q.group_code=c.group_code
           AND q.status='published'::public.content_status
         JOIN public.question_keys k ON k.question_id=q.id
         WHERE lc.lesson_id=l.id
       ));
 IF v_invalid<>0 THEN
   RAISE EXCEPTION 'M02 topic_count exceeds approved, published keyed pool';
 END IF;

 IF to_regclass('ktd_quality.editorial_reviews') IS NULL THEN
    RAISE EXCEPTION 'KTD independent editorial review table missing';
 END IF;

 SELECT c.id,c.subject_id,l.id INTO v_construct_id,v_subject_id,v_lesson_id
 FROM public.constructs c JOIN public.lesson_constructs lc ON lc.construct_id=c.id
 JOIN public.lessons l ON l.id=lc.lesson_id
 WHERE c.code='S2.HW.01' AND l.status='published'::public.content_status LIMIT 1;

 FOR v_candidate_source IN
   SELECT unnest(ARRAY[
     'ktd-540-2026:CI-PUBLICATION-GUARD',
     'authored:m02-source-20261018:CI-PUBLICATION-GUARD'
   ])
 LOOP
   v_question_id:=gen_random_uuid();
   INSERT INTO public.questions(
     id,subject_id,construct_id,group_code,format,cognitive,difficulty,
     stem_md,status,source_reference,source_lesson_id
   ) VALUES (
     v_question_id,v_subject_id,v_construct_id,'S2.HW','Y1','bilish',1,
     'Synthetic CI-only unreviewed question used to validate publication gate?',
     'review',v_candidate_source,v_lesson_id
   );
   BEGIN
     UPDATE public.questions SET status='published' WHERE id=v_question_id;
     RAISE EXCEPTION 'Unverified source escaped to published: %',v_candidate_source;
   EXCEPTION WHEN check_violation THEN
     NULL;
   END;
   IF (SELECT status FROM public.questions WHERE id=v_question_id)
     <> 'review'::public.content_status THEN
     RAISE EXCEPTION 'Review status changed after rejection: %',v_candidate_source;
   END IF;
 END LOOP;
tion rejection';
 END IF;
END $assert$;
ROLLBACK;
