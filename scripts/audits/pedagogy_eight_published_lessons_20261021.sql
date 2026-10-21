-- READ ONLY: release postflight for Barnoyevak pedagogika theory content.
-- Does not disclose student attempts, private PDF stems or scored answer keys.

WITH released(slug,expected_order) AS (
 VALUES
 ('pedagogika-fan-sifatida-tadqiqot-metodlari',108),
 ('inklyuziv-talim-asoslari-va-moslashtirish',109),
 ('korreksion-pedagogika-mutaxassislik-yonalishlari',110),
 ('pedagogik-mahorat-tort-komponent-va-kasbiy-rivojlanish',113),
 ('baholash-nazariyasi-distraktor-va-test-sifati',114),
 ('moslashtirish-va-ketma-ketlik-topshiriqlari-aniqligi',115),
 ('pedagogik-kreativlik-sifatlari-va-kompetentlik',116),
 ('oqituvchi-nutqining-yetti-kommunikativ-sifati',117)
)
SELECT r.expected_order,l.order_idx,l.slug,l.status::text AS lesson_status,
       m.status::text AS module_status,length(l.body_mdx) AS theory_characters,
       (l.body_mdx LIKE '%**Manba:**%') AS source_label_present,
       (coalesce(l.topic_test_question_count,0)) AS configured_test_target,
       (SELECT count(*) FROM public.questions q WHERE q.source_lesson_id=l.id) AS actual_scored_questions
FROM released r
LEFT JOIN public.lessons l ON l.slug=r.slug
LEFT JOIN public.modules m ON m.id=l.module_id
ORDER BY r.expected_order;

SELECT status::text,count(*) AS lesson_count
FROM public.lessons
WHERE module_id=(SELECT id FROM public.modules WHERE slug='umumiy-pedagogika')
GROUP BY status::text
ORDER BY status::text;

SELECT slug,status::text AS review_status,length(body_mdx) AS theory_characters
FROM public.lessons
WHERE module_id=(SELECT id FROM public.modules WHERE slug='umumiy-pedagogika')
  AND status='review'::content_status
ORDER BY order_idx;

-- Second publication tranche: original source has exactly 38 study cards,
-- and the teacher-reflection theory chapter was expanded before publishing.
SELECT slug,status::text AS lesson_status,order_idx,length(body_mdx) AS theory_characters,
       (SELECT count(*) FROM public.questions q WHERE q.source_lesson_id=l.id) AS scored_questions
FROM public.lessons l
WHERE slug IN ('baholash-nazariyasi-38-savol-takrorlash',
               'pedagogik-refleksiya-va-kasbiy-tashxis')
ORDER BY order_idx;

-- Public RLS is based on published status; a separate SELECT with ROLE anon
-- in the live connection independently returned 18 pedagogika lessons.
SELECT m.slug,m.status::text AS module_status,
       count(*) FILTER(WHERE l.status='published'::content_status) AS published_lessons,
       count(*) FILTER(WHERE l.status='review'::content_status) AS remaining_review
FROM public.modules m
JOIN public.lessons l ON l.module_id=m.id
WHERE m.slug='umumiy-pedagogika'
GROUP BY m.slug,m.status::text;
