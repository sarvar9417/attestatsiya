-- TASK-303: READ-ONLY verification, safe to rerun after future releases.
-- No answer keys, user identities, source excerpts or full question texts returned.
-- This is NOT a migration and does NOT approve or publish any questions.

-- 1. Previously expert-reviewed 27 candidates and safe replacement outcomes.
with audited as (
  select q.id, q.status, q.format, q.source_reference,
    case when q.source_reference like 'expert-audit:20261019:review-only:%'
      then null::uuid
      else split_part(split_part(q.source_reference,'|',1),':',4)::uuid
    end original_id
  from public.questions q
  where q.source_reference like 'expert-audit:20261019:%'
)
select count(*) as scoped_total,
 count(*) filter(where status='published') as scoped_published,
 count(*) filter(where status='review') as scoped_unpublished,
 count(*) filter(where original_id is null and status='published') as new_published,
 count(*) filter(where original_id is not null and status='published') as replacement_published,
 count(*) filter(where original_id is not null and exists(
   select 1 from public.questions old
   where old.id=audited.original_id and old.status='archived'
 )) as retired_source_count,
 count(*) filter(where original_id is not null and exists(
   select 1 from public.exam_items ei where ei.question_id=audited.original_id
 )) as source_historic_use_count
from audited;

-- 2. Remaining review cohorts by group and format.
select q.group_code,q.format::text as format,
 count(*) as pending_review,
 count(*) filter(where q.source_reference like 'ktd-540-2026:%') as strict_ktd_gate,
 count(*) filter(where q.source_reference like 'GV2:%') as graphics_v2_gate
from public.questions q
where q.status='review'
group by q.group_code,q.format
order by pending_review desc,q.group_code,q.format;

-- 3. KS, PM.GEN and PM.MET review structural readiness ONLY.
-- Do NOT interpret this as independent human editorial approval.
with pedagogy as (
 select q.id,q.group_code,q.format,
 exists(select 1 from public.lesson_constructs lc
   where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id) as valid_lesson,
 exists(select 1 from public.question_keys k
   where k.question_id=q.id and coalesce(length(btrim(k.explanation_md)),0)>=35) as has_rationale,
 (select count(*) from public.question_options o
   where o.question_id=q.id) as option_count,
 (select count(distinct lower(btrim(o.content_md))) from public.question_options o
   where o.question_id=q.id) as distinct_option_count,
 (select count(*) from public.question_options o
   join public.question_keys k on k.question_id=q.id
   where o.question_id=q.id and o.id::text=k.payload->>'correct_option_id') as key_matches,
 exists(select 1 from public.question_editorial_checks ec
   where ec.question_id=q.id
   and ec.answer_verified and ec.reference_verified and ec.wording_verified
   and ec.original_authorship_verified) as signed_editorial_check
 from public.questions q
 where q.status='review' and q.group_code in ('KS','PM.GEN','PM.MET')
)
select group_code,count(*) as review_questions,
 count(*) filter(where format='Y1' and option_count=4
  and distinct_option_count=4 and key_matches=1 and valid_lesson and has_rationale) as schema_ready,
 count(*) filter(where signed_editorial_check) as formally_editorially_verified
from pedagogy
group by group_code order by group_code;

-- 4. Detect raw Y1 correct-option positioning vs. per-exam order support.
-- This is a *bank quality signal*, not proof of exam leakage.
with ranked as (
 select q.group_code,q.id as question_id,
 row_number() over(partition by q.id order by o.order_idx,o.id) as display_rank,
 (o.id::text=k.payload->>'correct_option_id') as correct
 from public.questions q
 join public.question_keys k on k.question_id=q.id
 join public.question_options o on o.question_id=q.id
 where q.status='published' and q.format='Y1'
   and q.group_code in ('KS','PM.GEN','PM.MET')
)
select group_code,count(distinct question_id) as published_y1,
 count(*) filter(where correct and display_rank=1) as raw_first,
 count(*) filter(where correct and display_rank=2) as raw_second,
 count(*) filter(where correct and display_rank=3) as raw_third,
 count(*) filter(where correct and display_rank=4) as raw_fourth
from ranked group by group_code order by group_code;

-- 5. Historical exam ordering coverage; do not update completed attempts.
select count(*) as historic_pedagogy_y1_items,
 count(*) filter(where ei.option_order is not null
   and cardinality(ei.option_order)=4) as four_options_saved,
 count(*) filter(where ei.option_order is null) as legacy_missing_option_order,
 count(*) filter(where ei.option_order is null and e.finished_at is null) as legacy_unfinished
from public.exam_items ei
join public.questions q on q.id=ei.question_id
join public.exams e on e.id=ei.exam_id
where q.group_code in ('KS','PM.GEN','PM.MET') and q.format='Y1';
