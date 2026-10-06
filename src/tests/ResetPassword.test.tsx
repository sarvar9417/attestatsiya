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
    window.location.hash = ''
    mockUseAuth.mockReset()
  })

  it('session yoki recovery token bo‘lmasa kirish sahifasiga yo‘l ko‘rsatadi', () => {
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

  it('session mavjud bo‘lsa parollar mos kelmasligini clientda tekshiradi', () => {
    const updatePassword = vi.fn()
    mockUseAuth.mockReturnValue({
      session: { access_token: 'token' },
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
    const updatePassword = vi.fn().mockResolvedValue({ data: null, error: null })
    mockUseAuth.mockReturnValue({
      session: { access_token: 'token' },
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
  })
})
