/**
 * TASK-244 — Cambridge+ 8-sinf (2021, Cambridge On Track Stage 2).
 * PDF 153 pages; relevant printed page = PDF page - 3.
 * Programming, HTML and network topology are outside M01; retain only
 * source-relevant information literacy, basic network and multimedia notions.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const CAMBRIDGE8_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborot texnologiyasi va raqamli jamiyat',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 8-sinf: tarmoq, internet va WWW nimasi bilan farq qiladi?' },
      { type: 'table', content: '| Termin | Maqsadi | Misol |\n|---|---|---|\n| PAN | Shaxsga yaqin bir necha qurilmani ulash | Telefon va Bluetooth qurilma |\n| LAN | Mahalliy hududdagi qurilmalarni birlashtirish | Maktabdagi kompyuterlar |\n| WAN | Keng geografik hududdagi tarmoqlarni bog‘lash | Viloyatlararo korporativ tarmoq |\n| Internet | Dunyo bo‘ylab o‘zaro bog‘langan tarmoqlar tizimi | Veb va email uchun aloqa infratuzilmasi |\n| WWW | Internet orqali kiriladigan veb-resurslar tizimi | Brauzerda ko‘rilgan veb-sahifa |',
        headers: ['Termin', 'Maqsadi', 'Misol'],
        rows: [
          ['PAN', 'Shaxsga yaqin bir necha qurilmani ulash', 'Telefon va Bluetooth qurilma'],
          ['LAN', 'Mahalliy hududdagi qurilmalarni birlashtirish', 'Maktabdagi kompyuterlar'],
          ['WAN', 'Keng geografik hududdagi tarmoqlarni bog‘lash', 'Viloyatlararo korporativ tarmoq'],
          ['Internet', 'Dunyo bo‘ylab o‘zaro bog‘langan tarmoqlar tizimi', 'Veb va email uchun aloqa infratuzilmasi'],
          ['WWW', 'Internet orqali kiriladigan veb-resurslar tizimi', 'Brauzerda ko‘rilgan veb-sahifa'],
        ],
      },
      { type: 'trap', content: 'Internet va WWW **sinonim emas**. Email, fayl almashish va turli tarmoq xizmatlari internetdan WWWsiz ham foydalanishi mumkin. PAN, LAN, WAN atamalari tarmoqning taxminiy ko‘lami va vazifasini ajratadi, lekin xavfsiz yoki tez ishlashini o‘zi kafolatlamaydi. Router, switch, kabel, topologiya kabi texnik tashkil etish M12da o‘rganiladi.' },
      { type: 'source', content: 'Cambridge+ 8-sinf, 2021, PDF 91–95 (bosma 88–92-betlar), 3-modul «Kompyuter tarmoqlaridan maqsadli foydalanish»: PAN/LAN/WAN va Internet–WWWning aniq farqi.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Raqamli xavfsizlikning kundalik minimumi',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 8-sinf: foydalanuvchi xavfsizligi va tarmoqni himoyalash vositalari' },
      { type: 'table', content: '| Vosita yoki qaror | Nima qiladi? | Nima qilmaydi? |\n|---|---|---|\n| Firewall (xavfsizlik devori) | Trafikka belgilangan qoidalar qo‘llaydi | Har bir zararli faylni aniqlab tashlamaydi |\n| Anti-malware | Zararli dasturlarni aniqlash yoki bloklashga yordam beradi | Mutlaq himoyani kafolatlamaydi |\n| Kirish huquqi | Foydalanuvchining amal doirasini chegaralaydi | Hisobni butunlay xavfsiz qilmaydi |\n| Dastur yangilash | Maʼlum zaifliklar uchun tuzatish olib kelishi mumkin | Firibgarlik xabariga aldanishni o‘zi to‘xtatmaydi |',
        headers: ['Vosita yoki qaror', 'Nima qiladi?', 'Nima qilmaydi?'],
        rows: [
          ['Firewall (xavfsizlik devori)', 'Trafikka belgilangan qoidalar qo‘llaydi', 'Har bir zararli faylni aniqlab tashlamaydi'],
          ['Anti-malware', 'Zararli dasturlarni aniqlash yoki bloklashga yordam beradi', 'Mutlaq himoyani kafolatlamaydi'],
          ['Kirish huquqi', 'Foydalanuvchining amal doirasini chegaralaydi', 'Hisobni butunlay xavfsiz qilmaydi'],
          ['Dastur yangilash', 'Maʼlum zaifliklar uchun tuzatish olib kelishi mumkin', 'Firibgarlik xabariga aldanishni o‘zi to‘xtatmaydi'],
        ],
      },
      { type: 'note', content: 'Xavfsizlik — bir dona dastur emas, turli himoya qatlamlari va foydalanuvchi qarorlari birikmasidir. Tarmoqni loyihalash, firewall qoidalari va protokollarni sozlash **M12/M13** mavzulariga tegishli; M01da atamalar xavfsiz foydalanish uchun tanitiladi.' },
      { type: 'source', content: 'Cambridge+ 8-sinf, 2021, PDF 106–113 (bosma 103–110-betlar), 3-modul: dastur/foydalanuvchi boshqaruvi, kirish huquqi, firewall, zararli dasturdan himoyalanish va tarmoq xavfsizligi.' },
    ],
  },
  {
    topicId: 'M01.06',
    beforeHeading: 'Video va multimedia: kadr, FPS, bitrate va hajm',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 8-sinf: storyboard, kadr, timeline, tovush va mualliflik' },
      { type: 'table', content: '| Atama | Vazifasi | Amalda farqlang |\n|---|---|---|\n| Storyboard | Kadrlar va voqealar ketma-ketligini oldindan rejalashtiradi | Tayyor video emas |\n| Kadr | Harakatli tasvirning alohida holati | Davomiylik/tartib timeline bilan boshqariladi |\n| Timeline | Kadr, qatlam va ovozni vaqtga bog‘laydi | Musiqa faylining o‘zi emas |\n| Soundtrack | Videoga qo‘shilgan tovush yo‘li | Mualliflik ruxsati alohida kerak bo‘lishi mumkin |',
        headers: ['Atama', 'Vazifasi', 'Amalda farqlang'],
        rows: [
          ['Storyboard', 'Kadrlar va voqealar ketma-ketligini oldindan rejalashtiradi', 'Tayyor video emas'],
          ['Kadr', 'Harakatli tasvirning alohida holati', 'Davomiylik/tartib timeline bilan boshqariladi'],
          ['Timeline', 'Kadr, qatlam va ovozni vaqtga bog‘laydi', 'Musiqa faylining o‘zi emas'],
          ['Soundtrack', 'Videoga qo‘shilgan tovush yo‘li', 'Mualliflik ruxsati alohida kerak bo‘lishi mumkin'],
        ],
      },
      { type: 'case', content: 'Maktabdagi yoqtirgan fan haqida **ota-onalarga** video tayyorlanmoqda: dastlab kadrlar rejasi tuziladi, keyin tasvir va ovoz alohida manbadan olinadi yoki yaratiladi, oxirida xabar auditoriyaga mosligi tekshiriladi. Boshqa ijrochining musiqasini ishlatishdan oldin **mualliflik va foydalanish ruxsati** baholanadi. Pencil2D/Audacity tugmalarining tarixiy joylashuvi nazariyaning o‘zgarmas qismi emas.' },
      { type: 'source', content: 'Cambridge+ 8-sinf, 2021, PDF 114–117, 124, 134–142 (bosma 111–114, 121, 131–139-betlar), 4-modul: storyboard, rastr piksel, timeline, qatlam va soundtrackning auditoriya/huquq bilan bog‘lanishi.' },
    ],
  },
]
