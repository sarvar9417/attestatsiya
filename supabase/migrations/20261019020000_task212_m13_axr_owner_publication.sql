-- TASK-212: Owner-authorized M13 AXR teaching release (without independent expert review).
-- Preserves the 6 canonical published M13 lessons, existing items and attempts.
-- This promotes the exact seven already-staged review lessons and their 210 keyed
-- questions; never changes the published wording, answers or source metadata.
-- Quality limitation: author/source bank was not independently expert-validated.
BEGIN;
DO $task212$
DECLARE v int; v_module uuid; v_subject uuid;
BEGIN
  SELECT id INTO STRICT v_module FROM public.modules WHERE code = 'M13';
  SELECT id INTO STRICT v_subject FROM public.subjects WHERE code = 'informatika';
  -- No partial activation: require all seven exact versioned lessons.
  SELECT count(*) INTO v FROM public.lessons l
    WHERE l.module_id = v_module
      AND l.slug ~ '^m13-axr-0[1-7]$'
      AND l.status IN ('review'::public.content_status,'published'::public.content_status)
      AND length(btrim(coalesce(l.body_mdx,''))) > 500;
  IF v <> 7 THEN RAISE EXCEPTION 'TASK-212: Expected 7 complete M13 AXR source lessons, found %', v; END IF;

  SELECT count(*) INTO v FROM public.questions q
   JOIN public.lessons l ON l.id=q.source_lesson_id
   JOIN public.constructs c ON c.id=q.construct_id
    WHERE q.source_reference LIKE 'm13-axr-v1:%:AXR-%'
      AND l.module_id=v_module
      AND l.slug ~ '^m13-axr-0[1-7]$'
      AND q.group_code='S7.SEC' AND c.is_active
      AND q.format='Y1'::public.question_format
      AND q.status IN ('review'::public.content_status,'published'::public.content_status)
      AND EXISTS (SELECT 1 FROM public.lesson_constructs lc
                  WHERE lc.lesson_id=l.id AND lc.construct_id=q.construct_id)
      AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
      AND EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id
                  AND length(trim(coalesce(k.explanation_md,'')))>0
                  AND (SELECT count(*) FROM public.question_options o
                       WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1);
  IF v <> 210 THEN RAISE EXCEPTION 'TASK-212: 210 vetted-by-structure source-backed Y1 rows required, got %', v; END IF;

  SELECT count(*) INTO v FROM (
    SELECT q.source_lesson_id FROM public.questions q
    WHERE q.source_reference LIKE 'm13-axr-v1:%:AXR-%'
    GROUP BY q.source_lesson_id HAVING count(*)<>30
  ) x;
  IF v <> 0 THEN RAISE EXCEPTION 'TASK-212: each M13 AXR lesson must contain exactly 30 questions'; END IF;

  SELECT count(*) INTO v FROM public.questions q
    WHERE q.source_reference LIKE 'm13-axr-v1:%:AXR-%'
      AND q.source_lesson_id NOT IN (
         SELECT l.id FROM public.lessons l
          WHERE l.module_id=v_module AND l.slug ~ '^m13-axr-0[1-7]$');
  IF v <> 0 THEN RAISE EXCEPTION 'TASK-212: Question source lesson mismatch'; END IF;

  -- Release the newly created versioned edition; canonical M13 is unaffected.
  UPDATE public.lessons l SET status='published'::public.content_status
   WHERE l.module_id=v_module AND l.slug ~ '^m13-axr-0[1-7]$'
     AND l.status='review'::public.content_status;

  UPDATE public.questions q SET status='published'::public.content_status
   WHERE q.source_reference LIKE 'm13-axr-v1:%:AXR-%'
     AND q.status='review'::public.content_status;

  SELECT count(*) INTO v FROM public.questions q
    JOIN public.lessons l ON l.id=q.source_lesson_id
    WHERE q.source_reference LIKE 'm13-axr-v1:%:AXR-%'
      AND q.status='published'::public.content_status
      AND l.status='published'::public.content_status;
  IF v <> 210 THEN RAISE EXCEPTION 'TASK-212: Incomplete publish %/210',v; END IF;

  SELECT count(*) INTO v FROM public.lessons l WHERE l.module_id=v_module
      AND l.slug ~ '^m13-axr-0[1-7]$' AND l.status='published'::public.content_status;
  IF v <> 7 THEN RAISE EXCEPTION 'TASK-212: Incomplete lesson publish %/7',v; END IF;
END
$task212$;
COMMIT;
