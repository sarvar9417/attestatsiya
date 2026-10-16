import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearRecoveryParamsFromUrl,
  readRecoveryAccessToken,
} from '../features/auth/recoveryUrl'

describe('recoveryUrl', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/reset-password')
    window.location.hash = ''
  })

  it('faqat recovery hash access tokenini qabul qiladi', () => {
    window.location.hash = '#access_token=recovery-token&type=recovery'
    expect(readRecoveryAccessToken()).toBe('recovery-token')
  })

  it('signup hash tokenini recovery sifatida qabul qilmaydi', () => {
    window.location.hash = '#access_token=signup-token&type=signup'
    expect(readRecoveryAccessToken()).toBeNull()
  })

  it('query access tokenini qabul qilmaydi', () => {
    window.history.replaceState(
      null,
      '',
      '/reset-password?access_token=query-token&type=recovery',
    )
    expect(readRecoveryAccessToken()).toBeNull()
  })

  it('recovery fragmentni reloadsiz tozalaydi va oddiy queryni saqlaydi', () => {
    window.history.replaceState(null, '', '/reset-password?from=email')
    window.location.hash =
      '#access_token=recovery-token&refresh_token=refresh-token&type=recovery'

    clearRecoveryParamsFromUrl()

    expect(window.location.pathname).toBe('/reset-password')
    expect(window.location.search).toBe('?from=email')
    expect(window.location.hash).toBe('')
  })
})
