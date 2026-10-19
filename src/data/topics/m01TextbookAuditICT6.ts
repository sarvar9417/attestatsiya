/**
 * Page-reviewed, original M01 additions from ICT grade 6 (2021).
 * All PDF page numbers refer to the 160-page complete Drive copy.
 * Do not copy the textbook illustrations, sample personal profiles or pages.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const ICT6_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborot texnologiyasi va raqamli jamiyat',
    blocks: [
      { type: 'subheading', content: '6-sinf darsligidan: qidirish yo‘lini tanlash va natijani tekshirish' },
      { type: 'table', content: '| Qidirish yo‘li | Qachon kerak? | Tekshiriladigan jihat |\n|---|---|---|\n| Aniq URL manzili | Sahifa manzili maʼlum bo‘lsa | Domen va sahifa to‘g‘riligi |\n| Gipermurojaat | Ishonchli sahifadagi tegishli resursga o‘tishda | Havola manzili va konteksti |\n| Qidiruv tizimi | Qaysi sahifada maʼlumot borligi nomaʼlum bo‘lsa | So‘rovning aniqligi, manbaning dalili |',
        headers: ['Qidirish yo‘li', 'Qachon kerak?', 'Tekshiriladigan jihat'],
        rows: [
          ['Aniq URL manzili', 'Sahifa manzili maʼlum bo‘lsa', 'Domen va sahifa to‘g‘riligi'],
          ['Gipermurojaat', 'Ishonchli sahifadagi tegishli resursga o‘tishda', 'Havola manzili va konteksti'],
          ['Qidiruv tizimi', 'Qaysi sahifada maʼlumot borligi nomaʼlum bo‘lsa', 'So‘rovning aniqligi, manbaning dalili'],
        ],
      },
      { type: 'trap', content: 'Darslikda keltirilgan `+`, `*`, AND/OR/NOT qidiruv sintaksisi va harf registriga oid qoidalar **har bir hozirgi qidiruv tizimida bir xil ishlamaydi**. Qo‘shtirnoq bilan aniq iborani qidiring, istisno va domenni cheklash kabi operatorlarni esa ayni tizimning amaldagi yo‘riqnomasiga qarab qo‘llang. Birinchi natija yoki homiylik qilingan havola dalil emas.' },
      { type: 'case', content: 'Ochiq ensiklopediyada foydali boshlang‘ich maʼlumot topildi. Darhol «hammasi yolg‘on» yoki «hammasi to‘g‘ri» deyish o‘rniga, maqoladagi manbani oching, nashr sanasini tekshiring va muhim faktni mustaqil manbada tasdiqlang. Xatcho‘p sahifani saqlab qo‘yishi mumkin, lekin kontent to‘g‘riligiga kafolat bermaydi.' },
      { type: 'source', content: 'ICT 6-sinf (2021), PDF 82–87 (bosma 82–87-betlar); 18-dars «Qidiruv tizimlari va Internetda maʼlumot izlash». Amaldagi operatorlar mahsulotga bog‘liq.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Raqamli xavfsizlikning kundalik minimumi',
    blocks: [
      { type: 'subheading', content: '6-sinf darsligidagi Creative Commons huquqlarini tushunish' },
      { type: 'table', content: '| Litsenziya | Qanday foydalanishga ruxsat bor? | Muhim shart |\n|---|---|---|\n| CC BY | Moslashtirish va ulashish, jumladan tijoratda | Muallif ko‘rsatiladi |\n| CC BY-SA | Moslashtirish va ulashish | Muallif, hosila asarda bir xil litsenziya |\n| CC BY-ND | O‘zgartirilmagan materialni tarqatish | Hosila asarni tarqatish ruxsatsiz emas |\n| CC BY-NC | Notijorat maqsadda moslashtirish | Muallif, notijorat |\n| CC BY-NC-SA | Notijorat moslashtirish | Muallif, notijorat, bir xil litsenziya |\n| CC BY-NC-ND | O‘zgartirilmagan nusxani notijorat tarqatish | Muallif, moslashtirish yo‘q |',
        headers: ['Litsenziya', 'Qanday foydalanishga ruxsat bor?', 'Muhim shart'],
        rows: [
          ['CC BY', 'Moslashtirish va ulashish, jumladan tijoratda', 'Muallif ko‘rsatiladi'],
          ['CC BY-SA', 'Moslashtirish va ulashish', 'Muallif, hosila asarda bir xil litsenziya'],
          ['CC BY-ND', 'O‘zgartirilmagan materialni tarqatish', 'Hosila asarni tarqatish ruxsatsiz emas'],
          ['CC BY-NC', 'Notijorat maqsadda moslashtirish', 'Muallif, notijorat'],
          ['CC BY-NC-SA', 'Notijorat moslashtirish', 'Muallif, notijorat, bir xil litsenziya'],
          ['CC BY-NC-ND', 'O‘zgartirilmagan nusxani notijorat tarqatish', 'Muallif, moslashtirish yo‘q'],
        ],
      },
      { type: 'trap', content: '**Manbani ko‘rsatishning o‘zi har qanday nusxalashga ruxsat bermaydi.** Avval litsenziya yoki qonuniy istisnoni tekshiring; tarjima va tahrir hosila asar hisoblanishi mumkin. Ayniqsa **ND** (hosila asarni tarqatmaslik), **NC** (notijorat), **SA** (bir xil shartda ulashish) belgilarini bir-biridan ajrating.' },
      { type: 'source', content: 'ICT 6-sinf (2021), PDF 103–106 (bosma 103–106-betlar); 22-dars «Mualliflik huquqi va litsenziyalar». Amaldagi huquqiy qoida uchun rasmiy litsenziya matni ustuvor.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Bob bo‘yicha mustahkamlash savollari',
    blocks: [
      { type: 'subheading', content: '6-sinf darsligidagi onlayn xavflarga vaziyatli javob' },
      { type: 'case', content: 'Notanish odam sovg‘a yoki yordamni vaʼda qilib, shaxsiy manzil, parol yoki alohida uchrashuv so‘rasa, suhbatni to‘xtating, shaxsiy maʼlumot yubormang, holatni ishonchli kattaga yoki platforma moderatoriga xabar qiling. Bunday yaqinlashishning xavfli shakli **grooming** deb ataladi. Tahdidli yoki haqoratli xabarlar **kiberbulling** bo‘lishi mumkin; dalillarni xavfsiz saqlash, bloklash va yordam so‘rash muhim.' },
      { type: 'trap', content: 'Umumiy kompyuterda faqat brauzer tarixini o‘chirish hisobingizni himoya qilmaydi. Avval servisdan **Sign out / Chiqish** buyrug‘i bilan chiqing, parolni saqlamang, fayl va shaxsiy maʼlumotlarni qoldirmang. Brauzer tarixi, cookie va sessiya alohida tushunchalar.' },
      { type: 'source', content: 'ICT 6-sinf (2021), PDF 107–113 (bosma 107–113-betlar); 23-dars «Internet xavf-xatarlari». Darslikdagi shaxsiy profil misollari bu nazariyada aynan ko‘chirilmagan.' },
    ],
  },
  {
    topicId: 'M01.06',
    beforeHeading: 'Audio va videoni chuqurroq tushuntiruvchi texnik tushunchalar',
    blocks: [
      { type: 'subheading', content: '6-sinf darsligidan: yozish, tahrirlash va konvertatsiyani farqlash' },
      { type: 'table', content: '| Amal | Natija | Tekshiriladigan belgi |\n|---|---|---|\n| Raqamlashtirish | Analog signal namunalar va kodga aylanadi | Namuna olish chastotasi, bit chuqurligi |\n| Tahrirlash | Audio/video mazmunining bir qismi o‘zgaradi | Kesish, birlashtirish, effekt |\n| Konvertatsiya | Boshqa fayl formati/kodekda saqlanadi | Moslik, sifat, qayta kodlash |\n| Bitreytni o‘zgartirish | Vaqt birligiga to‘g‘ri keladigan bitlar miqdori o‘zgaradi | Fayl hajmi va codec sozlamalari |',
        headers: ['Amal', 'Natija', 'Tekshiriladigan belgi'],
        rows: [
          ['Raqamlashtirish', 'Analog signal namunalar va kodga aylanadi', 'Namuna olish chastotasi, bit chuqurligi'],
          ['Tahrirlash', 'Audio/video mazmunining bir qismi o‘zgaradi', 'Kesish, birlashtirish, effekt'],
          ['Konvertatsiya', 'Boshqa fayl formati/kodekda saqlanadi', 'Moslik, sifat, qayta kodlash'],
          ['Bitreytni o‘zgartirish', 'Vaqt birligiga to‘g‘ri keladigan bitlar miqdori o‘zgaradi', 'Fayl hajmi va kodek sozlamalari'],
        ],
      },
      { type: 'trap', content: 'Bitreyt bir xil kodek va o‘xshash sharoitda ko‘payganda sifat odatda oshishi mumkin, lekin **har doim ham yaxshiroq sifat kafolati emas**: ovoz manbasi, siqish algoritmi va sozlamalar muhim. MP3 uchun berilgan 32–320 kbps qiymatlarni barcha media formatiga qatʼiy taʼrif sifatida tatbiq qilmang.' },
      { type: 'note', content: 'Shaxsiy audio/video faylni brauzerdagi konvertorga yuborishdan oldin maxfiylikni baholang: onlayn servisga yuklash — maʼlumotni tashqi serverga uzatish. Zarur bo‘lsa, lokal/offline konvertordan foydalanish maʼqul.' },
      { type: 'source', content: 'ICT 6-sinf (2021), PDF 114–126 (bosma 114–126-betlar); 24–25-darslar, audio/video, bitrate va konvertatsiya. Dastur/sayt interfeysi vaqt o‘tishi bilan o‘zgarishi mumkin.' },
    ],
  },
]
