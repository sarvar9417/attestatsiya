-- Ephemeral CI-only record: mimic a historical published demo question with
-- no provenance. Not a production data seed. Must be archived, never deleted.
begin;
insert into public.questions (
  id,subject_id,construct_id,group_code,format,cognitive,
  difficulty,stem_md,status,source_reference,source_lesson_id
)
select
 '00000000-0000-0000-0000-0000a0a00001'::uuid,
 q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,
 q.difficulty,'CI-only source-less demo question',
 'published'::public.content_status,null,null
from public.questions q
where q.status='published'::public.content_status and q.source_reference is not null
order by q.id
limit 1
on conflict (id) do nothing;
commit;