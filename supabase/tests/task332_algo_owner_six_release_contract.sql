-- TASK-332 six owner-authorized graphic questions; no forged independent editorial signatures.
DO $$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM public.questions q
 WHERE q.source_reference in (
 'algoritmlash-v4:ALG-V4-001','algoritmlash-v4:ALG-V4-002',
 'algoritmlash-v4:ALG-V4-003','algoritmlash-v4:ALG-V4-004',
 'algoritmlash-v4:ALG-V4-005','algoritmlash-v4:ALG-V4-006')
 AND q.status='published'
 AND q.assets->0->>'src' LIKE '/algoritmlash-v4/%.svg'
 AND EXISTS (SELECT 1 FROM public.lessons l WHERE l.id=q.source_lesson_id AND l.status='published')
 AND EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id)
 AND EXISTS (SELECT 1 FROM public.question_quality_published_revisions r WHERE r.question_id=q.id)
 AND EXISTS (SELECT 1 FROM public.algoritmlash_style_audit a WHERE a.question_id=q.id
    AND a.source_evidence->>'independent_human_editorial_signoff'='false');
 IF n<>6 THEN RAISE EXCEPTION 'TASK-332 requires 6 published owner-waiver items; found %',n; END IF;
 IF EXISTS (SELECT 1 FROM public.questions q WHERE q.source_reference LIKE 'algoritmlash-v4:%'
 AND q.status='draft') THEN RAISE EXCEPTION 'Unexpected V4 draft'; END IF;
 IF (SELECT count(*) FROM public.questions q WHERE q.group_code='S3.ALGO' AND q.source_reference LIKE 'algoritmlash-v2:%')<>240
 THEN RAISE EXCEPTION 'V2 history changed'; END IF;
END $$;