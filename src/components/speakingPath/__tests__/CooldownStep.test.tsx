import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CooldownStep from '../steps/CooldownStep'
import type { SpeakingDay } from '../../../data/speakingPath/types'

const mockDay: SpeakingDay = {
  day: 3, cefr: 'A0', title: 'Raqamlar', subtitle: 'Test',
  goalUz: 'Yoshingizni ayta olasiz', estMinutes: 12,
  grammarPoint: 'numbers',
  chunks: [
    { id: 'sp-d3-c1', en: 'I am twenty.', uz: 'Men yigirmaman.', grammarTip: 'Numbers tip' },
    { id: 'sp-d3-c2', en: 'How old are you?', uz: 'Necha yoshdasiz?' },
  ],
  vocab: [{ en: 'twenty', uz: 'yigirma' }],
  scenario: { topic: 'age', aiRole: 'a', userRole: 'b', opening: 'How old?', goalUz: 'test' },
  pronunciationFocus: { sound: '/t/', ipaExample: '/t/ — twenty, ten', tipUz: 'Tovush', tipEn: 'Sound', commonError: 'Xato' },
}

describe('CooldownStep', () => {
  it('shows congratulation with star rating', () => {
    render(<CooldownStep day={mockDay} speakScore={85} spokenSeconds={120} onNext={vi.fn()} />)
    expect(screen.getByText(/Ajoyib suhbat/)).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // minutes
    expect(screen.getByText('Talaffuz')).toBeInTheDocument()
  })

  it('shows grammar point and pronunciation focus', () => {
    render(<CooldownStep day={mockDay} speakScore={85} spokenSeconds={60} onNext={vi.fn()} />)
    expect(screen.getByText(/numbers/)).toBeInTheDocument()
    expect(screen.getByText(/Talaffuz fokusi/)).toBeInTheDocument()
  })

  it('transitions to recap on button click', () => {
    render(<CooldownStep day={mockDay} speakScore={70} spokenSeconds={30} onNext={vi.fn()} />)
    fireEvent.click(screen.getByText(/Bugungi iboralarni ko'rish/))
    expect(screen.getByText(/Bugun o'rgangan iboralaringiz/)).toBeInTheDocument()
  })

  it('recap shows all chunks with grammar tips', () => {
    render(<CooldownStep day={mockDay} speakScore={70} spokenSeconds={30} onNext={vi.fn()} />)
    fireEvent.click(screen.getByText(/Bugungi iboralarni ko'rish/))
    expect(screen.getByText('I am twenty.')).toBeInTheDocument()
    expect(screen.getByText('How old are you?')).toBeInTheDocument()
  })

  it('recall quiz works through to done', () => {
    const onNext = vi.fn()
    render(<CooldownStep day={mockDay} speakScore={90} spokenSeconds={90} onNext={onNext} />)
    // congrats → recap
    fireEvent.click(screen.getByText(/Bugungi iboralarni ko'rish/))
    // recap → quiz
    fireEvent.click(screen.getByText(/Tezkor recall/))
    expect(screen.getByText(/Mini recall/)).toBeInTheDocument()
    // answer first question
    fireEvent.click(screen.getByText(/Esladim!/))
    // first chunk revealed, next button says "Keyingi so'z"
    fireEvent.click(screen.getByText(/Keyingi so'z/))
    // second question
    fireEvent.click(screen.getByText(/Esladim!/))
    // last question revealed, button says "Natijani ko'rish"
    fireEvent.click(screen.getByText(/Natijani ko'rish/))
    // done
    expect(screen.getByText(/Kunni yakunlash/)).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Kunni yakunlash/))
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
