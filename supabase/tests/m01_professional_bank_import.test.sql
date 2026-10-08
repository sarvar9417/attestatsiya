-- TASK-043 professional bank import regression.
begin;

do $$
declare
  v_actor uuid := '71000000-0000-4000-8000-000000000001';
  v_construct_code text;
  v_payload jsonb;
  v_result jsonb;
  v_question uuid;
  v_count int;
begin
  insert into auth.users (id, email)
  values (v_actor, 't043-admin@example.test');

  update public.profiles
     set role = 'admin'::public.user_role,
         is_blocked = false
   where id = v_actor;

  select code into strict v_construct_code
    from public.constructs
   where code = 'S1.INFO.01'
   limit 1;

  v_payload := jsonb_build_array(jsonb_build_object(
    'external_id', 'AXB-99-001',
    'format', 'Y1',
    'construct_code', v_construct_code,
    'cognitive', 'bilish',
    'difficulty', 2,
    'stem_md', 'TASK-043 sinov savoli',
    'options', jsonb_build_array(
      jsonb_build_object('content_md', 'A variant'),
      jsonb_build_object('content_md', 'B variant'),
      jsonb_build_object('content_md', 'C variant'),
      jsonb_build_object('content_md', 'D variant')
    ),
    'correct_index', 1,
    'explanation_md', 'B variant to‘g‘ri.',
    'source_locator', 'TASK-043 fixture',
    'bank_pdf_page', 1
  ));

  v_result := public.import_question_bank_batch(v_actor, v_payload);

  if (v_result->>'inserted')::int <> 1
     or (v_result->>'skipped')::int <> 0
     or (v_result->>'rejected')::int <> 0 then
    raise exception 'unexpected first import result: %', v_result;
  end if;

  select id into strict v_question
    from public.questions
   where source_reference = 'm01-professional-bank:AXB-99-001';

  if (select status from public.questions where id = v_question) <> 'review'::public.content_status then
    raise exception 'imported item must stay in REVIEW';
  end if;

  select count(*) into v_count
    from public.question_options
   where question_id = v_question;
  if v_count <> 4 then
    raise exception 'expected 4 options, got %', v_count;
  end if;

  if not exists (
    select 1 from public.question_keys
     where question_id = v_question
       and payload ? 'correct_option_id'
       and explanation_md <> ''
  ) then
    raise exception 'answer key/explanation missing';
  end if;

  if not exists (
    select 1 from public.audit_log
     where entity = 'questions'
       and entity_id = v_question
       and action = 'question_bank_import'
  ) then
    raise exception 'audit log missing';
  end if;

  -- Exact retry must be idempotent and never duplicate content.
  v_result := public.import_question_bank_batch(v_actor, v_payload);
  if (v_result->>'inserted')::int <> 0
     or (v_result->>'skipped')::int <> 1 then
    raise exception 'idempotent retry failed: %', v_result;
  end if;

  select count(*) into v_count
    from public.questions
   where source_reference = 'm01-professional-bank:AXB-99-001';
  if v_count <> 1 then
    raise exception 'duplicate bank question created';
  end if;

  -- Bad objective is rejected without a partial question.
  v_payload := jsonb_build_array(jsonb_build_object(
    'external_id', 'AXB-99-002',
    'format', 'Y1',
    'construct_code', 'S1.INFO.99',
    'cognitive', 'bilish',
    'difficulty', 2,
    'stem_md', 'Invalid construct fixture',
    'options', jsonb_build_array(
      jsonb_build_object('content_md', 'A'),
      jsonb_build_object('content_md', 'B'),
      jsonb_build_object('content_md', 'C'),
      jsonb_build_object('content_md', 'D')
    ),
    'correct_index', 0,
    'explanation_md', 'Fixture explanation'
  ));

  v_result := public.import_question_bank_batch(v_actor, v_payload);
  if (v_result->>'rejected')::int <> 1 then
    raise exception 'invalid construct must be rejected: %', v_result;
  end if;

  if exists (
    select 1 from public.questions
     where source_reference = 'm01-professional-bank:AXB-99-002'
  ) then
    raise exception 'rejected item leaked partial question';
  end if;
end
$$;

do $$
declare
  v_non_admin uuid := '71000000-0000-4000-8000-000000000002';
  v_failed boolean := false;
begin
  insert into auth.users (id, email)
  values (v_non_admin, 't043-user@example.test');

  begin
    perform public.import_question_bank_batch(
      v_non_admin,
      jsonb_build_array(jsonb_build_object('external_id', 'AXB-99-003'))
    );
  exception when others then
    v_failed := sqlerrm = 'admin_actor_required';
  end;

  if not v_failed then
    raise exception 'non-admin actor must be denied';
  end if;
end
$$;

do $$
begin
  if has_function_privilege('authenticated',
    'public.import_question_bank_batch(uuid,jsonb)', 'EXECUTE') then
    raise exception 'authenticated role must not execute bank import RPC';
  end if;

  if not has_function_privilege('service_role',
    'public.import_question_bank_batch(uuid,jsonb)', 'EXECUTE') then
    raise exception 'service_role must execute bank import RPC';
  end if;
end
$$;

rollback;
