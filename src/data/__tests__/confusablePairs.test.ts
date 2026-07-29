// ═══════════════════════════════════════════════════════════════════════════
// Confusable Pairs — data validation and helper function tests
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest'
import {
  CONFUSABLE_PAIRS,
  findConfusablePair,
  areConfusable,
  getConfusablePartnerWords,
} from '../confusable-pairs'

describe('CONFUSABLE_PAIRS — data validligi', () => {
  it('kamida 8 ta pair bor', () => {
    expect(CONFUSABLE_PAIRS.length).toBeGreaterThanOrEqual(8)
  })

  it('har bir pairda barcha majburiy maydonlar bor', () => {
    for (const p of CONFUSABLE_PAIRS) {
      expect(p.id).toBeTruthy()
      expect(p.words.length).toBeGreaterThanOrEqual(2)
      expect(p.uzTitle).toBeTruthy()
      expect(p.rule).toBeTruthy()
      expect(p.memoryHook).toBeTruthy()
      expect(p.examples.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('pair idlari noyob', () => {
    const ids = CONFUSABLE_PAIRS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('har bir words massivida barcha sozlar noyob', () => {
    for (const p of CONFUSABLE_PAIRS) {
      expect(new Set(p.words.map(w => w.toLowerCase())).size).toBe(p.words.length)
    }
  })

  it('har bir pairda uzTitle separator (vs yoki /) bilan ajratilgan', () => {
    for (const p of CONFUSABLE_PAIRS) {
      const hasSeparator = p.uzTitle.includes('vs') || p.uzTitle.includes('/')
      expect(hasSeparator, `${p.uzTitle} — 'vs' yoki '/' kerak`).toBe(true)
      expect(p.uzTitle).toContain('\u2014')
    }
  })

  it('har bir misolda correct, wrong va explanation bor', () => {
    for (const p of CONFUSABLE_PAIRS) {
      for (const ex of p.examples) {
        expect(ex.correct).toBeTruthy()
        expect(ex.wrong).toBeTruthy()
        expect(ex.explanation).toBeTruthy()
        expect(ex.explanation.length).toBeGreaterThanOrEqual(5)
      }
    }
  })

  it('correct misolda pair sozining asosi (stem) mavjud', () => {
    for (const p of CONFUSABLE_PAIRS) {
      for (const ex of p.examples) {
        const correctLower = ex.correct.toLowerCase()
        const stems = p.words.map(w => {
          const l = w.toLowerCase()
          if (l === 'will')     return ['will', "'ll"]     // I'll contraction
          if (l === 'lend')     return ['lend', 'lent']     // past tense
          if (l === 'borrow')   return ['borrow', 'borrowed', 'borrowing', 'borrows']
          if (l === 'do')       return ['do', 'does', 'did', 'done', 'doing']
          if (l === 'say')      return ['say', 'said', 'says']
          if (l === 'make')     return ['make', 'made', 'makes']
          if (l === 'tell')     return ['tell', 'told', 'tells']
          if (l === 'go')       return ['go', 'goes', 'going', 'went', 'gone']
          if (l === 'the')      return ['the']
          return [l]
        }).flat()
        const containsStem = stems.some(s => {
          const r = new RegExp('\\b' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i')
          return r.test(correctLower)
        })
        expect(containsStem, `${p.id}: "${ex.correct}" — stems: [${stems.join(', ')}]`).toBe(true)
      }
    }
  })

  it('wrong misol correct dan farq qiladi', () => {
    for (const p of CONFUSABLE_PAIRS) {
      for (const ex of p.examples) {
        expect(ex.wrong.toLowerCase()).not.toBe(ex.correct.toLowerCase())
      }
    }
  })

  it('memoryHook bosh emas va kamida 10 belgi', () => {
    for (const p of CONFUSABLE_PAIRS) {
      expect(p.memoryHook.length).toBeGreaterThanOrEqual(10)
    }
  })

  it('rule bosh emas va kamida 10 belgi', () => {
    for (const p of CONFUSABLE_PAIRS) {
      expect(p.rule.length).toBeGreaterThanOrEqual(10)
    }
  })
})

describe('findConfusablePair', () => {
  it('mavjud sozni topadi (make do)', () => {
    const result = findConfusablePair('make')
    expect(result).toBeDefined()
    expect(result!.id).toBe('make-do')
    expect(result!.words).toContain('make')
    expect(result!.words).toContain('do')
  })

  it('katta-kichik harf farqiga chidamli', () => {
    expect(findConfusablePair('MAKE')).toBeDefined()
    expect(findConfusablePair('Make')).toBeDefined()
    expect(findConfusablePair('Do')).toBeDefined()
  })

  it('say va tell ni topadi', () => {
    const sayResult = findConfusablePair('say')
    expect(sayResult).toBeDefined()
    expect(sayResult!.id).toBe('say-tell')
  })

  it('mavjud bolmagan soz uchun undefined', () => {
    expect(findConfusablePair('xyzzy')).toBeUndefined()
    expect(findConfusablePair('')).toBeUndefined()
  })

  it('kop sozli "going to" ni topadi', () => {
    const result = findConfusablePair('going to')
    expect(result).toBeDefined()
    expect(result!.id).toBe('will-going-to')
  })

  it('uch sozli "a" ni topadi (a-an-the)', () => {
    const result = findConfusablePair('a')
    expect(result).toBeDefined()
    expect(result!.id).toBe('a-an-the')
    expect(result!.words).toEqual(['a', 'an', 'the'])
  })
})

describe('areConfusable', () => {
  it('make va do bir-biriga confusable', () => {
    expect(areConfusable('make', 'do')).toBe(true)
  })

  it('say va tell bir-biriga confusable', () => {
    expect(areConfusable('say', 'tell')).toBe(true)
  })

  it('bajarilmagan sozlar confusable emas', () => {
    expect(areConfusable('make', 'tell')).toBe(false)
    expect(areConfusable('do', 'say')).toBe(false)
  })

  it('bir sozning ozi bilan confusable emas', () => {
    expect(areConfusable('make', 'make')).toBe(false)
  })

  it('katta-kichik harf farqiga chidamli', () => {
    expect(areConfusable('MAKE', 'Do')).toBe(true)
    expect(areConfusable('Say', 'TELL')).toBe(true)
  })

  it('a va an confusable', () => {
    expect(areConfusable('a', 'an')).toBe(true)
  })

  it('a va the confusable', () => {
    expect(areConfusable('a', 'the')).toBe(true)
  })

  it('an va the confusable', () => {
    expect(areConfusable('an', 'the')).toBe(true)
  })
})

describe('getConfusablePartnerWords', () => {
  it('make -> ["do"]', () => {
    expect(getConfusablePartnerWords('make')).toEqual(['do'])
  })

  it('do -> ["make"]', () => {
    expect(getConfusablePartnerWords('do')).toEqual(['make'])
  })

  it('katta-kichik harf farqiga chidamli', () => {
    expect(getConfusablePartnerWords('MAKE')).toEqual(['do'])
    expect(getConfusablePartnerWords('Do')).toEqual(['make'])
  })

  it('a -> ["an", "the"] (3 word pair)', () => {
    const partners = getConfusablePartnerWords('a')
    expect(partners).toContain('an')
    expect(partners).toContain('the')
    expect(partners).toHaveLength(2)
  })

  it('mavjud bolmagan soz uchun bosh massiv', () => {
    expect(getConfusablePartnerWords('xyzzy')).toEqual([])
  })

  it('har bir words uchun partnerlar soni words.length - 1', () => {
    for (const p of CONFUSABLE_PAIRS) {
      for (const word of p.words) {
        const partners = getConfusablePartnerWords(word)
        expect(partners.length).toBe(p.words.length - 1)
        expect(partners).not.toContain(word.toLowerCase())
      }
    }
  })

  it('sherik sozlar original pairdagi barcha boshqa sozlarni qamraydi', () => {
    for (const p of CONFUSABLE_PAIRS) {
      for (const word of p.words) {
        const partners = getConfusablePartnerWords(word)
        const expected = p.words.filter(w => w.toLowerCase() !== word.toLowerCase())
        expect(partners.map(p => p.toLowerCase()).sort()).toEqual(
          expected.map(w => w.toLowerCase()).sort()
        )
      }
    }
  })
})
