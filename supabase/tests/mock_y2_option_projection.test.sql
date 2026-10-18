-- Regression: an imported Y2 with 8 stored 'a' options must render as 4+4
-- without mutating its immutable published question or exposing its answer key.
begin;
do $test$
declare
  v_uid uuid := '75000000-0000-4000-8000-000000000018';
  v_question uuid;
  v_construct uuid;
  v_exam uuid;
  v_result jsonb;
  v_options jsonb;
  v_option jsonb;
  v_a int := 0;
  v_b int := 0;
begin
  select q.id, q.construct_id into strict v_question, v_construct
  from public.questions q
  where q.source_reference='formatbank-2026:T063-Y2-011';

  if (select count(*) from public.question_options o where o.question_id=v_question and o.side='a') <> 8
  then raise exception 'Fixture must retain raw 8-a broken Y2 snapshot'; end if;

  insert into auth.users (id,email)
  values (v_uid,'test-y2-mock-projection@example.test');

  insert into public.exams(user_id,kind,duration_sec)
  values(v_uid,'mock'::public.exam_kind,7200)
  returning id into v_exam;

  insert into public.exam_items(exam_id,question_id,construct_id,order_idx)
  values(v_exam,v_question,v_construct,1);

  v_result:=public.exam_payload(v_exam);
  if jsonb_array_length(v_result)<>1 then
    raise exception 'Expected exactly one mock item'; end if;

  v_options:=v_result->0->'options';
  if jsonb_array_length(v_options)<>8 then
    raise exception 'Y2 payload lost options'; end if;

  for v_option in select value from jsonb_array_elements(v_options)
  loop
    if v_option->>'side'='a' then v_a:=v_a+1;
    elsif v_option->>'side'='b' then v_b:=v_b+1;
    else raise exception 'Unexpected Y2 side'; end if;
  end loop;

  if v_a<>4 or v_b<>4 then
    raise exception 'Expected 4+4 Y2 options; got %/%',v_a,v_b;
  end if;
  if v_result::text ~ '"(pairs|correct_option_id|explanation_md)"[[:space:]]*:' then
    raise exception 'Learner payload must never expose the answer key'; end if;

  if (select count(*) from public.question_options o where o.question_id=v_question and o.side='a') <> 8
  then raise exception 'Immutable published snapshot was modified'; end if;
end
$test$;
rollback;
