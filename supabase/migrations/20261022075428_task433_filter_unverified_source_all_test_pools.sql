-- TASK-433: all new pedagogy test selection and preflight paths must
-- consistently skip unresolved source / answer evidence findings.
-- This changes no existing question status, answers, exam_items, or attempts.
-- In particular, historical published rows remain intact.
--
-- The catalog rewrite preserves existing RPC function identities, grants,
-- SECURITY DEFINER and original logic. It inserts exactly one predicate
-- after each published-question filter, avoiding drift between different
-- availability estimates and final selection queries.

CREATE OR REPLACE FUNCTION public.question_source_evidence_eligible(p_question_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO ''
AS $fn$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.questions q
    JOIN public.question_quality_findings f ON f.question_id=q.id
    WHERE q.id=p_question_id
      AND q.group_code IN ('KS','PM.GEN','PM.MET')
      AND f.resolved_at IS NULL
      AND f.finding_code IN (
        'editorial_evidence_missing',
        'source_provenance_unverified',
        'answer_key_unverified',
        'revision_source_no_longer_published'
      )
  );
$fn$;

-- Internal helper. Callers are existing trusted SECURITY DEFINER RPCs,
-- not an exposed Data API function invoked by learners.
REVOKE ALL ON FUNCTION public.question_source_evidence_eligible(uuid)
FROM PUBLIC, anon, authenticated;

DO $patch$
DECLARE
  target record;
  v_ddl text;
  v_updated text;
  v_matches int;
  v_pattern text :=
    '(q[.]status[[:space:]]*=[[:space:]]*''published''::public[.]content_status)';
BEGIN
  FOR target IN
    SELECT name FROM (VALUES
      ('generate_topic_test'),
      ('topic_test_preflight'),
      ('topic_test_preview'),
      ('generate_section_mock'),
      ('generate_professional_practice_15'),
      ('generate_custom_exam'),
      ('custom_exam_preflight'),
      ('admin_custom_exam_pool_coverage'),
      ('group_mock_create')
    ) AS t(name)
  LOOP
    SELECT pg_get_functiondef(p.oid) INTO v_ddl
    FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.proname=target.name
      AND p.prokind='f';

    -- Some fresh-CI fixtures do not include production-only RPC versions.
    -- Never fabricate a replacement function when its definition is absent.
    IF v_ddl IS NULL THEN
      RAISE NOTICE 'TASK433: % not installed in this environment',target.name;
      CONTINUE;
    END IF;

    IF position('question_source_evidence_eligible(q.id)' IN v_ddl)>0 THEN
      RAISE NOTICE 'TASK433: % already patched',target.name;
      CONTINUE;
    END IF;

    v_matches:=regexp_count(v_ddl,v_pattern);
    IF v_matches=0 THEN
      RAISE EXCEPTION 'TASK433: % changed published-q alias semantics; manual re-audit required',
        target.name;
    END IF;

    v_updated:=regexp_replace(
      v_ddl,v_pattern,
      chr(92)||'1 AND public.question_source_evidence_eligible(q.id)',
      'g'
    );
    IF regexp_count(v_updated,'public[.]question_source_evidence_eligible[(]q[.]id[)]')
       <> v_matches THEN
      RAISE EXCEPTION 'TASK433: % replacement count mismatch',target.name;
    END IF;

    EXECUTE v_updated;
    RAISE NOTICE 'TASK433: patched % published candidate checks in %',
      v_matches,target.name;
  END LOOP;

  -- The official mock and group_mock_eligible use this shared gate.
  SELECT pg_get_functiondef(p.oid) INTO v_ddl
  FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
  WHERE n.nspname='public' AND p.proname='is_question_official_mock_eligible';

  IF v_ddl IS NULL THEN
    RAISE NOTICE 'TASK433: is_question_official_mock_eligible not installed';
  ELSIF position('question_source_evidence_eligible(q.id)' IN v_ddl)>0 THEN
    RAISE NOTICE 'TASK433: official mock already patched';
  ELSE
    IF regexp_count(v_ddl,
       'where[[:space:]]+q[.]id[[:space:]]*=[[:space:]]*p_question_id')<>1
    THEN RAISE EXCEPTION 'TASK433: official mock quality function changed'; END IF;

    v_updated:=replace(v_ddl,'where q.id=p_question_id',
      'where q.id=p_question_id'||E'\n'||
      '      and public.question_source_evidence_eligible(q.id)');
    IF v_updated=v_ddl THEN
      RAISE EXCEPTION 'TASK433: could not patch official mock gate'; END IF;
    EXECUTE v_updated;
    RAISE NOTICE 'TASK433: official mock gate patched';
  END IF;
END;
$patch$;
