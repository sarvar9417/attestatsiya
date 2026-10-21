import { describe, expect, it } from 'vitest'
import { learnerExplanation } from './learnerExplanation'

describe('TASK-369 learner-facing explanations', () => {
  it('removes candidate IDs, PDF keys, source footer and checkmark editorial text', () => {
    const original = [
      'Hamkasbdan metod va raqamli vositani o‘rganib amalda ishlatish kasbiy rivojlanishdir. Manba javobi shu.',
      '',
      'Manba: Pedagogik mahorat to‘plam 2025 (6).pdf, 13-bet, asl PDFdagi №69 savol (baza kandidati 66). PDF muallif kaliti saqlandi; boshqa variantlar platforma uchun moslashtirilgan.',
    ].join('\n')
    const actual = learnerExplanation(original)
    expect(actual).toBe('Hamkasbdan metod va raqamli vositani o‘rganib amalda ishlatish kasbiy rivojlanishdir.')
    expect(actual).not.toMatch(/Manba javobi|PDF muallif|kandidati|13-bet/i)
    expect(learnerExplanation(actual)).toBe(actual)
  })

  it('removes plain, Markdown and Telegram provenance blocks in all subjects', () => {
    expect(learnerExplanation('Mulohaza rost yoki yolg‘on bo‘ladi.\n\nManba: ICT9, PDF 5–18'))
      .toBe('Mulohaza rost yoki yolg‘on bo‘ladi.')
    expect(learnerExplanation('Sinfda hurmat saqlanadi.\n\n**Manba:** 2025 PDF'))
      .toBe('Sinfda hurmat saqlanadi.')
    expect(learnerExplanation('Hodisa namoyish etiladi.\n\n*Telegramdagi manba:* [9408](https://t.me/PedMahoratGuli/9408)'))
      .toBe('Hodisa namoyish etiladi.')
    expect(learnerExplanation('Sabab izohlanadi.\r\n\r\nAsl manba: xabar 5'))
      .toBe('Sabab izohlanadi.')
  })

  it('preserves a pedagogical comparison even when one sentence cites an academic figure', () => {
    const explanation = 'Tushuntirish ikki bosqichda olib boriladi. Forobiyning pedagogik qarashlari ham mavzuga doir.\n\nQo‘shimcha misol va asoslash berilgan.'
    expect(learnerExplanation(explanation)).toBe(explanation)
  })

  it('preserves mathematical, multiline and code explanations unless there is a dedicated source paragraph', () => {
    const explanation = 'Ko‘paytirish natijasi: 3 * 4 = 12.\n\n\`\`\`python\nprint(12)\n\`\`\`'
    expect(learnerExplanation(explanation)).toBe(explanation)
  })

  it('removes orphan mapping key phrases while retaining actual concept differences', () => {
    const source = 'Diapazon — ovoz chegarasi; artikulyatsiya — nutq a’zolari ishi. PDF 1-A,2-C.\n\nManba: o‘quv PDF'
    expect(learnerExplanation(source)).toBe('Diapazon — ovoz chegarasi; artikulyatsiya — nutq a’zolari ishi.')
  })

  it('does not invent an explanation for empty data, and flags pure-source explanations', () => {
    expect(learnerExplanation(null)).toBe('')
    expect(learnerExplanation('')).toBe('')
    expect(learnerExplanation('Manba: PDF, sahifa 13')).toBe('Bu savolning batafsil tushuntirishi tahrir qilinmoqda.')
    expect(learnerExplanation('Asl PDF javobi shu.')).toBe('Bu savolning batafsil tushuntirishi tahrir qilinmoqda.')
  })

  it('does not expose a known answer key or contain a question-specific override table', () => {
    const explanation = learnerExplanation('Kasbiy o‘sish kuzatilgan. Manba javobi shu.')
    expect(explanation).toBe('Kasbiy o‘sish kuzatilgan.')
  })
})
