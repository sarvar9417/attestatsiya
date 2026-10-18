-- TASK-204 import validation. Run in a read-only/test transaction after all three migrations.
DO $$
DECLARE c int;
BEGIN
 SELECT count(*) INTO c FROM public.lessons WHERE slug LIKE 'algoritmlash-v2-%' AND status='review';
 IF c<>11 THEN RAISE EXCEPTION 'Expected 11 V2 review lessons, got %',c; END IF;
 SELECT count(*) INTO c FROM public.questions WHERE source_reference LIKE 'algoritmlash-v2:ALG-%';
 IF c<>240 THEN RAISE EXCEPTION 'Expected 240 V2 questions, got %',c; END IF;
 SELECT count(*) INTO c FROM public.questions q
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%' AND k.question_id IS NULL;
 IF c<>0 THEN RAISE EXCEPTION 'Missing keys %',c; END IF;
 SELECT count(*) INTO c FROM public.questions q
 WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%'
 AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.id=q.source_lesson_id AND l.status='review');
 IF c<>0 THEN RAISE EXCEPTION 'Invalid lesson links %',c; END IF;
 SELECT count(*) INTO c FROM public.questions q
 WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%' AND
 ((q.status='draft' AND q.stem_md NOT ILIKE '%Chizma talab qilinadi%') OR q.status='published');
 IF c<>0 THEN RAISE EXCEPTION 'Unsafe graph/published statuses %',c; END IF;
 SELECT count(*) INTO c FROM public.questions q
 WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%'
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id) <>
 CASE q.format WHEN 'Y1' THEN 4 WHEN 'Y2' THEN 6 ELSE (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') END;
 IF c<>0 THEN RAISE EXCEPTION 'Option cardinality mismatches %',c; END IF;
 SELECT count(*) INTO c FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%' AND q.format='Y1'
 AND NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id');
 IF c<>0 THEN RAISE EXCEPTION 'Y1 key mismatch %',c; END IF;
 SELECT count(*) INTO c FROM public.lessons WHERE slug='algoritmlash-v2-ilova-a' AND body_mdx LIKE '%A14.%';
 IF c<>1 THEN RAISE EXCEPTION '14 worked examples appendix missing'; END IF;
END $$;
