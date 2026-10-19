/**
 * TASK-284: benchmark learner-visible OFFLINE textbook depth against M01.02.
 * Metrics are editorial triage, not evidence that physical pages are covered.
 * Remote-only, authenticated and UUID lessons need separate live QA.
 */
import { getTopicContent, TOPIC_CONTENT, type TheoryBlock } from '../src/data/topicContent'
import { withPedagogyStudyNotes } from '../src/data/pedagogyStudyNotes'

export interface TheoryDepthRow {
  subtopicId: string
  title: string
  blocks: number
  characters: number
  sections: number
  examplesAndSolutions: number
  goals: number
  exercises: number
  sourceTraces: number
  percentOfM0102: number
  depthTriage: 'substantial_candidate' | 'partial' | 'brief'
  pageVerification: 'unverified'
}

const richExample = new Set(['example', 'solved', 'case'])
const characters = (blocks: TheoryBlock[]) => blocks.reduce((n, x) => n + x.content.length, 0)

export function inspectOfflineTheory(): { benchmarkChars: number; rows: TheoryDepthRow[] } {
  const benchmark = getTopicContent('M01.02')
  if (!benchmark) throw new Error('M01.02 benchmark is missing')
  const benchmarkChars = characters(benchmark.theory)
  if (benchmarkChars <= 0) throw new Error('M01.02 source is blank')

  const rows = Object.keys(TOPIC_CONTENT).sort().map(subtopicId => {
    const data = getTopicContent(subtopicId)!
    const theory = subtopicId.startsWith('M15.')
      ? withPedagogyStudyNotes(data).theory
      : data.theory
    const length = characters(theory)
    const sections = theory.filter(x => x.type === 'heading').length
    const examplesAndSolutions = theory.filter(x => richExample.has(x.type)).length
    const goals = theory.filter(x => x.type === 'goal').length
    const exercises = theory.filter(x => x.type === 'task').length
    const sourceTraces = theory.filter(x => x.type === 'source').length
    const percentOfM0102 = Math.round(100 * length / benchmarkChars)
    // A high score only marks editorial PRIORITY, not 100% textbook fidelity.
    const depthTriage = percentOfM0102 >= 75 && sections >= 6 && examplesAndSolutions >= 2
      ? 'substantial_candidate'
      : percentOfM0102 >= 35 && sections >= 3
        ? 'partial'
        : 'brief'
    return {
      subtopicId, title: data.title, blocks: theory.length, characters: length,
      sections, examplesAndSolutions, goals, exercises, sourceTraces,
      percentOfM0102, depthTriage,
      pageVerification: 'unverified' as const,
    }
  })
  return { benchmarkChars, rows }
}

const invoked = process.argv[1]?.replaceAll('\\', '/')?.endsWith('/audit-theory-depth.ts')
if (invoked) {
  const { benchmarkChars, rows } = inspectOfflineTheory()
  const counts = rows.reduce<Record<string, number>>((result, row) => {
    result[row.depthTriage] = (result[row.depthTriage] ?? 0) + 1
    return result
  }, {})
  const output = {
    benchmark: 'M01.02', benchmarkChars, topicCount: rows.length,
    counts, scope: 'static and offline canonical only',
    pageVerification: 'NOT PERFORMED', rows,
  }
  if (process.argv.includes('--json')) console.log(JSON.stringify(output, null, 2))
  else {
    console.log('M01.02 baseline:', benchmarkChars, 'characters')
    console.log('Offline topic count:', rows.length, 'depth triage:', counts)
    console.log('This is not a darslik full-coverage verification.')
    console.table(rows.map(({ subtopicId, blocks, characters, sections, percentOfM0102, depthTriage }) => ({
      subtopicId, blocks, characters, sections, percentOfM0102, depthTriage,
    })))
  }
}
