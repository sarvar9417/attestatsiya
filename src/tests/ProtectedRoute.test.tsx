import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import type { AuthUser } from '../features/auth/sessionStore'

const mockUseAuth = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}))

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/profile']}>
      <Routes>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>Himoyalangan kontent</div>
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<div>Kirish sahifasi</div>} />
      </Routes>
    </MemoryRouter>
  )
}

const loggedUser: AuthUser = { id: 'u1', email: 'test@test.com', display_name: 'Ali', role: 'user' }

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login qilmagan foydalanuvchi /auth?returnTo ga yo\'naltiriladi', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
    renderProtected()

    await waitFor(() => expect(screen.getByText('Kirish sahifasi')).toBeDefined())
    expect(screen.queryByText('Himoyalangan kontent')).toBeNull()
  })

  it('login qilgan foydalanuvchi kontentni ko\'radi', () => {
    mockUseAuth.mockReturnValue({ user: loggedUser, loading: false })
    renderProtected()

    expect(screen.getByText('Himoyalangan kontent')).toBeDefined()
    expect(screen.queryByText('Kirish sahifasi')).toBeNull()
  })

  it('loading holatida hech narsa ko\'rsatilmaydi', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })
    renderProtected()

    expect(screen.queryByText('Himoyalangan kontent')).toBeNull()
    expect(screen.queryByText('Kirish sahifasi')).toBeNull()
  })
})
