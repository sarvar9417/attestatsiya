import { describe, expect, it } from 'vitest'
import legacy from '../content/sanoq/M05_Y2_Y3_74_QUESTIONS_20261018.json'
import release from '../content/sanoq/M05_EXAM_STYLE_30_20261020.json'

type QAItem = {
  format: string
  stem: string
  explanation: string
  source: string
  group?: string
  tag?: string
  choices?: string[]
  correct?: number
  left?: string[]
  right?: string[]
  pairs?: number[]
  steps?: string[]
  sequence?: number[]
}

const older = legacy.questions as QAItem[]
const newer = release.questions as QAItem[]
const all = [...older, ...newer]

const numeric = (raw: string): number => {
  const match = /^([0-9A-F]+)₍(\d+)₎$/.exec(raw)
  if (!match) throw new Error(`Expected a positional integer: ${raw}`)
  const base = Number(match[2])
  const digits = [...match[1]]
  if (base < 2 || base > 16 || digits.some(d => parseInt(d, 16) >= base)) {
    throw new Error(`Illegal digits for base ${base}: ${raw}`)
  }
  return parseInt(match[1], base)
}

const expression = (raw: string): number => {
  const match = /^([0-9A-F]+₍\d+₎) ([+−×]) ([0-9A-F]+₍\d+₎)$/.exec(raw)
  if (!match) throw new Error(`Malformed expression: ${raw}`)
  const a = numeric(match[1])
  const b = numeric(match[3])
  return match[2] === '+' ? a + b : match[2] === '−' ? a - b : a * b
}

describe('M05 attestation-style bank: source and key invariants', () => {
  it('retains all 74 original and 30 audit questions with traceable sources', () => {
    expect(older).toHaveLength(74)
    expect(newer).toHaveLength(30)
    expect(older.filter(q => q.format === 'Y2')).toHaveLength(44)
    expect(older.filter(q => q.format === 'Y3')).toHaveLength(30)
    expect(newer.filter(q => q.format === 'Y1')).toHaveLength(12)
    expect(newer.filter(q => q.format === 'Y2')).toHaveLength(6)
    expect(newer.filter(q => q.format === 'Y3')).toHaveLength(12)
    expect(new Set(all.map(q => q.stem)).size).toBe(all.length)
    for (const q of all) {
      expect(q.stem.length).toBeGreaterThan(25)
      expect(q.explanation.length).toBeGreaterThan(30)
      expect(q.source).toMatch(/ICT7|attestatsiya|spetsifikatsiya|2025|2026/)
    }
  })

  it('each Y2 matches distinct left and right options bijectively', () => {
    for (const q of all.filter(item => item.format === 'Y2')) {
      expect(q.left).toHaveLength(4)
      expect(q.right).toHaveLength(4)
      expect(q.pairs).toHaveLength(4)
      expect(new Set(q.left).size).toBe(4)
      expect(new Set(q.right).size).toBe(4)
      expect(new Set(q.pairs).size).toBe(4)
      expect(q.pairs!.every(index => index >= 0 && index < 4)).toBe(true)

      for (let i = 0; i < 4; i++) {
        const left = q.left![i]
        const right = q.right![q.pairs![i]]
        if (q.group === 'teng-qiymat') {
          expect(numeric(right)).toBe(numeric(q.stem.match(/[0-9]+₍10₎/)![0]))
          expect(right).toContain(`₍${left.match(/\d+/)![0]}₎`)
        } else if (q.group === 'onlik-qiymat') {
          expect(numeric(left)).toBe(numeric(right))
        } else if (q.group === 'arifmetik-javob') {
          expect(expression(left)).toBe(numeric(right))
        } else if (q.group === 'noma-lum-asos') {
          const match = /^([0-9])([0-9])₍p₎ = (\d+)₍10₎$/.exec(left)!
          const base = Number(right.match(/p = (\d+)/)![1])
          expect(Number(match[1]) * base + Number(match[2])).toBe(Number(match[3]))
          expect(base).toBeGreaterThan(Math.max(Number(match[1]), Number(match[2])))
        } else if (q.tag?.startsWith('interval-matching')) {
          const match = /^([0-9A-F]+₍\d+₎) < c < ([0-9A-F]+₍\d+₎)$/.exec(left)!
          expect(numeric(match[1]) + 1).toBe(numeric(right))
          expect(numeric(match[2]) - 1).toBe(numeric(right))
        }
      }
    }
  })

  it('each Y3 key is a permutation; sortable calculations are ascending', () => {
    for (const q of all.filter(item => item.format === 'Y3')) {
      const steps = q.steps!
      const order = q.sequence!
      expect(steps.length).toBeGreaterThanOrEqual(4)
      expect(order).toHaveLength(steps.length)
      expect(new Set(steps).size).toBe(steps.length)
      expect(new Set(order).size).toBe(steps.length)
      expect(order.every(index => index >= 0 && index < steps.length)).toBe(true)

      const ordered = order.map(i => steps[i])
      if (q.group === 'sonlarni-saralash' || q.tag?.startsWith('demo2026-sort')) {
        const values = ordered.map(numeric)
        expect(values).toEqual([...values].sort((a, b) => a - b))
        expect(new Set(values).size).toBe(values.length)
      } else if (q.group === 'ifodalarni-saralash' || q.tag?.startsWith('pair-sums-sort')) {
        const values = ordered.map(expression)
        expect(values).toEqual([...values].sort((a, b) => a - b))
        expect(new Set(values).size).toBe(values.length)
      }
    }
  })

  it('all 12 real-exam-inspired Y1 questions have one mathematically correct choice', () => {
    for (const q of newer.filter(item => item.format === 'Y1')) {
      expect(q.choices).toHaveLength(4)
      expect(new Set(q.choices).size).toBe(4)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(4)
      const answer = q.choices![q.correct!]

      if (q.tag!.startsWith('highest-pair')) {
        const values = [...q.stem.matchAll(/\d\) ([0-9A-F]+₍\d+₎)/g)].map(m => numeric(m[1]))
        expect(values).toHaveLength(4)
        const largestTwo = values.map((value, index) => ({ value, index: index + 1 }))
          .sort((a, b) => b.value - a.value).slice(0, 2)
          .map(item => item.index).sort((a, b) => a - b).join(' va ')
        expect(answer).toBe(largestTwo)
      } else if (q.tag!.startsWith('story-count')) {
        const values = [...q.stem.matchAll(/([0-9A-F]+₍\d+₎)/g)].map(m => numeric(m[1]))
        expect(values).toHaveLength(2)
        expect(numeric(answer)).toBe(values[0] - values[1])
      } else if (q.tag!.startsWith('interval-')) {
        const match = q.stem.match(/a = ([0-9A-F]+₍\d+₎), b = ([0-9A-F]+₍\d+₎)/)!
        expect(numeric(match[1]) + 2).toBe(numeric(match[2]))
        expect(parseInt(answer, 2)).toBe(numeric(match[1]) + 1)
      }
    }
  })

  it('fraction-to-base matching definition mirrors the source textbook method', () => {
    const exercise = older.find(item => item.left?.includes('Kasrni asosga ko‘paytirish'))!
    const text = exercise.right![exercise.pairs![exercise.left!.indexOf('Kasrni asosga ko‘paytirish')]]
    expect(text).toContain('takroriy ko‘paytirib')
    expect(text).toContain('butun qismlarini raqam sifatida yozish')
    expect(exercise.explanation).toContain(text)
  })
})
