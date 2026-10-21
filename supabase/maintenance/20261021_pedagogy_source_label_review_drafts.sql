-- REVIEW-ONLY editorial drafts; DO NOT run via automatic migration/deployment.
-- Idempotent: skip a source if an editorial revision already exists.
-- Original published rows/attempts/keys are never overwritten.
BEGIN;
DO $task$
DECLARE
 r record;
 v_source public.questions%rowtype;
 v_new uuid;
 v_correct uuid;
 v_option uuid;
 v_idx integer;
BEGIN
 FOR r IN SELECT * FROM (VALUES
('1a8b48ea-7a89-4c32-a45a-5c10ea3b4968'::uuid,'Nizolarning davomiyligi bilan ularning kuchi yoki rivojlanish jadalligini farqlaganda, aynan davomiylikni bildiradigan juftlikni tanlang.','["Tez yakunlanadigan va uzoq davom etadigan nizolar","Kuchsiz kechadigan va kuchli kechadigan nizolar","Sekin rivojlanadigan va tez avj oladigan nizolar","Keskin boshlanadigan va sust rivojlanadigan nizolar"]'::jsonb,0,'Davomiylik nizoning qancha vaqt davom etishini bildiradi: u tez yakunlanishi yoki uzoq davom etishi mumkin. Qolgan juftliklar nizoning kuchi va rivojlanish jadalligini tavsiflaydi. Asl PDFdagi 5-band noto‘liq import qilingan va yangi savol davomiylikni alohida tekshiradi.'),
('3b6f46d8-5566-4682-a248-040a6b02035d'::uuid,'O‘quvchilar nazariy ma’lumotlarni mustahkamlagach, maxsus asbob-uskunalarda tajriba o‘tkazib, natijalarni qayd etadilar. Darsning yetakchi turi qaysi?','["Amaliy mashg‘ulot darsi","Laboratoriya mashg‘uloti darsi","Bilimlarni takrorlash darsi","Yangi bilimlarni bayon qilish darsi"]'::jsonb,1,'Maxsus jihozlar yordamida tajriba o‘tkazish va olingan natijani kuzatib qayd etish laboratoriya mashg‘ulotining yetakchi belgisidir.'),
('7d078c43-f6bf-45b3-b705-6cbfc2753f88'::uuid,'Pedagogning ijtimoiy talablar, huquqiy me’yorlar va ta’lim standartlariga muvofiq kasbiy faoliyat yurita olishini tavsiflaydigan sifat qaysi?','["Pedagogik texnika","Pedagogik bilimdonlik","Kommunikativ qobiliyat","Metodik ijodkorlik"]'::jsonb,1,'Pedagogik bilimdonlik kasbiy bilim va tegishli me’yorlarni anglab, ularga muvofiq faoliyat yurita olish bilan bog‘liq. Atama va tasnifni dastlabki PDFning bosma 75-savoli hamda mustaqil manba bilan yana tekshirish kerak.'),
('aac83647-a7d4-4946-831a-b4900268a20f'::uuid,'Ikki o‘quvchi nizolashdi. Pedagog dalillar va mantiqiy tushuntirishlar orqali ularning fikrini qayta ko‘rib chiqishga undadi. Qaysi pedagogik ta’sir usuli qo‘llandi?','["Rag‘batlantirish usuli","Mashq qildirish usuli","Talab qo‘yish usuli","Ishontirish usuli"]'::jsonb,3,'Ishontirishda pedagog dalil, asoslangan fikr va mantiqiy tushuntirish orqali shaxsning qarashi hamda munosabatiga ta’sir ko‘rsatadi.'),
('d3105252-4dec-4a50-8227-d58a7a0e6b6c'::uuid,'Pedagogik nazokatning kasbiy tajriba bilan bog‘liq jihatini qaysi fikr eng aniq ifodalaydi?','["Nazokat faqat tabiiy xushmuomalalik va shaxsiy odobga bog‘liq","Nazokat tajriba, refleksiya va vaziyatni hisobga olish bilan rivojlanadi","Nazokat asosan pedagog nutqining tashqi ifodasi bilan belgilanadi","Nazokat faqat rasmiy tartib-qoidalarga qat’iy rioya etishdir"]'::jsonb,1,'Pedagogik nazokat tug‘ma va o‘zgarmas holat emas; kasbiy tajriba, refleksiya va vaziyatga mos muomala orqali takomillashadi.'),
('dfe4b623-562d-4457-a304-737ec6161982'::uuid,'Maktabga norozi holda kelgan ota-onani direktor o‘rinbosari diqqat bilan tingladi va muloyim suhbat orqali kelishmovchilikni yumshatdi. Bu vaziyatda qaysi pedagogik qobiliyat ustuvor?','["Prognostik qobiliyat","Didaktik qobiliyat","Kommunikativ qobiliyat","Tashkilotchilik qobiliyati"]'::jsonb,2,'Kommunikativ qobiliyat o‘quvchilar, ota-onalar va hamkasblar bilan hurmatli va samarali muloqot o‘rnatishda namoyon bo‘ladi.')
 ) AS x(source_id, revised_stem, choices, correct_idx, explanation)
 LOOP
   SELECT * INTO v_source FROM public.questions
     WHERE id=r.source_id AND status='published'::public.content_status FOR UPDATE;
   IF NOT FOUND THEN RAISE EXCEPTION 'missing/prematurely archived source: %',r.source_id; END IF;
   IF EXISTS(SELECT 1 FROM public.pedagogy_revision_queue WHERE source_question_id=r.source_id AND revision_question_id IS NOT NULL)
      OR EXISTS(SELECT 1 FROM public.question_bank_revisions WHERE source_question_id=r.source_id)
   THEN CONTINUE; END IF;
   IF v_source.format <> 'Y1'::public.question_format OR jsonb_array_length(r.choices)<>4 THEN
     RAISE EXCEPTION 'format/options invalid for %',r.source_id;
   END IF;
   v_new:=gen_random_uuid();
   INSERT INTO public.questions
    (id,subject_id,construct_id,group_code,format,cognitive,difficulty,
     stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
   VALUES
    (v_new,v_source.subject_id,v_source.construct_id,v_source.group_code,
     v_source.format,v_source.cognitive,v_source.difficulty,r.revised_stem,
     v_source.assets,false,'review'::public.content_status,NULL,
     'revision:pedagogy:'||r.source_id::text,v_source.source_lesson_id);
   FOR v_idx IN 0..3 LOOP
      v_option:=gen_random_uuid();
      INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
        VALUES(v_option,v_new,'a',v_idx,r.choices->>v_idx);
      IF v_idx=r.correct_idx THEN v_correct:=v_option; END IF;
   END LOOP;
   INSERT INTO public.question_keys(question_id,payload,explanation_md)
       VALUES(v_new,jsonb_build_object('correct_option_id',v_correct),r.explanation);
   INSERT INTO public.question_bank_revisions
      (source_question_id,revision_question_id,revision_kind,evidence)
       VALUES(r.source_id,v_new,'source_reference_in_stem_editorial_draft',
        jsonb_build_object('editorial_state','AI draft; independent verification pending',
         'original_source_reference',v_source.source_reference,
         'historical_source_preserved',true,'source_date','2026-10-21'));
   INSERT INTO public.pedagogy_revision_queue(source_question_id,revision_question_id,reason)
       VALUES(r.source_id,v_new,'Source-dependent wording and distractor review: AI draft, not approved')
       ON CONFLICT (source_question_id)
       DO UPDATE SET revision_question_id=excluded.revision_question_id,
                     reason=excluded.reason
       WHERE public.pedagogy_revision_queue.revision_question_id IS NULL;
   INSERT INTO public.question_quality_findings
       (question_id,finding_code,severity,details)
       VALUES(r.source_id,'source_dependent_stem_review_required','high',
         jsonb_build_object('draft_revision_id',v_new,
          'reason','External source title/reference is necessary to interpret displayed stem',
          'remediation','Independent editorial verification then atomic revision publication'))
       ON CONFLICT (question_id,finding_code) DO NOTHING;
 END LOOP;
END
$task$;
-- Existing second question has a prior review draft. Track its lineage without replacing it.
INSERT INTO public.question_bank_revisions
   (source_question_id,revision_question_id,revision_kind,evidence)
SELECT q.source_question_id,q.revision_question_id,'source_reference_in_stem_existing_draft',
 jsonb_build_object('editorial_state','Existing review; independent verification pending',
  'historical_source_preserved',true)
FROM public.pedagogy_revision_queue q
WHERE q.source_question_id='cca58439-2ff7-449f-adf4-8787ed079b3e'::uuid
 AND q.revision_question_id IS NOT NULL
ON CONFLICT (source_question_id) DO NOTHING;
INSERT INTO public.question_quality_findings (question_id,finding_code,severity,details)
VALUES('cca58439-2ff7-449f-adf4-8787ed079b3e'::uuid,
       'source_dependent_stem_review_required','high',
       '{"reason":"External Pedmahorat|Guli reference in displayed stem","remediation":"Existing independent editorial draft requires signed review before atomic publication"}'::jsonb)
ON CONFLICT (question_id,finding_code) DO NOTHING;
COMMIT;
