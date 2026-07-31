import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Profile from '../pages/Profile'

const mockUseAuth = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}))

function renderProfile() {
  return render(
    <MemoryRouter initialEntries={['/profile']}>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<div>Bosh sahifa</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Profile sahifasi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
      displayName: 'Ali',
      updateProfile: vi.fn(),
      updatePassword: vi.fn(),
      signOut: vi.fn(),
    })
  })

  it('email va rol ko\'rinadi', () => {
    renderProfile()
    expect(screen.getByText('test@test.com')).toBeDefined()
    expect(screen.getByText('Foydalanuvchi')).toBeDefined()
  })

  it('ism yangilash muvaffaqiyatli: updateProfile chaqiriladi va tasdiq ko\'rinadi', async () => {
    const updateProfile = vi.fn().mockResolvedValue({ data: null, error: null })
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
      displayName: 'Ali',
      updateProfile,
      updatePassword: vi.fn(),
      signOut: vi.fn(),
    })
    const user = userEvent.setup()
    renderProfile()

    const nameInput = screen.getByLabelText('Ism va familiya')
    await user.clear(nameInput)
    await user.type(nameInput, 'Bobur Aliyev')
    await user.click(screen.getByRole('button', { name: 'Saqlash' }))

    await waitFor(() => expect(screen.getByText("Ma'lumotlar saqlandi")).toBeDefined())
    expect(updateProfile).toHaveBeenCalledWith('Bobur Aliyev')
  })

  it('ism juda qisqa bo\'lsa validatsiya xatosi: updateProfile chaqirilmaydi', async () => {
    const updateProfile = vi.fn()
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
      displayName: 'Ali',
      updateProfile,
      updatePassword: vi.fn(),
      signOut: vi.fn(),
    })
    const user = userEvent.setup()
    renderProfile()

    const nameInput = screen.getByLabelText('Ism va familiya')
    await user.clear(nameInput)
    await user.type(nameInput, 'A')
    await user.click(screen.getByRole('button', { name: 'Saqlash' }))

    expect(screen.getByText('Ism kamida 2 ta belgidan iborat bo\'lishi kerak')).toBeDefined()
    expect(updateProfile).not.toHaveBeenCalled()
  })

  it('parol yangilash muvaffaqiyatli: updatePassword chaqiriladi, maydonlar tozalanadi', async () => {
    const updatePassword = vi.fn().mockResolvedValue({ data: null, error: null })
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
      displayName: 'Ali',
      updateProfile: vi.fn(),
      updatePassword,
      signOut: vi.fn(),
    })
    const user = userEvent.setup()
    renderProfile()

    await user.type(screen.getByLabelText('Yangi parol'), 'newsecret123')
    await user.type(screen.getByLabelText('Parolni tasdiqlang'), 'newsecret123')
    await user.click(screen.getByRole('button', { name: 'Parolni yangilash' }))

    await waitFor(() => expect(screen.getByText('Parol muvaffaqiyatli yangilandi')).toBeDefined())
    expect(updatePassword).toHaveBeenCalledWith('newsecret123')
    expect(screen.getByLabelText('Yangi parol')).toHaveValue('')
    expect(screen.getByLabelText('Parolni tasdiqlang')).toHaveValue('')
  })

  it('parollar mos kelmasa validatsiya xatosi: updatePassword chaqirilmaydi', async () => {
    const updatePassword = vi.fn()
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
      displayName: 'Ali',
      updateProfile: vi.fn(),
      updatePassword,
      signOut: vi.fn(),
    })
    const user = userEvent.setup()
    renderProfile()

    await user.type(screen.getByLabelText('Yangi parol'), 'secret123')
    await user.type(screen.getByLabelText('Parolni tasdiqlang'), 'different')
    await user.click(screen.getByRole('button', { name: 'Parolni yangilash' }))

    expect(screen.getByText('Parollar mos kelmadi')).toBeDefined()
    expect(updatePassword).not.toHaveBeenCalled()
  })

  it('qisqa yangi parol validatsiya xatosi beradi', async () => {
    const updatePassword = vi.fn()
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
      displayName: 'Ali',
      updateProfile: vi.fn(),
      updatePassword,
      signOut: vi.fn(),
    })
    const user = userEvent.setup()
    renderProfile()

    await user.type(screen.getByLabelText('Yangi parol'), '123')
    await user.type(screen.getByLabelText('Parolni tasdiqlang'), '123')
    await user.click(screen.getByRole('button', { name: 'Parolni yangilash' }))

    expect(screen.getByText('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak')).toBeDefined()
    expect(updatePassword).not.toHaveBeenCalled()
  })

  it('chiqish: signOut chaqiriladi va bosh sahifaga o\'tiladi', async () => {
    const signOut = vi.fn().mockResolvedValue(undefined)
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', email: 'test@test.com', display_name: 'Ali', role: 'user' },
      displayName: 'Ali',
      updateProfile: vi.fn(),
      updatePassword: vi.fn(),
      signOut,
    })
    const user = userEvent.setup()
    renderProfile()

    await user.click(screen.getByRole('button', { name: 'Chiqish' }))

    await waitFor(() => expect(screen.getByText('Bosh sahifa')).toBeDefined())
    expect(signOut).toHaveBeenCalled()
  })
})
