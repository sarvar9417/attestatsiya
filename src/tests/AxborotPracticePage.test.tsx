import { act, render, screen, waitFor } from '@testing-library/react'
import { StrictMode } from 'react'
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

  it('fits inside M01 without duplicate top-level navigation or a second back button', async () => {
    vi.mocked(backendGateway.getAxborotChapters!).mockResolvedValue(
      Array.from({ length: 19 }, (_, i) => ({
        chapter_no: i + 1, total_pdf: 30, published_count: 30, review_count: 0,
      }))
    )
    render(<MemoryRouter><AxborotPracticePage embedded /></MemoryRouter>)
    expect(await screen.findByText('19-bob')).toBeDefined()
    expect(screen.getByText('Axborot savollari banki — 19 bob')).toBeDefined()
    expect(screen.queryByRole('link', { name: /O‘rganishga qaytish/ })).toBeNull()
    expect(screen.getAllByRole('link', { name: /10 savol/ })).toHaveLength(19)
  })

  it('ignores a stale StrictMode catalog response that arrives after the latest one', async () => {
    let firstResolve: (value: { chapter_no: number; total_pdf: number; published_count: number; review_count: number }[]) => void = () => {}
    const first = new Promise<{ chapter_no: number; total_pdf: number; published_count: number; review_count: number }[]>(resolve => {
      firstResolve = resolve
    })
    const latest = Array.from({ length: 19 }, (_, i) => ({
      chapter_no: i + 1, total_pdf: 30,
      published_count: i === 15 ? 3 : 30,
      review_count: i === 15 ? 27 : 0,
    }))
    vi.mocked(backendGateway.getAxborotChapters!)
      .mockReset()
      .mockImplementationOnce(() => first)
      .mockResolvedValueOnce(latest)

    render(<StrictMode><MemoryRouter><AxborotPracticePage embedded /></MemoryRouter></StrictMode>)
    expect(await screen.findByText('16-bob')).toBeDefined()
    expect(screen.getByRole('link', { name: /3 savol/ })).toBeDefined()

    await act(async () => {
      firstResolve(Array.from({ length: 19 }, (_, i) => ({
        chapter_no: i + 1, total_pdf: 30,
        published_count: 30, review_count: 0,
      })))
    })
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /3 savol/ })).toBeDefined()
      expect(screen.getAllByRole('link', { name: /30 savol/ })
        .some(link => link.getAttribute('href')?.includes('chapter=16'))).toBe(false)
    })
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
    expect(screen.getAllByRole('link', {name:/30 savol/}).every(link => !link.getAttribute('href')?.includes('chapter=16'))).toBe(true)
    expect(screen.getByText('Attestatsiyadagi nozik farqlar va diagnostika')).toBeDefined()
  })
})
