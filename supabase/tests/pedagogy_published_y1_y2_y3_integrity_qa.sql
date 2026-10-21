-- Read-only production integrity regression for all published pedagogika Y1/Y2/Y3.
-- Distinct option content, referential integrity of answer keys, source-name leakage.
BEGIN;
DO $audit$
DECLARE n_y1 integer; n_y2 integer; n_y3 integer; invalid_n integer; source_leaks integer;
BEGIN
 WITH y1 AS (
 SELECT q.id, count(o.id) AS n,
 count(DISTINCT lower(btrim(o.content_md))) AS distinct_n,
 count(o.id) FILTER(WHERE o.id::text=(k.payload->>'correct_option_id')) AS keyed
 FROM public.questions q
 LEFT JOIN public.question_options o ON o.question_id=q.id
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published'::public.content_status
 AND q.group_code IN ('KS','PM.GEN','PM.MET') AND q.format='Y1'::public.question_format
 GROUP BY q.id)
 SELECT count(*),count(*) FILTER(WHERE n<>4 OR distinct_n<>4 OR keyed<>1) INTO n_y1,invalid_n FROM y1;
 IF invalid_n>0 THEN RAISE EXCEPTION 'Y1 question integrity problems: %',invalid_n; END IF;

 WITH y2 AS (
 SELECT q.id,
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') na,
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b') nb,
 (SELECT count(DISTINCT lower(trim(o.content_md))) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') da,
 (SELECT count(DISTINCT lower(trim(o.content_md))) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b') db,
 (SELECT count(*) FROM jsonb_each_text(coalesce(k.payload->'pairs','{}'::jsonb))) keys,
 (SELECT count(*) FROM jsonb_each_text(coalesce(k.payload->'pairs','{}'::jsonb)) x
 WHERE EXISTS(SELECT 1 FROM public.question_options o WHERE o.id::text=x.key AND o.question_id=q.id AND o.side='a')
 AND EXISTS(SELECT 1 FROM public.question_options o WHERE o.id::text=x.value AND o.question_id=q.id AND o.side='b')) valid_pairs
 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published'::public.content_status AND q.group_code IN ('KS','PM.GEN','PM.MET') AND q.format='Y2'::public.question_format)
 SELECT count(*),count(*) FILTER(WHERE na<>4 OR nb<>4 OR da<>4 OR db<>4 OR keys<>4 OR valid_pairs<>4)
 INTO n_y2,invalid_n FROM y2;
 IF invalid_n>0 THEN RAISE EXCEPTION 'Y2 question integrity problems: %',invalid_n; END IF;

 WITH y3 AS (
 SELECT q.id,(SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id) n,
 (SELECT count(DISTINCT lower(trim(o.content_md))) FROM public.question_options o WHERE o.question_id=q.id) unique_n,
 (SELECT count(*) FROM jsonb_array_elements_text(coalesce(k.payload->'order','[]'::jsonb))) n_order,
 (SELECT count(*) FROM jsonb_array_elements_text(coalesce(k.payload->'order','[]'::jsonb)) x
 WHERE EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=x.value)) valid,
 (SELECT count(DISTINCT x.value) FROM jsonb_array_elements_text(coalesce(k.payload->'order','[]'::jsonb)) x) unique_order
 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published'::public.content_status AND q.group_code IN ('KS','PM.GEN','PM.MET') AND q.format='Y3'::public.question_format)
 SELECT count(*),count(*) FILTER(WHERE n<>4 OR unique_n<>4 OR n_order<>4 OR unique_order<>4 OR valid<>4)
 INTO n_y3,invalid_n FROM y3;
 IF invalid_n>0 THEN RAISE EXCEPTION 'Y3 question integrity problems: %',invalid_n; END IF;

 SELECT count(*) INTO source_leaks FROM public.questions q
 WHERE q.status='published'::public.content_status AND q.group_code IN ('KS','PM.GEN','PM.MET')
 AND q.stem_md ~* '(^[[:space:]]*#|manbadagi|(^|[[:space:]])manbada[[:space:]]|manbaga[[:space:]]+ko.ra|manba[[:space:]]+qaysi|asl[[:space:]]+(pdf|manba|to.plam)|pdfda|pedmahorat[[:space:]]*[|]|manba[[:space:]]+to.plam)';
 IF source_leaks>0 THEN RAISE EXCEPTION 'Source-label leakage in % published stems',source_leaks; END IF;

 RAISE NOTICE 'PASS: published Y1 %, Y2 %, Y3 %, source labels 0',n_y1,n_y2,n_y3;
END $audit$;
ROLLBACK;