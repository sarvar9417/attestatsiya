import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BlueprintStrip from '../components/dashboard/BlueprintStrip'
import { BLUEPRINT_GROUPS, EXAM_RULES } from '../data/blueprint2026'

describe('BlueprintStrip', () => {
  it('15 rasmiy guruhni 3:2:5:3:2:3:3:3:2:5:2:2:5:7:3 nisbatida chizadi', () => {
    render(<BlueprintStrip />)

    expect(screen.getByRole('heading', { name: 'Imtihon blueprinti' })).toBeDefined()
    expect(screen.getByText('Nisbat: 3:2:5:3:2:3:3:3:2:5:2:2:5:7:3')).toBeDefined()

    const list = screen.getByRole('list', { name: 'Blueprint guruhlari' })
    expect(list.children).toHaveLength(15)

    const counts = BLUEPRINT_GROUPS.map(group => {
      const segment = screen.getByTestId(`blueprint-segment-${group.code}`)
      expect(segment.getAttribute('data-question-count')).toBe(String(group.questionCount))
      expect((segment as HTMLElement).style.flexGrow).toBe(String(group.questionCount))
      return Number(segment.getAttribute('data-question-count'))
    })

    expect(counts).toEqual([3, 2, 5, 3, 2, 3, 3, 3, 2, 5, 2, 2, 5, 7, 3])
    expect(counts.reduce((sum, value) => sum + value, 0)).toBe(EXAM_RULES.totalQuestions)
  })

  it('rasmiy 35+5+7+3 section taqsimotini ko‘rsatadi', () => {
    render(<BlueprintStrip />)

    expect(screen.getByText('Mutaxassislik — 35')).toBeDefined()
    expect(screen.getByText('Kasb standarti — 5')).toBeDefined()
    expect(screen.getByText('Pedagogika — 7')).toBeDefined()
    expect(screen.getByText('Metodika — 3')).toBeDefined()
    expect(screen.getByText('120 daqiqa · 100 ball')).toBeDefined()
  })
})
