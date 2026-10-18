import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TopicView from '../components/learning/TopicView'

const mock = vi.hoisted(() => ({
  getTopicContent: vi.fn(),
  getLessonDetail: vi.fn(),
  getTopicTestPreflight: vi.fn(),
  getLessonTestQuestions: vi.fn(),
  checkQuestionAnswer: vi.fn(),
  syncTopicProgress: vi.fn(),
}))

vi.mock('../data/topicContent', () => ({
  getTopicContent: mock.getTopicContent,
}))
vi.mock('../features/content/contentApi', () => ({
  getLessonDetail: mock.getLessonDetail,
  getTopicTestPreflight: mock.getTopicTestPreflight,
}))
vi.mock('../features/content/lessonContentGateway', () => ({
  getLessonTestQuestions: mock.getLessonTestQuestions,
  checkQuestionAnswer: mock.checkQuestionAnswer,
}))
vi.mock('../lib/progressSync', () => ({
  syncTopicProgress: mock.syncTopicProgress,
}))

const base = {
  subtopicId: 'M03.01',
  title: 'MS Word — nazariya',
  theory: [{ type: 'definition', content: 'Nazariyani o‘rganish kerak.' }],
  questions: [],
}

function mount(onComplete: (correct: number, total: number) => void) {
  return render(<MemoryRouter>
    <TopicView moduleId="M03" subtopicId="M03.01" moduleTitle="Ofis dasturlari"
      onComplete={onComplete} onBack={vi.fn()} />
  </MemoryRouter>)
}

describe('TopicView strict lesson completion guard', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return [] }
    })
    vi.clearAllMocks()
    mock.getTopicContent.mockReturnValue({ ...base, kind: 'chapter' })
    mock.getLessonDetail.mockRejectedValue(new Error('No remote lesson'))
    mock.getTopicTestPreflight.mockResolvedValue({
      ready: false, required: 20, available: 5, duration_sec: 2400,
      reason: 'pool_insufficient', missing_required_objectives: [],
      critical_objective_gaps: [], coverage: [],
    })
    mock.getLessonTestQuestions.mockResolvedValue([])
    mock.syncTopicProgress.mockResolvedValue(undefined)
  })

  it('blocks completion of a normal lesson with only 5/20 questions', async () => {
    const onComplete = vi.fn()
    mount(onComplete)
    expect(await screen.findByText(/Hozir 5\/20 ta mos savol mavjud/i)).toBeInTheDocument()
    const buttons = screen.getAllByRole('button', { name: /mavzu testi tayyorlanmoqda|test hali tayyor emas/i })
    expect(buttons.length).toBeGreaterThan(0)
    for (const button of buttons) expect(button).toBeDisabled()
    expect(screen.queryByRole('button', { name: /mavzuni yakunlash/i })).not.toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('allows a real appendix to be read and completed even if its construct has 20 shared questions', async () => {
    mock.getTopicContent.mockReturnValue({ ...base, kind: 'appendix' })
    mock.getTopicTestPreflight.mockResolvedValue({
      ready: true, required: 20, available: 20, duration_sec: 2400,
      reason: 'ready', coverage: [], missing_required_objectives: [], critical_objective_gaps: [],
    })
    const user = userEvent.setup()
    const onComplete = vi.fn()
    mount(onComplete)
    await waitFor(() => expect(mock.getTopicTestPreflight).toHaveBeenCalled())
    const buttons = screen.getAllByRole('button', { name: /mavzuni yakunlash/i })
    expect(buttons.length).toBeGreaterThan(0)
    buttons.forEach(button => expect(button).toBeEnabled())
    expect(screen.queryByRole('button', { name: /bilimni tekshirish/i })).not.toBeInTheDocument()
    await user.click(buttons[0])
    expect(onComplete).toHaveBeenCalledWith(0, 0)
  })
})
