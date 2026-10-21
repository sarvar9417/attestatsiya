-- MANUAL MAINTENANCE ONLY — NOT A MIGRATION AND NOT YET APPLIED.
-- OFF-E02-027: 'Nisbiy havola mavjud' is true for all three sample
-- formulas, because the two mixed references also contain one relative
-- coordinate. Archive the ambiguous published original and stage a precise
-- Y2 revision for editorial review. Do NOT auto-publish the revision.
-- Immutability: new UUIDs for the question, every option and all key pairs.
-- Historical exam_items / attempts keep referencing the unchanged original.
begin;

do $repair$
declare
  v_source_id constant uuid := 'e9586da2-2cc5-7cf4-1d37-3fb28096de4b';
  v_new_id uuid := gen_random_uuid();
  v_source public.questions%rowtype;
  v_key public.question_keys%rowtype;
  v_option record;
  v_pair record;
  v_option_new_id uuid;
  v_option_remap jsonb := '{}'::jsonb;
  v_pairs jsonb := '{}'::jsonb;
  v_valid_pairs integer;
begin
  select * into strict v_source
  from public.questions
  where id=v_source_id for update;

  if v_source.status <> 'published'::public.content_status
     or v_source.format <> 'Y2'::public.question_format
     or v_source.source_reference not like 'Office_2026_v2|OFF-E02-027|%'
     or v_source.stem_md not like '%B) Nisbiy havola mavjud%'
  then
    raise exception 'OFF-E02-027 source drift or not published; abort';
  end if;

  if exists(select 1 from public.question_bank_revisions where source_question_id=v_source_id)
     or exists(select 1 from public.question_quality_quarantines where source_question_id=v_source_id)
  then
    raise exception 'OFF-E02-027 already revised/quarantined; abort';
  end if;

  select * into strict v_key from public.question_keys where question_id=v_source_id;

  if (select count(*) from public.question_options where question_id=v_source_id and side='a')<>3
     or (select count(*) from public.question_options where question_id=v_source_id and side='b')<>3
     or jsonb_typeof(v_key.payload->'pairs') is distinct from 'object'
     or (select count(*) from jsonb_each_text(v_key.payload->'pairs')) <> 3
  then
    raise exception 'OFF-E02-027 option/pair cardinality drift; abort';
  end if;

  select count(*) into v_valid_pairs
  from jsonb_each_text(v_key.payload->'pairs') p(left_id,right_id)
  join public.question_options a on a.id=p.left_id::uuid and a.question_id=v_source_id and a.side='a'
  join public.question_options b on b.id=p.right_id::uuid and b.question_id=v_source_id and b.side='b'
  where (a.content_md='=B2+3' and b.content_md='Nisbiy havola mavjud')
     or (a.content_md='=B$2+3' and b.content_md='Faqat satr qat’iy')
     or (a.content_md='=$B2+3' and b.content_md='Faqat ustun qat’iy');
  if v_valid_pairs<>3 then
    raise exception 'OFF-E02-027 correct-pair mappings drift; abort';
  end if;

  insert into public.questions(
    id,subject_id,construct_id,group_code,format,cognitive,difficulty,
    stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
  )
  values (
    v_new_id,v_source.subject_id,v_source.construct_id,v_source.group_code,
    v_source.format,v_source.cognitive,v_source.difficulty,
    'Quyidagi formulalarni katak havolasi turiga ko‘ra moslashtiring. 1) =B2+3; 2) =B$2+3; 3) =$B2+3; Izohlar: A) Faqat ustun qat’iy; B) Ustun ham, satr ham nisbiy; C) Faqat satr qat’iy;',
    v_source.assets,v_source.is_generated,'review'::public.content_status,
    v_source.author_id,
    'revision:excel-reference-disambiguation:OFF-E02-027:'||v_source_id::text||' | '||v_source.source_reference,
    v_source.source_lesson_id
  );

  for v_option in
    select * from public.question_options
    where question_id=v_source_id order by side,order_idx
  loop
    v_option_new_id := gen_random_uuid();
    insert into public.question_options(id,question_id,side,order_idx,content_md)
    values (
      v_option_new_id,v_new_id,v_option.side,v_option.order_idx,
      case when v_option.side='b' and v_option.content_md='Nisbiy havola mavjud'
        then 'Ustun ham, satr ham nisbiy' else v_option.content_md end
    );
    v_option_remap := v_option_remap ||
      jsonb_build_object(v_option.id::text,v_option_new_id::text);
  end loop;

  for v_pair in
    select key as old_left, value as old_right
    from jsonb_each_text(v_key.payload->'pairs')
  loop
    if v_option_remap->>v_pair.old_left is null
       or v_option_remap->>v_pair.old_right is null
    then
      raise exception 'OFF-E02-027 missing option remap; abort';
    end if;
    v_pairs := v_pairs || jsonb_build_object(
      v_option_remap->>v_pair.old_left,
      v_option_remap->>v_pair.old_right);
  end loop;

  insert into public.question_keys(question_id,payload,explanation_md)
  values(
    v_new_id,jsonb_build_object('pairs',v_pairs),
    'B2 havolasida ustun ham, satr ham nisbiy. B$2 da faqat 2-satr mahkamlangan; $B2 da faqat B ustuni mahkamlangan. Qisqa izohlarning har biri aynan bitta formulaga mos.'
  );

  insert into public.question_bank_revisions(
    source_question_id,revision_question_id,revision_kind,evidence)
  values(
    v_source_id,v_new_id,'excel_reference_y2_unambiguous_wording',
    jsonb_build_object(
      'date','2026-10-21',
      'source','Office_2026_v2|OFF-E02-027',
      'reason','Nisbiy havola mavjud applies to all three formulas',
      'independent_human_editorial_signoff',false,
      'publication_status','human_review_required'
    )
  );

  insert into public.question_quality_quarantines(
    source_question_id,replacement_question_id,reason,evidence)
  values(
    v_source_id,v_new_id,'ambiguous_y2_relative_reference',
    jsonb_build_object('source_reference',v_source.source_reference,
      'old_option','Nisbiy havola mavjud',
      'new_option','Ustun ham, satr ham nisbiy',
      'publication_status','review_only')
  );

  insert into public.question_quality_findings(
    question_id,finding_code,severity,details)
  values (
    v_new_id,'independent_editorial_review_required','high',
    jsonb_build_object('reason','AI-verified wording fix; not signed off by a human reviewer')
  );

  -- The old published item stays immutable; archive-only status transition.
  update public.questions
  set status='archived'::public.content_status,updated_at=now()
  where id=v_source_id and status='published'::public.content_status;
  if not found then raise exception 'OFF-E02-027 archive failed'; end if;

  insert into public.audit_log(actor_id,action,entity,entity_id,diff)
  values(
    null,'excel_y2_ambiguity_revision','question',v_source_id,
    jsonb_build_object('revision_question_id',v_new_id,
      'old_status','published','new_status','archived',
      'revision_status','review',
      'explanation','Relative coordinate is present in all three original formulas')
  );

  if (select count(*) from public.question_options where question_id=v_new_id)<>6
     or (select count(*) from jsonb_each_text(v_pairs))<>3
     or (select status from public.questions where id=v_new_id)<>'review'::public.content_status
     or (select status from public.questions where id=v_source_id)<>'archived'::public.content_status
  then
    raise exception 'OFF-E02-027 postcondition failed';
  end if;
end
$repair$;

commit;
