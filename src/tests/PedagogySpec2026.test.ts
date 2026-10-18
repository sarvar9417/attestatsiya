import { describe, expect, it } from 'vitest'
import { MODULES } from '../data/contentTree'
import { PEDAGOGY_SPEC_OBJECTIVES } from '../data/pedagogySpec2026'
import { getTopicContent } from '../data/topicContent'

describe('official 2026 professional and pedagogy competence matrix', () => {
  it('covers every existing M14–M16 topic exactly once, without inventing official per-topic quotas', () => {
    const actualTopicIds = MODULES
      .filter(module => ['M14', 'M15', 'M16'].includes(module.id))
      .flatMap(module => module.subtopics.map(topic => topic.id))
      .sort()
    const mappedTopicIds = Object.keys(PEDAGOGY_SPEC_OBJECTIVES).sort()
    expect(mappedTopicIds).toEqual(actualTopicIds)
    expect(actualTopicIds).toHaveLength(18)
    expect(new Set(actualTopicIds).size).toBe(18)
    for (const id of actualTopicIds) {
      const row = PEDAGOGY_SPEC_OBJECTIVES[id]
      expect(row.skill.trim().length).toBeGreaterThan(22)
      expect(row.sourcePage).toBe(id.startsWith('M14') ? 6 : 7)
      expect(row.group).toBe(id.startsWith('M14') ? 'KS' : id.startsWith('M15') ? 'PM.GEN' : 'PM.MET')
      expect(getTopicContent(id)?.theory.length).toBeGreaterThan(0)
    }
  })

  it('matches 7 KS, 8 PM.GEN and 3 PM.MET curriculum topics without equating them to exam counts', () => {
    const counts: Record<string, number> = {}
    for (const row of Object.values(PEDAGOGY_SPEC_OBJECTIVES)) {
      counts[row.group] = (counts[row.group] ?? 0) + 1
    }
    expect(counts).toEqual({ KS: 7, 'PM.GEN': 8, 'PM.MET': 3 })
  })
})
