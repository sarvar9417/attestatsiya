/**
 * TASK-244, Cambridge+ 7-sinf (2021, ICT Starters On Track).
 * Source PDF is 147 pages; printed pages = PDF - 3 after contents.
 * Word, PowerPoint, Excel and Access procedural steps belong to M03/M09.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const CAMBRIDGE7_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborotni taqdim etish, auditoriya va accessibility',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 7-sinf: axborot maqsadi, auditoriya va kontent formati' },
      { type: 'table', content: '| Qaror | Ishonchli mezon | Noto‘g‘ri soddalashtirish |\n|---|---|---|\n| Auditoriya | Kim o‘qiydi yoki ko‘radi? | Hamma uchun bir xil dizayn |\n| Maqsad | Xabardor qilish, ko‘rsatma berish yoki ko‘ngil ochish | Ko‘p animatsiya — doim yaxshi |\n| Kontent | Dalil, matn, tasvir va video mosligi | Chiroyli surat — aniq fakt |\n| O‘qilish qulayligi | Kontrast, shrift va mantiqiy tartib | Juda bezakli shrift hamma uchun mos |',
        headers: ['Qaror', 'Ishonchli mezon', 'Noto‘g‘ri soddalashtirish'],
        rows: [
          ['Auditoriya', 'Kim o‘qiydi yoki ko‘radi?', 'Hamma uchun bir xil dizayn'],
          ['Maqsad', 'Xabardor qilish, ko‘rsatma berish yoki ko‘ngil ochish', 'Ko‘p animatsiya — doim yaxshi'],
          ['Kontent', 'Dalil, matn, tasvir va video mosligi', 'Chiroyli surat — aniq fakt'],
          ['O‘qilish qulayligi', 'Kontrast, shrift va mantiqiy tartib', 'Juda bezakli shrift hamma uchun mos'],
        ],
      },
      { type: 'case', content: 'Maktabda internetdan xavfsiz foydalanish qo‘llanmasini **ota-onalar uchun** tayyorlashda kimga murojaat qilinayotgani va maqsadini oldindan belgilang. Qisqa sarlavha, o‘qilishi qulay matn, aniq fakt, ruxsatli tasvir va ortiqcha bo‘lmagan multimedia elementlari tomoshabinning asosiy xabarni tushunishiga yordam beradi. Microsoft Word yoki PowerPointning tugmalari M03ga tegishli; asosiy axborot dizayni esa M01da mustahkamlanadi.' },
      { type: 'source', content: 'Cambridge+ 7-sinf, 2021, PDF 9–10, 36–41 (bosma 6–7, 33–38-betlar); 1–2-modullar: internet xavfsizligi haqidagi ota-onalar qo‘llanmasi, auditoriya, maqsad va multimedia dizaynining rejasi.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Mualliflik huquqi, litsenziya, maxfiylik va raqamli etika',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 7-sinf: multimedia manbasi va tasvirdan ruxsat bilan foydalanish' },
      { type: 'case', content: 'Hayvonot bog‘i haqidagi taqdimotga internetdan topilgan fotosurat joylashtirilmoqda. **Manba URLi, muallif yoki tashkilot, foydalanish sharti va zarur ruxsat** alohida tekshiriladi. Materialning internetda ochiq ko‘rinishi uni istagancha ko‘chirish mumkinligini anglatmaydi. Manbaga havola qo‘yish zarur bo‘lishi mumkin, biroq bu o‘zi mualliflik ruxsatini o‘rnini bosmaydi.' },
      { type: 'trap', content: 'Ko‘rgazmali taqdimotdagi tasvir, ovoz yoki video nashr qilinganida tomoshabinga mos bo‘lishi va mualliflik shartlariga javob berishi kerak. Kontentga havola faqat manbani ko‘rsatadi, **haqiqiy foydalanish huquqi** esa litsenziya, ruxsat yoki qonundagi aniq istisnoga bog‘liq.' },
      { type: 'source', content: 'Cambridge+ 7-sinf, 2021, PDF 39–41 va 61–64 (bosma 36–38 va 58–61-betlar), 2-modul: taqdimotga mos manbalar, internetdan olingan tasvirlar, manbaga havola va mualliflik huquqini hisobga olish.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Raqamli xavfsizlikning kundalik minimumi',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 7-sinf: ko‘rish huquqi va tahrirlash huquqi ikki xil chegaradir' },
      { type: 'table', content: '| Ruxsat turi | Nimani cheklaydi? | Misol |\n|---|---|---|\n| Faqat o‘qish (Read only) | O‘zgartirish yoki o‘chirishni | Xodim ruxsatli yozuvni ko‘radi, tahrirlamaydi |\n| O‘qish va yozish (Read/write) | Ruxsat etilgan maʼlumotni tahrirlashni | Masʼul xodim ruxsatli yozuvni yangilaydi |\n| Ko‘rish qamrovi (View scope) | Qaysi yozuv yoki maydonni ko‘rishni | Xodim manzilni ko‘radi, maxfiy tibbiy maʼlumotni emas |',
        headers: ['Ruxsat turi', 'Nimani cheklaydi?', 'Misol'],
        rows: [
          ['Faqat o‘qish (Read only)', 'O‘zgartirish yoki o‘chirishni', 'Xodim ruxsatli yozuvni ko‘radi, tahrirlamaydi'],
          ['O‘qish va yozish (Read/write)', 'Ruxsat etilgan maʼlumotni tahrirlashni', 'Masʼul xodim ruxsatli yozuvni yangilaydi'],
          ['Ko‘rish qamrovi (View scope)', 'Qaysi yozuv yoki maydonni ko‘rishni', 'Xodim manzilni ko‘radi, maxfiy tibbiy maʼlumotni emas'],
        ],
      },
      { type: 'trap', content: '«Read only» huquqi berilgan foydalanuvchi **hamma maʼlumotni ko‘radi** degan xulosa noto‘g‘ri; ko‘rinadigan maʼlumotlar qamrovi boshqa nazorat bo‘lishi mumkin. «Read/write» huquqi ham aynan qaysi yozuvga tatbiq etilishi aniqlanishi kerak. Barcha raqamli izlar abadiy, muqarrar saqlanadi degan hukm o‘rniga servisning haqiqiy saqlash siyosatini tekshiring.' },
      { type: 'source', content: 'Cambridge+ 7-sinf, 2021, PDF 117–118 (bosma 114–115-betlar), 4-modul «Maʼlumotlar xavfsizligi»: raqamli iz, faqat o‘qish, o‘qish/yozish va ko‘rish huquqlari. MBBTdagi amaliy sozlamalar M09ga tegishli.' },
    ],
  },
]
