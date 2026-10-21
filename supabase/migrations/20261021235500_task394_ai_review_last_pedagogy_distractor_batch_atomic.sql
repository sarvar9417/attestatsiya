-- TASK-394: owner-delegated 2026-10-21 AI review of 10 remaining pedagogical
-- Y1 distractor candidates, preserving historical attempts and original keys.
-- Any concurrently superseded source is skipped; every processed case validates
-- exact original and revised correct text, option balance, and immutable provenance.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task394_proofs (original_ref text PRIMARY KEY,
 old_correct text NOT NULL,new_correct text NOT NULL) ON COMMIT DROP;
INSERT INTO task394_proofs VALUES
('authored:m15-topictest-20261018:6:10','Refleksiya asosida faoliyatni yaxshilash imkoniyati boy berildi','Refleksiya orqali pedagogik faoliyatni yaxshilash imkoniyati'),
('authored:pedguli-html-concepts:v3:KS.05:203','Masxarani to‘xtatib, xavfsiz muloqot va ishtirok qoidalarini tiklash','Masxarani to‘xtatib, xavfsiz va hurmatli muloqot qoidalarini tiklash'),
('authored:pedguli-topic-study:v2:PM.GEN.08:125','Tanlovni dalil bilan asoslash va ijodiy fikrlashni faollashtirish uchun','Muqobil yechimlarni cheklov va dalillar bilan asoslab tanlashini'),
('authored:professional-15:v1:KS.02:3','O‘quvchilar yechimni tushuntiradigan hamkorlikdagi vazifa','O‘quvchilar guruhda yechim topib, uni asoslaydi va fikrlarni muhokama qiladi'),
('revision:pedagogy:01d311a4-6cb4-421d-9168-9ff656bbe2f0','O''quvchilar bilan yakka tartibda suhbat o''tkazib, muammoni hal etishga urinish','O‘quvchi bilan xoli suhbatlashib, qiyinchilik sabablari va qo‘llab-quvvatlash ehtiyojini aniqlash'),
('revision:pedagogy:4b925a0f-da26-42f8-9ad0-f6a82770c9fc','Yo‘q, diagnostika xato sabablarini ajratib, individual keyingi qadam berishi kerak','Xato sabablarini alohida aniqlab, har biriga mos keyingi mashq va yordamni tavsiya qilish'),
('revision:pedagogy:70c6f5bc-3969-4a06-8469-e7c6279bb6a1','Tegishli fan o‘qituvchilari va mutaxassislar bilan kelishilgan yordamni muvofiqlashtirish','Fan o‘qituvchilari va mutaxassislar bilan muvofiqlashtirilgan yordam rejasini tuzish'),
('revision:pedagogy:79300000-0000-4000-8000-000000000315','Fayldagi belgilar buzilishining sababini kodlash turidan izlatish va tanlovni tekshirtirish','Buzilgan belgilarni kodlash tanloviga bog‘lab tekshirtirish va mos kodlashni sinashga yo‘naltirish'),
('revision:pedagogy:79300000-0000-4000-8000-000000000326','Aniq kuzatuv dalili, kuchli tomon va keyingi yordam rejasini hamkorlikda belgilash','Aniq kuzatuv dalili, kuchli tomon va keyingi yordam rejasini birgalikda belgilash'),
('revision:pedagogy:cb44a291-e32a-dbaf-b09e-2af74200c958','Qiziqishini bilib, xavfsiz va muvaffaqiyatli kichik rol berish','Qiziqish va ehtiyojini bilib, xavfsiz hamda muvaffaqiyatli kichik rol taklif qilish');

DO $task394$
DECLARE proof record; orig public.questions%rowtype; rev public.questions%rowtype;
  actor uuid; done_count int:=0; skip_count int:=0;
  n int; min_wc int;max_wc int;correct_wc int;max_wrong int;
  old_answer text;new_answer text;atomic_result jsonb;
BEGIN
 IF (SELECT count(*) FROM task394_proofs)<>10 THEN
   RAISE EXCEPTION 'TASK-394 changed editorial manifest'; END IF;
 SELECT id INTO actor FROM public.profiles WHERE role='admin' AND coalesce(is_blocked,false)=false;
 IF actor IS NULL OR (SELECT count(*) FROM public.profiles
   WHERE role='admin' AND coalesce(is_blocked,false)=false)<>1 THEN
   RAISE EXCEPTION 'TASK-394 owner is not unique'; END IF;

 FOR proof IN SELECT * FROM task394_proofs ORDER BY original_ref LOOP
  SELECT * INTO orig FROM public.questions WHERE source_reference=proof.original_ref FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'TASK-394 named source absent: %',proof.original_ref; END IF;
  IF orig.status<>'published'::public.content_status THEN
    skip_count:=skip_count+1;CONTINUE;
  END IF;
  SELECT q.* INTO rev FROM public.question_quality_findings f
   JOIN public.questions q ON q.id::text=f.details->>'replacement'
   WHERE f.question_id=orig.id AND f.finding_code='implausible_distractors'
      AND f.resolved_at IS NULL FOR UPDATE OF q;
  IF NOT FOUND THEN
   -- Concurrent editorial process already resolved this finding.
   skip_count:=skip_count+1;CONTINUE;
  END IF;
  IF rev.status<>'review'::public.content_status
    OR rev.source_reference IS DISTINCT FROM 'revision:pedagogy:'||orig.id::text
    OR orig.format<>'Y1'::public.question_format
    OR rev.format IS DISTINCT FROM orig.format
    OR rev.group_code IS DISTINCT FROM orig.group_code
    OR rev.group_code NOT IN ('KS','PM.GEN','PM.MET')
    OR rev.subject_id IS DISTINCT FROM orig.subject_id
    OR rev.construct_id IS DISTINCT FROM orig.construct_id
    OR rev.source_lesson_id IS DISTINCT FROM orig.source_lesson_id
    OR EXISTS(SELECT 1 FROM question_bank_revisions br WHERE br.source_question_id=orig.id)
    OR EXISTS(SELECT 1 FROM pedagogy_owner_release_waivers w WHERE w.question_id=rev.id)
    OR (SELECT count(*) FROM pedagogy_revision_queue pq
        WHERE pq.source_question_id=orig.id AND pq.revision_question_id=rev.id)<>1
   THEN RAISE EXCEPTION 'TASK-394 revision integrity mismatch: %',proof.original_ref; END IF;
  SELECT o.content_md INTO old_answer FROM public.question_options o
     JOIN public.question_keys k ON k.question_id=o.question_id
     WHERE o.question_id=orig.id AND o.id::text=k.payload->>'correct_option_id';
  SELECT o.content_md INTO new_answer FROM public.question_options o
     JOIN public.question_keys k ON k.question_id=o.question_id
     WHERE o.question_id=rev.id AND o.id::text=k.payload->>'correct_option_id';
  IF old_answer IS DISTINCT FROM proof.old_correct OR
     new_answer IS DISTINCT FROM proof.new_correct THEN
    RAISE EXCEPTION 'TASK-394 correct-answer semantics drift: %',proof.original_ref;
  END IF;
  SELECT count(*),min(wc),max(wc),max(wc) FILTER(WHERE correct),
       max(wc) FILTER(WHERE NOT correct)
   INTO n,min_wc,max_wc,correct_wc,max_wrong
   FROM(SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) wc,
         o.id::text=k.payload->>'correct_option_id' correct
    FROM public.question_options o JOIN public.question_keys k ON k.question_id=o.question_id
    WHERE o.question_id=rev.id AND o.side='a') words;
  IF n<>4 OR min_wc<1 OR max_wc>1.8*min_wc
     OR correct_wc>1.25*max_wrong
     OR (SELECT count(distinct btrim(o.content_md)) FROM public.question_options o
          WHERE o.question_id=rev.id)<>4
     OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=rev.id)<>4
     OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=orig.id)<>4
     OR NOT EXISTS(SELECT 1 FROM public.question_keys k WHERE k.question_id=rev.id
       AND length(btrim(k.explanation_md))>10)
     OR NOT EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE
       f.question_id=rev.id AND f.finding_code='independent_editorial_review_required'
       AND f.severity='high' AND f.resolved_at IS NULL)
   THEN RAISE EXCEPTION 'TASK-394 option validation failed: %',proof.original_ref; END IF;

   INSERT INTO public.question_bank_revisions
     (source_question_id,revision_question_id,revision_kind,evidence)
   VALUES(orig.id,rev.id,'owner_ai_distractor_balance',
     jsonb_build_object('task','TASK-394','delegated_AI_review_20261021',true,
      'old_correct',proof.old_correct,'new_correct',proof.new_correct,
      'original_user_results_changed',false,'independent_human_certification',false));
   INSERT INTO public.pedagogy_owner_release_waivers
     (question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id)
   VALUES(rev.id,actor,public.professional_question_fingerprint(rev.id),
     'owner_explicit_no_external_expert_20261018',
     'TASK-394: user explicitly delegated AI expert review on 2026-10-21. Legacy authority enum value is compatibility with atomic release function, NOT independent human review. Answer semantics and distractor balance verified by AI.',
     orig.id);
   SELECT public.publish_pedagogy_revision(rev.id,actor) INTO atomic_result;
   IF atomic_result->>'status'<>'published'
     OR (atomic_result->>'archived_source_question_id')::uuid IS DISTINCT FROM orig.id
   THEN RAISE EXCEPTION 'TASK-394 atomic release response invalid: %',proof.original_ref;END IF;

   UPDATE public.question_quality_published_revisions s SET
      release_scope='TASK-394 owner-delegated AI Y1 distractor review; independently human certified: no'
   WHERE s.question_id=rev.id;
   UPDATE public.question_quality_findings f SET resolved_at=now(),
     details=f.details||jsonb_build_object('task','TASK-394','published_revision',rev.id,
      'AI_review',true,'external_human_editor',false)
   WHERE f.question_id=orig.id AND f.finding_code='implausible_distractors';
   UPDATE public.question_quality_findings f SET resolved_at=now(),
     details=f.details||jsonb_build_object('task','TASK-394',
        'independent_review_requirement_waived_by_owner',true,'human_review_performed',false)
   WHERE f.question_id=rev.id AND f.finding_code='independent_editorial_review_required';

   IF (SELECT status FROM questions WHERE id=orig.id)<>'archived'::public.content_status
      OR (SELECT status FROM questions WHERE id=rev.id)<>'published'::public.content_status
      OR NOT EXISTS(SELECT 1 FROM question_quality_published_revisions s
           WHERE s.question_id=rev.id AND
             s.content_fingerprint=public.professional_question_fingerprint(rev.id))
      OR NOT public.is_question_official_mock_eligible(rev.id)
      OR NOT public.group_mock_eligible(rev.id)
   THEN RAISE EXCEPTION 'TASK-394 postflight failed: %',proof.original_ref;END IF;
   done_count:=done_count+1;
 END LOOP;
 IF done_count+skip_count<>10 OR done_count<1
 THEN RAISE EXCEPTION 'TASK-394 incomplete publish: % done % skipped',done_count,skip_count;END IF;
 RAISE NOTICE 'TASK-394 AI-reviewed Y1 revisions published %, concurrently skipped %',done_count,skip_count;
END
$task394$;
COMMIT;