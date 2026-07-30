do $$
declare
  v_preserved_lessons int;
  v_preserved_questions int;
  v_legacy_quota_count int;
  v_legacy_subject_count int;
begin
  select count(*)
    into v_preserved_lessons
    from public.lessons lesson
    join public.modules module on module.id = lesson.module_id
   where module.code = 'M01';

  select count(*)
    into v_preserved_questions
    from public.questions question
    join public.constructs construct on construct.id = question.construct_id
   where construct.code = 'LEGACY.01'
     and not construct.is_active;

  select count(*)
    into v_legacy_quota_count
    from public.blueprint_quotas
   where group_code ~ '^S[1-9]$';

  select count(*)
    into v_legacy_subject_count
    from public.subjects
   where code = 'INF';

  if v_preserved_lessons <> 1 then
    raise exception 'remote_upgrade_preserved_lessons: expected 1, received %',
      v_preserved_lessons;
  end if;

  if v_preserved_questions <> 1 then
    raise exception 'remote_upgrade_preserved_questions: expected 1, received %',
      v_preserved_questions;
  end if;

  if v_legacy_quota_count <> 0 then
    raise exception 'remote_upgrade_legacy_quotas: expected 0, received %',
      v_legacy_quota_count;
  end if;

  if v_legacy_subject_count <> 0 then
    raise exception 'remote_upgrade_legacy_subject: expected 0, received %',
      v_legacy_subject_count;
  end if;
end
$$;
