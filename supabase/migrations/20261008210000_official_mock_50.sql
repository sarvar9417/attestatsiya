-- TASK-045: official 2026 full mock assembler.
--
-- Contract:
--   * active blueprint is authoritative;
--   * exact quota by group_code × cognitive level;
--   * exactly blueprint.total_questions (2026: 50);
--   * duration from blueprint.duration_min (2026: 120 min);
--   * only published, keyed, active-taxonomy questions;
--   * deterministic feasibility check before session creation;
--   * unseen / low-exposure / oldest-seen preference;
--   * no answer key material in returned payload;
--   * selection evidence snapshotted in exams.selection_meta.

begin;

create or replace function public.generate_official_mock()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_bp public.blueprints%rowtype;
  v_exam uuid;
  v_ids uuid[] := '{}'::uuid[];
  v_pick uuid[] := '{}'::uuid[];
  v_required int;
  v_available int;
  v_pool_count int := 0;
  v_unseen_pool_count int := 0;
  v_unseen_selected int := 0;
  v_quota_count int := 0;
  v_quota_coverage jsonb := '[]'::jsonb;
  v_meta jsonb;
  v_quota record;
  v_cognitive public.cognitive_level;
  v_target int;
  v_duration_sec int;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  select *
    into v_bp
    from public.blueprints
   where is_active
   order by version desc
   limit 1;

  if not found then
    raise exception 'blueprint_topilmadi';
  end if;

  v_target := v_bp.total_questions;
  v_duration_sec := v_bp.duration_min * 60;

  if v_target is null or v_target <= 0
     or v_duration_sec is null or v_duration_sec <= 0 then
    raise exception 'official_mock_blueprint_invalid';
  end if;

  select count(*)
    into v_quota_count
    from public.blueprint_quotas
   where blueprint_id = v_bp.id;

  if v_quota_count = 0 then
    raise exception 'official_mock_blueprint_invalid: no_quotas';
  end if;

  if (
    select coalesce(sum(n_bilish + n_qollash + n_mulohaza), 0)
      from public.blueprint_quotas
     where blueprint_id = v_bp.id
  ) <> v_target then
    raise exception 'official_mock_blueprint_invalid: quota_total';
  end if;

  -- Feasibility is checked completely before an exam row is inserted.
  for v_quota in
    select
      bq.group_code,
      bq.n_bilish,
      bq.n_qollash,
      bq.n_mulohaza,
      bq.order_idx
    from public.blueprint_quotas bq
    where bq.blueprint_id = v_bp.id
    order by bq.order_idx, bq.group_code
  loop
    foreach v_cognitive in array array[
      'bilish'::public.cognitive_level,
      'qollash'::public.cognitive_level,
      'mulohaza'::public.cognitive_level
    ]
    loop
      v_required := case v_cognitive
        when 'bilish'::public.cognitive_level then v_quota.n_bilish
        when 'qollash'::public.cognitive_level then v_quota.n_qollash
        else v_quota.n_mulohaza
      end;

      if coalesce(v_required, 0) <= 0 then
        continue;
      end if;

      select count(distinct q.id)
        into v_available
        from public.questions q
        join public.constructs c on c.id = q.construct_id
       where q.status = 'published'::public.content_status
         and q.group_code = v_quota.group_code
         and c.group_code = v_quota.group_code
         and c.is_active
         and q.cognitive = v_cognitive
         and exists (
           select 1
             from public.question_keys qk
            where qk.question_id = q.id
         );

      if v_available < v_required then
        raise exception
          'official_mock_pool_insufficient: group=% cognitive=% required=% available=%',
          v_quota.group_code,
          v_cognitive,
          v_required,
          v_available;
      end if;
    end loop;
  end loop;

  select count(distinct q.id)
    into v_pool_count
    from public.questions q
    join public.constructs c on c.id = q.construct_id
    join public.blueprint_quotas bq
      on bq.blueprint_id = v_bp.id
     and bq.group_code = q.group_code
   where q.status = 'published'::public.content_status
     and c.is_active
     and c.group_code = q.group_code
     and exists (
       select 1
         from public.question_keys qk
        where qk.question_id = q.id
     );

  select count(distinct q.id)
    into v_unseen_pool_count
    from public.questions q
    join public.constructs c on c.id = q.construct_id
    join public.blueprint_quotas bq
      on bq.blueprint_id = v_bp.id
     and bq.group_code = q.group_code
   where q.status = 'published'::public.content_status
     and c.is_active
     and c.group_code = q.group_code
     and exists (
       select 1
         from public.question_keys qk
        where qk.question_id = q.id
     )
     and not exists (
       select 1
         from public.exam_items ei
         join public.exams e on e.id = ei.exam_id
        where e.user_id = v_user
          and ei.question_id = q.id
     );

  -- Select exact cells in blueprint order.
  for v_quota in
    select
      bq.group_code,
      bq.n_bilish,
      bq.n_qollash,
      bq.n_mulohaza,
      bq.order_idx
    from public.blueprint_quotas bq
    where bq.blueprint_id = v_bp.id
    order by bq.order_idx, bq.group_code
  loop
    foreach v_cognitive in array array[
      'bilish'::public.cognitive_level,
      'qollash'::public.cognitive_level,
      'mulohaza'::public.cognitive_level
    ]
    loop
      v_required := case v_cognitive
        when 'bilish'::public.cognitive_level then v_quota.n_bilish
        when 'qollash'::public.cognitive_level then v_quota.n_qollash
        else v_quota.n_mulohaza
      end;

      if coalesce(v_required, 0) <= 0 then
        continue;
      end if;

      select coalesce(array_agg(id), '{}'::uuid[])
        into v_pick
        from (
          select q.id
            from public.questions q
            join public.constructs c on c.id = q.construct_id
           where q.status = 'published'::public.content_status
             and q.group_code = v_quota.group_code
             and c.group_code = v_quota.group_code
             and c.is_active
             and q.cognitive = v_cognitive
             and exists (
               select 1
                 from public.question_keys qk
                where qk.question_id = q.id
             )
             and not (q.id = any(v_ids))
           order by
             (
               select count(*)
                 from public.exam_items ei
                 join public.exams e on e.id = ei.exam_id
                where e.user_id = v_user
                  and ei.question_id = q.id
             ) asc,
             (
               select max(e.started_at)
                 from public.exam_items ei
                 join public.exams e on e.id = ei.exam_id
                where e.user_id = v_user
                  and ei.question_id = q.id
             ) asc nulls first,
             q.id
           limit v_required
        ) ranked;

      if cardinality(v_pick) <> v_required then
        raise exception
          'official_mock_pool_insufficient: group=% cognitive=% required=% selected=%',
          v_quota.group_code,
          v_cognitive,
          v_required,
          cardinality(v_pick);
      end if;

      v_ids := v_ids || v_pick;
    end loop;
  end loop;

  if cardinality(v_ids) <> v_target then
    raise exception
      'official_mock_blueprint_invalid: target=% selected=%',
      v_target,
      cardinality(v_ids);
  end if;

  if cardinality(v_ids) <> (
    select count(distinct x)
      from unnest(v_ids) picked(x)
  ) then
    raise exception 'official_mock_blueprint_invalid: duplicate_selection';
  end if;

  select count(*)
    into v_unseen_selected
    from unnest(v_ids) picked(question_id)
   where not exists (
     select 1
       from public.exam_items ei
       join public.exams e on e.id = ei.exam_id
      where e.user_id = v_user
        and ei.question_id = picked.question_id
   );

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'group_code', bq.group_code,
        'order_idx', bq.order_idx,
        'required', jsonb_build_object(
          'bilish', bq.n_bilish,
          'qollash', bq.n_qollash,
          'mulohaza', bq.n_mulohaza
        ),
        'selected', jsonb_build_object(
          'bilish', (
            select count(*)
              from public.questions q
             where q.id = any(v_ids)
               and q.group_code = bq.group_code
               and q.cognitive = 'bilish'::public.cognitive_level
          ),
          'qollash', (
            select count(*)
              from public.questions q
             where q.id = any(v_ids)
               and q.group_code = bq.group_code
               and q.cognitive = 'qollash'::public.cognitive_level
          ),
          'mulohaza', (
            select count(*)
              from public.questions q
             where q.id = any(v_ids)
               and q.group_code = bq.group_code
               and q.cognitive = 'mulohaza'::public.cognitive_level
          )
        )
      )
      order by bq.order_idx, bq.group_code
    ),
    '[]'::jsonb
  )
  into v_quota_coverage
  from public.blueprint_quotas bq
  where bq.blueprint_id = v_bp.id;

  v_meta := jsonb_build_object(
    'selector_version', 'official-mock-v1',
    'blueprint_id', v_bp.id,
    'blueprint_version', v_bp.version,
    'target_count', v_target,
    'selected_count', cardinality(v_ids),
    'duration_sec', v_duration_sec,
    'quota_count', v_quota_count,
    'eligible_pool_count', v_pool_count,
    'unseen_pool_count_before_selection', v_unseen_pool_count,
    'unseen_selected_count', v_unseen_selected,
    'quota_coverage', v_quota_coverage,
    'cognitive_totals', jsonb_build_object(
      'bilish', (
        select count(*) from public.questions q
         where q.id = any(v_ids)
           and q.cognitive = 'bilish'::public.cognitive_level
      ),
      'qollash', (
        select count(*) from public.questions q
         where q.id = any(v_ids)
           and q.cognitive = 'qollash'::public.cognitive_level
      ),
      'mulohaza', (
        select count(*) from public.questions q
         where q.id = any(v_ids)
           and q.cognitive = 'mulohaza'::public.cognitive_level
      )
    ),
    'rules', jsonb_build_array(
      'active_blueprint_exact_quota',
      'published_with_key_only',
      'active_taxonomy_match_required',
      'unseen_then_low_exposure',
      'deterministic_feasibility_before_session',
      'insufficient_pool_no_session',
      'server_authoritative_120_minute_timer'
    )
  );

  insert into public.exams (
    user_id,
    kind,
    blueprint_id,
    duration_sec,
    selection_meta
  )
  values (
    v_user,
    'mock'::public.exam_kind,
    v_bp.id,
    v_duration_sec,
    v_meta
  )
  returning id into v_exam;

  perform public.attach_questions(v_exam, v_ids);

  update public.exam_items ei
     set option_order = (
       select array_agg(o.id order by o.side nulls first, random())
         from public.question_options o
        where o.question_id = ei.question_id
     )
   where ei.exam_id = v_exam;

  return jsonb_build_object(
    'exam_id', v_exam,
    'kind', 'mock',
    'duration_sec', v_duration_sec,
    'started_at', now(),
    'items', public.exam_payload(v_exam),
    'selection_meta', v_meta
  );
end
$$;

revoke all on function public.generate_official_mock() from public;
grant execute on function public.generate_official_mock() to authenticated;

commit;
