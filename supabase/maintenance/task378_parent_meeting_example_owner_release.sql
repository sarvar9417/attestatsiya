-- TASK-378: release the owner's original parent-meeting example, review successor only.
-- Source and explanation reviewed in TASK-376; no independent expert signature is claimed.
-- One-time immutable data cutover through Supabase apply_migration, not CI fresh-schema chain.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='40s';

DO $owner_release$
DECLARE
  v_src constant uuid := '2e951830-a7b7-4788-ac68-1cb3ebf21b31';
  v_rev constant uuid := 'b64b8def-e21f-4e1b-aaeb-97f973cc281e';
  v_actor uuid;
  v_fp text;
  v_valid int;
  v_min int;
  v_max int;
  v_cw int;
  v_wrong int;
  v_key uuid;
  v_uniq int;
BEGIN
  SELECT id INTO STRICT v_actor FROM public.profiles
    WHERE role='admin' AND NOT coalesce(is_blocked,false);
  SELECT public.professional_question_fingerprint(v_src) INTO STRICT v_fp;
  SELECT count(*) INTO v_valid
  FROM public.questions source
  JOIN public.pedagogy_revision_queue queue ON queue.source_question_id=source.id
  JOIN public.questions revision ON revision.id=queue.revision_question_id
  WHERE source.id=v_src AND revision.id=v_rev
    AND source.status='published' AND revision.status='review'
    AND source.group_code='KS' AND revision.group_code='KS'
    AND source.format='Y1' AND revision.format='Y1'
    AND source.source_lesson_id=revision.source_lesson_id
    AND source.construct_id=revision.construct_id
    AND source.subject_id=revision.subject_id
    AND revision.stem_md='O‘quvchining chorakdagi yutuqlari haqida ota-ona bilan uchrashuv yakunida hamkorlikni kuchaytiradigan eng maqbul qaror qaysi?'
    AND NOT EXISTS (SELECT 1 FROM public.pedagogy_owner_release_waivers w WHERE w.question_id=v_rev)
    AND NOT EXISTS (SELECT 1 FROM public.question_bank_revisions br WHERE br.source_question_id=v_src OR br.revision_question_id=v_rev);
  IF v_valid<>1 THEN RAISE EXCEPTION 'TASK378_SOURCE_REVIEW_DRIFT'; END IF;

  SELECT (payload->>'correct_option_id')::uuid INTO STRICT v_key
    FROM public.question_keys WHERE question_id=v_rev;
  IF NOT EXISTS (SELECT 1 FROM public.question_options WHERE id=v_key
    AND question_id=v_rev AND content_md=
      'O‘quvchi ishlaridan aniq dalillar keltirib, ota-ona bilan rivojlanish maqsadi va keyingi amaliy qadamlarni kelishish')
  THEN RAISE EXCEPTION 'TASK378_CORRECT_ANSWER_CHANGED'; END IF;

  SELECT count(*),count(distinct lower(trim(o.content_md))),
         min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)),
         max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)),
         max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER (WHERE o.id=v_key),
         max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER (WHERE o.id<>v_key)
  INTO v_valid,v_uniq,v_min,v_max,v_cw,v_wrong
  FROM public.question_options o WHERE o.question_id=v_rev AND trim(o.side)='a';
  IF v_valid<>4 OR v_uniq<>4 OR v_min=0 OR v_max>v_min*1.8 OR v_cw>v_wrong*1.25
  THEN RAISE EXCEPTION 'TASK378_FOUR_OPTION_BALANCE_FAILED'; END IF;

  INSERT INTO public.pedagogy_owner_release_waivers
   (question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id)
  VALUES (v_rev,v_actor,public.professional_question_fingerprint(v_rev),
   'owner_explicit_no_external_expert_20261018',
   'TASK-378; 2026-10-21 owner instructed production of reviewed pedagogical answers, including the parent-meeting example; earlier no-external-expert waiver; independent human signoff NOT claimed',
   v_src);

  PERFORM public.publish_pedagogy_revision(v_rev,v_actor);

  IF NOT EXISTS(SELECT 1 FROM public.questions WHERE id=v_src AND status='archived')
   OR NOT EXISTS(SELECT 1 FROM public.questions WHERE id=v_rev AND status='published')
   OR NOT EXISTS(SELECT 1 FROM public.pedagogy_published_revisions pp
     WHERE pp.question_id=v_rev AND pp.content_fingerprint=public.professional_question_fingerprint(v_rev))
   OR public.professional_question_fingerprint(v_src) IS DISTINCT FROM v_fp
  THEN RAISE EXCEPTION 'TASK378_POSTFLIGHT_FAILED'; END IF;

  INSERT INTO public.question_bank_revisions
    (source_question_id,revision_question_id,revision_kind,evidence)
  VALUES (v_src,v_rev,'TASK-378-owner-parent-meeting-example',
    jsonb_build_object('date','2026-10-21','release','owner-authorized',
      'expert_claim',false,'correct_option_uuid_preserved',true,
      'source_immutable',true,'source_revision_semantics_checked',true));
END $owner_release$;
COMMIT;
