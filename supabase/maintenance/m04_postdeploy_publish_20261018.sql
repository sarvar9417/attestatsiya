-- NOT FOR PREDEPLOY EXECUTION. Run ONLY when BOTH frontend and backend production
-- deployments have been verified and an authenticated M04 lesson/exam smoke passes.
-- Owner waived human expert signoff. The technical invariant gate is mandatory.
-- Provide `SET LOCAL app.m04_deployment_verified = 'true';` in this SAME transaction
-- only after actual deployment verification by operator.
BEGIN;
DO $m04_release$
DECLARE v_ready int;v_all int;v_invalid int;
BEGIN
 IF current_setting('app.m04_deployment_verified',true) IS DISTINCT FROM 'true'
 THEN RAISE EXCEPTION 'M04 release blocked: deployment verification token missing';END IF;
 WITH candidates AS (SELECT * FROM public.questions WHERE group_code='S3.LOGIC'
    AND status='review'::public.content_status AND (
      source_reference LIKE 'm04-latex2026-v2:%' OR
      source_reference LIKE 'm04-sourceaudit-20261018-v1:%' OR
      source_reference LIKE 'specgap-2026:%'))
 SELECT count(*) INTO v_ready FROM candidates;
 IF v_ready<>124 THEN RAISE EXCEPTION 'M04: 124 review questions expected, found %',v_ready;END IF;
 SELECT count(*) INTO v_invalid FROM public.questions q LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.group_code='S3.LOGIC' AND q.status='review'::public.content_status
 AND (q.source_reference LIKE 'm04-latex2026-v2:%'
 OR q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%' OR q.source_reference LIKE 'specgap-2026:%')
 AND (k.question_id IS NULL OR q.source_lesson_id IS NULL OR
   (q.format='Y1' AND NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')));
 IF v_invalid>0 THEN RAISE EXCEPTION 'M04: % missing/invalid keys',v_invalid;END IF;
 UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
 WHERE q.group_code='S3.LOGIC' AND q.status='review'::public.content_status
 AND (q.source_reference LIKE 'm04-latex2026-v2:%'
 OR q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%' OR q.source_reference LIKE 'specgap-2026:%');
 GET DIAGNOSTICS v_all=ROW_COUNT;
 IF v_all<>124 THEN RAISE EXCEPTION 'M04 publish changed %, expected 124',v_all;END IF;
 RAISE NOTICE 'M04 published 124 staged questions after deployment signoff';
END $m04_release$;
COMMIT;