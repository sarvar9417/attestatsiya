/**
 * TASK-244 Cambridge+ 5-sinf (2021 Uzbek edition), original M01 text.
 * The PDF is 139 pages, offset PDF page = printed + 3.
 * Only the search and email literacy modules are in M01.04;
 * document authoring, graphics, spreadsheets and Scratch are elsewhere.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const CAMBRIDGE5_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.04',
    beforeHeading: "Qidiruv tizimlari, kalit so'zlar va manba auditi",
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 5-sinf: veb-brauzer, qidiruv tizimi va indeksning farqi' },
      { type: 'table', content: '| Atama | Vazifasi | Nima bilan chalkashmaydi? |\n|---|---|---|\n| Veb-brauzer | Veb-sahifani yuklaydi va foydalanuvchiga ko‘rsatadi | Qidiruv tizimi emas |\n| Qidiruv tizimi | So‘rovga mos sahifa/manba natijalarini topadi | Internetdagi hamma manbaning egasi emas |\n| Indeks | Qidirishni tezlashtiradigan maʼlumotlar tuzilmasi | Kitob mundarijasiga o‘xshatish — soddalashtirish |\n| Kalit so‘z | Qidirish uchun tanlangan asosiy termin | Birgina umumiy so‘z yetarli bo‘lmasligi mumkin |',
        headers: ['Atama', 'Vazifasi', 'Nima bilan chalkashmaydi?'],
        rows: [
          ['Veb-brauzer', 'Veb-sahifani yuklaydi va foydalanuvchiga ko‘rsatadi', 'Qidiruv tizimi emas'],
          ['Qidiruv tizimi', 'So‘rovga mos sahifa/manba natijalarini topadi', 'Internetdagi hamma manbaning egasi emas'],
          ['Indeks', 'Qidirishni tezlashtiradigan maʼlumotlar tuzilmasi', 'Kitob mundarijasiga o‘xshatish — soddalashtirish'],
          ['Kalit so‘z', 'Qidirish uchun tanlangan asosiy termin', 'Birgina umumiy so‘z yetarli bo‘lmasligi mumkin'],
        ],
      },
      { type: 'case', content: 'Masalan, `Pluton` so‘rovi sayyora va multfilm qahramonini aralashtirishi mumkin. `Pluton Quyosh tizimi` yoki `Pluton multfilm qahramoni` shaklida **mavzuni aniqlashtirish** natijalarni maqsadga yaqinlashtiradi. Darslik `+` belgisi bilan operator misolini beradi, lekin bu operatorning talqini barcha qidiruv servisida aynan bir xil bo‘lishi shart emas.' },
      { type: 'trap', content: 'Qidiruv ro‘yxatining yuqori o‘rnida turish yoki natija yonidagi `Ad/Sponsored` yozuvi **manbaning ilmiy to‘g‘riligini kafolatlamaydi**. Reklama va organik natijani ajrating; veb-sahifa muallifi, sanasi va asosiy daʼvolarni tekshiring. Darslikda URL uchun uchragan «Universal Resource Locator» kengaytmasi o‘rniga texnik jihatdan **Uniform Resource Locator** atamasi ishlatiladi.' },
      { type: 'source', content: 'Cambridge+ 5-sinf, 2021, PDF 93–100 (bosma 90–97-betlar), 5-modul «Qidiruv tizimlarida ishlashni boshlash»: brauzer, indeks, kalit so‘z, homiylik va qidiruv operatorlari. Termin aniqligi uchun alohida texnik izoh berildi.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborot texnologiyasi va raqamli jamiyat',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 5-sinf: tadqiqotning ishonchli dalil va manba izini yuritish' },
      { type: 'list', ordered: true, content: 'Savolni aniq yozing va uning muhim so‘zlarini ajrating.\nTopilgan sahifani muallif, sana, dalil va maqsad bo‘yicha tekshiring.\nBirinchi manbada yo‘q faktni boshqa manba bilan solishtiring.\nMaʼlumotni o‘z so‘zlaringizda xulosalang va manbaga havola qoldiring.',
        items: [
          'Savolni aniq yozing va uning muhim so‘zlarini ajrating.',
          'Topilgan sahifani muallif, sana, dalil va maqsad bo‘yicha tekshiring.',
          'Birinchi manbada yo‘q faktni boshqa manba bilan solishtiring.',
          'Maʼlumotni o‘z so‘zlaringizda xulosalang va manbaga havola qoldiring.',
        ],
      },
      { type: 'case', content: 'Yo‘qolib ketish xavfi ostidagi ikki hayvon turini taqqoslashda **bir xil mezonlar**dan foydalaning: yashash hududi, oziqlanishi, himoyalanish xususiyati va manbaning sanasi. Har bitta hayvon uchun maʼlumot qayerdan olinganini belgilang. Manbaga havola berish — **plagiatdan qochishning zarur qismi**, ammo mualliflik huquqi yoki litsenziya bilan cheklangan tasvirni nusxalashga avtomatik ruxsat emas.' },
      { type: 'source', content: 'Cambridge+ 5-sinf, 2021, PDF 101–108 (bosma 98–105-betlar), 5-modul: savol bilan izlash, manba ishonchliligini baholash, «Mening mamlakatim» va yo‘qolib ketish xavfidagi hayvonlar tadqiqotlari, manbaga havola.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Netiket',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 5-sinf: elektron xat maydonlari va papkalarning vazifasi' },
      { type: 'table', content: '| Maydon yoki papka | Asosiy vazifasi | Ehtiyot jihat |\n|---|---|---|\n| To | Asosiy qabul qiluvchi | Manzilni yuborishdan oldin tekshiring |\n| Subject | Xat mavzusi | Mazmunga mos, qisqa va tushunarli yozing |\n| CC | Nusxa oluvchilar | Boshqalar CC manzilini odatda ko‘ra oladi |\n| Inbox | Kelgan xatlar | Xabar nomini tekshirmasdan ilova ochmang |\n| Sent | Jo‘natilgan xatlar | Xat haqiqatan yuborilganini tekshiring |\n| Drafts | Hali jo‘natilmagan qoralamalar | Tasodifan jo‘natib yubormang |\n| Trash/Bin | O‘chirishga ajratilgan xatlar | Tiklash va saqlash muddati provayderga bog‘liq |',
        headers: ['Maydon yoki papka', 'Asosiy vazifasi', 'Ehtiyot jihat'],
        rows: [
          ['To', 'Asosiy qabul qiluvchi', 'Manzilni yuborishdan oldin tekshiring'],
          ['Subject', 'Xat mavzusi', 'Mazmunga mos, qisqa va tushunarli yozing'],
          ['CC', 'Nusxa oluvchilar', 'Boshqalar CC manzilini odatda ko‘ra oladi'],
          ['Inbox', 'Kelgan xatlar', 'Xabar nomini tekshirmasdan ilova ochmang'],
          ['Sent', 'Jo‘natilgan xatlar', 'Xat haqiqatan yuborilganini tekshiring'],
          ['Drafts', 'Hali jo‘natilmagan qoralamalar', 'Tasodifan jo‘natib yubormang'],
          ['Trash/Bin', 'O‘chirishga ajratilgan xatlar', 'Tiklash va saqlash muddati provayderga bog‘liq'],
        ],
      },
      { type: 'trap', content: 'Email provayderlarining **Outbox/Sent/Drafts/Trash** nomlari va avtomatik saqlash qoidalari har xil bo‘lishi mumkin. `Re:` odatda javob zanjirini bildiruvchi mavzu prefiksi; uning kelib chiqishi bo‘yicha darslikdagi etimologik izoh universal email-protokol taʼrifi emas. Trash papkasidan o‘chirilgan xatni hech qachon tiklab bo‘lmaydi deyish ham barcha tizimlarda to‘g‘ri emas.' },
      { type: 'source', content: 'Cambridge+ 5-sinf, 2021, PDF 109–125 (bosma 106–122-betlar), 6-modul «Elektron pochtada ishlashni boshlash»: xat sarlavhasi, Reply/Re, papkalar, CC. Xizmatga qarab farqlanadigan xususiyatlar izohlandi.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Raqamli xavfsizlikning kundalik minimumi',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 5-sinf: xatni uzatishdan oldin rozilik va maxfiylik' },
      { type: 'case', content: 'O‘qituvchidan kelgan xabarni do‘stga uzatish so‘ralgan. **Forward** buyrug‘ini ishlatishdan oldin xatdagi shaxsiy maʼlumot, rasm, yashirin havola va ichki ko‘rsatmalarni tekshiring; zarur bo‘lsa yuboruvchidan ruxsat so‘rang. **CC** qo‘shish xabar kimga nusxalanganini ko‘rsatishi mumkin, ammo xatni boshqa kishiga tarqatishga avtomatik rozilik bermaydi. Bir xil matnni ko‘plab qabul qiluvchiga yuborishda manzillarni oshkor qilmaslik masalasini baholang.' },
      { type: 'list', ordered: false, content: 'Xatni jo‘natishdan avval To/CC manzil va Subjectni tekshiring.\nRasmiy xatda o‘qilishi qulay oddiy shrift, salomlashish va xulosa ishlating.\nShaxsiy maʼlumotni ruxsatsiz boshqalarga uzatmang.\nNoaniq havola yoki kutilmagan ilovani tekshirmasdan ochmang.',
        items: [
          'Xatni jo‘natishdan avval To/CC manzil va Subjectni tekshiring.',
          'Rasmiy xatda o‘qilishi qulay oddiy shrift, salomlashish va xulosa ishlating.',
          'Shaxsiy maʼlumotni ruxsatsiz boshqalarga uzatmang.',
          'Noaniq havola yoki kutilmagan ilovani tekshirmasdan ochmang.',
        ],
      },
      { type: 'source', content: 'Cambridge+ 5-sinf, 2021, PDF 123–131 (bosma 120–128-betlar), 6-modul, uzatish/CC, rasmiy email formati va guruhda hikoya tuzish mashqlari. Rozilik/maʼlumot minimalligi — o‘quv vaziyatiga zamonaviy xavfsizlik izohi.' },
    ],
  },
]
