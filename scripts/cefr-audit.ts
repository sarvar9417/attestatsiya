/**
 * cefr-audit.ts -- Curriculum Gap Analysis (F2-10)
 *
 * CEFR darajalari bo'yicha kurrikulum qoplamasini strukturaviy tahlil qiladi:
 *   - Har daraja uchun dars soni
 *   - Kontent to'liqligi (reading/writing/listening bor-yo'qligi)
 *   - Lug'at va mashq hisoblari
 *   - Mashq turlari taqsimoti
 *   - Bo'sh yoki kam ta'minlangan darslar (gap'lar)
 *
 * Ishlatish:  npx tsx scripts/cefr-audit.ts
 * Chiqish kodi: 0 = jiddiy gap yo'q, 1 = e'tibor talab qiladigan gap(lar) bor.
 */
import { getAllLessons } from '../src/data/daily/index'
import type { DailyExercise } from '../src/data/dailyLessons'

// CEFR can-do mos yozuvlari (informatsion - pedagog tekshiruvi uchun)
const CEFR_CAN_DO: Record<string, string[]> = {
  A1: ['O\'zini tanishtirish', 'Oddiy iboralarni tushunish', 'Sodda savol berish', 'Qisqa eslatma yozish'],
  A2: ['O\'tmishi haqida gapirish', 'Qisqa ijtimoiy muloqot', 'Oddiy yo\'l-yo\'riq', 'Qisqa xat yozish'],
  B1: ['Tajriba va voqealarni tasvirlash', 'Fikr va rejalarni tushuntirish', 'Sayohatda muloqot', 'Bog\'langan matn yozish'],
  'B1+': ['Murakkab fikrlarni ifodalash', 'Bahslashish', 'Mavhum mavzular', 'Batafsil insho'],
  B2: ['Ravon va spontan muloqot', 'Texnik muhokama', 'Dalil keltirish', 'Aniq batafsil matn'],
}

const MIN_EXERCISES = 10   // dars uchun minimal mashq
const MIN_VOCAB = 5        // dars uchun minimal lug'at

const lessons = getAllLessons()
const gaps: string[] = []

// ── Daraja bo'yicha guruhlash ───────────────────────────────────────────────
const byLevel = new Map<string, typeof lessons>()
for (const l of lessons) {
  const arr = byLevel.get(l.level) ?? []
  arr.push(l)
  byLevel.set(l.level, arr)
}

function exTypeDist(exs: DailyExercise[]): Record<string, number> {
  const d: Record<string, number> = {}
  for (const e of exs) d[e.type] = (d[e.type] ?? 0) + 1
  return d
}

console.log('═══════════════════════════════════════════════════════════')
console.log('  CURRICULUM GAP ANALYSIS (F2-10)')
console.log('═══════════════════════════════════════════════════════════\n')
console.log(`Jami darslar: ${lessons.length}\n`)

const levelOrder = ['A1', 'A2', 'B1', 'B1+', 'B2']
for (const level of levelOrder) {
  const ls = byLevel.get(level)
  if (!ls || ls.length === 0) {
    gaps.push(`❌ ${level} darajasida umuman dars yo'q`)
    continue
  }
  let vocab = 0, exercises = 0, withReading = 0, withWriting = 0, withListening = 0
  const typeDist: Record<string, number> = {}
  for (const l of ls) {
    vocab += l.vocabulary?.length ?? 0
    exercises += l.exercises?.length ?? 0
    if (l.reading) withReading++
    if (l.writing) withWriting++
    if (l.listening) withListening++
    for (const [t, n] of Object.entries(exTypeDist(l.exercises ?? []))) typeDist[t] = (typeDist[t] ?? 0) + n
    // Per-lesson gaplar
    if ((l.exercises?.length ?? 0) < MIN_EXERCISES) gaps.push(`⚠️ [${level}] "${l.title}" (kun ${l.day}) - faqat ${l.exercises?.length ?? 0} ta mashq (<${MIN_EXERCISES})`)
    if ((l.vocabulary?.length ?? 0) < MIN_VOCAB) gaps.push(`⚠️ [${level}] "${l.title}" (kun ${l.day}) - faqat ${l.vocabulary?.length ?? 0} ta lug'at (<${MIN_VOCAB})`)
  }
  console.log(`── ${level} ──  ${ls.length} dars`)
  console.log(`   Lug'at: ${vocab} | Mashqlar: ${exercises} | reading: ${withReading}/${ls.length} | writing: ${withWriting}/${ls.length} | listening: ${withListening}/${ls.length}`)
  console.log(`   Mashq turlari: ${Object.entries(typeDist).map(([t, n]) => `${t}:${n}`).join(', ')}`)
  console.log(`   CEFR can-do (pedagog tekshiruvi): ${(CEFR_CAN_DO[level] ?? []).join(' · ')}\n`)
}

// ── Day raqamlash gap/dublikatlari (curriculum izchilligi) ──────────────────
const days = lessons.map(l => l.day).filter(d => typeof d === 'number').sort((a, b) => a - b)
const dupDays = days.filter((d, i) => days.indexOf(d) !== i)
if (dupDays.length) gaps.push(`⚠️ Takrorlangan kun raqamlari: ${Array.from(new Set(dupDays)).join(', ')}`)

// ── Hisobot ─────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════')
if (gaps.length === 0) {
  console.log('✅ Jiddiy strukturaviy gap topilmadi.')
  process.exit(0)
}
console.log(`⚠️ ${gaps.length} ta gap/e'tibor nuqtasi:\n`)
for (const g of gaps) console.log('  ' + g)
console.log('\n💡 Bu strukturaviy audit. CEFR can-do mosligi pedagog tomonidan tekshirilishi kerak.')
process.exit(gaps.some(g => g.startsWith('❌')) ? 1 : 0)
