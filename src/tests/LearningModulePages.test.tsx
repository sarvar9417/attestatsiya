import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LearningPage from '../pages/LearningPage'
import ModulePage from '../pages/ModulePage'
import type { CatalogModule } from '../features/content/catalog'
import type { ModuleProgress } from '../store/progressStore'

const mocks = vi.hoisted(() => ({
  useCatalog: vi.fn(),
  useProgressStore: vi.fn(),
  topicView: vi.fn(),
}))

vi.mock('../hooks/useCatalog', () => ({
  useCatalog: mocks.useCatalog,
}))

vi.mock('../store/progressStore', () => ({
  useProgressStore: mocks.useProgressStore,
}))

vi.mock('../components/learning/TopicView', () => ({
  default: (props: { subtopicId: string; onBack: () => void }) => {
    mocks.topicView(props)
    return (
      <div>
        <p>Topic view: {props.subtopicId}</p>
        <button type="button" onClick={props.onBack}>Back topic</button>
      </div>
    )
  },
}))

const modules: CatalogModule[] = [
  {
    id: 'M01',
    code: 'M01',
    title: 'Axborot va raqamli savodxonlik',
    description: 'Axborot asoslari va kodlash',
    section: 'specialty',
    examQuestionCount: 3,
    source: 'static',
    subtopics: [
      {
        id: 'M01.01',
        code: 'M01.01',
        title: 'Axborot tushunchasi',
        description: 'Axborotning asosiy xususiyatlari',
      },
      {
        id: 'M01.02',
        code: 'M01.02',
        title: 'Axborot hajmi',
        description: 'Bit, bayt va hajm hisoblash',
      },
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

const emptyProgress: ModuleProgress = {
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
  M16: emptyProgress,
}

function renderLearning() {
  return render(
    <MemoryRouter initialEntries={['/learn']}>
      <Routes>
        <Route path="/learn" element={<LearningPage />} />
        <Route path="/learn/:moduleId" element={<div>Module route</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

function renderModule(path = '/learn/M01') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/learn/:moduleId" element={<ModulePage />} />
        <Route path="/learn" element={<div>Learning route</div>} />
        <Route path="/exam/bolim/:moduleId" element={<div>Module exam</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Learning va Module Figma UI', () => {
  beforeEach(() => {
    mocks.useCatalog.mockReturnValue({ modules })
    mocks.useProgressStore.mockReturnValue({
      getModuleProgress: (moduleId: string) =>
        progressByModule[moduleId] ?? emptyProgress,
      completeTopic: vi.fn(),
    })
    mocks.topicView.mockClear()
  })

  it('Learning sahifasi real progress va qidiruvni ko‘rsatadi', async () => {
    const user = userEvent.setup()
    renderLearning()

    expect(screen.getByRole('heading', { name: 'O‘rganish' })).toBeDefined()
    expect(screen.getByText('1 / 3')).toBeDefined()
    expect(screen.getByText('33%')).toBeDefined()

    await user.type(
      screen.getByRole('textbox', { name: 'Modul yoki mavzu qidirish' }),
      'metodika',
    )

    expect(
      screen.getAllByRole('heading', { name: 'Informatika o‘qitish metodikasi' }).length,
    ).toBeGreaterThan(0)
    expect(
      screen.queryByRole('heading', { name: 'Axborot va raqamli savodxonlik' }),
    ).toBeNull()
  })

  it('Learning modul kartasi module routega olib boradi', async () => {
    const user = userEvent.setup()
    renderLearning()

    await user.click(
      screen.getByRole('heading', { name: 'Axborot va raqamli savodxonlik' }),
    )

    expect(await screen.findByText('Module route')).toBeDefined()
  })

  it('Module sahifasi tugallangan va joriy mavzuni ajratadi', async () => {
    const user = userEvent.setup()
    renderModule()

    expect(
      screen.getByRole('heading', { name: 'Axborot va raqamli savodxonlik' }),
    ).toBeDefined()
    expect(screen.getByText('50%')).toBeDefined()
    expect(screen.getByText('Tugallangan')).toBeDefined()
    expect(screen.getByText('Davom ettirish')).toBeDefined()

    await user.click(screen.getByRole('heading', { name: 'Axborot hajmi' }))

    expect(await screen.findByText('Topic view: M01.02')).toBeDefined()
    expect(mocks.topicView).toHaveBeenCalled()
  })

  it('Module sinovi tugmasi xavfsiz exam routega yo‘naltiradi', async () => {
    const user = userEvent.setup()
    renderModule()

    await user.click(
      screen.getByRole('button', { name: 'Modul sinovini boshlash' }),
    )

    expect(await screen.findByText('Module exam')).toBeDefined()
  })

  it('noma’lum modul uchun xavfsiz topilmadi holatini beradi', () => {
    renderModule('/learn/UNKNOWN')

    expect(
      screen.getByRole('heading', { name: 'Bo‘lim topilmadi' }),
    ).toBeDefined()
  })
})
