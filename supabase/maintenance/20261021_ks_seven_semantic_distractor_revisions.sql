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
  v_actor uuid;
  v_rec record;
  v_review uuid;
  v_count int :=0;
BEGIN
 IF (SELECT count(*) FROM public.profiles
     WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1 THEN
   RAISE EXCEPTION 'KS_CLARITY_ADMIN_STATE_CHANGED';
 END IF;
 SELECT id INTO STRICT v_actor FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);
 IF (SELECT count(*) FROM task_clarity_semantic)<>7 OR
    (SELECT count(*) FROM task_clarity_semantic m
       JOIN public.questions q ON q.id=m.source_question_id
       JOIN public.pedagogy_revision_queue pq ON pq.source_question_id=q.id
       JOIN public.pedagogy_rewrite_proposals p ON p.source_question_id=q.id
       WHERE q.status='published' AND q.format='Y1' AND q.group_code='KS'
         AND pq.revision_question_id IS NULL AND p.proposal_status='draft'
         AND cardinality(m.wrong_texts)=3
         AND NOT EXISTS(select 1 from public.question_bank_revisions r
                        where r.source_question_id=q.id))<>7 THEN
    RAISE EXCEPTION 'KS_CLARITY_SOURCE_CHANGED';
 END IF;
 -- Replace prior assistant drafts only; do not modify any published option/key.
 UPDATE public.pedagogy_rewrite_proposals p
 SET proposed_distractors=m.wrong_texts,
     provenance='AI semantic QA 2026-10-21 owner instruction; context-relevant competing professional competencies; draft awaiting independent editorial sign-off'
 FROM task_clarity_semantic m
 WHERE p.source_question_id=m.source_question_id AND p.proposal_status='draft';

 FOR v_rec IN SELECT * FROM task_clarity_semantic ORDER BY source_question_id LOOP
   v_review:=public.stage_pedagogy_revision(v_rec.source_question_id,v_actor);
   IF NOT EXISTS(
     SELECT 1 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
     WHERE q.id=v_review AND q.status='review' AND q.format='Y1'
       AND EXISTS(SELECT 1 FROM public.question_options o
        WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')
   ) OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=v_review)<>4 THEN
    RAISE EXCEPTION 'KS_CLARITY_REVIEW_INVALID: %',v_rec.source_question_id;
   END IF;
   INSERT INTO public.question_bank_revisions(
     source_question_id,revision_question_id,revision_kind,evidence)
   VALUES (v_rec.source_question_id,v_review,'pedagogy_distractor_semantic_review_20261021',
      jsonb_build_object('editorial_status','AI_draft_unapproved',
      'correct_key_unchanged',true,'reason','implausible distractors expose answer',
      'owner_request','2026-10-21'));
   INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
   VALUES(v_rec.source_question_id,'semantic_options_review_20261021','high',
     jsonb_build_object('replacement_question_id',v_review,
      'status','review_pending_independent_signoff',
      'discovery','independent semantic comparison of stem, correct key, and competing distractors'))
   ON CONFLICT (question_id,finding_code) DO UPDATE
    SET details=excluded.details,resolved_at=null;
   v_count:=v_count+1;
 END LOOP;
 IF v_count<>7 THEN RAISE EXCEPTION 'KS_CLARITY_COUNT_%',v_count; END IF;
END $release$;
SELECT count(*) AS staged_review_count FROM public.question_bank_revisions
WHERE revision_kind='pedagogy_distractor_semantic_review_20261021';
COMMIT;