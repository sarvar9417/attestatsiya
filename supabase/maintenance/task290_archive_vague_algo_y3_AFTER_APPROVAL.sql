-- TASK-290 / 2026-10-19: OPTIONAL MANUAL-ONLY MAINTENANCE.
-- Intentionally outside supabase/migrations/; merging does not execute this.
-- FAIL-CLOSED: Only retire originals after approved, published replacement Y3
-- items pass key/mapping/exam-history/blueprint-reserve checks.
begin;

do $task290$
declare
 old_id uuid; oldq public.questions%rowtype; new_id uuid;
 candidate_count integer; option_count integer; distinct_options integer;
 correct_order_count integer; distinct_order_count integer;
 quota_count integer; eligible_after integer;
begin
 for old_id in select unnest(array[
 'fbf809c1-37eb-4663-95e5-a454f181ff95'::uuid,
 'a23723a9-8e1a-4080-82ab-a259c4722d26'::uuid,
 'b8b64caa-5fb8-4326-9dea-8107365c79c7'::uuid
 ]) loop

  select * into strict oldq
  from public.questions where id=old_id for update;

  if oldq.status='archived'::public.content_status then
    continue;
  end if;

  if oldq.status<>'published'::public.content_status or
     oldq.group_code<>'S3.ALGO' or
     oldq.format<>'Y3'::public.question_format or
     oldq.cognitive<>'mulohaza'::public.cognitive_level
  then raise exception 'TASK290_ORIGINAL_STATUS_OR_SCOPE_WRONG %',old_id;end if;

  if exists(select 1 from public.exam_items where question_id=old_id)
  then raise exception 'TASK290_HISTORIC_EXAM_USE %',old_id;end if;

  select count(*),min(q.id::text)::uuid into candidate_count,new_id
  from public.questions q
  where q.source_reference like
    'expert-audit:20261019:algo-flow-review:'||old_id::text||'|%'
    and q.status='published'::public.content_status
    and q.group_code=oldq.group_code
    and q.format=oldq.format
    and q.cognitive=oldq.cognitive
    and q.construct_id=oldq.construct_id
    and q.source_lesson_id=oldq.source_lesson_id
    and exists (
      select 1 from public.lesson_constructs lc
      where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
    );

  if candidate_count<>1
  then raise exception 'TASK290_REPLACEMENT_NOT_APPROVED % count=%',old_id,candidate_count;end if;

  select count(*),count(distinct lower(btrim(o.content_md)))
  into option_count,distinct_options
  from public.question_options o where o.question_id=new_id;

  select count(*),count(distinct x.option_id) into correct_order_count,distinct_order_count
  from public.question_keys k
  cross join lateral jsonb_array_elements_text(k.payload->'order') x(option_id)
  join public.question_options o on o.id::text=x.option_id and o.question_id=k.question_id
  where k.question_id=new_id and o.side='a';

  if option_count<>4 or distinct_options<>4
    or correct_order_count<>4 or distinct_order_count<>4
    or not exists(select 1 from public.question_keys k where k.question_id=new_id and k.payload?'order')
  then raise exception 'TASK290_INVALID_Y3_REPLACEMENT %',new_id;end if;

  update public.questions set status='archived'::public.content_status,updated_at=now()
    where id=old_id and status='published'::public.content_status;

  select max(bq.n_mulohaza) into quota_count
  from public.blueprint_quotas bq
  join public.blueprints bp on bp.id=bq.blueprint_id
  where bp.is_active and bq.group_code='S3.ALGO';

  select count(*) into eligible_after
  from public.questions q
  join public.constructs c on c.id=q.construct_id
  where q.status='published'::public.content_status
    and q.group_code='S3.ALGO'
    and q.cognitive='mulohaza'::public.cognitive_level
    and c.is_active and c.group_code=q.group_code
    and exists(select 1 from public.question_keys k where k.question_id=q.id);

  if quota_count is null or quota_count<>1
    or eligible_after < greatest(20,5*quota_count)
  then raise exception 'TASK290_BLUEPRINT_CAPACITY_LOW quota=% eligible=%',quota_count,eligible_after;end if;
 end loop;
end
$task290$;

commit;
