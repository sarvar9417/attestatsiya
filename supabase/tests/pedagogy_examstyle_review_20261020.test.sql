-- 2026-10-20 attestation-style pedagogy REVIEW regressions.
-- Questions stage as review; owner-authorized production promotion may publish them. Test structural invariants in both states.
BEGIN;
DO $qa$
DECLARE n integer;
BEGIN
 SELECT COUNT(*) INTO n FROM public.questions WHERE source_reference LIKE 'authored:pedagogy-examstyle:20261020%';
 IF n<>19 THEN RAISE EXCEPTION 'Expected 19 calibrated review questions, got %',n; END IF;
 SELECT count(distinct c.code) INTO n
 FROM public.questions q JOIN public.constructs c ON c.id=q.construct_id
 WHERE q.source_reference LIKE 'authored:pedagogy-examstyle:20261020%';
 IF n<>18 THEN RAISE EXCEPTION 'Expected all 18 canonical pedagogy constructs, got %',n;END IF;
 IF EXISTS(
 SELECT 1 FROM public.questions q
 JOIN public.constructs c ON c.id=q.construct_id
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 LEFT JOIN public.lessons l ON l.id=q.source_lesson_id
 WHERE q.source_reference LIKE 'authored:pedagogy-examstyle:20261020%'
 AND (q.status NOT IN ('review'::public.content_status,'published'::public.content_status) OR q.author_id IS NOT NULL
 OR c.group_code<>q.group_code OR l.status<>'published'::public.content_status OR k.question_id IS NULL
 OR NOT EXISTS(SELECT 1 FROM public.lesson_constructs lc WHERE lc.lesson_id=l.id AND lc.construct_id=c.id)
 OR length(q.stem_md)<160 OR length(k.explanation_md)<50)
 ) THEN RAISE EXCEPTION 'Invalid status/provenance/objective/stem/explanation';END IF;
 IF (SELECT COUNT(*) FROM public.questions WHERE source_reference LIKE 'authored:pedagogy-examstyle:20261020%' AND format='Y1')<>13
 OR (SELECT COUNT(*) FROM public.questions WHERE source_reference LIKE 'authored:pedagogy-examstyle:20261020%' AND format='Y2')<>3
 OR (SELECT COUNT(*) FROM public.questions WHERE source_reference LIKE 'authored:pedagogy-examstyle:20261020%' AND format='Y3')<>3
 THEN RAISE EXCEPTION 'Y1/Y2/Y3 count contract failed'; END IF;
 IF EXISTS(
 SELECT 1 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'authored:pedagogy-examstyle:20261020%' AND q.format='Y1'
 AND (
  (SELECT COUNT(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
  OR (SELECT COUNT(DISTINCT lower(trim(o.content_md))) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
  OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.id::text=k.payload->>'correct_option_id' AND o.question_id=q.id)
  OR (
    SELECT max(array_length(regexp_split_to_array(trim(o.content_md),'[[:space:]]+'),1))
    FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id'
  )>(
    SELECT max(array_length(regexp_split_to_array(trim(o.content_md),'[[:space:]]+'),1))
    FROM public.question_options o WHERE o.question_id=q.id AND o.id::text<>k.payload->>'correct_option_id'
  )
 )
 ) THEN RAISE EXCEPTION 'Y1 option, key or length cue failure';END IF;
 IF EXISTS(
 SELECT 1 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'authored:pedagogy-examstyle:20261020%' AND q.format='Y2'
 AND (
  (SELECT COUNT(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4 OR
  (SELECT COUNT(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')<>4 OR
  (SELECT COUNT(*) FROM jsonb_each_text(k.payload->'pairs'))<>4 OR
  (SELECT COUNT(DISTINCT val) FROM jsonb_each_text(k.payload->'pairs') kv(ky,val))<>4 OR
  EXISTS(SELECT 1 FROM jsonb_each_text(k.payload->'pairs') kv(ky,val)
  WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.side='a' AND o.id::text=kv.ky)
  OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.side='b' AND o.id::text=kv.val))
 )
 ) THEN RAISE EXCEPTION 'Y2 pairing keys are not one-to-one valid IDs';END IF;
 IF EXISTS(
 SELECT 1 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'authored:pedagogy-examstyle:20261020%' AND q.format='Y3'
 AND (
  (SELECT COUNT(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4 OR
  jsonb_array_length(k.payload->'order')<>4 OR
  (SELECT COUNT(DISTINCT x.v) FROM jsonb_array_elements_text(k.payload->'order') x(v))<>4 OR
  EXISTS(SELECT 1 FROM jsonb_array_elements_text(k.payload->'order') x(v)
   WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=x.v))
 )
 ) THEN RAISE EXCEPTION 'Y3 order keys invalid';END IF;
 IF EXISTS(
   SELECT 1 FROM public.questions q WHERE q.source_reference LIKE 'authored:pedagogy-examstyle:20261020%'
     AND EXISTS(SELECT 1 FROM public.questions q2 WHERE q2.id<>q.id AND q2.status='published'
      AND lower(regexp_replace(trim(q2.stem_md),'[[:space:]]+',' ','g'))=lower(regexp_replace(trim(q.stem_md),'[[:space:]]+',' ','g')))
 ) THEN RAISE EXCEPTION 'New review question duplicates a published stem'; END IF;
END $qa$;
ROLLBACK;
