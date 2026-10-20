-- M05 only, semantic correction of a Y2 fractional-conversion definition.
-- Source: ICT 7-sinf 2021 PDF 13–16; Sanoq_sistemalari_nazariya.tex chapter "Kasrlarni o‘tkazish va davriylik".
-- Preserve question/option UUIDs, correct-answer mapping and historical exam_items.
BEGIN;
DO $m05$
DECLARE
  old_text CONSTANT text:='Kasr raqamlarini butun qismdan ajratib olish';
  new_text CONSTANT text:='Kasr qismini yangi asosga takroriy ko‘paytirib, hosil bo‘lgan ko‘paytmalarning butun qismlarini raqam sifatida yozish';
  qid uuid;
  n int;
BEGIN
  SELECT q.id INTO STRICT qid FROM public.questions q
  JOIN public.lessons l ON l.id=q.source_lesson_id
  JOIN public.modules m ON m.id=l.module_id
  WHERE m.code='M05' AND q.source_reference='m05-20261018:y2y3:038' AND q.format='Y2' AND q.status='published';
  UPDATE public.question_options
     SET content_md=new_text
   WHERE question_id=qid AND side='b' AND content_md=old_text;
  GET DIAGNOSTICS n=ROW_COUNT;
  IF n<>1 AND NOT EXISTS(SELECT 1 FROM public.question_options WHERE question_id=qid AND side='b' AND content_md=new_text)
  THEN RAISE EXCEPTION 'M05 Y2 option changed unexpectedly, old_count=%',n; END IF;
  UPDATE public.question_keys SET explanation_md=replace(explanation_md,old_text,new_text)
  WHERE question_id=qid AND position(old_text in explanation_md)>0;
END $m05$;
COMMIT;
SELECT q.source_reference,o.side,o.content_md
FROM public.questions q JOIN public.question_options o ON o.question_id=q.id
WHERE q.source_reference='m05-20261018:y2y3:038'
AND o.content_md LIKE 'Kasr qismini yangi asosga%';