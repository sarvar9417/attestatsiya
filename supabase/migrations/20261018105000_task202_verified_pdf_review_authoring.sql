-- TASK-202: convert one independently verified, construct-mapped private PDF
-- source candidate to original, human-authored REVIEW question with balanced Y1.
-- Raw source wording and source answer markers remain private.
begin;
create or replace function public.stage_verified_pdf_pedagogy_question(
 p_candidate_id uuid,
 p_actor_id uuid,
 p_stem text,
 p_options text[],
 p_correct_index integer,
 p_explanation text
)
returns uuid
language plpgsql security definer set search_path=''
as $stage$
declare
 v_source public.pedagogy_pdf_source_candidates%rowtype;
 v_c public.constructs%rowtype;
 v_lesson uuid;
 v_question uuid;
 v_option uuid;
 v_correct_option uuid;
 v_count int;
 v_min int;
 v_max int;
 v_longest_wrong int;
 v_correct_len int;
 i int;
begin
 if not exists(select 1 from public.profiles
  where id=p_actor_id and role in ('editor','admin')
   and coalesce(is_blocked,false)=false)
 then raise exception using errcode='42501', message='PEDAGOGY_EDITOR_REQUIRED';end if;
 select * into strict v_source from public.pedagogy_pdf_source_candidates
 where id=p_candidate_id for update;
 if v_source.linked_question_id is not null then return v_source.linked_question_id;end if;
 if v_source.editorial_status<>'verified'
 or v_source.answer_key_status<>'independently_verified'
 or v_source.mapped_construct_id is null
 or v_source.duplicate_of_candidate_id is not null
 or v_source.near_duplicate_of_candidate_id is not null then
   raise exception using errcode='23514',
    message='PEDAGOGY_PDF_INDEPENDENT_VERIFICATION_REQUIRED';
 end if;
 select * into strict v_c from public.constructs
 where id=v_source.mapped_construct_id and is_active
 and group_code in('KS','PM.GEN','PM.MET');
 select l.id into v_lesson from public.lesson_constructs lc
 join public.lessons l on l.id=lc.lesson_id
 where lc.construct_id=v_c.id and l.status='published'::public.content_status
 order by l.id limit 1;
 if v_lesson is null then raise exception using errcode='23514',message='PEDAGOGY_PDF_LESSON_REQUIRED';end if;
 if p_correct_index not between 0 and 3 or cardinality(p_options)<>4 or
   length(btrim(coalesce(p_stem,'')))<15 or
   length(btrim(coalesce(p_explanation,'')))<12 then
   raise exception using errcode='23514',message='PEDAGOGY_PDF_REVIEW_CONTENT_INCOMPLETE';
 end if;
 if exists (select 1 from unnest(p_options) o
  where o is null or length(btrim(o))<2 or length(o)>4000)
 or (select count(distinct lower(btrim(o))) from unnest(p_options) o)<>4 then
   raise exception using errcode='23514',message='PEDAGOGY_PDF_OPTIONS_INVALID';
 end if;
 select count(*),min(wc),max(wc),
   max(wc) filter(where option_index=p_correct_index+1),
   max(wc) filter(where option_index<>p_correct_index+1)
 into v_count,v_min,v_max,v_correct_len,v_longest_wrong
 from (
   select ordinality::integer as option_index,
    cardinality(regexp_split_to_array(btrim(option),'[[:space:]]+')) wc
   from unnest(p_options) with ordinality as t(option,ordinality)
 ) t;
 if v_count<>4 or v_min<2 or v_max>v_min*1.8 or
    v_correct_len>v_longest_wrong*1.25 then
   raise exception using errcode='23514',message='PEDAGOGY_PDF_OPTION_LENGTH_BIAS';
 end if;

 v_question:=gen_random_uuid();
 insert into public.questions(
   id,subject_id,construct_id,group_code,format,cognitive,difficulty,
   stem_md,is_generated,status,author_id,source_reference,source_lesson_id
 ) values (
   v_question,v_c.subject_id,v_c.id,v_c.group_code,
   'Y1'::public.question_format,'qollash'::public.cognitive_level,3,
   btrim(p_stem),false,'review'::public.content_status,p_actor_id,
   'authored:pedagogy-pdf-corpus:manual:'||p_candidate_id::text,v_lesson
 );
 for i in 1..4 loop
   v_option:=gen_random_uuid();
   insert into public.question_options(id,question_id,side,order_idx,content_md)
   values(v_option,v_question,'a',i-1,btrim(p_options[i]));
   if i=p_correct_index+1 then v_correct_option:=v_option;end if;
 end loop;
 insert into public.question_keys(question_id,payload,explanation_md)
 values(v_question,jsonb_build_object('correct_option_id',v_correct_option),btrim(p_explanation));
 update public.pedagogy_pdf_source_candidates
 set linked_question_id=v_question,reviewed_at=coalesce(reviewed_at,now())
 where id=p_candidate_id;
 return v_question;
end;
$stage$;
revoke all on function public.stage_verified_pdf_pedagogy_question(
uuid,uuid,text,text[],integer,text) from public,anon,authenticated;
grant execute on function public.stage_verified_pdf_pedagogy_question(
uuid,uuid,text,text[],integer,text) to service_role;
commit;
