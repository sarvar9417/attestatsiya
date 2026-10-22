-- TASK-405 owner-authorized AI review: 10 high-risk Y1 answer-length fixes
-- Informatics fundamentals (3), Office (3), cybersecurity (4).
-- AI-adapted scenario is not a verbatim textbook/past-paper question.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task405_manifest (
 ref text PRIMARY KEY,grp text NOT NULL,stem text NOT NULL,
 opt0 text NOT NULL,opt1 text NOT NULL,opt2 text NOT NULL,opt3 text NOT NULL,
 key_idx integer NOT NULL,explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task405_manifest VALUES
('algoritmlash-v3:ALG-V3-B001','S3.ALGO','Ijrochiga boshlang‘ich ma’lumotdan kerakli natijagacha yetish uchun tartiblangan, tushunarli va bajariladigan amallar berilgan. Informatikada algoritm ta’rifi qaysi?','Ma’lumotlarning kompyuterdagi doimiy saqlanish usuli','Ijrochi uchun aniq ko‘rsatmalar ketma-ketligi','Qurilmalar o‘rtasidagi signal uzatish protokoli','Dasturlash tilida yozilgan alohida operator belgisi',1,'Algoritm ijrochi bajara oladigan aniq buyruqlar ketma-ketligidir. U ma’lumotni saqlash texnologiyasi, tarmoq protokoli yoki bitta operatorning o‘zi emas.'),
('algoritmlash-v3:ALG-V3-B012','S3.ALGO','Dastur manfiy sonlar [-8, -3, -5] ichidan eng kattasini qidirmoqda. `max:=0` deb o‘rnatilib, faqat `x>max` bo‘lsa yangilanadi. Xato oqibati qanday?','Natija ro‘yxatda bo‘lmagan 0 bo‘lib qolishi mumkin','Sikl har doim barcha manfiy elementlarni ikki marta ko‘radi','Dastur manfiy sonlar yig‘indisini avtomatik ravishda chiqarib yuboradi','Birinchi manfiy sonlar manfiylik belgisi tufayli nolgacha ko‘paytiriladi',0,'Barcha elementlar manfiy bo‘lgani uchun ularning hech biri boshlang‘ich 0 dan katta emas; max yangilanmay 0 qoladi. Xavfsiz yechim — maxni birinchi elementdan boshlash.'),
('reserve-2026:T060-R3A-ALG-M05','S3.ALGO','Dastur ro‘yxatdagi sonlarning o‘rtachasini `sum/count` bilan hisoblaydi, lekin ro‘yxat bo‘sh bo‘lishi mumkin. Nolga bo‘lish xatosining oldini olish uchun nima zarur?','Bo‘lishdan oldin count=0 holatini tekshirish','Hisoblashdan oldin yig‘indini doimo nolga tushirish','Natijani chiqarishdan oldin hamma sonlarni yaxlitlash','O‘rtacha hisoblashdan oldin eng katta elementni topish',0,'Bo‘sh ro‘yxatda elementlar soni 0 bo‘ladi. `sum/count` ni bajarishdan oldin `count=0` holatini alohida boshqarish nolga bo‘lish xatosining oldini oladi.'),
('gapfill-2026:T060-ALG-003','S3.ALGO','Bir xil kirishlar uchun A va B algoritmlari bir xil to‘g‘ri natija beradi. A to‘rt, B yetti asosiy amal bajaradi. Har bir amal narxi teng bo‘lsa, nima deyish mumkin?','B tezroq bo‘lishi mumkin, chunki ko‘proq asosiy amal bajaradi','A samaraliroq bo‘lishi mumkin, chunki kamroq asosiy amal bajaradi','Ikki algoritm natijasi bir xil, demak barcha resurs sarfi ham teng','A sekinroq bo‘lishi kerak, chunki amallar soni kichikligi zararli',1,'Natija, apparat va amallar narxi teng deb olinsa, kamroq amal bajaradigan A algoritmi samaraliroq bo‘lishi mumkin. Bu haqiqiy vaqtni boshqa omillarsiz qat’iy kafolatlamaydi.'),
('pyjs-2026-v2:J03-007','S4.CODE','JavaScript `switch` operatorida mos `case` ichidagi buyruq bajarildi, ammo `break` yozilmagan. Keyingi `case` tanasiga nisbatan qanday hodisa sodir bo‘lishi mumkin?','Faqat tanlangan case tanasida avtomatik to‘xtab qolish','Keyingi case tanalariga o‘tib ketish','Dastur ichidagi barcha sikllarni to‘xtatib qo‘yish','Tanlangan case uchun majburiy sintaksis xatosi chiqishi',1,'`break` bo‘lmagan `switch` blokida bajarilish keyingi `case` tanalariga ham o‘tishi (fall-through) mumkin. Moslashmagan keyingi `case` yozuvlari alohida shart sifatida qayta tekshirilmaydi.'),
('pyjs-2026-v2:P04-010','S4.CODE','Python dasturida `i=0; while i<5: print(i)` yozilgan, lekin sikl ichida `i` o‘zgarmaydi. Cheksiz takrorlash xavfini qanday bartaraf qilish kerak?','Sikl ichida faqat yangi qiymatlarni chiqarish','Shartga ta’sir qiluvchi holatni yangilash','Siklning barcha natijalarini matnga aylantirib chiqarish','Siklni boshqa funksiyaning ichiga ko‘chirib qo‘yish',1,'`i` qiymati yangilanmasa `i<5` sharti rostligicha qoladi. `i += 1` kabi yangilash yoki mazmunan mos tugash sharti siklni yakunlanadigan qiladi.'),
('pyjs-2026-v2:P05-009','S4.CODE','Python funksiyasi `def f(x=[]): x.append(1); return len(x)` tarzida ta’riflangan. `f()` ikki marta chaqirilganda 1 va 2 qaytishining sababi nima?','O‘zgaruvchan standart ro‘yxat chaqiriqlar orasida saqlanadi','Har chaqiriqda yangi ro‘yxat avtomatik yaratiladi','Standart ro‘yxat faqat birinchi chaqiriqda ishlatiladi','Ro‘yxat argument orqali berilmasa funksiya xato qaytaradi',0,'Python''da o‘zgaruvchan default argument odatda funksiya e’lon qilingan paytda yaratiladi va keyingi chaqiriqlarda qayta ishlatilishi mumkin. `None` sentinel bilan yangi ro‘yxat yaratish xavfsizroq.'),
('m13-axr-v1:Y1:AXR-03-020','S7.SEC','Ishchi fayl xato bilan o‘chirildi; sinxronlash esa o‘chirishni boshqa qurilmalarga ham tarqatdi. Oldingi to‘g‘ri versiya mustaqil zaxirada mavjud. Eng ma’qul tiklash yo‘li qaysi?','Faqat hozirgi sinxron papkadan yana nusxa ko‘chirish','Bulutdagi eng so‘nggi sinxron nusxadan tiklash','Avvalgi versiyasi saqlangan mustaqil zaxiradan tiklash','Fayl nomini o‘zgartirib, eski tarkibni avtomatik qaytarish',2,'Sinxronlash xatoni boshqa nusxalarga tarqatgani uchun avvalgi holati saqlangan alohida, mustaqil zaxiradan tiklash kerak. Oxirgi sinxron versiya ham o‘chirilgan bo‘lishi mumkin.'),
('m13-axr-v1:Y1:AXR-03-027','S7.SEC','Antivirus zararli kodni olib tashladi, ammo u orqali hujumchi foydalanuvchi parolini qo‘lga kiritgan bo‘lishi mumkin. Hisobni himoyalash uchun yana nima zarur?','Toza qurilmada parolni almashtirish, sessiyalar va MFAni tekshirish','Faqat zararlangan kompyuterda eski parolni qayta kiritib tizimga kirish','Parol o‘g‘irlangani taxmin qilinib, avvalgi parolni baribir saqlab qolish','Faqat antivirusni yangilab, barcha faol sessiyalarni tekshirishni keyinga qoldirish',0,'Zararli faylni o‘chirish o‘g‘irlangan parolning amal qilishini bekor qilmaydi. Ishonchli qurilmadan parolni almashtirish, sessiyalarni tugatish va MFAni nazorat qilish muhim.'),
('m13-axr-v1:Y1:AXR-04-026','S7.SEC','Elektron pochta rasmiy idoradan kelgandek ko‘rinadi, lekin ilovadagi fayl kutilmagan va havola domeni shubhali. Xavfsiz tekshiruvlar kombinatsiyasi qaysi?','Xabar ichidagi raqamga qo‘ng‘iroq qilish, faylni ochib mazmunini tekshirish va qayta yuborish','Hujjatning nomiga ishonib faylni ochish, keyin parol talab qilinsa shu xatga javob yozish','Faylni hamkasbga yuborish, uning qurilmasida ochilishini kuzatish va jo‘natuvchidan yana xat kutish','Manba va domenni tekshirish, shubhali faylni ochmaslik, rasmiy idora bilan bog‘lanish',3,'Jo‘natuvchi va domenni mustaqil rasmiy kanal orqali tekshirish, shubhali faylni ochmaslik va idoraga alohida murojaat qilish xavfsizroq. Xabardagi aloqa raqami ham soxta bo‘lishi mumkin.');
CREATE TEMP TABLE task405_selection ON COMMIT DROP AS
 SELECT q.id original_id,gen_random_uuid() revision_id,m.*
 FROM task405_manifest m JOIN public.questions q ON q.source_reference=m.ref AND q.group_code=m.grp
 WHERE q.status='published'::public.content_status AND q.format='Y1'::public.question_format
   AND EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id
      AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL)
   AND EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
      WHERE snap.question_id=q.id AND snap.content_fingerprint=public.professional_question_fingerprint(q.id))
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions oldlink WHERE oldlink.source_question_id=q.id);
SELECT q.id FROM public.questions q JOIN task405_selection s ON q.id=s.original_id FOR UPDATE OF q;
DO $pre405$
DECLARE c int;wrong int;
BEGIN
 SELECT count(*) INTO c FROM task405_selection;
 IF c<>10 THEN RAISE EXCEPTION 'TASK-405 unmodified eligible original selection changed: %/10',c;END IF;
 SELECT count(*) INTO wrong
 FROM task405_selection s JOIN public.question_keys k ON k.question_id=s.original_id
 WHERE NOT EXISTS(
   SELECT 1 FROM public.question_options oldopt WHERE oldopt.question_id=s.original_id
    AND oldopt.id::text=k.payload->>'correct_option_id'
    AND oldopt.order_idx=s.key_idx
    AND oldopt.content_md IS NOT DISTINCT FROM
      CASE s.key_idx WHEN 0 THEN s.opt0 WHEN 1 THEN s.opt1 WHEN 2 THEN s.opt2 WHEN 3 THEN s.opt3 END
 )
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.original_id)<>4;
 IF wrong<>0 THEN RAISE EXCEPTION 'TASK-405 old key identity/content changed %',wrong;END IF;
END;
$pre405$;
INSERT INTO public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
 assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.revision_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 s.stem,q.assets,true,'review'::public.content_status,q.author_id,
 'revision:TASK-405:AI-edited:'||q.id::text||' | source:'||s.ref,
 q.source_lesson_id FROM task405_selection s JOIN public.questions q ON q.id=s.original_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.revision_id,'a',v.ordinal,v.txt
FROM task405_selection s CROSS JOIN LATERAL
 (VALUES(0,s.opt0),(1,s.opt1),(2,s.opt2),(3,s.opt3)) v(ordinal,txt);
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT s.revision_id,
 jsonb_set(k.payload,'{correct_option_id}',to_jsonb(opt.id::text),false),
 s.explanation FROM task405_selection s
 JOIN public.question_keys k ON k.question_id=s.original_id
 JOIN public.question_options opt ON opt.question_id=s.revision_id
   AND opt.order_idx=s.key_idx AND opt.side='a';

DO $opt405$
DECLARE invalid_count int;
BEGIN
 SELECT count(*) INTO invalid_count FROM task405_selection s
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
 IF invalid_count<>0 THEN RAISE EXCEPTION 'TASK-405 answer-length balance or key failed: %',invalid_count;END IF;
END;
$opt405$;

INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT s.original_id,s.revision_id,'owner_ai_y1_option_length_semantic_repair',
 jsonb_build_object(
 'task','TASK-405','delegated_AI_editorial_20261021',true,
 'original_key_text_exact',true,'new_stem_AI_authored',true,'reviewed_distractors_and_reason',true,
 'human_independent_editor',false,'exam_attempts_modified',false,'group',s.grp,'original_source_reference',s.ref)
FROM task405_selection s;
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task405_selection s WHERE q.id=s.revision_id AND q.status='review'::public.content_status;
UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
FROM task405_selection s WHERE q.id=s.original_id AND q.status='published'::public.content_status;
UPDATE public.question_quality_published_revisions snap SET release_scope=
 'TASK-405 AI-reviewed 10 length-balanced Y1 items; original correct concept preserved; not independent human certified'
FROM task405_selection s WHERE snap.question_id=s.revision_id;
UPDATE public.question_quality_findings f SET resolved_at=now(),
 details=f.details||jsonb_build_object('task','TASK-405','replacement_revision_id',s.revision_id,
  'owner_authorized_AI_review',true,'human_editorial_signature',false)
FROM task405_selection s
WHERE f.question_id=s.original_id AND f.finding_code IN
  ('y1_answer_length_high_risk','y1_correct_answer_strictly_longest');

DO $post405$
DECLARE bad_count int;
BEGIN
 SELECT count(*) INTO bad_count FROM task405_selection s
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
 IF bad_count<>0 THEN RAISE EXCEPTION 'TASK-405 archive, fingerprint, or mock eligibility failed: %',bad_count;END IF;
END;
$post405$;
COMMIT;
