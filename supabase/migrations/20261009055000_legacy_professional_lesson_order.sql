-- Preserve existing learner references while reserving canonical 1-8 slots
-- for the 2026 source-backed M14/M15/M16 lesson content.
-- Legacy lesson rows remain published and retain their IDs and slugs.
begin;
update public.lessons l
set order_idx = 100 + l.order_idx,
    updated_at = now()
from public.modules m
where l.module_id = m.id
  and m.code in ('M14','M15','M16')
  and l.slug ~ '^m(14|15|16)-[0-9]+$'
  and l.order_idx < 100;
commit;
