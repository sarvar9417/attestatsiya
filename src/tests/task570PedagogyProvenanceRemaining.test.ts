import { describe, expect, it } from 'vitest'
import { markdownToTheoryBlocks } from '../features/content/professionalLessonTheory'
import { presentPedagogyTheory } from '../features/content/presentPedagogyTheory'

function learner(markdown: string) {
  return presentPedagogyTheory(markdownToTheoryBlocks(markdown)).map(block => block.content).join('\n')
}

describe('TASK-570: remaining pedagogical source narration is replaced with study copy', () => {
  it('renders a real-world safety example without repeating the source title or the teacher role', () => {
    const original = [
      '## Xavfsiz muhit',
      '',
      '`PedKasb tushgan testlar PedMahoratGuli (1) (1) (1).pdf` ning **59-savolida** jismoniy tarbiya o‘qituvchisi internetdagi sportga oid axborotni ishonchlilik nuqtayi nazaridan tahlil qildirishi, mashqlarda bolalarning jismoniy holatini individual nazorat qilishi va mas’uliyatni mustahkamlashi tasvirlangan.',
    ].join('\n')
    const output = learner(original)
    expect(output).toContain('Jismoniy tarbiya darsida o‘qituvchi')
    expect(output).toContain('axborotni ishonchlilik')
    expect(output).not.toContain('jismoniy tarbiya darsida jismoniy tarbiya')
    expect(output).not.toMatch(/\.pdf|59-savol|PedMahoratGuli/)
  })

  it('keeps diagnostic classifications without a Telegram post citation', () => {
    const input = '**Manbadagi tasnif:** Pedmahorat|Guli Telegram kanalining [6075-xabari](https://t.me/PedMahoratGuli/6075) pedagogik diagnostikaning to‘rtta vazifasini ajratadi. Bu aynan kanal qo‘llanmasidagi tasnif bo‘lib, barcha ilmiy maktablar uchun yagona ro‘yxat sifatida ko‘rsatilmaydi.'
    const output = learner(input)
    expect(output).toContain('to‘rtta vazifasini')
    expect(output).toContain('barcha ilmiy maktablar uchun yagona')
    expect(output).not.toMatch(/Telegram|6075|Pedmahorat/)
  })

  it('preserves the caution that scholarly taxonomies are not interchangeable', () => {
    const input = '**Manbalardagi tasniflar bir xil emas.** *Pedagogik qobilyatlar umumiy.pdf* muayyan olimlar tasniflarini ham keltiradi. Testda muallif yoki tasnif aytilgan bo‘lsa, javobni aynan shu tasnif doirasida tekshiring; turli tasniflarni mexanik ravishda bitta ro‘yxatga qo‘shmang.'
    const output = learner(input)
    expect(output).toContain('Turli olimlar')
    expect(output).toContain('yondashuv doirasida')
    expect(output).not.toMatch(/\.pdf|Manbalardagi/)
  })

  it('avoids converting disputed historical answer wording into a normative rule', () => {
    const input = '2026 bahorgi to‘plamning bir savolida “talab qilinayotgan kattalikdan boshlab berilgan kattaliklarga tomon borish” **sintetik usul** deb berilgan. Bu terminologiya boshqa metodik manbalarda boshqacha tasniflanishi mumkin; platforma bu tarixiy javobni mustaqil nazariy qoida sifatida tasdiqlamaydi va editorial tekshiruvsiz savol kaliti sifatida nashr etmaydi.'
    const output = learner(input)
    expect(output).toContain('analitik va sintetik')
    expect(output).toContain('masala qaysi yo‘nalishda')
    expect(output).not.toMatch(/bahorgi to‘plam|editorial|savol kaliti/)
  })

  it('does not rewrite unrelated conceptual explanations or normative labor codes', () => {
    const original = 'A/01.6 — rejalashtirish; B/02.6 — ota-onalar bilan hamkorlik.'
    expect(learner(original)).toBe(original)
    expect(learner('')).toBe('')
  })
})
