-- TASK-346: private review-only Telegram Informatika staging.
-- No published content, learner keys, or user accounts are modified.
create schema if not exists attest_ingest;

create table if not exists attest_ingest.telegram_informatika_polls (
  candidate_id text primary key,
  source_message_id bigint not null unique,
  source_message_ids bigint[] not null,
  source_date timestamp without time zone not null,
  module_hint text not null,
  question_text text not null,
  answer_choices jsonb not null,
  answer_key text,
  answer_key_state text not null default 'missing_in_export',
  review_state text not null default 'needs_independent_answer_verification',
  quality_flags text[] not null default '{}',
  duplicate_count integer not null default 1 check (duplicate_count > 0),
  source_locator text not null default 'barnoyevak/Drive/Informatika/result.json',
  created_at timestamptz not null default now(),
  constraint informatika_poll_answers_array check (jsonb_typeof(answer_choices) = 'array'),
  constraint informatika_poll_unverified_key check (
      (review_state = 'needs_independent_answer_verification' and answer_key is null)
      or review_state <> 'needs_independent_answer_verification'
  )
);
create index if not exists telegram_informatika_polls_module_review_idx
  on attest_ingest.telegram_informatika_polls(module_hint, review_state);
create table if not exists attest_ingest.telegram_informatika_theory_candidates (
  source_message_id bigint primary key,
  source_date timestamp without time zone not null,
  module_hint text not null,
  review_priority text not null,
  source_text text not null,
  review_state text not null default 'theory_candidate_not_published',
  source_locator text not null default 'barnoyevak/Drive/Informatika/result.json',
  created_at timestamptz not null default now()
);
create index if not exists telegram_informatika_theory_module_idx
  on attest_ingest.telegram_informatika_theory_candidates(module_hint, review_state);
create table if not exists attest_ingest.telegram_informatika_pdf_attachments (
  file_path text primary key,
  source_message_id bigint not null,
  mention_count integer not null check(mention_count>0),
  review_state text not null default 'listed_not_yet_content_verified',
  created_at timestamptz not null default now()
);

alter table attest_ingest.telegram_informatika_polls enable row level security;
alter table attest_ingest.telegram_informatika_theory_candidates enable row level security;
alter table attest_ingest.telegram_informatika_pdf_attachments enable row level security;
revoke all on attest_ingest.telegram_informatika_polls from public, anon, authenticated;
revoke all on attest_ingest.telegram_informatika_theory_candidates from public, anon, authenticated;
revoke all on attest_ingest.telegram_informatika_pdf_attachments from public, anon, authenticated;

comment on table attest_ingest.telegram_informatika_polls is
 'Review-only import candidates from Informatika Telegram export. Missing answer keys must not enter published questions.';
comment on table attest_ingest.telegram_informatika_theory_candidates is
 'Unreviewed Telegram text excerpts, not learner-facing lesson content.';
comment on table attest_ingest.telegram_informatika_pdf_attachments is
 'PDF provenance index, not evidence that PDF contents or keys have been verified.';