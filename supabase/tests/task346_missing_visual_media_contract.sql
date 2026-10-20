-- TASK-346: positive/negative media publication gate; read-only rollback test.
BEGIN;
DO $test$
DECLARE
  game_src jsonb := '[{"kind":"image","diagram_id":"pedguli-4842-classroom-game","src":"/pedguli-source/pedguli-4842-classroom-game.jpg"}]'::jsonb;
  wrong_src jsonb := '[{"kind":"source_screenshot","drive_file_id":"fake","image_ordinals":["q4"]}]'::jsonb;
  external_src jsonb := '[{"kind":"image","src":"https://example.invalid/q.jpg"}]'::jsonb;
  logic_src jsonb := '[{"kind":"logic_circuit","diagram_id":"G001"}]'::jsonb;
BEGIN
  IF NOT public.task346_requires_source_visual(
    '❗️❗️❗️ Ushbu suratda qaysi metod tasvirlangan?'
  ) THEN RAISE EXCEPTION 'TASK346_SOURCE_PHOTO_CUE_UNDETECTED'; END IF;
  IF public.task346_requires_source_visual(
    '300 PPI bosma rasmda har dyuymga 300 piksel joylashdi.'
  ) THEN RAISE EXCEPTION 'TASK346_ORDINARY_IMAGE_TERM_FALSE_POSITIVE'; END IF;
  IF public.task346_has_usable_source_visual('[]'::jsonb,'Ushbu suratda qaysi?')
  OR public.task346_has_usable_source_visual(wrong_src,'Ushbu suratda qaysi?')
  OR public.task346_has_usable_source_visual(external_src,'Ushbu suratda qaysi?')
  THEN RAISE EXCEPTION 'TASK346_UNRENDERABLE_ASSET_ACCEPTED'; END IF;
  IF NOT public.task346_has_usable_source_visual(game_src,'Ushbu suratda qaysi?')
  THEN RAISE EXCEPTION 'TASK346_ORIGINAL_GAME_PHOTO_REJECTED'; END IF;
  IF NOT public.task346_has_usable_source_visual(logic_src,'[[FIG:G001]]')
    OR public.task346_has_usable_source_visual(logic_src,'[[FIG:G999]]')
  THEN RAISE EXCEPTION 'TASK346_LOGIC_CIRCUIT_INVARIANT_BROKEN'; END IF;
  IF EXISTS(
    SELECT 1 FROM public.questions
    WHERE id='05d53eb9-56de-454c-9440-e207668dd2c4'::uuid
      AND status='review'::public.content_status
      AND assets->0->>'src' <> '/pedguli-source/pedguli-4842-classroom-game.jpg'
  ) THEN RAISE EXCEPTION 'TASK346_REVIEW_ORIGINAL_MEDIA_WRONG'; END IF;
  IF EXISTS(
    SELECT 1 FROM public.questions
    WHERE id='d41ab61f-a43e-4b2d-919b-5b06dde05341'::uuid
      AND assets <> '[]'::jsonb
  ) THEN RAISE EXCEPTION 'TASK346_HISTORICAL_PUBLISHED_SNAPSHOT_CHANGED'; END IF;
END;
$test$;
ROLLBACK;
