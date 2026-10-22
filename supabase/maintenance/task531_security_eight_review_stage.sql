-- TASK-531: security-awareness *review-only* semantic distractor upgrade (8 precisely identified Y1 source questions).
-- Source: existing question definitions, correct keys and explanations. Wrong options are original authored teaching examples.
-- Owner approved whole-bank QA and staged releases; THIS MIGRATION NEVER PUBLISHES.
-- Independent expert attestation is NOT claimed; professional approval is required for new answers.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='80s';

CREATE TEMP TABLE task531_batch (
 source_id uuid PRIMARY KEY, new_stem text, expected_correct text NOT NULL,
 wrong text[] NOT NULL, explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task531_batch VALUES
('89a482ca-2e7c-8647-bead-ff8cd740f8a6'::uuid,NULL,'Begona kishi hisobga kirishi va shaxsiy ma’lumotni ko‘rishi mumkin',ARRAY['Portal ochiq tursa ham hisob avtomatik chiqadi va hujjatlar ko‘rinmaydi','Keyingi foydalanuvchi faqat brauzer tarixini ko‘radi, hisob ma’lumotini ko‘ra olmaydi','Ochiq sessiya eski hisobga emas, faqat yangi ro‘yxatdan o‘tishga ruxsat beradi']::text[],'Ommaviy kompyuterda portal sessiyasi ochiq qolsa, keyingi foydalanuvchi mavjud hisob nomidan ma’lumotlarni ko‘rishi yoki amallarni bajarishi mumkin. Brauzer tarixiga cheklanish yoki avtomatik chiqishni taxmin qilish xavfni bartaraf etmaydi.'),
('d54a5662-ee02-b536-c957-9ca6b98f6894'::uuid,NULL,'Fishing boshlang‘ich aldov, malware esa keyingi texnik ta’sir bo‘lishi mumkin',ARRAY['Fishing zararli dastur turini, malware esa faqat aldov xabarini anglatadi','Shubhali faylni ochish va keyingi faollik alohida hodisa, ular bog‘lanmaydi','Fishing bilan malware bir ma’noli atamalar, ikkalasi ham faqat spamni bildiradi']::text[],'Phishing foydalanuvchini aldash orqali xabar, havola yoki faylga ishontirish usulidir; malware zararli dasturga tegishli. Xat orqali ochilgan fayl keyingi texnik hodisaga sabab bo‘lishi mumkin. Bu ikkala tushuncha bir-birining sinonimi emas.'),
('71845faf-3b46-3a41-35c2-52da8c4acd19'::uuid,NULL,'Qo‘rquv va shoshiltirish orqali ijtimoiy muhandislik',ARRAY['Parol variantlarini tizimli sinashga asoslangan avtomatlashtirilgan hujum usuli','Aloqa kanalidagi shifrlangan paketlarni hisoblash orqali aniqlash usuli','Dastur xatolaridan foydalanib resurs yetishmovchiligini yuzaga keltirish usuli']::text[],'Hisob bloklanishini aytib shoshiltirish inson hissiyotiga ta’sir ko‘rsatadi va maxfiy tasdiqlash kodini berishga undaydi. Bu ijtimoiy muhandislik; parolni avtomatik taxmin qilish, tarmoq trafikini tahlil qilish yoki resursga ta’sir qilish boshqa usullardir.'),
('fb232e6b-f65b-0789-d190-3b53d05c4bef'::uuid,NULL,'Imzo tegishli kalit bilan tekshiriladimi va hujjat o‘zgarmaganmi?',ARRAY['Hujjat sarlavhasi va fayl kengaytmasi tashkilot talabiga mos keladimi?','Elektron hujjatga chizilgan imzo rasmi aniq ko‘rinadimi va joylashganmi?','Fayl hajmi bilan sahifalar soni belgilangan diapazonda saqlanganmi?']::text[],'Elektron imzoda asosiy tekshiruv imzo haqiqiyligi va imzolangan ma’lumot yaxlitligidir. Fayl nomi, rasm shaklidagi imzo yoki hajm mosligi kriptografik imzo tekshiruvining o‘rnini bosa olmaydi; sertifikat holati ham muhim bo‘lishi mumkin.'),
('b5f87ccc-69c3-b63d-a1a9-cf5c43301728'::uuid,NULL,'Reklama domenini tekshirmasdan davom etmaslik, rasmiy manzilni mustaqil ochish',ARRAY['Reklamadagi xavfsiz ulanish belgisi ko‘rinsa, manzilni avtomatik rasmiy deb bilish','Natija birinchi o‘rinda chiqsa, sahifa manzilini solishtirmasdan ishonch bildirish','Portal dizayni asl nusxaga o‘xshasa, hujjat yuborishdan avval tekshirmaslik']::text[],'Qidiruv reklamasida rasmiy tashkilotga o‘xshash sahifa chiqishi mumkin. HTTPS belgisi faqat ulanishni himoyalashni bildiradi; sayt egasini tasdiqlamaydi. Ishonchli yo‘l — domenni rasmiy manba bilan mustaqil solishtirishdir.'),
('0806ae3f-cdb7-0982-9f9d-bafdef612a85'::uuid,NULL,'Zaxira elektr manbai va tiklash rejasi',ARRAY['Internet provayderini almashtirish va xizmat tezligini o‘lchash rejasi','Serverlarni yangilash va administratorlar sonini ko‘paytirish rejasi','Faqat ma’lumot zaxirasini olish va uskunani qayta yoqish rejasi']::text[],'Elektr uzilishi vaqtida muhim xizmatning ishlashini davom ettirish uchun UPS yoki generator kabi zaxira elektr manbai, shuningdek xizmatni tiklash rejasi kerak. Internet provayderi yoki dastur yangilanishi elektr ta’minoti uzilishini bevosita bartaraf etmaydi.'),
('a48f6a23-4f48-4e28-8be4-d588c626eff4'::uuid,NULL,'Havolani bosmasdan, bankning rasmiy kanalidan xabarni tekshirish',ARRAY['Xabarda ko‘rsatilgan jo‘natuvchi nomiga ishonib, undagi havoladan foydalanish','Saytda HTTPS belgisi bo‘lsa, xatdagi manzilni yetarlicha ishonchli deb bilish','Xabarda ko‘rsatilgan aloqa raqamining o‘zidan mustaqil tasdiq sifatida foydalanish']::text[],'Shoshilinch xabar va maxfiy ma’lumotni so‘rash fishing belgisi bo‘lishi mumkin. Jo‘natuvchi nomi, xat ichidagi aloqa ma’lumoti yoki HTTPS belgisi manbaning haqiqiyligini mustaqil isbotlamaydi. Xabar bankning alohida ma’lum rasmiy kanali orqali tekshiriladi.'),
('2e07d764-150c-b661-778c-d8014e14042e'::uuid,NULL,'Ilovani o‘rnatmasdan manba va ruxsat zaruratini tekshirish',ARRAY['Ilova bahosi yuqori bo‘lsa, barcha so‘ralgan ruxsatlarni tasdiqlash','Dastur do‘konda bo‘lsa, undagi huquqlarni tekshirish talab etilmaydi','Dasturni avval o‘rnatib, ruxsatlar kerakmi yoki yo‘qligini keyin baholash']::text[],'Shubhali ilova so‘ragan huquqlar tekshirilmasdan berilsa, maxfiylik va hisobga kirish xavfi oshishi mumkin. Manbaning ishonchliligi hamda minimal zarur ruxsat tamoyili muhim; dastur do‘konida mavjudlik yoki yuqori reyting mustaqil xavfsizlik kafolati emas.');

CREATE TEMP TABLE task531_review_map (
 source_id uuid PRIMARY KEY, review_id uuid NOT NULL UNIQUE, source_fingerprint text NOT NULL
) ON COMMIT DROP;
DO $preflight$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task531_batch)<>8 THEN RAISE EXCEPTION 'TASK531_EXACT_EIGHT_REQUIRED'; END IF;
 SELECT count(*) INTO n FROM task531_batch b
 JOIN public.questions q ON q.id=b.source_id AND q.status='published' AND q.format='Y1'
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options co ON co.question_id=q.id
     AND co.id::text=k.payload->>'correct_option_id' AND co.content_md=b.expected_correct
 WHERE q.group_code IN ('S7.SEC')
   AND q.source_lesson_id IS NOT NULL AND q.source_reference IS NOT NULL
   AND cardinality(b.wrong)=3
   AND length(b.explanation)>=150
   AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions r WHERE r.source_question_id=q.id)
   AND NOT EXISTS(SELECT 1 FROM public.questions staged
     WHERE staged.source_reference='revision:TASK-531:semantic-distractors:'||q.id::text);
 IF n<>8 THEN RAISE EXCEPTION 'TASK531_SOURCE_OR_KEY_DRIFT_%_OF_8',n; END IF;
 IF EXISTS (
   SELECT 1 FROM task531_batch b
   CROSS JOIN LATERAL unnest(b.wrong) as w(txt)
   WHERE length(btrim(w.txt))<25 OR w.txt=b.expected_correct
 ) THEN RAISE EXCEPTION 'TASK531_INVALID_DISTRACTOR'; END IF;
END $preflight$;

INSERT INTO task531_review_map
SELECT b.source_id,gen_random_uuid(),public.professional_question_fingerprint(b.source_id)
FROM task531_batch b;

INSERT INTO public.questions (
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,
 stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
)
SELECT m.review_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 coalesce(b.new_stem,q.stem_md),q.assets,true,'review'::public.content_status,
 q.author_id,'revision:TASK-531:semantic-distractors:'||q.id::text,q.source_lesson_id
FROM task531_review_map m JOIN public.questions q ON q.id=m.source_id
JOIN task531_batch b ON b.source_id=m.source_id;

CREATE TEMP TABLE task531_option_map (
 old_option_id uuid PRIMARY KEY,new_option_id uuid NOT NULL UNIQUE,
 source_id uuid NOT NULL,review_id uuid NOT NULL,
 is_correct boolean NOT NULL, new_text text NOT NULL
) ON COMMIT DROP;
INSERT INTO task531_option_map
WITH ranked AS (
 SELECT o.*,m.review_id,m.source_id,
   (o.id::text=k.payload->>'correct_option_id') correct,
   row_number() over(
      partition by m.source_id, (o.id::text=k.payload->>'correct_option_id')
      order by o.order_idx,o.id
   ) wrong_position
 FROM task531_review_map m
 JOIN public.question_options o ON o.question_id=m.source_id AND o.side='a'
 JOIN public.question_keys k ON k.question_id=m.source_id
)
SELECT r.id,gen_random_uuid(),r.source_id,r.review_id,r.correct,
  CASE WHEN r.correct THEN r.content_md ELSE b.wrong[r.wrong_position::integer] END
FROM ranked r JOIN task531_batch b ON b.source_id=r.source_id;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT m.new_option_id,m.review_id,o.side,o.order_idx,m.new_text
FROM task531_option_map m JOIN public.question_options o ON o.id=m.old_option_id;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.review_id,
  jsonb_set(k.payload,'{correct_option_id}',to_jsonb(om.new_option_id::text),false),
  b.explanation
FROM task531_review_map m JOIN task531_batch b ON b.source_id=m.source_id
JOIN public.question_keys k ON k.question_id=m.source_id
JOIN task531_option_map om ON om.source_id=m.source_id AND om.is_correct;

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
 FROM task531_review_map m JOIN public.question_options o ON o.question_id=m.review_id
 JOIN public.question_keys k ON k.question_id=m.review_id GROUP BY 1,2
 )
 SELECT count(*) INTO n FROM validate v JOIN task531_batch b ON b.source_id=v.source_id
 WHERE v.total=4 AND v.distinct_n=4 AND v.correct_n=1 AND v.correct_text=b.expected_correct
 AND v.minw>=1 AND v.maxw<=v.minw*1.8 AND v.cw<=v.mw*1.25;
 IF n<>8 THEN RAISE EXCEPTION 'TASK531_OPTION_KEY_BALANCE_FAILED_%_OF_8',n; END IF;
 IF (SELECT count(*) FROM task531_option_map)<>32 THEN
    RAISE EXCEPTION 'TASK531_OPTION_MAP_NOT_32'; END IF;
 IF (SELECT count(*) FROM task531_review_map m
   WHERE public.professional_question_fingerprint(m.source_id)=m.source_fingerprint)<>8
 THEN RAISE EXCEPTION 'TASK531_PUBLISHED_SOURCE_CHANGED'; END IF;
 IF (SELECT count(*) FROM public.questions q JOIN task531_review_map m ON m.review_id=q.id
   WHERE q.status='review')<>8 THEN RAISE EXCEPTION 'TASK531_NOT_REVIEW_ONLY'; END IF;
END $postflight$;

INSERT INTO public.question_bank_revisions (
 source_question_id,revision_question_id,revision_kind,evidence
)
SELECT m.source_id,m.review_id,'task531_semantic_distractor_review',
 jsonb_build_object('task','TASK-531','question_format','Y1',
 'correct_answer_text_unchanged',true,'human_editorial_approval',false,
 'status','review_pending_editorial','release_performed',false,
 'old_question_immutable',true,'audit','first wave of bankwide quality analysis')
FROM task531_review_map m;

INSERT INTO public.question_quality_findings(
 question_id,finding_code,severity,details
)
SELECT m.source_id,'task531_semantic_distractor_review_pending','medium',
 jsonb_build_object('task','TASK-531','replacement_question_id',m.review_id,
  'explanation','Three semantically adjacent distractors and longer individual rationale prepared',
  'publication_status','review_only','approved_independently',false)
FROM task531_review_map m;

SELECT count(*) stage_count,(SELECT count(*) FROM task531_option_map) option_count,
       (SELECT count(*) FROM public.questions q JOIN task531_review_map m ON m.review_id=q.id
         WHERE q.status='review') review_count
FROM task531_review_map;
COMMIT;
