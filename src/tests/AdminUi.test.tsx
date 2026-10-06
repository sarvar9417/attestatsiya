import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  typedSupabase: {
    from: mocks.from,
  },
}))

vi.mock('../pages/admin/ModulesPage', () => ({
  default: () => <div>Modules admin route</div>,
}))

vi.mock('../pages/admin/QuestionsPage', () => ({
  default: () => <div>Questions admin route</div>,
}))

vi.mock('../pages/admin/AttemptsPage', () => ({
  default: () => <div>Attempts admin route</div>,
}))

function setupCounts(overrides?: Partial<Record<string, number>>) {
  const counts: Record<string, number> = {
    modules: 16,
    questions: 3842,
    blueprints: 1,
    profiles: 1248,
    ...overrides,
  }

  mocks.from.mockImplementation((table: string) => ({
    select: vi.fn().mockResolvedValue({
      count: counts[table] ?? 0,
      error: null,
    }),
  }))
}

describe('Admin Figma UI', () => {
  beforeEach(() => {
    mocks.from.mockReset()
    setupCounts()
  })

  it('AdminDashboard real database countlarni chiqaradi', async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Admin dashboard' }),
    ).toBeDefined()
    expect(screen.getByText('Tezkor boshqaruv')).toBeDefined()

    await waitFor(() => {
      expect(screen.getByText('3 842')).toBeDefined()
      expect(screen.getByText('1 248')).toBeDefined()
    })

    expect(mocks.from).toHaveBeenCalledWith('modules')
    expect(mocks.from).toHaveBeenCalledWith('questions')
    expect(mocks.from).toHaveBeenCalledWith('blueprints')
    expect(mocks.from).toHaveBeenCalledWith('profiles')
  })

  it('database xatosida xavfsiz alert ko‘rsatadi', async () => {
    mocks.from.mockImplementation((table: string) => ({
      select: vi.fn().mockResolvedValue({
        count: table === 'modules' ? 16 : 0,
        error: table === 'questions' ? { message: 'failed' } : null,
      }),
    }))

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Admin statistikani yuklab bo‘lmadi.')
  })

  it('AdminLayout mavjud admin routelarini saqlaydi', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/" element={<div>Main site</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getAllByText('Admin panel').length).toBeGreaterThan(0)
    const questionLinks = screen.getAllByRole('link', { name: /Savollar/ })
    expect(questionLinks.length).toBeGreaterThan(0)

    await user.click(questionLinks[0])
    expect(await screen.findByText('Questions admin route')).toBeDefined()
  })
})
