import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { TheoryBlock } from './TopicView'

describe('TopicView diagram fallback renderer', () => {
  it('shows a shipped V3 algorithm diagram instead of only its caption', () => {
    const html = renderToStaticMarkup(
      <TheoryBlock block={{
        type: 'diagram', content: 'Shart keyin tekshiriladigan sikl',
        diagram: '/algoritmlash-v3/loop_until.svg',
      }} />,
    )
    expect(html).toContain('<img')
    expect(html).toContain('src="/algoritmlash-v3/loop_until.svg"')
    expect(html).toContain('<figcaption')
  })

  it('still handles V2 local diagrams', () => {
    const html = renderToStaticMarkup(
      <TheoryBlock block={{
        type: 'diagram', content: 'EKUB', diagram: '/algoritmlash-v2/flow_euclid.svg',
      }} />,
    )
    expect(html).toContain('src="/algoritmlash-v2/flow_euclid.svg"')
  })

  it('does not resolve unknown or external SVG paths', () => {
    for (const path of [
      'https://external.example/diagram.svg',
      '/algoritmlash-v3/unshipped.svg',
      '/algoritmlash-v3/../secret.svg',
    ]) {
      const html = renderToStaticMarkup(
        <TheoryBlock block={{ type: 'diagram', content: 'Rasm topilmadi', diagram: path }} />,
      )
      expect(html).not.toContain('<img')
      expect(html).toContain('Rasm topilmadi')
    }
  })
})
