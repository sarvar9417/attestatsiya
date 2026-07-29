import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SectionProgressBar from '../SectionProgressBar'

const defaultSections = [
  { title: 'Boshlang\'ich', icon: '🌱' },
  { title: 'Tayyorlov', icon: '📘' },
  { title: 'Mustahkamlash', icon: '💪' },
]

function renderBar(opts?: {
  sections?: { title: string; icon: string }[]
  completedSections?: Record<number, number>
  currentSection?: number
}) {
  const onJump = vi.fn()
  render(
    <SectionProgressBar
      sections={opts?.sections ?? defaultSections}
      completedSections={opts?.completedSections ?? {}}
      currentSection={opts?.currentSection ?? 0}
      onJumpToSection={onJump}
    />,
  )
  return { onJump }
}

describe('SectionProgressBar', () => {
  it('barcha sectionlarni ko\'rsatadi', () => {
    renderBar()
    for (const s of defaultSections) {
      expect(screen.getByText(s.icon)).toBeInTheDocument()
      expect(screen.getByText(s.title)).toBeInTheDocument()
    }
  })

  it('active sectionda primary rang qo\'llaniladi', () => {
    renderBar({ currentSection: 1 })
    const buttons = screen.getAllByRole('button')
    expect(buttons[1].querySelector('div')).toHaveClass('bg-primary-500')
  })

  it('completed sectionda green rang qo\'llaniladi', () => {
    renderBar({ completedSections: { 0: 5, 2: 3 } })
    const buttons = screen.getAllByRole('button')
    expect(buttons[0].querySelector('div')).toHaveClass('bg-green-500')
    expect(buttons[2].querySelector('div')).toHaveClass('bg-green-500')
    expect(buttons[1].querySelector('div')).toHaveClass('bg-gray-200')
  })

  it('bosilganda onJumpToSection chaqiriladi', () => {
    const { onJump } = renderBar()
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[2])
    expect(onJump).toHaveBeenCalledWith(2)
  })

  it('default (active emas, complete emas) section gray rang', () => {
    renderBar({ currentSection: 1, completedSections: { 0: 5 } })
    const buttons = screen.getAllByRole('button')
    expect(buttons[2].querySelector('div')).toHaveClass('bg-gray-200')
  })

  it('title hidden sm:inline klassga ega', () => {
    renderBar()
    for (const s of defaultSections) {
      expect(screen.getByText(s.title)).toHaveClass('hidden sm:inline')
    }
  })
})
