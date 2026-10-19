import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import PedagogyTheoryBlock from '../components/learning/PedagogyTheoryBlock'

describe('pedagogy source readability on narrow screens', () => {
  it('wraps long Drive PDF source references without growing the main page width', () => {
    const longReference = 'https://drive.google.com/file/d/' + 'A'.repeat(90) + '/view'
    const html = renderToStaticMarkup(
      createElement(PedagogyTheoryBlock, {
        block: { type: 'source', content: 'Manba: ' + longReference },
      })
    )
    expect(html).toContain('min-w-0 break-words [overflow-wrap:anywhere]')
    expect(html).toContain('Foydalanilgan manba')
    expect(html).toContain(longReference)
    expect(html).not.toContain('dangerouslySetInnerHTML')
  })
})
