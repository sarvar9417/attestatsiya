-- TASK-424: second *review-only* semantic distractor upgrade (8 precisely identified Y1 source questions).
-- Source: existing question definitions, correct keys and explanations. Wrong options are original authored teaching examples.
-- Owner approved whole-bank QA and staged releases; THIS MIGRATION NEVER PUBLISHES.
-- Independent expert attestation is NOT claimed; professional approval is required for new answers.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='80s';

CREATE TEMP TABLE task424_batch (
 source_id uuid PRIMARY KEY, new_stem text, expected_correct text NOT NULL,
 wrong text[] NOT NULL, explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task424_batch VALUES
('3a2ebffc-55df-5bee-8847-fc78c6c319a8'::uuid,NULL,'Rang tusini, to‘yinganlikni va yorug‘likni intuitiv boshqarish',ARRAY['Rangni qizil, yashil va ko‘k kanallar bo‘yicha aralashtirib hisoblash','Tasvirdagi piksellar sonini kenglik va balandlik bo‘yicha o‘zgartirish','Bosma ranglarni siyoh miqdori va qog‘oz turiga moslab ajratish']::text[],'HSV/HSL modellari rang tusi (Hue), to‘yinganlik (Saturation) hamda yorug‘lik yoki qiymat parametrini alohida boshqarishga qulay. RGB rang kanallarining qo‘shilishini, CMYK esa bosma bo‘yoqlarini tavsiflaydi. Piksel o‘lchamini o‘zgartirish rang modelining vazifasi emas.'),
('651a433e-3f2b-5432-a4a5-fd6e76b7536d'::uuid,NULL,'Teng ehtimolli N ta holatdan birini tanlash axborotini topishda',ARRAY['Turli ehtimolli holatlarning o‘rtacha axborot miqdorini hisoblash uchun','Tarmoq orqali uzatilayotgan signaldagi shovqin va yo‘qotishni baholash uchun','Xatolarni tuzatuvchi kodda ortiqcha nazorat bitlari sonini belgilash uchun']::text[],'Xartli formulasida I = log₂N va N ta mumkin bo‘lgan holat teng ehtimolli deb qaraladi. Ehtimollari turlicha bo‘lgan holatlarning o‘rtacha axboroti Shennon entropiyasi bilan tavsiflanadi. Shovqin yoki nazorat bitlarini hisoblash boshqa masalalardir.'),
('6c8224c8-deb3-5aaf-9152-05b105967235'::uuid,NULL,'Protsessor bir amal bilan qayta ishlaydigan bitlar soniga',ARRAY['Protsessor takt generatorining bir soniyadagi impulslar chastotasiga','Operativ xotiraning umumiy saqlash hajmi nechta baytligiga','Protsessorda mavjud bo‘lgan mustaqil hisoblash yadrolarining soniga']::text[],'Mashina so‘zi odatda protsessor bir amalda qayta ishlay oladigan ma’lumot uzunligi (razryadlilik) bilan bog‘liq. Takt chastotasi protsessor tezligini, operativ xotira hajmi saqlash imkoniyatini, yadrolar soni esa parallel hisoblash resurslarini bildiradi.'),
('85c85aa0-e86c-50e4-8fb5-43a156a70694'::uuid,NULL,'Axborotni qoidaga ko‘ra boshqa ko‘rinishga o‘tkazish',ARRAY['Axborotni maxfiy kalit yordamida begonalardan yashirish jarayoni','Axborot nusxalarini bir xotiradan ikkinchisiga ko‘chirish jarayoni','Axborot faylining haqiqiyligini elektron imzo bilan tasdiqlash jarayoni']::text[],'Kodlash ma’lumotni belgilangan qoidaga ko‘ra boshqa tasvirlash shakliga o‘tkazishdir. Shifrlash kodlashdan farqli ravishda maxfiylikni ta’minlaydi; nusxalash joylashuvni o‘zgartiradi, elektron imzo esa yaxlitlik va mualliflikni tekshirishga xizmat qiladi.'),
('a0bdd6d1-2ad7-54ac-a4e1-c83faefde4c9'::uuid,NULL,'Belgilar va ularga mos kodlar ro‘yxati',ARRAY['Belgilar uchun mos ko‘rinishlar va shrift tasvirlari ro‘yxati','Ma’lumot fayllarining nomlari va diskdagi manzillari ro‘yxati','Kompyuter tarmog‘idagi qurilmalar va ularning IP manzillari ro‘yxati']::text[],'Kod jadvali belgilarni ularga mos sonli yoki ikkilik kodlar bilan bog‘laydi. Shriftlar belgining ko‘rinishini, fayl kataloglari saqlangan obyektlarning joyini, tarmoq jadvallari esa qurilma manzillarini aks ettiradi.'),
('ce096d06-2532-503a-b6bb-38258514f5ea'::uuid,NULL,'Ma’lumot → axborot → bilim zanjiri',ARRAY['Ma’lumot → kodlash → uzatish zanjiri','Sensor → aktuator → signal zanjiri','O‘lchash → filtrlash → tasvirlash jarayoni']::text[],'Sensor qiymati kontekstsiz xom ma’lumotdir. Uni jadvalda izohlash axborotga, axborotdan xulosa chiqarib qurilmani boshqarish qarori esa amaliy bilimga o‘tishni bildiradi. Boshqa ketma-ketliklar texnik signallarni qayta ishlash bosqichlarini tavsiflaydi.'),
('dcc19fdb-0b46-5562-a9c1-4b1b7c521538'::uuid,NULL,'Ma’lumotning faylda qanday tuzilishi va talqin qilinishini belgilovchi standart',ARRAY['Fayl kengaytmasini ko‘rsatib, uni ma’lum dastur bilan bog‘lash qoidasi','Faylni tashuvchi qurilmada joylashtirish uchun ajratilgan sektorlar ro‘yxati','Fayl mazmunini internet orqali uzatish uchun ishlatiladigan tarmoq protokoli']::text[],'Fayl formati ma’lumotlar baytlari qanday tuzilishi va dastur tomonidan qanday talqin qilinishini belgilaydi. Kengaytma ko‘pincha formatga ishora qiladi, lekin uning to‘liq texnik ta’rifi emas; disk sektorlarining joylashuvi va uzatish protokoli ham boshqa tushunchalar.'),
('9766b2d1-260c-5265-89cf-9230d20775d9'::uuid,NULL,'Kvadratning birinchi tomoni yana chiziladi; yangi alohida chiziq paydo bo‘lmaydi',ARRAY['Kvadratning birinchi tomoni oxiridan yana 30 birlikka yangi kesma uzaytiriladi','Kvadratning qarama-qarshi tomoni to‘liq qayta chizilib, tasvirda qalinroq ko‘rinadi','Kvadratning ichki qismidan diagonal bo‘ylab yangi 30 birlik uzunlikdagi kesma chiziladi']::text[],'LOGO tilida REPEAT 4 [FD 30 RT 90] kvadratni yopadi va toshbaqani boshlang‘ich koordinata hamda yo‘nalishga qaytaradi. Tashqaridagi FD 30 kvadratning dastlabki tomoni ustidan qayta yuradi. Shuning uchun yangi alohida geometrik chiziq paydo bo‘lmaydi.');

CREATE TEMP TABLE task424_review_map (
 source_id uuid PRIMARY KEY, review_id uuid NOT NULL UNIQUE, source_fingerprint text NOT NULL
) ON COMMIT DROP;
DO $preflight$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task424_batch)<>8 THEN RAISE EXCEPTION 'TASK424_EXACT_EIGHT_REQUIRED'; END IF;
 SELECT count(*) INTO n FROM task424_batch b
 JOIN public.questions q ON q.id=b.source_id AND q.status='published' AND q.format='Y1'
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options co ON co.question_id=q.id
     AND co.id::text=k.payload->>'correct_option_id' AND co.content_md=b.expected_correct
 WHERE q.group_code IN ('S1.INFO','S4.BLOCK')
   AND q.source_lesson_id IS NOT NULL AND q.source_reference IS NOT NULL
   AND cardinality(b.wrong)=3
   AND length(b.explanation)>=150
   AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions r WHERE r.source_question_id=q.id)
   AND NOT EXISTS(SELECT 1 FROM public.questions staged
     WHERE staged.source_reference='revision:TASK-424:semantic-distractors:'||q.id::text);
 IF n<>8 THEN RAISE EXCEPTION 'TASK424_SOURCE_OR_KEY_DRIFT_%_OF_8',n; END IF;
 IF EXISTS (
   SELECT 1 FROM task424_batch b
   CROSS JOIN LATERAL unnest(b.wrong) as w(txt)
   WHERE length(btrim(w.txt))<25 OR w.txt=b.expected_correct
 ) THEN RAISE EXCEPTION 'TASK424_INVALID_DISTRACTOR'; END IF;
END $preflight$;

INSERT INTO task424_review_map
SELECT b.source_id,gen_random_uuid(),public.professional_question_fingerprint(b.source_id)
FROM task424_batch b;

INSERT INTO public.questions (
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,
 stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
)
SELECT m.review_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 coalesce(b.new_stem,q.stem_md),q.assets,true,'review'::public.content_status,
 q.author_id,'revision:TASK-424:semantic-distractors:'||q.id::text,q.source_lesson_id
FROM task424_review_map m JOIN public.questions q ON q.id=m.source_id
JOIN task424_batch b ON b.source_id=m.source_id;

CREATE TEMP TABLE task424_option_map (
 old_option_id uuid PRIMARY KEY,new_option_id uuid NOT NULL UNIQUE,
 source_id uuid NOT NULL,review_id uuid NOT NULL,
 is_correct boolean NOT NULL, new_text text NOT NULL
) ON COMMIT DROP;
INSERT INTO task424_option_map
WITH ranked AS (
 SELECT o.*,m.review_id,m.source_id,
   (o.id::text=k.payload->>'correct_option_id') correct,
   row_number() over(
      partition by m.source_id, (o.id::text=k.payload->>'correct_option_id')
      order by o.order_idx,o.id
   ) wrong_position
 FROM task424_review_map m
 JOIN public.question_options o ON o.question_id=m.source_id AND o.side='a'
 JOIN public.question_keys k ON k.question_id=m.source_id
)
SELECT r.id,gen_random_uuid(),r.source_id,r.review_id,r.correct,
  CASE WHEN r.correct THEN r.content_md ELSE b.wrong[r.wrong_position::integer] END
FROM ranked r JOIN task424_batch b ON b.source_id=r.source_id;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT m.new_option_id,m.review_id,o.side,o.order_idx,m.new_text
FROM task424_option_map m JOIN public.question_options o ON o.id=m.old_option_id;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.review_id,
  jsonb_set(k.payload,'{correct_option_id}',to_jsonb(om.new_option_id::text),false),
  b.explanation
FROM task424_review_map m JOIN task424_batch b ON b.source_id=m.source_id
JOIN public.question_keys k ON k.question_id=m.source_id
JOIN task424_option_map om ON om.source_id=m.source_id AND om.is_correct;

DO $postflight$
DECLARE n int;
BEGIN
 WITH validate AS (
 SELECT m.source_id,m.review_id,
   count(o.id) total,
   count(distinct btrim(o.content_md)) distinct_n,
   count(o.id) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correct_n,
   max(o.content_md) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correct_text,
   min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) minw,
   max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) maxw,
   max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FILTER(WHERE o.id::text=k.payload->>'correct_option_id') cw,
   max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') mw
 FROM task424_review_map m JOIN public.question_options o ON o.question_id=m.review_id
 JOIN public.question_keys k ON k.question_id=m.review_id GROUP BY 1,2
 )
 SELECT count(*) INTO n FROM validate v JOIN task424_batch b ON b.source_id=v.source_id
 WHERE v.total=4 AND v.distinct_n=4 AND v.correct_n=1 AND v.correct_text=b.expected_correct
 AND v.minw>=1 AND v.maxw<=v.minw*1.8 AND v.cw<=v.mw*1.25;
 IF n<>8 THEN RAISE EXCEPTION 'TASK424_OPTION_KEY_BALANCE_FAILED_%_OF_8',n; END IF;
 IF (SELECT count(*) FROM task424_option_map)<>32 THEN
    RAISE EXCEPTION 'TASK424_OPTION_MAP_NOT_32'; END IF;
 IF (SELECT count(*) FROM task424_review_map m
   WHERE public.professional_question_fingerprint(m.source_id)=m.source_fingerprint)<>8
 THEN RAISE EXCEPTION 'TASK424_PUBLISHED_SOURCE_CHANGED'; END IF;
 IF (SELECT count(*) FROM public.questions q JOIN task424_review_map m ON m.review_id=q.id
   WHERE q.status='review')<>8 THEN RAISE EXCEPTION 'TASK424_NOT_REVIEW_ONLY'; END IF;
END $postflight$;

INSERT INTO public.question_bank_revisions (
 source_question_id,revision_question_id,revision_kind,evidence
)
SELECT m.source_id,m.review_id,'task424_semantic_distractor_review',
 jsonb_build_object('task','TASK-424','question_format','Y1',
 'correct_answer_text_unchanged',true,'human_editorial_approval',false,
 'status','review_pending_editorial','release_performed',false,
 'old_question_immutable',true,'audit','first wave of bankwide quality analysis')
FROM task424_review_map m;

INSERT INTO public.question_quality_findings(
 question_id,finding_code,severity,details
)
SELECT m.source_id,'task424_semantic_distractor_review_pending','high',
 jsonb_build_object('task','TASK-424','replacement_question_id',m.review_id,
  'explanation','Three semantically adjacent distractors and longer individual rationale prepared',
  'publication_status','review_only','approved_independently',false)
FROM task424_review_map m;

SELECT count(*) stage_count,(SELECT count(*) FROM task424_option_map) option_count,
       (SELECT count(*) FROM public.questions q JOIN task424_review_map m ON m.review_id=q.id
         WHERE q.status='review') review_count
FROM task424_review_map;
COMMIT;
