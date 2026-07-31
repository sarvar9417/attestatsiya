import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminGuard from '../components/auth/AdminGuard'
import type { AuthUser } from '../features/auth/sessionStore'

const mockUseAuth = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}))

function user(role: AuthUser['role']): AuthUser {
  return {
    id: 'user-1',
    email: 'test@test.com',
    display_name: 'Ali',
    role,
  }
}

describe('AdminGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('admin roli admin kontentni ko‘rsatadi', () => {
    mockUseAuth.mockReturnValue({ user: user('admin'), loading: false })

    render(
      <MemoryRouter>
        <AdminGuard>
          <div>Himoyalangan admin kontenti</div>
        </AdminGuard>
      </MemoryRouter>
    )

    expect(screen.getByText('Himoyalangan admin kontenti')).toBeDefined()
  })

  it('editor roli ham ruxsat oladi', () => {
    mockUseAuth.mockReturnValue({ user: user('editor'), loading: false })

    render(
      <MemoryRouter>
        <AdminGuard>
          <div>Himoyalangan admin kontenti</div>
        </AdminGuard>
      </MemoryRouter>
    )

    expect(screen.getByText('Himoyalangan admin kontenti')).toBeDefined()
  })

  it('user roli ruxsat olmaydi', () => {
    mockUseAuth.mockReturnValue({ user: user('user'), loading: false })

    render(
      <MemoryRouter>
        <AdminGuard>
          <div>Himoyalangan admin kontenti</div>
        </AdminGuard>
      </MemoryRouter>
    )

    expect(screen.queryByText('Himoyalangan admin kontenti')).toBeNull()
    expect(screen.getByText("Ruxsat yo'q")).toBeDefined()
  })

  it('session bo‘lmasa kirish havolasi ko‘rsatiladi', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })

    render(
      <MemoryRouter>
        <AdminGuard>
          <div>Himoyalangan admin kontenti</div>
        </AdminGuard>
      </MemoryRouter>
    )

    expect(screen.getByText('Kirish')).toBeDefined()
    expect(screen.queryByText('Himoyalangan admin kontenti')).toBeNull()
  })

  it('loading holatida hech narsa ko‘rsatmaydi', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })

    render(
      <MemoryRouter>
        <AdminGuard>
          <div>Himoyalangan admin kontenti</div>
        </AdminGuard>
      </MemoryRouter>
    )

    expect(screen.queryByText('Himoyalangan admin kontenti')).toBeNull()
    expect(screen.queryByText("Ruxsat yo'q")).toBeNull()
  })
})
