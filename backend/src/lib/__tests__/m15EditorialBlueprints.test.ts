import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

// This is an editorial planning artifact, NOT live pool data or an answer key.
const path = new URL(
  '../../../../supabase/maintenance/m15_ten_theory_lessons_blueprint_REVIEW_20261023.json',
  import.meta.url,
)
const manifest = JSON.parse(readFileSync(path, 'utf8')) as {
  status: string
  safe_to_attach_to_published_lessons: boolean
  reviewed_by_human: boolean
  grading_enabled: boolean
  not_an_answer_key: boolean
  expected_questions_per_lesson: number
  lessons: Array<{
    slug: string
    order_idx: number
    approval_status: string
    source_locator: string
    proposed_objectives: Array<{
      draft_id: string
      objective: string
      requires_page_level_source_verification: boolean
    }>
  }>
}

describe('Ten published M15 theory-only lessons: editorial blueprint proposal', () => {
  it('does not misrepresent unreviewed objectives as scored/published tests', () => {
    expect(manifest.status).toBe('review_only')
    expect(manifest.safe_to_attach_to_published_lessons).toBe(false)
    expect(manifest.reviewed_by_human).toBe(false)
    expect(manifest.grading_enabled).toBe(false)
    expect(manifest.not_an_answer_key).toBe(true)
    expect(manifest.expected_questions_per_lesson).toBe(20)
  })

  it('covers exactly the ten known pedagogy lesson slugs with source attribution', () => {
    const expected = [
      'pedagogika-fan-sifatida-tadqiqot-metodlari',
      'inklyuziv-talim-asoslari-va-moslashtirish',
      'korreksion-pedagogika-mutaxassislik-yonalishlari',
      'baholash-nazariyasi-38-savol-takrorlash',
      'pedagogik-refleksiya-va-kasbiy-tashxis',
      'pedagogik-mahorat-tort-komponent-va-kasbiy-rivojlanish',
      'baholash-nazariyasi-distraktor-va-test-sifati',
      'moslashtirish-va-ketma-ketlik-topshiriqlari-aniqligi',
      'pedagogik-kreativlik-sifatlari-va-kompetentlik',
      'oqituvchi-nutqining-yetti-kommunikativ-sifati',
    ]
    expect(manifest.lessons.map(l => l.slug)).toEqual(expected)
    expect(manifest.lessons.map(l => l.order_idx)).toEqual(
      Array.from({ length: 10 }, (_, i) => 108 + i),
    )
    for (const lesson of manifest.lessons) {
      expect(lesson.source_locator.length).toBeGreaterThan(12)
      expect(lesson.approval_status).toBe('requires_independent_editorial_review')
    }
  })

  it('has 40 distinct, lesson-specific, unapproved objectives without question keys', () => {
    const objectives = manifest.lessons.flatMap(l => l.proposed_objectives)
    expect(objectives).toHaveLength(40)
    expect(new Set(objectives.map(o => o.draft_id)).size).toBe(40)
    for (const objective of objectives) {
      expect(objective.objective.trim().length).toBeGreaterThan(55)
      expect(objective.requires_page_level_source_verification).toBe(true)
      expect(Object.keys(objective).sort()).toEqual(
        ['draft_id', 'objective', 'requires_page_level_source_verification'].sort(),
      )
    }
  })
})
