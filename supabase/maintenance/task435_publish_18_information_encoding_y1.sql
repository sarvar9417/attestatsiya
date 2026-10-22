-- TASK-435 first corrected Informatika PDF Y1 release — 18 expert-solved quantitative source rewrites (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task435_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task435_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',1,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','Maktabdagi 448 o‘quvchining har biriga 448 kishining barchasini ajrata oladigan bir xil uzunlikdagi minimal ikkilik ID berilgan. Shu kod bilan 1/4 qismi — 112 o‘quvchi IDlarini saqlash uchun necha bayt kerak?',ARRAY['112 bayt','126 bayt','144 bayt','504 bayt']::text[],1,'448 turli kodni ajratish uchun 2⁸=256 yetmaydi, 2⁹=512 yetadi: bir ID 9 bit. 448/4=112 kishi; 112×9=1008 bit, 1008/8=126 bayt.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',2,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','Kitobda 128 sahifa, har sahifada 32 qator, har qatorda 60 belgi bor. Har belgi 8 bit, xizmat metama’lumoti yo‘q. 512 bit/sekund tezlikda uzatish necha daqiqa davom etadi?',ARRAY['60 daqiqa','62 daqiqa','64 daqiqa','66 daqiqa']::text[],2,'Belgi soni 128×32×60=245760, bitlar soni 245760×8=1966080. 512 bit/s bilan vaqt 3840 sekund; 3840/60=64 daqiqa. Asl PDFdagi 3600s va 60min bir xil noto‘g‘ri variantlar bo‘lib, yangi versiyada takrorlar yo‘q.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',3,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','16 bit/belgi kodlashda matndan bitta viloyat nomi bilan unga yondosh vergul va bitta bo‘sh joy o‘chirildi; hajm 26 baytga kamaydi. `Qashqadaryo`, `Surxandaryo`, `Farg‘ona`, `Xorazm` orasida 11 harfli ikki nom bo‘lsa, matnda birinchi uchraganini tanlang. Qaysi nom o‘chirilgan?',ARRAY['Surxandaryo','Farg‘ona','Qashqadaryo','Xorazm']::text[],2,'26 bayt=208 bit, har belgi 16 bit ⇒ 13 belgi o‘chgan. Vergul va bo‘sh joy 2 belgi, nom 11 ta harf. Qashqadaryo va Surxandaryo 11 harfli; shartdagi «birinchi uchragani» qoidasi bo‘yicha Qashqadaryo tanlanadi.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',4,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','960 MB faylning 25%i 6 MB/s, qolgan 720 MBning 1/4 qismi 18 MB/s tezlikda uzatildi. Oxirgi 540 MB uchun avvalgi ikki qismning jami vaqtiga teng vaqt sarflandi. Butun faylning o‘rtacha uzatish tezligi nechchi MB/s?',ARRAY['6 MB/s','9,6 MB/s','12 MB/s','19,2 MB/s']::text[],1,'Birinchi qism 240/6=40 soniya, ikkinchi 180/18=10 soniya. Qolgan 540 MB ham 40+10=50 soniyada uzatiladi; jami 100 soniya. O‘rtacha 960/100=9,6 MB/s.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',5,'S3.LOGIC.02','94000000-0000-4000-8000-000000000002'::uuid,'qollash','Al-Xorazmiy jamoasi 24 kishidan iborat. Mirzo Ulug‘bek jamoasi soni x uchun `(x ≤ 24) OR (x ≥ 28)` rost bo‘lishi shart. Quyidagilardan qaysi umumiy qatnashchilar soni mumkin emas?',ARRAY['44','48','50','62']::text[],2,'Umumiy son 24+x. 44=>x=20, 48=>x=24, 62=>x=38 — berilgan OR shartga mos. 50=>x=26 esa 24 dan katta va 28 dan kichik, demak ikkala shart ham yolg‘on.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',6,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','64 000 Hz, 24-bit, 2 kanalli siqilmagan audio fayl hajmi 120 MiB. Audioyozuv taxminan necha daqiqa davom etgan? Javobni 5 daqiqaga karrali eng yaqin songa yaxlitlang (1 MiB=2²⁰ bayt).',ARRAY['5 daqiqa','10 daqiqa','15 daqiqa','20 daqiqa']::text[],0,'Audio tezligi 64000×24×2/8=384000 bayt/s. Hajm 120×1048576=125829120 bayt. Vaqt ≈327,68s≈5,46 daqiqa, 5 daqiqaga karrali eng yaqin qiymat 5 daqiqa.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',7,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','Pasportda 2 ta lotin bosh harfi (26 imkoniyat) va 7 ta o‘nlik raqam bor. Har bir harf va har bir raqam alohida bir xil uzunlikdagi minimal ikkilik kodda saqlansa, jami nechta bit kerak?',ARRAY['32 bit','38 bit','40 bit','76 bit']::text[],1,'26 harf uchun ceil(log₂26)=5 bit, 0…9 raqamlari uchun ceil(log₂10)=4 bit. Ikki harf 10 bit, yetti raqam 28 bit, jami 38 bit.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',8,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','256×128 piksel rangli tasvir siqilmasdan aniq 40 KiB joy egalladi. Har pikselga bir xil butun sonli bit ajratilgan bo‘lsa, nechta turli rangni kodlash mumkin?',ARRAY['128','256','512','1024']::text[],3,'Piksel soni 256×128=32768. Xotira 40×1024×8=327680 bit; bit/piksel=10. 10 bit bilan 2¹⁰=1024 xil rang kodlanadi.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',9,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','Har lampochka qizil yoki yashil holatdan bittasini oladi. Qurilma kamida 200 turli signal kombinatsiyasi berishi uchun eng kamida nechta mustaqil lampochka kerak?',ARRAY['7','8','9','10']::text[],1,'n lampochkaning holatlari 2ⁿ ta. 2⁷=128 yetmaydi, 2⁸=256 esa kamida 200 ta turli holatni beradi. Minimum n=8.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',11,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','Bir daqiqa davom etgan siqilmagan stereo audio 48 000 Hz, 16 bit/kanal bilan yozildi. Fayl hajmi nechchi KiB? 1 KiB=1024 bayt, sarlavha hisobga olinmaydi.',ARRAY['11 250 KiB','11 520 KiB','5 625 KiB','22 500 KiB']::text[],0,'Bir sekunddagi hajm 48000×16×2/8=192000 bayt. 60 sekundda 11520000 bayt. 1024 ga bo‘lganda 11250 KiB.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',12,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','39 ta ASCII belgidan iborat satr 8 bit/belgi shaklida va shu belgilar 16 bit/belgi shaklida saqlandi. Ikki hajm orasidagi farq necha bayt?',ARRAY['18','29','39','78']::text[],2,'Bir xil 39 belgi 8 bitdan 16 bitga o‘tganda har biriga 8 bit=1 bayt ortadi. Jami 39×1=39 bayt farq. Shart qat’iy fixed-width kodlash deb belgilangan.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',13,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','Stereo 22 000 Hz, 24 bit/kanal audio 120 soniya siqilmasdan yozildi. Hajmni eng yaqin butun MiBga yaxlitlang (1 MiB=2²⁰ bayt).',ARRAY['12 MiB','14 MiB','15 MiB','20 MiB']::text[],2,'Hajm 22000×24×2×120/8=15840000 bayt. 15840000/1048576≈15,106 MiB, yaqin butun son 15 MiB.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',14,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','Server diski 500 GiB, 30%i band. Har kuni 10 xodimning har biri 256 MiB yangi fayl yuboradi. Boshqa o‘zgarishlar bo‘lmasa, qolgan joy necha to‘liq ish kunida to‘ladi? 1 GiB=1024 MiB.',ARRAY['120','130','140','150']::text[],2,'Bo‘sh joy 500×0,70=350 GiB=358400 MiB. Bir kunda 10×256=2560 MiB yig‘iladi. 358400/2560=140 kun.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',16,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','A qabila alifbosida 32 belgi, B qabilada 64 belgi. A 80, B 60 belgidan iborat fixed-length kodli xabar yubordi. Ikkala xabar bit hajmlari yig‘indisi nechaga teng?',ARRAY['760 bit','400 bit','360 bit','780 bit']::text[],0,'32 turli belgi 5 bit, 64 turli belgi 6 bit talab qiladi. 80×5=400 bit va 60×6=360 bit; jami 760 bit.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',17,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','720 MB faylning 1/3 qismi 120 sekundda, yana 25%i 90 sekundda yuklandi. Qolgan qismi 24 Mbit/s=3 MB/s tezlikda olindi. Butun yuklashning o‘rtacha tezligini eng yaqin butun MB/sga yaxlitlang.',ARRAY['1 MB/s','2 MB/s','3 MB/s','4 MB/s']::text[],1,'Dastlab 240 MB/120s=2 MB/s, keyin 180 MB/90s=2 MB/s. Qolgan 300 MB 3 MB/s bilan 100s oladi. Jami 720 MB/310s≈2,323 MB/s, eng yaqin butun 2.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',18,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','160×256 piksel tasvir xotirada 40 KiB joy egallagan. Har piksel mustaqil, bir xil uzunlikda va siqilmasdan kodlangan bo‘lsa, maksimal nechta rang mavjud?',ARRAY['64','128','256','512']::text[],2,'160×256=40960 piksel. 40 KiB=40960 bayt, demak 1 bayt=8 bit/piksel. Har piksel 2⁸=256 xil rangni ifodalay oladi.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',19,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','25×30 sm rasm 300 dpi bilan skanerlandi. Har piksel RGB uchun 3 bayt, siqish yo‘q. 1 dyuym=2,54 sm, 1 MB=10⁶ bayt bo‘lsa, hajm taxminan nechchi MB?',ARRAY['21 MB','31 MB','42 MB','64 MB']::text[],1,'Gorizontal piksel ≈25/2,54×300, vertikal ≈30/2,54×300. Jami ≈10,46 mln piksel, 3 baytdan ≈31,39 mln bayt, yaqin butun MB 31.'),
('1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5',20,'S1.INFO.03','9665a1be-9741-5821-a864-c84e3db38c6c'::uuid,'qollash','6 GiB hajmli flesh-xotira to‘liq bo‘sh. Doimiy yozish tezligi 512 MiB/s bo‘lsa, boshqa kechikishlarsiz to‘ldirish necha sekund davom etadi?',ARRAY['6 soniya','10 soniya','12 soniya','24 soniya']::text[],2,'6 GiB=6×1024=6144 MiB. 6144 MiB / 512 MiB/s=12 sekund. Birliklar ikkalasi binary GiB/MiB bo‘lgani uchun muvofiq hisoblandi.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task435_release)<>18 THEN RAISE EXCEPTION 'TASK435_SCOPE_NOT_EIGHTEEN'; END IF;
 IF EXISTS (SELECT 1 FROM task435_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK435_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task435_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S1.INFO','S3.LOGIC')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>18 THEN RAISE EXCEPTION 'TASK435_SOURCE_LESSON_DRIFT_%',n; END IF;
 IF EXISTS(SELECT 1 FROM task435_release m JOIN public.questions q ON q.source_reference=
    'task435:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK435_ALREADY_EXISTS'; END IF;
 IF EXISTS(SELECT 1 FROM task435_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK435_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task435:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task435_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task435_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task435_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task435_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>18 THEN RAISE EXCEPTION 'TASK435_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task435_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-435 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task435_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task435_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-435%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>18 THEN RAISE EXCEPTION 'TASK435_POSTFLIGHT_%_OF_18',n; END IF;
 IF EXISTS (SELECT 1 FROM task435_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK435_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;
