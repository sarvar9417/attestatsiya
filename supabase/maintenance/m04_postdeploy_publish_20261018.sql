-- NOT FOR PREDEPLOY EXECUTION. Run ONLY when BOTH frontend and backend production
-- deployments have been verified and an authenticated M04 lesson/exam smoke passes.
-- Owner waived human expert signoff. The technical invariant gate is mandatory.
-- Provide `SET LOCAL app.m04_deployment_verified = 'true';` in this SAME transaction
-- only after actual deployment verification by operator.
BEGIN;
-- Repeat the full key/format/dedup/source/diagram invariant check in this SAME transaction.
DO $m04_gate$
DECLARE
  v_module uuid;
  v_count int;
  v_invalid int;
BEGIN
  SELECT id INTO STRICT v_module FROM public.modules WHERE code = 'M04';
  SELECT count(*) INTO v_count FROM public.lessons
    WHERE module_id=v_module AND status='published'::public.content_status
      AND length(trim(coalesce(body_mdx,'')))>1000;
  IF v_count<>6 THEN RAISE EXCEPTION 'M04: expected 6 published nonempty lessons, found %',v_count; END IF;

  WITH staged AS (
    SELECT q.*,k.payload,k.explanation_md FROM public.questions q
      LEFT JOIN public.question_keys k ON k.question_id=q.id
    WHERE q.group_code='S3.LOGIC' AND q.status='review'::public.content_status
      AND (q.source_reference LIKE 'm04-latex2026-v2:%'
        OR q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%'
        OR q.source_reference LIKE 'specgap-2026:%')
  )
  SELECT count(*) INTO v_count FROM staged;
  IF v_count<>124 THEN RAISE EXCEPTION 'M04: expected 124 staged review questions, found %',v_count; END IF;

  WITH staged AS (
    SELECT q.*,k.payload,k.explanation_md FROM public.questions q
      LEFT JOIN public.question_keys k ON k.question_id=q.id
    WHERE q.group_code='S3.LOGIC' AND q.status='review'::public.content_status
      AND (q.source_reference LIKE 'm04-latex2026-v2:%'
        OR q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%'
        OR q.source_reference LIKE 'specgap-2026:%')
  ), checks AS (
    SELECT q.id,
      q.payload IS NOT NULL AND coalesce(length(trim(q.explanation_md)),0)>10
      AND EXISTS (SELECT 1 FROM public.lessons l WHERE l.id=q.source_lesson_id
                    AND l.module_id=v_module AND l.status='published'::public.content_status)
      AND EXISTS (SELECT 1 FROM public.constructs c WHERE c.id=q.construct_id
                    AND c.group_code='S3.LOGIC' AND c.is_active)
      AND NOT EXISTS (SELECT 1 FROM public.exam_items e WHERE e.question_id=q.id)
      AND CASE q.format
      WHEN 'Y1' THEN
          (SELECT count(*)=4 AND count(distinct content_md)=4 AND bool_and(side='a')
            FROM public.question_options o WHERE o.question_id=q.id)
          AND EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id
            AND o.id::text=q.payload->>'correct_option_id')
      WHEN 'Y2' THEN
          jsonb_typeof(q.payload->'pairs')='object'
          AND (SELECT count(*) FROM jsonb_each_text(q.payload->'pairs'))>=3
          AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') =
              (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')
          AND (SELECT count(distinct p.value) FROM jsonb_each_text(q.payload->'pairs') p) =
              (SELECT count(*) FROM jsonb_each_text(q.payload->'pairs'))
          AND NOT EXISTS (SELECT 1 FROM jsonb_each_text(q.payload->'pairs') p
            WHERE NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id
             AND o.side='a' AND o.id::text=p.key)
             OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id
             AND o.side='b' AND o.id::text=p.value))
      WHEN 'Y3' THEN
          jsonb_typeof(q.payload->'order')='array'
          AND (SELECT count(*) FROM jsonb_array_elements_text(q.payload->'order')) >= 3
          AND (SELECT count(*) FROM jsonb_array_elements_text(q.payload->'order')) =
              (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)
          AND (SELECT count(distinct a.value) FROM jsonb_array_elements_text(q.payload->'order') a) =
              (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)
          AND NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.side<>'a')
          AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements_text(q.payload->'order') a
            WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id
                AND o.id::text=a.value))
      ELSE false END
      AND (CASE WHEN q.stem_md ~ '\[\[FIG:G[0-9]{3}\]\]' THEN
         jsonb_array_length(q.assets)=1
         AND q.assets->0->>'kind'='logic_circuit'
         AND q.assets->0->>'diagram_id' = substring(q.stem_md from '\[\[FIG:(G[0-9]{3})\]\]')
        ELSE q.assets='[]'::jsonb END)
      AS valid
    FROM staged q
  )
  SELECT count(*) INTO v_invalid FROM checks WHERE NOT valid;
  IF v_invalid<>0 THEN RAISE EXCEPTION 'M04: % invalid staged questions',v_invalid; END IF;

  WITH staged AS (
    SELECT q.id,lower(trim(q.stem_md)) norm_stem FROM public.questions q
    WHERE q.group_code='S3.LOGIC' AND q.status='review'::public.content_status
      AND (q.source_reference LIKE 'm04-latex2026-v2:%'
        OR q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%'
        OR q.source_reference LIKE 'specgap-2026:%')
  )
  SELECT count(*) INTO v_count FROM staged s
  WHERE EXISTS (SELECT 1 FROM public.questions p
    WHERE p.group_code='S3.LOGIC' AND p.status='published'::public.content_status
     AND lower(trim(p.stem_md))=s.norm_stem)
    OR EXISTS (SELECT 1 FROM staged t WHERE t.norm_stem=s.norm_stem AND t.id<>s.id);
  IF v_count<>0 THEN RAISE EXCEPTION 'M04: staged content contains % repeated stems',v_count; END IF;

  RAISE NOTICE 'M04 accepted technical gate: 6 lessons, 124 staged questions, 0 invalid keys/formats, 0 duplicated stems.';
END $m04_gate$;
DO $m04_release$
DECLARE v_ready int;v_all int;v_invalid int;
BEGIN
 IF current_setting('app.m04_deployment_verified',true) IS DISTINCT FROM 'true'
 THEN RAISE EXCEPTION 'M04 release blocked: deployment verification token missing';END IF;
 WITH candidates AS (SELECT * FROM public.questions WHERE group_code='S3.LOGIC'
    AND status='review'::public.content_status AND (
      source_reference LIKE 'm04-latex2026-v2:%' OR
      source_reference LIKE 'm04-sourceaudit-20261018-v1:%' OR
      source_reference LIKE 'specgap-2026:%'))
 SELECT count(*) INTO v_ready FROM candidates;
 IF v_ready<>124 THEN RAISE EXCEPTION 'M04: 124 review questions expected, found %',v_ready;END IF;
 SELECT count(*) INTO v_invalid FROM public.questions q LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.group_code='S3.LOGIC' AND q.status='review'::public.content_status
 AND (q.source_reference LIKE 'm04-latex2026-v2:%'
 OR q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%' OR q.source_reference LIKE 'specgap-2026:%')
 AND (k.question_id IS NULL OR q.source_lesson_id IS NULL OR
   (q.format='Y1' AND NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')));
 IF v_invalid>0 THEN RAISE EXCEPTION 'M04: % missing/invalid keys',v_invalid;END IF;
 UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
 WHERE q.group_code='S3.LOGIC' AND q.status='review'::public.content_status
 AND (q.source_reference LIKE 'm04-latex2026-v2:%'
 OR q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%' OR q.source_reference LIKE 'specgap-2026:%');
 GET DIAGNOSTICS v_all=ROW_COUNT;
 IF v_all<>124 THEN RAISE EXCEPTION 'M04 publish changed %, expected 124',v_all;END IF;
 RAISE NOTICE 'M04 published 124 staged questions after deployment signoff';
END $m04_release$;
COMMIT;