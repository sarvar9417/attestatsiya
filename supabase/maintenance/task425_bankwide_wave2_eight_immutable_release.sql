-- TASK-425: exact 8 owner-authorized substantive answer-distractor revisions from TASK-424.
-- 2026-10-21 user requested entire question bank be quality-audited, improved, and
-- verified changes released in batches. This release is AI-assisted and owner-delegated,
-- NOT an independent human expert signoff. It never edits historical option/key/stem text.
-- Apply via the Supabase controlled migration runner only, not in clean-schema CI fixtures.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='90s';

CREATE TEMP TABLE task425_manifest(
 source_id uuid PRIMARY KEY, review_id uuid NOT NULL UNIQUE,
 source_fp text NOT NULL, review_fp text NOT NULL,
 group_code text NOT NULL, correct_text text NOT NULL
) ON COMMIT DROP;
INSERT INTO task425_manifest VALUES
  ('3a2ebffc-55df-5bee-8847-fc78c6c319a8'::uuid, 'e1134e44-c226-4b8e-8175-bb3c3751e374'::uuid, '9529c37a11e976737404faef25f170e0', '01d9724e404dfdb6e8a81dc80014c78b', 'S1.INFO', 'Rang tusini, to‘yinganlikni va yorug‘likni intuitiv boshqarish'),
  ('651a433e-3f2b-5432-a4a5-fd6e76b7536d'::uuid, '5b079077-9859-4e81-9fab-90667aa65f51'::uuid, 'dd3f696571c1aa085dfb3bbdfefa2ec1', '931214f14a2a4390a05f5727918240ca', 'S1.INFO', 'Teng ehtimolli N ta holatdan birini tanlash axborotini topishda'),
  ('6c8224c8-deb3-5aaf-9152-05b105967235'::uuid, '05916aa2-c1fb-4182-a542-abffbc21fe6f'::uuid, '98284829fdaeebcb45a4749650ab1e27', '5aa66acbf18906dd0fb6858c61387fbf', 'S1.INFO', 'Protsessor bir amal bilan qayta ishlaydigan bitlar soniga'),
  ('85c85aa0-e86c-50e4-8fb5-43a156a70694'::uuid, '54e1f273-f9d2-4169-be49-26b5c2060a24'::uuid, '90adc9347ba5c6ca208bd25896c5bc85', 'ba296322fadace42ad3e31ed30bf4d73', 'S1.INFO', 'Axborotni qoidaga ko‘ra boshqa ko‘rinishga o‘tkazish'),
  ('9766b2d1-260c-5265-89cf-9230d20775d9'::uuid, '636f31fa-807e-4f5a-86b1-1aeae9bcaf7e'::uuid, '8e7043b8af094149c57721de7b9e184d', '54917fe937fb4dda38ba4bd91fd62d70', 'S4.BLOCK', 'Kvadratning birinchi tomoni yana chiziladi; yangi alohida chiziq paydo bo‘lmaydi'),
  ('a0bdd6d1-2ad7-54ac-a4e1-c83faefde4c9'::uuid, '3bf240cd-140f-4572-93a0-a61924ba7f9b'::uuid, 'f97002f56a9f48ec593062daa2facd4c', 'd250892eb3e983dfdc554ff88ea9267d', 'S1.INFO', 'Belgilar va ularga mos kodlar ro‘yxati'),
  ('ce096d06-2532-503a-b6bb-38258514f5ea'::uuid, '6e455b6c-8143-4de4-a50d-db7e0d2e2fe6'::uuid, 'e0c603d1e9f823eab4cd0aaf83e6c285', '9b06bf1ec2c4156d435b3cc4e6f74956', 'S1.INFO', 'Ma’lumot → axborot → bilim zanjiri'),
  ('dcc19fdb-0b46-5562-a9c1-4b1b7c521538'::uuid, '0ec942c7-da7d-4889-835b-218575103c80'::uuid, '4083c98d426d25a1d2ce72d530a33b4e', 'df82f831785b6b5b80a85265988a679a', 'S1.INFO', 'Ma’lumotning faylda qanday tuzilishi va talqin qilinishini belgilovchi standart');

DO $task425$
DECLARE
 n integer; x record; v_min integer;v_max integer;v_good integer;v_wrong integer;
 v_opts integer;v_distinct integer;v_key integer;v_invalid integer;v_actor uuid;
BEGIN
 IF (SELECT count(*) FROM task425_manifest)<>8 OR
    (SELECT count(DISTINCT review_id) FROM task425_manifest)<>8 THEN
   RAISE EXCEPTION 'TASK425_SCOPE_NOT_EIGHT'; END IF;
 SELECT id INTO v_actor FROM public.profiles
   WHERE role='admin' AND NOT coalesce(is_blocked,false) ORDER BY id LIMIT 1;
 IF v_actor IS NULL OR (SELECT count(*) FROM public.profiles
   WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1
 THEN RAISE EXCEPTION 'TASK425_OWNER_NOT_UNIQUE'; END IF;

 -- This is not an editorial service that can sign off as a human reviewer.
 -- The exact source/review text, keys, fingerprints, provenance and active
 -- lesson/construct match are checked before any durable status change.
 SELECT count(*) INTO n FROM task425_manifest m
 JOIN public.questions s ON s.id=m.source_id
 JOIN public.questions r ON r.id=m.review_id
 WHERE s.status='published'::public.content_status
  AND r.status='review'::public.content_status
  AND s.format='Y1'::public.question_format
  AND r.format=s.format
  AND s.group_code=r.group_code AND s.group_code=m.group_code
  AND s.group_code IN ('S1.INFO','S4.BLOCK')
  AND s.subject_id=r.subject_id
  AND s.construct_id=r.construct_id
  AND s.source_lesson_id=r.source_lesson_id
  AND s.assets=r.assets
  AND r.source_reference='revision:TASK-424:semantic-distractors:'||s.id::text
  AND public.professional_question_fingerprint(s.id)=m.source_fp
  AND public.professional_question_fingerprint(r.id)=m.review_fp
  AND (SELECT count(*) FROM public.question_bank_revisions br
      WHERE br.source_question_id=s.id AND br.revision_question_id=r.id
      AND br.revision_kind='task424_semantic_distractor_review')=1
  AND (SELECT count(*) FROM public.question_bank_revisions br
      WHERE br.source_question_id=s.id)=1
  AND NOT EXISTS (
      SELECT 1 FROM public.question_editorial_checks ec
      WHERE ec.question_id=r.id AND ec.answer_verified
  )
  AND public.is_question_official_mock_eligible(r.id);
 IF n<>8 THEN RAISE EXCEPTION 'TASK425_SOURCE_REVIEW_DRIFT_%_OF_8',n; END IF;

 FOR x IN SELECT * FROM task425_manifest ORDER BY source_id LOOP
   IF (SELECT count(*) FROM public.question_options o
       JOIN public.question_keys k ON k.question_id=o.question_id
       WHERE o.question_id=x.source_id AND o.id::text=k.payload->>'correct_option_id'
       AND o.content_md=x.correct_text)<>1
      OR (SELECT count(*) FROM public.question_options o
       JOIN public.question_keys k ON k.question_id=o.question_id
       WHERE o.question_id=x.review_id AND o.id::text=k.payload->>'correct_option_id'
       AND o.content_md=x.correct_text)<>1
   THEN RAISE EXCEPTION 'TASK425_CORRECT_TEXT_CHANGED_%',x.source_id; END IF;

   SELECT count(*),count(distinct btrim(o.content_md)),
     min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)),
     max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)),
     max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FILTER (WHERE o.id::text=k.payload->>'correct_option_id'),
     max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FILTER (WHERE o.id::text<>k.payload->>'correct_option_id')
   INTO v_opts,v_distinct,v_min,v_max,v_good,v_wrong
   FROM public.question_options o JOIN public.question_keys k ON k.question_id=o.question_id
   WHERE o.question_id=x.review_id AND o.side='a';
   IF v_opts<>4 OR v_distinct<>4 OR v_min=0 OR
       v_max>v_min*1.8 OR v_good>v_wrong*1.25 THEN
      RAISE EXCEPTION 'TASK425_DISTRACTOR_LENGTH_OR_DUPLICATE_%',x.review_id; END IF;
 END LOOP;

 -- Revision was AI-assisted; normalize its provenance before first publication.
 UPDATE public.questions r SET is_generated=true,updated_at=now()
 FROM task425_manifest m WHERE r.id=m.review_id AND r.status='review';

 UPDATE public.question_bank_revisions br
 SET evidence=br.evidence||jsonb_build_object(
    'task_release','TASK-425','release_authorized_by_user_on','2026-10-21',
    'review_method','AI_assisted_subject_matter_check_and_source_comparison',
    'independent_human_editorial_signature',false,
    'old_attempts_mutated',false,'original_correct_answer_preserved',true,
    'ai_generated_flag_on_successor',true)
 FROM task425_manifest m
 WHERE br.source_question_id=m.source_id AND br.revision_question_id=m.review_id
  AND br.revision_kind='task424_semantic_distractor_review';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>8 THEN RAISE EXCEPTION 'TASK425_PROVENANCE_UPDATES_%',n; END IF;

 UPDATE public.questions r SET status='published'::public.content_status,updated_at=now()
 FROM task425_manifest m WHERE r.id=m.review_id AND r.status='review';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>8 THEN RAISE EXCEPTION 'TASK425_REVISIONS_PUBLISHED_%',n; END IF;

 UPDATE public.questions s SET status='archived'::public.content_status,updated_at=now()
 FROM task425_manifest m WHERE s.id=m.source_id AND s.status='published';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>8 THEN RAISE EXCEPTION 'TASK425_SOURCES_ARCHIVED_%',n; END IF;

 UPDATE public.question_quality_published_revisions snap
 SET release_scope='TASK-425 user-delegated 2026-10-21 AI-assisted semantic distractor improvement, not an independent human expert certification'
 FROM task425_manifest m WHERE snap.question_id=m.review_id;

 UPDATE public.question_quality_findings f
 SET resolved_at=now(),details=f.details||jsonb_build_object(
  'resolved_by_task','TASK-425','successor_published',true,
  'release_review_method','owner_delegated_AI_not_independent_human')
 FROM task425_manifest m
 WHERE f.question_id=m.source_id AND f.finding_code='task424_semantic_distractor_review_pending'
   AND f.resolved_at IS NULL;
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>8 THEN RAISE EXCEPTION 'TASK425_OPEN_FINDINGS_COUNT_%',n; END IF;

 SELECT count(*) INTO n FROM task425_manifest m
 JOIN public.questions s ON s.id=m.source_id AND s.status='archived'
 JOIN public.questions r ON r.id=m.review_id AND r.status='published'
 JOIN public.question_quality_published_revisions snap
     ON snap.question_id=r.id
 WHERE r.is_generated
  AND public.professional_question_fingerprint(s.id)=m.source_fp
  AND public.professional_question_fingerprint(r.id)=m.review_fp
  AND snap.content_fingerprint=public.professional_question_fingerprint(r.id)
  AND snap.release_scope LIKE 'TASK-425 user-delegated%'
  AND public.group_mock_eligible(r.id)
  AND NOT EXISTS(
     SELECT 1 FROM public.question_quality_findings f
     WHERE f.question_id=r.id AND f.resolved_at IS NULL AND f.severity IN ('critical','high')
  );
 IF n<>8 THEN RAISE EXCEPTION 'TASK425_POSTFLIGHT_NOT_EIGHT_%',n; END IF;
END $task425$;
SELECT count(*) AS batch_count,
       (SELECT count(*) FROM public.questions q JOIN task425_manifest m ON m.review_id=q.id
        WHERE q.status='published') published_new,
       (SELECT count(*) FROM public.questions q JOIN task425_manifest m ON m.source_id=q.id
        WHERE q.status='archived') archived_previous
FROM task425_manifest;
COMMIT;
