import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

describe('M16 primary methodology textbook crosswalk (2023)', () => {
  const topics = [
    ['M16.01', '173–175', '180–182', 'nima uchun'],
    ['M16.02', '45–46', '342–344', 'mashq'],
    ['M16.03', '94–95', '167', 'baholash'],
  ] as const

  it.each(topics)('%s cites its official textbook and specific electronic pages', (id, first, second, term) => {
    const theory = getTopicContent(id)?.theory ?? []
    const source = theory.find(block =>
      block.type === 'source' && block.content.includes('M.E. Mamarajabov')
    )
    expect(source?.content).toContain('D.E. Toshtemirov')
    expect(source?.content).toContain('O‘.A. Yuldashev')
    expect(source?.content).toContain('2023')
    expect(source?.content).toContain(first)
    expect(source?.content).toContain(second)
    expect(source?.content).toContain('0896d872-7672-4387-8ca0-b671b0f98b5d.pdf')
    const all = theory.map(x => x.content).join('\n').toLowerCase()
    expect(all).toContain(term.toLowerCase())
    expect(getTopicContent(id)?.questions).toEqual([])
  })

  it('keeps modern interpretations clearly separate from book answer keys', () => {
    const lessons = ['M16.01', 'M16.02', 'M16.03']
    for (const id of lessons) {
      const sources = getTopicContent(id)?.theory.filter(b => b.type === 'source').map(x => x.content).join('\n') ?? ''
      expect(sources).toContain('2023')
      expect(sources).toContain('Informatika o‘qitish metodikasi')
      expect(sources).toContain('spesifikatsiyasi.pdf')
    }
  })
})
