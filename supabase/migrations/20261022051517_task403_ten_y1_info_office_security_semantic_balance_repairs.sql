-- TASK-403 owner-authorized AI review: 10 high-risk Y1 answer-length fixes
-- Informatics fundamentals (3), Office (3), cybersecurity (4).
-- AI-adapted scenario is not a verbatim textbook/past-paper question.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task403_manifest (
 ref text PRIMARY KEY,grp text NOT NULL,stem text NOT NULL,
 opt0 text NOT NULL,opt1 text NOT NULL,opt2 text NOT NULL,opt3 text NOT NULL,
 key_idx integer NOT NULL,explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task403_manifest VALUES
('ARS-04-001','S1.INFO','Matnni kodlashda ''A'' harfi, ''7'' raqami va ''?'' belgisi alohida element sifatida qaraladi. Shu elementlardan biri «belgi» deb nimaga aytiladi?','Faqat raqamlardan tashkil topgan ketma-ketlik','Belgilar to‘plamini tartibga keltiruvchi qoida','Raqamlar saqlanadigan xotiraning aniq hajmi','Axborotni ifodalovchi alohida ramz',3,'Belgi — axborotni ifodalashda ishlatiladigan bitta alohida ramz: harf, raqam, tinish belgisi yoki boshqa simvol. Belgilar to‘plami esa alifbo deb ataladi.'),
('ARS-04-002','S1.INFO','Dasturga kiritilishi mumkin bo‘lgan barcha ruxsat etilgan harf, raqam va maxsus ramzlar majmui berilgan. Axborotni kodlash nazariyasida alifbo qanday aniqlanadi?','Kodlashda ishlatiladigan belgilar to‘plami','Har bir belgiga mos kodlar ro‘yxati','Alohida belgini ifodalovchi bitlar ketma-ketligi','Kodlangan matnni o‘qiydigan dasturiy modul',0,'Alifbo kodlashda ruxsat etilgan belgilar to‘plamidir. Kod jadvali belgilar bilan kodlar mosligini, kod so‘zi esa alohida belgi yoki xabarning ifodasini bildiradi.'),
('ARS-04-003','S1.INFO','Kodlashda har bir harf yoki xabar oldindan kelishilgan qoida bilan boshqa belgilar ketma-ketligida ifodalanadi. Aynan kod atamasining ta’rifi qaysi?','Belgilar uchun belgilangan barcha kodlarni jamlovchi jadval','Belgiga yoki xabarga mos qoida asosidagi ifoda','Xabarni boshqa qurilmaga uzatish uchun tanlangan kanal','Kodlar ichidagi takroriy belgilarni qisqartirishga xizmat qiladigan usul',1,'Kod — belgiga yoki xabarga qoida asosida moslangan ifoda. Kod jadvali ko‘plab belgilar va kodlar mosligini ko‘rsatadi; uzatish kanali yoki siqish algoritmi boshqa tushunchadir.'),
('ARS-04-006','S1.INFO','O‘quvchi qoidaga ko‘ra kodlangan xabarni shu qoida yordamida tushunarli boshlang‘ich mazmunga qaytardi. Bajarilgan amalni eng aniq tavsiflang.','Kodlangan axborotni asl mazmuniga qaytarish','Ochiq axborotni maxfiy shaklga o‘tkazish jarayoni','Axborotni kamroq bitda saqlash uchun siqish','Tarmoqdagi xabarni ikkinchi qurilmaga qayta yuborish',0,'Dekodlash kodlangan xabarni belgilangan moslik yordamida qayta talqin qilib mazmunini tiklashdir. Siqish, shifrlash yoki qayta uzatish bundan boshqa jarayonlar.'),
('Office_2026_v2|OFF-E03-002|CAM6, 69–83-bet; CAM10–11, 115–137-bet; ICT10, tegishli elektron jadval mavzulari','S2.OFFICE','Excelda B2:B6 kataklariga 2, 4, 6, 8 va 10 yozildi. `=AVERAGE(B2:B6)` natijasi qanday statistik ko‘rsatkichni ifodalaydi?','Sonli qiymatlarning arifmetik o‘rtachasi','Sonli qiymatlarning eng kattasi','Sonli qiymatlarning umumiy yig‘indisi','Sonli qiymatlarning umumiy soni',0,'AVERAGE sonli qiymatlarning arifmetik o‘rtachasini hisoblaydi: (2+4+6+8+10)/5=6. MAX, SUM va COUNT boshqa natijalarni beradi.'),
('Office_2026_v2|OFF-E03-006|CAM6, 69–83-bet; CAM10–11, 115–137-bet; ICT10, tegishli elektron jadval mavzulari','S2.OFFICE','Excelda `=IF(A1>=60,"O‘tdi","O‘tmadi")` formulasi bahoga qarab ikkita matndan birini qaytaradi. IF funksiyasining asosiy vazifasi nima?','Shart rost/yolg‘onligiga qarab natija tanlash','Shartga mos keladigan kataklar sonini hisoblash','Shartga mos kelmaydigan qatorlarni vaqtincha yashirish','Shart qanday bo‘lishidan qat’i nazar sonlarni qo‘shish',0,'IF mantiqiy shartni baholab, u rost yoki yolg‘on bo‘lishiga qarab berilgan ikki natijadan birini qaytaradi. COUNTIF sanash, Filter esa ko‘rsatishni cheklash vazifasini bajaradi.'),
('Office_2026_v2|OFF-P01-006|ICT6, 129–149-bet; CAM7, 36–62-bet','S2.OFFICE','PowerPointda ko‘plab slaydlardagi sarlavha shriftini va umumiy joylashuvini markazdan boshqarish kerak. Slide Master uchun eng to‘g‘ri tavsif qaysi?','Taqdimotdagi bitta obyektga animatsiya berishni boshqaruvchi maxsus panel','Slaydlar orasidagi o‘tish effektlari vaqtini belgilovchi maxsus menyu','Takroriy slayd dizayni va joylashuvlarini boshqaruvchi asos','Taqdimotning har bir slaydi uchun alohida ovoz yozuvchi vosita',2,'Slide Master maket va umumiy dizayn uslublarini markazdan boshqaradi; slaydga qo‘lda berilgan formatlar ayrim joylarda ustuvor bo‘lishi mumkin. Animatsiya va Transition boshqa boshqaruv vositalari.'),
('m13-axr-v1:Y1:AXR-02-026','S7.SEC','Elektron xatda bank domeniga bir harf bilan o‘xshash manzil ko‘rsatilgan va login talab qilingan. Domen nomi o‘xshashligi haqida qaysi xulosa asosli?','Manzil HTTPS bilan boshlansa, domenning haqiqiyligi avtomatik tasdiqlanadi','Domen rasmiy nomga o‘xshasa, havola doim xavfsiz bo‘ladi','Domen o‘xshashligi phishing ehtimolini oshiradi; mustaqil tekshirish kerak','Brauzerdagi qulf belgisi sayt egasining kimligini so‘zsiz kafolatlaydi',2,'O‘xshash domen phishing belgisi bo‘lishi mumkin. HTTPS ulanishni himoyalashga xizmat qiladi, lekin saytning haqiqiy tashkilotga tegishli ekanini o‘zi kafolatlamaydi; mustaqil rasmiy kanal bilan tekshiriladi.'),
('m13-axr-v1:Y1:AXR-03-017','S7.SEC','O‘qituvchi umumiy foydalaniladigan kompyuterda shaxsiy davlat xizmatlari hisobiga kirdi. Ishni tugatgach, hisob ma’lumotini himoyalash uchun qanday chora zarur?','Faqat brauzer oynasini yopib, hisobdan chiqildi deb hisoblash','Parolni brauzer xotirasiga saqlab, keyingi kirishni tezlashtirish','Hisobni boshqa foydalanuvchi uchun ochiq qoldirib, tarixini tozalash','Sessiyadan chiqib, saqlangan ma’lumot qolmaganini tekshirish',3,'Umumiy qurilmada hisobdan chiqish, sessiyaning tugaganini va brauzerda parol yoki maxfiy ma’lumot saqlanmaganini tekshirish kerak. Oynani yopishning o‘zi ba’zan sessiyani tugatmaydi.'),
('m13-axr-v1:Y1:AXR-03-018','S7.SEC','Maktab kompyuterida ransomware faoliyati sezildi va tarmoqdagi boshqa qurilmalarga tarqalish xavfi bor. Hodisaga javob berishning eng mos bosqichlari qaysi?','Izolyatsiya, hodisani tekshirish va mustaqil nusxadan tiklash','Tarmoqdagi boshqa qurilmalarga fayllarni zudlik bilan jo‘natib tarqatish','Faqat antivirusni qayta ishga tushirib, zaxiradan foydalanmaslik','Zararlangan kompyuterni tekshirmasdan barcha akkauntlar parolini yuborish',0,'Ransomware holatida zararlangan qurilmani ajratish, hodisani o‘rganish, tahdidni bartaraf etish va ishonchli mustaqil zaxiradan tiklash xavfni boshqarishning asosiy bosqichlaridir.');
CREATE TEMP TABLE task403_selection ON COMMIT DROP AS
 SELECT q.id original_id,gen_random_uuid() revision_id,m.*
 FROM task403_manifest m JOIN public.questions q ON q.source_reference=m.ref AND q.group_code=m.grp
 WHERE q.status='published'::public.content_status AND q.format='Y1'::public.question_format
   AND EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id
      AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL)
   AND EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
      WHERE snap.question_id=q.id AND snap.content_fingerprint=public.professional_question_fingerprint(q.id))
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions oldlink WHERE oldlink.source_question_id=q.id);
SELECT q.id FROM public.questions q JOIN task403_selection s ON q.id=s.original_id FOR UPDATE OF q;
DO $pre403$
DECLARE c int;wrong int;
BEGIN
 SELECT count(*) INTO c FROM task403_selection;
 -- Clean CI seeds omit some Office_2026_v2 originals that exist in the remote release.
 -- Never skip an original that EXISTS but has the wrong status, flags or key.
 IF c<>(SELECT count(*) FROM task403_manifest) THEN
   IF EXISTS(
     SELECT 1 FROM task403_manifest m
     WHERE NOT EXISTS(SELECT 1 FROM task403_selection s WHERE s.ref=m.ref)
       AND (m.grp<>'S2.OFFICE' OR EXISTS(
         SELECT 1 FROM public.questions q WHERE q.source_reference=m.ref))
   ) THEN
     RAISE EXCEPTION 'TASK-403 unexpected eligible-source drift %/10; missing existing or non-Office original',c;
   END IF;
   RAISE NOTICE 'TASK-403 clean-seed Office originals unavailable: % of 10 will be safely skipped, all other existing original preflight guards remain active',10-c;
 END IF;
 SELECT count(*) INTO wrong
 FROM task403_selection s JOIN public.question_keys k ON k.question_id=s.original_id
 WHERE NOT EXISTS(
   SELECT 1 FROM public.question_options oldopt WHERE oldopt.question_id=s.original_id
    AND oldopt.id::text=k.payload->>'correct_option_id'
    AND oldopt.order_idx=s.key_idx
    AND oldopt.content_md IS NOT DISTINCT FROM
      CASE s.key_idx WHEN 0 THEN s.opt0 WHEN 1 THEN s.opt1 WHEN 2 THEN s.opt2 WHEN 3 THEN s.opt3 END
 )
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.original_id)<>4;
 IF wrong<>0 THEN RAISE EXCEPTION 'TASK-403 old key identity/content changed %',wrong;END IF;
END;
$pre403$;
INSERT INTO public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
 assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.revision_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 s.stem,q.assets,true,'review'::public.content_status,q.author_id,
 'revision:TASK-403:AI-edited:'||q.id::text||' | source:'||s.ref,
 q.source_lesson_id FROM task403_selection s JOIN public.questions q ON q.id=s.original_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.revision_id,'a',v.ordinal,v.txt
FROM task403_selection s CROSS JOIN LATERAL
 (VALUES(0,s.opt0),(1,s.opt1),(2,s.opt2),(3,s.opt3)) v(ordinal,txt);
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT s.revision_id,
 jsonb_set(k.payload,'{correct_option_id}',to_jsonb(opt.id::text),false),
 s.explanation FROM task403_selection s
 JOIN public.question_keys k ON k.question_id=s.original_id
 JOIN public.question_options opt ON opt.question_id=s.revision_id
   AND opt.order_idx=s.key_idx AND opt.side='a';

DO $opt403$
DECLARE invalid_count int;
BEGIN
 SELECT count(*) INTO invalid_count FROM task403_selection s
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
 IF invalid_count<>0 THEN RAISE EXCEPTION 'TASK-403 answer-length balance or key failed: %',invalid_count;END IF;
END;
$opt403$;

INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT s.original_id,s.revision_id,'owner_ai_y1_option_length_semantic_repair',
 jsonb_build_object(
 'task','TASK-403','delegated_AI_editorial_20261021',true,
 'original_key_text_exact',true,'new_stem_AI_authored',true,'reviewed_distractors_and_reason',true,
 'human_independent_editor',false,'exam_attempts_modified',false,'group',s.grp,'original_source_reference',s.ref)
FROM task403_selection s;
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task403_selection s WHERE q.id=s.revision_id AND q.status='review'::public.content_status;
UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
FROM task403_selection s WHERE q.id=s.original_id AND q.status='published'::public.content_status;
UPDATE public.question_quality_published_revisions snap SET release_scope=
 'TASK-403 AI-reviewed 10 length-balanced Y1 items; original correct concept preserved; not independent human certified'
FROM task403_selection s WHERE snap.question_id=s.revision_id;
UPDATE public.question_quality_findings f SET resolved_at=now(),
 details=f.details||jsonb_build_object('task','TASK-403','replacement_revision_id',s.revision_id,
  'owner_authorized_AI_review',true,'human_editorial_signature',false)
FROM task403_selection s
WHERE f.question_id=s.original_id AND f.finding_code IN
  ('y1_answer_length_high_risk','y1_correct_answer_strictly_longest');

DO $post403$
DECLARE bad_count int;
BEGIN
 SELECT count(*) INTO bad_count FROM task403_selection s
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
 IF bad_count<>0 THEN RAISE EXCEPTION 'TASK-403 archive, fingerprint, or mock eligibility failed: %',bad_count;END IF;
END;
$post403$;
COMMIT;