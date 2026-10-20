-- TASK-220: revised Y1 candidates stay review-only and never mutate existing published items.
BEGIN;
DO $audit$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM public.questions WHERE source_reference LIKE 'm12-stylefix-20261020:%';
 IF n<>22 THEN RAISE EXCEPTION '22 candidate revisions expected, got %',n; END IF;
 SELECT count(*) INTO n FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options o ON o.id=(k.payload->>'correct_option_id')::uuid
 JOIN public.lessons l ON l.id=q.source_lesson_id
 JOIN public.modules m ON m.id=l.module_id
 JOIN public.lesson_constructs lc ON lc.lesson_id=l.id AND lc.construct_id=q.construct_id
 WHERE q.source_reference LIKE 'm12-stylefix-20261020:%'
   AND q.status='review' AND q.format='Y1' AND o.question_id=q.id AND m.code='M12'
   AND l.status IN ('draft','published');
 IF n<>22 THEN RAISE EXCEPTION 'Incomplete 22-item answer/lesson/construct mapping: %',n; END IF;
 SELECT count(*) INTO n FROM (SELECT q.id FROM public.questions q JOIN public.question_options o ON o.question_id=q.id
  WHERE q.source_reference LIKE 'm12-stylefix-20261020:%' GROUP BY q.id
  HAVING count(*)<>4 OR count(DISTINCT o.content_md)<>4) bad;
 IF n<>0 THEN RAISE EXCEPTION 'Candidates with repeated or incomplete answer choices %',n; END IF;
 SELECT count(*) INTO n FROM public.questions WHERE source_reference LIKE 'network-v2-20261018:%'
   OR source_reference LIKE 'network-v3-extra-20261018:%';
 IF n<>380 THEN RAISE EXCEPTION 'Historic 380-item bank unexpectedly mutated %',n; END IF;
END $audit$;
ROLLBACK;
