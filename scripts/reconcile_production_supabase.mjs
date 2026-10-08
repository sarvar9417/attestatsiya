const token = process.env.SUPABASE_ACCESS_TOKEN
const ref = process.env.SUPABASE_PROJECT_REF

if (!token || !ref) {
  throw new Error('Production reconcile env is missing')
}

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

async function management(path, { method = 'GET', body } = {}) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${ref}/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const raw = await response.text()
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    data = raw
  }

  if (!response.ok) {
    const safe =
      typeof data === 'string'
        ? data.slice(0, 600)
        : JSON.stringify(data).slice(0, 600)
    throw new Error(`${method} ${path} failed (${response.status}): ${safe}`)
  }

  return data
}

async function readOnly(query) {
  return management('database/query/read-only', {
    method: 'POST',
    body: { query },
  })
}

async function writeQuery(query) {
  return management('database/query', {
    method: 'POST',
    body: { query },
  })
}

function stripOuterTransaction(sql) {
  return sql
    .replace(/^\s*begin\s*;\s*/i, '')
    .replace(/\s*commit\s*;\s*$/i, '')
}

function sqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

const sourceCommit = 'ef84655a3b8f1cc755733173d636b60ffdd8739c'
const migrations = [
  {
    version: '20261007000018',
    name: 'question_keys_staff_only',
    file: '20261007000018_question_keys_staff_only.sql',
  },
  {
    version: '20261007052732',
    name: 'parametric_generated_questions',
    file: '20261007052732_parametric_generated_questions.sql',
  },
  {
    version: '20261007131000',
    name: 'onboarding_profile',
    file: '20261007131000_onboarding_profile.sql',
  },
  {
    version: '20261007184500',
    name: 'mastery_srs_foundation',
    file: '20261007184500_mastery_srs_foundation.sql',
  },
]

const project = await management('')
console.log(
  'PROJECT',
  JSON.stringify({
    id: project.id,
    name: project.name,
    region: project.region,
    status: project.status,
  })
)

const drift = await readOnly(`
  select version, name, statements
  from supabase_migrations.schema_migrations
  where version = '20260801000018'
`)
console.log('REMOTE_DRIFT_MIGRATION', JSON.stringify(drift))

let history = await readOnly(`
  select version, name
  from supabase_migrations.schema_migrations
  order by version
`)

for (const migration of migrations) {
  if (history.some((row) => row.version === migration.version)) {
    console.log(
      'MIGRATION_SKIP',
      JSON.stringify({ version: migration.version, name: migration.name })
    )
    continue
  }

  const rawUrl =
    `https://raw.githubusercontent.com/sarvar9417/attestatsiya/${sourceCommit}/supabase/migrations/${migration.file}`
  const response = await fetch(rawUrl)
  if (!response.ok) {
    throw new Error(
      `Cannot fetch ${migration.file} from source commit: ${response.status}`
    )
  }

  const original = await response.text()
  const body = stripOuterTransaction(original)
  const tracked = `
    insert into supabase_migrations.schema_migrations(version, name)
    values (${sqlLiteral(migration.version)}, ${sqlLiteral(migration.name)})
    on conflict (version) do nothing;
  `

  await writeQuery(`begin;\n${body}\n${tracked}\ncommit;`)
  console.log(
    'MIGRATION_APPLIED',
    JSON.stringify({ version: migration.version, name: migration.name })
  )

  history = await readOnly(`
    select version, name
    from supabase_migrations.schema_migrations
    order by version
  `)
}

const state = await readOnly(`
  select
    exists (
      select 1
      from information_schema.columns
      where table_schema='public'
        and table_name='profiles'
        and column_name='daily_goal_minutes'
    ) as has_onboarding_profile,
    exists (
      select 1
      from information_schema.columns
      where table_schema='public'
        and table_name='user_construct_stats'
        and column_name='mastery_status'
    ) as has_mastery_status,
    to_regclass('public.mastery_evidence') is not null as has_mastery_evidence,
    (
      select count(*)::int
      from public.questions
      where is_generated = true
    ) as generated_questions
`)

const policies = await readOnly(`
  select policyname, cmd, roles
  from pg_policies
  where schemaname='public'
    and tablename='question_keys'
  order by policyname
`)

const versions = await readOnly(`
  select version, name
  from supabase_migrations.schema_migrations
  where version in (
    '20261007000018',
    '20261007052732',
    '20261007131000',
    '20261007184500'
  )
  order by version
`)

const summary = state[0]
const policyNames = new Set(policies.map((row) => row.policyname))
const versionSet = new Set(versions.map((row) => row.version))

const expectedVersions = migrations.map((migration) => migration.version)
const verified =
  summary?.has_onboarding_profile === true &&
  summary?.has_mastery_status === true &&
  summary?.has_mastery_evidence === true &&
  Number(summary?.generated_questions ?? 0) >= 270 &&
  policyNames.has('question_keys_staff_manage') &&
  !policyNames.has('question_keys_readable') &&
  expectedVersions.every((version) => versionSet.has(version))

console.log(
  'VERIFY_STATE',
  JSON.stringify({
    ...summary,
    question_key_policies: [...policyNames],
    migrations: versions,
    verified,
  })
)

const healthResponse = await fetch(
  'https://attestatsiya-backend.vercel.app/api/health'
)
const healthRaw = await healthResponse.text()
let healthBody
try {
  healthBody = JSON.parse(healthRaw)
} catch {
  healthBody = { raw: healthRaw.slice(0, 300) }
}
console.log(
  'BACKEND_HEALTH',
  JSON.stringify({
    status: healthResponse.status,
    body: healthBody,
  })
)

if (!verified) {
  throw new Error('Remote Supabase verification failed')
}

if (!healthResponse.ok) {
  throw new Error('Production backend health check failed after reconciliation')
}
