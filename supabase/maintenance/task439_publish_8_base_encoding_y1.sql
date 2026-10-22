-- TASK-439 first corrected Informatika PDF Y1 release — 8 mixed numerical code/IT base conversion source corrections (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task439_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task439_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',1,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','232ₓ − 173ₓ = 37ₓ tenglikda barcha sonlar bir xil x asosli sanoq sistemasida yozilgan. x ni toping.',ARRAY['8','10','12','16']::text[],0,'232ₓ=2x²+3x+2; 173ₓ=x²+7x+3; 37ₓ=3x+7. Tenglamadan x²−7x−8=0 ⇒ (x−8)(x+1)=0. Asos musbat va raqam7 ishlashi uchun x>7; demak x=8.'),
('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',3,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','151₁₀ dan N₂ soni ayirildi va natija ikkilik yozuvda faqat «1»lardan iborat bo‘ldi. N₂ sifatida qaysi taklif mos?',ARRAY['10000₂','11000₂','101010₂','11100₂']::text[],1,'To‘rtta variantni tekshiramiz: 11000₂=24, 151−24=127₁₀=1111111₂; sharti bajaradi. Boshqa N variantlarida 151−N ikkilikkada nol raqamini ham o‘z ichiga oladi. Savol «variantlardan qaysi» deb cheklanmaganida ko‘plab yechim bo‘lardi.'),
('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',5,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','Ikki ikkilik kasrni ayiring: 101011,1₂ − 10101,01₂. Natijani ikkilikda belgilang.',ARRAY['1010,01₂','10110,01₂','10110,1₂','1011,01₂']::text[],1,'101011,1₂=43,5₁₀; 10101,01₂=21,25₁₀. Ayirma 22,25₁₀. 22₁₀=10110₂, 0,25₁₀=0,01₂; birga 10110,01₂.'),
('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',6,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','Polning eni 1101₂ m, bo‘yi 1021₃ m. Tomoni 31₄ m bo‘lgan kvadrat qism bo‘yalmadi. Bo‘yalgan maydonni ikkilikda toping.',ARRAY['10010001₂','10001000₂','100010001₂','10100001₂']::text[],2,'1101₂=13 m, 1021₃=34 m, 31₄=13 m. Umumiy maydon 13×34=442 m², bo‘yalmagan kvadrat 13²=169 m²; bo‘yalgan 273 m²=100010001₂.'),
('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',7,'S1.INFO.05','05aa9b83-a23b-4393-af4c-565f13b697b0'::uuid,'qollash','Kitob hajmi 1024 KiB. Har sahifada 64 qator, har qatorda 32 belgi bor. Har belgi 1 bayt, boshqa xizmat baytlari yo‘q. Kitob necha sahifadan iborat?',ARRAY['128','256','512','1024']::text[],2,'Bir sahifada 64×32=2048 belgi=2048 bayt. Kitob 1024×1024=1048576 bayt. 1048576/2048=512 sahifa.'),
('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',8,'S1.INFO.05','05aa9b83-a23b-4393-af4c-565f13b697b0'::uuid,'qollash','«ATTESTATIYA» degan 11 ta ASCII belgidan iborat satrni 824 marta bo‘shliqsiz yozib saqladik. Har belgi 8 bit, boshqa xizmat bayti yo‘q. Hajmni KiBda hisoblab eng yaqin butun songa yaxlitlang.',ARRAY['7 KiB','8 KiB','9 KiB','10 KiB']::text[],2,'«ATTESTATIYA» 11 ta lotin harfidan iborat. 824 marta yozilganda 11×824=9064 bayt bo‘ladi. 9064/1024≈8,852 KiB; eng yaqin butun son 9 KiB.'),
('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',9,'S1.INFO.01','047646c2-8685-4fa1-b18f-05bb150c9682'::uuid,'qollash','O‘quvchi «axborotni kompyuter va kommunikatsiya vositalarida izlash, to‘plash, saqlash, qayta ishlash va uzatishning nazariy hamda amaliy usullarini o‘rganadigan fan» ta’rifini o‘qidi. Qaysi fan nazarda tutilgan?',ARRAY['Informatika','Faqat dastur kodini tekshiruvchi kompilatorshunoslik','Faqat robotlarning mexanik qismini o‘rganuvchi mexanika','Faqat elektr kabellarini o‘rganuvchi elektrotexnika']::text[],0,'Informatika axborot, uni ifodalash va qayta ishlash jarayonlari, algoritm, axborot tizimlari va texnologiyalarini o‘rganadigan fan. Elektr kabellari yoki qurilma mexanikasi alohida tor sohaga tegishli.'),
('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',10,'S1.INFO.06','a0100000-0000-4000-8000-000000000006'::uuid,'qollash','Telefon 20 daqiqada 400 KiB axborot oldi. 1 KiB=1024 bayt va 1 bayt=8 bit deb oling. O‘rtacha tezlikni eng yaqin butun bit/sekundga yaxlitlang.',ARRAY['273 bit/s','2730 bit/s','2731 bit/s','4096 bit/s']::text[],2,'20 minut=1200 sekund. 400 KiB=400×1024×8=3276800 bit; 3276800/1200≈2730,67 bit/s. Eng yaqin butun qiymat 2731 bit/s.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task439_release)<>8 THEN RAISE EXCEPTION 'TASK439_SCOPE_NOT_EIGHT'; END IF;
 IF EXISTS (SELECT 1 FROM task439_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK439_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task439_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S3.NUM','S1.INFO')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>8 THEN RAISE EXCEPTION 'TASK439_SOURCE_LESSON_DRIFT_%',n; END IF;
 IF EXISTS(SELECT 1 FROM task439_release m JOIN public.questions q ON q.source_reference=
    'task439:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK439_ALREADY_EXISTS'; END IF;
 IF EXISTS(SELECT 1 FROM task439_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK439_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task439:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task439_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task439_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task439_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task439_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>8 THEN RAISE EXCEPTION 'TASK439_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task439_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-439 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task439_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task439_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-439%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>8 THEN RAISE EXCEPTION 'TASK439_POSTFLIGHT_%_OF_8',n; END IF;
 IF EXISTS (SELECT 1 FROM task439_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK439_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;
