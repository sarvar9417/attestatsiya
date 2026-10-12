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

-- 6) Learner-visible legacy lesson drift for modules covered by TASK-064.
-- Canonical source-backed IDs are excluded. Any learner progress/exam/topic-test
-- reference on a remaining published lesson blocks archive/reconciliation.
with canonical(module_code, lesson_id) as (
  values
    ('M02','92000000-0000-4000-8000-000000000001'::uuid),
    ('M02','92000000-0000-4000-8000-000000000002'::uuid),
    ('M02','92000000-0000-4000-8000-000000000003'::uuid),
    ('M02','92000000-0000-4000-8000-000000000004'::uuid),
    ('M03','93000000-0000-4000-8000-000000000001'::uuid),
    ('M03','93000000-0000-4000-8000-000000000002'::uuid),
    ('M03','93000000-0000-4000-8000-000000000003'::uuid),
    ('M03','93000000-0000-4000-8000-000000000004'::uuid),
    ('M04','94000000-0000-4000-8000-000000000001'::uuid),
    ('M04','94000000-0000-4000-8000-000000000002'::uuid),
    ('M04','94000000-0000-4000-8000-000000000003'::uuid),
    ('M04','94000000-0000-4000-8000-000000000004'::uuid),
    ('M05','95000000-0000-4000-8000-000000000001'::uuid),
    ('M05','95000000-0000-4000-8000-000000000002'::uuid),
    ('M05','95000000-0000-4000-8000-000000000003'::uuid),
    ('M06','96000000-0000-4000-8000-000000000001'::uuid),
    ('M06','96000000-0000-4000-8000-000000000002'::uuid),
    ('M06','96000000-0000-4000-8000-000000000003'::uuid),
    ('M06','96000000-0000-4000-8000-000000000004'::uuid),
    ('M07','97000000-0000-4000-8000-000000000001'::uuid),
    ('M07','97000000-0000-4000-8000-000000000002'::uuid),
    ('M07','97000000-0000-4000-8000-000000000003'::uuid),
    ('M07','97000000-0000-4000-8000-000000000004'::uuid),
    ('M07','97000000-0000-4000-8000-000000000005'::uuid),
    ('M08','98000000-0000-4000-8000-000000000001'::uuid),
    ('M08','98000000-0000-4000-8000-000000000002'::uuid),
    ('M08','98000000-0000-4000-8000-000000000003'::uuid),
    ('M08','98000000-0000-4000-8000-000000000004'::uuid),
    ('M08','98000000-0000-4000-8000-000000000005'::uuid),
    ('M10','a1000000-0000-4000-8000-000000000001'::uuid),
    ('M10','a1000000-0000-4000-8000-000000000002'::uuid),
    ('M10','a1000000-0000-4000-8000-000000000003'::uuid),
    ('M11','b1100000-0000-4000-8000-000000000001'::uuid),
    ('M11','b1100000-0000-4000-8000-000000000002'::uuid),
    ('M11','b1100000-0000-4000-8000-000000000003'::uuid),
    ('M12','c1200000-0000-4000-8000-000000000001'::uuid),
    ('M12','c1200000-0000-4000-8000-000000000002'::uuid),
    ('M12','c1200000-0000-4000-8000-000000000003'::uuid),
    ('M12','c1200000-0000-4000-8000-000000000004'::uuid),
    ('M12','c1200000-0000-4000-8000-000000000005'::uuid),
    ('M13','d1300000-0000-4000-8000-000000000001'::uuid),
    ('M13','d1300000-0000-4000-8000-000000000002'::uuid),
    ('M13','d1300000-0000-4000-8000-000000000003'::uuid),
    ('M13','d1300000-0000-4000-8000-000000000004'::uuid),
    ('M13','d1300000-0000-4000-8000-000000000005'::uuid),
    ('M13','d1300000-0000-4000-8000-000000000006'::uuid)
),
legacy as (
  select l.id,l.module_id,l.body_mdx
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code in ('M02','M03','M04','M05','M06','M07','M08','M10','M11','M12','M13')
    and l.status='published'::public.content_status
    and not exists (
      select 1 from canonical c where c.lesson_id=l.id
    )
)
select
  m.code as module_code,
  count(*) as noncanonical_published,
  count(*) filter (where length(coalesce(l.body_mdx,''))=0) as empty_noncanonical,
  count(*) filter (
    where exists(select 1 from public.user_lesson_progress p where p.lesson_id=l.id)
  ) as with_user_progress,
  count(*) filter (
    where exists(select 1 from public.exams e where e.lesson_id=l.id)
  ) as with_exam,
  count(*) filter (
    where exists(select 1 from public.topic_test_attempts t where t.lesson_id=l.id)
  ) as with_topic_test_attempt
from legacy l
join public.modules m on m.id=l.module_id
group by m.code
order by m.code;

-- 7) SECURITY DEFINER client-execution exposure.
select
  p.oid::regprocedure::text as function_signature,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
  and p.prosecdef
order by 1;
