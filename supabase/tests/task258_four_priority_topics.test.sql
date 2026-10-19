-- TASK-258. Non-mutating regression for four originally empty assessed topics.
-- Run on a fresh database AFTER the strict 20261019190000 migration.
-- This test remains valid if authorized editorial publication fills the pools:
-- it verifies exact counts and never treats review records as eligible.
BEGIN;

DO $task258$
DECLARE
  v_n int;
  rec record;
  v_available int;
  v_review_direct int;
  v_payload jsonb;
  v_reported_available int;
  v_reported_count int;
  v_reason text;
BEGIN
  SELECT count(*) INTO v_n
  FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
  WHERE l.status='published'::public.content_status
    AND m.status='published'::public.content_status
    AND (m.code,l.slug) IN (
      ('M06','masala-algoritmini-tuzish'),
      ('M08','javascript-sintaksis-asoslari'),
      ('M12','arxitektura-va-topologiyalar'),
      ('M12','internetdan-xavfsiz-va-maqsadli-foydalanish')
    );

  IF v_n<>4 THEN
    RAISE EXCEPTION 'TASK-258: expected 4 assessed zero-gap lesson identities, found %',v_n;
  END IF;

  FOR rec IN
    SELECT l.id,l.slug,l.topic_test_question_count AS target,m.code
    FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
    WHERE l.status='published'::public.content_status
      AND m.status='published'::public.content_status
      AND (m.code,l.slug) IN (
        ('M06','masala-algoritmini-tuzish'),
        ('M08','javascript-sintaksis-asoslari'),
        ('M12','arxitektura-va-topologiyalar'),
        ('M12','internetdan-xavfsiz-va-maqsadli-foydalanish')
      )
  LOOP
    IF rec.target<>20 THEN
      RAISE EXCEPTION 'TASK-258: % configured target drift: %',rec.slug,rec.target;
    END IF;

    SELECT count(DISTINCT q.id) INTO v_available
    FROM public.questions q
    JOIN public.lesson_constructs lc
      ON lc.lesson_id=rec.id AND lc.construct_id=q.construct_id
    JOIN public.constructs c ON c.id=q.construct_id AND c.is_active
    JOIN public.question_keys k ON k.question_id=q.id
    WHERE q.status='published'::public.content_status
      AND q.group_code=c.group_code;

    SELECT count(*) INTO v_review_direct FROM public.questions q
    WHERE q.source_lesson_id=rec.id AND q.status='review'::public.content_status;

    v_payload:=public.topic_test_preview(rec.id);
    v_reported_available:=(v_payload->>'available_count')::int;
    v_reported_count:=(v_payload->>'question_count')::int;
    v_reason:=v_payload->>'reason';

    IF v_reported_available IS DISTINCT FROM v_available THEN
      RAISE EXCEPTION 'TASK-258: % counted % published; preview says % (review direct %)',
        rec.slug,v_available,v_reported_available,v_review_direct;
    END IF;

    IF v_available<rec.target THEN
      IF v_reported_count<>0 OR v_reason IS DISTINCT FROM 'topic_pool_insufficient'
         OR (v_payload->>'duration_sec')::int<>0 THEN
        RAISE EXCEPTION
          'TASK-258: % short %/20 pool must be blocked, not start partial test',
          rec.slug,v_available;
      END IF;
    ELSIF v_reported_count<>rec.target OR v_reason IS NOT NULL THEN
      RAISE EXCEPTION 'TASK-258: % full verified pool incorrectly blocked',rec.slug;
    END IF;
  END LOOP;
END
$task258$;

SELECT 'task258_four_priority_lessons_fail_closed_ok' AS result;
ROLLBACK;
