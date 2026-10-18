import { describe, it, expect } from 'vitest'
import { suggestEqualQuotas } from '../quotaSuggestion'

describe('equal topic quotas', () => {
  it('preserves an exact 50-question total over three topics and five levels', () => {
    const result = suggestEqualQuotas(50, {
      b: { 1: 2, 5: 2 }, a: { 2: 7 }, c: { 3: 1 },
    })
    const sums = Object.values(result).map(x => Object.values(x).reduce((a,b)=>a+b,0))
    expect(sums).toEqual([17,17,16])
    expect(sums.reduce((a,b)=>a+b,0)).toBe(50)
    expect(Object.values(result.b ?? {}).length).toBe(2)
  })
  it('prevents zeros, overflow and over-selection', () => {
    expect(() => suggestEqualQuotas(1,{ a:{3:5},b:{3:5} })).toThrow()
    expect(() => suggestEqualQuotas(101,{ a:{3:5} })).toThrow()
    expect(() => suggestEqualQuotas(20,{})).toThrow()
    expect(suggestEqualQuotas(1,{a:{3:5}}).a).toEqual({3:1})
  })
})
