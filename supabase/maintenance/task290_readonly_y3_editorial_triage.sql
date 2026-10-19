-- TASK-290. READ-ONLY editorial triage for S3.ALGO Y3 questions.
-- A flag is NOT proof of error; every row needs contextual expert review.
-- Does not read/expose stored answer keys or alter any question.
select
  q.id as question_id,
  q.group_code,
  c.code as construct_code,
  q.cognitive,
  q.status,
  q.source_reference,
  char_length(btrim(q.stem_md)) as stem_length,
  case
    when char_length(btrim(q.stem_md)) < 48 then 'short_context'
    when lower(btrim(q.stem_md)) in
      ('quyidagilarni to‘g‘ri tartiblang.','qiymatlarni tekshirish bosqichlarini tartiblang.')
      then 'generic_instruction'
    when q.stem_md ilike '%WHILE%' and q.stem_md not ilike '%shart%' then 'inspect_loop_backedge'
    else 'review_context'
  end as editorial_triage,
  (select count(*) from public.exam_items ei where ei.question_id=q.id) as historic_exam_count,
  (select count(*) from public.question_options o where o.question_id=q.id) as visible_step_count
from public.questions q
join public.constructs c on c.id=q.construct_id
where q.group_code='S3.ALGO'
  and q.format='Y3'::public.question_format
  and q.status='published'::public.content_status
order by editorial_triage, q.id;
