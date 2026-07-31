import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Auth from '../pages/Auth'
import { ApiError } from '../lib/apiClient'
import type { AuthUser } from '../features/auth/sessionStore'

const mockUseAuth = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}))

function authReturn(overrides: Record<string, unknown> = {}) {
  return {
    user: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    resetPassword: vi.fn(),
    resendConfirmation: vi.fn(),
    ...overrides,
  }
}

function renderAuth(initialEntries: string[] = ['/auth']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<div>Bosh sahifa</div>} />
        <Route path="/profile" element={<div>Profil sahifasi</div>} />
      </Routes>
    </MemoryRouter>
  )
}

const loggedUser: AuthUser = { id: 'u1', email: 'test@test.com', display_name: 'Ali', role: 'user' }

describe('Auth sahifasi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue(authReturn())
  })

  it('login muvaffaqiyatli: bosh sahifaga yo\'naltiriladi', async () => {
    const signIn = vi.fn().mockResolvedValue({ data: null, error: null })
    mockUseAuth.mockReturnValue(authReturn({ signIn }))
    renderAuth()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText('Parol'), { target: { value: 'secret123' } })
    fireEvent.submit(screen.getByLabelText('Parol').closest('form')!)

    await waitFor(() => expect(screen.getByText('Bosh sahifa')).toBeDefined())
    expect(signIn).toHaveBeenCalledWith('test@test.com', 'secret123')
  })

  it('login muvaffaqiyatli: returnTo bo\'lsa o\'sha manzilga qaytadi', async () => {
    const signIn = vi.fn().mockResolvedValue({ data: null, error: null })
    mockUseAuth.mockReturnValue(authReturn({ signIn }))
    renderAuth(['/auth?returnTo=%2Fprofile'])

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText('Parol'), { target: { value: 'secret123' } })
    fireEvent.submit(screen.getByLabelText('Parol').closest('form')!)

    await waitFor(() => expect(screen.getByText('Profil sahifasi')).toBeDefined())
  })

  it('login xatosi: EMAIL_NOT_CONFIRMED maxsus ekran ko\'rsatadi va qayta yuborish ishlaydi', async () => {
    vi.useFakeTimers()
    try {
      const signIn = vi.fn().mockResolvedValue({
        data: null,
        error: new ApiError('Email tasdiqlanmagan. Xatni tekshiring.', 401, 'EMAIL_NOT_CONFIRMED'),
      })
      const resendConfirmation = vi.fn().mockResolvedValue({ data: null, error: null })
      mockUseAuth.mockReturnValue(authReturn({ signIn, resendConfirmation }))
      renderAuth()

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } })
      fireEvent.change(screen.getByLabelText('Parol'), { target: { value: 'secret123' } })
      fireEvent.submit(screen.getByLabelText('Parol').closest('form')!)

      await act(async () => {})
      expect(screen.getByText(/hali tasdiqlanmagan/)).toBeDefined()

      const resendButton = screen.getByRole('button', { name: /60s/ })
      expect(resendButton).toBeDisabled()
      await act(async () => { await vi.advanceTimersByTimeAsync(61_000) })
      expect(screen.getByRole('button', { name: 'Qayta yuborish' })).toBeEnabled()

      fireEvent.click(screen.getByRole('button', { name: 'Qayta yuborish' }))
      await act(async () => {})
      expect(resendConfirmation).toHaveBeenCalledWith('test@test.com')

      fireEvent.click(screen.getByRole('button', { name: 'Kirishga qaytish' }))
      expect(screen.getByLabelText('Email')).toBeDefined()
    } finally {
      vi.useRealTimers()
    }
  })

  it('login: noto\'g\'ri email formati validatsiya xatosi beradi', async () => {
    const signIn = vi.fn()
    mockUseAuth.mockReturnValue(authReturn({ signIn }))
    renderAuth()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByLabelText('Parol'), { target: { value: 'secret123' } })
    fireEvent.submit(screen.getByLabelText('Parol').closest('form')!)

    expect(screen.getByText('Email formati noto\'g\'ri')).toBeDefined()
    expect(signIn).not.toHaveBeenCalled()
  })

  it('signup: parollar mos kelmasa signUp chaqirilmaydi', async () => {
    const signUp = vi.fn()
    mockUseAuth.mockReturnValue(authReturn({ signUp }))
    renderAuth()

    fireEvent.click(screen.getAllByRole('button', { name: "Ro'yxatdan o'tish" })[0])
    fireEvent.change(screen.getByLabelText('Ism'), { target: { value: 'Ali' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@test.com' } })
    fireEvent.change(screen.getByLabelText('Parol'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByLabelText('Parolni tasdiqlang'), { target: { value: 'different' } })
    fireEvent.submit(screen.getByLabelText('Parolni tasdiqlang').closest('form')!)

    expect(screen.getByText('Parollar mos kelmadi')).toBeDefined()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('signup muvaffaqiyatli: tasdiqlash xati ekrani ko\'rsatiladi', async () => {
    const signUp = vi.fn().mockResolvedValue({ data: { user_id: 'u1' }, error: null })
    mockUseAuth.mockReturnValue(authReturn({ signUp }))
    renderAuth()

    fireEvent.click(screen.getAllByRole('button', { name: "Ro'yxatdan o'tish" })[0])
    fireEvent.change(screen.getByLabelText('Ism'), { target: { value: 'Ali Valiyev' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: ' new@test.com ' } })
    fireEvent.change(screen.getByLabelText('Parol'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByLabelText('Parolni tasdiqlang'), { target: { value: 'secret123' } })
    fireEvent.submit(screen.getByLabelText('Parolni tasdiqlang').closest('form')!)

    await waitFor(() => expect(screen.getByText('Email tasdiqlash')).toBeDefined())
    expect(signUp).toHaveBeenCalledWith('new@test.com', 'secret123', 'Ali Valiyev')
    expect(screen.getByText(/tasdiqlash xati yuborildi/)).toBeDefined()
  })

  it('signup: qisqa parol validatsiya xatosi beradi', async () => {
    const signUp = vi.fn()
    mockUseAuth.mockReturnValue(authReturn({ signUp }))
    renderAuth()

    fireEvent.click(screen.getAllByRole('button', { name: "Ro'yxatdan o'tish" })[0])
    fireEvent.change(screen.getByLabelText('Ism'), { target: { value: 'Ali' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@test.com' } })
    fireEvent.change(screen.getByLabelText('Parol'), { target: { value: '123' } })
    fireEvent.change(screen.getByLabelText('Parolni tasdiqlang'), { target: { value: '123' } })
    fireEvent.submit(screen.getByLabelText('Parolni tasdiqlang').closest('form')!)

    expect(screen.getByText('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')).toBeDefined()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('?expired=1: session tugagan banner ko\'rsatiladi', () => {
    renderAuth(['/auth?expired=1'])
    expect(screen.getByText('Session muddati tugadi. Iltimos, qayta kiring.')).toBeDefined()
  })

  it('login qilgan foydalanuvchi /auth dan qaytariladi', async () => {
    mockUseAuth.mockReturnValue(authReturn({ user: loggedUser }))
    renderAuth(['/auth?returnTo=%2Fprofile'])

    await waitFor(() => expect(screen.getByText('Profil sahifasi')).toBeDefined())
  })

  it('parolni tiklash modal: resetPassword chaqiriladi', async () => {
    const resetPassword = vi.fn().mockResolvedValue({ data: null, error: null })
    mockUseAuth.mockReturnValue(authReturn({ resetPassword }))
    renderAuth()

    fireEvent.click(screen.getByRole('button', { name: 'Parolni unutdingizmi?' }))
    fireEvent.change(screen.getByLabelText('Tiklash emaili'), { target: { value: 'test@test.com' } })
    fireEvent.submit(screen.getByLabelText('Tiklash emaili').closest('form')!)

    await waitFor(() => expect(screen.getByText('Tiklash havolasi yuborildi')).toBeDefined())
    expect(resetPassword).toHaveBeenCalledWith('test@test.com')
  })
})
