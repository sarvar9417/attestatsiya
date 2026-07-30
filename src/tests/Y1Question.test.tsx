import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Y1Question from '../components/learning/questions/Y1Question'

describe('Y1Question', () => {
  const defaultProps = {
    prompt: 'Test savol?',
    options: ['A variant', 'B variant', 'C variant', 'D variant'],
    onSelect: vi.fn(),
  }

  it('savol matnini ko\'rsatadi', () => {
    render(<Y1Question {...defaultProps} />)
    expect(screen.getByText('Test savol?')).toBeDefined()
  })

  it('barcha variantlarni ko\'rsatadi', () => {
    render(<Y1Question {...defaultProps} />)
    expect(screen.getByText('A variant')).toBeDefined()
    expect(screen.getByText('B variant')).toBeDefined()
    expect(screen.getByText('C variant')).toBeDefined()
    expect(screen.getByText('D variant')).toBeDefined()
  })

  it('variant tanlanganda onSelect chaqiriladi', () => {
    const onSelect = vi.fn()
    render(<Y1Question {...defaultProps} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('B variant'))
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('disabled bo\'lganda click ishlamaydi', () => {
    const onSelect = vi.fn()
    render(<Y1Question {...defaultProps} onSelect={onSelect} disabled={true} />)
    fireEvent.click(screen.getByText('B variant'))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('to\'g\'ri javob ko\'rsatilganda green border qo\'yiladi', () => {
    render(<Y1Question {...defaultProps} selected={1} correct={1} showResult={true} />)
    const correctBtn = screen.getByText('B variant').closest('button')
    expect(correctBtn?.className).toContain('border-green-500')
  })

  it('noto\'g\'ri javob ko\'rsatilganda red border qo\'yiladi', () => {
    render(<Y1Question {...defaultProps} selected={0} correct={1} showResult={true} />)
    const wrongBtn = screen.getByText('A variant').closest('button')
    expect(wrongBtn?.className).toContain('border-red-500')
  })
})
