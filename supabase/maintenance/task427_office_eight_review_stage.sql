-- TASK-427: third *review-only* semantic distractor upgrade, Office suite (8 precisely identified Y1 source questions).
-- Source: existing question definitions, correct keys and explanations. Wrong options are original authored teaching examples.
-- Owner approved whole-bank QA and staged releases; THIS MIGRATION NEVER PUBLISHES.
-- Independent expert attestation is NOT claimed; professional approval is required for new answers.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='80s';

CREATE TEMP TABLE task427_batch (
 source_id uuid PRIMARY KEY, new_stem text, expected_correct text NOT NULL,
 wrong text[] NOT NULL, explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task427_batch VALUES
('cd772e39-d561-8aab-7986-a6f200445980'::uuid,NULL,'Conditional Formatting, less than 50',ARRAY['Data Validation → Whole number → Less than 50','Sort & Filter → Sort Smallest to Largest','Home → Fill Color → Red (all cells)']::text[],'Excelda 50 dan kichik qiymatlarga avtomatik qizil rang berish uchun Conditional Formatting qoidasida Less Than 50 sharti belgilanadi. Data Validation kiritishni cheklaydi, Sort & Filter tartibni o‘zgartiradi, oddiy Fill Color esa shartga qarab avtomatik yangilanmaydi.'),
('813fb43d-17bf-7f9c-7368-8d1fe26287d9'::uuid,NULL,'Recipient List + Merge Field (Ism, Sinf) + Preview Results + Finish Merge',ARRAY['Insert → Table → Merge Cells → Copy → Save As PDF','References → Insert Citation → Update Field → Print Current Page','Review → Track Changes → Accept All → Print 40 Copies']::text[],'Word Mail Merge ma’lumot manbasidagi 40 ta yozuvni shablon bilan bog‘laydi; Recipient List va Merge Field yordamida ism hamda sinf maydonlari qo‘shiladi, Preview Results orqali tekshiriladi va Finish Merge bilan alohida sertifikatlar tayyorlanadi. Jadval kataklarini birlashtirish yoki oddiy nusxalash satrlar bo‘yicha avtomatik almashtirish emas.'),
('dd8d8ed0-9187-5f44-2c54-a1dbb3b6d803'::uuid,NULL,'Jadvaldan oldin va keyin Section Break (Next Page) kiritib, faqat o‘rtadagi sectionni Landscape qilish',ARRAY['Jadvaldan oldin va keyin Page Break kiritib, o‘rtadagi sahifaga alohida uslub berish','Jadvaldan oldin Section Break kiritib, undan keyingi barcha sahifalarni Landscape qilish','Jadvalni 90 daraja burilgan rasmga aylantirib, barcha sahifalarni Portrait qoldirish']::text[],'Wordda Orientation sozlamasi section darajasida boshqariladi. Kerakli jadval sahifasidan oldin va keyin Section Break (Next Page) qo‘yilib, faqat o‘rta bo‘lim Landscape qilinadi; keyingi bo‘lim yana Portrait bo‘lib qoladi. Page Break o‘zi mustaqil section yaratmaydi, rasmga aylantirish esa tahrirlanadigan jadval talabini bajarmaydi.'),
('a88f3eab-5d91-ee34-6121-30231555b187'::uuid,NULL,'Entrance slayd ichidagi obyektga, Fade (Transition) esa slaydlar almashishiga tegishli',ARRAY['Entrance slaydlar almashishiga, Fade esa slayddagi rasm paydo bo‘lishiga tegishli','Entrance bilan Fade ikkalasi ham faqat obyektlarga biriktiriladigan animatsiya effektlaridir','Entrance slayd ichidagi rasmga, Fade esa matn shriftini o‘zgartirishga xizmat qiladi']::text[],'PowerPointda Entrance animatsiyasi slayd ichidagi obyektning paydo bo‘lishini boshqaradi, Transition turidagi Fade esa slaydlar orasidagi o‘tishni belgilaydi. Bular obyekt va butun slayd darajasidagi turli mexanizmlardir; obyekt animatsiyasini slayd almashish effekti bilan aralashtirmaslik kerak.'),
('15599f0c-323d-b28a-ae69-2c6ad4ea9896'::uuid,NULL,'Enter yangi abzas, Shift+Enter abzas ichida satr uzilishi yaratadi',ARRAY['Enter faqat satr uzadi, Shift+Enter esa yangi abzasni boshlaydi','Enter va Shift+Enter yangi abzas yaratadi, farqi faqat tekislanishda','Enter sahifa oxirini belgilaydi, Shift+Enter matnni keyingi sahifaga ko‘chiradi']::text[],'Wordda Enter yangi abzas (paragraph) boshlaydi va uning abzas formatlash xususiyatlari ajraladi. Shift+Enter esa bir abzas ichida majburiy satr uzilishini kiritadi; u yangi abzas yoki yangi sahifa yaratmaydi. Bu farq tekislash, ro‘yxatlar va oraliqlar uchun ahamiyatli.'),
('5672ac57-35ea-f504-94cd-e5d4f321c22b'::uuid,NULL,'Transitions → Advance Slide → After: 00:15 (zarur slaydlarda)',ARRAY['Animations → Start After Previous → Duration: 15 soniya (barcha obyektlarga)','Slide Show → Rehearse Timings → 15 soniya (faqat birinchi slaydda)','Transitions → Duration: 15 soniya, Advance Slide faqat Mouse Click']::text[],'PowerPointda slaydni avtomatik almashtirish vaqti Transitions oynasidagi Advance Slide — After maydonida beriladi; 15 soniyalik sozlama kerakli slaydlarga yoki barchasiga qo‘llanadi. Transition Duration o‘tish animatsiyasi davomiyligini belgilaydi, obyekt Animations esa slayd almashtirish vaqti emas.'),
('939fc993-7f18-1dd8-17ca-35882f0f5692'::uuid,NULL,'SUM qiymatlarni qo‘shadi, COUNTIF shartga moslarni sanaydi',ARRAY['SUM qiymatlarni sanaydi, COUNTIF shartga moslarni qo‘shadi','SUM shartni tekshiradi, COUNTIF jami qiymatni hisoblaydi','SUM faqat raqam formatlaydi, COUNTIF kataklarni saralaydi']::text[],'SUM berilgan sonli qiymatlarning yig‘indisini hisoblaydi. COUNTIF esa ko‘rsatilgan diapazonda belgilangan shartga mos keladigan kataklar sonini qaytaradi. Shart asosida qiymatlarni yig‘ish uchun alohida SUMIF ishlatiladi; SUM va COUNTIF vazifalarini almashtirmaslik kerak.'),
('d53d3cfc-f971-a72c-8c98-90cd2084dbdb'::uuid,NULL,'Ustun eni son yoki sanani ko‘rsatishga tor',ARRAY['Katak formulasi nolga bo‘lish xatosini qaytarayotgan bo‘lishi mumkin','Katakdagi matn kodlash turi bilan mos kelmayotgan bo‘lishi mumkin','Katakda manzil topilmaganligi sababli #REF! xatosi yashirilgan bo‘lishi mumkin']::text[],'Excelda katakda ##### ko‘rinishi ko‘pincha ustun eni son yoki sana/vaqt qiymatini ko‘rsatishga yetmasligini bildiradi. Ustunni kengaytirish odatiy tekshiruvdir. Nolga bo‘lish va noto‘g‘ri manzil kabi formula xatolari esa odatda #DIV/0! yoki #REF! ko‘rinishida chiqadi; ayrim sana/vaqt qiymatlari ham maxsus holatlar keltirishi mumkin.');

CREATE TEMP TABLE task427_review_map (
 source_id uuid PRIMARY KEY, review_id uuid NOT NULL UNIQUE, source_fingerprint text NOT NULL
) ON COMMIT DROP;
DO $preflight$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task427_batch)<>8 THEN RAISE EXCEPTION 'TASK427_EXACT_EIGHT_REQUIRED'; END IF;
 SELECT count(*) INTO n FROM task427_batch b
 JOIN public.questions q ON q.id=b.source_id AND q.status='published' AND q.format='Y1'
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options co ON co.question_id=q.id
     AND co.id::text=k.payload->>'correct_option_id' AND co.content_md=b.expected_correct
 WHERE q.group_code IN ('S2.OFFICE')
   AND q.source_lesson_id IS NOT NULL AND q.source_reference IS NOT NULL
   AND cardinality(b.wrong)=3
   AND length(b.explanation)>=150
   AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions r WHERE r.source_question_id=q.id)
   AND NOT EXISTS(SELECT 1 FROM public.questions staged
     WHERE staged.source_reference='revision:TASK-427:semantic-distractors:'||q.id::text);
 IF n<>8 THEN RAISE EXCEPTION 'TASK427_SOURCE_OR_KEY_DRIFT_%_OF_8',n; END IF;
 IF EXISTS (
   SELECT 1 FROM task427_batch b
   CROSS JOIN LATERAL unnest(b.wrong) as w(txt)
   WHERE length(btrim(w.txt))<25 OR w.txt=b.expected_correct
 ) THEN RAISE EXCEPTION 'TASK427_INVALID_DISTRACTOR'; END IF;
END $preflight$;

INSERT INTO task427_review_map
SELECT b.source_id,gen_random_uuid(),public.professional_question_fingerprint(b.source_id)
FROM task427_batch b;

INSERT INTO public.questions (
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,
 stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
)
SELECT m.review_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 coalesce(b.new_stem,q.stem_md),q.assets,true,'review'::public.content_status,
 q.author_id,'revision:TASK-427:semantic-distractors:'||q.id::text,q.source_lesson_id
FROM task427_review_map m JOIN public.questions q ON q.id=m.source_id
JOIN task427_batch b ON b.source_id=m.source_id;

CREATE TEMP TABLE task427_option_map (
 old_option_id uuid PRIMARY KEY,new_option_id uuid NOT NULL UNIQUE,
 source_id uuid NOT NULL,review_id uuid NOT NULL,
 is_correct boolean NOT NULL, new_text text NOT NULL
) ON COMMIT DROP;
INSERT INTO task427_option_map
WITH ranked AS (
 SELECT o.*,m.review_id,m.source_id,
   (o.id::text=k.payload->>'correct_option_id') correct,
   row_number() over(
      partition by m.source_id, (o.id::text=k.payload->>'correct_option_id')
      order by o.order_idx,o.id
   ) wrong_position
 FROM task427_review_map m
 JOIN public.question_options o ON o.question_id=m.source_id AND o.side='a'
 JOIN public.question_keys k ON k.question_id=m.source_id
)
SELECT r.id,gen_random_uuid(),r.source_id,r.review_id,r.correct,
  CASE WHEN r.correct THEN r.content_md ELSE b.wrong[r.wrong_position::integer] END
FROM ranked r JOIN task427_batch b ON b.source_id=r.source_id;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT m.new_option_id,m.review_id,o.side,o.order_idx,m.new_text
FROM task427_option_map m JOIN public.question_options o ON o.id=m.old_option_id;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.review_id,
  jsonb_set(k.payload,'{correct_option_id}',to_jsonb(om.new_option_id::text),false),
  b.explanation
FROM task427_review_map m JOIN task427_batch b ON b.source_id=m.source_id
JOIN public.question_keys k ON k.question_id=m.source_id
JOIN task427_option_map om ON om.source_id=m.source_id AND om.is_correct;

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
 FROM task427_review_map m JOIN public.question_options o ON o.question_id=m.review_id
 JOIN public.question_keys k ON k.question_id=m.review_id GROUP BY 1,2
 )
 SELECT count(*) INTO n FROM validate v JOIN task427_batch b ON b.source_id=v.source_id
 WHERE v.total=4 AND v.distinct_n=4 AND v.correct_n=1 AND v.correct_text=b.expected_correct
 AND v.minw>=1 AND v.maxw<=v.minw*1.8 AND v.cw<=v.mw*1.25;
 IF n<>8 THEN RAISE EXCEPTION 'TASK427_OPTION_KEY_BALANCE_FAILED_%_OF_8',n; END IF;
 IF (SELECT count(*) FROM task427_option_map)<>32 THEN
    RAISE EXCEPTION 'TASK427_OPTION_MAP_NOT_32'; END IF;
 IF (SELECT count(*) FROM task427_review_map m
   WHERE public.professional_question_fingerprint(m.source_id)=m.source_fingerprint)<>8
 THEN RAISE EXCEPTION 'TASK427_PUBLISHED_SOURCE_CHANGED'; END IF;
 IF (SELECT count(*) FROM public.questions q JOIN task427_review_map m ON m.review_id=q.id
   WHERE q.status='review')<>8 THEN RAISE EXCEPTION 'TASK427_NOT_REVIEW_ONLY'; END IF;
END $postflight$;

INSERT INTO public.question_bank_revisions (
 source_question_id,revision_question_id,revision_kind,evidence
)
SELECT m.source_id,m.review_id,'task427_semantic_distractor_review',
 jsonb_build_object('task','TASK-427','question_format','Y1',
 'correct_answer_text_unchanged',true,'human_editorial_approval',false,
 'status','review_pending_editorial','release_performed',false,
 'old_question_immutable',true,'audit','first wave of bankwide quality analysis')
FROM task427_review_map m;

INSERT INTO public.question_quality_findings(
 question_id,finding_code,severity,details
)
SELECT m.source_id,'task427_semantic_distractor_review_pending','high',
 jsonb_build_object('task','TASK-427','replacement_question_id',m.review_id,
  'explanation','Three semantically adjacent distractors and longer individual rationale prepared',
  'publication_status','review_only','approved_independently',false)
FROM task427_review_map m;

SELECT count(*) stage_count,(SELECT count(*) FROM task427_option_map) option_count,
       (SELECT count(*) FROM public.questions q JOIN task427_review_map m ON m.review_id=q.id
         WHERE q.status='review') review_count
FROM task427_review_map;
COMMIT;
