-- M02 wave-7 release CHECK ONLY. Never publishes, edits or deletes content.
-- This is NOT a migration and does not certify question semantics.
DO $qa$
DECLARE
 v_published integer;
 v_review integer;
 v_held integer;
 v_lesson_count integer;
 v_incomplete integer;
 v_broken_keys integer;
 v_question_total integer;
BEGIN
 SELECT count(*) FILTER (WHERE status='published'),
        count(*) FILTER (WHERE status='review')
 INTO v_published,v_review
 FROM public.questions WHERE group_code='S2.HW';

 SELECT count(*) INTO v_held
 FROM kt_bank_review.candidates
 WHERE bank_code='KT-HW-2026' AND review_state='held';

 SELECT count(*) INTO v_lesson_count FROM public.lessons l
 JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M02' AND l.order_idx BETWEEN 1 AND 4
   AND l.status='published';

 -- All KTD and newly authored M02 review questions need exactly four
 -- distinct option texts and a selected key in their own option set.
 WITH bank AS (
 SELECT q.id,k.payload->>'correct_option_id' AS answer_id
 FROM public.questions q LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'ktd-540-2026:%'
    OR q.source_reference LIKE 'authored:m02-source-20261018:%'
 ), options AS (
 SELECT b.id,count(o.id) AS total,count(DISTINCT o.content_md) AS unique_options,
 count(o.id) FILTER (WHERE o.id::text=b.answer_id) AS matching_key
 FROM bank b LEFT JOIN public.question_options o ON o.question_id=b.id
 GROUP BY b.id
 )
 SELECT count(*),count(*) FILTER (
 WHERE total<>4 OR unique_options<>4 OR matching_key<>1
 ) INTO v_question_total,v_broken_keys FROM options;

 -- The learner should not be asked for more than approved published,
 -- keyed and construct-mapped questions. No review candidates included.
 SELECT count(*) INTO v_incomplete FROM public.lessons l
 JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M02' AND l.order_idx BETWEEN 1 AND 4
 AND (l.topic_test_question_count > (
 SELECT count(DISTINCT q.id)
 FROM public.lesson_constructs lc
 JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
 JOIN public.questions q ON q.construct_id=c.id
   AND q.status='published' AND q.group_code=c.group_code
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE lc.lesson_id=l.id
 ) OR l.topic_test_question_count<5);

 IF v_published<43 OR v_review<540 OR v_held<>387
    OR v_lesson_count<>4 OR v_question_total<540
    OR v_broken_keys<>0 OR v_incomplete<>0
 THEN
   RAISE EXCEPTION
   'M02 QA FAILED: published %, review %, old held %, lessons %, new candidate total %, invalid keys/option sets %, underfilled learner lessons %',
     v_published,v_review,v_held,v_lesson_count,v_question_total,v_broken_keys,v_incomplete;
 END IF;
 RAISE NOTICE 'M02 structure OK: published %, review %, old held %, lessons %, candidates %, broken keys %, underfilled learner lessons %',
   v_published,v_review,v_held,v_lesson_count,v_question_total,v_broken_keys,v_incomplete;
END $qa$;
