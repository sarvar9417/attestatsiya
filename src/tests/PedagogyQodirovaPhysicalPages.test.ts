import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { getPedagogyStudyNotes } from '../data/pedagogyStudyNotes'

describe('M15.08 physical Qodirova–Pulatova source pages', () => {
  it('ties inclusive theory to visually checked textbook pages', () => {
    const blocks = getTopicContent('M15.08')?.theory ?? []
    const source = blocks.find(x => x.type === 'source' && x.content.includes('Qodirova'))
    expect(source?.content).toContain('fizik 6–13-sahifalari')
    expect(source?.content).toContain('8–11-sahifalarda')
    expect(source?.content).toContain('1J67WL90Qh6uULzmI7yYIR0OJ6diTg3cX')
    expect(getTopicContent('M15.08')?.questions).toEqual([])
  })

  it('marks textbook page provenance as visually verified, not a published answer key', () => {
    const notes = getPedagogyStudyNotes('M15.08').map(x => x.content).join('\n')
    expect(notes).toContain('fizik 8–11-betlar (vizual tasdiqlandi)')
    expect(notes).toContain('DOCX ikkilamchi konspekt')
  })
})
