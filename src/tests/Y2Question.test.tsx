import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Y2Question from '../components/learning/questions/Y2Question'

const pairs = [
  { leftId: 'a', leftContent: 'Birinchi', rightContent: 'Alfa' },
  { leftId: 'b', leftContent: 'Ikkinchi', rightContent: 'Beta' },
  { leftId: 'c', leftContent: 'Uchinchi', rightContent: 'Gamma' },
]

describe('Y2 matching learner control', () => {
  it('keeps matching option order stable across selected-answer rerenders', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <Y2Question prompt="Moslashtiring" pairs={pairs} onChange={onChange} />,
    )
    const optionsBefore = Array.from(
      (screen.getAllByRole('combobox')[0] as HTMLSelectElement).options,
      option => option.value,
    )
    rerender(
      <Y2Question prompt="Moslashtiring" pairs={[...pairs]} selected={{ a: 'Beta' }} onChange={onChange} />,
    )
    const optionsAfter = Array.from(
      (screen.getAllByRole('combobox')[0] as HTMLSelectElement).options,
      option => option.value,
    )
    expect(optionsAfter).toEqual(optionsBefore)
    expect(new Set(optionsAfter.slice(1))).toEqual(new Set(['Alfa', 'Beta', 'Gamma']))
  })

  it('prevents reusing another left item’s selected right option', () => {
    render(<Y2Question prompt="Moslashtiring" pairs={pairs} selected={{ a: 'Alfa' }} onChange={vi.fn()} />)
    const ownSelect = screen.getByRole('combobox', { name: 'Mos javob: Birinchi' }) as HTMLSelectElement
    const otherSelect = screen.getByRole('combobox', { name: 'Mos javob: Ikkinchi' }) as HTMLSelectElement
    expect((ownSelect.querySelector('option[value="Alfa"]') as HTMLOptionElement).disabled).toBe(false)
    expect((otherSelect.querySelector('option[value="Alfa"]') as HTMLOptionElement).disabled).toBe(true)
  })

  it('clears a mapping instead of preserving a blank-valued answer', () => {
    const onChange = vi.fn()
    render(<Y2Question prompt="Moslashtiring" pairs={pairs} selected={{ a: 'Alfa', b: 'Beta' }} onChange={onChange} />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Mos javob: Ikkinchi' }), { target: { value: '' } })
    expect(onChange).toHaveBeenCalledWith({ a: 'Alfa' })
  })

  it('disables selections during feedback/locked state', () => {
    render(<Y2Question prompt="Moslashtiring" pairs={pairs} onChange={vi.fn()} disabled />)
    for (const control of screen.getAllByRole('combobox')) expect(control).toBeDisabled()
  })
})
