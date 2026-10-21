-- TASK-393: eight strictly prechecked KS Y1 distractor improvements.
-- User delegated AI audit on 2026-10-21. External human expertise NOT claimed.
-- Two concurrently superseded source questions intentionally excluded.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='90s';
CREATE TEMP TABLE task393_evidence(ref text PRIMARY KEY, correct_text text NOT NULL) ON COMMIT DROP;
INSERT INTO task393_evidence VALUES
('authored:ai-assisted:m14-closed-20261018:kasb-standarti:page-13:topic-7:question-1','Ota-onalarni loyiha maqsadi, qarorlari va mas’uliyatini birgalikda belgilashga jalb qilish'),
('authored:pedagogy-examstyle:20261020-wave2:KS.04:Y1:01','Mas’uliyat, kelishuv va jamoaviy qaror ko‘nikmasini rivojlantirish'),
('authored:pedagogy-pdf-corpus:2025-kuzgi3-n50','Boshlang‘ich diagnostikaga tayangan rejalash'),
('authored:pedagogy-pdf-corpus:2025-pedmahorat-n106','Dars maqsadiga mos, erishiladigan o‘quv vazifalarini rejalash'),
('authored:pedagogy-pdf-corpus:2025-pedmahorat-n117','O‘z faoliyatini baholab, kasbiy rivojlanish ehtiyojini aniqlash'),
('authored:pedagogy-pdf-corpus:2025-pedmahorat-n191','Tarbiyaviy faoliyatni tashkil etib, mas’uliyatli xulq me’yorlarini shakllantirishga'),
('authored:pedagogy-pdf-corpus:2025-spring6-n93','Kuchli jihatni dalil bilan ko‘rsatib, yaxshilash uchun aniq tavsiya berishga'),
('authored:pedagogy-pdf-corpus:2026-ext6-printed-q82','Ota-onalarni ta’lim jarayoniga faol jalb etib, birgalikda yordam berish');

DO $task393$
DECLARE e record; src public.questions%rowtype; rev public.questions%rowtype;
 admin_id uuid; passed int:=0; amount int; lowest int; highest int;
 correct_wc int; wrong_wc int; actual_correct text; outcome jsonb;
BEGIN
 IF (SELECT count(*) FROM task393_evidence)<>8 THEN RAISE EXCEPTION 'TASK-393 selection mismatch'; END IF;
 SELECT id INTO admin_id FROM public.profiles WHERE role='admin' AND coalesce(is_blocked,false)=false;
 IF admin_id IS NULL OR (SELECT count(*) FROM public.profiles WHERE role='admin' AND coalesce(is_blocked,false)=false)<>1
 THEN RAISE EXCEPTION 'TASK-393 owner context missing'; END IF;
 FOR e IN SELECT * FROM task393_evidence ORDER BY ref LOOP
  SELECT * INTO src FROM public.questions WHERE source_reference=e.ref FOR UPDATE;
  IF NOT FOUND OR src.status<>'published'::public.content_status
    OR src.format<>'Y1'::public.question_format OR src.group_code<>'KS'
  THEN RAISE EXCEPTION 'TASK-393 original unavailable %',e.ref; END IF;
  SELECT q.* INTO rev FROM public.question_quality_findings f
    JOIN public.questions q ON q.id::text=f.details->>'replacement'
  WHERE f.question_id=src.id AND f.finding_code='implausible_distractors'
    AND f.resolved_at IS NULL FOR UPDATE OF q;
  IF NOT FOUND OR rev.status<>'review'::public.content_status
    OR rev.source_reference IS DISTINCT FROM 'revision:pedagogy:'||src.id::text
    OR rev.format<>src.format OR rev.group_code<>src.group_code
    OR rev.construct_id IS DISTINCT FROM src.construct_id
    OR rev.subject_id IS DISTINCT FROM src.subject_id
    OR rev.source_lesson_id IS DISTINCT FROM src.source_lesson_id
    OR EXISTS(SELECT 1 FROM question_bank_revisions x WHERE x.source_question_id=src.id)
    OR EXISTS(SELECT 1 FROM pedagogy_owner_release_waivers x WHERE x.question_id=rev.id)
    OR (SELECT count(*) FROM pedagogy_revision_queue x
        WHERE x.source_question_id=src.id AND x.revision_question_id=rev.id)<>1
  THEN RAISE EXCEPTION 'TASK-393 linked revision unavailable %',e.ref; END IF;

  SELECT count(*),min(w),max(w),max(w) FILTER(WHERE is_correct),
    max(w) FILTER(WHERE NOT is_correct)
  INTO amount,lowest,highest,correct_wc,wrong_wc
  FROM (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) w,
    o.id::text=k.payload->>'correct_option_id' is_correct
    FROM question_options o JOIN question_keys k ON k.question_id=o.question_id
    WHERE o.question_id=rev.id AND o.side='a') a;
  SELECT o.content_md INTO actual_correct
  FROM question_options o JOIN question_keys k ON k.question_id=o.question_id
  WHERE o.question_id=rev.id AND o.id::text=k.payload->>'correct_option_id';

  IF amount<>4 OR lowest<1 OR highest>1.8*lowest
    OR correct_wc>1.25*wrong_wc OR actual_correct IS DISTINCT FROM e.correct_text
    OR (SELECT count(distinct btrim(content_md)) FROM question_options WHERE question_id=rev.id)<>4
    OR (SELECT count(*) FROM question_options WHERE question_id=src.id)<>4
    OR NOT EXISTS(SELECT 1 FROM question_quality_findings f WHERE f.question_id=rev.id
                  AND f.finding_code='independent_editorial_review_required'
                  AND f.resolved_at IS NULL)
    OR NOT EXISTS(SELECT 1 FROM question_keys k WHERE k.question_id=rev.id
                  AND length(btrim(explanation_md))>10)
  THEN RAISE EXCEPTION 'TASK-393 answer/option review invalid %',e.ref; END IF;
  INSERT INTO public.question_bank_revisions(
     source_question_id,revision_question_id,revision_kind,evidence
  ) VALUES(src.id,rev.id,'owner_ai_distractor_balance',
    jsonb_build_object('task','TASK-393','AI_review',true,'owner_delegated_20261021',true,
      'source_answer_meaning_preserved',true,'unique_plausible_options',4,
      'human_expert_signature',false,'historical_results_changed',false));
  INSERT INTO public.pedagogy_owner_release_waivers(
    question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id
  ) VALUES (
    rev.id,admin_id,public.professional_question_fingerprint(rev.id),
    'owner_explicit_no_external_expert_20261018',
    'TASK-393: owner delegated AI editorial review on 2026-10-21. Legacy authority value retained for atomic publication compatibility. Balanced semantic distractors checked; no external human reviewer.',
    src.id);
  SELECT public.publish_pedagogy_revision(rev.id,admin_id) INTO outcome;
  IF outcome->>'status'<>'published' OR
      (outcome->>'archived_source_question_id')::uuid IS DISTINCT FROM src.id
  THEN RAISE EXCEPTION 'TASK-393 atomic release failed %',e.ref; END IF;
  UPDATE public.question_quality_published_revisions SET release_scope=
     'TASK-393 owner-delegated AI distractor review, eight verified KS Y1 items; not human-certified'
  WHERE question_id=rev.id;
  UPDATE public.question_quality_findings SET resolved_at=now(),
    details=details||jsonb_build_object('task','TASK-393',
       'published_replacement',rev.id,'AI_editorial_verified',true,
       'independent_human_review',false)
  WHERE question_id=src.id AND finding_code='implausible_distractors';
  UPDATE public.question_quality_findings SET resolved_at=now(),
    details=details||jsonb_build_object('task','TASK-393',
       'human_review_requirement_waived_by_owner',true,
       'human_review_performed',false)
  WHERE question_id=rev.id AND finding_code='independent_editorial_review_required';
  IF NOT public.is_question_official_mock_eligible(rev.id)
     OR NOT public.group_mock_eligible(rev.id)
     OR (SELECT status FROM public.questions WHERE id=src.id)<>'archived'::public.content_status
     OR NOT EXISTS(SELECT 1 FROM question_quality_published_revisions snap
       WHERE snap.question_id=rev.id
         AND snap.content_fingerprint=public.professional_question_fingerprint(rev.id))
  THEN RAISE EXCEPTION 'TASK-393 final QA failed %',e.ref; END IF;
  passed:=passed+1;
 END LOOP;
 IF passed<>8 THEN RAISE EXCEPTION 'TASK-393 count mismatch: %',passed; END IF;
END
$task393$;
COMMIT;