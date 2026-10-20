import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { markdownToTheoryBlocks } from '../features/content/professionalLessonTheory'
import BookBlock from '../components/learning/theory/BookBlock'
import type { TheoryBlock } from '../data/topicContent'
const fixture = String.raw`# Kompyuter tarmoqlari

## IP maskasi

| Tarmoq | Maska |
| --- | --- |
| /26 | 255.255.255.192 |

\[2^h - 2 \ge H\]

[[NETFIG:NET02]] Yulduz va halqa topologiyalari
`
describe('TASK-220 source-faithful M12 theory blocks',()=>{
  const blocks=markdownToTheoryBlocks(fixture)
  it('preserves Markdown table headers and rows',()=>{
    const table=blocks.find(x=>x.type==='table')
    expect(table?.headers).toEqual(['Tarmoq','Maska'])
    expect(table?.rows).toEqual([['/26','255.255.255.192']])
  })
  it('renders display math with KaTeX and no visible TeX delimiter',()=>{
    const formula=blocks.find(x=>x.type==='formula') as TheoryBlock
    expect(formula.content).toContain('2^h')
    const html=renderToStaticMarkup(<BookBlock index={2} block={formula} />)
    expect(html).toContain('katex')
    expect(html).toContain('2')
  })
  it('renders the network topology diagram with accessible legend',()=>{
    const diagram=blocks.find(x=>x.type==='diagram') as TheoryBlock
    expect(diagram.diagram).toBe('NET02')
    const html=renderToStaticMarkup(<BookBlock index={3} block={diagram} />)
    expect(html).toContain('Yulduz')
    expect(html).toContain('Halqa')
    expect(html).toContain('role="img"')
  })
  it('does not invent a figure for unrecognized IDs',()=>{
    const html=renderToStaticMarkup(<BookBlock index={0}
      block={{type:'diagram',diagram:'UNLISTED',content:''} as TheoryBlock} />)
    expect(html).toBe('')
  })
})
