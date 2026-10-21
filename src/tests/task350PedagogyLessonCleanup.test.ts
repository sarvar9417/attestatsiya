import { describe, expect, it } from 'vitest'
import { cleanLearnerPedagogyText } from '../features/content/learnerPedagogyTextCleanup'
import { markdownToTheoryBlocks, overlayPublishedProfessionalLesson } from '../features/content/professionalLessonTheory'
import type { LessonSummary } from '../features/content/contentApi'
import type { TopicContent } from '../data/topicContent'

const importedNotes = [
  '## Maqsad',
  'O‘quv maqsadini aniqlash.',
  '## Telegram manbasidan: kasbiy standartning 7 sohasini ajratish',
  '',
  'Kanal muallifining qisqa tayanch belgilarini tizimlashtirish:',
  '1. **O‘quv jarayonini rejalashtirish:** maqsad, reja, DTS.',
  '2. **Ta’lim samaradorligi:** metodlardan foydalanish.',
  '3. **Baholash:** mezon va qayta aloqa.',
  '4. **Tarbiyaviy faoliyat:** xulq.',
  '5. **Xavfsiz muhit:** himoya.',
  '6. **Kasbiy o‘sish:** malaka.',
  '7. **Hamkorlik:** jamoa.',
  '',
  '*Telegramdagi manba:* [Pedmahorat|Guli, 15293-xabar](https://t.me/PedMahoratGuli/15293).',
  '',
  '## Asl kasb standarti — A/01.6 kodi',
  'A/01.6 rejalashtirishga tegishli.',
].join('\n')

const summary: LessonSummary = {
  id: '14000000-0000-4000-8000-000000000001',
  module_id: '14000000-0000-4000-8000-000000000000',
  slug: 'oquv-jarayonini-rejalashtirish',
  title_uz: 'O‘quv jarayonini rejalashtirish',
  body_mdx: importedNotes,
  blocks: null, blocks_kind: 'chapter', est_minutes: 10, order_idx: 1,
  status: 'published', constructs: [],
}
const fallback: TopicContent = {
  subtopicId: 'M14.01', title: 'Kasb standarti',
  theory: [{ type: 'text', content: 'Asosiy ta’rif' }],
  questions: [],
}

describe('TASK-350: pedagogy source-note cleanup', () => {
  it('keeps all seven professional-standard areas, now as a usable comparison table', () => {
    const cleaned = cleanLearnerPedagogyText(importedNotes)
    const blocks = markdownToTheoryBlocks(cleaned)
    const table = blocks.find(block => block.type === 'table')
    expect(table?.rows).toHaveLength(7)
    expect(table?.headers).toEqual(['Kasbiy soha', 'Pedagogning asosiy harakati', 'Vaziyat belgisi'])
    expect(table?.rows?.[0][0]).toBe('O‘quv jarayonini rejalashtirish')
    expect(table?.rows?.[6][0]).toBe('Hamkorlik')
    expect(cleaned).toContain('o‘quvchini bevosita tahdiddan himoya qilish')
    expect(cleaned).not.toMatch(/Telegram manbasidan|Telegramdagi manba|Kanal muallifining|15293-xabar/)
    expect(cleaned).toContain('## Asl kasb standarti — A/01.6 kodi')
  })

  it('does not change original published data and never modifies unpublished lessons', () => {
    const result = overlayPublishedProfessionalLesson(fallback, summary)
    expect(result.theory.some(block => block.type === 'table' && block.rows?.length === 7)).toBe(true)
    expect(result.theory.some(block => block.content.includes('Telegram manbasidan'))).toBe(false)
    expect(summary.body_mdx).toBe(importedNotes)
    expect(overlayPublishedProfessionalLesson(fallback, {...summary, status: 'review'})).toBe(fallback)
  })

  it('cleans editorial headings in other M14/M15 source additions, keeping didactic content', () => {
    const input = [
      '## Pedagogik texnika [THEORY-CORPUS-2026-10-13]',
      'Pedagogik texnika o‘qituvchining usul tanlash mahorati.',
      '## Telegram manbasidan: baholash madaniyati',
      'Kanal muallifining eslatmasiga ko‘ra, o‘qituvchi:',
      '- oldindan aniq mezonga tayanadi',
      '*Telegramdagi manbalar:* [9078](https://t.me/PedMahoratGuli/9078).',
      '## Pedmahorat|Guli manbasidan: baholash nazariyasi',
      'Izohli nazariya matni.',
      '## Telegram qo‘llanmasi: diagnostika',
      'Diagnostika bo‘yicha ta’rif.',
      '### Pedagogik ko‘nikma [PEDGULI-STUDY-2026-01]',
      'Kanal muallifining tezkor eslatmasida yangilikka munosabat shunday farqlanadi:',
    ].join('\n')
    const actual = cleanLearnerPedagogyText(input)
    expect(actual).toContain('## Pedagogik texnika')
    expect(actual).toContain('## baholash madaniyati')
    expect(actual).toContain('Baholash jarayonida o‘qituvchi:')
    expect(actual).toContain('## baholash nazariyasi')
    expect(actual).toContain('## diagnostika')
    expect(actual).toContain('### Pedagogik ko‘nikma')
    expect(actual).toContain('Yangilikka munosabatni quyidagi bosqichlarda farqlash mumkin:')
    expect(actual).toContain('Izohli nazariya matni.')
    expect(actual).not.toMatch(/THEORY-CORPUS|PEDGULI-STUDY|Telegramdagi manbalar|Telegram manbasidan|Pedmahorat\|Guli manbasidan|Kanal muallifining/)
    expect(cleanLearnerPedagogyText(actual)).toBe(actual)
  })

  it('does not remove academic PDF evidence or turn source labels into missing content', () => {
    const input = [
      '## Manba',
      'Kasb standarti, PDF 4–5-betlar.',
      '**Manba izi:** Kasb standarti, A/01.6.',
    ].join('\n')
    expect(cleanLearnerPedagogyText(input)).toBe(input)
    expect(cleanLearnerPedagogyText('')).toBe('')
  })

  it('leaves other subjects and preexisting parser behavior unchanged', () => {
    const other = {...summary, body_mdx: importedNotes}
    const staticModule = {...fallback, subtopicId:'M16.03'}
    const result = overlayPublishedProfessionalLesson(staticModule, other)
    expect(result.theory.some(b => b.content.includes('Telegram manbasidan'))).toBe(true)
  })
})
