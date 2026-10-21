-- TASK-394+396 production regression test; skip if production-only
-- editorial batch absent in a fresh CI bootstrap fixture.
DO $qa$
DECLARE v394 int;v396 int;bad int;other int;bad_active int;
BEGIN
 SELECT count(*) INTO v394 FROM public.question_bank_revisions
 WHERE evidence->>'task'='TASK-394';
 SELECT count(*) INTO v396 FROM public.question_bank_revisions
 WHERE evidence->>'task'='TASK-396';
 IF v394=0 AND v396=0 THEN
  RAISE NOTICE 'TASK-394/396 owner-specific data not seeded; skip';
  RETURN;
 END IF;
 IF v394<>10 OR v396<>2 THEN
  RAISE EXCEPTION 'TASK-394/396 revisions: expected 10+2; actual % + %',v394,v396;
 END IF;

 SELECT count(*) INTO bad FROM public.question_bank_revisions br
 JOIN public.questions original ON original.id=br.source_question_id
 JOIN public.questions revised ON revised.id=br.revision_question_id
 LEFT JOIN public.question_quality_published_revisions snap ON snap.question_id=revised.id
 LEFT JOIN public.pedagogy_owner_release_waivers waiver ON waiver.question_id=revised.id
 LEFT JOIN public.question_keys k ON k.question_id=revised.id
 WHERE br.evidence->>'task' IN ('TASK-394','TASK-396')
 AND (
    original.status<>'archived'::public.content_status
    OR revised.status<>'published'::public.content_status
    OR revised.format<>'Y1'::public.question_format
    OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(revised.id)
    OR waiver.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(revised.id)
    OR waiver.source_question_id IS DISTINCT FROM original.id
    OR k.question_id IS NULL
    OR NOT public.is_question_official_mock_eligible(revised.id)
    OR NOT public.group_mock_eligible(revised.id)
    OR EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=revised.id
        AND f.resolved_at IS NULL AND f.severity IN ('high','critical'))
    OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=revised.id)<>4
    OR (SELECT count(distinct btrim(o.content_md)) FROM public.question_options o
            WHERE o.question_id=revised.id)<>4
    OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=revised.id
       AND o.side='a' AND o.id::text=k.payload->>'correct_option_id')
 );
 IF bad<>0 THEN RAISE EXCEPTION 'TASK-394/396 invalid immutability/key/fingerprint/eligibility on % cases',bad; END IF;

 SELECT count(*) INTO other FROM public.question_bank_revisions br
 JOIN public.question_editorial_checks e ON e.question_id=br.revision_question_id
 WHERE br.evidence->>'task' IN ('TASK-394','TASK-396')
 AND e.answer_verified AND e.reference_verified AND e.wording_verified AND e.original_authorship_verified;
 IF other<>0 THEN RAISE EXCEPTION 'TASK-394/396 invalid human signoff claim'; END IF;

 SELECT count(*) INTO bad_active FROM public.question_quality_findings f
 JOIN public.questions q ON q.id=f.question_id
 WHERE f.finding_code='implausible_distractors' AND f.resolved_at IS NULL
 AND q.status='published'::public.content_status;
 IF bad_active<>0 THEN
  RAISE EXCEPTION 'TASK-394/396 open published implausible distractor warnings %',bad_active;
 END IF;
 RAISE NOTICE 'TASK-394/396 PASS: 12 owner AI reviewed immutable Y1 releases, zero current published implausible-distractor flags';
END
$qa$;
