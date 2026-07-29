import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'

const { mockAuth, mockFrom } = vi.hoisted(() => ({
  mockAuth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    resend: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    signOut: vi.fn(),
  },
  mockFrom: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({ supabase: { auth: mockAuth, from: mockFrom } }))

describe('useAuth', () => {
  const session = { user: { id: 'user-1', email: 'test@test.com', user_metadata: { name: 'Test' } } }

  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.getSession.mockResolvedValue({ data: { session } })
    mockAuth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mockAuth.signOut.mockResolvedValue(undefined)
  })

  it('loads session on mount', async () => {
    const { result } = renderHook(() => useAuth())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user?.id).toBe('user-1')
    expect(result.current.displayName).toBe('Test')
    expect(mockAuth.getSession).toHaveBeenCalledTimes(1)
    expect(mockAuth.onAuthStateChange).toHaveBeenCalledTimes(1)
  })

  it('returns null displayName when no user', async () => {
    mockAuth.getSession.mockResolvedValue({ data: { session: null } })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
    expect(result.current.displayName).toBeUndefined()
  })

  it('signUp calls supabase auth and upserts to users table', async () => {
    mockAuth.signUp.mockResolvedValueOnce({
      data: { user: { id: 'user-2' } },
      error: null,
    })
    mockFrom.mockReturnValueOnce({ upsert: vi.fn().mockResolvedValueOnce({ error: null }) })

    const { result } = renderHook(() => useAuth())

    const { error } = await result.current.signUp('a@b.com', 'pass123', 'Ali')

    expect(error).toBeNull()
    expect(mockAuth.signUp).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'pass123',
      options: { data: { name: 'Ali' }, emailRedirectTo: `${window.location.origin}/` },
    })
    expect(mockFrom).toHaveBeenCalledWith('users')
  })

  it('signIn calls signInWithPassword', async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({ error: null })

    const { result } = renderHook(() => useAuth())

    const { error } = await result.current.signIn('a@b.com', 'pass')

    expect(error).toBeNull()
    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pass' })
  })

  it('resetPassword calls resetPasswordForEmail', async () => {
    mockAuth.resetPasswordForEmail.mockResolvedValueOnce({ error: null })

    const { result } = renderHook(() => useAuth())

    const { error } = await result.current.resetPassword('a@b.com')

    expect(error).toBeNull()
    expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith('a@b.com', {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  })

  it('updatePassword calls updateUser', async () => {
    mockAuth.updateUser.mockResolvedValueOnce({ error: null })

    const { result } = renderHook(() => useAuth())

    const { error } = await result.current.updatePassword('newpass')

    expect(error).toBeNull()
    expect(mockAuth.updateUser).toHaveBeenCalledWith({ password: 'newpass' })
  })

  it('signOut calls auth.signOut', async () => {
    const { result } = renderHook(() => useAuth())

    await result.current.signOut()

    expect(mockAuth.signOut).toHaveBeenCalledTimes(1)
  })

  it('resendConfirmation calls auth.resend', async () => {
    mockAuth.resend.mockResolvedValueOnce({ error: null })

    const { result } = renderHook(() => useAuth())

    const { error } = await result.current.resendConfirmation('a@b.com')

    expect(error).toBeNull()
    expect(mockAuth.resend).toHaveBeenCalledWith({
      type: 'signup',
      email: 'a@b.com',
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
  })
})
