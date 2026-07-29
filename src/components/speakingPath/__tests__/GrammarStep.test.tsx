import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GrammarStep from '../steps/GrammarStep'
import type { SpeakingDay } from '../../../data/speakingPath/types'

const dayWithGrammar: SpeakingDay = {
  day: 1, cefr: 'A0', title: 'Test', subtitle: 'Test',
  goalUz: 'Test', estMinutes: 10, grammarPoint: 'be (am/is/are)',
  chunks: [
    { id: 'sp-d1-c1', en: 'Hello!', uz: 'Salom!', grammarTip: "'Hello' — norasmiy salom.", commonMistake: "'Hello' ni /heləʊ/ deb aytma.", stressWord: 'HELLO' },
    { id: 'sp-d1-c2', en: 'My name is Aziz.', uz: 'Mening ismim Aziz.', grammarTip: "'My name is …' — o'zingizni tanishtirish." },
  ],
  scenario: { topic: 'test', aiRole: 'a', userRole: 'b', opening: 'Hi', goalUz: 'test' },
}

const dayWithoutGrammar: SpeakingDay = {
  ...dayWithGrammar,
  grammarPoint: undefined,
  chunks: [
    { id: 'sp-d1-c3', en: 'Hi!', uz: 'Salom!' },
  ],
}

const onNext = vi.fn()

describe('GrammarStep', () => {
  it('renders grammar point badge', () => {
    render(<GrammarStep day={dayWithGrammar} onNext={onNext} />)
    expect(screen.getByText('be (am/is/are)')).toBeInTheDocument()
  })

  it('renders chunks with stress badges', () => {
    render(<GrammarStep day={dayWithGrammar} onNext={onNext} />)
    expect(screen.getByText('Stress: HELLO')).toBeInTheDocument()
  })

  it('expands grammar details on click', () => {
    render(<GrammarStep day={dayWithGrammar} onNext={onNext} />)
    // Click the button element that contains the chunk text
    const helloBtn = screen.getByText('Hello!').closest('button')!
    fireEvent.click(helloBtn)
    expect(screen.getByText(/norasmiy salom/)).toBeInTheDocument()
    expect(screen.getByText(/Xato ehtimoli/)).toBeInTheDocument()
  })

  it('shows empty state when no grammar tips', () => {
    render(<GrammarStep day={dayWithoutGrammar} onNext={onNext} />)
    expect(screen.getByText(/maxsus grammatika qoidasi yo'q/)).toBeInTheDocument()
  })

  it('calls onNext when continue button clicked', () => {
    render(<GrammarStep day={dayWithGrammar} onNext={onNext} />)
    fireEvent.click(screen.getByText(/Eshitish qadamiga o'tish/))
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
