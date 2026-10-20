DO $$
DECLARE cnt int;
BEGIN
 SELECT count(*) INTO cnt FROM public.questions WHERE source_reference LIKE 'MSACCESS-V2/DB-03-019 | %';
 IF cnt=0 THEN
   RAISE NOTICE 'TASK-209: private review fixtures missing in clean CI environment; skipping fixture assertions'; RETURN;
 END IF;
 IF (SELECT COUNT(*) FROM public.questions WHERE status='review'
    AND (source_reference LIKE 'MSACCESS-V2/%' OR source_reference LIKE 'MSACCESS-V2-NATIVE/%'
         OR source_reference LIKE 'MSACCESS-DEMO-STYLE-2026/%')) <>296
 THEN RAISE EXCEPTION 'TASK-209: unexpected review bank count'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.questions WHERE source_reference LIKE 'MSACCESS-V2/DB-06-019 | %'
      AND stem_md LIKE '%**Kitoblar jadvali (chap)**%'
      AND stem_md LIKE '%**Berishlar jadvali (o‘ng)**%')
 THEN RAISE EXCEPTION 'TASK-209: relational visualization fix missing'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.questions WHERE source_reference LIKE 'MSACCESS-V2/DB-04-030 | %'
      AND stem_md LIKE '%| 4 | 7A |%')
 THEN RAISE EXCEPTION 'TASK-209: normalized four-row illustration missing'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.question_options o JOIN public.questions q ON q.id=o.question_id
      WHERE q.source_reference LIKE 'MSACCESS-V2-NATIVE/DBN-Y2-043 | %'
      AND o.side='b' AND o.content_md LIKE '%90.5%')
 THEN RAISE EXCEPTION 'TASK-209: numeric interval correction missing'; END IF;
 IF (SELECT count(*) FROM public.questions q
     WHERE q.source_reference LIKE 'MSACCESS-V2/%' AND q.status='review'
       AND q.assets::text LIKE '%source_visual_review_required%')<20
 THEN RAISE EXCEPTION 'TASK-209: source visual review flags unexpectedly dropped'; END IF;
END $$;