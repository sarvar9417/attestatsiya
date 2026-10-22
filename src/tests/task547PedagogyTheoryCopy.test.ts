import { describe, expect, it } from 'vitest'
import { markdownToTheoryBlocks } from '../features/content/professionalLessonTheory'
import { presentPedagogyTheory } from '../features/content/presentPedagogyTheory'
import type { TheoryBlock } from '../data/topicContent'

const imported = [
  '## Asl kasb standarti — A/01.6 kodi',
  '',
  '**O‘quv jarayonini rejalashtirish.** 4-betdagi **A/01.6** jadvali dars rejasini davlat ta’lim standarti hamda o‘quv dasturi maqsadlariga mos tuzishni ko‘rsatadi.',
  '',
  '**Asl manba:** Maktab pedagoglari - Kasb standarti (Oʻzbek tili).pdf, 2-bet; SHA-256 32d9f4260f98ac66c2a4ba6ae38320a49eca25e825090d9b64e7e1bc2e17b760.',
  '',
  'Qo‘shimcha tekshiruv: shu PDFning 4-beti, **A/01.6** tavsiflar jadvali.',
  '',
  '## Kuzgi 2025: diagnostika asosida dars rejasini moslashtirish',
  '',
  '2025-yil kuzgi Pedmahorat|Guli manbasining 14-betida ustoz yangi mavzudan oldin savol-javob va konseptual xarita yordamida bolalarning mavjud bilimini aniqlaydi.',
  '',
  '**Amaliy ketma-ketlik:**',
  '1. Dastlabki bilim va noto‘g‘ri tushunchalarni aniqlash.',
  '2. Dars natijalari, usullari va yordam darajasini moslashtirish.',
  '',
  '*Manba: Pedmahorat to‘plam 2025 kuzgi (3).pdf, 14-bet, 50-indeks.*',
  '',
  '## 2025 PDF: darsga tayyorgarlikning uch bosqichi',
  '',
  'Pedmahorat|Guli manbasining *Pedagogik mahorat to‘plam 2025 (6).pdf* **8-betidagi bosma 38–40-savollar** darsga tayyorgarlikni farqlash uchun uchta bosqichni ko‘rsatadi:',
  '',
  '| Bosqich | Asl manbada tasvirlangan faoliyat | Informatika darsidan yangi amaliy misol |',
  '|---|---|---|',
  '| Tashxislash | Tayanch bilimni aniqlash | Dasturlashdan avval bilish darajasini aniqlash |',
  '| Bashoratlash | Natijani oldindan ko‘rish | Juftlik yoki individual mashqni tanlash |',
  '| Loyihalash | Dars bosqichlarini belgilash | Kod va mustaqil mashq vaqtini rejalash |',
  '',
  '**Manba:** PDF 8-bet, 38–40-savollar.',
].join('\n')

describe('TASK-547: learner-facing professional theory copy', () => {
  it('replaces source-report narration with usable pedagogical exposition', () => {
    const original = markdownToTheoryBlocks(imported)
    const visible = presentPedagogyTheory(original)
    const joined = visible.map(block => block.content).join('\n')

    expect(joined).toContain('Diagnostika asosida dars rejasini moslashtirish')
    expect(joined).toContain('savol-javob va konseptual xarita')
    expect(joined).toContain('Natijaga qarab dars maqsadi')
    expect(joined).toContain('A/01.6')
    expect(joined).toContain('dars rejasini davlat ta’lim standarti')
    expect(joined).toContain('Darsga tayyorgarlikning uch bosqichi')
    expect(joined).not.toMatch(/SHA-256|Asl manba:|Qo‘shimcha tekshiruv|Pedmahorat\|Guli|2025 PDF:|14-bet, 50-indeks/)
    expect(visible.some(block => block.type === 'source')).toBe(false)

    const table = visible.find(block => block.type === 'table')
    expect(table?.headers).toEqual(['Bosqich', 'Pedagogning faoliyati', 'Informatika darsidan amaliy misol'])
    expect(table?.rows).toHaveLength(3)
    expect(table?.rows?.[2]?.[0]).toBe('Loyihalash')
    expect(imported).toContain('32d9f4260f98ac66')
    expect(original.some(block => block.content.includes('SHA-256'))).toBe(true)
  })

  it('keeps subject knowledge, coded labor functions, examples, tables and code unchanged', () => {
    const blocks: TheoryBlock[] = [
      { type: 'heading', content: 'Kasb standarti: to‘liq nazariya xaritasi [THEORY-CORPUS-2026-10-13]' },
      { type: 'text', content: 'A/05.6 — xavfsiz muhit; B/01.6 — kasbiy rivojlanish.' },
      { type: 'code', content: 'print("Manba: bu kod ichidagi foydalanuvchi matni")', language: 'python' },
      { type: 'source', content: 'Manba: boshqa hujjatdan kuzatuv' },
      { type: 'heading', content: 'Pedmahorat|Guli hujjatidan: 2-sohaning amaliy xaritasi' },
      { type: 'text', content: 'O‘quvchilarni ehtiyojiga qarab guruhlash.' },
    ]
    const visible = presentPedagogyTheory(blocks)
    expect(visible[0].content).toBe('Kasb standarti: vazifalar va ko‘nikmalar')
    expect(visible[1]).toBe(blocks[1])
    expect(visible[2]).toBe(blocks[2])
    expect(visible.at(-2)?.content).toBe('2-sohaning amaliy xaritasi')
    expect(visible.at(-1)?.content).toContain('guruhlash')
    expect(visible).toHaveLength(5)
    expect(blocks[0].content).toContain('THEORY-CORPUS')
  })

  it('omits source-only bibliography sections without swallowing the following lesson', () => {
    const blocks: TheoryBlock[] = [
      { type: 'heading', content: 'Diagnostika' },
      { type: 'text', content: 'Tashxis natijasi keyingi dars rejasiga ta’sir qiladi.' },
      { type: 'heading', content: 'Manba' },
      { type: 'text', content: 'PDF nomi; SHA-256 123abc.' },
      { type: 'heading', content: 'Amaliy misol' },
      { type: 'text', content: 'Mavzu boshida qisqa so‘rov o‘tkaziladi.' },
    ]
    const visible = presentPedagogyTheory(blocks)
    expect(visible.map(item => item.content)).toEqual([
      'Diagnostika',
      'Tashxis natijasi keyingi dars rejasiga ta’sir qiladi.',
      'Amaliy misol',
      'Mavzu boshida qisqa so‘rov o‘tkaziladi.',
    ])
    expect(presentPedagogyTheory(visible)).toEqual(visible)
  })

  it('does not invent teaching text from a source-only input', () => {
    const onlyMeta: TheoryBlock[] = [
      { type: 'source', content: 'Manba: xususiy PDF' },
      { type: 'text', content: '**Asl manba:** PDF 3-bet; SHA-256 abc.' },
      { type: 'text', content: 'Qo‘shimcha tekshiruv: 4-bet.' },
    ]
    expect(presentPedagogyTheory(onlyMeta)).toEqual([])
  })
})
