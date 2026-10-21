import { describe, expect, it } from 'vitest'
import { PRODUCTION_AUTH_ORIGIN, resolveAuthRedirectUrl } from '../authRedirect.js'

describe('verification email redirect URL', () => {
  it('pins Vercel production to the public site despite a legacy localhost env value', () => {
    expect(resolveAuthRedirectUrl({
      VERCEL_ENV: 'production',
      AUTH_REDIRECT_URL: 'http://localhost:3000',
      FRONTEND_PORT: '3000',
    })).toBe(PRODUCTION_AUTH_ORIGIN)
  })

  it('prevents a missing or empty production environment variable from redirecting to localhost', () => {
    expect(resolveAuthRedirectUrl({ VERCEL_ENV: 'production' })).toBe(PRODUCTION_AUTH_ORIGIN)
    expect(resolveAuthRedirectUrl({
      VERCEL_ENV: 'production',
      AUTH_REDIRECT_URL: ' ',
    })).toBe(PRODUCTION_AUTH_ORIGIN)
  })

  it('preserves explicit preview and local redirect configuration', () => {
    expect(resolveAuthRedirectUrl({
      VERCEL_ENV: 'preview',
      AUTH_REDIRECT_URL: 'https://attestatsiya-preview.vercel.app',
    })).toBe('https://attestatsiya-preview.vercel.app')
    expect(resolveAuthRedirectUrl({
      VERCEL_ENV: 'development',
      FRONTEND_PORT: '3010',
    })).toBe('http://localhost:3010')
  })
})
