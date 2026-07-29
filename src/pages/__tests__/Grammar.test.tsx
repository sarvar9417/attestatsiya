import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// ─── Mock data ──────────────────────────────────────────────────────────────

const mockExercise1 = vi.hoisted(() => ({
  id: 1, type: 'fill-blank' as const,
  instruction: 'Fill in the correct form',
  question: 'I ___ a student.',
  blanks: ['am'],
  explanation: 'With "I" we use "am".',
}))

const mockExercise2 = vi.hoisted(() => ({
  id: 2, type: 'multiple-choice' as const,
  instruction: 'Choose the correct word',
  question: 'They ___ from London.',
  options: ['am', 'is', 'are', 'be'] as [string, string, string, string],
  correct: 'are',
  explanation: 'With "they" we use "are".',
}))

const mockExercise3 = vi.hoisted(() => ({
  id: 3, type: 'error-correction' as const,
  instruction: 'Find the mistake',
  question: 'She are my sister.',
  errorPart: 'are',
  correct: 'She is my sister.',
  explanation: 'With "she" use "is".',
}))

const mockExercise4 = vi.hoisted(() => ({
  id: 4, type: 'transformation' as const,
  instruction: 'Make negative',
  question: 'I am tired.',
  hint: 'I am...',
  correct: 'I am not tired.',
  explanation: 'Add "not" after "am".',
}))

const mockTopic = vi.hoisted(() => ({
  id: 'verb-to-be',
  title: 'Verb "to be" — am/is/are',
  subtitle: "Bo'lish fe'li",
  level: 'A1' as const,
  week: 1,
  tag: 'essential',
  formula: 'I am / He/She/It is / You/We/They are',
  formulaRows: [
    { label: 'I', structure: 'I am (I\'m) happy.', color: 'blue' as const },
    { label: 'He/She/It', structure: 'She is a teacher.', color: 'purple' as const },
  ],
  usedFor: ['Talking about who you are', 'Describing people'],
  examples: [
    { en: 'I am a student.', uz: 'Men talabaman.' },
    { en: 'She is my mother.', uz: 'U mening onam.' },
  ],
  exercises: [mockExercise1, mockExercise2, mockExercise3, mockExercise4],
}))

const mockGrammarTopics = vi.hoisted(() => [mockTopic])

// ─── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('../../services/grammarService', () => ({
  fetchGrammarTopics: vi.fn().mockResolvedValue(mockGrammarTopics),
  saveGrammarResult: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../../lib/grammarColors', () => ({
  GRAMMAR_COLORS: {
    tenses: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dark: 'dark:bg-blue-900/30 dark:text-blue-300' },
    modals: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', dark: 'dark:bg-purple-900/30 dark:text-purple-300' },
    prepositions: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dark: 'dark:bg-amber-900/30 dark:text-amber-300' },
    conditionals: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dark: 'dark:bg-red-900/30 dark:text-red-300' },
    articles: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dark: 'dark:bg-green-900/30 dark:text-green-300' },
    passives: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700', dark: 'dark:bg-teal-900/30 dark:text-teal-300' },
    reported: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dark: 'dark:bg-orange-900/30 dark:text-orange-300' },
    vocabulary: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', dark: 'dark:bg-pink-900/30 dark:text-pink-300' },
    phrasal: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', dark: 'dark:bg-indigo-900/30 dark:text-indigo-300' },
    other: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-700', dark: 'dark:bg-gray-900/30 dark:text-gray-300' },
  },
}))

vi.mock('../../store/useStore', () => ({
  useStore: (s?: (x: { addXP: ReturnType<typeof vi.fn>; updateSkillProgress: ReturnType<typeof vi.fn> }) => unknown) => {
    const state = { addXP: vi.fn(), updateSkillProgress: vi.fn() }
    return s ? s(state) : state
  },
}))

const mockGetGrammarFeedback = vi.hoisted(() => vi.fn())

vi.mock('../../lib/claude', () => ({
  getGrammarFeedback: mockGetGrammarFeedback,
}))

vi.mock('../../lib/monitoring', () => ({
  monitoring: { captureMessage: vi.fn(), captureException: vi.fn() },
}))

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } }) },
  },
}))

vi.mock('../../hooks/useNavigationGuard', () => ({
  useNavigationGuard: vi.fn(),
}))

vi.mock('../../components/grammar/GrammarDNAMap', () => ({
  GrammarDNAMap: ({ onTopicSelect }: { onTopicSelect?: (t: typeof mockTopic) => void }) => (
    <div data-testid="grammar-dna-map">
      <button data-testid="dna-map-select" onClick={() => onTopicSelect?.(mockTopic)}>DNA Select</button>
    </div>
  ),
}))

vi.mock('../../components/grammar/GrammarGlossary', () => ({
  default: () => <div data-testid="grammar-glossary" />,
}))

vi.mock('../../data/grammarGlossary', () => ({
  termUzBilingual: (en: string) =>
    en === 'Verb "to be" — am/is/are' ? "Bo'lish fe'li" : en,
}))

// ─── Import ─────────────────────────────────────────────────────────────────

import { MemoryRouter } from 'react-router-dom'
import Grammar from '../Grammar'

function renderPage() {
  return render(<BrowserRouter><Grammar /></BrowserRouter>)
}

function renderWithState(state: Record<string, unknown>) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/grammar', state }]}>
      <Grammar />
    </MemoryRouter>
  )
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Grammar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Loading state ─────────────────────────────────────────────────────────

  it('shows loading state initially', () => {
    renderPage()
    // uz.json: grammar.loading = "Mavzular yuklanmoqda..."
    expect(screen.getByText('Mavzular yuklanmoqda...')).toBeInTheDocument()
  })

  // ── Topic selector ────────────────────────────────────────────────────────

  it('renders topic selector after loading', async () => {
    renderPage()
    // uz.json: grammar.selectTitle = "Grammatika darslari"
    await waitFor(() => {
      expect(screen.getByText('Grammatika darslari')).toBeInTheDocument()
    })
    // uz.json: grammar.selectSubtitle = "Mavzuni tanlang va mashqlarni bajaring"
    expect(screen.getByText('Mavzuni tanlang va mashqlarni bajaring')).toBeInTheDocument()
  })

  it('renders GrammarDNAMap in the topic selector', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('grammar-dna-map')).toBeInTheDocument()
    })
  })

  it('renders GrammarGlossary in the topic selector', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('grammar-glossary')).toBeInTheDocument()
    })
  })

  it('renders topic cards with the topic title', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Verb "to be" — am/is/are')).toBeInTheDocument()
    })
  })

  it('shows level badge (A1) on topic card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('A1')).toBeInTheDocument()
    })
  })

  it('shows tag badge on topic card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('essential')).toBeInTheDocument()
    })
  })

  it('shows exercise count on topic card', async () => {
    renderPage()
    // uz.json: grammar.exerciseCount = "{count} ta mashq" → "4 ta mashq"
    await waitFor(() => {
      expect(screen.getByText(/4 ta mashq/)).toBeInTheDocument()
    })
  })

  it('shows XP on topic card', async () => {
    renderPage()
    // uz.json: grammar.xpLabel = "+{xp} XP" → "+40 XP"
    await waitFor(() => {
      expect(screen.getByText('+40 XP')).toBeInTheDocument()
    })
  })

  it('shows week label on topic card', async () => {
    renderPage()
    // uz.json: grammar.weekLabel = "{week}-hafta" → "📅 1-hafta" (with emoji prefix)
    await waitFor(() => {
      expect(screen.getByText(/1-hafta/)).toBeInTheDocument()
    })
  })

  // ── Topic selection → Explanation phase ──────────────────────────────────

  it('navigates to explanation phase when topic title is clicked', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    // uz.json: grammar.formulaLabel = "Formula"
    await waitFor(() => expect(screen.getByText(/Formula/)).toBeInTheDocument())
  })

  it('shows formula text in explanation phase', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => {
      expect(screen.getByText(mockTopic.formula)).toBeInTheDocument()
    })
  })

  it('shows "when to use" section in explanation', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    // uz.json: grammar.whenToUse = "Qachon ishlatiladi?"
    await waitFor(() => {
      expect(screen.getByText('Qachon ishlatiladi?')).toBeInTheDocument()
    })
  })

  it('shows examples in explanation', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => {
      expect(screen.getByText('I am a student.')).toBeInTheDocument()
      expect(screen.getByText('She is my mother.')).toBeInTheDocument()
    })
  })

  it('shows examples label in explanation', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    // uz.json: grammar.examplesLabel = "Misollar"
    await waitFor(() => {
      expect(screen.getByText('Misollar')).toBeInTheDocument()
    })
  })

  it('shows start exercise button in explanation', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    // uz.json: grammar.startExercise = "{count} ta mashqni boshlash → +{xp} XP"
    await waitFor(() => {
      expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument()
    })
  })

  it('back button returns to topic selector', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/Formula/)).toBeInTheDocument())

    // Back button
    fireEvent.click(screen.getByText('Orqaga'))
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
  })

  // ── Exercise phase ────────────────────────────────────────────────────────

  it('shows exercises when started from explanation', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())

    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))
    await waitFor(() => {
      expect(screen.getByText(mockTopic.title)).toBeInTheDocument()
    })
  })

  it('renders fill-blank title in exercise phase', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))

    // uz.json: grammar.fillBlankTitle = "📝 Bo'sh joyni to'ldiring"
    await waitFor(() => {
      expect(screen.getByText(/Bo'sh joyni to'ldiring/)).toBeInTheDocument()
    })
  })

  it('renders MC question title in exercise phase', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))

    // uz.json: grammar.mcTitle = "🔘 To'g'ri variantni tanlang"
    await waitFor(() => {
      expect(screen.getByText(/To'g'ri variantni tanlang/)).toBeInTheDocument()
    })
  })

  it('renders fill-blank question text parts', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))

    // Question "I ___ a student." is split by blank (_{3,}) into "I " and " a student."
    // Each part is in a nested span; use regex for broader matching
    await waitFor(() => {
      expect(screen.getByText(/a student\./)).toBeInTheDocument()
      // Fill-blank input with placeholder "___" should exist
      expect(screen.getAllByPlaceholderText('___').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders MC question options', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))

    // MC options are rendered as buttons; "are" appears in both MC and error correction
    await waitFor(() => {
      expect(screen.getByText('am')).toBeInTheDocument()
      expect(screen.getByText('is')).toBeInTheDocument()
      expect(screen.getAllByText('are').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('be')).toBeInTheDocument()
    })
  })

  // ── Submit → Result phase ─────────────────────────────────────────────────

  it('shows submit button in exercise phase', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))

    // uz.json: grammar.submitCheck = "Tekshirish (+{xp} XP)"
    await waitFor(() => {
      expect(screen.getByText(/Tekshirish/)).toBeInTheDocument()
    })
  })

  it('submit shows result view with score', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))
    await waitFor(() => expect(screen.getByText(/Tekshirish/)).toBeInTheDocument())

    // Answer first fill-blank correctly
    const inputs = screen.getAllByPlaceholderText('___')
    fireEvent.change(inputs[0], { target: { value: 'am' } })

    fireEvent.click(screen.getByText(/Tekshirish/))
    // uz.json: grammar.scoreLabel = "{correct}/{total} to'g'ri" → "1/4 to'g'ri"
    await waitFor(() => {
      expect(screen.getByText(/1\/4 to'g'ri/)).toBeInTheDocument()
    })
  })

  it('shows XP earned in result view', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))
    await waitFor(() => expect(screen.getByText(/Tekshirish/)).toBeInTheDocument())

    const inputs = screen.getAllByPlaceholderText('___')
    fireEvent.change(inputs[0], { target: { value: 'am' } })
    fireEvent.click(screen.getByText(/Tekshirish/))

    // +10 XP from 1 correct answer
    await waitFor(() => {
      expect(screen.getByText('+10 XP')).toBeInTheDocument()
    })
  })

  it('shows retry button after submit', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))
    await waitFor(() => expect(screen.getByText(/Tekshirish/)).toBeInTheDocument())

    const inputs = screen.getAllByPlaceholderText('___')
    fireEvent.change(inputs[0], { target: { value: 'am' } })
    fireEvent.click(screen.getByText(/Tekshirish/))

    // uz.json: grammar.retryButton = "Qayta urinish"
    await waitFor(() => {
      expect(screen.getByText('Qayta urinish')).toBeInTheDocument()
    })
  })

  // ── AI Feedback panel ─────────────────────────────────────────────────────

  it('shows AI feedback button after submit', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))
    await waitFor(() => expect(screen.getByText(/Tekshirish/)).toBeInTheDocument())

    const inputs = screen.getAllByPlaceholderText('___')
    fireEvent.change(inputs[0], { target: { value: 'am' } })
    fireEvent.click(screen.getByText(/Tekshirish/))

    // uz.json: grammar.aiButton = "✨ AI Tushuntirish — Claude tahlil qilsin"
    await waitFor(() => {
      expect(screen.getByText(/AI Tushuntirish/)).toBeInTheDocument()
    })
  })

  it('AI feedback button calls getGrammarFeedback on click', async () => {
    // jsdom doesn't implement scrollIntoView — AIFeedbackPanel uses it in useEffect
    Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || vi.fn()

    mockGetGrammarFeedback.mockImplementation(
      (
        _title: string,
        _level: string,
        _results: unknown[],
        onToken: (t: string) => void,
        onDone: () => void,
      ) => {
        onToken('Great job! Keep practicing!')
        onDone()
      },
    )

    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))
    await waitFor(() => expect(screen.getByText(/Tekshirish/)).toBeInTheDocument())

    const inputs = screen.getAllByPlaceholderText('___')
    fireEvent.change(inputs[0], { target: { value: 'am' } })
    fireEvent.click(screen.getByText(/Tekshirish/))

    await waitFor(() => {
      expect(screen.getByText(/AI Tushuntirish/)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/AI Tushuntirish/))
    await waitFor(() => {
      expect(screen.getByText('Great job! Keep practicing!')).toBeInTheDocument()
    })

    expect(mockGetGrammarFeedback).toHaveBeenCalledTimes(1)
  })

  // ── Navigation between phases ─────────────────────────────────────────────

  it('goes back to explanation from exercise phase', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/Formula/)).toBeInTheDocument())

    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))
    await waitFor(() => expect(screen.getByText(/Tekshirish/)).toBeInTheDocument())

    // uz.json: grammar.viewExplanation = "Tushuntirish"
    fireEvent.click(screen.getByText('Tushuntirish'))
    await waitFor(() => expect(screen.getByText(/Formula/)).toBeInTheDocument())
  })

  it('goes back to topic selector from explanation', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/Formula/)).toBeInTheDocument())

    fireEvent.click(screen.getByText('Orqaga'))
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
  })

  it('goes to other topics from result view', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))
    await waitFor(() => expect(screen.getByText(/Tekshirish/)).toBeInTheDocument())

    const inputs = screen.getAllByPlaceholderText('___')
    fireEvent.change(inputs[0], { target: { value: 'am' } })
    fireEvent.click(screen.getByText(/Tekshirish/))

    // uz.json: grammar.otherTopic = "Boshqa mavzu"
    await waitFor(() => {
      expect(screen.getByText('Boshqa mavzu')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Boshqa mavzu'))
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
  })

  // ── Header renders ────────────────────────────────────────────────────────

  it('shows book open icon in topic selector header', async () => {
    renderPage()
    await waitFor(() => {
      const bookIcon = document.querySelector('.lucide-book-open')
      expect(bookIcon).toBeInTheDocument()
    })
  })

  it('shows progress bar in exercise phase', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Verb "to be" — am/is/are'))
    await waitFor(() => expect(screen.getByText(/4 ta mashqni boshlash/)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/4 ta mashqni boshlash/))

    await waitFor(() => {
      const progressBar = document.querySelector('.bg-gray-100.rounded-full > div')
      expect(progressBar).toBeInTheDocument()
    })
  })

  // ── DNA Map interaction ───────────────────────────────────────────────────

  it('DNA Map select button triggers topic selection', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Grammatika darslari')).toBeInTheDocument())

    // Click on DNA Map's selection button
    fireEvent.click(screen.getByTestId('dna-map-select'))
    await waitFor(() => expect(screen.getByText(/Formula/)).toBeInTheDocument())
  })

  // ── Auto-selection from location state (GrammarReview → /grammar) ──────────────

  describe('auto-selection from reviewTopicId state', () => {
    it('skips topic selector and goes to explanation when reviewTopicId matches', async () => {
      renderWithState({ reviewTopicId: 'verb-to-be' })

      // Should NOT show the topic selector title
      await waitFor(() => {
        expect(screen.queryByText('Grammatika darslari')).not.toBeInTheDocument()
      })
      // Should go directly to explanation — shows formula
      expect(screen.getByText(mockTopic.formula)).toBeInTheDocument()
    })

    it('shows the matched topic title in explanation phase', async () => {
      renderWithState({ reviewTopicId: 'verb-to-be' })

      await waitFor(() => {
        expect(screen.getByText('Verb "to be" — am/is/are')).toBeInTheDocument()
      })
    })

    it('starts in topic selector when reviewTopicId does not match any topic', async () => {
      renderWithState({ reviewTopicId: 'nonexistent-topic' })

      await waitFor(() => {
        expect(screen.getByText('Grammatika darslari')).toBeInTheDocument()
      })
      // Should not show any topic's formula
      expect(screen.queryByText(mockTopic.formula)).not.toBeInTheDocument()
    })

    it('starts in topic selector when no reviewTopicId state', async () => {
      renderWithState({})

      await waitFor(() => {
        expect(screen.getByText('Grammatika darslari')).toBeInTheDocument()
      })
    })
  })
})
