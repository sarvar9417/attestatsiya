-- Prevent silently modifying published Pedmahorat-inspired questions after
-- editorial signoff. To revise: archive -> draft -> review -> sign off -> publish.
-- There is no need to rewrite any existing question, answer, or attempt record.
begin;
create or replace function public.guard_pedguli_published_mutation()
returns trigger
language plpgsql
security definer
set search_path=''
as $g$
declare v_question uuid; v_locked boolean;
begin
 if TG_TABLE_NAME='questions' then
   if old.status='published'::public.content_status
      and old.source_reference like 'authored:pedguli-%'
      and new.status='published'::public.content_status
   then
     raise exception using errcode='23514',
     message='PEDGULI_PUBLISHED_ITEM_LOCKED: archive before editing a published source-reviewed question';
   end if;
   return new;
 end if;
 if TG_OP='DELETE' then v_question:=old.question_id;
 else v_question:=new.question_id; end if;
 select (q.status='published'::public.content_status
       and q.source_reference like 'authored:pedguli-%')
 into v_locked from public.questions q where q.id=v_question;
 if coalesce(v_locked,false) then
   raise exception using errcode='23514',
     message='PEDGULI_PUBLISHED_OPTIONS_LOCKED: archive question before changing options or key';
 end if;
 if TG_OP='DELETE' then return old; else return new;end if;
end;
$g$;
drop trigger if exists pedguli_published_question_lock on public.questions;
create trigger pedguli_published_question_lock
before update of stem_md, construct_id, group_code, format, cognitive,
difficulty, source_reference, source_lesson_id on public.questions
for each row execute function public.guard_pedguli_published_mutation();

drop trigger if exists pedguli_published_options_lock on public.question_options;
create trigger pedguli_published_options_lock
before insert or update or delete on public.question_options
for each row execute function public.guard_pedguli_published_mutation();

drop trigger if exists pedguli_published_keys_lock on public.question_keys;
create trigger pedguli_published_keys_lock
before insert or update or delete on public.question_keys
for each row execute function public.guard_pedguli_published_mutation();
commit;