/**
 * check-i18n.ts — Tarjima izchilligi auditi (F4-3 / F4-4)
 *
 * uz/en/ru tarjima fayllari o'rtasida:
 *   - Yetishmayotgan kalitlar (bir tilда bor, boshqasida yo'q)
 *   - Bo'sh qiymatlar
 *   - Placeholder ({name}) mosligi
 *
 * Ishlatish:  npx tsx scripts/check-i18n.ts
 * Chiqish kodi: 0 = izchil, 1 = muammo bor.
 */
import uz from '../src/i18n/uz.json'
import en from '../src/i18n/en.json'
import ru from '../src/i18n/ru.json'

type Dict = Record<string, string>
const locales: Record<string, Dict> = { uz: uz as Dict, en: en as Dict, ru: ru as Dict }
const names = Object.keys(locales)

// Barcha kalitlar birlashmasi
const allKeys = new Set<string>()
for (const d of Object.values(locales)) for (const k of Object.keys(d)) allKeys.add(k)

const placeholders = (s: string) => (s.match(/\{(\w+)\}/g) ?? []).sort().join(',')

const missing: Record<string, string[]> = { uz: [], en: [], ru: [] }
const empty: string[] = []
const phMismatch: string[] = []

for (const key of [...allKeys].sort()) {
  for (const name of names) {
    const val = locales[name][key]
    if (val === undefined) missing[name].push(key)
    else if (typeof val === 'string' && val.trim() === '') empty.push(`${name}: ${key}`)
  }
  // Placeholder mosligi — faqat barcha tilда mavjud kalitlar uchun
  const present = names.filter(n => locales[n][key] !== undefined)
  if (present.length > 1) {
    const ref = placeholders(locales[present[0]][key])
    for (const n of present.slice(1)) {
      if (placeholders(locales[n][key]) !== ref) phMismatch.push(`${key} (${present[0]}:[${ref}] ≠ ${n}:[${placeholders(locales[n][key])}])`)
    }
  }
}

let hasIssue = false
console.log('═══ i18n izchillik auditi ═══\n')
console.log(`Kalitlar: uz=${Object.keys(uz).length}, en=${Object.keys(en).length}, ru=${Object.keys(ru).length}, birlashma=${allKeys.size}\n`)

for (const name of names) {
  if (missing[name].length) {
    hasIssue = true
    console.log(`⚠️ ${name}.json'da yetishmayotgan ${missing[name].length} kalit:`)
    for (const k of missing[name].slice(0, 80)) console.log(`   - ${k}`)
    if (missing[name].length > 80) console.log(`   … va yana ${missing[name].length - 80} ta`)
    console.log('')
  }
}
if (empty.length) { hasIssue = true; console.log(`⚠️ Bo'sh qiymatlar (${empty.length}):`); empty.slice(0, 30).forEach(e => console.log('   - ' + e)); console.log('') }
if (phMismatch.length) { hasIssue = true; console.log(`⚠️ Placeholder mos kelmaydi (${phMismatch.length}):`); phMismatch.slice(0, 30).forEach(p => console.log('   - ' + p)); console.log('') }

if (!hasIssue) { console.log('✅ Barcha tarjimalar izchil.'); process.exit(0) }
process.exit(1)
