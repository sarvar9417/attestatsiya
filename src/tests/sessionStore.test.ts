import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  sessionStore,
  isExpired,
  type AuthSession,
} from '../features/auth/sessionStore'

function makeSession(overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    access_token: 'access-1',
    refresh_token: 'refresh-1',
    expires_at: Date.now() + 3600_000,
    user: { id: 'user-1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
    ...overrides,
  }
}

const STORAGE_KEY = 'attestatsiya.session.v1'

describe('sessionStore', () => {
  beforeEach(() => {
    sessionStore.clear()
    window.localStorage.clear()
  })

  it('set qilingan session get orqali qaytariladi va localStorage\'ga yoziladi', () => {
    const session = makeSession()

    sessionStore.set(session)

    expect(sessionStore.get()).toEqual(session)
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) as string)).toEqual(session)
  })

  it('clear session\'ni o\'chiradi va localStorage\'dan olib tashlaydi', () => {
    sessionStore.set(makeSession())

    sessionStore.clear()

    expect(sessionStore.get()).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('updateUser faqat user maydonini yangilaydi', () => {
    sessionStore.set(makeSession())

    sessionStore.updateUser({
      id: 'user-1',
      email: 'test@test.com',
      display_name: 'Bobur',
      role: 'admin',
    })

    const session = sessionStore.get()
    expect(session?.user.display_name).toBe('Bobur')
    expect(session?.user.role).toBe('admin')
    expect(session?.access_token).toBe('access-1')
  })

  it('muddati o\'tgan session yuklanishda SAQLANADI (refresh mount\'da ishlaydi)', async () => {
    const expired = makeSession({ expires_at: Date.now() - 1000 })
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expired))

    vi.resetModules()
    const mod = await import('../features/auth/sessionStore')

    expect(mod.sessionStore.get()).toMatchObject({
      access_token: 'access-1',
      refresh_token: 'refresh-1',
    })
    expect(mod.isExpired(expired)).toBe(true)
  })

  it('buzilgan JSON localStorage dan null qaytariladi', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not-json')

    expect(sessionStore.get()).toBeNull()
  })

  it('noto\'g\'ri shakldagi session qabul qilinmaydi', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }))

    expect(sessionStore.get()).toBeNull()
  })

  it('subscribe listener\'lar session o\'zgarishida chaqiriladi', () => {
    const listener = vi.fn()
    sessionStore.subscribe(listener)

    sessionStore.set(makeSession())
    sessionStore.clear()

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener.mock.calls[0][0]).toMatchObject({ access_token: 'access-1' })
    expect(listener.mock.calls[1][0]).toBeNull()
  })

  it('boshqa tab\'dagi o\'zgarish storage event orqali sinxronlanadi', () => {
    const listener = vi.fn()
    sessionStore.subscribe(listener)

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(makeSession()),
      })
    )

    expect(listener).toHaveBeenCalledTimes(1)
    expect(sessionStore.get()?.access_token).toBe('access-1')
  })

  it('isExpired: chegara — 60 soniyagacha zaxira vaqt bor', () => {
    expect(isExpired(makeSession({ expires_at: Date.now() + 120_000 }))).toBe(false)
    expect(isExpired(makeSession({ expires_at: Date.now() + 30_000 }))).toBe(true)
    expect(isExpired(makeSession({ expires_at: Date.now() }))).toBe(true)
  })
})
