-- M15 20-question topic bank acceptance test. Run in a throwaway CI DB only.
begin;

do $verify_m15$
declare
  rec record;
  v_published integer;
  v_bad_options integer;
  v_bad_keys integer;
  v_fresh integer;
  v_expected integer := 0;
begin
  -- Eight canonical M15 lessons must have enough keyed, published items
  -- linked to the correct subject/group/active construct.
  for rec in
    select l.id, l.order_idx, l.title_uz, l.topic_test_question_count, c.id as construct_id,
           c.group_code
    from public.lessons l
    join public.modules m on m.id = l.module_id
    join public.constructs c on c.code = 'PM.GEN.' || lpad(l.order_idx::text, 2, '0')
    join public.lesson_constructs lc on lc.lesson_id=l.id and lc.construct_id=c.id
    where m.code='M15' and l.order_idx between 1 and 8
      and l.status='published' and c.is_active
    order by l.order_idx
  loop
    v_expected := v_expected + 1;
    select count(*) into v_published
      from public.questions q
      join public.question_keys k on k.question_id=q.id
     where q.construct_id=rec.construct_id
       and q.group_code=rec.group_code
       and q.status='published';
    if v_published < rec.topic_test_question_count then
      raise exception 'M15.% pool deficit: available %, target %', rec.order_idx, v_published, rec.topic_test_question_count;
    end if;
  end loop;
  if v_expected <> 8 then raise exception 'Expected eight canonical M15 lessons, got %', v_expected; end if;

  -- New authored items must never omit a key or 4 unique options.
  select count(*) into v_fresh from public.questions q
  where q.source_reference like 'authored:m15-topictest-20261018:%';
  if v_fresh <> 94 then raise exception 'Expected 94 new M15 questions, got %', v_fresh; end if;

  select count(*) into v_bad_options
    from public.questions q
   where q.source_reference like 'authored:m15-topictest-20261018:%'
     and (select count(*) from public.question_options o where o.question_id=q.id and o.side='a') <> 4;
  if v_bad_options > 0 then raise exception '% new questions have non-four option count', v_bad_options; end if;

  select count(*) into v_bad_keys
    from public.questions q
    left join public.question_keys k on k.question_id=q.id
    left join public.question_options o
      on o.question_id=q.id
     and o.id=(k.payload->>'correct_option_id')::uuid
   where q.source_reference like 'authored:m15-topictest-20261018:%'
     and (k.question_id is null or o.id is null or nullif(trim(k.explanation_md),'') is null);
  if v_bad_keys > 0 then raise exception '% authored questions have invalid key/explanation', v_bad_keys; end if;
end
$verify_m15$;
select 'm15_20_topic_bank_ok' as result;
rollback;
