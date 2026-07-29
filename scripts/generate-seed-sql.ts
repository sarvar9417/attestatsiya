/**
 * Barcha darslar uchun SQL UPSERT faylini generatsiya qiladi.
 * Ishlatish: npm run seed:sql
 * Natija: scripts/seed-lessons.sql
 * Bu faylni Supabase SQL Editor ga nusxalash mumkin.
 */

import { writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function loadLessons() {
  const [
    { A1_LESSONS_NEW },
    { A2_LESSONS },
    { B1_LESSONS_NEW },
    { B1PLUS_LESSONS_NEW },
    { B2_LESSONS_NEW },
  ] = await Promise.all([
    import('../src/data/daily/index.js'),
    import('../src/data/daily/lessonsA2.js'),
    import('../src/data/daily/lessonsB1.js'),
    import('../src/data/daily/lessonsB1plus.js'),
    import('../src/data/daily/lessonsB2.js'),
  ])
  return [
    ...A1_LESSONS_NEW,
    ...A2_LESSONS,
    ...B1_LESSONS_NEW,
    ...B1PLUS_LESSONS_NEW,
    ...B2_LESSONS_NEW,
  ]
}

function toRow(lesson: any) {
  const { id, title, subtitle, level, day, category, ...rest } = lesson
  return {
    id,
    title,
    subtitle,
    level,
    day,
    category: category ?? null,
    data: {
      formulas:         rest.formulas         ?? [],
      rules:            rest.rules            ?? [],
      vocabulary:       rest.vocabulary       ?? [],
      examples:         rest.examples         ?? [],
      specialCases:     rest.specialCases     ?? [],
      exercises:        rest.exercises        ?? [],
      exerciseSections: rest.exerciseSections ?? [],
      tests:            rest.tests            ?? [],
      testSections:     rest.testSections     ?? [],
      ...(rest.reading       ? { reading: rest.reading }             : {}),
      ...(rest.writing       ? { writing: rest.writing }             : {}),
      ...(rest.listening     ? { listening: rest.listening }         : {}),
      ...(rest.dialogues     ? { dialogues: rest.dialogues }         : {}),
      ...(rest.culturalNotes ? { culturalNotes: rest.culturalNotes } : {}),
    },
  }
}

function escape(s: string): string {
  return s.replace(/'/g, "''")
}

async function main() {
  console.log('📚 Darslar yuklanmoqda...')
  const lessons = await loadLessons()
  console.log(`   ${lessons.length} ta dars topildi`)

  const rows = lessons.map(toRow)

  const lines: string[] = [
    '-- EnglishPath lessons seed',
    `-- Generated: ${new Date().toISOString()}`,
    `-- Lessons: ${rows.length}`,
    '',
    '-- Step 1: Jadvalni to\'g\'ri holga keltirish',
    'ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;',
    '',
    '-- Step 2: Upsert',
    'INSERT INTO lessons (id, title, subtitle, level, day, category, data)',
    'VALUES',
  ]

  rows.forEach((row, i) => {
    const isLast = i === rows.length - 1
    const dataJson = escape(JSON.stringify(row.data))
    const title = escape(row.title ?? '')
    const subtitle = escape(row.subtitle ?? '')
    const level = escape(row.level ?? '')
    const cat = row.category ? `'${escape(row.category)}'` : 'NULL'

    lines.push(
      `  ('${escape(row.id)}', '${title}', '${subtitle}', '${level}', ${row.day}, ${cat}, '${dataJson}'::jsonb)${isLast ? '' : ','}`
    )
  })

  lines.push(
    'ON CONFLICT (id) DO UPDATE SET',
    '  title    = EXCLUDED.title,',
    '  subtitle = EXCLUDED.subtitle,',
    '  level    = EXCLUDED.level,',
    '  day      = EXCLUDED.day,',
    '  category = EXCLUDED.category,',
    '  data     = EXCLUDED.data;',
    '',
    '-- Step 3: RLS ni qayta yoqish (ixtiyoriy)',
    '-- ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;',
  )

  const outPath = path.resolve(__dirname, 'seed-lessons.sql')
  writeFileSync(outPath, lines.join('\n'), 'utf-8')
  const kb = Math.round(lines.join('\n').length / 1024)
  console.log(`✅ ${outPath} (${kb} KB)`)
  console.log('   → Supabase SQL Editor ga nusxalab ishga tushiring')
}

main().catch(err => {
  console.error('💥', err.message)
  process.exit(1)
})
