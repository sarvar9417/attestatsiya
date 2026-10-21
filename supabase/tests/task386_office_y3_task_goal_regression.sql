-- TASK-386 regression: generic Y3 task goals and immutable Office revisions.
-- Run after relevant content migrations. Do not mistake AI review for independent signoff.
DO $check$
DECLARE
  revised_count integer;
  bad_count integer;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.questions
    WHERE source_reference LIKE 'Office_2026_v2|%'
  ) THEN
    RAISE NOTICE 'Office source bank absent in this environment; task-specific checks skipped';
    RETURN;
  END IF;

  SELECT count(*) INTO revised_count
  FROM public.question_bank_revisions r
  WHERE r.evidence->>'task' IN ('TASK-381','TASK-382','TASK-383','TASK-385');
  IF revised_count<>54 THEN
    RAISE EXCEPTION 'Expected 54 Office Y3 immutable revisions, got %',revised_count;
  END IF;

  SELECT count(*) INTO bad_count
  FROM public.question_bank_revisions r
  JOIN public.questions old_q ON old_q.id=r.source_question_id
  JOIN public.questions new_q ON new_q.id=r.revision_question_id
  LEFT JOIN public.question_quality_published_revisions snap
    ON snap.question_id=new_q.id
  LEFT JOIN public.question_keys k ON k.question_id=new_q.id
  WHERE r.evidence->>'task' IN ('TASK-381','TASK-382','TASK-383','TASK-385')
    AND (
      old_q.status<>'archived'::public.content_status
      OR new_q.status<>'published'::public.content_status
      OR new_q.format<>'Y3'::public.question_format
      OR new_q.group_code<>'S2.OFFICE'
      OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(new_q.id)
      OR jsonb_typeof(k.payload->'order') IS DISTINCT FROM 'array'
      OR jsonb_array_length(k.payload->'order')<>4
      OR (SELECT count(*) FROM public.question_options o
          WHERE o.question_id=new_q.id AND o.side='a')<>4
      OR (SELECT count(distinct x.value)
          FROM jsonb_array_elements_text(k.payload->'order') x)<>4
      OR EXISTS (
        SELECT 1 FROM jsonb_array_elements_text(k.payload->'order') x
        WHERE NOT EXISTS(
          SELECT 1 FROM public.question_options o
          WHERE o.question_id=new_q.id AND o.id::text=x.value
        )
      )
    );
  IF bad_count<>0 THEN RAISE EXCEPTION 'Office Y3 snapshots or keys invalid: %',bad_count; END IF;

  IF EXISTS(
    SELECT 1 FROM public.questions q
    WHERE q.format='Y3'::public.question_format
      AND q.status='published'::public.content_status
      AND (
       q.stem_md LIKE 'Berilgan vazifani to‘g‘ri bajarish%'
       OR q.stem_md LIKE 'Amallarni to‘g‘ri ketma-ketlikda joylang.%'
      )
  ) THEN RAISE EXCEPTION 'Generic Y3 stem still published'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.question_quality_findings f
    WHERE f.finding_code='generic_sequence_goal_review' AND f.resolved_at IS NULL
  ) THEN RAISE EXCEPTION 'Office Y3 generic-stem review is unresolved'; END IF;

  RAISE NOTICE 'PASS: 54 Office Y3 immutable revisions and zero published generic template stems';
END
$check$;
