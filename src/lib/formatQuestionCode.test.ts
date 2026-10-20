import { describe, expect, it } from 'vitest'
import { formatCodeForDisplay, prepareExamCodeText } from './formatQuestionCode'

describe('legacy exam code readability', () => {
  it('formats the real published JavaScript regression without altering statements', () => {
    const original = 'function f(x){if(x%2===0)return x/2;return 3*x+1;}console.log(f(6));'
    const formatted = formatCodeForDisplay(original, 'javascript')
    expect(formatted).toContain('function f(x) {\n')
    expect(formatted).toContain('  if(x%2===0)return x/2;\n')
    expect(formatted).toContain('  return 3*x+1;\n}\nconsole.log(f(6));')
  })

  it('does not split the semicolons in a for-loop header', () => {
    const original = 'let s=0;for(let i=0;i<4;i++){s+=i;}console.log(s);'
    const result = formatCodeForDisplay(original, 'js')
    expect(result).toContain('for(let i=0;i<4;i++) {')
    expect(result).toContain('\n  s+=i;\n')
  })

  it('keeps string semicolons intact', () => {
    const original = 'const s="a;b";console.log(s);'
    expect(formatCodeForDisplay(original, 'javascript')).toContain('"a;b";\nconsole.log(s);')
  })

  it('preserves already well-formatted JavaScript exactly', () => {
    const original = 'function f(x) {\n  return x + 1;\n}\nconsole.log(f(2));'
    expect(formatCodeForDisplay(original, 'javascript')).toBe(original)
  })

  it('converts a compact Python function body into readable indentation', () => {
    expect(formatCodeForDisplay('def f(x): return x+2\nprint(f(5))', 'python'))
      .toBe('def f(x):\n    return x+2\nprint(f(5))')
  })

  it('turns a full inline program into a block but leaves a simple expression inline', () => {
    const tick = String.fromCharCode(96)
    const source = 'JavaScript: ' + tick +
      'let x=4; console.log(x*3);' + tick + ' natija?'
    const formatted = prepareExamCodeText(source)
    expect(formatted).toContain(tick.repeat(3) + 'javascript\nlet x=4;\nconsole.log(x*3);')
    expect(formatted).toContain('natija?')
    expect(prepareExamCodeText('Natija: ' + tick + 'print(1)' + tick)).not.toContain(tick.repeat(3))
  })

  it('does not reformat deliberate syntax-error code or unknown languages', () => {
    const snippet = 'if x=5:'
    expect(formatCodeForDisplay(snippet, 'python')).toBe(snippet)
    expect(formatCodeForDisplay('SELECT * FROM x;', 'sql')).toBe('SELECT * FROM x;')
  })
})
