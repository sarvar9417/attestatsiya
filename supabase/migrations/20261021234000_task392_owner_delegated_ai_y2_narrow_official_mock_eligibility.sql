
-- TASK-392: narrowly accept owner-delegated AI-reviewed TASK-388 immutable
-- Y2 corrections as alternative to absent external human signoff.
-- Preserve unresolved human-review warnings for provenance. Other high/critical
-- quality findings continue to exclude questions.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
DO $policy$
DECLARE
  func text;
  old_clause text;
  new_clause text;
  total_before int;
  total_after int;
  other_high_before int;
  other_high_after int;
BEGIN
 SELECT count(*) INTO total_before
 FROM public.questions q
 JOIN public.question_quality_published_revisions rev ON rev.question_id=q.id
 WHERE rev.release_scope LIKE 'TASK-388%'
   AND public.is_question_official_mock_eligible(q.id);
 IF total_before<>0 THEN RAISE EXCEPTION 'TASK-392 expected zero original eligible Y2 revisions, saw %',total_before; END IF;

 SELECT count(*) INTO other_high_before FROM public.questions q
 WHERE q.status='published'::public.content_status
 AND NOT EXISTS(
   SELECT 1 FROM public.question_quality_published_revisions s
   WHERE s.question_id=q.id AND s.release_scope LIKE 'TASK-388%'
 )
 AND EXISTS(
   SELECT 1 FROM public.question_quality_findings f
   WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical')
 );

 SELECT pg_get_functiondef('public.is_question_official_mock_eligible(uuid)'::regprocedure) INTO func;
 old_clause:=$old$      and not exists (
        select 1 from public.question_quality_findings f
        where f.question_id=q.id and f.resolved_at is null
          and f.severity in ('high','critical')
      )$old$;
 new_clause:=$new$      and not exists (
        select 1 from public.question_quality_findings f
        where f.question_id=q.id and f.resolved_at is null
          and f.severity in ('high','critical')
          and not (
            f.finding_code='independent_editorial_review_required'
            and q.format='Y2'::public.question_format
            and exists (
              select 1
              from public.question_quality_published_revisions signed_revision
              join public.question_bank_revisions link
                on link.revision_question_id=signed_revision.question_id
                and link.revision_kind='legacy_y2_native_sides'
              where signed_revision.question_id=q.id
                and signed_revision.release_scope=
                  'TASK-388 explicit owner delegated AI review; 80 verified semantic Y2 pairings; no independent human endorsement'
                and signed_revision.content_fingerprint=public.professional_question_fingerprint(q.id)
            )
          )
      )$new$;
 IF position(old_clause IN func)=0
   OR position('TASK-388 explicit owner delegated AI review' IN func)>0
 THEN RAISE EXCEPTION 'TASK-392 official mock guard source drift'; END IF;
 EXECUTE replace(func,old_clause,new_clause);

 SELECT count(*) INTO total_after
 FROM public.questions q
 JOIN public.question_quality_published_revisions rev ON rev.question_id=q.id
 WHERE rev.release_scope LIKE 'TASK-388%'
   AND q.status='published'::public.content_status
   AND public.is_question_official_mock_eligible(q.id)
   AND public.group_mock_eligible(q.id);
 IF total_after<>20 THEN
 RAISE EXCEPTION 'TASK-392 expected precisely 20 repaired Y2 to become eligible, got %',total_after;
 END IF;
 SELECT count(*) INTO other_high_after FROM public.questions q
 WHERE q.status='published'::public.content_status
 AND NOT EXISTS(
   SELECT 1 FROM public.question_quality_published_revisions s
   WHERE s.question_id=q.id AND s.release_scope LIKE 'TASK-388%'
 )
 AND EXISTS(
   SELECT 1 FROM public.question_quality_findings f
   WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical')
 );
 IF other_high_after<>other_high_before THEN
 RAISE EXCEPTION 'TASK-392 unexpectedly changed other high risk question counts';
 END IF;
END
$policy$;
COMMIT;