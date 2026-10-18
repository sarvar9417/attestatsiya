-- TASK-211: preset RLS ownership, cross-user isolation and 30 item cap.
begin;
insert into auth.users(id,email) values
 ('92110000-0000-4000-8000-000000000001','preset-a@example.invalid'),
 ('92110000-0000-4000-8000-000000000002','preset-b@example.invalid');
select set_config('request.jwt.claim.sub','92110000-0000-4000-8000-000000000001',false);
set role authenticated;
insert into public.custom_test_presets(title,config)
values ('Sinov 1','{"total_count":1,"topics":[]}'::jsonb);
do $$
begin
 if (select count(*) from public.custom_test_presets)<>1 then
  raise exception 'own preset not visible';
 end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub','92110000-0000-4000-8000-000000000002',false);
set role authenticated;
do $$
begin
 if (select count(*) from public.custom_test_presets)<>0 then
  raise exception 'cross-user preset read leak';
 end if;
 if (select count(*) from public.custom_test_presets where title='Sinov 1')<>0 then
  raise exception 'cross-user title leak';
 end if;
end $$;
update public.custom_test_presets set title='Stolen' where title='Sinov 1';
delete from public.custom_test_presets where title='Sinov 1';
do $$
begin
 if exists(select 1 from public.custom_test_presets where title='Stolen') then
  raise exception 'cross-user update leak';
 end if;
end $$;
reset role;
do $$
begin
 if (select title from public.custom_test_presets where user_id='92110000-0000-4000-8000-000000000001')<>'Sinov 1' then
  raise exception 'cross-user changes affected owner';
 end if;
end $$;
select set_config('request.jwt.claim.sub','92110000-0000-4000-8000-000000000001',false);
set role authenticated;
insert into public.custom_test_presets(title,config)
select 'Template '||n,'{"total_count":1}'::jsonb from generate_series(2,30) n;
do $$
begin
 if (select count(*) from public.custom_test_presets)<>30 then
  raise exception 'expected thirty presets';
 end if;
 begin
  insert into public.custom_test_presets(title,config) values('Too many','{}'::jsonb);
  raise exception 'preset cap was bypassed';
 exception when others then
  if sqlerrm not like '%custom_preset_limit%' then raise; end if;
 end;
end $$;
reset role;
rollback;
