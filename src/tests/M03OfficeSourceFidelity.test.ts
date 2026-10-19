import { describe, expect, it } from 'vitest'
import { getTopicContent } from '../data/topicContent'

describe('TASK-268: original-textbook Office fallback accuracy', () => {
  it('distinguishes Word Design page borders from Layout margins', () => {
    const content = getTopicContent('M03.01')
    const table = content?.theory.find(block => block.type === 'table' && block.content.includes('Design | Mavzular, ranglar'))?.content ?? ''
    expect(table).toContain('Design | Mavzular, ranglar va sahifa chegaralari (Page Borders)')
    expect(table).toContain('Layout | Maydonlar,')
    expect(table).not.toContain('Design | Sahifa chetlari,')
  })

  it('distinguishes COUNT numeric cells from COUNTA nonblank cells', () => {
    const content = getTopicContent('M03.05')
    const table = content?.theory.find(block => block.type === 'table' && block.content.includes('COUNT | =COUNT(A1:A10)'))?.content ?? ''
    expect(table).toContain('COUNT | =COUNT(A1:A10) | Son yozilgan kataklarni sanash')
    expect(table).toContain("COUNTA | =COUNTA(A1:A10) | Bo'sh bo'lmagan kataklarni sanash")
    expect(table).not.toContain('COUNTA | =COUNTA(A1:A10) | Barcha qiymatlarni sanash')
  })

  it('labels AutoSum with its sum sign and its actual task', () => {
    const content = getTopicContent('M03.05')
    const note = content?.theory.find(block => block.type === 'note')?.content ?? ''
    expect(note).toContain('AutoSum (Σ)')
    expect(note).toContain("yig'indisini tez hisoblash")
    expect(note).not.toContain('AutoSum (S)')
  })
})
