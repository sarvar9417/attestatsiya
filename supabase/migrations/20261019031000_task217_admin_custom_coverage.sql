-- TASK-217: admin-only coverage for custom test availability.
-- Service role only; precise published/keyed/source-traced eligibility.
begin;
create or replace function public.admin_custom_exam_pool_coverage()
returns jsonb language sql stable security definer set search_path=''
as $coverage$
with eligible as (
  select q.id,q.source_lesson_id,q.difficulty,q.format
  from public.questions q
  join public.constructs c on c.id=q.construct_id
  join public.question_keys k on k.question_id=q.id
  where q.status='published'::public.content_status
    and c.is_active and c.group_code=q.group_code
    and q.source_reference is not null
    and exists (
      select 1 from public.lesson_constructs lc
      where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
    )
    and (
      (q.format='Y1'::public.question_format
        and (select count(*) from public.question_options o where o.question_id=q.id and o.side='a')>=2
        and exists(select 1 from public.question_options o where o.question_id=q.id
          and o.side='a' and o.id::text=k.payload->>'correct_option_id'))
      or (q.format='Y2'::public.question_format
        and jsonb_typeof(k.payload->'pairs')='object'
        and exists(select 1 from public.question_options o where o.question_id=q.id and o.side='a')
        and exists(select 1 from public.question_options o where o.question_id=q.id and o.side='b'))
      or (q.format='Y3'::public.question_format
        and jsonb_typeof(k.payload->'order')='array'
        and (select count(*) from public.question_options o where o.question_id=q.id and o.side='a')>=2)
    )
),
counts as (
  select m.code as module_code,l.id as lesson_id,l.title_uz as lesson_title,
    count(q.id)::int as total,
    count(q.id) filter (where q.difficulty=1)::int as a,
    count(q.id) filter (where q.difficulty=2)::int as b,
    count(q.id) filter (where q.difficulty=3)::int as c,
    count(q.id) filter (where q.difficulty=4)::int as d,
    count(q.id) filter (where q.difficulty=5)::int as e,
    count(q.id) filter (where q.format='Y1')::int as y1,
    count(q.id) filter (where q.format='Y2')::int as y2,
    count(q.id) filter (where q.format='Y3')::int as y3,
    m.order_idx as module_order,l.order_idx as lesson_order
  from public.modules m
  join public.lessons l on l.module_id=m.id
  left join eligible q on q.source_lesson_id=l.id
  where m.status='published' and l.status='published'
  group by m.code,m.order_idx,l.id,l.title_uz,l.order_idx
)
select coalesce(jsonb_agg(
  to_jsonb(counts)-'module_order'-'lesson_order'
  order by module_order,lesson_order,lesson_title),'[]'::jsonb)
from counts
$coverage$;
revoke all on function public.admin_custom_exam_pool_coverage() from public,anon,authenticated;
grant execute on function public.admin_custom_exam_pool_coverage() to service_role;
commit;
