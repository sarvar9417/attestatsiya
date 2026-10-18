-- TASK-202: non-destructive professional Y1 length-bias remediation queue.
-- Existing published questions and completed exam item references are NEVER updated.
begin;
create table if not exists public.pedagogy_revision_queue (
  source_question_id uuid primary key references public.questions(id) on delete restrict,
  revision_question_id uuid unique references public.questions(id) on delete set null,
  reason text not null default 'correct_answer_disproportionately_long',
  detected_at timestamptz not null default now(),
  constraint pedagogy_revision_not_self check (
    revision_question_id is null or revision_question_id<>source_question_id
  )
);
alter table public.pedagogy_revision_queue enable row level security;
revoke all on public.pedagogy_revision_queue from public, anon, authenticated;
grant select,insert,update on public.pedagogy_revision_queue to service_role;

-- Queue every published Y1 KS/PM item where the correct option exceeds every
-- distractor by 30%+. The queue records risk, not a false claim that the key is wrong.
with counts as (
 select q.id, max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
                filter(where o.id::text=k.payload->>'correct_option_id') cw,
              max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
                filter(where o.id::text<>k.payload->>'correct_option_id') wrongmax
 from public.questions q
 join public.question_keys k on k.question_id=q.id
 join public.question_options o on o.question_id=q.id and o.side='a'
 where q.group_code in ('KS','PM.GEN','PM.MET')
   and q.status='published'::public.content_status
   and q.format='Y1'::public.question_format
 group by q.id
)
insert into public.pedagogy_revision_queue(source_question_id)
select id from counts where cw>1.3*wrongmax
on conflict(source_question_id) do nothing;

create or replace function public.stage_pedagogy_revision(
 p_source_question_id uuid, p_actor_id uuid
)
returns uuid
language plpgsql
security definer
set search_path=''
as $stage$
declare
 v_source public.questions%rowtype;
 v_queue public.pedagogy_revision_queue%rowtype;
 v_new uuid;
 v_old_correct uuid;
 v_new_correct uuid;
 v_option record;
 v_opt_id uuid;
 v_proposed text[];
 v_wrong_idx int:=0;
 v_text text;
begin
 if p_actor_id is null or
   not exists(select 1 from public.profiles
     where id=p_actor_id and role='admin' and coalesce(is_blocked,false)=false)
 then
   raise exception using errcode='42501', message='PEDAGOGY_ADMIN_REQUIRED';
 end if;
 select * into v_queue from public.pedagogy_revision_queue
   where source_question_id=p_source_question_id for update;
 if not found then
   raise exception using errcode='23514', message='PEDAGOGY_REVISION_NOT_QUEUED';
 end if;
 if v_queue.revision_question_id is not null then return v_queue.revision_question_id;end if;

 select * into strict v_source from public.questions
 where id=p_source_question_id and status='published'::public.content_status
   and group_code in ('KS','PM.GEN','PM.MET')
   and format='Y1'::public.question_format;
 select (payload->>'correct_option_id')::uuid into strict v_old_correct
   from public.question_keys where question_id=p_source_question_id;
 if (select count(*) from public.question_options
    where question_id=p_source_question_id and side='a')<>4 then
   raise exception using errcode='23514', message='PEDAGOGY_REVISION_INVALID_SOURCE';
 end if;
 -- Assistant suggestions are drafts, not approvals. Admins may edit the
 -- resulting independent review revision before any signed publication.
 select proposed_distractors into v_proposed
 from public.pedagogy_rewrite_proposals
 where source_question_id=p_source_question_id and proposal_status='draft';
 v_new:=gen_random_uuid();
 insert into public.questions(
   id,subject_id,construct_id,group_code,format,cognitive,difficulty,
   stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
 ) values(
   v_new,v_source.subject_id,v_source.construct_id,v_source.group_code,
   v_source.format,v_source.cognitive,v_source.difficulty,v_source.stem_md,
   v_source.assets,false,'review'::public.content_status,p_actor_id,
   'revision:pedagogy:'||p_source_question_id::text,v_source.source_lesson_id
 );
 for v_option in
   select id,side,order_idx,content_md from public.question_options
   where question_id=p_source_question_id order by side,order_idx,id
 loop
   v_opt_id:=gen_random_uuid();
   v_text:=v_option.content_md;
   if v_option.id<>v_old_correct and v_proposed is not null then
     v_wrong_idx:=v_wrong_idx+1;
     v_text:=v_proposed[v_wrong_idx];
   end if;
   insert into public.question_options(id,question_id,side,order_idx,content_md)
    values(v_opt_id,v_new,v_option.side,v_option.order_idx,v_text);
   if v_option.id=v_old_correct then v_new_correct:=v_opt_id;end if;
 end loop;
 if v_new_correct is null then
   raise exception using errcode='23514', message='PEDAGOGY_REVISION_KEY_MISMATCH';
 end if;
 insert into public.question_keys(question_id,payload,explanation_md)
 select v_new,jsonb_build_object('correct_option_id',v_new_correct),explanation_md
 from public.question_keys where question_id=p_source_question_id;
 update public.pedagogy_revision_queue
    set revision_question_id=v_new where source_question_id=p_source_question_id;
 return v_new;
end;
$stage$;

revoke all on function public.stage_pedagogy_revision(uuid,uuid) from public,anon,authenticated;
grant execute on function public.stage_pedagogy_revision(uuid,uuid) to service_role;
commit;
