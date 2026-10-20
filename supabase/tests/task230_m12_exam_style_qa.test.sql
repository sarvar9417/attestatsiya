-- TASK-230: M12 exam-style additions + review-only native Y2 stem QA
BEGIN;
DO $audit$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM public.questions q
 WHERE q.source_reference LIKE 'm12-examstyle-v4-20261020:%'
   AND q.format='Y1'::public.question_format
   AND q.status='review'::public.content_status;
 IF n<>20 THEN RAISE EXCEPTION 'TASK230 expected 20 non-published Y1 items, got %',n; END IF;

 SELECT count(*) INTO n FROM (
   SELECT q.id, count(o.id) AS n, count(DISTINCT o.content_md) AS distinct_options
   FROM public.questions q LEFT JOIN public.question_options o
   ON o.question_id=q.id AND o.side='a'
   WHERE q.source_reference LIKE 'm12-examstyle-v4-20261020:%'
   GROUP BY q.id HAVING count(o.id)<>4 OR count(DISTINCT o.content_md)<>4
 ) invalid;
 IF n<>0 THEN RAISE EXCEPTION 'TASK230 option counts/uniqueness failure %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 LEFT JOIN public.question_options o ON o.id=(k.payload->>'correct_option_id')::uuid
 LEFT JOIN public.lessons l ON l.id=q.source_lesson_id
 LEFT JOIN public.modules m ON m.id=l.module_id
 WHERE q.source_reference LIKE 'm12-examstyle-v4-20261020:%'
 AND (k.question_id IS NULL OR o.question_id IS DISTINCT FROM q.id
     OR m.code IS DISTINCT FROM 'M12' OR
     l.status NOT IN ('draft'::public.content_status,'published'::public.content_status));
 IF n<>0 THEN RAISE EXCEPTION 'TASK230 invalid protected answer keys / M12 mapping %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 WHERE q.source_reference LIKE 'network-v2-20261018:%:original-Y2'
 AND q.format='Y2'::public.question_format
 AND q.status='review'::public.content_status
 AND q.stem_md <> 'Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.';
 IF n<>10 THEN RAISE EXCEPTION 'TASK230 expected 10 unique descriptive Y2 review stems, got %',n; END IF;

 SELECT count(*) INTO n FROM (
    SELECT q.stem_md,count(*) c FROM public.questions q
    WHERE q.source_reference LIKE 'network-v2-20261018:%:original-Y2'
    GROUP BY 1 HAVING count(*)>1
 ) same_stems;
 IF n<>0 THEN RAISE EXCEPTION 'TASK230 duplicate native Y2 stems remain'; END IF;

 SELECT count(*) INTO n FROM public.questions
 WHERE source_reference LIKE 'network-v2-20261018:%'
    OR source_reference LIKE 'network-v3-extra-20261018:%';
 IF n<>380 THEN RAISE EXCEPTION 'TASK230 original 380 records missing: %',n; END IF;
END $audit$;
ROLLBACK;
