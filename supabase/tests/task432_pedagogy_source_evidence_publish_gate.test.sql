-- TASK-432: confirm an OWNER-AI waiver cannot publish a pedagogy Y1
-- question with an unresolved source-evidence finding.
-- All changes are contained in a ROLLBACK transaction.
BEGIN;
DO $task432$
DECLARE
  sample public.questions%rowtype;
  fixture uuid := gen_random_uuid();
  correct_opt uuid := gen_random_uuid();
  blocked boolean := false;
  waiver_supported boolean := to_regclass('public.pedagogy_owner_release_waivers') IS NOT NULL;
  error_message text;
BEGIN
  IF has_function_privilege('anon','public.guard_pedagogy_source_evidence_publish()','EXECUTE')
      OR has_function_privilege('authenticated','public.guard_pedagogy_source_evidence_publish()','EXECUTE')
  THEN
    RAISE EXCEPTION 'TASK432: private quality guard is executable by a client';
  END IF;
  IF (SELECT count(*) FROM pg_trigger
      WHERE tgrelid='public.questions'::regclass
        AND tgname='pedagogy_source_evidence_publish_guard'
        AND tgenabled='O')<>1
  THEN RAISE EXCEPTION 'TASK432: enabled guard trigger missing'; END IF;

  SELECT * INTO sample FROM public.questions
  WHERE status='published'::public.content_status AND format='Y1'::public.question_format
    AND group_code IN ('KS','PM.GEN','PM.MET') LIMIT 1;

  IF sample.id IS NULL THEN
    RAISE NOTICE 'TASK432: no seeded published pedagogy reference, trigger/privilege checks passed';
    RETURN;
  END IF;

  INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
  VALUES(fixture,sample.subject_id,sample.construct_id,sample.group_code,'Y1',sample.cognitive,
      sample.difficulty,
      'O‘qituvchi mavzu boshida tayanch bilimlarni baholadi. Bu qaysi baholash?',
      sample.assets,true,'draft',sample.author_id,'test:task432:rolled-back',sample.source_lesson_id);

  INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
  VALUES(correct_opt,fixture,'a',0,'Diagnostik baholash'),
      (gen_random_uuid(),fixture,'a',1,'Formativ baholash'),
      (gen_random_uuid(),fixture,'a',2,'Summativ baholash'),
      (gen_random_uuid(),fixture,'a',3,'Portfolio asosidagi baholash');

  INSERT INTO public.question_keys(question_id,payload,explanation_md)
  VALUES(fixture,jsonb_build_object('correct_option_id',correct_opt::text),
      'Tayanch bilimlarni mavzu boshida tekshirish diagnostik baholashdir.');

  UPDATE public.questions SET status='review' WHERE id=fixture;
  INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details,detected_at)
  VALUES(fixture,'editorial_evidence_missing','high',
      '{"test":"TASK432","official_source_key_verified":false}'::jsonb,now());

  -- The clean CI bootstrap skips a production-only migration containing
  -- owner release waivers. On that fixture test the direct source guard;
  -- on production/full-schema fixtures also test the owner-waiver bypass.
  IF waiver_supported THEN
    EXECUTE 'INSERT INTO public.pedagogy_owner_release_waivers
      (question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id)
      VALUES($1,''01f636a4-304c-4627-9d6c-3cde0f59ffbb''::uuid,
        public.professional_question_fingerprint($1),
        ''owner_explicit_no_external_expert_20261018'',
        ''Temporary TASK432 synthetic fixture; not an actual source approval'',NULL)'
      USING fixture;
  END IF;

  BEGIN
    UPDATE public.questions SET status='published' WHERE id=fixture;
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS error_message=MESSAGE_TEXT;
    blocked := position('PEDAGOGY_SOURCE_EVIDENCE_REQUIRED' IN error_message)>0;
  END;
  IF NOT blocked THEN
    RAISE EXCEPTION 'TASK432: unverified source could be published with owner waiver';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.questions WHERE id=fixture AND status='review') THEN
    RAISE EXCEPTION 'TASK432: publication rejection did not retain review status';
  END IF;

  IF waiver_supported THEN
    -- With full production release infrastructure, also test the positive path.
    UPDATE public.question_quality_findings SET resolved_at=now()
    WHERE question_id=fixture AND finding_code='editorial_evidence_missing';
    UPDATE public.questions SET status='published' WHERE id=fixture;
    IF NOT FOUND THEN RAISE EXCEPTION 'TASK432: verified-source publication rejected'; END IF;
    RAISE NOTICE 'TASK432 PASS: owner waiver cannot bypass source; verified transition works; rollback follows';
  ELSE
    RAISE NOTICE 'TASK432 PASS: unverified publication blocked in clean bootstrap; positive waiver path tested in full production schema';
  END IF;
END;
$task432$;
ROLLBACK;
