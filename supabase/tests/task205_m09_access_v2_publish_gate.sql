DO $$
DECLARE
  bad_visual uuid;
  bad_format uuid;
  unsigned_plain uuid;
  passed int := 0;
BEGIN
  SELECT id INTO bad_visual FROM public.questions
  WHERE source_reference LIKE 'MSACCESS-V2/%' AND assets::text LIKE '%source_visual_review_required%'
  LIMIT 1;
  SELECT id INTO bad_format FROM public.questions
  WHERE source_reference LIKE 'MSACCESS-V2/%' AND source_reference LIKE '%NATIVE_CONVERSION_REQUIRED%'
  LIMIT 1;
  SELECT id INTO unsigned_plain FROM public.questions
  WHERE source_reference LIKE 'MSACCESS-V2/%'
    AND assets = '[]'::jsonb AND source_reference NOT LIKE '%NATIVE_CONVERSION_REQUIRED%'
  LIMIT 1;
  IF bad_visual IS NULL OR bad_format IS NULL OR unsigned_plain IS NULL THEN
    RAISE EXCEPTION 'TASK-205 fixtures missing';
  END IF;
  BEGIN
    UPDATE public.questions SET status='published' WHERE id=bad_visual;
    RAISE EXCEPTION 'FAIL: visual placeholder was published';
  EXCEPTION WHEN check_violation THEN
    passed := passed + 1;
  END;
  BEGIN
    UPDATE public.questions SET status='published' WHERE id=bad_format;
    RAISE EXCEPTION 'FAIL: paper format was published';
  EXCEPTION WHEN check_violation THEN
    passed := passed + 1;
  END;
  BEGIN
    UPDATE public.questions SET status='published' WHERE id=unsigned_plain;
    RAISE EXCEPTION 'FAIL: unsigned question was published';
  EXCEPTION WHEN check_violation THEN
    passed := passed + 1;
  END;
  IF passed <> 3 THEN RAISE EXCEPTION 'TASK-205 QA failed: %/3', passed; END IF;
  IF (SELECT COUNT(*) FROM public.questions WHERE source_reference LIKE 'MSACCESS-V2/%' AND status='review') <> 180 THEN
    RAISE EXCEPTION 'TASK-205 QA failed: review count changed';
  END IF;
END
$$;
