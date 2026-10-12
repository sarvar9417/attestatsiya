-- Private source-candidate inbox for the 1,394 distinct messages from a
-- user-provided Telegram Desktop HTML export (@PedMahoratGuli).
-- These are NOT question-bank items and MUST NOT enter learner exams.
-- Never commit raw Telegram post texts into the public Git repository.
-- Staged draft migration: DO NOT APPLY TO PRODUCTION without final user approval.
begin;
create table if not exists public.pedguli_source_candidates (
  id uuid primary key default gen_random_uuid(),
  source_channel text not null default '@PedMahoratGuli'
    check (source_channel='@PedMahoratGuli'),
  source_message_id bigint not null check (source_message_id>0),
  source_url text not null check (source_url ~ '^https://t[.]me/PedMahoratGuli/[1-9][0-9]*$'),
  source_html text not null check (source_html ~ '^messages([0-9]+)?[.]html$'),
  date_local text,
  text_sha256 char(64) not null check(text_sha256 ~ '^[a-f0-9]{64}$'),
  raw_text_private text not null check(length(raw_text_private) between 20 and 30000),
  suggested_constructs text[] not null default '{}'::text[],
  media_present boolean not null default false,
  key_marker_unverified boolean not null default false,
  editorial_status text not null default 'needs_review'
    check(editorial_status in ('needs_review','needs_source','needs_rights','verified','rejected')),
  rights_status text not null default 'not_cleared'
    check(rights_status in ('not_cleared','permission_granted','not_reusable')),
  answer_key_status text not null default 'unverified'
    check(answer_key_status in ('unverified','needs_source','independently_verified')),
  historical_exam_claim_status text not null default 'unverified'
    check(historical_exam_claim_status in ('unverified','independently_verified','not_claimed')),
  linked_question_id uuid references public.questions(id) on delete set null,
  reviewer_id uuid references auth.users(id) on delete set null,
  review_notes text not null default '' check(length(review_notes)<=4000),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint pedguli_candidate_message_uniq unique(source_channel,source_message_id),
  constraint pedguli_candidate_text_uniq unique(source_channel,text_sha256)
);
create index if not exists idx_pedguli_candidate_review
on public.pedguli_source_candidates(editorial_status,created_at desc);
create index if not exists idx_pedguli_candidate_constructs
on public.pedguli_source_candidates using gin(suggested_constructs);

alter table public.pedguli_source_candidates enable row level security;
-- No anon/authenticated policies are added. Only the server's service-role
-- credentials may read original third-party text (after admin authorization).
revoke all on public.pedguli_source_candidates from public,anon,authenticated;
grant select,insert,update,delete on public.pedguli_source_candidates to service_role;

-- Invariant: importing candidate messages cannot approve, publish or make them
-- available to exam selection. Human editorial review is separate from import.
create or replace function public.guard_pedguli_candidate_initial_state()
returns trigger
language plpgsql security definer set search_path=''
as $fn$
begin
  if tg_op='INSERT' and
    (new.editorial_status <> 'needs_review'
      or new.rights_status <> 'not_cleared'
      or new.answer_key_status <> 'unverified'
      or new.historical_exam_claim_status <> 'unverified'
      or new.linked_question_id is not null
      or new.reviewer_id is not null
      or new.reviewed_at is not null)
  then
    raise exception using errcode='23514',
    message='PEDGULI_CANDIDATE_REVIEW_REQUIRED: import may not auto-approve';
  end if;
  if new.source_url <> 'https://t.me/PedMahoratGuli/'||new.source_message_id::text then
    raise exception using errcode='23514',
    message='PEDGULI_SOURCE_ID_MISMATCH';
  end if;
  return new;
end;
$fn$;
drop trigger if exists pedguli_candidate_initial_state_guard on public.pedguli_source_candidates;
create trigger pedguli_candidate_initial_state_guard
before insert or update of source_message_id,source_url
on public.pedguli_source_candidates
for each row execute function public.guard_pedguli_candidate_initial_state();
commit;