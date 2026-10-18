import { describe, expect, it } from 'vitest'
import { MODULES } from '../data/contentTree'
import { getTopicContent, TOPIC_CONTENT, getSubtopicMeta } from '../data/topicContent'
import { M02_CANONICAL_GROUPS } from '../data/topics/m02Canonical'

describe('M02 source-backed canonical curriculum', () => {
  it('shows precisely four specification-aligned published learner topics', () => {
    const m02 = MODULES.find(module => module.id === 'M02')
    expect(m02?.subtopics.map(part => part.id)).toEqual([
      'M02.01', 'M02.02', 'M02.03', 'M02.04',
    ])
    expect(m02?.subtopics.map(part => part.title))
      .toEqual(M02_CANONICAL_GROUPS.map(group => group.title))
  })

  it('keeps all nine original source theory collections, without dropping theory blocks', () => {
    const legacyParts = M02_CANONICAL_GROUPS.flatMap(group => group.legacyParts)
    expect(legacyParts).toHaveLength(9)
    expect(new Set(legacyParts).size).toBe(9)
    for (const group of M02_CANONICAL_GROUPS) {
      const canonical = getTopicContent(group.id)
      const legacy = group.legacyParts.map(id => TOPIC_CONTENT[id])
      expect(canonical?.title).toBe(group.title)
      expect(legacy.every(Boolean)).toBe(true)
      expect(canonical?.theory.length).toBeGreaterThan(
        legacy.reduce((sum, part) => sum + part.theory.length, 0)
      )
      for (const part of legacy) {
        for (const block of part.theory) expect(canonical?.theory).toContain(block)
      }
    }
  })

  it('keeps all original offline questions, and ensures unique IDs', () => {
    for (const group of M02_CANONICAL_GROUPS) {
      const quiz = getTopicContent(group.id)?.questions ?? []
      const legacyIds = group.legacyParts.flatMap(id =>
        TOPIC_CONTENT[id]?.questions.map(q => q.id) ?? []
      )
      expect(new Set(quiz.map(q => q.id))).toEqual(new Set(legacyIds))
      expect(quiz.length).toBe(new Set(legacyIds).size)
      expect(getSubtopicMeta(group.id)?.questionCount).toBe(quiz.length)
    }
  })
  it('reuses the same M02 theory object across repeated reads', () => {
    for (const id of ['M02.01', 'M02.02', 'M02.03', 'M02.04']) {
      const first = getTopicContent(id)
      const second = getTopicContent(id)
      expect(first).toBeDefined()
      expect(first).toBe(second)
      expect(first?.theory.length).toBeGreaterThan(0)
    }
  })

})
