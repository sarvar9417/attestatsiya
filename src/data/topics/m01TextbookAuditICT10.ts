/**
 * TASK-244, sixth textbook: 10-sinf ICT (2021), page-traced M01 notes.
 * The main textbook covers hardware (M02), spreadsheets (M03),
 * video/3D editing (M10), pygame (M08) and CSS (M11).
 * Only verified information-representation and accessibility principles
 * are inserted here; product screenshots and historical claims are omitted.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const ICT10_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.06',
    beforeHeading: 'Konvertatsiya, transkodlash, arxiv va zaxira',
    blocks: [
      { type: 'subheading', content: '10-sinf: arxivator, kodek, konteyner va konvertorni farqlash' },
      { type: 'table', content: '| Tushuncha | Vazifasi | Misol |\n|---|---|---|\n| Arxivator | Fayllarni bitta arxivda yig‘ish va imkon bo‘lsa yo‘qotishsiz siqish | ZIP, 7z |\n| Kodek | Raqamli audio/video oqimini kodlash yoki dekodlash | H.264, AAC, Opus |\n| Konteyner formati | Audio/video oqim va metamaʼlumotlarni bitta faylga joylashtirish | MP4, MKV, AVI |\n| Konvertor | Faylni boshqa format yoki ko‘rinishga o‘tkazish | DOCX → PDF, WAV → MP3 |',
        headers: ['Tushuncha', 'Vazifasi', 'Misol'],
        rows: [
          ['Arxivator', 'Fayllarni bitta arxivda yig‘ish va imkon bo‘lsa yo‘qotishsiz siqish', 'ZIP, 7z'],
          ['Kodek', 'Raqamli audio/video oqimini kodlash yoki dekodlash', 'H.264, AAC, Opus'],
          ['Konteyner formati', 'Audio/video oqim va metamaʼlumotlarni bitta faylga joylashtirish', 'MP4, MKV, AVI'],
          ['Konvertor', 'Faylni boshqa format yoki ko‘rinishga o‘tkazish', 'DOCX → PDF, WAV → MP3'],
        ],
      },
      { type: 'trap', content: 'Darslikdagi kodeklar ro‘yxatida **AVI** va **MP3** kabi yozuvlar ham uchraydi, ammo ular bir xil qatlamga tegishli emas: **AVI — konteyner formati**, MP3 esa audio siqish formatidir. Konteynerni almashtirish har doim videoni qayta kodlashni talab qilmaydi; haqiqiy konvertatsiya turiga qarab faqat qayta o‘rash (remux) yoki qayta kodlash (transcode) bo‘lishi mumkin. Fayl kengaytmasini qayta nomlash — haqiqiy konvertatsiya emas.' },
      { type: 'source', content: 'ICT 10-sinf (2021), PDF 28–32 (bosma 28–32-betlar), «Xizmat ko‘rsatish dasturlari»: arxiv, kodek, audio/video va hujjat konvertorlari. Turlar haqidagi texnik farq darslik ro‘yxatidagi terminlar chalkashmasligi uchun izohlandi.' },
    ],
  },
  {
    topicId: 'M01.06',
    beforeHeading: 'Siqish natijasini va multimedia mahsulotini baholash',
    blocks: [
      { type: 'subheading', content: '10-sinf amaliyoti: MP3 → FLAC → MP3 sifatni qanday o‘zgartiradi?' },
      { type: 'case', content: 'Kitobning uyga vazifasida avval **MP3 faylini FLACga**, so‘ng **yana MP3ga** o‘tkazish va natijani taqqoslash topshirilgan. FLAC yo‘qotishsiz format bo‘lsa-da, u **oldin MP3ga siqilganda yo‘qolgan tovush tafsilotlarini qayta yaratmaydi**. Shuning uchun MP3 → FLAC qilib saqlash ovozga yangi axborot qo‘shmaydi; FLAC → MP3 bosqichida qayta yo‘qotishli kodlash natijasida sifat yana pasayishi mumkin.' },
      { type: 'trap', content: '«Formatni FLACga almashtirdim — ovoz asl holiga qaytdi» degan xulosa noto‘g‘ri. Yo‘qotishsiz siqish originaldagi mavjud axborotni yo‘qotmasdan saqlaydi; oldingi **yo‘qotishli** jarayon natijasini orqaga qaytarib bera olmaydi. Arxivator ham matn, JPEG va MP3ni hammasini bir xil foizga siqmaydi.' },
      { type: 'source', content: 'ICT 10-sinf (2021), PDF 28–29 (siqish, kodek), PDF 34 (bosma 34-bet), 2-uyga vazifa: MP3 → FLAC → MP3. Kodekning qaytmasligi haqida ogohlantirish — shartdan kelib chiqqan zamonaviy texnik izoh.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Xatolarni aniqlashning chuqurlashtirilgan usullari',
    blocks: [
      { type: 'subheading', content: '10-sinf: raqamli matnda fon–matn kontrasti va o‘qilish qulayligi' },
      { type: 'case', content: 'Bir xil matnni uch ko‘rinishda tasavvur qiling: och kulrang harflar oq fonda, qora harflar oq fonda, oq harflar to‘q ko‘k fonda. Kontrast yetarli bo‘lmasa, matn o‘qilishi qiyinlashadi, ayniqsa yorug‘lik kuchli tushgan ekranda yoki ko‘rish qobiliyati cheklangan foydalanuvchi uchun. Axborot sifati faqat mazmunning to‘g‘riligiga emas, **uni o‘qiy olish** imkoniga ham bog‘liq.' },
      { type: 'trap', content: 'Darslikning past/o‘rta/yuqori kontrast rasmlari foydali taqqoslash, lekin **«o‘rta kontrast doim eng yaxshi»** degan universal meʼyor emas. Kontrastni mavjud auditoriya, shrift kattaligi, ekran sharoiti va accessibility talablariga qarab tekshiring. Matn rangining shaffofligini o‘zgartirish ko‘pincha kontrastni ham o‘zgartiradi.' },
      { type: 'source', content: 'ICT 10-sinf (2021), PDF 204 (bosma 204-bet), CSS rang/kontrast va accessibility bo‘yicha «Matn rangi va foni» darsi. CSS sintaksisi M11ga qoldirildi, M01 uchun o‘qish qulayligi prinsipigina olindi.' },
    ],
  },
]
