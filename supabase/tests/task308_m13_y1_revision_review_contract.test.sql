-- TASK-308: source-based, versioned M13 Y1 editorial QA, private answer keys.
DO $test308$
DECLARE v int;
BEGIN
 SELECT count(*) INTO v FROM public.questions q WHERE q.source_reference LIKE
  'm13-y1-qa-v2:Y1:AXR-%' AND q.status='review'::public.content_status;
 IF v<>7 THEN RAISE EXCEPTION 'TASK-308 seven review-only Y1 expected %',v; END IF;

 SELECT count(*) INTO v FROM public.questions q
 JOIN public.questions oldq ON oldq.source_reference=replace(q.source_reference,'m13-y1-qa-v2:','m13-axr-v1:')
 JOIN public.question_keys nk ON nk.question_id=q.id
 JOIN public.question_keys ok ON ok.question_id=oldq.id
 JOIN public.question_options nc ON nc.id::text=nk.payload->>'correct_option_id'
 JOIN public.question_options oc ON oc.id::text=ok.payload->>'correct_option_id'
 WHERE q.source_reference LIKE 'm13-y1-qa-v2:Y1:AXR-%'
  AND q.status='review'::public.content_status
  AND oldq.status='published'::public.content_status
  AND q.format='Y1'::public.question_format
  AND q.construct_id=oldq.construct_id AND q.source_lesson_id=oldq.source_lesson_id
  AND nc.content_md=oc.content_md
  AND length(trim(q.stem_md))>40
  AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4
  AND (SELECT count(distinct lower(btrim(o.content_md))) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF v<>7 THEN RAISE EXCEPTION 'TASK-308 private correct-answer fidelity + unique distractors invalid %',v; END IF;

 SELECT count(*) INTO v FROM public.questions WHERE source_reference LIKE 'm13-axr-v1:Y1:AXR-%'
   AND status='published'::public.content_status;
 IF v<>210 THEN RAISE EXCEPTION 'TASK-308 touched original published Y1: %',v; END IF;
END
$test308$;
