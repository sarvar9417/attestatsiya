-- TASK-203: exact nine matching format questions were originally seeded
-- with a-side indices 1..8. New published records have already been repaired.
-- Execute BEFORE task203_owner_batch_249_replay.sql on older review-only installs.
-- Do not touch historical immutable published revisions.
BEGIN;
DO $y2$
DECLARE rec record; v_a integer; v_b integer;
BEGIN
 FOR rec IN SELECT q.id,q.source_reference FROM public.questions q
 WHERE q.id IN (
 '4c2aa246-132e-4cd7-85a8-5abdde14c0e7'::uuid,
 '5ea0ba3d-d9e2-45b7-9a2e-6e350462a5fe'::uuid,
 '802e226f-2aab-4cf8-ad47-0630a95902a0'::uuid,
 'b7632513-aa4c-44a9-a308-52bfb60af145'::uuid,
 'bb74be92-a3de-4f12-8e1a-d179944837c3'::uuid,
 'c8a98c0e-5504-4bf7-bb4b-8d434e8e485a'::uuid,
 'cd673392-a09e-4cb0-b83b-67db1f606f9a'::uuid,
 'dde81ce5-bee8-42f5-b197-f1d7715af7f4'::uuid,
 'f35ce286-3064-4b17-8ac2-a2bdc2a2d6e6'::uuid
 ) AND q.format='Y2'::public.question_format
 LOOP
   SELECT count(*) FILTER(WHERE side='a'),count(*) FILTER(WHERE side='b')
   INTO v_a,v_b FROM public.question_options WHERE question_id=rec.id;
   IF (SELECT status FROM public.questions WHERE id=rec.id)='published'::public.content_status THEN
     IF v_a<>4 OR v_b<>4 THEN
       RAISE EXCEPTION 'TASK203 published Y2 data shape needs new immutable revision: %',rec.id;
     END IF;
     CONTINUE;
   END IF;
   IF (SELECT status FROM public.questions WHERE id=rec.id)<>'review'::public.content_status
      OR EXISTS(SELECT 1 FROM public.question_editorial_checks WHERE question_id=rec.id)
   THEN RAISE EXCEPTION 'TASK203 Y2 review-only requirement failed: %',rec.id; END IF;
   IF v_a=8 AND v_b=0 THEN
     UPDATE public.question_options
     SET side='b',order_idx=order_idx-4
     WHERE question_id=rec.id AND side='a' AND order_idx BETWEEN 5 AND 8;
   ELSIF v_a<>4 OR v_b<>4 THEN
     RAISE EXCEPTION 'TASK203 unexpected Y2 option contract for %',rec.id;
   END IF;
   SELECT count(*) FILTER(WHERE side='a'),count(*) FILTER(WHERE side='b')
   INTO v_a,v_b FROM public.question_options WHERE question_id=rec.id;
   IF v_a<>4 OR v_b<>4 THEN RAISE EXCEPTION 'TASK203 Y2 repair failed: %',rec.id; END IF;
 END LOOP;
END $y2$;
COMMIT;
