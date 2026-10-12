-- Read-only production release preflight.
-- Safe to run against production: SELECT statements only, no DDL/DML.
-- Intended to be executed immediately before any separately authorized release.

-- 1) Core question-bank integrity.
select
  count(*) filter (where q.status='published'::public.content_status) as published_total,
  count(*) filter (where q.status='review'::public.content_status) as review_total,
  count(*) filter (
    where q.status='published'::public.content_status
      and coalesce(btrim(q.source_reference),'')=''
  ) as published_missing_source_reference,
  count(*) filter (
    where q.status='published'::public.content_status
      and q.source_lesson_id is null
  ) as published_missing_source_lesson,
  count(*) filter (
    where q.status='published'::public.content_status
      and not exists (
        select 1 from public.question_keys k where k.question_id=q.id
      )
  ) as published_missing_key,
  count(*) filter (
    where q.status='published'::public.content_status
      and q.source_lesson_id is not null
      and not exists (
        select 1
        from public.lesson_constructs lc
        where lc.lesson_id=q.source_lesson_id
          and lc.construct_id=q.construct_id
      )
  ) as published_source_lesson_construct_mismatch
from public.questions q;

-- 2) Six official zero-coverage targets.
with target(code) as (
  values
    ('S3.LOGIC.01'),
    ('S3.LOGIC.03'),
    ('S3.ALGO.03'),
    ('S4.CODE.04'),
    ('S6.NET.02'),
    ('S6.NET.04')
)
select
  t.code,
  count(q.id) filter (where q.status='published'::public.content_status) as published,
  count(q.id) filter (where q.status='review'::public.content_status) as review,
  count(q.id) as total
from target t
left join public.constructs c
  on c.code=t.code and c.is_active
left join public.questions q
  on q.construct_id=c.id
group by t.code
order by t.code;

-- 3) Canonical source lessons required by the review bank.
with expected(code, slug) as (
  values
    ('S3.LOGIC.01','mantiqiy-mulohazalar'),
    ('S3.LOGIC.03','mantiqiy-xulosa-va-masala'),
    ('S3.ALGO.03','masala-algoritmini-tuzish'),
    ('S4.CODE.04','javascript-sintaksis-asoslari'),
    ('S6.NET.02','arxitektura-va-topologiyalar'),
    ('S6.NET.04','internetdan-xavfsiz-va-maqsadli-foydalanish')
)
select
  e.code,
  e.slug,
  c.id is not null as construct_exists,
  l.id is not null as lesson_exists,
  l.status::text as lesson_status,
  coalesce(exists (
    select 1
    from public.lesson_constructs lc
    where lc.lesson_id=l.id
      and lc.construct_id=c.id
  ), false) as mapped_to_construct
from expected e
left join public.constructs c
  on c.code=e.code and c.is_active
left join public.lessons l
  on l.slug=e.slug
order by e.code;

-- 4) Missing source-lesson split. The release must never guess ambiguous links.
select
  count(*) filter (
    where q.status='published'::public.content_status
      and q.source_lesson_id is null
      and q.source_reference like 'generated:%'
  ) as generated_missing,
  count(*) filter (
    where q.status='published'::public.content_status
      and q.source_lesson_id is null
      and coalesce(btrim(q.source_reference),'')=''
  ) as sourceless_missing,
  count(*) filter (
    where q.status='published'::public.content_status
      and q.source_lesson_id is null
      and q.source_reference like 'generated:%'
      and 1 = (
        select count(distinct l.id)
        from public.lesson_constructs lc
        join public.lessons l on l.id=lc.lesson_id
        where lc.construct_id=q.construct_id
          and l.status='published'::public.content_status
      )
  ) as generated_unambiguous,
  count(*) filter (
    where q.status='published'::public.content_status
      and q.source_lesson_id is null
      and q.source_reference like 'generated:%'
      and 1 < (
        select count(distinct l.id)
        from public.lesson_constructs lc
        join public.lessons l on l.id=lc.lesson_id
        where lc.construct_id=q.construct_id
          and l.status='published'::public.content_status
      )
  ) as generated_ambiguous
from public.questions q;

-- 5) Historical source-less demo guard: any learner/reference link blocks archive.
with legacy(id) as (
  values
    ('00000000-0000-0000-0000-0000a0a00001'::uuid),
    ('00000000-0000-0000-0000-0000a0a00002'::uuid),
    ('00000000-0000-0000-0000-0000a0a00003'::uuid),
    ('00000000-0000-0000-0000-0000a0a00004'::uuid),
    ('00000000-0000-0000-0000-0000a0a00005'::uuid)
)
select
  q.id,
  q.status::text,
  q.source_reference,
  exists(select 1 from public.exam_items e where e.question_id=q.id) as has_exam_item,
  exists(select 1 from public.mastery_evidence e where e.question_id=q.id) as has_mastery_evidence,
  exists(select 1 from public.question_reports e where e.question_id=q.id) as has_report,
  exists(select 1 from public.question_stats e where e.question_id=q.id) as has_stats
from legacy x
left join public.questions q on q.id=x.id
order by x.id;

-- 6) SECURITY DEFINER client-execution exposure.
select
  p.oid::regprocedure::text as function_signature,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
  and p.prosecdef
order by 1;
