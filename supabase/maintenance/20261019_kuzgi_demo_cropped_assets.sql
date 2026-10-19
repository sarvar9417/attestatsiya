-- Kuzgi demo testlarining Word manbasidan crop qilingan grafikalari.
-- Rasmlar first-party /public/kuzgi-demo/*.svg (PNG/JPG self-contained).
-- Muhim: fayllar frontendga chiqarilgandan KEYIN q04 va q14 ni publish qilish mumkin.
-- Ushbu patch o'zi nashr statusini o'zgartirmaydi.
-- A–D variantlar matnlari q04 grafikdagi nomlariga bog'langan;
-- variantlar serverda aralashtirilsa ham mazmuni to'g'ri qoladi.
--
-- Live database: 2026-10-19 kuni tegishli 11 qator yangilangan.
-- Ushbu skript takroran ishlatishga mos.

WITH graphic(source_ref,images) AS (VALUES
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q01', '[{"kind":"image","diagram_id":"demo_q01_powerpoint","src":"/kuzgi-demo/demo_q01_powerpoint.svg","alt":"PowerPoint ekran yozuvi uchun asl A–D piktogrammalar"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q11', '[{"kind":"image","diagram_id":"demo_q11_access","src":"/kuzgi-demo/demo_q11_access.svg","alt":"MS Access Book jadvali va filtr shartlari"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q18', '[{"kind":"image","diagram_id":"demo_q18_flowchart","src":"/kuzgi-demo/demo_q18_flowchart.svg","alt":"A va B ayirmalari orqali EKUB topish blok-sxemasi"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q04', '[{"kind":"image","diagram_id":"demo_q04_blocks","src":"/kuzgi-demo/demo_q04_blocks.svg","alt":"Scratch dasturining asl bloklari"},{"kind":"image","diagram_id":"demo_q04_options","src":"/kuzgi-demo/demo_q04_options.svg","alt":"Scratch savolining A–D shaklli javoblari"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q14', '[{"kind":"image","diagram_id":"demo_q14_labyrinth","src":"/kuzgi-demo/demo_q14_labyrinth.svg","alt":"Robot harakatlanadigan asl labirint"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q17', '[{"kind":"image","diagram_id":"demo_q17_photoshop","src":"/kuzgi-demo/demo_q17_photoshop.svg","alt":"Photoshopdagi dastlabki va yakuniy portretlar"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q19', '[{"kind":"image","diagram_id":"demo_q19_wordtable","src":"/kuzgi-demo/demo_q19_wordtable.svg","alt":"Word jadvalining oldingi va keyingi holati"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q21', '[{"kind":"image","diagram_id":"demo_q21_css","src":"/kuzgi-demo/demo_q21_css.svg","alt":"CSS natijasidagi veb sahifa namunasi"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q27', '[{"kind":"image","diagram_id":"demo_q27_html","src":"/kuzgi-demo/demo_q27_html.svg","alt":"HTML jadval kodi asl rasmdan"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q34', '[{"kind":"image","diagram_id":"demo_q34_logo","src":"/kuzgi-demo/demo_q34_logo.svg","alt":"LOGO chizgan shakl"}]'::jsonb),
 ('drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q39', '[{"kind":"image","diagram_id":"demo_q39_word","src":"/kuzgi-demo/demo_q39_word.svg","alt":"Matn orqasidagi tasvir namunasi"}]'::jsonb)
)
UPDATE public.questions q
SET assets=coalesce(q.assets,'[]'::jsonb) || g.images
FROM graphic g
WHERE q.source_reference=g.source_ref
 AND q.status IN ('review','published')
 AND NOT EXISTS (
  SELECT 1 FROM jsonb_array_elements(coalesce(q.assets,'[]'::jsonb)) a
  WHERE a->>'diagram_id'=g.images->0->>'diagram_id'
 );

WITH target AS (
 SELECT id FROM public.questions
 WHERE source_reference='drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q04'
   AND status='review'
)
UPDATE public.questions q
SET stem_md='Scratch Pen bloklari natijasida hosil bo‘ladigan shaklni tanlang. Dastur bloklari va A–D grafik variantlari quyidagi asl rasmlarda ko‘rsatilgan.'
FROM target t WHERE q.id=t.id
 AND q.stem_md IS DISTINCT FROM 'Scratch Pen bloklari natijasida hosil bo‘ladigan shaklni tanlang. Dastur bloklari va A–D grafik variantlari quyidagi asl rasmlarda ko‘rsatilgan.';

UPDATE public.question_options o
SET content_md=CASE o.order_idx WHEN 1 THEN 'Rasmdagi A shakl'
  WHEN 2 THEN 'Rasmdagi B shakl' WHEN 3 THEN 'Rasmdagi C shakl'
  WHEN 4 THEN 'Rasmdagi D shakl' END
FROM public.questions q WHERE q.id=o.question_id
 AND q.source_reference='drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q04'
 AND q.status='review'
 AND o.side='a' AND o.order_idx BETWEEN 1 AND 4
 AND o.content_md IS DISTINCT FROM CASE o.order_idx WHEN 1 THEN 'Rasmdagi A shakl'
  WHEN 2 THEN 'Rasmdagi B shakl' WHEN 3 THEN 'Rasmdagi C shakl'
  WHEN 4 THEN 'Rasmdagi D shakl' END;

-- Monitoring: yaroqli 4 ta variant, haqiqiy javob UUIDsi va grafik fayl yo'li.
SELECT q.source_reference,q.status,q.assets
FROM public.questions q
WHERE q.source_reference LIKE 'drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q%'
 AND q.assets @> '[{"kind":"image"}]'::jsonb
ORDER BY q.source_reference;
