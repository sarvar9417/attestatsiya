-- TASK-353: schema-only regression test. Always rolls back.
begin;
do $verify$
declare v_count int; v_n text; v_kind text; v_table text;
begin
  if not has_function_privilege('anon','public.auth_role()','execute') then
    raise exception 'Anonymous published-content policies lost the auth_role helper';
  end if;
  foreach v_n in array array[
    'guard_pedguli_candidate_editorial_update',
    'guard_pedguli_candidate_initial_state',
    'guard_pedguli_published_mutation',
    'guard_pedguli_question_publish'
  ] loop
    if has_function_privilege('anon',format('public.%I()',v_n),'execute') or
       has_function_privilege('authenticated',format('public.%I()',v_n),'execute') then
      raise exception 'Trigger-only function still has API EXECUTE grant: %',v_n;
    end if;
  end loop;

  foreach v_table in array array[
    'blueprint_quotas','blueprints','constructs','lesson_constructs',
    'lessons','modules','question_options','questions','subjects'
  ] loop
    select count(*) into v_count from pg_policies
    where schemaname='public' and tablename=v_table and cmd='ALL';
    if v_count<>0 then raise exception 'Old ALL policy remains: %',v_table; end if;

    foreach v_kind in array array['INSERT','UPDATE','DELETE'] loop
      select count(*) into v_count from pg_policies
      where schemaname='public' and tablename=v_table
        and cmd=v_kind and roles='{public}';
      if v_count<1 then raise exception 'Missing write operation % on %',v_kind,v_table; end if;
    end loop;
    select count(*) into v_count from pg_policies where
      schemaname='public' and tablename=v_table and cmd='SELECT';
    if v_count<1 then raise exception 'Lost SELECT policy on %',v_table; end if;
  end loop;

  if exists(select 1 from pg_policies where schemaname='public'
    and tablename='question_keys' and policyname='question_keys_staff_manage')
  then raise exception 'Redundant question_keys policy remains'; end if;

  select count(*) into v_count from pg_policies where schemaname='public'
    and tablename='profiles' and policyname='profiles_self_read'
    and qual like '%auth.uid()%';
  if v_count<>1 then raise exception 'Profile self-read policy missing'; end if;

  if to_regclass('public.idx_questions_source_ref') is not null
     or to_regclass('public.idx_questions_source_reference') is null then
    raise exception 'Question source reference index was not deduplicated';
  end if;
end $verify$;

-- Verify all TASK-353 indexes exist after the other migration.
do $indexes$
declare v_count int;
begin
  select count(*) into v_count
  from pg_constraint c
  where c.contype='f' and c.conname in ('pdf_question_candidates_linked_question_id_fkey','telegram_informatika_drive_pdf_verified_d_source_file_id_b_fkey','telegram_informatika_source_answer_confl_annotated_file_id_fkey','editorial_reviews_reviewer_id_fkey','audit_log_actor_id_fkey','exam_items_construct_id_fkey','exams_blueprint_id_fkey','exams_lesson_id_fkey','exams_module_id_fkey','group_mock_answers_room_id_user_id_fkey','group_mock_answers_user_id_fkey','group_mock_items_question_id_fkey','group_mock_messages_room_id_user_id_fkey','group_mock_rooms_owner_id_fkey','m09_owner_ai_release_waivers_original_source_lesson_id_fkey','m09_owner_ai_release_waivers_owner_account_id_fkey','m10_owner_ai_release_waivers_original_source_lesson_id_fkey','m10_owner_ai_release_waivers_owner_account_id_fkey','mastery_evidence_construct_id_fkey','mastery_evidence_exam_id_fkey','mastery_evidence_question_id_fkey','pedagogy_owner_release_waivers_authorized_by_fkey','pedagogy_owner_release_waivers_source_question_id_fkey','pedagogy_pdf_source_candidates_linked_question_id_fkey','pedagogy_pdf_source_candidates_reviewer_id_fkey','pedguli_source_candidates_linked_question_id_fkey','pedguli_source_candidates_reviewer_id_fkey','question_editorial_checks_reviewer_id_fkey','question_reports_question_id_fkey','question_reports_resolved_by_fkey','question_reports_user_id_fkey','questions_author_id_fkey','questions_subject_id_fkey','topic_test_attempts_lesson_id_fkey','user_construct_stats_construct_id_fkey','user_lesson_progress_lesson_id_fkey','user_module_progress_module_id_fkey');
  if v_count> (
    select count(*) from pg_class idx
    join pg_namespace n on n.oid=idx.relnamespace
    where idx.relkind='i' and idx.relname like 'idx_%_fk'
      and n.nspname in ('public','attest_ingest','ktd_quality')
  ) then raise exception 'Advisor FK coverage indexes missing for present FKs: %',v_count; end if;
end $indexes$;
rollback;
