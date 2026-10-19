/** TASK-244 Cambridge+ 10–11 2021, original explanations with PDF page traces. */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const CAMBRIDGE1011_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.03',
    beforeHeading: 'Chuqurlashtirilgan tasnif, sifat va taqdim etish',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 10–11: maʼlumot, axborot va bilimni farqlash' },
      { type: 'table', content: '', headers: ['Tushuncha', 'Belgi', 'Vaziyat'], rows: [
        ['Maʼlumot', 'Hali talqin qilinmagan qiymat yoki belgi', '25, 27, 29'],
        ['Axborot', 'Kontekstli maʼlumot', 'Uch kunning harorati 25, 27, 29 °C'],
        ['Bilim', 'Axborot va tajribadan chiqarilgan tushuncha', 'Kunlar isiganini anglab, mos reja tanlash'],
      ] },
      { type: 'trap', content: 'Statik sahifada axborot umuman hech qachon o‘zgarmaydi degani emas. Dinamik axborot manbadagi o‘zgarishlarga bog‘lanib avtomatik yangilanadi; har qanday veb-sayt yoki har qanday tez-tez tahrirlanadigan matn dinamik tizim emas.' },
      { type: 'source', content: 'Cambridge+ 10–11-sinf (2021), PDF 10–16 (bosma 1–7-betlar), 1-bob «Bilimlar bazasi»; statik/dinamik axborot va maʼlumot–axborot–bilim zanjiri.' },
    ],
  },
  {
    topicId: 'M01.03',
    beforeHeading: 'Bob bo\'yicha mustahkamlash savollari',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 10–11: to‘g‘ridan-to‘g‘ri va bilvosita axborot manbasi' },
      { type: 'table', content: '', headers: ['Manba turi', 'Qanday olinadi?', 'Audit savoli'], rows: [
        ['Bevosita (birlamchi)', 'Kuzatish, o‘lchash, intervyu', 'Tanlanma va o‘lchash jarayoni ishonchlimi?'],
        ['Bilvosita (ikkilamchi)', 'Oldin eʼlon qilingan statistika yoki hisobot', 'Nashr vaqti, metod va asl manba aniqlanadimi?'],
      ] },
      { type: 'note', content: 'Ikkilamchi manba albatta yolg‘on emas va birlamchi maʼlumot ham avtomatik ishonchli emas. Aniqlik, dolzarblik, to‘liqlik va izchillik har bir manbada alohida tekshiriladi.' },
      { type: 'source', content: 'Cambridge+ 10–11-sinf (2021), PDF 10–32 (bosma 1–23-betlar), 1-bob: maʼlumot manbalari, sifat va xatoni tekshirish.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborot texnologiyasi va raqamli jamiyat',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 10–11: raqamli tengsizlikning bir nechta sababi' },
      { type: 'table', content: '', headers: ['Omil', 'Muammo', 'Javob chorasi'], rows: [
        ['Infratuzilma', 'Internet yoki qurilma mavjud emas', 'Ulanish va umumiy foydalanish imkoniyati'],
        ['Moliyaviy', 'Xizmat va qurilma narxi yuqori', 'Arzon va mos qurilmalar'],
        ['Ko‘nikma', 'Axborotni izlash/baholash qiyin', 'Raqamli savodxonlik taʼlimi'],
        ['Accessibility', 'Interfeys ayrim foydalanuvchilarga noqulay', 'O‘qishga qulay, muqobil boshqaruv'],
      ] },
      { type: 'trap', content: 'Raqamli tengsizlik faqat internet tezligi emas: qurilma, imkoniyat, narx, ko‘nikma va inklyuziv interfeys taʼsiri ham mavjud. «Ulanish bo‘lsa, barcha uchun bir xil imkoniyat» xulosasi noto‘g‘ri.' },
      { type: 'source', content: 'Cambridge+ 10–11-sinf (2021), PDF 80–86 (bosma 71–77-betlar), 5-bob «Raqamli tengsizlik».' },
    ],
  },
  {
    topicId: 'M01.06',
    beforeHeading: 'Audioaxborot: namunalash, bit chuqurligi va hajm',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 10–11: tovushni tahrirlash va xom signalni farqlash' },
      { type: 'case', content: 'Mikrofondan kelgan uzluksiz audio signali namuna olish va kodlash orqali raqamlashtiriladi. Tovush muharririda yo‘lakchalar (tracks) orqali kesish, birlashtirish yoki kuchaytirish mumkin. **Tahrirlash** mazmun/eshitiladigan signalni o‘zgartiradi; **konvertatsiya** esa fayl formati yoki kodekni o‘zgartirishi mumkin. Natijaviy fayl hajmi faqat sekundlar soniga bog‘liq emas.' },
      { type: 'source', content: 'Cambridge+ 10–11-sinf (2021), PDF 193–205 (bosma 184–196-betlar), 10-bob «Tovush va videoni tahrirlash».' },
    ],
  },
]
