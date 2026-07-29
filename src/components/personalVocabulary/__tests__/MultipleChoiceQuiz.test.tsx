import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MultipleChoiceQuiz from '../MultipleChoiceQuiz'
import type { PersonalWord } from '../../../types/personalVocabulary'

vi.mock('../../../lib/openaiTts', () => ({
  speakNatural: vi.fn().mockResolvedValue(undefined),
}))

function word(id: number, english: string, uzbek: string): PersonalWord {
  return {
    id,
    user_id: 'user-1',
    english,
    uzbek,
    category: 'custom',
    level: 'A1',
    source: 'manual',
    box: 1,
    next_review: '2026-07-20',
    is_learned: false,
    correct_count: 0,
    wrong_count: 0,
    created_at: '2026-07-20T00:00:00Z',
    updated_at: '2026-07-20T00:00:00Z',
  }
}

describe('MultipleChoiceQuiz', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows a usable three-option fallback when fewer than four words exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1)
    const words = [
      word(1, 'cat', 'mushuk'),
      word(2, 'dog', 'it'),
      word(3, 'book', 'kitob'),
    ]
    render(
      <MultipleChoiceQuiz
        words={words}
        allWords={words}
        onComplete={vi.fn()}
        onExit={vi.fn()}
      />
    )

    expect(screen.getByText('cat')).toBeInTheDocument()
    expect(screen.getByText('mushuk')).toBeInTheDocument()
    expect(screen.getByText('it')).toBeInTheDocument()
    expect(screen.getByText('kitob')).toBeInTheDocument()
    expect(screen.queryByText('—')).not.toBeInTheDocument()
  })
})
