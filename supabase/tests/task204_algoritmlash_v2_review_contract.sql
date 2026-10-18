-- TASK-204 full V2 validation. Execute after every TASK-204 migration, including assets and RFC-rekey.
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
 ((q.status='draft' AND (
   jsonb_array_length(q.assets)<>1
   OR q.assets->0->>'kind'<>'image'
   OR q.assets->0->>'src' NOT LIKE '/algoritmlash-v2/%.svg'
 )) OR q.status='published');
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
 SELECT count(*) INTO c FROM (
   SELECT l.id::text id FROM public.lessons l WHERE l.slug LIKE 'algoritmlash-v2-%'
   UNION ALL SELECT q.id::text FROM public.questions q WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%'
   UNION ALL SELECT o.id::text FROM public.question_options o
      JOIN public.questions q ON q.id=o.question_id
      WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%'
 ) r WHERE id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}
 IF c<>1 THEN RAISE EXCEPTION '14 worked examples appendix missing'; END IF;
END $$;
;
 IF c<>0 THEN RAISE EXCEPTION 'Non-RFC UUIDs %',c; END IF;
 SELECT count(*) INTO c FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%' AND q.format='Y2'
 AND ((SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>3
      OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs') p
         JOIN public.question_options oa ON oa.question_id=q.id AND oa.id::text=p.key AND oa.side='a'
         JOIN public.question_options ob ON ob.question_id=q.id AND ob.id::text=p.value AND ob.side='b')<>3);
 IF c<>0 THEN RAISE EXCEPTION 'Y2 invalid pairs %',c; END IF;
 SELECT count(*) INTO c FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%' AND q.format='Y3'
 AND (jsonb_array_length(k.payload->'order') NOT BETWEEN 3 AND 5
      OR (SELECT count(DISTINCT o.id) FROM jsonb_array_elements_text(k.payload->'order') x
          JOIN public.question_options o ON o.question_id=q.id AND o.id::text=x.value AND o.side='a')
         <>jsonb_array_length(k.payload->'order'));
 IF c<>0 THEN RAISE EXCEPTION 'Y3 invalid ordered list %',c; END IF;
 SELECT count(*) INTO c FROM public.lessons WHERE slug='algoritmlash-v2-ilova-a' AND body_mdx LIKE '%A14.%';
 IF c<>1 THEN RAISE EXCEPTION '14 worked examples appendix missing'; END IF;
END $$;
