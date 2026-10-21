import { describe, expect, it } from 'vitest'
import {
  isCompleteOneToOneMatching,
  isRightChoiceUsedByAnotherPair,
} from '../lib/exam/matching'

const pairs = [
  { leftId: 'a', rightContent: '101' },
  { leftId: 'b', rightContent: '111' },
  { leftId: 'c', rightContent: '001' },
]

describe('Y2 one-to-one matching quality gate', () => {
  it('accepts every right option used exactly once, including a changed order', () => {
    expect(isCompleteOneToOneMatching(pairs, { a: '001', b: '101', c: '111' })).toBe(true)
  })

  it('rejects blank and missing entries before the learner can submit', () => {
    expect(isCompleteOneToOneMatching(pairs, { a: '101', b: '', c: '001' })).toBe(false)
    expect(isCompleteOneToOneMatching(pairs, { a: '101', c: '001' })).toBe(false)
    expect(isCompleteOneToOneMatching(pairs, {})).toBe(false)
  })

  it('rejects reused rights, unknown choices and stale left IDs', () => {
    expect(isCompleteOneToOneMatching(pairs, { a: '101', b: '101', c: '001' })).toBe(false)
    expect(isCompleteOneToOneMatching(pairs, { a: '101', b: '111', c: 'xyz' })).toBe(false)
    expect(isCompleteOneToOneMatching(pairs, { a: '101', b: '111', c: '001', old: '001' })).toBe(false)
  })

  it('fails closed on invalid source pairing and untrusted response shapes', () => {
    expect(isCompleteOneToOneMatching([], {})).toBe(false)
    expect(isCompleteOneToOneMatching(
      [{ leftId: 'a', rightContent: 'X' }, { leftId: 'b', rightContent: 'X' }],
      { a: 'X', b: 'X' },
    )).toBe(false)
    expect(isCompleteOneToOneMatching(pairs, ['101', '111', '001'])).toBe(false)
    expect(isCompleteOneToOneMatching(pairs, null)).toBe(false)
  })

  it('reserves only rights chosen by another left item', () => {
    const selected = { a: '101', b: '111' }
    expect(isRightChoiceUsedByAnotherPair(selected, 'a', '101')).toBe(false)
    expect(isRightChoiceUsedByAnotherPair(selected, 'b', '101')).toBe(true)
    expect(isRightChoiceUsedByAnotherPair(selected, 'c', '111')).toBe(true)
    expect(isRightChoiceUsedByAnotherPair(undefined, 'a', '101')).toBe(false)
  })
  it('handles the native 4x4 pool without reusing right choices', () => {
    const fourPairs = [
      ...pairs,
      { leftId: 'd', rightContent: '010' },
    ]
    expect(isCompleteOneToOneMatching(fourPairs, {
      a: '010', b: '001', c: '111', d: '101',
    })).toBe(true)
    expect(isCompleteOneToOneMatching(fourPairs, {
      a: '101', b: '111', c: '001', d: '001',
    })).toBe(false)
  })

})
