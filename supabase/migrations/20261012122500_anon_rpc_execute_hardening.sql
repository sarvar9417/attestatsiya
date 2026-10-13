-- Harden SECURITY DEFINER RPC exposure discovered by the Supabase security advisor.
-- App-facing exam/progress RPCs are authenticated-only in the backend, so anon
-- direct execution is unnecessary. Trigger-only functions must not be callable
-- directly by anon/authenticated roles.
--
-- auth_role() intentionally remains executable by anon because existing public
-- content RLS policies call it while evaluating published rows.

begin;

-- Authenticated learner RPCs: remove historical explicit anon grants.
revoke all on function public.start_exam(public.exam_kind, uuid) from anon;
revoke all on function public.generate_topic_test(uuid) from anon;
revoke all on function public.generate_section_mock(uuid) from anon;
revoke all on function public.generate_official_mock() from anon;
revoke all on function public.start_adaptive_practice(uuid, int) from anon;
revoke all on function public.finish_exam(uuid) from anon;
revoke all on function public.get_review(uuid) from anon;
revoke all on function public.get_due_reviews() from anon;
revoke all on function public.mark_lesson_read(uuid) from anon;

-- Keep the intended application contract explicit after revocation.
grant execute on function public.start_exam(public.exam_kind, uuid) to authenticated;
grant execute on function public.generate_topic_test(uuid) to authenticated;
grant execute on function public.generate_section_mock(uuid) to authenticated;
grant execute on function public.generate_official_mock() to authenticated;
grant execute on function public.start_adaptive_practice(uuid, int) to authenticated;
grant execute on function public.finish_exam(uuid) to authenticated;
grant execute on function public.get_review(uuid) to authenticated;
grant execute on function public.get_due_reviews() to authenticated;
grant execute on function public.mark_lesson_read(uuid) to authenticated;

-- Trigger-only SECURITY DEFINER functions are never direct client RPCs.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.capture_mastery_evidence() from public, anon, authenticated;

commit;
