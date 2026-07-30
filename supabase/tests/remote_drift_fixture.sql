-- Reproduces the non-destructive parts of the 2026-07-30 remote audit:
-- one INF subject, nine legacy modules, a 150-minute blueprint and S1-S9 quotas.

insert into public.subjects (code, name_uz, is_active)
values ('INF', 'Informatika', true);

insert into public.modules (
  subject_id,
  order_idx,
  slug,
  title_uz,
  status
)
select
  subject.id,
  module_order,
  format('legacy-module-%s', module_order),
  format('Legacy module %s', module_order),
  'published'::public.content_status
from public.subjects subject
cross join generate_series(1, 9) as module_order
where subject.code = 'INF';

insert into public.lessons (
  module_id,
  order_idx,
  slug,
  title_uz,
  body_mdx,
  status
)
select
  module.id,
  1,
  'legacy-lesson',
  'Legacy lesson',
  'FK preservation fixture',
  'published'::public.content_status
from public.modules module
join public.subjects subject on subject.id = module.subject_id
where subject.code = 'INF'
  and module.order_idx = 1;

insert into public.constructs (
  subject_id,
  group_code,
  code,
  slug,
  title_uz
)
select
  id,
  'S1',
  'LEGACY.01',
  'legacy-01',
  'Legacy construct'
from public.subjects
where code = 'INF';

insert into public.questions (
  subject_id,
  construct_id,
  group_code,
  format,
  cognitive,
  stem_md,
  status
)
select
  subject.id,
  construct.id,
  'S1',
  'Y1'::public.question_format,
  'bilish'::public.cognitive_level,
  'Legacy question',
  'published'::public.content_status
from public.subjects subject
join public.constructs construct on construct.subject_id = subject.id
where subject.code = 'INF'
  and construct.code = 'LEGACY.01';

insert into public.blueprints (
  subject_id,
  version,
  effective_year,
  total_questions,
  duration_min,
  points_per_item,
  is_active
)
select id, 1, 2026, 50, 150, 2, true
from public.subjects
where code = 'INF';

insert into public.blueprint_quotas (
  blueprint_id,
  group_code,
  order_idx,
  question_count,
  n_bilish,
  n_qollash,
  n_mulohaza
)
select
  blueprint.id,
  seed.group_code,
  seed.order_idx,
  seed.question_count,
  seed.n_bilish,
  seed.n_qollash,
  seed.n_mulohaza
from public.blueprints blueprint
cross join (
  values
    ('S1', 1, 8, 5, 1, 2),
    ('S2', 2, 7, 4, 1, 2),
    ('S3', 3, 5, 3, 1, 1),
    ('S4', 4, 6, 4, 1, 1),
    ('S5', 5, 10, 7, 1, 2),
    ('S6', 6, 4, 3, 0, 1),
    ('S7', 7, 3, 2, 0, 1),
    ('S8', 8, 4, 3, 0, 1),
    ('S9', 9, 3, 2, 1, 0)
) as seed(
  group_code,
  order_idx,
  question_count,
  n_bilish,
  n_qollash,
  n_mulohaza
);
