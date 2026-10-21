-- Advisor FK-coverage indexes across public, ingest and editorial schemas.
-- All indexes are nonunique and leave application rows unchanged.
begin;
set local lock_timeout = '4s';
set local statement_timeout = '90s';

do $indexes$
begin
  if to_regclass('attest_ingest.pdf_question_candidates') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('attest_ingest.pdf_question_candidates')
      and conname='pdf_question_candidates_linked_question_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_pdf_question_candidates_ce347e88_fk" on "attest_ingest"."pdf_question_candidates" (linked_question_id);$ddl$;
  end if;
  if to_regclass('attest_ingest.telegram_informatika_drive_pdf_verified_duplicates') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('attest_ingest.telegram_informatika_drive_pdf_verified_duplicates')
      and conname='telegram_informatika_drive_pdf_verified_d_source_file_id_b_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_telegram_informatika_drive_pdf_ver_1a9b0ed3_fk" on "attest_ingest"."telegram_informatika_drive_pdf_verified_duplicates" (source_file_id_b);$ddl$;
  end if;
  if to_regclass('attest_ingest.telegram_informatika_source_answer_conflicts') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('attest_ingest.telegram_informatika_source_answer_conflicts')
      and conname='telegram_informatika_source_answer_confl_annotated_file_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_telegram_informatika_source_answer_fa9c5db2_fk" on "attest_ingest"."telegram_informatika_source_answer_conflicts" (annotated_file_id);$ddl$;
  end if;
  if to_regclass('ktd_quality.editorial_reviews') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('ktd_quality.editorial_reviews')
      and conname='editorial_reviews_reviewer_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_editorial_reviews_4e82e43e_fk" on "ktd_quality"."editorial_reviews" (reviewer_id);$ddl$;
  end if;
  if to_regclass('public.audit_log') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.audit_log')
      and conname='audit_log_actor_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_audit_log_b21cb5ca_fk" on "public"."audit_log" (actor_id);$ddl$;
  end if;
  if to_regclass('public.exam_items') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.exam_items')
      and conname='exam_items_construct_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_exam_items_7fc9faf6_fk" on "public"."exam_items" (construct_id);$ddl$;
  end if;
  if to_regclass('public.exams') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.exams')
      and conname='exams_blueprint_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_exams_fbdf76dc_fk" on "public"."exams" (blueprint_id);$ddl$;
  end if;
  if to_regclass('public.exams') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.exams')
      and conname='exams_lesson_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_exams_d11d2b3d_fk" on "public"."exams" (lesson_id);$ddl$;
  end if;
  if to_regclass('public.exams') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.exams')
      and conname='exams_module_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_exams_b693bbe1_fk" on "public"."exams" (module_id);$ddl$;
  end if;
  if to_regclass('public.group_mock_answers') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.group_mock_answers')
      and conname='group_mock_answers_room_id_user_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_group_mock_answers_ab5b564c_fk" on "public"."group_mock_answers" (room_id, user_id);$ddl$;
  end if;
  if to_regclass('public.group_mock_answers') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.group_mock_answers')
      and conname='group_mock_answers_user_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_group_mock_answers_d04b7352_fk" on "public"."group_mock_answers" (user_id);$ddl$;
  end if;
  if to_regclass('public.group_mock_items') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.group_mock_items')
      and conname='group_mock_items_question_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_group_mock_items_a4d96c1f_fk" on "public"."group_mock_items" (question_id);$ddl$;
  end if;
  if to_regclass('public.group_mock_messages') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.group_mock_messages')
      and conname='group_mock_messages_room_id_user_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_group_mock_messages_8f7a6074_fk" on "public"."group_mock_messages" (room_id, user_id);$ddl$;
  end if;
  if to_regclass('public.group_mock_rooms') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.group_mock_rooms')
      and conname='group_mock_rooms_owner_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_group_mock_rooms_6f48190a_fk" on "public"."group_mock_rooms" (owner_id);$ddl$;
  end if;
  if to_regclass('public.m09_owner_ai_release_waivers') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.m09_owner_ai_release_waivers')
      and conname='m09_owner_ai_release_waivers_original_source_lesson_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_m09_owner_ai_release_waivers_4029ead1_fk" on "public"."m09_owner_ai_release_waivers" (original_source_lesson_id);$ddl$;
  end if;
  if to_regclass('public.m09_owner_ai_release_waivers') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.m09_owner_ai_release_waivers')
      and conname='m09_owner_ai_release_waivers_owner_account_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_m09_owner_ai_release_waivers_0a0f3b76_fk" on "public"."m09_owner_ai_release_waivers" (owner_account_id);$ddl$;
  end if;
  if to_regclass('public.m10_owner_ai_release_waivers') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.m10_owner_ai_release_waivers')
      and conname='m10_owner_ai_release_waivers_original_source_lesson_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_m10_owner_ai_release_waivers_f94c6dc9_fk" on "public"."m10_owner_ai_release_waivers" (original_source_lesson_id);$ddl$;
  end if;
  if to_regclass('public.m10_owner_ai_release_waivers') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.m10_owner_ai_release_waivers')
      and conname='m10_owner_ai_release_waivers_owner_account_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_m10_owner_ai_release_waivers_7715be7e_fk" on "public"."m10_owner_ai_release_waivers" (owner_account_id);$ddl$;
  end if;
  if to_regclass('public.mastery_evidence') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.mastery_evidence')
      and conname='mastery_evidence_construct_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_mastery_evidence_b8e705f4_fk" on "public"."mastery_evidence" (construct_id);$ddl$;
  end if;
  if to_regclass('public.mastery_evidence') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.mastery_evidence')
      and conname='mastery_evidence_exam_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_mastery_evidence_d0950190_fk" on "public"."mastery_evidence" (exam_id);$ddl$;
  end if;
  if to_regclass('public.mastery_evidence') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.mastery_evidence')
      and conname='mastery_evidence_question_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_mastery_evidence_576c72c7_fk" on "public"."mastery_evidence" (question_id);$ddl$;
  end if;
  if to_regclass('public.pedagogy_owner_release_waivers') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.pedagogy_owner_release_waivers')
      and conname='pedagogy_owner_release_waivers_authorized_by_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_pedagogy_owner_release_waivers_2318d858_fk" on "public"."pedagogy_owner_release_waivers" (authorized_by);$ddl$;
  end if;
  if to_regclass('public.pedagogy_owner_release_waivers') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.pedagogy_owner_release_waivers')
      and conname='pedagogy_owner_release_waivers_source_question_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_pedagogy_owner_release_waivers_ed071ad5_fk" on "public"."pedagogy_owner_release_waivers" (source_question_id);$ddl$;
  end if;
  if to_regclass('public.pedagogy_pdf_source_candidates') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.pedagogy_pdf_source_candidates')
      and conname='pedagogy_pdf_source_candidates_linked_question_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_pedagogy_pdf_source_candidates_40cf43e1_fk" on "public"."pedagogy_pdf_source_candidates" (linked_question_id);$ddl$;
  end if;
  if to_regclass('public.pedagogy_pdf_source_candidates') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.pedagogy_pdf_source_candidates')
      and conname='pedagogy_pdf_source_candidates_reviewer_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_pedagogy_pdf_source_candidates_3fee27e6_fk" on "public"."pedagogy_pdf_source_candidates" (reviewer_id);$ddl$;
  end if;
  if to_regclass('public.pedguli_source_candidates') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.pedguli_source_candidates')
      and conname='pedguli_source_candidates_linked_question_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_pedguli_source_candidates_86d95335_fk" on "public"."pedguli_source_candidates" (linked_question_id);$ddl$;
  end if;
  if to_regclass('public.pedguli_source_candidates') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.pedguli_source_candidates')
      and conname='pedguli_source_candidates_reviewer_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_pedguli_source_candidates_d4cf324a_fk" on "public"."pedguli_source_candidates" (reviewer_id);$ddl$;
  end if;
  if to_regclass('public.question_editorial_checks') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.question_editorial_checks')
      and conname='question_editorial_checks_reviewer_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_question_editorial_checks_4ae9e332_fk" on "public"."question_editorial_checks" (reviewer_id);$ddl$;
  end if;
  if to_regclass('public.question_reports') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.question_reports')
      and conname='question_reports_question_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_question_reports_00059771_fk" on "public"."question_reports" (question_id);$ddl$;
  end if;
  if to_regclass('public.question_reports') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.question_reports')
      and conname='question_reports_resolved_by_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_question_reports_448dad95_fk" on "public"."question_reports" (resolved_by);$ddl$;
  end if;
  if to_regclass('public.question_reports') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.question_reports')
      and conname='question_reports_user_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_question_reports_67aa3d7e_fk" on "public"."question_reports" (user_id);$ddl$;
  end if;
  if to_regclass('public.questions') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.questions')
      and conname='questions_author_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_questions_7380df96_fk" on "public"."questions" (author_id);$ddl$;
  end if;
  if to_regclass('public.questions') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.questions')
      and conname='questions_subject_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_questions_751ca9e7_fk" on "public"."questions" (subject_id);$ddl$;
  end if;
  if to_regclass('public.topic_test_attempts') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.topic_test_attempts')
      and conname='topic_test_attempts_lesson_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_topic_test_attempts_6b26ab55_fk" on "public"."topic_test_attempts" (lesson_id);$ddl$;
  end if;
  if to_regclass('public.user_construct_stats') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.user_construct_stats')
      and conname='user_construct_stats_construct_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_user_construct_stats_bccdc894_fk" on "public"."user_construct_stats" (construct_id);$ddl$;
  end if;
  if to_regclass('public.user_lesson_progress') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.user_lesson_progress')
      and conname='user_lesson_progress_lesson_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_user_lesson_progress_f2f45ff9_fk" on "public"."user_lesson_progress" (lesson_id);$ddl$;
  end if;
  if to_regclass('public.user_module_progress') is not null and exists (
    select 1 from pg_constraint where conrelid=to_regclass('public.user_module_progress')
      and conname='user_module_progress_module_id_fkey' and contype='f'
  ) then
    execute $ddl$create index if not exists "idx_user_module_progress_c070e91d_fk" on "public"."user_module_progress" (module_id);$ddl$;
  end if;
end $indexes$;

commit;
