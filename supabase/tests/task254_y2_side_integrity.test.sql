-- TASK-254/TASK-304: test ALL immutable archived legacy Y2 items through
-- the existing exam_payload() compatibility projection. No published writes.
-- The 2026-10-18 RPC repair already resolves 8/a storage into 4/a + 4/b
-- in the learner payload when protected key mappings prove the shape.
BEGIN;

DO $task254$
DECLARE
  v_user uuid := '75000000-0000-4000-8000-000000000019';
  v_exam uuid;
  v_payload jsonb;
  v_expected integer;
  v_actual integer;
  v_bad integer;
BEGIN
  SELECT count(*) INTO v_expected
  FROM public.questions q
  JOIN public.question_bank_revisions r ON r.source_question_id=q.id
    AND r.revision_kind='legacy_y2_native_sides'
  WHERE q.status='archived' AND q.format='Y2'
    AND (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=q.id AND o.side='a')=8
    AND (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=q.id AND o.side='b')=0;

  IF v_expected=0 THEN
    RAISE EXCEPTION 'TASK-254: expected archived legacy Y2 history in the seed';
  END IF;

  INSERT INTO auth.users(id,email)
  VALUES (v_user,'test-all-y2-projections@example.test');

  INSERT INTO public.exams(user_id,kind,duration_sec)
  VALUES (v_user,'mock'::public.exam_kind,7200)
  RETURNING id INTO v_exam;

  INSERT INTO public.exam_items(exam_id,question_id,construct_id,order_idx)
  SELECT v_exam,q.id,q.construct_id,
         row_number() over(order by q.id)::integer
  FROM public.questions q
  JOIN public.question_bank_revisions r ON r.source_question_id=q.id
    AND r.revision_kind='legacy_y2_native_sides'
  WHERE q.status='archived' AND q.format='Y2'
    AND (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=q.id AND o.side='a')=8
    AND (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=q.id AND o.side='b')=0;

  v_payload:=public.exam_payload(v_exam);
  SELECT jsonb_array_length(v_payload) INTO v_actual;
  IF v_actual IS DISTINCT FROM v_expected THEN
    RAISE EXCEPTION 'TASK-254: Y2 projected count % differs from original %',
      v_actual,v_expected;
  END IF;

  SELECT count(*) INTO v_bad
  FROM jsonb_array_elements(v_payload) AS p(item)
  WHERE (SELECT count(*) FROM jsonb_array_elements(p.item->'options') AS opt(item)
         WHERE opt.item->>'side'='a')<>4
     OR (SELECT count(*) FROM jsonb_array_elements(p.item->'options') AS opt(item)
         WHERE opt.item->>'side'='b')<>4
     OR jsonb_array_length(p.item->'options')<>8
     OR p.item ? 'key'
     OR p.item ? 'pairs'
     OR p.item ? 'correct_option_id'
     OR p.item ? 'explanation_md';
  IF v_bad<>0 THEN
    RAISE EXCEPTION 'TASK-254: % immutable historical Y2 payloads violate 4+4 or key secrecy',v_bad;
  END IF;

  -- Projections MUST NOT mutate original archived option-side metadata.
  SELECT count(*) INTO v_actual
  FROM public.questions q
  JOIN public.question_bank_revisions r ON r.source_question_id=q.id
    AND r.revision_kind='legacy_y2_native_sides'
  WHERE q.status='archived' AND q.format='Y2'
    AND (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=q.id AND o.side='a')=8
    AND (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=q.id AND o.side='b')=0;
  IF v_actual<>v_expected THEN
    RAISE EXCEPTION 'TASK-254: immutable original Y2 options were altered';
  END IF;

  -- Draft/review Y1 distractor collisions remain human editorial blockers.
  -- Fail only if duplicate alternatives accidentally reached published.
  SELECT count(*) INTO v_bad FROM (
    SELECT o.question_id
    FROM public.question_options o JOIN public.questions q ON q.id=o.question_id
    WHERE q.status='published' AND q.format='Y1'
    GROUP BY o.question_id
    HAVING count(*) <> count(DISTINCT o.content_md)
  ) duplicates;
  IF v_bad<>0 THEN
    RAISE EXCEPTION 'TASK-254: % published Y1 questions have identical case-sensitive alternatives',v_bad;
  END IF;
END
$task254$;

SELECT 'task254_all_historical_y2_payload_projection_ok' AS result;
ROLLBACK;
