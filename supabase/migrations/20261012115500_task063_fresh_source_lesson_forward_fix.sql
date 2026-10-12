-- TASK-063 forward fix for fresh-clone source lesson integrity.
--
-- The original TASK-063 production reconciliation only rewrites questions when
-- canonical M02/M05 lessons are missing. On a fresh migration chain those
-- canonical lessons already exist, so older seeded questions can retain a null
-- or construct-mismatched source_lesson_id.
--
-- Preserve every already-valid source link. Repair only null/mismatched links
-- by binding the question to the canonical published lesson for its construct.
-- This is idempotent and is expected to be a no-op on already-reconciled prod.

begin;

do $$
declare
  v_missing int;
begin
  with expected(code, lesson_id) as (
    values
      ('S2.HW.01', '92000000-0000-4000-8000-000000000001'::uuid),
      ('S2.HW.02', '92000000-0000-4000-8000-000000000002'::uuid),
      ('S2.HW.03', '92000000-0000-4000-8000-000000000003'::uuid),
      ('S2.HW.04', '92000000-0000-4000-8000-000000000004'::uuid),
      ('S3.NUM.01', '95000000-0000-4000-8000-000000000001'::uuid),
      ('S3.NUM.02', '95000000-0000-4000-8000-000000000002'::uuid),
      ('S3.NUM.03', '95000000-0000-4000-8000-000000000003'::uuid)
  )
  select count(*)
    into v_missing
    from expected e
    left join public.constructs c
      on c.code = e.code
     and c.is_active
    left join public.lessons l
      on l.id = e.lesson_id
     and l.status = 'published'::public.content_status
    left join public.lesson_constructs lc
      on lc.lesson_id = e.lesson_id
     and lc.construct_id = c.id
   where c.id is null
      or l.id is null
      or lc.lesson_id is null;

  if v_missing <> 0 then
    raise exception 'TASK-063 forward fix: % canonical construct/lesson mapping(s) missing', v_missing;
  end if;

  with expected(code, lesson_id) as (
    values
      ('S2.HW.01', '92000000-0000-4000-8000-000000000001'::uuid),
      ('S2.HW.02', '92000000-0000-4000-8000-000000000002'::uuid),
      ('S2.HW.03', '92000000-0000-4000-8000-000000000003'::uuid),
      ('S2.HW.04', '92000000-0000-4000-8000-000000000004'::uuid),
      ('S3.NUM.01', '95000000-0000-4000-8000-000000000001'::uuid),
      ('S3.NUM.02', '95000000-0000-4000-8000-000000000002'::uuid),
      ('S3.NUM.03', '95000000-0000-4000-8000-000000000003'::uuid)
  )
  update public.questions q
     set source_lesson_id = e.lesson_id,
         updated_at = now()
    from public.constructs c,
         expected e
   where q.construct_id = c.id
     and c.code = e.code
     and (
       q.source_lesson_id is null
       or not exists (
         select 1
           from public.lesson_constructs current_lc
          where current_lc.lesson_id = q.source_lesson_id
            and current_lc.construct_id = q.construct_id
       )
     );
end
$$;

commit;
