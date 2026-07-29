import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfusableBanner from '../ConfusableBanner'

const mockNavigate = vi.fn()

const samplePairs = [
  { pairId: '1', uzTitle: "ta'sir qilmoq / ta'sir", words: ['affect', 'effect'] },
  { pairId: '2', uzTitle: 'tanlamoq / juda', words: ['choose', 'chose'] },
]

describe('ConfusableBanner', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('pairs bosh bolsa null qaytaradi', () => {
    const { container } = render(
      <ConfusableBanner pairs={[]} navigate={mockNavigate} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('variant theory bolsa description korsatadi', () => {
    render(<ConfusableBanner pairs={samplePairs} navigate={mockNavigate} variant="theory" />)
    expect(screen.getByText(/chalkashlik/)).toBeTruthy()
  })

  it('variant speaking bolsa description korsatadi', () => {
    render(<ConfusableBanner pairs={samplePairs} navigate={mockNavigate} variant="speaking" />)
    expect(screen.getByText(/ishlatishda/)).toBeTruthy()
  })

  it('variant writing bolsa description korsatadi', () => {
    render(<ConfusableBanner pairs={samplePairs} navigate={mockNavigate} variant="writing" />)
    expect(screen.getByText(/ishlatishda/)).toBeTruthy()
  })

  it('barcha confusable sozlarni korsatadi', () => {
    render(<ConfusableBanner pairs={samplePairs} navigate={mockNavigate} />)
    expect(screen.getByText('affect / effect')).toBeTruthy()
    expect(screen.getByText('choose / chose')).toBeTruthy()
  })

  it('Batafsil tugmasi bosilganda navigate("/confusable-pairs") chaqiriladi', () => {
    render(<ConfusableBanner pairs={samplePairs} navigate={mockNavigate} />)
    fireEvent.click(screen.getByText(/Batafsil/))
    expect(mockNavigate).toHaveBeenCalledWith('/confusable-pairs')
  })

  it('Diqqat sarlavhasini korsatadi', () => {
    render(<ConfusableBanner pairs={samplePairs} navigate={mockNavigate} />)
    expect(screen.getByText(/Diqqat/)).toBeTruthy()
  })
})
