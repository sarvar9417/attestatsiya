-- M07 Scratch/LOGO 3.0+3.1 production read-only release audit.
-- The user-approved live publication happened before repository merge.
WITH m AS (SELECT id FROM public.modules WHERE code='M07'),
  bank AS (SELECT q.*, l.order_idx, l.status AS lesson_status
           FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
           WHERE l.module_id=(SELECT id FROM m)),
  q31 AS (SELECT * FROM bank WHERE source_reference LIKE 'Scratch-LOGO-2026-v3.1:%'),
  y2valid AS (
    SELECT q.id FROM q31 q JOIN public.question_keys k ON k.question_id=q.id
    WHERE q.format='Y2' AND q.status='published'
    AND (SELECT COUNT(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
    AND (SELECT COUNT(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')=4
    AND (SELECT COUNT(*) FROM jsonb_each_text(k.payload->'pairs') j
      JOIN public.question_options a ON a.id=j.key::uuid AND a.question_id=q.id AND a.side='a'
      JOIN public.question_options b ON b.id=j.value::uuid AND b.question_id=q.id AND b.side='b')=4
    AND (SELECT COUNT(DISTINCT value) FROM jsonb_each_text(k.payload->'pairs'))=4
  ),
  y3valid AS (
    SELECT q.id FROM q31 q JOIN public.question_keys k ON k.question_id=q.id
    WHERE q.format='Y3' AND q.status='published'
    AND jsonb_array_length(k.payload->'order')=4
    AND (SELECT COUNT(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
    AND (SELECT COUNT(DISTINCT value) FROM jsonb_array_elements_text(k.payload->'order'))=4
    AND (SELECT COUNT(*) FROM jsonb_array_elements_text(k.payload->'order') j
      JOIN public.question_options o ON o.id=j.value::uuid AND o.question_id=q.id AND o.side='a')=4
  )
SELECT jsonb_build_object(
  'published_lessons', (SELECT COUNT(*) FROM public.lessons WHERE module_id=(SELECT id FROM m) AND status='published'),
  'published_total', (SELECT COUNT(*) FROM bank WHERE status='published'),
  'v2_published', (SELECT COUNT(*) FROM bank WHERE source_reference LIKE 'Scratch-LOGO-2026-v2:%' AND status='published'),
  'v3_published', (SELECT COUNT(*) FROM bank WHERE source_reference LIKE 'Scratch-LOGO-2026-v3:%' AND status='published'),
  'y2_native_published', (SELECT COUNT(*) FROM q31 WHERE format='Y2' AND status='published'),
  'y3_native_published', (SELECT COUNT(*) FROM q31 WHERE format='Y3' AND status='published'),
  'y2_keys_valid', (SELECT COUNT(*) FROM y2valid),
  'y3_keys_valid', (SELECT COUNT(*) FROM y3valid),
  'v3_1_count', (SELECT COUNT(*) FROM q31),
  'supplementary_exam_quotas', (SELECT COUNT(*) FROM public.blueprint_quotas WHERE group_code='S4.EXT'),
  'duplicate_v3_1_stems', (SELECT COUNT(*) FROM (SELECT stem_md FROM q31 GROUP BY stem_md HAVING COUNT(*)>1) duplicates)
) AS m07_reconciliation;