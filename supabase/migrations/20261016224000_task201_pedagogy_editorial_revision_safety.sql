-- TASK-201: editorial release gate + published-revision immutability for pedagogy.
-- Existing published pedagogic items are grandfathered, not re-approved.
-- Review items (including PDF-derived) are NEVER auto-published.
begin;

-- Only the service role can query publication lock metadata.
create table if not exists public.pedagogy_published_revisions (
  question_id uuid primary key references public.questions(id) on delete restrict,
  content_fingerprint text not null,
  first_published_at timestamptz not null default now()
);
alter table public.pedagogy_published_revisions enable row level security;
revoke all on public.pedagogy_published_revisions from public, anon, authenticated;
grant select,insert on public.pedagogy_published_revisions to service_role;

-- Prevent recycling approvals by modifying assets or source metadata.
create or replace function public.professional_question_fingerprint(p_question_id uuid)
returns text language sql stable security definer set search_path=''
as $fp$
 select md5(concat_ws('|',
   q.id::text, q.subject_id::text, q.stem_md, q.construct_id::text,
   q.group_code, q.format::text, q.cognitive::text, q.difficulty::text,
   q.assets::text, q.source_reference, q.source_lesson_id::text,
   coalesce((select jsonb_agg(jsonb_build_object('id',o.id,'side',o.side,
     'order_idx',o.order_idx,'content_md',o.content_md)
     order by o.side,o.order_idx)::text from public.question_options o
     where o.question_id=q.id),'[]'),
   coalesce((select k.payload::text || '|' || k.explanation_md
     from public.question_keys k where k.question_id=q.id),'')
 )) from public.questions q where q.id=p_question_id;
$fp$;
revoke all on function public.professional_question_fingerprint(uuid) from public,anon,authenticated;
grant execute on function public.professional_question_fingerprint(uuid) to service_role;

-- Broaden the existing private editorial checklist from PedGuli to PDF-derived
-- and all new KS / PM.GEN / PM.MET questions; allow signoff ONLY in review.
create or replace function public.fill_question_editorial_fingerprint()
returns trigger language plpgsql security definer set search_path=''
as $check$
declare v_group text; v_source text; v_status public.content_status;
begin
 select group_code,source_reference,status into v_group,v_source,v_status
 from public.questions where id=new.question_id;
 if v_group is null or not (
    v_group in ('KS','PM.GEN','PM.MET') or v_source like 'authored:pedguli-%'
    or v_source like 'authored:pedagogy-pdf-corpus:%'
 ) then
   raise exception using errcode='23514',
     message='PEDAGOGY_EDITORIAL_SCOPE_INVALID';
 end if;
 if v_status<>'review'::public.content_status then
   raise exception using errcode='23514',
     message='PEDAGOGY_EDITORIAL_REVIEW_STATUS_REQUIRED';
 end if;
 new.content_fingerprint:=public.professional_question_fingerprint(new.question_id);
 new.reviewed_at:=now();
 return new;
end;
$check$;

-- Publication requires verified source, 4 well-balanced options for Y1,
-- and the unchanged review checklist with all four independent approvals.
create or replace function public.guard_pedguli_question_publish()
returns trigger language plpgsql security definer set search_path=''
as $publish$
declare
 v_count int; v_correct_count int; v_min int; v_max int;
 v_correct_len int; v_max_wrong int;
begin
 if new.status<>'published'::public.content_status then return new;end if;
 if not (new.group_code in ('KS','PM.GEN','PM.MET')
   or new.source_reference like 'authored:pedguli-%'
   or new.source_reference like 'authored:pedagogy-pdf-corpus:%')
 then return new; end if;
 if tg_op='UPDATE'
   and old.status='published'::public.content_status
   and old.group_code is not distinct from new.group_code
   and old.source_reference is not distinct from new.source_reference
 then return new; end if;

 -- A fresh published INSERT cannot already have a complete signed question
 -- because the question, options and key must first exist in REVIEW.
 if tg_op='INSERT' then
   raise exception using errcode='23514', message='PEDAGOGY_REVIEW_BEFORE_PUBLICATION_REQUIRED';
 end if;
 -- A combined status+wording update must not reuse a fingerprint of OLD data.
 -- Publish may only change the status of the exact reviewed revision.
 if (to_jsonb(new)-'status'-'updated_at') <>
    (to_jsonb(old)-'status'-'updated_at') then
   raise exception using errcode='23514',
     message='PEDAGOGY_EDIT_AND_PUBLISH_SEPARATELY';
 end if;
 if new.source_reference is null or new.source_lesson_id is null
   or not exists(select 1 from public.constructs c where c.id=new.construct_id
      and c.group_code=new.group_code and c.is_active)
   or not exists(select 1 from public.lesson_constructs lc join public.lessons l
     on l.id=lc.lesson_id where lc.lesson_id=new.source_lesson_id
     and lc.construct_id=new.construct_id and l.status='published'::public.content_status)
 then raise exception using errcode='23514', message='PEDAGOGY_SOURCE_OR_TAXONOMY_INVALID'; end if;
 if not exists (
   select 1 from public.question_editorial_checks e where e.question_id=new.id
   and e.answer_verified and e.reference_verified and e.wording_verified
   and e.original_authorship_verified
   and length(trim(e.reviewer_notes))>=20
   and e.content_fingerprint=public.professional_question_fingerprint(new.id)
 ) then
   raise exception using errcode='23514', message='PEDAGOGY_EDITORIAL_APPROVAL_REQUIRED';
 end if;

 if new.format='Y1'::public.question_format then
   with option_words as (
      select o.id,
        array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) as wc,
        (o.id::text=k.payload->>'correct_option_id') as is_correct
      from public.question_options o
      join public.question_keys k on k.question_id=o.question_id
      where o.question_id=new.id and o.side='a'
   ) select count(*),count(*) filter(where is_correct),min(wc),max(wc),
      max(wc) filter(where is_correct), max(wc) filter(where not is_correct)
     into v_count,v_correct_count,v_min,v_max,v_correct_len,v_max_wrong
     from option_words;
   if v_count<>4 or v_correct_count<>1 or v_min is null or v_min=0
       or v_max>v_min*1.8 or v_correct_len>v_max_wrong*1.25 then
     raise exception using errcode='23514',
       message='PEDAGOGY_Y1_DISTRACTOR_REVIEW_REQUIRED';
   end if;
 end if;
 return new;
end;
$publish$;

-- Include construct and group changes as publication trigger events.
drop trigger if exists pedguli_publish_guard on public.questions;
create trigger pedguli_publish_guard
before insert or update of status,source_reference,group_code,construct_id on public.questions
for each row execute function public.guard_pedguli_question_publish();

-- Create immutable fingerprints of all historically published professional items.
insert into public.pedagogy_published_revisions(question_id,content_fingerprint)
select q.id,public.professional_question_fingerprint(q.id)
from public.questions q
where q.status='published'::public.content_status
  and (q.group_code in ('KS','PM.GEN','PM.MET')
     or q.source_reference like 'authored:pedguli-%'
     or q.source_reference like 'authored:pedagogy-pdf-corpus:%')
on conflict (question_id) do nothing;

create or replace function public.guard_pedagogy_published_revision()
returns trigger language plpgsql security definer set search_path=''
as $lock$
declare v_id uuid; v_is_locked boolean;
begin
 if tg_table_name='questions' then
   v_id:=old.id;
 else
   v_id:=case when tg_op='DELETE' then old.question_id else new.question_id end;
 end if;
 select exists(select 1 from public.pedagogy_published_revisions
   where question_id=v_id) into v_is_locked;
 if not v_is_locked then
   if tg_op='DELETE' then return old;else return new;end if;
 end if;
 if tg_table_name='questions' and tg_op='UPDATE' then
   -- The only state transition of a published snapshot is published -> archived.
   -- All other fields (including source and answers) are immutable forever.
   if old.status='published'::public.content_status
      and new.status in ('published'::public.content_status,'archived'::public.content_status)
      and (to_jsonb(old)-'status'-'updated_at')=
          (to_jsonb(new)-'status'-'updated_at')
   then return new;end if;
 end if;
 raise exception using errcode='23514',
   message='PEDAGOGY_PUBLISHED_REVISION_IMMUTABLE: create a new question revision';
end;
$lock$;

drop trigger if exists pedagogy_published_question_lock on public.questions;
create trigger pedagogy_published_question_lock
before update or delete on public.questions for each row
execute function public.guard_pedagogy_published_revision();
drop trigger if exists pedagogy_published_options_lock on public.question_options;
create trigger pedagogy_published_options_lock
before insert or update or delete on public.question_options for each row
execute function public.guard_pedagogy_published_revision();
drop trigger if exists pedagogy_published_keys_lock on public.question_keys;
create trigger pedagogy_published_keys_lock
before insert or update or delete on public.question_keys for each row
execute function public.guard_pedagogy_published_revision();

create or replace function public.register_pedagogy_published_revision()
returns trigger language plpgsql security definer set search_path=''
as $register$
begin
 if new.status='published'::public.content_status
   and (new.group_code in ('KS','PM.GEN','PM.MET')
     or new.source_reference like 'authored:pedguli-%'
     or new.source_reference like 'authored:pedagogy-pdf-corpus:%')
 then
   insert into public.pedagogy_published_revisions(question_id,content_fingerprint)
   values(new.id,public.professional_question_fingerprint(new.id))
   on conflict (question_id) do nothing;
 end if;
 return new;
end;
$register$;
drop trigger if exists pedagogy_publication_snapshot on public.questions;
create trigger pedagogy_publication_snapshot
after insert or update of status,group_code,source_reference on public.questions
for each row execute function public.register_pedagogy_published_revision();

revoke all on function public.guard_pedagogy_published_revision() from public,anon,authenticated;
revoke all on function public.register_pedagogy_published_revision() from public,anon,authenticated;
commit;
