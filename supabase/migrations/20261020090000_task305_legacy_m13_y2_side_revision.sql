-- TASK-305: repair the legacy S7.SEC Y2 option-side contract by revision.
-- Only a structural clone. Original text/pair semantics and private keys are
-- read from the existing database; NONE are embedded in the public migration.
-- Existing published question becomes archived, preserving historical attempts.
BEGIN;
DO $task305_y2_fix$
DECLARE
  v_old public.questions%ROWTYPE;
  v_oldkey public.question_keys%ROWTYPE;
  v_new uuid;
  v_oldoption record;
  v_uuidmap jsonb := '{}'::jsonb;
  v_pairs jsonb;
  v_bad integer;
  v_count integer;
  v_newref constant text := 'm13-qa-fix:v2:T063-Y2-022';
BEGIN
  SELECT * INTO STRICT v_old
  FROM public.questions
  WHERE source_reference='formatbank-2026:T063-Y2-022';
  IF v_old.format<>'Y2'::public.question_format
     OR v_old.group_code <> 'S7.SEC' THEN
    RAISE EXCEPTION 'TASK-305 wrong original item classification';
  END IF;
  SELECT * INTO STRICT v_oldkey
  FROM public.question_keys WHERE question_id=v_old.id;

  SELECT count(*) INTO v_count FROM public.question_options WHERE question_id=v_old.id;
  SELECT count(*) INTO v_bad FROM public.question_options
   WHERE question_id=v_old.id AND
     (side<>'a' OR order_idx NOT BETWEEN 1 AND 8);
  IF v_count <> 8 OR v_bad<>0 OR jsonb_typeof(v_oldkey.payload->'pairs')<>'object'
    OR (SELECT count(*) FROM jsonb_each_text(v_oldkey.payload->'pairs'))<>4 THEN
    RAISE EXCEPTION 'TASK-305 old Y2 shape differs from audited snapshot';
  END IF;
  SELECT count(*) INTO v_bad FROM jsonb_each_text(v_oldkey.payload->'pairs') kv
    WHERE NOT EXISTS(SELECT 1 FROM public.question_options o
      WHERE o.question_id=v_old.id AND o.id::text=kv.key AND o.order_idx BETWEEN 1 AND 4)
       OR NOT EXISTS(SELECT 1 FROM public.question_options o
      WHERE o.question_id=v_old.id AND o.id::text=kv.value AND o.order_idx BETWEEN 5 AND 8);
  IF v_bad<>0 THEN
    RAISE EXCEPTION 'TASK-305 original pair key/option reconciliation failed';
  END IF;

  SELECT id INTO v_new FROM public.questions WHERE source_reference=v_newref;
  IF v_new IS NULL THEN
    v_new := gen_random_uuid();
    INSERT INTO public.questions (
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
    )
    SELECT v_new,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,assets,is_generated,'review'::public.content_status,author_id,v_newref,source_lesson_id
    FROM public.questions WHERE id=v_old.id;

    FOR v_oldoption IN SELECT id,content_md,order_idx
      FROM public.question_options WHERE question_id=v_old.id ORDER BY order_idx
    LOOP
      v_uuidmap := v_uuidmap || jsonb_build_object(v_oldoption.id::text,gen_random_uuid()::text);
      INSERT INTO public.question_options(
        id,question_id,side,content_md,order_idx
      ) VALUES (
        (v_uuidmap->>v_oldoption.id::text)::uuid,
        v_new,
        CASE WHEN v_oldoption.order_idx<=4 THEN 'a' ELSE 'b' END,
        v_oldoption.content_md,v_oldoption.order_idx
      );
    END LOOP;

    SELECT jsonb_object_agg(v_uuidmap->>kv.key,v_uuidmap->>kv.value) INTO v_pairs
    FROM jsonb_each_text(v_oldkey.payload->'pairs') kv;
    IF v_pairs IS NULL OR (SELECT count(*) FROM jsonb_each_text(v_pairs))<>4 THEN
      RAISE EXCEPTION 'TASK-305 remapping private answer key failed';
    END IF;
    INSERT INTO public.question_keys (question_id,payload,explanation_md)
    VALUES(v_new,jsonb_build_object('pairs',v_pairs),v_oldkey.explanation_md);
  END IF;

  -- Validate the revision BEFORE replacing the only active copy.
  IF NOT EXISTS (
    SELECT 1 FROM public.questions n
    WHERE n.id=v_new AND n.source_reference=v_newref
     AND n.source_lesson_id=v_old.source_lesson_id
     AND n.construct_id=v_old.construct_id
     AND n.format='Y2'::public.question_format
     AND (SELECT count(*) FROM public.question_options o
       WHERE o.question_id=n.id AND o.side='a')=4
     AND (SELECT count(*) FROM public.question_options o
       WHERE o.question_id=n.id AND o.side='b')=4
     AND EXISTS (
       SELECT 1 FROM public.question_keys nk WHERE nk.question_id=n.id
       AND jsonb_typeof(nk.payload->'pairs')='object'
       AND (SELECT count(*) FROM jsonb_each_text(nk.payload->'pairs'))=4
       AND NOT EXISTS(
         SELECT 1 FROM jsonb_each_text(nk.payload->'pairs') pp WHERE
           NOT EXISTS(SELECT 1 FROM public.question_options o
              WHERE o.id::text=pp.key AND o.question_id=n.id AND o.side='a')
           OR NOT EXISTS(SELECT 1 FROM public.question_options o
              WHERE o.id::text=pp.value AND o.question_id=n.id AND o.side='b')
       )
     )
  ) THEN
    RAISE EXCEPTION 'TASK-305 corrected Y2 revision not valid';
  END IF;
  UPDATE public.questions
    SET status='published'::public.content_status
    WHERE id=v_new AND status='review'::public.content_status;
  UPDATE public.questions
    SET status='archived'::public.content_status
    WHERE id=v_old.id AND status='published'::public.content_status;
  IF (SELECT count(*) FROM public.questions WHERE id IN (v_new,v_old.id)
       AND status='published'::public.content_status)<>1 THEN
     RAISE EXCEPTION 'TASK-305 expected exactly one active Y2 revision';
  END IF;
END
$task305_y2_fix$;
COMMIT;
