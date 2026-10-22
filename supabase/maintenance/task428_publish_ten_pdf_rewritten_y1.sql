-- TASK-428 first corrected Informatika PDF Y1 release — 10 freshly authored questions (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task428_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task428_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',2,'S3.LOGIC.02','94000000-0000-4000-8000-000000000002'::uuid,'qollash','x butun son. (x > −4) AND NOT(x ≥ 10) shartini qanoatlantiradigan eng kichik x ni toping.',ARRAY['−4','−3','−2','0']::text[],1,'NOT(x≥10) degani x<10. Shart −4<x<10 bo‘ladi. x butun son deb aniq belgilangan, shuning uchun mumkin qiymatlar −3 dan 9 gacha; ularning eng kichigi −3.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',3,'S3.LOGIC.02','94000000-0000-4000-8000-000000000002'::uuid,'mulohaza','x haqiqiy son. NOT(x ≥ 7) OR (x < 2) ifodasi YOLG‘ON bo‘ladigan barcha x lar to‘plamini tanlang.',ARRAY['x < 7','x ≤ 7','x ≥ 7','x > 7']::text[],2,'NOT(x≥7) ≡ x<7. (x<7) OR (x<2) sharti x<7 ga teng kuchli, demak u x≥7 da yolg‘on bo‘ladi. 7 chegara qiymati ham natijaga kiradi.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',4,'S3.LOGIC.02','94000000-0000-4000-8000-000000000002'::uuid,'qollash','x butun son. (x ≤ 15) AND (x > 0) sharti rost bo‘ladigan eng kichik x ni toping.',ARRAY['0','1','14','15']::text[],1,'Ikki shartning kesishmasi 0<x≤15. x butun son ekani sababli mumkin bo‘lgan birinchi qiymat 1. Nol qat’iy x>0 shartini bajarmaydi.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',8,'S3.LOGIC.02','94000000-0000-4000-8000-000000000002'::uuid,'qollash','x butun son. NOT(x ≤ −5) AND (x < 17) rost bo‘ladigan eng katta x ni aniqlang.',ARRAY['−4','16','17','−5']::text[],1,'NOT(x≤−5) ≡ x>−5. Ikkinchi shart x<17, ya’ni −5<x<17. Butun sonlardan eng kattasi 16; 17 qat’iy yuqori chegaraga kirmaydi.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',9,'S3.LOGIC.02','94000000-0000-4000-8000-000000000002'::uuid,'mulohaza','x haqiqiy son. (x > 1) AND (x < 9) ifodasi YOLG‘ON bo‘ladigan x lar to‘plamini tanlang.',ARRAY['x < 1 yoki x > 9','x ≤ 1 yoki x ≥ 9','1 < x < 9','1 ≤ x ≤ 9']::text[],1,'Kon’yunksiya 1<x<9 da rost. Uning inkori x≤1 yoki x≥9 bo‘ladi. 1 va 9 chegaralarda asl ifoda yolg‘on bo‘lgani uchun ular javobga kiritiladi.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',13,'S3.LOGIC.02','94000000-0000-4000-8000-000000000002'::uuid,'mulohaza','x haqiqiy son. (x ≥ −2) AND (x ≤ 5) ifodasi YOLG‘ON bo‘ladigan x lar to‘plamini belgilang.',ARRAY['x < −2 yoki x > 5','x ≤ −2 yoki x ≥ 5','−2 ≤ x ≤ 5','x < −2 va x > 5']::text[],0,'Asl ifoda yopiq [−2,5] oralig‘ida rost. Uning inkori [−2,5] ning tashqarisi: x<−2 yoki x>5. Chegara −2 va 5 o‘zlari rost to‘plamda.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',14,'S3.LOGIC.02','94000000-0000-4000-8000-000000000002'::uuid,'mulohaza','x haqiqiy son. NOT(x ≥ 0) OR NOT(x < 20) rost bo‘ladigan x lar to‘plamini tanlang.',ARRAY['x < 0 yoki x ≥ 20','x ≤ 0 yoki x > 20','0 ≤ x < 20','x < 0 va x ≥ 20']::text[],0,'De Morgan va inkor qoidalari: NOT(x≥0) = x<0, NOT(x<20) = x≥20. OR sabab ikki oraliqning birlashmasi olinadi; 20 kiradi, 0 kirmaydi.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',59,'S3.LOGIC.02','94000000-0000-4000-8000-000000000002'::uuid,'mulohaza','¬A ↔ B mantiqiy ifodasiga teng kuchli YAGONA formulani toping. (↔ — ekvivalentlik.)',ARRAY['(¬A ∧ B) ∨ (A ∧ ¬B)','(A ∧ B) ∨ (¬A ∧ ¬B)','(¬A ∧ B) ∨ (A ∧ B)','(A ∧ ¬B) ∨ (A ∧ B)']::text[],0,'¬A ↔ B aynan A XOR B ga teng. A,B=00,01,10,11 tartibida rostlik vektori 0,1,1,0; faqat (¬A∧B)∨(A∧¬B) shu vektorni beradi. B varianti XNOR, C faqat B, D faqat A ga teng.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',6,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'mulohaza','215₈ ≤ x ≤ 93₁₆ oraliqdagi JUFT butun sonlarni ikkilikka o‘tkazing. Ikkilik yozuvida ketma-ket «00» bo‘lgan sonlarni chiqarib tashlang. Nechta son qoladi va qolganlar yig‘indisi o‘nlikda nechaga teng?',ARRAY['0 ta son, yig‘indi 0','1 ta son, yig‘indi 142','2 ta son, yig‘indi 288','3 ta son, yig‘indi 432']::text[],0,'215₈=141₁₀ va 93₁₆=147₁₀. Oraliqdagi juftlar 142=10001110₂, 144=10010000₂, 146=10010010₂. Uchalasi ham ketma-ket 00 ni o‘z ichiga oladi; hammasi o‘chiriladi va bo‘sh yig‘indi 0.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',8,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','Ikki xonali xy₉ soni 47₈ ga teng. Bu yerda x va y — to‘qqizlik sanoq sistemasining raqamlari. x·y ko‘paytmasini ikkilik sanoq sistemasida toping.',ARRAY['1001₂','1010₂','1100₂','1101₂']::text[],2,'47₈=4·8+7=39₁₀. 9x+y=39 va 0≤x,y≤8, demak x=4, y=3. Ularning ko‘paytmasi 12₁₀=1100₂.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task428_release)<>10 THEN RAISE EXCEPTION 'TASK428_SCOPE_NOT_TEN'; END IF;
 IF EXISTS (SELECT 1 FROM task428_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK428_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task428_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S3.LOGIC','S1.INFO')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>10 THEN RAISE EXCEPTION 'TASK428_SOURCE_LESSON_DRIFT_%',n; END IF;
 IF EXISTS(SELECT 1 FROM task428_release m JOIN public.questions q ON q.source_reference=
    'task428:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK428_ALREADY_EXISTS'; END IF;
 IF EXISTS(SELECT 1 FROM task428_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK428_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task428:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task428_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task428_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task428_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task428_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>10 THEN RAISE EXCEPTION 'TASK428_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task428_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-428 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task428_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task428_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-428%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>10 THEN RAISE EXCEPTION 'TASK428_POSTFLIGHT_%_OF_10',n; END IF;
 IF EXISTS (SELECT 1 FROM task428_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK428_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;
