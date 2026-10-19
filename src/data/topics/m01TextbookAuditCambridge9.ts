/** TASK-244: Cambridge+9 (Uzbek IGCSE ICT 2021), source-page M01 notes. */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const CAMBRIDGE9_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.02', beforeHeading: 'Chuqurlashtirish: fan, tizim va aloqa modeli',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 9-sinf: AKT, ish o‘rinlari va qayta kasbiy tayyorgarlik' },
      { type: 'table', content: '| Natija | Ishdagi o‘zgarish | Baholash savoli |\n|---|---|---|\n| Avtomatlashtirish | Takroriy vazifani dastur yoki robot bajaradi | Ish sifati va xavfsizligi qanday o‘zgaradi? |\n| Malakasizlantirish (deskilling) | Ayrim vazifa uchun kamroq maxsus ko‘nikma yetadi | Qaysi malaka qadrsizlanmoqda? |\n| Qayta tayyorlash (reskilling) | Ishchi yangi vosita va vazifani o‘rganadi | Qaysi kompetensiya kerak? |\n| Masofaviy ish | Tarmoq orqali boshqa joyda mehnat qilish | Aloqa, axborot xavfsizligi va dam olish qanday tashkil etiladi? |',
        headers: ['Natija','Ishdagi o‘zgarish','Baholash savoli'],
        rows: [
          ['Avtomatlashtirish','Takroriy vazifani dastur yoki robot bajaradi','Ish sifati va xavfsizligi qanday o‘zgaradi?'],
          ['Malakasizlantirish (deskilling)','Ayrim vazifa uchun kamroq maxsus ko‘nikma yetadi','Qaysi malaka qadrsizlanmoqda?'],
          ['Qayta tayyorlash (reskilling)','Ishchi yangi vosita va vazifani o‘rganadi','Qaysi kompetensiya kerak?'],
          ['Masofaviy ish','Tarmoq orqali boshqa joyda mehnat qilish','Aloqa, axborot xavfsizligi va dam olish qanday tashkil etiladi?'],
        ],
      },
      { type: 'trap', content: 'Kitobdagi «ishlarning 80 foizi AKT bilan bog‘liq» kabi davrga va manbaga bog‘liq ulushni 2026-yil uchun universal statistik fakt deb yodlamang. Texnologiya ayrim ishlarni kamaytirishi va boshqa ish ko‘nikmalarini talab qilishi mumkin; o‘zgarish hamma kasbda bir xil emas. Uzoq vaqt ekran qarshisida ishlashda ergonomika va tanaffuslar muhim.' },
      { type: 'source', content: 'Cambridge+ 9-sinf (2021), PDF 62–70 (bosma 55–63-betlar), 5-bob: ish, avtomatlashtirish, deskilling, masofaviy ish va ergonomika. Foizlar tarixiy kitob kontekstidir.' },
    ],
  },
  {
    topicId: 'M01.04', beforeHeading: 'Raqamli xavfsizlikning kundalik minimumi',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 9-sinf: phishing, pharming va shaxsiy maʼlumotni himoya qilish' },
      { type: 'table', content: '| Xavf | Odatdagi usul | Tekshirish |\n|---|---|---|\n| Phishing (fishing) | Soxta xat yoki havola bilan maxfiy kodni so‘rash | Manzil va xabarni mustaqil yo‘l bilan tasdiqlash |\n| Pharming (farming) | Domen yo‘naltirishini buzib, boshqa saytga o‘tkazishga urinish | Sertifikat, asl domen va qurilma xavfsizligi |\n| Vishing | Qo‘ng‘iroq orqali aldab maʼlumot so‘rash | Qo‘ng‘iroqni uzib, tashkilotga rasmiy raqam orqali qayta murojaat |\n| Impersonation | Boshqa kishining kimligini taqlid qilish | Shaxsni mustaqil kanal orqali tekshirish |',
        headers: ['Xavf','Odatdagi usul','Tekshirish'],
        rows: [
          ['Phishing (fishing)','Soxta xat yoki havola bilan maxfiy kodni so‘rash','Manzil va xabarni mustaqil yo‘l bilan tasdiqlash'],
          ['Pharming (farming)','Domen yo‘naltirishini buzib, boshqa saytga o‘tkazishga urinish','Sertifikat, asl domen va qurilma xavfsizligi'],
          ['Vishing','Qo‘ng‘iroq orqali aldab maʼlumot so‘rash','Qo‘ng‘iroqni uzib, tashkilotga rasmiy raqam orqali qayta murojaat'],
          ['Impersonation','Boshqa kishining kimligini taqlid qilish','Shaxsni mustaqil kanal orqali tekshirish'],
        ],
      },
      { type: 'trap', content: 'Darslikda parolni muntazam har oy o‘zgartirish va maxsus belgilar kiritish tavsiyalari uchraydi. Zamonaviy amaliyotda **uzun, noyob parol yoki parol iborasi**, parol menejeri va MFA samaraliroq bo‘lishi mumkin; parol sizib chiqsa yoki buzilishdan shubha tug‘ilsa darhol o‘zgartirish kerak. Qatʼiy davriy majburiyatni hamma tizim uchun universal talab deb olmang. HTTPS ham saytning halolligini kafolatlamaydi.' },
      { type: 'source', content: 'Cambridge+ 9-sinf (2021), PDF 112–127 (bosma 105–120-betlar), 8-bob: e-safety, phishing, pharming, vishing, xavflarni kamaytirish va parol. Zamonaviy kuchli parol mezonlari kitobdan tashqari texnik aniqlashtirishdir.' },
    ],
  },
  {
    topicId: 'M01.04', beforeHeading: 'Axborotni taqdim etish, auditoriya va accessibility',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 9-sinf: auditoriya ehtiyoji va grafikdan xulosa qilish' },
      { type: 'case', content: 'Yangi router qo‘llanmasi boshlovchi foydalanuvchi uchun yozilsa, asosiy tushunchalar izohi va xavfsiz qadamlar zarur; mutaxassis uchun esa texnik sozlamalar va aniq parametrlar muhimroq bo‘lishi mumkin. Grafik orqali natija taqdim etilsa, **qanday birlik, vaqt oralig‘i, manba va o‘q shkalasi** ishlatilgani aniq bo‘lsin. Diagrammadagi trend o‘z-o‘zidan sababni isbotlamaydi.' },
      { type: 'table', content: '| Ko‘rinish | Qaysi savolga javob beradi? | Cheklov |\n|---|---|---|\n| Ustunli diagramma | Guruhlar nechog‘li farq qiladi? | O‘q shkalasi farqni bo‘rttirishi mumkin |\n| Chiziqli grafik | Vaqt bo‘yicha o‘zgarish qanday? | Trend sabab–oqibat emas |\n| Doiraviy diagramma | Butunning qismlari qanday ulushda? | Ulushlar o‘zaro bir butunni tashkil etishi kerak |',
        headers: ['Ko‘rinish','Qaysi savolga javob beradi?','Cheklov'],
        rows: [
          ['Ustunli diagramma','Guruhlar nechog‘li farq qiladi?','O‘q shkalasi farqni bo‘rttirishi mumkin'],
          ['Chiziqli grafik','Vaqt bo‘yicha o‘zgarish qanday?','Trend sabab–oqibat emas'],
          ['Doiraviy diagramma','Butunning qismlari qanday ulushda?','Ulushlar o‘zaro bir butunni tashkil etishi kerak'],
        ],
      },
      { type: 'source', content: 'Cambridge+ 9-sinf (2021), PDF 129–136 (bosma 122–129-betlar), 9-bob «Auditoriya» va PDF 202–210 (bosma 195–203-betlar), 16-bob «Grafika va diagrammalar». Konkret Excel interfeysi M03ga tegishli.' },
    ],
  },
  {
    topicId: 'M01.04', beforeHeading: 'Mualliflik huquqi, litsenziya, maxfiylik va raqamli etika',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 9-sinf: netiket, elektron xat va resursning ishonchlilik mezonlari' },
      { type: 'list', ordered: true, content: 'Muallif va tashkilotning haqiqiyligini aniqlang.\nMaterialdagi faktlar qaysi dalilga tayanishini tekshiring.\nEʼlon qilingan va yangilangan sanani aniqlang.\nMaqsad reklama, xabar berish yoki targ‘ibot ekanini ajrating.\nDomen kengaytmasini ishonchlilikning yagona kafolati deb bilmang.\nBoshqalarning rasmini yoki xatini roziliksiz tarqatmang.',
        items: [
          'Muallif va tashkilotning haqiqiyligini aniqlang.',
          'Materialdagi faktlar qaysi dalilga tayanishini tekshiring.',
          'Eʼlon qilingan va yangilangan sanani aniqlang.',
          'Maqsad reklama, xabar berish yoki targ‘ibot ekanini ajrating.',
          'Domen kengaytmasini ishonchlilikning yagona kafolati deb bilmang.',
          'Boshqalarning rasmini yoki xatini roziliksiz tarqatmang.',
        ],
      },
      { type: 'trap', content: 'Elektron xat odatda tez uzatiladi, ammo manzil egasi uni qachon o‘qishi yoki javob yozishi nomaʼlum. Internetda salbiy fikrga xushmuomalalik bilan javob berish mumkin; spam va boshqa muallifning himoyalangan asarini ruxsatsiz joylashtirish netiket va mualliflik mezonlariga zid bo‘lishi mumkin.' },
      { type: 'source', content: 'Cambridge+ 9-sinf (2021), PDF 137–145 (bosma 130–138-betlar), 10-bob: email aloqa, netiket, spam, web-resurs muallifi, maqsadi, sana va mamlakat domeni.' },
    ],
  },
  {
    topicId: 'M01.06', beforeHeading: 'Siqish natijasini va multimedia mahsulotini baholash',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 9-sinf: fayl kengaytmasi, import/eksport, yo‘qotishli siqish' },
      { type: 'table', content: '| Format / usul | Qanday maʼlumot? | Ehtiyot jihat |\n|---|---|---|\n| CSV | Ajratkichli, jadvalga mos oddiy matn | Hujjat dizayni, formula va har bir tipni to‘liq saqlamasligi mumkin |\n| XML | Belgilangan teglar orqali tuzilma | Maxsus sxema bo‘lmasa mazmun to‘g‘riligini kafolatlamaydi |\n| JPEG | Fotografik tasvir uchun odatda yo‘qotishli siqish | Qayta saqlashda artefaktlar ko‘payishi mumkin |\n| ZIP | Fayllarni bitta arxivga yig‘ish, odatda yo‘qotishsiz siqish | MP3/JPEGni yana kattaroq foizga siqish kafolatlanmaydi |',
        headers: ['Format / usul','Qanday maʼlumot?','Ehtiyot jihat'],
        rows: [
          ['CSV','Ajratkichli, jadvalga mos oddiy matn','Hujjat dizayni, formula va har bir tipni to‘liq saqlamasligi mumkin'],
          ['XML','Belgilangan teglar orqali tuzilma','Maxsus sxema bo‘lmasa mazmun to‘g‘riligini kafolatlamaydi'],
          ['JPEG','Fotografik tasvir uchun odatda yo‘qotishli siqish','Qayta saqlashda artefaktlar ko‘payishi mumkin'],
          ['ZIP','Fayllarni bitta arxivga yig‘ish, odatda yo‘qotishsiz siqish','MP3/JPEGni yana kattaroq foizga siqish kafolatlanmaydi'],
        ],
      },
      { type: 'trap', content: 'Fayl nomi oxiridagi `.jpg`, `.csv` yoki `.zip` kengaytmasini o‘zgartirish **konvertatsiya emas**. Tasvir o‘lchamini o‘zgartirish va JPEG sifat sozlamalarini pasaytirish ham bir xil amal emas. Biror faylni ZIP arxivga qo‘shish uni har doim sezilarli kichraytirmaydi.' },
      { type: 'source', content: 'Cambridge+ 9-sinf (2021), PDF 146–152 (bosma 139–145-betlar), 11-bob «Fayllarni boshqarish», hamda PDF 163–166 (bosma 156–159-betlar), 12-bob «Grafika». Dasturga xos eksport qadamlar M03/M10ga tegishli.' },
    ],
  },
  {
    topicId: 'M01.04', beforeHeading: 'Xatolarni aniqlashning chuqurlashtirilgan usullari',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 9-sinf: validation va verification mutlaqo bir xil emas' },
      { type: 'table', content: '| Tekshiruv | Nimani aniqlaydi? | Nima uchun yetarli emas? |\n|---|---|---|\n| Validation (qoidaga moslik) | Qiymat format/diapazon/tip shartiga javob beradimi? | To‘g‘ri formatdagi noto‘g‘ri faktni o‘tkazishi mumkin |\n| Verification (asl manbaga moslik) | Kiritilgan qiymat asl hujjatdagi qiymatga mosmi? | Asl hujjatning o‘zi xato bo‘lishi mumkin |\n| Spell check | So‘z lug‘atdagi imloga mosmi? | Maʼnosi va fakt rostligini tekshirmaydi |',
        headers: ['Tekshiruv','Nimani aniqlaydi?','Nima uchun yetarli emas?'],
        rows: [
          ['Validation (qoidaga moslik)','Qiymat format/diapazon/tip shartiga javob beradimi?','To‘g‘ri formatdagi noto‘g‘ri faktni o‘tkazishi mumkin'],
          ['Verification (asl manbaga moslik)','Kiritilgan qiymat asl hujjatdagi qiymatga mosmi?','Asl hujjatning o‘zi xato bo‘lishi mumkin'],
          ['Spell check','So‘z lug‘atdagi imloga mosmi?','Maʼnosi va fakt rostligini tekshirmaydi'],
        ],
      },
      { type: 'case', content: 'Masalan, sanani **31-fevral** deb kiritish sana-format va haqiqiy sana tekshiruvidan o‘tmaydi. Ammo sinf jurnalida xato «4» bahoni asl manbadagi «5» o‘rniga kiritish son tipi va diapazoni bo‘yicha to‘g‘ri chiqishi mumkin; **verification** esa asl yozuv bilan solishtirib nomuvofiqlikni topadi. Asl manba maʼlumoti ham noto‘g‘ri bo‘lsa, qo‘shimcha dalil talab etiladi.' },
      { type: 'source', content: 'Cambridge+ 9-sinf (2021), PDF 192–198 (bosma 185–191-betlar), 15-bob: imlo/grammatika xatolari, maʼlumot turi, sana, uzunlik, diapazon, check digit, format/lookup va korrektura. Validation/verification termin farqi texnik aniqlashtirishdir.' },
    ],
  },
]
