import { transpileModule, ScriptTarget, ModuleKind } from 'typescript'
import { describe, expect, it } from 'vitest'
import { formatCodeForDisplay, prepareExamCodeText } from './formatQuestionCode'

describe('legacy exam code readability', () => {
  it('formats the real published JavaScript regression without altering statements', () => {
    const original = 'function f(x){if(x%2===0)return x/2;return 3*x+1;}console.log(f(6));'
    const formatted = formatCodeForDisplay(original, 'javascript')
    expect(formatted).toContain('function f(x) {\n')
    expect(formatted).toContain('  if(x%2===0)\n    return x/2;\n')
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

  it('does not risk changing JavaScript template literals or regular expressions', () => {
    const template = 'const name=\u0060Hello ${user}\u0060;console.log(name);'
    const regex = 'const valid=/[a-z]{2,4}/;console.log(valid.test("abc"));'
    expect(formatCodeForDisplay(template, 'javascript')).toBe(template)
    expect(formatCodeForDisplay(regex, 'javascript')).toBe(regex)
  })

  it('preserves emitted semantics for representative published packed JavaScript programs', () => {
    const samples = [
      'function f(x){if(x%2===0)return x/2;return 3*x+1;}console.log(f(6));',
      'let s=1;for(const x of [2,3,4])s*=x;console.log(s);',
      'let k=0;for(let i=0;i<5;i++)for(let j=0;j<=i;j++)if((i+j)%2===0)k++;console.log(k);',
      'const a=Array.from({length:3},(_,i)=>i*i);console.log(a);',
      'let i=0;do{i++;}while(i<0);console.log(i);',
      'let x=1;switch(x){case 1:console.log("a");case 2:console.log("b");break;}',
      'let x=6,y;if(x%3===0)y=3;else if(x%2===0)y=2;else y=1;console.log(y);',
      'const m=Array.from({length:2},(_,i)=>Array.from({length:3},(_,j)=>i+j));console.log(m[1]);',
      'const s="a2b7c4";let total=0;for(const c of s)if(/\\d/.test(c))total+=Number(c);console.log(total);',
      'let x=3; {let x=8;} console.log(x);',
    ]
    const compile = (source: string) => transpileModule(source, {
      compilerOptions: { target: ScriptTarget.ES2020, module: ModuleKind.None },
    }).outputText
    for (const source of samples) {
      const formatted = formatCodeForDisplay(source, 'javascript')
      expect(compile(formatted).replace(/\s+/g, ''), source).toBe(compile(source).replace(/\s+/g, ''))
    }
    expect(formatCodeForDisplay(samples[0], 'javascript')).toContain('if(x%2===0)\n    return x/2;')
  })

  it('does not reformat deliberate syntax-error code or unknown languages', () => {
    const snippet = 'if x=5:'
    expect(formatCodeForDisplay(snippet, 'python')).toBe(snippet)
    expect(formatCodeForDisplay('SELECT * FROM x;', 'sql')).toBe('SELECT * FROM x;')
  })
})
