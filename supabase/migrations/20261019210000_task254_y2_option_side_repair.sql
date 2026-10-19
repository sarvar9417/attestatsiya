-- TASK-254: Repair historical Y2 matching-side metadata, not answer content.
-- Production execution requires its own deployment approval. Idempotent.
-- Historical rows have 8 option IDs all flagged side='a'; key.pairs confirms
-- that orders 1..4 are left, 5..8 are right. IDs/keys/text/order are untouched.
BEGIN;

CREATE TEMP TABLE task254_y2_candidates ON COMMIT DROP AS
SELECT q.id AS question_id
FROM public.questions q
JOIN public.question_options o ON o.question_id = q.id
WHERE q.format = 'Y2'
  AND q.status IN ('published', 'review')
GROUP BY q.id
HAVING count(*) = 8
   AND count(*) FILTER (WHERE o.side = 'a') = 8
   AND count(*) FILTER (WHERE o.side = 'b') = 0
   AND count(DISTINCT o.order_idx) = 8
   AND min(o.order_idx) = 1
   AND max(o.order_idx) = 8;

-- Fail closed: do not guess left/right by position unless every saved key
-- already proves the exact four-pair left/right mapping. The payload is read
-- only inside the database, never logged, selected or written to a public file.
DO $task254_verify$
DECLARE v_unverifiable integer;
BEGIN
  SELECT count(*) INTO v_unverifiable
  FROM task254_y2_candidates x
  LEFT JOIN public.question_keys k ON k.question_id = x.question_id
  WHERE k.question_id IS NULL
    OR (CASE WHEN jsonb_typeof(k.payload->'pairs') = 'object'
             THEN (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))
             ELSE -1 END) <> 4
    OR (CASE WHEN jsonb_typeof(k.payload->'pairs') = 'object'
             THEN (SELECT count(DISTINCT pair.value)
                   FROM jsonb_each_text(k.payload->'pairs') AS pair)
             ELSE -1 END) <> 4
    OR (CASE WHEN jsonb_typeof(k.payload->'pairs') = 'object'
             THEN (SELECT count(*)
                   FROM jsonb_each_text(k.payload->'pairs') AS pair
                   JOIN public.question_options a
                     ON a.question_id=x.question_id
                    AND a.id::text=pair.key
                    AND a.order_idx BETWEEN 1 AND 4
                   JOIN public.question_options b
                     ON b.question_id=x.question_id
                    AND b.id::text=pair.value
                    AND b.order_idx BETWEEN 5 AND 8)
             ELSE -1 END) <> 4;

  IF v_unverifiable <> 0 THEN
    RAISE EXCEPTION 'TASK-254 stopped: % Y2 candidates have unverified matching mappings',
      v_unverifiable;
  END IF;
END
$task254_verify$;

DO $task254_update$
DECLARE
  v_expected integer;
  v_changed integer;
  v_incomplete integer;
BEGIN
  SELECT count(*) * 4 INTO v_expected FROM task254_y2_candidates;

  UPDATE public.question_options o
     SET side = 'b'
    FROM task254_y2_candidates x
   WHERE o.question_id = x.question_id
     AND o.order_idx BETWEEN 5 AND 8
     AND o.side = 'a';

  GET DIAGNOSTICS v_changed = ROW_COUNT;
  IF v_changed <> v_expected THEN
    RAISE EXCEPTION 'TASK-254 changed % options; expected %; rolled back',
      v_changed, v_expected;
  END IF;

  SELECT count(*) INTO v_incomplete
  FROM task254_y2_candidates x
  WHERE (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=x.question_id AND o.side='a') <> 4
     OR (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=x.question_id AND o.side='b') <> 4;

  IF v_incomplete <> 0 THEN
    RAISE EXCEPTION 'TASK-254 failed post-check for % Y2 questions', v_incomplete;
  END IF;

  RAISE NOTICE 'TASK-254: corrected % option-side flags; key data and exam history unchanged',
    v_changed;
END
$task254_update$;

COMMIT;
