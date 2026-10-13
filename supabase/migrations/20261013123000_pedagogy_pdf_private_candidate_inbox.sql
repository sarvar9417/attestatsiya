-- Private inbox for user-provided pedagogy PDF question candidates.
-- Raw historical wording/answer markers stay service-role-only and never enter exams directly.
-- Import creates needs_review records only.

begin;

create table if not exists public.pedagogy_pdf_source_candidates (
  id uuid primary key default gen_random_uuid(),
  source_file_name text not null check(length(source_file_name) between 3 and 255),
  source_year integer check(source_year between 2000 and 2100),
  source_sitting text not null default 'unknown'
    check(source_sitting in ('spring','autumn','diagnostic','unknown')),
  page_no integer not null check(page_no > 0),
  source_question_no integer not null check(source_question_no > 0),
  raw_question_private text not null check(length(raw_question_private) between 10 and 20000),
  raw_answer_private text,
  text_sha256 char(64) not null check(text_sha256 ~ '^[a-f0-9]{64}$'),
  extraction_confidence text not null default 'high'
    check(extraction_confidence in ('high','medium','needs_manual_parse')),
  suggested_constructs text[] not null default '{}'::text[],
  editorial_status text not null default 'needs_review'
    check(editorial_status in ('needs_review','verified','rejected')),
  answer_key_status text not null default 'source_marker_unverified'
    check(answer_key_status in ('source_marker_unverified','independently_verified','conflict','missing')),
  historical_exam_claim_status text not null default 'source_claim_only'
    check(historical_exam_claim_status in ('source_claim_only','independently_verified','not_claimed')),
  linked_question_id uuid references public.questions(id) on delete set null,
  reviewer_id uuid references auth.users(id) on delete set null,
  review_notes text not null default '' check(length(review_notes)<=4000),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint pedagogy_pdf_source_slot_uniq unique(source_file_name,source_question_no)
);

create index if not exists idx_pedagogy_pdf_candidate_review
  on public.pedagogy_pdf_source_candidates(editorial_status,source_year,source_question_no);

create index if not exists idx_pedagogy_pdf_candidate_hash
  on public.pedagogy_pdf_source_candidates(text_sha256);

create index if not exists idx_pedagogy_pdf_candidate_constructs
  on public.pedagogy_pdf_source_candidates using gin(suggested_constructs);

alter table public.pedagogy_pdf_source_candidates enable row level security;
revoke all on public.pedagogy_pdf_source_candidates from public,anon,authenticated;
grant select,insert,update,delete on public.pedagogy_pdf_source_candidates to service_role;

create or replace function public.guard_pedagogy_pdf_candidate_initial_state()
returns trigger
language plpgsql
security definer
set search_path=''
as $fn$
begin
  if tg_op='INSERT' and (
    new.editorial_status <> 'needs_review'
    or new.answer_key_status not in ('source_marker_unverified','missing')
    or new.historical_exam_claim_status not in ('source_claim_only','not_claimed')
    or new.linked_question_id is not null
    or new.reviewer_id is not null
    or new.reviewed_at is not null
  ) then
    raise exception using
      errcode='23514',
      message='PEDAGOGY_PDF_REVIEW_REQUIRED: source import may not auto-verify or publish';
  end if;
  return new;
end;
$fn$;

drop trigger if exists pedagogy_pdf_candidate_initial_state_guard
  on public.pedagogy_pdf_source_candidates;
create trigger pedagogy_pdf_candidate_initial_state_guard
before insert on public.pedagogy_pdf_source_candidates
for each row execute function public.guard_pedagogy_pdf_candidate_initial_state();

revoke all on function public.guard_pedagogy_pdf_candidate_initial_state() from public,anon,authenticated;

commit;
