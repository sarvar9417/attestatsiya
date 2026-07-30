/**
 * Topics/ — darslik matnini rasmiy taksonomiya bo'yicha AJRATIB OLADI.
 *
 * Ajratish birligi — SAHIFA emas, PARCHA (passage).
 *
 * NIMA UCHUN PARCHA:
 *   Sahifa darajasida ajratilganda `Milliy 11-sinf, 94-sahifa` (mavzusi
 *   "Pythonning sun'iy intellektdagi o'rni") `S3.NUM.01` — "Sanoq sistemalari
 *   asoslari" faylining birinchi manbasi bo'lib chiqqan edi. Sababi: o'sha
 *   sahifada bitta gap bor — "Bunday ma'lumotlar kompyuter xotirasida ikkilik
 *   sanoq sistemasida saqlanadi". Qolgan ~3 KB matn Python haqida.
 *
 *   Ya'ni sahifa darajasidagi ajratish faylni 95% begona matn bilan to'ldiradi.
 *   Parcha darajasida faqat tegishli abzas va uning konteksti olinadi.
 *
 * HAR KONSTRUKT FAYLI:
 *   1. Manba jadvali — darslik, sahifa, parcha soni, moslik kuchi;
 *   2. Ajratib olingan parchalar — har biri ustida darslik + sahifa provenansi.
 *
 * ESKI Topics/ NIMA UCHUN YARAMAGAN:
 *   · 25 o'ylab topilgan mavzu — rasmiy 15 guruh / 76 konstruktga mos emas;
 *   · sahifa raqami yo'q → iqtibos qilib bo'lmaydi (ADR-011 buziladi);
 *   · 43% takror, 11% blok gap o'rtasidan kesilgan;
 *   · 3 fayl butunlay xato klassifikatsiya;
 *   · spetsifikatsiya matni dars materiali sifatida aralashgan.
 *
 * ⚠️ Ajratib olingan matn — faktni tekshirish va sahifani iqtibos qilish uchun.
 *    Savol va izoh muallifning o'z matni bo'lishi shart (ADR-015). `Topics/`
 *    gitignore'da va nashr qilinmaydi.
 *
 * Ishlatish:
 *   npm run corpus:index
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BLUEPRINT_GROUPS, CONSTRUCTS, SOURCE_BLOCKED_GROUPS, GROUP_TECH_MARKERS } from '../src/data/blueprint2026.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const EXTRACTED = join(ROOT, 'darsliklar', 'extracted')
const OUT = join(ROOT, 'Topics')

/** Bu fayllar darslik emas — spetsifikatsiya. Dars materiali sifatida olinmaydi. */
const NOT_TEXTBOOK = new Set([
  'Informatika Testlar spesifikatsiyasi.txt',
  'Adabiyotlar.txt',
])

// ── Sozlamalar ──────────────────────────────────────────────────────────────

/** Kalit so'z sahifalarning shu ulushidan kam joyda uchrasa — "aniq" signal. */
const SPECIFIC_MAX_RATIO = 0.05
/** Parcha saqlanishi uchun minimal vaznlangan ball. */
const MIN_PASSAGE_SCORE = 4.0
/** Parchaning maksimal uzunligi — undan uzuni gap chegarasida bo'linadi. */
const MAX_PASSAGE_CHARS = 900
/** Kontekst: mos kelgan parcha atrofidan qo'shiladigan parcha soni. */
const CONTEXT_PASSAGES = 1
/** Har konstruktga ajratiladigan maksimal parcha. */
const MAX_PASSAGES_PER_CONSTRUCT = 80

/**
 * ENG MOS KONSTRUKTGA BIRIKTIRISH (dominantlik chegarasi).
 *
 * MUAMMO: "chegaradan o'tgan har konstrukt parchani oladi" qoidasi bitta
 * parchani o'nlab konstruktga tarqatadi. Audit natijasi: parchalarning 21.6%i
 * o'zi joylashgan konstruktdan BOSHQA guruhga kuchliroq mos kelgan.
 *
 * Aniq misollar:
 *   · `S3.NUM.01` (sanoq sistemalari) faylida IP-manzil parchasi —
 *     `S6.NET.03` ga 16.6, S3.NUM.01 ga faqat 5.4 ball;
 *   · `S3.ALGO.01` (algoritmlar) faylida Excel `IF` funksiyasi —
 *     `S2.OFFICE.02` ga 12.3, S3.ALGO.01 ga 4.2;
 *   · `S1.INFO.01` (axborot) faylida LMS/MOOC parchasi —
 *     `S7.SEC.05` ga 22.3, S1.INFO.01 ga 5.2.
 *
 * YECHIM: parcha eng yuqori ball olgan konstruktga beriladi. Boshqa
 * konstruktlar uni faqat balli yetarlicha yaqin bo'lsa oladi.
 *
 * Qardosh konstruktga (ayni blueprint guruhida) yumshoqroq chegara —
 * masalan "ikkilik sanoq sistemasida arifmetika" parchasi S3.NUM.01,
 * S3.NUM.02 va S3.NUM.03 ga birdek tegishli va uchalasida ham bo'lishi to'g'ri.
 * Begona guruhga esa qat'iy chegara.
 */
const DOMINANCE_SAME_GROUP = 0.45
const DOMINANCE_CROSS_GROUP = 0.75

/**
 * LANGAR KALIT SO'Z (anchor) — mavzuni aniq belgilaydigan atama.
 *
 * MUAMMO: ba'zi kalit so'zlar kam uchraydi (ya'ni IDF bo'yicha "aniq"), lekin
 * MAVZU jihatdan noaniq. Misollar:
 *   · `arifmetik amal` → `S3.NUM.03` ga tegishli, lekin "Python dasturlash
 *     tilida arifmetik amallar" parchasini ham tortadi (u `S4.CODE` materiali);
 *   · `bilim` → `S1.INFO.01` da, lekin LMS/MOOC parchalarini tortadi;
 *   · `koordinata` → `S4.BLOCK.01` da, lekin grafika parchalarini tortadi.
 *
 * Chastota asosidagi "aniqlik" bu holatni ushlamaydi: `arifmetik amal` butun
 * korpusda 30 marta uchraydi (0.2%), ya'ni chastota bo'yicha juda aniq.
 *
 * YECHIM — ma'lumotdan o'lchash. Kalit so'z o'z guruhi uchun langar bo'ladi,
 * agar uni o'z ichiga olgan parchalar KO'PCHILIGI shu guruhga eng mos kelsa.
 * Aks holda u faqat "qo'shimcha dalil" — yakka o'zi parchani tortib kela olmaydi.
 *
 * Hisoblash bir marta bootstrap qilinadi: avval barcha kalit so'z bilan
 * eng mos guruh aniqlanadi, keyin har kalit so'zning tozaligi o'lchanadi,
 * so'ng biriktirish qayta bajariladi.
 */
const ANCHOR_MIN_PURITY = 0.35
/** Tozalik o'lchash uchun kalit so'z shuncha parchada uchrashi kerak. */
const ANCHOR_MIN_SAMPLE = 8

// ── Normalizatsiya ──────────────────────────────────────────────────────────

/** Registr, apostrof va tire farqini yo'q qiladi. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ʻʼ'‘’`´′]/g, '')
    .replace(/[‑–—]/g, '-')
    .replace(/\s+/g, ' ')
}

/**
 * Kalit so'z uchun matcher — so'z chegarasi + o'zbek qo'shimchalariga tolerantlik.
 *
 * MUAMMO 1 — substring moslik. Oddiy `includes()` qisqa kalit so'zni boshqa
 * so'z ichida topadi. O'lchov: `OR` korpusning 98% sahifasiga, `LAN` 97%,
 * `IF` 70%, `bit` 22% ga "mos keldi" — `OR` "bor" ichida, `bit` "bitta"
 * ichida, `for` "format" ichida. Yechim: chap tomonda qat'iy so'z chegarasi.
 *
 * MUAMMO 2 — o'zbek tili agglutinativ. Korpusda `sanoq sistemasi`,
 * `sistemasida`, `sistemalari` bor; `sanoq sistema` shakli yo'q. Qat'iy o'ng
 * chegara bularning barchasini rad etadi va konstrukt "manbasiz" ko'rinadi.
 * Yechim: o'ng tomonda qo'shimchaga ruxsat.
 *
 * Ikki muammo qarama-qarshi, shuning uchun uzunlikka qarab qaror:
 *   · qisqa kalit so'z (≤ 5 belgi) — ikki tomonda qat'iy (`bit` ≠ `bitta`);
 *   · uzun kalit so'z — chapda qat'iy, o'ngda 6 belgigacha qo'shimcha
 *     (`sanoq sistema` = `sanoq sistemasida`).
 */
const SHORT_KEYWORD_MAX = 5
const SUFFIX_MAX = 6

const matcherCache = new Map<string, RegExp>()
function matcher(keyword: string): RegExp {
  let re = matcherCache.get(keyword)
  if (!re) {
    const n = norm(keyword).trim()
    const body = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
    const right =
      n.replace(/\s/g, '').length <= SHORT_KEYWORD_MAX
        ? '(?![\\p{L}\\p{N}])'
        : `\\p{L}{0,${SUFFIX_MAX}}(?![\\p{L}\\p{N}])`
    re = new RegExp(`(?<![\\p{L}\\p{N}])${body}${right}`, 'u')
    matcherCache.set(keyword, re)
  }
  return re
}

function hasKeyword(normText: string, keyword: string): boolean {
  return matcher(keyword).test(normText)
}

// ── Korpusni o'qish ─────────────────────────────────────────────────────────

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
  isToc: boolean
}

const PAGE_RE = /^===== SAHIFA (\d+) =====(\s+\[[A-Z]+\])?$/

function loadPages(): Page[] {
  const pages: Page[] = []
  for (const file of readdirSync(EXTRACTED).filter((f) => f.endsWith('.txt')).sort()) {
    if (NOT_TEXTBOOK.has(file)) continue
    const raw = readFileSync(join(EXTRACTED, file), 'utf8')
    const book = shortName(file)
    let no: number | null = null
    let isToc = false
    let buf: string[] = []
    const flush = () => {
      if (no === null) return
      const text = buf.join('\n').trim()
      if (text) pages.push({ file, book, no, text, isToc })
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

// ── Parchalash ──────────────────────────────────────────────────────────────

/** Qisqa, ko'p qismi bosh harfli qator — sarlavha. */
function isHeading(line: string): boolean {
  const t = line.trim()
  if (t.length === 0 || t.length > 80) return false
  const letters = t.replace(/[^\p{L}]/gu, '')
  if (letters.length < 3) return false
  const upper = t.replace(/[^\p{Lu}]/gu, '').length
  return upper / letters.length > 0.6
}

/** Uzun parchani gap chegarasida bo'ladi. */
function splitLong(text: string): string[] {
  if (text.length <= MAX_PASSAGE_CHARS) return [text]
  const out: string[] = []
  let rest = text
  while (rest.length > MAX_PASSAGE_CHARS) {
    // MAX yaqinidagi oxirgi gap tugashini topamiz
    let cut = -1
    for (let i = Math.min(rest.length - 1, MAX_PASSAGE_CHARS); i > MAX_PASSAGE_CHARS * 0.4; i--) {
      if (/[.!?]/.test(rest[i])) { cut = i + 1; break }
    }
    if (cut < 0) {
      // Gap topilmadi — so'z chegarasida bo'lamiz
      cut = rest.lastIndexOf(' ', MAX_PASSAGE_CHARS)
      if (cut < MAX_PASSAGE_CHARS * 0.4) cut = MAX_PASSAGE_CHARS
    }
    out.push(rest.slice(0, cut).trim())
    rest = rest.slice(cut).trim()
  }
  if (rest) out.push(rest)
  return out
}

/**
 * Sahifani parchalarga bo'ladi: bo'sh qator va sarlavha chegara hisoblanadi,
 * juda uzun parcha gap chegarasida bo'linadi.
 */
function splitPassages(pageText: string): string[] {
  const raw: string[] = []
  let cur: string[] = []
  const flush = () => {
    const t = cur.join('\n').trim()
    if (t) raw.push(t)
    cur = []
  }
  for (const line of pageText.split('\n')) {
    if (!line.trim()) { flush(); continue }
    if (isHeading(line)) { flush(); raw.push(line.trim()); continue }
    cur.push(line)
  }
  flush()
  return raw.flatMap(splitLong).filter((p) => p.trim().length > 0)
}

interface Passage {
  book: string
  file: string
  page: number
  /** Sahifa ichidagi tartib — kontekst qo'shish uchun. */
  idx: number
  text: string
  normText: string
}

function buildPassages(pages: Page[]): Passage[] {
  const out: Passage[] = []
  for (const p of pages) {
    if (p.isToc) continue
    splitPassages(p.text).forEach((text, idx) => {
      out.push({ book: p.book, file: p.file, page: p.no, idx, text, normText: norm(text) })
    })
  }
  return out
}

// ── IDF ─────────────────────────────────────────────────────────────────────

/**
 * Kalit so'zning ma'lumot qiymati.
 *
 * `baholash` so'zi yuzlab parchada uchraydi ("ifodani baholash") — pedagogik
 * `KS.03` uchun bu dalil emas. `pedagogik qobiliyat` bir necha parchada
 * uchraydi va kuchli dalil. Vaznsiz sanoq ikkisini teng deb hisoblaydi.
 */
function buildIdf(passages: Passage[]): Map<string, { freq: number; idf: number }> {
  const keywords = new Set<string>()
  for (const c of CONSTRUCTS) for (const kw of c.keywords) keywords.add(kw)

  const stats = new Map<string, { freq: number; idf: number }>()
  const total = passages.length
  for (const kw of keywords) {
    let freq = 0
    for (const p of passages) if (hasKeyword(p.normText, kw)) freq++
    stats.set(kw, { freq, idf: Math.log(1 + total / (1 + freq)) })
  }
  return stats
}

// ── Guruhlash ───────────────────────────────────────────────────────────────

interface Excerpt {
  book: string
  file: string
  page: number
  /** Ketma-ket parchalar birlashtirilgan matn. */
  text: string
  score: number
  matched: string[]
  /** Nechta parchadan tashkil topgan (kontekst bilan). */
  passageCount: number
  /** Parcha kuchliroq mos kelgan BOSHQA guruh (bo'lsa) — muallif ko'rib chiqadi. */
  alsoGroup?: string
}

type Confidence = 'yuqori' | "o'rta" | 'past' | "yo'q"

function confidenceOf(ex: Excerpt[]): Confidence {
  if (ex.length === 0) return "yo'q"
  const best = ex[0].score
  const strong = ex.filter((e) => e.matched.length >= 2).length
  if (best >= 12 && strong >= 3) return 'yuqori'
  if (best >= 7 || strong >= 1) return "o'rta"
  return 'past'
}

const DIM = ''
const rule = (c = '─') => c.repeat(62)

function main(): void {
  const pages = loadPages()
  if (pages.length === 0) {
    console.error(`XATO: ${EXTRACTED} da sahifa topilmadi.`)
    process.exit(1)
  }

  const passages = buildPassages(pages)
  const idf = buildIdf(passages)
  const specificMax = passages.length * SPECIFIC_MAX_RATIO

  // Sahifa bo'yicha parchalarni guruhlab olamiz (kontekst uchun)
  const byPage = new Map<string, Passage[]>()
  for (const p of passages) {
    const key = `${p.file}#${p.page}`
    if (!byPage.has(key)) byPage.set(key, [])
    byPage.get(key)!.push(p)
  }
  for (const list of byPage.values()) list.sort((a, b) => a.idx - b.idx)

  // ── Parchani baholash ────────────────────────────────────────────────────
  interface Scored { score: number; matched: string[]; passes: boolean }
  function scorePassage(p: Passage, c: (typeof CONSTRUCTS)[number]): Scored {
    const matched: string[] = []
    let score = 0
    let hasSpecific = false
    for (const kw of c.keywords) {
      if (!hasKeyword(p.normText, kw)) continue
      matched.push(kw)
      const st = idf.get(kw)!
      score += st.idf
      if (st.freq <= specificMax) hasSpecific = true
    }
    // Darvoza: umumiy so'zning yakka mosligi dalil emas
    const passes =
      matched.length > 0 && score >= MIN_PASSAGE_SCORE && (hasSpecific || matched.length >= 2)
    return { score, matched, passes }
  }

  const groupOfConstruct = new Map(CONSTRUCTS.map((c) => [c.code, c.group]))

  // ── 1-o'tish: dastlabki eng mos guruhni aniqlash ─────────────────────────
  const provisionalBestGroup: (string | null)[] = passages.map((p) => {
    let best: { g: string; s: number } | null = null
    for (const c of CONSTRUCTS) {
      const r = scorePassage(p, c)
      if (r.passes && (!best || r.score > best.s)) best = { g: c.group, s: r.score }
    }
    return best?.g ?? null
  })

  const passageIndex = new Map<Passage, number>(passages.map((p, i) => [p, i]))

  // ── Langar kalit so'zlarni o'lchash ──────────────────────────────────────
  // Kalit so'zni o'z ichiga olgan parchalar ko'pchiligi shu guruhga ketsa —
  // u langar; aks holda faqat qo'shimcha dalil (ANCHOR_* izohiga qarang).
  const kwOwnerGroups = new Map<string, Set<string>>()
  for (const c of CONSTRUCTS) {
    for (const kw of c.keywords) {
      if (!kwOwnerGroups.has(kw)) kwOwnerGroups.set(kw, new Set())
      kwOwnerGroups.get(kw)!.add(c.group)
    }
  }
  /** Guruh uchun langar bo'lgan kalit so'zlar. */
  const anchors = new Set<string>()
  const weakKeywords: { kw: string; group: string; purity: number; n: number }[] = []
  for (const [kw, ownerGroups] of kwOwnerGroups) {
    let total = 0
    const hits = new Map<string, number>()
    passages.forEach((p, i) => {
      if (!hasKeyword(p.normText, kw)) return
      total++
      const g = provisionalBestGroup[i]
      if (g) hits.set(g, (hits.get(g) ?? 0) + 1)
    })
    for (const g of ownerGroups) {
      const purity = total > 0 ? (hits.get(g) ?? 0) / total : 0
      if (total < ANCHOR_MIN_SAMPLE || purity >= ANCHOR_MIN_PURITY) {
        anchors.add(`${g} ${kw}`)
      } else {
        weakKeywords.push({ kw, group: g, purity, n: total })
      }
    }
  }
  const isAnchor = (group: string, kw: string) => anchors.has(`${group} ${kw}`)

  /**
   * Parchada BOSHQA guruhning texnologiya markeri bor, SHU guruhning markeri
   * yoqmi? Bor bolsa — parcha bu guruhning materiali emas.
   *
   * Bu ball hisobi yeta olmaydigan holatni yopadi: "Python dasturlash tilida
   * arifmetik amallar" parchasi `arifmetik amal` (IDF 5.8) orqali `S3.NUM.03`
   * ga, `Python` (IDF 4.9) orqali `S4.CODE` ga mos keladi — ball boyicha
   * S3.NUM yutadi, lekin parcha aslida Python materiali. IDF chastotani
   * olchaydi, mavzuni emas. (GROUP_TECH_MARKERS izohiga qarang.)
   */
  const markerCache = new Map<string, Set<string>>()
  function markersIn(p: Passage): Set<string> {
    const key = `${p.file}#${p.page}#${p.idx}`
    let found = markerCache.get(key)
    if (!found) {
      found = new Set<string>()
      for (const [group, markers] of Object.entries(GROUP_TECH_MARKERS)) {
        for (const m of markers) {
          if (hasKeyword(p.normText, m)) { found.add(group); break }
        }
      }
      markerCache.set(key, found)
    }
    return found
  }
  function hasAlienMarker(p: Passage, group: string): boolean {
    // Markerlari aniqlanmagan guruh (KS, PM.*) bu qoidadan chetda
    if (!(group in GROUP_TECH_MARKERS)) return false
    const found = markersIn(p)
    if (found.size === 0) return false
    return !found.has(group)
  }

  let droppedByMarker = 0


  /**
   * Har parcha uchun ENG MOS konstruktni aniqlab, faqat yetarlicha kuchli
   * da'vogarlarga biriktiradi (DOMINANCE_*), va da'vogarda kamida bitta
   * langar kalit so'z bo'lishini talab qiladi (ANCHOR_*).
   */
  const assignment = new Map<string, { p: Passage; score: number; matched: string[] }[]>()
  for (const c of CONSTRUCTS) assignment.set(c.code, [])

  let droppedByDominance = 0
  let droppedByAnchor = 0
  for (const p of passages) {
    const claims = CONSTRUCTS.map((c) => ({ c, ...scorePassage(p, c) })).filter((x) => x.passes)
    if (claims.length === 0) continue

    const best = claims.reduce((a, b) => (b.score > a.score ? b : a))
    const bestGroup = groupOfConstruct.get(best.c.code)!

    for (const x of claims) {
      const isBest = x.c.code === best.c.code
      if (!isBest) {
        const sameGroup = groupOfConstruct.get(x.c.code) === bestGroup
        const need = (sameGroup ? DOMINANCE_SAME_GROUP : DOMINANCE_CROSS_GROUP) * best.score
        if (x.score < need) { droppedByDominance++; continue }
      }
      // Langar talabi: faqat qo'shimcha dalilga tayangan da'vo qabul qilinmaydi
      if (!x.matched.some((kw) => isAnchor(x.c.group, kw))) { droppedByAnchor++; continue }
      // Begona texnologiya markeri: parcha boshqa mavzuning materiali
      if (hasAlienMarker(p, x.c.group)) { droppedByMarker++; continue }
      assignment.get(x.c.code)!.push({ p, score: x.score, matched: x.matched })
    }
  }

  // ── Har konstrukt uchun mos parchalarni guruhlash ────────────────────────
  const extracts = new Map<string, Excerpt[]>()
  for (const c of CONSTRUCTS) extracts.set(c.code, [])

  for (const c of CONSTRUCTS) {
    interface Match { p: Passage; score: number; matched: string[] }
    const matches: Match[] = assignment.get(c.code)!
    if (matches.length === 0) continue

    // 2) Sahifa bo'yicha to'plab, kontekst qo'shib, qo'shni oynalarni birlashtiramiz
    const byPageMatches = new Map<string, Match[]>()
    for (const m of matches) {
      const key = `${m.p.file}#${m.p.page}`
      if (!byPageMatches.has(key)) byPageMatches.set(key, [])
      byPageMatches.get(key)!.push(m)
    }

    const result: Excerpt[] = []
    for (const [key, ms] of byPageMatches) {
      const all = byPage.get(key)!
      const pos = new Map(all.map((p, i) => [p.idx, i]))

      /**
       * Qo'shni parcha kontekst sifatida qo'shiladimi?
       *
       * Faqat MAVZUGA TEGISHLI bo'lsa. Aks holda begona matn tortiladi:
       * `S3.NUM.01` da "ikkilik sanoq sistemasida saqlanadi" gapining oldingi
       * qo'shnisi Python/sun'iy intellekt haqidagi abzas edi.
       *
       * Tegishli deb hisoblanadi: kalit so'z bor, YOKI qisqa (sarlavha /
       * abzas davomi).
       */
      const isRelatedContext = (p: Passage): boolean =>
        p.text.trim().length < 200 || c.keywords.some((kw) => hasKeyword(p.normText, kw))

      // Kontekst bilan oynalar
      const windows: { from: number; to: number; score: number; matched: Set<string>; alsoGroup?: string }[] = []
      for (const m of ms.sort((a, b) => a.p.idx - b.p.idx)) {
        const i = pos.get(m.p.idx)!
        let from = i
        for (let k = 1; k <= CONTEXT_PASSAGES && i - k >= 0; k++) {
          if (!isRelatedContext(all[i - k])) break
          from = i - k
        }
        let to = i
        for (let k = 1; k <= CONTEXT_PASSAGES && i + k < all.length; k++) {
          if (!isRelatedContext(all[i + k])) break
          to = i + k
        }
        const bg = provisionalBestGroup[passageIndex.get(m.p)!]
        const alien = bg && bg !== c.group ? bg : undefined
        const last = windows[windows.length - 1]
        if (last && from <= last.to + 1) {
          // Qo'shni yoki kesishuvchi oyna — birlashtiramiz
          last.to = Math.max(last.to, to)
          last.score += m.score
          m.matched.forEach((x) => last.matched.add(x))
          if (alien && !last.alsoGroup) last.alsoGroup = alien
        } else {
          windows.push({ from, to, score: m.score, matched: new Set(m.matched), alsoGroup: alien })
        }
      }

      for (const w of windows) {
        const text = all.slice(w.from, w.to + 1).map((p) => p.text).join('\n\n')
        result.push({
          book: ms[0].p.book,
          file: ms[0].p.file,
          page: ms[0].p.page,
          text,
          score: Math.round(w.score * 10) / 10,
          matched: [...w.matched],
          passageCount: w.to - w.from + 1,
          alsoGroup: w.alsoGroup,
        })
      }
    }

    result.sort((a, b) => b.score - a.score || a.book.localeCompare(b.book) || a.page - b.page)
    extracts.set(c.code, result)
  }

  // ── Yozish ──────────────────────────────────────────────────────────────
  if (existsSync(OUT)) rmSync(OUT, { recursive: true })
  mkdirSync(OUT, { recursive: true })

  const blocked = new Set<string>(SOURCE_BLOCKED_GROUPS)
  let totalExcerpts = 0
  let totalChars = 0
  const groupStats: {
    code: string; title: string; questions: number; constructs: number
    excerpts: number; missing: number; lowConf: number
  }[] = []

  for (const g of BLUEPRINT_GROUPS) {
    const groupConstructs = CONSTRUCTS.filter((c) => c.group === g.code)
    const dir = join(OUT, g.code)
    mkdirSync(dir, { recursive: true })

    let groupExcerpts = 0
    let missing = 0
    let lowConf = 0

    for (const c of groupConstructs) {
      const all = extracts.get(c.code)!
      const shown = all.slice(0, MAX_PASSAGES_PER_CONSTRUCT)
      groupExcerpts += all.length
      const conf = confidenceOf(all)
      if (all.length === 0) missing++
      else if (conf === 'past') lowConf++

      const L: string[] = []
      L.push(`# ${c.code} — ${c.title}`)
      L.push('')
      L.push(`> **Blueprint guruhi:** \`${g.code}\` — ${g.title}`)
      L.push(`> **Imtihonda:** guruh uchun ${g.questionCount} savol (${g.questionFrom}–${g.questionTo}-savollar)`)
      if (c.generator) {
        L.push(`> **Generator:** \`${c.generator}\` — bu konstrukt parametrik savol bilan qoplanadi`)
      }
      L.push(`> **Kalit soʻzlar:** ${c.keywords.map((k) => `\`${k}\``).join(', ')}`)
      const uniqPages = new Set(all.map((e) => `${e.file}#${e.page}`)).size
      L.push(`> **Ajratildi:** ${all.length} parcha, ${uniqPages} sahifadan · **ishonchlilik: ${conf}**`)
      L.push('')

      if (conf === 'past') {
        L.push('⚠️ **Past ishonchlilik.** Mosliklar umumiy soʻzlarga tayanadi va boshqa')
        L.push('maʼnoda boʻlishi mumkin. Savol yozishdan oldin manbani albatta tekshiring.')
        L.push('')
      }

      if (all.length === 0) {
        L.push('## ⚠️ Manba topilmadi')
        L.push('')
        if (blocked.has(g.code)) {
          L.push("Bu konstrukt **manbasi hali korpusda yoʻq** guruhga tegishli (blocker B-001).")
          L.push('')
          L.push('Rasmiy spetsifikatsiya §VII talab qiladigan manbalar:')
          L.push('')
          L.push('| # | Manba | Guruh |')
          L.push('|:-:|---|---|')
          L.push('| 1 | Mavlonova R.A. *Umumiy pedagogika*. Toshkent: Fan va texnologiyalar, 2018 — 528 b. | `PM.GEN` |')
          L.push('| 2 | Xoliqov A. *Pedagogik mahorat*. Toshkent: Bayoz, 2025 — 504 b. | `PM.GEN` |')
          L.push('| 3 | Tolipov Oʻ., Roʻziyeva D. *Pedagogik texnologiyalar va pedagogik mahorat*, 2019 — 276 b. | `PM.GEN` |')
          L.push('| 4 | *Umumiy oʻrta taʼlim maktab oʻqituvchisi kasb standarti* | `KS` |')
          L.push('| 5 | Mamarajabov M.E. va boshq. *Informatika oʻqitish metodikasi*, 2023 — 460 b. | `PM.MET` |')
          L.push('')
          L.push("Bu manbalar `darsliklar/` ga qoʻshilib, ekstraksiya qilinmaguncha")
          L.push('bu konstrukt uchun savol yozilmaydi.')
        } else {
          L.push("Kalit soʻzlar korpusda topilmadi. Ehtimol sabablari:")
          L.push('')
          L.push("- kalit soʻzlar juda tor — `src/data/blueprint2026.ts` da kengaytiring;")
          L.push('- mavzu darsliklarda boshqa atama bilan berilgan;')
          L.push('- material haqiqatan yetishmaydi.')
        }
      } else {
        L.push('## Manba jadvali')
        L.push('')
        L.push('| # | Darslik | Sahifa | Parcha | Moslik | Boshqa guruh | Mos kelgan kalit soʻzlar |')
        L.push('|--:|---|---:|:---:|:---:|:---:|---|')
        shown.forEach((e, i) => {
          L.push(
            `| ${i + 1} | ${e.book} | ${e.page} | ${e.passageCount} | ${e.score} | ` +
              `${e.alsoGroup ? `⚠️ ${e.alsoGroup}` : '—'} | ` +
              e.matched.map((m) => `\`${m}\``).join(', ') + ' |',
          )
        })
        if (all.length > MAX_PASSAGES_PER_CONSTRUCT) {
          L.push('')
          L.push(`_Yana ${all.length - MAX_PASSAGES_PER_CONSTRUCT} parcha mavjud (eng mos ${MAX_PASSAGES_PER_CONSTRUCT} tasi ajratildi)._`)
        }
        L.push('')
        L.push('---')
        L.push('')
        L.push('# Ajratib olingan matn')
        L.push('')
        L.push('> ⚠️ **Bu darslik matni.** Faktni tekshirish va manbani iqtibos qilish uchun.')
        L.push("> Savol va izoh muallifning **oʻz matni** boʻlishi shart (`ADR-015`).")
        L.push('>')
        L.push('> Har parcha — mos kelgan abzas va uning bevosita konteksti.')
        L.push('> Toʻliq sahifa kerak boʻlsa: `npm run corpus -- page "<darslik>" <N>`')
        L.push('')

        shown.forEach((e, i) => {
          L.push('---')
          L.push('')
          L.push(`## ${i + 1}. ${e.book} — ${e.page}-sahifa`)
          L.push('')
          L.push(
            `\`${e.file}\` → \`===== SAHIFA ${e.page} =====\` · moslik ${e.score} · ` +
              e.matched.map((m) => `\`${m}\``).join(', '),
          )
          if (e.alsoGroup) {
            L.push('')
            L.push(`⚠️ Bu parcha \`${e.alsoGroup}\` guruhiga ham kuchli mos keladi — savol yozishdan oldin tekshiring.`)
          }
          L.push('')
          L.push('```text')
          L.push(e.text.replace(/```/g, "'''"))
          L.push('```')
          L.push('')
        })
      }

      L.push('---')
      L.push('')
      L.push('_Avtomatik generatsiya: `npm run corpus:index`._')
      L.push("_ADR-009: avtomatik moslik `draft` holatida — savol yozishdan oldin muallif manbani tekshiradi._")
      L.push('')

      const body = L.join('\n')
      totalChars += body.length
      writeFileSync(join(dir, `${c.code}.md`), body, 'utf8')
    }

    totalExcerpts += groupExcerpts
    groupStats.push({
      code: g.code, title: g.title, questions: g.questionCount,
      constructs: groupConstructs.length, excerpts: groupExcerpts, missing, lowConf,
    })
  }

  // ── 00_INDEX.md ─────────────────────────────────────────────────────────
  const bookList = [...new Set(pages.map((p) => p.book))].sort()
  const tocPages = pages.filter((p) => p.isToc).length
  const idx: string[] = []

  idx.push('# Konstrukt boʻyicha ajratib olingan darslik matni')
  idx.push('')
  idx.push('> Avtomatik generatsiya. Qoʻlda tahrirlanmaydi: `npm run corpus:index`.')
  idx.push(`> Manba: \`darsliklar/extracted/\` — ${pages.length} sahifa, ${bookList.length} darslik, ${passages.length} parcha.`)
  idx.push('')
  idx.push('## Ajratish birligi — parcha, sahifa emas')
  idx.push('')
  idx.push('Sahifa darajasida ajratilganda begona matn koʻp tushadi. Masalan')
  idx.push('`Milliy 11-sinf, 94-sahifa` mavzusi "Pythonning sunʼiy intellektdagi oʻrni",')
  idx.push('lekin unda bitta gap bor: *"...ikkilik sanoq sistemasida saqlanadi"*. Sahifa')
  idx.push('darajasida bu `S3.NUM.01` faylining birinchi manbasi boʻlib chiqadi va')
  idx.push('~3 KB Python matnini olib keladi.')
  idx.push('')
  idx.push('Shu sababli ajratish **abzas darajasida**: mos kelgan abzas va uning')
  idx.push('bevosita konteksti olinadi, qolgan sahifa emas.')
  idx.push('')
  idx.push('## Qanday ishlatiladi')
  idx.push('')
  idx.push('Konstrukt faylini ochish yetarli — material shu yerda. CLI qoʻshimcha:')
  idx.push('')
  idx.push('```bash')
  idx.push('npm run corpus -- show S3.NUM.02          # konstrukt manbasi')
  idx.push('npm run corpus -- page "Milliy 7" 13      # toʻliq sahifa')
  idx.push('npm run corpus -- find "rostlik jadvali"  # qidirish (apostrofga sezgir emas)')
  idx.push('npm run corpus -- gaps                    # manbasiz konstruktlar')
  idx.push('```')
  idx.push('')
  idx.push('### Ish tartibi')
  idx.push('')
  idx.push('```')
  idx.push('1. Konstrukt tanlanadi         S3.NUM.02')
  idx.push('2. Fayl ochiladi              Topics/S3.NUM/S3.NUM.02.md')
  idx.push('3. Faktlar tekshiriladi       → Milliy 7-sinf, 13-sahifa')
  idx.push('4. Savol YOZILADI             koʻchirilmaydi — ADR-015')
  idx.push('5. Manba biriktiriladi        source_locators: Milliy 7 / s.13')
  idx.push('```')
  idx.push('')
  idx.push('## Qamrov — 15 blueprint guruhi')
  idx.push('')
  idx.push('| Guruh | Mavzu | Savol | Konstrukt | Parcha | Manbasiz | Past ishonch |')
  idx.push('|---|---|:---:|:---:|---:|:---:|:---:|')
  for (const s of groupStats) {
    const flag = s.missing === s.constructs ? ' 🔴' : s.missing > 0 ? ' 🟠' : ''
    idx.push(`| [\`${s.code}\`](${s.code}/) | ${s.title} | ${s.questions} | ${s.constructs} | ${s.excerpts} | ${s.missing}${flag} | ${s.lowConf} |`)
  }
  const totalMissing = groupStats.reduce((a, s) => a + s.missing, 0)
  const totalLow = groupStats.reduce((a, s) => a + s.lowConf, 0)
  idx.push(`| **Jami** | | **50** | **${CONSTRUCTS.length}** | **${totalExcerpts}** | **${totalMissing}** | **${totalLow}** |`)
  idx.push('')
  idx.push('## Manbasiz guruhlar (blocker B-001)')
  idx.push('')
  const blockedStats = groupStats.filter((s) => blocked.has(s.code))
  const blockedQ = blockedStats.reduce((a, s) => a + s.questions, 0)
  idx.push(`Quyidagi guruhlar imtihonning **${blockedQ} savolini (${Math.round((100 * blockedQ) / 50)}%)** tashkil qiladi,`)
  idx.push("lekin korpusda manbasi yoʻq:")
  idx.push('')
  for (const s of blockedStats) {
    idx.push(`- \`${s.code}\` — ${s.title}: ${s.questions} savol, ${s.constructs} konstrukt, ${s.missing} tasi manbasiz`)
  }
  idx.push('')
  idx.push("Yetishmayotgan 5 manba har bir tegishli konstrukt faylida koʻrsatilgan.")
  idx.push('')
  idx.push('## Indekslangan darsliklar')
  idx.push('')
  for (const b of bookList) {
    const n = pages.filter((p) => p.book === b).length
    idx.push(`- **${b}** — ${n} sahifa`)
  }
  idx.push('')
  idx.push(`_Mundarija sahifalari chiqarildi: ${tocPages}._`)
  idx.push(`_Spetsifikatsiya hujjatlari dars materiali sifatida olinmadi: ${[...NOT_TEXTBOOK].join(', ')}._`)
  idx.push('')
  writeFileSync(join(OUT, '00_INDEX.md'), idx.join('\n'), 'utf8')

  // ── Hisobot ─────────────────────────────────────────────────────────────
  console.log(rule('─'))
  console.log('  KONTENT AJRATIB OLINDI')
  console.log(rule('─'))
  console.log(`  Sahifa                   ${pages.length}`)
  console.log(`  Parcha (jami korpusda)   ${passages.length}`)
  console.log(`  Darslik                  ${bookList.length}`)
  console.log(`  Konstrukt                ${CONSTRUCTS.length}`)
  console.log(`  Ajratilgan parcha        ${totalExcerpts}`)
  console.log(`  Begona sifatida rad      ${droppedByDominance}  (dominantlik chegarasi)`)
  console.log(`  Langarsiz da'vo rad      ${droppedByAnchor}  (mavzuni belgilamaydigan kalit so'z)`)
  console.log(`  Begona marker rad        ${droppedByMarker}  (boshqa mavzu texnologiyasi)`)
  if (weakKeywords.length) {
    console.log()
    console.log(`  MAVZUNI BELGILAMAYDIGAN KALIT SO'ZLAR — ${weakKeywords.length} ta:`)
    for (const w of weakKeywords.sort((a, b) => a.purity - b.purity).slice(0, 12)) {
      console.log(`    ${w.group.padEnd(10)} "${w.kw}" — ${w.n} parchada, faqat ${(100 * w.purity).toFixed(0)}%i shu guruhga`)
    }
  }
  console.log(`  Manbasiz konstrukt       ${totalMissing}`)
  console.log(`  Past ishonchli           ${totalLow}`)
  console.log(`  Yozilgan hajm            ${(totalChars / 1024 / 1024).toFixed(1)} MB`)
  console.log('')
  console.log('  MANBASIZ / PAST ISHONCHLI GURUHLAR')
  for (const s of groupStats.filter((x) => x.missing > 0 || x.lowConf > 0)) {
    const icon = s.missing === s.constructs ? '🔴' : s.missing > 0 ? '🟠' : '🟡'
    console.log(`    ${icon} ${s.code.padEnd(10)} ${s.missing}/${s.constructs} manbasiz, ${s.lowConf} past ishonch`)
  }
  console.log('')
  console.log(`  Yozildi: Topics/00_INDEX.md + ${BLUEPRINT_GROUPS.length} guruh papkasi`)
  console.log(rule('─'))
}

main()
