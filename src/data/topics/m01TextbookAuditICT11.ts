/**
 * TASK-244: ICT 11-sinf (2021) textbook, original page-traceable M01 notes.
 * Do not import Access/SQL, AI programming, networking or cryptographic
 * internals: those chapters belong to M09, M08, M12 and M13 respectively.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const ICT11_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.03',
    beforeHeading: 'Chuqurlashtirilgan tasnif, sifat va taqdim etish',
    blocks: [
      { type: 'subheading', content: '11-sinf: maʼlumot sifatining olti mustaqil mezoni' },
      { type: 'table', content: '| Mezon | Savol | Xato holat |\n|---|---|---|\n| Aniqlik | Qiymat to‘g‘ri qayd etilganmi? | 27,2 °C o‘rniga 2,72 °C |\n| To‘g‘rilik | Dalil haqiqatga mosmi? | Noto‘g‘ri o‘lchovga tayanish |\n| Dolzarblik | Maʼlumot tegishli vaqtga oidmi? | Kechagi ob-havoni bugungi deb berish |\n| To‘liqlik | Muhim qism yetishmayaptimi? | Bir necha kunlik qiymat yo‘q |\n| Muvofiqlik | Manba foydalanuvchi ehtiyojiga mosmi? | Shahar prognozi o‘rniga boshqa hudud |\n| Izchillik | Qiymatlar o‘zaro mosmi? | So‘m va dollarni konvertatsiyasiz qo‘shish |',
        headers: ['Mezon', 'Savol', 'Xato holat'],
        rows: [
          ['Aniqlik', 'Qiymat to‘g‘ri qayd etilganmi?', '27,2 °C o‘rniga 2,72 °C'],
          ['To‘g‘rilik', 'Dalil haqiqatga mosmi?', 'Noto‘g‘ri o‘lchovga tayanish'],
          ['Dolzarblik', 'Maʼlumot tegishli vaqtga oidmi?', 'Kechagi ob-havoni bugungi deb berish'],
          ['To‘liqlik', 'Muhim qism yetishmayaptimi?', 'Bir necha kunlik qiymat yo‘q'],
          ['Muvofiqlik', 'Manba foydalanuvchi ehtiyojiga mosmi?', 'Shahar prognozi o‘rniga boshqa hudud'],
          ['Izchillik', 'Qiymatlar o‘zaro mosmi?', 'So‘m va dollarni konvertatsiyasiz qo‘shish'],
        ],
      },
      { type: 'note', content: 'Darslik bu mezonlarni maʼlumotlar bazasi sifatiga nisbatan qo‘llaydi. Ular M01da axborot sifati va manbani tanlashni baholash uchun ham ishlatiladi. Masalan, qiymat juda **aniq ko‘rinishda** yozilgan bo‘lishi (ko‘p o‘nli xona) uning **to‘g‘ri** ekanini avtomatik isbotlamaydi.' },
      { type: 'source', content: 'ICT 11-sinf (2021), PDF 11 (bosma 11-bet), «Maʼlumotlarning asosiy xossalari» jadvali: aniqlik, to‘g‘rilik, dolzarblik, to‘liqlik, muvofiqlik, izchillik. Jadval original misollar bilan qayta tuzildi.' },
    ],
  },
  {
    topicId: 'M01.02',
    beforeHeading: 'Obyekt va hodisa',
    blocks: [
      { type: 'subheading', content: '11-sinf: xom maʼlumotdan foydali axborotga — Data Mining misoli' },
      { type: 'table', content: '| Maʼlumot shakli | Qanday tashkil topadi? | Misol |\n|---|---|---|\n| Tuzilmali | Oldindan belgilangan ustunlar, tiplar | Sinf baholari jadvali |\n| Yarim tuzilmali | Qisman belgilangan kalit va maydonlar | JSON xabarlar |\n| Tuzilmasiz | Erkin matn, ovoz, rasm, video | Turli media fayllar to‘plami |',
        headers: ['Maʼlumot shakli', 'Qanday tashkil topadi?', 'Misol'],
        rows: [
          ['Tuzilmali', 'Oldindan belgilangan ustunlar, tiplar', 'Sinf baholari jadvali'],
          ['Yarim tuzilmali', 'Qisman belgilangan kalit va maydonlar', 'JSON xabarlar'],
          ['Tuzilmasiz', 'Erkin matn, ovoz, rasm, video', 'Turli media fayllar to‘plami'],
        ],
      },
      { type: 'case', content: 'Data Mining o‘quv misoli: sinfning kuzatuv jadvalidan darsga qatnashish va o‘zlashtirish ko‘rsatkichlari olinadi; qiziqtirgan yozuvlar **ajratiladi**, o‘xshash holatlar **guruhlanadi**, keyin xulosaning dalil va chegarasi **baholanadi**. Guruhlar orasidagi bog‘lanish avtomatik ravishda sabab–oqibatni isbotlamaydi. Asl xom maʼlumotni izohlash va tekshirish jarayonidagina qaror uchun foydali axborot hosil bo‘ladi.' },
      { type: 'trap', content: '11-sinf kitobidagi 2020/2025-yillar uchun Big Data hajmi bashoratlari va «Bronto Bayt», «Geop Bayt» atamalari **bugungi aniq, rasmiy SI/IEC standart birliklar ro‘yxati sifatida olinmaydi**. Xartli hisobi, bit/bayt va KiB/MiB/GiB farqini avval o‘rganing; katta maʼlumotlarning 3V/5V tavsiflari ham o‘quv modelidir, miqdori o‘zgarmas qonun emas.' },
      { type: 'source', content: 'ICT 11-sinf (2021), PDF 66–70 (bosma 66–70-betlar), «Big Data va Data Mining»; uch shakl, hajm/tezlik/xilma-xillik/aniqlik/qiymat va maʼlumotni ajratish–saralash–axborotga aylantirish. Bosma bashoratlar tarixiy kontekstda.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Auditoriya, maqsad va kontekst',
    blocks: [
      { type: 'subheading', content: '11-sinf: faol va passiv raqamli izlarni farqlash' },
      { type: 'table', content: '| Raqamli iz | Qanday paydo bo‘ladi? | Misol |\n|---|---|---|\n| Faol | Foydalanuvchi ongli ravishda maʼlumot yuboradi | Post, izoh, profil formasi |\n| Passiv | Servis yoki qurilma foydalanish jarayonida texnik maʼlumot qayd etadi | IP-manzil, tashrif logi, joylashuv metamaʼlumoti |',
        headers: ['Raqamli iz', 'Qanday paydo bo‘ladi?', 'Misol'],
        rows: [
          ['Faol', 'Foydalanuvchi ongli ravishda maʼlumot yuboradi', 'Post, izoh, profil formasi'],
          ['Passiv', 'Servis yoki qurilma foydalanish jarayonida texnik maʼlumot qayd etadi', 'IP-manzil, tashrif logi, joylashuv metamaʼlumoti'],
        ],
      },
      { type: 'trap', content: 'Brauzer tarixini o‘chirish, akkauntdagi postni olib tashlash va serverdagi barcha nusxalarni yo‘q qilish **bir xil amal emas**. Biroq har bir o‘chirilgan maʼlumot abadiy saqlanadi deb ham mutlaq daʼvo qilib bo‘lmaydi: saqlash muddati, platforma va huquqiy talablar farq qiladi. Raqamli izni boshqarish — maxfiylik sozlamalari, ruxsat va ulashishdan oldin o‘ylash.' },
      { type: 'source', content: 'ICT 11-sinf (2021), PDF 296–300 (bosma 296–300-betlar), «Internet va raqamli dunyo»; faol/passiv raqamli iz va virtual obro‘ tushunchalari.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborot texnologiyasi va raqamli jamiyat',
    blocks: [
      { type: 'subheading', content: '11-sinf: internet manbasini tekshirishning yetti savoli' },
      { type: 'list', ordered: true, content: 'Muallif yoki tashkilot kim?\nMuallif bilan bog‘lanish yo‘li haqiqiymi?\nDaʼvolar qaysi mustaqil manbalarga tayanadi?\nFaktlar qayta tekshiriladimi?\nMatn, tasvir, jadval va havolalar aniqmi?\nMaqsad xolis xabar berishmi, reklama yoki targ‘ibotmi?\nMaʼlumot qachon yangilangan?',
        items: [
          'Muallif yoki tashkilot kim?',
          'Muallif bilan bog‘lanish yo‘li haqiqiymi?',
          'Daʼvolar qaysi mustaqil manbalarga tayanadi?',
          'Faktlar qayta tekshiriladimi?',
          'Matn, tasvir, jadval va havolalar aniqmi?',
          'Maqsad xolis xabar berishmi, reklama yoki targ‘ibotmi?',
          'Maʼlumot qachon yangilangan?',
        ],
      },
      { type: 'trap', content: 'Faqat chiroyli dizayn, mavjud aloqa raqami, ro‘yxatdan o‘tgan domen yoki rasmiy ko‘ringan logotip **axborot ishonchliligini o‘zi isbotlamaydi**. Manba ishonchliligi bir nechta mustaqil belgini tekshirish va muhim daʼvoni tashqi manba bilan tasdiqlash orqali baholanadi. Ochiq sahifani o‘qish imkoniyati uni mualliflik ruxsatisiz ko‘paytirish huquqi degani emas.' },
      { type: 'source', content: 'ICT 11-sinf (2021), PDF 301–302 (bosma 301–302-betlar), «Internet va raqamli dunyo»; resurs muallifi, aloqa, dalil, aniqlik, taqdimot, maqsad, dolzarblik va plagiat.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: "Bob bo'yicha mustahkamlash savollari",
    blocks: [
      { type: 'subheading', content: '11-sinf: elektron aloqa xavfsizligi va xulq-atvorni nazorat qilish' },
      { type: 'case', content: 'Elektron pochtaga do‘st nomidan kutilmagan ilova va «tezda parolingizni kiriting» degan havola keldi. Yuboruvchining nomi tanish bo‘lsa ham, **ilovani ochmang**; manzil va xabarni mustaqil aloqa kanali orqali tekshiring; login-parol va tasdiqlash kodini shubhali sahifada kiritmang. Hisobda **ko‘p omilli autentifikatsiya**ni yoqing, umumiy qurilmadan ishlagach hisobdan chiqing.' },
      { type: 'trap', content: 'Ko‘p omilli autentifikatsiya xavfni kamaytiradi, lekin barcha phishingni avtomatik to‘xtatmaydi; ayniqsa kodni aldov orqali so‘rash holatlarida hushyorlik kerak. Umumiy Wi-Fi tarmog‘ining o‘zi har qanday HTTPS ulanishidagi parolni oshkor qiladi deb o‘ylamang: shifrlangan ulanish, saytning haqiqiyligi va qurilma xavfsizligi alohida tekshiriladi.' },
      { type: 'source', content: 'ICT 11-sinf (2021), PDF 302–305 (bosma 302–305-betlar), 61–62-dars: e-mail, havola, ko‘p omilli autentifikatsiya, ijtimoiy tarmoqdagi xulq va Wi-Fi xavflari.' },
    ],
  },
]
