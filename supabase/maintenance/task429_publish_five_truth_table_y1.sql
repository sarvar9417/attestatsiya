-- TASK-429 first corrected Informatika PDF Y1 release — 5 freshly authored questions (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task429_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task429_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',44,'S3.LOGIC.04','e01431ea-f0cf-46e6-9f8d-8bc7bd0ee156'::uuid,'mulohaza','A, B va C mantiqiy o‘zgaruvchilarning barcha sakkiz (000 dan 111 gacha) kombinatsiyasida A → (B ∨ (¬C ∧ A)) ifodasi nechta holatda YOLG‘ON natija beradi?',ARRAY['1 ta','2 ta','3 ta','4 ta']::text[],0,'Faqat A=1,B=0,C=1 bo‘lganda implikatsiyaning old qismi rost, o‘ng qismi yolg‘on. Shuning uchun 8 holatdan faqat bittasida YOLG‘ON natija chiqadi.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',46,'S3.LOGIC.04','e01431ea-f0cf-46e6-9f8d-8bc7bd0ee156'::uuid,'mulohaza','A, B va C mantiqiy o‘zgaruvchilarning barcha sakkiz (000 dan 111 gacha) kombinatsiyasida (A ∨ ¬C) → (¬A ∧ B) ifodasi nechta holatda YOLG‘ON natija beradi?',ARRAY['3 ta','4 ta','5 ta','6 ta']::text[],2,'A,B,C tartibida 000,100,101,110,111 holatlarda implikatsiya rost old shart bilan yolg‘on oqibatga ega bo‘ladi. Jami 5 ta yolg‘on holat; qolgan 3 tasi rost.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',47,'S3.LOGIC.04','e01431ea-f0cf-46e6-9f8d-8bc7bd0ee156'::uuid,'mulohaza','A, B va C mantiqiy o‘zgaruvchilarning barcha sakkiz (000 dan 111 gacha) kombinatsiyasida (¬A ∨ B) → (C ∧ ¬B) ifodasi nechta holatda ROST natija beradi?',ARRAY['2 ta','3 ta','4 ta','5 ta']::text[],1,'Rostlik jadvali 000..111 tartibida hisoblanadi. Natija 001,100,101 kombinatsiyalarda rost, qolgan beshta holatda yolg‘on. Shuning uchun rost holatlar soni 3 ta.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',49,'S3.LOGIC.04','e01431ea-f0cf-46e6-9f8d-8bc7bd0ee156'::uuid,'mulohaza','A, B va C mantiqiy o‘zgaruvchilarning barcha sakkiz (000 dan 111 gacha) kombinatsiyasida (¬A → B) ∨ (C ∧ ¬B) ifodasi nechta holatda ROST natija beradi?',ARRAY['5 ta','6 ta','7 ta','8 ta']::text[],2,'¬A→B ifodasi A∨B ga teng. Natijada butun formula (A∨B)∨(C∧¬B) ≡ A∨B∨C bo‘ladi. Faqat 000 holat yolg‘on, qolgan 7 holat rost.'),
('1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa',50,'S3.LOGIC.04','e01431ea-f0cf-46e6-9f8d-8bc7bd0ee156'::uuid,'mulohaza','A, B va C mantiqiy o‘zgaruvchilarning barcha sakkiz (000 dan 111 gacha) kombinatsiyasida (¬A ∨ C) → (B ∧ ¬C) ifodasi nechta holatda YOLG‘ON natija beradi?',ARRAY['4 ta','5 ta','6 ta','7 ta']::text[],1,'8 kombinatsiyani tekshirishda ifoda 000,001,011,101,111 holatlarida yolg‘on chiqadi. Qolgan 010,100,110 holatlari rost. Shu sabab yolg‘onlar soni 5 ta.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task429_release)<>5 THEN RAISE EXCEPTION 'TASK429_SCOPE_NOT_FIVE'; END IF;
 IF EXISTS (SELECT 1 FROM task429_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK429_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task429_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S3.LOGIC','S1.INFO')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>5 THEN RAISE EXCEPTION 'TASK429_SOURCE_LESSON_DRIFT_%',n; END IF;
 IF EXISTS(SELECT 1 FROM task429_release m JOIN public.questions q ON q.source_reference=
    'task429:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK429_ALREADY_EXISTS'; END IF;
 IF EXISTS(SELECT 1 FROM task429_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK429_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task429:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task429_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task429_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task429_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task429_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>5 THEN RAISE EXCEPTION 'TASK429_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task429_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-429 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task429_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task429_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-429%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>5 THEN RAISE EXCEPTION 'TASK429_POSTFLIGHT_%_OF_5',n; END IF;
 IF EXISTS (SELECT 1 FROM task429_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK429_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;
