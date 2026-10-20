-- TASK-291: the two legacy 8-left Y2 questions have native 4x4 review-only replacements.
-- Historical original questions and learner results must remain untouched until safe editorial cutover.
DO $$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM public.questions WHERE
 source_reference LIKE 'TASK291:Y2:NATIVE-REVISION-OF:%' AND status='review';
 IF n<>2 THEN RAISE EXCEPTION 'TASK291 expected 2 review versions of malformed live Y2 questions, got %',n; END IF;
 SELECT count(*) INTO n FROM public.questions WHERE source_reference IN
 ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019')
 AND status='published';
 IF n<>2 THEN RAISE EXCEPTION 'TASK291 legacy question history was modified'; END IF;

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
 IF n<>2 THEN RAISE EXCEPTION 'TASK291 native matching right/left/keys inconsistent, passing %',n; END IF;
END $$;
