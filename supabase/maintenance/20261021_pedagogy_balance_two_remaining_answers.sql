-- Review-state-only distractor balancing, preserving correct option UUIDs.
-- No published snapshots are changed.
BEGIN;
UPDATE public.question_options
SET content_md=CASE order_idx WHEN 1 THEN 'Yuz mimikasi' WHEN 3 THEN 'Didaktik metod' ELSE content_md END
WHERE question_id='862757b6-cf66-47fb-ad12-2d7b17ce71b5'
AND order_idx IN (1,3) AND EXISTS
 (SELECT 1 FROM public.questions WHERE id='862757b6-cf66-47fb-ad12-2d7b17ce71b5' AND status='review'::public.content_status);
UPDATE public.question_options
SET content_md=CASE order_idx WHEN 1 THEN 'Deduktiv yondashuv' WHEN 2 THEN 'Induktiv yondashuv' ELSE content_md END
WHERE question_id='08d075ec-c50f-4740-968f-12094a594cee'
AND order_idx IN (1,2) AND EXISTS
 (SELECT 1 FROM public.questions WHERE id='08d075ec-c50f-4740-968f-12094a594cee' AND status='review'::public.content_status);
COMMIT;