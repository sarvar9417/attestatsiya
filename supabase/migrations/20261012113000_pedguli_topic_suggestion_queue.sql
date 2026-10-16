-- Suggested M14/M15/M16 topic placement is non-authoritative editorial
-- metadata for private Telegram archive. Does not update original labels,
-- verified status, published questions, or historical exam claims.
begin;
alter table public.pedguli_source_candidates
  add column if not exists proposed_constructs text[] not null default '{}'::text[],
  add column if not exists topic_suggestion_state text not null default 'unclassified'
    check(topic_suggestion_state in ('strong_keyword','ambiguous','unclassified')),
  add column if not exists topic_suggestion_evidence text[] not null default '{}'::text[];
create index if not exists idx_pedguli_topic_suggestion_state
  on public.pedguli_source_candidates(topic_suggestion_state,source_message_id);
commit;