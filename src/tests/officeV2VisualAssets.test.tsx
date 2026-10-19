import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ExamQuestionAssets from '../features/exam/questions/ExamQuestionAssets'

describe('Office V2 visual assets', () => {
  it('renders audited first-party Office chart and table assets', () => {
    for (const id of ['off_bar','off_line','off_pie','off_table','off_slides','off_timeline','off_wordtable']) {
      const html = renderToStaticMarkup(<ExamQuestionAssets assets={[{kind:'image',diagram_id:id,src:`/office-v2/${id}.svg`,alt:'Office diagramma'}]} />)
      expect(html).toContain(`/office-v2/${id}.svg`)
    }
  })
  it('rejects external URLs and unapproved files', () => {
    const html=renderToStaticMarkup(<ExamQuestionAssets assets={[{kind:'image',diagram_id:'off_bar',src:'https://evil.example/img.svg',alt:'test'},{kind:'image',diagram_id:'off_other',src:'/office-v2/off_other.svg',alt:'test'}]} />)
    expect(html).not.toContain('<img')
  })
  it('preserves existing algorithm diagram rendering', () => {
    const html=renderToStaticMarkup(<ExamQuestionAssets assets={[{kind:'image',diagram_id:'flow_sum',src:'/algoritmlash-v2/flow_sum.svg',alt:'Sum'}]} />)
    expect(html).toContain('/algoritmlash-v2/flow_sum.svg')
  })
})
