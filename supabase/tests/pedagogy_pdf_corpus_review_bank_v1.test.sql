-- Regression for pedagogy PDF corpus review bank v1.

do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.questions
  where source_reference like 'authored:pedagogy-pdf-corpus:v1:%';

  if v_count<>36 then
    raise exception 'expected 36 pedagogy corpus review questions, found %',v_count;
  end if;

  if exists (
    select 1
    from (
      select c.code,count(*) n
      from public.questions q
      join public.constructs c on c.id=q.construct_id
      where q.source_reference like 'authored:pedagogy-pdf-corpus:v1:%'
      group by c.code
    ) x
    where x.n<>2
  ) then
    raise exception 'expected exactly 2 review items per pedagogy construct';
  end if;

  if (
    select count(distinct c.code)
    from public.questions q
    join public.constructs c on c.id=q.construct_id
    where q.source_reference like 'authored:pedagogy-pdf-corpus:v1:%'
  )<>18 then
    raise exception 'expected all 18 pedagogy constructs';
  end if;

  if exists (
    select 1
    from public.questions q
    where q.source_reference like 'authored:pedagogy-pdf-corpus:v1:%'
      and (
        q.status<>'review'::public.content_status
        or q.format<>'Y1'::public.question_format
        or q.source_lesson_id is null
        or not exists(select 1 from public.question_keys k where k.question_id=q.id)
        or (select count(*) from public.question_options o where o.question_id=q.id)<>4
        or not exists(
          select 1 from public.lesson_constructs lc
          where lc.lesson_id=q.source_lesson_id
            and lc.construct_id=q.construct_id
        )
      )
  ) then
    raise exception 'pedagogy corpus review question invariant failed';
  end if;

  if exists (
    select lower(regexp_replace(stem_md,'\s+',' ','g'))
    from public.questions
    where source_reference like 'authored:pedagogy-pdf-corpus:v1:%'
    group by lower(regexp_replace(stem_md,'\s+',' ','g'))
    having count(*)>1
  ) then
    raise exception 'duplicate authored stem inside pedagogy corpus review bank';
  end if;
end
$$;
