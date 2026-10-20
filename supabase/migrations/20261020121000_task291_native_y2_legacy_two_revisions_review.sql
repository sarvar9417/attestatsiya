-- TASK-291: two published S5.WEB matching questions use 8 side='a' options, no side='b'.
-- Repair by ADDITIVE review revisions; no changes to published source items, their keys or exam history.
-- Input legacy sources: formatbank-2026:T063-Y2-018 (HTML), T063-Y2-019 (CSS).
BEGIN;
DO $$
DECLARE oldq record; newqid uuid; opt_count integer; good_pairs integer; links integer;
BEGIN
 FOR oldq IN
 SELECT q.*,k.payload,k.explanation_md
 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference IN ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019')
 ORDER BY q.source_reference
 LOOP
  IF oldq.status<>'published'::public.content_status OR oldq.format<>'Y2'::public.question_format
    OR oldq.source_lesson_id IS NULL
    OR NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.id=oldq.source_lesson_id AND l.status='published')
  THEN RAISE EXCEPTION 'TASK291: unexpected legacy Y2 source state %',oldq.source_reference; END IF;

  SELECT count(*) INTO opt_count FROM public.question_options o
  WHERE o.question_id=oldq.id AND o.side='a' AND o.order_idx BETWEEN 1 AND 8;
  SELECT count(*) INTO good_pairs FROM jsonb_each_text(oldq.payload->'pairs') p
    JOIN public.question_options a ON a.id::text=p.key AND a.question_id=oldq.id AND a.order_idx BETWEEN 1 AND 4
    JOIN public.question_options b ON b.id::text=p.value AND b.question_id=oldq.id AND b.order_idx BETWEEN 5 AND 8;
  IF opt_count<>8 OR good_pairs<>4 OR
    EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=oldq.id AND o.side='b')
  THEN RAISE EXCEPTION 'TASK291: obsolete original matching layout unexpected %',oldq.source_reference; END IF;

  newqid:=md5('TASK291:Y2-PUBLISHED-REVISION:'||oldq.source_reference)::uuid;
  INSERT INTO public.questions (id,subject_id,construct_id,group_code,format,cognitive,
      difficulty,stem_md,assets,is_generated,status,source_reference,source_lesson_id)
  VALUES (newqid,oldq.subject_id,oldq.construct_id,oldq.group_code,oldq.format,
      oldq.cognitive,oldq.difficulty,oldq.stem_md,oldq.assets,oldq.is_generated,
      'review','TASK291:Y2:NATIVE-REVISION-OF:'||oldq.source_reference,
      oldq.source_lesson_id)
  ON CONFLICT(id) DO NOTHING;

  INSERT INTO public.question_options (id,question_id,side,order_idx,content_md)
  SELECT md5('TASK291:Y2-OPTION:'||o.id::text)::uuid,newqid,
    CASE WHEN o.order_idx<=4 THEN 'a' ELSE 'b' END,
    (o.order_idx-1)%4,o.content_md
  FROM public.question_options o WHERE o.question_id=oldq.id
  ON CONFLICT(id) DO NOTHING;

  INSERT INTO public.question_keys(question_id,payload,explanation_md)
  VALUES (newqid,
    jsonb_build_object('pairs',(SELECT jsonb_object_agg(
       md5('TASK291:Y2-OPTION:'||p.key)::uuid::text,
       md5('TASK291:Y2-OPTION:'||p.value)::uuid::text)
       FROM jsonb_each_text(oldq.payload->'pairs') p)),
    oldq.explanation_md)
  ON CONFLICT(question_id) DO NOTHING;

  SELECT count(*) INTO links FROM public.question_options o WHERE o.question_id=newqid AND o.side='b';
  IF links<>4 THEN RAISE EXCEPTION 'TASK291: new native Y2 right-side missing %',oldq.source_reference; END IF;
 END LOOP;
 IF (SELECT count(*) FROM public.questions WHERE source_reference LIKE 'TASK291:Y2:NATIVE-REVISION-OF:%'
 AND status='review')<>2 THEN RAISE EXCEPTION 'TASK291: expected exactly two new Y2 review revisions'; END IF;
END $$;
COMMIT;
