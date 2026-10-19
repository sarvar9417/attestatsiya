-- TASK-251: read-only topic-test readiness and unpublished candidate inventory.
-- This script intentionally does not query key payloads and must never publish
-- unreviewed content. Run with a read-only SQL role if possible.
-- AXB M01 chapter practice and M01 reference appendices use separate contracts.
WITH canonical AS (
 SELECT m.code AS module_code, l.id AS lesson_id, l.slug AS lesson_slug,
        coalesce(l.topic_test_question_count,20) AS expected,
        public.topic_test_preview(l.id) AS preview
 FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
 WHERE m.status='published' AND l.status='published' AND m.code<>'M01'
), deficient AS (
 SELECT *,coalesce((preview->>'question_count')::integer,0) AS available,
        greatest(0,expected-coalesce((preview->>'question_count')::integer,0)) AS missing_slots
 FROM canonical
 WHERE coalesce((preview->>'question_count')::integer,0)<expected
)
SELECT d.module_code,d.lesson_slug,d.expected,d.available,d.missing_slots,
       d.preview->>'reason' AS preflight_reason,
       (SELECT count(distinct q.id)
          FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
         WHERE q.status='review' AND q.source_lesson_id=d.lesson_id) AS direct_review_keyed,
       (SELECT count(distinct q.id)
          FROM public.questions q
          JOIN public.lesson_constructs lc ON lc.construct_id=q.construct_id
          JOIN public.question_keys k ON k.question_id=q.id
         WHERE lc.lesson_id=d.lesson_id AND q.status='review') AS construct_review_keyed
FROM deficient d
ORDER BY d.module_code,d.lesson_slug;
