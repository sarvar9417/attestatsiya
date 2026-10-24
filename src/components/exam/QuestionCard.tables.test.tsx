import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import QuestionCard from './QuestionCard'
import AnswerOption from './AnswerOption'
import type { ExamQuestion } from './exam-data'

const bookTable = [
  'MS Access dasturidagi Book jadvali:', '',
  '| BookTitle | BookSubject | BookStatus | Author |',
  '|---|---|---|---|',
  '| His Dark Materials | Fantasy | Available | Philip Pullman |',
  '| Jane Eyre | Novel | Available | Charlotte Brontë |',
  '', 'Qaysi kitoblar natijada chiqadi?',
].join('\n')

const excelTable = [
  'MS Excel jadvali:', '',
  '| Qator | A | B | C |',
  '|---:|---:|---:|---:|',
  '| 1 | 10 | 20 | 30 |',
  '| 2 | 11 | 21 | 31 |',
].join('\n')

const baseQuestion: ExamQuestion = {
  id: 'book', number: 1, subject: 'Informatika',
  cognitiveLevel: 'application', difficulty: 3,
  stem_md: bookTable,
  options: [1, 2, 3, 4].map(i => ({
    id: String(i), side: 'a' as const, content_md: 'Variant ' + i,
  })),
}

describe('shared learner question table rendering', () => {
  it('shows Access table columns and rows in the demo question card', () => {
    render(<QuestionCard
      question={baseQuestion}
      markedForReview={false}
      saved={false}
      disabled={false}
      onSelectAnswer={vi.fn()}
      onToggleReview={vi.fn()}
    />)
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4)
    expect(within(table).getAllByRole('row')).toHaveLength(3)
    expect(within(table).getByText('His Dark Materials')).toBeInTheDocument()
    expect(screen.getByText('Qaysi kitoblar natijada chiqadi?')).toBeInTheDocument()
    expect(document.body.textContent).not.toContain('|---|')
  })

  it('renders Excel-style numerical tables in answer options without changing selection', () => {
    const onClick = vi.fn()
    render(<AnswerOption
      letter="A"
      label={excelTable}
      selected={false}
      onClick={onClick}
    />)
    const option = screen.getByRole('button')
    const table = within(option).getByRole('table')
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4)
    expect(within(table).getAllByRole('row')).toHaveLength(3)
    expect(within(table).getByText('31')).toBeInTheDocument()
    option.click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders HTML table source as code, not as executable HTML markup', () => {
    render(<QuestionCard
      question={{ ...baseQuestion, stem_md: 'HTML misol:\n\n```html\n<table><tr><td>A</td></tr></table>\n```' }}
      markedForReview={false}
      saved={false}
      disabled={false}
      onSelectAnswer={vi.fn()}
      onToggleReview={vi.fn()}
    />)
    expect(screen.queryByRole('table')).toBeNull()
    expect(screen.getByText('<table><tr><td>A</td></tr></table>')).toBeInTheDocument()
  })
})
