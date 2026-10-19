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
    expect(screen.queryByRole('code')).toBeNull()
  })
})
