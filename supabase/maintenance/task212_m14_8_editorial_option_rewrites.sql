-- TASK-212 · 2026-10-18 · controlled AI-assisted KS draft option corrections.
-- Explicit owner authorization to waive a separate external expert; NOT an
-- assertion of independent official/source-key verification.
-- Applies ONLY to the 26 KS questions still in REVIEW. Never touches a
-- published immutable item, exam attempts, or answer-key option UUIDs.
-- Source: 13-page secondary "Pedagogning kasbiy standarti — qo'llanma".
BEGIN;
CREATE TEMP TABLE task212_edits (
  locator_suffix text, order_idx int, expected_old text, new_text text
) ON COMMIT DROP;
INSERT INTO task212_edits VALUES
  ('page-2:topic-1:question-1',1,'Davlat ta’lim talablari va amaldagi o‘quv dasturini','Davlat ta’lim standartlari va amaldagi o‘quv dasturini'),
  ('page-2:topic-1:question-1',2,'Sinf jihozlari ro‘yxati va texnika xarid rejasini','O‘tgan yilgi dars ishlanmalari va mavjud darslikdagi topshiriqlarni'),
  ('page-2:topic-1:question-1',3,'O‘tgan yil tadbirlari va kabinet foydalanish jadvalini','Maktabning ichki tavsiyalari va ota-onalar so‘rovnomalari natijalarini'),
  ('page-2:topic-1:question-1',4,'Darslik muqovasi va sinfdagi o‘quvchilar sonini','Fan bo‘yicha sinov natijalari va kabinet jihozlari imkoniyatlarini'),
  ('page-2:topic-1:question-3',1,'Raqamli qurilma ishlab chiqarilgan yil va markasi ro‘yxati','Interfaol slaydlar soni va namoyish vaqti haqidagi ma’lumotlar'),
  ('page-2:topic-1:question-3',2,'Raqamli vositani olib keladigan xodimning telefon raqami','Raqamli vositaning texnik tavsifi va uni saqlash sharoitlari'),
  ('page-2:topic-1:question-3',4,'Raqamli texnikaning sinfdagi doimiy joylashuvi sxemasi','Mavjud elektron resurslar ro‘yxati va namoyish qilish ketma-ketligi'),
  ('page-8:topic-4:question-3',1,'Kitoblar muqovasi bir xil o‘lchamda saqlanishida','Klub yig‘ilishlari rejalashtirilgan kunlarda bir xil vaqtda o‘tkazilishida'),
  ('page-8:topic-4:question-3',2,'Kutubxona jurnali har kuni aynan bir kunda to‘lishida','Klub a’zolarining har biri bir xil o‘qish jadvaliga rioya qilishida'),
  ('page-8:topic-4:question-3',3,'Barcha ishtirokchilarning bir xil kitobni tanlashida','Muhokama qilingan barcha kitoblar yuzasidan qat’iy hisobot topshirilishida'),
  ('page-8:topic-4:question-6',1,'Nazorat savollarining rasmiy formatini shakllantirish','Vaziyatni jonli ifodalash va chiqish mahoratini tekshirishni'),
  ('page-8:topic-4:question-6',2,'Maktabdagi darslar davomatining hisobini shakllantirish','Har bir guruhning o‘z fikrini qat’iy himoya qilishini'),
  ('page-8:topic-4:question-6',4,'O‘quv dasturida yangi mavzu ro‘yxatini shakllantirish','Muhokamada aytilgan barcha qarashlarni bitta xulosaga keltirishni'),
  ('page-12:topic-6:question-2',2,'Darsdagi barcha o‘quvchi bahosini yagona natijaga keltirish','Dars kuzatuvlarini umumlashtirib nazorat hisobotini tayyorlash'),
  ('page-12:topic-6:question-2',3,'Fan dasturidagi barcha vazifani yig‘ilish bilan almashtirish','Hamkasblarning ishini faqat o‘quvchi baholari bo‘yicha solishtirish'),
  ('page-12:topic-6:question-2',4,'Sinfdagi barcha topshiriq va jihozni bir shaklga keltirish','Har bir o‘qituvchi uchun yagona dars shaklini belgilash'),
  ('page-12:topic-6:question-3',1,'Kasbiy adabiyotni o‘quvchilar bahosidan ustun qo‘yishni','Tadqiqot natijalarini sinf ehtiyojlarini tekshirmay to‘liq takrorlashni'),
  ('page-12:topic-6:question-3',3,'Kasbiy adabiyotni o‘qigach har qanday sinovni to‘xtatishni','Yangi metodni sinov natijasidan qat’i nazar barcha sinflarga joriy etishni'),
  ('page-12:topic-6:question-3',4,'Kasbiy adabiyotni faqat sertifikat olish uchun yig‘ishni','Metodning samaradorligini o‘lchamay turib umumiy xulosa chiqarishni'),
  ('page-13:topic-7:question-1',1,'Ularni faqat yig‘ilish ro‘yxatini imzolashga chaqirish','Yig‘ilishda tayyor reja bilan tanishtirib faqat rozilik so‘rash'),
  ('page-13:topic-7:question-1',2,'Ularni faqat tayyor qarorni tinglash uchun yig‘ish','Tuzilgan vazifalarni ota-onalarga bir tomonlama taqsimlab berish'),
  ('page-13:topic-7:question-1',4,'Ularni faqat loyiha tugaganidan keyin bahoga chaqirish','Jarayon davomida ota-onalardan faqat yozma hisobot olish'),
  ('page-13:topic-7:question-3',2,'Yakuniy bilim natijasini mahalliy tashkilotga to‘liq topshirish','Ijtimoiy faoliyatning ta’limiy maqsadini to‘liq tashqi hamkorga topshirish'),
  ('page-13:topic-7:question-3',3,'O‘quv dasturini maktabdan tashqari tashkilotda tasdiqlash','Hamkor tashkilotga o‘quvchilarning yakuniy baholarini belgilash vakolatini berish'),
  ('page-13:topic-7:question-3',4,'Yakuniy baholash mezonini boshqa tashkilotga almashtirish','Tashkilot taklifini o‘quvchilarning ehtiyojlarini hisobga olmasdan qabul qilish');
DO $check$
DECLARE n integer; target_count integer;
BEGIN
 SELECT count(*) INTO n FROM task212_edits;
 IF n<>25 THEN RAISE EXCEPTION 'TASK212_EXPECTED_25_EDITS_GOT_%',n; END IF;
 SELECT count(*) INTO target_count
 FROM task212_edits e JOIN public.questions q
   ON right(q.source_reference,length(e.locator_suffix))=e.locator_suffix
 JOIN public.question_options o ON o.question_id=q.id AND o.order_idx=e.order_idx AND trim(o.side)='a'
 WHERE q.status='review' AND q.group_code='KS' AND o.content_md=e.expected_old
   AND q.source_reference LIKE 'authored:ai-assisted:m14-closed-20261018:kasb-standarti:%';
 IF target_count<>25 THEN
   RAISE EXCEPTION 'TASK212_REVIEW_DRIFT: matching % of 25',target_count;
 END IF;
END $check$;
UPDATE public.question_options o
SET content_md=e.new_text
FROM task212_edits e
JOIN public.questions q ON right(q.source_reference,length(e.locator_suffix))=e.locator_suffix
WHERE q.status='review' AND q.group_code='KS'
  AND q.source_reference LIKE 'authored:ai-assisted:m14-closed-20261018:kasb-standarti:%'
  AND o.question_id=q.id AND o.order_idx=e.order_idx AND trim(o.side)='a'
  AND o.content_md=e.expected_old;
DO $qa$
DECLARE bad_count int;
BEGIN
 WITH y AS (
  SELECT q.id,
    count(o.id) n,
    count(distinct lower(trim(o.content_md))) nd,
    min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mn,
    max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mx,
    max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
      FILTER (WHERE o.id::text=k.payload->>'correct_option_id') cw,
    max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
      FILTER (WHERE o.id::text<>k.payload->>'correct_option_id') mw
  FROM public.questions q JOIN public.question_options o
    ON o.question_id=q.id AND trim(o.side)='a'
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.group_code='KS' AND q.status='review'
  GROUP BY q.id
 ) SELECT count(*) INTO bad_count FROM y
   WHERE n<>4 OR nd<>4 OR mx>mn*1.8 OR cw>mw*1.25;
 IF bad_count<>0 THEN RAISE EXCEPTION 'TASK212_KS_OPTION_QUALITY_FAILURE_%',bad_count; END IF;
END $qa$;
COMMIT;
