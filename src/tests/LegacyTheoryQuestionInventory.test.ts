import { describe, it, expect } from 'vitest'
import { auditTheoryOnlyLegacyQuestions } from '../../scripts/audits/legacyTheoryQuestionInventory'
import { THEORY_ONLY_LEGACY_TOPIC_CODES } from '../../backend/src/lib/theoryOnlyLegacyTopicCodes'

describe('legacy static practice recovery inventory (not server-scored)', () => {
  const audit = auditTheoryOnlyLegacyQuestions()

  it('covers the 23 known theory-only chapters with nonempty theory', () => {
    expect(audit.status).toBe('editorial_candidate_inventory_only')
    expect(audit.serverPublicationAuthorized).toBe(false)
    expect(audit.uniqueChapterCount).toBe(23)
    expect(new Set(audit.rows.map(r => r.topicId)).size).toBe(23)
    expect(audit.rows.map(r => r.topicId)).toEqual([...THEORY_ONLY_LEGACY_TOPIC_CODES])
    for (const row of audit.rows) {
      expect(row.theoryBlocks).toBeGreaterThan(0)
      expect(row.title.length).toBeGreaterThan(5)
      expect(row.provenance).toBe('local_static_unreviewed')
      expect(row.scoredServerPoolReady).toBe(false)
    }
  })

  it('counts all candidates and flags without exposing stems, options or keys', () => {
    expect(audit.totals.localPracticeItems).toBe(audit.rows.reduce((n, x) => n + x.localPracticeItems, 0))
    expect(audit.totals.fourChoiceItems).toBe(audit.rows.reduce((n, x) => n + x.fourChoiceItems, 0))
    for (const row of audit.rows) {
      expect(row.duplicateStems).toBeLessThanOrEqual(row.localPracticeItems)
      expect(row.malformedChoiceItems + row.fourChoiceItems).toBe(row.localPracticeItems)
      expect(row.highAnswerLengthImbalance).toBeLessThanOrEqual(row.fourChoiceItems)
      expect(row.correctOptionLongestHeuristics).toBeLessThanOrEqual(row.fourChoiceItems)
    }
    const report = JSON.stringify(audit)
    expect(report).not.toMatch(/"correctIndex"|"explanation"|"question_keys"|"options"|"stem_md"/)
  })
})
