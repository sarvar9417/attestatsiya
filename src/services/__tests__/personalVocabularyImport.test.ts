import { describe, expect, it } from 'vitest'
import { importPersonalVocabulary } from '../personalVocabularyService'

describe('importPersonalVocabulary', () => {
  it('filters empty rows and normalizes unsupported enum values', () => {
    const rows = importPersonalVocabulary(JSON.stringify([
      { english: 'cat', uzbek: 'mushuk', level: 'C2', category: 'unknown', part_of_speech: 'invalid' },
      { english: '', uzbek: 'bo‘sh' },
    ]))

    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      english: 'cat',
      uzbek: 'mushuk',
      level: 'A2',
      category: 'custom',
      source: 'imported',
    })
    expect(rows[0].part_of_speech).toBeUndefined()
  })

  it('rejects malformed and non-array JSON', () => {
    expect(importPersonalVocabulary('{')).toEqual([])
    expect(importPersonalVocabulary('{"english":"cat"}')).toEqual([])
  })
})
