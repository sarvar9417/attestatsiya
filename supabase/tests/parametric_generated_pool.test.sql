-- T-024: parametrik generator poolini real PostgreSQL'da tekshirish.
-- Bu test generator SQL qo'llangandan keyin ishlaydi.

do $$
declare
  generated_count integer;
  key_count integer;
  bad_construct_count integer;
begin
  select count(*)
    into generated_count
    from public.questions
   where source_reference like 'generated:%';

  if generated_count <> 270 then
    raise exception 'parametric_generated_question_count: expected 270, got %', generated_count;
  end if;

  select count(*)
    into key_count
    from public.question_keys k
    join public.questions q on q.id = k.question_id
   where q.source_reference like 'generated:%';

  if key_count <> 270 then
    raise exception 'parametric_generated_key_count: expected 270, got %', key_count;
  end if;

  select count(*)
    into bad_construct_count
    from (
      select c.code, count(*) as n
        from public.questions q
        join public.constructs c on c.id = q.construct_id
       where q.source_reference like 'generated:%'
       group by c.code
    ) x
   where x.code not in (
      'S1.INFO.04','S1.INFO.05','S1.INFO.06',
      'S3.NUM.01','S3.NUM.02','S3.NUM.03',
      'S3.LOGIC.02','S3.LOGIC.04','S6.NET.03'
   )
      or x.n <> 30;

  if bad_construct_count <> 0 then
    raise exception 'parametric_construct_distribution_invalid';
  end if;

  if (
    select count(distinct c.code)
      from public.questions q
      join public.constructs c on c.id = q.construct_id
     where q.source_reference like 'generated:%'
  ) <> 9 then
    raise exception 'parametric_construct_count_invalid';
  end if;
end
$$;

-- Har savol formati uchun option soni generator kontraktiga mos.
do $$
begin
  if exists (
    select 1
      from public.questions q
      left join public.question_options o on o.question_id = q.id
     where q.source_reference like 'generated:%'
     group by q.id, q.format
    having count(o.id) <> case q.format
      when 'Y1'::public.question_format then 4
      when 'Y2'::public.question_format then 8
      when 'Y3'::public.question_format then 3
      else -1
    end
  ) then
    raise exception 'parametric_option_count_invalid';
  end if;
end
$$;

-- Answer key payload shakli format bilan mos.
do $$
begin
  if exists (
    select 1
      from public.questions q
      join public.question_keys k on k.question_id = q.id
     where q.source_reference like 'generated:%'
       and (
         (q.format = 'Y1'::public.question_format and not (k.payload ? 'correct_option_id'))
         or (q.format = 'Y2'::public.question_format and not (k.payload ? 'pairs'))
         or (q.format = 'Y3'::public.question_format and not (k.payload ? 'order'))
       )
  ) then
    raise exception 'parametric_key_shape_invalid';
  end if;
end
$$;

-- Y1 kaliti aynan shu savolning option'iga murojaat qiladi.
do $$
begin
  if exists (
    select 1
      from public.questions q
      join public.question_keys k on k.question_id = q.id
     where q.source_reference like 'generated:%'
       and q.format = 'Y1'::public.question_format
       and not exists (
         select 1
           from public.question_options o
          where o.question_id = q.id
            and o.id = (k.payload ->> 'correct_option_id')::uuid
       )
  ) then
    raise exception 'parametric_y1_key_option_invalid';
  end if;
end
$$;

-- Y2 juftliklaridagi barcha chap/o'ng ID'lar shu savol optionlari.
do $$
begin
  if exists (
    select 1
      from public.questions q
      join public.question_keys k on k.question_id = q.id
      cross join lateral jsonb_each_text(k.payload -> 'pairs') pair
     where q.source_reference like 'generated:%'
       and q.format = 'Y2'::public.question_format
       and (
         not exists (
           select 1 from public.question_options o
            where o.question_id = q.id and o.id = pair.key::uuid
         )
         or not exists (
           select 1 from public.question_options o
            where o.question_id = q.id and o.id = pair.value::uuid
         )
       )
  ) then
    raise exception 'parametric_y2_key_option_invalid';
  end if;
end
$$;

-- Y3 tartib ro'yxatidagi barcha ID'lar shu savol optionlari va soni teng.
do $$
begin
  if exists (
    select 1
      from public.questions q
      join public.question_keys k on k.question_id = q.id
     where q.source_reference like 'generated:%'
       and q.format = 'Y3'::public.question_format
       and (
         jsonb_array_length(k.payload -> 'order') <> (
           select count(*) from public.question_options o where o.question_id = q.id
         )
         or exists (
           select 1
             from jsonb_array_elements_text(k.payload -> 'order') elem(id)
            where not exists (
              select 1 from public.question_options o
               where o.question_id = q.id and o.id = elem.id::uuid
            )
         )
       )
  ) then
    raise exception 'parametric_y3_key_option_invalid';
  end if;
end
$$;

-- Idempotency: source_reference va deterministic UUIDlar takrorlanmaydi.
do $$
begin
  if exists (
    select source_reference
      from public.questions
     where source_reference like 'generated:%'
     group by source_reference
    having count(*) > 1
  ) then
    raise exception 'parametric_source_reference_duplicate';
  end if;
end
$$;
