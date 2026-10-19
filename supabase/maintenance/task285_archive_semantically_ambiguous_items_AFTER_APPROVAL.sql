-- TASK-285 (2026-10-19). OPTIONAL manual-only, never an active migration.
-- DO NOT RUN until each exact replacement has been independently approved
-- and PUBLISHED through its ordinary editorial release gate.
-- Fails atomically if historical exam usage appears or selection reserve shrinks.
begin;

do $task285$
declare
  v_original_id uuid;
  v_old public.questions%rowtype;
  v_new public.questions%rowtype;
  v_candidate_count int;
  v_quota int;
  v_eligible_after int;
  v_opt_count int;
  v_unique_left int;
  v_unique_right int;
  v_key_matches int;
begin
  for v_original_id in select unnest(array[
    '9fedf9a4-6ac2-44c7-b318-6fb2f8af6a57'::uuid, -- Excel: B3 contains salary AND formula
    '12eb6f56-f305-b7c7-e2ec-b0d68c0ac2e9'::uuid, -- Python: two results 4
    'b4dcdda7-1c0b-a57b-ce0f-f296fbd17a99'::uuid  -- Python: three results 2
  ]) loop
    select * into strict v_old
    from public.questions q where q.id=v_original_id for update;

    -- Already archived entries are safe on idempotent re-run.
    if v_old.status='archived'::public.content_status then continue; end if;

    if v_old.status<>'published'::public.content_status
       or (v_original_id='9fedf9a4-6ac2-44c7-b318-6fb2f8af6a57'::uuid
           and (v_old.group_code<>'S2.OFFICE' or
                v_old.cognitive<>'qollash'::public.cognitive_level or
                v_old.format<>'Y1'::public.question_format))
       or (v_original_id<>'9fedf9a4-6ac2-44c7-b318-6fb2f8af6a57'::uuid
           and (v_old.group_code<>'S4.CODE' or
                v_old.cognitive<>'mulohaza'::public.cognitive_level or
                v_old.format<>'Y2'::public.question_format))
    then raise exception 'TASK285_UNEXPECTED_ORIGINAL %',v_original_id; end if;

    if exists(select 1 from public.exam_items ei
              where ei.question_id=v_original_id)
    then raise exception 'TASK285_HISTORICAL_EXAM_USAGE %',v_original_id; end if;

    -- A precise new question in PUBLISHED state is mandatory.
    select count(*),min(q.id::text)::uuid
    into v_candidate_count,v_new.id
    from public.questions q
    where q.source_reference like
      'expert-audit:20261019:precision-review:'||v_original_id::text||'|%'
      and q.status='published'::public.content_status
      and q.group_code=v_old.group_code
      and q.cognitive=v_old.cognitive
      and q.format=v_old.format
      and q.construct_id=v_old.construct_id
      and q.source_lesson_id=v_old.source_lesson_id
      and exists(select 1 from public.lesson_constructs lc
        where lc.lesson_id=q.source_lesson_id
        and lc.construct_id=q.construct_id);
    if v_candidate_count<>1 then
      raise exception 'TASK285_APPROVED_REPLACEMENT_NOT_FOUND % count=%',
        v_original_id,v_candidate_count;
    end if;

    select * into strict v_new from public.questions where id=v_new.id;
    select count(*),
       count(distinct case when o.side='a' then lower(btrim(o.content_md)) end),
       count(distinct case when o.side='b' then lower(btrim(o.content_md)) end)
      into v_opt_count,v_unique_left,v_unique_right
    from public.question_options o where o.question_id=v_new.id;

    if v_old.format='Y1'::public.question_format then
      select count(*) into v_key_matches
      from public.question_keys k
      join public.question_options o on o.question_id=k.question_id
        and o.id::text=k.payload->>'correct_option_id'
      where k.question_id=v_new.id;
      if v_opt_count<>4 or v_unique_left<>4 or v_unique_right<>0
         or v_key_matches<>1
      then raise exception 'TASK285_INVALID_Y1_REPLACEMENT %',v_new.id; end if;
    else
      select count(*) into v_key_matches
      from public.question_keys k,
        lateral jsonb_each_text(k.payload->'pairs') pairs
      join public.question_options l on l.id::text=pairs.key
      join public.question_options r on r.id::text=pairs.value
      where k.question_id=v_new.id
        and l.question_id=v_new.id and r.question_id=v_new.id
        and l.side='a' and r.side='b';
      if v_opt_count<>8 or v_unique_left<>4 or v_unique_right<>4
         or v_key_matches<>4
         or exists (
             select 1 from public.question_options o
             where o.question_id=v_new.id and o.side='b'
               and btrim(o.content_md) !~ '^[0-9]+$'
         )
      then raise exception 'TASK285_AMBIGUOUS_Y2_REPLACEMENT %',v_new.id; end if;
    end if;

    update public.questions
    set status='archived'::public.content_status,updated_at=now()
    where id=v_original_id and status='published'::public.content_status;

    select case v_old.cognitive
      when 'bilish'::public.cognitive_level then max(bq.n_bilish)
      when 'qollash'::public.cognitive_level then max(bq.n_qollash)
      else max(bq.n_mulohaza)
      end into v_quota
    from public.blueprints bp
    join public.blueprint_quotas bq on bq.blueprint_id=bp.id
    where bp.is_active and bq.group_code=v_old.group_code;

    select count(*) into v_eligible_after
    from public.questions q
    join public.constructs c on c.id=q.construct_id
    where q.status='published'::public.content_status
      and q.group_code=v_old.group_code and q.cognitive=v_old.cognitive
      and c.is_active and c.group_code=q.group_code
      and exists(select 1 from public.question_keys k where k.question_id=q.id);

    if v_quota is null or v_quota<1
       or v_eligible_after < greatest(20, v_quota*5)
    then raise exception 'TASK285_BLUEPRINT_RESERVE_LOW % quota=% available=%',
          v_original_id,v_quota,v_eligible_after;
    end if;
  end loop;
end
$task285$;

commit;
