import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Y3Question from '../components/learning/questions/Y3Question'

describe('Y3Question', () => {
  const items = [
    { id: 'i1', content: 'Birinchi qadam' },
    { id: 'i2', content: 'Ikkinchi qadam' },
    { id: 'i3', content: 'Uchinchi qadam' },
  ]

  const defaultProps = {
    prompt: 'To\'g\'ri tartibni belgilang',
    items,
    onChange: vi.fn(),
  }

  it('savol matnini ko\'rsatadi', () => {
    render(<Y3Question {...defaultProps} />)
    expect(screen.getByText("To'g'ri tartibni belgilang")).toBeDefined()
  })

  it('barcha elementlarni ko\'rsatadi', () => {
    render(<Y3Question {...defaultProps} />)
    expect(screen.getByText('Birinchi qadam')).toBeDefined()
    expect(screen.getByText('Ikkinchi qadam')).toBeDefined()
    expect(screen.getByText('Uchinchi qadam')).toBeDefined()
  })

  it('elementlar tartib raqami bilan ko\'rsatiladi', () => {
    render(<Y3Question {...defaultProps} />)
    const numbers = screen.getAllByText(/^[1-3]$/)
    expect(numbers.length).toBe(3)
  })

  it('yuqoriga ko\'chirish tugmasi onChange chaqiradi', () => {
    const onChange = vi.fn()
    render(<Y3Question {...defaultProps} onChange={onChange} />)
    const upButtons = screen.getAllByRole('button')
    fireEvent.click(upButtons[1])
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('to\'g\'ri tartib ko\'rsatilganda green indicator chiqadi', () => {
    render(<Y3Question {...defaultProps} order={['i1', 'i2', 'i3']} correctOrder={['i1', 'i2', 'i3']} showResult={true} />)
    expect(screen.getByText("To'g'ri tartib ✅")).toBeDefined()
  })

  it('noto\'g\'ri tartib ko\'rsatilganda to\'g\'ri tartibni aytadi', () => {
    render(<Y3Question {...defaultProps} order={['i3', 'i2', 'i1']} correctOrder={['i1', 'i2', 'i3']} showResult={true} />)
    expect(screen.getByText("Noto'g'ri tartib ❌")).toBeDefined()
    const items = screen.getAllByText(/Birinchi qadam/)
    expect(items.length).toBeGreaterThanOrEqual(1)
  })
})
