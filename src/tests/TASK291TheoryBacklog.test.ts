import { describe, expect, it } from 'vitest'
import { inspectTheoryBacklog } from '../../scripts/audit-theory-backlog'
import { inspectOfflineTheory } from '../../scripts/audit-theory-depth'

describe('TASK-291: actionable source-first theory backlog', () => {
  const audit = inspectTheoryBacklog()
  const expected = inspectOfflineTheory()
  const byId = Object.fromEntries(audit.topics.map(x => [x.subtopicId, x]))
  const order = { critical: 0, high: 1, medium: 2, review_only: 3 }

  it('covers every static topic exactly once and does not claim textbook verification', () => {
    expect(audit.topics.length).toBe(expected.rows.length)
    expect(audit.topics.length).toBeGreaterThan(70)
    expect(new Set(audit.topics.map(x => x.subtopicId)).size).toBe(audit.topics.length)
    expect(audit.textbookPageVerification).toBe('not_performed')
    expect(audit.scope).toContain('server UUID/published lesson depths excluded')
    expect(audit.topics.every(x => x.pageVerification === 'unverified')).toBe(true)
  })

  it('produces a deterministic editorial priority queue with missing-source and activity signals', () => {
    expect(audit.topics.length).toBeGreaterThan(0)
    for (const x of audit.topics) {
      expect(x.gapCount).toBe(x.gaps.length)
      expect(new Set(x.gaps).size).toBe(x.gaps.length)
      if (x.sourceTraces === 0) expect(x.gaps).toContain('no_source_trace')
      if (x.goals === 0) expect(x.gaps).toContain('no_goal')
      if (x.exercises === 0) expect(x.gaps).toContain('no_independent_exercise')
      if (x.depthTriage === 'brief') expect(x.gaps).toContain('short_chapter')
    }
    for (let i = 1; i < audit.topics.length; i++) {
      expect(order[audit.topics[i - 1].reviewPriority]).toBeLessThanOrEqual(
        order[audit.topics[i].reviewPriority],
      )
    }
  })

  it('module totals agree with topic-level priorities and expose unfinished review obligations', () => {
    expect(audit.modules.length).toBeGreaterThan(10)
    expect(audit.modules.reduce((sum, x) => sum + x.topicCount, 0)).toBe(audit.topics.length)
    for (const module of audit.modules) {
      const group = audit.topics.filter(t => t.subtopicId.startsWith(module.moduleId + '.'))
      expect(module.critical + module.high + module.medium + module.reviewOnly).toBe(group.length)
      expect(module.missingSource).toBe(group.filter(t => t.gaps.includes('no_source_trace')).length)
      expect(module.missingExercise).toBe(group.filter(t => t.gaps.includes('no_independent_exercise')).length)
      expect(module.missingAnswers).toBe(group.filter(t => t.gaps.includes('no_exercise_answers')).length)
    }
  })

  it('keeps prior M03/M15 chapters visible without calling them page-verified', () => {
    for (const id of ['M03.01', 'M03.04', 'M03.05', 'M03.06', 'M15.01', 'M15.02', 'M15.04']) {
      expect(byId[id], id).toBeDefined()
      expect(byId[id].sourceTraces, id).toBeGreaterThan(0)
      expect(byId[id].pageVerification, id).toBe('unverified')
    }
  })
})
