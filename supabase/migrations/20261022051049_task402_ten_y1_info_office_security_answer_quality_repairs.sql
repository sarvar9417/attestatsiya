-- TASK-402 owner-authorized AI review: 10 high-risk Y1 answer-length fixes
-- Informatics fundamentals (3), Office (3), cybersecurity (4).
-- AI-adapted scenario is not a verbatim textbook/past-paper question.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task402_manifest (
 ref text PRIMARY KEY,grp text NOT NULL,stem text NOT NULL,
 opt0 text NOT NULL,opt1 text NOT NULL,opt2 text NOT NULL,opt3 text NOT NULL,
 key_idx integer NOT NULL,explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task402_manifest VALUES
('ARS-03-027','S1.INFO','Sinflarning test ballari jadvalidan har bir sinf o‘rtachasi hisoblandi, ikki oy natijalari taqqoslanib o‘sish tendensiyasi aniqlandi. Asosiy jarayon qaysi?','Qayta ishlash va tahlil','Ma’lumotni qidirish va filtrlash','Ma’lumotni saqlash va nusxalash','Ma’lumotni saralash va guruhlash',0,'O‘rtachani hisoblash va ikki davr o‘zgarishidan xulosa chiqarish dastlabki ma’lumotdan yangi natija olish — qayta ishlash va tahlilni ifodalaydi. Filtrlash yoki saralashning o‘zi bunday xulosani bermaydi.'),
('ARS-03-032','S1.INFO','O‘quvchi elektron faylni pochta orqali o‘qituvchiga yubordi. Xabar serverlardan o‘tib, o‘qituvchining qutisiga yetdi. Axborot jarayonining qaysi jufti markaziy?','Ma’lumotni yaratish va saqlash','Uzatish va qabul qilish','Ma’lumotni qidirish va saralash','Ma’lumotni tahrirlash va chop etish',1,'Fayl aloqa kanali orqali jo‘natilib, qabul qiluvchiga yetkazilishi — axborotni uzatish va qabul qilishdir. Yaratish, saqlash yoki chop etish alohida amallardir.'),
('Office_2026_v2|OFF-E04-002|CAM7, 75–97-bet; CAM10–11, 130–142-bet; DEMO2026, tegishli diagramma savollari','S2.OFFICE','Excelda 200 nafar o‘quvchi ro‘yxatidan faqat 9-sinfdagilar vaqtincha ko‘rinishi kerak. Qolgan yozuvlar o‘chirilmasin. Filter nima qiladi?','Mos kelgan yozuvlarni o‘chirib, qolganlarini jadvalda saqlaydi','Barcha yozuvlarni alifbo bo‘yicha qayta joylashtirib, tartiblaydi','Har bir yozuvni boshqa varaqqa ko‘chirib, aslini yangilaydi','Mezonga mos yozuvlarni ko‘rsatib, qolganlarini vaqtincha yashiradi',3,'Filter shartga mos satrlarni ko‘rsatib, boshqa satrlarni vaqtincha yashiradi; ma’lumotlarni o‘chirmaydi. Sort esa tartibni o‘zgartiradi.'),
('Office_2026_v2|OFF-E04-007|CAM7, 75–97-bet; CAM10–11, 130–142-bet; DEMO2026, tegishli diagramma savollari','S2.OFFICE','Jadvalda baholarni kattadan kichikka joylash va faqat muayyan sinfning qatorlarini ko‘rsatish kerak. Sort va Filter orasidagi farqni toping.','Sort tartiblaydi, Filter qatorlarni vaqtincha yashiradi','Sort qatorlarni o‘chiradi, Filter esa alohida nusxa ko‘chiradi','Sort qatorlarni yashiradi, Filter esa barcha qatorni saralaydi','Sort ustunlarni birlashtiradi, Filter esa qiymatlarni avtomatik hisoblaydi',0,'Sort yozuvlarning tartibini o‘zgartiradi, Filter mezonga mos bo‘lmagan qatorlarni ko‘rinishdan vaqtincha yashiradi. Hech biri o‘z vazifasi bo‘yicha yozuvlarni majburan o‘chirmaydi.'),
('Office_2026_v2|OFF-E04-008|CAM7, 75–97-bet; CAM10–11, 130–142-bet; DEMO2026, tegishli diagramma savollari','S2.OFFICE','Hududlar bo‘yicha bir yillik savdo hajmi va yil davomida oyma-oy savdo o‘zgarishi ko‘rsatiladi. Column va Line diagrammalari qachon maqsadga muvofiq?','Column ikki sonli o‘zgaruvchi aloqasini, Line esa ulushlarni ko‘rsatadi','Column toifalar taqqoslovi, Line dinamik trend uchun','Column umumiy ulushni foizlarda, Line esa matn belgilarini ko‘rsatadi','Column faqat alohida yozuvlarni, Line esa fayl nomlarini ko‘rsatadi',1,'Column kategoriyalar orasida qiymatlarni taqqoslashga, Line esa ketma-ket davrlardagi o‘zgarish tendensiyasini kuzatishga mos. Tanlov ma’lumot va tahlil maqsadiga bog‘liq.'),
('Office_2026_v2|OFF-E04-009|CAM7, 75–97-bet; CAM10–11, 130–142-bet; DEMO2026, tegishli diagramma savollari','S2.OFFICE','Sinflarning umumiy o‘quvchi sonidagi ulushi va o‘quvchilar bo‘yi bilan vazni o‘rtasidagi bog‘liqlik turli grafiklarda tasvirlanadi. Pie va Scatter farqini toping.','Pie vaqt davridagi trendni, Scatter esa tartiblangan reytingni ko‘rsatadi','Pie sonli juftliklarni, Scatter esa yakuniy tarkib ulushini ko‘rsatadi','Pie ulush, Scatter ikki sonli o‘zgaruvchi aloqasini ko‘rsatadi','Pie filtrlash natijasini, Scatter esa barcha satr tartibini ko‘rsatadi',2,'Pie umumiy qiymat tarkibidagi ulushlarni tasvirlaydi. Scatter esa ikkita sonli o‘zgaruvchi orasidagi bog‘lanishni nuqtalar orqali ko‘rsatadi.'),
('m13-axr-v1:Y1:AXR-03-005','S7.SEC','Maktab tizimida foydalanuvchi hisobiga parol bilan kirgan, ammo jurnal yozuvlarini tahrirlash huquqi unga berilmagan. Bu cheklovni belgilaydigan jarayon nima?','Foydalanuvchiga qaysi amallar ruxsat etilganini belgilash','Foydalanuvchi kimligini parol yoki kod bilan tekshirish','Foydalanuvchining hisob nomini tizimga kiritib aniqlash','Foydalanuvchi ma’lumotini shifrlab boshqalardan yashirish',0,'Avtorizatsiya foydalanuvchining qaysi resurslarga va amallarga ruxsati borligini boshqaradi. Kimligini tekshirish autentifikatsiya, hisob nomini bildirish esa identifikatsiyadir.'),
('m13-axr-v1:Y1:AXR-03-012','S7.SEC','Bulutdagi papka telefonda tasodifan o‘chirildi va sinxronlash shu o‘chirishni boshqa qurilmalarga ham uzatdi. Nega sinxronlashni mustaqil zaxira nusxa bilan adashtirib bo‘lmaydi?','Sinxronlash alohida zaxira versiyalarini har doim o‘zgarmas holatda saqlaydi','Zaxiralash barcha qurilmalarda faylni bir zumda aynan bir xil qiladi','Sinxron xato yoki o‘chirishni boshqa nusxalarga tarqatishi mumkin','Sinxronlash o‘chirilgan faylni barcha qurilmalarda majburiy tiklab beradi',2,'Sinxronlash nusxalarni moslashtiradi va tasodifiy o‘chirishni ham ko‘paytirishi mumkin. Mustaqil zaxira nusxa avvalgi versiyani alohida saqlab, tiklashga xizmat qiladi.'),
('m13-axr-v1:Y1:AXR-02-021','S7.SEC','Maktab pochtasiga shubhali bajariluvchi fayl ilova qilingan xabar keldi. Xabar qabul qilindi, ammo fayl ochilgani haqida dalil yo‘q. Eng ehtiyotkor xulosa qaysi?','Fayl ishga tushmagan bo‘lsa, uning tarkibi albatta xavfsiz bo‘ladi','Xavfli fayl yetib kelgan, ammo ishga tushirilgani isbotlanmagan','Xatga biriktirilgan fayl elektron pochta orqali albatta bajarilgan bo‘ladi','Antivirus ogohlantirish bermasa, fayl zararli emasligi tasdiqlanadi',1,'Faylning pochta orqali yetib kelishi uning ishga tushirilganini bildirmaydi. Undagi zararli kod xavfi alohida tekshiriladi; ochilmaganligi haqida ma’lumotning o‘zi xavfsizlikning to‘liq isboti emas.'),
('m13-axr-v1:Y1:AXR-03-003','S7.SEC','Antivirus shubhali faylni aniqladi va uni oddiy dasturlar kira olmaydigan ajratilgan hududga ko‘chirdi. Karantin funksiyasining asosiy maqsadi qaysi?','Zararli faylni boshqa qurilmalarga zaxira sifatida tarqatish','Shubhali obyektni ajratib, zarar yetkazishini cheklash','Shubhali faylni avtomatik ravishda ruxsatli dasturga aylantirish','Faylni tahlil qilmasdan darhol barcha foydalanuvchiga yuborish',1,'Karantin shubhali obyektni ajratib, odatiy bajarilish va tarqalish imkoniyatini cheklaydi. Zararlilikni aniqlash yoki tiklash keyingi tekshiruvda amalga oshirilishi mumkin.');
CREATE TEMP TABLE task402_selection ON COMMIT DROP AS
 SELECT q.id original_id,gen_random_uuid() revision_id,m.*
 FROM task402_manifest m JOIN public.questions q ON q.source_reference=m.ref AND q.group_code=m.grp
 WHERE q.status='published'::public.content_status AND q.format='Y1'::public.question_format
   AND EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id
      AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL)
   AND EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
      WHERE snap.question_id=q.id AND snap.content_fingerprint=public.professional_question_fingerprint(q.id))
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions oldlink WHERE oldlink.source_question_id=q.id);
SELECT q.id FROM public.questions q JOIN task402_selection s ON q.id=s.original_id FOR UPDATE OF q;
DO $pre402$
DECLARE c int;wrong int;
BEGIN
 SELECT count(*) INTO c FROM task402_selection;
 IF c<>10 THEN
   RAISE NOTICE 'TASK402 preflight drift: %', (
     SELECT jsonb_agg(jsonb_build_object(
       'ref',left(m.ref,46),
       'published',(SELECT count(*) FROM public.questions q WHERE q.source_reference=m.ref AND q.group_code=m.grp AND q.status='published'),
       'eligible_findings',(SELECT count(*) FROM public.questions q JOIN public.question_quality_findings f ON f.question_id=q.id WHERE q.source_reference=m.ref AND q.group_code=m.grp AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL),
       'revisions',(SELECT count(*) FROM public.questions q JOIN public.question_bank_revisions br ON br.source_question_id=q.id WHERE q.source_reference=m.ref AND q.group_code=m.grp)
     )) FROM task402_manifest m);
   RAISE EXCEPTION 'TASK-402 unmodified eligible original selection changed: %/10',c;
 END IF;
 SELECT count(*) INTO wrong
 FROM task402_selection s JOIN public.question_keys k ON k.question_id=s.original_id
 WHERE NOT EXISTS(
   SELECT 1 FROM public.question_options oldopt WHERE oldopt.question_id=s.original_id
    AND oldopt.id::text=k.payload->>'correct_option_id'
    AND oldopt.order_idx=s.key_idx
    AND oldopt.content_md IS NOT DISTINCT FROM
      CASE s.key_idx WHEN 0 THEN s.opt0 WHEN 1 THEN s.opt1 WHEN 2 THEN s.opt2 WHEN 3 THEN s.opt3 END
 )
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.original_id)<>4;
 IF wrong<>0 THEN RAISE EXCEPTION 'TASK-402 old key identity/content changed %',wrong;END IF;
END;
$pre402$;
INSERT INTO public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
 assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.revision_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 s.stem,q.assets,true,'review'::public.content_status,q.author_id,
 'revision:TASK-402:AI-edited:'||q.id::text||' | source:'||s.ref,
 q.source_lesson_id FROM task402_selection s JOIN public.questions q ON q.id=s.original_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.revision_id,'a',v.ordinal,v.txt
FROM task402_selection s CROSS JOIN LATERAL
 (VALUES(0,s.opt0),(1,s.opt1),(2,s.opt2),(3,s.opt3)) v(ordinal,txt);
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT s.revision_id,
 jsonb_set(k.payload,'{correct_option_id}',to_jsonb(opt.id::text),false),
 s.explanation FROM task402_selection s
 JOIN public.question_keys k ON k.question_id=s.original_id
 JOIN public.question_options opt ON opt.question_id=s.revision_id
   AND opt.order_idx=s.key_idx AND opt.side='a';

DO $opt402$
DECLARE invalid_count int;
BEGIN
 SELECT count(*) INTO invalid_count FROM task402_selection s
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
 IF invalid_count<>0 THEN RAISE EXCEPTION 'TASK-402 answer-length balance or key failed: %',invalid_count;END IF;
END;
$opt402$;

INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT s.original_id,s.revision_id,'owner_ai_y1_option_length_semantic_repair',
 jsonb_build_object(
 'task','TASK-402','delegated_AI_editorial_20261021',true,
 'original_key_text_exact',true,'new_stem_AI_authored',true,'reviewed_distractors_and_reason',true,
 'human_independent_editor',false,'exam_attempts_modified',false,'group',s.grp,'original_source_reference',s.ref)
FROM task402_selection s;
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task402_selection s WHERE q.id=s.revision_id AND q.status='review'::public.content_status;
UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
FROM task402_selection s WHERE q.id=s.original_id AND q.status='published'::public.content_status;
UPDATE public.question_quality_published_revisions snap SET release_scope=
 'TASK-402 AI-reviewed 10 length-balanced Y1 items; original correct concept preserved; not independent human certified'
FROM task402_selection s WHERE snap.question_id=s.revision_id;
UPDATE public.question_quality_findings f SET resolved_at=now(),
 details=f.details||jsonb_build_object('task','TASK-402','replacement_revision_id',s.revision_id,
  'owner_authorized_AI_review',true,'human_editorial_signature',false)
FROM task402_selection s
WHERE f.question_id=s.original_id AND f.finding_code IN
  ('y1_answer_length_high_risk','y1_correct_answer_strictly_longest');

DO $post402$
DECLARE bad_count int;
BEGIN
 SELECT count(*) INTO bad_count FROM task402_selection s
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
 IF bad_count<>0 THEN RAISE EXCEPTION 'TASK-402 archive, fingerprint, or mock eligibility failed: %',bad_count;END IF;
END;
$post402$;
COMMIT;