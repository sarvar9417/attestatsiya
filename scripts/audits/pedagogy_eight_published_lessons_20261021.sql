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
