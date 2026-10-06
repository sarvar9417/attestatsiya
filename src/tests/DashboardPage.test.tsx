import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import type { CatalogModule } from '../features/content/catalog'
import type { ModuleProgress } from '../store/progressStore'

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  useCatalog: vi.fn(),
  useProgressStore: vi.fn(),
}))

vi.mock('../hooks/useAuth', () => ({
  useAuth: mocks.useAuth,
}))

vi.mock('../hooks/useCatalog', () => ({
  useCatalog: mocks.useCatalog,
}))

vi.mock('../store/progressStore', () => ({
  useProgressStore: mocks.useProgressStore,
}))

const modules: CatalogModule[] = [
  {
    id: 'M01',
    code: 'M01',
    title: 'Axborot va raqamli savodxonlik',
    description: 'Axborot asoslari',
    section: 'specialty',
    examQuestionCount: 3,
    source: 'static',
    subtopics: [
      { id: 'M01.01', code: 'M01.01', title: 'Axborot tushunchasi' },
      { id: 'M01.02', code: 'M01.02', title: 'Axborot hajmi' },
    ],
  },
  {
    id: 'M16',
    code: 'M16',
    title: 'Informatika o‘qitish metodikasi',
    description: 'Metodika',
    section: 'methodology',
    examQuestionCount: 3,
    source: 'static',
    subtopics: [
      { id: 'M16.01', code: 'M16.01', title: 'Darsni rejalash' },
    ],
  },
]

const defaultProgress: ModuleProgress = {
  completedTopics: [],
  topicProgress: {},
  mockExamScore: null,
  mockExamCompleted: false,
  mockExamAnswers: {},
}

const progressByModule: Record<string, ModuleProgress> = {
  M01: {
    completedTopics: ['M01.01'],
    topicProgress: {
      'M01.01': {
        completed: true,
        correctCount: 4,
        totalCount: 5,
        lastScore: 80,
      },
    },
    mockExamScore: null,
    mockExamCompleted: false,
    mockExamAnswers: {},
  },
  M16: defaultProgress,
}

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/learn" element={<div>Learning route</div>} />
        <Route path="/learn/:moduleId" element={<div>Module route</div>} />
        <Route path="/exam" element={<div>Exam route</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('DashboardPage Figma UI', () => {
  beforeEach(() => {
    mocks.useAuth.mockReturnValue({
      displayName: 'Sarvar Murodullayev',
    })
    mocks.useCatalog.mockReturnValue({ modules })
    mocks.useProgressStore.mockReturnValue({
      getModuleProgress: (moduleId: string) =>
        progressByModule[moduleId] ?? defaultProgress,
    })
  })

  it('real catalog va progressdan asosiy ko‘rsatkichlarni chiqaradi', () => {
    renderDashboard()

    expect(
      screen.getByRole('heading', { name: 'Xush kelibsiz, Sarvar!' }),
    ).toBeDefined()
    expect(
      screen.getByRole('heading', {
        name: 'Axborot va raqamli savodxonlik',
      }),
    ).toBeDefined()
    expect(screen.getByText('1 / 3')).toBeDefined()
    expect(screen.getAllByText('33%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('80%').length).toBeGreaterThan(0)
    expect(screen.getByText('Axborot tushunchasi')).toBeDefined()
  })

  it('davom ettirish tugmasi birinchi tugallanmagan modulga olib boradi', async () => {
    const user = userEvent.setup()
    renderDashboard()

    await user.click(
      screen.getByRole('button', { name: 'Darsni davom ettirish' }),
    )

    expect(await screen.findByText('Module route')).toBeDefined()
  })

  it('katalog bo‘sh bo‘lsa xavfsiz boshlash holatini ko‘rsatadi', async () => {
    const user = userEvent.setup()
    mocks.useCatalog.mockReturnValue({ modules: [] })

    renderDashboard()

    expect(screen.getByText('O‘quv rejangiz tayyor')).toBeDefined()
    expect(screen.getAllByText('0%').length).toBeGreaterThan(0)

    await user.click(
      screen.getByRole('button', { name: 'O‘rganishni boshlash' }),
    )

    expect(await screen.findByText('Learning route')).toBeDefined()
  })
})
