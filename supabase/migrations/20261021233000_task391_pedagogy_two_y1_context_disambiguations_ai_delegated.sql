
-- TASK-391: owner-delegated AI-reviewed, ORIGINAL-authored clarification
-- of two ambiguous pedagogy Y1 situations. Historical old items are retained
-- and archived; answer labels unchanged. No independent human review claimed.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';

ALTER TABLE public.pedagogy_owner_release_waivers
 DROP CONSTRAINT pedagogy_owner_release_waivers_authority_check;
ALTER TABLE public.pedagogy_owner_release_waivers
 ADD CONSTRAINT pedagogy_owner_release_waivers_authority_check
 CHECK (authority IN (
  'owner_explicit_no_external_expert_20261018',
  'owner_delegated_ai_y2_20261021',
  'owner_delegated_ai_clarity_20261021',
  'owner_delegated_ai_pedagogy_y1_20261021'
 ));

DO $policy$
DECLARE v_func text;
  needle text := 'br.revision_kind=''order_match_instruction_clarity''
        )))';
  replacement text := 'br.revision_kind=''order_match_instruction_clarity''
        )) OR (w.authority=''owner_delegated_ai_pedagogy_y1_20261021'' AND EXISTS (
          SELECT 1 FROM public.question_bank_revisions br
          WHERE br.revision_question_id=w.question_id
            AND br.revision_kind=''pedagogy_y1_disambiguation''
        )))';
BEGIN
 SELECT pg_get_functiondef('public.guard_pedguli_question_publish()'::regprocedure)
 INTO v_func;
 IF position(needle IN v_func)=0
    OR position('owner_delegated_ai_pedagogy_y1_20261021' IN v_func)>0
 THEN RAISE EXCEPTION 'TASK-391 pedagogy publication policy changed unexpectedly'; END IF;
 EXECUTE replace(v_func,needle,replacement);
END
$policy$;

CREATE TEMP TABLE task391_cases (
 source_id uuid PRIMARY KEY,
 improved_stem text NOT NULL,
 improved_explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task391_cases VALUES
('5902bec1-3c05-4467-9a5b-ab0a3baa22f6'::uuid,'Ingliz tili darsida erkin suhbat topshirig‘i yakunlandi. O‘qituvchi xatolar yuzasidan aniq qayta aloqa berdi. Endigi maqsad — o‘quvchilar avvalgi tajribani hisobga olib, belgilangan boshqa maqsadli til shaklini faol qo‘llab ko‘rishlari. Quyidagi faoliyatlardan qaysi biri ushbu keyingi bosqichga eng mos?','Erkin nutq topshirig‘idan keyingi qayta aloqa allaqachon berilgan. Keyingi maqsad yangi belgilangan til shaklini faol qo‘llash bo‘lgani uchun o‘sha kommunikativ vazifani maqsadli shaklga yo‘naltirib qayta bajarish mos keladi. Faoliyat paytidagi uzluksiz to‘xtatish muloqotni buzadi, qayta aloqa bermaslik esa o‘rganishni susaytiradi.'),
('7e370e77-3f58-42ab-ae5a-958f6d984a25'::uuid,'Ingliz tili darsida maqsad o‘quvchilarning tovushlarni farqlab, to‘g‘ri talaffuz qilishini rivojlantirishdir. Guruh muhokamasida bir o‘quvchi tovushni noto‘g‘ri aytadi, lekin buni sezmaydi. O‘qituvchi muloqot oqimini buzmasdan, muhokamadan keyin fonemalar farqini aniqlashtirishni rejalashtirdi. Qaysi amal bu maqsadga eng mos?','Bu vaziyatda darsning aniq maqsadi talaffuz va fonemalarni farqlashdir. Muhokama tugagach fonemik jadvaldan foydalanish tovushdagi xatoni konstruktiv ko‘rsatadi va erkin suhbatni to‘xtatmaydi. O‘quvchini hammaning oldida darhol to‘xtatish yoki tanqid qilish zarur emas; xatoni butunlay e’tiborsiz qoldirish ham maqsadga zid.');

DO $t391$
DECLARE
 c record;
 original public.questions%rowtype;
 rev_id uuid;
 old_key public.question_keys%rowtype;
 next_option_id uuid;
 actor uuid;
 new_ref text;
 n integer:=0;
 too_different integer;
BEGIN
 IF (SELECT count(*) FROM task391_cases)<>2
 THEN RAISE EXCEPTION 'TASK-391 exactly two pedagogy items required'; END IF;
 SELECT p.id INTO actor FROM public.profiles p
 WHERE p.role='admin' AND coalesce(p.is_blocked,false)=false;
 IF actor IS NULL OR (SELECT count(*) FROM profiles
   WHERE role='admin' AND coalesce(is_blocked,false)=false)<>1
 THEN RAISE EXCEPTION 'TASK-391 owner authority ambiguous'; END IF;

 FOR c IN SELECT * FROM task391_cases ORDER BY source_id LOOP
  SELECT * INTO original FROM public.questions WHERE id=c.source_id FOR UPDATE;
  IF NOT FOUND OR original.status<>'published'::public.content_status
    OR original.group_code<>'PM.GEN'
    OR original.format<>'Y1'::public.question_format
    OR NOT EXISTS(SELECT 1 FROM public.question_quality_findings f
       WHERE f.question_id=original.id AND f.finding_code='source_key_ambiguity_needs_review'
       AND f.resolved_at IS NULL)
    OR (SELECT count(*) FROM public.question_options o
       WHERE o.question_id=original.id AND o.side='a')<>4
    OR EXISTS(SELECT 1 FROM public.question_bank_revisions r WHERE r.source_question_id=original.id)
  THEN RAISE EXCEPTION 'TASK-391 unreviewed or changed source %',c.source_id; END IF;

  SELECT * INTO old_key FROM public.question_keys k WHERE k.question_id=original.id;
  IF old_key.payload->>'correct_option_id' IS NULL
     OR NOT EXISTS(SELECT 1 FROM public.question_options o
       WHERE o.question_id=original.id AND o.id::text=old_key.payload->>'correct_option_id')
  THEN RAISE EXCEPTION 'TASK-391 original correct key missing'; END IF;

  new_ref:='revision:TASK-391:AI-authored-context:'||original.id::text||' | '||
             original.source_reference||' | adapted-not-verbatim';
  IF EXISTS(SELECT 1 FROM public.questions q WHERE q.source_reference=new_ref)
  THEN RAISE EXCEPTION 'TASK-391 duplicate existing revision'; END IF;
  rev_id:=gen_random_uuid();

  INSERT INTO public.questions(
    id,subject_id,construct_id,group_code,format,cognitive,difficulty,
    stem_md,assets,is_generated,status,author_id,created_at,updated_at,
    source_reference,source_lesson_id
  ) VALUES(
    rev_id,original.subject_id,original.construct_id,original.group_code,
    original.format,original.cognitive,original.difficulty,c.improved_stem,
    original.assets,true,'review'::public.content_status,original.author_id,
    now(),now(),new_ref,original.source_lesson_id
  );

  INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
  SELECT gen_random_uuid(),rev_id,o.side,o.order_idx,o.content_md
  FROM public.question_options o WHERE o.question_id=original.id;

  SELECT new_option.id INTO next_option_id
  FROM public.question_options old_option
  JOIN public.question_options new_option
    ON new_option.question_id=rev_id
   AND new_option.side=old_option.side
   AND new_option.order_idx=old_option.order_idx
   AND new_option.content_md=old_option.content_md
  WHERE old_option.question_id=original.id
    AND old_option.id::text=old_key.payload->>'correct_option_id';
  IF next_option_id IS NULL THEN RAISE EXCEPTION 'TASK-391 key remap failed'; END IF;

  INSERT INTO public.question_keys(question_id,payload,explanation_md,updated_at)
  VALUES(rev_id,
         jsonb_set(old_key.payload,'{correct_option_id}',to_jsonb(next_option_id::text),false),
         c.improved_explanation,now());

  SELECT count(*) INTO too_different
  FROM public.question_options so
  LEFT JOIN public.question_options ro
    ON ro.question_id=rev_id AND ro.order_idx=so.order_idx
   AND ro.side=so.side AND ro.content_md=so.content_md
  WHERE so.question_id=original.id AND ro.id IS NULL;
  IF too_different<>0 THEN RAISE EXCEPTION 'TASK-391 options changed without review'; END IF;

  INSERT INTO public.question_bank_revisions(
    source_question_id,revision_question_id,revision_kind,evidence
  ) VALUES (
    original.id,rev_id,'pedagogy_y1_disambiguation',
    jsonb_build_object(
      'task','TASK-391','owner_delegated_ai_review',true,
      'original_source',original.source_reference,
      'AI_authored_adaptation_not_verbatim',true,
      'source_key_preserved',true,'historical_exam_results_preserved',true,
      'independent_human_editor',false
    )
  );

  INSERT INTO public.pedagogy_owner_release_waivers(
    question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id
  ) VALUES (
    rev_id,actor,public.professional_question_fingerprint(rev_id),
    'owner_delegated_ai_pedagogy_y1_20261021',
    'User explicitly delegated AI editorial assessment on 2026-10-21; context rewritten to disambiguate the keyed Y1 answer. This is a newly authored adaptation, not Telegram original, and no independent human endorsement is claimed.',
    original.id
  );

  UPDATE public.questions SET status='published'::public.content_status,updated_at=now()
  WHERE id=rev_id AND status='review'::public.content_status;
  UPDATE public.questions SET status='archived'::public.content_status,updated_at=now()
  WHERE id=original.id AND status='published'::public.content_status;

  IF (SELECT status FROM public.questions WHERE id=rev_id)<>'published'::public.content_status
    OR (SELECT status FROM public.questions WHERE id=original.id)<>'archived'::public.content_status
    OR NOT EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
       WHERE snap.question_id=rev_id AND snap.content_fingerprint=public.professional_question_fingerprint(rev_id))
  THEN RAISE EXCEPTION 'TASK-391 published revision snapshot failed'; END IF;
  UPDATE public.question_quality_published_revisions snap
  SET release_scope='TASK-391 owner-delegated AI-authored disambiguation, NOT verbatim source or independent human endorsement'
  WHERE snap.question_id=rev_id;

  UPDATE public.question_quality_findings f
  SET resolved_at=now(),details=f.details||jsonb_build_object(
   'task','TASK-391','AI_context_authoring',true,'not_verbatim_source',true,
   'new_revision_id',rev_id,'human_expert_reviewed',false)
  WHERE f.question_id=original.id AND f.finding_code='source_key_ambiguity_needs_review';
  n:=n+1;
 END LOOP;
 IF n<>2 OR EXISTS(SELECT 1 FROM public.question_quality_findings f
   JOIN public.questions q ON q.id=f.question_id WHERE f.finding_code='source_key_ambiguity_needs_review'
   AND f.resolved_at IS NULL AND q.status='published'::public.content_status)
 THEN RAISE EXCEPTION 'TASK-391 ambiguous published pedagogical keys remain'; END IF;
END
$t391$;
COMMIT;