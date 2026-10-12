-- Editorial shortlist proposals are NOT approved mappings or answer keys.
-- They do not alter review status and are kept separate from original labels.
begin;
alter table public.pedguli_source_candidates
  drop constraint if exists pedguli_source_candidates_topic_suggestion_state_check;
alter table public.pedguli_source_candidates
  add constraint pedguli_source_candidates_topic_suggestion_state_check
  check (topic_suggestion_state in
    ('strong_keyword','ambiguous','unclassified','editorial_proposal'));
commit;