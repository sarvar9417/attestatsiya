import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import OnboardingPage from '../pages/OnboardingPage'
import { authClient } from '../features/auth/authClient'

const mockUseAuth = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}))

vi.mock('../features/auth/authClient', () => ({
  authClient: {
    getOnboarding: vi.fn(),
    completeOnboarding: vi.fn(),
  },
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/onboarding']}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<div>Dashboard</div>} />
        <Route path="/exam/diagnostika" element={<div>Diagnostika</div>} />
      </Routes>
    </MemoryRouter>
  )
}

const incompleteState = {
  available: true,
  completed: false,
  display_name: 'Ali',
  exam_date: null,
  daily_goal_minutes: 30,
  timezone: 'Asia/Tashkent',
  locale: 'uz-Latn',
  onboarding_completed_at: null,
}

describe('OnboardingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      displayName: 'Ali',
      updateProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
    })
    vi.mocked(authClient.getOnboarding).mockResolvedValue(incompleteState)
  })

  it('ism, noma’lum sana va kunlik reja bilan onboardingni skip qiladi', async () => {
    const user = userEvent.setup()
    const updateProfile = vi.fn().mockResolvedValue({ data: null, error: null })
    mockUseAuth.mockReturnValue({ displayName: 'Ali', updateProfile })
    vi.mocked(authClient.completeOnboarding).mockResolvedValue({
      state: {
        ...incompleteState,
        completed: true,
        onboarding_completed_at: '2099-01-01T00:00:00.000Z',
      },
      next_action: 'dashboard',
    })

    renderPage()

    expect(await screen.findByDisplayValue('Ali')).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Hozircha o‘tkazib yuborish' }))

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith('Ali')
      expect(authClient.completeOnboarding).toHaveBeenCalledWith({
        exam_date: null,
        daily_goal_minutes: 30,
        start_diagnostic: false,
      })
    })
    expect(await screen.findByText('Dashboard')).toBeDefined()
  })

  it('diagnostikani tanlasa real diagnostika routeiga o‘tadi', async () => {
    const user = userEvent.setup()
    vi.mocked(authClient.completeOnboarding).mockResolvedValue({
      state: {
        ...incompleteState,
        completed: true,
        daily_goal_minutes: 45,
        onboarding_completed_at: '2099-01-01T00:00:00.000Z',
      },
      next_action: 'diagnostic',
    })

    renderPage()
    await screen.findByDisplayValue('Ali')
    await user.click(screen.getByRole('button', { name: '45 daq' }))
    await user.click(screen.getByRole('button', { name: /Diagnostikani boshlash/ }))

    await waitFor(() => {
      expect(authClient.completeOnboarding).toHaveBeenCalledWith({
        exam_date: null,
        daily_goal_minutes: 45,
        start_diagnostic: true,
      })
    })
    expect(await screen.findByText('Diagnostika')).toBeDefined()
  })

  it('profil nomi saqlanmasa onboardingni yakunlamaydi', async () => {
    const user = userEvent.setup()
    const updateProfile = vi.fn().mockResolvedValue({
      data: null,
      error: new Error('Profilni saqlashda xatolik'),
    })
    mockUseAuth.mockReturnValue({ displayName: 'Ali', updateProfile })

    renderPage()
    await screen.findByDisplayValue('Ali')
    await user.click(screen.getByRole('button', { name: 'Hozircha o‘tkazib yuborish' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Profilni saqlashda xatolik')
    expect(authClient.completeOnboarding).not.toHaveBeenCalled()
  })
})
