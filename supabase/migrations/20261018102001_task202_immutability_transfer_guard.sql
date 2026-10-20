-- TASK-202: stop option/key reassignment escaping immutable published snapshots.
-- PostgreSQL UPDATE exposes OLD and NEW question_id; both must be checked.
begin;
create or replace function public.guard_pedagogy_published_revision()
returns trigger language plpgsql security definer set search_path=''
as $lock$
declare v_locked boolean;
begin
 if tg_table_name='questions' then
   select exists(select 1 from public.pedagogy_published_revisions
    where question_id=old.id) into v_locked;
   if not v_locked then
     if tg_op='DELETE' then return old;else return new;end if;
   end if;
   if tg_op='UPDATE' then
     if old.status='published'::public.content_status
       and new.status in ('published'::public.content_status,'archived'::public.content_status)
       and (to_jsonb(old)-'status'-'updated_at') =
           (to_jsonb(new)-'status'-'updated_at')
     then return new;end if;
   end if;
 else
   if tg_op='INSERT' then
     select exists(select 1 from public.pedagogy_published_revisions
       where question_id=new.question_id) into v_locked;
   elsif tg_op='DELETE' then
     select exists(select 1 from public.pedagogy_published_revisions
       where question_id=old.question_id) into v_locked;
   else
     -- An UPDATE can transplant an option/key from a locked question.
     select exists(select 1 from public.pedagogy_published_revisions
       where question_id in (old.question_id,new.question_id)) into v_locked;
   end if;
   if not v_locked then
     if tg_op='DELETE' then return old;else return new;end if;
   end if;
 end if;
 raise exception using errcode='23514',
  message='PEDAGOGY_PUBLISHED_REVISION_IMMUTABLE: create a new question revision';
end;
$lock$;
revoke all on function public.guard_pedagogy_published_revision() from public,anon,authenticated;
commit;
