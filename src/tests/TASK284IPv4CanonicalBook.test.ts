import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'
import { M12_05_CANONICAL_BOOK } from '../data/topics/m12IPv4CanonicalBook'
import { M12_NETWORK_TEXTBOOK_ADDITIONS } from '../data/topics/m12NetworkTextbookAdditions'
import { splitSections } from '../components/learning/theory/BookReader'

describe('TASK-284 IPv4 textbook chapter', () => {
  it('replaces the short-first book with a solved, source-identified chapter and keeps earlier notes', () => {
    const topic = getTopicContent('M12.05')
    expect(topic?.source).toContain('Cambridge')
    expect(M12_05_CANONICAL_BOOK.length).toBeGreaterThanOrEqual(40)
    expect(M12_05_CANONICAL_BOOK.filter(block => block.type === 'heading').length).toBeGreaterThanOrEqual(8)
    expect(M12_05_CANONICAL_BOOK.filter(block => block.type === 'solved').length).toBeGreaterThanOrEqual(5)
    expect(M12_05_CANONICAL_BOOK.some(block => block.type === 'goal')).toBe(true)
    expect(M12_05_CANONICAL_BOOK.some(block => block.type === 'answers')).toBe(true)
    expect(topic!.theory.slice(0, M12_05_CANONICAL_BOOK.length)).toEqual(M12_05_CANONICAL_BOOK)
    expect(topic!.theory.slice(-M12_NETWORK_TEXTBOOK_ADDITIONS['M12.05'].length))
      .toEqual(M12_NETWORK_TEXTBOOK_ADDITIONS['M12.05'])
    expect(splitSections(topic!.theory).flatMap(s => s.blocks)).toEqual(topic!.theory)
    expect(splitSections(topic!.theory).length).toBeGreaterThanOrEqual(9)
  })

  it('includes correct /26, /27, /23, /31 and /32 worked examples', () => {
    const content = M12_05_CANONICAL_BOOK.map(x => x.content).join('\n')
    for (const expected of [
      '255.255.255.192', '192.168.10.64', '192.168.10.127',
      '10.0.5.192', '10.0.5.223', '172.16.4.0', '172.16.5.255',
      '/31', '/32', 'Bitwise AND', 'IPv6',
    ]) expect(content).toContain(expected)
    expect(content).toContain('32−26=6')
  })
})
