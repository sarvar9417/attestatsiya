-- TASK-397 production regression for five source-preserving AI Y1 rewrites.
-- Fresh CI fixtures can skip source-specific assertions when TASK-397 is absent.
DO $test397$
DECLARE n integer;bad integer; bad_key integer;
BEGIN
 SELECT count(*) INTO n FROM public.question_bank_revisions
 WHERE evidence->>'task'='TASK-397';
 IF n=0 THEN RAISE NOTICE 'TASK-397 production source revisions are absent in fresh CI, skip';RETURN;END IF;
 IF n<>5 THEN RAISE EXCEPTION 'TASK-397 expected 5 published source revisions, got %',n;END IF;
 SELECT count(*) INTO bad
 FROM public.question_bank_revisions br
 JOIN public.questions oldq ON oldq.id=br.source_question_id
 JOIN public.questions newq ON newq.id=br.revision_question_id
 LEFT JOIN public.question_quality_published_revisions snap ON snap.question_id=newq.id
 JOIN public.question_keys k ON k.question_id=newq.id
 WHERE br.evidence->>'task'='TASK-397'
 AND (oldq.status<>'archived'::public.content_status
      OR newq.status<>'published'::public.content_status
      OR newq.format<>'Y1'::public.question_format
      OR newq.group_code<>'S1.INFO'
      OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(newq.id)
      OR NOT public.is_question_official_mock_eligible(newq.id)
      OR NOT public.group_mock_eligible(newq.id)
      OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id)<>4
      OR (SELECT count(distinct btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=newq.id)<>4
      OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=newq.id
             AND o.side='a' AND o.id::text=k.payload->>'correct_option_id')
      OR EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=newq.id
             AND f.resolved_at IS NULL AND f.severity IN ('high','critical'))
     );
 IF bad<>0 THEN RAISE EXCEPTION 'TASK-397 release, fingerprint or answer-key regression: %',bad;END IF;
 SELECT count(*) INTO bad_key FROM public.question_bank_revisions br
 JOIN public.question_keys oldkey ON oldkey.question_id=br.source_question_id
 JOIN public.question_keys newkey ON newkey.question_id=br.revision_question_id
 JOIN public.question_options oo ON oo.question_id=br.source_question_id
       AND oo.id::text=oldkey.payload->>'correct_option_id'
 JOIN public.question_options no ON no.question_id=br.revision_question_id
       AND no.id::text=newkey.payload->>'correct_option_id'
 WHERE br.evidence->>'task'='TASK-397' AND
    (oo.content_md IS DISTINCT FROM no.content_md
     OR oo.order_idx IS DISTINCT FROM no.order_idx);
 IF bad_key<>0 THEN RAISE EXCEPTION 'TASK-397 original correct concept changed: %',bad_key;END IF;
 RAISE NOTICE 'TASK-397 PASS: 5 correct labels preserved, archived originals, live eligibility and immutable fingerprints';
END;
$test397$;
