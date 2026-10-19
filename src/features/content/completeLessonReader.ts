import type { TheoryBlock, TopicContent } from '../../data/topicContent'
import { getPedagogyStudyNotes } from '../../data/pedagogyStudyNotes'
import { verifiedM02Supplement } from './professionalLessonTheory'

/** Assemble existing learner material without changing published records or quiz keys. */
export function completeLessonReader(
  local: TopicContent | undefined,
  published: TopicContent | null,
): TopicContent | undefined {
  const base = local ?? published
  if (!base) return undefined
  const id = base.subtopicId
  const curated = /^M(?:02|15)\./.test(id)
  const primary = curated ? base : published ?? base
  const theory = [...primary.theory]
  // Remove only exact duplicate blocks between sources, never within a source.
  const append = (blocks: TheoryBlock[], title?: string) => {
    const existing = new Set(theory.map(block => JSON.stringify(block)))
    const additional = blocks.filter(block => !existing.has(JSON.stringify(block)))
    if (!additional.length) return
    if (title) theory.push({ type: 'heading', content: title })
    theory.push(...additional)
  }

  if (/^M15\./.test(id)) {
    append(getPedagogyStudyNotes(id))
  } else if (/^M02\./.test(id)) {
    // Unmarked old DB summaries must not replace the verified M02 book.
    append(verifiedM02Supplement(published))
  }
  append(primary.supplementalTheory ?? [], 'Chuqurlashtirilgan nazariya')
  if (curated && published !== primary) {
    append(published?.supplementalTheory ?? [], 'Chuqurlashtirilgan nazariya')
  }
  return { ...primary, theory, supplementalTheory: undefined, questions: base.questions }
}
