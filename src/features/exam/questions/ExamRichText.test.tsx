import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ExamRichText, { splitExamContent } from './ExamRichText'

describe('ExamRichText fenced code', () => {
  it('preserves fenced JavaScript newlines, whitespace and a separate prompt', () => {
    const prompt = 'Natijani aniqlang.\n\n```javascript\nfunction f(x) {\n  return x + 1;\n}\nconsole.log(f(2));\n```'
    render(<ExamRichText text={prompt} />)
    expect(screen.getByText('Natijani aniqlang.')).toBeTruthy()
    const code = screen.getByLabelText('JavaScript kodi').querySelector('code')
    expect(code?.textContent).toBe('function f(x) {\n  return x + 1;\n}\nconsole.log(f(2));')
    expect(screen.getByText('JavaScript')).toBeTruthy()
  })

  it('accepts legacy single-line fenced questions and keeps them in a block', () => {
    render(<ExamRichText text={'Savol\n```javascript function f(x){return 1;}console.log(f(0)); ```'} />)
    expect(screen.getByLabelText('JavaScript kodi').tagName).toBe('PRE')
    expect(screen.getByLabelText('JavaScript kodi').textContent).toContain('console.log(f(0));')
  })

  it('removes accidental bold wrapping from legacy fenced code', () => {
    render(<ExamRichText text={'**Savol**\\n\\n**```javascript function f(x){return x;} ```**'} />)
    expect(screen.getByLabelText('JavaScript kodi').textContent).toContain('function f(x)')
    expect(screen.queryByText('**')).toBeNull()
  })

  it('never treats code as HTML or runs script', () => {
    render(<ExamRichText text={'```html\n<script>window.injected=true</script>\n```'} />)
    expect(document.querySelector('script')).toBeNull()
    expect(screen.getByText('<script>window.injected=true</script>')).toBeTruthy()
  })

  it('keeps multiple code blocks, language names and ordinary text', () => {
    const items = splitExamContent('X\n```python\nprint(1)\n```\nY\n```sql\nSELECT 1;\n```')
    expect(items.filter(p => p.kind === 'code').map(p => p.language)).toEqual(['python', 'sql'])
    expect(items.filter(p => p.kind === 'code').map(p => p.text)).toEqual(['print(1)', 'SELECT 1;'])
  })

  it('falls back to inline prose when no code fence exists', () => {
    render(<ExamRichText text={'**Natija**: `print(1)`'} />)
    expect(screen.getByText('Natija')).toBeTruthy()
    expect(document.querySelectorAll('pre')).toHaveLength(0)
    expect(document.querySelector('code.book-code')?.textContent).toBe('print(1)')
  })
})


describe('ExamRichText Markdown table regressions', () => {
  it('renders imported escaped Excel rows as an accessible table', () => {
    const stem = 'Quyidagi Excel jadvalida C — xarid narxi.\\n\\n| Qator | Meva | C (so‘m) | D (kg) | E (so‘m) | F (kg) |\\n|---|---|---:|---:|---:|---:|\\n| 2 | Olma | 18 000 | 24 | 25 000 | 17 |\\n| 3 | Apelsin | 24 000 | 18 | 33 000 | 13 |\\n\\nG2 va G3 kataklarning fon rangi qanday bo‘ladi?'
    render(<ExamRichText text={stem} />)

    const table = screen.getByRole('table')
    expect(table).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Savol jadvali' })).toBeTruthy()
    expect(screen.getAllByRole('columnheader')).toHaveLength(6)
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('Olma')).toBeTruthy()
    expect(screen.getByText('Apelsin')).toBeTruthy()
    expect(screen.getByText(/G2 va G3 kataklarning/)).toBeTruthy()
    expect(document.body.textContent).not.toContain('|---|')
    expect(document.body.textContent).not.toContain('\\n\\n')
  })

  it('also parses a table with ordinary newlines and Markdown in cells', () => {
    const stem = 'Jadval:\n\n| **Meva** | Narx |\n|:---|---:|\n| Olma | `25000` |\n\nTahlil qiling.'
    render(<ExamRichText text={stem} />)
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getByText('Meva')).toBeTruthy()
    expect(document.querySelector('td code')?.textContent).toBe('25000')
    expect(screen.getByText('Tahlil qiling.')).toBeTruthy()
  })

  it('does not turn ordinary pipe-delimited text without a header divider into a table', () => {
    render(<ExamRichText text={'Matn: A | B\\n\\nC | D'} />)
    expect(screen.queryByRole('table')).toBeNull()
    expect(screen.getByText(/A \| B/)).toBeTruthy()
  })

  it('keeps literal backslash escapes in inline code while normalizing external layout', () => {
    const stem = 'Koddagi `\\n` belgisi.\\n\\n| A | B |\\n|---|---|\\n| 1 | 2 |'
    render(<ExamRichText text={stem} />)
    expect(document.querySelector('code.book-code')?.textContent).toBe('\\n')
    expect(screen.getAllByRole('row')).toHaveLength(2)
  })

  it('renders untrusted table values as inert text', () => {
    const stem = '| Narsa | Qiymat |\n|---|---|\n| X | <img src=x onerror=alert(1)> |'
    render(<ExamRichText text={stem} />)
    expect(document.querySelector('img')).toBeNull()
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeTruthy()
  })
})


describe('legacy question-wide bold Markdown', () => {
  it('removes orphaned outer bold markers without changing table cells', () => {
    render(<ExamRichText text={'**Savol:\\n\\n| Meva | Narx |\\n|---|---:|\\n| Olma | 25000 |\\n\\nJavobni tanlang.**'} />)
    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.getByText('Savol:')).toBeTruthy()
    expect(screen.getByText('Javobni tanlang.')).toBeTruthy()
    expect(document.body.textContent).not.toContain('**')
  })
})
