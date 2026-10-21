-- TASK-398 owner-authorized AI review: 10 high-risk Y1 answer-length fixes
-- Informatics fundamentals (3), Office (3), cybersecurity (4).
-- AI-adapted scenario is not a verbatim textbook/past-paper question.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task398_manifest (
 ref text PRIMARY KEY,grp text NOT NULL,stem text NOT NULL,
 opt0 text NOT NULL,opt1 text NOT NULL,opt2 text NOT NULL,opt3 text NOT NULL,
 key_idx integer NOT NULL,explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task398_manifest VALUES
('ARS-01-040','S1.INFO','Axborot yaratish, undan foydalanish va bilim almashish iqtisodiy hamda ijtimoiy taraqqiyotning muhim omiliga aylangan. Ushbu holat jamiyat rivojining qaysi turini ifodalaydi?','Sanoatlashgan jamiyat','Agrar yo‘nalishdagi jamiyat','Raqamli iqtisodiyot','Axborotlashgan jamiyat',3,'Axborotlashgan jamiyatda axborotni yaratish, undan foydalanish va bilim almashish jamiyatning yetakchi rivojlanish omillaridan bo‘ladi. Raqamli iqtisodiyot asosan iqtisodiy faoliyatning raqamli tomoniga qaratilgan.'),
('ARS-01-043','S1.INFO','Qog‘oz shakldagi hujjat skanerlanib sonli faylga aylantirildi; u elektron imzo bilan tasdiqlanib, kompyuter tizimi orqali yuborildi. Jarayonda qaysi texnologiya qo‘llangan?','Analog texnologiya','Axborot manbasi','Raqamli texnologiya','Axborot almashinuvi',2,'Skanerlash, elektron faylni qayta ishlash va elektron imzolash raqamli texnologiya amallaridir. Axborot manbasi va axborot almashinuvi esa texnologiya turining aynan nomi emas.'),
('ARS-01-048','S1.INFO','Ekspert maslahat tizimida alomatlar bilan birga «agar belgi kuzatilsa, ehtimoliy xulosa...» kabi sohaga oid qoidalar saqlanadi. Faktlar va qoidalar saqlanadigan qism qanday ataladi?','Ma’lumotlar bazasi','Xulosalash mexanizmi','Qidiruv indeksi','Bilimlar bazasi',3,'Bilimlar bazasi ekspert tizimida sohaga oid fakt va mantiqiy qoidalarni saqlaydi. Xulosalash mexanizmi aynan shu qoidalardan xulosa olish uchun foydalanadi.'),
('gapfill-2026:T060-OFF-004','S2.OFFICE','PowerPointda 2-slayddagi shakl bosilganda taqdimotning 7-slaydiga darhol o‘tish talab qilinadi. Qaysi amal bu interaktiv navigatsiyani bevosita ta’minlaydi?','Shaklga Animation Path o‘rnatib, 7-slayd nomini effektga yozish','Shaklga 7-slaydga olib boruvchi giperhavola yoki action berish','7-slaydga Fade o‘tishini berib, shaklni Slide Master’ga biriktirish','Shaklga Trigger bilan kirish animatsiyasi berib, slayd raqamini ko‘rsatish',1,'Shaklning klik hodisasiga 7-slaydga olib boruvchi giperhavola yoki Action bog‘lanadi. Transition slaydlar o‘rtasidagi umumiy o‘tish, animatsiya esa obyekt xatti-harakatini boshqaradi.'),
('gapfill-2026:T060-OFF-005','S2.OFFICE','Word hujjatida asosiy sarlavha va uning ostidagi bo‘lim sarlavhasi Navigation Pane va avtomatik mundarijada ierarxiya sifatida chiqishi kerak. Qaysi uslub jufti mos?','Asosiy sarlavhaga Title, bo‘lim sarlavhasiga Subtitle uslubini berish','Asosiy sarlavhaga Heading 1, bo‘lim sarlavhasiga Heading 2 uslubini berish','Asosiy sarlavhaga Heading 2, bo‘lim sarlavhasiga esa Heading 1 berish','Asosiy sarlavhani Bold, bo‘lim sarlavhasini Italic qilib formatlash',1,'Word''dagi Heading 1 va Heading 2 uslublari matnning tuzilmaviy darajasini belgilaydi. Oddiy qalin yoki kursiv format tuzilmaviy darajani o‘zi belgilamaydi.'),
('Office_2026_v2|OFF-E03-007|CAM6, 69–83-bet; CAM10–11, 115–137-bet; ICT10, tegishli elektron jadval mavzulari','S2.OFFICE','Excelda bitta oraliqda sonli kataklar, matnli kataklar va bo‘sh kataklar bor. COUNT va COUNTA funksiyalarining asosiy farqi qaysi javobda to‘g‘ri ko‘rsatilgan?','COUNT matn kiritilgan kataklarni, COUNTA esa faqat sonlarni sanaydi','COUNT sonlarni, COUNTA bo‘sh bo‘lmagan kataklarni sanaydi','COUNT barcha bo‘sh kataklarni, COUNTA esa formulalarni sanaydi','COUNT barcha qiymatlarni qo‘shadi, COUNTA sonlarning o‘rtachasini hisoblaydi',1,'COUNT oraliqdagi son sifatida saqlangan qiymatlarni hisoblaydi; COUNTA esa bo‘sh bo‘lmagan kataklarni hisoblaydi. Bu funksiyalar yig‘indi yoki o‘rtachani topmaydi.'),
('m01-professional-bank:AXB-05-020','S7.SEC','Xabar qabul qiluvchining ochiq kaliti yordamida shifrlanib, mos keluvchi yopiq kalit bilan o‘qiladi. Qaysi kriptografik yondashuv tasvirlangan?','Simmetrik shifrlash','Xesh funksiyasi','Raqamli imzo','Asimmetrik shifrlash',3,'Asimmetrik shifrlash o‘zaro matematik bog‘langan ochiq va yopiq kalitlar juftidan foydalanadi. Simmetrik shifrlashda esa bir xil maxfiy kalit ishlatiladi.'),
('m01-professional-bank:AXB-18-018','S7.SEC','Tizim foydalanuvchi ko‘rsatgan hisob kimga tegishli ekanini parol va bir martalik tasdiqlash kodi bilan tekshirdi. Aynan shaxs ekanini tasdiqlash jarayoni qanday ataladi?','Identifikatsiya','Avtorizatsiya','Autentifikatsiya','Shifrlash',2,'Identifikatsiya foydalanuvchi kimligini da’vo qilishni, autentifikatsiya esa shu da’voni parol yoki kod bilan tekshirishni anglatadi. Avtorizatsiya tasdiqlangan foydalanuvchiga berilgan huquqlarni belgilaydi.'),
('m13-axr-v1:Y1:AXR-01-015','S7.SEC','Ma’lumotlar bazasida bir nechta yozuv noto‘g‘ri tahrirlangan. Administrator qaysi foydalanuvchi, qachon va qaysi amal bilan o‘zgartirganini tekshirmoqchi. Qaysi manba eng foydali?','Zaxira nusxalar va tiklash rejalari','Audit jurnallari va o‘zgartirish tarixi','Faylga kirish huquqlari va ruxsatlar','Raqamli imzolar va sertifikatlar reyestri',1,'Audit jurnallari va o‘zgartirish tarixi voqealar vaqtini, bajarilgan amalni va odatda ijrochining identifikatorini qayd etadi. Zaxira nusxa tiklashga, ruxsat esa amalni cheklashga xizmat qiladi.'),
('m13-axr-v1:Y1:AXR-01-019','S7.SEC','Foydalanuvchi muhim faylni adashib o‘chirdi. Zaxira nusxa mavjud emasligi sabab faylni tiklashning iloji bo‘lmadi. Bu hodisadagi xavf va himoya kamchiligi qaysi juftda aniq?','Tasodifiy o‘chirish xavfi va zaxira nusxa yetishmasligi','Ruxsatsiz o‘qish xavfi va kirish nazoratining zaifligi','Uzatish uzilishi xavfi va aloqa kanalining past tezligi','Parol tarqalishi xavfi va ikki bosqichli tekshiruvning yo‘qligi',0,'Faylning xato bilan o‘chirilishi tasodifiy ma’lumot yo‘qotish xavfidir. Uni qayta tiklab bo‘lmasligi esa zaxira nusxa yo‘qligi bilan bog‘liq.');
CREATE TEMP TABLE task398_selection ON COMMIT DROP AS
 SELECT q.id original_id,gen_random_uuid() revision_id,m.*
 FROM task398_manifest m JOIN public.questions q ON q.source_reference=m.ref AND q.group_code=m.grp
 WHERE q.status='published'::public.content_status AND q.format='Y1'::public.question_format
   AND EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id
      AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL)
   AND EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
      WHERE snap.question_id=q.id AND snap.content_fingerprint=public.professional_question_fingerprint(q.id))
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions oldlink WHERE oldlink.source_question_id=q.id);
SELECT q.id FROM public.questions q JOIN task398_selection s ON q.id=s.original_id FOR UPDATE OF q;
DO $pre398$
DECLARE c int;wrong int;
BEGIN
 SELECT count(*) INTO c FROM task398_selection;
 IF c<>10 THEN RAISE EXCEPTION 'TASK-398 unmodified eligible original selection changed: %/10',c;END IF;
 SELECT count(*) INTO wrong
 FROM task398_selection s JOIN public.question_keys k ON k.question_id=s.original_id
 WHERE NOT EXISTS(
   SELECT 1 FROM public.question_options oldopt WHERE oldopt.question_id=s.original_id
    AND oldopt.id::text=k.payload->>'correct_option_id'
    AND oldopt.order_idx=s.key_idx
    AND oldopt.content_md IS NOT DISTINCT FROM
      CASE s.key_idx WHEN 0 THEN s.opt0 WHEN 1 THEN s.opt1 WHEN 2 THEN s.opt2 WHEN 3 THEN s.opt3 END
 )
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.original_id)<>4;
 IF wrong<>0 THEN RAISE EXCEPTION 'TASK-398 old key identity/content changed %',wrong;END IF;
END;
$pre398$;
INSERT INTO public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
 assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.revision_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 s.stem,q.assets,true,'review'::public.content_status,q.author_id,
 'revision:TASK-398:AI-edited:'||q.id::text||' | source:'||s.ref,
 q.source_lesson_id FROM task398_selection s JOIN public.questions q ON q.id=s.original_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.revision_id,'a',v.ordinal,v.txt
FROM task398_selection s CROSS JOIN LATERAL
 (VALUES(0,s.opt0),(1,s.opt1),(2,s.opt2),(3,s.opt3)) v(ordinal,txt);
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT s.revision_id,
 jsonb_set(k.payload,'{correct_option_id}',to_jsonb(opt.id::text),false),
 s.explanation FROM task398_selection s
 JOIN public.question_keys k ON k.question_id=s.original_id
 JOIN public.question_options opt ON opt.question_id=s.revision_id
   AND opt.order_idx=s.key_idx AND opt.side='a';

DO $opt398$
DECLARE invalid_count int;
BEGIN
 SELECT count(*) INTO invalid_count FROM task398_selection s
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
 IF invalid_count<>0 THEN RAISE EXCEPTION 'TASK-398 answer-length balance or key failed: %',invalid_count;END IF;
END;
$opt398$;

INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT s.original_id,s.revision_id,'owner_ai_y1_option_length_semantic_repair',
 jsonb_build_object(
 'task','TASK-398','delegated_AI_editorial_20261021',true,
 'original_key_text_exact',true,'new_stem_AI_authored',true,'reviewed_distractors_and_reason',true,
 'human_independent_editor',false,'exam_attempts_modified',false,'group',s.grp,'original_source_reference',s.ref)
FROM task398_selection s;
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task398_selection s WHERE q.id=s.revision_id AND q.status='review'::public.content_status;
UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
FROM task398_selection s WHERE q.id=s.original_id AND q.status='published'::public.content_status;
UPDATE public.question_quality_published_revisions snap SET release_scope=
 'TASK-398 AI-reviewed 10 length-balanced Y1 items; original correct concept preserved; not independent human certified'
FROM task398_selection s WHERE snap.question_id=s.revision_id;
UPDATE public.question_quality_findings f SET resolved_at=now(),
 details=f.details||jsonb_build_object('task','TASK-398','replacement_revision_id',s.revision_id,
  'owner_authorized_AI_review',true,'human_editorial_signature',false)
FROM task398_selection s
WHERE f.question_id=s.original_id AND f.finding_code IN
  ('y1_answer_length_high_risk','y1_correct_answer_strictly_longest');

DO $post398$
DECLARE bad_count int;
BEGIN
 SELECT count(*) INTO bad_count FROM task398_selection s
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
 IF bad_count<>0 THEN RAISE EXCEPTION 'TASK-398 archive, fingerprint, or mock eligibility failed: %',bad_count;END IF;
END;
$post398$;
COMMIT;