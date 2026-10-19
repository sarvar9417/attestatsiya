import { describe, expect, it } from 'vitest'
import { getTopicContent, type TopicContent } from '../data/topicContent'
import { M04_DEEP_CHAPTERS } from '../data/topics/m04DeepChapters'
import { overlayPublishedProfessionalLesson, resolveLearnerTheoryContent } from '../features/content/professionalLessonTheory'
import { splitSections } from '../components/learning/theory/BookReader'
import type { LessonSummary } from '../features/content/contentApi'

const published: LessonSummary = {
  id: '11111111-1111-4111-8111-111111111111',
  module_id: '22222222-2222-4222-8222-222222222222',
  title_uz: 'Mantiqiy amallar',
  slug: 'mantiqiy-amallar-va-ifodalar',
  body_mdx: '## Serverda e’lon qilingan nazariya\n\nMuallif tasdiqlagan oldingi material.\n\n| Amal | Natija |\n|---|---|\n| AND | Faqat ikkala rost |',
  blocks: null, blocks_kind: 'chapter',
  est_minutes: 20, order_idx: 2,
  status: 'published', constructs: [],
}

describe('TASK-285: real learner sees complete M04 after published request', () => {
  for (const id of Object.keys(M04_DEEP_CHAPTERS)) {
    it(`${id} keeps the full edited textbook chapter and ALL published MDX`, () => {
      const fallback = getTopicContent(id)!
      expect(fallback.source).toContain('TASK-285')
      const remote = overlayPublishedProfessionalLesson(fallback, published)
      const visible = resolveLearnerTheoryContent(id, fallback, remote)
      const book = M04_DEEP_CHAPTERS[id]
      expect(visible).toBe(remote)
      expect(remote.theory.slice(0, book.length)).toEqual(book)
      expect(remote.theory.some(b => b.content.includes('Muallif tasdiqlagan oldingi material'))).toBe(true)
      expect(remote.theory.some(b => b.type === 'table' && b.content.includes('AND'))).toBe(true)
      expect(remote.theory[book.length].type).toBe('heading')
      expect(splitSections(remote.theory).flatMap(x => x.blocks)).toEqual(remote.theory)
      expect(remote.source).toContain('TASK-285')
      expect(remote.questions).toBe(fallback.questions)
    })
  }

  it('does not append a deep book for arbitrary M04 remote-only draft or unrelated legacy content', () => {
    const fallback: TopicContent = {
      subtopicId: 'M04.02', title: 'Mock M04', theory: [{ type: 'text', content: 'Qisqa zaxira' }], questions: [],
    }
    const remote = overlayPublishedProfessionalLesson(fallback, published)
    expect(remote.theory[0]).toEqual({ type: 'heading', content: 'Serverda e’lon qilingan nazariya' })
    expect(remote.theory.some(x => x.type === 'goal')).toBe(false)
    expect(overlayPublishedProfessionalLesson(fallback, { ...published, status: 'draft' })).toBe(fallback)
    expect(overlayPublishedProfessionalLesson(fallback, { ...published, body_mdx: '' })).toBe(fallback)
  })
})
