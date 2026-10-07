import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import OnboardingGate from '../components/auth/OnboardingGate'
import { authClient } from '../features/auth/authClient'
import type { AuthUser } from '../features/auth/sessionStore'

const mockUseAuth = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}))

vi.mock('../features/auth/authClient', () => ({
  authClient: {
    getOnboarding: vi.fn(),
  },
}))

const learner: AuthUser = {
  id: 'u1',
  email: 'learner@test.com',
  display_name: 'Ali',
  role: 'user',
}

function renderGate() {
  return render(
    <MemoryRouter initialEntries={['/profile']}>
      <Routes>
        <Route
          path="/profile"
          element={
            <OnboardingGate>
              <div>Asosiy ilova</div>
            </OnboardingGate>
          }
        />
        <Route path="/onboarding" element={<div>Onboarding</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('OnboardingGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('tugallanmagan learnerni onboardingga yo‘naltiradi', async () => {
    mockUseAuth.mockReturnValue({ user: learner, loading: false })
    vi.mocked(authClient.getOnboarding).mockResolvedValue({
      available: true,
      completed: false,
      display_name: 'Ali',
      exam_date: null,
      daily_goal_minutes: 30,
      timezone: 'Asia/Tashkent',
      locale: 'uz-Latn',
      onboarding_completed_at: null,
    })

    renderGate()

    expect(await screen.findByText('Onboarding')).toBeDefined()
    expect(screen.queryByText('Asosiy ilova')).toBeNull()
  })

  it('schema hali available bo‘lmasa mavjud production oqimini bloklamaydi', async () => {
    mockUseAuth.mockReturnValue({ user: learner, loading: false })
    vi.mocked(authClient.getOnboarding).mockResolvedValue({
      available: false,
      completed: true,
      display_name: null,
      exam_date: null,
      daily_goal_minutes: 30,
      timezone: 'Asia/Tashkent',
      locale: 'uz-Latn',
      onboarding_completed_at: null,
    })

    renderGate()

    expect(await screen.findByText('Asosiy ilova')).toBeDefined()
  })

  it('admin onboarding guarddan o‘tadi va learner endpointini chaqirmaydi', async () => {
    mockUseAuth.mockReturnValue({
      user: { ...learner, role: 'admin' },
      loading: false,
    })

    renderGate()

    expect(screen.getByText('Asosiy ilova')).toBeDefined()
    expect(authClient.getOnboarding).not.toHaveBeenCalled()
  })

  it('onboarding endpointi vaqtincha ishlamasa majburiy gate xato holatini ko‘rsatadi', async () => {
    mockUseAuth.mockReturnValue({ user: learner, loading: false })
    vi.mocked(authClient.getOnboarding).mockRejectedValue(new Error('network'))

    renderGate()

    expect(
      await screen.findByRole('heading', {
        name: 'Onboarding holatini tekshirib bo‘lmadi',
      })
    ).toBeDefined()
    expect(screen.queryByText('Asosiy ilova')).toBeNull()
    expect(screen.getByRole('button', { name: 'Qayta urinish' })).toBeDefined()
  })
})
