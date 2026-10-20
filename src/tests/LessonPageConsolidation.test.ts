import { describe, expect, it } from 'vitest'
import { splitBalancedSections } from '../components/learning/theory/BookReader'
import { TOPIC_CONTENT, type TheoryBlock } from '../data/topicContent'

const block = (type: TheoryBlock['type'], content: string): TheoryBlock => ({ type, content })

describe('TASK-345 compact semantic lesson pages', () => {
  it('keeps the two-dimensional list explanation, example and Python code together', () => {
    const lesson = [
      block('heading', 'Sikl va filtrlash'),
      block('text', 'Sikl bosqichlari. '.repeat(110)),
      block('heading', 'Ikki o‘lchovli ro‘yxat'),
      block('text', 'm[i][j] avval i-satrni, so‘ng j-ustunni belgilaydi.'),
      block('example', 'Ishlangan misol 4'),
      block('code', 'm = [[1,2,3],[4,5,6]]\nprint(m[1][0] + m[0][2])'),
      block('note', 'Satr va ustun indekslarini chalkashtirmang.'),
    ]
    const pages = splitBalancedSections(lesson)
    expect(pages).toHaveLength(2)
    expect(pages[1].title).toBe('Ikki o‘lchovli ro‘yxat')
    expect(pages[1].continued).toBe(false)
    expect(pages[1].blocks).toEqual(lesson.slice(2))
  })

  it('joins consecutive micro-headings while keeping all internal headings visible', () => {
    const lesson = [
      block('heading', 'Ta’rif'),
      block('definition', 'Tushuncha'),
      block('heading', 'Misol'),
      block('example', 'Birinchi misol'),
      block('heading', 'Mashq'),
      block('task', 'Mashq matni'),
    ]
    const pages = splitBalancedSections(lesson)
    expect(pages).toHaveLength(1)
    expect(pages[0].blocks).toEqual(lesson)
    expect(pages[0].blocks.filter(b => b.type === 'heading')).toHaveLength(3)
  })

  it('does not create a one-block continuation at the end of a long explanation', () => {
    const lesson = [
      block('heading', 'Matritsa'),
      block('text', 'Matritsa xususiyatlari. '.repeat(220)),
      block('text', 'Elementlarni o‘zgartirish. '.repeat(160)),
      block('example', 'Namuna'),
      block('code', 'print(matrix[1][0])'),
    ]
    const pages = splitBalancedSections(lesson)
    expect(pages.flatMap(p => p.blocks)).toEqual(lesson)
    expect(pages.at(-1)?.blocks.length).toBeGreaterThan(1)
  })

  it('preserves every static lesson block in source order without touching tests', () => {
    for (const [id, content] of Object.entries(TOPIC_CONTENT)) {
      const pages = splitBalancedSections(content.theory)
      expect(pages.flatMap(page => page.blocks), id).toEqual(content.theory)
      expect(pages.every(page => page.blocks.length > 0), id).toBe(true)
      expect(pages.every(page => page.title.length > 0), id).toBe(true)
    }
  })
})
