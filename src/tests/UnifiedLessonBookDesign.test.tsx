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

  it('keeps short related explanations and worked examples on one page', () => {
    const blocks = [
      block('heading', 'Ikki o‘lchovli ro‘yxat'),
      block('text', 'm[i][j] avval satrni, so‘ng ustunni bildiradi.'),
      block('example', 'Ishlangan misol 4'),
      block('code', 'm = [[1,2,3],[4,5,6]]\\nprint(m[1][0] + m[0][2])'),
      block('note', 'Satr va ustun indekslarini chalkashtirmang.'),
    ]
    const pages = splitBalancedSections(blocks)
    expect(pages).toHaveLength(1)
    expect(pages[0].title).toBe('Ikki o‘lchovli ro‘yxat')
    expect(pages[0].blocks).toEqual(blocks)
    expect(pages[0].continued).toBe(false)
    expect(() => splitBalancedSections(blocks, 0)).toThrow('Invalid block limit')
    expect(() => splitBalancedSections(blocks, 3, 0)).toThrow('Invalid character limit')
  })

  it('splits genuinely long lessons without detaching the example from its code', () => {
    const blocks = [
      block('heading', 'Algoritmlar'),
      block('text', 'Nazariya. '.repeat(180)),
      block('example', 'Misol bilan tushuntirish'),
      block('code', 'print(1 + 2)'),
      block('text', 'Qo‘shimcha mashqlar. '.repeat(150)),
      block('text', 'Mustahkamlash. '.repeat(120)),
    ]
    const pages = splitBalancedSections(blocks, 3, 2500)
    expect(pages.length).toBeGreaterThan(1)
    expect(pages.flatMap(page => page.blocks)).toEqual(blocks)
    expect(pages.some(page => page.continued)).toBe(true)
    const examplePage = pages.find(page => page.blocks.includes(blocks[2]))
    expect(examplePage?.blocks).toContain(blocks[3])
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

  it('shows a concise pedagogy lesson on one coherent page without fake pagination', () => {
    const progress = vi.fn()
    const { container } = render(
      <BookReader content={pedagogy} questionCount={0} requireTest
        onProgress={progress} onFinishReading={vi.fn()} />,
    )
    expect(container.querySelector('.book-navbar')).toBeNull()
    expect(container.querySelector('.book-box-definition')).toBeInTheDocument()
    expect(screen.getByText('Pedagogika')).toBeInTheDocument()
    expect(screen.getByText('Dars jarayonidagi vaziyat.')).toBeInTheDocument()
    expect(screen.getByText(/Xoliqov/)).toBeInTheDocument()
    expect(progress).toHaveBeenCalledWith(100)
    expect(screen.queryByRole('button', { name: /keyingi bo‘lim/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /test tayyorligi kutilmoqda/i })).toBeDisabled()
  })
})
