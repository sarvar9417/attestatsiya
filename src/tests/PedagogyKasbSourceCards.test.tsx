import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MODULES } from '../data/contentTree'
import {
  KASB_SOURCE_CARDS,
  KASB_PDF_EDITORIAL_CAUTION,
} from '../data/pedagogyKasbSourceCards'
import ProfessionalPracticePage from '../pages/ProfessionalPracticePage'

describe('pedagogning kasbiy standarti PDF provenance cards', () => {
  it('maps all seven canonical KS lessons to source body pages and scenarios', () => {
    const ids = MODULES.find(module => module.id === 'M14')?.subtopics.map(t => t.id)
    expect(ids).toBeDefined()
    expect(Object.keys(KASB_SOURCE_CARDS).sort()).toEqual([...ids!].sort())
    for (const [id, item] of Object.entries(KASB_SOURCE_CARDS)) {
      expect(item.section).toBe(Number(id.split('.')[1]))
      expect(item.pages).toMatch(/^\d+(?:–\d+)?$/)
      expect(item.evidence.length).toBeGreaterThan(65)
      expect(item.practice.length).toBeGreaterThan(40)
      expect(item.distinction.length).toBeGreaterThan(40)
    }
  })

  it('flags the actual page-1 inconsistency rather than reversing the section bodies', () => {
    expect(KASB_SOURCE_CARDS['M14.05'].topic).toMatch(/Xavfsiz rivojlantiruvchi/)
    expect(KASB_SOURCE_CARDS['M14.05'].section).toBe(5)
    expect(KASB_SOURCE_CARDS['M14.05'].pages).toBe('10–11')
    expect(KASB_SOURCE_CARDS['M14.06'].topic).toMatch(/kasbiy o‘sish/)
    expect(KASB_SOURCE_CARDS['M14.06'].section).toBe(6)
    expect(KASB_SOURCE_CARDS['M14.06'].pages).toBe('12')
    expect(KASB_PDF_EDITORIAL_CAUTION).toMatch(/1-betidagi 5\/6-soha/)
  })

  it('makes seven source cards and the editorial warning accessible on the learning hub', () => {
    render(<MemoryRouter><ProfessionalPracticePage /></MemoryRouter>)
    const section = screen.getByRole('region', { name: 'Pedagogika o‘quv bo‘limlari' })
    const m14 = within(section).getAllByRole('article')[0]
    const sourceSummaries = within(m14).getAllByText(/Kasb standarti qo‘llanmasi,.*-betlar/)
    expect(sourceSummaries).toHaveLength(7)
    expect(within(m14).getByText(/Qo‘llanmaning 1-betidagi 5\/6-soha/)).toBeDefined()
    expect(within(m14).getAllByText(/Asosiy mezon:/)).toHaveLength(7)
    expect(within(m14).getAllByText(/Vaziyatda qo‘llash:/)).toHaveLength(7)
    expect(within(m14).getAllByText(/Adashmang:/)).toHaveLength(7)
  })
})
