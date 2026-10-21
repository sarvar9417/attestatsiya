-- TASK-421: reconcile the provisional TASK-376 source tag after repository-wide
-- task-number collision was discovered. Only this unpublished review batch is touched.
BEGIN;

DO $task421$
DECLARE
  v_updated integer;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.questions
    WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%|task376:expert-rewrite:v1'
      AND status <> 'review'::public.content_status
  ) THEN
    RAISE EXCEPTION 'TASK-421 refuses to retag non-review content';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.questions
    WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%|task421:expert-rewrite:v1'
  ) THEN
    IF (
      SELECT count(*)
      FROM public.questions
      WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%|task421:expert-rewrite:v1'
    ) <> 16 THEN
      RAISE EXCEPTION 'TASK-421 target tag already exists with unexpected count';
    END IF;
  ELSE
    UPDATE public.questions
    SET source_reference = replace(
      source_reference,
      '|task376:expert-rewrite:v1',
      '|task421:expert-rewrite:v1'
    )
    WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%|task376:expert-rewrite:v1'
      AND status = 'review'::public.content_status;
    GET DIAGNOSTICS v_updated = ROW_COUNT;

    IF v_updated <> 16 THEN
      RAISE EXCEPTION 'TASK-421 expected to retag 16 review questions, updated %', v_updated;
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.questions
    WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%|task376:expert-rewrite:v1'
  ) OR (
    SELECT count(*)
    FROM public.questions
    WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%|task421:expert-rewrite:v1'
      AND status = 'review'::public.content_status
  ) <> 16 THEN
    RAISE EXCEPTION 'TASK-421 source tag reconciliation failed';
  END IF;
END
$task421$;

COMMIT;
