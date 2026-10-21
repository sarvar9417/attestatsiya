
-- TASK-389: twelve owner-delegated, AI-reviewed Y2/Y3 clarity releases.
-- Content/evidence fingerprints verified; no human certification claimed.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
ALTER TABLE public.pedagogy_owner_release_waivers
  DROP CONSTRAINT pedagogy_owner_release_waivers_authority_check;
ALTER TABLE public.pedagogy_owner_release_waivers
  ADD CONSTRAINT pedagogy_owner_release_waivers_authority_check
  CHECK (authority IN (
    'owner_explicit_no_external_expert_20261018',
    'owner_delegated_ai_y2_20261021',
    'owner_delegated_ai_clarity_20261021'
  ));

DO $policy$
DECLARE
  v_function text;
  needle text := 'br.revision_kind=''legacy_y2_native_sides''
        )))';
  replacement text := 'br.revision_kind=''legacy_y2_native_sides''
        )) OR (w.authority=''owner_delegated_ai_clarity_20261021'' AND EXISTS (
          SELECT 1 FROM public.question_bank_revisions br
          WHERE br.revision_question_id=w.question_id
            AND br.revision_kind=''order_match_instruction_clarity''
        )))';
BEGIN
  SELECT pg_get_functiondef('public.guard_pedguli_question_publish()'::regprocedure)
  INTO v_function;
  IF position(needle IN v_function)=0
     OR position('owner_delegated_ai_clarity_20261021' IN v_function)>0
  THEN RAISE EXCEPTION 'TASK-389 publication policy source has drifted'; END IF;
  EXECUTE replace(v_function,needle,replacement);
END
$policy$;

DO $release$
DECLARE
  c record;
  v_admin uuid;
  v_count int;
  v_bad int;
  source_solution text;
  proposed_solution text;
BEGIN
  CREATE TEMP TABLE task389_batch ON COMMIT DROP AS
  SELECT original.id old_id, revision.id new_id,
    original.group_code,original.format,original.source_reference original_reference
  FROM public.question_quality_findings f
  JOIN public.questions original ON original.id=f.question_id
  JOIN public.questions revision ON revision.id=(f.details->>'proposed_revision_id')::uuid
  JOIN public.question_bank_revisions br ON br.source_question_id=original.id
      AND br.revision_question_id=revision.id
      AND br.revision_kind='order_match_instruction_clarity'
  WHERE f.finding_code='order_match_instruction_ambiguous'
     AND f.resolved_at IS NULL
     AND original.status='published'::public.content_status;

  SELECT count(*) INTO v_count FROM task389_batch;
  IF v_count<>12 OR (SELECT count(distinct old_id) FROM task389_batch)<>12
    OR (SELECT count(distinct new_id) FROM task389_batch)<>12
  THEN RAISE EXCEPTION 'TASK-389 exactly twelve existing revisions expected, got %',v_count; END IF;

  FOR c IN
    SELECT b.*,s.status source_status,r.status revision_status,
      s.format source_format,r.format revised_format,
      s.subject_id old_subject,r.subject_id new_subject,
      s.construct_id old_construct,r.construct_id new_construct,
      s.source_lesson_id old_lesson,r.source_lesson_id new_lesson,
      r.stem_md revised_stem
    FROM task389_batch b
    JOIN public.questions s ON s.id=b.old_id
    JOIN public.questions r ON r.id=b.new_id
  LOOP
    IF c.source_status<>'published'::public.content_status
       OR c.revision_status<>'review'::public.content_status
       OR c.source_format<>c.revised_format
       OR c.old_subject IS DISTINCT FROM c.new_subject
       OR c.old_construct IS DISTINCT FROM c.new_construct
       OR c.old_lesson IS DISTINCT FROM c.new_lesson
       OR length(btrim(c.revised_stem))<80
    THEN RAISE EXCEPTION 'TASK-389 source-revision metadata mismatch %',c.original_reference; END IF;

    IF c.format='Y3'::public.question_format THEN
      IF (SELECT jsonb_typeof(k.payload->'order') FROM question_keys k WHERE k.question_id=c.new_id)<>'array'
         OR (SELECT count(*) FROM question_options o WHERE o.question_id=c.new_id AND o.side='a')<>
             (SELECT jsonb_array_length(k.payload->'order') FROM question_keys k WHERE k.question_id=c.new_id)
         OR EXISTS(
             SELECT 1 FROM question_keys k,
                  LATERAL jsonb_array_elements_text(k.payload->'order') AS x(v)
             WHERE k.question_id=c.new_id AND NOT EXISTS(
               SELECT 1 FROM question_options o WHERE o.question_id=c.new_id AND o.side='a' AND o.id::text=x.v
             )
           )
      THEN RAISE EXCEPTION 'TASK-389 invalid Y3 option/key %',c.original_reference; END IF;
      SELECT string_agg(o.content_md,chr(31) ORDER BY x.ord) INTO source_solution
      FROM question_keys k,
          LATERAL jsonb_array_elements_text(k.payload->'order') WITH ORDINALITY x(id,ord)
          JOIN question_options o ON o.id::text=x.id AND o.question_id=c.old_id
      WHERE k.question_id=c.old_id;
      SELECT string_agg(o.content_md,chr(31) ORDER BY x.ord) INTO proposed_solution
      FROM question_keys k,
          LATERAL jsonb_array_elements_text(k.payload->'order') WITH ORDINALITY x(id,ord)
          JOIN question_options o ON o.id::text=x.id AND o.question_id=c.new_id
      WHERE k.question_id=c.new_id;
    ELSIF c.format='Y2'::public.question_format THEN
      IF (SELECT count(*) FROM question_options o WHERE o.question_id=c.new_id AND o.side='a')<>
             (SELECT count(*) FROM question_options o WHERE o.question_id=c.new_id AND o.side='b')
         OR (SELECT count(*) FROM question_options o WHERE o.question_id=c.new_id AND o.side='a')
            NOT BETWEEN 3 AND 6
         OR EXISTS(
           SELECT 1 FROM question_keys k,
              LATERAL jsonb_each_text(k.payload->'pairs') p
           WHERE k.question_id=c.new_id
             AND (NOT EXISTS(SELECT 1 FROM question_options o WHERE o.question_id=c.new_id AND o.id::text=p.key AND o.side='a')
               OR NOT EXISTS(SELECT 1 FROM question_options o WHERE o.question_id=c.new_id AND o.id::text=p.value AND o.side='b'))
         )
      THEN RAISE EXCEPTION 'TASK-389 invalid Y2 option/key %',c.original_reference; END IF;
      SELECT string_agg(a.content_md||chr(30)||b.content_md,chr(31) ORDER BY a.content_md COLLATE "C")
      INTO source_solution
      FROM question_keys k,
        LATERAL jsonb_each_text(k.payload->'pairs') p
        JOIN question_options a ON a.id::text=p.key AND a.question_id=c.old_id
        JOIN question_options b ON b.id::text=p.value AND b.question_id=c.old_id
      WHERE k.question_id=c.old_id;
      SELECT string_agg(a.content_md||chr(30)||b.content_md,chr(31) ORDER BY a.content_md COLLATE "C")
      INTO proposed_solution
      FROM question_keys k,
        LATERAL jsonb_each_text(k.payload->'pairs') p
        JOIN question_options a ON a.id::text=p.key AND a.question_id=c.new_id
        JOIN question_options b ON b.id::text=p.value AND b.question_id=c.new_id
      WHERE k.question_id=c.new_id;
    ELSE
      RAISE EXCEPTION 'TASK-389 revision format unsupported';
    END IF;
    IF source_solution IS NULL OR proposed_solution IS NULL
       OR source_solution IS DISTINCT FROM proposed_solution
    THEN RAISE EXCEPTION 'TASK-389 answer semantics changed unexpectedly: %',c.original_reference; END IF;
  END LOOP;

  SELECT p.id INTO v_admin FROM public.profiles p WHERE p.role='admin'
    AND coalesce(p.is_blocked,false)=false;
  IF v_admin IS NULL OR (SELECT count(*) FROM public.profiles WHERE role='admin'
        AND coalesce(is_blocked,false)=false)<>1
  THEN RAISE EXCEPTION 'TASK-389 owner authority ambiguous'; END IF;

  INSERT INTO public.pedagogy_owner_release_waivers(
    question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id
  )
  SELECT b.new_id,v_admin,public.professional_question_fingerprint(b.new_id),
    'owner_delegated_ai_clarity_20261021',
    'Owner 2026-10-21 delegated AI-led editorial review. Original answer semantics and revised Y3/Y2 task wording checked; 2026-10-21 authorization. Not an independent human editor or external certification.',
    b.old_id
  FROM task389_batch b WHERE b.group_code IN ('KS','PM.GEN','PM.MET');
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>2 THEN RAISE EXCEPTION 'TASK-389 expected 2 pedagogical AI owner waivers, got %',v_count; END IF;

  UPDATE public.questions q
  SET status='published'::public.content_status,updated_at=now()
  FROM task389_batch b WHERE q.id=b.new_id AND q.status='review'::public.content_status;
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>12 THEN RAISE EXCEPTION 'TASK-389 released only %/12 replacements',v_count; END IF;

  UPDATE public.questions q
  SET status='archived'::public.content_status,updated_at=now()
  FROM task389_batch b WHERE q.id=b.old_id AND q.status='published'::public.content_status;
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>12 THEN RAISE EXCEPTION 'TASK-389 archived only %/12 originals',v_count; END IF;

  UPDATE public.question_quality_published_revisions snap
  SET release_scope='TASK-389 owner-delegated AI review of Y2/Y3 clarity revisions; no independent human certification'
  FROM task389_batch b WHERE snap.question_id=b.new_id;

  UPDATE public.question_quality_findings f
  SET resolved_at=now(),details=f.details||jsonb_build_object(
    'task','TASK-389','released_revision_id',b.new_id,
    'answer_semantics_preserved',true,'external_human_expert',false
  )
  FROM task389_batch b WHERE f.question_id=b.old_id
    AND f.finding_code='order_match_instruction_ambiguous';

  SELECT count(*) INTO v_bad FROM task389_batch b
  JOIN public.questions s ON s.id=b.old_id
  JOIN public.questions r ON r.id=b.new_id
  LEFT JOIN public.question_quality_published_revisions snap ON snap.question_id=r.id
  WHERE s.status<>'archived'::public.content_status
     OR r.status<>'published'::public.content_status
     OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(r.id);
  IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-389 published snapshot or archive incorrect %',v_bad; END IF;
END
$release$;
COMMIT;