-- TASK-431 first corrected Informatika PDF Y1 release — 24 independently revised Internet lessons questions (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task431_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task431_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',1,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'bilish','Maktab tarmog‘i Internetga chiqmasa ham ichki kompyuterlar o‘zaro ishlayapti. Qaysi ta’rif Internet va mahalliy tarmoq farqini aniq ko‘rsatadi?',ARRAY['Internet bir idoraning yopiq lokal tarmog‘i; LAN esa global tarmoq','Internet o‘zaro ulangan global tarmoqlar majmui; LAN cheklangan hudud tarmog‘i','Internet faqat veb-serverlar majmui; LAN faqat brauzerlarning to‘plami','Internet bir markaziy serverga teng; LAN mustaqil xizmat protokoli']::text[],1,'Internet — o‘zaro bog‘langan tarmoqlar tarmog‘i. LAN esa bino yoki kampus kabi cheklangan hududni qamrab oladi. LAN Internetga ulanmagan holda ham mahalliy xizmatlarni bajara oladi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',3,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','Tashkilot ofisiga tashqi Internet ulanishini rasmiy xizmat sifatida kim taqdim etadi?',ARRAY['Internet-provayder (ISP)','Domen nomi registratori','Veb-sahifa tahrirlovchi CMS','Mahalliy DNS keshlovchi server']::text[],0,'ISP — internetga chiqishni ta’minlaydigan xizmat ko‘rsatuvchi tashkilot. Domen registratori domen nomini ro‘yxatdan o‘tkazadi, DNS esa nomlarni manzillarga moslaydi; ular o‘z-o‘zidan Internet ulanishini bermaydi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',4,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'bilish','Internet va WWW bir xil emas. WWW qisqartmasining to‘liq yozilishini aniqlang.',ARRAY['Web Wide World','Wide World Web','World Wide Web','World Web Wide']::text[],2,'WWW so‘zma-so‘z World Wide Web. U Internet ustida HTTP(S) va gipermurojaatlardan foydalanadigan veb resurslar tizimidir; Internet WWWdan kengroq tarmoq infratuzilmasidir.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',7,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','Brauzerda ko‘rinadigan sahifaning sarlavha, paragraf va havola kabi semantik tuzilmasini belgilash uchun qaysi texnologiya birinchi navbatda ishlatiladi?',ARRAY['CSS — tashqi ko‘rinish qoidalari','SQL — ma’lumotlar bazasi so‘rovlari','JavaScript — dasturiy xatti-harakat','HTML — sahifa tuzilishi va elementlar']::text[],3,'HTML sahifaning semantik tuzilishini h1, p, a kabi elementlarda ifodalaydi. CSS ko‘rinishni, JavaScript interaktiv xatti-harakatni, SQL esa ma’lumotlarga so‘rovlarni boshqaradi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',8,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','`https://example.org/docs/page.html` yozuvida to‘liq satr nimani bildiradi?',ARRAY['Faqat serverning IP manzilini','Veb resursning URL manzilini','Serverga tegishli MAC manzilini','Faqat HTTP status javobini']::text[],1,'URL — resursni topish uchun ishlatiladigan manzil; u bu misolda https sxemasi, example.org xosti va /docs/page.html yo‘lini o‘z ichiga oladi. IP/MAC yoki HTTP status bilan teng emas.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',10,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','`https://example.org/lesson` URLidagi `https` qismi qanday vazifani bildiradi?',ARRAY['Resursga kirish sxemasini (HTTPS protokolini)','Saytning yuqori darajali domenini (TLD)','Saytdagi hujjatning fayl kengaytmasini','Brauzerning saqlangan kesh papkasini']::text[],0,'URL boshidagi https — sxema/protokol. example.org domen, /lesson yo‘l; sxema resursga qaysi protokol orqali murojaat qilinishini bildiradi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',12,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','`kitob.uz` va `example.org` manzillaridagi `.uz` va `.org` qismlari qanday ataladi?',ARRAY['URLning fragment identifikatorlari','HTTPning autentifikatsiya tokenlari','Yuqori darajali domenlar (TLD)','Server papkalarining kengaytmalari']::text[],2,'Domen nomining eng o‘ngidagi .uz yoki .org kabi bo‘lagi yuqori darajali domen (top-level domain, TLD) deb ataladi. Bu HTTP protokoli, sayt yo‘li yoki autentifikatsiya belgisi emas.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',13,'S6.NET.04','c1200000-0000-4000-8000-000000000004'::uuid,'mulohaza','Foydalanuvchi HTTPS manzilli veb-saytga kiradi. HTTPSning HTTPga nisbatan asosiy texnik afzalligini eng aniq ifodalovchi javobni tanlang.',ARRAY['Saytning barcha xabarlari avtomatik rostligini kafolatlaydi','Ulanishni TLS orqali shifrlaydi va server sertifikatini tekshiradi','Har qanday foydalanuvchi qurilmasini virusdan to‘liq himoya qiladi','Sahifadagi barcha fayllarni doim HTTPdan tezroq yuklaydi']::text[],1,'HTTPS odatda TLS bilan transportdagi ma’lumotni shifrlaydi, uzatilgan axborot yaxlitligini va sertifikat orqali server identifikatsiyasini tekshirishga xizmat qiladi. Bu sayt mazmunining rostligi yoki viruslardan to‘liq himoya kafolati emas.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',14,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'bilish','Brauzer veb-serverdan HTML hujjatini olganda odatda qaysi protokollar oilasi ishlatiladi?',ARRAY['SMTP va POP3','FTP va IMAP','DNS va SSH','HTTP va HTTPS']::text[],3,'Brauzer bilan veb-server o‘rtasidagi veb resurs so‘rov-javoblari HTTP protokoli va uning TLS bilan himoyalangan HTTPS variantida uzatiladi. SMTP/POP3 elektron pochta, FTP fayl ko‘chirish, SSH masofadan boshqarish uchun boshqa vazifada qo‘llanadi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',17,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'mulohaza','Sinf o‘quvchilari maqolaga izoh qoldiradi va mazmunni hamkorlikda tahrirlaydi. Bu holat odatda Web 2.0ning qaysi xususiyatini ko‘rsatadi?',ARRAY['Serverni faqat ma’mur ochishi','Sahifaning faqat statik o‘qilishi','Foydalanuvchi ishtiroki va kontent yaratish','Brauzerdan faqat mahalliy fayl ko‘rish']::text[],2,'Web 2.0 iborasi foydalanuvchi tomonidan kontent yaratish, hamkorlikda tahrirlash va o‘zaro munosabatli xizmatlar bilan bog‘lanadi. Statik faqat o‘qish modeli bilan farqlanadi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',18,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'mulohaza','Quyidagi misollardan qaysi biri foydalanuvchilar birgalikda maqola tahrirlaydigan veb-platformaga mos keladi?',ARRAY['Wikipedia maqolasini hamkorlikda tahrirlash','HTML faylni kompyuterga lokal saqlash','HTTPS protokoli orqali sertifikat tekshirish','URLda domen va papka yo‘lini ajratish']::text[],0,'Wikipedia foydalanuvchilar hamkorlikda sahifalarni yozib tahrirlaydigan ensiklopediya platformasi. Boshqa variantlar platforma emas, fayl va protokol/URL bilan ishlash amallaridir.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',22,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','O‘quvchi qidiruv natijasidagi havolani ochib, HTML, CSS va JavaScript yordamida sahifani ekranda ko‘rmoqda. Sahifani ko‘rsatadigan dastur nima?',ARRAY['DNS rezolver','Qidiruv indeksi','Internet provayderi','Veb-brauzer']::text[],3,'Veb-brauzer HTMLni talqin qilib, sahifani foydalanuvchiga ko‘rsatadi; qidiruv indeksi resurslarni topadi, DNS domen nomini manzilga moslaydi, ISP Internet ulanishini ta’minlaydi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',24,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','Brauzerda A → B → C sahifalarga navbat bilan o‘tildi. C sahifasida `Back` tugmasi bir marta bosilsa, odatda qaysi sahifa ochiladi?',ARRAY['A — eng birinchi sahifa','B — navigatsiya tarixidagi oldingi sahifa','C — joriy sahifaning yangilangan nusxasi','Yangi bo‘sh sahifa — tarix tozalanadi']::text[],1,'Brauzer tarixida A→B→C bo‘lsa C dan bitta Back operatsiyasi B ga qaytaradi. Refresh sahifani yangilaydi, Back esa tarixdagi pozitsiyani bir qadam ortga siljitadi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',25,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','A → B → C navigatsiyadan keyin `Back` bilan B ga qaytildi. Endi hech qanday yangi sahifa ochmasdan `Forward` bosilsa, nima bo‘ladi?',ARRAY['A ga qaytib, B va C tarixdan o‘chadi','B sahifasi qayta yuklanadi, tarix o‘zgarmaydi','C ga, tarixdagi keyingi sahifaga o‘tiladi','Yangi tashqi qidiruv natijalari ochiladi']::text[],2,'Forward tugmasi orqaga qaytgandan keyin brauzer tarixidagi oldinga yo‘nalishda harakat qiladi. B holatidan C ga qaytadi, agar Backdan keyin boshqa URL ochilib tarix tarmog‘i o‘zgartirilmagan bo‘lsa.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',26,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','Hozir ochilgan sahifaning yangilangan tarkibini serverdan qayta olishga urinish uchun qaysi brauzer amalidan foydalaniladi?',ARRAY['Reload / Refresh','Back / Orqaga','Forward / Oldinga','Open new tab']::text[],0,'Reload/Refresh joriy resursni qayta yuklashni boshlaydi (kesh siyosatiga qarab server bilan qayta tekshirishi mumkin). Back va Forward esa navigatsiya tarixidagi sahifalarga o‘tadi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',27,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','O‘quvchi `https://ziyo.uz/dars` kabi to‘liq veb manzilni to‘g‘ridan-to‘g‘ri kiritmoqchi. Brauzerning qaysi qismi buning uchun mo‘ljallangan?',ARRAY['Developer Tools konsoli','Yuklab olishlar ro‘yxati','Veb-sahifadagi pastki status qatori','Manzil satri (address bar)']::text[],3,'To‘liq URL brauzerning manzil satrida kiritiladi. Zamonaviy brauzerlar manzil satriga qidiruv so‘zlarini ham qabul qilishi mumkin, ammo URLni to‘g‘ridan-to‘g‘ri navigatsiya qilish aynan shu element vazifasidir.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',28,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'mulohaza','Brauzer va qidiruv tizimi o‘rtasidagi vazifa farqini to‘g‘ri ifodalagan fikrni toping.',ARRAY['Brauzer manba URLlarini indekslaydi; qidiruv tizimi HTMLni ko‘rsatadi','Brauzer sahifani ochadi va tasvirlaydi; qidiruv tizimi indeksdan resurs topadi','Brauzer faqat domen ro‘yxatdan o‘tkazadi; qidiruv tizimi IP beradi','Brauzer modem vazifasini bajaradi; qidiruv tizimi mahalliy tarmoq yaratadi']::text[],1,'Brauzer veb-resurslarni olish va ekranga tasvirlash dasturi. Qidiruv tizimi so‘rovga tegishli sahifa/resurslarni indeksdan topish xizmati. Brauzer ichidan qidiruvga murojaat qilish mumkin, ammo vazifalari farq qiladi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',30,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'mulohaza','Quyidagi to‘rtta xizmatdan qaysisi asosan umumiy veb-qidiruv tizimi emas, balki ijtimoiy tarmoq hisoblanadi?',ARRAY['Bing','Yandex','Facebook','Yahoo Search']::text[],2,'Bing, Yandex va Yahoo Search umumiy veb qidiruvni taklif qiladi. Facebookning asosiy vazifasi ijtimoiy tarmoq; uning ichki qidiruvi bo‘lsa ham bu xizmatni umumiy veb-qidiruv tizimiga tenglashtirmaydi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',31,'S6.NET.04','c1200000-0000-4000-8000-000000000004'::uuid,'mulohaza','Internetda qidiruv xizmati tanlanayotganda foydalanuvchining qidiruv tarixini kuzatmaslik va maxfiylikka urg‘u berishi bilan tanilgan xizmatni belgilang.',ARRAY['DuckDuckGo','Google Analytics','Google Drive','Google Calendar']::text[],0,'DuckDuckGo umumiy qidiruv tizimi bo‘lib, maxfiylikni asosiy pozitsiyasidan biri sifatida targ‘ib qiladi. Analytics trafik tahlili, Drive fayl saqlash, Calendar taqvim xizmati; qidiruv maxfiyligi bilan tanilgan umumiy veb qidiruv emas.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',32,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'bilish','Bolalar uchun mo‘ljallangan, qidiruv natijalarini yoshga mosroq taqdim qilishga yo‘naltirilgan qidiruv xizmatini belgilang.',ARRAY['Bing Webmaster Tools','Kiddle','Google Search Console','Google Scholar']::text[],1,'Kiddle bolalarga mo‘ljallangan qidiruv interfeysi va filtrlashga urg‘u beradigan xizmat. Webmaster Tools va Search Console sayt egalari uchun, Scholar ilmiy adabiyotlar izlashga yo‘naltirilgan.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',34,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','Kutubxona haqida qidirayotgan o‘quvchi `Samarqand tarixiy kutubxonalar` so‘z birikmasini yozdi. Bu ibora qidiruv tizimi uchun nima vazifasini bajaradi?',ARRAY['Brauzerning standart domeni','Ulanishni shifrlash sertifikati','Qidiruvni ifodalovchi kalit so‘zlar','HTTP javobining holat kodi']::text[],2,'Qidiruvga berilgan mazmunli so‘zlar va iboralar kalit so‘zlar (query terms) bo‘lib, qaysi hujjatlar mosligini baholashda ishlatiladi. Domen, TLS sertifikati yoki HTTP statusdan farqli.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',35,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'qollash','Qidiruvga `Python` deb yozilganda juda keng natijalar chiqdi. Faqat boshlang‘ich darslar uchun natijani toraytirishning samarali usuli qaysi?',ARRAY['Qidiruvni yopib boshqa brauzerga o‘tish','Faqat umumiy `dasturlash` so‘zini qoldirish','Tizim sanasini o‘zgartirib qidiruvni takrorlash','`Python boshlang‘ich dars misollar` kabi aniq kalit iborani ishlatish']::text[],3,'So‘rovni mavzu, auditoriya va maqsadni bildiruvchi so‘zlar bilan aniqlashtirish tegishli natijalarni topishga ko‘maklashadi. Brauzerni almashtirish yoki tizim vaqtini o‘zgartirish qidiruv mazmunini bevosita aniqlashtirmaydi.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',38,'S6.NET.05','c1200000-0000-4000-8000-000000000005'::uuid,'mulohaza','Web 2.0 xizmatida talaba oddiy o‘quvchi emas, muallif sifatida ham qatnashayotganini qaysi holat eng yaxshi ko‘rsatadi?',ARRAY['Talaba mavjud sahifani faqat PDF qilib saqlaydi','Talaba maqolaga izoh yozib, kontentni boshqalar bilan ulashadi','Talaba brauzerning manzil satrini boshqa joyga ko‘chiradi','Talaba o‘zi ko‘rayotgan sahifani yangilab o‘qiydi']::text[],1,'Web 2.0da foydalanuvchining kontent yaratishi, baham ko‘rishi va muloqoti muhim. Faqat ko‘rish, nusxa saqlash yoki sahifani qayta yuklash nashr etilgan materialga faol hissa qo‘shish bilan bir xil emas.'),
('1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX',40,'S6.NET.04','c1200000-0000-4000-8000-000000000004'::uuid,'mulohaza','O‘qituvchi o‘quvchiga Internetdan loyiha uchun material yig‘ishni topshirdi. Qaysi yondashuv maqsadli va mas’uliyatli foydalanishga eng mos?',ARRAY['Topilgan birinchi ma’lumotni manbasini tekshirmay ko‘chirish','Har qanday havolani ochib, kerak bo‘lmagan fayllarni ham yuklash','Faqat ommabop videolarni tanlab, manbalarni solishtirmaslik','Vazifaga mos kalit so‘z bilan izlash, manbani tekshirish va zarur ma’lumotni ajratish']::text[],3,'Maqsadli Internetdan foydalanish savolga mos resurslarni qidirish, ularning ishonchliligini baholash va foydali axborotni tanlashni o‘z ichiga oladi. Manbani tekshirmasdan ko‘chirish akademik va axborot xavfsizligiga ham zarar keltiradi.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task431_release)<>24 THEN RAISE EXCEPTION 'TASK431_SCOPE_NOT_TWENTY_FOUR'; END IF;
 IF EXISTS (SELECT 1 FROM task431_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK431_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task431_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S6.NET')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>24 THEN RAISE EXCEPTION 'TASK431_SOURCE_LESSON_DRIFT_%',n; END IF;
 IF EXISTS(SELECT 1 FROM task431_release m JOIN public.questions q ON q.source_reference=
    'task431:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK431_ALREADY_EXISTS'; END IF;
 IF EXISTS(SELECT 1 FROM task431_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK431_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task431:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task431_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task431_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task431_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task431_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>24 THEN RAISE EXCEPTION 'TASK431_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task431_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-431 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task431_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task431_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-431%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>24 THEN RAISE EXCEPTION 'TASK431_POSTFLIGHT_%_OF_24',n; END IF;
 IF EXISTS (SELECT 1 FROM task431_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK431_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;
