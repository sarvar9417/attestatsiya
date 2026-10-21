-- Read-only QA for second-generation pedagogy case-based questions.
BEGIN;
DO $qa$
DECLARE n int; bad int;
BEGIN
 SELECT count(*) INTO n
 FROM public.pedagogy_revision_queue r
 JOIN public.questions revised ON revised.id=r.revision_question_id
 WHERE r.source_question_id IN (
  '631b17ec-1ab7-45cc-b51f-655e0efa6cf1'::uuid,
  '22c094b2-6a85-47ac-b639-a2394b6a5861'::uuid,
  '7ce2655a-0fc8-4446-97f1-0f26240b2a03'::uuid)
 AND revised.status IN ('review','published');
 IF n<>3 THEN RAISE EXCEPTION 'expected 3 linked case-based revisions, got %',n; END IF;
 SELECT count(*) INTO bad
 FROM public.pedagogy_revision_queue r
 JOIN public.questions source ON source.id=r.source_question_id
 JOIN public.questions revised ON revised.id=r.revision_question_id
 WHERE r.source_question_id IN (
  '631b17ec-1ab7-45cc-b51f-655e0efa6cf1'::uuid,
  '22c094b2-6a85-47ac-b639-a2394b6a5861'::uuid,
  '7ce2655a-0fc8-4446-97f1-0f26240b2a03'::uuid)
 AND (
 revised.stem_md=source.stem_md
 OR revised.stem_md ~* '(pedmahorat[[:space:]]*[|]|manbadagi|asl[[:space:]]+pdf)'
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=revised.id)<>4
 OR (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=revised.id)<>4
 OR EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=revised.id AND o.content_md ~* '^[[:space:]]*faqat[[:space:]]+[0-9]')
 OR NOT EXISTS(SELECT 1 FROM public.question_keys k JOIN public.question_options o
    ON o.question_id=k.question_id AND o.id=(k.payload->>'correct_option_id')::uuid
    WHERE k.question_id=revised.id)
 );
 IF bad<>0 THEN RAISE EXCEPTION 'case-based review QA failed for % revisions',bad; END IF;
 RAISE NOTICE 'verified 3 independent case-based revisions, 4 distinct options and stable answer keys';
END $qa$;
ROLLBACK;