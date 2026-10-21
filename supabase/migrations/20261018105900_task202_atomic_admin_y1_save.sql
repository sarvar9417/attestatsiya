-- TASK-202: one transactional RPC for Y1 admin authoring.
-- Separate PostgREST writes formerly left broken answer keys on partial failures.
begin;
create or replace function public.save_admin_y1_question(
 p_actor_id uuid,p_question_id uuid,p_construct_id uuid,
 p_stem text,p_cognitive public.cognitive_level,p_difficulty integer,
 p_options text[],p_correct_index integer,p_explanation text
) returns uuid
language plpgsql security definer set search_path=''
as $save$
declare
 v_q public.questions%rowtype;
 v_construct public.constructs%rowtype;
 v_id uuid; v_option_id uuid; v_correct uuid; i integer;
begin
 if not exists (select 1 from public.profiles
   where id=p_actor_id and role in ('editor','admin')
     and coalesce(is_blocked,false)=false)
 then raise exception using errcode='42501',message='ADMIN_Y1_EDITOR_REQUIRED';end if;
 if p_stem is null or length(btrim(p_stem))<4 or length(p_stem)>12000
   or p_cognitive is null or p_difficulty not between 1 and 5
   or p_correct_index not between 0 and 3
   or cardinality(p_options)<>4 or p_explanation is null
   or length(p_explanation)>12000
 then raise exception using errcode='23514',message='ADMIN_Y1_INVALID_CONTENT';end if;
 if exists(select 1 from unnest(p_options) x where x is null
   or length(btrim(x))<2 or length(x)>4000)
   or (select count(distinct lower(btrim(x))) from unnest(p_options) x)<>4
 then raise exception using errcode='23514',message='ADMIN_Y1_INVALID_OPTIONS';end if;
 select * into strict v_construct from public.constructs
  where id=p_construct_id and is_active;
 if p_question_id is null then
   v_id:=gen_random_uuid();
   insert into public.questions(
     id,subject_id,construct_id,group_code,format,cognitive,difficulty,
     stem_md,status,author_id,is_generated)
   values(v_id,v_construct.subject_id,v_construct.id,v_construct.group_code,
     'Y1'::public.question_format,p_cognitive,p_difficulty,btrim(p_stem),
     'draft'::public.content_status,p_actor_id,false);
 else
   select * into strict v_q from public.questions
     where id=p_question_id for update;
   if v_q.format<>'Y1'::public.question_format or
      v_q.status not in ('draft'::public.content_status,'review'::public.content_status)
      or exists(select 1 from public.pedagogy_published_revisions
         where question_id=p_question_id)
   then raise exception using errcode='23514',
        message='ADMIN_Y1_IMMUTABLE_OR_WRONG_FORMAT';end if;
   if v_q.source_lesson_id is not null
     and not exists(select 1 from public.lesson_constructs lc
       where lc.lesson_id=v_q.source_lesson_id and lc.construct_id=p_construct_id)
   then raise exception using errcode='23514',
     message='ADMIN_Y1_SOURCE_CONSTRUCT_MISMATCH';end if;
   v_id:=p_question_id;
   update public.questions set
     subject_id=v_construct.subject_id,construct_id=v_construct.id,
     group_code=v_construct.group_code,stem_md=btrim(p_stem),
     cognitive=p_cognitive,difficulty=p_difficulty,updated_at=now()
   where id=v_id;
   delete from public.question_keys where question_id=v_id;
   delete from public.question_options where question_id=v_id;
 end if;
 for i in 1..4 loop
   v_option_id:=gen_random_uuid();
   insert into public.question_options(id,question_id,side,order_idx,content_md)
   values(v_option_id,v_id,'a',i-1,btrim(p_options[i]));
   if i=p_correct_index+1 then v_correct:=v_option_id;end if;
 end loop;
 insert into public.question_keys(question_id,payload,explanation_md)
 values(v_id,jsonb_build_object('correct_option_id',v_correct),btrim(p_explanation));
 return v_id;
end;
$save$;
revoke all on function public.save_admin_y1_question(
 uuid,uuid,uuid,text,public.cognitive_level,integer,text[],integer,text)
 from public,anon,authenticated;
grant execute on function public.save_admin_y1_question(
 uuid,uuid,uuid,text,public.cognitive_level,integer,text[],integer,text)
 to service_role;
commit;