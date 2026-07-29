import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { DailyExercise } from '../../../data/dailyLessons'
import ExerciseCard from '../ExerciseCard'

// ── Mocks: AudioButton (speechSynthesis) va gameFeel (haptik/vibration) jsdom'da yo'q ──
vi.mock('../../ui/AudioButton', () => ({
  AudioButton: () => <button aria-label="audio">🔊</button>,
}))
vi.mock('../../../lib/gameFeel', () => ({
  feelAnswer: vi.fn(),
}))

// Boshqaruvchi (controlled) komponent — render uchun yordamchi
function renderCard(ex: DailyExercise, opts?: { answers?: string[]; submitted?: boolean }) {
  const onChange = vi.fn()
  const utils = render(
    <ExerciseCard
      ex={ex}
      num={1}
      total={5}
      answers={opts?.answers ?? []}
      onChange={onChange}
      submitted={opts?.submitted ?? false}
    />,
  )
  return { onChange, ...utils }
}

describe('ExerciseCard', () => {
  describe('fill-blank', () => {
    const ex: DailyExercise = {
      id: 1, type: 'fill-blank', instruction: 'To\'ldiring',
      question: 'I ___ a student.', blanks: ['am'], explanation: 'be fe\'li',
    }

    it('savol matnini va inputni ko\'rsatadi', () => {
      renderCard(ex)
      expect(screen.getByText(/a student/)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('___')).toBeInTheDocument()
    })

    it('input o\'zgarsa onChange chaqiriladi', () => {
      const { onChange } = renderCard(ex)
      fireEvent.change(screen.getByPlaceholderText('___'), { target: { value: 'am' } })
      expect(onChange).toHaveBeenCalledWith(0, 'am')
    })

    it('to\'g\'ri javob bilan submit qilinsa "+10 XP" ko\'rsatadi', () => {
      renderCard(ex, { answers: ['am'], submitted: true })
      expect(screen.getByText(/\+10 XP/)).toBeInTheDocument()
    })

    it('noto\'g\'ri javobda to\'g\'ri javobni ko\'rsatadi', () => {
      renderCard(ex, { answers: ['is'], submitted: true })
      expect(screen.getByText(/To'g'ri javob/)).toBeInTheDocument()
    })
  })

  describe('multiple-choice', () => {
    const ex: DailyExercise = {
      id: 2, type: 'multiple-choice', instruction: 'Tanlang',
      question: 'Choose correct:', options: ['go', 'goes', 'going', 'gone'],
      correct: 'goes', explanation: '3-shaxs +s',
    }

    it('barcha variantlarni ko\'rsatadi', () => {
      renderCard(ex)
      for (const opt of ex.options) expect(screen.getByText(opt)).toBeInTheDocument()
    })

    it('variant bosilsa onChange(0, opt) chaqiriladi', () => {
      const { onChange } = renderCard(ex)
      fireEvent.click(screen.getByText('goes'))
      expect(onChange).toHaveBeenCalledWith(0, 'goes')
    })
  })

  // ── F2-5: passage (kontekstli fill-blank) ──
  describe('passage', () => {
    const ex: DailyExercise = {
      id: 3, type: 'passage', instruction: 'Matnni to\'ldiring',
      passage: 'He ___(1) taller than me, and she is the ___(2) of all.',
      blanks: ['is', 'best'], explanation: 'comparative/superlative',
    }

    it('matn va har bo\'sh joy uchun input ko\'rsatadi', () => {
      renderCard(ex)
      expect(screen.getByText(/taller than me/)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('(1)')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('(2)')).toBeInTheDocument()
    })

    it('to\'g\'ri javoblar bilan submit "+10 XP"', () => {
      renderCard(ex, { answers: ['is', 'best'], submitted: true })
      expect(screen.getByText(/\+10 XP/)).toBeInTheDocument()
    })

    it('noto\'g\'ri javobda izoh ko\'rsatadi', () => {
      renderCard(ex, { answers: ['are', 'worst'], submitted: true })
      expect(screen.getByText(/comparative\/superlative/)).toBeInTheDocument()
    })
  })

  // ── F7-3: connection (elaborative encoding) ──
  describe('connection', () => {
    const ex: DailyExercise = {
      id: 4, type: 'connection', instruction: 'O\'z misolingiz',
      prompt: 'Comparative bilan 3 ta gap yozing:',
      hints: ['... is taller ...', '... is the best ...'],
      exampleAnswer: 'My sister is older than me.',
    }

    it('prompt, hint chiplari va textarea ko\'rsatadi', () => {
      renderCard(ex)
      expect(screen.getByText(/3 ta gap yozing/)).toBeInTheDocument()
      expect(screen.getByText(/is taller/)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/o'z misolingizni yozing/i)).toBeInTheDocument()
    })

    it('javob yozilib submit qilinsa namuna javobni ko\'rsatadi', () => {
      renderCard(ex, { answers: ['I am taller than my brother.'], submitted: true })
      expect(screen.getByText(/Namuna javob/)).toBeInTheDocument()
      expect(screen.getByText(/My sister is older than me/)).toBeInTheDocument()
      expect(screen.getByText(/Ajoyib/)).toBeInTheDocument()
    })

    it('bo\'sh javob bilan submit qilinsa rag\'batlantiruvchi xabar', () => {
      renderCard(ex, { answers: [''], submitted: true })
      expect(screen.getByText(/Keyingi safar o'z misolingizni/)).toBeInTheDocument()
    })
  })
})
