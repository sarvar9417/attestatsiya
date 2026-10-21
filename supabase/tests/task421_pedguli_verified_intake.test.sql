-- TASK-421: regression contract for the expert-screened Telegram intake.
BEGIN;

DO $test_task376$
DECLARE
  v_count integer;
BEGIN
  SELECT count(*) INTO v_count
  FROM public.questions
  WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%|task421:expert-rewrite:v1';

  IF v_count <> 16 THEN
    RAISE EXCEPTION 'TASK-421 expected 16 questions, found %', v_count;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.questions q
    JOIN public.constructs c ON c.id = q.construct_id
    LEFT JOIN public.question_keys k ON k.question_id = q.id
    WHERE q.source_reference LIKE 'telegram:@PedMahoratGuli:%|task421:expert-rewrite:v1'
      AND (
        q.status <> 'review'::public.content_status
        OR q.format <> 'Y1'::public.question_format
        OR q.source_lesson_id IS NULL
        OR c.code NOT IN ('KS.01', 'KS.02', 'KS.03', 'KS.04', 'KS.06', 'PM.GEN.06', 'PM.GEN.08')
        OR k.question_id IS NULL
        OR nullif(btrim(k.explanation_md), '') IS NULL
        OR (SELECT count(*) FROM public.question_options o WHERE o.question_id = q.id AND o.side = 'a') <> 4
        OR NOT EXISTS (
          SELECT 1
          FROM public.question_options o
          WHERE o.question_id = q.id
            AND o.id::text = k.payload->>'correct_option_id'
        )
      )
  ) THEN
    RAISE EXCEPTION 'TASK-421 metadata, option, key or explanation contract failed';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.questions q
    JOIN public.question_options o ON o.question_id = q.id
    WHERE q.source_reference LIKE 'telegram:@PedMahoratGuli:%|task421:expert-rewrite:v1'
    GROUP BY q.id, lower(regexp_replace(o.content_md, '[^[:alnum:]]+', ' ', 'g'))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'TASK-421 contains duplicate answer options';
  END IF;
END
$test_task376$;

ROLLBACK;
