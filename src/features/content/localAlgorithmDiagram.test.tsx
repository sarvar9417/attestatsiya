import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import BookBlock from '../../components/learning/theory/BookBlock'
import { markdownToTheoryBlocks } from './professionalLessonTheory'
import { isLocalAlgorithmSvgPath } from './localAlgorithmDiagram'

describe('source-backed local algorithm diagrams', () => {
  it('turns a shipped V3 file reference into one diagram block', () => {
    const blocks = markdownToTheoryBlocks(
      '## Sikl\n\n![Gacha sikli](/algoritmlash-v3/loop_until.svg)\n\nIzoh',
    )
    expect(blocks).toContainEqual({
      type: 'diagram', content: 'Gacha sikli', diagram: '/algoritmlash-v3/loop_until.svg',
    })
  })

  it('renders the shipped diagram into a responsive image', () => {
    const html = renderToStaticMarkup(
      <BookBlock
        index={0}
        block={{ type: 'diagram', content: 'Gacha sikli', diagram: '/algoritmlash-v3/loop_until.svg' }}
      />,
    )
    expect(html).toContain('<img')
    expect(html).toContain('src="/algoritmlash-v3/loop_until.svg"')
    expect(html).toContain('alt="Gacha sikli"')
    expect(html).toContain('<figcaption')
  })

  it('preserves the preexisting V2 diagram route', () => {
    const blocks = markdownToTheoryBlocks('![EKUB](/algoritmlash-v2/flow_euclid.svg)')
    expect(blocks).toContainEqual({
      type: 'diagram', content: 'EKUB', diagram: '/algoritmlash-v2/flow_euclid.svg',
    })
  })

  it('does not accept arbitrary local SVGs, external URLs or JavaScript URLs', () => {
    const markdown = [
      '![X](/algoritmlash-v3/unshipped.svg)',
      '![X](/algoritmlash-v3/../private.svg)',
      '![X](https://example.com/foo.svg)',
      '![X](javascript:alert(1))',
    ].join('\n\n')
    expect(markdownToTheoryBlocks(markdown).every(block => block.type !== 'diagram')).toBe(true)
    expect(isLocalAlgorithmSvgPath('/algoritmlash-v2/flow_euclid.svg')).toBe(true)
    expect(isLocalAlgorithmSvgPath('/algoritmlash-v3/unshipped.svg')).toBe(false)
    const html = renderToStaticMarkup(
      <BookBlock index={0} block={{ type: 'diagram', diagram: 'https://example.com/evil.svg', content: 'X' }} />,
    )
    expect(html).not.toContain('<img')
  })

  it('does not break existing named network figures', () => {
    expect(markdownToTheoryBlocks('[[NETFIG:NET01]] Tarmoq sxemasi')).toContainEqual({
      type: 'diagram', diagram: 'NET01', content: 'Tarmoq sxemasi',
    })
  })
})
