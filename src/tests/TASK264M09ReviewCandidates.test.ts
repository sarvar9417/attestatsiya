import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

interface Draft {
  id: string
  lesson_id: string
  lesson_code: string
  construct_family: string
  question_type: string
  difficulty: number
  objective: string
  source_pdf: string
  source_print_pages: number[]
  stem: string
  options: string[]
  status: string
  human_answer_verification: string
  human_source_verification: string
  human_duplicate_check: string
}

const corpus = JSON.parse(readFileSync(resolve(
  'docs/audits/TASK264_M09_25_REVIEW_Y1_CANDIDATES.json',
), 'utf8')) as { task: string; published_or_approved: boolean; items: Draft[] }

describe('TASK-264 source-cited M09 private editorial queue', () => {
  it('keeps 25 unique candidates across five canonical M09 lessons', () => {
    expect(corpus.task).toBe('TASK-264')
    expect(corpus.published_or_approved).toBe(false)
    expect(corpus.items).toHaveLength(25)
    expect(new Set(corpus.items.map(q => q.id)).size).toBe(25)
    expect(new Set(corpus.items.map(q => q.stem.trim().toLowerCase())).size).toBe(25)
    for (let n = 1; n <= 5; n++) {
      const lesson = 'M09.0' + n
      const questions = corpus.items.filter(q => q.lesson_code === lesson)
      expect(questions, lesson).toHaveLength(5)
      expect(questions.every(q => q.lesson_id ===
        '90000000-0000-4000-8000-' + String(n).padStart(12, '0'))).toBe(true)
    }
  })

  it('requires original source-page locators and four distinct MCQ options', () => {
    const boundaries: Record<string, [number, number]> = {
      'M09.01': [4, 12],
      'M09.02': [15, 29],
      'M09.03': [15, 35],
      'M09.04': [44, 50],
      'M09.05': [51, 52],
    }
    for (const q of corpus.items) {
      expect(q.question_type).toBe('Y1')
      expect(q.construct_family).toBe('S4.DB')
      expect(q.source_pdf).toBe('ICT 11_sinf-2021_compressed.pdf')
      expect(q.stem.length).toBeGreaterThan(55)
      expect(q.options).toHaveLength(4)
      expect(q.options.every(option => option.trim().length >= 4)).toBe(true)
      expect(new Set(q.options.map(option => option.trim())).size).toBe(4)
      expect(q.difficulty).toBeGreaterThanOrEqual(2)
      expect(q.difficulty).toBeLessThanOrEqual(4)
      const [min, max] = boundaries[q.lesson_code]
      expect(q.source_print_pages.length).toBeGreaterThan(0)
      expect(q.source_print_pages.every(page => page >= min && page <= max)).toBe(true)
    }
  })

  it('refuses public answer keys, published flags or fabricated approval', () => {
    const forbidden = [
      'correct_index', 'correct_option_id', 'answer_index', 'answer',
      'question_key', 'question_keys', 'approved_by', 'published_at',
      'source_verified', 'key_verified',
    ]
    for (const q of corpus.items) {
      expect(q.status).toBe('draft_candidate')
      expect(q.human_answer_verification).toBe('required')
      expect(q.human_source_verification).toBe('required')
      expect(q.human_duplicate_check).toBe('required')
      for (const name of forbidden) expect(q).not.toHaveProperty(name)
    }
  })

  it('covers distinct lesson constructs, not only repeated definitions', () => {
    for (let n = 1; n <= 5; n++) {
      const objectives = corpus.items
        .filter(q => q.lesson_code === 'M09.0' + n)
        .map(q => q.objective)
      expect(new Set(objectives).size).toBe(5)
    }
  })
})
