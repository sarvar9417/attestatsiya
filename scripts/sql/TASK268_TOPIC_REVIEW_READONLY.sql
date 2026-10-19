-- TASK-268: live readiness and human editorial-signoff gap. READ ONLY.
-- Run as authorized service role; contains no question bodies, answers or personal data.
-- Snapshot may change if other agents publish or archive questions.
WITH lesson AS (
 SELECT l.id, l.slug, l.title_uz, m.code module, l.topic_test_question_count target,
        (public.topic_test_preview(l.id)->>'available_count')::int available,
        public.topic_test_preview(l.id)->>'reason' reason
 FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
 WHERE l.status='published' AND m.status='published'
   AND m.code IN ('M03','M06','M08','M09','M10','M11','M12')
   AND l.topic_test_question_count>0
), pool AS (
 SELECT l.id,
  COUNT(DISTINCT q.id) FILTER(WHERE q.status='review'
      AND EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id)) review_keyed,
  COUNT(DISTINCT q.id) FILTER(WHERE q.status='review'
      AND EXISTS (SELECT 1 FROM public.question_editorial_checks ec
         WHERE ec.question_id=q.id AND ec.answer_verified
           AND ec.reference_verified AND ec.wording_verified
           AND ec.original_authorship_verified)) review_with_full_signoff,
  COUNT(DISTINCT q.id) FILTER(WHERE q.status='review'
     AND (q.stem_md ILIKE '%Rasm ilovasi hali%'
        OR q.assets::text ILIKE '%source_visual_review_required%')) missing_required_visual
 FROM lesson l LEFT JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
 LEFT JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
 LEFT JOIN public.questions q ON q.construct_id=c.id AND q.group_code=c.group_code
 GROUP BY l.id
)
SELECT l.module,l.slug,l.title_uz,l.target,l.available,
 GREATEST(l.target-l.available,0) missing_to_target,
 p.review_keyed,p.review_with_full_signoff,p.missing_required_visual,
 l.reason AS current_production_preflight_reason
FROM lesson l JOIN pool p ON p.id=l.id
WHERE l.available<l.target ORDER BY l.module,l.slug;

-- Separate module totals. DO NOT mistake unsigned review candidates for published availability.
WITH r AS (
 SELECT m.code module,l.id,l.topic_test_question_count target,
    (public.topic_test_preview(l.id)->>'available_count')::int available
 FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
 WHERE m.code IN ('M03','M06','M08','M09','M10','M11','M12')
 AND l.status='published' AND m.status='published'
 AND l.topic_test_question_count>0)
SELECT module,
 COUNT(*) FILTER(WHERE available<target) underfilled_lessons,
 SUM(GREATEST(target-available,0)) missing_published_slots
FROM r GROUP BY module ORDER BY module;

-- P0: identify published Drive-sourced entries without real editorial checks.
-- This is detection only; DO NOT automatically archive or sign off these revisions.
SELECT q.group_code,
 COUNT(*) AS drive_sourced_published,
 COUNT(*) FILTER(WHERE NOT EXISTS(
   SELECT 1 FROM public.question_editorial_checks ec WHERE ec.question_id=q.id
      AND ec.answer_verified AND ec.reference_verified
      AND ec.wording_verified AND ec.original_authorship_verified
      AND NULLIF(btrim(ec.reviewer_notes),'') IS NOT NULL
 )) AS published_without_complete_independent_signoff
FROM public.questions q
WHERE q.status='published'
  AND q.source_reference LIKE 'Drive:Attestatsiya/%'
GROUP BY q.group_code ORDER BY q.group_code;
