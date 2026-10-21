import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
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

const m13Legacy: CatalogModule = {
  id: 'M13',
  code: 'M13',
  title: 'Axborot xavfsizligi va raqamli xizmatlar',
  description: 'Xavfsizlik va raqamli xizmatlar',
  section: 'specialty',
  examQuestionCount: 2,
  source: 'static',
  subtopics: Array.from({ length: 11 }, (_, index) => ({
    id: `M13.${String(index + 1).padStart(2, '0')}`,
    code: `M13.${String(index + 1).padStart(2, '0')}`,
    title: index === 5 ? 'Elektron tijorat, to\'lov va blockchain' : `Legacy mavzu ${index + 1}`,
  })),
}

const m13Published: CatalogModule = {
  ...m13Legacy,
  source: 'db',
  subtopics: Array.from({ length: 7 }, (_, index) => ({
    id: `a0000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    code: `m13-axr-0${index + 1}`,
    title: index === 5 ? 'Kontent va auditoriya' : `Published bob ${index + 1}`,
  })),
}

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

function ModuleRoute() {
  const location = useLocation()
  return (
    <>
      <output data-testid="current-route">{location.pathname}{location.search}</output>
      <ModulePage />
    </>
  )
}

function moduleRoutes(path: string) {
  return (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/learn/:moduleId" element={<ModuleRoute />} />
        <Route path="/learn" element={<div>Learning route</div>} />
        <Route path="/exam/bolim/:moduleId" element={<div>Module exam</div>} />
      </Routes>
    </MemoryRouter>
  )
}

function renderModule(path = '/learn/M01') {
  return render(moduleRoutes(path))
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
  it('M13 ochiq eski darsini katalog 11 tadan 7 taga almashganda yo‘qotmaydi', async () => {
    const user = userEvent.setup()
    mocks.useCatalog.mockReturnValue({ modules: [m13Legacy], loading: false })
    const view = renderModule('/learn/M13')

    await user.click(screen.getByRole('heading', { name: "Elektron tijorat, to'lov va blockchain" }))
    expect(screen.getByText('Topic view: M13.06')).toBeDefined()
    expect(screen.getByTestId('current-route').textContent).toBe('/learn/M13?topic=M13.06')

    mocks.useCatalog.mockReturnValue({ modules: [m13Published], loading: false })
    view.rerender(moduleRoutes('/learn/M13'))

    expect(screen.getByText('Topic view: M13.06')).toBeDefined()
    expect(screen.queryByRole('heading', { name: 'Kontent va auditoriya' })).toBeNull()

    view.unmount()
    // Full browser reload reconstructs selection from its stable URL.
    renderModule('/learn/M13?topic=M13.06')
    expect(screen.getByText('Topic view: M13.06')).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Back topic' }))
    expect(screen.getByRole('heading', { name: 'Axborot xavfsizligi va raqamli xizmatlar' })).toBeDefined()
    expect(screen.getByText('7 mavzu · 2 attestatsiya savoli')).toBeDefined()
    expect(screen.getByTestId('current-route').textContent).toBe('/learn/M13')
  })

  it('M13 published dars havolasi qayta yuklanganda ham aynan shu bobni ochadi', async () => {
    const user = userEvent.setup()
    mocks.useCatalog.mockReturnValue({ modules: [m13Published], loading: false })
    const view = renderModule('/learn/M13')
    await user.click(screen.getByRole('heading', { name: 'Kontent va auditoriya' }))
    const publishedId = m13Published.subtopics[5].id
    expect(screen.getByText(`Topic view: ${publishedId}`)).toBeDefined()
    expect(screen.getByTestId('current-route').textContent).toBe(`/learn/M13?topic=${publishedId}`)

    view.unmount()
    renderModule(`/learn/M13?topic=${publishedId}`)
    expect(screen.getByText(`Topic view: ${publishedId}`)).toBeDefined()
  })

  it('M13 katalogi yuklanayotganda noto‘g‘ri 11 mavzuli ro‘yxatni ko‘rsatmaydi', () => {
    mocks.useCatalog.mockReturnValue({ modules: [m13Legacy], loading: true })
    renderModule('/learn/M13?topic=M13.06')
    expect(screen.getByRole('heading', { name: 'M13 darslari yuklanmoqda…' })).toBeDefined()
    expect(screen.queryByRole('heading', { name: "Elektron tijorat, to'lov va blockchain" })).toBeNull()
    expect(screen.queryByText('Topic view: M13.06')).toBeNull()
  })

  it('published M13da elektron tijorat qo‘shimcha darsi ochiladi va 7 bob progressiga qo‘shilmaydi', async () => {
    const user = userEvent.setup()
    mocks.useCatalog.mockReturnValue({ modules: [m13Published], loading: false })
    mocks.useProgressStore.mockReturnValue({
      getModuleProgress: () => ({ ...emptyProgress, completedTopics: ['M13.06'] }),
      completeTopic: vi.fn(),
    })
    renderModule('/learn/M13')
    expect(screen.getByText('0 / 7 mavzu')).toBeDefined()
    expect(screen.getByText('7 mavzu · 2 attestatsiya savoli')).toBeDefined()

    await user.click(screen.getByRole('button', { name: "Elektron tijorat, to'lov va blockchain" }))
    expect(screen.getByText('Topic view: M13.06')).toBeDefined()
    expect(screen.getByTestId('current-route').textContent).toBe('/learn/M13?topic=M13.06')
  })

  it('M13 noto‘g‘ri topic query parametridan xavfsiz qaytadi', () => {
    mocks.useCatalog.mockReturnValue({ modules: [m13Published], loading: false })
    renderModule('/learn/M13?topic=INVALID')
    expect(screen.getByRole('heading', { name: 'Axborot xavfsizligi va raqamli xizmatlar' })).toBeDefined()
    expect(screen.queryByText('Topic view: INVALID')).toBeNull()
  })

})
