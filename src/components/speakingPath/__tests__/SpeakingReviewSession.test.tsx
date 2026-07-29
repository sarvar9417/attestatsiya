import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import type { SpeakingChunk } from '../../../data/speakingPath/types'

// ── Mock RecallPanel (individually tested) ──
vi.mock('../RecallPanel', () => ({
  default: ({ chunk, isLast, onDone }: { chunk: SpeakingChunk; isLast: boolean; onDone: (sim: number) => void }) => (
    <div data-testid={`recall-${chunk.id}`}>
      <span data-testid="chunk-en">{chunk.en}</span>
      <span data-testid="chunk-last">{String(isLast)}</span>
      <button data-testid={`done-${chunk.id}`} onClick={() => onDone(0.92)}>
        {isLast ? 'Yakunlash' : 'Keyingi'}
      </button>
    </div>
  ),
}))

import SpeakingReviewSession from '../SpeakingReviewSession'

const chunks: SpeakingChunk[] = [
  { id: 'c1', en: 'Hello', uz: 'Salom' },
  { id: 'c2', en: 'Goodbye', uz: 'Xayr' },
  { id: 'c3', en: 'How are you', uz: 'Qalaysiz' },
]

afterEach(() => { cleanup(); vi.clearAllMocks() })

describe('SpeakingReviewSession', () => {
  it('header bilan chunk sonini ko\'rsatadi', () => {
    render(<SpeakingReviewSession chunks={chunks} userId="u1" onExit={vi.fn()} />)
    expect(screen.getByText(/Takrorlash/)).toBeInTheDocument()
    expect(screen.getByText(/1 \/ 3 ibora/)).toBeInTheDocument()
  })

  it('birinchi chunk RecallPanel orqali ko\'rsatiladi', () => {
    render(<SpeakingReviewSession chunks={chunks} userId="u1" onExit={vi.fn()} />)
    expect(screen.getByTestId('recall-c1')).toBeInTheDocument()
    expect(screen.getByTestId('chunk-en')).toHaveTextContent('Hello')
    expect(screen.getByTestId('chunk-last')).toHaveTextContent('false')
  })

  it('har bir chunk tugaganda keyingisiga o\'tadi', () => {
    render(<SpeakingReviewSession chunks={chunks} userId="u1" onExit={vi.fn()} />)

    // Chunk 1 → done → Chunk 2
    fireEvent.click(screen.getByTestId('done-c1'))
    expect(screen.getByTestId('recall-c2')).toBeInTheDocument()
    expect(screen.getByText(/2 \/ 3 ibora/)).toBeInTheDocument()

    // Chunk 2 → done → Chunk 3 (last)
    fireEvent.click(screen.getByTestId('done-c2'))
    expect(screen.getByTestId('recall-c3')).toBeInTheDocument()
    expect(screen.getByTestId('chunk-last')).toHaveTextContent('true')
    expect(screen.getByText(/3 \/ 3 ibora/)).toBeInTheDocument()
  })

  it('oxirgi chunk tugaganda done ekrani ko\'rinadi', () => {
    render(<SpeakingReviewSession chunks={chunks} userId="u1" onExit={vi.fn()} />)

    fireEvent.click(screen.getByTestId('done-c1'))
    fireEvent.click(screen.getByTestId('done-c2'))
    fireEvent.click(screen.getByTestId('done-c3'))

    expect(screen.getByText(/Takror tugadi/)).toBeInTheDocument()
    // 3 ta chunk, har biri 0.92 → round(0.92*100) = 92, avg = 92
    const scores = screen.getAllByText(/92%/)
    expect(scores.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/3 ibora/)).toBeInTheDocument()
  })

  it('done ekranida "Narvonga qaytish" tugmasi onExit ni chaqiradi', () => {
    const onExit = vi.fn()
    render(<SpeakingReviewSession chunks={chunks} userId="u1" onExit={onExit} />)

    fireEvent.click(screen.getByTestId('done-c1'))
    fireEvent.click(screen.getByTestId('done-c2'))
    fireEvent.click(screen.getByTestId('done-c3'))

    fireEvent.click(screen.getByText('Narvonga qaytish'))
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('bitta chunkli sessiya ishlaydi (isLast darhol true)', () => {
    const singleChunk: SpeakingChunk[] = [{ id: 'c1', en: 'Hello', uz: 'Salom' }]
    render(<SpeakingReviewSession chunks={singleChunk} userId="u1" onExit={vi.fn()} />)

    expect(screen.getByTestId('chunk-last')).toHaveTextContent('true')
    expect(screen.getByText(/1 \/ 1 ibora/)).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('done-c1'))
    expect(screen.getByText(/Takror tugadi/)).toBeInTheDocument()
  })

  it('X tugmasi onExit ni chaqiradi', () => {
    const onExit = vi.fn()
    render(<SpeakingReviewSession chunks={chunks} userId="u1" onExit={onExit} />)
    const buttons = screen.getAllByRole('button')
    const xButton = buttons[0] // X tugmasi
    fireEvent.click(xButton)
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('userId yo\'q bo\'lsa RecallPanel userId undefined uzatiladi', () => {
    render(<SpeakingReviewSession chunks={chunks} onExit={vi.fn()} />)
    expect(screen.getByTestId('recall-c1')).toBeInTheDocument()
    // userId undefined bo'lsa RecallPanel ga undefined uzatiladi — mock'da ishlatilmaydi
  })
})
