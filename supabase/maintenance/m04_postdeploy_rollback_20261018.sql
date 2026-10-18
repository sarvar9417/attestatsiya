-- Emergency content-only rollback after deployment. Never delete user results.
-- Once an exam contains newly published questions, do NOT change them blindly;
-- do a controlled incident response preserving attempts and revision history.
BEGIN;
DO $rollback$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM public.exam_items ei JOIN public.questions q ON q.id=ei.question_id
 WHERE q.group_code='S3.LOGIC' AND q.status='published'::public.content_status
 AND (q.source_reference LIKE 'm04-latex2026-v2:%'
 OR q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%' OR q.source_reference LIKE 'specgap-2026:%');
 IF n>0 THEN RAISE EXCEPTION 'M04 rollback blocked: % existing exam items require preservation',n;END IF;
 UPDATE public.questions q SET status='review'::public.content_status,updated_at=now()
 WHERE q.group_code='S3.LOGIC' AND q.status='published'::public.content_status
 AND (q.source_reference LIKE 'm04-latex2026-v2:%'
 OR q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%' OR q.source_reference LIKE 'specgap-2026:%');
END $rollback$;
COMMIT;