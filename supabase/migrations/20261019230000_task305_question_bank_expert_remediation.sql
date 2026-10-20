-- TASK-305: expert remediation for the current question bank.
--
-- Safety contract:
--   * published content is never edited in place;
--   * deterministic structural/classification repairs become new REVIEW rows;
--   * original published rows are archived, preserving exam history;
--   * no assistant-generated editorial approval is written;
--   * future API publications require a current independent checklist;
--   * current published rows are grandfathered but queued with truthful findings.

begin;

create table if not exists public.question_bank_revisions (
  source_question_id uuid primary key references public.questions(id) on delete restrict,
  revision_question_id uuid not null unique references public.questions(id) on delete restrict,
  revision_kind text not null,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint question_bank_revision_not_self
    check (source_question_id <> revision_question_id)
);

alter table public.question_bank_revisions enable row level security;
revoke all on table public.question_bank_revisions from public, anon, authenticated;
grant select on table public.question_bank_revisions to service_role;

create table if not exists public.question_quality_findings (
  question_id uuid not null references public.questions(id) on delete restrict,
  finding_code text not null,
  severity text not null check (severity in ('info','medium','high','critical')),
  details jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  primary key (question_id, finding_code)
);

create index if not exists question_quality_findings_open_idx
  on public.question_quality_findings(severity, finding_code, question_id)
  where resolved_at is null;

alter table public.question_quality_findings enable row level security;
revoke all on table public.question_quality_findings from public, anon, authenticated;
grant select on table public.question_quality_findings to service_role;

-- -------------------------------------------------------------------------
-- A. Autumn demo: replace the false all-qollash classification with the
--    evidence-based 8 bilish / 35 qollash / 7 mulohaza profile. The source
--    contains 5 KS + 10 general-pedagogy + 0 informatics-methodology items;
--    q53 is generic problem exposition and must not be mislabeled PM.MET.
-- -------------------------------------------------------------------------

do $task305_demo$
declare
  v_count integer;
  v_pm_construct uuid;
  v_pm_lesson uuid;
begin
  select count(*) into v_count
  from public.questions
  where source_reference like 'drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q%';

  if v_count not in (0, 50) then
    raise exception 'TASK-305 autumn demo expected 0 or 50 rows, found %', v_count;
  end if;
  if v_count = 0 then
    return;
  end if;

  select c.id into strict v_pm_construct
  from public.constructs c where c.code='PM.GEN.08' and c.is_active;
  select l.id into strict v_pm_lesson
  from public.lesson_constructs lc
  join public.lessons l on l.id=lc.lesson_id
  where lc.construct_id=v_pm_construct
    and l.status='published'::public.content_status
  order by case when length(btrim(coalesce(l.body_mdx,'')))>0 then 0 else 1 end,
           l.order_idx,l.id
  limit 1;

  create temporary table task305_demo_classification(
    source_suffix text primary key,
    cognitive public.cognitive_level not null
  ) on commit drop;

  insert into task305_demo_classification(source_suffix,cognitive) values
    ('q01','qollash'),('q02','qollash'),('q03','qollash'),('q04','qollash'),
    ('q06','qollash'),('q07','mulohaza'),('q08','qollash'),('q09','qollash'),
    ('q10','qollash'),('q11','qollash'),('q13','qollash'),('q14','mulohaza'),
    ('q16','bilish'),('q17','qollash'),('q18','qollash'),('q19','qollash'),
    ('q20','mulohaza'),('q21','qollash'),('q23','qollash'),('q24','qollash'),
    ('q25','qollash'),('q26','qollash'),('q27','qollash'),('q29','qollash'),
    ('q30','qollash'),('q31-1','bilish'),('q31-2','bilish'),
    ('q32-1','bilish'),('q32-2','qollash'),('q33','qollash'),
    ('q34','qollash'),('q36','mulohaza'),('q37','qollash'),('q38','bilish'),
    ('q39','qollash'),('q40','mulohaza'),('q41','qollash'),('q42','qollash'),
    ('q43','qollash'),('q44','bilish'),('q45','qollash'),('q46','qollash'),
    ('q47','mulohaza'),('q48','qollash'),('q49','qollash'),('q50','bilish'),
    ('q51','qollash'),('q52','mulohaza'),('q53','qollash'),('q54','bilish');

  create temporary table task305_demo_map(
    source_question_id uuid primary key,
    revision_question_id uuid not null unique,
    source_suffix text not null,
    cognitive public.cognitive_level not null
  ) on commit drop;

  insert into task305_demo_map(
    source_question_id,revision_question_id,source_suffix,cognitive
  )
  select q.id,gen_random_uuid(),c.source_suffix,c.cognitive
  from public.questions q
  join task305_demo_classification c
    on q.source_reference=
      'drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:'||c.source_suffix;

  if (select count(*) from task305_demo_map)<>50 then
    raise exception 'TASK-305 autumn demo classification did not map all 50 rows';
  end if;

  create temporary table task305_demo_option_map(
    source_option_id uuid primary key,
    revision_option_id uuid not null unique,
    source_question_id uuid not null,
    revision_question_id uuid not null
  ) on commit drop;

  insert into task305_demo_option_map
  select o.id,gen_random_uuid(),o.question_id,m.revision_question_id
  from public.question_options o
  join task305_demo_map m on m.source_question_id=o.question_id;

  insert into public.questions(
    id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
    assets,is_generated,status,author_id,created_at,updated_at,source_reference,
    source_lesson_id
  )
  select
    m.revision_question_id,q.subject_id,
    case when m.source_suffix='q53' then v_pm_construct else q.construct_id end,
    case when m.source_suffix='q53' then 'PM.GEN' else q.group_code end,
    q.format,m.cognitive,q.difficulty,q.stem_md,q.assets,q.is_generated,
    'review'::public.content_status,q.author_id,now(),now(),
    'revision:TASK-305:demo:'||q.id::text||' | '||q.source_reference,
    case when m.source_suffix='q53' then v_pm_lesson else q.source_lesson_id end
  from public.questions q
  join task305_demo_map m on m.source_question_id=q.id;

  insert into public.question_options(id,question_id,side,order_idx,content_md)
  select om.revision_option_id,om.revision_question_id,o.side,o.order_idx,o.content_md
  from public.question_options o
  join task305_demo_option_map om on om.source_option_id=o.id;

  insert into public.question_keys(question_id,payload,explanation_md,updated_at)
  select m.revision_question_id,
    jsonb_set(
      k.payload,'{correct_option_id}',
      to_jsonb((select om.revision_option_id::text
                from task305_demo_option_map om
                where om.source_option_id=(k.payload->>'correct_option_id')::uuid)),
      false
    ),
    k.explanation_md,now()
  from task305_demo_map m
  join public.question_keys k on k.question_id=m.source_question_id;

  insert into public.question_bank_revisions(
    source_question_id,revision_question_id,revision_kind,evidence
  )
  select m.source_question_id,m.revision_question_id,'demo_cognitive_reclassification',
    jsonb_build_object(
      'task','TASK-305','source_suffix',m.source_suffix,
      'corrected_cognitive',m.cognitive,
      'publication_status','human_review_required',
      'q53_group_correction',m.source_suffix='q53'
    )
  from task305_demo_map m;

  update public.questions q
  set status='archived'::public.content_status,updated_at=now()
  from task305_demo_map m
  where q.id=m.source_question_id
    and q.status in ('published'::public.content_status,'review'::public.content_status);

  insert into public.question_quality_findings(
    question_id,finding_code,severity,details,resolved_at
  )
  select m.source_question_id,'demo_cognitive_classification_drift','high',
    jsonb_build_object('task','TASK-305','replacement_question_id',m.revision_question_id),
    now()
  from task305_demo_map m;

  insert into public.question_quality_findings(
    question_id,finding_code,severity,details
  )
  select m.revision_question_id,'independent_editorial_review_required','high',
    jsonb_build_object('task','TASK-305','source_question_id',m.source_question_id)
  from task305_demo_map m;

  if (select count(*) from public.questions q join task305_demo_map m
      on m.revision_question_id=q.id where q.status='review')<>50
     or (select count(*) from public.questions q join task305_demo_map m
      on m.revision_question_id=q.id where q.cognitive='bilish')<>8
     or (select count(*) from public.questions q join task305_demo_map m
      on m.revision_question_id=q.id where q.cognitive='qollash')<>35
     or (select count(*) from public.questions q join task305_demo_map m
      on m.revision_question_id=q.id where q.cognitive='mulohaza')<>7
  then
    raise exception 'TASK-305 autumn demo postflight failed';
  end if;
end
$task305_demo$;

-- -------------------------------------------------------------------------
-- B. Legacy Y2: replace all recoverable 8x-side-a storage with native a/b
--    REVIEW revisions. Existing attempts keep pointing at immutable originals.
-- -------------------------------------------------------------------------

do $task305_y2$
declare
  v_total integer;
  v_invalid integer;
begin
  select count(*) into v_total
  from public.questions q
  where q.format='Y2'::public.question_format
    and q.status in ('published'::public.content_status,'review'::public.content_status)
    and (select count(*) from public.question_options o
         where o.question_id=q.id and o.side='a')=8;

  select count(*) into v_invalid
  from public.questions q
  left join public.question_keys k on k.question_id=q.id
  where q.format='Y2'::public.question_format
    and q.status in ('published'::public.content_status,'review'::public.content_status)
    and (select count(*) from public.question_options o
         where o.question_id=q.id and o.side='a')=8
    and (
      k.question_id is null
      or (select count(*) from public.question_options o
          where o.question_id=q.id)<>8
      or jsonb_typeof(k.payload->'pairs')<>'object'
      or (select count(*) from jsonb_each_text(k.payload->'pairs'))<>4
      or (select count(distinct p.key) from jsonb_each_text(k.payload->'pairs') p)<>4
      or (select count(distinct p.value) from jsonb_each_text(k.payload->'pairs') p)<>4
      or exists (
        select 1 from jsonb_each_text(k.payload->'pairs') p
        where p.key=p.value
           or exists (
             select 1 from jsonb_each_text(k.payload->'pairs') p2
             where p2.key=p.value
           )
           or not exists(select 1 from public.question_options o
                         where o.question_id=q.id and o.id::text=p.key)
           or not exists(select 1 from public.question_options o
                         where o.question_id=q.id and o.id::text=p.value)
      )
    );
  if v_invalid<>0 then
    raise exception 'TASK-305 found % unrecoverable legacy Y2 rows',v_invalid;
  end if;

  create temporary table task305_y2_map(
    source_question_id uuid primary key,
    revision_question_id uuid not null unique
  ) on commit drop;

  insert into task305_y2_map
  select q.id,gen_random_uuid()
  from public.questions q
  where q.format='Y2'::public.question_format
    and q.status in ('published'::public.content_status,'review'::public.content_status)
    and (select count(*) from public.question_options o
         where o.question_id=q.id and o.side='a')=8;

  create temporary table task305_y2_option_map(
    source_option_id uuid primary key,
    revision_option_id uuid not null unique,
    source_question_id uuid not null,
    revision_question_id uuid not null,
    resolved_side char(1) not null,
    resolved_order integer not null
  ) on commit drop;

  insert into task305_y2_option_map
  select o.id,gen_random_uuid(),o.question_id,m.revision_question_id,
    case when exists(
      select 1 from jsonb_each_text(k.payload->'pairs') p where p.key=o.id::text
    ) then 'a'::char(1) else 'b'::char(1) end,
    row_number() over(
      partition by o.question_id,
        case when exists(
          select 1 from jsonb_each_text(k.payload->'pairs') p where p.key=o.id::text
        ) then 'a' else 'b' end
      order by o.order_idx,o.id
    )::integer
  from public.question_options o
  join task305_y2_map m on m.source_question_id=o.question_id
  join public.question_keys k on k.question_id=o.question_id;

  insert into public.questions(
    id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
    assets,is_generated,status,author_id,created_at,updated_at,source_reference,
    source_lesson_id
  )
  select m.revision_question_id,q.subject_id,q.construct_id,q.group_code,q.format,
    q.cognitive,q.difficulty,q.stem_md,q.assets,q.is_generated,
    'review'::public.content_status,q.author_id,now(),now(),
    'revision:TASK-305:native-y2:'||q.id::text||' | '||q.source_reference,
    q.source_lesson_id
  from public.questions q
  join task305_y2_map m on m.source_question_id=q.id;

  insert into public.question_options(id,question_id,side,order_idx,content_md)
  select om.revision_option_id,om.revision_question_id,
         om.resolved_side,om.resolved_order,o.content_md
  from public.question_options o
  join task305_y2_option_map om on om.source_option_id=o.id;

  insert into public.question_keys(question_id,payload,explanation_md,updated_at)
  select m.revision_question_id,
    jsonb_set(
      k.payload,'{pairs}',
      (select jsonb_object_agg(l.revision_option_id::text,r.revision_option_id::text)
       from jsonb_each_text(k.payload->'pairs') p
       join task305_y2_option_map l on l.source_option_id=p.key::uuid
       join task305_y2_option_map r on r.source_option_id=p.value::uuid),
      false
    ),
    k.explanation_md,now()
  from task305_y2_map m
  join public.question_keys k on k.question_id=m.source_question_id;

  insert into public.question_bank_revisions(
    source_question_id,revision_question_id,revision_kind,evidence
  )
  select m.source_question_id,m.revision_question_id,'legacy_y2_native_sides',
    jsonb_build_object(
      'task','TASK-305','old_storage','8_side_a',
      'new_storage','4_side_a_4_side_b',
      'publication_status','human_review_required'
    )
  from task305_y2_map m;

  update public.questions q
  set status='archived'::public.content_status,updated_at=now()
  from task305_y2_map m
  where q.id=m.source_question_id
    and q.status in ('published'::public.content_status,'review'::public.content_status);

  insert into public.question_quality_findings(
    question_id,finding_code,severity,details,resolved_at
  )
  select m.source_question_id,'legacy_y2_all_options_side_a','high',
    jsonb_build_object('task','TASK-305','replacement_question_id',m.revision_question_id),
    now()
  from task305_y2_map m;

  insert into public.question_quality_findings(
    question_id,finding_code,severity,details
  )
  select m.revision_question_id,'independent_editorial_review_required','high',
    jsonb_build_object('task','TASK-305','source_question_id',m.source_question_id)
  from task305_y2_map m;

  if (select count(*) from task305_y2_map)<>v_total
     or exists(
       select 1 from public.questions q
       join task305_y2_map m on m.revision_question_id=q.id
       where q.status<>'review'::public.content_status
          or (select count(*) from public.question_options o
              where o.question_id=q.id and o.side='a')<>4
          or (select count(*) from public.question_options o
              where o.question_id=q.id and o.side='b')<>4
     )
  then
    raise exception 'TASK-305 native Y2 postflight failed';
  end if;
end
$task305_y2$;

-- -------------------------------------------------------------------------
-- C. Truthful quality queue for the grandfathered published bank.
-- -------------------------------------------------------------------------

insert into public.question_quality_findings(
  question_id,finding_code,severity,details
)
select q.id,'editorial_evidence_missing','medium',
  jsonb_build_object('task','TASK-305','status','grandfathered_published')
from public.questions q
where q.status='published'::public.content_status
  and not exists (
    select 1 from public.question_editorial_checks e
    where e.question_id=q.id
      and e.answer_verified and e.reference_verified and e.wording_verified
      and e.original_authorship_verified
      and length(btrim(e.reviewer_notes))>=20
      and e.content_fingerprint=public.professional_question_fingerprint(q.id)
  )
on conflict (question_id,finding_code) do nothing;

with lengths as (
  select q.id,
    max(length(regexp_replace(btrim(o.content_md),'[[:space:]]+','','g')))
      filter(where o.id::text=k.payload->>'correct_option_id') correct_len,
    max(length(regexp_replace(btrim(o.content_md),'[[:space:]]+','','g')))
      filter(where o.id::text<>k.payload->>'correct_option_id') wrong_max,
    avg(length(regexp_replace(btrim(o.content_md),'[[:space:]]+','','g')))
      filter(where o.id::text<>k.payload->>'correct_option_id') wrong_avg
  from public.questions q
  join public.question_keys k on k.question_id=q.id
  join public.question_options o on o.question_id=q.id and o.side='a'
  where q.status='published'::public.content_status
    and q.format='Y1'::public.question_format
  group by q.id
)
insert into public.question_quality_findings(
  question_id,finding_code,severity,details
)
select id,'y1_correct_answer_strictly_longest','medium',
  jsonb_build_object(
    'task','TASK-305','correct_length',correct_len,
    'max_distractor_length',wrong_max,'average_distractor_length',wrong_avg
  )
from lengths where correct_len>wrong_max
on conflict (question_id,finding_code) do nothing;

with lengths as (
  select q.id,
    max(length(regexp_replace(btrim(o.content_md),'[[:space:]]+','','g')))
      filter(where o.id::text=k.payload->>'correct_option_id') correct_len,
    avg(length(regexp_replace(btrim(o.content_md),'[[:space:]]+','','g')))
      filter(where o.id::text<>k.payload->>'correct_option_id') wrong_avg
  from public.questions q
  join public.question_keys k on k.question_id=q.id
  join public.question_options o on o.question_id=q.id and o.side='a'
  where q.status='published'::public.content_status
    and q.format='Y1'::public.question_format
  group by q.id
)
insert into public.question_quality_findings(
  question_id,finding_code,severity,details
)
select id,'y1_answer_length_high_risk','high',
  jsonb_build_object(
    'task','TASK-305','correct_length',correct_len,
    'average_distractor_length',wrong_avg,'ratio',round(correct_len/wrong_avg,3)
  )
from lengths where wrong_avg>0 and correct_len>1.7*wrong_avg
on conflict (question_id,finding_code) do nothing;

-- Exact eligibility used by the official mock v4. Medium findings remain in
-- the review queue; unresolved high/critical findings fail closed.
create or replace function public.is_question_official_mock_eligible(p_question_id uuid)
returns boolean
language sql
stable
security definer
set search_path=''
as $eligible$
  select exists (
    select 1
    from public.questions q
    join public.constructs c on c.id=q.construct_id
    join public.question_keys k on k.question_id=q.id
    where q.id=p_question_id
      -- REVIEW is accepted here because this helper is also evaluated by the
      -- BEFORE-publish trigger, whose table row still has the old status.
      -- Official mock queries additionally require q.status=published.
      and q.status in ('published'::public.content_status,'review'::public.content_status)
      and c.is_active and c.group_code=q.group_code
      and q.source_reference is not null
      and length(btrim(q.source_reference))>0
      and q.source_lesson_id is not null
      and exists (
        select 1 from public.lesson_constructs lc
        join public.lessons l on l.id=lc.lesson_id
        where lc.lesson_id=q.source_lesson_id
          and lc.construct_id=q.construct_id
          and l.status='published'::public.content_status
      )
      and length(btrim(k.explanation_md))>10
      and not exists (
        select 1 from public.question_quality_findings f
        where f.question_id=q.id and f.resolved_at is null
          and f.severity in ('high','critical')
      )
      and case q.format
        when 'Y1'::public.question_format then
          (select count(*) between 3 and 5
             and bool_and(o.side='a')
             and count(distinct btrim(o.content_md))=count(*)
           from public.question_options o where o.question_id=q.id)
          and exists (
            select 1 from public.question_options o
            where o.question_id=q.id and o.side='a'
              and o.id::text=k.payload->>'correct_option_id'
          )
        when 'Y2'::public.question_format then
          jsonb_typeof(k.payload->'pairs')='object'
          and (select count(*) from public.question_options o
               where o.question_id=q.id and o.side='a') between 3 and 6
          and (select count(*) from public.question_options o
               where o.question_id=q.id and o.side='b') between
              (select count(*) from public.question_options o
               where o.question_id=q.id and o.side='a') and
              (select count(*)+2 from public.question_options o
               where o.question_id=q.id and o.side='a')
          and (select count(*) from jsonb_each_text(k.payload->'pairs'))=
              (select count(*) from public.question_options o
               where o.question_id=q.id and o.side='a')
          and (select count(distinct p.value)
               from jsonb_each_text(k.payload->'pairs') p)=
              (select count(*) from jsonb_each_text(k.payload->'pairs'))
          and not exists (
            select 1 from jsonb_each_text(k.payload->'pairs') p
            where not exists (
              select 1 from public.question_options o
              where o.question_id=q.id and o.side='a' and o.id::text=p.key
            ) or not exists (
              select 1 from public.question_options o
              where o.question_id=q.id and o.side='b' and o.id::text=p.value
            )
          )
        when 'Y3'::public.question_format then
          jsonb_typeof(k.payload->'order')='array'
          and jsonb_array_length(k.payload->'order') between 3 and 8
          and jsonb_array_length(k.payload->'order')=(
            select count(*) from public.question_options o where o.question_id=q.id
          )
          and (select count(distinct x.value)
               from jsonb_array_elements_text(k.payload->'order') x)=
              jsonb_array_length(k.payload->'order')
          and not exists (
            select 1 from public.question_options o
            where o.question_id=q.id and o.side<>'a'
          )
          and not exists (
            select 1 from jsonb_array_elements_text(k.payload->'order') x
            where not exists (
              select 1 from public.question_options o
              where o.question_id=q.id and o.id::text=x.value
            )
          )
        else false
      end
  );
$eligible$;

revoke all on function public.is_question_official_mock_eligible(uuid)
  from public,anon,authenticated;

-- Broaden checklist stamping from pedagogy-only to every REVIEW question.
create or replace function public.fill_question_editorial_fingerprint()
returns trigger
language plpgsql
security definer
set search_path=''
as $stamp$
declare v_status public.content_status;
begin
  select status into v_status from public.questions where id=new.question_id;
  if v_status is null then
    raise exception using errcode='23503',message='QUESTION_EDITORIAL_QUESTION_NOT_FOUND';
  end if;
  if v_status<>'review'::public.content_status then
    raise exception using errcode='23514',message='QUESTION_EDITORIAL_REVIEW_STATUS_REQUIRED';
  end if;
  new.content_fingerprint:=public.professional_question_fingerprint(new.question_id);
  new.reviewed_at:=now();
  return new;
end
$stamp$;

create or replace function public.resolve_question_quality_findings_after_review()
returns trigger
language plpgsql
security definer
set search_path=''
as $resolve$
declare
  v_current boolean;
  v_length_high boolean;
  v_strict_longest boolean;
begin
  v_current:=new.answer_verified and new.reference_verified
    and new.wording_verified and new.original_authorship_verified
    and length(btrim(new.reviewer_notes))>=20
    and new.content_fingerprint=public.professional_question_fingerprint(new.question_id);
  if not v_current then return new; end if;

  update public.question_quality_findings
  set resolved_at=coalesce(resolved_at,now())
  where question_id=new.question_id
    and finding_code in (
      'independent_editorial_review_required','editorial_evidence_missing'
    );

  if (select q.format from public.questions q where q.id=new.question_id)
     ='Y1'::public.question_format then
    with lengths as (
      select
        max(length(regexp_replace(btrim(o.content_md),'[[:space:]]+','','g')))
          filter(where o.id::text=k.payload->>'correct_option_id') correct_len,
        max(length(regexp_replace(btrim(o.content_md),'[[:space:]]+','','g')))
          filter(where o.id::text<>k.payload->>'correct_option_id') wrong_max,
        avg(length(regexp_replace(btrim(o.content_md),'[[:space:]]+','','g')))
          filter(where o.id::text<>k.payload->>'correct_option_id') wrong_avg
      from public.question_options o
      join public.question_keys k on k.question_id=o.question_id
      where o.question_id=new.question_id and o.side='a'
    )
    select correct_len>1.7*wrong_avg,correct_len>wrong_max
      into v_length_high,v_strict_longest from lengths;

    if not coalesce(v_length_high,false) then
      update public.question_quality_findings
      set resolved_at=coalesce(resolved_at,now())
      where question_id=new.question_id
        and finding_code='y1_answer_length_high_risk';
    end if;
    if not coalesce(v_strict_longest,false) then
      update public.question_quality_findings
      set resolved_at=coalesce(resolved_at,now())
      where question_id=new.question_id
        and finding_code='y1_correct_answer_strictly_longest';
    end if;
  end if;
  return new;
end
$resolve$;

revoke all on function public.resolve_question_quality_findings_after_review()
  from public,anon,authenticated;

drop trigger if exists question_quality_findings_review_resolution
  on public.question_editorial_checks;
create trigger question_quality_findings_review_resolution
after insert or update on public.question_editorial_checks
for each row execute function public.resolve_question_quality_findings_after_review();

create or replace function public.guard_universal_question_publication()
returns trigger
language plpgsql
security definer
set search_path=''
as $publish$
begin
  if new.status<>'published'::public.content_status then return new; end if;
  if tg_op='UPDATE' and old.status='published'::public.content_status then return new; end if;

  -- Trusted SQL migrations/tests run as a database owner. Client and backend
  -- requests arrive through authenticator and may never bypass this gate.
  if session_user in ('postgres','supabase_admin') then return new; end if;

  if tg_op='INSERT' then
    raise exception using errcode='23514',
      message='QUESTION_REVIEW_BEFORE_PUBLICATION_REQUIRED';
  end if;
  if (to_jsonb(new)-'status'-'updated_at') <>
     (to_jsonb(old)-'status'-'updated_at') then
    raise exception using errcode='23514',message='QUESTION_EDIT_AND_PUBLISH_SEPARATELY';
  end if;
  if not public.is_question_official_mock_eligible(new.id) then
    raise exception using errcode='23514',message='QUESTION_RELEASE_QUALITY_REQUIREMENTS_FAILED';
  end if;
  if not exists (
    select 1 from public.question_editorial_checks e
    where e.question_id=new.id
      and e.answer_verified and e.reference_verified and e.wording_verified
      and e.original_authorship_verified
      and length(btrim(e.reviewer_notes))>=20
      and e.content_fingerprint=public.professional_question_fingerprint(new.id)
      and (new.author_id is null or e.reviewer_id<>new.author_id)
  ) then
    raise exception using errcode='23514',message='QUESTION_EDITORIAL_APPROVAL_REQUIRED';
  end if;
  return new;
end
$publish$;

revoke all on function public.guard_universal_question_publication()
  from public,anon,authenticated;

drop trigger if exists universal_question_publish_guard on public.questions;
create trigger universal_question_publish_guard
before insert or update of status,source_reference,source_lesson_id,group_code,construct_id
on public.questions
for each row execute function public.guard_universal_question_publication();

-- Snapshot every surviving published row and make the existing generic lock
-- truly universal. Archive-only transitions remain allowed.
insert into public.question_quality_published_revisions(
  question_id,content_fingerprint,release_scope
)
select q.id,public.professional_question_fingerprint(q.id),'TASK-305/grandfathered'
from public.questions q
where q.status='published'::public.content_status
on conflict (question_id) do nothing;

create or replace function public.register_question_quality_published_revision()
returns trigger
language plpgsql
security definer
set search_path=''
as $register$
begin
  -- API publication is review -> published. Direct published inserts are
  -- rejected for API roles and remain available only to trusted SQL fixtures.
  if tg_op='UPDATE'
     and new.status='published'::public.content_status
     and old.status is distinct from 'published'::public.content_status
  then
    insert into public.question_quality_published_revisions(
      question_id,content_fingerprint,release_scope
    ) values (
      new.id,public.professional_question_fingerprint(new.id),'TASK-305/universal'
    ) on conflict (question_id) do nothing;
  end if;
  return new;
end
$register$;

revoke all on function public.register_question_quality_published_revision()
  from public,anon,authenticated;

-- The trigger already exists from TASK-240; recreate it to make the new
-- all-question registration contract explicit.
drop trigger if exists trg_question_quality_publication_snapshot on public.questions;
create trigger trg_question_quality_publication_snapshot
after insert or update of status,group_code,source_reference on public.questions
for each row execute function public.register_question_quality_published_revision();

-- Published items with unresolved high/critical findings must never make the
-- official blueprint infeasible after this remediation.
do $task305_pool_postflight$
declare v_bad integer;
begin
  with bp as (
    select id from public.blueprints where is_active order by version desc limit 1
  ), required as (
    select bq.group_code,x.cognitive,x.required
    from public.blueprint_quotas bq join bp on bp.id=bq.blueprint_id
    cross join lateral (values
      ('bilish'::public.cognitive_level,bq.n_bilish),
      ('qollash'::public.cognitive_level,bq.n_qollash),
      ('mulohaza'::public.cognitive_level,bq.n_mulohaza)
    ) x(cognitive,required)
  )
  select count(*) into v_bad from required r
  where r.required>0 and r.required>(
    select count(*) from public.questions q
    where q.status='published'::public.content_status
      and q.group_code=r.group_code and q.cognitive=r.cognitive
      and public.is_question_official_mock_eligible(q.id)
  );
  if v_bad<>0 then
    raise exception 'TASK-305 official mock quality gate made % quota cells infeasible',v_bad;
  end if;
end
$task305_pool_postflight$;

commit;
