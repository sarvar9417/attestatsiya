import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ExamQuestionAssets, { legacyPedguliDebateReviewId } from './ExamQuestionAssets'

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

describe('Kuzgi demo original cropped pictures', () => {
  it('renders the trusted Scratch code and graphical options in source order', () => {
    render(<ExamQuestionAssets assets={[
      { kind: 'image', diagram_id: 'demo_q04_blocks', alt: 'Scratch kodi', src: '/kuzgi-demo/demo_q04_blocks.svg' },
      { kind: 'image', diagram_id: 'demo_q04_options', alt: 'A–D grafik javoblar', src: '/kuzgi-demo/demo_q04_options.svg' },
    ]} />)
    expect(screen.getByRole('img', { name: 'Scratch kodi' }).getAttribute('src'))
      .toBe('/kuzgi-demo/demo_q04_blocks.svg')
    expect(screen.getByRole('img', { name: 'A–D grafik javoblar' })).toBeTruthy()
    const zoom = screen.getByRole('link', { name: /A–D grafik javoblar.*to‘liq hajmda/ })
    expect(zoom.getAttribute('href')).toBe('/kuzgi-demo/demo_q04_options.svg')
    expect(zoom.getAttribute('rel')).toContain('noopener')
  })

  it('does not accept a remote URL or arbitrary filename even if it looks like a demo crop', () => {
    const { container } = render(<ExamQuestionAssets assets={[
      { kind: 'image', diagram_id: 'demo_q04_options', src: 'https://drive.google.com/unknown.png', alt: 'remote' },
      { kind: 'image', diagram_id: 'demo_q14_labyrinth', src: '/kuzgi-demo/../../secrets.svg', alt: 'path traversal' },
      { kind: 'image', diagram_id: 'demo_q99_logic', src: '/kuzgi-demo/demo_q99_logic.svg', alt: 'not audited' },
      { kind: 'source_screenshot', drive_file_id: 'some-drive-id', image_ordinals: ['q04'] },
    ]} />)
    expect(container.querySelectorAll('img')).toHaveLength(0)
  })
})

describe('Kuzgi demo question 30 logic diagram', () => {
  it('renders the cropped first-party AND/OR diagram and a full-size link', () => {
    render(<ExamQuestionAssets assets={[{
      kind: 'image',
      diagram_id: 'demo_q30_logic',
      src: '/kuzgi-demo/demo_q30_logic.svg',
      alt: 'A, B va C kirishli AND/OR mantiqiy sxemasi',
    }]} />)
    expect(screen.getByRole('img', { name: 'A, B va C kirishli AND/OR mantiqiy sxemasi' })
      .getAttribute('src')).toBe('/kuzgi-demo/demo_q30_logic.svg')
    expect(screen.getByRole('link', { name: /AND\/OR mantiqiy sxemasi.*to‘liq hajmda/ })
      .getAttribute('href')).toBe('/kuzgi-demo/demo_q30_logic.svg')
  })

  it('rejects a spoofed asset path for the allowlisted q30 diagram', () => {
    const { container } = render(<ExamQuestionAssets assets={[{
      kind: 'image',
      diagram_id: 'demo_q30_logic',
      src: 'https://example.invalid/diagram.svg',
      alt: 'Untrusted',
    }]} />)
    expect(container.querySelector('img')).toBeNull()
  })
})


describe('TASK-346 source-verified PedGuli media', () => {
  const legacyId = 'd41ab61f-a43e-4b2d-919b-5b06dde05341'
  const debateSrc = '/pedguli-source/pedguli-4843-debate.jpg'

  it('restores the exact original photo for the affected published question only', () => {
    render(<ExamQuestionAssets questionId={legacyId} assets={[]} />)
    const picture = screen.getByRole('img', {
      name: 'Ikki kishi minbardan navbat bilan bahslashayotgan sinf mashg‘uloti',
    })
    expect(picture).toHaveAttribute('src', debateSrc)
    expect(screen.getByRole('link', { name: /to‘liq hajmda ochish/i })).toHaveAttribute('href', debateSrc)
  })

  it('does not inject images for any other question or untrusted supplied asset', () => {
    const { container } = render(
      <ExamQuestionAssets questionId="00000000-0000-4000-8000-000000000000" assets={[]} />
    )
    expect(container.querySelector('img')).toBeNull()
    const { container: malformed } = render(
      <ExamQuestionAssets questionId={legacyId}
        assets={[{ kind: 'image', diagram_id: 'pedguli-4843-debate', src: 'https://evil.invalid/a.jpg' }]} />
    )
    expect(malformed.querySelector('img')).toBeNull()
  })

  it('accepts both audited Telegram photo paths without allowing arbitrary JPGs', () => {
    render(<ExamQuestionAssets assets={[
      {
        kind: 'image', diagram_id: 'pedguli-4842-classroom-game',
        src: '/pedguli-source/pedguli-4842-classroom-game.jpg',
        alt: 'Ta’limiy o‘yin mashg‘uloti',
      },
      { kind: 'image', diagram_id: 'pedguli-4843-debate', src: debateSrc, alt: 'Debat' },
      { kind: 'image', diagram_id: 'pedguli-4844-debate', src: '/pedguli-source/pedguli-4844-debate.jpg' },
    ]} />)
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })
})

describe('TASK-346 historical result photo recovery', () => {
  const stem = '❗️❗️❗️\\n\\nUshbu suratda qaysi metod tasvirlangan?'
  const options = ['Debrifing', 'Debat', 'Diskussiya', 'Demonstratsiya'].map(content_md => ({ side: 'a', content_md }))

  it('restores only the exact four-option Debat source in historical review', () => {
    expect(legacyPedguliDebateReviewId(stem, options)).toBe('d41ab61f-a43e-4b2d-919b-5b06dde05341')
    expect(legacyPedguliDebateReviewId('Unrelated', options)).toBeUndefined()
    expect(legacyPedguliDebateReviewId(stem, [
      { side: 'a', content_md: 'Aqliy hujum' }, ...options.slice(1),
    ])).toBeUndefined()
    expect(legacyPedguliDebateReviewId(stem, [{ side: 'b', content_md: 'Debat' }])).toBeUndefined()
  })
})


describe('TASK-346 complete visual asset audit, release 2', () => {
  it('renders every originally authored V4 diagram used by six published algorithm items', () => {
    const files = ['flow_product_3_9','flow_until_negative','dag_paths_a_j']
    const { container } = render(<ExamQuestionAssets assets={files.map(diagram_id => ({
      kind: 'image', diagram_id, alt: 'Algoritm diagrammasi',
      src: '/algoritmlash-v4/' + diagram_id + '.svg',
    }))} />)
    expect([...container.querySelectorAll('img')].map(img => img.getAttribute('src')))
      .toEqual(files.map(file => '/algoritmlash-v4/' + file + '.svg'))
  })

  it('renders all nine review graphics/web legacy images which have no diagram_id', () => {
    const files = ['layer_stack','html_table','crop_grid','raster_grid',
      'palette_grid','css_box','dom_tree','nested_list']
    const { container } = render(<ExamQuestionAssets assets={files.map(file => ({
      kind: 'image', src: '/graphics-web-v2/' + file + '.svg',
      alt: 'Tekshirilgan chizma',
    }))} />)
    expect(container.querySelectorAll('img')).toHaveLength(files.length)
  })

  it('rejects forged, remote or malformed legacy graphics assets', () => {
    const { container } = render(<ExamQuestionAssets assets={[
      { kind: 'image', src: '/graphics-web-v2/evil.svg' },
      { kind: 'image', src: '/graphics-web-v2/dom_tree.svg', diagram_id: 'css_box' },
      { kind: 'image', src: 'https://evil.test/graphics-web-v2/dom_tree.svg' },
      { kind: 'image', src: '/graphics-web-v2/../dom_tree.svg' },
      { kind: 'image', src: '/graphics-web-v2/dom_tree.svg', diagram_id: null },
      { kind: 'source_screenshot', drive_file_id: 'untrusted-source' },
    ]} />)
    expect(container.querySelectorAll('img')).toHaveLength(0)
  })

  it('recovers the separate 4842 source photo without confusing it with 4843', () => {
    const gameId = '05d53eb9-56de-454c-9440-e207668dd2c4'
    const { container } = render(<ExamQuestionAssets assets={[]} questionId={gameId} />)
    expect(container.querySelector('img')?.getAttribute('src'))
      .toBe('/pedguli-source/pedguli-4842-classroom-game.jpg')
    expect(container.querySelectorAll('img')).toHaveLength(1)
    expect(legacyPedguliDebateReviewId(
      'Ushbu suratda qaysi metod tasvirlangan?',
      ['Talimiy o’yinlar yoki raqobatchilik','Aqliy hujum','Diskussiya','Demonstratsiya']
        .map(content_md => ({ side: 'a', content_md })),
    )).toBe(gameId)
  })
})
