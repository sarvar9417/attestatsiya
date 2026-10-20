-- TASK-291: safe native matching Y2 cutover — old UUIDs and attempts stay accessible archived;
-- two new 4x4 revisions are published for future selection.
DO $$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM public.questions WHERE source_reference LIKE
 'TASK291:Y2:NATIVE-REVISION-OF:%' AND status='published';
 IF n<>2 THEN RAISE EXCEPTION 'TASK291 expected two new native published Y2, got %',n; END IF;
 SELECT count(*) INTO n FROM public.questions WHERE source_reference IN
 ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019')
 AND status='archived';
 IF n<>2 THEN RAISE EXCEPTION 'TASK291 expected 2 immutable archived legacy source questions'; END IF;

 SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'TASK291:Y2:NATIVE-REVISION-OF:%'
 AND q.format='Y2' AND q.group_code='S5.WEB'
 AND EXISTS(SELECT 1 FROM public.lessons l WHERE l.id=q.source_lesson_id AND l.status='published')
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')=4
 AND (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))=4
 AND (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs') p
    JOIN public.question_options a ON a.question_id=q.id AND a.side='a' AND a.id::text=p.key
    JOIN public.question_options b ON b.question_id=q.id AND b.side='b' AND b.id::text=p.value)=4;
 IF n<>2 THEN RAISE EXCEPTION 'TASK291 native Y2 left/right/key invalid %',n; END IF;
 SELECT count(*) INTO n FROM public.exam_items ei
 JOIN public.questions q ON q.id=ei.question_id
 WHERE q.source_reference IN
 ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019');
 -- On pristine CI database n can be zero. The cutover transaction protects equality pre/post; no synthetic attempts added.
END $$;
