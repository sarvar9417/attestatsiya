/**
 * Barcha darslarni Supabase `lessons` jadvaliga SQL orqali sync qiladi.
 * Ishlatish: npx tsx scripts/seed-lessons-sql.ts
 */

import { execSync } from 'node:child_process'
import { writeFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

interface LessonRow {
  id: string
  title: string
  subtitle: string
  level: string
  day: number
  category: string | null
  data: Record<string, unknown>
}

async function loadLessons() {
  const { loadAllLessons } = await import('../src/data/dailyLessons.js')
  return await loadAllLessons() as Record<string, unknown>[]
}

function toRow(lesson: Record<string, unknown>): LessonRow {
  const { id, title, subtitle, level, day, category, ...rest } = lesson as Record<string, unknown> & { id: string; title: string; subtitle: string; level: string; day: number; category?: string }
  return {
    id,
    title,
    subtitle,
    level,
    day,
    category: category ?? null,
    data: {
      formulas:         (rest.formulas         ?? []) as [],
      rules:            (rest.rules            ?? []) as [],
      vocabulary:       (rest.vocabulary       ?? []) as [],
      examples:         (rest.examples         ?? []) as [],
      specialCases:     (rest.specialCases     ?? []) as [],
      exercises:        (rest.exercises        ?? []) as [],
      exerciseSections: (rest.exerciseSections ?? []) as [],
      tests:            (rest.tests            ?? []) as [],
      testSections:     (rest.testSections     ?? []) as [],
      ...(rest.reading        ? { reading: rest.reading }             : {}),
      ...(rest.writing        ? { writing: rest.writing }             : {}),
      ...(rest.listening      ? { listening: rest.listening }         : {}),
      ...(rest.dialogues      ? { dialogues: rest.dialogues }         : {}),
      ...(rest.culturalNotes  ? { culturalNotes: rest.culturalNotes } : {}),
    },
  }
}

function escapeSql(val: unknown): string {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'number') return String(val)
  const json = JSON.stringify(val)
  return `'${json.replace(/'/g, "''")}'`
}

function rowToSql(r: LessonRow): string {
  const vals = [
    escapeSql(r.id),
    escapeSql(r.title),
    escapeSql(r.subtitle),
    escapeSql(r.level),
    escapeSql(r.day),
    escapeSql(r.category),
    `${escapeSql(r.data)}::jsonb`,
  ]
  return `(${vals.join(', ')})`
}

async function main() {
  console.log('📚 Darslar yuklanmoqda...')
  const lessons = await loadLessons()
  console.log(`   ${lessons.length} ta dars topildi`)

  const rows = lessons.map(toRow)
  const BATCH = 50
  let total = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const values = batch.map(rowToSql).join(',\n')

    const sql = `INSERT INTO lessons (id, title, subtitle, level, day, category, data)
VALUES ${values}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  level = EXCLUDED.level,
  day = EXCLUDED.day,
  category = EXCLUDED.category,
  data = EXCLUDED.data;`

    const sqlFile = `/tmp/lessons_seed_${i}.sql`
    writeFileSync(sqlFile, sql, 'utf-8')

    try {
      execSync(`supabase db query --linked < "${sqlFile}" 2>/dev/null`, {
        stdio: 'pipe',
        cwd: process.cwd(),
      })
      total += batch.length
      process.stdout.write(`   ✅ ${total}/${rows.length} synced...\r`)
    } catch {
      const failedIds = batch.map(r => r.id).join(', ')
      console.error(`\n❌ Batch ${i / BATCH + 1}: ${failedIds}`)
    } finally {
      try { unlinkSync(sqlFile) } catch { /* ignore */ }
    }
  }

  console.log(`\n✅ Barcha ${total} ta dars sync qilindi`)
}

main().catch(err => {
  console.error('💥 Xato:', err.message)
  process.exit(1)
})
