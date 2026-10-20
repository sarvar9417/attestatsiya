-- TASK-306: seven M13 4×5 candidate Y2 with private 4-pair answer mappings.
-- Protect previously published originals, source lesson links, and answer
-- semantics. Source keys never leave the database.
DO $task306_contract$
DECLARE
 v_count int;
 v_bad int;
BEGIN
 SELECT count(*) INTO v_count FROM public.questions
 WHERE source_reference~'^m13-qc-v2:Y2:AXRN-0[1-7]-Y2-01$'
   AND status='review'::public.content_status;
 IF v_count<>7 THEN RAISE EXCEPTION 'TASK-306 seven review Y2 expected %',v_count; END IF;
 SELECT count(*) INTO v_count FROM public.questions
 WHERE source_reference~'^m13-axr-native-v1:Y2:AXRN-0[1-7]-Y2-01$'
   AND status='published'::public.content_status;
 IF v_count<>7 THEN RAISE EXCEPTION 'TASK-306 seven immutable published Y2 originals expected %',v_count; END IF;

 SELECT count(*) INTO v_bad FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 LEFT JOIN public.lessons l ON l.id=q.source_lesson_id
 LEFT JOIN public.lesson_constructs lc ON lc.lesson_id=l.id AND lc.construct_id=q.construct_id
 WHERE q.source_reference~'^m13-qc-v2:Y2:AXRN-0[1-7]-Y2-01$'
   AND (
      q.status<>'review'::public.content_status
      OR q.group_code<>'S7.SEC'
      OR q.format<>'Y2'::public.question_format
      OR l.slug !~ '^m13-axr-0[1-7]$'
      OR l.status<>'published'::public.content_status
      OR lc.lesson_id IS NULL
      OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
      OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')<>5
      OR jsonb_typeof(k.payload->'pairs')<>'object'
      OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>4
      OR EXISTS(
        SELECT 1 FROM jsonb_each_text(k.payload->'pairs') pair
        WHERE NOT EXISTS(SELECT 1 FROM public.question_options o
          WHERE o.question_id=q.id AND o.side='a' AND o.id::text=pair.key)
        OR NOT EXISTS(SELECT 1 FROM public.question_options o
          WHERE o.question_id=q.id AND o.side='b' AND o.id::text=pair.value)
      )
   );
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-306 bad new 4x5 Y2 shapes %',v_bad; END IF;

 SELECT count(*) INTO v_bad FROM public.questions q
 JOIN public.questions old ON old.source_reference=(
    'm13-axr-native-v1:Y2:' || split_part(q.source_reference,':',3)
 )
 JOIN public.question_keys nk ON nk.question_id=q.id
 JOIN public.question_keys ok ON ok.question_id=old.id
 WHERE q.source_reference~'^m13-qc-v2:Y2:AXRN-0[1-7]-Y2-01$'
 AND (old.status<>'published'::public.content_status
 OR old.stem_md IS DISTINCT FROM q.stem_md
 OR old.construct_id IS DISTINCT FROM q.construct_id
 OR old.source_lesson_id IS DISTINCT FROM q.source_lesson_id
 OR
 (SELECT count(*) FROM jsonb_each_text(ok.payload->'pairs') op
   JOIN public.question_options ola ON ola.id::text=op.key AND ola.question_id=old.id
   JOIN public.question_options ora ON ora.id::text=op.value AND ora.question_id=old.id
   WHERE EXISTS (
     SELECT 1 FROM jsonb_each_text(nk.payload->'pairs') np
     JOIN public.question_options nla ON nla.id::text=np.key AND nla.question_id=q.id AND nla.side='a'
     JOIN public.question_options nra ON nra.id::text=np.value AND nra.question_id=q.id AND nra.side='b'
     WHERE nla.content_md=ola.content_md AND nra.content_md=ora.content_md
   ))<>4);
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-306 altered original answer pair meaning'; END IF;
END
$task306_contract$;
