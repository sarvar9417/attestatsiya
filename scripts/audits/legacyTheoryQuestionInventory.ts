/**
 * Non-destructive recovery inventory for 23 legacy chapters which have theory
 * and locally authored practice but no independently published server test.
 *
 * This reads the bundled offline corpus only. It intentionally does NOT
 * return question stems, alternatives, keys or explanations and cannot
 * publish or score anything. A local answer key is never publication evidence.
 */
import { getTopicContent } from '../../src/data/topicContent'
import { THEORY_ONLY_LEGACY_TOPIC_CODES } from '../../backend/src/lib/theoryOnlyLegacyTopicCodes'

export interface TheoryOnlyQuestionAuditRow {
  topicId: string
  title: string
  staticSource: string
  theoryBlocks: number
  localPracticeItems: number
  uniqueStems: number
  duplicateStems: number
  malformedChoiceItems: number
  fourChoiceItems: number
  highAnswerLengthImbalance: number
  correctOptionLongestHeuristics: number
  y2y3PracticeItems: number
  provenance: 'local_static_unreviewed'
  scoredServerPoolReady: false
}

const norm = (s: string) => s.toLocaleLowerCase().replace(/\s+/g, ' ').trim()

export function auditTheoryOnlyLegacyQuestions() {
  const rows: TheoryOnlyQuestionAuditRow[] = THEORY_ONLY_LEGACY_TOPIC_CODES.map(topicId => {
    const topic = getTopicContent(topicId)
    if (!topic || !topic.theory.length) {
      throw new Error(`Static learning theory is absent for ${topicId}; cannot claim it exists`)
    }
    const questions = topic.questions ?? []
    const keys = new Set<string>()
    let duplicateStems = 0
    let malformedChoiceItems = 0
    let fourChoiceItems = 0
    let highAnswerLengthImbalance = 0
    let correctOptionLongestHeuristics = 0
    let y2y3PracticeItems = 0

    for (const q of questions) {
      const normalized = norm(q.text)
      if (keys.has(normalized)) duplicateStems++
      keys.add(normalized)
      if (q.cognitiveLevel === 'Y2' || q.cognitiveLevel === 'Y3' ||
        q.type === 'Y2' || q.type === 'Y3') y2y3PracticeItems++

      const four = q.options.length === 4 &&
        q.options.every(o => o.trim().length > 0) &&
        Number.isInteger(q.correctIndex) &&
        q.correctIndex >= 0 && q.correctIndex < 4
      if (!four) { malformedChoiceItems++; continue }
      fourChoiceItems++
      const lengths = q.options.map(o => o.trim().length)
      const maxLength = Math.max(...lengths)
      const minLength = Math.min(...lengths)
      if (maxLength / minLength > 1.35) highAnswerLengthImbalance++
      if (lengths[q.correctIndex] === maxLength &&
          lengths.filter(x => x === maxLength).length === 1) {
        correctOptionLongestHeuristics++
      }
    }

    return {
      topicId,
      title: topic.title,
      staticSource: topic.source ?? 'offline theory / source attribution to verify',
      theoryBlocks: topic.theory.length,
      localPracticeItems: questions.length,
      uniqueStems: keys.size,
      duplicateStems,
      malformedChoiceItems,
      fourChoiceItems,
      highAnswerLengthImbalance,
      correctOptionLongestHeuristics,
      y2y3PracticeItems,
      provenance: 'local_static_unreviewed' as const,
      scoredServerPoolReady: false as const,
    }
  })
  const totals = rows.reduce((o, row) => ({
    localPracticeItems: o.localPracticeItems + row.localPracticeItems,
    duplicateStems: o.duplicateStems + row.duplicateStems,
    malformedChoiceItems: o.malformedChoiceItems + row.malformedChoiceItems,
    fourChoiceItems: o.fourChoiceItems + row.fourChoiceItems,
    highAnswerLengthImbalance: o.highAnswerLengthImbalance + row.highAnswerLengthImbalance,
    correctOptionLongestHeuristics: o.correctOptionLongestHeuristics + row.correctOptionLongestHeuristics,
  }), {
    localPracticeItems: 0, duplicateStems: 0, malformedChoiceItems: 0,
    fourChoiceItems: 0, highAnswerLengthImbalance: 0, correctOptionLongestHeuristics: 0,
  })
  return {
    status: 'editorial_candidate_inventory_only' as const,
    serverPublicationAuthorized: false as const,
    uniqueChapterCount: rows.length,
    totals, rows,
  }
}

if (process.argv[1]?.endsWith('legacyTheoryQuestionInventory.ts')) {
  // Summary only. No stems, options, explanations or correctIndex are emitted.
  console.log(JSON.stringify(auditTheoryOnlyLegacyQuestions(), null, 2))
}
