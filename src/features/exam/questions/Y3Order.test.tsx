import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Y3Order from './Y3Order'

const items = [
  { id: '20000000-0000-4000-8000-000000000011', side: 'a' as const, content_md: 'Birinchi' },
  { id: '20000000-0000-4000-8000-000000000012', side: 'a' as const, content_md: 'Ikkinchi' },
  { id: '20000000-0000-4000-8000-000000000013', side: 'a' as const, content_md: 'Uchinchi' },
]
const order = items.map(x => x.id)

describe('Y3 explicit confirmation', () => {
  it('allows accepting the displayed order unchanged in an editable exam', () => {
    const onChange=vi.fn()
    render(<Y3Order prompt="Tartiblang" items={items} value={order}
      allowConfirmCurrentOrder onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Shu tartibni tasdiqlash' }))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith(order)
  })

  it('does not expose redundant confirmation in group mode', () => {
    render(<Y3Order prompt="Tartiblang" items={items} value={order} onChange={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Shu tartibni tasdiqlash' })).toBeNull()
  })

  it('blocks confirmation for invalid or incomplete order', () => {
    render(<Y3Order prompt="Tartiblang" items={items} value={[order[0],order[0],order[2]]}
      allowConfirmCurrentOrder onChange={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Shu tartibni tasdiqlash' })).toBeNull()
  })

  it('disables accepting a finalized exam answer', () => {
    render(<Y3Order prompt="Tartiblang" items={items} value={order}
      allowConfirmCurrentOrder disabled onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Shu tartibni tasdiqlash' }).hasAttribute('disabled')).toBe(true)
  })
})
