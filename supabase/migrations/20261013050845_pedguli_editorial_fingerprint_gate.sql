-- Pedmahorat-derived original questions: mandatory editorial signoff.
-- Structural CI green DOES NOT certify answer/pedagogical correctness.
-- A stored fingerprint prevents approval from surviving changes to wording,
-- answer key, options, construct or pedagogical explanation.
-- This migration is staged only. Do not apply to production before user approval.
begin;

create table if not exists public.question_editorial_checks (
  question_id uuid primary key references public.questions(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete restrict,
  answer_verified boolean not null default false,
  reference_verified boolean not null default false,
  wording_verified boolean not null default false,
  original_authorship_verified boolean not null default false,
  reviewer_notes text not null default '' check (length(reviewer_notes) <= 4000),
  content_fingerprint text not null,
  reviewed_at timestamptz not null default now()
);
alter table public.question_editorial_checks enable row level security;
-- Only backend service_role should read/write reviewer records. No user RLS policies.
revoke all on public.question_editorial_checks from anon, authenticated;
grant select, insert, update, delete on public.question_editorial_checks to service_role;

create or replace function public.professional_question_fingerprint(p_question_id uuid)
returns text
language sql
stable
security definer
set search_path=''
as $fp$
  select md5(concat_ws('|',
    q.id::text, q.stem_md, q.construct_id::text,
    q.group_code, q.format::text, q.cognitive::text, q.difficulty::text,
    q.source_reference, q.source_lesson_id::text,
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'side', o.side, 'order_idx', o.order_idx, 'content_md', o.content_md
      ) order by o.side, o.order_idx)::text
      from public.question_options o where o.question_id=q.id
    ), '[]'),
    coalesce((
      select k.payload::text || '|' || k.explanation_md
      from public.question_keys k where k.question_id=q.id
    ), '')
  ))
  from public.questions q where q.id=p_question_id;
$fp$;

revoke all on function public.professional_question_fingerprint(uuid) from public, anon, authenticated;
grant execute on function public.professional_question_fingerprint(uuid) to service_role;

create or replace function public.fill_question_editorial_fingerprint()
returns trigger
language plpgsql
security definer
set search_path=''
as $fn$
declare v_ref text; v_status public.content_status;
begin
 select source_reference,status into v_ref,v_status
 from public.questions where id=new.question_id;
 if v_ref is null or v_ref not like 'authored:pedguli-%' then
    raise exception 'Editorial checks only apply to Pedmahorat-inspired original questions';
 end if;
 if v_status <> 'review'::public.content_status then
    raise exception 'Review checklist may only be saved while a question is in review';
 end if;
 new.content_fingerprint:=public.professional_question_fingerprint(new.question_id);
 new.reviewed_at:=now();
 return new;
end;
$fn$;
drop trigger if exists question_editorial_stamp on public.question_editorial_checks;
create trigger question_editorial_stamp
before insert or update on public.question_editorial_checks
for each row execute function public.fill_question_editorial_fingerprint();

create or replace function public.guard_pedguli_question_publish()
returns trigger
language plpgsql
security definer
set search_path=''
as $fn$
begin
 if new.status='published'::public.content_status
   and new.source_reference like 'authored:pedguli-%'
   and (tg_op='INSERT' or old.status is distinct from new.status
     or old.source_reference is distinct from new.source_reference)
 then
   if not exists (
      select 1 from public.question_editorial_checks e
      where e.question_id=new.id
        and e.answer_verified and e.reference_verified
        and e.wording_verified and e.original_authorship_verified
        and length(trim(e.reviewer_notes)) >= 20
        and e.content_fingerprint=public.professional_question_fingerprint(new.id)
   ) then
      raise exception using
        errcode='23514',
        message='PEDGULI_EDITORIAL_APPROVAL_REQUIRED: check answers, pedagogy sources, wording, authorship, and unchanged content';
   end if;
 end if;
 return new;
end;
$fn$;
drop trigger if exists pedguli_publish_guard on public.questions;
create trigger pedguli_publish_guard
before insert or update of status, source_reference on public.questions
for each row execute function public.guard_pedguli_question_publish();

commit;
