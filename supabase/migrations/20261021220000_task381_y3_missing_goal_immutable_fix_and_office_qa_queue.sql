-- TASK-381: owner-requested clarification of Y3 Word cross-reference item.
-- Preserve immutable historical published content and attempted answers.
-- This release is owner-requested with AI review; it is NOT an independent human editorial certification.
BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '120s';

DO $task381$
DECLARE
  src public.questions%rowtype;
  replacement_id uuid;
  source_key jsonb;
  cloned_order jsonb;
  new_reference text;
  repaired_stem text :=
    'MS Word hujjatida rasmga avtomatik raqamlangan Caption qo‘yish, matnda shu rasmga Cross-reference havolasi yaratish, so‘ng rasm raqamlanishi o‘zgarganidan keyin havoladagi raqamni yangilash kerak. Quyidagi amallarni shu natijaga erishish uchun mantiqiy ketma-ketlikda joylashtiring.';
  repaired_explanation text :=
    'Avval rasmga Caption qo‘yiladi, keyin shu rasmga Cross-reference yaratiladi. Rasm raqamlanishi o‘zgargach, havola yangi raqamni ko‘rsatishi uchun Cross-reference maydoni yangilanadi. To‘g‘ri tartib: 2 → 3 → 4 → 1.';
  v_count integer;
BEGIN
  -- Fresh CI does not seed the remote-only Office_2026_v2 source bank.
  -- All partial/imported cases continue to fail closed below.
  IF NOT EXISTS (SELECT 1 FROM public.questions
                 WHERE source_reference LIKE 'Office_2026_v2|%') THEN
    RAISE NOTICE 'TASK-381 Office_v2 bank absent: defer source-specific revision';
    RETURN;
  END IF;
  SELECT * INTO src FROM public.questions
  WHERE source_reference LIKE 'Office_2026_v2|OFF-W03-028|%'
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'TASK-381 source question not found'; END IF;
  SELECT count(*) INTO v_count FROM public.questions
    WHERE source_reference LIKE 'Office_2026_v2|OFF-W03-028|%';
  IF v_count<>1 OR src.format<>'Y3'::public.question_format
     OR src.group_code<>'S2.OFFICE'
     OR src.stem_md NOT LIKE 'Berilgan vazifani to‘g‘ri bajarish%'
  THEN RAISE EXCEPTION 'TASK-381 source shape drift'; END IF;

  new_reference := 'revision:TASK-381:explicit-word-crossref-goal:' || src.id::text || ' | ' || src.source_reference;
  SELECT id INTO replacement_id FROM public.questions WHERE source_reference=new_reference;

  IF replacement_id IS NULL THEN
    IF src.status<>'published'::public.content_status THEN
      RAISE EXCEPTION 'TASK-381 source is not published';
    END IF;

    SELECT k.payload INTO source_key FROM public.question_keys k WHERE k.question_id=src.id;
    IF jsonb_typeof(source_key->'order')<>'array'
       OR jsonb_array_length(source_key->'order')<>4
       OR (SELECT count(*) FROM public.question_options WHERE question_id=src.id AND side='a')<>4
       OR EXISTS (
         SELECT 1 FROM jsonb_array_elements_text(source_key->'order') val
         WHERE NOT EXISTS (
           SELECT 1 FROM public.question_options o
           WHERE o.question_id=src.id AND o.id::text=val.value
         )
       )
    THEN RAISE EXCEPTION 'TASK-381 source Y3 key/option mismatch'; END IF;

    replacement_id := gen_random_uuid();
    INSERT INTO public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
      assets,is_generated,status,author_id,created_at,updated_at,source_reference,
      source_lesson_id
    ) VALUES (
      replacement_id,src.subject_id,src.construct_id,src.group_code,src.format,
      src.cognitive,src.difficulty,repaired_stem,src.assets,src.is_generated,
      'review'::public.content_status,src.author_id,now(),now(),
      new_reference,src.source_lesson_id
    );

    INSERT INTO public.question_options (id,question_id,side,order_idx,content_md)
    SELECT gen_random_uuid(),replacement_id,o.side,o.order_idx,o.content_md
    FROM public.question_options o WHERE o.question_id=src.id;

    SELECT jsonb_agg(to_jsonb(new_o.id::text) ORDER BY e.ordinality)
    INTO cloned_order
    FROM jsonb_array_elements_text(source_key->'order') WITH ORDINALITY e(old_id,ordinality)
    JOIN public.question_options old_o ON old_o.id::text=e.old_id AND old_o.question_id=src.id
    JOIN public.question_options new_o ON new_o.question_id=replacement_id
      AND new_o.side=old_o.side AND new_o.order_idx=old_o.order_idx AND new_o.content_md=old_o.content_md;

    IF jsonb_array_length(cloned_order)<>4
       OR (SELECT count(*) FROM public.question_options WHERE question_id=replacement_id)<>4
       OR (SELECT count(distinct v.value) FROM jsonb_array_elements_text(cloned_order) v)<>4
    THEN RAISE EXCEPTION 'TASK-381 remapped Y3 key failed'; END IF;

    INSERT INTO public.question_keys(question_id,payload,explanation_md,updated_at)
    VALUES (
      replacement_id, jsonb_set(source_key,'{order}',cloned_order,false),
      repaired_explanation,now()
    );

    INSERT INTO public.question_bank_revisions(
      source_question_id,revision_question_id,revision_kind,evidence
    ) VALUES (
      src.id,replacement_id,'clarify_missing_y3_task_goal',
      jsonb_build_object(
        'task','TASK-381','original_source_reference',src.source_reference,
        'owner_requested',true,'independent_human_review',false,
        'correct_answer_sequence','2-3-4-1',
        'answer_semantics_changed',false,
        'historical_attempts_changed',false,
        'change','Explicit task purpose; no duplicated numbered actions in stem'
      )
    );

    -- Explicit owner instruction: correct this particular question now.
    -- The review step above is a structural/data audit, not fake human approval.
    UPDATE public.questions
      SET status='published'::public.content_status,updated_at=now()
    WHERE id=replacement_id AND status='review'::public.content_status;

    UPDATE public.questions
      SET status='archived'::public.content_status,updated_at=now()
    WHERE id=src.id AND status='published'::public.content_status;
  END IF;

  IF (SELECT status FROM public.questions WHERE id=replacement_id)<>'published'::public.content_status
     OR (SELECT status FROM public.questions WHERE id=src.id)<>'archived'::public.content_status
     OR (SELECT stem_md FROM public.questions WHERE id=replacement_id)<>repaired_stem
     OR (SELECT explanation_md FROM public.question_keys WHERE question_id=replacement_id)<>repaired_explanation
     OR NOT EXISTS (
       SELECT 1 FROM public.question_quality_published_revisions r
       WHERE r.question_id=replacement_id
         AND r.content_fingerprint=public.professional_question_fingerprint(replacement_id)
     )
  THEN RAISE EXCEPTION 'TASK-381 release postflight failed'; END IF;

  UPDATE public.question_quality_published_revisions
    SET release_scope='TASK-381 owner-requested explicit task context; AI reviewed, not independently human certified'
    WHERE question_id=replacement_id;

  INSERT INTO public.question_quality_findings(
    question_id,finding_code,severity,details,resolved_at
  ) VALUES (
    src.id,'missing_y3_task_goal','high',
    jsonb_build_object('task','TASK-381','replacement_question_id',replacement_id,'published_replacement',true),
    now()
  ) ON CONFLICT (question_id,finding_code) DO UPDATE
      SET details=excluded.details,resolved_at=excluded.resolved_at;

  SELECT count(*) INTO v_count FROM public.questions
    WHERE group_code='S2.OFFICE' AND format='Y3'::public.question_format
      AND status='published'::public.content_status
      AND stem_md LIKE 'Berilgan vazifani to‘g‘ri bajarish%';
  IF v_count<>44 THEN RAISE EXCEPTION 'TASK-381 expected 44 remaining generic published Y3 items, found %',v_count; END IF;

  -- Heuristic queue for separate editorial review, NOT a claim that all 44 are factually wrong.
  INSERT INTO public.question_quality_findings (
    question_id,finding_code,severity,details,resolved_at
  )
  SELECT q.id,'generic_sequence_goal_review','medium',
    jsonb_build_object(
      'task','TASK-381','reason','Generic preamble and numbered actions embedded in stem',
      'screening_only',true,
      'next_action','Check explicit goal, chronology and unique keyed order; issue immutable revision if needed'
    ),NULL
  FROM public.questions q
  WHERE q.group_code='S2.OFFICE' AND q.format='Y3'::public.question_format
    AND q.status='published'::public.content_status
    AND q.stem_md LIKE 'Berilgan vazifani to‘g‘ri bajarish%'
  ON CONFLICT (question_id,finding_code) DO UPDATE
     SET details=excluded.details,resolved_at=NULL;
END
$task381$;

COMMIT;
