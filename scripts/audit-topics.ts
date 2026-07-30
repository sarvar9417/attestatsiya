/**
 * Topics/ sifat auditi — syllabus muvofiqligi.
 *
 * SAVOL: har konstrukt faylida FAQAT o'ziga tegishli material bormi?
 * Ya'ni `S1.INFO` (axborot) ga Excel, `S3.NUM` (sanoq sistemalari) ga Python
 * aralashib ketmaganmi?
 *
 * USUL: har ajratilgan parcha uchun BARCHA 76 konstruktga qarshi ball
 * hisoblanadi. Agar parcha o'zi joylashgan konstruktdan boshqasiga kuchliroq
 * mos kelsa — u noto'g'ri joyda.
 *
 * O'LCHOVLAR
 *   Tozalik (purity)      — parcha uchun EGA konstrukt eng yuqori ball oldimi
 *   Guruh tozaligi        — eng yuqori ball ayni blueprint guruhida bo'ldimi
 *                           (qardosh konstruktga mos kelish normal: bir guruh,
 *                            bir xil imtihon savollari)
 *   Begona kontaminatsiya — eng yuqori ball BOSHQA guruhda
 *
 * Ishlatish:
 *   npm run corpus:audit
 *   npm run corpus:audit -- --verbose     # har konstrukt bo'yicha
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BLUEPRINT_GROUPS, CONSTRUCTS, SOURCE_BLOCKED_GROUPS, GROUP_TECH_MARKERS } from '../src/data/blueprint2026.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const EXTRACTED = join(ROOT, 'darsliklar', 'extracted')

const NOT_TEXTBOOK = new Set([
  'Informatika Testlar spesifikatsiyasi.txt',
  'Adabiyotlar.txt',
])

// ── Builder bilan AYNI mantiq ───────────────────────────────────────────────
const SPECIFIC_MAX_RATIO = 0.05
const MIN_PASSAGE_SCORE = 4.0
const MAX_PASSAGE_CHARS = 900
const SHORT_KEYWORD_MAX = 5
const SUFFIX_MAX = 6
const DOMINANCE_SAME_GROUP = 0.45
const DOMINANCE_CROSS_GROUP = 0.75

function norm(s: string): string {
  return s.toLowerCase().replace(/[ʻʼ'‘’`´′]/g, '').replace(/[‑–—]/g, '-').replace(/\s+/g, ' ')
}

const mc = new Map<string, RegExp>()
function matcher(kw: string): RegExp {
  let re = mc.get(kw)
  if (!re) {
    const n = norm(kw).trim()
    const body = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
    const right =
      n.replace(/\s/g, '').length <= SHORT_KEYWORD_MAX
        ? '(?![\\p{L}\\p{N}])'
        : `\\p{L}{0,${SUFFIX_MAX}}(?![\\p{L}\\p{N}])`
    re = new RegExp(`(?<![\\p{L}\\p{N}])${body}${right}`, 'u')
    mc.set(kw, re)
  }
  return re
}
const has = (t: string, kw: string) => matcher(kw).test(t)

function isHeading(line: string): boolean {
  const t = line.trim()
  if (!t || t.length > 80) return false
  const letters = t.replace(/[^\p{L}]/gu, '')
  if (letters.length < 3) return false
  return t.replace(/[^\p{Lu}]/gu, '').length / letters.length > 0.6
}

function splitLong(text: string): string[] {
  if (text.length <= MAX_PASSAGE_CHARS) return [text]
  const out: string[] = []
  let rest = text
  while (rest.length > MAX_PASSAGE_CHARS) {
    let cut = -1
    for (let i = Math.min(rest.length - 1, MAX_PASSAGE_CHARS); i > MAX_PASSAGE_CHARS * 0.4; i--) {
      if (/[.!?]/.test(rest[i])) { cut = i + 1; break }
    }
    if (cut < 0) {
      cut = rest.lastIndexOf(' ', MAX_PASSAGE_CHARS)
      if (cut < MAX_PASSAGE_CHARS * 0.4) cut = MAX_PASSAGE_CHARS
    }
    out.push(rest.slice(0, cut).trim())
    rest = rest.slice(cut).trim()
  }
  if (rest) out.push(rest)
  return out
}

function splitPassages(pageText: string): string[] {
  const raw: string[] = []
  let cur: string[] = []
  const flush = () => { const t = cur.join('\n').trim(); if (t) raw.push(t); cur = [] }
  for (const line of pageText.split('\n')) {
    if (!line.trim()) { flush(); continue }
    if (isHeading(line)) { flush(); raw.push(line.trim()); continue }
    cur.push(line)
  }
  flush()
  return raw.flatMap(splitLong).filter((p) => p.trim())
}

interface P { book: string; page: number; text: string; nt: string }

function load(): P[] {
  const out: P[] = []
  const PAGE = /^===== SAHIFA (\d+) =====(\s+\[[A-Z]+\])?$/
  for (const f of readdirSync(EXTRACTED).filter((x) => x.endsWith('.txt')).sort()) {
    if (NOT_TEXTBOOK.has(f)) continue
    const b = basename(f, '.txt')
    let no: number | null = null
    let toc = false
    let buf: string[] = []
    const flush = () => {
      if (no === null || toc) return
      const t = buf.join('\n').trim()
      if (t) for (const s of splitPassages(t)) out.push({ book: b, page: no, text: s, nt: norm(s) })
    }
    for (const line of readFileSync(join(EXTRACTED, f), 'utf8').split('\n')) {
      const m = PAGE.exec(line.trim())
      if (m) { flush(); no = Number(m[1]); toc = Boolean(m[2]); buf = [] } else buf.push(line)
    }
    flush()
  }
  return out
}

function main(): void {
  const verbose = process.argv.includes('--verbose')
  const passages = load()

  // IDF
  const kws = new Set<string>()
  for (const c of CONSTRUCTS) for (const k of c.keywords) kws.add(k)
  const idf = new Map<string, { freq: number; idf: number }>()
  for (const k of kws) {
    let n = 0
    for (const p of passages) if (has(p.nt, k)) n++
    idf.set(k, { freq: n, idf: Math.log(1 + passages.length / (1 + n)) })
  }
  const specificMax = passages.length * SPECIFIC_MAX_RATIO

  /** Parchaning konstruktga ball va mos kelgan kalit so'zlari. */
  function score(p: P, c: (typeof CONSTRUCTS)[number]) {
    let s = 0
    let spec = false
    const matched: string[] = []
    for (const k of c.keywords) {
      if (!has(p.nt, k)) continue
      matched.push(k)
      const st = idf.get(k)!
      s += st.idf
      if (st.freq <= specificMax) spec = true
    }
    const passes = matched.length > 0 && s >= MIN_PASSAGE_SCORE && (spec || matched.length >= 2)
    return { score: s, matched, passes }
  }

  const groupOf = new Map(CONSTRUCTS.map((c) => [c.code, c.group]))
  // Builder bilan AYNI marker qoidasi
  const markerCache = new Map<P, Set<string>>()
  function markersIn(p: P): Set<string> {
    let f = markerCache.get(p)
    if (!f) {
      f = new Set<string>()
      for (const [g, ms] of Object.entries(GROUP_TECH_MARKERS)) {
        for (const m of ms) if (has(p.nt, m)) { f.add(g); break }
      }
      markerCache.set(p, f)
    }
    return f
  }
  function hasAlienMarker(p: P, group: string): boolean {
    if (!(group in GROUP_TECH_MARKERS)) return false
    const f = markersIn(p)
    return f.size > 0 && !f.has(group)
  }


  interface Stat {
    code: string; group: string
    assigned: number
    own: number        // ega konstrukt eng yuqori
    sameGroup: number  // eng yuqori ayni guruhda
    alien: number      // eng yuqori boshqa guruhda
    alienBy: Map<string, number>
    worst: { book: string; page: number; winner: string; winScore: number; ownScore: number; text: string }[]
  }
  const stats = new Map<string, Stat>()
  for (const c of CONSTRUCTS) {
    stats.set(c.code, {
      code: c.code, group: c.group, assigned: 0, own: 0, sameGroup: 0, alien: 0,
      alienBy: new Map(), worst: [],
    })
  }

  // Har parcha uchun barcha konstruktga ball
  for (const p of passages) {
    const all = CONSTRUCTS.map((c) => ({ c, ...score(p, c) }))
    const passing = all.filter((x) => x.passes)
    if (passing.length === 0) continue
    const best = passing.reduce((a, b) => (b.score > a.score ? b : a))
    const bestGroup = groupOf.get(best.c.code)!

    // Builder bilan AYNI dominantlik qoidasi — audit real natijani o'lchashi kerak
    const assigned = passing.filter((x) => {
      if (x.c.code === best.c.code) return true
      const same = groupOf.get(x.c.code) === bestGroup
      return x.score >= (same ? DOMINANCE_SAME_GROUP : DOMINANCE_CROSS_GROUP) * best.score
    }).filter((x) => !hasAlienMarker(p, x.c.group))

    for (const x of assigned) {
      const st = stats.get(x.c.code)!
      st.assigned++
      if (x.c.code === best.c.code) st.own++
      else if (groupOf.get(best.c.code) === x.c.group) st.sameGroup++
      else {
        st.alien++
        const g = groupOf.get(best.c.code)!
        st.alienBy.set(g, (st.alienBy.get(g) ?? 0) + 1)
        if (st.worst.length < 3 && best.score > x.score * 1.6) {
          st.worst.push({
            book: p.book, page: p.page, winner: best.c.code,
            winScore: Math.round(best.score * 10) / 10,
            ownScore: Math.round(x.score * 10) / 10,
            text: p.text.replace(/\s+/g, ' ').slice(0, 150),
          })
        }
      }
    }
  }

  // ── Hisobot ─────────────────────────────────────────────────────────────
  const rule = (c = '─') => c.repeat(74)
  const blocked = new Set<string>(SOURCE_BLOCKED_GROUPS)
  console.log(rule('═'))
  console.log('  TOPICS/ SIFAT AUDITI — syllabus muvofiqligi')
  console.log(rule('═'))
  console.log(`  Korpus: ${passages.length} parcha, ${CONSTRUCTS.length} konstrukt`)
  console.log()

  let tA = 0, tOwn = 0, tSame = 0, tAlien = 0
  for (const s of stats.values()) { tA += s.assigned; tOwn += s.own; tSame += s.sameGroup; tAlien += s.alien }

  console.log('  UMUMIY')
  console.log(`    Biriktirilgan parcha        ${tA}`)
  console.log(`    Ega konstrukt eng yuqori    ${tOwn}  (${((100 * tOwn) / tA).toFixed(1)}%)`)
  console.log(`    Ayni guruh ichida           ${tSame}  (${((100 * tSame) / tA).toFixed(1)}%)`)
  console.log(`    ⚠️  BEGONA GURUHDAN          ${tAlien}  (${((100 * tAlien) / tA).toFixed(1)}%)`)
  console.log()
  console.log(`    Guruh tozaligi: ${(((100 * (tOwn + tSame)) / tA)).toFixed(1)}%`)
  console.log()

  // Guruh kesimi
  console.log('  GURUH KESIMI')
  console.log(`    ${'Guruh'.padEnd(11)} ${'Parcha'.padStart(7)} ${'Toza'.padStart(7)} ${'Begona'.padStart(7)}  Eng ko'p kontaminatsiya`)
  for (const g of BLUEPRINT_GROUPS) {
    const cs = [...stats.values()].filter((s) => s.group === g.code)
    const a = cs.reduce((x, s) => x + s.assigned, 0)
    if (a === 0) { console.log(`    ${g.code.padEnd(11)} ${'0'.padStart(7)}       —       —  ${blocked.has(g.code) ? '(manba yoʻq)' : ''}`); continue }
    const alien = cs.reduce((x, s) => x + s.alien, 0)
    const pure = 100 * (a - alien) / a
    const by = new Map<string, number>()
    for (const s of cs) for (const [k, v] of s.alienBy) by.set(k, (by.get(k) ?? 0) + v)
    const top = [...by].sort((x, y) => y[1] - x[1]).slice(0, 2).map(([k, v]) => `${k}(${v})`).join(', ')
    const icon = pure >= 95 ? '✅' : pure >= 85 ? '🟡' : '🔴'
    console.log(`    ${g.code.padEnd(11)} ${String(a).padStart(7)} ${(pure.toFixed(0) + '%').padStart(7)} ${String(alien).padStart(7)}  ${icon} ${top}`)
  }
  console.log()

  // Eng muammoli konstruktlar
  const bad = [...stats.values()]
    .filter((s) => s.assigned >= 10)
    .map((s) => ({ s, pct: (100 * s.alien) / s.assigned }))
    .filter((x) => x.pct > 10)
    .sort((a, b) => b.pct - a.pct)

  if (bad.length) {
    console.log('  ⚠️  ENG KO\'P BEGONA MATERIAL BOR KONSTRUKTLAR')
    for (const { s, pct } of bad.slice(0, 12)) {
      const by = [...s.alienBy].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k}×${v}`).join(', ')
      console.log(`    ${s.code.padEnd(14)} ${pct.toFixed(0).padStart(3)}% begona (${s.alien}/${s.assigned})  ←  ${by}`)
    }
    console.log()
  } else {
    console.log('  ✅ 10%+ begona materialli konstrukt yoʻq')
    console.log()
  }

  // Konkret misollar
  const examples = [...stats.values()].flatMap((s) => s.worst.map((w) => ({ owner: s.code, ...w })))
    .sort((a, b) => b.winScore / b.ownScore - a.winScore / a.ownScore)
  if (examples.length) {
    console.log('  KONKRET MISOLLAR (parcha boshqa konstruktga kuchliroq mos)')
    for (const e of examples.slice(0, 8)) {
      console.log(`    ${e.owner} faylida, lekin ${e.winner} ga mosroq (${e.winScore} > ${e.ownScore})`)
      console.log(`      ${e.book} s.${e.page}: ${e.text}…`)
    }
    console.log()
  }

  if (verbose) {
    console.log('  HAR KONSTRUKT')
    for (const s of stats.values()) {
      if (s.assigned === 0) { console.log(`    ${s.code.padEnd(14)} — parcha yoʻq`); continue }
      const pure = 100 * (s.assigned - s.alien) / s.assigned
      console.log(`    ${s.code.padEnd(14)} ${String(s.assigned).padStart(4)} parcha, tozalik ${pure.toFixed(0)}%`)
    }
    console.log()
  }

  console.log(rule('═'))
  const verdict = tAlien / tA
  if (verdict > 0.15) {
    console.log('  🔴 XULOSA: begona material koʻp — biriktirish qoidasi qatʼiylashtirilishi kerak')
    process.exitCode = 1
  } else if (verdict > 0.05) {
    console.log('  🟡 XULOSA: begona material seziladi — yuqoridagi konstruktlarni koʻrib chiqing')
  } else {
    console.log('  ✅ XULOSA: har konstruktda asosan oʻziga tegishli material')
  }
  console.log(rule('═'))
}

main()
