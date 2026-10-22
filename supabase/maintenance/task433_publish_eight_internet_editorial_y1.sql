-- TASK-433 first corrected Informatika PDF Y1 release — 10 freshly authored questions (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task433_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task433_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',2,'S6.NET.01','ab330370-8a99-133c-8593-484d325d5155'::uuid,'mulohaza','Ikki maktabning mustaqil lokal kompyuter tarmoqlari marshrutizatorlar orqali yagona aloqa tizimiga bog‘landi. Bu jarayonni eng aniq qaysi atama ifodalaydi?',ARRAY['Internetworking: mustaqil IP tarmoqlarini marshrutlash orqali o‘zaro ulash.','Link aggregation: bitta kabel o‘rnida parallel interfeyslarni birlashtirish.','Network address translation: private IP manzillarni boshqa adreslarga tarjima qilish.','DNS resolution: domen nomini IP manzilga aylantirish.']::text[],0,'Internetworking bir nechta mustaqil tarmoqni o‘zaro ulash jarayonidir. Original «Internet so‘zi nimaning qisqartmasi» savoli tarixiy/terminologik jihatdan aniq emas; bu tahrir atamani real tarmoq vaziyati orqali sinaydi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',9,'S6.NET.05','dc1441a7-7a25-2d46-f347-58eda433becd'::uuid,'mulohaza','`https://maktab.uz/dars/1?til=uz#top` URLidagi `?til=uz` fragmenti nimani ifodalaydi?',ARRAY['URL sxemasini bildiradi: qaysi uzatish usuli qo‘llanadi.','URL yo‘lini bildiradi: serverdagi resursning joylashuvi.','URL so‘rov satrini bildiradi: parametr nomi va qiymati uzatiladi.','URL fragmentini bildiradi: hujjat ichidagi joy ko‘rsatiladi.']::text[],2,'`?til=uz` query parametridir; `https` scheme, `maktab.uz` host, `#top` esa fragment. Original «URL nechta asosiy qismdan iborat» savolida sanash konvensiyasi ko‘rsatilmagan.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',11,'S6.NET.05','dc1441a7-7a25-2d46-f347-58eda433becd'::uuid,'mulohaza','Brauzerga `https://dars.maktab.uz/kurs/2` manzili kiritildi. Shu URLning host (domen nomi) qismini aniqlang.',ARRAY['`https://dars.maktab.uz` — sxema va hostname birgalikda.','`dars.maktab.uz` — aynan hostname qismi.','`maktab.uz/kurs/2` — registratsiya qilingan domen va yo‘l birgalikda.','`/kurs/2` — resurs yo‘li, hostname qismini o‘z ichiga oladi.']::text[],1,'HTTP URLida authority tarkibidagi hostname `dars.maktab.uz`. `https` sxema, `/kurs/2` yo‘l; shunchaki `.uz` butun domen/host nomi bilan teng emas.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',16,'S6.NET.05','dc1441a7-7a25-2d46-f347-58eda433becd'::uuid,'mulohaza','Maktabning arxiv saytida faqat administrator maqolalarni nashr qiladi; odatiy tashrifchi ularni o‘qishi mumkin, lekin sahifa mazmunini to‘g‘ridan-to‘g‘ri tahrirlay olmaydi. Bu model qaysi tavsifga mos?',ARRAY['Anonim tashrifchilar ham mazmunni bevosita tahrirlashi mumkin bo‘lgan hamkorlikdagi wiki.','Muallif yoki administrator nashr etadigan, tashrifchi esa o‘qiydigan read-only veb modeli.','Brauzer orqali tahrir qilish mumkin, lekin faqat server IP manzili ma’lum bo‘lsa.','Faqat foydalanuvchi yaratgan materialni avtomatik nashr qiluvchi ommaviy forum.']::text[],1,'Web 1.0 deb tavsiflanadigan an’anaviy read-only saytlar ko‘pincha kontentni nashr qiluvchi muharrirga bog‘liq; «faqat veb-dasturchi» degan universal qat’iy qoida noto‘g‘ri.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',20,'S6.NET.05','dc1441a7-7a25-2d46-f347-58eda433becd'::uuid,'mulohaza','Bir veb-ilova ma’lumotlarni mashina o‘qishi mumkin bo‘lgan RDF shaklida ifodalaydi va turli manbalardagi tushunchalarni URI orqali bog‘laydi. Bu yondashuv nimaga yaqin?',ARRAY['RDF graflari va URI identifikatorlar bilan mashina talqin qila oladigan bog‘langan ma’lumotlar.','HTMLda faqat ko‘rinish va rang xossalarini CSS bilan yozish.','REST API orqali ma’lumot almashish, lekin semantik model va ontologiya ishlatmaslik.','Faqat oddiy matnlarni veb-sahifadan nusxalash va butun tarkibni indekslamaslik.']::text[],0,'RDF va URI orqali resurslar semantik tavsifi Linked Data / Semantic Web kontseptsiyasiga xos. «Web 3.0» atamasi esa semantik veb, decentralizatsiya va boshqa turli talqinlarda ishlatiladi, shu bois original savol yagona ma’noga ega emas.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',21,'S6.NET.05','dc1441a7-7a25-2d46-f347-58eda433becd'::uuid,'mulohaza','O‘quv platformasi foydalanuvchining o‘zi tanlagan fanlari va o‘zlashtirish tarixini hisobga olib yangi darslarni tavsiya qiladi. Quyidagi qaysi funksiya aynan shunday moslashuvni amalga oshiradi?',ARRAY['Oldindan tayyorlangan bitta darslar ketma-ketligini barcha foydalanuvchiga ko‘rsatish.','O‘rganish tarixiga qarab tavsiyalarni foydalanuvchiga mos saralash.','Darslarni faqat yaratish sanasi bo‘yicha butun auditoriyaga bir xil tartiblash.','O‘quvchining ehtiyojidan qat’i nazar tasodifiy darsni eng yuqoriga ko‘tarish.']::text[],1,'Tavsiyalash tizimi foydalanuvchi kontekstini inobatga olib tanlovni moslashtiradi; bu xususiyat Web 3.0 bilangina cheklanmaydi va original avlodga oid umumiy ifoda noaniq edi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',33,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'mulohaza','Talaba qidiruv tizimiga `python loop` so‘rovini yubordi. Natijada hujjat sarlavhasi, manzili va qisqacha parchalardan iborat ro‘yxat paydo bo‘ldi. Bu ro‘yxat qaysi tushunchaga mos?',ARRAY['Qidiruv natijalari sahifasi (SERP): havola, sarlavha va qisqa mazmunni ko‘rsatadi.','Qidiruv indeksi: bot yig‘gan hujjatlarning server ichidagi qayta qidiriladigan ma’lumotlari.','Brauzer tarixi: foydalanuvchi ilgari ochgan saytlar va tashrif vaqtlarini ko‘rsatadi.','Sayt xaritasi: bitta veb-sayt muallifi belgilagan URL ro‘yxatini taqdim etadi.']::text[],0,'SERP odatda havolalar, sarlavhalar, snippetlar va ba’zan boy natijalardan iborat; original «gipermurojaatlar ro‘yxati» barcha holatlarni to‘liq qamrab olmaydi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',39,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'mulohaza','Onlayn kurs platformasi foydalanuvchining tanlagan mavzulari va oldingi mashg‘ulotlari asosida keyingi video darslarni tartiblaydi. Bu qarorni qaysi mexanizm eng to‘g‘ri tavsiflaydi?',ARRAY['Tavsiyalarni barcha o‘quvchi uchun faqat qo‘shilgan sana bo‘yicha saralash.','Ommaviy trendlar asosida har bir foydalanuvchiga mutlaqo bir xil tavsiya ko‘rsatish.','Har bir o‘quvchining mavzu tanlovi va tarixiga tayangan shaxsiy reytinglash algoritmi.','Mashg‘ulotlar nomining alifbo tartibini yagona tavsiya mexanizmi qilib olish.']::text[],2,'Personalizatsiya tavsiya va ranking algoritmlari bilan bajariladi; buni faqat Web 3.0ning ta’riflovchi xossasi deb olish noto‘g‘ri. Tahrir harakatni konkret ma’lumot asosida sinaydi.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task433_release)<>8 THEN RAISE EXCEPTION 'TASK433_SCOPE_NOT_TEN'; END IF;
 IF EXISTS (SELECT 1 FROM task433_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK433_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task433_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S6.NET')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>8 THEN RAISE EXCEPTION 'TASK433_SOURCE_LESSON_DRIFT_%',n; END IF;

 IF EXISTS (SELECT 1 FROM task433_release m JOIN public.questions q ON q.source_reference LIKE '%:'||m.source_id||':q'||m.source_no::text AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK433_SOURCE_ALREADY_HAS_REVISION'; END IF;
 IF EXISTS(SELECT 1 FROM task433_release m JOIN public.questions q ON q.source_reference=
    'task433:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK433_ALREADY_EXISTS_OR_SOURCE_REWRITE'; END IF;
 IF EXISTS(SELECT 1 FROM task433_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK433_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task433:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task433_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task433_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task433_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task433_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>8 THEN RAISE EXCEPTION 'TASK433_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task433_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-433 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task433_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task433_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-433%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>8 THEN RAISE EXCEPTION 'TASK433_POSTFLIGHT_%_OF_8',n; END IF;
 IF EXISTS (SELECT 1 FROM task433_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK433_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;
