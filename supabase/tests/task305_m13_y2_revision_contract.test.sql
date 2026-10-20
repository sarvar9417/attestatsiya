-- TASK-305: regression for version-safe repair of legacy published M13 Y2.
BEGIN;
DO $test_task305$
DECLARE v_old public.questions%ROWTYPE; v_new public.questions%ROWTYPE; v_count int;
BEGIN
 SELECT * INTO STRICT v_old FROM public.questions
   WHERE source_reference='formatbank-2026:T063-Y2-022';
 SELECT * INTO STRICT v_new FROM public.questions
   WHERE source_reference='m13-qa-fix:v2:T063-Y2-022';
 IF v_old.status<>'archived'::public.content_status
    OR v_new.status<>'published'::public.content_status
    OR v_old.id=v_new.id THEN
  RAISE EXCEPTION 'TASK-305 original must be archived and v2 published';
 END IF;
 IF v_old.source_lesson_id IS DISTINCT FROM v_new.source_lesson_id
    OR v_old.construct_id IS DISTINCT FROM v_new.construct_id
    OR v_old.stem_md IS DISTINCT FROM v_new.stem_md
    OR (SELECT count(*) FROM public.question_options WHERE question_id=v_new.id AND side='a')<>4
    OR (SELECT count(*) FROM public.question_options WHERE question_id=v_new.id AND side='b')<>4
    OR (SELECT count(*) FROM public.question_keys WHERE question_id=v_new.id)<>1 THEN
  RAISE EXCEPTION 'TASK-305 immutable content or Y2 option contract drift';
 END IF;
 IF (SELECT array_agg(content_md ORDER BY order_idx) FROM public.question_options WHERE question_id=v_old.id)
    IS DISTINCT FROM
    (SELECT array_agg(content_md ORDER BY order_idx) FROM public.question_options WHERE question_id=v_new.id) THEN
  RAISE EXCEPTION 'TASK-305 new revision changed original question option wording';
 END IF;
 SELECT count(*) INTO v_count
 FROM public.question_keys ok, jsonb_each_text(ok.payload->'pairs') pk
 WHERE ok.question_id=v_old.id
 AND EXISTS(
   SELECT 1 FROM public.question_keys nk,jsonb_each_text(nk.payload->'pairs') np
   JOIN public.question_options nl ON nl.id::text=np.key
   JOIN public.question_options nr ON nr.id::text=np.value
   JOIN public.question_options ol ON ol.id::text=pk.key
   JOIN public.question_options orr ON orr.id::text=pk.value
   WHERE nk.question_id=v_new.id
      AND nl.question_id=v_new.id AND nl.side='a'
      AND nr.question_id=v_new.id AND nr.side='b'
      AND nl.content_md=ol.content_md AND nr.content_md=orr.content_md
 );
 IF v_count<>4 THEN RAISE EXCEPTION 'TASK-305 original matching key was altered'; END IF;
 SELECT count(*) INTO v_count FROM public.questions q WHERE q.group_code='S7.SEC'
   AND q.format='Y2'::public.question_format AND q.status='published'::public.content_status
   AND ((SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
        OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')<4);
 IF v_count<>0 THEN RAISE EXCEPTION 'TASK-305 published M13 contains % broken Y2',v_count; END IF;
END
$test_task305$;
ROLLBACK;
