-- TASK-375 follow-up: immutable presentation revisions must inherit every open
-- source quality finding. A formatting release must never make an item newly
-- eligible for an official mock by losing editorial/answer-cue blockers.
BEGIN;

INSERT INTO public.question_quality_findings(
  question_id,finding_code,severity,details,detected_at,resolved_at
)
SELECT r.revision_question_id,f.finding_code,f.severity,
  f.details || jsonb_build_object(
    'task375_carried_from_question_id',r.source_question_id,
    'task375_reason','formatting-only immutable revision'
  ),
  f.detected_at,NULL
FROM public.question_bank_revisions r
JOIN public.question_quality_findings f ON f.question_id=r.source_question_id
WHERE r.revision_kind='code_block_presentation_normalization'
  AND f.resolved_at IS NULL
ON CONFLICT (question_id,finding_code) DO UPDATE
SET severity=excluded.severity,
    details=excluded.details,
    detected_at=least(public.question_quality_findings.detected_at,excluded.detected_at),
    resolved_at=NULL;

DO $task375_findings$
DECLARE v_sources integer; v_revisions integer; v_eligible integer; v_total integer;
BEGIN
  SELECT count(*) INTO v_total
  FROM public.question_bank_revisions
  WHERE revision_kind='code_block_presentation_normalization';
  IF v_total=0 THEN
    RAISE NOTICE 'TASK-375 revisions absent; finding carry skipped';
    RETURN;
  END IF;

  SELECT count(*) INTO v_sources
  FROM public.question_bank_revisions r
  JOIN public.question_quality_findings f ON f.question_id=r.source_question_id
  WHERE r.revision_kind='code_block_presentation_normalization'
    AND f.resolved_at IS NULL;

  SELECT count(*) INTO v_revisions
  FROM public.question_bank_revisions r
  JOIN public.question_quality_findings f ON f.question_id=r.revision_question_id
  WHERE r.revision_kind='code_block_presentation_normalization'
    AND f.resolved_at IS NULL;

  SELECT count(*) INTO v_eligible
  FROM public.question_bank_revisions r
  WHERE r.revision_kind='code_block_presentation_normalization'
    AND public.is_question_official_mock_eligible(r.revision_question_id);

  -- Before the formatting revision, 45 of these 59 items passed the existing
  -- official-mock predicate. Carrying the nine HIGH findings restores that
  -- exact eligibility count instead of incorrectly widening it to 54.
  IF v_sources<>v_revisions
     OR EXISTS (
       SELECT 1
       FROM public.question_bank_revisions r
       JOIN public.question_quality_findings source_f
         ON source_f.question_id=r.source_question_id
        AND source_f.resolved_at IS NULL
        AND source_f.severity IN ('high','critical')
       WHERE r.revision_kind='code_block_presentation_normalization'
         AND NOT EXISTS (
           SELECT 1 FROM public.question_quality_findings revision_f
           WHERE revision_f.question_id=r.revision_question_id
             AND revision_f.finding_code=source_f.finding_code
             AND revision_f.severity=source_f.severity
             AND revision_f.resolved_at IS NULL
         )
     )
     OR (v_total=59 AND (v_sources<>80 OR v_eligible<>45)) THEN
    RAISE EXCEPTION
      'TASK-375 finding carry postflight failed: source %, revision %, eligible %',
      v_sources,v_revisions,v_eligible;
  END IF;
END
$task375_findings$;

COMMIT;
