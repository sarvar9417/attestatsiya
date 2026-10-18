import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ExamQuestionAssets from './ExamQuestionAssets'

describe('Algoritmlash V2 SVG question assets', () => {
  it('shows an allowlisted same-origin image with descriptive alternative text', () => {
    render(<ExamQuestionAssets assets={[{
      kind: 'image', diagram_id: 'flow_sum', alt: 'A va B yig‘indisi sxemasi',
      src: '/algoritmlash-v2/flow_sum.svg',
    }]} />)
    const img = screen.getByRole('img', { name: 'A va B yig‘indisi sxemasi' })
    expect(img.getAttribute('src')).toBe('/algoritmlash-v2/flow_sum.svg')
  })
  it('rejects external and unrecognized assets without rendering inline markup', () => {
    const { container } = render(<ExamQuestionAssets assets={[
      { kind: 'image', diagram_id: 'flow_sum', alt: 'X', src: 'https://evil.example/x.svg' },
      { kind: 'image', diagram_id: 'unknown', alt: '<svg onload=alert(1)>', src: '/algoritmlash-v2/unknown.svg' },
      { kind: 'image', diagram_id: 'flow_sum', alt: 'X', src: 'data:image/svg+xml;base64,AAAA' },
    ]} />)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('svg')).toBeNull()
  })
  it('handles missing assets', () => {
    const { container } = render(<ExamQuestionAssets assets={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
