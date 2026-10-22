import { describe, expect, it } from 'vitest'
import {
  validateM08Y3ReviewCandidate,
  validateM08Y3ReviewBatch,
} from '../lib/content/m08Y3ReviewPreflight'

// Invented public fixtures only: never commit private questions/answer keys.
const baseline = {
  previous_source_reference: 'pyjs-2026-v2:J03-023',
  previous_question_id: '12345678-1234-4123-8123-123456789abc',
  format: 'Y3',
  group_code: 'S4.CODE',
  intent: 'review_only_immutable_replacement_candidate',
  publication_status: 'review_only_not_in_database',
  preserve_old_exam_items: true,
  independent_human_editorial_signoff: false,
  stem_md: 'Natijalarni aynan chiqish tartibida joylashtiring.\n\n' +
    '```javascript\nfor (const x of [2,3,4,5]) console.log(x);\n```',
  options: [
    { order_idx: 0, side: 'a', content_md: '3' },
    { order_idx: 1, side: 'a', content_md: '5' },
    { order_idx: 2, side: 'a', content_md: '2' },
    { order_idx: 3, side: 'a', content_md: '4' },
  ],
  correct_order_option_indices: [2, 0, 3, 1],
  explanation_md: 'The loop visits each element in source order and prints all four values.',
  source_context: 'New independently authored pedagogical example, not an official exam item.',
}

const fresh = () => structuredClone(baseline)

describe('M08 private Y3 review-only candidate preflight', () => {
  it('accepts a structurally valid JavaScript review candidate', () => {
    expect(validateM08Y3ReviewCandidate(fresh())).toEqual([])
  })

  it('accepts a Python candidate with the corresponding reference prefix', () => {
    const item = fresh()
    item.previous_source_reference = 'pyjs-2026-v2:P06-023'
    item.stem_md = 'Natijalarni chiqish tartibida joylashtiring.\n\n' +
      '```python\nfor x in [2,3,4,5]:\n    print(x)\n```'
    expect(validateM08Y3ReviewCandidate(item)).toEqual([])
  })

  it('rejects wrong source language and absent output', () => {
    const item = fresh()
    item.stem_md = 'Natijalarni chiqish tartibida joylashtiring.\n\n' +
      '```python\nfor x in [2,3,4,5]:\n    pass\n```'
    const errors = validateM08Y3ReviewCandidate(item)
    expect(errors).toContain('language_source_mismatch')
    expect(errors).toContain('no_output_statement')
  })

  it('rejects duplicate normalized visible options', () => {
    const item = fresh()
    item.options[0].content_md = '  2  '
    expect(validateM08Y3ReviewCandidate(item)).toContain('duplicate_output_option')
  })

  it('rejects a forged or partial Y3 answer order', () => {
    const item = fresh()
    item.correct_order_option_indices = [0, 1, 1, 3]
    expect(validateM08Y3ReviewCandidate(item)).toContain('answer_must_be_four_option_permutation')
  })

  it('rejects duplicated/noncanonical option indices', () => {
    const item = fresh()
    item.options[3].order_idx = 1
    expect(validateM08Y3ReviewCandidate(item)).toContain('option_indices_must_be_0_to_3')
  })

  it('prevents publication and invented human signoff', () => {
    const item = fresh()
    item.publication_status = 'published'
    item.independent_human_editorial_signoff = true
    item.preserve_old_exam_items = false
    const errors = validateM08Y3ReviewCandidate(item)
    expect(errors).toContain('cannot_claim_published_status')
    expect(errors).toContain('must_not_claim_unverified_human_review')
    expect(errors).toContain('historical_exam_items_must_be_preserved')
  })

  it('rejects missing history and source linkage', () => {
    const item = fresh()
    item.previous_question_id = 'not-a-uuid'
    item.previous_source_reference = 'unknown'
    const errors = validateM08Y3ReviewCandidate(item)
    expect(errors).toContain('invalid_previous_question_uuid')
    expect(errors).toContain('invalid_previous_source_reference')
  })

  it('blocks duplicate source references in a private review batch', () => {
    const result = validateM08Y3ReviewBatch({ items: [fresh(), fresh()] })
    expect(result.count).toBe(2)
    expect(result.failures).toEqual([
      { index: 1, codes: ['duplicate_previous_source_reference'] },
    ])
  })

  it('requires a nonempty batch, never accepts a missing payload', () => {
    expect(validateM08Y3ReviewBatch({ items: [] }).failures).toEqual([
      { index: -1, codes: ['nonempty_review_array_required'] },
    ])
  })
})
