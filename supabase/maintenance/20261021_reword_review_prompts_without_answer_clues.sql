-- Review-only correction: clarify the ordering criterion without disclosing the correct sequence.
BEGIN;
CREATE TEMP TABLE clarity_reword ON COMMIT DROP AS
with edits(question_id, old_stem, new_stem) as (
values
  ('03fe7137-524c-4936-b1c1-70633af8cfb9'::uuid, 'Uch xil siklni shartni tekshirish usuli bilan moslashtiring.', 'Chapdagi uch xil sikl turini o‘ngdagi bajarilish yoki shartni tekshirish xususiyati bilan moslashtiring. Har bir siklga unga xos bitta ta’rifni tanlang.'),
  ('e2910000-0000-4000-8000-000000000011'::uuid, 'Grafik muharrirdagi amallarni ularning oqibati bilan moslashtiring.', 'Chapdagi Zoom, Crop, Resize va Canvas size buyruqlarini o‘ngdagi tasvirga ta’siri bilan moslashtiring. Piksel soni, ishchi maydon va ekrandagi ko‘rinish o‘zgarishini farqlang.'),
  ('2082660e-a258-574d-91e7-8c30e358eed0'::uuid, 'Modellarni ifodalash shakli, 2-to‘plam: to‘rtta tasvirni ularning asosiy model turi bilan moslashtiring.', 'Modellarni ifodalash shakli, 2-to‘plam: chapdagi to‘rtta vaziyatni o‘ngdagi model turi (moddiy, matematik, verbal, grafik) bilan moslashtiring. Har bir vaziyat uchun qanday ifodalash usuli ishlatilganini aniqlang.'),
  ('72064360-3f8c-42d0-a93e-bbc0cb2a6265'::uuid, 'Baholash va qayta aloqa siklini tartiblang.', 'Baholash va qayta aloqa siklidagi amallarni pedagogik ish jarayonining bajarilish tartibida joylashtiring. Eng avval bajarilishi kerak bo‘lgan amal yuqorida, eng oxirgisi pastda bo‘lsin.'),
  ('56a12955-c724-4a9a-accf-cc2461ec37b1'::uuid, 'Darsni metodik tahlil qilish jarayonini tartiblang.', 'Kuzatilgan darsni metodik tahlil qilishda ushbu amallar qaysi amaliy ketma-ketlikda bajariladi? Birinchi tahliliy harakatdan yakuniy metodik tavsiyagacha tartiblang.'),
  ('a9057034-7beb-408a-94d4-310ba72a9fe0'::uuid, 'Fayl uzatish vaqtini hisoblash bosqichlarini to‘g‘ri tartiblang.', 'Fayl hajmi va uzatish tezligidan uzatish vaqtini topishda bajariladigan amallarni ish tartibida joylashtiring. Hisoblashga tayyorgarlikdan yakuniy natijani tekshirishgacha bo‘lgan izchillikni aniqlang.'),
  ('c46c5954-023f-42fe-a83c-ce711579da0a'::uuid, 'Taqdimotni tayyorlashning mantiqiy ketma-ketligini tartiblang.', 'Auditoriya uchun PowerPoint taqdimotini tayyorlash jarayonidagi amallarni dastlabki rejalashtirishdan namoyish oldi tekshiruvigacha bajarilish tartibida joylashtiring.'),
  ('b01fd173-9b76-40c4-af34-78a066dd6b60'::uuid, 'Masaladan algoritm tuzish jarayonini tartiblang.', 'Masalani yechadigan algoritm yaratishda berilgan amallarni standart ishlab chiqish ketma-ketligida joylashtiring. Muammoni tahlil qilishdan tayyor algoritmni sinashgacha bo‘lgan ish oqimini aniqlang.'),
  ('336b7ad1-314f-4b2b-98cc-bd1e721b4b64'::uuid, 'Qiymatlarni tekshirish bosqichlarini tartiblang.', 'Dastur natijasini tekshirish uchun berilgan to‘rtta amalni sinov jarayonining tabiiy bajarilish tartibida joylashtiring. Kirish holatini tayyorlashdan natijalarni baholashgacha izchillikni aniqlang.'),
  ('f371d698-c17e-48ab-b6df-31f1624dc300'::uuid, 'EKUB(28,12) ayirish jarayonini tartiblang.', 'EKUB(28,12) ni Evklidning ayirish usuli bilan topishda (a,b) juftliklar qaysi tartibda hosil bo‘ladi? Boshlang‘ich (28,12) holatdan ikkala qiymat tenglashguncha holatlarni vaqt bo‘yicha joylashtiring.'),
  ('ed169926-b3e4-1b3a-14b4-98f67121e190'::uuid, 'Vebga kirish: berilgan bosqichlarni to‘g‘ri tartiblang.', 'Brauzerda URL kiritib veb-sahifani ochishda tarmoqdagi berilgan bosqichlar qaysi vaqt ketma-ketligida sodir bo‘ladi? Eng birinchi harakatdan server javobigacha tartiblang.'),
  ('fc3edbc6-11f2-0ea3-0e38-fe9a5f16a9e6'::uuid, 'CTR hisobini izohlash bosqichlarini tartiblang.', 'Reklama kampaniyasining CTR (havolaga bosish foizi) ko‘rsatkichini hisoblab izohlash uchun berilgan amallarni bajarilish tartibida joylashtiring. Ma’lumot yig‘ishdan natijani kampaniya maqsadi bilan baholashgacha izchillikni aniqlang.')
)
SELECT * FROM edits;

DO $preflight$ BEGIN
 IF (SELECT count(*) FROM clarity_reword)<>12 OR
    (SELECT count(*) FROM clarity_reword e JOIN public.question_bank_revisions r
      ON r.source_question_id=e.question_id
      JOIN public.questions q ON q.id=r.revision_question_id
      WHERE r.revision_kind='order_match_instruction_clarity'
        AND q.status='review'::public.content_status
        AND q.stem_md=r.evidence->>'proposed_stem') <> 12
 THEN RAISE EXCEPTION 'CLARITY_REVIEW_REWORD_PRECHECK_FAILED'; END IF;
END $preflight$;

UPDATE public.questions q
 SET stem_md=e.new_stem,updated_at=now()
FROM clarity_reword e
JOIN public.question_bank_revisions r ON r.source_question_id=e.question_id
WHERE q.id=r.revision_question_id AND q.status='review'::public.content_status
  AND q.stem_md IS DISTINCT FROM e.new_stem;

UPDATE public.question_bank_revisions r
SET evidence=jsonb_set(r.evidence,'{proposed_stem}',to_jsonb(e.new_stem),true)
FROM clarity_reword e WHERE r.source_question_id=e.question_id
  AND r.revision_kind='order_match_instruction_clarity';

DO $postflight$ BEGIN
 IF (SELECT count(*) FROM clarity_reword e
 JOIN public.question_bank_revisions r ON r.source_question_id=e.question_id
 JOIN public.questions q ON q.id=r.revision_question_id
 WHERE q.stem_md=e.new_stem AND r.evidence->>'proposed_stem'=e.new_stem)<>12
 THEN RAISE EXCEPTION 'CLARITY_REVIEW_REWORD_POSTCHECK_FAILED'; END IF;
END $postflight$;
COMMIT;