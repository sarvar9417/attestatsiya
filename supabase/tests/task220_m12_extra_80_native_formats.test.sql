-- TASK-220 expansion: 50 native Y2 + 50 native Y3; no learner release.
-- Runs against migrated database, leaves no mutations (ROLLBACK).
BEGIN;
DO $qa$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM public.questions
   WHERE source_reference LIKE 'network-v3-extra-20261018:%'
     AND status='review'::public.content_status;
  IF n <> 80 THEN RAISE EXCEPTION 'TASK220 V3: expected 80 review questions, found %',n; END IF;
  SELECT count(*) INTO n FROM public.questions
   WHERE source_reference LIKE 'network-v3-extra-20261018:%'
     AND format='Y2'::public.question_format;
  IF n <> 40 THEN RAISE EXCEPTION 'TASK220 V3: expected +40 Y2, found %',n; END IF;
  SELECT count(*) INTO n FROM public.questions
   WHERE source_reference LIKE 'network-v3-extra-20261018:%'
     AND format='Y3'::public.question_format;
  IF n <> 40 THEN RAISE EXCEPTION 'TASK220 V3: expected +40 Y3, found %',n; END IF;
  SELECT count(*) INTO n FROM public.questions
   WHERE (source_reference LIKE 'network-v2-20261018:%'
       OR source_reference LIKE 'network-v3-extra-20261018:%')
    AND status='review'::public.content_status;
  IF n <> 380 THEN RAISE EXCEPTION 'TASK220 V2+V3: expected 380 review questions, found %',n; END IF;
  SELECT count(*) INTO n FROM public.questions
   WHERE (source_reference LIKE 'network-v2-20261018:%'
       OR source_reference LIKE 'network-v3-extra-20261018:%')
    AND format='Y2'::public.question_format;
  IF n <> 50 THEN RAISE EXCEPTION 'TASK220 V2+V3: expected 50 Y2, found %',n; END IF;
  SELECT count(*) INTO n FROM public.questions
   WHERE (source_reference LIKE 'network-v2-20261018:%'
       OR source_reference LIKE 'network-v3-extra-20261018:%')
    AND format='Y3'::public.question_format;
  IF n <> 50 THEN RAISE EXCEPTION 'TASK220 V2+V3: expected 50 Y3, found %',n; END IF;
  SELECT count(*) INTO n FROM public.questions
   WHERE (source_reference LIKE 'network-v2-20261018:%'
       OR source_reference LIKE 'network-v3-extra-20261018:%')
    AND format='Y1'::public.question_format;
  IF n <> 280 THEN RAISE EXCEPTION 'TASK220 V2+V3: expected 280 Y1, found %',n; END IF;

  -- Each of ten chapters gains exactly 4 extra Y2 and 4 extra Y3.
  SELECT count(*) INTO n FROM (
    SELECT q.source_lesson_id,
       count(*) FILTER (WHERE q.format='Y2'::public.question_format) AS y2,
       count(*) FILTER (WHERE q.format='Y3'::public.question_format) AS y3
    FROM public.questions q
    WHERE q.source_reference LIKE 'network-v3-extra-20261018:%'
    GROUP BY q.source_lesson_id
    HAVING count(*)=8
       AND count(*) FILTER (WHERE q.format='Y2'::public.question_format)=4
       AND count(*) FILTER (WHERE q.format='Y3'::public.question_format)=4
  ) chapters;
  IF n <> 10 THEN RAISE EXCEPTION 'TASK220 V3: expected ten chapters with 4+4 items, got %',n; END IF;

  SELECT count(*) INTO n FROM public.questions q
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  JOIN public.lessons l ON l.id=q.source_lesson_id
  JOIN public.modules m ON m.id=l.module_id
  LEFT JOIN public.lesson_constructs lc
     ON lc.lesson_id=l.id AND lc.construct_id=q.construct_id
  WHERE q.source_reference LIKE 'network-v3-extra-20261018:%'
    AND (k.question_id IS NULL OR lc.lesson_id IS NULL
      OR m.code<>'M12' OR l.status<>'draft'::public.content_status);
  IF n <> 0 THEN RAISE EXCEPTION 'TASK220 V3: missing keys/mapping or leaked published lesson count %',n; END IF;

  SELECT count(*) INTO n FROM (
    SELECT q.id,q.format,
      count(o.id) FILTER (WHERE o.side='a') AS a,
      count(o.id) FILTER (WHERE o.side='b') AS b
    FROM public.questions q JOIN public.question_options o ON o.question_id=q.id
    WHERE q.source_reference LIKE 'network-v3-extra-20261018:%'
    GROUP BY q.id,q.format
    HAVING (q.format='Y2' AND
      (count(o.id) FILTER (WHERE o.side='a')<>3 OR count(o.id) FILTER (WHERE o.side='b')<>3))
      OR (q.format='Y3' AND
      (count(o.id) FILTER (WHERE o.side='a')<>4 OR count(o.id) FILTER (WHERE o.side='b')<>0))
  ) bad;
  IF n <> 0 THEN RAISE EXCEPTION 'TASK220 V3: invalid option side counts %',n; END IF;

  SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference LIKE 'network-v3-extra-20261018:%'
    AND (
      (q.format='Y2' AND
        ((SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>3 OR
         (SELECT count(DISTINCT value) FROM jsonb_each_text(k.payload->'pairs'))<>3 OR
         EXISTS(SELECT 1 FROM jsonb_each_text(k.payload->'pairs') p
           WHERE NOT EXISTS(SELECT 1 FROM public.question_options o
             WHERE o.question_id=q.id AND o.side='a' AND o.id::text=p.key)
             OR NOT EXISTS(SELECT 1 FROM public.question_options o
             WHERE o.question_id=q.id AND o.side='b' AND o.id::text=p.value))))
      OR (q.format='Y3' AND
        (jsonb_array_length(k.payload->'order')<>4 OR
         (SELECT count(DISTINCT value) FROM jsonb_array_elements_text(k.payload->'order'))<>4 OR
         EXISTS(SELECT 1 FROM jsonb_array_elements_text(k.payload->'order') okey
           WHERE NOT EXISTS(SELECT 1 FROM public.question_options o
             WHERE o.question_id=q.id AND o.side='a' AND o.id::text=okey.value))))
    );
  IF n <> 0 THEN RAISE EXCEPTION 'TASK220 V3: invalid native pair/order key %',n; END IF;

  -- No previous question is overwritten/published.
  SELECT count(*) INTO n FROM public.questions
  WHERE group_code='S6.NET'
    AND (source_reference NOT LIKE 'network-v2-20261018:%' OR source_reference IS NULL)
    AND (source_reference NOT LIKE 'network-v3-extra-20261018:%' OR source_reference IS NULL);
  IF n < 91 THEN RAISE EXCEPTION 'TASK220 V3: legacy bank unexpectedly shrank, %',n; END IF;
END $qa$;
ROLLBACK;
