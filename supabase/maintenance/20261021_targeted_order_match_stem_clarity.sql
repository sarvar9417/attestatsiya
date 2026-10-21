-- Twelve independently drafted wording revisions for ambiguous matching/order prompts.
-- Published source rows are IMMUTABLE. This script stages REVIEW successors and
-- private quality findings only; it does not claim human approval or publish.
-- Options and grading keys are cloned by UUID remapping without semantic changes.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='90s';

CREATE TEMP TABLE clarity_edits ON COMMIT DROP AS
with edits(question_id, old_stem, new_stem) as (
values
  ('03fe7137-524c-4936-b1c1-70633af8cfb9'::uuid, 'Uch xil siklni shartni tekshirish usuli bilan moslashtiring.', 'Chapdagi uch xil sikl turini o‘ngdagi bajarilish yoki shartni tekshirish xususiyati bilan moslashtiring. Har bir siklga unga xos bitta ta’rifni tanlang.'),
  ('e2910000-0000-4000-8000-000000000011'::uuid, 'Grafik muharrirdagi amallarni ularning oqibati bilan moslashtiring.', 'Chapdagi Zoom, Crop, Resize va Canvas size buyruqlarini o‘ngdagi tasvirga ta’siri bilan moslashtiring. Piksel soni, ishchi maydon va ekrandagi ko‘rinish o‘zgarishini farqlang.'),
  ('2082660e-a258-574d-91e7-8c30e358eed0'::uuid, 'Modellarni ifodalash shakli, 2-to‘plam: to‘rtta tasvirni ularning asosiy model turi bilan moslashtiring.', 'Modellarni ifodalash shakli, 2-to‘plam: chapdagi to‘rtta vaziyatni o‘ngdagi model turi (moddiy, matematik, verbal, grafik) bilan moslashtiring. Har bir vaziyat uchun qanday ifodalash usuli ishlatilganini aniqlang.'),
  ('72064360-3f8c-42d0-a93e-bbc0cb2a6265'::uuid, 'Baholash va qayta aloqa siklini tartiblang.', 'Baholash va qayta aloqa siklining amallarini vaqt bo‘yicha tartiblang: avval o‘quvchi faoliyatidan dalil yig‘ishdan boshlang, dalilni tahlil qiling, keyingi qadamga yo‘naltiruvchi fikr bildiring va so‘ng progressni kuzating.'),
  ('56a12955-c724-4a9a-accf-cc2461ec37b1'::uuid, 'Darsni metodik tahlil qilish jarayonini tartiblang.', 'Kuzatilgan darsni metodik tahlil qilish bosqichlarini ishning bajarilish ketma-ketligida joylashtiring: dalil yig‘ishdan boshlab maqsad bilan taqqoslash, muammoning sababini aniqlash va takomillashtirish tavsiyasigacha.'),
  ('a9057034-7beb-408a-94d4-310ba72a9fe0'::uuid, 'Fayl uzatish vaqtini hisoblash bosqichlarini to‘g‘ri tartiblang.', 'Faylni uzatish vaqtini t = I / v orqali hisoblashdagi amallarni bajarilish ketma-ketligida joylashtiring: avval hajm va tezlik birliklarini aniqlang, keyin birliklarni moslang, vaqtni hisoblang va natijani tekshiring.'),
  ('c46c5954-023f-42fe-a83c-ce711579da0a'::uuid, 'Taqdimotni tayyorlashning mantiqiy ketma-ketligini tartiblang.', 'Taqdimot yaratish jarayonidagi ishlarni boshlanishdan yakungacha tartiblang: maqsad va auditoriyani aniqlash, slayd mazmunini tuzish, vizual/animatsiya qo‘shish va namoyishni tekshirish tartibiga amal qiling.'),
  ('b01fd173-9b76-40c4-af34-78a066dd6b60'::uuid, 'Masaladan algoritm tuzish jarayonini tartiblang.', 'Masaladan ishlaydigan algoritm tuzish uchun bosqichlarni bajarilish tartibida joylashtiring: maqsad va kirish/chiqishdan boshlang, shart yoki formulani belgilang, algoritm amallarini yozing va sinov ma’lumoti bilan tekshiring.'),
  ('336b7ad1-314f-4b2b-98cc-bd1e721b4b64'::uuid, 'Qiymatlarni tekshirish bosqichlarini tartiblang.', 'Berilgan dastur uchun sinov qiymatlarini tekshirish bosqichlarini ish tartibida joylashtiring: avval chegaraviy kirishni tanlang, kutilgan natijani hisoblang, haqiqiy natijani oling va ikkisini taqqoslang.'),
  ('f371d698-c17e-48ab-b6df-31f1624dc300'::uuid, 'EKUB(28,12) ayirish jarayonini tartiblang.', 'EKUB(28,12) ni Evklidning ayirish usuli bilan topishda hosil bo‘ladigan (a,b) juftliklarni birinchi holatdan oxirgi holatgacha ketma-ket joylashtiring. Har safar katta sondan kichik son ayriladi; tenglashganda jarayon tugaydi.'),
  ('ed169926-b3e4-1b3a-14b4-98f67121e190'::uuid, 'Vebga kirish: berilgan bosqichlarni to‘g‘ri tartiblang.', 'Brauzerda URL kiritilgandan so‘ng veb-sahifadan HTTP javobi olinishi jarayonini vaqt bo‘yicha tartiblang. Kerak bo‘lsa domen nomini DNS orqali aniqlashni ham hisobga oling.'),
  ('fc3edbc6-11f2-0ea3-0e38-fe9a5f16a9e6'::uuid, 'CTR hisobini izohlash bosqichlarini tartiblang.', 'Reklamaning CTR (click-through rate) ko‘rsatkichini hisoblash va izohlashni amaliy tartibda joylashtiring: ko‘rsatishlar va bosishlarni aniqlash, (bosishlar / ko‘rsatishlar) × 100 foizni hisoblash va maqsad bilan solishtirish.')
)
SELECT question_id,old_stem,new_stem FROM edits;

DO $preflight$
BEGIN
 IF (SELECT count(*) FROM clarity_edits) <> 12
 OR (SELECT count(*) FROM clarity_edits e
     JOIN public.questions q ON q.id=e.question_id
     JOIN public.question_keys k ON k.question_id=q.id
     WHERE q.status='published'::public.content_status
       AND q.format IN ('Y2'::public.question_format,'Y3'::public.question_format)
       AND q.stem_md=e.old_stem
       AND ((q.format='Y2' AND jsonb_typeof(k.payload->'pairs')='object')
         OR (q.format='Y3' AND jsonb_typeof(k.payload->'order')='array'))) <> 12
 THEN RAISE EXCEPTION 'CLARITY_REVIEW_SOURCE_DRIFT_OR_KEY_MISSING'; END IF;
 IF EXISTS (SELECT 1 FROM clarity_edits e JOIN public.question_bank_revisions r
            ON r.source_question_id=e.question_id) THEN
  RAISE EXCEPTION 'CLARITY_REVIEW_ALREADY_REVISED'; END IF;
 IF EXISTS (SELECT 1 FROM public.questions q
            WHERE q.source_reference LIKE 'revision:clarity:20261021:%') THEN
  RAISE EXCEPTION 'CLARITY_REVIEW_ALREADY_STAGED'; END IF;
END $preflight$;

CREATE TEMP TABLE clarity_map ON COMMIT DROP AS
SELECT e.question_id source_question_id,gen_random_uuid() revision_question_id,
       e.old_stem,e.new_stem
FROM clarity_edits e;

INSERT INTO public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
 assets,is_generated,status,author_id,source_reference,source_lesson_id
)
SELECT m.revision_question_id,q.subject_id,q.construct_id,q.group_code,q.format,
 q.cognitive,q.difficulty,m.new_stem,q.assets,false,'review'::public.content_status,
 q.author_id,'revision:clarity:20261021:'||q.id::text,q.source_lesson_id
FROM clarity_map m JOIN public.questions q ON q.id=m.source_question_id;

CREATE TEMP TABLE clarity_option_map ON COMMIT DROP AS
SELECT o.id source_option_id,gen_random_uuid() revision_option_id,
       m.source_question_id,m.revision_question_id
FROM clarity_map m JOIN public.question_options o ON o.question_id=m.source_question_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT om.revision_option_id,om.revision_question_id,o.side,o.order_idx,o.content_md
FROM clarity_option_map om
JOIN public.question_options o ON o.id=om.source_option_id;

INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.revision_question_id,
 CASE WHEN q.format='Y2'::public.question_format THEN
   jsonb_build_object('pairs', (
     SELECT jsonb_object_agg(l.revision_option_id::text,r.revision_option_id::text)
     FROM jsonb_each_text(k.payload->'pairs') entry
     JOIN clarity_option_map l ON l.source_option_id=entry.key::uuid
     JOIN clarity_option_map r ON r.source_option_id=entry.value::uuid
   ))
 ELSE
   jsonb_build_object('order', (
     SELECT jsonb_agg(om.revision_option_id::text ORDER BY el.ordinality)
     FROM jsonb_array_elements_text(k.payload->'order') WITH ORDINALITY el(value,ordinality)
     JOIN clarity_option_map om ON om.source_option_id=el.value::uuid
   ))
 END,
 k.explanation_md
FROM clarity_map m JOIN public.questions q ON q.id=m.source_question_id
JOIN public.question_keys k ON k.question_id=m.source_question_id;

DO $postflight$
DECLARE v_bad int;
BEGIN
 SELECT count(*) INTO v_bad FROM clarity_map m
 JOIN public.question_keys source_key ON source_key.question_id=m.source_question_id
 JOIN public.question_keys revision_key ON revision_key.question_id=m.revision_question_id
 JOIN public.questions q ON q.id=m.revision_question_id
 WHERE q.status<>'review'::public.content_status
 OR ((SELECT count(*) FROM public.question_options o WHERE o.question_id=m.source_question_id)
     <> (SELECT count(*) FROM public.question_options o WHERE o.question_id=m.revision_question_id))
 OR (q.format='Y2'::public.question_format AND
     (SELECT count(*) FROM jsonb_each_text(source_key.payload->'pairs'))
     <> (SELECT count(*) FROM jsonb_each_text(revision_key.payload->'pairs')))
 OR (q.format='Y3'::public.question_format AND
     jsonb_array_length(source_key.payload->'order')
     <> jsonb_array_length(revision_key.payload->'order'));
 IF v_bad <> 0 OR (SELECT count(*) FROM clarity_map) <> 12
 OR (SELECT count(*) FROM public.question_keys k JOIN clarity_map m
     ON k.question_id=m.revision_question_id) <>12 THEN
  RAISE EXCEPTION 'CLARITY_REVIEW_CLONED_OPTIONS_KEYS_INVALID_%', v_bad;
 END IF;
END $postflight$;

INSERT INTO public.question_bank_revisions(
 source_question_id,revision_question_id,revision_kind,evidence)
SELECT m.source_question_id,m.revision_question_id,'order_match_instruction_clarity',
 jsonb_build_object('reason','learner_reported_ambiguous_instruction',
 'old_stem',m.old_stem,'proposed_stem',m.new_stem,
 'review_status','awaiting_independent_editorial_signoff',
 'source','owner_request_20261021')
FROM clarity_map m;

INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
SELECT m.source_question_id,'order_match_instruction_ambiguous','medium',
 jsonb_build_object('proposed_revision_id',m.revision_question_id,
 'issue','question stem does not fully specify matching relation or order criterion',
 'owner_request_date','2026-10-21',
 'current_status','review_pending_publication')
FROM clarity_map m
ON CONFLICT(question_id,finding_code)
DO UPDATE SET details=excluded.details,resolved_at=null;

SELECT count(*) staged_review_revisions FROM clarity_map;
COMMIT;