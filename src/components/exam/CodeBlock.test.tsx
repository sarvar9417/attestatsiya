import { describe, expect, it } from 'vitest'
import { parseCodeBlocks } from './CodeBlock'

describe('classic exam code fences', () => {
  it('extracts modern multiline code without collapsing indentation', () => {
    const items = parseCodeBlocks('Natija?\n```python\ndef f():\n    return 2\n```')
    expect(items.find(x => x.type === 'code')?.content).toBe('def f():\n    return 2')
  })

  it('extracts an old one-line JavaScript fenced example', () => {
    const items = parseCodeBlocks('Natija?\n```javascript function f(x){return x;}console.log(f(5)); ```')
    expect(items.find(x => x.type === 'code')).toMatchObject({
      language: 'javascript',
      content: 'function f(x){return x;}console.log(f(5));',
    })
  })

  it('preserves unknown prose as plain text', () => {
    expect(parseCodeBlocks('**Savol:** qanday natija?')).toEqual([
      { type: 'text', content: '**Savol:** qanday natija?' },
    ])
  })
})
