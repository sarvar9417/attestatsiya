-- Editorial staging audit, run transactionally after authoring 94 questions.
-- New M15 content MUST remain in review until independently approved.
-- This verifies enough distinct complete question contracts are staged for each
-- 20-item lesson test, NOT that the tests are ready for production.
DO $m15_audit$
DECLARE r record; v_total int; v_lessons int := 0; v_generated int; v_bad int;
BEGIN
  for r in
    select l.id, l.order_idx, l.topic_test_question_count, c.id AS cid, c.group_code
      from public.lessons l
      join public.modules m on m.id=l.module_id
      join public.constructs c on c.code='PM.GEN.'||lpad(l.order_idx::text,2,'0')
      join public.lesson_constructs lc on lc.lesson_id=l.id and lc.construct_id=c.id
     where m.code='M15' and l.order_idx between 1 and 8 and l.status='published' and c.is_active
  loop
    v_lessons := v_lessons + 1;
    select count(*) into v_total from public.questions q
      join public.question_keys k on k.question_id=q.id
      where q.construct_id=r.cid and q.group_code=r.group_code and q.status in ('published','review');
    if v_total < r.topic_test_question_count then
      raise exception 'M15 topic pool still insufficient for order_idx %: % / %',
        r.order_idx,v_total,r.topic_test_question_count;
    end if;
  end loop;
  if v_lessons <> 8 then
    raise exception 'Expected exactly 8 canonical M15 topic blueprints, got %',v_lessons;
  end if;
  select count(*) into v_generated from public.questions
   where source_reference like 'authored:m15-topictest-20261018:%' and status='review';
  if v_generated <> 94 then raise exception 'Expected 94 new M15 review questions, got %',v_generated; end if;
  if exists (select 1 from public.questions where source_reference like 'authored:m15-topictest-20261018:%' and status='published') then
    raise exception 'Staging must not automatically publish editorial question candidates';
  end if;
  select count(*) into v_bad from public.questions q
  where q.source_reference like 'authored:m15-topictest-20261018:%'
    and ((select count(*) from public.question_options o where o.question_id=q.id) <> 4
    or not exists (select 1 from public.question_keys k join public.question_options o
      on o.id=(k.payload->>'correct_option_id')::uuid
      where k.question_id=q.id and o.question_id=q.id and nullif(btrim(k.explanation_md),'') is not null));
  if v_bad > 0 then raise exception 'M15 new question contract invalid for % questions',v_bad; end if;

  -- Mirror the protected publication guard's word-count balance constraints
  -- while the questions are still editable in review.
  select count(*) into v_bad from (
    select q.id,
      min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) as min_wc,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) as max_wc,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
        filter(where o.id::text=k.payload->>'correct_option_id') as correct_wc,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
        filter(where o.id::text<>k.payload->>'correct_option_id') as max_wrong_wc
    from public.questions q
    join public.question_options o on o.question_id=q.id and o.side='a'
    join public.question_keys k on k.question_id=q.id
    where q.source_reference like 'authored:m15-topictest-20261018:%'
    group by q.id
  ) lens
  where max_wc > min_wc*1.8 or correct_wc > max_wrong_wc*1.25;
  if v_bad > 0 then
    raise exception 'M15 draft distractor length gate failed for % questions',v_bad;
  end if;
END
$m15_audit$;
