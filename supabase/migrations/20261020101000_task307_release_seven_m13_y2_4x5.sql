-- TASK-307: owner-authorized M13 QA: release exactly seven 4x5 Y2 revisions.
-- Historic attempted question snapshots, option wording and protected answers
-- remain immutable. New Y2 revisions were imported and structurally verified
-- in TASK-306. Never disclose question_keys to Git or learner start payloads.
BEGIN;
DO $task307$
DECLARE
 v_idx int;
 v_ref text;
 v_old public.questions%ROWTYPE;
 v_new public.questions%ROWTYPE;
 v_bad int;
 v_count int;
BEGIN
 FOR v_idx IN 1..7 LOOP
    v_ref:='AXRN-'||lpad(v_idx::text,2,'0')||'-Y2-01';
    SELECT * INTO STRICT v_old FROM public.questions
      WHERE source_reference='m13-axr-native-v1:Y2:'||v_ref;
    SELECT * INTO STRICT v_new FROM public.questions
      WHERE source_reference='m13-qc-v2:Y2:'||v_ref;
    IF v_old.status NOT IN ('published'::public.content_status,'archived'::public.content_status)
       OR v_new.status NOT IN ('review'::public.content_status,'published'::public.content_status)
       OR v_old.format<>'Y2'::public.question_format
       OR v_new.format<>'Y2'::public.question_format
       OR v_old.group_code<>'S7.SEC' OR v_new.group_code<>'S7.SEC'
       OR v_old.source_lesson_id IS DISTINCT FROM v_new.source_lesson_id
       OR v_old.construct_id IS DISTINCT FROM v_new.construct_id
       OR v_old.stem_md IS DISTINCT FROM v_new.stem_md
    THEN RAISE EXCEPTION 'TASK-307 versioned Y2 metadata/status drift for %',v_ref; END IF;
    IF (SELECT count(*) FROM public.question_options o
        WHERE o.question_id=v_new.id AND o.side='a')<>4
      OR (SELECT count(*) FROM public.question_options o
        WHERE o.question_id=v_new.id AND o.side='b')<>5
      OR (SELECT count(*) FROM public.question_options o
        WHERE o.question_id=v_old.id AND o.side='a')<>4
      OR (SELECT count(*) FROM public.question_options o
        WHERE o.question_id=v_old.id AND o.side='b')<>4
    THEN RAISE EXCEPTION 'TASK-307 Y2 option side mismatch %',v_ref; END IF;
    SELECT count(*) INTO v_bad FROM public.question_keys ok,
       jsonb_each_text(ok.payload->'pairs') op
    WHERE ok.question_id=v_old.id
     AND NOT EXISTS (
      SELECT 1 FROM public.question_keys nk,
           jsonb_each_text(nk.payload->'pairs') np
      JOIN public.question_options nleft ON nleft.id::text=np.key
      JOIN public.question_options nright ON nright.id::text=np.value
      JOIN public.question_options oleft ON oleft.id::text=op.key
      JOIN public.question_options oright ON oright.id::text=op.value
      WHERE nk.question_id=v_new.id
        AND nleft.question_id=v_new.id AND nleft.side='a'
        AND nright.question_id=v_new.id AND nright.side='b'
        AND oleft.question_id=v_old.id AND oleft.side='a'
        AND oright.question_id=v_old.id AND oright.side='b'
        AND nleft.content_md=oleft.content_md
        AND nright.content_md=oright.content_md
     );
    IF v_bad<>0 OR (SELECT count(*) FROM public.question_keys k
       WHERE k.question_id=v_old.id)<>1
       OR (SELECT count(*) FROM public.question_keys k
       WHERE k.question_id=v_new.id)<>1
    THEN RAISE EXCEPTION 'TASK-307 altered private answer pair meaning %',v_ref; END IF;

    UPDATE public.questions SET status='published'::public.content_status
      WHERE id=v_new.id AND status='review'::public.content_status;
    UPDATE public.questions SET status='archived'::public.content_status
      WHERE id=v_old.id AND status='published'::public.content_status;
    IF (SELECT count(*) FROM public.questions q WHERE q.id IN (v_old.id,v_new.id)
       AND q.status='published'::public.content_status)<>1
    THEN RAISE EXCEPTION 'TASK-307 one active revision expected %',v_ref; END IF;
 END LOOP;

 SELECT count(*) INTO v_count FROM public.questions
    WHERE source_reference LIKE 'm13-qc-v2:Y2:AXRN-%'
      AND status='published'::public.content_status;
 IF v_count<>7 THEN RAISE EXCEPTION 'TASK-307 published seven revised Y2 expected %',v_count; END IF;
 SELECT count(*) INTO v_count FROM public.questions
    WHERE source_reference LIKE 'm13-axr-native-v1:Y2:AXRN-%'
      AND status='archived'::public.content_status;
 IF v_count<>7 THEN RAISE EXCEPTION 'TASK-307 expected seven archived old Y2 %',v_count; END IF;
 SELECT count(*) INTO v_count FROM public.questions
    WHERE group_code='S7.SEC' AND format='Y2'::public.question_format
      AND status='published'::public.content_status;
 IF v_count<>71 THEN RAISE EXCEPTION 'TASK-307 expected 71 published Y2, got %',v_count; END IF;
END
$task307$;
COMMIT;
