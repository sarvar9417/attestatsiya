import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MODULES } from '../data/contentTree'
import ProfessionalPracticePage from '../pages/ProfessionalPracticePage'

function renderHub() {
  return render(
    <MemoryRouter>
      <ProfessionalPracticePage />
    </MemoryRouter>,
  )
}

describe('pedagogika yagona tayyorgarlik sahifasi', () => {
  it('shows three blueprint groups, official quotas and the 15-question route', () => {
    renderHub()
    const section = screen.getByRole('region', { name: 'Pedagogika o‘quv bo‘limlari' })
    const cards = within(section).getAllByRole('article')
    expect(cards).toHaveLength(3)
    expect(cards[0].textContent).toContain('36–40')
    expect(cards[1].textContent).toContain('41–47')
    expect(cards[2].textContent).toContain('48–50')
    expect(screen.getByRole('link', { name: /15 savollik sinov/ }).getAttribute('href'))
      .toBe('/exam/pedagogik_15')
  })

  it('keeps all 18 topic labels aligned with the canonical learning catalog', () => {
    const { container } = renderHub()
    const details = container.querySelectorAll('details')
    const codes = ['M14', 'M15', 'M16']
    expect(details).toHaveLength(3)
    let total = 0
    for (const code of codes) {
      const topicList = MODULES.find(module => module.id === code)?.subtopics ?? []
      total += topicList.length
      for (const topic of topicList) {
        expect(screen.getByText(topic.title)).toBeTruthy()
      }
    }
    expect(total).toBe(18)
    expect(screen.getByText('Mavzular (7)')).toBeTruthy()
    expect(screen.getByText('Mavzular (8)')).toBeTruthy()
    expect(screen.getByText('Mavzular (3)')).toBeTruthy()
  })

  it('provides study, history and remediation navigation without unverifiable source-key claims', () => {
    renderHub()
    expect(screen.getByRole('link', { name: 'Nazariyadan boshlash' }).getAttribute('href')).toBe('/learn/M15')
    const links = screen.getAllByRole('link', { name: 'Mavzularni o‘rganish' })
    expect(links.map(link => link.getAttribute('href'))).toEqual(['/learn/M14', '/learn/M15', '/learn/M16'])
    expect(screen.getByRole('link', { name: 'Natijalar tarixi' }).getAttribute('href')).toBe('/history')
    expect(screen.getByRole('link', { name: 'Xatolarni qayta ishlash' }).getAttribute('href')).toBe('/review')
    expect(screen.getByText(/Tarixiy test to‘plamlaridagi javoblar/)).toBeTruthy()
  })
})
