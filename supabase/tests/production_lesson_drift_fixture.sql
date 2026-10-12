-- Production-like legacy lesson fixture.
-- Run only in the dedicated CI database before source-backed lesson migrations.
-- It deliberately occupies the low order_idx slots that production legacy
-- lessons currently use, reproducing the UNIQUE(module_id, order_idx) conflict.

do $$
declare
  lane record;
  v_module uuid;
  v_i int;
begin
  for lane in
    select *
    from (
      values
        ('M02',4),('M03',4),('M04',4),('M05',3),('M06',4),('M07',5),
        ('M08',5),('M10',3),('M11',3),('M12',5),('M13',6)
    ) as x(module_code,reserved_order_count)
  loop
    select id into v_module from public.modules where code=lane.module_code;
    if v_module is null then
      raise exception 'production drift fixture missing module %',lane.module_code;
    end if;

    for v_i in 1..lane.reserved_order_count loop
      insert into public.lessons(
        id,module_id,order_idx,slug,title_uz,body_mdx,est_minutes,status
      )
      values(
        gen_random_uuid(),
        v_module,
        v_i,
        'fixture-legacy-'||lower(lane.module_code)||'-'||v_i,
        'Fixture legacy '||lane.module_code||' #'||v_i,
        '',
        15,
        'published'::public.content_status
      );
    end loop;
  end loop;
end
$$;
