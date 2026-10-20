-- M05 scope quality: two unused sign-encoding (not radix-conversion)
-- items fall outside 2026 S3.NUM.01/02/03 competency definitions.
-- Archive-only. No deletion, no changes to questions in previous exams.
BEGIN;
DO $m05$
DECLARE n int; BEGIN
  SELECT COUNT(*) INTO n FROM public.questions q
  JOIN public.lessons l ON l.id=q.source_lesson_id
  JOIN public.modules m ON m.id=l.module_id
  WHERE m.code='M05' AND q.status='published'
  AND q.source_reference IN
    ('m01-professional-bank:AXB-06-030','sanoq-2026:SS-A-009:paper-Y1')
  AND NOT EXISTS (SELECT 1 FROM public.exam_items ei WHERE ei.question_id=q.id);
  IF n<>2 THEN RAISE EXCEPTION 'M05 off-spec prerequisites must be 2 unused questions; got %',n;END IF;
  UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
  WHERE q.status='published'
  AND q.source_reference IN
    ('m01-professional-bank:AXB-06-030','sanoq-2026:SS-A-009:paper-Y1')
  AND EXISTS(SELECT 1 FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
             WHERE l.id=q.source_lesson_id AND m.code='M05')
  AND NOT EXISTS (SELECT 1 FROM public.exam_items ei WHERE ei.question_id=q.id);
END $m05$;
COMMIT;
SELECT q.source_reference,q.status::text FROM public.questions q
WHERE q.source_reference IN ('m01-professional-bank:AXB-06-030','sanoq-2026:SS-A-009:paper-Y1');
