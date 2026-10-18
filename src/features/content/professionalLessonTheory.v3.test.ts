import { describe, expect, it } from 'vitest'
import { markdownToTheoryBlocks } from './professionalLessonTheory'

describe('Algoritmlash V3 local source diagrams', () => {
  it('renders known local SVG references as diagram blocks', () => {
    const blocks = markdownToTheoryBlocks('## Sikl\n\n![Gacha sikli](/algoritmlash-v3/loop_until.svg)\n\nIzoh')
    expect(blocks.some(block => block.type === 'diagram' && block.diagram === '/algoritmlash-v3/loop_until.svg' && block.content === 'Gacha sikli')).toBe(true)
  })
  it('does not treat arbitrary web or script URLs as diagram blocks', () => {
    const blocks = markdownToTheoryBlocks('![X](https://example.com/unsafe.svg)\n\n![X](javascript:alert(1))')
    expect(blocks.every(block => block.type !== 'diagram')).toBe(true)
  })
  it('allows existing source-backed V2 diagrams', () => {
    const blocks = markdownToTheoryBlocks('![EKUB](/algoritmlash-v2/flow_euclid.svg)')
    expect(blocks[0].type).toBe('diagram')
  })
})
