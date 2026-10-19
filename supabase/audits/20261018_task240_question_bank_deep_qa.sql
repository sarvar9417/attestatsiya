-- TASK-240: full question-bank, read-only quality audit.
-- Run as privileged staff. This file returns aggregate evidence only and never
-- exposes learner-visible answer keys. Semantic correctness still requires a
-- source-qualified human reviewer; these queries do not invent that sign-off.

-- 1. Inventory and editorial evidence.
select
  q.status::text as status,
  q.group_code,
  q.format::text as format,
  q.cognitive::text as cognitive,
  q.is_generated,
  count(*) as questions,
  count(*) filter(where exists(
    select 1 from public.question_editorial_checks e
    where e.question_id=q.id
      and e.answer_verified and e.reference_verified and e.wording_verified
      and e.original_authorship_verified
      and length(btrim(e.reviewer_notes))>=20
      and e.content_fingerprint=public.professional_question_fingerprint(q.id)
  )) as current_full_editorial_checks
from public.questions q
group by q.status::text,q.group_code,q.format::text,q.cognitive::text,q.is_generated
order by status,group_code,format,cognitive,is_generated;

-- 2. Active-row metadata and taxonomy invariants.
with active as (
  select q.*,k.payload,k.explanation_md,c.group_code as construct_group,
    c.subject_id as construct_subject,c.is_active
  from public.questions q
  left join public.question_keys k on k.question_id=q.id
  left join public.constructs c on c.id=q.construct_id
  where q.status<>'archived'::public.content_status
), issues as (
  select id,status::text status,group_code,'blank_stem' issue
  from active where coalesce(btrim(stem_md),'')=''
  union all select id,status::text,group_code,'missing_key'
  from active where payload is null
  union all select id,status::text,group_code,'blank_explanation'
  from active where coalesce(btrim(explanation_md),'')=''
  union all select id,status::text,group_code,'missing_source_reference'
  from active where coalesce(btrim(source_reference),'')=''
  union all select id,status::text,group_code,'missing_source_lesson'
  from active where source_lesson_id is null
  union all select id,status::text,group_code,'inactive_construct'
  from active where coalesce(is_active,false)=false
  union all select id,status::text,group_code,'group_construct_mismatch'
  from active where group_code is distinct from construct_group
  union all select id,status::text,group_code,'subject_construct_mismatch'
  from active where subject_id is distinct from construct_subject
  union all select id,status::text,group_code,'lesson_construct_mismatch'
  from active q
  where q.source_lesson_id is not null and not exists(
    select 1 from public.lesson_constructs lc
    where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
  )
)
select issue,status,group_code,count(*) affected
from issues group by issue,status,group_code order by issue,status,group_code;

-- 3. Y1/Y2/Y3 option and key contracts. The historical formatbank Y2 rows
-- with 8 raw side='a' options are listed separately as runtime-recovered debt.
with active as (
  select q.*,k.payload
  from public.questions q left join public.question_keys k on k.question_id=q.id
  where q.status<>'archived'::public.content_status
), option_stats as (
  select o.question_id,count(*) n_all,
    count(*) filter(where btrim(o.side::text)='a') n_a,
    count(*) filter(where btrim(o.side::text)='b') n_b,
    count(distinct btrim(o.content_md)) n_distinct,
    count(*) filter(where coalesce(btrim(o.content_md),'')='') n_blank
  from public.question_options o group by o.question_id
), issues as (
  select q.id,q.status::text status,q.group_code,q.format::text format,
    'blank_or_exact_duplicate_option' issue
  from active q join option_stats o on o.question_id=q.id
  where o.n_blank>0 or o.n_distinct<o.n_all
  union all
  select q.id,q.status::text,q.group_code,q.format::text,'Y1_shape_or_key'
  from active q left join option_stats o on o.question_id=q.id
  where q.format='Y1'::public.question_format and not(
    coalesce(o.n_a,0) between 3 and 5 and coalesce(o.n_b,0)=0
    and exists(select 1 from public.question_options x
      where x.question_id=q.id and btrim(x.side::text)='a'
        and x.id::text=q.payload->>'correct_option_id')
  )
  union all
  select q.id,q.status::text,q.group_code,q.format::text,'Y2_shape_or_key'
  from active q left join option_stats o on o.question_id=q.id
  where q.format='Y2'::public.question_format and not(
    coalesce(o.n_a,0) between 3 and 6
    and coalesce(o.n_b,0) between coalesce(o.n_a,0) and coalesce(o.n_a,0)+2
    and jsonb_typeof(q.payload->'pairs')='object'
    and (select count(*) from jsonb_each_text(q.payload->'pairs'))=coalesce(o.n_a,0)
    and (select count(distinct p.value) from jsonb_each_text(q.payload->'pairs') p)=coalesce(o.n_a,0)
    and not exists(select 1 from jsonb_each_text(q.payload->'pairs') p
      where not exists(select 1 from public.question_options x
        where x.question_id=q.id and btrim(x.side::text)='a' and x.id::text=p.key)
         or not exists(select 1 from public.question_options x
        where x.question_id=q.id and btrim(x.side::text)='b' and x.id::text=p.value))
  )
  union all
  select q.id,q.status::text,q.group_code,q.format::text,'Y3_shape_or_key'
  from active q left join option_stats o on o.question_id=q.id
  where q.format='Y3'::public.question_format and not(
    coalesce(o.n_a,0) between 3 and 8 and coalesce(o.n_b,0)=0
    and jsonb_typeof(q.payload->'order')='array'
    and jsonb_array_length(q.payload->'order')=coalesce(o.n_a,0)
    and (select count(distinct x.value) from jsonb_array_elements_text(q.payload->'order') x)=coalesce(o.n_a,0)
    and not exists(select 1 from jsonb_array_elements_text(q.payload->'order') x
      where not exists(select 1 from public.question_options o2
        where o2.question_id=q.id and o2.id::text=x.value))
  )
)
select issue,status,group_code,format,count(*) affected
from issues group by issue,status,group_code,format order by issue,status,group_code,format;

-- 4. Explicit unresolved-review markers must never be learner-published.
select q.status::text status,q.group_code,count(*) affected
from public.questions q
where q.status<>'archived'::public.content_status
  and (
    q.source_reference ~* 'expert review required|original review'
    or q.assets::text ~* 'source_visual_review_required|supplemental_textbook_only'
  )
group by q.status::text,q.group_code order by status,group_code;

-- 5. Active construct coverage. Zero and shallow pools are release risks even
-- when broad group-level blueprint assembly remains technically feasible.
select c.group_code,c.code,c.title_uz,
  count(distinct q.id) filter(where q.status='published'::public.content_status) published,
  count(distinct q.id) filter(where q.status='review'::public.content_status) review,
  count(distinct q.id) filter(where q.status='draft'::public.content_status) draft
from public.constructs c
left join public.questions q on q.construct_id=c.id and q.status<>'archived'::public.content_status
where c.is_active
group by c.id
having count(distinct q.id) filter(where q.status='published'::public.content_status)<5
order by c.group_code,c.code;

-- 6. Active blueprint group x cognitive feasibility and reserve.
with bp as (
  select * from public.blueprints where is_active order by version desc limit 1
), pool as (
  select q.group_code,q.cognitive,count(distinct q.id) available
  from public.questions q join public.constructs c on c.id=q.construct_id
  where q.status='published'::public.content_status
    and c.is_active and c.group_code=q.group_code
    and exists(select 1 from public.question_keys k where k.question_id=q.id)
  group by q.group_code,q.cognitive
), cells as (
  select bq.order_idx,bq.group_code,x.cognitive,x.required,coalesce(p.available,0) available
  from public.blueprint_quotas bq join bp on bp.id=bq.blueprint_id
  cross join lateral(values
    ('bilish'::public.cognitive_level,bq.n_bilish),
    ('qollash'::public.cognitive_level,bq.n_qollash),
    ('mulohaza'::public.cognitive_level,bq.n_mulohaza)
  ) x(cognitive,required)
  left join pool p on p.group_code=bq.group_code and p.cognitive=x.cognitive
)
select order_idx,group_code,cognitive::text,required,available,
  available-required reserve,available>=required pass
from cells where required>0 order by order_idx,cognitive;

-- 7. Exact semantic duplicates: same normalized stem, option content and
-- content-based answer key. UUID-only differences do not hide a duplicate.
with canonical as (
  select q.id,q.status::text status,q.group_code,q.format::text format,
    md5(lower(regexp_replace(btrim(q.stem_md),'[[:space:]]+',' ','g'))||'|'||q.format::text||'|'||
      case
        when q.format='Y1'::public.question_format then
          coalesce((select string_agg(lower(btrim(o.content_md)),'||' order by o.order_idx)
            from public.question_options o where o.question_id=q.id and btrim(o.side::text)='a'),'')
          ||'|KEY='||coalesce((select lower(btrim(o.content_md))
            from public.question_options o join public.question_keys k on k.question_id=q.id
            where o.id::text=k.payload->>'correct_option_id'),'')
        when q.format='Y2'::public.question_format then
          coalesce((select string_agg(lower(btrim(l.content_md))||'=>'||lower(btrim(r.content_md)),'||'
                     order by lower(btrim(l.content_md)))
            from public.question_keys k,jsonb_each_text(k.payload->'pairs') p
            join public.question_options l on l.id::text=p.key
            join public.question_options r on r.id::text=p.value
            where k.question_id=q.id),'')
        when q.format='Y3'::public.question_format then
          coalesce((select string_agg(lower(btrim(o.content_md)),'||' order by x.ord)
            from public.question_keys k,
              jsonb_array_elements_text(k.payload->'order') with ordinality x(value,ord)
            join public.question_options o on o.id::text=x.value
            where k.question_id=q.id),'')
        else ''
      end) fingerprint
  from public.questions q where q.status<>'archived'::public.content_status
), duplicates as (
  select fingerprint,count(*) members,
    count(*) filter(where status='published') published_members,
    count(distinct group_code) groups
  from canonical group by fingerprint having count(*)>1
)
select count(*) duplicate_clusters,coalesce(sum(members),0) duplicate_members,
  coalesce(sum(published_members),0) published_members,
  count(*) filter(where groups>1) cross_group_clusters
from duplicates;

-- 8. Legacy runtime-recovered Y2 snapshots. These are immutable historical
-- rows, not silently accepted as canonical raw data.
select q.status::text status,q.group_code,count(*) affected
from public.questions q join public.question_keys k on k.question_id=q.id
where q.status<>'archived'::public.content_status
  and q.format='Y2'::public.question_format
  and (select count(*) from public.question_options o where o.question_id=q.id)=8
  and (select count(*) from public.question_options o
       where o.question_id=q.id and btrim(o.side::text)='a')=8
  and jsonb_typeof(k.payload->'pairs')='object'
  and (select count(*) from jsonb_each_text(k.payload->'pairs'))=4
group by q.status::text,q.group_code order by status,group_code;
