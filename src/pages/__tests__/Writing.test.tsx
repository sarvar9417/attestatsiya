import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const mockPrompt = vi.hoisted(() => ({
  id: 'p1', type: 'opinion' as const, prompt: 'Do you agree or disagree?',
  tips: ['Write clearly'], wordLimit: 200, timeMinutes: 30,
}))

const mockStoreState = vi.hoisted(() => ({
  addXP: vi.fn(), updateSkillProgress: vi.fn(),
  currentDay: 10, currentLevel: 'B1',
}))

const mockFetchWritingPrompts = vi.hoisted(() => vi.fn().mockResolvedValue([mockPrompt]))
const mockGetDailyWritingPrompt = vi.hoisted(() => vi.fn(() => mockPrompt))
const mockSaveWritingResult = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockEvaluateWriting = vi.hoisted(() => vi.fn())

vi.mock('@/data/writingPrompts', () => ({ TYPE_LABEL: { opinion: 'Fikr' }, TYPE_COLOR: { opinion: 'text-blue-500' } }))
vi.mock('@/services/writingService', () => ({
  fetchWritingPrompts: mockFetchWritingPrompts,
  getDailyWritingPrompt: mockGetDailyWritingPrompt,
  saveWritingResult: mockSaveWritingResult,
}))
vi.mock('@/lib/claude', () => ({
  evaluateWriting: mockEvaluateWriting,
  analyzeWritingIELTS: vi.fn(),
  analyzeWritingErrors: vi.fn().mockResolvedValue([]),
}))
vi.mock('@/store/useStore', () => ({
  useStore: (s?: (x: typeof mockStoreState) => unknown) => s ? s(mockStoreState) : mockStoreState,
}))
vi.mock('@/lib/supabase', () => ({
  supabase: { auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } }) } },
}))
vi.mock('@/lib/monitoring', () => ({ monitoring: { captureMessage: vi.fn() } }))
vi.mock('../../components/writing/WritingHistory', () => ({ default: () => <div data-testid="writing-history" /> }))
vi.mock('../../hooks/useNavigationGuard', () => ({ useNavigationGuard: vi.fn() }))

import Writing from '../Writing'

function renderPage() { return render(<BrowserRouter><Writing /></BrowserRouter>) }

const mockScoreText = [
  'TASK_ACHIEVEMENT: 8', 'COHERENCE: 7', 'VOCABULARY: 6', 'GRAMMAR: 7',
  'FEEDBACK: Good work!', 'IMPROVED: Better version here',
].join('\n')

function setupEvaluate() {
  mockEvaluateWriting.mockImplementation((_p, _e, _l, _d, onDone, _err) => onDone(mockScoreText))
}

async function typeAndSubmit() {
  renderPage()
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
  fireEvent.change(screen.getByRole('textbox'), { target: { value: Array(200).fill('word').join(' ') } })
  fireEvent.click(screen.getByText('✨ Claude baholaydi'))
  await waitFor(() => expect(screen.getByText('Yozish natijasi')).toBeInTheDocument())
}

describe('Writing', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('shows skeleton while loading prompts', () => {
    const { container } = renderPage()
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders writing view when prompts loaded', async () => {
    renderPage()
    await waitFor(() => expect(screen.getAllByText("Yozish").length).toBeGreaterThanOrEqual(1))
    expect(screen.getByText('Bugungi vazifa · 10-kun')).toBeInTheDocument()
    expect(screen.getByText(mockPrompt.prompt)).toBeInTheDocument()
    expect(screen.getByText('Fikr')).toBeInTheDocument()
  })

  it('shows word count as user types', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'one two three four five' } })
    expect(screen.getByText(/5 \/ 200 so'z/)).toBeInTheDocument()
  })

  it('submit calls evaluateWriting', async () => {
    setupEvaluate()
    await typeAndSubmit()
    expect(mockEvaluateWriting).toHaveBeenCalledTimes(1)
  })

  it('shows scores in result view', async () => {
    setupEvaluate()
    await typeAndSubmit()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Task Achievement')).toBeInTheDocument()
  })

  it('shows feedback in result view', async () => {
    setupEvaluate()
    await typeAndSubmit()
    expect(screen.getByText('Good work!')).toBeInTheDocument()
  })

  it('shows improved version toggle', async () => {
    setupEvaluate()
    await typeAndSubmit()
    expect(screen.getByText('✨ Yaxshilangan versiya')).toBeInTheDocument()
    fireEvent.click(screen.getByText('✨ Yaxshilangan versiya'))
    expect(screen.getByText('Better version here')).toBeInTheDocument()
  })

  it('shows writing history in result view', async () => {
    setupEvaluate()
    renderPage()
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    fireEvent.change(screen.getByRole('textbox'), { target: { value: Array(200).fill('word').join(' ') } })
    fireEvent.click(screen.getByText('✨ Claude baholaydi'))
    await waitFor(() => expect(screen.getByText('Yozish natijasi')).toBeInTheDocument())
    expect(screen.getByTestId('writing-history')).toBeInTheDocument()
  })
})
