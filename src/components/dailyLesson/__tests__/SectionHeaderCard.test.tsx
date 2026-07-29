import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionHeaderCard from '../SectionHeaderCard'

const sampleSection = {
  title: "Boshlang'ich",
  desc: 'Asosiy qoidalar',
  color: 'bg-emerald-500',
  icon: '🌱',
  ids: [1, 2, 3],
}

function renderCard(overrides?: {
  section?: typeof sampleSection | null
  sectionIndex?: number
  totalSections?: number
  exerciseCount?: number
}) {
  return render(
    <SectionHeaderCard
      section={overrides !== undefined && 'section' in overrides ? overrides.section! : sampleSection}
      sectionIndex={overrides?.sectionIndex ?? 0}
      totalSections={overrides?.totalSections ?? 3}
      exerciseCount={overrides?.exerciseCount ?? 10}
    />,
  )
}

describe('SectionHeaderCard', () => {
  it('section null bolsa null qaytaradi', () => {
    const { container } = renderCard({ section: null })
    expect(container.firstChild).toBeNull()
  })

  it('section icon va titleni korsatadi', () => {
    renderCard()
    const titleEl = screen.getByText((content) => content.includes("Boshlang'ich"))
    expect(titleEl).toBeTruthy()
  })

  it('descriptionni korsatadi', () => {
    renderCard()
    expect(screen.getByText('Asosiy qoidalar')).toBeTruthy()
  })

  it('togri bosqich raqamini korsatadi', () => {
    renderCard({ sectionIndex: 1, totalSections: 4 })
    expect(screen.getByText('Bosqich 2 / 4')).toBeTruthy()
  })

  it('mashq sonini korsatadi', () => {
    renderCard({ exerciseCount: 7 })
    expect(screen.getByText('7')).toBeTruthy()
    expect(screen.getByText('ta mashq')).toBeTruthy()
  })

  it('section.color klass sifatida qollaniladi', () => {
    const { container } = renderCard()
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('bg-emerald-500')
  })
})
