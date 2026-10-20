import type { TheoryBlock, TheoryBlockType } from '../topicContent'

export interface SourceCompleteSection {
  title: string
  explanation: string
  example: string
  trap: string
  task: string
  exampleType?: Extract<TheoryBlockType, 'example' | 'solved' | 'case'>
}

export interface SourceCompleteBookSpec {
  goal: string
  intro: string
  keywords: string[]
  sections: SourceCompleteSection[]
  answers: string
  summary: string
  sources: string[]
}

/**
 * Shared editorial contract for source-complete learner books.
 *
 * The factory standardises structure only. Every explanatory sentence,
 * worked example, exercise and answer remains explicitly authored in the
 * module specification, so a generic frame cannot manufacture content or
 * hide a missing source review.
 */
export function buildSourceCompleteBook(spec: SourceCompleteBookSpec): TheoryBlock[] {
  const blocks: TheoryBlock[] = [
    { type: 'goal', content: spec.goal },
    { type: 'intro', content: spec.intro },
    { type: 'keywords', content: spec.keywords.join(' • ') },
  ]

  spec.sections.forEach((section, index) => {
    blocks.push(
      { type: 'heading', content: `${index + 1}. ${section.title}` },
      { type: 'definition', content: section.explanation },
      { type: section.exampleType ?? 'solved', content: section.example },
      { type: 'trap', content: section.trap },
      { type: 'task', content: `${index + 1}-mashq. ${section.task}` },
    )
  })

  blocks.push(
    { type: 'answers', content: spec.answers },
    { type: 'summary', content: spec.summary },
    ...spec.sources.map(content => ({ type: 'source' as const, content })),
  )
  return blocks
}
