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

  it('URL tokeni tozalansa ham pending update vaqtida forma refresh bo‘lib ketmaydi', async () => {
    window.location.hash = '#access_token=recovery-token&type=recovery'
    let resolveUpdate: (value: { data: null; error: null }) => void = () => undefined
    const updatePassword = vi.fn().mockImplementation(
      () =>
        new Promise<{ data: null; error: null }>((resolve) => {
          resolveUpdate = resolve
        }),
    )
    mockUseAuth.mockReturnValue({
      session: null,
      updatePassword,
    })

    const view = renderPage()

    fireEvent.change(screen.getByLabelText('Yangi parol'), {
      target: { value: 'secret123' },
    })
    fireEvent.change(screen.getByLabelText('Parolni tasdiqlang'), {
      target: { value: 'secret123' },
    })
    fireEvent.submit(screen.getByLabelText('Yangi parol').closest('form')!)

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith('secret123', 'recovery-token')
    })

    window.history.replaceState(null, '', '/reset-password')
    view.rerender(
      <MemoryRouter initialEntries={['/reset-password']}>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth" element={<div>Kirish sahifasi</div>} />
          <Route path="/" element={<div>Bosh sahifa</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Yangi parol kiriting' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Yuklanmoqda...' })).toBeDisabled()

    resolveUpdate({ data: null, error: null })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Parol yangilandi' })).toBeDefined()
    })
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
    expect(updatePassword).toHaveBeenCalledWith('secret123', 'recovery-token')

    fireEvent.click(screen.getByRole('button', { name: 'Kirish sahifasiga o‘tish' }))
    expect(await screen.findByText('Kirish sahifasi')).toBeDefined()
  })
  it('recovery havolasida hard refresh bo‘lsa ham forma va token saqlanadi', () => {
    window.location.hash = '#access_token=recovery-opaque-token&refresh_token=opaque&type=recovery'
    mockUseAuth.mockReturnValue({ session: null, updatePassword: vi.fn() })

    const beforeRefresh = renderPage()
    expect(screen.getByLabelText('Yangi parol')).toBeInTheDocument()
    beforeRefresh.unmount()
    // Browser reloads the document while keeping the recovery URL fragment.
    renderPage()
    expect(screen.getByLabelText('Yangi parol')).toBeInTheDocument()
    expect(window.location.hash).toContain('type=recovery')
  })

  it('server recovery tokenni rad etsa, muvaffaqiyat haqida yolg‘on xabar chiqmaydi', async () => {
    window.location.hash='#access_token=expired-recovery-token&type=recovery'
    const updatePassword=vi.fn().mockResolvedValue({
      data:null, error:new Error('Tiklash havolasi muddati tugagan')
    })
    mockUseAuth.mockReturnValue({session:null,updatePassword})
    renderPage()
    fireEvent.change(screen.getByLabelText('Yangi parol'),{target:{value:'NewStrong123!'}})
    fireEvent.change(screen.getByLabelText('Parolni tasdiqlang'),{target:{value:'NewStrong123!'}})
    fireEvent.submit(screen.getByLabelText('Yangi parol').closest('form')!)
    expect(await screen.findByRole('alert')).toHaveTextContent('muddati tugagan')
    expect(screen.queryByText('Parol yangilandi')).not.toBeInTheDocument()
  })

})
