-- TASK-399 regression: production-only 10 Y1 releases; clean CI with
-- no source-bound question IDs skips after asserting data absence.
DO $task399_regression$
DECLARE n int;bad int;bad_key int;bad_dist int;
BEGIN
 SELECT count(*) INTO n FROM public.question_bank_revisions
 WHERE evidence->>'task'='TASK-399';
 IF n=0 THEN
   RAISE NOTICE 'TASK-399 source-specific items not present in clean bootstrap; skip';
   RETURN;
 END IF;
 IF n<>10 THEN RAISE EXCEPTION 'TASK-399 expected 10 new revisions, got %',n;END IF;

 SELECT count(*) INTO bad FROM public.question_bank_revisions br
 JOIN public.questions original ON original.id=br.source_question_id
 JOIN public.questions revised ON revised.id=br.revision_question_id
 LEFT JOIN public.question_quality_published_revisions snap ON snap.question_id=revised.id
 JOIN public.question_keys k ON k.question_id=revised.id
 WHERE br.evidence->>'task'='TASK-399'
 AND (original.status<>'archived'::public.content_status
      OR revised.status<>'published'::public.content_status
      OR revised.format<>'Y1'::public.question_format
      OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(revised.id)
      OR NOT public.group_mock_eligible(revised.id)
      OR NOT public.is_question_official_mock_eligible(revised.id)
      OR EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=revised.id
             AND f.resolved_at IS NULL AND f.severity IN ('high','critical'))
      OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=revised.id)<>4
      OR (SELECT count(distinct btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=revised.id)<>4
      OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=revised.id
             AND o.id::text=k.payload->>'correct_option_id' AND o.side='a')
     );
 IF bad<>0 THEN RAISE EXCEPTION 'TASK-399 state/keys/fingerprints/eligibility QA failures: %',bad;END IF;

 SELECT count(*) INTO bad_key FROM public.question_bank_revisions br
 JOIN public.question_keys oldkey ON oldkey.question_id=br.source_question_id
 JOIN public.question_keys newkey ON newkey.question_id=br.revision_question_id
 JOIN public.question_options oldopt ON oldopt.question_id=br.source_question_id
      AND oldopt.id::text=oldkey.payload->>'correct_option_id'
 JOIN public.question_options newopt ON newopt.question_id=br.revision_question_id
      AND newopt.id::text=newkey.payload->>'correct_option_id'
 WHERE br.evidence->>'task'='TASK-399'
 AND (oldopt.content_md IS DISTINCT FROM newopt.content_md
       OR oldopt.order_idx IS DISTINCT FROM newopt.order_idx);
 IF bad_key<>0 THEN RAISE EXCEPTION 'TASK-399 old keyed answer term/order unexpectedly altered: %',bad_key;END IF;

 SELECT count(*) INTO bad_dist FROM (
   SELECT br.revision_question_id,
    (SELECT max(wc) FROM (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) wc
      FROM public.question_options o WHERE o.question_id=br.revision_question_id) all_words) maxwc,
    (SELECT min(wc) FROM (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) wc
      FROM public.question_options o WHERE o.question_id=br.revision_question_id) all_words) minwc,
    (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)
      FROM public.question_options o JOIN public.question_keys k ON k.question_id=o.question_id
      WHERE o.question_id=br.revision_question_id AND o.id::text=k.payload->>'correct_option_id') correct_wc,
    (SELECT max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
      FROM public.question_options o JOIN public.question_keys k ON k.question_id=o.question_id
      WHERE o.question_id=br.revision_question_id AND o.id::text<>k.payload->>'correct_option_id') longest_wrong
   FROM public.question_bank_revisions br WHERE br.evidence->>'task'='TASK-399'
 ) z WHERE maxwc>1.6*minwc OR correct_wc>longest_wrong;
 IF bad_dist<>0 THEN RAISE EXCEPTION 'TASK-399 option length restored or correct answer stands out: %',bad_dist;END IF;

 IF (SELECT count(*) FROM public.question_bank_revisions br
   JOIN public.questions q ON q.id=br.revision_question_id
   WHERE br.evidence->>'task'='TASK-399' AND q.group_code='S1.INFO')<>3
 OR (SELECT count(*) FROM public.question_bank_revisions br
   JOIN public.questions q ON q.id=br.revision_question_id
   WHERE br.evidence->>'task'='TASK-399' AND q.group_code='S2.OFFICE')<>3
 OR (SELECT count(*) FROM public.question_bank_revisions br
   JOIN public.questions q ON q.id=br.revision_question_id
   WHERE br.evidence->>'task'='TASK-399' AND q.group_code='S7.SEC')<>4
 THEN RAISE EXCEPTION 'TASK-399 3/3/4 group mix mismatch';END IF;
 RAISE NOTICE 'TASK-399 PASS: 10/10 new questions, original answer terms preserved, balanced distractors, old revision archived, mock-eligible';
END;
$task399_regression$;