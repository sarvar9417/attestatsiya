import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Original public M01 authoring bank. Never use private 570-item production
// imports or learner-only API keys in frontend tests.
const source = JSON.parse(readFileSync(resolve(
  'Axborot_va_axborot_jarayonlari_LaTeX',
  'Axborot_va_raqamli_savodxonlik_400_TEST.json',
), 'utf8')) as {
  chapters: Array<{ questions: Array<{
    id: string
    stem: string
    type: string
    options: string[]
    answer_index: number
  }> }>
}
const questions = source.chapters.flatMap(chapter => chapter.questions)
const bytes = { B: 1, KiB: 1024, MiB: 1024 ** 2, GiB: 1024 ** 3, MB: 1e6 }
const bits: Record<string, number> = {
  bit: 1, kbit: 1e3, Mbit: 1e6, Gbit: 1e9,
  B: 8, kB: 8e3, MB: 8e6, GB: 8e9,
  KiB: 8 * 1024, MiB: 8 * 1024 ** 2,
  GiB: 8 * 1024 ** 3, TiB: 8 * 1024 ** 4,
}
const num = (v: string) => Number(v.replace(/\s/g, '').replace(',', '.'))

function checkMath(item: (typeof questions)[number]): { expected: number; actual: number; decimals: number } | null {
  const text = item.stem
  let expected: number | undefined
  let unit: string | undefined
  let m: RegExpMatchArray | null
  if (item.type === 'birlik o‘tkazish') {
    m = text.match(/^([\d\s,]+) (B|KiB|MiB|GiB|TiB|MB|GB|kB|kbit|Mbit|Gbit|bit) nechta (B|KiB|MiB|GiB|TiB|MB|GB|kB|kbit|Mbit|Gbit|bit) ga teng/)
    if (m) { unit = m[3]; expected = num(m[1]) * bits[m[2]] / bits[m[3]] }
  } else if (item.type === 'Xartli') {
    m = text.match(/^Teng ehtimolli (\d+) ta holatdan/)
    if (m) { unit = 'bit'; expected = Math.log2(Number(m[1])) }
  } else if (item.type === 'minimal kod') {
    m = text.match(/^(\d+) ta turli belgini/)
    if (m) { unit = 'bit'; expected = Math.ceil(Math.log2(Number(m[1]))) }
  } else if (item.type === 'ranglar soni') {
    m = text.match(/^(\d+) bit rang chuqurligi/)
    if (m) { unit = 'rang'; expected = 2 ** Number(m[1]) }
  } else if (item.type === 'minimal rang chuqurligi') {
    m = text.match(/^Kamida (\d+) xil rangni/)
    if (m) { unit = 'bit'; expected = Math.ceil(Math.log2(Number(m[1]))) }
  } else if (item.type === 'fayl hajmi') {
    m = text.match(/^Kitob (\d+) sahifa, har sahifada (\d+) satr, har satrda (\d+) belgi\. Har belgi (\d+) bayt\. Matn hajmini (B|KiB|MiB) da toping/)
    if (m) { unit = m[5]; expected = +m[1] * +m[2] * +m[3] * +m[4] / bytes[unit as keyof typeof bytes] }
  } else if (item.type === 'grafik hajmi') {
    m = text.match(/^(\d+)×(\d+) pikselli, (\d+) bit rang chuqurligidagi siqilmagan rastr tasvir hajmini (B|KiB|MiB) da toping/)
    if (m) { unit = m[4]; expected = +m[1] * +m[2] * +m[3] / 8 / bytes[unit as keyof typeof bytes] }
  } else if (item.type === 'audio hajmi') {
    m = text.match(/^(\d+) Hz, (\d+) bit, (\d+) kanal, (\d+) soniyalik siqilmagan audio hajmini (B|MB|MiB) da toping/)
    if (m) { unit = m[5]; expected = +m[1] * +m[2] * +m[3] * +m[4] / 8 / bytes[unit as keyof typeof bytes] }
  } else if (item.type === 'siqilmagan video') {
    m = text.match(/^(\d+)×(\d+), (\d+) bit, (\d+) FPS, (\d+) soniyalik siqilmagan video hajmini (MiB|GiB) da toping/)
    if (m) { unit = m[6]; expected = +m[1] * +m[2] * +m[3] / 8 * +m[4] * +m[5] / bytes[unit as keyof typeof bytes] }
  } else if (item.type === 'PPI') {
    m = text.match(/^Tasvir kengligi ([\d,]+) cm, zichligi (\d+) PPI/)
    if (m) { unit = 'piksel'; expected = num(m[1]) / 2.54 * +m[2] }
  }
  if (expected === undefined || !unit || !Number.isFinite(expected)) return null
  const answer = item.options[item.answer_index]
  expect(answer.endsWith(unit), `${item.id} answer unit`).toBe(true)
  const digits = answer.slice(0, -unit.length).trim()
  const decimals = digits.includes(',') ? digits.split(',')[1].length : 0
  return { expected, actual: num(digits), decimals }
}

describe('M01 independently recomputed numeric source questions', () => {
  it('verifies unit conversions, Hartley, encoding lengths and raster/audio/video quantities', () => {
    let verified = 0
    for (const question of questions) {
      const result = checkMath(question)
      if (!result) continue
      verified += 1
      const tolerance = 0.5 / 10 ** result.decimals + 1e-9
      expect(Math.abs(result.expected - result.actual), `incorrect calculation ${question.id}`)
        .toBeLessThanOrEqual(tolerance)
    }
    // This is an explicit audited subset, not all 400 items.
    expect(verified).toBe(81)
  })

  it('marks a tie-rounding convention to resolve editorially, not by silently changing the key', () => {
    const question = questions.find(q => q.id === 'ARS-04-071')
    expect(question).toBeDefined()
    if (!question) return
    const value = checkMath(question)
    expect(value?.expected).toBe(409.0625)
    // Original bank displays 409,062; half-up gives 409,063.
    // Exact value 409,0625 KiB should be accepted or a rounding rule specified.
    expect(value?.actual).toBe(409.062)
  })
})
