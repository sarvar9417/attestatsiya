import { describe, expect, it } from 'vitest'
import { markdownToTheoryBlocks } from '../features/content/professionalLessonTheory'

describe('Python/JavaScript V2 Markdown code blocks', () => {
  it('preserves Python indentation, newlines and language', () => {
    const python = [
      '## Shart operatori',
      'Kodni izlang.',
      '```python',
      'x = 4',
      'if x > 2:',
      '    print(x)',
      '    x += 1',
      'print(x)',
      '```',
      'Kod yakunlandi.',
    ].join('\n')
    const blocks = markdownToTheoryBlocks(python)
    const code = blocks.find(block => block.type === 'code')
    expect(code?.language).toBe('python')
    expect(code?.content).toBe('x = 4\nif x > 2:\n    print(x)\n    x += 1\nprint(x)')
    expect(blocks.at(-1)?.content).toBe('Kod yakunlandi.')
  })

  it('preserves JavaScript array code and never executes HTML', () => {
    const js = [
      '### JS misoli',
      '```javascript',
      'const a = [1, 2];',
      'for (const n of a) {',
      '  console.log(n);',
      '}',
      '```',
      '<script>bad()</script>',
    ].join('\n')
    const blocks = markdownToTheoryBlocks(js)
    expect(blocks.find(b => b.type === 'code')?.content).toBe(
      'const a = [1, 2];\nfor (const n of a) {\n  console.log(n);\n}',
    )
    expect(blocks.at(-1)?.content).toContain('<script>')
  })

  it('incomplete fenced code remains text instead of getting silently lost', () => {
    const blocks = markdownToTheoryBlocks('```python\nprint(7)')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].content).toContain('print(7)')
    expect(blocks[0].type).toBe('text')
  })
})
