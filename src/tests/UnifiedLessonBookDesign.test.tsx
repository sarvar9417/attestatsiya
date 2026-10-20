import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookReader, {
  splitAdaptiveSections, splitBalancedSections, splitSections,
} from '../components/learning/theory/BookReader'
import BookBlock from '../components/learning/theory/BookBlock'
import type { TheoryBlock, TopicContent } from '../data/topicContent'

const block = (type: TheoryBlock['type'], content: string): TheoryBlock => ({ type, content })

const pedagogy: TopicContent = {
  subtopicId: 'M15.01',
  title: 'Pedagogika fanining asoslari',
  questions: [],
  theory: [
    block('definition', '**Pedagogika** — ta’lim va tarbiya haqidagi fan.'),
    block('note', 'Muhim tushunchalarni farqlang.'),
    block('table', '| Tushuncha | Vazifa |\n|---|---|\n| Didaktika | Ta’lim nazariyasi |\n| Tarbiya | Qadriyatlar |'),
    block('example', 'Dars jarayonidagi vaziyat.'),
    block('source', '**Manba izi:** Xoliqov, PDF 12-bet'),
  ],
}

describe('TASK-262 unified theory book presentation', () => {
  it('paginates old lessons without modifying, removing or reordering source blocks', () => {
    const pages = splitAdaptiveSections(pedagogy.theory)
    expect(pages).toHaveLength(2)
    expect(pages.flatMap(page => page.blocks)).toEqual(pedagogy.theory)
    expect(pages.map(page => page.title)).toEqual(['1-bo‘lim', '2-bo‘lim'])
  })

  it('keeps semantic headings together and validates page boundaries', () => {
    const blocks = [
      block('intro', 'Kirish'),
      block('heading', 'Birinchi bo‘lim'),
      block('text', 'A'),
      block('heading', 'Ikkinchi bo‘lim'),
      block('text', 'B'),
    ]
    const pages = splitAdaptiveSections(blocks, 2)
    expect(pages.flatMap(page => page.blocks)).toEqual(blocks)
    expect(pages[0].title).toBe('Birinchi bo‘lim')
    expect(pages.at(-1)?.title).toBe('Ikkinchi bo‘lim')
    expect(() => splitAdaptiveSections(blocks, 0)).toThrow('Invalid section size')
    expect(splitAdaptiveSections([])).toEqual(splitSections([]))
  })

  it('uses one balanced pagination contract without losing authored blocks', () => {
    const blocks = [
      block('heading', 'Uzun bo‘lim'),
      block('text', 'A'), block('text', 'B'), block('text', 'C'), block('text', 'D'),
      block('heading', 'Ikkinchi bo‘lim'), block('text', 'E'),
    ]
    const pages = splitBalancedSections(blocks, 3, 10_000)
    expect(pages.flatMap(page => page.blocks)).toEqual(blocks)
    expect(pages.map(page => page.title)).toEqual([
      'Uzun bo‘lim', 'Uzun bo‘lim — davomi', 'Ikkinchi bo‘lim',
    ])
    expect(pages[1].continued).toBe(true)
    expect(() => splitBalancedSections(blocks, 0)).toThrow('Invalid block limit')
    expect(() => splitBalancedSections(blocks, 3, 0)).toThrow('Invalid character limit')
  })

  it('renders markdown-only legacy tables using the textbook table classes', () => {
    const { container } = render(<BookBlock index={0} block={pedagogy.theory[2]} />)
    expect(container.querySelector('.book-table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Tushuncha' })).toBeInTheDocument()
    expect(screen.getByText('Ta’lim nazariyasi')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('supports old list content without structured items and safely escapes HTML', () => {
    render(<BookBlock index={0} block={block('list', 'Birinchi\nIkkinchi')} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    const { container } = render(<BookBlock index={1} block={block('text', '<script>alert(1)</script>')} />)
    expect(container.querySelector('script')).toBeNull()
    expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument()
  })

  it('offers the M01-like section navigation and retains progress through a pedagogy lesson', async () => {
    const user = userEvent.setup()
    const progress = vi.fn()
    const { container } = render(
      <BookReader content={pedagogy} questionCount={0} requireTest
        onProgress={progress} onFinishReading={vi.fn()} />,
    )
    expect(container.querySelector('.book-navbar')).toBeInTheDocument()
    expect(container.querySelector('.book-box-definition')).toBeInTheDocument()
    expect(screen.getByText('Pedagogika')).toBeInTheDocument()
    expect(progress).toHaveBeenCalledWith(50)
    expect(screen.getByText('Dars jarayonidagi vaziyat.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Keyingi/i }))
    expect(screen.getByText(/Xoliqov/)).toBeInTheDocument()
    expect(progress).toHaveBeenLastCalledWith(100)
    expect(screen.getByRole('button', { name: /test tayyorligi kutilmoqda/i })).toBeDisabled()
  })
})
