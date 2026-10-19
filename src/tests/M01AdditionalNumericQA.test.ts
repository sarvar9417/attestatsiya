import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Complements M01IndependentNumericQA (81 questions) with 84 separately
// recomputed quantities. The public original bank is an authoring source;
// no private 570-item bank, database, or production question keys are mutated.
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
type Item = (typeof source.chapters)[number]['questions'][number]
const questions = source.chapters.flatMap(chapter => chapter.questions)
const auditTypes = new Set([
  'xabar hajmi', 'uzatish hisoblari', 'siqish', 'kanal samaradorligi',
  'matn hajmi', 'kadr soni', 'UTF aralash hajm', 'teskari matn',
  'siqilgan audio', 'audio bitrate', 'video bitrate hajmi',
  'multimedia jami', 'audio proporsiya', 'multimedia oqimi',
])
const quantitiesInBytes: Record<string, number> = {
  B: 1,
  kB: 1e3,
  KiB: 1024,
  MB: 1e6,
  MiB: 1024 ** 2,
  GB: 1e9,
  GiB: 1024 ** 3,
  kbit: 1e3 / 8,
  Mbit: 1e6 / 8,
  Gbit: 1e9 / 8,
}
const number = (value: string) => Number(value.replace(/\s/g, '').replace(',', '.'))
const unitPattern = /^(.*?)\s*(MiB\/s|Mbit\/s|Gbit\/s|kbit\/s|marta oshadi|o‘zgarmaydi|MiB|KiB|GB|MB|kB|B|kadr|belgi|marta|s|%)$/i

function audit(item: Item): { expected: number; actual: number; decimals: number } {
  const stem = item.stem
  const answer = item.options[item.answer_index]
  const parsedAnswer = answer.match(unitPattern)
  expect(parsedAnswer, item.id + ': answer needs a parseable unit').not.toBeNull()
  if (!parsedAnswer) throw Error('Unparseable answer ' + item.id)
  const amount = parsedAnswer[1].trim()
  const unit = parsedAnswer[2]
  const decimals = amount.includes(',') ? amount.split(',')[1].length : 0
  let expected: number | undefined
  let unitOfExpected: string | undefined
  let m: RegExpMatchArray | null = null

  switch (item.type) {
    case 'xabar hajmi': {
      m = stem.match(/^(\d+) ta belgi, har biri (\d+) baytdan/)
      if (m) { expected = +m[1] * +m[2]; unitOfExpected = 'B' }
      break
    }
    case 'matn hajmi': {
      m = stem.match(/^Matnda (\d+) ta belgi bor, har biri (\d+) bayt bilan kodlangan\. Hajmni (B|KiB|kB) da/)
      if (m) {
        expected = +m[1] * +m[2]
        unitOfExpected = 'B'
        expect(unit, item.id + ': requested vs answered unit').toBe(m[3])
      }
      break
    }
    case 'kadr soni': {
      m = stem.match(/^(\d+) FPS videoda (\d+) soniyada/)
      if (m) { expected = +m[1] * +m[2]; unitOfExpected = 'kadr' }
      break
    }
    case 'UTF aralash hajm': {
      m = stem.match(/^Matnda (\d+) ta bir baytli va (\d+) ta (\d+) baytli belgi/)
      if (m) { expected = +m[1] + +m[2] * +m[3]; unitOfExpected = 'B' }
      break
    }
    case 'teskari matn': {
      m = stem.match(/^(\d+) baytli matnda har belgi (\d+) bayt/)
      if (m) { expected = +m[1] / +m[2]; unitOfExpected = 'belgi' }
      break
    }
    case 'siqilgan audio': {
      m = stem.match(/^(\d+) kbit\/s bitratedagi audio (\d+) soniya/)
      if (m) { expected = +m[1] * 1000 / 8 * +m[2]; unitOfExpected = 'B' }
      break
    }
    case 'audio bitrate': {
      m = stem.match(/^(\d+) Hz, (\d+) bit, (\d+) kanalli/)
      if (m) { expected = +m[1] * +m[2] * +m[3] / 1000; unitOfExpected = 'kbit/s' }
      break
    }
    case 'video bitrate hajmi': {
      m = stem.match(/^Video bitrate’i (\d+) Mbit\/s, davomiyligi (\d+) s/)
      if (m) { expected = +m[1] * 1e6 / 8 * +m[2]; unitOfExpected = 'B' }
      break
    }
    case 'multimedia oqimi': {
      m = stem.match(/^Video (\d+) Mbit\/s, audio (\d+) kbit\/s, davomiylik (\d+) s/)
      if (m) { expected = (+m[1] * 1e6 + +m[2] * 1000) / 8 * +m[3]; unitOfExpected = 'B' }
      break
    }
    case 'multimedia jami': {
      m = stem.match(/^Loyihada (\d+) ta (\d+) MB rasm va (\d+) ta (\d+) MB audio/)
      if (m) { expected = +m[1] * +m[2] + +m[3] * +m[4]; unitOfExpected = 'MB' }
      break
    }
    case 'kanal samaradorligi': {
      m = stem.match(/^Kanalning nazariy tezligi (\d+) Mbit\/s, amaliy throughput (\d+) Mbit\/s/)
      if (m) { expected = +m[2] / +m[1] * 100; unitOfExpected = '%' }
      break
    }
    case 'uzatish hisoblari': {
      m = stem.match(/^([\d,]+) (MB|MiB|GB|GiB) hajmli fayl ([\d,]+) (Mbit|MB|MiB)\/s tezlikda uzatilsa/)
      if (m) {
        expected = number(m[1]) * quantitiesInBytes[m[2]] /
          (number(m[3]) * quantitiesInBytes[m[4]])
        unitOfExpected = 's'
      }
      m = stem.match(/^([\d,]+) (MB|MiB|GB|GiB) axborot (\d+) (s|min) da uzatildi/)
      if (m) {
        expected = number(m[1]) * quantitiesInBytes[m[2]] /
          (+m[3] * (m[4] === 'min' ? 60 : 1))
        unitOfExpected = 'B/s'
      }
      m = stem.match(/^([\d,]+) (Mbit|MiB|Gbit)\/s tezlik (\d+) (s|min) davom etsa/)
      if (m) {
        expected = number(m[1]) * quantitiesInBytes[m[2]] *
          +m[3] * (m[4] === 'min' ? 60 : 1)
        unitOfExpected = 'B'
      }
      break
    }
    case 'siqish': {
      m = stem.match(/^([\d,.]+) (MB|MiB|GB) fayl siqilgach (\d+)% asl hajm qoldi/)
      if (m) { expected = number(m[1]) * +m[3] / 100; unitOfExpected = m[2] }
      m = stem.match(/^([\d,.]+) (MB|MiB|GB) fayl (\d+):1 siqish/)
      if (m) { expected = number(m[1]) / +m[3]; unitOfExpected = m[2] }
      m = stem.match(/^Asl hajm (\d+) MB, siqilgan hajm (\d+) MB/)
      if (m) { expected = +m[1] / +m[2]; unitOfExpected = 'marta' }
      m = stem.match(/^([\d,.]+) (MB|MiB|GB) fayl hajmi (\d+)% ga kamaydi/)
      if (m) { expected = number(m[1]) * (1 - +m[3] / 100); unitOfExpected = m[2] }
      break
    }
    case 'audio proporsiya': {
      if (stem.startsWith('Namuna chastotasi 2 marta')) expected = 2
      if (stem.startsWith('Mono audio stereo qilinsa')) expected = 2
      m = stem.match(/^Bit chuqurligi (\d+) dan (\d+) ga/)
      if (m) expected = +m[2] / +m[1]
      if (stem.startsWith('Sampling rate yarimlashib')) expected = 0.5 * 2
      unitOfExpected = 'proporsiya'
      break
    }
  }

  expect(expected, item.id + ': numeric stem parser missing').toBeDefined()
  expect(unitOfExpected, item.id + ': original quantity unit missing').toBeDefined()
  if (expected === undefined || !unitOfExpected) throw Error('Cannot recompute ' + item.id)
  if (unitOfExpected === 'proporsiya') {
    if (expected === 1) {
      expect(answer, item.id).toBe('O‘zgarmaydi')
      return { expected: 1, actual: 1, decimals: 0 }
    }
    expect(unit, item.id).toBe('marta oshadi')
    return { expected, actual: number(amount), decimals }
  }

  if (unitOfExpected === 'B') {
    expect(quantitiesInBytes[unit], item.id + ': unexpected storage unit').toBeDefined()
    expected /= quantitiesInBytes[unit]
  } else if (unitOfExpected === 'B/s') {
    expect(['Mbit/s', 'MiB/s', 'Gbit/s'], item.id + ': unsupported transfer rate').toContain(unit)
    const rateUnits: Record<string, number> = {
      'Mbit/s': quantitiesInBytes.Mbit,
      'MiB/s': quantitiesInBytes.MiB,
      'Gbit/s': quantitiesInBytes.Gbit,
    }
    expected /= rateUnits[unit]
  } else if (quantitiesInBytes[unitOfExpected]) {
    expect(quantitiesInBytes[unit], item.id + ': incompatible size units').toBeDefined()
    expected = expected * quantitiesInBytes[unitOfExpected] / quantitiesInBytes[unit]
  } else {
    expect(unit.toLowerCase(), item.id + ': mismatch in answer unit')
      .toBe(unitOfExpected.toLowerCase())
  }
  return { expected, actual: number(amount), decimals }
}

describe('M01 additional numeric answer-key recomputation', () => {
  it('checks every one of the 84 previously unaudited parametric questions', () => {
    const relevant = questions.filter(q => auditTypes.has(q.type))
    expect(relevant).toHaveLength(84)
    expect(new Set(relevant.map(q => q.id)).size).toBe(84)

    for (const q of relevant) {
      const result = audit(q)
      // A displayed decimal answer accepts a half-unit of the final printed
      // place; the exact rational quantity is never rounded during computation.
      const tolerance = 0.5 / 10 ** result.decimals + 1e-9
      expect(Math.abs(result.expected - result.actual),
        q.id + ': expected ' + result.expected + ', keyed ' + result.actual,
      ).toBeLessThanOrEqual(tolerance)
    }
  })

  it('guards common SI/IEC traps and a decimal transfer-time edge case', () => {
    const selected = ['ARS-04-076', 'ARS-04-079', 'ARS-04-082',
      'ARS-05-039', 'ARS-05-042', 'ARS-05-084', 'ARS-05-098']
    for (const id of selected) {
      const q = questions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      if (!q) continue
      const result = audit(q)
      expect(Math.abs(result.expected - result.actual), id)
        .toBeLessThanOrEqual(0.5 / 10 ** result.decimals + 1e-9)
    }
  })
})
