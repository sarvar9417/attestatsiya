-- TASK-392: deployment/regression gate for owner-delegated AI QA releases.
-- Never represent AI-only verification as independent human certification.
DO $qa$
DECLARE n int; bad int; old_bad int; other int;
BEGIN
 SELECT count(*) INTO n FROM public.question_quality_published_revisions
 WHERE release_scope LIKE 'TASK-388%' OR release_scope LIKE 'TASK-389%' OR release_scope LIKE 'TASK-391%';
 IF n=0 THEN RAISE NOTICE 'TASK-392: batch not installed in this environment; skip'; RETURN; END IF;
 IF n<>34 THEN RAISE EXCEPTION 'TASK-392 expected 34 revisions; got %',n; END IF;
 SELECT count(*) INTO bad
 FROM public.question_quality_published_revisions snap
 JOIN public.questions newq ON newq.id=snap.question_id
 LEFT JOIN public.question_bank_revisions link ON link.revision_question_id=newq.id
 LEFT JOIN public.questions oldq ON oldq.id=link.source_question_id
 LEFT JOIN public.question_keys k ON k.question_id=newq.id
 WHERE (snap.release_scope LIKE 'TASK-388%' OR snap.release_scope LIKE 'TASK-389%' OR snap.release_scope LIKE 'TASK-391%')
 AND (
  newq.status<>'published'::public.content_status
  OR oldq.status IS DISTINCT FROM 'archived'::public.content_status
  OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(newq.id)
  OR NOT public.is_question_official_mock_eligible(newq.id)
  OR NOT public.group_mock_eligible(newq.id)
  OR k.question_id IS NULL
  OR (newq.format='Y1'::public.question_format AND (
    (SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id AND o.side='a')<>4
    OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=newq.id AND o.id::text=k.payload->>'correct_option_id')
  ))
  OR (newq.format='Y2'::public.question_format AND (
    jsonb_typeof(k.payload->'pairs')<>'object'
    OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id AND o.side='a') NOT BETWEEN 3 AND 6
    OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id AND o.side='a')<>
       (SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id AND o.side='b')
    OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>
       (SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id AND o.side='a')
    OR (SELECT count(distinct p.value) FROM jsonb_each_text(k.payload->'pairs') p)<>
       (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))
    OR EXISTS (
      SELECT 1 FROM jsonb_each_text(k.payload->'pairs') p
      WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=newq.id AND o.side='a' AND o.id::text=p.key)
         OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=newq.id AND o.side='b' AND o.id::text=p.value)
    )
  ))
  OR (newq.format='Y3'::public.question_format AND (
    jsonb_typeof(k.payload->'order')<>'array'
    OR jsonb_array_length(k.payload->'order')<>(SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id)
    OR (SELECT count(distinct x.value) FROM jsonb_array_elements_text(k.payload->'order') x)<>jsonb_array_length(k.payload->'order')
    OR EXISTS(
      SELECT 1 FROM jsonb_array_elements_text(k.payload->'order') x
      WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=newq.id AND o.side='a' AND o.id::text=x.value)
    )
  ))
 );
 IF bad<>0 THEN RAISE EXCEPTION 'TASK-392 snapshot/answer key/official mock errors: %',bad; END IF;
 SELECT count(*) INTO old_bad FROM public.question_quality_findings f
 JOIN public.questions q ON q.id=f.question_id WHERE q.status='published'::public.content_status
 AND f.resolved_at IS NULL
 AND f.finding_code IN ('legacy_y2_all_options_side_a','invalid_matching_option_sides',
 'order_match_instruction_ambiguous','source_key_ambiguity_needs_review');
 IF old_bad<>0 THEN RAISE EXCEPTION 'TASK-392 published critical repair finding remains: %',old_bad; END IF;
 SELECT count(*) INTO other FROM public.question_quality_published_revisions snap
 JOIN public.question_editorial_checks e ON e.question_id=snap.question_id
 WHERE (snap.release_scope LIKE 'TASK-388%' OR snap.release_scope LIKE 'TASK-389%' OR snap.release_scope LIKE 'TASK-391%')
 AND e.answer_verified AND e.reference_verified AND e.wording_verified AND e.original_authorship_verified;
 IF other<>0 THEN RAISE EXCEPTION 'TASK-392 unexpectedly claims human editorial approval: %',other; END IF;
 RAISE NOTICE 'TASK-392 PASS: 34 published, valid fingerprints/keys, official/group eligible, old archive intact, human signoff not fabricated';
END
$qa$;
