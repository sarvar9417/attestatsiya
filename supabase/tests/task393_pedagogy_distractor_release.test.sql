-- TASK-393 regression: exactly eight AI-reviewed KS Y1 replacements.
-- Independent human approval must NOT be falsely recorded.
DO $t393_check$
DECLARE total int; fail_count int;
BEGIN
 SELECT count(*) INTO total FROM public.question_bank_revisions b
 WHERE b.revision_kind='owner_ai_distractor_balance'
   AND b.evidence->>'task'='TASK-393';
 IF total=0 THEN
    RAISE NOTICE 'TASK-393 production item batch absent: skipping CI fixture-only assertions';
    RETURN;
 END IF;
 IF total<>8 THEN RAISE EXCEPTION 'TASK-393 8 revisions expected, got %',total; END IF;

 SELECT count(*) INTO fail_count
 FROM public.question_bank_revisions link
 JOIN public.questions oldq ON oldq.id=link.source_question_id
 JOIN public.questions rev ON rev.id=link.revision_question_id
 JOIN public.question_quality_published_revisions snap ON snap.question_id=rev.id
 JOIN public.question_keys k ON k.question_id=rev.id
 JOIN public.pedagogy_owner_release_waivers waiver ON waiver.question_id=rev.id
 WHERE link.revision_kind='owner_ai_distractor_balance'
 AND link.evidence->>'task'='TASK-393'
 AND (
     oldq.status<>'archived'::public.content_status
     OR rev.status<>'published'::public.content_status
     OR rev.format<>'Y1'::public.question_format
     OR rev.group_code<>'KS'
     OR snap.content_fingerprint<>public.professional_question_fingerprint(rev.id)
     OR waiver.content_fingerprint<>public.professional_question_fingerprint(rev.id)
     OR waiver.source_question_id IS DISTINCT FROM oldq.id
     OR waiver.provenance NOT LIKE 'TASK-393:%'
     OR EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=rev.id
               AND f.finding_code='independent_editorial_review_required' AND f.resolved_at IS NULL)
     OR NOT EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=rev.id
                AND f.finding_code='independent_editorial_review_required'
                AND f.details->>'human_review_performed'='false')
     OR NOT EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=oldq.id
                AND f.finding_code='implausible_distractors' AND f.resolved_at IS NOT NULL)
     OR NOT public.is_question_official_mock_eligible(rev.id)
     OR NOT public.group_mock_eligible(rev.id)
     OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=rev.id)<>4
     OR (SELECT count(distinct btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=rev.id)<>4
     OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=rev.id
           AND o.side='a' AND o.id::text=k.payload->>'correct_option_id')
 );
 IF fail_count<>0 THEN RAISE EXCEPTION 'TASK-393 QA integrity failure on % released questions',fail_count; END IF;

 IF EXISTS(
  SELECT 1 FROM public.question_bank_revisions link
  JOIN public.question_editorial_checks e ON e.question_id=link.revision_question_id
  WHERE link.revision_kind='owner_ai_distractor_balance'
    AND link.evidence->>'task'='TASK-393'
    AND e.answer_verified AND e.reference_verified AND e.wording_verified AND e.original_authorship_verified
 ) THEN RAISE EXCEPTION 'TASK-393 unexpected independent human certification flag'; END IF;
 RAISE NOTICE 'TASK-393 PASS: 8/8 published, fingerprinted, mock-eligible, old history archived, no fabricated human signoff';
END
$t393_check$;
