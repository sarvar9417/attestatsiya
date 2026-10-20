-- TASK-208: safe production review check, no private stems/answer IDs included.
DO $$
DECLARE target uuid; blocked boolean:=false; cnt int; bad int;
BEGIN
  SELECT id INTO target FROM public.questions
  WHERE source_reference LIKE 'MSACCESS-DEMO-STYLE-2026/%' AND status='review'
  ORDER BY source_reference LIMIT 1;
  IF target IS NULL THEN
    RAISE NOTICE 'TASK-208 private import not staged in clean CI database; guard fixture skipped';
    RETURN;
  END IF;
  SELECT COUNT(*) INTO cnt FROM public.questions
  WHERE source_reference LIKE 'MSACCESS-DEMO-STYLE-2026/%' AND status='review';
  IF cnt<>8 THEN
    RAISE EXCEPTION 'TASK-208 demo source review pool count expected 8, got %',cnt;
  END IF;
  SELECT COUNT(*) INTO bad FROM public.questions q
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference LIKE 'MSACCESS-DEMO-STYLE-2026/%'
  AND (k.question_id IS NULL OR
      (SELECT COUNT(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
      OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id'));
  IF bad<>0 THEN RAISE EXCEPTION 'TASK-208 invalid options/answer keys: %',bad; END IF;
  BEGIN
    UPDATE public.questions SET status='published' WHERE id=target;
    RAISE EXCEPTION 'TASK-208 FAIL: unapproved candidate published';
  EXCEPTION WHEN check_violation THEN
    blocked:=true;
  END;
  IF NOT blocked THEN RAISE EXCEPTION 'TASK-208 publish guard did not reject review'; END IF;
  RAISE NOTICE 'TASK-208: % review questions + key invariants + negative publication test OK',cnt;
END $$;
