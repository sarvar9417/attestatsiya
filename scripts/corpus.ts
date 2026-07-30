/**
 * Korpus bilan ishlash CLI.
 *
 * Savol yozayotganda darslikdagi ma'lumot kerak bo'lsa — shu vosita ishlatiladi.
 * Sahifani qo'lda `.txt` faylda `===== SAHIFA N =====` markerini izlash kerak emas.
 *
 * BUYRUQLAR
 *
 *   npm run corpus -- show S3.NUM.02
 *       Konstrukt uchun eng mos sahifalarni TO'LIQ matni bilan chiqaradi.
 *       Savol yozishdan oldin asosiy buyruq.
 *
 *   npm run corpus -- page "Milliy 7" 13
 *       Aniq bitta sahifani chiqaradi. Iqtibosni tekshirish uchun.
 *
 *   npm run corpus -- find "rostlik jadvali"
 *       Korpus bo'ylab qidiradi. Apostrof va registrga sezgir EMAS —
 *       `o'lchov`, `oʻlchov`, `olchov` bir xil topiladi (oddiy grep buni qila olmaydi).
 *
 *   npm run corpus -- books
 *       Darsliklar ro'yxati va sahifa soni.
 *
 *   npm run corpus -- gaps
 *       Manbasi topilmagan konstruktlar.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BLUEPRINT_GROUPS, CONSTRUCTS, SOURCE_BLOCKED_GROUPS } from '../src/data/blueprint2026.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const EXTRACTED = join(ROOT, 'darsliklar', 'extracted')

const NOT_TEXTBOOK = new Set([
  'Informatika Testlar spesifikatsiyasi.txt',
  'Adabiyotlar.txt',
])

const PAGE_RE = /^===== SAHIFA (\d+) =====(\s+\[[A-Z]+\])?$/

/** Registr, apostrof va tire farqini yo'q qiladi. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ʻʼ'‘’`´′]/g, '')
    .replace(/[‑–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function shortName(file: string): string {
  const b = basename(file, '.txt')
  const cam = b.match(/^(\d+(?:-\d+)?)-sinf informatika \(Cambridge \+\)$/)
  if (cam) return `Cambridge+ ${cam[1]}-sinf`
  const ict = b.match(/^ICT (\d+)_sinf-(\d{4})$/)
  if (ict) return `Milliy ${ict[1]}-sinf (${ict[2]})`
  return b
}

interface Page {
  file: string
  book: string
  no: number
  text: string
  normText: string
  isToc: boolean
}

function loadPages(includeSpecs = false): Page[] {
  const pages: Page[] = []
  let files: string[]
  try {
    files = readdirSync(EXTRACTED).filter((f) => f.endsWith('.txt')).sort()
  } catch {
    console.error(`XATO: ${EXTRACTED} topilmadi.`)
    console.error("Darsliklar ekstraksiyasi mavjud emas — `darsliklar/extracted/` kerak.")
    process.exit(1)
  }
  for (const file of files) {
    if (!includeSpecs && NOT_TEXTBOOK.has(file)) continue
    const raw = readFileSync(join(EXTRACTED, file), 'utf8')
    const book = shortName(file)
    let no: number | null = null
    let isToc = false
    let buf: string[] = []
    const flush = () => {
      if (no === null) return
      const text = buf.join('\n').trim()
      if (text) pages.push({ file, book, no, text, normText: norm(text), isToc })
    }
    for (const line of raw.split('\n')) {
      const m = PAGE_RE.exec(line.trim())
      if (m) {
        flush()
        no = Number(m[1])
        isToc = Boolean(m[2])
        buf = []
      } else buf.push(line)
    }
    flush()
  }
  return pages
}

const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'
const rule = (c = '─') => c.repeat(70)

/** Qidiruv so'zini matnda ajratib ko'rsatadi. */
function highlight(text: string, term: string): string {
  if (!term) return text
  const nText = norm(text)
  const nTerm = norm(term)
  const out: string[] = []
  let cursor = 0
  // Normalizatsiya uzunlikni o'zgartirishi mumkin — asl matnda so'zma-so'z izlaymiz
  const words = term.split(/\s+/).filter(Boolean)
  const pattern = words
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/['ʻʼ‘’`´′]/g, "['ʻʼ‘’`´′]?"))
    .join('[\\s]+')
  let re: RegExp
  try {
    re = new RegExp(pattern, 'gi')
  } catch {
    return text
  }
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0
    out.push(text.slice(cursor, i), YELLOW + BOLD + m[0] + RESET)
    cursor = i + m[0].length
  }
  out.push(text.slice(cursor))
  const joined = out.join('')
  return nText.includes(nTerm) || joined !== text ? joined : text
}

// ── show ────────────────────────────────────────────────────────────────────
function cmdShow(code: string, limit: number): void {
  const c = CONSTRUCTS.find((x) => x.code.toLowerCase() === code.toLowerCase())
  if (!c) {
    console.error(`XATO: '${code}' konstrukti topilmadi.`)
    const near = CONSTRUCTS.filter((x) => x.code.toLowerCase().startsWith(code.toLowerCase().slice(0, 3)))
    if (near.length) {
      console.error('\nEhtimol shulardan biri:')
      for (const n of near.slice(0, 10)) console.error(`  ${n.code}  ${n.title}`)
    }
    process.exit(1)
  }
  const g = BLUEPRINT_GROUPS.find((x) => x.code === c.group)!
  const pages = loadPages()

  const hits = pages
    .filter((p) => !p.isToc)
    .map((p) => {
      const matched = c.keywords.filter((kw) => p.normText.includes(norm(kw)))
      return { p, matched }
    })
    .filter((h) => h.matched.length > 0)
    .sort((a, b) => b.matched.length - a.matched.length || a.p.no - b.p.no)

  console.log(rule('═'))
  console.log(`${BOLD}${c.code}${RESET} — ${c.title}`)
  console.log(rule('═'))
  console.log(`Guruh:     ${c.group} — ${g.title}`)
  console.log(`Imtihonda: ${g.questionCount} savol (${g.questionFrom}–${g.questionTo}-savollar)`)
  if (c.generator) {
    console.log(`${YELLOW}Generator: ${c.generator}${RESET} — bu konstrukt parametrik savol bilan qoplanadi`)
  }
  console.log(`Kalit so'z: ${c.keywords.join(', ')}`)
  console.log(`Topildi:   ${hits.length} sahifa`)

  if (hits.length === 0) {
    console.log()
    if ((SOURCE_BLOCKED_GROUPS as readonly string[]).includes(c.group)) {
      console.log(`${YELLOW}⚠ Bu guruh manbasi korpusda YO'Q (blocker B-001).${RESET}`)
      console.log('  Kerakli manba rasmiy spetsifikatsiya §VII da:')
      console.log('    · Mavlonova R.A. Umumiy pedagogika, 2018        → PM.GEN')
      console.log('    · Xoliqov A. Pedagogik mahorat, 2025            → PM.GEN')
      console.log('    · Tolipov/Roʻziyeva Ped. texnologiyalar, 2019   → PM.GEN')
      console.log('    · Maktab oʻqituvchisi kasb standarti            → KS')
      console.log('    · Mamarajabov M.E. Informatika oʻqitish met.    → PM.MET')
    } else {
      console.log(`${YELLOW}⚠ Topilmadi.${RESET} Kalit soʻzlarni kengaytirish kerak:`)
      console.log('  src/data/blueprint2026.ts → CONSTRUCTS → ' + c.code)
    }
    return
  }

  console.log()
  for (const h of hits.slice(0, limit)) {
    console.log(rule())
    console.log(`${BOLD}${h.p.book}, ${h.p.no}-sahifa${RESET}  ${DIM}(mos: ${h.matched.join(', ')})${RESET}`)
    console.log(`${DIM}${h.p.file} → ===== SAHIFA ${h.p.no} =====${RESET}`)
    console.log(rule())
    console.log(highlight(h.p.text, h.matched[0]))
    console.log()
  }
  if (hits.length > limit) {
    console.log(`${DIM}… va yana ${hits.length - limit} sahifa. Ko'proq: --limit ${hits.length}${RESET}`)
  }
}

// ── page ────────────────────────────────────────────────────────────────────
function cmdPage(bookQuery: string, pageNo: number): void {
  const pages = loadPages(true)
  const nq = norm(bookQuery)
  const matches = pages.filter((p) => norm(p.book).includes(nq) || norm(p.file).includes(nq))
  if (matches.length === 0) {
    console.error(`XATO: '${bookQuery}' darsligi topilmadi. Mavjud darsliklar:`)
    for (const b of [...new Set(pages.map((p) => p.book))].sort()) console.error(`  ${b}`)
    process.exit(1)
  }
  const books = [...new Set(matches.map((p) => p.book))]
  if (books.length > 1) {
    console.error(`XATO: '${bookQuery}' bir necha darslikka mos keladi:`)
    for (const b of books) console.error(`  ${b}`)
    console.error('\nAniqroq yozing.')
    process.exit(1)
  }
  const page = matches.find((p) => p.no === pageNo)
  if (!page) {
    const nums = matches.map((p) => p.no)
    console.error(`XATO: ${books[0]} da ${pageNo}-sahifa yo'q.`)
    console.error(`Mavjud: ${Math.min(...nums)}–${Math.max(...nums)}`)
    process.exit(1)
  }
  console.log(rule('═'))
  console.log(`${BOLD}${page.book}, ${page.no}-sahifa${RESET}${page.isToc ? `  ${DIM}[MUNDARIJA]${RESET}` : ''}`)
  console.log(`${DIM}${page.file}${RESET}`)
  console.log(rule('═'))
  console.log(page.text)
}

// ── find ────────────────────────────────────────────────────────────────────
function cmdFind(term: string, limit: number): void {
  const pages = loadPages(true)
  const n = norm(term)
  if (!n) {
    console.error("XATO: qidiruv so'zi bo'sh.")
    process.exit(1)
  }
  const hits = pages.filter((p) => p.normText.includes(n))

  console.log(rule('═'))
  console.log(`${BOLD}"${term}"${RESET} — ${hits.length} sahifada topildi`)
  console.log(`${DIM}Apostrof va registrga sezgir emas${RESET}`)
  console.log(rule('═'))

  if (hits.length === 0) {
    console.log("Topilmadi. Boshqa atama bilan urinib ko'ring.")
    return
  }

  // Darslik kesimi
  const byBook = new Map<string, number[]>()
  for (const h of hits) {
    if (!byBook.has(h.book)) byBook.set(h.book, [])
    byBook.get(h.book)!.push(h.no)
  }
  console.log()
  for (const [book, nums] of [...byBook].sort((a, b) => b[1].length - a[1].length)) {
    const shown = nums.slice(0, 25).join(', ')
    const more = nums.length > 25 ? ` … (+${nums.length - 25})` : ''
    console.log(`  ${BOLD}${book}${RESET} — ${nums.length} sahifa`)
    console.log(`    ${DIM}${shown}${more}${RESET}`)
  }

  // Qaysi konstruktlarga tegishli
  const related = CONSTRUCTS.filter((c) => c.keywords.some((kw) => norm(kw).includes(n) || n.includes(norm(kw))))
  if (related.length) {
    console.log()
    console.log(`  ${DIM}Tegishli konstruktlar:${RESET}`)
    for (const c of related.slice(0, 8)) console.log(`    ${c.code}  ${c.title}`)
  }

  console.log()
  console.log(rule())
  console.log(`Kontekst (eng birinchi ${Math.min(limit, hits.length)} sahifa):`)
  console.log(rule())
  for (const h of hits.slice(0, limit)) {
    const i = h.normText.indexOf(n)
    const ratio = h.text.length / Math.max(h.normText.length, 1)
    const at = Math.max(0, Math.round(i * ratio) - 120)
    const excerpt = h.text.slice(at, at + 320).replace(/\s+/g, ' ').trim()
    console.log()
    console.log(`${BOLD}${h.book}, ${h.no}-sahifa${RESET}`)
    console.log(`  ${highlight(excerpt, term)}`)
  }
  console.log()
  console.log(`${DIM}To'liq sahifa: npm run corpus -- page "${hits[0].book}" ${hits[0].no}${RESET}`)
}

// ── books ───────────────────────────────────────────────────────────────────
function cmdBooks(): void {
  const pages = loadPages(true)
  const byBook = new Map<string, { n: number; chars: number; file: string }>()
  for (const p of pages) {
    const e = byBook.get(p.book) ?? { n: 0, chars: 0, file: p.file }
    e.n++
    e.chars += p.text.length
    byBook.set(p.book, e)
  }
  console.log(rule('═'))
  console.log(`${BOLD}KORPUS${RESET} — ${pages.length} sahifa, ${byBook.size} hujjat`)
  console.log(rule('═'))
  for (const [book, e] of [...byBook].sort((a, b) => b[1].n - a[1].n)) {
    const tag = NOT_TEXTBOOK.has(e.file) ? `  ${YELLOW}[spetsifikatsiya, darslik emas]${RESET}` : ''
    console.log(`  ${book.padEnd(26)} ${String(e.n).padStart(4)} sahifa  ${DIM}${(e.chars / 1024).toFixed(0)} KB${RESET}${tag}`)
  }
}

// ── gaps ────────────────────────────────────────────────────────────────────
function cmdGaps(): void {
  const pages = loadPages().filter((p) => !p.isToc)
  console.log(rule('═'))
  console.log(`${BOLD}MANBASI TOPILMAGAN KONSTRUKTLAR${RESET}`)
  console.log(rule('═'))
  let missing = 0
  for (const g of BLUEPRINT_GROUPS) {
    const rows: string[] = []
    for (const c of CONSTRUCTS.filter((x) => x.group === g.code)) {
      const n = pages.filter((p) => c.keywords.some((kw) => p.normText.includes(norm(kw)))).length
      if (n === 0) {
        rows.push(`    ${c.code.padEnd(14)} ${c.title}`)
        missing++
      }
    }
    if (rows.length) {
      const blocked = (SOURCE_BLOCKED_GROUPS as readonly string[]).includes(g.code)
      console.log(`\n  ${blocked ? '🔴' : '🟠'} ${BOLD}${g.code}${RESET} — ${g.title} (${g.questionCount} savol)`)
      rows.forEach((r) => console.log(r))
    }
  }
  console.log()
  console.log(rule())
  console.log(`  Jami manbasiz: ${missing} / ${CONSTRUCTS.length} konstrukt`)
  const bq = BLUEPRINT_GROUPS.filter((g) => (SOURCE_BLOCKED_GROUPS as readonly string[]).includes(g.code))
    .reduce((a, g) => a + g.questionCount, 0)
  console.log(`  🔴 belgisi — manbasi korpusda yo'q guruh: imtihonning ${bq} savoli (${Math.round((100 * bq) / 50)}%)`)
}

// ── main ────────────────────────────────────────────────────────────────────
function usage(): void {
  console.log(`
${BOLD}Korpus CLI${RESET} — darsliklardagi ma'lumotni topish

  ${BOLD}npm run corpus -- show <KONSTRUKT>${RESET}      konstrukt uchun sahifalarni to'liq matni bilan
  ${BOLD}npm run corpus -- page <darslik> <N>${RESET}     aniq bitta sahifa
  ${BOLD}npm run corpus -- find "<atama>"${RESET}         korpus bo'ylab qidirish
  ${BOLD}npm run corpus -- books${RESET}                  darsliklar ro'yxati
  ${BOLD}npm run corpus -- gaps${RESET}                   manbasiz konstruktlar

Misollar:

  npm run corpus -- show S3.NUM.02
  npm run corpus -- page "Milliy 7" 13
  npm run corpus -- find "rostlik jadvali"
  npm run corpus -- find "o'lchov birlik"       ${DIM}# apostrof muhim emas${RESET}

Qo'shimcha: ${BOLD}--limit N${RESET} (show/find uchun, default 3)
`)
}

function main(): void {
  const argv = process.argv.slice(2)
  const limitIdx = argv.indexOf('--limit')
  let limit = 3
  if (limitIdx >= 0) {
    limit = Number(argv[limitIdx + 1]) || 3
    argv.splice(limitIdx, 2)
  }
  const [cmd, ...rest] = argv

  switch (cmd) {
    case 'show':
      if (!rest[0]) return usage()
      return cmdShow(rest[0], limit)
    case 'page': {
      if (!rest[0] || !rest[1]) return usage()
      const n = Number(rest[rest.length - 1])
      if (!Number.isFinite(n)) {
        console.error('XATO: sahifa raqami son bo\'lishi kerak.')
        process.exit(1)
      }
      return cmdPage(rest.slice(0, -1).join(' '), n)
    }
    case 'find':
      if (!rest[0]) return usage()
      return cmdFind(rest.join(' '), limit)
    case 'books':
      return cmdBooks()
    case 'gaps':
      return cmdGaps()
    default:
      return usage()
  }
}

main()
