-- TASK-210 private preset RLS + uniqueness + 30 item limit regressions.
begin;

insert into auth.users (id,email) values
  ('92200000-0000-4000-8000-000000000001','task210-preset-owner@example.invalid'),
  ('92200000-0000-4000-8000-000000000002','task210-preset-other@example.invalid');

do $permissions$
begin
  if has_table_privilege('anon','public.custom_exam_presets','SELECT') then
    raise exception 'anonymous must not read saved presets';
  end if;
  if not has_table_privilege('authenticated','public.custom_exam_presets','SELECT,INSERT,UPDATE,DELETE') then
    raise exception 'learner preset CRUD grants missing';
  end if;
end
$permissions$;

select set_config('request.jwt.claim.sub','92200000-0000-4000-8000-000000000001',false);
set role authenticated;

insert into public.custom_exam_presets(name,config)
values ('My template', '{"total_count":1,"topics":[]}'::jsonb);

do $owner$
declare
  n integer;
  id_one uuid;
  i integer;
  rejected boolean := false;
begin
  select id into id_one from public.custom_exam_presets where name='My template';
  if id_one is null then raise exception 'preset not created'; end if;

  update public.custom_exam_presets set name='My revised template' where id=id_one;
  if (select name from public.custom_exam_presets where id=id_one) <> 'My revised template' then
    raise exception 'cannot rename own preset';
  end if;

  begin
    insert into public.custom_exam_presets(name,config)
    values ('my REVISED TEMPLATE', '{"total_count":1}'::jsonb);
  exception when unique_violation then rejected:=true;
  end;
  if not rejected then raise exception 'case-insensitive unique constraint missing'; end if;

  for i in 1..29 loop
    insert into public.custom_exam_presets(name,config)
    values ('New preset '||i, '{"total_count":1}'::jsonb);
  end loop;

  if (select count(*) from public.custom_exam_presets) <> 30 then
    raise exception 'unexpected saved preset total';
  end if;

  rejected := false;
  begin
    insert into public.custom_exam_presets(name,config)
    values ('Preset 31', '{"total_count":1}'::jsonb);
  exception when others then
    if sqlerrm like '%preset_limit_reached%' then rejected:=true;
    else raise;
    end if;
  end;
  if not rejected then raise exception '30 preset limit not enforced'; end if;
end
$owner$;

select set_config('request.jwt.claim.sub','92200000-0000-4000-8000-000000000002',false);

do $isolation$
declare
  v_rows integer;
begin
  select count(*) into v_rows from public.custom_exam_presets;
  if v_rows <> 0 then raise exception 'other user can read private presets'; end if;

  update public.custom_exam_presets set name='Tampered';
  get diagnostics v_rows = row_count;
  if v_rows <> 0 then raise exception 'other user updated private preset'; end if;

  delete from public.custom_exam_presets;
  get diagnostics v_rows = row_count;
  if v_rows <> 0 then raise exception 'other user deleted private preset'; end if;
end
$isolation$;

insert into public.custom_exam_presets(name,config)
values ('Own template', '{"total_count":1}'::jsonb);

reset role;
do $adminverify$
declare n integer;
begin
  select count(*) into n from public.custom_exam_presets;
  if n <> 31 then raise exception 'cross-user preset ownership data is wrong: %',n; end if;
end
$adminverify$;

rollback;
