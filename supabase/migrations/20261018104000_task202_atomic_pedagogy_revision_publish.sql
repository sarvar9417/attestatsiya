-- TASK-202: replace a published biased pedagogy Y1 atomically after human review.
-- No legacy exam items or score rows are touched.
begin;
create or replace function public.publish_pedagogy_revision(
 p_revision_question_id uuid,p_actor_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path=''
as $release$
declare
 v_source uuid;
 v_author uuid;
 v_status public.content_status;
 v_prior_status public.content_status;
begin
 if p_actor_id is null or not exists(
    select 1 from public.profiles
    where id=p_actor_id and role='admin' and coalesce(is_blocked,false)=false
 ) then
    raise exception using errcode='42501',message='PEDAGOGY_ADMIN_REQUIRED';
 end if;

 select source_question_id into v_source
 from public.pedagogy_revision_queue
 where revision_question_id=p_revision_question_id for update;
 if not found then
    raise exception using errcode='23514',message='PEDAGOGY_REVISION_LINK_REQUIRED';
 end if;
 select status,author_id into strict v_status,v_author from public.questions
 where id=p_revision_question_id for update;
 select status into strict v_prior_status from public.questions
 where id=v_source for update;
 if v_status<>'review'::public.content_status
    or v_prior_status<>'published'::public.content_status
    or v_author=p_actor_id then
    raise exception using errcode='23514',message='PEDAGOGY_INDEPENDENT_REVIEW_REQUIRED';
 end if;

 -- Existing DB gate verifies 4 human review booleans, fingerprint,
 -- question provenance and option-length invariants.
 update public.questions set status='published'::public.content_status,
    updated_at=now() where id=p_revision_question_id;

 -- Existing immutable guard permits only this status transition and
 -- leaves all question content, options, keys and historic attempts unchanged.
 update public.questions set status='archived'::public.content_status,
    updated_at=now() where id=v_source;
 return jsonb_build_object(
    'id',p_revision_question_id,'status','published',
    'archived_source_question_id',v_source);
end;
$release$;
revoke all on function public.publish_pedagogy_revision(uuid,uuid)
 from public,anon,authenticated;
grant execute on function public.publish_pedagogy_revision(uuid,uuid) to service_role;
commit;
