-- Permit a smaller honest temporary practice only for M02 canonical
-- operating-system and file-management lessons, where 8 published questions
-- exist today. Preserve the 10..50 invariant for all OTHER platform lessons.
ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_topic_test_question_count_check;
ALTER TABLE public.lessons ADD CONSTRAINT lessons_topic_test_question_count_check
CHECK (
  topic_test_question_count BETWEEN 10 AND 50
  OR (
    id IN (
      '92000000-0000-4000-8000-000000000002'::uuid,
      '92000000-0000-4000-8000-000000000003'::uuid
    )
    AND topic_test_question_count BETWEEN 5 AND 50
  )
);

-- M02 released question pools: never request more questions than are
-- currently independently published, keyed and mapped to active constructs.
-- This maintains honest 8/11/16-question practice while KTD-528 stays REVIEW.
-- The target may be raised to 20 only after reviewed questions are published.
WITH published_pool AS (
  SELECT l.id AS lesson_id, count(DISTINCT q.id)::integer AS available
  FROM public.lessons l
  JOIN public.modules m ON m.id=l.module_id
  JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
  JOIN public.constructs c ON c.id=lc.construct_id
    AND c.is_active AND c.group_code='S2.HW'
  LEFT JOIN public.questions q ON q.construct_id=lc.construct_id
    AND q.group_code=c.group_code
    AND q.status='published'::public.content_status
    AND EXISTS (
      SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id
    )
  WHERE m.code='M02' AND l.status='published'::public.content_status
    AND l.order_idx BETWEEN 1 AND 4
  GROUP BY l.id
)
UPDATE public.lessons l
SET topic_test_question_count=LEAST(20,p.available),
    updated_at=now()
FROM published_pool p
WHERE l.id=p.lesson_id
  AND p.available>=5
  AND l.topic_test_question_count IS DISTINCT FROM LEAST(20,p.available);

-- Fail closed if any canonical lesson cannot support even five questions.
DO $m02$
DECLARE v_missing integer;
BEGIN
 SELECT count(*) INTO v_missing
 FROM public.lessons l
 JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M02' AND l.status='published'::public.content_status
   AND l.order_idx BETWEEN 1 AND 4
   AND (
      l.topic_test_question_count < 5
      OR l.topic_test_question_count > (
        SELECT count(DISTINCT q.id)
        FROM public.lesson_constructs lc
        JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
        JOIN public.questions q ON q.construct_id=c.id
          AND q.group_code=c.group_code
          AND q.status='published'::public.content_status
        JOIN public.question_keys k ON k.question_id=q.id
        WHERE lc.lesson_id=l.id
      )
   );
 IF v_missing>0 THEN
   RAISE EXCEPTION 'M02_CANONICAL_PUBLISHED_POOL_INSUFFICIENT: % lessons',v_missing;
 END IF;
END $m02$;
