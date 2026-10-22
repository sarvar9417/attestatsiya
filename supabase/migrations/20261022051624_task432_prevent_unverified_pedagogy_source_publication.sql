-- TASK-432: reject new pedagogy publication when source or answer evidence
-- still has unresolved high/critical quality findings, including if a generic
-- owner-delegated AI release waiver has been added.
-- Existing published questions and historic attempts are untouched.
-- Applied to remote Supabase on 2026-10-22 as migration 20261022051624.

CREATE OR REPLACE FUNCTION public.guard_pedagogy_source_evidence_publish()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $func$
DECLARE v_finding text;
BEGIN
  IF NEW.status <> 'published'::public.content_status
     OR NEW.group_code NOT IN ('KS','PM.GEN','PM.MET')
     OR (TG_OP='UPDATE' AND OLD.status='published'::public.content_status)
  THEN
    RETURN NEW;
  END IF;

  SELECT f.finding_code INTO v_finding
  FROM public.question_quality_findings f
  WHERE f.question_id=NEW.id
    AND f.resolved_at IS NULL
    AND f.severity IN ('high','critical')
    AND f.finding_code IN (
      'editorial_evidence_missing',
      'revision_source_no_longer_published',
      'source_provenance_unverified',
      'answer_key_unverified'
    )
  ORDER BY f.finding_code LIMIT 1;

  IF v_finding IS NOT NULL THEN
    RAISE EXCEPTION USING ERRCODE='23514',
      MESSAGE='PEDAGOGY_SOURCE_EVIDENCE_REQUIRED: '||v_finding,
      DETAIL='Unresolved source/answer provenance cannot be bypassed by a general owner waiver. Correct or verify evidence before publication.';
  END IF;
  RETURN NEW;
END;
$func$;

REVOKE ALL ON FUNCTION public.guard_pedagogy_source_evidence_publish()
FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS pedagogy_source_evidence_publish_guard ON public.questions;
CREATE TRIGGER pedagogy_source_evidence_publish_guard
BEFORE INSERT OR UPDATE OF status ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.guard_pedagogy_source_evidence_publish();
