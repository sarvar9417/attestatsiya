-- TASK-254: rollback-only structural gate, run AFTER active migration chain.
-- No private answer payloads selected, no published/review status mutation.
BEGIN;

DO $task254_test$
DECLARE
  v_invalid_y2 integer;
  v_duplicate_published_y1 integer;
BEGIN
  WITH counts AS (
    SELECT q.id,
           count(o.id) FILTER (WHERE o.side='a') AS left_n,
           count(o.id) FILTER (WHERE o.side='b') AS right_n
    FROM public.questions q
    LEFT JOIN public.question_options o ON o.question_id=q.id
    WHERE q.status IN ('published','review') AND q.format='Y2'
    GROUP BY q.id
  )
  SELECT count(*) INTO v_invalid_y2
  FROM counts WHERE left_n < 1 OR right_n < 1;

  IF v_invalid_y2 <> 0 THEN
    RAISE EXCEPTION 'TASK-254: % published/review Y2 records have invalid sides',
      v_invalid_y2;
  END IF;

  WITH normalized_options AS (
    SELECT o.question_id,
           count(*) AS total_n,
           count(DISTINCT lower(regexp_replace(btrim(o.content_md), '\\s+', ' ', 'g'))) AS distinct_n
    FROM public.question_options o
    JOIN public.questions q ON q.id=o.question_id
    WHERE q.status='published' AND q.format='Y1'
    GROUP BY o.question_id
  )
  SELECT count(*) INTO v_duplicate_published_y1
  FROM normalized_options
  WHERE total_n <> distinct_n;

  IF v_duplicate_published_y1 <> 0 THEN
    RAISE EXCEPTION 'TASK-254: % published Y1 records have duplicate alternatives',
      v_duplicate_published_y1;
  END IF;
END
$task254_test$;

SELECT 'task254_y2_sides_and_published_y1_unique_ok' AS result;
ROLLBACK;
