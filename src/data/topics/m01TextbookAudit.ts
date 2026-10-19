/**
 * Teacher-edited, page-traceable book-by-book M01 additions.
 *
 * The generated M01 handbook (m01.ts) is immutable. Add verified, original
 * explanations here so regeneration never silently discards book corrections.
 * PDF page numbers refer to the complete 113-page 2020 ICT grade-5 scan.
 * This module does not copy textbook pages or reuse copyrighted diagrams.
 */
import type { TheoryBlock, TopicContent } from '../topicContent'
import { ICT6_M01_PAGE_ADDENDA } from './m01TextbookAuditICT6'
import { ICT7_M01_PAGE_ADDENDA } from './m01TextbookAuditICT7'
import { ICT8_M01_PAGE_ADDENDA } from './m01TextbookAuditICT8'

export interface VerifiedTextbookInsertion {
  /** Canonical learner topic (not the source file or an arbitrary keyword hit). */
  topicId: string
  /** Insert at the end of an existing handbook section; do not reorder the book. */
  beforeHeading: string
  /** Original instructional synthesis, with an exact PDF-page source trace. */
  blocks: readonly TheoryBlock[]
}

export const ICT5_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.02',
    beforeHeading: 'Informatika, AKT va raqamli texnologiya',
    blocks: [
      { type: 'subheading', content: '5-sinf darsligi bilan bog‘lanish: informatika tarixi va uch ta taʼminot' },
      { type: 'text', content: 'Informatika atamasi tarixan fransuzcha «information» va «automatique» tushunchalari bilan bog‘liq. 5-sinf darsligi bu fanni axborotni izlash, yig‘ish, saqlash, qayta ishlash va uzatish yo‘llari orqali tushuntiradi. Zamonaviy taʼrif bu jarayonlarni yaratish, himoyalash va tanqidiy baholashni ham qamrab oladi.' },
      { type: 'table', content: '| Tarkibiy yo‘nalish | Mazmuni | Misol |\n|---|---|---|\n| Hardware | Moddiy texnik vositalar | Klaviatura, protsessor, monitor |\n| Software | Dasturlar va tizimlar | OT, brauzer, matn muharriri |\n| Brainware | Insonning bilim va qarorlari | Foydalanuvchi, dasturchi, tizim boshqaruvchisi |',
        headers: ['Tarkibiy yo‘nalish', 'Mazmuni', 'Misol'],
        rows: [
          ['Hardware', 'Moddiy texnik vositalar', 'Klaviatura, protsessor, monitor'],
          ['Software', 'Dasturlar va tizimlar', 'OT, brauzer, matn muharriri'],
          ['Brainware', 'Insonning bilim va qarorlari', 'Foydalanuvchi, dasturchi, tizim boshqaruvchisi'],
        ],
      },
      { type: 'note', content: 'Tarixiy iz: darslik O‘zbekistonda informatika va kibernetika rivojiga akademik Vosil Qobulov hissasini qayd etadi; Arastu va Forobiy mantiq haqidagi qarashlar, al-Xorazmiy ishlari esa algoritm va hisoblash tarixi bilan bog‘lab beriladi. «Algoritm» atamasining kelib chiqishi al-Xorazmiy nomiga borib taqaladi; shu bois tarixiy taʼsirni zamonaviy algoritmlarning yakka muallifligi sifatida talqin qilish to‘g‘ri emas.' },
      { type: 'source', content: 'ICT 5-sinf, 2020, PDF 10–13 (bosma 9–12-betlar); 2-dars «Informatika fani haqida». Tarixiy qayd darslik kontekstida berilgan.' },
    ],
  },
  {
    topicId: 'M01.03',
    beforeHeading: 'Chuqurlashtirilgan tasnif, sifat va taqdim etish',
    blocks: [
      { type: 'subheading', content: '5-sinf darsligidagi sezgi, signal va sifatni farqlash' },
      { type: 'case', content: 'Bir xil voqea haqida ko‘rish, eshitish, hid, taʼm va teginish orqali turli maʼlumot olinadi. **Sezgi kanali** maʼlumot qanday qabul qilinganini bildiradi; **ifoda shakli** esa uni matn, tovush, tasvir yoki boshqa ko‘rinishda yetkazishni bildiradi. Bu ikki tasnifni aralashtirmang.' },
      { type: 'trap', content: '5-sinf kitobida ko‘rish/eshitish uchun keltirilgan 90%/9%/1% ulushlar barcha inson va vaziyatlar uchun o‘lchangan universal ilmiy qonun emas. Attestatsiya uchun asosiy tushuncha — besh sezgi kanali va axborotni baholashning aniqlik, ishonchlilik, dolzarblik kabi mustaqil mezonlari.' },
      { type: 'source', content: 'ICT 5-sinf, 2020, PDF 14–15 (bosma 13–14-betlar); 3-dars «Axborot va raqamli texnologiyalar».' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborotning to‘liq hayotiy sikli va dalil auditi',
    blocks: [
      { type: 'subheading', content: '5-sinf kitobidagi vaziyatlardan axborot jarayonini aniqlash' },
      { type: 'table', content: '| Vaziyat | Asosiy jarayon | Nega? |\n|---|---|---|\n| Dars natijalarini jadvalga kiritish | To‘plash va saqlash | Qiymatlar yozuvga aylantiriladi |\n| Internetdan vazifa uchun maʼlumot topish | Izlash | Kerakli manbalar qidiriladi |\n| Nazorat ishidagi xatolar ustida ishlash | Qayta ishlash | Oldingi maʼlumot tahlil qilinadi |\n| Xabarni do‘stga yuborish | Uzatish | Xabar boshqa qabul qiluvchiga yetadi |\n| Tadbirni videoga olib keyin ulashish | Saqlash va uzatish | Fayl yoziladi va jo‘natiladi |',
        headers: ['Vaziyat', 'Asosiy jarayon', 'Nega?'],
        rows: [
          ['Dars natijalarini jadvalga kiritish', 'To‘plash va saqlash', 'Qiymatlar yozuvga aylantiriladi'],
          ['Internetdan vazifa uchun maʼlumot topish', 'Izlash', 'Kerakli manbalar qidiriladi'],
          ['Nazorat ishidagi xatolar ustida ishlash', 'Qayta ishlash', 'Oldingi maʼlumot tahlil qilinadi'],
          ['Xabarni do‘stga yuborish', 'Uzatish', 'Xabar boshqa qabul qiluvchiga yetadi'],
          ['Tadbirni videoga olib keyin ulashish', 'Saqlash va uzatish', 'Fayl yoziladi va jo‘natiladi'],
        ],
      },
      { type: 'source', content: 'ICT 5-sinf, 2020, PDF 16–17 (bosma 15–16-betlar); axborot jarayonlari va mustahkamlash topshiriqlari asosida original moslashtirish.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: "Bob bo'yicha mustahkamlash savollari",
    blocks: [
      { type: 'subheading', content: 'Darslikdagi kompyuter xonasi xavfsizligi: raqamli madaniyatning amaliy asosi' },
      { type: 'list', ordered: false, content: 'O‘qituvchi ruxsatisiz kompyuter va ulagichlarni sozlamang.\nSuyuqlikni elektr qurilmalaridan uzoq tuting.\nNosoz sim yoki favqulodda holatni darhol masʼul shaxsga bildiring.\nIsh joyini ergonomik tashkil eting va uzoq mashg‘ulotlarda tanaffus qiling.',
        items: [
          'O‘qituvchi ruxsatisiz kompyuter va ulagichlarni sozlamang.',
          'Suyuqlikni elektr qurilmalaridan uzoq tuting.',
          'Nosoz sim yoki favqulodda holatni darhol masʼul shaxsga bildiring.',
          'Ish joyini ergonomik tashkil eting va uzoq mashg‘ulotlarda tanaffus qiling.',
        ],
      },
      { type: 'source', content: 'ICT 5-sinf, 2020, PDF 6–9 (bosma 5–8-betlar); 1-dars «Kompyuter xonasida xavfsizlik texnikasi». Bu meʼyorlar amaliy kontekst uchun, 2026 spetsifikatsiyasining mustaqil konstrukt talabi emas.' },
    ],
  },
  {
    topicId: 'M01.05',
    beforeHeading: 'Bit, bayt, birliklar va Xartli formulasi',
    blocks: [
      { type: 'subheading', content: '5-sinf darsligi: shartli kod, shifr va ikkilik tasvirni ajratish' },
      { type: 'example', content: '5-sinfdagi tartiblangan harf-raqam jadvaliga ko‘ra **VATAN** so‘zi `21 01 19 01 13` tarzida kodlanadi. Raqamning harfga mosligi jadval tanlangandagina aniqlanadi. Bunday kodlashning o‘zi xabarni maxfiy saqlamaydi; **shifrlash** esa kalit yoki maxfiy qoida bilan xabar mazmunini yashirishga qaratiladi.' },
      { type: 'case', content: 'Ikki yelkanning har biri faqat ikki xil rangda bo‘lishi mumkin va tanlovlar mustaqil. Birinchisiga 2 tanlov, ikkinchisiga 2 tanlov: **2 × 2 = 4 xil kombinatsiya**. Bu 2 bitning (2^2=4) holatiga o‘xshaydi. Rangli naqsh yoki bayroq kabi tasviriy kodlar ham aniq qoida talab qiladi.' },
      { type: 'source', content: 'ICT 5-sinf, 2020, PDF 18–20, 23–24 (bosma 17–19, 22–23-betlar); Morze, Sezar, harf-raqam, semafor va sodda kombinatorika bo‘limlari.' },
    ],
  },
  {
    topicId: 'M01.05',
    beforeHeading: 'Axborot hajmi, uzatish tezligi va vaqt',
    blocks: [
      { type: 'subheading', content: '5-sinf kitobidagi to‘liq yechim: 160 sahifali matn hajmi' },
      { type: 'solved', label: 'Darslikdagi hisobni tushunish — kodlash sharti bilan', content: '',
        children: [
          { type: 'text', content: 'Kitob **160 sahifa**, har sahifada **40 satr**, har satrda **60 belgi**. Topshiriqning maxsus sharti: **1 belgi = 1 bayt**. Fayl metamaʼlumoti va qo‘shimcha belgilar hisobga olinmaydi.' },
          { type: 'keyformula', content: 'V_{\\mathrm{B}}=160\\cdot40\\cdot60=384\\,000\\ \\mathrm{B}' },
          { type: 'keyformula', content: 'V_{\\mathrm{KiB}}=\\frac{384\\,000}{1024}=375\\ \\mathrm{KiB}' },
          { type: 'note', content: 'Darslikda natija «375 kbayt» deb beriladi (maktabning 1024 konvensiyasi). Aniq IEC yozuvi **375 KiB**; SI bo‘yicha **384 kB**. Haqiqiy Unicode/UTF-8 matn hajmi belgi va fayl kodlashiga qarab o‘zgaradi.' },
        ],
      },
      { type: 'source', content: 'ICT 5-sinf, 2020, PDF 21–22 (bosma 20–21-betlar); 1 bayt = 8 bit, ikkilik prefikslar va 160 × 40 × 60 yechimi.' },
    ],
  },
]

export const ALL_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  ...ICT5_M01_PAGE_ADDENDA,
  ...ICT6_M01_PAGE_ADDENDA,
  ...ICT7_M01_PAGE_ADDENDA,
  ...ICT8_M01_PAGE_ADDENDA,
]

export function withVerifiedM01Additions(
  base: Readonly<Record<string, TopicContent>>,
  additions: readonly VerifiedTextbookInsertion[] = ALL_M01_PAGE_ADDENDA,
): Record<string, TopicContent> {
  const result: Record<string, TopicContent> = { ...base }
  for (const addition of additions) {
    const topic = result[addition.topicId]
    if (!topic) throw new Error(`Manba reyestri uchun mavzu yo‘q: ${addition.topicId}`)
    const location = topic.theory.findIndex(
      block => block.type === 'heading' && block.content === addition.beforeHeading,
    )
    if (location < 0) {
      throw new Error(`Manba joylashuvi topilmadi: ${addition.topicId} / ${addition.beforeHeading}`)
    }
    result[addition.topicId] = {
      ...topic,
      theory: [
        ...topic.theory.slice(0, location),
        ...addition.blocks,
        ...topic.theory.slice(location),
      ],
    }
  }
  return result
}
