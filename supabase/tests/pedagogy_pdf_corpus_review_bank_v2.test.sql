-- Regression for pedagogy PDF corpus review bank v2.

do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.questions
  where source_reference like 'authored:pedagogy-pdf-corpus:v2:%';

  if v_count<>18 then
    raise exception 'expected 18 pedagogy corpus v2 review questions, found %',v_count;
  end if;

  if (
    select count(distinct c.code)
    from public.questions q
    join public.constructs c on c.id=q.construct_id
    where q.source_reference like 'authored:pedagogy-pdf-corpus:v2:%'
  )<>18 then
    raise exception 'expected exactly one v2 item for each of 18 pedagogy constructs';
  end if;

  if (
    select count(*)
    from public.questions
    where source_reference like 'authored:pedagogy-pdf-corpus:v2:%'
      and format='Y2'::public.question_format
  )<>9 then
    raise exception 'expected 9 Y2 items in v2';
  end if;

  if (
    select count(*)
    from public.questions
    where source_reference like 'authored:pedagogy-pdf-corpus:v2:%'
      and format='Y3'::public.question_format
  )<>9 then
    raise exception 'expected 9 Y3 items in v2';
  end if;

  if exists (
    select 1
    from public.questions q
    where q.source_reference like 'authored:pedagogy-pdf-corpus:v2:%'
      and (
        q.status<>'review'::public.content_status
        or q.source_lesson_id is null
        or not exists(select 1 from public.question_keys k where k.question_id=q.id)
        or not exists(
          select 1 from public.lesson_constructs lc
          where lc.lesson_id=q.source_lesson_id
            and lc.construct_id=q.construct_id
        )
        or (q.format='Y2'::public.question_format and (select count(*) from public.question_options o where o.question_id=q.id)<>8)
        or (q.format='Y3'::public.question_format and (select count(*) from public.question_options o where o.question_id=q.id)<>4)
      )
  ) then
    raise exception 'v2 review-bank structural invariant failed';
  end if;

  if exists (
    select lower(regexp_replace(stem_md,'\s+',' ','g'))
    from public.questions
    where source_reference like 'authored:pedagogy-pdf-corpus:v2:%'
    group by lower(regexp_replace(stem_md,'\s+',' ','g'))
    having count(*)>1
  ) then
    raise exception 'duplicate v2 authored stem detected';
  end if;
end
$$;
