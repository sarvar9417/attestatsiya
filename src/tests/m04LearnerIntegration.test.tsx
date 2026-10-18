import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import MantiqCircuit from '../components/learning/theory/MantiqCircuit'
import InlineText from '../components/learning/theory/InlineText'
import { overlayPublishedProfessionalLesson, resolveLearnerTheoryContent } from '../features/content/professionalLessonTheory'
import type { TopicContent } from '../data/topicContent'
import type { LessonSummary } from '../features/content/contentApi'

const local: TopicContent = {
  subtopicId: 'M04.04',
  title: 'Mantiqiy sxemalar',
  theory: [{ type: 'text', content: 'Eski qisqa konspekt' }],
  questions: [],
}
const database: LessonSummary = {
  id: '94000000-0000-4000-8000-000000000004',
  module_id: '00000000-0000-0000-0000-000000001004',
  title_uz: 'Mantiqiy elementlar va sxemalar',
  slug: 'rostlik-jadvali-va-mantiqiy-sxema',
  body_mdx: '## 6-bob. Mantiqiy elementlar va sxemalar\n\nAsosiy elementlar: AND, OR va NOT.\n\n## 9-bob. Grafik sxemalarni tahlil qilish\n\nIkki bosqichli chizma.',
  est_minutes: 30,
  order_idx: 4,
  status: 'published',
  blocks_kind: 'chapter',
  blocks: null,
  constructs: [],
}

describe('M04 complete learner integration', () => {
  it('replaces the fallback text with the imported multi-chapter theory', () => {
    const remote = overlayPublishedProfessionalLesson(local, database)
    const selected = resolveLearnerTheoryContent('M04.04', local, remote)
    expect(selected).toBe(remote)
    expect(selected.theory.filter(b => b.type === 'heading').map(b => b.content)).toEqual([
      '6-bob. Mantiqiy elementlar va sxemalar',
      '9-bob. Grafik sxemalarni tahlil qilish',
    ])
  })

  it('renders NOT(AND) with visible G1 and G2 labels and the output Y', () => {
    const html = renderToStaticMarkup(<MantiqCircuit id="G001" />)
    expect(html).toContain('data-fig="G001"')
    expect(html).toContain('>G1</text>')
    expect(html).toContain('>G2</text>')
    expect(html).toContain('>Y</text>')
    expect(html).not.toContain('undefined')
  })

  it('renders a three-input graph and preserves non-graph math', () => {
    const html = renderToStaticMarkup(<InlineText text="Kirish: [[FIG:G004]]  $A\\land B$" />)
    expect(html).toContain('data-fig="G004"')
    expect(html).toContain('>G1</text>')
    expect(html).toContain('>G2</text>')
    expect(html).toContain('katex')
  })

  it('fails safely when a figure identifier is absent', () => {
    const html = renderToStaticMarkup(<MantiqCircuit id="G999" />)
    expect(html).toContain('Chizma topilmadi')
  })
})
