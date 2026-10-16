-- Forward-only repair for live 20261016 hotfix: the hotfix used IDs shared
-- with canonical source-backed M02/M05 rows but replaced their slugs.
-- Preserve lesson UUIDs, existing body content, topic-test progress and exams.
-- Do not delete or re-create any row. Safe to rerun.
begin;
do $repair$
declare m02 uuid; m05 uuid; n int;
begin
 select id into strict m02 from public.modules where code='M02';
 select id into strict m05 from public.modules where code='M05';
 if not exists (select 1 from public.lessons where id='92000000-0000-4000-8000-000000000004'::uuid
  and module_id=m02 and slug in ('m02-06','tizimli-amaliy-va-xizmat-dasturlari'))
 then raise exception 'Canonical M02.04 source row missing or moved, aborting safely'; end if;
 if not exists (select 1 from public.lessons where id='95000000-0000-4000-8000-000000000002'::uuid
  and module_id=m05 and slug in ('m05-02','sanoq-sistemalari-otkazish'))
 then raise exception 'Canonical M05.02 source row missing or moved, aborting safely'; end if;

 update public.lessons
 set order_idx=4,
     slug='tizimli-amaliy-va-xizmat-dasturlari',
     title_uz='Tizimli, amaliy va xizmat ko‘rsatuvchi dasturlar',
     updated_at=now()
 where id='92000000-0000-4000-8000-000000000004'::uuid
 and (order_idx<>4 or slug<>'tizimli-amaliy-va-xizmat-dasturlari'
 or title_uz<>'Tizimli, amaliy va xizmat ko‘rsatuvchi dasturlar');

 update public.lessons
 set order_idx=2,
     slug='sanoq-sistemalari-otkazish',
     title_uz='Sonlarni sanoq sistemalari orasida o‘tkazish',
     updated_at=now()
 where id='95000000-0000-4000-8000-000000000002'::uuid
 and (order_idx<>2 or slug<>'sanoq-sistemalari-otkazish'
 or title_uz<>'Sonlarni sanoq sistemalari orasida o‘tkazish');

 select count(*) into n from public.lessons l join public.lesson_constructs lc
 on lc.lesson_id=l.id join public.constructs c on c.id=lc.construct_id
 where (l.id='92000000-0000-4000-8000-000000000004'::uuid and c.code='S2.HW.04'
 and l.slug='tizimli-amaliy-va-xizmat-dasturlari' and l.status='published'::public.content_status)
 or (l.id='95000000-0000-4000-8000-000000000002'::uuid and c.code='S3.NUM.02'
 and l.slug='sanoq-sistemalari-otkazish' and l.status='published'::public.content_status);
 if n<>2 then raise exception 'Restored source lessons missing construct links (%/2)',n;end if;
end
$repair$;
commit;