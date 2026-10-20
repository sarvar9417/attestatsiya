-- TASK-346 private ingest schema and release separation smoke regressions.
-- Run in isolated test transaction. Must never publish candidates.
begin;

do $$
declare
  v_table text;
  v_rel record;
begin
  foreach v_table in array array[
    'telegram_informatika_polls',
    'telegram_informatika_theory_candidates',
    'telegram_informatika_pdf_attachments',
    'telegram_informatika_pdf_question_candidates'
  ] loop
    select c.oid,c.relrowsecurity into v_rel
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='attest_ingest' and c.relname=v_table and c.relkind='r';
    if not found then raise exception 'TASK-346 missing ingest table %',v_table; end if;
    if not v_rel.relrowsecurity then raise exception 'TASK-346 RLS disabled %',v_table; end if;
    if has_table_privilege('anon',v_rel.oid,'select')
       or has_table_privilege('authenticated',v_rel.oid,'select') then
      raise exception 'TASK-346 learner can SELECT from private ingest table %',v_table;
    end if;
  end loop;
end $$;

-- The source export has no verified keys. This is a release blocker, not a target for an auto-fix.
do $$
begin
  if exists (select 1 from attest_ingest.telegram_informatika_polls
             where review_state='needs_independent_answer_verification' and answer_key is not null)
     or exists (select 1 from attest_ingest.telegram_informatika_pdf_question_candidates
                where review_state='needs_answer_and_visual_review' and answer_key is not null) then
    raise exception 'TASK-346 unverified question has answer key';
  end if;
end $$;

-- All staging rows preserve source provenance; scope does not touch public questions.
do $$
begin
  if exists (select 1 from attest_ingest.telegram_informatika_polls
             where source_message_id is null or duplicate_count < 1
                   or jsonb_typeof(answer_choices) <> 'array')
  or exists (select 1 from attest_ingest.telegram_informatika_theory_candidates
             where source_message_id is null or length(source_text) = 0)
  or exists (select 1 from attest_ingest.telegram_informatika_pdf_question_candidates
             where source_file_id = '' or source_question_no < 1)
  then raise exception 'TASK-346 invalid provenance/structure'; end if;
end $$;

rollback;
