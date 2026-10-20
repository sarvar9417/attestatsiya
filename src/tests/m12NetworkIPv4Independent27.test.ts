import { describe, expect, it } from 'vitest'
import source from '../content/tarmoq/Kompyuter_tarmoqlari_300_savol_V2.json'

type SourceItem = { id: string; ch: number; q: string; ans: string }
const items = source as SourceItem[]
const parseIPv4 = (s: string) => s.split('.').reduce((acc, octet) => (((acc << 8) >>> 0) + Number(octet)) >>> 0, 0)
const toIPv4 = (n: number) => [24, 16, 8, 0].map(shift => (n >>> shift) & 255).join('.')
const tests: Array<{ id: string; kind: string; expected: string; answer: string }> = []

for (const question of items.filter(q => q.ch === 6)) {
  const found = question.q.match(/(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})/)
  if (!found) continue
  const ipv4 = parseIPv4(found[1])
  const prefix = Number(found[2])
  const mask = (0xffffffff << (32 - prefix)) >>> 0
  const network = (ipv4 & mask) >>> 0
  const broadcast = (network | (~mask)) >>> 0
  let expected = ''
  let kind = ''
  if (/(network|tarmoq.*manzil)/i.test(question.q) && !/broadcast|host/.test(question.q)) {
    expected = toIPv4(network); kind = 'network'
  } else if (/broadcast/i.test(question.q) && !/host/.test(question.q)) {
    expected = toIPv4(broadcast); kind = 'broadcast'
  } else if (/birinchi foydalaniladigan host/i.test(question.q)) {
    expected = toIPv4((network + 1) >>> 0); kind = 'first host'
  } else if (/oxirgi foydalaniladigan host/i.test(question.q)) {
    expected = toIPv4((broadcast - 1) >>> 0); kind = 'last host'
  } else if (/nechta.*host|jami nechta.*host/.test(question.q)) {
    expected = String((2 ** (32 - prefix)) - 2); kind = 'usable count'
  }
  if (expected) tests.push({ id: question.id, kind, expected, answer: question.ans })
}

describe('TASK-220: independent IPv4 network/broadcast/host key verification', () => {
  it('finds all 27 targeted numeric source cases', () => {
    expect(tests).toHaveLength(27)
  })
  it.each(tests)('$id — $kind: correct calculated answer', ({ expected, answer }) => {
    expect(answer).toBe(expected)
  })
})
