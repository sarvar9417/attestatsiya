import { describe, expect, it } from 'vitest'
import { getTopicContent, type TopicContent } from '../data/topicContent'
import { resolveLearnerTheoryContent, verifiedM16MethodologySummary } from '../features/content/professionalLessonTheory'

const published = (id: string): TopicContent => ({
  subtopicId: id,
  title: 'Backenddagi tasdiqlangan nazariya',
  theory: [{ type: 'text', content: 'E’lon qilingan server darsi' }],
  questions: [],
})

describe('published M16 canonical lesson and source-checked optional notes', () => {
  it.each(['M16.01', 'M16.02', 'M16.03'])('%s keeps server lesson primary but offers book-based tables on demand', id => {
    const staticContent = getTopicContent(id)
    expect(staticContent).toBeDefined()
    const live = published(id)
    expect(resolveLearnerTheoryContent(id, staticContent!, live)).toBe(live)
    const summary = verifiedM16MethodologySummary(id, staticContent, live)
    expect(summary.length).toBeGreaterThan(0)
    expect(summary.some(b => b.type === 'table')).toBe(true)
    expect(summary.some(b => b.type === 'example')).toBe(true)
    expect(summary.some(b => b.type === 'source' && b.content.includes('M.E. Mamarajabov'))).toBe(true)
    expect(summary.some(b => b.type === 'definition')).toBe(false)
    expect(staticContent?.questions).toEqual([])
  })

  it('avoids duplicate summary when only offline fallback is present', () => {
    const initial = getTopicContent('M16.01')
    expect(initial).toBeDefined()
    expect(resolveLearnerTheoryContent('M16.01', initial!, null)).toBe(initial)
    expect(verifiedM16MethodologySummary('M16.01', initial, null)).toEqual([])
    // The API adapter may return the exact static object for draft/empty lessons.
    expect(verifiedM16MethodologySummary('M16.01', initial, initial!)).toEqual([])
    expect(verifiedM16MethodologySummary('M16.01', initial, { ...initial!, theory: initial!.theory })).toEqual([])
  })

  it('rejects loading-state identity mismatches and avoids leaking another lesson', () => {
    const staticContent = getTopicContent('M16.01')
    expect(verifiedM16MethodologySummary('M16.01', staticContent, published('M16.02'))).toEqual([])
    expect(verifiedM16MethodologySummary('M16.02', staticContent, published('M16.02'))).toEqual([])
    expect(verifiedM16MethodologySummary('M14.03', getTopicContent('M14.03'), published('M14.03'))).toEqual([])
  })
})
