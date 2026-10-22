import { describe, expect, it } from 'vitest'
import { projectLearnerTheoryWithoutEditorialTraces } from '../features/content/projectLearnerTheoryWithoutEditorialTraces'
import { markdownToTheoryBlocks } from '../features/content/professionalLessonTheory'
import type { TheoryBlock } from '../data/topicContent'

describe('TASK-571: general learner theory technical-source cleanup', () => {
  it('hides M08 Python/JavaScript source audit metadata but preserves theory', () => {
    const md = [
      '## JavaScript sikllari',
      'for va while sikllari berilgan shart bo‘yicha ishlaydi.',
      '',
      '**Manba izi:** Cambridge 10–11: 310–314, 19-bob; SPETS26, 4-bet.',
      '',
      '## Massivlar',
      'Massiv indekslari noldan boshlanadi.',
    ].join('\n')
    const original = markdownToTheoryBlocks(md)
    const visible = projectLearnerTheoryWithoutEditorialTraces(original)
    expect(original.some(b => b.content.includes('Manba izi'))).toBe(true)
    expect(visible.some(b => b.content.includes('Manba izi'))).toBe(false)
    expect(visible.map(b => b.content)).toEqual([
      'JavaScript sikllari', 'for va while sikllari berilgan shart bo‘yicha ishlaydi.',
      'Massivlar', 'Massiv indekslari noldan boshlanadi.',
    ])
  })

  it('hides multiple M12 network reference-only notes, but retains code and formulas', () => {
    const blocks: TheoryBlock[] = [
      { type: 'heading', content: 'Tarmoq maskasi [THEORY-CORPUS-2026-10-13]' },
      { type: 'text', content: 'IPv4 manzil 32 bitdan iborat.' },
      { type: 'source', content: '**Manba izi:** M11, 172–179-betlar; CIDR kengaytmasi.' },
      { type: 'code', content: 'print("Manba izi: bu matn kod satri")', language: 'python' },
      { type: 'formula', content: 'n = 2^{32-p}' },
      { type: 'source', content: 'Manba: RFC 4632, CIDR tavsifi.' },
      { type: 'note', content: 'Ushbu formulada prefiks uzunligi /p bilan ifodalanadi.' },
      { type: 'text', content: 'Natijani yana bir marta tekshiring.' },
    ]
    const result = projectLearnerTheoryWithoutEditorialTraces(blocks)
    expect(result[0].content).toBe('Tarmoq maskasi')
    expect(result).toHaveLength(blocks.length-1)
    expect(result.find(b=>b.type==='code')).toBe(blocks[3])
    expect(result.find(b=>b.type==='formula')).toBe(blocks[4])
    expect(result.some(b=>b.content.includes('RFC 4632'))).toBe(true)
    expect(blocks[0].content).toContain('THEORY-CORPUS')
  })

  it('keeps other sources, inline citations, tables, meaningful caveats and original input', () => {
    const blocks: TheoryBlock[] = [
      { type: 'heading', content: 'Maqsad' },
      { type: 'text', content: '7-sinf darsligi, PDF 29-betdagi misol mantiqiy bajariladi.' },
      { type: 'source', content: '**Manba:** Cambridge 9-sinf, 4-bob.' },
      { type: 'table', content: '| Shart | Javob |\n| --- | --- |\n| True | 1 |' },
    ]
    expect(projectLearnerTheoryWithoutEditorialTraces(blocks)).toBe(blocks)
    expect(projectLearnerTheoryWithoutEditorialTraces(blocks).length).toBe(4)
    expect(projectLearnerTheoryWithoutEditorialTraces([])).toEqual([])
  })

  it('filters source-note text variants idempotently, without mutating originals', () => {
    const src: TheoryBlock[] = [
      { type: 'note', content: 'Manba izi: ichki audit ID.' },
      { type: 'text', content: '> **Manba izi:** pedagogika PDF, 23-bet.' },
      { type: 'text', content: 'Manba izidan foydalanishni o‘rganing.' },
      { type: 'heading', content: 'Mavzu' },
    ]
    const first=projectLearnerTheoryWithoutEditorialTraces(src)
    expect(first).toHaveLength(2)
    expect(first[0].content).toContain('Manba izidan')
    expect(projectLearnerTheoryWithoutEditorialTraces(first)).toBe(first)
    expect(src).toHaveLength(4)
  })
})
