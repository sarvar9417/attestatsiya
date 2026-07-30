import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MODULES } from '../src/data/contentTree'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const blueprintMarkdown = readFileSync(join(root, 'files', '04-BLUEPRINT.md'), 'utf8')

const blueprintGroups = [
  ['S1.INFO', 1, 3, 1, 2, 0],
  ['S2.HW', 2, 2, 1, 1, 0],
  ['S2.OFFICE', 3, 5, 0, 5, 0],
  ['S3.LOGIC', 4, 3, 0, 2, 1],
  ['S3.NUM', 5, 2, 0, 2, 0],
  ['S3.ALGO', 6, 3, 0, 2, 1],
  ['S4.BLOCK', 7, 3, 0, 3, 0],
  ['S4.CODE', 8, 3, 0, 2, 1],
  ['S4.DB', 9, 2, 0, 2, 0],
  ['S5.WEB', 10, 5, 1, 4, 0],
  ['S6.NET', 11, 2, 0, 2, 0],
  ['S7.SEC', 12, 2, 1, 1, 0],
  ['KS', 13, 5, 1, 3, 1],
  ['PM.GEN', 14, 7, 2, 4, 1],
  ['PM.MET', 15, 3, 1, 0, 2],
] as const

const officialGroupCodes = new Set(blueprintGroups.map(([code]) => code))
const constructs: Array<{ code: string; groupCode: string; title: string }> = []
let currentGroup: string | null = null
let inConstructCodeBlock = false

for (const line of blueprintMarkdown.split('\n')) {
  const heading = line.match(/^### ([A-Z0-9.]+) — \d+$/)
  if (heading) {
    currentGroup = officialGroupCodes.has(heading[1]) ? heading[1] : null
    inConstructCodeBlock = false
    continue
  }

  if (line.trim() === '```') {
    inConstructCodeBlock = currentGroup ? !inConstructCodeBlock : false
    continue
  }

  if (!currentGroup || !inConstructCodeBlock) continue

  const construct = line.match(/^([A-Z0-9.]+)\s{2,}(.+)$/)
  if (!construct) continue

  constructs.push({
    code: construct[1],
    groupCode: currentGroup,
    title: construct[2].trim(),
  })
}

const quote = (value: string) => `'${value.replaceAll("'", "''")}'`

const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[‘’ʼʻ']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const moduleRows = MODULES.map((module, index) => {
  const values = [
    quote(module.code),
    String(index + 1),
    quote(slugify(module.title)),
    quote(module.title),
    quote(module.description),
    `${quote(module.section)}::public.exam_section`,
    String(module.examQuestionCount),
  ]
  return `    (${values.join(', ')})`
}).join(',\n')

const quotaRows = blueprintGroups
  .map(
    ([code, order, count, bilish, qollash, mulohaza]) =>
      `    (${quote(code)}, ${order}, ${count}, ${bilish}, ${qollash}, ${mulohaza})`,
  )
  .join(',\n')

const constructRows = constructs
  .map(({ code, groupCode, title }) => {
    const values = [
      quote(code),
      quote(groupCode),
      quote(code.toLowerCase().replaceAll('.', '-')),
      quote(title),
    ]
    return `    (${values.join(', ')})`
  })
  .join(',\n')

const totals = blueprintGroups.reduce(
  (sum, [, , count, bilish, qollash, mulohaza]) => ({
    count: sum.count + count,
    bilish: sum.bilish + bilish,
    qollash: sum.qollash + qollash,
    mulohaza: sum.mulohaza + mulohaza,
  }),
  { count: 0, bilish: 0, qollash: 0, mulohaza: 0 },
)

if (MODULES.length !== 16) {
  throw new Error(`Expected 16 modules, received ${MODULES.length}`)
}

if (constructs.length !== 76) {
  throw new Error(`Expected 76 constructs, received ${constructs.length}`)
}

if (
  totals.count !== 50 ||
  totals.bilish !== 8 ||
  totals.qollash !== 35 ||
  totals.mulohaza !== 7
) {
  throw new Error(`Invalid blueprint totals: ${JSON.stringify(totals)}`)
}

for (const construct of constructs) {
  if (!construct.code.startsWith(`${construct.groupCode}.`)) {
    throw new Error(
      `Construct ${construct.code} does not belong to ${construct.groupCode}`,
    )
  }
}

const sql = `-- Official 2026 Informatics attestation contract.
-- Sources: files/04-BLUEPRINT.md and src/data/contentTree.ts.
-- This migration is deliberately idempotent so supabase/seed.sql can reuse it.

begin;

do $$
declare
  v_subject_id uuid;
begin
  select id
    into v_subject_id
    from public.subjects
   where code = 'informatika'
   limit 1;

  if v_subject_id is null then
    select id
      into v_subject_id
      from public.subjects
     where code = 'INF'
     limit 1;
  end if;

  if v_subject_id is null then
    insert into public.subjects (code, name_uz, is_active)
    values ('informatika', 'Informatika va axborot texnologiyalari', true)
    returning id into v_subject_id;
  else
    update public.subjects
       set code = 'informatika',
           name_uz = 'Informatika va axborot texnologiyalari',
           is_active = true
     where id = v_subject_id;
  end if;
end
$$;

insert into public.modules (
  subject_id,
  code,
  order_idx,
  slug,
  title_uz,
  summary_uz,
  exam_section,
  exam_question_count,
  status
)
select
  subject.id,
  seed.code,
  seed.order_idx,
  seed.slug,
  seed.title_uz,
  seed.summary_uz,
  seed.exam_section,
  seed.exam_question_count,
  'published'::public.content_status
from public.subjects subject
cross join (
  values
${moduleRows}
) as seed(
  code,
  order_idx,
  slug,
  title_uz,
  summary_uz,
  exam_section,
  exam_question_count
)
where subject.code = 'informatika'
on conflict (subject_id, order_idx) do update
set code = excluded.code,
    slug = excluded.slug,
    title_uz = excluded.title_uz,
    summary_uz = excluded.summary_uz,
    exam_section = excluded.exam_section,
    exam_question_count = excluded.exam_question_count,
    status = excluded.status,
    updated_at = now();

update public.blueprints
   set is_active = false
 where subject_id = (
   select id from public.subjects where code = 'informatika'
 );

insert into public.blueprints (
  subject_id,
  version,
  effective_year,
  total_questions,
  duration_min,
  points_per_item,
  is_active
)
select id, 1, 2026, 50, 120, 2, true
  from public.subjects
 where code = 'informatika'
on conflict (subject_id, version) do update
set effective_year = excluded.effective_year,
    total_questions = excluded.total_questions,
    duration_min = excluded.duration_min,
    points_per_item = excluded.points_per_item,
    is_active = excluded.is_active;

delete from public.blueprint_quotas
 where blueprint_id = (
   select blueprint.id
     from public.blueprints blueprint
     join public.subjects subject on subject.id = blueprint.subject_id
    where subject.code = 'informatika'
      and blueprint.version = 1
 );

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
join public.subjects subject on subject.id = blueprint.subject_id
cross join (
  values
${quotaRows}
) as seed(
  group_code,
  order_idx,
  question_count,
  n_bilish,
  n_qollash,
  n_mulohaza
)
where subject.code = 'informatika'
  and blueprint.version = 1;

update public.constructs
   set is_active = false
 where subject_id = (
   select id from public.subjects where code = 'informatika'
 );

insert into public.constructs (
  subject_id,
  code,
  group_code,
  slug,
  title_uz,
  is_active
)
select
  subject.id,
  seed.code,
  seed.group_code,
  seed.slug,
  seed.title_uz,
  true
from public.subjects subject
cross join (
  values
${constructRows}
) as seed(code, group_code, slug, title_uz)
where subject.code = 'informatika'
on conflict (code) do update
set subject_id = excluded.subject_id,
    group_code = excluded.group_code,
    slug = excluded.slug,
    title_uz = excluded.title_uz,
    is_active = true;

do $$
declare
  v_module_count int;
  v_quota_count int;
  v_question_count int;
  v_bilish int;
  v_qollash int;
  v_mulohaza int;
  v_construct_count int;
begin
  select count(*)
    into v_module_count
    from public.modules module
    join public.subjects subject on subject.id = module.subject_id
   where subject.code = 'informatika';

  select
    count(*),
    sum(quota.question_count),
    sum(quota.n_bilish),
    sum(quota.n_qollash),
    sum(quota.n_mulohaza)
  into
    v_quota_count,
    v_question_count,
    v_bilish,
    v_qollash,
    v_mulohaza
  from public.blueprint_quotas quota
  join public.blueprints blueprint on blueprint.id = quota.blueprint_id
  join public.subjects subject on subject.id = blueprint.subject_id
  where subject.code = 'informatika'
    and blueprint.version = 1;

  select count(*)
    into v_construct_count
    from public.constructs construct
    join public.subjects subject on subject.id = construct.subject_id
   where subject.code = 'informatika'
     and construct.is_active;

  if v_module_count <> 16 then
    raise exception 'official_seed_module_count: expected 16, received %',
      v_module_count;
  end if;

  if v_quota_count <> 15
     or v_question_count <> 50
     or v_bilish <> 8
     or v_qollash <> 35
     or v_mulohaza <> 7 then
    raise exception
      'official_seed_blueprint: expected 15/50/8/35/7, received %/%/%/%/%',
      v_quota_count,
      v_question_count,
      v_bilish,
      v_qollash,
      v_mulohaza;
  end if;

  if v_construct_count <> 76 then
    raise exception 'official_seed_construct_count: expected 76, received %',
      v_construct_count;
  end if;
end
$$;

commit;
`

const migrationPath = join(
  root,
  'supabase',
  'migrations',
  '20260730000009_official_2026_seed.sql',
)
const seedPath = join(root, 'supabase', 'seed.sql')

writeFileSync(migrationPath, sql)
writeFileSync(seedPath, sql)

console.log(`Official seed generated: ${migrationPath}`)
console.log(`Local reset seed generated: ${seedPath}`)
