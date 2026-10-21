import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Y1Choice from '../features/exam/questions/Y1Choice'
import AnswerOption from '../components/exam/AnswerOption'
import Y2Match from '../features/exam/questions/Y2Match'

describe('Sanoq sistemalari savollaridagi matematik yozuv', () => {
  it('sanoq asoslari va formulalarni mavzu testi savolida KaTeX orqali ko‘rsatadi', () => {
    const { container } = render(
      <Y1Choice
        prompt={'$101_{2}$ sonini o‘nlikka o‘tkazing.'}
        options={[
          { id: 'a', side: 'a', content_md: '$5_{10}$' },
          { id: 'b', side: 'a', content_md: '$6_{10}$' },
          { id: 'c', side: 'a', content_md: '$4_{10}$' },
          { id: 'd', side: 'a', content_md: '$7_{10}$' },
        ]}
        onChange={vi.fn()}
      />,
    )
    expect(container.querySelectorAll('button')).toHaveLength(4)
    expect(container.querySelectorAll('.book-math .katex')).toHaveLength(5)
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
  it('renders Office Y2 matching question without eating $ reference markers', () => {
    const prompt = 'Ushbu vaziyatdagi vositalar va vazifalarni moslashtiring.  1) =$A1;  2) =A$1;  3) =$A$1;  Izohlar: A) Ustun mahkamlangan;  B) Satr mahkamlangan;  C) Ikkalasi mahkamlangan;'
    const { container } = render(
      <Y2Match
        prompt={prompt}
        left={[
          { id: 'a0', side: 'a', content_md: '=$A1' },
          { id: 'a1', side: 'a', content_md: '=A$1' },
          { id: 'a2', side: 'a', content_md: '=$A$1' },
        ]}
        right={[
          { id: 'b0', side: 'b', content_md: 'Ustun mahkamlangan' },
          { id: 'b1', side: 'b', content_md: 'Satr mahkamlangan' },
          { id: 'b2', side: 'b', content_md: 'Ikkalasi mahkamlangan' },
        ]}
        value={{}}
        onChange={vi.fn()}
      />,
    )
    expect(container.textContent).toContain(prompt)
    for (const reference of ['=$A1', '=A$1', '=$A$1']) {
      expect(container.querySelectorAll('.book-code').length).toBeGreaterThanOrEqual(3)
      expect(container.textContent).toContain(reference)
    }
    expect(container.querySelector('.book-math .katex')).toBeNull()
    expect(screen.getAllByRole('combobox')).toHaveLength(3)
  })

})
