/**
 * check-murojaat.ts — Murojaat shakli izchilligini tekshirish (F4-1)
 *
 * Qaror: butun platforma RASMIY "siz" shaklida bo'lishi kerak.
 * Bu skript foydalanuvchiga TO'G'RIDAN murojaat qiladigan matnlarni tekshiradi:
 *   - src/i18n/uz.json  — barcha UI matnlar
 *   - src/data ichidagi .ts fayllar — faqat `instruction`, `desc`, `title`, `tips` maydonlari
 *
 * `explanation` va misol-gap tarjimalari ATAYIN tekshirilmaydi — ularda
 * "sen/seni" tabiiy (masalan "I miss you" = "Men seni sog'indim").
 *
 * Ishlatish:  npx tsx scripts/check-murojaat.ts
 * Chiqish kodi: 0 = toza, 1 = norasmiy shakllar topildi.
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// ── Norasmiy ("sen") belgilari ──────────────────────────────────────────────
const SEN_PRONOUNS = /\b(sen|sening|senga|sendan|seni|senda|sansiz|saning|sanga|sandan)\b/gi

// Norasmiy buyruq mayli: bare verb (siz qo'shimchasi -ng/-ngiz/-ing yo'q).
// Faqat foydalanuvchiga buyruq bo'lishi mumkin bo'lgan keng tarqalgan fe'llar.
const INFORMAL_IMPERATIVES = new RegExp(
  '\\b(' +
  [
    'tanla', "to'ldir", 'top', 'yoz', "o'zgartir", 'tugat', 'boshla', 'bos',
    "ko'r", 'ayt', "o'qi", 'eshit', 'takrorla', "to'g'irla", 'kirit', 'belgila',
    'tekshir', 'yeching', 'yech', 'qara', 'eslab qol', 'yodla', 'davom et',
  ].join('|') +
  ')(?=[\\s.,!?:;]|$)',
  'g', // kichik harf-sezgir: inglizcha bosh harfli homograflarni (masalan "Top 10") chetlab o'tadi
)
// Rasmiy shakllar (-ng / -ngiz / -ing) — false positivelarni chiqarib tashlash uchun
const FORMAL_SUFFIX = /(ng|ngiz|ing|ingiz)$/i

interface Finding { file: string; field: string; kind: string; match: string; text: string }
const findings: Finding[] = []

function check(text: string, file: string, field: string) {
  if (typeof text !== 'string') return
  for (const m of text.matchAll(SEN_PRONOUNS)) {
    findings.push({ file, field, kind: 'olmosh', match: m[0], text: snippet(text, m.index ?? 0) })
  }
  for (const m of text.matchAll(INFORMAL_IMPERATIVES)) {
    const word = m[0]
    if (FORMAL_SUFFIX.test(word)) continue
    findings.push({ file, field, kind: 'buyruq', match: word, text: snippet(text, m.index ?? 0) })
  }
}

function snippet(text: string, idx: number): string {
  const start = Math.max(0, idx - 25)
  return text.slice(start, idx + 35).replace(/\n/g, ' ')
}

// ── 1) uz.json — barcha UI matnlar ──────────────────────────────────────────
const uz = JSON.parse(readFileSync('src/i18n/uz.json', 'utf8')) as Record<string, string>
for (const [key, val] of Object.entries(uz)) check(val, 'src/i18n/uz.json', key)

// ── 2) data fayllari — faqat foydalanuvchiga murojaat maydonlari ────────────
const USER_FIELDS = ['instruction', 'desc', 'title', 'subtitle']
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : []
  })
}
for (const file of walk('src/data')) {
  const src = readFileSync(file, 'utf8')
  for (const field of USER_FIELDS) {
    // field: 'matn' yoki field: "matn"  (oddiy, ko'p qatorli emas)
    const re = new RegExp(`\\b${field}:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`, 'g')
    for (const m of src.matchAll(re)) check(m[2], file, field)
  }
  // tips: ['...', '...'] massivlari
  for (const m of src.matchAll(/\btips:\s*\[([^\]]*)\]/g)) {
    for (const s of m[1].matchAll(/(['"])((?:\\.|(?!\1).)*)\1/g)) check(s[2], file, 'tips')
  }
}

// ── Hisobot ─────────────────────────────────────────────────────────────────
if (findings.length === 0) {
  console.log("✅ Murojaat shakli izchil — norasmiy 'sen' shakllari topilmadi (foydalanuvchi matnlarida).")
  process.exit(0)
}
console.log(`⚠️ ${findings.length} ta norasmiy shakl topildi:\n`)
for (const f of findings) {
  console.log(`  [${f.kind}] «${f.match}» — ${f.file} (${f.field})\n      …${f.text}…`)
}
process.exit(1)
