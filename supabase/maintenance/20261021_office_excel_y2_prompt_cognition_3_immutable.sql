-- Owner-delegated AI editorial correction for 3 published Office Excel Y2 items.
-- MANUAL production maintenance; execute once after read-only validation.
-- Immutable replacements preserve historical question/answer IDs and attempts.
-- Not an independent human review; not automatically run by migrations or CI.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='90s';

DO $repair$
DECLARE
  cfg record;
  src public.questions%rowtype;
  src_key public.question_keys%rowtype;
  new_id uuid;
  new_reference text;
  expected_pairs jsonb;
  observed_pairs jsonb;
  new_pairs jsonb;
  n integer;
BEGIN
  FOR cfg IN
    SELECT * FROM (VALUES
      (
        'OFF-E02-004',
        '80bc0e50-fed9-32ae-4345-505fa90f18e9'::uuid,
        'Excel katak manzillarini nisbiy yoki mutlaq murojaat turiga ko‘ra moslashtiring.',
        'bilish',1,
        'A1 — ustun va satr nisbiy; $A$1 — ustun va satr mutlaq; A$1 — faqat satr mutlaq.',
        jsonb_build_object('A1','Nisbiy manzil','$A$1','To‘liq mutlaq manzil','A$1','Satr mutlaq manzil')
      ),
      (
        'OFF-E02-022',
        '731a6efe-c8a6-5a8a-9966-dd09d7e07039'::uuid,
        'Excel formulalaridagi katak murojaatlarini qaysi koordinata mahkamlanganiga ko‘ra moslashtiring.',
        'bilish',2,
        '=$A1 havolasida A ustuni mahkam, satri nisbiy; =A$1 havolasida 1-satr mahkam, ustuni nisbiy; =$A$1 da ikkalasi mahkam.',
        jsonb_build_object('=$A1','Ustun mahkamlangan','=A$1','Satr mahkamlangan','=$A$1','Ikkalasi mahkamlangan')
      ),
      (
        'OFF-E02-029',
        '556f83ea-f48d-a7c1-a984-9af44e0bdc72'::uuid,
        'Excel katak murojaatlarini ustun va satrning nisbiy yoki mutlaq holatiga ko‘ra moslashtiring.',
        'bilish',2,
        '$A$1 — ustun va satr mutlaq; A$1 — satr mutlaq va ustun nisbiy; $A1 — ustun mutlaq va satr nisbiy.',
        jsonb_build_object('$A$1','Ikkala koordinatasi mutlaq','A$1','Satr mutlaq, ustun nisbiy','$A1','Ustuni mutlaq, satri nisbiy')
      )
    ) v(code,source_id,new_stem,new_cognitive,new_difficulty,new_explanation,expected_pairs)
    ORDER BY v.code
  LOOP
    SELECT * INTO STRICT src FROM public.questions q WHERE q.id=cfg.source_id FOR UPDATE;
    IF src.status <> 'published'::public.content_status
       OR src.format <> 'Y2'::public.question_format
       OR src.group_code <> 'S2.OFFICE'
       OR src.source_reference NOT LIKE 'Office_2026_v2|'||cfg.code||'|%'
       OR src.stem_md NOT LIKE '%1)%2)%3)%'
       OR EXISTS(SELECT 1 FROM public.question_bank_revisions x WHERE x.source_question_id=cfg.source_id)
       OR EXISTS(SELECT 1 FROM public.question_quality_quarantines z WHERE z.source_question_id=cfg.source_id)
    THEN
      RAISE EXCEPTION 'Office Y2 original drift, already revised or invalid: %',cfg.code;
    END IF;

    IF (cfg.code='OFF-E02-004' AND (src.cognitive<>'bilish'::public.cognitive_level OR src.difficulty<>1))
       OR (cfg.code='OFF-E02-022' AND (src.cognitive<>'mulohaza'::public.cognitive_level OR src.difficulty<>4))
       OR (cfg.code='OFF-E02-029' AND (src.cognitive<>'mulohaza'::public.cognitive_level OR src.difficulty<>5))
    THEN RAISE EXCEPTION 'Office Y2 cognitive baseline drift: %',cfg.code; END IF;

    SELECT * INTO STRICT src_key FROM public.question_keys WHERE question_id=src.id;
    IF jsonb_typeof(src_key.payload->'pairs') IS DISTINCT FROM 'object'
       OR (SELECT count(*) FROM public.question_options WHERE question_id=src.id AND side='a')<>3
       OR (SELECT count(*) FROM public.question_options WHERE question_id=src.id AND side='b')<>3
       OR (SELECT count(*) FROM jsonb_each_text(src_key.payload->'pairs'))<>3
    THEN RAISE EXCEPTION 'Office Y2 key/cardinality drift: %',cfg.code; END IF;

    SELECT jsonb_object_agg(a.content_md,b.content_md)
    INTO observed_pairs
    FROM jsonb_each_text(src_key.payload->'pairs') p(left_id,right_id)
    JOIN public.question_options a
      ON a.id::text=p.left_id AND a.question_id=src.id AND a.side='a'
    JOIN public.question_options b
      ON b.id::text=p.right_id AND b.question_id=src.id AND b.side='b';
    IF observed_pairs IS DISTINCT FROM cfg.expected_pairs
    THEN RAISE EXCEPTION 'Office Y2 semantic pair mismatch %: %',cfg.code,observed_pairs; END IF;

    new_id:=gen_random_uuid();
    new_reference:='revision:owner-ai-qa:excel-y2-prompt:'||cfg.code||':'||src.id::text||' | '||src.source_reference;
    IF EXISTS(SELECT 1 FROM public.questions q WHERE q.source_reference=new_reference)
    THEN RAISE EXCEPTION 'Office Y2 revision already exists: %',cfg.code; END IF;

    INSERT INTO public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
      assets,is_generated,status,author_id,created_at,updated_at,source_reference,source_lesson_id
    ) VALUES (
      new_id,src.subject_id,src.construct_id,src.group_code,src.format,
      cfg.new_cognitive::public.cognitive_level,cfg.new_difficulty,cfg.new_stem,
      src.assets,src.is_generated,'review'::public.content_status,src.author_id,
      now(),now(),new_reference,src.source_lesson_id
    );

    INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
    SELECT gen_random_uuid(),new_id,o.side,o.order_idx,o.content_md
    FROM public.question_options o WHERE o.question_id=src.id;

    SELECT jsonb_object_agg(new_a.id::text,new_b.id::text)
    INTO new_pairs
    FROM jsonb_each_text(src_key.payload->'pairs') p(left_id,right_id)
    JOIN public.question_options old_a ON old_a.id::text=p.left_id AND old_a.question_id=src.id AND old_a.side='a'
    JOIN public.question_options old_b ON old_b.id::text=p.right_id AND old_b.question_id=src.id AND old_b.side='b'
    JOIN public.question_options new_a ON new_a.question_id=new_id AND new_a.side='a' AND new_a.order_idx=old_a.order_idx AND new_a.content_md=old_a.content_md
    JOIN public.question_options new_b ON new_b.question_id=new_id AND new_b.side='b' AND new_b.order_idx=old_b.order_idx AND new_b.content_md=old_b.content_md;

    IF (SELECT count(*) FROM public.question_options WHERE question_id=new_id)<>6
       OR (SELECT count(*) FROM jsonb_each_text(coalesce(new_pairs,'{}'::jsonb)))<>3
       OR (SELECT count(DISTINCT value) FROM jsonb_each_text(coalesce(new_pairs,'{}'::jsonb)))<>3
    THEN RAISE EXCEPTION 'Office Y2 remapping failure: %',cfg.code; END IF;

    INSERT INTO public.question_keys(question_id,payload,explanation_md,updated_at)
    VALUES(
      new_id,jsonb_set(src_key.payload,'{pairs}',new_pairs,false),cfg.new_explanation,now()
    );

    INSERT INTO public.question_bank_revisions(
      source_question_id,revision_question_id,revision_kind,evidence
    ) VALUES (
      src.id,new_id,'office_excel_y2_owner_ai_prompt_and_cognition',
      jsonb_build_object(
        'source_code',cfg.code,
        'owner_delegated_approval',true,
        'reviewer_type','AI',
        'independent_human_editorial_signoff',false,
        'answer_semantics_changed',false,
        'historical_attempts_changed',false,
        'original_cognitive',src.cognitive,
        'new_cognitive',cfg.new_cognitive,
        'original_difficulty',src.difficulty,
        'new_difficulty',cfg.new_difficulty,
        'answer_pair_count',3,
        'reference','Microsoft Support: switch-between-relative-absolute-and-mixed-references',
        'publication_status','owner_delegated_ai_verified_published'
      )
    );

    INSERT INTO public.question_quality_quarantines(
      source_question_id,replacement_question_id,reason,evidence
    ) VALUES (
      src.id,new_id,'repeated_embedded_y2_choices_or_cognitive_overstatement',
      jsonb_build_object(
        'source_code',cfg.code,
        'source_options_unchanged',true,
        'answer_keys_unchanged_semantically',true,
        'replacement_status','published'
      )
    );

    INSERT INTO public.question_quality_findings(
      question_id,finding_code,severity,details
    ) VALUES (
      new_id,'independent_editorial_review_required','medium',
      jsonb_build_object('reviewer_type','AI','independent_human_editorial_signoff',false,'owner_delegated',true)
    ) ON CONFLICT(question_id,finding_code) DO NOTHING;

    UPDATE public.questions SET status='published'::public.content_status,updated_at=now()
    WHERE id=new_id AND status='review'::public.content_status;
    IF NOT FOUND THEN RAISE EXCEPTION 'Office Y2 publication failure %',cfg.code; END IF;

    UPDATE public.questions SET status='archived'::public.content_status,updated_at=now()
    WHERE id=src.id AND status='published'::public.content_status;
    IF NOT FOUND THEN RAISE EXCEPTION 'Office Y2 archive failure %',cfg.code; END IF;

    UPDATE public.question_quality_published_revisions
    SET release_scope='Office Excel Y2 owner-delegated AI review: Microsoft reference semantics; 3 unique mappings; prompt cleaned; no independent human endorsement'
    WHERE question_id=new_id;

    INSERT INTO public.audit_log(actor_id,action,entity,entity_id,diff)
    VALUES (
      null,'owner_delegated_ai_office_y2_editorial_revision','question',src.id,
      jsonb_build_object(
        'source_code',cfg.code,
        'replacement_question_id',new_id,
        'revision_status','published',
        'source_status','archived',
        'historical_attempts_changed',false,
        'original_cognitive',src.cognitive,
        'new_cognitive',cfg.new_cognitive,
        'original_difficulty',src.difficulty,
        'new_difficulty',cfg.new_difficulty,
        'semantic_pairings_preserved',3,
        'reviewer_type','AI',
        'independent_human_editorial_signoff',false
      )
    );

    IF (SELECT q.status FROM public.questions q WHERE q.id=new_id)<>'published'::public.content_status
       OR (SELECT q.status FROM public.questions q WHERE q.id=src.id)<>'archived'::public.content_status
       OR (SELECT q.stem_md FROM public.questions q WHERE q.id=new_id)<>cfg.new_stem
       OR NOT EXISTS (
         SELECT 1 FROM public.question_quality_published_revisions r
         WHERE r.question_id=new_id AND r.content_fingerprint=public.professional_question_fingerprint(new_id)
       )
    THEN RAISE EXCEPTION 'Office Y2 postflight failure: %',cfg.code; END IF;
  END LOOP;
END
$repair$;

COMMIT;
