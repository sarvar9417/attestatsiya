-- TASK-401 owner-authorized AI review: 10 high-risk Y1 answer-length fixes
-- Informatics fundamentals (3), Office (3), cybersecurity (4).
-- AI-adapted scenario is not a verbatim textbook/past-paper question.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task401_manifest (
 ref text PRIMARY KEY,grp text NOT NULL,stem text NOT NULL,
 opt0 text NOT NULL,opt1 text NOT NULL,opt2 text NOT NULL,opt3 text NOT NULL,
 key_idx integer NOT NULL,explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task401_manifest VALUES
('ARS-01-055','S1.INFO','Operator klaviaturadan sonlarni kiritdi, dastur ularning yig‘indisini hisoblab, natijani monitorga chiqardi. Bu uch bosqich kompyuterning qaysi umumiy modelini ko‘rsatadi?','Saqlash–qidirish–tiklash ish modeli','Yaratish–sinash–tarqatish ish modeli','Kiritish–qayta ishlash–chiqarish modeli','Uzatish–qabul qilish–tasdiqlash modeli',2,'Klaviaturadan ma’lumot olish kiritish, yig‘indini hisoblash qayta ishlash, monitor natijasi chiqarish bosqichidir. Bular kiritish–qayta ishlash–chiqarish modelini tashkil qiladi.'),
('ARS-01-059','S1.INFO','Mikrofonning uzluksiz elektr signali ADC yordamida sonli namunalarga o‘tkazildi. Qaysi ikki axborot ifodalash shakli o‘rtasidagi farq ko‘rsatilgan?','Matnli va grafik axborot','Ovozli va video axborot','Analog va raqamli axborot','Ochiq va yopiq axborot',2,'Mikrofon hosil qilgan uzluksiz signal analog, ADCdan keyingi diskret sonli namunalar raqamli ifodadir. Farq uzluksizlik va diskretlikda.'),
('ARS-02-030','S1.INFO','Hodisa qatnashchisining bevosita yozuvi bilan boshqa kishining aynan shu voqea haqidagi ikkilamchi sharhi solishtirildi. Manbaning voqeaga yaqinligini qaysi juftlik farqlaydi?','Ochiq va cheklangan manba','Mahalliy va masofaviy manba','Bevosita va bilvosita manba','Raqamli va qog‘oz manba',2,'Bevosita manba hodisani to‘g‘ridan-to‘g‘ri kuzatuvchi yoki qayd etuvchidan olinadi; bilvosita manba esa oraliq sharhlash yoki qayta bayon orqali yetadi. Manba bevosita bo‘lishi uning xatosizligini kafolatlamaydi.'),
('ARS-02-037','S1.INFO','Bir slaydda matn, diagramma va ovozli izoh uyg‘un holda ishlatilgan. Bir nechta axborot shakli bitta mahsulotda jamlangan bunday taqdimot turini qanday atash ma’qul?','Statik tasvirli axborot','Kombinatsiyalashgan axborot','Dinamik video axboroti','Yakkalangan audio axborot',1,'Bir mahsulotda matn, grafika va audio turli ifodalash shakllari birlashganda kombinatsiyalashgan axborot yuzaga keladi. Faqat bitta media shakli bunday vaziyatni to‘liq ifodalamaydi.'),
('ARS-03-055','S1.INFO','Elektron xat jo‘natuvchidan pochta serveriga, u yerdan qabul qiluvchining qutisiga yetib bordi. Bu jarayonning asosiy axborot amallari qaysi?','Uzatish va qabul qilish','Yaratish va tahrirlash jarayoni','Shifrlash va dekodlash jarayoni','Qidirish va saqlash jarayoni',0,'Jo‘natuvchi xabarni tarmoq orqali uzatadi, qabul qiluvchi esa uni oladi. Shifrlash, qidirish yoki tahrirlash xatning har safar jo‘natilishiga xos majburiy bosqich emas.'),
('ARS-03-070','S1.INFO','Internetdan topilgan xabarda muallif, sana va tasdiqlovchi dalillar ko‘rsatilmagan. Uni sinf guruhiga ulashishdan oldin eng mas’uliyatli ish qaysi?','Post matnini qiziqarli sarlavha bilan qayta yozib, dalillarni tekshirmasdan sinf guruhiga darhol tarqatish','Ko‘p izoh yozilganini yetarli dalil deb olib, muallifi noma’lum xabarni hech tekshirmasdan tarqatish','Boshqa noma’lum kanallardagi shunga o‘xshash xabarlarni ko‘rib, manba va sanani mustaqil tekshirmasdan yuborish','Manbani tekshirish, boshqa ishonchli manbalar bilan solishtirish va auditoriyaga mos ravishda taqdim etish',3,'Muallif, sana va dalil bo‘lmagan post mustaqil tekshirilishi, boshqa ishonchli manbalar bilan qiyoslanishi va auditoriya ehtiyojiga mos ravishda ehtiyotkorlik bilan taqdim etilishi kerak. Omma fikri yoki takroriy repost dalil emas.'),
('reserve-2026:T060-R1-HW-B06','S2.HW','Sensorli planshet ekranida foydalanuvchi barmog‘i bilan tugma bosadi, ayni paytda ekranda javob tasviri paydo bo‘ladi. Ushbu ekran qaysi qurilma turiga kiradi?','Ham kiritish, ham chiqarish','Faqat ma’lumotni kirituvchi qurilma','Faqat axborotni chiqaruvchi qurilma','Faqat ma’lumotni saqlovchi qurilma',0,'Sensorli ekran teginishni kiritish signali sifatida qabul qiladi va tasvirni chiqaradi. Shu sababli bir qurilmada kiritish va chiqarish funksiyalari mavjud.'),
('reserve-2026:T060-R1-HW-B07','S2.HW','Kompyuterda bir nechta dastur ishlaganda xotira, protsessor va qurilma resurslaridan foydalanishni muvofiqlashtiradigan asosiy tizim dasturining vazifasi nima?','Dasturlar va apparat resurslarini boshqarish','Fayllarni arxivlash va siqishni boshqarish','Veb-sahifalar va brauzer tarixini boshqarish','Bitta faylni tahrirlash va chop etish',0,'Operatsion tizim jarayonlarni, tezkor xotirani, qurilmalarga murojaatni va boshqa tizim resurslarini muvofiqlashtiradi. Fayllarni siqish yoki matnni tahrirlash alohida ilovalarning vazifasidir.'),
('reserve-2026:T060-R1-HW-B13','S2.HW','Windowsda `C:\Maktab\9A\hisobot.docx` yo‘li ko‘rsatilgan. Ushbu yo‘ldagi `hisobot.docx` qismi nimani ifodalaydi?','Fayl nomi va kengaytmasi','Disk nomi va harfi','Papka nomi va manzili','Katalog tuzilishi va yo‘li',0,'`hisobot` fayl nomi, `.docx` kengaytmasi; undan oldingi `Maktab` va `9A` katalog nomlaridir. `C:` esa disk belgisini bildiradi.'),
('reserve-2026:T060-R1-HW-B15','S2.HW','Antivirus kompyuterni tekshirib, xavfli fayllarni aniqlash va karantinga olish kabi texnik xizmat vazifalarini bajaradi. Vazifasiga ko‘ra u qaysi dastur toifasiga kiradi?','Xizmat ko‘rsatuvchi (utility) dastur','Amaliy matn muharriri dasturi','Operatsion tizimning asosiy yadrosi','Qurilmaga xizmat qiluvchi drayver',0,'Antivirus foydalanuvchi tizimiga texnik xizmat ko‘rsatadigan utility dasturlarga kiradi. U matn muharriri yoki bevosita operatsion tizim yadrosi emas.');
CREATE TEMP TABLE task401_selection ON COMMIT DROP AS
 SELECT q.id original_id,gen_random_uuid() revision_id,m.*
 FROM task401_manifest m JOIN public.questions q ON q.source_reference=m.ref AND q.group_code=m.grp
 WHERE q.status='published'::public.content_status AND q.format='Y1'::public.question_format
   AND EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id
      AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL)
   AND EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
      WHERE snap.question_id=q.id AND snap.content_fingerprint=public.professional_question_fingerprint(q.id))
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions oldlink WHERE oldlink.source_question_id=q.id);
SELECT q.id FROM public.questions q JOIN task401_selection s ON q.id=s.original_id FOR UPDATE OF q;
DO $pre401$
DECLARE c int;wrong int;
BEGIN
 SELECT count(*) INTO c FROM task401_selection;
 IF c<>10 THEN RAISE EXCEPTION 'TASK-401 unmodified eligible original selection changed: %/10',c;END IF;
 SELECT count(*) INTO wrong
 FROM task401_selection s JOIN public.question_keys k ON k.question_id=s.original_id
 WHERE NOT EXISTS(
   SELECT 1 FROM public.question_options oldopt WHERE oldopt.question_id=s.original_id
    AND oldopt.id::text=k.payload->>'correct_option_id'
    AND oldopt.order_idx=s.key_idx
    AND oldopt.content_md IS NOT DISTINCT FROM
      CASE s.key_idx WHEN 0 THEN s.opt0 WHEN 1 THEN s.opt1 WHEN 2 THEN s.opt2 WHEN 3 THEN s.opt3 END
 )
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.original_id)<>4;
 IF wrong<>0 THEN RAISE EXCEPTION 'TASK-401 old key identity/content changed %',wrong;END IF;
END;
$pre401$;
INSERT INTO public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
 assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.revision_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 s.stem,q.assets,true,'review'::public.content_status,q.author_id,
 'revision:TASK-401:AI-edited:'||q.id::text||' | source:'||s.ref,
 q.source_lesson_id FROM task401_selection s JOIN public.questions q ON q.id=s.original_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.revision_id,'a',v.ordinal,v.txt
FROM task401_selection s CROSS JOIN LATERAL
 (VALUES(0,s.opt0),(1,s.opt1),(2,s.opt2),(3,s.opt3)) v(ordinal,txt);
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT s.revision_id,
 jsonb_set(k.payload,'{correct_option_id}',to_jsonb(opt.id::text),false),
 s.explanation FROM task401_selection s
 JOIN public.question_keys k ON k.question_id=s.original_id
 JOIN public.question_options opt ON opt.question_id=s.revision_id
   AND opt.order_idx=s.key_idx AND opt.side='a';

DO $opt401$
DECLARE invalid_count int;
BEGIN
 SELECT count(*) INTO invalid_count FROM task401_selection s
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
 IF invalid_count<>0 THEN RAISE EXCEPTION 'TASK-401 answer-length balance or key failed: %',invalid_count;END IF;
END;
$opt401$;

INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT s.original_id,s.revision_id,'owner_ai_y1_option_length_semantic_repair',
 jsonb_build_object(
 'task','TASK-401','delegated_AI_editorial_20261021',true,
 'original_key_text_exact',true,'new_stem_AI_authored',true,'reviewed_distractors_and_reason',true,
 'human_independent_editor',false,'exam_attempts_modified',false,'group',s.grp,'original_source_reference',s.ref)
FROM task401_selection s;
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task401_selection s WHERE q.id=s.revision_id AND q.status='review'::public.content_status;
UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
FROM task401_selection s WHERE q.id=s.original_id AND q.status='published'::public.content_status;
UPDATE public.question_quality_published_revisions snap SET release_scope=
 'TASK-401 AI-reviewed 10 length-balanced Y1 items; original correct concept preserved; not independent human certified'
FROM task401_selection s WHERE snap.question_id=s.revision_id;
UPDATE public.question_quality_findings f SET resolved_at=now(),
 details=f.details||jsonb_build_object('task','TASK-401','replacement_revision_id',s.revision_id,
  'owner_authorized_AI_review',true,'human_editorial_signature',false)
FROM task401_selection s
WHERE f.question_id=s.original_id AND f.finding_code IN
  ('y1_answer_length_high_risk','y1_correct_answer_strictly_longest');

DO $post401$
DECLARE bad_count int;
BEGIN
 SELECT count(*) INTO bad_count FROM task401_selection s
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
 IF bad_count<>0 THEN RAISE EXCEPTION 'TASK-401 archive, fingerprint, or mock eligibility failed: %',bad_count;END IF;
END;
$post401$;
COMMIT;