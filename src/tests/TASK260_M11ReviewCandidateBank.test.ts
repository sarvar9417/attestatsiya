import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type DraftCandidate = {
  id: string
  lesson_id: string
  construct: string
  question_type: string
  difficulty: number
  objective: string
  source_pdf: string
  source_pdf_pages: number[]
  stem: string
  options: string[]
  status: string
  human_answer_verification: string
  human_source_verification: string
}

const payload = JSON.parse(readFileSync(resolve(
  'docs/audits/TASK260_M11_HTML_Y1_CANDIDATES.json',
), 'utf8')) as { task: string; published_or_approved: boolean; items: DraftCandidate[] }

const candidates = payload.items

describe('TASK-260: source-grounded M11 HTML draft candidates', () => {
  it('keeps 13 distinct items in the M11.01/S5.WEB.04 review queue', () => {
    expect(payload.task).toBe('TASK-260')
    expect(payload.published_or_approved).toBe(false)
    expect(candidates).toHaveLength(13)
    expect(new Set(candidates.map(q => q.id)).size).toBe(13)
    expect(candidates.map(q => q.id)).toEqual(
      Array.from({ length: 13 }, (_, i) => `M11H-${String(i + 1).padStart(3, '0')}`),
    )
    for (const q of candidates) {
      expect(q.lesson_id).toBe('b1100000-0000-4000-8000-000000000001')
      expect(q.construct).toBe('S5.WEB.04')
      expect(q.question_type).toBe('Y1')
    }
  })

  it('requires real editorial review, never bundling an answer key or a publication flag', () => {
    for (const q of candidates) {
      expect(q.status).toBe('draft_candidate')
      expect(q.human_answer_verification).toBe('required')
      expect(q.human_source_verification).toBe('required')
      const keys = Object.keys(q)
      for (const forbidden of [
        'correct_index', 'correct_option_id', 'answer_index', 'answer',
        'question_key', 'question_keys', 'approved_by', 'published_at',
      ]) {
        expect(keys, `${q.id}: candidate must not carry ${forbidden}`).not.toContain(forbidden)
      }
    }
  })

  it('requires four unique plausible option strings, unique stems and bounded difficulty', () => {
    expect(new Set(candidates.map(q => q.stem.trim().toLowerCase())).size).toBe(13)
    for (const q of candidates) {
      expect(q.stem.length).toBeGreaterThan(48)
      expect(q.options).toHaveLength(4)
      expect(q.options.every(option => option.trim().length > 0)).toBe(true)
      expect(new Set(q.options.map(option => option.trim().toLowerCase())).size).toBe(4)
      expect(q.difficulty).toBeGreaterThanOrEqual(1)
      expect(q.difficulty).toBeLessThanOrEqual(5)
    }
  })

  it('records exact textbook PDF page pointers and covers list, image and text semantics', () => {
    const objectives = candidates.map(q => q.objective)
    expect(objectives.some(x => x.startsWith('list_') || x === 'nested_lists')).toBe(true)
    expect(objectives.some(x => x.startsWith('img_') || x === 'figure_caption')).toBe(true)
    expect(objectives).toContain('text_structure')
    for (const q of candidates) {
      expect(q.source_pdf).toBe('ICT 7_sinf-2021(1).pdf')
      expect(q.source_pdf_pages.length).toBeGreaterThan(0)
      expect(q.source_pdf_pages.every(p => Number.isInteger(p) && p >= 119 && p <= 126)).toBe(true)
    }
  })
})
