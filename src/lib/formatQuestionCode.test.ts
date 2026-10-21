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


  it('retains syntax and tokens for additional packed JavaScript control-flow specimens', () => {
    const samples = [
      'function fib(n){return n<=1?n:fib(n-1)+fib(n-2);}console.log(fib(6));',
      'function fib(n){if(n<=1)return n;return fib(n-1)+fib(n-2);}console.log(fib(5));',
      'function f(x,y=5){return Math.floor(x/y)}console.log(f(14),f(14,2));',
      'let s=0;for(let i=9;i>0;i-=3)s+=i;console.log(s);',
      'let s=0;for(let i=1;i<=7;i++)if(i%2===0)s+=i;console.log(s);',
      'let s=0;for(let i=0;i<11;i++)if(i%2===0)s+=i+1;console.log(s);',
      'let v=25,k=0;while(v>0){v=Math.floor(v/2);k++;}console.log(k);',
      'let x=17;while(x>1){console.log(x);x=Math.floor(x/2);}',
      'const a=[8,5,3,1];while(a.length)console.log(a.shift());',
      'let n=24,k=0;while(n>0){k+=n%10;n=Math.floor(n/10);}console.log(k);',
      'let n=1031,r=0;while(n){r=r*10+n%10;n=Math.floor(n/10);}console.log(r);',
      'let k=9;console.log(k>3 && (k%3===0));',
      'let k=5; k+=3; console.log(k*2);',
      'const f=x=>y=>x+y;console.log(f(4)(5));',
      'const h=(a,b=2)=>a*b+a;for(const x of [1,2,3,4])console.log(h(x));',
      'const a=[4,3,2,1],b=[...a].sort((x,y)=>x-y);console.log(a[0],b[0]);',
      'const a=[5,1,5,2];a.splice(a.indexOf(5),1);console.log(a);',
      'const a=[6,5,8];console.log(a.filter(x=>x%2===0).map(x=>x*x).reduce((s,x)=>s+x,0));',
      'let x=5;function f(x){return x+4;}console.log(f(x)+x);',
      'function f(x){let s=0;for(let k=0;k<=x;k++)s+=k;return s;}console.log(f(6));',
      'const f=n=>n<2?n:f(n-1)+f(n-2);for(let n=2;n<=5;n++)console.log(f(n));',
      'const a=[10,20,30,40];for(const i of [0,3,1,2])console.log(a[i]+i);',
    ]
    const compile = (source: string) => transpileModule(source, {
      compilerOptions: { target: ScriptTarget.ES2020, module: ModuleKind.None },
    }).outputText.replace(/\\s+/g, '')
    for (const original of samples) {
      const displayed = formatCodeForDisplay(original, 'javascript')
      expect(compile(displayed), original).toBe(compile(original))
    }
  })

  it('does not reformat deliberate syntax-error code or unknown languages', () => {
    const snippet = 'if x=5:'
    expect(formatCodeForDisplay(snippet, 'python')).toBe(snippet)
    expect(formatCodeForDisplay('SELECT * FROM x;', 'sql')).toBe('SELECT * FROM x;')
  })
})
