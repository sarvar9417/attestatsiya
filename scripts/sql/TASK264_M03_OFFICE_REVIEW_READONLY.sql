-- TASK-264: read-only, no keys or question body disclosed.
-- Canonical four M03 Office lesson pool and review provenance/format audit.
WITH canonical AS (
 SELECT l.id,l.title_uz,l.topic_test_question_count configured,
        (public.topic_test_preview(l.id)->>'available_count')::int available
 FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M03' AND m.status='published' AND l.status='published'
 AND l.id IN ('93000000-0000-4000-8000-000000000001'::uuid,
              '93000000-0000-4000-8000-000000000002'::uuid,
              '93000000-0000-4000-8000-000000000003'::uuid,
              '93000000-0000-4000-8000-000000000004'::uuid)
)
SELECT l.id,l.title_uz,l.configured,l.available,l.configured-l.available AS deficit,
 count(DISTINCT q.id) FILTER(WHERE q.status='review' AND EXISTS(SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id)) AS mapped_keyed_review,
 count(DISTINCT q.id) FILTER(WHERE q.status='review' AND q.format='Y1' AND EXISTS(SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id)) AS review_y1,
 count(DISTINCT q.id) FILTER(WHERE q.status='review' AND q.format='Y2' AND EXISTS(SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id)) AS review_y2,
 count(DISTINCT q.id) FILTER(WHERE q.status='review' AND q.format='Y3' AND EXISTS(SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id)) AS review_y3,
 count(DISTINCT q.id) FILTER(WHERE q.status='review' AND q.source_lesson_id=l.id AND EXISTS(SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id)) AS canonical_source,
 count(DISTINCT q.id) FILTER(WHERE q.status='review' AND q.source_reference IS NULL) AS source_reference_null
FROM canonical l LEFT JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
LEFT JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
LEFT JOIN public.questions q ON q.construct_id=c.id AND q.group_code=c.group_code
GROUP BY l.id,l.title_uz,l.configured,l.available ORDER BY l.id;
