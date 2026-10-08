import { describe, expect, it } from 'vitest'
import { resolveApiBaseUrl } from '../lib/apiClient'

describe('resolveApiBaseUrl', () => {
  it('productionda explicit backend URL bo‘lmasa same-origin ishlatadi', () => {
    expect(resolveApiBaseUrl(undefined, true)).toBe('')
    expect(resolveApiBaseUrl('   ', true)).toBe('')
  })

  it('lokal developmentda Fastify 3001 portini ishlatadi', () => {
    expect(resolveApiBaseUrl(undefined, false)).toBe('http://localhost:3001')
  })

  it('explicit override bo‘lsa trailing slashni olib tashlaydi', () => {
    expect(resolveApiBaseUrl('https://api.example.test/', true)).toBe(
      'https://api.example.test'
    )
  })
})
