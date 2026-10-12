-- Human review gate for private Telegram source candidates.
-- Can mark provenance/permissions/answer validation, but NEVER publishes the
-- underlying original text to public.questions or to learner exam selectors.
begin;
create or replace function public.guard_pedguli_candidate_editorial_update()
returns trigger
language plpgsql security definer
set search_path=''
as $review$
begin
  -- Imported source evidence is immutable. Amend the review metadata instead.
  if new.source_channel is distinct from old.source_channel
   or new.source_message_id is distinct from old.source_message_id
   or new.source_url is distinct from old.source_url
   or new.source_html is distinct from old.source_html
   or new.text_sha256 is distinct from old.text_sha256
   or new.raw_text_private is distinct from old.raw_text_private
  then
    raise exception using errcode='23514',
      message='PEDGULI_SOURCE_IMMUTABLE: original Telegram message cannot be rewritten';
  end if;
  if new.editorial_status='verified' then
    if new.answer_key_status<>'independently_verified'
      or new.rights_status<>'permission_granted'
      or cardinality(new.suggested_constructs)=0
      or length(trim(new.review_notes))<40
      or new.reviewer_id is null
      or new.reviewed_at is null
    then
      raise exception using errcode='23514',
        message='PEDGULI_HUMAN_VERIFICATION_REQUIRED: answer, reuse permission, topic, reviewer and evidence';
    end if;
  end if;
  -- No state change of the source candidate can modify any learner question.
  return new;
end;
$review$;
drop trigger if exists pedguli_candidate_editorial_guard on public.pedguli_source_candidates;
create trigger pedguli_candidate_editorial_guard
before update on public.pedguli_source_candidates
for each row execute function public.guard_pedguli_candidate_editorial_update();
commit;