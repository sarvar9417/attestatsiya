-- TASK-404 owner-authorized AI review: 10 high-risk Y1 answer-length fixes
-- Informatics fundamentals (3), Office (3), cybersecurity (4).
-- AI-adapted scenario is not a verbatim textbook/past-paper question.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task404_manifest (
 ref text PRIMARY KEY,grp text NOT NULL,stem text NOT NULL,
 opt0 text NOT NULL,opt1 text NOT NULL,opt2 text NOT NULL,opt3 text NOT NULL,
 key_idx integer NOT NULL,explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task404_manifest VALUES
('ARS-01-060','S1.INFO','Davlat xizmatlari, maktab ta’limi, savdo va kundalik muloqotda axborotni yaratish, undan foydalanish va bilim almashish jamiyat taraqqiyotining asosiy omiliga aylandi. Bu qaysi jamiyat turiga xos?','Sanoatlashgan jamiyat','Raqamli iqtisodiyot','Agrar yo‘nalishdagi jamiyat','Axborotlashgan jamiyat',3,'Axborotlashgan jamiyatda axborotni yaratish, undan foydalanish va bilim almashish keng ijtimoiy-iqtisodiy faoliyatning yetakchi omiliga aylanadi. Raqamli iqtisodiyot bu jarayonning iqtisodiy qismiga e’tibor beradi.'),
('ARS-02-021','S1.INFO','Slaydda mavzuni tushuntirish uchun matn, diagramma va ovozli izoh birgalikda qo‘llangan. Bir nechta axborot shakli uyg‘unlashgan bunday ko‘rinish qanday ataladi?','Grafikli axborot','Kombinatsiyalashgan axborot','Dinamik axborot','Analog axborot',1,'Matn, grafika va audio bir mahsulotda birlashgani uchun bu kombinatsiyalashgan axborotdir. Grafik, dinamik yoki analog tushunchalar axborotning boshqa xususiyatlarini ta’riflaydi.'),
('ARS-04-018','S1.INFO','Internet ulanishida kanalning reklama qilingan maksimal tezligidan ko‘ra amalda foydali ma’lumotning vaqt birligida qancha uzatilishi o‘lchandi. Throughput atamasi nimani anglatadi?','Amalda erishilgan foydali uzatish tezligini','Tarmoq kanalining maksimal nazariy uzatish sig‘imini','Uzatish davomida bir paketning kechikish vaqtini','Aloqa kanalidagi ma’lumot yo‘qotilishining umumiy ulushini',0,'Throughput amalda foydali yetkazib berilgan ma’lumot miqdorining vaqtga nisbatidir. Nazariy kanal sig‘imi bandwidth, kechikish latency va paket yo‘qotish ulushi boshqa ko‘rsatkichlardir.'),
('ARS-05-009','S1.INFO','Raqamli audio yozish tizimida namunalash chastotasi o‘zgarmadi, lekin har bir amplituda namunasining kodlash aniqligi 16 bitdan 24 bitga oshirildi. Audio bit chuqurligi nimani bildiradi?','Bitta namuna amplitudasini kodlash uchun bitlar soni','Bir soniyada analog signaldan olinadigan audio namunalar soni','Bir soniyada uzatilgan raqamli audio oqimining umumiy hajmi','Bitta ovoz yozuvida ishlatiladigan mustaqil kanallarning umumiy soni',0,'Audio bit chuqurligi bitta amplituda namunasi uchun ajratilgan bitlar soni. Namunalash chastotasi soniyadagi namunalar, bitrate esa vaqt birligidagi bitlar miqdoridir.'),
('Office_2026_v2|OFF-E03-012|CAM6, 69–83-bet; CAM10–11, 115–137-bet; ICT10, tegishli elektron jadval mavzulari','S2.OFFICE','Excel jadvalida qiymatlar berilgan mezonga mos kelganda nechta yozuv borligini va shu yozuvlardagi sonlarning yig‘indisini alohida hisoblash talab qilinadi. COUNTIF va SUMIF farqi qaysi?','COUNTIF shartga mos sonlarni qo‘shadi, SUMIF esa yozuvlarni sanaydi','COUNTIF qiymatlarni saralaydi, SUMIF esa mos qatorlarni vaqtincha yashiradi','COUNTIF sanaydi, SUMIF shartga mos qiymatlarni yig‘adi','COUNTIF mos qiymatlarning o‘rtachasini, SUMIF esa eng kattasini topadi',2,'COUNTIF mezonga mos yozuvlar sonini hisoblaydi, SUMIF esa mezonga mos qiymatlarni yig‘adi. Boshqa variantlar ularning vazifalarini almashtirgan yoki AVERAGEIF/MAXIFS kabi hisoblarni chalkashtirgan.'),
('Office_2026_v2|OFF-P02-007|ICT6, 147–157-bet; CAM7, 36–62-bet','S2.OFFICE','PowerPoint Animation Pane’da ikkita animatsiya belgilandi. Birinchi effekt ishlayotgan vaqtda ikkinchi effektni ham boshlash yoki uning tugashini kutish uchun qaysi vaqt sozlamalari farqlanadi?','With Previous birinchi effektdan oldin, After Previous esa bosilganda boshlanadi','With Previous avvalgisidan keyin, After Previous esa bir vaqtda boshlanadi','With Previous birga, After Previous oldingi tugagach boshlanadi','With Previous faqat slayd almashadi, After Previous esa obyektni o‘chiradi',2,'With Previous avvalgi animatsiya bilan bir vaqtda boshlashga, After Previous esa avvalgi animatsiya tugagach boshlashga xizmat qiladi. On Click bosishga bog‘liq alohida sozlamadir.'),
('Office_2026_v2|OFF-W01-008|ICT5, 48–60-bet; CAM5, 6–23-bet','S2.OFFICE','Word hujjatida tanlangan jumlani bir joydan boshqa joyga ko‘chirish yoki asl joyida qoldirib nusxalash kerak. Ctrl+X va Ctrl+C o‘rtasidagi asosiy farq qaysi?','Ctrl+X asl jumlani qoldiradi, Ctrl+C esa uni joyidan olib tashlaydi','Ctrl+X matnni chop etadi, Ctrl+C faqat uning formatini o‘zgartiradi','Ctrl+X faylni saqlaydi, Ctrl+C esa barcha sahifani qayta tartiblaydi','Ctrl+X manba tanlovni olib tashlaydi, Ctrl+C esa qoldiradi',3,'Ctrl+X kesish bo‘lib tanlangan elementni joyidan olib almashish buferiga o‘tkazadi; Ctrl+C esa asl matnni saqlagan holda nusxalaydi. Ikkisidan keyin Ctrl+V joylashtiradi.'),
('m13-axr-v1:Y1:AXR-02-029','S7.SEC','Maktab xodimlariga yolg‘on login sahifalari va shubhali elektron xatlardan himoyalanish bo‘yicha dastur tuzilmoqda. Inson omili va hisob xavfsizligini birga qamraydigan eng mos kombinatsiya qaysi?','Faqat antivirus yangilanishi, diskni shifrlash va server jurnalini ko‘rish','Tarmoq trafikini o‘lchash, brauzer keshini tozalash va portlarni yopish','Xodim treningi, MFA va shubhali xabarni xabar qilish kanali','Yangi printer olish, parollarni umumiy jadvalda saqlash va xatlarni arxivlash',2,'Xodim treningi phishingni tanib olishga, MFA hisobni qo‘shimcha tasdiqlashga, shubhali xabarni bildirish kanali esa hodisaga tez javob berishga yordam beradi.'),
('m13-axr-v1:Y1:AXR-03-029','S7.SEC','Kompyuter fayllarining zaxirasi tashqi diskka olindi, ammo disk doimo kompyuterga ulangan. Ransomware ikkala joydagi fayllarni ham shifrladi. Asosiy kamchilik nimada?','Diskdagi bo‘sh joy yetarli darajada tekshirilmagan','Zaxira fayllarning nomi muntazam almashtirilmagan','Zaxira asosiy tizimdan yetarlicha ajratilmagan','Diskdagi papkalar alifbo tartibida joylashtirilmagan',2,'Zaxira doim asosiy kompyuterga ulab qo‘yilgani uchun ransomware unga ham yetib borgan. Offline yoki mantiqan ajratilgan va versiyalangan zaxira bunday holat xavfini kamaytiradi.'),
('m13-axr-v1:Y1:AXR-04-020','S7.SEC','Davlat xizmatiga kirishda parol va SMS kodi tekshirildi. Keyin esa tayyorlangan arizani elektron raqamli imzo bilan imzolash so‘raldi. Nima uchun bu ikki bosqich turli vazifani bajaradi?','Biri kiruvchini tasdiqlash, ikkinchisi muayyan hujjatni imzolashga xizmat qiladi','Biri tarmoqni sozlaydi, ikkinchisi esa foydalanuvchining parolini avtomatik almashtiradi','Biri axborotni siqadi, ikkinchisi esa skanerlangan fayl hajmini kichraytiradi','Biri hujjat dizaynini o‘zgartiradi, ikkinchisi esa boshqa foydalanuvchini ro‘yxatga oladi',0,'Parol va SMS kodi hisobga kirayotgan foydalanuvchini autentifikatsiya qiladi; ERI esa muayyan elektron hujjatni imzolash bilan bog‘liq alohida kriptografik amaldir.');
CREATE TEMP TABLE task404_selection ON COMMIT DROP AS
 SELECT q.id original_id,gen_random_uuid() revision_id,m.*
 FROM task404_manifest m JOIN public.questions q ON q.source_reference=m.ref AND q.group_code=m.grp
 WHERE q.status='published'::public.content_status AND q.format='Y1'::public.question_format
   AND EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id
      AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL)
   AND EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
      WHERE snap.question_id=q.id AND snap.content_fingerprint=public.professional_question_fingerprint(q.id))
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions oldlink WHERE oldlink.source_question_id=q.id);
SELECT q.id FROM public.questions q JOIN task404_selection s ON q.id=s.original_id FOR UPDATE OF q;
DO $pre404$
DECLARE c int;wrong int;
BEGIN
 SELECT count(*) INTO c FROM task404_selection;
 IF c<>10 THEN RAISE EXCEPTION 'TASK-404 unmodified eligible original selection changed: %/10',c;END IF;
 SELECT count(*) INTO wrong
 FROM task404_selection s JOIN public.question_keys k ON k.question_id=s.original_id
 WHERE NOT EXISTS(
   SELECT 1 FROM public.question_options oldopt WHERE oldopt.question_id=s.original_id
    AND oldopt.id::text=k.payload->>'correct_option_id'
    AND oldopt.order_idx=s.key_idx
    AND oldopt.content_md IS NOT DISTINCT FROM
      CASE s.key_idx WHEN 0 THEN s.opt0 WHEN 1 THEN s.opt1 WHEN 2 THEN s.opt2 WHEN 3 THEN s.opt3 END
 )
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.original_id)<>4;
 IF wrong<>0 THEN RAISE EXCEPTION 'TASK-404 old key identity/content changed %',wrong;END IF;
END;
$pre404$;
INSERT INTO public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
 assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.revision_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 s.stem,q.assets,true,'review'::public.content_status,q.author_id,
 'revision:TASK-404:AI-edited:'||q.id::text||' | source:'||s.ref,
 q.source_lesson_id FROM task404_selection s JOIN public.questions q ON q.id=s.original_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.revision_id,'a',v.ordinal,v.txt
FROM task404_selection s CROSS JOIN LATERAL
 (VALUES(0,s.opt0),(1,s.opt1),(2,s.opt2),(3,s.opt3)) v(ordinal,txt);
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT s.revision_id,
 jsonb_set(k.payload,'{correct_option_id}',to_jsonb(opt.id::text),false),
 s.explanation FROM task404_selection s
 JOIN public.question_keys k ON k.question_id=s.original_id
 JOIN public.question_options opt ON opt.question_id=s.revision_id
   AND opt.order_idx=s.key_idx AND opt.side='a';

DO $opt404$
DECLARE invalid_count int;
BEGIN
 SELECT count(*) INTO invalid_count FROM task404_selection s
 JOIN public.question_keys k ON k.question_id=s.revision_id
 WHERE (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.revision_id)<>4
  OR (SELECT count(distinct btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=s.revision_id)<>4
  OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=s.revision_id
          AND o.id::text=k.payload->>'correct_option_id')
  OR (SELECT max(w) FROM (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) w
                FROM public.question_options o WHERE o.question_id=s.revision_id) t)
     >1.6*(SELECT min(w) FROM (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) w
                FROM public.question_options o WHERE o.question_id=s.revision_id) t)
  OR (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)
           FROM public.question_options o WHERE o.question_id=s.revision_id AND o.id::text=k.payload->>'correct_option_id')
     >(SELECT max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FROM public.question_options o WHERE o.question_id=s.revision_id AND o.id::text<>k.payload->>'correct_option_id');
 IF invalid_count<>0 THEN RAISE EXCEPTION 'TASK-404 answer-length balance or key failed: %',invalid_count;END IF;
END;
$opt404$;

INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT s.original_id,s.revision_id,'owner_ai_y1_option_length_semantic_repair',
 jsonb_build_object(
 'task','TASK-404','delegated_AI_editorial_20261021',true,
 'original_key_text_exact',true,'new_stem_AI_authored',true,'reviewed_distractors_and_reason',true,
 'human_independent_editor',false,'exam_attempts_modified',false,'group',s.grp,'original_source_reference',s.ref)
FROM task404_selection s;
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task404_selection s WHERE q.id=s.revision_id AND q.status='review'::public.content_status;
UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
FROM task404_selection s WHERE q.id=s.original_id AND q.status='published'::public.content_status;
UPDATE public.question_quality_published_revisions snap SET release_scope=
 'TASK-404 AI-reviewed 10 length-balanced Y1 items; original correct concept preserved; not independent human certified'
FROM task404_selection s WHERE snap.question_id=s.revision_id;
UPDATE public.question_quality_findings f SET resolved_at=now(),
 details=f.details||jsonb_build_object('task','TASK-404','replacement_revision_id',s.revision_id,
  'owner_authorized_AI_review',true,'human_editorial_signature',false)
FROM task404_selection s
WHERE f.question_id=s.original_id AND f.finding_code IN
  ('y1_answer_length_high_risk','y1_correct_answer_strictly_longest');

DO $post404$
DECLARE bad_count int;
BEGIN
 SELECT count(*) INTO bad_count FROM task404_selection s
 JOIN public.questions oldq ON oldq.id=s.original_id
 JOIN public.questions newq ON newq.id=s.revision_id
 LEFT JOIN public.question_quality_published_revisions snap ON snap.question_id=newq.id
 WHERE oldq.status<>'archived'::public.content_status
   OR newq.status<>'published'::public.content_status
   OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(newq.id)
   OR NOT public.is_question_official_mock_eligible(newq.id)
   OR NOT public.group_mock_eligible(newq.id)
   OR EXISTS(SELECT 1 FROM public.question_quality_findings f
          WHERE f.question_id=newq.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF bad_count<>0 THEN RAISE EXCEPTION 'TASK-404 archive, fingerprint, or mock eligibility failed: %',bad_count;END IF;
END;
$post404$;
COMMIT;