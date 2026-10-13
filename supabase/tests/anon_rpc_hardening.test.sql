-- Regression: app RPCs are authenticated-only; trigger helpers are not direct client RPCs.

do $$
declare
  sig text;
begin
  foreach sig in array array[
    'public.start_exam(public.exam_kind,uuid)',
    'public.generate_topic_test(uuid)',
    'public.generate_section_mock(uuid)',
    'public.generate_official_mock()',
    'public.start_adaptive_practice(uuid,integer)',
    'public.finish_exam(uuid)',
    'public.get_review(uuid)',
    'public.get_due_reviews()',
    'public.mark_lesson_read(uuid)'
  ]
  loop
    if has_function_privilege('anon', sig, 'EXECUTE') then
      raise exception 'anon must not execute %', sig;
    end if;
    if not has_function_privilege('authenticated', sig, 'EXECUTE') then
      raise exception 'authenticated must execute %', sig;
    end if;
  end loop;

  foreach sig in array array[
    'public.handle_new_user()',
    'public.capture_mastery_evidence()'
  ]
  loop
    if has_function_privilege('anon', sig, 'EXECUTE')
       or has_function_privilege('authenticated', sig, 'EXECUTE') then
      raise exception 'trigger-only function must not be client-executable: %', sig;
    end if;
  end loop;

  -- auth_role() remains an intentional exception because public content RLS
  -- policies call it for anonymous reads.
  if not has_function_privilege('anon', 'public.auth_role()', 'EXECUTE') then
    raise exception 'auth_role() anon execute is required by current public-content RLS policy design';
  end if;
end
$$;
