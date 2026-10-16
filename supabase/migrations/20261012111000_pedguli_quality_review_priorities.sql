-- Read-only triage metadata on private Telegram source candidates.
-- Does not alter publication workflow or answer-key state; review only.
begin;
alter table public.pedguli_source_candidates
  add column if not exists quality_flags text[] not null default '{}'::text[],
  add column if not exists review_priority smallint not null default 1
    check(review_priority between 1 and 3),
  add column if not exists four_options_detected boolean not null default false;
create index if not exists idx_pedguli_candidate_review_priority
on public.pedguli_source_candidates(review_priority desc,source_message_id asc);
create index if not exists idx_pedguli_candidate_quality_flags
on public.pedguli_source_candidates using gin(quality_flags);
commit;