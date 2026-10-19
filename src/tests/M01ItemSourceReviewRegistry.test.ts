import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type Item = {
  id: string
  chapter: number
  type: string
  options: string[]
  answer_index: number
  concept: string
}
const bank = JSON.parse(readFileSync(resolve(
  'Axborot_va_axborot_jarayonlari_LaTeX/Axborot_va_raqamli_savodxonlik_400_TEST.json',
), 'utf8')) as { chapters: { questions: Item[] }[] }
const questions = bank.chapters.flatMap(c => c.questions)
const byId = new Map(questions.map(q => [q.id, q]))
const columns = [
  'definition_id', 'application_id', 'chapter', 'concept', 'definition_key',
  'application_key', 'candidate_book', 'printed_pages', 'page_evidence_level',
  'priority', 'review_note',
]
const registry = readFileSync(resolve(
  'docs/audits/TASK252_M01_58_ITEM_SOURCE_REVIEW.tsv',
), 'utf8').trim().split(/\r?\n/).map(line => line.split('\t'))
const optionSet = (q: Item) => q.options.map(x => x.trim().toLowerCase()).sort().join('\u0000')

describe('TASK-252: all reused-choice definition/application pairs are explicitly queued for review', () => {
  it('maintains 58 unique source review rows, with no fabricated expert approval', () => {
    expect(registry[0]).toEqual(columns)
    const rows = registry.slice(1)
    expect(rows).toHaveLength(58)
    const ids = new Set<string>()
    for (const row of rows) {
      expect(row, 'invalid review registry column count').toHaveLength(columns.length)
      const [definitionId, applicationId, chapter, concept, definitionKey, applicationKey,
        source, pages, level, priority, note] = row
      const a = byId.get(definitionId)
      const b = byId.get(applicationId)
      expect(a, definitionId).toBeDefined()
      expect(b, applicationId).toBeDefined()
      if (!a || !b) continue
      expect(a.type).toBe('farqlash')
      expect(b.type).toBe('vaziyat')
      expect(a.chapter.toString()).toBe(chapter)
      expect(b.chapter).toBe(a.chapter)
      expect(a.concept).toBe(concept)
      expect(b.concept).toBe(concept)
      expect(optionSet(a)).toBe(optionSet(b))
      expect(a.options[a.answer_index]).toBe(definitionKey)
      expect(b.options[b.answer_index]).toBe(applicationKey)
      expect(source.length).toBeGreaterThan(0)
      expect(pages.length).toBeGreaterThan(0)
      expect(['TOPIC_OBSERVED', 'RELATED_ONLY', 'OPEN']).toContain(level)
      expect(['HIGH', 'NORMAL']).toContain(priority)
      expect(note.length).toBeGreaterThan(15)
      expect(ids.has(applicationId), applicationId + ' duplicate review row').toBe(false)
      ids.add(applicationId)
    }
    const actualPairs = new Map<string, Item>()
    const repeatedApplicationIds = new Set<string>()
    for (const q of questions) {
      const prev = actualPairs.get(optionSet(q))
      if (prev?.type === 'farqlash' && q.type === 'vaziyat') repeatedApplicationIds.add(q.id)
      else if (!prev) actualPairs.set(optionSet(q), q)
    }
    expect([...ids].sort()).toEqual([...repeatedApplicationIds].sort())
    expect(rows.filter(r => r[9] === 'HIGH')).toHaveLength(5)
    expect(rows.filter(r => r[8] === 'OPEN')).toHaveLength(5)
  })
})
