-- Scratch / LOGO v3 safe staging invariants; use after migration on fresh DB.
DO $qa$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM public.questions WHERE source_reference LIKE 'Scratch-LOGO-2026-v3:%' AND status='review';
  IF n <> 60 THEN RAISE EXCEPTION 'V3 review count != 60 (% found)',n; END IF;
  SELECT count(*) INTO n FROM public.lessons WHERE module_id=(SELECT id FROM public.modules WHERE code='M07') AND slug LIKE 'sl3-%' AND status='draft';
  IF n <> 6 THEN RAISE EXCEPTION 'V3 lesson draft count != 6 (% found)',n; END IF;
  SELECT count(*) INTO n FROM public.questions q LEFT JOIN public.question_keys k ON q.id=k.question_id
  WHERE q.source_reference LIKE 'Scratch-LOGO-2026-v3:%' AND k.question_id IS NULL;
  IF n <> 0 THEN RAISE EXCEPTION 'V3 unanswered questions (%)',n; END IF;
  SELECT count(*) INTO n FROM (
    SELECT q.id, q.format, COUNT(o.id) AS n FROM public.questions q
    LEFT JOIN public.question_options o ON o.question_id=q.id
    WHERE q.source_reference LIKE 'Scratch-LOGO-2026-v3:%'
    GROUP BY q.id,q.format HAVING
       (q.format='Y1' AND COUNT(o.id)<>4) OR
       (q.format='Y2' AND COUNT(o.id)<>8) OR
       (q.format='Y3' AND COUNT(o.id)<>4)
  ) AS bad;
  IF n <> 0 THEN RAISE EXCEPTION 'V3 invalid option-count rows (%)',n; END IF;
  SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
  JOIN public.question_options o ON o.id=(k.payload->>'correct_option_id')::uuid
  WHERE q.source_reference LIKE 'Scratch-LOGO-2026-v3:%' AND q.format='Y1';
  IF n <> 36 THEN RAISE EXCEPTION 'V3 correct-option count != 36 (%)',n; END IF;
  SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference LIKE 'Scratch-LOGO-2026-v3:%' AND q.format='Y2'
  AND (SELECT count(*) FROM jsonb_object_keys(k.payload->'pairs'))<>4;
  IF n <> 0 THEN RAISE EXCEPTION 'V3 malformed matching keys (%)',n; END IF;
  SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference LIKE 'Scratch-LOGO-2026-v3:%' AND q.format='Y3'
  AND jsonb_array_length(k.payload->'order')<>4;
  IF n <> 0 THEN RAISE EXCEPTION 'V3 malformed ordering keys (%)',n; END IF;
  -- Canonical published source lesson references required by the M07 assembler.
  SELECT count(*) INTO n FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
  WHERE q.source_reference LIKE 'Scratch-LOGO-2026-v3:%' AND l.status<>'published';
  IF n <> 0 THEN RAISE EXCEPTION 'V3 source lesson not published (%)',n; END IF;
END $qa$;