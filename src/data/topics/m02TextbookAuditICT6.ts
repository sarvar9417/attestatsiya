import type { TheoryBlock } from '../topicContent'

/**
 * TASK-245 continuation: ICT 6-sinf (2021), 160-page original.
 * M02-relevant bridges only; Word editing, media codecs and Scratch remain
 * with their proper M03 / M10 / coding curriculum instead of being duplicated.
 */
export const ICT6_M02_BOOK_ADDENDA: Readonly<Record<string, readonly TheoryBlock[]>> = {
  'M02.01': [
    { type: 'heading', content: '6-sinf: chop etish oynasi va fizik printer farqi' },
    { type: 'case', content: 'Worddagi **Print** oynasi printer tanlash, sahifalar oralig‘i (masalan, **1–5, 8**), nusxalar va ikki tomonlama chop etishni boshqaradi. Bu **dastur interfeysi**, printer esa matnni qog‘ozga chiqaruvchi **fizik qurilma**. Ikki tomonlama chop etish kabi amaliy imkoniyat printer modeli va drayveriga bog‘liq; dasturda parametr mavjudligi qurilma uni albatta bajaradi degani emas.' },
    { type: 'source', content: 'ICT 6-sinf (2021), PDF 70–71, bosma 70–71: «Hujjatni chop etish», printer tanlash va 1–5, 8 sahifalar misoli.' },
  ],
  'M02.02': [
    { type: 'heading', content: '6-sinf: operatsion tizim va u bilan kelgan media dastur' },
    { type: 'trap', content: 'Kitob Windows 7dagi **Звукозапись** va **Windows Media Player** kabi standart dasturlarni ko‘rsatadi. Dastur OT bilan birga kelishi mumkin, ammo uning audio/video ijro etish vazifasi **OTning jarayon, xotira, fayl va qurilmalarni boshqarish vazifasi** bilan bir narsa emas. Kitobdagi «Пуск → Все программы» menyu yo‘li tarixiy Windows interfeysi misolidir.' },
    { type: 'source', content: 'ICT 6-sinf (2021), PDF 119–120, bosma 119–120: Windows 7 ovoz yozish dasturi va Windows Media Player interfeysi.' },
  ],
  'M02.03': [
    { type: 'heading', content: '6-sinf: mahalliy faylga gipermurojaat va asl fayl' },
    { type: 'case', content: 'Bir hujjatga boshqa mahalliy **.docx faylga havola** qo‘shildi. Havola maqsad faylning nomi yoki yo‘lini bildirishi mumkin; u faylning mazmunini avtomatik ravishda hujjat ichiga ko‘chirib qo‘ymaydi. Fayl boshqa joyga ko‘chirilsa, saqlangan **yo‘l** eskirib, havola ishlamay qolishi mumkin. Havolani faylning o‘zi va papka bilan adashtirmang.' },
    { type: 'source', content: 'ICT 6-sinf (2021), PDF 71–72, bosma 71–72: gipermurojaatning 4 manzili va 5 ta alohida hujjatga havola qo‘yish mashqi.' },
  ],
  'M02.04': [
    { type: 'heading', content: '6-sinf: mobil OT bilan Office ilovasini farqlash' },
    { type: 'table', content: '', headers: ['Nomi','Tasnifi','Asosiy vazifasi'], rows: [
      ['Android yoki iOS','Operatsion tizim','Mobil qurilmadagi dastur va resurslar muhiti'],
      ['Microsoft Word','Amaliy dastur','Matnli hujjat yaratish va tahrirlash'],
      ['Media Player','Amaliy media dasturi','Audio va videoni ijro etish'],
    ] },
    { type: 'trap', content: 'Darslikdagi Office foydalanuvchilari soni haqidagi **2016-yil statistikasi** tarixiy ko‘rsatkich; joriy foydalanuvchilar soni deb qo‘llanmaydi. OT tarkibida berilgan media ilova ham avtomatik ravishda OTning boshqaruv mexanizmi bo‘lib qolmaydi.' },
    { type: 'source', content: 'ICT 6-sinf (2021), PDF 62 (2016-yilga oid Office/Android/iOS maʼlumotlari) va PDF 119–120 (media dasturlari); bosma sahifa raqamlari mos.' },
  ],
}
