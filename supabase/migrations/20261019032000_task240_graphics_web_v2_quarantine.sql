-- TASK-240: quarantine the accidentally published Graphics/Web V2 review bank.
-- Ordered after the TASK-213/TASK-214 GV2 review-bank migrations.
--
-- The 380 GV2 rows were authored and migrated as review-only content. Their
-- source_reference still says "expert review required" / "original review",
-- every author_id is NULL, and none has a question_editorial_checks record.
-- They were nevertheless mass-promoted to published in production. Preserve
-- attempt history by archiving the immutable originals, create fresh review
-- revisions with remapped option/key UUIDs, and fail closed on future publish.

begin;

create table if not exists public.question_quality_quarantines (
  source_question_id uuid primary key references public.questions(id) on delete restrict,
  replacement_question_id uuid not null unique references public.questions(id) on delete restrict,
  reason text not null,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.question_quality_quarantines enable row level security;
revoke all on table public.question_quality_quarantines from public, anon, authenticated;

create table if not exists public.question_quality_published_revisions (
  question_id uuid primary key references public.questions(id) on delete restrict,
  content_fingerprint text not null,
  release_scope text not null,
  first_published_at timestamptz not null default now()
);

alter table public.question_quality_published_revisions enable row level security;
revoke all on table public.question_quality_published_revisions from public, anon, authenticated;

do $task240_preflight$
declare
  v_published integer;
  v_review integer;
  v_invalid integer;
  v_checked integer;
begin
  select count(*) into v_published
  from public.questions q
  where q.status='published'::public.content_status
    and q.group_code='S5.WEB'
    and q.is_generated
    and (
      q.source_reference like 'GV2:%'
      or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
    );
  select count(*) into v_review
  from public.questions q
  where q.status='review'::public.content_status
    and q.group_code='S5.WEB'
    and q.is_generated
    and (
      q.source_reference like 'GV2:%'
      or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
    );

  -- Production has the 380-row drift; a fresh migration chain correctly has
  -- the same 380 rows in review. Mixed/partial states are never guessed at.
  if not ((v_published=380 and v_review=0) or (v_published=0 and v_review=380)) then
    raise exception 'TASK-240 unexpected GV2 state published=% review=%',v_published,v_review;
  end if;

  select count(*) into v_checked
  from public.questions q
  join public.question_editorial_checks e on e.question_id=q.id
  where q.status in ('published'::public.content_status,'review'::public.content_status)
    and q.group_code='S5.WEB'
    and q.is_generated
    and (
      q.source_reference like 'GV2:%'
      or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
    );
  if v_checked<>0 then
    raise exception 'TASK-240 refuses to quarantine % GV2 rows with editorial records',v_checked;
  end if;

  with candidates as (
    select q.*,k.payload,k.explanation_md
    from public.questions q
    left join public.question_keys k on k.question_id=q.id
    where q.status in ('published'::public.content_status,'review'::public.content_status)
      and q.group_code='S5.WEB'
      and q.is_generated
      and (
        q.source_reference like 'GV2:%'
        or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
      )
  ), checks as (
    select q.id,
      q.payload is not null
      and length(btrim(coalesce(q.explanation_md,'')))>10
      and q.author_id is null
      and q.source_lesson_id is not null
      and exists (
        select 1 from public.lesson_constructs lc
        where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
      )
      and case q.format
        when 'Y1'::public.question_format then
          (select count(*) between 3 and 5 and bool_and(btrim(o.side::text)='a')
             and count(distinct btrim(o.content_md))=count(*)
           from public.question_options o where o.question_id=q.id)
          and exists (
            select 1 from public.question_options o
            where o.question_id=q.id and btrim(o.side::text)='a'
              and o.id::text=q.payload->>'correct_option_id'
          )
        when 'Y2'::public.question_format then
          jsonb_typeof(q.payload->'pairs')='object'
          and (select count(*) from public.question_options o
               where o.question_id=q.id and btrim(o.side::text)='a') between 3 and 6
          and (select count(*) from public.question_options o
               where o.question_id=q.id and btrim(o.side::text)='b') between
              (select count(*) from public.question_options o
               where o.question_id=q.id and btrim(o.side::text)='a') and
              (select count(*)+2 from public.question_options o
               where o.question_id=q.id and btrim(o.side::text)='a')
          and (select count(*) from jsonb_each_text(q.payload->'pairs'))=
              (select count(*) from public.question_options o
               where o.question_id=q.id and btrim(o.side::text)='a')
          and (select count(distinct p.value) from jsonb_each_text(q.payload->'pairs') p)=
              (select count(*) from jsonb_each_text(q.payload->'pairs'))
          and not exists (
            select 1 from jsonb_each_text(q.payload->'pairs') p
            where not exists (
              select 1 from public.question_options o
              where o.question_id=q.id and btrim(o.side::text)='a' and o.id::text=p.key
            ) or not exists (
              select 1 from public.question_options o
              where o.question_id=q.id and btrim(o.side::text)='b' and o.id::text=p.value
            )
          )
        when 'Y3'::public.question_format then
          jsonb_typeof(q.payload->'order')='array'
          and jsonb_array_length(q.payload->'order') between 3 and 8
          and jsonb_array_length(q.payload->'order')=(
            select count(*) from public.question_options o where o.question_id=q.id
          )
          and (select count(distinct x.value) from jsonb_array_elements_text(q.payload->'order') x)=
              jsonb_array_length(q.payload->'order')
          and not exists (
            select 1 from public.question_options o
            where o.question_id=q.id and btrim(o.side::text)<>'a'
          )
          and not exists (
            select 1 from jsonb_array_elements_text(q.payload->'order') x
            where not exists (
              select 1 from public.question_options o
              where o.question_id=q.id and o.id::text=x.value
            )
          )
        else false
      end as valid
    from candidates q
  )
  select count(*) into v_invalid from checks where not valid;
  if v_invalid<>0 then
    raise exception 'TASK-240 found % structurally invalid GV2 rows; aborting',v_invalid;
  end if;

  if exists (
    select 1
    from public.questions q
    where q.status in ('published'::public.content_status,'review'::public.content_status)
      and q.group_code='S5.WEB'
      and q.is_generated
      and (
        q.source_reference like 'GV2:%'
        or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
      )
    group by q.format
    having (q.format='Y1'::public.question_format and count(*)<>280)
        or (q.format='Y2'::public.question_format and count(*)<>50)
        or (q.format='Y3'::public.question_format and count(*)<>50)
  ) then
    raise exception 'TASK-240 GV2 format distribution drifted from 280/50/50';
  end if;
end
$task240_preflight$;

create temporary table task240_question_map (
  source_question_id uuid primary key,
  replacement_question_id uuid not null unique
) on commit drop;

insert into task240_question_map(source_question_id,replacement_question_id)
select q.id,gen_random_uuid()
from public.questions q
where q.status='published'::public.content_status
  and q.group_code='S5.WEB'
  and q.is_generated
  and (
    q.source_reference like 'GV2:%'
    or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
  );

create temporary table task240_option_map (
  source_option_id uuid primary key,
  replacement_option_id uuid not null unique,
  source_question_id uuid not null,
  replacement_question_id uuid not null
) on commit drop;

insert into task240_option_map(
  source_option_id,replacement_option_id,source_question_id,replacement_question_id
)
select o.id,gen_random_uuid(),o.question_id,m.replacement_question_id
from public.question_options o
join task240_question_map m on m.source_question_id=o.question_id;

insert into public.questions(
  id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
  assets,is_generated,status,author_id,created_at,updated_at,source_reference,
  source_lesson_id
)
select
  m.replacement_question_id,q.subject_id,q.construct_id,q.group_code,q.format,
  q.cognitive,q.difficulty,q.stem_md,q.assets,q.is_generated,
  'review'::public.content_status,q.author_id,now(),now(),
  q.source_reference||' | TASK-240 review revision of '||q.id::text,
  q.source_lesson_id
from public.questions q
join task240_question_map m on m.source_question_id=q.id;

insert into public.question_options(id,question_id,side,order_idx,content_md)
select om.replacement_option_id,om.replacement_question_id,o.side,o.order_idx,o.content_md
from public.question_options o
join task240_option_map om on om.source_option_id=o.id;

insert into public.question_keys(question_id,payload,explanation_md,updated_at)
select
  qm.replacement_question_id,
  case q.format
    when 'Y1'::public.question_format then
      jsonb_set(
        k.payload,
        '{correct_option_id}',
        to_jsonb((select om.replacement_option_id::text
                  from task240_option_map om
                  where om.source_option_id=(k.payload->>'correct_option_id')::uuid)),
        false
      )
    when 'Y2'::public.question_format then
      jsonb_set(
        k.payload,
        '{pairs}',
        (select jsonb_object_agg(lm.replacement_option_id::text,rm.replacement_option_id::text)
         from jsonb_each_text(k.payload->'pairs') p
         join task240_option_map lm on lm.source_option_id=p.key::uuid
         join task240_option_map rm on rm.source_option_id=p.value::uuid),
        false
      )
    when 'Y3'::public.question_format then
      jsonb_set(
        k.payload,
        '{order}',
        (select jsonb_agg(om.replacement_option_id::text order by x.ord)
         from jsonb_array_elements_text(k.payload->'order') with ordinality x(value,ord)
         join task240_option_map om on om.source_option_id=x.value::uuid),
        false
      )
  end,
  k.explanation_md,
  now()
from public.questions q
join task240_question_map qm on qm.source_question_id=q.id
join public.question_keys k on k.question_id=q.id;

insert into public.question_quality_quarantines(
  source_question_id,replacement_question_id,reason,evidence
)
select
  m.source_question_id,
  m.replacement_question_id,
  'Published without the required independent Graphics/Web V2 editorial review',
  jsonb_build_object(
    'task','TASK-240',
    'source_status','published',
    'replacement_status','review',
    'source_fingerprint',public.professional_question_fingerprint(m.source_question_id),
    'editorial_check_count',0,
    'quarantined_at',now()
  )
from task240_question_map m;

update public.questions q
set status='archived'::public.content_status,updated_at=now()
from task240_question_map m
where q.id=m.source_question_id
  and q.status='published'::public.content_status;

create or replace function public.guard_graphics_web_v2_publication()
returns trigger
language plpgsql
security definer
set search_path=''
as $function$
begin
  if new.status='published'::public.content_status
     and (tg_op='INSERT' or (tg_op='UPDATE' and old.status is distinct from 'published'::public.content_status))
     and new.group_code='S5.WEB'
     and (
       new.source_reference like 'GV2:%'
       or new.source_reference like 'Grafika va veb-texnologiyalar V2,%'
     )
  then
    if tg_op='INSERT' then
      raise exception using errcode='23514',
        message='GV2_PUBLICATION_BLOCKED: create the complete review revision before publication';
    end if;

    if (to_jsonb(new)-'status'-'updated_at') <>
       (to_jsonb(old)-'status'-'updated_at') then
      raise exception using errcode='23514',
        message='GV2_PUBLICATION_BLOCKED: edit and publish must be separate operations';
    end if;

    if new.source_lesson_id is null or not exists (
      select 1
      from public.lessons l
      join public.lesson_constructs lc on lc.lesson_id=l.id
      where l.id=new.source_lesson_id
        and l.status='published'::public.content_status
        and lc.construct_id=new.construct_id
    ) then
      raise exception using errcode='23514',
        message='GV2_PUBLICATION_BLOCKED: published source lesson and construct link required';
    end if;

    if not exists (
      select 1
      from public.question_editorial_checks e
      where e.question_id=new.id
        and e.answer_verified
        and e.reference_verified
        and e.wording_verified
        and e.original_authorship_verified
        and length(btrim(e.reviewer_notes))>=20
        and e.content_fingerprint=public.professional_question_fingerprint(new.id)
    ) then
      raise exception using errcode='23514',
        message='GV2_PUBLICATION_BLOCKED: current expert editorial evidence required';
    end if;
  end if;
  return new;
end
$function$;

revoke all on function public.guard_graphics_web_v2_publication() from public,anon,authenticated;

drop trigger if exists trg_graphics_web_v2_publication on public.questions;
create trigger trg_graphics_web_v2_publication
before insert or update of status,source_reference,source_lesson_id,group_code,construct_id on public.questions
for each row execute function public.guard_graphics_web_v2_publication();

create or replace function public.guard_question_quality_published_revision()
returns trigger
language plpgsql
security definer
set search_path=''
as $function$
declare
  v_question_id uuid;
begin
  if tg_table_name='questions' then
    v_question_id:=old.id;
  else
    v_question_id:=case when tg_op='DELETE' then old.question_id else new.question_id end;
  end if;

  if not exists (
    select 1 from public.question_quality_published_revisions r
    where r.question_id=v_question_id
  ) then
    if tg_op='DELETE' then return old; else return new; end if;
  end if;

  if tg_table_name='questions' and tg_op='UPDATE'
     and old.status='published'::public.content_status
     and new.status in ('published'::public.content_status,'archived'::public.content_status)
     and (to_jsonb(old)-'status'-'updated_at')=(to_jsonb(new)-'status'-'updated_at')
  then
    return new;
  end if;

  raise exception using errcode='23514',
    message='QUESTION_QUALITY_PUBLISHED_REVISION_IMMUTABLE: create a new question revision';
end
$function$;

create or replace function public.register_question_quality_published_revision()
returns trigger
language plpgsql
security definer
set search_path=''
as $function$
begin
  if new.status='published'::public.content_status
     and new.group_code='S5.WEB'
     and (
       new.source_reference like 'GV2:%'
       or new.source_reference like 'Grafika va veb-texnologiyalar V2,%'
     )
  then
    insert into public.question_quality_published_revisions(
      question_id,content_fingerprint,release_scope
    ) values (
      new.id,public.professional_question_fingerprint(new.id),'TASK-240/GV2'
    ) on conflict (question_id) do nothing;
  end if;
  return new;
end
$function$;

revoke all on function public.guard_question_quality_published_revision() from public,anon,authenticated;
revoke all on function public.register_question_quality_published_revision() from public,anon,authenticated;

drop trigger if exists trg_question_quality_question_lock on public.questions;
create trigger trg_question_quality_question_lock
before update or delete on public.questions
for each row execute function public.guard_question_quality_published_revision();

drop trigger if exists trg_question_quality_options_lock on public.question_options;
create trigger trg_question_quality_options_lock
before insert or update or delete on public.question_options
for each row execute function public.guard_question_quality_published_revision();

drop trigger if exists trg_question_quality_keys_lock on public.question_keys;
create trigger trg_question_quality_keys_lock
before insert or update or delete on public.question_keys
for each row execute function public.guard_question_quality_published_revision();

drop trigger if exists trg_question_quality_publication_snapshot on public.questions;
create trigger trg_question_quality_publication_snapshot
after insert or update of status,group_code,source_reference on public.questions
for each row execute function public.register_question_quality_published_revision();

do $task240_postflight$
declare
  v_archived integer;
  v_review integer;
  v_published integer;
  v_quarantined integer;
begin
  select count(*) into v_archived
  from public.question_quality_quarantines x
  join public.questions q on q.id=x.source_question_id
  where q.status='archived'::public.content_status
    and x.reason='Published without the required independent Graphics/Web V2 editorial review';

  select count(*) into v_review
  from public.questions q
  join public.question_keys k on k.question_id=q.id
  where q.status='review'::public.content_status
    and q.group_code='S5.WEB'
    and q.is_generated
    and (
      q.source_reference like 'GV2:%'
      or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
    );

  select count(*) into v_quarantined
  from public.question_quality_quarantines x
  where x.reason='Published without the required independent Graphics/Web V2 editorial review';

  select count(*) into v_published
  from public.questions q
  where q.status='published'::public.content_status
    and q.group_code='S5.WEB'
    and q.is_generated
    and (
      q.source_reference like 'GV2:%'
      or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
    );

  if v_review<>380 or v_published<>0
     or v_quarantined not in (0,380)
     or v_archived<>v_quarantined then
    raise exception 'TASK-240 postflight mismatch archived=% review=% still_published=% quarantined=%',
      v_archived,v_review,v_published,v_quarantined;
  end if;

  -- The production-drift path had exactly 53 pre-existing published S5 rows.
  -- A fresh chain can legitimately have a different historical baseline; its
  -- release invariant is the blueprint-feasibility check immediately below.
  if v_quarantined=380 and (select count(*) from public.questions
      where status='published'::public.content_status and group_code='S5.WEB')<>53 then
    raise exception 'TASK-240 expected 53 remaining published S5.WEB questions';
  end if;

  -- Only the production-drift path is expected to retain a learner-ready S5
  -- baseline. A fresh chain intentionally keeps the whole GV2 bank in review.
  if v_quarantined=380 and exists (
    with bp as (
      select * from public.blueprints where is_active order by version desc limit 1
    ), pool as (
      select q.cognitive,count(distinct q.id) available
      from public.questions q
      join public.constructs c on c.id=q.construct_id
      where q.status='published'::public.content_status
        and q.group_code='S5.WEB'
        and c.group_code=q.group_code
        and c.is_active
        and exists(select 1 from public.question_keys k where k.question_id=q.id)
      group by q.cognitive
    ), required as (
      select 'bilish'::public.cognitive_level cognitive,bq.n_bilish n
      from public.blueprint_quotas bq join bp on bp.id=bq.blueprint_id
      where bq.group_code='S5.WEB'
      union all
      select 'qollash'::public.cognitive_level,bq.n_qollash
      from public.blueprint_quotas bq join bp on bp.id=bq.blueprint_id
      where bq.group_code='S5.WEB'
      union all
      select 'mulohaza'::public.cognitive_level,bq.n_mulohaza
      from public.blueprint_quotas bq join bp on bp.id=bq.blueprint_id
      where bq.group_code='S5.WEB'
    )
    select 1 from required r left join pool p using(cognitive)
    where r.n>coalesce(p.available,0)
  ) then
    raise exception 'TASK-240 quarantine would make the active S5.WEB blueprint infeasible';
  end if;
end
$task240_postflight$;

commit;
