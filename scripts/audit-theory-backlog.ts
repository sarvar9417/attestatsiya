/**
 * Editorial backlog for all OFFLINE lesson chapters, not remote/UUID content.
 * Independent from the decorative BookReader UI and independent of any claim
 * that a PDF has been checked page by page. Run:
 *   npx tsx scripts/audit-theory-backlog.ts --json
 */
import { getTopicContent } from '../src/data/topicContent'
import { inspectOfflineTheory, type TheoryDepthRow } from './audit-theory-depth'

export type TheoryGap =
  | 'no_source_trace' | 'no_heading' | 'no_goal' | 'no_worked_example'
  | 'no_independent_exercise' | 'short_chapter' | 'no_exercise_answers'

export interface TheoryBacklogItem extends TheoryDepthRow {
  gaps: TheoryGap[]
  gapCount: number
  reviewPriority: 'critical' | 'high' | 'medium' | 'review_only'
}

export interface TheoryModuleBacklog {
  moduleId: string
  topicCount: number
  critical: number
  high: number
  medium: number
  reviewOnly: number
  missingSource: number
  missingExercise: number
  missingAnswers: number
}

const hasExerciseAnswers = (id: string) =>
  getTopicContent(id)?.theory.some(block => block.type === 'answers') ?? false

export function inspectTheoryBacklog(): {
  scope: string
  textbookPageVerification: 'not_performed'
  topics: TheoryBacklogItem[]
  modules: TheoryModuleBacklog[]
} {
  const { rows } = inspectOfflineTheory()
  const topics = rows.map(row => {
    const gaps: TheoryGap[] = []
    if (row.sourceTraces === 0) gaps.push('no_source_trace')
    if (row.sections === 0) gaps.push('no_heading')
    if (row.goals === 0) gaps.push('no_goal')
    if (row.examplesAndSolutions === 0) gaps.push('no_worked_example')
    if (row.exercises === 0) gaps.push('no_independent_exercise')
    if (row.depthTriage === 'brief') gaps.push('short_chapter')
    if (row.exercises > 0 && !hasExerciseAnswers(row.subtopicId)) gaps.push('no_exercise_answers')

    const reviewPriority: TheoryBacklogItem['reviewPriority'] =
      gaps.includes('no_source_trace') || (gaps.includes('short_chapter') && gaps.length >= 3)
        ? 'critical'
        : gaps.includes('short_chapter') || gaps.length >= 3
          ? 'high'
          : gaps.length >= 1
            ? 'medium'
            : 'review_only'
    return { ...row, gaps, gapCount: gaps.length, reviewPriority }
  })

  const priorities = { critical: 0, high: 1, medium: 2, review_only: 3 } as const
  topics.sort((a, b) =>
    priorities[a.reviewPriority] - priorities[b.reviewPriority]
    || b.gapCount - a.gapCount
    || a.percentOfM0102 - b.percentOfM0102
    || a.subtopicId.localeCompare(b.subtopicId),
  )

  const moduleIds = [...new Set(topics.map(t => t.subtopicId.split('.')[0]))].sort()
  const modules = moduleIds.map(moduleId => {
    const group = topics.filter(t => t.subtopicId.startsWith(moduleId + '.'))
    return {
      moduleId,
      topicCount: group.length,
      critical: group.filter(t => t.reviewPriority === 'critical').length,
      high: group.filter(t => t.reviewPriority === 'high').length,
      medium: group.filter(t => t.reviewPriority === 'medium').length,
      reviewOnly: group.filter(t => t.reviewPriority === 'review_only').length,
      missingSource: group.filter(t => t.gaps.includes('no_source_trace')).length,
      missingExercise: group.filter(t => t.gaps.includes('no_independent_exercise')).length,
      missingAnswers: group.filter(t => t.gaps.includes('no_exercise_answers')).length,
    }
  })

  return {
    scope: 'offline static/canonical chapters only; server UUID/published lesson depths excluded',
    textbookPageVerification: 'not_performed',
    topics,
    modules,
  }
}

if (process.argv[1]?.endsWith('audit-theory-backlog.ts')) {
  const result = inspectTheoryBacklog()
  if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2))
  else {
    console.log(result.scope)
    console.log('No textbook has been verified page by page by this script.')
    console.table(result.modules)
    console.table(result.topics.slice(0, 30).map(t => ({
      topic: t.subtopicId,
      title: t.title,
      priority: t.reviewPriority,
      gaps: t.gaps.join(', '),
      percentOfBenchmark: t.percentOfM0102,
    })))
  }
}
