-- M05 only: improve 12 terse but correct Y1 worked explanations.
-- Based on independent checks against ICT 7-sinf and 2025/2026 attestation samples.
-- No question text, answer keys, scoring, option IDs, or exam history changes.
BEGIN;
CREATE TEMP TABLE pg_temp.m05_explanation_updates (source_reference text PRIMARY KEY, explanation_md text NOT NULL) ON COMMIT DROP;
INSERT INTO pg_temp.m05_explanation_updates VALUES
  ('drive:1qKfAUygul-qdf8yXxA9bPy62YU0xjAfs:p01:q02','Jami 11111₂ = 31 kishi, buning ichida o‘qituvchi ham bor. O‘quvchilar 31−1=30 nafar. Qizlar 10011₂=19 nafar. O‘g‘il bolalar: 30−19=11₁₀=1011₂. Manba: 2026-yil demo, PDF 1-sahifa, 2-savol.'),
  ('m01-professional-bank:AXB-06-021','101101₂=1·2⁵+0·2⁴+1·2³+1·2²+0·2¹+1·2⁰=32+8+4+1=45₁₀. Har bir raqam o‘z razryadining 2 darajasiga ko‘paytiriladi. Manba: 7-sinf informatika, sanoq sistemalari.'),
  ('sanoq-2026:SS-A-004:paper-Y1','O‘n oltilik sanoq sistemasining alifbosi 0–9 va A–F belgilaridan iborat: A=10, B=11, C=12, D=13, E=14, F=15. Shuning uchun F belgisi 15₁₀ qiymatga ega.'),
  ('sanoq-2026:SS-A-008:paper-Y1','p asosli sanoq sistemasida barcha raqamlar 0≤aᵢ<p shartini qanoatlantiradi. Noma’lum asosni topgach, p butun son ekanini va yozuvdagi eng katta raqamdan qat’iy katta ekanini tekshiring.'),
  ('sanoq-2026:SS-A-015:paper-Y1','Pozitsiyali yoyiq yozuvda son raqamlari o‘z asosining razryadga mos darajalari bilan ko‘paytiriladi va yig‘iladi: aₙpⁿ+…+a₁p+a₀. Masalan, 21₅=2·5¹+1·5⁰=11₁₀.'),
  ('sanoq-2026:SS-A-027:paper-Y1','Ikkilik tizimning har bir biti 0 yoki 1 bo‘lishi mumkin. Uchta mustaqil bit uchun kombinatsiyalar soni 2·2·2=2³=8: 000 dan 111 gacha.'),
  ('sanoq-2026:SS-A-031:paper-Y1','8 bitli ishorasiz yozuvda 2⁸=256 ta holat mavjud: eng kichigi 0, eng kattasi 2⁸−1=255. Bu sonlar diapazoni 0…255 ga teng.'),
  ('sanoq-2026:SS-A-034:paper-Y1','p asosli pozitsiyali butun son yozuvida o‘ngdan boshlab razryad vaznlari p⁰, p¹, p², … bo‘ladi. Eng o‘ng — birliklar razryadining vazni p⁰=1.'),
  ('sanoq-2026:SS-A-035:paper-Y1','4=2² bo‘lgani uchun har bir 4-lik raqam ikkilikda ikkita bit bilan ifodalanadi. Shu sabab to‘rtlik ↔ ikkilik o‘tkazishida diada, ya’ni 2 bitli guruhdan foydalaniladi.'),
  ('sanoq-2026:SS-B-007:paper-Y1','1010₂=1·2³+0·2²+1·2¹+0·2⁰=8+2=10₁₀. Shuning uchun 1010₂ va 10₁₀ yozuvlari bir xil miqdorni bildiradi.'),
  ('sanoq-2026:SS-B-015:paper-Y1','17₈=1·8+7=15₁₀. O‘n oltilik sanoq sistemasida F=15₁₀. Demak, 17₈ va F₁₆ bir xil qiymatga ega, boshqa juftliklar mos emas.'),
  ('sanoq-2026:SS-B-019:paper-Y1','21₅ sonining yoyiq yozuvi 2·5¹+1·5⁰. Hisoblash: 2·5+1=11₁₀. Asos darajasi o‘ngdagi birliklar raqami uchun 0, keyingi xona uchun 1 bo‘ladi.');
DO $m05$ DECLARE n int; BEGIN
 SELECT COUNT(*) INTO n FROM public.questions q
 JOIN public.lessons l ON l.id=q.source_lesson_id
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN pg_temp.m05_explanation_updates upd ON upd.source_reference=q.source_reference
 WHERE l.module_id='00000000-0000-0000-0000-000000001005'
 AND q.status='published'
 AND length(trim(k.explanation_md))<25;
 IF n<>12 THEN RAISE EXCEPTION 'Expected 12 short M05 explanations; saw %',n; END IF;
 UPDATE public.question_keys k SET explanation_md=upd.explanation_md
 FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
 JOIN pg_temp.m05_explanation_updates upd ON upd.source_reference=q.source_reference
 WHERE k.question_id=q.id
 AND l.module_id='00000000-0000-0000-0000-000000001005'
 AND q.status='published'
 AND length(trim(k.explanation_md))<25;
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>12 THEN RAISE EXCEPTION 'M05 expected to improve exactly 12 explanations; changed %',n; END IF;
END $m05$;
COMMIT;
SELECT COUNT(*) remaining_short_explanations
FROM public.question_keys k JOIN public.questions q ON q.id=k.question_id
JOIN public.lessons l ON l.id=q.source_lesson_id
WHERE l.module_id='00000000-0000-0000-0000-000000001005'
AND q.status='published' AND (k.explanation_md IS NULL OR length(trim(k.explanation_md))<25);