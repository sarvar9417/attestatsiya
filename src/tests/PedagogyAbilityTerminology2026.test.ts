import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

describe('M15.07 historical pedagogical ability terminology', () => {
  const theory = () => getTopicContent('M15.07')?.theory ?? []

  it('uses source-backed authority terminology, not an unexplained influence claim', () => {
    const text = theory().map(block => block.content).join('\n')
    expect(text).toContain('Avtoritar (tarixiy atama)')
    expect(text).toContain('hissiy-irodaviy ta’sir')
    expect(text).toContain('Kasbiy obro‘')
    expect(text).not.toContain("| Avtoritar | O'quvchilarga ta'sir o'tkazish |")
  })

  it('separates historical classification from coercion or discrimination', () => {
    const text = theory().map(block => block.content).join('\n')
    expect(text).toContain('qo‘rqitish, kamsitish yoki majburlashni oqlamaydi')
    expect(text).toContain('Pedagogik qobilyatlar umumiy.pdf')
    expect(text).toContain('fizik PDF beti')
  })

  it('retains server-only examination key protection', () => {
    expect(getTopicContent('M15.07')?.questions).toEqual([])
  })
})
