import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ExamQuestionAssets, { safeAsset } from '../features/exam/questions/ExamQuestionAssets'

describe('M07 Scratch and LOGO original 2026 audit asset', () => {
  const id = 'm07_logo_nested_squares_20261020'
  const src = '/m07-audit-2026/' + id + '.svg'

  it('renders the registered first-party SVG A–D shape options', () => {
    const asset = { kind: 'image', diagram_id: id, src, alt: 'LOGO A–D shakllari' }
    expect(safeAsset(asset)?.src).toBe(src)
    const html = renderToStaticMarkup(<ExamQuestionAssets assets={[asset]} />)
    expect(html).toContain(src)
    expect(html).toContain('LOGO A–D')
  })

  it('rejects tampered path, unknown id and external URL', () => {
    const inputs = [
      { kind: 'image', diagram_id: id, src: 'https://outside.example/logo.svg' },
      { kind: 'image', diagram_id: id, src: '/m07-audit-2026/../other.svg' },
      { kind: 'image', diagram_id: 'm07_unverified', src: '/m07-audit-2026/m07_unverified.svg' },
    ]
    for (const input of inputs) expect(safeAsset(input)).toBeNull()
  })
})
