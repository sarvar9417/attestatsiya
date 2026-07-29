import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import QuickRating from '../QuickRating'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('QuickRating', () => {
  it('renders 4 rating buttons', () => {
    const onRate = vi.fn()
    render(<QuickRating wordId={1} onRate={onRate} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('renders all four rating emojis', () => {
    const onRate = vi.fn()
    render(<QuickRating wordId={1} onRate={onRate} />)

    expect(screen.getByText('⭐')).toBeInTheDocument()
    expect(screen.getByText('😊')).toBeInTheDocument()
    expect(screen.getByText('🤔')).toBeInTheDocument()
    expect(screen.getByText('😕')).toBeInTheDocument()
  })

  it('calls onRate with wordId and rating when clicked', () => {
    const onRate = vi.fn()
    render(<QuickRating wordId={42} onRate={onRate} />)

    const buttons = screen.getAllByRole('button')

    // Click "yodladim" (⭐) - first button
    act(() => { fireEvent.click(buttons[0]) })
    expect(onRate).toHaveBeenCalledWith(42, 'yodladim')

    // Click "bilmadim" (😕) - last button
    act(() => { fireEvent.click(buttons[3]) })
    expect(onRate).toHaveBeenCalledWith(42, 'bilmadim')
  })

  it('highlights the active rating when lastRating is provided', () => {
    const onRate = vi.fn()
    const { container } = render(<QuickRating wordId={1} lastRating="bildim" onRate={onRate} />)

    const buttons = container.querySelectorAll('button')
    let hasActive = false
    buttons.forEach((btn) => {
      if (btn.className.includes('scale-110') && btn.className.includes('ring-2')) {
        hasActive = true
      }
    })
    expect(hasActive).toBe(true)
  })

  it('highlights the specific button matching lastRating', () => {
    const onRate = vi.fn()
    render(<QuickRating wordId={1} lastRating="qiynaldim" onRate={onRate} />)

    // "qiynaldim" is the 3rd button — emoji is 🤔
    const buttons = screen.getAllByRole('button')
    expect(buttons[2].textContent).toBe('🤔')
    expect(buttons[2].className).toContain('scale-110')
    expect(buttons[2].className).toContain('ring-2')
  })

  it('does not highlight anything when lastRating is empty', () => {
    const onRate = vi.fn()
    const { container } = render(<QuickRating wordId={1} onRate={onRate} />)

    const buttons = container.querySelectorAll('button')
    let hasActive = false
    buttons.forEach((btn) => {
      if (btn.className.includes('scale-110') && btn.className.includes('ring-2')) {
        hasActive = true
      }
    })
    expect(hasActive).toBe(false)
  })

  it('shows flash animation on click and clears it after timeout', () => {
    const onRate = vi.fn()
    render(<QuickRating wordId={1} onRate={onRate} />)

    const buttons = screen.getAllByRole('button')

    // Click the first button
    act(() => { fireEvent.click(buttons[0]) })

    // Flash text should appear immediately
    const flashes = screen.getAllByText('⭐')
    expect(flashes.length).toBeGreaterThanOrEqual(2)

    // Advance past the 500ms timeout
    act(() => { vi.advanceTimersByTime(500) })

    // Flash should be gone — only the button emoji remains
    const remainingFlashes = screen.getAllByText('⭐')
    expect(remainingFlashes.length).toBe(1)
  })

  it('calls onRate with all four rating keys', () => {
    const onRate = vi.fn()
    render(<QuickRating wordId={5} onRate={onRate} />)

    const buttons = screen.getAllByRole('button')

    act(() => { fireEvent.click(buttons[0]) })
    expect(onRate).toHaveBeenCalledWith(5, 'yodladim')

    act(() => { fireEvent.click(buttons[1]) })
    expect(onRate).toHaveBeenCalledWith(5, 'bildim')

    act(() => { fireEvent.click(buttons[2]) })
    expect(onRate).toHaveBeenCalledWith(5, 'qiynaldim')

    act(() => { fireEvent.click(buttons[3]) })
    expect(onRate).toHaveBeenCalledWith(5, 'bilmadim')
  })

  it('calls stopPropagation on button click', () => {
    const onRate = vi.fn()
    const parentClick = vi.fn()

    render(
      <div onClick={parentClick}>
        <QuickRating wordId={1} onRate={onRate} />
      </div>,
    )

    const buttons = screen.getAllByRole('button')
    act(() => { fireEvent.click(buttons[0]) })

    // onRate should be called, but parent click should NOT fire (stopPropagation)
    expect(onRate).toHaveBeenCalled()
    expect(parentClick).not.toHaveBeenCalled()
  })
})
