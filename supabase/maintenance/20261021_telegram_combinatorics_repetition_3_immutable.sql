-- Telegram/Drive question content QA: explicit repetition in alphabetic password ranks.
-- OWNER-DELEGATED AI expert verification. No independent human signoff claimed.
-- MANUAL maintenance, NOT a migration. Immutable successors keep exam history intact.
-- Run in one transaction; check status/fingerprint/audit before and after.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='90s';

DO $qa$
DECLARE
  c record;
  oldq public.questions%rowtype;
  oldk public.question_keys%rowtype;
  successor uuid;
  new_key uuid;
  new_source text;
  expected_option uuid;
  seen_answer text;
BEGIN
  FOR c IN
    SELECT * FROM (VALUES
      (
        'TEL-11884-PASSWORD-R',
        '174e8d48-5549-435a-9d19-3fc8782108aa'::uuid,
        'S3.NUM',
        'A, K, O, R, S, T harflaridan tuziladigan barcha 5 belgili parollar alifbo tartibida 1 dan boshlab raqamlangan. R harfi bilan boshlanuvchi birinchi parol ro‘yxatda nechanchi o‘rinda turadi?',
        'A, K, O, R, S, T harflaridan tuzilgan barcha 5 belgili parollarda harflar takrorlanishi mumkin. Parollar alifbo tartibida 1 dan boshlab raqamlangan. R harfi bilan boshlanuvchi birinchi parol nechanchi o‘rinda turadi?',
        '3889',
        'A, K, O harflari R dan oldinda. Har bir boshlang‘ich harf uchun qolgan to‘rtta o‘rinda 6 tadan imkoniyat bor (takrorlash mumkin): 3 × 6⁴ = 3888. Birinchi RAAAA paroli 3889-o‘rinda.'
      ),
      (
        'TEL-6446-PASSWORD-T',
        '9b7cd9ab-b332-4741-a4d8-7a27d77979de'::uuid,
        'S1.INFO',
        'A, E, I, S, T, Y harflaridan tuziladigan barcha 5 belgili parollar alifbo tartibida raqamlangan. T harfi bilan boshlanuvchi birinchi parol qaysi o‘rinda turadi?',
        'A, E, I, S, T, Y harflaridan tuzilgan barcha 5 belgili parollarda harflar takrorlanishi mumkin. Parollar alifbo tartibida 1 dan boshlab raqamlangan. T harfi bilan boshlanuvchi birinchi parol qaysi o‘rinda turadi?',
        '5185',
        'T dan oldin A, E, I, S harflari turadi. Har biri bilan boshlanadigan parollar soni 6⁴, chunki har bir o‘ringa 6 xil harf tanlanadi va takrorlash mumkin. 4 × 6⁴ = 5184; birinchi TAAAA paroli 5185-o‘rinda.'
      ),
      (
        'TEL-27545-WORD-248',
        '524d9d2a-afe6-4672-9c5d-059e29aeed84'::uuid,
        'S1.INFO',
        'A, E, I, O harflaridan tuziladigan barcha 4 belgili so‘zlar alifbo tartibida yozildi. Ro‘yxat 1 dan raqamlangan. 248-o‘rindagi so‘zni toping.',
        'A, E, I, O harflaridan barcha 4 belgili so‘zlar tuziladi; harflar bir so‘z ichida takrorlanishi mumkin. So‘zlar alifbo tartibida 1 dan boshlab raqamlangan. 248-o‘rindagi so‘zni toping.',
        'OOEO',
        '4 ta harfdan takrorlash bilan 4⁴ = 256 ta so‘z tuziladi. 248-o‘rinning noldan boshlangan indeksi 247 = 3313₄. A=0, E=1, I=2, O=3 bo‘lsa, 3313₄ indeksi OOEO so‘ziga mos.'
      )
    ) cfg(code,old_id,expected_group,old_stem,new_stem,expected_answer,new_explanation)
    ORDER BY cfg.code
  LOOP
    SELECT * INTO STRICT oldq FROM public.questions q WHERE q.id=c.old_id FOR UPDATE;
    SELECT * INTO STRICT oldk FROM public.question_keys k WHERE k.question_id=c.old_id;
    IF oldq.status <> 'published'::public.content_status
       OR oldq.format <> 'Y1'::public.question_format
       OR oldq.group_code <> c.expected_group
       OR oldq.stem_md <> c.old_stem
       OR oldq.source_reference NOT LIKE 'telegram:%'
       OR EXISTS(SELECT 1 FROM public.question_bank_revisions br WHERE br.source_question_id=c.old_id)
       OR EXISTS(SELECT 1 FROM public.question_quality_quarantines zz WHERE zz.source_question_id=c.old_id)
       OR EXISTS(SELECT 1 FROM public.exam_items ei WHERE ei.question_id=c.old_id)
    THEN
      RAISE EXCEPTION 'Telegram password source changed, historically used or already revised: %',c.code;
    END IF;

    IF jsonb_typeof(oldk.payload->'correct_option_id') IS DISTINCT FROM 'string'
       OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=c.old_id AND o.side='a')<>4
       OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=c.old_id AND o.side='b')<>0
    THEN RAISE EXCEPTION 'Telegram Y1 original key invalid: %',c.code; END IF;
    SELECT o.id,o.content_md INTO expected_option,seen_answer
      FROM public.question_options o
      WHERE o.question_id=c.old_id AND o.id::text=oldk.payload->>'correct_option_id';
    IF expected_option IS NULL OR seen_answer<>c.expected_answer THEN
      RAISE EXCEPTION 'Telegram option/key semantic drift: %, answer=%',c.code,seen_answer;
    END IF;
    IF (SELECT count(*) FROM public.question_options o WHERE o.question_id=c.old_id AND o.content_md=c.expected_answer)<>1 THEN
      RAISE EXCEPTION 'Telegram answer ambiguous at option level: %',c.code;
    END IF;

    successor:=gen_random_uuid();
    new_source:='revision:owner-ai-qa:explicit-repetition:'||c.code||':'||c.old_id::text||' | '||oldq.source_reference;
    IF EXISTS(SELECT 1 FROM public.questions q WHERE q.source_reference=new_source) THEN
      RAISE EXCEPTION 'Telegram revision already exists: %',c.code;
    END IF;

    INSERT INTO public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
      assets,is_generated,status,author_id,created_at,updated_at,source_reference,source_lesson_id
    ) VALUES (
      successor,oldq.subject_id,oldq.construct_id,oldq.group_code,oldq.format,
      oldq.cognitive,oldq.difficulty,c.new_stem,
      oldq.assets,oldq.is_generated,'review'::public.content_status,oldq.author_id,
      now(),now(),new_source,oldq.source_lesson_id
    );

    INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
    SELECT gen_random_uuid(),successor,side,order_idx,content_md
    FROM public.question_options WHERE question_id=c.old_id;

    SELECT o.id INTO STRICT new_key FROM public.question_options o
    WHERE o.question_id=successor AND o.side='a'
      AND o.content_md=c.expected_answer;
    INSERT INTO public.question_keys(question_id,payload,explanation_md,updated_at)
    VALUES(successor,jsonb_set(oldk.payload,'{correct_option_id}',to_jsonb(new_key::text),false),c.new_explanation,now());

    INSERT INTO public.question_bank_revisions(
      source_question_id,revision_question_id,revision_kind,evidence
    ) VALUES (
      c.old_id,successor,'telegram_password_repetition_disambiguation',
      jsonb_build_object(
        'source_code',c.code,'owner_delegated_approval',true,
        'reviewer_type','AI','independent_human_editorial_signoff',false,
        'previously_implicit_assumption','characters may repeat',
        'newly_explicit_assumption','characters may repeat',
        'answer_key_semantics_changed',false,
        'expected_correct_answer',c.expected_answer,
        'historical_attempts_changed',false,
        'publication_status','owner_delegated_ai_verified_published'
      )
    );

    INSERT INTO public.question_quality_quarantines(
      source_question_id,replacement_question_id,reason,evidence
    ) VALUES (
      c.old_id,successor,'ambiguous_repetition_and_indexing_assumptions',
      jsonb_build_object('source_code',c.code,
        'original_status','archived','replacement_status','published',
        'correct_option_preserved',true,'historical_attempts_changed',false)
    );

    INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
    VALUES(successor,'independent_editorial_review_required','medium',
      jsonb_build_object('reviewer_type','AI','owner_delegated',true,'independent_human_editorial_signoff',false))
    ON CONFLICT(question_id,finding_code) DO NOTHING;

    UPDATE public.questions SET status='published'::public.content_status,updated_at=now()
    WHERE id=successor AND status='review'::public.content_status;
    IF NOT FOUND THEN RAISE EXCEPTION 'Telegram new question not published %',c.code; END IF;
    UPDATE public.questions SET status='archived'::public.content_status,updated_at=now()
    WHERE id=c.old_id AND status='published'::public.content_status;
    IF NOT FOUND THEN RAISE EXCEPTION 'Telegram old question not archived %',c.code; END IF;
    UPDATE public.question_quality_published_revisions
    SET release_scope='Telegram combinatorics owner-delegated AI review: repetition explicit, key unchanged, no independent human signoff'
    WHERE question_id=successor;

    INSERT INTO public.audit_log(actor_id,action,entity,entity_id,diff)
    VALUES(NULL,'owner_delegated_ai_repetition_disambiguation','question',c.old_id,
      jsonb_build_object('source_code',c.code,'successor',successor,
       'original_status','archived','successor_status','published',
       'semantic_answer',c.expected_answer,'reviewer_type','AI',
       'historical_attempts_changed',false,'independent_human_editorial_signoff',false));

    IF NOT EXISTS (
      SELECT 1 FROM public.question_quality_published_revisions pr
      WHERE pr.question_id=successor
        AND pr.content_fingerprint=public.professional_question_fingerprint(successor)
    ) OR (SELECT status FROM public.questions WHERE id=c.old_id)<>'archived'::public.content_status
      OR (SELECT status FROM public.questions WHERE id=successor)<>'published'::public.content_status
      OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=successor)<>4
    THEN RAISE EXCEPTION 'Telegram QA postflight failed %',c.code; END IF;
  END LOOP;
END
$qa$;
COMMIT;
