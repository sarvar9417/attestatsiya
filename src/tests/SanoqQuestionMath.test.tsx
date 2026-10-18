import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Y1Choice from '../features/exam/questions/Y1Choice'
import AnswerOption from '../components/exam/AnswerOption'

describe('Sanoq sistemalari savollaridagi matematik yozuv', () => {
  it('sanoq asoslari va formulalarni mavzu testi savolida KaTeX orqali ko‘rsatadi', () => {
    const { container } = render(
      <Y1Choice
        prompt={'\\(101\\)_2 emas, $101_{2}$ sonini o‘nlikka o‘tkazing.'}
        options={[
          { id: 'a', side: 'a', content_md: '$5_{10}$' },
          { id: 'b', side: 'a', content_md: '$6_{10}$' },
          { id: 'c', side: 'a', content_md: '$4_{10}$' },
          { id: 'd', side: 'a', content_md: '$7_{10}$' },
        ]}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('group')).toBeInTheDocument()
    expect(container.querySelectorAll('.book-math .katex')).toHaveLength(5)
    expect(screen.getByRole('button', { name: /5/ })).toBeInTheDocument()
  })

  it('mavjud AnswerOption qiymatlaridagi formulalarni ham chizadi', () => {
    const { container } = render(
      <AnswerOption
        letter="A"
        label={'$p^n-1$'}
        selected={false}
        onClick={vi.fn()}
      />,
    )
    expect(container.querySelector('.book-math .katex')).not.toBeNull()
  })

  it('oddiy matnli testlar ko‘rinishini saqlaydi', () => {
    render(
      <Y1Choice
        prompt="Sanoq sistemasi nima?"
        options={[
          { id: 'a', side: 'a', content_md: 'Sonlarni ifodalash qoidalari' },
          { id: 'b', side: 'a', content_md: 'Internet tarmog‘i' },
        ]}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Sanoq sistemasi nima?')).toBeInTheDocument()
    expect(screen.getByText('Internet tarmog‘i')).toBeInTheDocument()
  })
})
