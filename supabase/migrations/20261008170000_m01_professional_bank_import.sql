-- TASK-043: secure server-side import path for the private M01 professional bank.
--
-- The 570-item bank itself MUST NOT be committed to the public repository.
-- Admin backend sends validated batches over the service-role connection.
-- Imported items are always staged as REVIEW, never auto-published.

begin;

create or replace function public.import_question_bank_batch(
  p_actor_id uuid,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item jsonb;
  v_construct record;
  v_question_id uuid;
  v_source_reference text;
  v_option_ids uuid[];
  v_option_id uuid;
  v_correct_index int;
  v_inserted int := 0;
  v_skipped int := 0;
  v_rejected int := 0;
  v_errors jsonb := '[]'::jsonb;
  v_external_id text;
  v_options jsonb;
  v_option jsonb;
  v_index int;
begin
  if p_actor_id is null or not exists (
    select 1
      from public.profiles p
     where p.id = p_actor_id
       and p.role = 'admin'::public.user_role
       and not p.is_blocked
  ) then
    raise exception 'admin_actor_required';
  end if;

  if jsonb_typeof(p_items) <> 'array' then
    raise exception 'items_must_be_array';
  end if;

  if jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 100 then
    raise exception 'batch_size_out_of_range';
  end if;

  -- Serialize content-bank imports so source_reference idempotency is race-safe.
  perform pg_advisory_xact_lock(hashtext('import_question_bank_batch'));

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    begin
      v_external_id := nullif(trim(v_item->>'external_id'), '');
      if v_external_id is null then
        raise exception 'external_id_required';
      end if;

      if coalesce(v_item->>'format', 'Y1') <> 'Y1' then
        raise exception 'only_y1_supported';
      end if;

      v_options := v_item->'options';
      if jsonb_typeof(v_options) <> 'array' or jsonb_array_length(v_options) <> 4 then
        raise exception 'exactly_four_options_required';
      end if;

      v_correct_index := (v_item->>'correct_index')::int;
      if v_correct_index < 0 or v_correct_index > 3 then
        raise exception 'correct_index_out_of_range';
      end if;

      select c.id, c.group_code
        into v_construct
        from public.constructs c
       where c.code = v_item->>'construct_code'
       limit 1;

      if v_construct.id is null then
        raise exception 'construct_not_found';
      end if;

      if (v_item->>'cognitive') not in ('bilish', 'qollash', 'mulohaza') then
        raise exception 'invalid_cognitive';
      end if;

      if (v_item->>'difficulty')::int not between 1 and 5 then
        raise exception 'invalid_difficulty';
      end if;

      if nullif(trim(v_item->>'stem_md'), '') is null then
        raise exception 'stem_required';
      end if;

      if nullif(trim(v_item->>'explanation_md'), '') is null then
        raise exception 'explanation_required';
      end if;

      v_source_reference := 'm01-professional-bank:' || v_external_id;

      if exists (
        select 1
          from public.questions q
         where q.source_reference = v_source_reference
      ) then
        v_skipped := v_skipped + 1;
        continue;
      end if;

      insert into public.questions (
        subject_id,
        construct_id,
        group_code,
        format,
        cognitive,
        difficulty,
        stem_md,
        assets,
        is_generated,
        status,
        author_id,
        source_reference,
        source_lesson_id
      )
      values (
        (select s.id from public.subjects s where s.code = 'informatika' limit 1),
        v_construct.id,
        v_construct.group_code,
        'Y1'::public.question_format,
        (v_item->>'cognitive')::public.cognitive_level,
        (v_item->>'difficulty')::int,
        v_item->>'stem_md',
        coalesce(v_item->'assets', '[]'::jsonb),
        false,
        'review'::public.content_status,
        p_actor_id,
        v_source_reference,
        case
          when nullif(v_item->>'source_lesson_id', '') is null then null
          else (v_item->>'source_lesson_id')::uuid
        end
      )
      returning id into v_question_id;

      v_option_ids := array[]::uuid[];
      v_index := 0;
      for v_option in select value from jsonb_array_elements(v_options)
      loop
        if nullif(trim(v_option->>'content_md'), '') is null then
          raise exception 'option_content_required';
        end if;

        insert into public.question_options (
          question_id,
          side,
          order_idx,
          content_md
        )
        values (
          v_question_id,
          'a',
          v_index,
          v_option->>'content_md'
        )
        returning id into v_option_id;

        v_option_ids := array_append(v_option_ids, v_option_id);
        v_index := v_index + 1;
      end loop;

      insert into public.question_keys (
        question_id,
        payload,
        explanation_md
      )
      values (
        v_question_id,
        jsonb_build_object('correct_option_id', v_option_ids[v_correct_index + 1]),
        v_item->>'explanation_md'
      );

      insert into public.audit_log (
        actor_id,
        action,
        entity,
        entity_id,
        diff
      )
      values (
        p_actor_id,
        'question_bank_import',
        'questions',
        v_question_id,
        jsonb_build_object(
          'external_id', v_external_id,
          'construct_code', v_item->>'construct_code',
          'source_reference', v_source_reference,
          'source_locator', v_item->>'source_locator',
          'bank_pdf_page', v_item->'bank_pdf_page'
        )
      );

      v_inserted := v_inserted + 1;
    exception
      when others then
        v_rejected := v_rejected + 1;
        v_errors := v_errors || jsonb_build_array(
          jsonb_build_object(
            'external_id', coalesce(v_external_id, v_item->>'external_id'),
            'error', sqlerrm
          )
        );
    end;
  end loop;

  return jsonb_build_object(
    'inserted', v_inserted,
    'skipped', v_skipped,
    'rejected', v_rejected,
    'errors', v_errors
  );
end;
$$;

revoke all on function public.import_question_bank_batch(uuid, jsonb) from public;
revoke all on function public.import_question_bank_batch(uuid, jsonb) from anon;
revoke all on function public.import_question_bank_batch(uuid, jsonb) from authenticated;
grant execute on function public.import_question_bank_batch(uuid, jsonb) to service_role;

commit;
