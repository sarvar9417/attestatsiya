import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type Item = { id: string; type: string; stem: string; options: string[]; answer_index: number }
const bank = JSON.parse(readFileSync(resolve(
  'Axborot_va_axborot_jarayonlari_LaTeX/Axborot_va_raqamli_savodxonlik_400_TEST.json',
), 'utf8')) as { chapters: { questions: Item[] }[] }
const questions = bank.chapters.flatMap(c => c.questions)

const key = (q: Item) => q.options.map(s => s.trim().toLocaleLowerCase()).sort().join('\u0000')

describe('M01 reused distractor sets — editorial review gate', () => {
  it('keeps the 400-item source stable and identifies repeated distractor sets', () => {
    const seen = new Map<string, Item>()
    const pairs: Array<[Item, Item]> = []
    for (const item of questions) {
      expect(item.options).toHaveLength(4)
      expect(new Set(item.options.map(s => s.trim())).size, item.id).toBe(4)
      const previous = seen.get(key(item))
      if (previous) pairs.push([previous, item])
      else seen.set(key(item), item)
    }
    expect(questions).toHaveLength(400)
    // Counts are editorial inventory, not 69 proven wrong answer keys.
    expect(pairs.length).toBeLessThanOrEqual(69)
    expect(pairs.filter(([a, b]) => a.type === 'farqlash' && b.type === 'vaziyat').length).toBeLessThanOrEqual(58)
    const answerDiffers = pairs.filter(([a, b]) => a.options[a.answer_index] !== b.options[b.answer_index])
    expect(answerDiffers.map(([a, b]) => [a.id, b.id]).filter(([a, b]) => ['ARS-04-032', 'ARS-05-096'].includes(a))).toEqual([
      ['ARS-04-032', 'ARS-04-033'],
      ['ARS-05-096', 'ARS-05-098'],
    ])
  })
})
