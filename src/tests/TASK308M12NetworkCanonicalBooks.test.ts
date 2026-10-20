import { describe, expect, it } from 'vitest'
import { displayedCognitiveLevel, getTopicContent } from '../data/topicContent'
import { splitAdaptiveSections } from '../components/learning/theory/BookReader'
import { M12_NETWORK_TEXTBOOK_ADDITIONS } from '../data/topics/m12NetworkTextbookAdditions'
import { M12_01_CANONICAL_BOOK } from '../data/topics/m12NetworkScopesCanonicalBook'
import { M12_02_CANONICAL_BOOK } from '../data/topics/m12NetworkHardwareCanonicalBook'
import { M12_03_CANONICAL_BOOK } from '../data/topics/m12TopologyCanonicalBook'
import { M12_04_CANONICAL_BOOK } from '../data/topics/m12PacketsOsiCanonicalBook'

describe('TASK-308: M12.01–04 complete network theory and assessment parity', () => {
  const cases = [
    { id: 'M12.01', book: M12_01_CANONICAL_BOOK, keys: [2, 0, 1] },
    { id: 'M12.02', book: M12_02_CANONICAL_BOOK, keys: [1, 2, 1] },
    { id: 'M12.03', book: M12_03_CANONICAL_BOOK, keys: [2, 1, 1] },
    { id: 'M12.04', book: M12_04_CANONICAL_BOOK, keys: [1, 1, 1] },
  ] as const
  for (const { id, book, keys } of cases) {
    it(`${id}: one continuous book, 12 sections, exercises, review source appendix`, () => {
      const lesson = getTopicContent(id)!
      const appendix = M12_NETWORK_TEXTBOOK_ADDITIONS[id]
      expect(lesson).toBeDefined()
      expect(lesson.kind).toBe('chapter')
      expect(lesson.source).toContain('Cambridge+')
      expect(book.length).toBeGreaterThanOrEqual(70)
      expect(book.filter(x => x.type === 'heading')).toHaveLength(12)
      expect(book.filter(x => x.type === 'task')).toHaveLength(12)
      expect(book.filter(x => x.type === 'trap')).toHaveLength(12)
      for (const type of ['goal','intro','definition','solved','case','example','table','task','trap','summary','answers','source']) {
        expect(book.some(x => x.type === type), `${id} should have ${type}`).toBe(true)
      }
      expect(book.at(-1)?.type).toBe('source')
      expect(book.at(-1)?.content).toContain('drive.google.com')
      expect(book.at(-1)?.content).toContain('1:1')
      expect(lesson.theory.slice(0, book.length)).toEqual(book)
      expect(lesson.theory.slice(-appendix.length)).toEqual(appendix)
      expect(lesson.theory).toHaveLength(book.length + appendix.length)
      expect(splitAdaptiveSections(lesson.theory).flatMap(section => section.blocks)).toEqual(lesson.theory)
    })
    it(`${id}: does not change static three-question keys or cognitive Y level`, () => {
      const qs = getTopicContent(id)!.questions
      expect(qs.map(q => q.id)).toEqual([1,2,3].map(i => `${id}-q${i}`))
      expect(qs.map(q => q.correctIndex)).toEqual(keys)
      expect(qs.map(q => displayedCognitiveLevel(q))).toEqual(['Y1','Y1','Y2'])
      expect(qs.map(q => q.type)).toEqual(['Y1','Y1','Y1'])
      for (const question of qs) {
        expect(question.options).toHaveLength(4)
        expect(question.options[question.correctIndex].length).toBeGreaterThan(1)
      }
    })
  }
  it('M12.01 avoids absolute LAN/WAN speed and VPN safety guarantees', () => {
    const text = M12_01_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(text).toContain('100 Mbit/s = 12.5 MB/s')
    expect(text).toContain('WANning tezligi doim LANdan past emas')
    expect(text).toContain('VPN')
    const explanation = getTopicContent('M12.01')!.questions[2].explanation
    expect(explanation).toContain('konfiguratsiya')
  })
  it('M12.02 removes arbitrary optical ceiling and hub/switch oversimplification', () => {
    const text = M12_02_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(text).toContain('flood')
    expect(text).toContain('ONT')
    expect(text).toContain('100 Gbit/s')
    expect(getTopicContent('M12.02')!.questions[1].explanation).toContain('universal 100 Gbit/s limit yo‘q')
  })
  it('M12.03 separates star endpoint failures from central switch and calculates full mesh', () => {
    const text = M12_03_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(text).toContain('n(n−1)/2')
    expect(text).toContain('7×6/2 = 21')
    expect(text).toContain('Fizik')
    expect(getTopicContent('M12.03')!.questions[2].text).toContain('Simli')
  })
  it('M12.04 states TCP bounded reliability and QUIC over UDP', () => {
    const text = M12_04_CANONICAL_BOOK.map(x => x.content).join('\n')
    expect(text).toContain('HTTP/3')
    expect(text).toContain('UDP ustidagi QUIC')
    expect(text).toContain('kafolatlamaydi')
    const qs = getTopicContent('M12.04')!.questions
    expect(qs[0].explanation).toContain('mutlaq kafolatlanmaydi')
    expect(qs[2].correctIndex).toBe(1)
  })
  it('other networking reader and IPv4 subnet book is intact', () => {
    const ipv4 = getTopicContent('M12.05')!
    expect(ipv4.theory.length).toBeGreaterThan(15)
    expect(ipv4.theory.map(x=>x.content).join('\n')).toContain('255.255.255.192')
    for (const id of ['M12.06','M12.07','M12.08','M12.09']) {
      expect(getTopicContent(id)?.theory.length).toBeGreaterThanOrEqual(9)
    }
  })
})
