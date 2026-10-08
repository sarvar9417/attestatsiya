import { describe, expect, it } from 'vitest'
import { resolveApiBaseUrl } from '../lib/apiClient'

describe('resolveApiBaseUrl', () => {
  it('productionda explicit URL bo‘lmasa same-origin ishlatadi', () => {
    expect(resolveApiBaseUrl(undefined, true)).toBe('')
    expect(resolveApiBaseUrl('   ', true)).toBe('')
  })

  it('lokal developmentda Fastify 3001 portiga ulanadi', () => {
    expect(resolveApiBaseUrl(undefined, false)).toBe('http://localhost:3001')
  })

  it('explicit URL berilsa production/devdan qat’i nazar undan foydalanadi', () => {
    expect(
      resolveApiBaseUrl('https://api.example.uz/', true)
    ).toBe('https://api.example.uz')
  })
})
