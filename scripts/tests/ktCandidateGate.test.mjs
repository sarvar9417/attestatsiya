import test from 'node:test'
import assert from 'node:assert/strict'
import { assessCandidates } from '../qa/ktCandidateGate.mjs'

const valid = {
  external_id: 'KT-01-001', options: ['one', 'two', 'three', 'four'], correct_letter: 'A',
  construct_codes: 'S2.HW.01', review_state: 'approved_for_import',
  source_verified: true, expert_verified: true, editor_approved: true,
  key_unique_verified: true, distractors_verified: true,
  evidence_book_code: 'I10', evidence_pdf_page: 26,
  evidence_excerpt: 'Verified extract of at least thirty characters from the actual textbook page.',
  reviewer_key_rationale: 'The source precisely explains the selected correct option.',
  reviewer_distractor_rationale: 'Each alternative is independently verified to be false.',
  qa_flags: [],
}
test('valid verified candidate passes', () => assert.equal(assessCandidates([valid], 1).ready, true))
test('unpublished item is rejected', () => {
  assert.ok(assessCandidates([{ ...valid, review_state: 'held' }], 1).issues.includes('KT-01-001:not_approved'))
})
test('precise source evidence is mandatory', () => {
  assert.ok(assessCandidates([{ ...valid, evidence_excerpt: '' }], 1).issues.includes('KT-01-001:precise_source_missing'))
})
test('unresolved QA warnings block release', () => {
  assert.ok(assessCandidates([{ ...valid, qa_flags: ['vague_distractor'] }], 1).issues.includes('KT-01-001:unresolved_qa_flags'))
})
test('duplicate IDs block release', () => {
  assert.ok(assessCandidates([valid, valid], 2).issues.includes('KT-01-001:duplicate_id'))
})
