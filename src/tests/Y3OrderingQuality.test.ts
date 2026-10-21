import { describe, expect, it } from 'vitest'
import { isCompleteOrdering } from '../lib/exam/ordering'

const three = [{ id: 's1' }, { id: 's2' }, { id: 's3' }]
const four = [...three, { id: 's4' }]

describe('Y3 ordering / permutation quality gate', () => {
  it('accepts any complete unique ordering for 3x3 and 4x4 source items', () => {
    expect(isCompleteOrdering(three, ['s3', 's1', 's2'])).toBe(true)
    expect(isCompleteOrdering(four, ['s4', 's2', 's1', 's3'])).toBe(true)
  })

  it('rejects same-length answers with duplicate, foreign or missing IDs', () => {
    expect(isCompleteOrdering(three, ['s1', 's1', 's3'])).toBe(false)
    expect(isCompleteOrdering(three, ['s1', 's2', 'stale'])).toBe(false)
    expect(isCompleteOrdering(three, ['s1', 's2'])).toBe(false)
    expect(isCompleteOrdering(three, ['s1', 's2', 's3', 'extra'])).toBe(false)
    expect(isCompleteOrdering(three, ['', 's2', 's3'])).toBe(false)
  })

  it('fails closed on invalid question definitions or untrusted input', () => {
    expect(isCompleteOrdering([], [])).toBe(false)
    expect(isCompleteOrdering([{ id: 'a' }, { id: 'a' }], ['a', 'a'])).toBe(false)
    expect(isCompleteOrdering([{ id: 'a' }, { id: '' }], ['a', ''])).toBe(false)
    expect(isCompleteOrdering(three, 's1,s2,s3')).toBe(false)
    expect(isCompleteOrdering(three, null)).toBe(false)
    expect(isCompleteOrdering(three, { 0: 's1', 1: 's2', 2: 's3' })).toBe(false)
  })
})
