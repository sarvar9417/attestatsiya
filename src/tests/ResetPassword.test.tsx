import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ResetPassword from '../pages/ResetPassword'

const mockUseAuth = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/reset-password']}>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth" element={<div>Kirish sahifasi</div>} />
        <Route path="/" element={<div>Bosh sahifa</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ResetPassword sahifasi', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    mockUseAuth.mockReset()
  })

  it('recovery token bo‘lmasa kirish sahifasiga yo‘l ko‘rsatadi', () => {
    mockUseAuth.mockReturnValue({
      session: null,
      updatePassword: vi.fn(),
    })

    renderPage()

    expect(screen.getByRole('heading', { name: 'Parolni tiklash' })).toBeDefined()
    expect(
      screen.getByRole('link', { name: 'Kirish sahifasiga o‘tish' }),
    ).toHaveAttribute('href', '/auth')
  })

  it('oddiy login sessiyasi recovery formani ochmaydi', () => {
    mockUseAuth.mockReturnValue({
      session: { access_token: 'ordinary-session' },
      updatePassword: vi.fn(),
    })

    renderPage()

    expect(screen.getByRole('heading', { name: 'Parolni tiklash' })).toBeDefined()
    expect(screen.queryByLabelText('Yangi parol')).toBeNull()
  })

  it('signup tokeni recovery formani ochmaydi', () => {
    window.location.hash = '#access_token=signup-token&type=signup'
    mockUseAuth.mockReturnValue({ session: null, updatePassword: vi.fn() })

    renderPage()

    expect(screen.getByRole('heading', { name: 'Parolni tiklash' })).toBeDefined()
    expect(screen.queryByLabelText('Yangi parol')).toBeNull()
  })

  it('recovery token mavjud bo‘lsa parollar mos kelmasligini clientda tekshiradi', () => {
    window.location.hash = '#access_token=recovery-token&type=recovery'
    const updatePassword = vi.fn()
    mockUseAuth.mockReturnValue({
      session: null,
      updatePassword,
    })

    renderPage()

    fireEvent.change(screen.getByLabelText('Yangi parol'), {
      target: { value: 'secret123' },
    })
    fireEvent.change(screen.getByLabelText('Parolni tasdiqlang'), {
      target: { value: 'different' },
    })
    fireEvent.submit(screen.getByLabelText('Yangi parol').closest('form')!)

    expect(screen.getByRole('alert')).toHaveTextContent('Parollar mos kelmadi')
    expect(updatePassword).not.toHaveBeenCalled()
  })

  it('yaroqli yangi parol backend update oqimiga yuboriladi', async () => {
    window.location.hash = '#access_token=recovery-token&type=recovery'
    const updatePassword = vi.fn().mockResolvedValue({ data: null, error: null })
    mockUseAuth.mockReturnValue({
      session: null,
      updatePassword,
    })

    renderPage()

    fireEvent.change(screen.getByLabelText('Yangi parol'), {
      target: { value: 'secret123' },
    })
    fireEvent.change(screen.getByLabelText('Parolni tasdiqlang'), {
      target: { value: 'secret123' },
    })
    fireEvent.submit(screen.getByLabelText('Yangi parol').closest('form')!)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Parol yangilandi' }),
      ).toBeDefined()
    })
    expect(updatePassword).toHaveBeenCalledWith('secret123')

    fireEvent.click(screen.getByRole('button', { name: 'Kirish sahifasiga o‘tish' }))
    expect(await screen.findByText('Kirish sahifasi')).toBeDefined()
  })
})
