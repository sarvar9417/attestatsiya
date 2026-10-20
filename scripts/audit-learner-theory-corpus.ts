/**
 * TASK-344 learner-visible theory QA.
 *
 * Unlike the legacy backlog, this audit follows contentTree exactly, excludes
 * hidden M02 migration records and reports reference appendices separately.
 */
import { MODULES } from '../src/data/contentTree'
import { getTopicContent, type TheoryBlock } from '../src/data/topicContent'
import { withPedagogyStudyNotes } from '../src/data/pedagogyStudyNotes'

const richTypes = new Set<TheoryBlock['type']>(['example', 'solved', 'case'])

export interface LearnerTheoryRow {
  id: string
  moduleId: string
  title: string
  kind: 'chapter' | 'appendix'
  characters: number
  blocks: number
  headings: number
  richExamples: number
  tasks: number
  answers: number
  sources: number
  bookComplete: boolean
  gaps: string[]
}

export function inspectLearnerTheoryCorpus() {
  const rows: LearnerTheoryRow[] = []

  for (const module of MODULES) {
    for (const subtopic of module.subtopics) {
      const topic = getTopicContent(subtopic.id)
      if (!topic) throw new Error(`Learner topic is missing: ${subtopic.id}`)
      const theory = subtopic.id.startsWith('M15.')
        ? withPedagogyStudyNotes(topic).theory
        : topic.theory
      const kind = topic.kind ?? 'chapter'
      const headings = theory.filter(block => block.type === 'heading').length
      const richExamples = theory.filter(block => richTypes.has(block.type)).length
      const tasks = theory.filter(block => block.type === 'task').length
      const answers = theory.filter(block => block.type === 'answers').length
      const sources = theory.filter(block => block.type === 'source').length
      const characters = theory.reduce((sum, block) => sum + block.content.length, 0)
      const selfStudyBook = headings >= 5 && richExamples >= 2 && tasks >= 1 && answers >= 1 && sources >= 1
      // M01.02–08 are generated source monographs with richer embedded tables,
      // formula sets and diagnostics. They remain valid books without being
      // duplicated by the newer task/answer scaffold.
      const sourceMonograph = subtopic.id.startsWith('M01.')
        && headings >= 6 && richExamples >= 1 && sources >= 1 && characters >= 4_000
      const bookComplete = kind === 'chapter' && (selfStudyBook || sourceMonograph)
      const gaps = kind === 'appendix' || bookComplete ? [] : [
        headings < 5 ? 'fewer_than_five_sections' : '',
        richExamples < 2 ? 'fewer_than_two_examples' : '',
        tasks < 1 ? 'no_independent_task' : '',
        answers < 1 ? 'no_answer_key' : '',
        sources < 1 ? 'no_source_trace' : '',
      ].filter(Boolean)

      rows.push({
        id: subtopic.id,
        moduleId: module.id,
        title: topic.title,
        kind,
        characters,
        blocks: theory.length,
        headings,
        richExamples,
        tasks,
        answers,
        sources,
        bookComplete,
        gaps,
      })
    }
  }

  const chapters = rows.filter(row => row.kind === 'chapter')
  const appendices = rows.filter(row => row.kind === 'appendix')
  return {
    scope: 'contentTree learner-visible static/canonical corpus; remote UUID lessons excluded',
    contract: 'chapter: self-study book contract, or pre-existing M01 source-monograph contract; appendices reported separately',
    topicCount: rows.length,
    chapterCount: chapters.length,
    appendixCount: appendices.length,
    completeChapterCount: chapters.filter(row => row.bookComplete).length,
    incompleteChapterCount: chapters.filter(row => !row.bookComplete).length,
    rows,
  }
}

if (process.argv[1]?.endsWith('audit-learner-theory-corpus.ts')) {
  const audit = inspectLearnerTheoryCorpus()
  if (process.argv.includes('--json')) console.log(JSON.stringify(audit, null, 2))
  else {
    console.log(audit.scope)
    console.log(audit.contract)
    console.table({
      topics: audit.topicCount,
      chapters: audit.chapterCount,
      appendices: audit.appendixCount,
      complete: audit.completeChapterCount,
      incomplete: audit.incompleteChapterCount,
    })
    const gaps = audit.rows.filter(row => row.kind === 'chapter' && !row.bookComplete)
    if (gaps.length) console.table(gaps.map(row => ({ id: row.id, gaps: row.gaps.join(', ') })))
  }
}
