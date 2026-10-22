-- M11 HTML/CSS module exam readiness, read-only.
-- Generated 2026-10-22; never publishes or changes question keys.
WITH target AS (
 SELECT id FROM public.modules WHERE code = 'M11' AND status='published'
), eligible_constructs AS (
 SELECT DISTINCT c.id, c.group_code
 FROM public.lessons l
 JOIN target t ON l.module_id=t.id
 JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
 JOIN public.constructs c ON c.id=lc.construct_id
 WHERE l.status='published' AND c.is_active
), eligible_questions AS (
 SELECT DISTINCT q.id
 FROM eligible_constructs ec
 JOIN public.questions q ON q.construct_id=ec.id
  AND q.group_code=ec.group_code AND q.status='published'
 JOIN public.question_keys k ON k.question_id=q.id
), review_queue AS (
 SELECT q.id, q.is_generated, l.status AS lesson_status
 FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
 JOIN target t ON t.id=l.module_id
 WHERE q.status='review'
)
SELECT (SELECT count(*) FROM eligible_questions) AS eligible_now,
       greatest(50-(SELECT count(*) FROM eligible_questions),0) AS shortfall,
       (SELECT count(*) FROM review_queue) AS review_total,
       (SELECT count(*) FROM review_queue WHERE is_generated) AS generated_review,
       (SELECT count(*) FROM review_queue WHERE lesson_status='published') AS review_in_published_lessons;
