-- TASK-203: evidence-only regression; no seed, no fake reviewer.
-- Fresh CI may legitimately contain zero production owner signoffs; SQL fixture
-- tests format/key integrity and source relations when the approved corpus exists.
BEGIN;
DO $audit$
DECLARE v_signed integer; v_redrafted integer; v_mismatch integer; v_bad integer;
BEGIN
 SELECT count(*),count(*) FILTER(WHERE e.reviewer_notes LIKE '%After the owner approved original question content%'
 OR e.reviewer_notes LIKE '%Incorrect distractor texts were subsequently rewritten with AI%')
 INTO v_signed,v_redrafted
 FROM public.question_editorial_checks e
 WHERE e.reviewer_id='01f636a4-304c-4627-9d6c-3cde0f59ffbb'::uuid;
 IF v_signed=0 THEN
   RAISE NOTICE 'TASK-203: clean CI does not contain account-scoped owner approvals; no publication assertion';
   RETURN;
 END IF;
 IF v_signed<>249 OR v_redrafted<>82 THEN
   RAISE EXCEPTION 'TASK-203 approval count drift: % signed, % repaired',v_signed,v_redrafted;
 END IF;
 SELECT count(*) INTO v_mismatch
 FROM public.question_editorial_checks e JOIN public.questions q ON q.id=e.question_id
 WHERE e.reviewer_id='01f636a4-304c-4627-9d6c-3cde0f59ffbb'::uuid AND
 (q.status<>'published'::public.content_status
   OR e.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(q.id)
   OR NOT EXISTS(SELECT 1 FROM public.pedagogy_published_revisions r WHERE r.question_id=q.id
    AND r.content_fingerprint=public.professional_question_fingerprint(q.id))
   OR e.reviewer_notes NOT LIKE '%OWNER%');
 IF v_mismatch>0 THEN RAISE EXCEPTION 'TASK-203 immutability/editorial status drift: %',v_mismatch;END IF;

 WITH y1 AS (
  SELECT q.id,
    count(*) options,
    count(*) FILTER(WHERE o.side='a') side_a,
    count(DISTINCT lower(btrim(o.content_md))) unique_options,
    min(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))) min_words,
    max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))) max_words,
    max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
      FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correct_words,
    max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
      FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') wrong_words,
    count(*) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correct_count
  FROM public.question_editorial_checks e JOIN public.questions q ON q.id=e.question_id
  JOIN public.question_options o ON o.question_id=q.id
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE e.reviewer_id='01f636a4-304c-4627-9d6c-3cde0f59ffbb'::uuid AND q.format='Y1'
  GROUP BY q.id
 )
 SELECT count(*) INTO v_bad FROM y1
 WHERE options<>4 OR side_a<>4 OR unique_options<>4 OR correct_count<>1 OR
 max_words>min_words*1.8 OR correct_words>wrong_words*1.25;
 IF v_bad>0 THEN RAISE EXCEPTION 'TASK-203 broken released Y1 options: %',v_bad;END IF;

 SELECT count(*) INTO v_bad FROM public.question_editorial_checks e
 JOIN public.questions q ON q.id=e.question_id
 WHERE e.reviewer_id='01f636a4-304c-4627-9d6c-3cde0f59ffbb'::uuid
 AND (
  NOT EXISTS(SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id)
  OR NOT EXISTS(SELECT 1 FROM public.lesson_constructs lc
    JOIN public.lessons l ON l.id=lc.lesson_id AND l.status='published'::public.content_status
    WHERE lc.lesson_id=q.source_lesson_id AND lc.construct_id=q.construct_id)
 );
 IF v_bad>0 THEN RAISE EXCEPTION 'TASK-203 source/key gaps: %',v_bad; END IF;
 IF has_table_privilege('authenticated','public.question_editorial_checks','SELECT')
    OR has_table_privilege('anon','public.pedagogy_pdf_source_candidates','SELECT') THEN
   RAISE EXCEPTION 'TASK-203 confidential reviewer/source information leaked to learners';
 END IF;
END $audit$;
ROLLBACK;
