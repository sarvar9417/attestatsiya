-- Database advisor remediation batch 1: permission-safe RLS improvements.
-- Preserve all prior SELECT access; limit existing write policies to writes.
begin;

do $assert$
declare v_count integer;
begin
  select count(*) into v_count from pg_policies
  where schemaname='public' and cmd='ALL' and
    (tablename,policyname) in (
      ('blueprint_quotas','blueprint_quotas_write'),
      ('blueprints','blueprints_write'),
      ('constructs','constructs_write'),
      ('lesson_constructs','lesson_constructs_write'),
      ('lessons','lessons_write'),
      ('modules','content_write'),
      ('question_options','options_write'),
      ('questions','questions_write'),
      ('subjects','subjects_write')
    );
  if v_count<>9 then
    raise exception 'Advisor RLS baseline drift: expected 9 ALL/write policies, found %',v_count;
  end if;
end $assert$;

-- Trigger-only functions cannot be called like ordinary RPCs; remove
-- unnecessary public and authenticated EXECUTE grants. Trigger firing
-- remains active and uses the trigger function's original privileges.
revoke execute on function
  public.guard_pedguli_candidate_editorial_update(),
  public.guard_pedguli_candidate_initial_state(),
  public.guard_pedguli_published_mutation(),
  public.guard_pedguli_question_publish()
from public,anon,authenticated;

-- public.auth_role() intentionally retains EXECUTE for RLS policies
-- evaluating published content for anonymous learners.


-- public.blueprint_quotas: the original SELECT policy remains unchanged.
drop policy blueprint_quotas_write on public.blueprint_quotas;
create policy blueprint_quotas_write_insert on public.blueprint_quotas for insert to public
  with check (((select public.auth_role()) = 'admin'::public.user_role));
create policy blueprint_quotas_write_update on public.blueprint_quotas for update to public
  using (((select public.auth_role()) = 'admin'::public.user_role)) with check (((select public.auth_role()) = 'admin'::public.user_role));
create policy blueprint_quotas_write_delete on public.blueprint_quotas for delete to public
  using (((select public.auth_role()) = 'admin'::public.user_role));


-- public.blueprints: the original SELECT policy remains unchanged.
drop policy blueprints_write on public.blueprints;
create policy blueprints_write_insert on public.blueprints for insert to public
  with check (((select public.auth_role()) = 'admin'::public.user_role));
create policy blueprints_write_update on public.blueprints for update to public
  using (((select public.auth_role()) = 'admin'::public.user_role)) with check (((select public.auth_role()) = 'admin'::public.user_role));
create policy blueprints_write_delete on public.blueprints for delete to public
  using (((select public.auth_role()) = 'admin'::public.user_role));


-- public.constructs: the original SELECT policy remains unchanged.
drop policy constructs_write on public.constructs;
create policy constructs_write_insert on public.constructs for insert to public
  with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy constructs_write_update on public.constructs for update to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role]))) with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy constructs_write_delete on public.constructs for delete to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));


-- public.lesson_constructs: the original SELECT policy remains unchanged.
drop policy lesson_constructs_write on public.lesson_constructs;
create policy lesson_constructs_write_insert on public.lesson_constructs for insert to public
  with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy lesson_constructs_write_update on public.lesson_constructs for update to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role]))) with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy lesson_constructs_write_delete on public.lesson_constructs for delete to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));


-- public.lessons: the original SELECT policy remains unchanged.
drop policy lessons_write on public.lessons;
create policy lessons_write_insert on public.lessons for insert to public
  with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy lessons_write_update on public.lessons for update to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role]))) with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy lessons_write_delete on public.lessons for delete to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));


-- public.modules: the original SELECT policy remains unchanged.
drop policy content_write on public.modules;
create policy content_write_insert on public.modules for insert to public
  with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy content_write_update on public.modules for update to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role]))) with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy content_write_delete on public.modules for delete to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));


-- public.question_options: the original SELECT policy remains unchanged.
drop policy options_write on public.question_options;
create policy options_write_insert on public.question_options for insert to public
  with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy options_write_update on public.question_options for update to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role]))) with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy options_write_delete on public.question_options for delete to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));


-- public.questions: the original SELECT policy remains unchanged.
drop policy questions_write on public.questions;
create policy questions_write_insert on public.questions for insert to public
  with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy questions_write_update on public.questions for update to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role]))) with check (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));
create policy questions_write_delete on public.questions for delete to public
  using (((select public.auth_role()) = ANY (ARRAY['editor'::public.user_role,'admin'::public.user_role])));


-- public.subjects: the original SELECT policy remains unchanged.
drop policy subjects_write on public.subjects;
create policy subjects_write_insert on public.subjects for insert to public
  with check (((select public.auth_role()) = 'admin'::public.user_role));
create policy subjects_write_update on public.subjects for update to public
  using (((select public.auth_role()) = 'admin'::public.user_role)) with check (((select public.auth_role()) = 'admin'::public.user_role));
create policy subjects_write_delete on public.subjects for delete to public
  using (((select public.auth_role()) = 'admin'::public.user_role));


-- Duplicate key-management policies had identical predicates; keep one.
drop policy question_keys_staff_manage on public.question_keys;

-- Cache stable auth context once per SQL statement without broadening rights.
alter policy profiles_self_read on public.profiles using
  (id=(select auth.uid()) or (select public.auth_role())='admin'::public.user_role);
-- Some assessment tables are remote-only and absent on fresh CI clones.
do $optional$
begin
  if to_regclass('public.topic_test_attempts') is not null and exists
    (select 1 from pg_policies where schemaname='public'
      and tablename='topic_test_attempts' and policyname='topic_attempts_self') then
    execute $ddl$alter policy topic_attempts_self on public.topic_test_attempts using
  (user_id=(select auth.uid()) or (select public.auth_role())='admin'::public.user_role);$ddl$;
  end if;
  if to_regclass('public.topic_test_attempts') is not null and exists
    (select 1 from pg_policies where schemaname='public'
      and tablename='topic_test_attempts' and policyname='topic_attempts_insert_self') then
    execute $ddl$alter policy topic_attempts_insert_self on public.topic_test_attempts with check
  (user_id=(select auth.uid()));$ddl$;
  end if;
  if to_regclass('public.mastery_evidence') is not null and exists
    (select 1 from pg_policies where schemaname='public'
      and tablename='mastery_evidence' and policyname='mastery_evidence_self_read') then
    execute $ddl$alter policy mastery_evidence_self_read on public.mastery_evidence using
  (user_id=(select auth.uid()) or (select public.auth_role())='admin'::public.user_role);$ddl$;
  end if;
  if to_regclass('public.custom_exam_presets') is not null and exists
    (select 1 from pg_policies where schemaname='public'
      and tablename='custom_exam_presets' and policyname='custom_exam_presets_select_self') then
    execute $ddl$alter policy custom_exam_presets_select_self on public.custom_exam_presets using
  (user_id=(select auth.uid()));$ddl$;
  end if;
  if to_regclass('public.custom_exam_presets') is not null and exists
    (select 1 from pg_policies where schemaname='public'
      and tablename='custom_exam_presets' and policyname='custom_exam_presets_insert_self') then
    execute $ddl$alter policy custom_exam_presets_insert_self on public.custom_exam_presets with check
  (user_id=(select auth.uid()));$ddl$;
  end if;
  if to_regclass('public.custom_exam_presets') is not null and exists
    (select 1 from pg_policies where schemaname='public'
      and tablename='custom_exam_presets' and policyname='custom_exam_presets_update_self') then
    execute $ddl$alter policy custom_exam_presets_update_self on public.custom_exam_presets using
  (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));$ddl$;
  end if;
  if to_regclass('public.custom_exam_presets') is not null and exists
    (select 1 from pg_policies where schemaname='public'
      and tablename='custom_exam_presets' and policyname='custom_exam_presets_delete_self') then
    execute $ddl$alter policy custom_exam_presets_delete_self on public.custom_exam_presets using
  (user_id=(select auth.uid()));$ddl$;
  end if;
end $optional$;

-- Identical partial btree indexes: neither is a constraint index.
drop index if exists public.idx_questions_source_ref;

commit;
