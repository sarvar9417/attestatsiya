-- TASK-332: READ-ONLY module mock capacity and editorial provenance audit.
-- Mirrors generate_section_mock's published, keyed, active, matching-taxonomy
-- construct pool. Does NOT start exams or expose answer keys.
with published_lessons as (
  select m.id module_id, m.code module_code, m.title_uz module_title,
         l.id lesson_id
  from public.modules m
  join public.lessons l on l.module_id=m.id and l.status='published'
  where m.status='published'
),
module_constructs as (
  select distinct pl.module_id, pl.module_code, pl.module_title,
         c.id construct_id, c.group_code
  from published_lessons pl
  join public.lesson_constructs lc on lc.lesson_id=pl.lesson_id
  join public.constructs c on c.id=lc.construct_id and c.is_active
),
eligible as (
  select distinct mc.module_id, q.id question_id, q.source_lesson_id,
         q.format, q.source_reference
  from module_constructs mc
  join public.questions q on q.construct_id=mc.construct_id
    and q.group_code=mc.group_code and q.status='published'
  join public.question_keys k on k.question_id=q.id
),
metrics as (
  select m.id module_id, m.code, m.title_uz,
    (select count(*) from published_lessons pl where pl.module_id=m.id) published_lessons,
    (select count(distinct e.question_id) from eligible e where e.module_id=m.id) eligible_count,
    (select count(distinct e.source_lesson_id) from eligible e
      join published_lessons pl on pl.module_id=e.module_id
        and pl.lesson_id=e.source_lesson_id where e.module_id=m.id) directly_assessable_topics,
    (select count(distinct e.question_id) from eligible e
      join public.question_editorial_checks ch on ch.question_id=e.question_id
      where e.module_id=m.id and ch.answer_verified and ch.reference_verified
        and ch.wording_verified and ch.original_authorship_verified) fully_signed,
    (select count(distinct e.question_id) from eligible e
      where e.module_id=m.id and e.source_reference like '%AI_REVIEW_NOT_INDEPENDENT_HUMAN%') ai_only_source_flagged
  from public.modules m where m.status='published'
)
select code, title_uz, published_lessons, directly_assessable_topics,
       eligible_count, (eligible_count >= 50) technically_ready_for_50,
       greatest(50-eligible_count,0) shortfall,
       fully_signed, ai_only_source_flagged
from metrics order by code;