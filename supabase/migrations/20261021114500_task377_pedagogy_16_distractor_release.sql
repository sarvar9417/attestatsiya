-- TASK-377 — owner-authorized production release of 16 TASK-376 Y1 pedagogical distractor revisions.
-- 2026-10-21: owner explicitly requested deployment. Earlier owner waived a separate external expert
-- on 2026-10-18; this release is AI-assisted and is NOT represented as independent expert review.
-- Immutable source versions, answer-key option identity and historic exam attempts are preserved.
-- Executed as one migration transaction; refuse missing/drifted items, and do not re-run.
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='45s';
CREATE TEMP TABLE task376_changes (
 source_id uuid NOT NULL, revision_id uuid NOT NULL, order_idx integer NOT NULL,
 expected_old text NOT NULL, replacement text NOT NULL,
 PRIMARY KEY(revision_id,order_idx)
) ON COMMIT DROP;
INSERT INTO task376_changes VALUES
('43e1f43b-4803-4942-aca9-ab688677882c'::uuid,'55303f3f-9613-440d-8cb5-18a50420e1f2'::uuid,3,'Faqat o‘quvchilar fikrini yig‘ib, xatolarning turini tekshirmasdan yangi reja tuzadi','O‘quvchilarning usulga munosabatini so‘rab, keyingi dars vaqt taqsimotini shu fikrlarga ko‘ra belgilaydi'),
('5380c9ea-7a58-42f7-8a7a-e3336728d1ce'::uuid,'8eb3a4cf-b56d-4bb0-9ed5-100f15fe9578'::uuid,1,'Holat onlayn bo‘lgani uchun undan faqat platforma ma’muriyatiga shikoyat qilishni so‘rash','Onlayn yozishmalarni saqlab, dastlab platforma shikoyat xizmatining javobini kutishni tavsiya etish'),
('582095f3-108a-4f05-ab8d-bb34cc367cd7'::uuid,'9b196638-767a-433a-91a3-46e284806085'::uuid,1,'Barcha o‘quvchilar uchun dars jadvali va sinf resurslarini moslashtirish','Dars bosqichlarini sinfning umumiy tayyorgarlik ko‘rsatkichiga mos rejalashtirish'),
('5fd42bac-7cf1-42a3-8ab3-8d2fbd3dbbf2'::uuid,'b834e177-4715-4cc6-93ef-5ae78f095c2c'::uuid,3,'O‘quvchilarni faqat bir xil standart topshiriq orqali qayta sinash','Bir turdagi qayta sinov orqali bilim o‘sishini solishtirib, umumiy natija chiqarish'),
('a98931de-823a-26ef-4bf8-ac0e189c0a83'::uuid,'d087d22d-0f7f-46bc-94dc-64432809f5f1'::uuid,2,'Barcha o‘quvchiga tayyorgarligidan qat’i nazar bir xil topshiriqni','O‘xshash intizomiy holatlarda vaziyat farqini ko‘rmasdan bir xil chora qo‘llashni'),
('bc9805e4-e040-48db-b5aa-418b92caf012'::uuid,'69ba5608-cc8f-46ed-aade-ac0f8efd5527'::uuid,2,'Barcha savollarni keyinga qoldirib, nazariy qismni tezroq tugatish','Darsning kirish savollarini qisqartirib, nazariy bayonga ko‘proq vaqt ajratish'),
('dcea39e2-7411-4a32-a006-9294982a75fd'::uuid,'1df33bb1-9aea-4681-9d29-eec9b1775159'::uuid,1,'Vazifani osonlashtirib, barcha o‘quvchilarga umumiy bir natija qo‘yish','Guruh ishini kichik vazifalarga bo‘lib, yakuniy mahsulotni guruh sifatida baholash'),
('dee795c9-5f95-4b95-ab84-c9c83a015897'::uuid,'05570766-2c40-4aab-969d-a3082a583830'::uuid,0,'Barcha o‘quvchilarning ijodiy ishlarini bir xil standartga keltirishga','Tadbirning tashkiliy vazifalarini o‘quvchilar qiziqishiga ko‘ra tez taqsimlashga'),
('ebd692bd-54e6-42cc-bf5f-b5f3588160dc'::uuid,'cff45c4a-9dcb-4ce5-98a3-58bd6854bee3'::uuid,3,'Vaziyatni barcha sinfdoshlardan ochiq so‘rab, asosiy darsni davom ettirish','Vaziyat guvohlarining izohlarini yig‘ib, keyingi suhbat uchun dalillarni tartiblash'),
('feaa8589-04d3-4bf7-887e-e91e93baaea3'::uuid,'41516ef9-0765-4834-81c7-9bbe78384c98'::uuid,1,'Darsdagi faoliyatlar uchun ajratilgan vaqt har doim bir xil emas','Dars bosqichlariga ajratilgan vaqt o‘quvchilar tayyorgarligiga mos kelmagan'),
('2bb676f1-35ed-474c-84b7-654aa61257bb'::uuid,'49566031-4219-431a-936d-fc2fadab67bb'::uuid,2,'Barcha rejalangan mashqlarni qisqartirmay, o‘quvchilardan ish tezligini oshirishni so‘rash','Rejadagi mashqlar ketma-ketligini saqlab, keyingi bosqichlar sur’atini tezlashtirish'),
('79250000-0000-4000-8000-000000000210'::uuid,'d6a09759-2b05-4bb6-9fb6-1b4236f5f184'::uuid,4,'Mavzu bo‘limlaridagi barcha ta’riflarni bir xil tartibda takrorlash','Tekshiruv savollaridan joriy reyting uchun qo‘shimcha baholar yig‘ib borish'),
('9e966370-b00d-4b26-bc6a-a625c841da2e'::uuid,'d20e6d1a-2972-472a-ab97-3a8cb78b14ef'::uuid,2,'Qoidalarga rioya etishni tashqi nazoratsiz doimiy kafolatlaydi','O‘quvchining intizomga rioya qilishini keyingi darslarda qayd etishni yengillashtiradi'),
('bd97d8aa-f414-417e-a14a-8e42145d46b8'::uuid,'81c3a73f-58e5-4e35-8565-b88b0b0cee15'::uuid,0,'Faol o‘quvchiga savollarga umuman javob bermaslikni tavsiya qilish','Faol o‘quvchidan javoblarni umumlashtirishni so‘rab, muhokamani qolganlarga taklif etish'),
('eee6049c-e88e-42eb-a5ac-b83728e67499'::uuid,'6eaa20d1-f322-46c0-bb2d-06ad6c39fe42'::uuid,3,'Barcha fan bo‘yicha qo‘shimcha topshiriq berib, ish sur’atini kuzatish','Oldingi chorak baholarini fanlar kesimida solishtirib, akademik o‘zgarishni aniqlash'),
('e9edcf11-897b-4ac4-8d67-449e9b5230e8'::uuid,'f4331143-c4d6-4d1f-a470-82c2b0d832d1'::uuid,1,'Ko‘rsatmada dasturning barcha menyulari ketma-ket yoritilmaganidan','Namoyishda bajarilgan amallar yozma ko‘rsatma bilan yetarli mustahkamlanmaganidan');
DO $qa$
DECLARE matches integer;
BEGIN
 SELECT count(*) INTO matches FROM task376_changes e
 JOIN public.pedagogy_revision_queue queue ON queue.source_question_id=e.source_id
   AND queue.revision_question_id=e.revision_id
 JOIN public.questions source ON source.id=e.source_id
   AND source.status='published' AND source.group_code IN ('KS','PM.GEN','PM.MET')
 JOIN public.questions revision ON revision.id=e.revision_id
   AND revision.status='review' AND revision.format='Y1'
   AND revision.group_code=source.group_code
 JOIN public.question_options o ON o.question_id=e.revision_id
   AND o.order_idx=e.order_idx AND trim(o.side)='a'
   AND o.content_md=e.expected_old
 JOIN public.question_keys k ON k.question_id=e.revision_id
 WHERE o.id::text<>k.payload->>'correct_option_id'
   AND e.expected_old IS DISTINCT FROM e.replacement AND length(trim(e.replacement))>=25;
 IF matches<>16 THEN RAISE EXCEPTION 'TASK376_PRECHECK: % of 16',matches; END IF;
END $qa$;
UPDATE public.question_options o SET content_md=e.replacement
FROM task376_changes e JOIN public.questions r ON r.id=e.revision_id AND r.status='review'
JOIN public.question_keys k ON k.question_id=r.id
WHERE o.question_id=e.revision_id AND o.order_idx=e.order_idx
  AND o.content_md=e.expected_old AND o.id::text<>k.payload->>'correct_option_id';
WITH wrong AS (
 SELECT queue.source_question_id,array_agg(o.content_md ORDER BY o.order_idx,o.id) variants
 FROM public.pedagogy_revision_queue queue
 JOIN public.question_options o ON o.question_id=queue.revision_question_id
 JOIN public.question_keys k ON k.question_id=queue.revision_question_id
 WHERE queue.source_question_id IN (SELECT source_id FROM task376_changes)
  AND o.id::text<>k.payload->>'correct_option_id'
 GROUP BY queue.source_question_id
)
UPDATE public.pedagogy_rewrite_proposals proposals
SET proposed_distractors=wrong.variants,provenance='TASK-376 semantic AI review draft; unapproved'
FROM wrong WHERE proposals.source_question_id=wrong.source_question_id
  AND proposals.proposal_status='draft';
DO $post$
DECLARE bad integer;
BEGIN
 WITH integrity AS (
   SELECT q.id,count(o.id) opts,count(distinct lower(trim(o.content_md))) unique_opts,
     count(o.id) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correct_opts
   FROM public.questions q JOIN public.question_options o ON o.question_id=q.id
   JOIN public.question_keys k ON k.question_id=q.id
   WHERE q.id IN (SELECT revision_id FROM task376_changes)
   GROUP BY q.id
 ) SELECT count(*) INTO bad FROM integrity
 WHERE opts<>4 OR unique_opts<>4 OR correct_opts<>1;
 IF bad<>0 THEN RAISE EXCEPTION 'TASK376_Y1_INTEGRITY_FAILURE_%',bad; END IF;
END $post$;

CREATE TEMP TABLE task377_source_fingerprints ON COMMIT DROP AS
SELECT DISTINCT e.source_id, public.professional_question_fingerprint(e.source_id) fp
FROM task376_changes e;

DO $release$
DECLARE
 v_actor uuid;
 v_n int;
 v_bad int;
 item record;
BEGIN
 IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1 THEN
   RAISE EXCEPTION 'TASK377_OWNER_NOT_UNIQUE';
 END IF;
 SELECT id INTO STRICT v_actor FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);
 IF (SELECT count(DISTINCT e.source_id) FROM task376_changes e)<>16
    OR (SELECT count(DISTINCT e.revision_id) FROM task376_changes e)<>16 THEN
    RAISE EXCEPTION 'TASK377_EXACT_PAIR_SCOPE_FAIL';
 END IF;
 -- Never release a candidate that has already been published, already waived,
 -- changed after our QA snapshot, or belongs to another release.
 SELECT count(*) INTO v_bad
 FROM (SELECT DISTINCT source_id,revision_id FROM task376_changes) x
 JOIN public.questions s ON s.id=x.source_id
 JOIN public.questions r ON r.id=x.revision_id
 JOIN public.pedagogy_revision_queue pq ON pq.source_question_id=s.id AND pq.revision_question_id=r.id
 JOIN public.question_keys oldkey ON oldkey.question_id=s.id
 JOIN public.question_keys newkey ON newkey.question_id=r.id
 WHERE s.status='published' AND r.status='review'
   AND s.format='Y1' AND r.format='Y1'
   AND s.group_code=r.group_code AND s.group_code IN ('KS','PM.GEN','PM.MET')
   AND s.source_lesson_id=r.source_lesson_id
   AND s.construct_id=r.construct_id
   AND s.subject_id=r.subject_id
   AND s.assets=r.assets
   AND oldkey.payload->>'correct_option_id' IS NOT NULL
   AND newkey.payload->>'correct_option_id' IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM public.question_bank_revisions br WHERE br.source_question_id=s.id OR br.revision_question_id=r.id)
   AND NOT EXISTS (SELECT 1 FROM public.pedagogy_owner_release_waivers w WHERE w.question_id=r.id);
 IF v_bad<>16 THEN RAISE EXCEPTION 'TASK377_SOURCE_REVISION_PRECHECK_%_OF_16',v_bad; END IF;

 -- Prove exactly 16 replacements were applied to review-only WRONG options.
 SELECT count(*) INTO v_n FROM task376_changes e
 JOIN public.question_options o ON o.question_id=e.revision_id
  AND o.order_idx=e.order_idx AND o.content_md=e.replacement AND trim(o.side)='a';
 IF v_n<>16 THEN RAISE EXCEPTION 'TASK377_REPLACEMENTS_APPLIED_%_OF_16',v_n; END IF;

 WITH checks AS (
   SELECT r.id, count(o.id) n, count(distinct lower(trim(o.content_md))) nd,
     count(*) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') n_correct,
     min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) minw,
     max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) maxw,
     max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correctw,
     max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') maxwrong
   FROM public.questions r
   JOIN public.question_options o ON o.question_id=r.id AND trim(o.side)='a'
   JOIN public.question_keys k ON k.question_id=r.id
   WHERE r.id IN (SELECT revision_id FROM task376_changes)
   GROUP BY r.id
 )
 SELECT count(*) INTO v_bad FROM checks WHERE n<>4 OR nd<>4 OR n_correct<>1
   OR minw<1 OR maxw>minw*1.8 OR correctw>maxwrong*1.25;
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK377_PUBLISH_BALANCE_CHECK_%',v_bad; END IF;

 -- Owner waiver uses the pre-existing, explicitly owner-approved protocol.
 -- Do NOT misrepresent as signed independent expert editorial checks.
 INSERT INTO public.pedagogy_owner_release_waivers
   (question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id)
 SELECT e.revision_id,v_actor,public.professional_question_fingerprint(e.revision_id),
   'owner_explicit_no_external_expert_20261018',
   'TASK-377; 2026-10-21 owner explicitly instructed production release; prior 2026-10-18 no-external-expert waiver; AI-assisted distractor rewrites; independent expert signoff NOT claimed',
   e.source_id
 FROM task376_changes e;
 GET DIAGNOSTICS v_n=ROW_COUNT;
 IF v_n<>16 THEN RAISE EXCEPTION 'TASK377_WAIVER_INSERTED_%',v_n; END IF;

 -- Atomic release: existing controlled procedure does new published + old archived.
 FOR item IN SELECT source_id,revision_id FROM task376_changes ORDER BY source_id
 LOOP
   PERFORM public.publish_pedagogy_revision(item.revision_id,v_actor);
 END LOOP;

 SELECT count(*) INTO v_n FROM task376_changes e
 JOIN public.questions s ON s.id=e.source_id AND s.status='archived'
 JOIN public.questions r ON r.id=e.revision_id AND r.status='published'
 JOIN public.pedagogy_published_revisions published ON published.question_id=r.id
 JOIN public.pedagogy_owner_release_waivers w ON w.question_id=r.id
 WHERE w.source_question_id=s.id AND w.authorized_by=v_actor
   AND w.content_fingerprint=public.professional_question_fingerprint(r.id);
 IF v_n<>16 THEN RAISE EXCEPTION 'TASK377_POSTFLIGHT_PUBLISHED_%',v_n; END IF;

 -- The prior source was archived, but its immutable stem/options/key are untouched.
 SELECT count(*) INTO v_n FROM task377_source_fingerprints fp
 WHERE public.professional_question_fingerprint(fp.source_id)=fp.fp;
 IF v_n<>16 THEN RAISE EXCEPTION 'TASK377_SOURCE_FINGERPRINT_DRIFT_%',v_n; END IF;

 INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
 SELECT source_id,revision_id,'TASK-377-owner-authorized-pedagogy-distractor',
   jsonb_build_object('date','2026-10-21','owner_authorized',true,'external_expert_claim',false,
                     'scope','TASK-376 16 wrong-option semantic rewrites',
                     'correct_option_key_uuid_unchanged_in_revision',true,
                     'published_immutable_version',true)
 FROM task376_changes;
 GET DIAGNOSTICS v_n=ROW_COUNT;
 IF v_n<>16 THEN RAISE EXCEPTION 'TASK377_RELEASE_LEDGER_COUNT_%',v_n; END IF;
END $release$;
-- Commit is owned by Supabase migration runner, not this file.
