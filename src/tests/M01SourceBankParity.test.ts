import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Regression only: this existing public source bank is not the private 570-item
// production AXB bank. Do not commit private learner answer keys to public Git.
const bank = JSON.parse(readFileSync(resolve(
  'Axborot_va_axborot_jarayonlari_LaTeX',
  'Axborot_va_raqamli_savodxonlik_400_TEST.json',
), 'utf8')) as {
  question_count: number
  chapters: Array<{
    number: number
    questions: Array<{
      id: string
      stem: string
      options: string[]
      answer_index: number
      answer: string
      explanation: string
      source: string
    }>
  }>
}
const publishedStaticSource = readFileSync(resolve('src/data/topics/m01.ts'), 'utf8')
const chapterCounts = [60, 60, 70, 100, 110]

describe('M01 existing 400-item public source-bank inventory and topic parity', () => {
  it('has exactly 400 uniquely identifiable, complete questions', () => {
    expect(bank.question_count).toBe(400)
    expect(bank.chapters).toHaveLength(5)
    const all = bank.chapters.flatMap((chapter) => chapter.questions)
    expect(all).toHaveLength(400)
    expect(new Set(all.map((q) => q.id)).size).toBe(400)
    expect(new Set(all.map((q) => q.stem.trim().toLowerCase())).size).toBe(400)
    for (const question of all) {
      expect(question.stem.trim()).not.toBe('')
      expect(question.options).toHaveLength(4)
      expect(question.options.every((option) => option.trim().length > 0)).toBe(true)
      expect(new Set(question.options.map((option) => option.trim().toLowerCase())).size).toBe(4)
      expect(question.answer_index).toBeGreaterThanOrEqual(0)
      expect(question.answer_index).toBeLessThan(4)
      expect(question.answer).toBe('ABCD'[question.answer_index])
      expect(question.explanation.trim()).not.toBe('')
      expect(question.source.trim()).not.toBe('')
    }
  })

  it('keeps each source chapter in its existing matching M01 topic, with no lost or duplicate IDs', () => {
    const mapped: string[] = []
    for (const [index, chapter] of bank.chapters.entries()) {
      const topicId = `M01.0${index + 2}`
      const nextTopic = `M01.0${index + 3}`
      const start = publishedStaticSource.indexOf(`  "${topicId}": {`)
      const end = publishedStaticSource.indexOf(`  "${nextTopic}": {`, start + 1)
      expect(start).toBeGreaterThanOrEqual(0)
      expect(end).toBeGreaterThan(start)
      const section = publishedStaticSource.slice(start, end)
      const sectionIds = [...section.matchAll(/id: '(ARS-\\d{2}-\\d{3})'/g)].map((m) => m[1])
      const expected = chapter.questions.map((q) => q.id)
      expect(chapter.number).toBe(index + 1)
      expect(chapter.questions).toHaveLength(chapterCounts[index])
      expect(sectionIds).toEqual(expected)
      mapped.push(...sectionIds)
    }
    expect(new Set(mapped).size).toBe(400)
  })
})
