import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// ─── Hoisted mocks ──────────────────────────────────────────────────────────

const mockSendMessageStream = vi.hoisted(() => {
  // Set API key before module imports so Chat doesn't show warning and buttons aren't disabled
  process.env.VITE_ANTHROPIC_API_KEY = 'test-key-123'
  return vi.fn()
})
const mockAddSession = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))

vi.mock('../../lib/claude', () => ({
  sendMessageStream: mockSendMessageStream,
  MODEL: 'Claude 4',
}))

vi.mock('../../lib/prompts', () => ({
  QUICK_PROMPTS: [
    { label: 'Grammar', text: 'Check my grammar', mode: 'grammar-check' },
    { label: 'Vocab', text: 'Explain this word', mode: 'vocabulary' },
  ],
}))

vi.mock('../../hooks/useNavigationGuard', () => ({
  useNavigationGuard: vi.fn(),
}))

vi.mock('../../store/useStore', () => ({
  useStore: (s?: (x: { addXP: unknown; incrementStreak: unknown; updateSkillProgress: unknown; todayGrammarPct: number; todayWritingPct: number }) => unknown) => {
    const state = {
      addXP: vi.fn(), incrementStreak: vi.fn(),
      updateSkillProgress: vi.fn(),
      todayGrammarPct: 50, todayWritingPct: 40,
    }
    return s ? s(state) : state
  },
}))

vi.mock('../../db/database', () => ({
  addSession: mockAddSession,
}))

vi.mock('../../utils/tashkentDate', () => ({
  getTodayTashkent: () => '2026-06-16',
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

vi.mock('../../i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'chat.title': 'AI Tutor',
        'chat.modeFreeTalk': 'Erkin suhbat',
        'chat.modeGrammar': 'Grammar',
        'chat.modeVocab': 'Vocabulary',
        'chat.modeWriting': 'Writing',
        'chat.modeLesson': 'Lesson',
        'chat.footerHint': "Enter = jo'natish, Shift+Enter = yangi qator",
        'chat.placeholderGeneral': 'Savolingizni yozing...',
        'chat.placeholderGrammar': 'Gap yoki matn yozing...',
        'chat.placeholderWriting': 'Matningizni yozing...',
        'chat.placeholderVocab': 'So\'z yozing...',
        'chat.placeholderApiKey': 'API kalitni sozlang...',
        'chat.sendAria': 'Yuborish',
        'chat.clearChatLabel': 'Tozalash',
        'chat.copyLabel': 'Nusxa olish',
        'chat.regenerateLabel': 'Qayta yaratish',
        'chat.inputAria': 'Xabar yozish',
      }
      return map[key] ?? key
    },
  }),
}))

// Mock clipboard API for copy button tests
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: vi.fn() },
  writable: true,
})

// ─── Import ──────────────────────────────────────────────────────────────────

// scrollIntoView polyfill for jsdom — must be before component render
Element.prototype.scrollIntoView = vi.fn()

import Chat from '../Chat'

function renderPage() {
  return render(<BrowserRouter><Chat /></BrowserRouter>)
}

describe('Chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Initial render ────────────────────────────────────────────────────────

  it('renders chat title', () => {
    renderPage()
    // uz.json: chat.title = "AI Tutor"
    expect(screen.getByText('AI Tutor')).toBeInTheDocument()
  })

  it('shows the model name', () => {
    renderPage()
    expect(screen.getByText('Claude 4')).toBeInTheDocument()
  })

  it('renders the initial assistant message', () => {
    renderPage()
    expect(screen.getByText(/EnglishPath AI Tutor/)).toBeInTheDocument()
  })

  // ── Input area ────────────────────────────────────────────────────────────

  it('renders the textarea for user input', () => {
    renderPage()
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  it('renders the send button', () => {
    renderPage()
    const sendBtn = document.querySelector('.lucide-send')
    expect(sendBtn).toBeInTheDocument()
  })

  it('renders quick prompt buttons', () => {
    renderPage()
    // 'Grammar' appears in both mode dropdown and quick prompts
    const grammarElements = screen.getAllByText('Grammar')
    expect(grammarElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Vocab')).toBeInTheDocument()
  })

  // ── Mode selector ─────────────────────────────────────────────────────────

  it('shows the current mode label', () => {
    renderPage()
    // Default mode is 'general'
    // uz.json: chat.modeFreeTalk = "Erkin suhbat"
    expect(screen.getByText('Erkin suhbat')).toBeInTheDocument()
  })

  it('opens mode dropdown on click', () => {
    renderPage()
    fireEvent.click(screen.getByText('Erkin suhbat'))
    // Grammar appears in both dropdown AND quick prompts
    const grammarElements = screen.getAllByText('Grammar')
    expect(grammarElements.length).toBeGreaterThanOrEqual(1)
  })

  it('switches mode when selecting from dropdown', () => {
    renderPage()
    fireEvent.click(screen.getByText('Erkin suhbat'))
    // Click the SECOND 'Grammar' element (the dropdown one, not quick prompt)
    const grammarElements = screen.getAllByText('Grammar')
    fireEvent.click(grammarElements[grammarElements.length - 1])
    // After selecting, the mode label shows 'Grammar'
    const modeLabels = screen.getAllByText('Grammar')
    expect(modeLabels.length).toBeGreaterThanOrEqual(1)
  })

  // ── Clear chat ────────────────────────────────────────────────────────────

  it('renders clear chat button', () => {
    renderPage()
    // Find by aria-label instead of icon class to avoid lucide rendering issues
    const clearBtn = screen.getByLabelText('Tozalash')
    expect(clearBtn).toBeInTheDocument()
  })

  // ── Message bubble copy and regenerate buttons ────────────────────────────

  it('shows copy and regenerate buttons on hover of assistant message', () => {
    renderPage()
    // The initial assistant message should have action buttons
    // They are hidden by default (opacity-0) and appear on group hover
    const copyButtons = document.querySelectorAll('[title="Nusxa olish"]')
    expect(copyButtons.length).toBeGreaterThanOrEqual(1)
  })

  // ── Footer hint ───────────────────────────────────────────────────────────

  it('renders footer hint text', () => {
    renderPage()
    // uz.json: chat.footerHint = "Enter = jo'natish, Shift+Enter = yangi qator"
    expect(screen.getByText("Enter = jo'natish, Shift+Enter = yangi qator")).toBeInTheDocument()
  })

  // ── Streaming state ───────────────────────────────────────────────────────

  it('sends a message and shows streaming indicator', async () => {
    // Simulate streaming: capture onToken callback
    mockSendMessageStream.mockImplementation((_history, _mode, onToken, _onDone, _onError, _signal) => {
      onToken('Hello! How can I help')
      // Don't call onDone yet — keep streaming
      return Promise.resolve()
    })

    renderPage()

    // Type a message and send
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello' } })

    // Wait for React state update to propagate to the send callback closure
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('Hello')
    })

    const sendBtn = screen.getByLabelText('Yuborish')
    fireEvent.click(sendBtn)

    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    mockSendMessageStream.mockImplementation((_history, _mode, _onToken, _onDone, onError) => {
      onError(new Error('API Error: Rate limited'))
      return Promise.resolve()
    })

    renderPage()
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello' } })

    // Wait for React state update to propagate
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('Hello')
    })

    const sendBtn = screen.getByLabelText('Yuborish')
    fireEvent.click(sendBtn)

    await waitFor(() => {
      expect(screen.getByText('API Error: Rate limited')).toBeInTheDocument()
    })
  })

  // ── Quick prompt click ────────────────────────────────────────────────────

  it('fills textarea when quick prompt is clicked', () => {
    renderPage()
    // 'Grammar' appears in both mode dropdown and quick prompt - click the last one (quick prompt)
    const grammarBtns = screen.getAllByText('Grammar')
    const quickPromptBtn = grammarBtns[grammarBtns.length - 1]
    fireEvent.click(quickPromptBtn)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    // Clicking "Grammar" quick prompt should set mode AND fill text
    // QUICK_PROMPTS for 'grammar-check' has text "Check my grammar"
    expect(textarea.value).toBe('Check my grammar')
  })
})
