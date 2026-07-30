import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookBlock from '../components/learning/theory/BookBlock'
import BookReader, { splitSections } from '../components/learning/theory/BookReader'
import InlineText, { plainText } from '../components/learning/theory/InlineText'
import { M01_CONTENT } from '../data/topics/m01'
import type { TheoryBlock } from '../data/topicContent'

const block = (b: Partial<TheoryBlock> & { type: TheoryBlock['type'] }): TheoryBlock =>
  ({ content: '', ...b })

describe('InlineText', () => {
  it('kalit so‘z, inglizcha atama va qalin matnni ajratadi', () => {
    render(<p><InlineText text="==Axborot== (~~information~~) — **muhim** tushuncha" /></p>)
    expect(screen.getByText('Axborot')).toHaveClass('book-term')
    expect(screen.getByText('information')).toHaveClass('book-eng')
    expect(screen.getByText('muhim')).toHaveClass('book-bold')
  })

  it('matematikani KaTeX bilan chizadi', () => {
    const { container } = render(<p><InlineText text="Formula: $N = 2^i$ ko‘rinishda" /></p>)
    expect(container.querySelector('.book-math .katex')).not.toBeNull()
  })

  it('manba izini alohida belgilaydi', () => {
    render(<p><InlineText text="Matn.@@ICT5, PDF 10–12@@" /></p>)
    expect(screen.getByText('ICT5, PDF 10–12')).toHaveClass('book-src')
  })

  it('✓ va ✗ belgilarini ranglaydi', () => {
    render(<p><InlineText text="✗ noto‘g‘ri, ✓ to‘g‘ri" /></p>)
    expect(screen.getByText('✗')).toHaveClass('book-no')
    expect(screen.getByText('✓')).toHaveClass('book-yes')
  })

  it('plainText tokenlarni olib tashlaydi', () => {
    expect(plainText('==Bit== — $2^i$ ~~binary digit~~@@ICT7, PDF 4@@')).toBe('Bit — 2^i binary digit')
  })
})

describe('BookBlock', () => {
  it('qutini kitobdagi sarlavha bilan chizadi', () => {
    render(<BookBlock index={0} block={block({ type: 'trap', content: 'Ehtiyot bo‘ling.' })} />)
    expect(screen.getByText('Ko‘p uchraydigan xato')).toBeInTheDocument()
    expect(screen.getByText('Ehtiyot bo‘ling.')).toBeInTheDocument()
  })

  it('jadvalni sarlavha va qatorlar bilan chizadi', () => {
    render(<BookBlock index={0} block={block({
      type: 'table',
      headers: ['Shakl', 'Misol'],
      rows: [['Matnli', 'maqola'], ['Grafik', 'xarita']],
    })} />)
    expect(screen.getByRole('columnheader', { name: 'Shakl' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('xarita')).toBeInTheDocument()
  })

  it('javob qutisi bosilgunicha yopiq turadi', async () => {
    const user = userEvent.setup()
    render(<BookBlock index={0} block={block({ type: 'answers', content: '1) Kontekstsiz — ma’lumot.' })} />)
    expect(screen.queryByText('1) Kontekstsiz — ma’lumot.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /javob va izoh/i }))
    expect(screen.getByText('1) Kontekstsiz — ma’lumot.')).toBeInTheDocument()
  })

  it('ichki bloklarni rekursiv chizadi', () => {
    render(<BookBlock index={0} block={block({
      type: 'summary',
      children: [block({ type: 'list', ordered: false, content: '', items: ['Birinchi', 'Ikkinchi'] })],
    })} />)
    expect(screen.getByText('Bob yakuni')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('noma’lum diagramma identifikatorida hech nima chizmaydi', () => {
    const { container } = render(
      <BookBlock index={0} block={block({ type: 'diagram', content: 'Sxema', diagram: 'yo-q' })} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('splitSections', () => {
  it('bobni \\section chegarasi bo‘yicha ajratadi, kirishni birinchi bo‘limga qo‘shadi', () => {
    const sections = splitSections([
      block({ type: 'intro', content: 'Kirish' }),
      block({ type: 'heading', content: 'Birinchi' }),
      block({ type: 'text', content: 'A' }),
      block({ type: 'heading', content: 'Ikkinchi' }),
      block({ type: 'text', content: 'B' }),
    ])
    expect(sections).toHaveLength(2)
    expect(sections[0].title).toBe('Birinchi')
    expect(sections[0].blocks.map(b => b.type)).toEqual(['intro', 'heading', 'text'])
    expect(sections[1].blocks.map(b => b.content)).toEqual(['Ikkinchi', 'B'])
  })

  it('sarlavhasiz mavzuni bitta bo‘lim qiladi', () => {
    const sections = splitSections([block({ type: 'intro', content: 'Lug‘at' }), block({ type: 'table', content: 'x', rows: [['a']] })])
    expect(sections).toHaveLength(1)
    expect(sections[0].blocks).toHaveLength(2)
  })

  it('kitobdagi har bir M01 mavzusi kamida bitta bo‘limga bo‘linadi', () => {
    for (const id of Object.keys(M01_CONTENT)) {
      const sections = splitSections(M01_CONTENT[id].theory)
      const headings = M01_CONTENT[id].theory.filter(b => b.type === 'heading').length
      expect(sections.length, id).toBe(Math.max(headings, 1))
      // hech bir blok yo'qolmaydi
      const totalBlocks = sections.reduce((sum, s) => sum + s.blocks.length, 0)
      expect(totalBlocks, id).toBe(M01_CONTENT[id].theory.length)
    }
  })
})

describe('BookReader', () => {
  const readerProps = {
    questionCount: 3,
    onFinishReading: () => undefined,
  }

  it('birinchi bo‘limni va holat panelini ko‘rsatadi', () => {
    const content = M01_CONTENT['M01.02']
    const sections = splitSections(content.theory)
    render(<BookReader content={content} {...readerProps} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(`/${sections.length} bo‘lim`)).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(sections.length)
    expect(screen.getByRole('heading', { name: sections[0].title })).toBeInTheDocument()
    // keyingi bo'lim kontenti hali chizilmaydi
    expect(screen.queryByRole('heading', { name: sections[1].title })).not.toBeInTheDocument()
  })

  it('“Keyingi” tugmasi keyingi bo‘limga o‘tkazadi', async () => {
    const user = userEvent.setup()
    const content = M01_CONTENT['M01.02']
    const sections = splitSections(content.theory)
    render(<BookReader content={content} {...readerProps} />)

    await user.click(screen.getByRole('button', { name: /keyingi/i }))
    expect(screen.getByRole('heading', { name: sections[1].title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /oldingi/i })).toBeEnabled()
  })

  it('mundarija orqali istalgan bo‘limga o‘tadi', async () => {
    const user = userEvent.setup()
    const content = M01_CONTENT['M01.02']
    const sections = splitSections(content.theory)
    render(<BookReader content={content} {...readerProps} />)

    await user.click(screen.getByRole('button', { name: /mundarija/i }))
    const outline = screen.getByRole('navigation', { name: /mundarija/i })
    await user.click(within(outline).getByText(sections[2].title))
    expect(screen.getByRole('heading', { name: sections[2].title })).toBeInTheDocument()
  })

  it('o‘qilgan bo‘limlar ulushini xabar qiladi', async () => {
    const user = userEvent.setup()
    const content = M01_CONTENT['M01.02']
    const sections = splitSections(content.theory)
    const seen: number[] = []
    render(<BookReader content={content} {...readerProps} onProgress={p => seen.push(p)} />)

    expect(seen.at(-1)).toBe(Math.round(100 / sections.length))
    await user.click(screen.getByRole('button', { name: /keyingi/i }))
    expect(seen.at(-1)).toBe(Math.round((2 / sections.length) * 100))
  })

  it('oxirgi bo‘limda testga o‘tish kartasi chiqadi', async () => {
    const user = userEvent.setup()
    const content = M01_CONTENT['M01.02']
    const sections = splitSections(content.theory)
    let started = false
    render(<BookReader content={content} questionCount={3} onFinishReading={() => { started = true }} />)

    for (let i = 1; i < sections.length; i++) {
      await user.click(screen.getByRole('button', { name: /keyingi/i }))
    }
    expect(screen.getByText('Bob o‘qib bo‘lindi')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /keyingi bo‘lim/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /testni boshlash/i }))
    expect(started).toBe(true)
  })

  it('ilovada test o‘rniga “Mavzuni yakunlash” chiqadi', () => {
    render(<BookReader content={M01_CONTENT['M01.11']} questionCount={0} isAppendix onFinishReading={() => undefined} />)
    expect(screen.getByRole('button', { name: /mavzuni yakunlash/i })).toBeInTheDocument()
    expect(screen.getByText(/test ko‘zda tutilmagan/i)).toBeInTheDocument()
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('savoli hali qo‘shilmagan bobda buni ochiq aytadi', async () => {
    const user = userEvent.setup()
    const content = M01_CONTENT['M01.08']
    const sections = splitSections(content.theory)
    render(<BookReader content={content} questionCount={0} onFinishReading={() => undefined} />)
    for (let i = 1; i < sections.length; i++) {
      await user.click(screen.getByRole('button', { name: /keyingi/i }))
    }
    expect(screen.getByText(/test hali qo‘shilmagan/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mavzuni yakunlash/i })).toBeInTheDocument()
  })

  it('keyingi mavzuni taklif qiladi', async () => {
    const user = userEvent.setup()
    let opened = false
    render(
      <BookReader
        content={M01_CONTENT['M01.11']}
        questionCount={0}
        isAppendix
        onFinishReading={() => undefined}
        nextTopic={{ id: 'M01.12', title: 'Birlashtirish qamrovi va manba reyestri' }}
        onOpenNextTopic={() => { opened = true }}
      />)
    await user.click(screen.getByRole('button', { name: /keyingi mavzu/i }))
    expect(opened).toBe(true)
  })

  it('klaviatura o‘qlari bilan boshqariladi', async () => {
    const user = userEvent.setup()
    const content = M01_CONTENT['M01.02']
    const sections = splitSections(content.theory)
    render(<BookReader content={content} {...readerProps} />)

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('heading', { name: sections[1].title })).toBeInTheDocument()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('heading', { name: sections[0].title })).toBeInTheDocument()
  })

  it('kitobdagi barcha diagrammalar biror bo‘limda chiziladi', async () => {
    const user = userEvent.setup()
    for (const id of Object.keys(M01_CONTENT)) {
      const diagrams = M01_CONTENT[id].theory.filter(b => b.type === 'diagram')
      if (diagrams.length === 0) continue
      const sections = splitSections(M01_CONTENT[id].theory)
      const { container, unmount } = render(<BookReader content={M01_CONTENT[id]} {...readerProps} />)
      const captions: string[] = []
      for (let i = 0; i < sections.length; i++) {
        container.querySelectorAll('.book-diagram-figcaption')
          .forEach(node => captions.push(node.textContent ?? ''))
        if (i < sections.length - 1) await user.click(screen.getByRole('button', { name: /keyingi/i }))
      }
      expect(captions, id).toEqual(diagrams.map(d => d.content))
      unmount()
    }
  })
})
