import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TheoryBlock } from '../components/learning/TopicView'

vi.mock('../features/content/contentApi', () => ({
  getLessonDetail: vi.fn(),
  getTopicTestPreflight: vi.fn(),
}))
vi.mock('../features/content/lessonContentGateway', () => ({
  getLessonTestQuestions: vi.fn(), checkQuestionAnswer: vi.fn(),
}))

function renderBlock(type: Parameters<typeof TheoryBlock>[0]['block']['type'], content: string) {
  return render(<MemoryRouter><TheoryBlock block={{ type, content }} /></MemoryRouter>)
}

describe('source-backed static theory rendering', () => {
  it('renders headings as headings rather than plain text cards', () => {
    renderBlock('heading', 'Texnik ta’minotni tanlash')
    expect(screen.getByRole('heading', { name: 'Texnik ta’minotni tanlash' })).toBeInTheDocument()
  })

  it('shows emphasis and a page source without raw Markdown tokens', () => {
    const { container } = renderBlock('definition', '**OCR** belgilarni tanish. @@Cambridge+ 10–11, PDF 38–40@@')
    expect(screen.getByText('OCR').tagName).toBe('STRONG')
    expect(screen.getByText('Cambridge+ 10–11, PDF 38–40')).toBeInTheDocument()
    expect(container.textContent).not.toContain('**')
    expect(container.textContent).not.toContain('@@')
  })

  it('renders source as attribution and scenarios as readable prose', () => {
    renderBlock('source', 'ICT 5-sinf, PDF 43–47')
    expect(screen.getByLabelText('Foydalanilgan manba')).toBeInTheDocument()
    renderBlock('case', 'OMR — **test varaqalari** uchun.')
    expect(screen.getByText('test varaqalari').tagName).toBe('STRONG')
  })

  it('renders populated table metadata even without markdown content', () => {
    render(<MemoryRouter><TheoryBlock block={{
      type: 'table', content: '',
      headers: ['Texnologiya', 'Vazifa'], rows: [['OMR', 'Belgini o‘qish']],
    }} /></MemoryRouter>)
    expect(screen.getByRole('columnheader', { name: 'Texnologiya' })).toBeInTheDocument()
    expect(screen.getByText('Belgini o‘qish')).toBeInTheDocument()
  })

  it('does not execute source HTML as markup', () => {
    const { container } = renderBlock('text', '<script>alert(1)</script>')
    expect(container.querySelector('script')).toBeNull()
    expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument()
  })
})
