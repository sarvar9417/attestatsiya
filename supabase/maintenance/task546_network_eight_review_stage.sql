-- TASK-546: network-and-search *review-only* semantic distractor upgrade (8 precisely identified Y1 source questions).
-- Source: existing question definitions, correct keys and explanations. Wrong options are original authored teaching examples.
-- Owner approved whole-bank QA and staged releases; THIS MIGRATION NEVER PUBLISHES.
-- Independent expert attestation is NOT claimed; professional approval is required for new answers.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='80s';

CREATE TEMP TABLE task546_batch (
 source_id uuid PRIMARY KEY, new_stem text, expected_correct text NOT NULL,
 wrong text[] NOT NULL, explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task546_batch VALUES
('03866ab9-6791-5e6b-3403-999d93ddb138'::uuid,NULL,'Signalni takrorlash yoki regeneratsiya qilish',ARRAY['Tarmoqlar orasida paketlarni manzil bo‘yicha yo‘naltirish','Ethernet kadrlarini MAC-manzil bo‘yicha uzatish','Domen nomlarini tegishli IP-manzillarga o‘girish']::text[],'Repeater signalni uzatish muhitida susayganda uni tiklash yoki qayta uzatishga xizmat qiladi. Router IP tarmoqlari orasida paketni yo‘naltiradi, switch MAC-manzil bo‘yicha kadrlarni uzatadi, DNS esa domen nomlarini IP-manzilga moslaydi. ICT 11 (2021) PDF 160-sahifada qaytargichning kabel signallarini qayta tiklashi tasvirlangan.'),
('ed3c2030-e2ac-1d94-32d6-8cd8d6e20836'::uuid,NULL,'O''tkazgich juftlarining ulagichdagi rangli tartibini',ARRAY['Ethernet kadrlarining ruxsat etilgan maksimal hajmini','Kabeldagi elektr signalining uzatish chastotasini','Tarmoq kartasiga beriladigan noyob IP-manzilni']::text[],'T-568A va T-568B — Ethernet kabelidagi rangli simlarning 8P8C/RJ45 ulagich pinlariga joylanish tartiblari. ICT 11 (2021) PDF 153-sahifada ular uchun ikkita aniq rang sxemasi berilgan; ular paket hajmi, elektr chastotasi yoki IP-manzil taqsimotini belgilamaydi.'),
('7bb51b69-dd0d-eed7-9c1e-590dd7445992'::uuid,NULL,'IP orqali kirish mumkin, shu serverning domeni orqali kirish ishlamayapti',ARRAY['IP ham domen ham ishlamaydi, lokal kabel ham uzilgan bo‘lishi mumkin','Domen orqali sahifa ochiladi, lekin IP ga ping javob bermaydi','Domen orqali kirish ishlaydi, faqat sahifa sekin yuklanadi']::text[],'Agar muayyan serverning IP-manzili orqali ulanish ishlasa, ammo aynan shu serverning domen nomi yechilmasa, DNS nom–manzil moslashtirish jarayonida nosozlik bo‘lishi ehtimoli kuchli. Biroq bu yagona sabab emas: lokal DNS kesh, noto‘g‘ri yozilgan domen yoki boshqa sozlamalar ham tekshiriladi. ICT 11 (2021) PDF 175–176-sahifalarda DNS nomlarni IP-manzilga aylantirishi bayon qilingan.'),
('83d304a8-e9df-c386-bda0-babff03533b6'::uuid,NULL,'Blok chegaralari va manzil diapazonlari',ARRAY['Hamma subnetlar uchun niqob uzunligining tengligini','Subnetlarning shlyuz manzillari bir xil bo‘lishini','Har subnetga aynan bir xil xost soni ajratilishini']::text[],'VLSM turli uzunlikdagi subnet prefikslari bilan manzil bloklarini taqsimlaydi. Blokning tarmoq chegarasi hamda birinchi va oxirgi manzili tekshirilsa, ikki blok bir-birining ustiga tushmasligi aniqlanadi. Niqob uzunligini yoki xost sonini hamma subnetlar uchun teng qilish VLSMning maqsadi emas. Ushbu xulosa tarmoq adreslash nazariyasiga asoslangan; PDFdagi aniq VLSM sahifasi hali tekshirilmagan.'),
('37b107a3-959e-8df2-daf6-2d61d720d1b1'::uuid,NULL,'TCP yo''qolgan segmentni qayta uzatishni boshqaradi, UDP bunday kafolatni o''zida bermaydi',ARRAY['UDP yo‘qolgan segmentni qayta yuborishni kafolatlaydi, TCP esa buni bajarmaydi','TCP va UDP har bir datagrammaning tartibli yetib borishini bir xil kafolatlaydi','TCP faqat lokal tarmoqda, UDP esa faqat internet tarmog‘ida ishlaydi']::text[],'TCP uzatishdagi ketma-ketlik, tasdiqlash va qayta uzatish kabi mexanizmlarga ega; UDP transport darajasida yetkazilish yoki tartib kafolatini bermaydi. UDPdan foydalanadigan ilova istasa o‘z yuqori qatlamida qayta uzatishni tashkil qilishi mumkin. ICT 11 (2021) PDF 172-sahifa TCP/IP atamasini tanishtiradi, ammo TCP–UDPning barcha farqlarini shu sahifa tasdiqlamaydi.'),
('cdc2e64a-e62b-e35e-3fda-28994efce954'::uuid,NULL,'Kalitlarni aniqlashtirish, operator qo‘shish, yangi natijani qayta baholash',ARRAY['Bir xil kalit so‘zlarni qayta yuborib, natijalarni solishtirmasdan tanlash','Birinchi natijani tanlab, boshqa manbalarning ishonchliligini tekshirmaslik','Juda umumiy so‘zlarni ishlatib, qidiruv natijasini qayta baholamaslik']::text[],'Noaniq qidiruv natijasidan keyin aniqroq kalit so‘zlar, qo‘shtirnoq yoki mos qidiruv operatorlari bilan so‘rovni takomillashtirish va topilgan sahifalarning mosligi hamda ishonchliligini baholash kerak. Bir xil so‘rovni takrorlash yoki tekshiruvsiz birinchi havolani tanlash natija sifatini yaxshilamaydi. Darslikning aynan ko‘rsatilgan M6/C5 sahifa diapazoni hali tekshirilmagan.'),
('fac120d8-5157-0300-4f31-5f1bfe247f33'::uuid,NULL,'Ko''rsatish tartibiga to''lov ta''sir qilgan bo''lishi mumkin',ARRAY['Reklama belgisi natijaning rasmiy manba ekanini albatta bildiradi','Homiylik to‘lovi natijaning barcha faktlari tekshirilganligini kafolatlaydi','Natija birinchi chiqsa, uning joyi faqat dolzarblik bilan belgilanadi']::text[],'Qidiruvdagi homiylik yoki reklama belgisi sahifaning ko‘rinish tartibiga to‘lov ta’sir qilgan bo‘lishi mumkinligini bildiradi. Bu sahifa rasmiy, to‘g‘ri yoki xolis degani emas. Natijani baholashda reklama maqomi, domen, muallif va boshqa mustaqil manbalar alohida tekshiriladi. Asl M6/C5 sahifalaridagi aniq bayon hali mustaqil tasdiqlanmagan.'),
('2b613454-06ad-44c3-8907-2f115cc1f199'::uuid,NULL,'Saytning haqiqiyligi va bu ma’lumot nima uchun kerakligini',ARRAY['Sayt dizayni rasmiy portalga o‘xshashi va sahifaning tez yuklanishini','Brauzerdagi qulf belgisi ko‘rinishi va HTTPS ulanishining mavjudligini','Foydalanuvchi izohlari ko‘pligi va umumiy baholash reytingining yuqoriligini']::text[],'Shaxsiy ma’lumot kiritishdan oldin sayt haqiqiyligi, ma’lumot so‘ralish maqsadi va so‘rovning zarurligi tekshiriladi. HTTPS ma’lumotni uzatishda shifrlashni bildiradi, lekin alohida saytning qonuniyligi yoki ma’lumotni yig‘ishga haqliligini kafolatlamaydi. Dizayn va reyting ham yetarli dalil emas. Bu savolga biriktirilgan maxsus source_ref manbasi mustaqil ko‘rilmagan.');

CREATE TEMP TABLE task546_review_map (
 source_id uuid PRIMARY KEY, review_id uuid NOT NULL UNIQUE, source_fingerprint text NOT NULL
) ON COMMIT DROP;
DO $preflight$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task546_batch)<>8 THEN RAISE EXCEPTION 'TASK546_EXACT_EIGHT_REQUIRED'; END IF;
 SELECT count(*) INTO n FROM task546_batch b
 JOIN public.questions q ON q.id=b.source_id AND q.status='published' AND q.format='Y1'
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options co ON co.question_id=q.id
     AND co.id::text=k.payload->>'correct_option_id' AND co.content_md=b.expected_correct
 WHERE q.group_code IN ('S6.NET')
   AND q.source_lesson_id IS NOT NULL AND q.source_reference IS NOT NULL
   AND cardinality(b.wrong)=3
   AND length(b.explanation)>=150
   AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions r WHERE r.source_question_id=q.id)
   AND NOT EXISTS(SELECT 1 FROM public.questions staged
     WHERE staged.source_reference='revision:TASK-546:semantic-distractors:'||q.id::text);
 IF n<>8 THEN RAISE EXCEPTION 'TASK546_SOURCE_OR_KEY_DRIFT_%_OF_8',n; END IF;
 IF EXISTS (
   SELECT 1 FROM task546_batch b
   CROSS JOIN LATERAL unnest(b.wrong) as w(txt)
   WHERE length(btrim(w.txt))<25 OR w.txt=b.expected_correct
 ) THEN RAISE EXCEPTION 'TASK546_INVALID_DISTRACTOR'; END IF;
END $preflight$;

INSERT INTO task546_review_map
SELECT b.source_id,gen_random_uuid(),public.professional_question_fingerprint(b.source_id)
FROM task546_batch b;

INSERT INTO public.questions (
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,
 stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
)
SELECT m.review_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 coalesce(b.new_stem,q.stem_md),q.assets,true,'review'::public.content_status,
 q.author_id,'revision:TASK-546:semantic-distractors:'||q.id::text,q.source_lesson_id
FROM task546_review_map m JOIN public.questions q ON q.id=m.source_id
JOIN task546_batch b ON b.source_id=m.source_id;

CREATE TEMP TABLE task546_option_map (
 old_option_id uuid PRIMARY KEY,new_option_id uuid NOT NULL UNIQUE,
 source_id uuid NOT NULL,review_id uuid NOT NULL,
 is_correct boolean NOT NULL, new_text text NOT NULL
) ON COMMIT DROP;
INSERT INTO task546_option_map
WITH ranked AS (
 SELECT o.*,m.review_id,m.source_id,
   (o.id::text=k.payload->>'correct_option_id') correct,
   row_number() over(
      partition by m.source_id, (o.id::text=k.payload->>'correct_option_id')
      order by o.order_idx,o.id
   ) wrong_position
 FROM task546_review_map m
 JOIN public.question_options o ON o.question_id=m.source_id AND o.side='a'
 JOIN public.question_keys k ON k.question_id=m.source_id
)
SELECT r.id,gen_random_uuid(),r.source_id,r.review_id,r.correct,
  CASE WHEN r.correct THEN r.content_md ELSE b.wrong[r.wrong_position::integer] END
FROM ranked r JOIN task546_batch b ON b.source_id=r.source_id;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT m.new_option_id,m.review_id,o.side,o.order_idx,m.new_text
FROM task546_option_map m JOIN public.question_options o ON o.id=m.old_option_id;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.review_id,
  jsonb_set(k.payload,'{correct_option_id}',to_jsonb(om.new_option_id::text),false),
  b.explanation
FROM task546_review_map m JOIN task546_batch b ON b.source_id=m.source_id
JOIN public.question_keys k ON k.question_id=m.source_id
JOIN task546_option_map om ON om.source_id=m.source_id AND om.is_correct;

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
 FROM task546_review_map m JOIN public.question_options o ON o.question_id=m.review_id
 JOIN public.question_keys k ON k.question_id=m.review_id GROUP BY 1,2
 )
 SELECT count(*) INTO n FROM validate v JOIN task546_batch b ON b.source_id=v.source_id
 WHERE v.total=4 AND v.distinct_n=4 AND v.correct_n=1 AND v.correct_text=b.expected_correct
 AND v.minw>=1 AND v.maxw<=v.minw*1.8 AND v.cw<=v.mw*1.25;
 IF n<>8 THEN RAISE EXCEPTION 'TASK546_OPTION_KEY_BALANCE_FAILED_%_OF_8',n; END IF;
 IF (SELECT count(*) FROM task546_option_map)<>32 THEN
    RAISE EXCEPTION 'TASK546_OPTION_MAP_NOT_32'; END IF;
 IF (SELECT count(*) FROM task546_review_map m
   WHERE public.professional_question_fingerprint(m.source_id)=m.source_fingerprint)<>8
 THEN RAISE EXCEPTION 'TASK546_PUBLISHED_SOURCE_CHANGED'; END IF;
 IF (SELECT count(*) FROM public.questions q JOIN task546_review_map m ON m.review_id=q.id
   WHERE q.status='review')<>8 THEN RAISE EXCEPTION 'TASK546_NOT_REVIEW_ONLY'; END IF;
END $postflight$;

INSERT INTO public.question_bank_revisions (
 source_question_id,revision_question_id,revision_kind,evidence
)
SELECT m.source_id,m.review_id,'task546_semantic_distractor_review',
 jsonb_build_object('task','TASK-546','question_format','Y1',
 'correct_answer_text_unchanged',true,'human_editorial_approval',false,
 'status','review_pending_editorial','release_performed',false,
 'old_question_immutable',true,'audit','first wave of bankwide quality analysis')
FROM task546_review_map m;

INSERT INTO public.question_quality_findings(
 question_id,finding_code,severity,details
)
SELECT m.source_id,'task546_semantic_distractor_review_pending','medium',
 jsonb_build_object('task','TASK-546','replacement_question_id',m.review_id,
  'explanation','Three semantically adjacent distractors and longer individual rationale prepared',
  'publication_status','review_only','approved_independently',false)
FROM task546_review_map m;

SELECT count(*) stage_count,(SELECT count(*) FROM task546_option_map) option_count,
       (SELECT count(*) FROM public.questions q JOIN task546_review_map m ON m.review_id=q.id
         WHERE q.status='review') review_count
FROM task546_review_map;
COMMIT;
