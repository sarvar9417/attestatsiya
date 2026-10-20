create table if not exists attest_ingest.telegram_informatika_pdf_question_candidates (
  source_file_id text not null,
  source_file_name text not null,
  source_question_no integer not null check(source_question_no>0),
  source_pdf_url text not null,
  extracted_question_text text not null,
  extracted_answer_options jsonb not null default '[]'::jsonb,
  module_hint text not null,
  quality_flags text[] not null default '{}',
  review_state text not null default 'needs_answer_and_visual_review',
  answer_key text,
  created_at timestamptz not null default now(),
  primary key (source_file_id, source_question_no),
  constraint informatika_pdf_option_array check (jsonb_typeof(extracted_answer_options)='array'),
  constraint informatika_pdf_unverified_not_keyed check (review_state <> 'needs_answer_and_visual_review' or answer_key is null)
);
create index if not exists telegram_informatika_pdf_questions_module_idx
 on attest_ingest.telegram_informatika_pdf_question_candidates(module_hint,review_state);
alter table attest_ingest.telegram_informatika_pdf_question_candidates enable row level security;
revoke all on attest_ingest.telegram_informatika_pdf_question_candidates from public,anon,authenticated;
comment on table attest_ingest.telegram_informatika_pdf_question_candidates is
 'Private source-provenance question candidates from Telegram PDF attachments; OCR/layout quality not independently validated and answers unset.';