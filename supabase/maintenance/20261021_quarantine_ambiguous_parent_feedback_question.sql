-- Human-readable semantic evidence: two different alternatives both
-- correctly identify the downside of contacting parents only after problems.
-- Prevent an unanswerable single-key item from appearing in new attempts.
-- Existing exam_items and published fingerprint/history remain untouched.
BEGIN;
SET LOCAL lock_timeout='12s';
DO $$
DECLARE v_old uuid:='0862e4b3-c6bd-42c9-bb7b-a3dec2224707';
  v_review uuid;
  v_updated int;
BEGIN
 SELECT revision_question_id INTO STRICT v_review
 FROM public.pedagogy_revision_queue
 WHERE source_question_id=v_old AND revision_question_id IS NOT NULL;
 IF (SELECT count(*) FROM public.questions old
     JOIN public.questions next ON next.id=v_review
     WHERE old.id=v_old AND old.status='published'
       AND next.status='review' AND old.group_code='PM.GEN')<>1 THEN
   RAISE EXCEPTION 'AMBIGUOUS_PM_SOURCE_OR_REVIEW_CHANGED';
 END IF;
 IF NOT EXISTS(
   SELECT 1 FROM public.question_options o
   WHERE o.question_id=v_old AND o.content_md=
      'Munosabat ko‘pincha tanbeh va shikoyatga aylanib, ijobiy hamkorlik uchun imkoniyat kamayadi'
 ) OR NOT EXISTS(
   SELECT 1 FROM public.question_options o
   WHERE o.question_id=v_old AND o.content_md=
      'Hamkorlik reaktiv va ayblovga moyil bo‘lib qolishi mumkin; muntazam aloqa zarur'
 ) THEN RAISE EXCEPTION 'AMBIGUOUS_PM_TWO_CORRECT_OPTIONS_SOURCE_DRIFT'; END IF;
 IF EXISTS (SELECT 1 FROM public.question_quality_quarantines q
            WHERE q.source_question_id=v_old) THEN
   RAISE EXCEPTION 'AMBIGUOUS_PM_ALREADY_QUARANTINED'; END IF;
 UPDATE public.questions SET status='archived'::public.content_status,updated_at=now()
 WHERE id=v_old AND status='published'::public.content_status;
 GET DIAGNOSTICS v_updated=ROW_COUNT;
 IF v_updated<>1 THEN RAISE EXCEPTION 'AMBIGUOUS_PM_QUARANTINE_FAILED'; END IF;
 INSERT INTO public.question_quality_quarantines(
   source_question_id,replacement_question_id,reason,evidence)
 VALUES(v_old,v_review,
   'Two semantically correct alternatives on a single-key parent communication question',
   jsonb_build_object('owner_requested_semantic_analysis','2026-10-21',
   'second_correct','Munosabat ko‘pincha tanbeh va shikoyatga aylanib, ijobiy hamkorlik uchun imkoniyat kamayadi',
   'source_key','Hamkorlik reaktiv va ayblovga moyil bo‘lib qolishi mumkin; muntazam aloqa zarur',
   'review_status','unapproved','historical_exams','retained'));
 INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
 VALUES(v_old,'semantic_second_correct_answer','critical',
   jsonb_build_object('two_correct_alternatives',true,
   'action','source_archived_review_pending','review_id',v_review))
 ON CONFLICT(question_id,finding_code) DO UPDATE SET details=excluded.details,
 resolved_at=null;
END $$;
COMMIT;