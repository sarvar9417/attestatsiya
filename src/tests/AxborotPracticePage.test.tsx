import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AxborotPracticePage from '../pages/AxborotPracticePage'
import { backendGateway } from '../features/exam/backendGateway'
import { allowedAxborotSizes } from '../features/axb/chapters'

vi.mock('../features/exam/backendGateway', () => ({
  backendGateway: { getAxborotChapters: vi.fn() },
}))

describe('19 chapter AXB practice', () => {
  it('offers only sizes supported by published pool', () => {
    expect(allowedAxborotSizes(30)).toEqual([10,15,30])
    expect(allowedAxborotSizes(27)).toEqual([10,15])
    expect(allowedAxborotSizes(3)).toEqual([3])
    expect(allowedAxborotSizes(0)).toEqual([])
  })

  it('renders actual 16th chapter 3 questions and never presents a false 30-question option', async () => {
    vi.mocked(backendGateway.getAxborotChapters!).mockResolvedValue(
      Array.from({length:19},(_,i) => ({
        chapter_no: i+1, total_pdf:30,
        published_count: i===15 ? 3 : i===18 ? 27 : 30,
        review_count: i===15 ? 27 : i===18 ? 3 : 0,
      }))
    )
    render(<MemoryRouter><AxborotPracticePage /></MemoryRouter>)
    expect(await screen.findByText('16-bob')).toBeDefined()
    expect(screen.getByRole('link', {name:/3 savol/}).getAttribute('href')).toBe('/exam/axb_bob?chapter=16&count=3')
    expect(screen.getByRole('link', {name:/30 savol/}).getAttribute('href')).not.toContain('chapter=16')
    expect(screen.getByText('Attestatsiyadagi nozik farqlar va diagnostika')).toBeDefined()
  })
})
