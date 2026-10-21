import { describe, expect, it } from 'vitest'
import { normalizeVercelApiRequestUrl } from '../normalizeVercelApiRequestUrl.js'

describe('Vercel API rewrite query normalization', () => {
  it('removes the exact Vercel path capture from M05 section resume requests', () => {
    expect(normalizeVercelApiRequestUrl(
      '/api/exam/active?kind=bolim&module_id=M05&path=exam%2Factive'
    )).toBe('/api/exam/active?kind=bolim&module_id=M05')
  })

  it('removes a Vercel share token only alongside a verified rewrite capture', () => {
    expect(normalizeVercelApiRequestUrl(
      '/api/exam/active?kind=bolim&module_id=M05&path=exam%2Factive&_vercel_share=temporary'
    )).toBe('/api/exam/active?kind=bolim&module_id=M05')
  })

  it('does not hide unexpected client query fields from strict schemas', () => {
    expect(normalizeVercelApiRequestUrl(
      '/api/exam/active?kind=bolim&module_id=M05&path=exam%2Factive&answer_key=1'
    )).toBe('/api/exam/active?kind=bolim&module_id=M05&answer_key=1')
  })

  it('leaves mismatched and duplicated path parameters for strict validation', () => {
    const mismatched = '/api/exam/active?kind=bolim&path=other'
    const repeated = '/api/exam/active?kind=bolim&path=exam%2Factive&path=exam%2Factive'
    expect(normalizeVercelApiRequestUrl(mismatched)).toBe(mismatched)
    expect(normalizeVercelApiRequestUrl(repeated)).toBe(repeated)
  })

  it('does not modify unrelated URLs or requests without a query', () => {
    expect(normalizeVercelApiRequestUrl('/api/health')).toBe('/api/health')
    expect(normalizeVercelApiRequestUrl('/learn/M05?path=learn%2FM05')).toBe('/learn/M05?path=learn%2FM05')
    expect(normalizeVercelApiRequestUrl(undefined)).toBeUndefined()
  })
})
