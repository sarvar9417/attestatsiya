import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const archiveDir = join(root, 'supabase', 'archive', 'pre-baseline')
const outputPath = join(
  root,
  'supabase',
  'migrations',
  '20260730000000_uuid_baseline.sql',
)

const sources = [
  '20260730000001_extensions_enums.sql',
  '20260730000002_content.sql',
  '20260730000003_assessment.sql',
  '20260730000004_progress.sql',
  '20260730000005_quality.sql',
  '20260730000006_rls.sql',
  '20260730000007_functions.sql',
]

const sections = sources.map((source) => {
  const sql = readFileSync(join(archiveDir, source), 'utf8').trim()
  return [
    '-- ============================================================================',
    `-- Source: ${source}`,
    '-- ============================================================================',
    sql,
  ].join('\n')
})

const baseline = [
  '-- Attestatsiya UUID schema baseline',
  '--',
  '-- Remote read-only audit on 2026-07-30 confirmed that the active database',
  '-- uses this UUID schema but has no supabase_migrations metadata table.',
  '-- The pre-baseline source files are preserved under supabase/archive/.',
  '-- Do not apply this file to the existing remote database; mark only this',
  '-- baseline version as applied, then run later reconciliation migrations.',
  '',
  ...sections.flatMap((section) => [section, '']),
].join('\n')

if (baseline.includes('mock_exam_id  BIGINT')) {
  throw new Error('Legacy BIGINT schema marker found in UUID baseline')
}

if ((baseline.match(/create table public\.subjects/g) ?? []).length !== 1) {
  throw new Error('UUID baseline must create public.subjects exactly once')
}

writeFileSync(outputPath, baseline)
console.log(`UUID baseline generated: ${outputPath}`)
