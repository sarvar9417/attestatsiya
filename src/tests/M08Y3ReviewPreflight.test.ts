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
  source_evidence: [
    { file: 'Informatika Testlar spesifikatsiyasi.pdf', pdf_page_1_based: 4,
      supported_skill: 'JavaScript constructs and arrays',
      evidence_level: 'topic_and_syntax_not_verbatim_source' },
    { file: '10-11-sinf informatika (Cambridge +)(1).pdf', pdf_page_1_based: 322,
      supported_skill: 'JavaScript conditions and arrays',
      evidence_level: 'topic_and_syntax_not_verbatim_source' },
  ],
}

const fresh = () => structuredClone(baseline)

describe('M08 private Y3 review-only candidate preflight', () => {
  it('accepts a structurally valid JavaScript review candidate', () => {
    expect(validateM08Y3ReviewCandidate(fresh())).toEqual([])
  })

  it('accepts a Python candidate with the corresponding reference prefix', () => {
    const item = fresh()
    item.previous_source_reference = 'pyjs-2026-v2:P06-023'
    item.source_evidence[1].file = 'ICT 10_sinf-2021(1).pdf'
    item.source_evidence[1].pdf_page_1_based = 111
    item.source_evidence[0].supported_skill = 'Python condition and list constructs'
    item.source_evidence[1].supported_skill = 'Python lists and for loops'
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

  it('rejects candidates lacking verified source-topic metadata', () => {
    const item = fresh()
    item.source_evidence = []
    const errors = validateM08Y3ReviewCandidate(item)
    expect(errors).toContain('specification_and_textbook_evidence_required')
    expect(errors).toContain('missing_2026_specification_reference')
    expect(errors).toContain('missing_language_appropriate_textbook_reference')
  })

  it('rejects invented or out-of-range PDF page references', () => {
    const item = fresh()
    item.source_evidence[1].pdf_page_1_based = 4000
    const errors = validateM08Y3ReviewCandidate(item)
    expect(errors).toContain('invalid_source_pdf_page_or_file')
    expect(errors).toContain('missing_language_appropriate_textbook_reference')
  })

  it('requires a textbook for the actual candidate language', () => {
    const item = fresh()
    item.source_evidence[1].file = 'ICT 9_sinf-2020(1).pdf'
    item.source_evidence[1].pdf_page_1_based = 80
    expect(validateM08Y3ReviewCandidate(item)).toContain(
      'missing_language_appropriate_textbook_reference',
    )
  })

  it('will not treat an unsupported verbatim-source claim as evidence', () => {
    const item = fresh()
    item.source_evidence[1].evidence_level = 'verbatim_question_from_official_exam'
    expect(validateM08Y3ReviewCandidate(item)).toContain(
      'unqualified_or_unsupported_source_evidence',
    )
  })

  it('rejects a fake specification page even with a real textbook', () => {
    const item = fresh()
    item.source_evidence[0].pdf_page_1_based = 5
    expect(validateM08Y3ReviewCandidate(item)).toContain(
      'missing_2026_specification_reference',
    )
  })


  it('rejects inherited-object-property names as fake PDF sources', () => {
    const item = fresh()
    item.source_evidence[1].file = 'toString'
    expect(validateM08Y3ReviewCandidate(item)).toContain(
      'invalid_source_pdf_page_or_file',
    )
  })

})
