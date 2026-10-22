-- TASK-433 regression: every new-test candidate path uses identical
-- unresolved-source-evidence policy, including medium-severity findings.
-- Synthetic mutation of one pre-existing published row's quality finding is
-- rolled back; no user attempts/answers are modified.
BEGIN;
DO $task433$
DECLARE
  item uuid;
  initially_mock_eligible boolean;
  present int;
  missing int;
  n int;
  rec record;
  expected jsonb := '{
     "admin_custom_exam_pool_coverage":1,
     "custom_exam_preflight":1,
     "generate_custom_exam":1,
     "generate_professional_practice_15":2,
     "generate_section_mock":9,
     "generate_topic_test":5,
     "group_mock_create":4,
     "is_question_official_mock_eligible":1,
     "topic_test_preflight":2,
     "topic_test_preview":2
  }'::jsonb;
BEGIN
  IF to_regprocedure('public.question_source_evidence_eligible(uuid)') IS NULL
     OR has_function_privilege('anon','public.question_source_evidence_eligible(uuid)','EXECUTE')
     OR has_function_privilege('authenticated','public.question_source_evidence_eligible(uuid)','EXECUTE')
  THEN RAISE EXCEPTION 'TASK433: helper missing or direct learner EXECUTE exposed'; END IF;

  FOR rec IN SELECT key, value::text::int AS expected_count
             FROM jsonb_each_text(expected) AS x(key,value)
  LOOP
    SELECT count(*) INTO present
    FROM pg_proc p JOIN pg_namespace ns ON ns.oid=p.pronamespace
    WHERE ns.nspname='public' AND p.proname=rec.key;
    IF present=0 THEN
      RAISE NOTICE 'TASK433: % is not in this CI fixture',rec.key;
      CONTINUE;
    END IF;
    SELECT regexp_count(p.prosrc,'question_source_evidence_eligible[(]q[.]id[)]')
      INTO n FROM pg_proc p JOIN pg_namespace ns ON ns.oid=p.pronamespace
      WHERE ns.nspname='public' AND p.proname=rec.key;
    IF n<>rec.expected_count THEN
      RAISE EXCEPTION 'TASK433: % expected % guarded paths, found %',
        rec.key,rec.expected_count,n;
    END IF;
  END LOOP;

  SELECT q.id INTO item FROM public.questions q
  WHERE q.status='published'::public.content_status
    AND q.group_code IN ('KS','PM.GEN','PM.MET')
    AND public.question_source_evidence_eligible(q.id)
    AND NOT EXISTS (
      SELECT 1 FROM public.question_quality_findings f
      WHERE f.question_id=q.id AND f.finding_code='editorial_evidence_missing'
    )
  ORDER BY q.id LIMIT 1;

  IF item IS NULL THEN
    RAISE NOTICE 'TASK433: CI sample bank has no eligible published pedagogy item, function coverage verified';
    RETURN;
  END IF;

  initially_mock_eligible:=public.is_question_official_mock_eligible(item);
  INSERT INTO public.question_quality_findings
    (question_id,finding_code,severity,details,detected_at)
  VALUES(item,'editorial_evidence_missing','medium',
    '{"test":"TASK433","unverified_original_source":true}'::jsonb,now());

  IF public.question_source_evidence_eligible(item) THEN
    RAISE EXCEPTION 'TASK433: medium source finding did not exclude a published item'; END IF;
  IF initially_mock_eligible AND public.is_question_official_mock_eligible(item) THEN
    RAISE EXCEPTION 'TASK433: official mock accepted medium source finding'; END IF;

  UPDATE public.question_quality_findings SET resolved_at=now()
  WHERE question_id=item AND finding_code='editorial_evidence_missing';

  IF NOT public.question_source_evidence_eligible(item) THEN
    RAISE EXCEPTION 'TASK433: resolved source still excluded'; END IF;
  IF initially_mock_eligible AND NOT public.is_question_official_mock_eligible(item) THEN
    RAISE EXCEPTION 'TASK433: valid official mock item stayed excluded'; END IF;

  RAISE NOTICE 'TASK433 PASS: 10 RPCs patched; medium missing evidence excluded; resolved restores eligibility; rollback';
END;
$task433$;
ROLLBACK;
