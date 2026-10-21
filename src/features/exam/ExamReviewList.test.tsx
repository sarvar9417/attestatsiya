import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import ExamReviewList from './ExamReviewList'
import type { ExamReviewItem } from './contracts'

const id = (n: number) => '10000000-0000-4000-8000-' + String(n).padStart(12, '0')
const options = [
  { id: id(1), side: 'a' as const, content_md: 'Yashil / qizil' },
  { id: id(2), side: 'a' as const, content_md: 'Qizil / yashil' },
  { id: id(3), side: 'a' as const, content_md: 'Qizil / qizil' },
]

function entry(patch: Partial<ExamReviewItem> = {}): ExamReviewItem {
  return {
    order_idx: 1, format: 'Y1', stem_md: 'Qanday rang?', construct: 'Excel',
    options, assets: [], user_answer: { option_id: id(2) },
    key: { option_id: id(3) }, is_correct: false,
    explanation_md: 'Ikkala natija manfiy.', ...patch,
  }
}

describe('ExamReviewList finalized answer analysis', () => {
  it('shows the actual wrong user choice in red and the server key in green', () => {
    render(<ExamReviewList items={[entry()]} />)
    expect(screen.getByText('Qanday rang?')).toBeTruthy()
    expect(screen.getByText('Qizil / yashil').closest('[data-answer-state]')?.getAttribute('data-answer-state')).toBe('wrong')
    expect(screen.getByText('Qizil / qizil').closest('[data-answer-state]')?.getAttribute('data-answer-state')).toBe('correct')
    expect(screen.getByText('Siz tanlagan javob')).toBeTruthy()
    expect(screen.getByText('To‘g‘ri javob')).toBeTruthy()
    expect(screen.getByText('Ikkala natija manfiy.')).toBeTruthy()
  })

  it('does not falsely mark a skipped question as wrong, supports category filters', () => {
    render(<ExamReviewList items={[
      entry({ order_idx: 1, is_correct: true, user_answer: { option_id: id(3) } }),
      entry({ order_idx: 2, stem_md: 'Javobsiz savol', user_answer: null, is_correct: null }),
      entry({ order_idx: 3, stem_md: 'Xato savol' }),
    ]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Javobsiz (1)' }))
    expect(screen.getByText('Javobsiz savol')).toBeTruthy()
    expect(screen.queryByText('Xato savol')).toBeNull()
    expect(screen.getByRole('link', { name: 'Savol 2: Javobsiz' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Xato (1)' }))
    expect(screen.getByText('Xato savol')).toBeTruthy()
    expect(screen.queryByText('Javobsiz savol')).toBeNull()
  })

  it('renders server Y2 pair corrections without inventing a key', () => {
    const left = { id: id(11), side: 'a' as const, content_md: 'Bir' }
    const rightA = { id: id(12), side: 'b' as const, content_md: '1' }
    const rightB = { id: id(13), side: 'b' as const, content_md: '2' }
    render(<ExamReviewList items={[entry({
      format: 'Y2', options: [left, rightA, rightB],
      user_answer: { pairs: { [id(11)]: id(13) } },
      key: { pairs: { [id(11)]: id(12) } },
    })]} />)
    expect(screen.getByText('To‘g‘ri moslik:')).toBeTruthy()
    expect(screen.getByText('Siz tanlagan:')).toBeTruthy()
  })

  it('renders ordering with position-level differences', () => {
    render(<ExamReviewList items={[entry({
      format: 'Y3', options: options.slice(0, 2),
      user_answer: { order: [id(2), id(1)] },
      key: { order: [id(1), id(2)] },
    })]} />)
    expect(screen.getByText('To‘g‘ri tartib')).toBeTruthy()
    expect(screen.getByText('Sizning tartibingiz')).toBeTruthy()
    const chosen = screen.getByText('Sizning tartibingiz').parentElement
    expect(chosen && within(chosen).getAllByRole('listitem')).toHaveLength(2)
  })

  it('handles older review payload with no options without fabricated answers', () => {
    render(<ExamReviewList items={[entry({ options: undefined, key: null })]} />)
    expect(screen.getByText(/javob variantlari tahlil ma’lumotida mavjud emas/i)).toBeTruthy()
    expect(screen.queryByText('To‘g‘ri javob')).toBeNull()
  })

  it('keeps pedagogical rationale but hides PDF candidate metadata in the finished exam review', () => {
    render(<ExamReviewList items={[entry({
      explanation_md: 'Ustoz yangi metodni hamkasbidan o‘rganib darsda ishlatdi. Manba javobi shu.\n\nManba: to‘plam.pdf (baza kandidati 66). PDF muallif kaliti saqlandi.',
    })]} />)
    expect(screen.getByText('Ustoz yangi metodni hamkasbidan o‘rganib darsda ishlatdi.')).toBeTruthy()
    expect(screen.queryByText(/Manba javobi|baza kandidati|muallif kaliti/i)).toBeNull()
  })

  it('renders imported Word/Excel literal escapes as a table and readable explanation', () => {
    render(<ExamReviewList items={[entry({
      stem_md: 'Excel:\\n\\n| Meva | kg |\\n|---|---:|\\n| Olma | 24 |',
      explanation_md: 'Izoh:&#x20;&#x43;trl+B',
    })]} />)
    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.getByRole('cell', { name: 'Olma' })).toBeTruthy()
    expect(screen.getByText('Izoh: Ctrl+B')).toBeTruthy()
    expect(screen.queryByText(/&#x20;/)).toBeNull()
  })
})
