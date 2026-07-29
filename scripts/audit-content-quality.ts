/**
 * KONTENT SIFATI tahlili (mexanik emas — pedagogik/semantik signallar).
 *   npx tsx scripts/audit-content-quality.ts
 */
import { getAllLessons } from '../src/data/daily/index'
import type { DailyExercise } from '../src/data/dailyLessons'

const lessons = getAllLessons()
const levelOf = (l: { level?: string; day?: number }) => l.level || '?'

// hamma mashqlar (exercises + tests + drills)
type Row = { level: string; lessonId: string; lessonTitle: string; ex: DailyExercise }
const rows: Row[] = []
for (const l of lessons) {
  const drills = (l.specialCases || []).flatMap(sc => sc.drills || [])
  for (const ex of [...(l.exercises || []), ...(l.tests || []), ...drills])
    rows.push({ level: levelOf(l), lessonId: l.id, lessonTitle: l.title, ex })
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').replace(/[.,!?;:'"()]/g, '').trim()

// === 1. Daraja × tur taqsimoti ===
const byLevel = new Map<string, Map<string, number>>()
for (const r of rows) {
  if (!byLevel.has(r.level)) byLevel.set(r.level, new Map())
  const m = byLevel.get(r.level)!
  m.set(r.ex.type, (m.get(r.ex.type) || 0) + 1)
}

// === 2. Takror inglizcha jumlalar (darslar aro) ===
const qMap = new Map<string, { count: number; where: string[] }>()
for (const r of rows) {
  const q = 'question' in r.ex ? r.ex.question : 'passage' in r.ex ? (r.ex as any).passage : 'prompt' in r.ex ? (r.ex as any).prompt : ''
  if (!q) continue
  const key = norm(q)
  if (key.length < 8) continue
  if (!qMap.has(key)) qMap.set(key, { count: 0, where: [] })
  const e = qMap.get(key)!
  e.count++
  if (e.where.length < 4) e.where.push(`${r.lessonTitle}`)
}
const dups = [...qMap.entries()].filter(([, v]) => v.count > 1).sort((a, b) => b[1].count - a[1].count)

// === 3. Tushuntirish (explanation) chuqurligi ===
let explShort = 0, explTotal = 0, explSum = 0
const shortSamples: string[] = []
for (const r of rows) {
  if (r.ex.type === 'connection') continue
  const e = 'explanation' in r.ex ? r.ex.explanation : ''
  explTotal++
  explSum += (e || '').length
  if ((e || '').trim().length < 12) {
    explShort++
    if (shortSamples.length < 12) shortSamples.push(`"${e}" (#${r.ex.id} ${r.lessonTitle})`)
  }
}

// === 4. MC distraktor sifati: typo-distraktorlar (xato-yozilgan variantlar) ===
// Heuristik: variant correct bilan kichik edit-distance (1-2) lekin lug'atda yo'q ko'rinishli (qo'sh harf, almashtirilgan)
function editDist(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1))
  return d[a.length][b.length]
}
let mcTotal = 0, mcTypoDistractor = 0
const typoSamples: string[] = []
for (const r of rows) {
  if (r.ex.type !== 'multiple-choice') continue
  mcTotal++
  const correct = norm(r.ex.correct)
  const distractors = r.ex.options.map(norm).filter(o => o !== correct)
  // typo = edit-distance 1-2 dan correct ga, lekin faqat harf qo'shilgan/almashgan (yangi so'z emas)
  const hasTypo = distractors.some(d => {
    const ed = editDist(d, correct)
    return ed >= 1 && ed <= 2 && d.length >= correct.length - 1
  })
  if (hasTypo) {
    mcTypoDistractor++
    if (typoSamples.length < 10) typoSamples.push(`#${r.ex.id} correct="${r.ex.correct}" opts=[${r.ex.options.join(', ')}]`)
  }
}

// === 5. Lug'at statistikasi ===
let vocabTotal = 0, vocabNoExample = 0
const vocabWords = new Set<string>()
for (const l of lessons) for (const v of (l.vocabulary || [])) {
  vocabTotal++
  vocabWords.add(norm(v.en))
  if (!v.example || !v.example.trim()) vocabNoExample++
}

// === REPORT ===
console.log(`\n=== KONTENT SIFATI TAHLILI ===`)
console.log(`Darslar: ${lessons.length} · Mashqlar (drills bilan): ${rows.length}\n`)

console.log(`--- 1. Daraja × mashq turi ---`)
for (const [lvl, m] of byLevel) {
  const total = [...m.values()].reduce((a, b) => a + b, 0)
  const parts = [...m.entries()].sort((a, b) => b[1] - a[1]).map(([t, c]) => `${t}:${c}`).join('  ')
  console.log(`  ${lvl.padEnd(5)} (${total})  ${parts}`)
}
// tur ulushi (umumiy)
const typeAll = new Map<string, number>()
rows.forEach(r => typeAll.set(r.ex.type, (typeAll.get(r.ex.type) || 0) + 1))
console.log(`\n  Umumiy tur ulushi:`)
;[...typeAll.entries()].sort((a, b) => b[1] - a[1]).forEach(([t, c]) =>
  console.log(`    ${t.padEnd(18)} ${c}  (${(c / rows.length * 100).toFixed(1)}%)`))

console.log(`\n--- 2. Takror inglizcha jumlalar (darslar aro): ${dups.length} ta noyob jumla takrorlangan ---`)
console.log(`  Jami ortiqcha nusxa: ${dups.reduce((a, [, v]) => a + v.count - 1, 0)}`)
dups.slice(0, 12).forEach(([k, v]) => console.log(`  ×${v.count}  "${k.slice(0, 60)}"  [${[...new Set(v.where)].join(' / ')}]`))

console.log(`\n--- 3. Tushuntirish chuqurligi ---`)
console.log(`  O'rtacha uzunlik: ${(explSum / explTotal).toFixed(0)} belgi`)
console.log(`  Juda qisqa (<12 belgi): ${explShort} / ${explTotal}  (${(explShort / explTotal * 100).toFixed(1)}%)`)
shortSamples.forEach(s => console.log(`    • ${s}`))

console.log(`\n--- 4. MC distraktor sifati ---`)
console.log(`  Typo-distraktorli MC (xato-yozilgan variant): ${mcTypoDistractor} / ${mcTotal}  (${(mcTypoDistractor / mcTotal * 100).toFixed(1)}%)`)
typoSamples.forEach(s => console.log(`    • ${s}`))

console.log(`\n--- 5. Lug'at ---`)
console.log(`  Jami vocab yozuv: ${vocabTotal} · noyob so'z: ${vocabWords.size} · misolsiz: ${vocabNoExample} (${(vocabNoExample / vocabTotal * 100).toFixed(1)}%)`)
