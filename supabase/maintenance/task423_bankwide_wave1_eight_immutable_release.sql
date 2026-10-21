-- TASK-423: exact 8 owner-authorized substantive answer-distractor revisions from TASK-379.
-- 2026-10-21 user requested entire question bank be quality-audited, improved, and
-- verified changes released in batches. This release is AI-assisted and owner-delegated,
-- NOT an independent human expert signoff. It never edits historical option/key/stem text.
-- Apply via the Supabase controlled migration runner only, not in clean-schema CI fixtures.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='90s';

CREATE TEMP TABLE task423_manifest(
 source_id uuid PRIMARY KEY, review_id uuid NOT NULL UNIQUE,
 source_fp text NOT NULL, review_fp text NOT NULL,
 group_code text NOT NULL, correct_text text NOT NULL
) ON COMMIT DROP;
INSERT INTO task423_manifest VALUES
  ('0eaad8e9-b4a7-5c5d-a6d9-77e7f0aa87d6'::uuid, '3d5ab807-a44f-4df5-9501-b55c6af55ac9'::uuid, '4c538ad4af71a82ccb9081740b48c355', '7b61288f24e407ed41192d9e0c2972a6', 'S1.INFO', 'Bir nechta media turining yagona mahsulotda uyg‘unlashuvi'),
  ('253ad9c7-c687-5304-87b9-35459839911b'::uuid, 'eeb23af2-0d0d-4b46-aaf8-cb450f88c53a'::uuid, '9c249f1012f0a579b266fff40de8cb09', 'dd60794f957ab93a5acfcb076132c158', 'S1.INFO', 'Rastr tasvirning eng kichik rangli elementi'),
  ('2562fd1d-5205-519c-aac2-63822efa85d4'::uuid, '5e4b7073-9edc-44e1-9716-2cd627023106'::uuid, '896d735873b0c3065268cb5b284083ea', 'd50a7d3d1460dd8eceee6be1249216af', 'S1.INFO', 'Video, audio, subtitr va metama’lumot oqimlarini bitta faylda birlashtiruvchi tuzilma'),
  ('315a3f23-8889-588c-9c4a-bd858a808faa'::uuid, '7f6d8ba5-a4b9-4fc9-a8b5-6054f8dced33'::uuid, '5d4289f634a21b342864f86e39f65430', 'fb341de6fbe9ae45edae8f4fb6fc47c4', 'S1.INFO', 'Bitta piksel rangini kodlash uchun ajratilgan bitlar soni'),
  ('6799c556-8dec-13b1-62b2-491868eed33a'::uuid, '33c7eb81-42fd-4f68-a1ce-6a2a61d60391'::uuid, '136b70b448836e14b969bee7c6a74ca8', 'b51b1f615f3119371eeb4d3a29be2b2a', 'S6.NET', 'Har ikki qurilmaning default gateway va marshrutlarini'),
  ('739023a8-d9c3-5fcd-964a-f1398e773b10'::uuid, 'ddd0689b-28a0-4048-8f64-238ab383ed9f'::uuid, 'ac6267b402bf4282404f36cae78dfe1e', 'bca6cae8269dad4a76e8032b8e710c79', 'S1.INFO', 'Turli yozuv tizimlari belgilariga yagona kod nuqtalari ajratadigan standart'),
  ('ba1a0cf6-1b94-08a3-0b60-09c224fd4840'::uuid, 'eddb337b-0211-48cd-af75-e5566fa341d3'::uuid, 'd600c924c71d3d610c76ac5a5e8f29dc', '6546fe3198ef1dc7c40b0d2ab41e5a89', 'S2.OFFICE', 'Bir yoki bir necha ish varag‘idan iborat ish kitobi'),
  ('d6ff215f-f268-5717-a5f0-b03536a809d3'::uuid, 'f8241875-305b-48bb-a14e-1b35e2137117'::uuid, 'fd5830cfd618c27b918bf238ed7fd40f', '7c9321d309028ebeea97d0c8ea3f39dd', 'S1.INFO', '0 yoki 1 qiymatini oladigan eng kichik axborot birligi');

DO $task423$
DECLARE
 n integer; x record; v_min integer;v_max integer;v_good integer;v_wrong integer;
 v_opts integer;v_distinct integer;v_key integer;v_invalid integer;v_actor uuid;
BEGIN
 IF (SELECT count(*) FROM task423_manifest)<>8 OR
    (SELECT count(DISTINCT review_id) FROM task423_manifest)<>8 THEN
   RAISE EXCEPTION 'TASK423_SCOPE_NOT_EIGHT'; END IF;
 SELECT id INTO v_actor FROM public.profiles
   WHERE role='admin' AND NOT coalesce(is_blocked,false) ORDER BY id LIMIT 1;
 IF v_actor IS NULL OR (SELECT count(*) FROM public.profiles
   WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1
 THEN RAISE EXCEPTION 'TASK423_OWNER_NOT_UNIQUE'; END IF;

 -- This is not an editorial service that can sign off as a human reviewer.
 -- The exact source/review text, keys, fingerprints, provenance and active
 -- lesson/construct match are checked before any durable status change.
 SELECT count(*) INTO n FROM task423_manifest m
 JOIN public.questions s ON s.id=m.source_id
 JOIN public.questions r ON r.id=m.review_id
 WHERE s.status='published'::public.content_status
  AND r.status='review'::public.content_status
  AND s.format='Y1'::public.question_format
  AND r.format=s.format
  AND s.group_code=r.group_code AND s.group_code=m.group_code
  AND s.group_code IN ('S1.INFO','S2.OFFICE','S6.NET')
  AND s.subject_id=r.subject_id
  AND s.construct_id=r.construct_id
  AND s.source_lesson_id=r.source_lesson_id
  AND s.assets=r.assets
  AND r.source_reference='revision:TASK-379:semantic-distractors:'||s.id::text
  AND public.professional_question_fingerprint(s.id)=m.source_fp
  AND public.professional_question_fingerprint(r.id)=m.review_fp
  AND (SELECT count(*) FROM public.question_bank_revisions br
      WHERE br.source_question_id=s.id AND br.revision_question_id=r.id
      AND br.revision_kind='task379_semantic_distractor_review')=1
  AND (SELECT count(*) FROM public.question_bank_revisions br
      WHERE br.source_question_id=s.id)=1
  AND NOT EXISTS (
      SELECT 1 FROM public.question_editorial_checks ec
      WHERE ec.question_id=r.id AND ec.answer_verified
  )
  AND public.is_question_official_mock_eligible(r.id);
 IF n<>8 THEN RAISE EXCEPTION 'TASK423_SOURCE_REVIEW_DRIFT_%_OF_8',n; END IF;

 FOR x IN SELECT * FROM task423_manifest ORDER BY source_id LOOP
   IF (SELECT count(*) FROM public.question_options o
       JOIN public.question_keys k ON k.question_id=o.question_id
       WHERE o.question_id=x.source_id AND o.id::text=k.payload->>'correct_option_id'
       AND o.content_md=x.correct_text)<>1
      OR (SELECT count(*) FROM public.question_options o
       JOIN public.question_keys k ON k.question_id=o.question_id
       WHERE o.question_id=x.review_id AND o.id::text=k.payload->>'correct_option_id'
       AND o.content_md=x.correct_text)<>1
   THEN RAISE EXCEPTION 'TASK423_CORRECT_TEXT_CHANGED_%',x.source_id; END IF;

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
      RAISE EXCEPTION 'TASK423_DISTRACTOR_LENGTH_OR_DUPLICATE_%',x.review_id; END IF;
 END LOOP;

 -- Revision was AI-assisted; normalize its provenance before first publication.
 UPDATE public.questions r SET is_generated=true,updated_at=now()
 FROM task423_manifest m WHERE r.id=m.review_id AND r.status='review';

 UPDATE public.question_bank_revisions br
 SET evidence=br.evidence||jsonb_build_object(
    'task_release','TASK-423','release_authorized_by_user_on','2026-10-21',
    'review_method','AI_assisted_subject_matter_check_and_source_comparison',
    'independent_human_editorial_signature',false,
    'old_attempts_mutated',false,'original_correct_answer_preserved',true,
    'ai_generated_flag_on_successor',true)
 FROM task423_manifest m
 WHERE br.source_question_id=m.source_id AND br.revision_question_id=m.review_id
  AND br.revision_kind='task379_semantic_distractor_review';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>8 THEN RAISE EXCEPTION 'TASK423_PROVENANCE_UPDATES_%',n; END IF;

 UPDATE public.questions r SET status='published'::public.content_status,updated_at=now()
 FROM task423_manifest m WHERE r.id=m.review_id AND r.status='review';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>8 THEN RAISE EXCEPTION 'TASK423_REVISIONS_PUBLISHED_%',n; END IF;

 UPDATE public.questions s SET status='archived'::public.content_status,updated_at=now()
 FROM task423_manifest m WHERE s.id=m.source_id AND s.status='published';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>8 THEN RAISE EXCEPTION 'TASK423_SOURCES_ARCHIVED_%',n; END IF;

 UPDATE public.question_quality_published_revisions snap
 SET release_scope='TASK-423 user-delegated 2026-10-21 AI-assisted semantic distractor improvement, not an independent human expert certification'
 FROM task423_manifest m WHERE snap.question_id=m.review_id;

 UPDATE public.question_quality_findings f
 SET resolved_at=now(),details=f.details||jsonb_build_object(
  'resolved_by_task','TASK-423','successor_published',true,
  'release_review_method','owner_delegated_AI_not_independent_human')
 FROM task423_manifest m
 WHERE f.question_id=m.source_id AND f.finding_code='task379_semantic_distractor_review_pending'
   AND f.resolved_at IS NULL;
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>8 THEN RAISE EXCEPTION 'TASK423_OPEN_FINDINGS_COUNT_%',n; END IF;

 SELECT count(*) INTO n FROM task423_manifest m
 JOIN public.questions s ON s.id=m.source_id AND s.status='archived'
 JOIN public.questions r ON r.id=m.review_id AND r.status='published'
 JOIN public.question_quality_published_revisions snap
     ON snap.question_id=r.id
 WHERE r.is_generated
  AND public.professional_question_fingerprint(s.id)=m.source_fp
  AND public.professional_question_fingerprint(r.id)=m.review_fp
  AND snap.content_fingerprint=public.professional_question_fingerprint(r.id)
  AND snap.release_scope LIKE 'TASK-423 user-delegated%'
  AND public.group_mock_eligible(r.id)
  AND NOT EXISTS(
     SELECT 1 FROM public.question_quality_findings f
     WHERE f.question_id=r.id AND f.resolved_at IS NULL AND f.severity IN ('critical','high')
  );
 IF n<>8 THEN RAISE EXCEPTION 'TASK423_POSTFLIGHT_NOT_EIGHT_%',n; END IF;
END $task423$;
SELECT count(*) AS batch_count,
       (SELECT count(*) FROM public.questions q JOIN task423_manifest m ON m.review_id=q.id
        WHERE q.status='published') published_new,
       (SELECT count(*) FROM public.questions q JOIN task423_manifest m ON m.source_id=q.id
        WHERE q.status='archived') archived_previous
FROM task423_manifest;
COMMIT;
