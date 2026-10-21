-- Owner-requested independent semantic review of seven KS questions
-- with plainly implausible distractors; draft only, no human sign-off claimed.
BEGIN;
SET LOCAL lock_timeout='15s';
SET LOCAL statement_timeout='90s';
CREATE TEMP TABLE task_clarity_semantic(source_question_id uuid primary key, wrong_texts text[] not null) ON COMMIT DROP;
INSERT INTO task_clarity_semantic VALUES
('00667b8d-2250-4bb0-90e8-42eb2a0968df'::uuid, ARRAY['Dars mazmunini raqamli vositaga mos rejalashtirish','O‘quvchilarning raqamli resurslar bilan ishlashini baholash','Sinfda hamkorlikdagi o‘quv faoliyatini tashkil qilish']::text[]),
('00ebd044-128d-44a7-95bd-10a17aeeea54'::uuid, ARRAY['O‘quv natijalarini mezon asosida tahlil qilish va baholash','O‘quv materiallarini didaktik jihatdan rejalashtirish','Hamkasblar bilan metodik faoliyatni rivojlantirish']::text[]),
('03804c6d-47c4-4587-8176-afa8a0ae2518'::uuid, ARRAY['Baholash dalillarini oldindan tanlashdan','Mashqlar ketma-ketligini avval rejalashdan','Ko‘rgazmali vositalarni dastlab belgilashdan']::text[]),
('0840199b-3fd8-4de4-a90d-f7d8a57d91b1'::uuid, ARRAY['O‘quv natijalarini monitoring qilish va baholash','Dars faoliyatini rejalashtirish va loyihalash','Hamkasblar bilan fan metodikasini muvofiqlashtirish']::text[]),
('0df54c53-82a9-4efb-9a6f-79e01fbedfd9'::uuid, ARRAY['O‘quvchining o‘zlashtirishini mezon asosida baholash','Dars mazmunini o‘quvchilarning ehtiyojiga moslash','Ota-onalar bilan tarbiyaviy hamkorlikni tashkil etish']::text[]),
('137858f7-6fae-491b-a8c3-086613ab7ee1'::uuid, ARRAY['O‘quv natijalarini dars maqsadlari bilan solishtirish','O‘quv faoliyatlarini yosh xususiyatiga mos rejalashtirish','Dars uchun ko‘rgazmali vositalarni ishlab chiqish']::text[]),
('15c2ef53-0bb2-4683-a9ae-0fca2469cb70'::uuid, ARRAY['Mavzu qiyinligini o‘quvchining tayyorgarligiga moslash','O‘quvchining mavzuga oid tayanch bilimini tekshirish','Mavzu bo‘yicha guruhli mashqlar turini almashtirish']::text[]);

DO $release$
DECLARE
  v_count integer;
BEGIN
 IF (SELECT count(*) FROM task_clarity_semantic)<>7 THEN
   RAISE EXCEPTION 'KS_CLARITY_MAPPING_COUNT';
 END IF;
 SELECT count(*) INTO v_count
 FROM task_clarity_semantic m
 JOIN public.questions q ON q.id=m.source_question_id
 JOIN public.pedagogy_revision_queue pq ON pq.source_question_id=q.id
 JOIN public.questions revision ON revision.id=pq.revision_question_id
 JOIN public.pedagogy_rewrite_proposals p ON p.source_question_id=q.id
 JOIN public.question_keys oldkey ON oldkey.question_id=q.id
 JOIN public.question_keys newkey ON newkey.question_id=revision.id
 JOIN public.question_options correct_old ON correct_old.id::text=oldkey.payload->>'correct_option_id'
 JOIN public.question_options correct_new ON correct_new.id::text=newkey.payload->>'correct_option_id'
 WHERE q.status='published' AND q.format='Y1' AND q.group_code='KS'
   AND revision.status='review' AND revision.format='Y1'
   AND p.proposal_status='draft' AND cardinality(m.wrong_texts)=3
   AND correct_old.content_md=correct_new.content_md
   AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=revision.id)=4
   AND NOT EXISTS (SELECT 1 FROM public.question_bank_revisions r WHERE r.source_question_id=q.id);
 IF v_count<>7 THEN RAISE EXCEPTION 'KS_CLARITY_REVIEW_PRECHECK_FAILED_%',v_count; END IF;

 UPDATE public.pedagogy_rewrite_proposals p
    SET proposed_distractors=m.wrong_texts,
        provenance='AI semantic QA 2026-10-21 owner instruction: pedagogically plausible distractors; not independently approved'
 FROM task_clarity_semantic m
 WHERE p.source_question_id=m.source_question_id AND p.proposal_status='draft';

 WITH incorrect AS (
   SELECT o.id, m.wrong_texts[
     row_number() over(partition by m.source_question_id order by o.order_idx,o.id)::integer
   ] as new_text
   FROM task_clarity_semantic m
   JOIN public.pedagogy_revision_queue pq ON pq.source_question_id=m.source_question_id
   JOIN public.question_keys k ON k.question_id=pq.revision_question_id
   JOIN public.question_options o ON o.question_id=pq.revision_question_id
      AND o.id::text<>k.payload->>'correct_option_id'
 )
 UPDATE public.question_options o SET content_md=i.new_text
 FROM incorrect i WHERE o.id=i.id AND o.content_md IS DISTINCT FROM i.new_text;

 IF (SELECT count(*) FROM public.pedagogy_revision_queue pq
     JOIN task_clarity_semantic m ON m.source_question_id=pq.source_question_id
     JOIN public.question_options o ON o.question_id=pq.revision_question_id
     JOIN public.question_keys k ON k.question_id=o.question_id
     WHERE o.id::text<>k.payload->>'correct_option_id')<>21 THEN
   RAISE EXCEPTION 'KS_CLARITY_WRONG_OPTION_COUNT_FAILED';
 END IF;

 INSERT INTO public.question_bank_revisions(
   source_question_id,revision_question_id,revision_kind,evidence)
 SELECT m.source_question_id,pq.revision_question_id,
   'pedagogy_distractor_semantic_review_20261021',
   jsonb_build_object('editorial_status','AI_draft_unapproved',
     'correct_key_unchanged',true,'reason','implausible alternatives expose the answer',
     'owner_request','2026-10-21')
 FROM task_clarity_semantic m
 JOIN public.pedagogy_revision_queue pq ON pq.source_question_id=m.source_question_id;

 INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
 SELECT m.source_question_id,'semantic_options_review_20261021','high',
   jsonb_build_object('replacement_question_id',pq.revision_question_id,
     'status','review_pending_independent_signoff',
     'discovery','stem, source key, and all four distractors assessed semantically')
 FROM task_clarity_semantic m
 JOIN public.pedagogy_revision_queue pq ON pq.source_question_id=m.source_question_id
 ON CONFLICT(question_id,finding_code) DO UPDATE
   SET details=excluded.details,resolved_at=null;
END $release$;
SELECT count(*) AS staged_review_count FROM public.question_bank_revisions
WHERE revision_kind='pedagogy_distractor_semantic_review_20261021';
COMMIT;