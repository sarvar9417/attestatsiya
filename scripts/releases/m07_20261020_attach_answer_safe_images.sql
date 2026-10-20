-- Release after frontend deployment is READY: attach 11 code-only diagrams.
-- Never insert a drawing of the ANSWER. The stem was sanitized by migration 20261020151000.
DO $m07_assets$
DECLARE found_count integer; leak_count integer; n integer;
BEGIN
 WITH wanted(code,diagram) AS (VALUES
  ('SL2-05-014','m07_sl2_05_014'),
  ('SL2-05-018','m07_sl2_05_018'),
  ('SL2-05-020','m07_sl2_05_020'),
  ('SL2-05-023','m07_sl2_05_023'),
  ('SL2-05-028','m07_sl2_05_028'),
  ('SL2-06-015','m07_sl2_06_015'),
  ('SL2-06-020','m07_sl2_06_020'),
  ('SL2-06-022','m07_sl2_06_022'),
  ('SL2-06-025','m07_sl2_06_025'),
  ('SL2-06-026','m07_sl2_06_026'),
  ('SL2-06-027','m07_sl2_06_027')
 )
 SELECT count(*) INTO found_count FROM public.questions q JOIN wanted w
 ON q.source_reference LIKE ('Scratch-LOGO-2026-v2:'||w.code||';%')
 WHERE q.status='published'::content_status;
 IF found_count<>11 THEN RAISE EXCEPTION 'Expected 11 published question IDs, got %',found_count; END IF;
 WITH wanted(code,diagram) AS (VALUES
  ('SL2-05-014','m07_sl2_05_014'),
  ('SL2-05-018','m07_sl2_05_018'),
  ('SL2-05-020','m07_sl2_05_020'),
  ('SL2-05-023','m07_sl2_05_023'),
  ('SL2-05-028','m07_sl2_05_028'),
  ('SL2-06-015','m07_sl2_06_015'),
  ('SL2-06-020','m07_sl2_06_020'),
  ('SL2-06-022','m07_sl2_06_022'),
  ('SL2-06-025','m07_sl2_06_025'),
  ('SL2-06-026','m07_sl2_06_026'),
  ('SL2-06-027','m07_sl2_06_027')
 )
 SELECT count(*) INTO leak_count FROM public.questions q JOIN wanted w
 ON q.source_reference LIKE ('Scratch-LOGO-2026-v2:'||w.code||';%')
 WHERE q.stem_md LIKE '%**Shakl tasviri:**%';
 IF leak_count<>0 THEN RAISE EXCEPTION 'Answer-leaking stems remain: %',leak_count; END IF;
 WITH wanted(code,diagram) AS (VALUES
  ('SL2-05-014','m07_sl2_05_014'),
  ('SL2-05-018','m07_sl2_05_018'),
  ('SL2-05-020','m07_sl2_05_020'),
  ('SL2-05-023','m07_sl2_05_023'),
  ('SL2-05-028','m07_sl2_05_028'),
  ('SL2-06-015','m07_sl2_06_015'),
  ('SL2-06-020','m07_sl2_06_020'),
  ('SL2-06-022','m07_sl2_06_022'),
  ('SL2-06-025','m07_sl2_06_025'),
  ('SL2-06-026','m07_sl2_06_026'),
  ('SL2-06-027','m07_sl2_06_027')
 )
 UPDATE public.questions q
 SET assets=coalesce(q.assets,'[]'::jsonb) || jsonb_build_array(
   jsonb_build_object('kind','image','diagram_id',w.diagram,
    'src','/m07-source-blocks/'||w.diagram||'.svg',
    'alt','Dastur buyruqlari — natija va to‘g‘ri javob ko‘rsatilmagan')
 ),updated_at=now()
 FROM wanted w
 WHERE q.source_reference LIKE ('Scratch-LOGO-2026-v2:'||w.code||';%')
   AND q.status='published'::content_status
   AND NOT(coalesce(q.assets,'[]'::jsonb) @> jsonb_build_array(
    jsonb_build_object('kind','image','diagram_id',w.diagram)));
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n NOT IN (0,11) THEN RAISE EXCEPTION 'Partial source SVG attachment: %',n; END IF;
 RAISE NOTICE 'M07 source-only code SVGs attached: %',n;
END $m07_assets$;
