-- P0-02/P0-03: read-only preflight and draft provenance; CI fresh DB only.
BEGIN;
DO $check$
DECLARE
  v_lesson uuid;
  v_json jsonb;
  v_count integer;
  v_q integer;
  v_before bigint;
  v_after bigint;
BEGIN
  SELECT l.id INTO STRICT v_lesson FROM public.lessons l
  JOIN public.modules m ON m.id=l.module_id
  WHERE m.code='M15' AND l.order_idx=1 AND l.status='published';

  SELECT count(*) INTO v_before FROM public.exams;
  SELECT public.topic_test_preflight(v_lesson) INTO v_json;
  SELECT count(*) INTO v_after FROM public.exams;
  IF v_before<>v_after THEN
    RAISE EXCEPTION 'Preflight must never create an exam attempt';
  END IF;
  SELECT count(DISTINCT q.id) INTO v_q
    FROM public.questions q
    JOIN public.question_keys k ON k.question_id=q.id
    JOIN public.constructs c ON c.id=q.construct_id
    JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=v_lesson
    WHERE q.status='published'::public.content_status AND c.is_active
      AND q.group_code=c.group_code;
  IF (v_json->>'required')::int<>20 OR (v_json->>'available')::int<>v_q
    OR (v_json->>'ready')::boolean<>(v_q>=20) THEN
    RAISE EXCEPTION 'Preflight eligibility mismatch for M15.01: %, available=%',v_json,v_q;
  END IF;
  IF (v_json ? 'correct_option_id') OR (v_json ? 'question_id') OR (v_json ? 'key') THEN
    RAISE EXCEPTION 'Preflight must not leak answer keys or question IDs';
  END IF;

  SELECT count(*) INTO v_count FROM public.pedagogy_lesson_objectives;
  IF v_count<>78 THEN
    RAISE EXCEPTION 'Expected 78 review-only objective drafts, got %',v_count;
  END IF;
  IF (SELECT count(DISTINCT lesson_id) FROM public.pedagogy_lesson_objectives)<>18 THEN
    RAISE EXCEPTION 'Draft objectives must cover 18 canonical lessons';
  END IF;
  IF EXISTS(SELECT 1 FROM public.pedagogy_lesson_objectives
    WHERE status<>'review' OR reviewed_by IS NOT NULL OR source_page IS NOT NULL) THEN
    RAISE EXCEPTION 'Draft objectives cannot claim human source verification';
  END IF;
  IF EXISTS(SELECT 1 FROM public.pedagogy_question_objectives) THEN
    RAISE EXCEPTION 'Question-to-objective matching needs independent verification';
  END IF;

  IF has_function_privilege('authenticated','public.topic_test_preflight(uuid)','EXECUTE')
    OR has_function_privilege('anon','public.topic_test_preflight(uuid)','EXECUTE') THEN
    RAISE EXCEPTION 'Preflight private helper unexpectedly public';
  END IF;
  IF has_table_privilege('authenticated','public.pedagogy_lesson_objectives','SELECT')
    OR has_table_privilege('anon','public.pedagogy_lesson_objectives','SELECT') THEN
    RAISE EXCEPTION 'Draft learning objectives must not be readable to learners';
  END IF;
END
$check$;
SELECT 'pedagogy_preflight_and_78_review_objectives_ok' AS result;
ROLLBACK;
