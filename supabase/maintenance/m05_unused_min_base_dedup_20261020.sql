-- M05 only; eliminate six unused near-identical generated minimum-base Y1 items.
-- Six further generated binary minimum-base questions already referenced by exam_items are preserved.
-- Archive only (no deletes); no touches to options/answer keys/exam history.
BEGIN;
DO $m05$
DECLARE n int; BEGIN
  SELECT COUNT(*) INTO n
  FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
  JOIN public.modules m ON m.id=l.module_id WHERE m.code='M05'
  AND q.status='published' AND q.format='Y1'
  AND q.source_reference LIKE 'generated:sanoqSistema:S3.NUM.01:%'
  AND q.stem_md ~ '^1[01]{6,} yozuvi uchun mumkin bo.lgan eng kichik sanoq sistemasi asosi qaysi\?$'
  AND NOT EXISTS(SELECT 1 FROM public.exam_items ei WHERE ei.question_id=q.id);
  IF n<>6 THEN RAISE EXCEPTION 'Unused M05 repeated binary minimum-base items expected=6 actual=%',n;END IF;
  UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
  WHERE q.status='published' AND q.format='Y1'
  AND q.source_reference LIKE 'generated:sanoqSistema:S3.NUM.01:%'
  AND q.stem_md ~ '^1[01]{6,} yozuvi uchun mumkin bo.lgan eng kichik sanoq sistemasi asosi qaysi\?$'
  AND EXISTS(SELECT 1 FROM public.lessons l JOIN public.modules m ON m.id=l.module_id WHERE l.id=q.source_lesson_id AND m.code='M05')
  AND NOT EXISTS(SELECT 1 FROM public.exam_items ei WHERE ei.question_id=q.id);
END $m05$;
COMMIT;
SELECT q.format::text,q.status::text,count(*)
FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
JOIN public.modules m ON m.id=l.module_id WHERE m.code='M05'
GROUP BY 1,2 ORDER BY 1,2;