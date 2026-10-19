import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

describe('M14 physically inspected teacher-standard PDF pages', () => {
  const loci = [
    ['M14.01', '2–3'],
    ['M14.02', '4–5'],
    ['M14.03', '6'],
    ['M14.04', '7–8'],
    ['M14.05', '9–10'],
    ['M14.06', '11'],
    ['M14.07', '12'],
  ] as const

  it.each(loci)('%s has its confirmed physical PDF-page locator', (id, pages) => {
    const lesson = getTopicContent(id)
    expect(lesson?.questions).toEqual([])
    const source = lesson?.theory.find(b => b.type === 'source' && b.content.includes('Kasb-standarti.pdf'))
    expect(source?.content).toContain(`fizik ${pages}-sahifalari`)
    expect(source?.content).toContain('amaldagi normativ-yuridik maqomi alohida tekshiriladi')
    expect(source?.content).toContain('1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq')
  })
})
