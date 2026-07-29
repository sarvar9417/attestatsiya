/**
 * Barcha darslarni Supabase `lessons` jadvaliga sync qiladi.
 * Ishlatish: npm run seed:all
 *
 * Manba: src/data/daily/*.ts (lokal TypeScript fayllar)
 * Maqsad: Supabase `lessons` jadvali (data kolonkasi JSON sifatida)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ─── .env fayldan o'qish ─────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../.env')
const envContent = readFileSync(envPath, 'utf-8')

function getEnv(name: string): string {
  const match = envContent.match(new RegExp(`^${name}=(.+)$`, 'm'))
  if (!match) throw new Error(`${name} .env faylda topilmadi`)
  return match[1].trim()
}

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL')
// Service role key: eski format eyJ... (JWT), yangi format sb_secret_...
// sbp_v0_... (PAT token) va sb_publishable_... (anon) ishlamaydi — RLS bloklaydi.
// Supabase dashboard > Project Settings > API > service_role (secret)
function isServiceKey(k: string) {
  return k.startsWith('eyJ') || k.startsWith('sb_secret_')
}
const SUPABASE_KEY = (() => {
  try {
    const key = getEnv('SUPABASE_SERVICE_ROLE_KEY')
    if (isServiceKey(key)) return key
  } catch { /* yo'q */ }
  try {
    const key = getEnv('SUPABASE_SERVICE_KEY')
    if (isServiceKey(key)) return key
  } catch { /* yo'q */ }
  // Fallback: anon key (RLS ruxsat bersa ishlaydi)
  console.warn('⚠️  Service role key topilmadi yoki noto\'g\'ri format. Anon key ishlatilmoqda.')
  console.warn('   .env ga qo\'shing: SUPABASE_SERVICE_ROLE_KEY=sb_secret_...')
  return getEnv('VITE_SUPABASE_ANON_KEY')
})()

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Darslarni import qilish ─────────────────────────────────────────────────

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

// ─── Supabase formatiga o'tkazish ────────────────────────────────────────────

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
      ...(rest.reading        ? { reading: rest.reading }               : {}),
      ...(rest.writing        ? { writing: rest.writing }               : {}),
      ...(rest.listening      ? { listening: rest.listening }           : {}),
      ...(rest.dialogues      ? { dialogues: rest.dialogues }           : {}),
      ...(rest.culturalNotes  ? { culturalNotes: rest.culturalNotes }   : {}),
    },
  }
}

// ─── Asosiy funksiya ─────────────────────────────────────────────────────────

async function main() {
  console.log('📚 Darslar yuklanmoqda...')
  const lessons = await loadLessons()
  console.log(`   ${lessons.length} ta dars topildi`)

  const rows = lessons.map(toRow)

  // Batch upsert — 20 ta dan (Supabase limit)
  const BATCH = 20
  let upserted = 0
  let failed = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase
      .from('lessons')
      .upsert(batch, { onConflict: 'id' })

    if (error) {
      console.error(`❌ Batch ${i / BATCH + 1} xato:`, error.message)
      batch.forEach(r => console.error(`   - ${r.id}`))
      failed += batch.length
    } else {
      upserted += batch.length
      process.stdout.write(`   ✅ ${upserted}/${rows.length} upserted...\r`)
    }
  }

  console.log(`\n✅ Tugadi: ${upserted} upserted, ${failed} xato`)

  if (failed > 0) {
    console.warn('\n⚠️  Ba\'zi darslar sync bo\'lmadi.')
    console.warn('   SUPABASE_SERVICE_KEY to\'g\'riligini tekshiring va RLS qoidalarini ko\'ring.')
    process.exit(1)
  }
}

main().catch(err => {
  console.error('💥 Xato:', err.message)
  process.exit(1)
})
