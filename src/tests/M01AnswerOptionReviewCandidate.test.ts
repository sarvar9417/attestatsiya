import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type Item = {
  id: string
  chapter: number
  number: number
  stem: string
  options: string[]
  answer_index: number
  answer: string
  explanation: string
  concept: string
  source: string
}
type Bank = { chapters: { questions: Item[] }[] }
const sourceFile = resolve(
  'Axborot_va_axborot_jarayonlari_LaTeX/Axborot_va_raqamli_savodxonlik_400_TEST.json',
)
const generator = resolve('scripts/stage-m01-answer-options.mjs')

const run = (arg: string): string => execFileSync(process.execPath, [generator, arg], {
  cwd: process.cwd(),
  encoding: 'utf8',
  maxBuffer: 4_000_000,
})

describe('TASK-253: 400 answer-position pattern and non-publishing candidate', () => {
  it('detects the complete original position pattern, while candidate breaks it', () => {
    const audit = JSON.parse(run('--audit')) as {
      totalQuestions: number
      originalPatternMatches: number
      candidatePatternMatches: number
      changedAnswerPositions: number
      candidatePositionCounts: number[]
      publishedChanged: boolean
      outputMode: string
    }
    expect(audit.totalQuestions).toBe(400)
    expect(audit.originalPatternMatches).toBe(400)
    expect(audit.candidatePatternMatches).toBeLessThan(160)
    expect(audit.changedAnswerPositions).toBeGreaterThan(250)
    expect(audit.candidatePositionCounts.reduce((a, b) => a + b, 0)).toBe(400)
    expect(audit.candidatePositionCounts.every(n => n >= 65 && n <= 135)).toBe(true)
    expect(audit.publishedChanged).toBe(false)
    expect(audit.outputMode).toBe('editorial_candidate_only')
  })

  it('preserves every stem, original correct text, distractor set, and explanation', () => {
    const before = readFileSync(sourceFile, 'utf8')
    const original = JSON.parse(before) as Bank
    const staged = JSON.parse(run('--emit-review')) as Bank
    expect(staged.chapters).toHaveLength(5)
    for (let chapterIndex = 0; chapterIndex < 5; chapterIndex += 1) {
      const from = original.chapters[chapterIndex].questions
      const to = staged.chapters[chapterIndex].questions
      expect(to).toHaveLength(from.length)
      for (let j = 0; j < from.length; j += 1) {
        const a = from[j]
        const b = to[j]
        expect(b.id).toBe(a.id)
        expect(b.stem).toBe(a.stem)
        expect(b.explanation).toBe(a.explanation)
        expect(b.concept).toBe(a.concept)
        expect(b.source).toBe(a.source)
        expect([...b.options].sort()).toEqual([...a.options].sort())
        expect(b.options[b.answer_index], a.id).toBe(a.options[a.answer_index])
        expect(b.answer, a.id).toBe('ABCD'[b.answer_index])
      }
    }
    expect(readFileSync(sourceFile, 'utf8')).toBe(before)
  })
})
