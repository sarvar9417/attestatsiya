/**
 * Textbook-verified original notes from ICT 7-sinf (2021), pages of full
 * 160-page PDF. Retain the primary generated handbook and all source wording.
 * Do not reproduce original textbook diagrams or long answer passages.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const ICT7_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.03',
    beforeHeading: 'Axborot turlari, shakllari va sifat xossalari',
    blocks: [
      { type: 'subheading', content: '7-sinf: signal, axborot jarayoni va ifodalash modeli' },
      { type: 'table', content: '| Bosqich | Axborotli jarayon | Misol |\n|---|---|---|\n| Qabul qilish | Datchik yoki kiritish qurilmasi signalni oladi | Mikrofon tovushni qabul qiladi |\n| Saqlash | Signal kodlangan maʼlumot sifatida yoziladi | Audiofayl xotiraga yoziladi |\n| Qayta ishlash | Algoritm maʼlumotni o‘zgartiradi | Shovqin filtri qo‘llanadi |\n| Uzatish/chiqarish | Qabul qiluvchi uchun tasvir yoki tovush hosil bo‘ladi | Karnay ovoz chiqaradi |',
        headers: ['Bosqich', 'Axborotli jarayon', 'Misol'],
        rows: [
          ['Qabul qilish', 'Datchik yoki kiritish qurilmasi signalni oladi', 'Mikrofon tovushni qabul qiladi'],
          ['Saqlash', 'Signal kodlangan maʼlumot sifatida yoziladi', 'Audiofayl xotiraga yoziladi'],
          ['Qayta ishlash', 'Algoritm maʼlumotni o‘zgartiradi', 'Shovqin filtri qo‘llanadi'],
          ['Uzatish/chiqarish', 'Qabul qiluvchi uchun tasvir yoki tovush hosil bo‘ladi', 'Karnay ovoz chiqaradi'],
        ],
      },
      { type: 'trap', content: '**Analog** signalning qiymati uzluksiz o‘zgarishi mumkin; **diskret** maʼlumot esa alohida qiymatlar yoki namunalarda ifodalanadi. Diskret va raqamli atamalar boshlang‘ich darsliklarda yaqin qo‘llansa-da, raqamlashtirish odatda namunalash, kvantlash va kodlash bosqichlarini ham o‘z ichiga oladi. Tovushning o‘zi audiofayl emas.' },
      { type: 'source', content: 'ICT 7-sinf (2021), PDF 4–8 (bosma 4–8-betlar); 1-dars «Axborotlarning kompyuterda tasvirlanishi», jarayon sxemasi va analog/diskret tasnifi.' },
    ],
  },
  {
    topicId: 'M01.05',
    beforeHeading: 'Belgi, alifbo, kod va kodlash',
    blocks: [
      { type: 'subheading', content: '7-sinf: ikkilik guruhlar va sanoq tizimi asosini farqlash' },
      { type: 'table', content: '| Ikkilik guruh | O‘tkazish yo‘li | Amaliy misol |\n|---|---|---|\n| Diada (2 bit) | Ikkilik ↔ to‘rtlik | 11₂ = 3₄ |\n| Triada (3 bit) | Ikkilik ↔ sakkizlik | 111 101 010₂ = 752₈ |\n| Tetrada (4 bit) | Ikkilik ↔ o‘n oltilik | 1011₂ = B₁₆ |',
        headers: ['Ikkilik guruh', 'O‘tkazish yo‘li', 'Amaliy misol'],
        rows: [
          ['Diada (2 bit)', 'Ikkilik ↔ to‘rtlik', '11₂ = 3₄'],
          ['Triada (3 bit)', 'Ikkilik ↔ sakkizlik', '111 101 010₂ = 752₈'],
          ['Tetrada (4 bit)', 'Ikkilik ↔ o‘n oltilik', '1011₂ = B₁₆'],
        ],
      },
      { type: 'note', content: 'Sanoq sistemasida razryadning qiymati asos darajalariga bog‘liq. Ikkilik triada va tetradalar faqat bitlarni guruhlash usuli: ular o‘z-o‘zidan faylni shifrlamaydi. Manfiy sonlarni ifodalashda 7-sinf kitobida ishora-bir bitli model uchraydi; zamonaviy ko‘plab kompyuterlarda esa ikkilik to‘ldiruvchi kod (two’s complement) ishlatiladi. Bitta modelni universal deb olish mumkin emas.' },
      { type: 'source', content: 'ICT 7-sinf (2021), PDF 9–21 (bosma 9–21-betlar); sanoq tizimlari, diada/triada/tetrada, butun va haqiqiy sonlarning tasvirlanishi.' },
    ],
  },
  {
    topicId: 'M01.05',
    beforeHeading: 'Bit, bayt, birliklar va Xartli formulasi',
    blocks: [
      { type: 'subheading', content: '7-sinf: 30 signal uchun minimal ikkilik uzunlik' },
      { type: 'solved', label: 'Yorug‘lik taxtasi — 30 xil signal', content: '',
        children: [
          { type: 'text', content: 'Har lampochka ikki holatdan birini oladi: o‘chiq yoki yoniq. n ta lampochka jami 2ⁿ mustaqil kombinatsiya beradi. Kamida 30 xil signal kerak.' },
          { type: 'keyformula', content: '2^4 < 30 \\le 2^5' },
          { type: 'text', content: '4 ta lampochka: 16 xil holat — yetmaydi. 5 ta lampochka: 32 holat — yetarli. Javob: **5 ta lampochka**. Umumiy qoida: N xil turli holat uchun minimal bitlar soni i = ⌈log₂ N⌉.' },
        ],
      },
      { type: 'trap', content: '7-sinf darsligidagi «1 Kb = 1024 bayt» yozuvini **kilobit** (kb) bilan chalkashtirmang. Ikkilik hisobda 1024 bayt = 1 KiB; o‘nlik SI hisobda 1000 bayt = 1 kB. Maktab vazifasining maxsus 1024 konvensiyasini alohida ko‘rsating. 64 GiB xotirada 99 baytli fayl sonini hisoblashda faqat arifmetik sig‘imning pastga yaxlitlangan natijasi olinadi; haqiqiy fayl tizimida metadata va joylashuv xarajati ham mavjud.' },
      { type: 'source', content: 'ICT 7-sinf (2021), PDF 22–25 (bosma 22–25-betlar); Xartli tengsizligi, 30 signal va USB saqlash misollari; belgilash konvensiyasi ehtiyotkor izohlangan.' },
    ],
  },
  {
    topicId: 'M01.06',
    beforeHeading: 'Matnli axborot: ASCII, Unicode va UTF',
    blocks: [
      { type: 'subheading', content: '7-sinf: alifbo kodiga qarab matn fayli hajmini hisoblash' },
      { type: 'solved', label: '678 sahifali matn — maxsus bir baytli belgi sharti', content: '',
        children: [
          { type: 'text', content: '678 sahifa, har sahifada 30 satr, har satrda 90 kodlangan belgi berilgan. Agar har bir belgi **1 bayt** deb olinsa va qo‘shimcha fayl belgilari hisobga olinmasa:' },
          { type: 'keyformula', content: 'V_{B}=678*30*90=1830600' },
          { type: 'note', content: 'Natija: **1 830 600 bayt**. Unicode — belgilarning kod nuqtalarini belgilovchi standart, o‘zi bitta o‘zgarmas bayt uzunligini anglatmaydi: UTF-8 o‘zgaruvchan uzunlikda, UTF-16 esa kod nuqtasiga qarab 2 yoki 4 bayt egallashi mumkin. Shuning uchun «Unicode hajmi aniq ikki baravar» degan xulosa kodlash usuli ko‘rsatilmaguncha noto‘g‘ri.' },
        ],
      },
      { type: 'source', content: 'ICT 7-sinf (2021), PDF 26–29 (bosma 26–29-betlar); ASCII, Unicode va 678×30×90 kitob mashqi. Hisob masala sharti doirasida berilgan.' },
    ],
  },
  {
    topicId: 'M01.06',
    beforeHeading: 'Grafik axborot: rastr, vektor, rang va hajm',
    blocks: [
      { type: 'subheading', content: '7-sinf: bir bitli rastr, rang chuqurligi va o‘lcham' },
      { type: 'case', content: '8×8 katakli ikki rangli siqilmagan rasmda har piksel uchun 1 bit ishlatilsa, 64 piksel × 1 bit = **64 bit = 8 bayt**. 1280×720 rasm 16 777 216 xil rangni kodlasa, kerakli rang chuqurligi 24 bit, xom piksel maʼlumoti esa 1280×720×24/8 = **2 764 800 bayt**. Bu fayl sarlavhasi, alfa kanali va siqishsiz nazariy hajm.' },
      { type: 'table', content: '| Tasvir modeli | Asosiy element | O‘lcham va format farqi |\n|---|---|---|\n| Rastr | Piksel | Xom hajm: W × H × bit chuqurligi |\n| Vektor | Chiziq/shakl/egri chiziq | Obyekt tavsiflari va murakkabligi |\n| Fraktal | Formulalar/iteratsiya | Parametr va aniqlik darajasiga bog‘liq |\n| RGB | R, G, B yorug‘lik kanallari | Ko‘pincha ekran uchun |\n| CMYK | Chop etish siyohlari | Bosma rang ajratish modeli |',
        headers: ['Tasvir modeli', 'Asosiy element', 'O‘lcham va format farqi'],
        rows: [
          ['Rastr', 'Piksel', 'Xom hajm: W × H × bit chuqurligi'],
          ['Vektor', 'Chiziq/shakl/egri chiziq', 'Obyekt tavsiflari va murakkabligi'],
          ['Fraktal', 'Formulalar/iteratsiya', 'Parametr va aniqlik darajasiga bog‘liq'],
          ['RGB', 'R, G, B yorug‘lik kanallari', 'Ko‘pincha ekran uchun'],
          ['CMYK', 'Chop etish siyohlari', 'Bosma rang ajratish modeli'],
        ],
      },
      { type: 'trap', content: 'PPI va DPI turli kattaliklar: tasvirdagi piksel zichligi bilan printerning nuqta zichligini tenglashtirmang. JPEG odatda yo‘qotishli siqiladi, PNG esa odatda yo‘qotishsiz rastr maʼlumot saqlaydi. Rasmni faylda **sifat yo‘qotmasdan saqlash** uning hajmini qayta namunalashda mutlaqo sifat o‘zgarmasligini anglatmaydi.' },
      { type: 'source', content: 'ICT 7-sinf (2021), PDF 29–33 va 40–46 (bosma 29–33, 40–46-betlar); PPI/DPI, 8×8 rastr, RGB va rastr/vektor/fraktal, grafik formatlar. Photoshop amaliy interfeysi boshqa modulga tegishli.' },
    ],
  },
  {
    topicId: 'M01.06',
    beforeHeading: 'Audioaxborot: namunalash, bit chuqurligi va hajm',
    blocks: [
      { type: 'subheading', content: '7-sinf kitobida hisob natijasidagi bosma xatoni aniqlash' },
      { type: 'solved', label: '16 bit × 48 kHz × 3 minut — nazoratli yechim', content: '',
        children: [
          { type: 'text', content: 'Darslikning PDF 36-sahifasidagi shart: namuna chastotasi 48 000 Hz, chuqurligi 16 bit, davomiyligi 3 minut (180 sekund). **Mono**, siqilmagan PCM deb olamiz; fayl konteyneri va sarlavhasi hisobga olinmaydi.' },
          { type: 'keyformula', content: 'V_{bit}=48000*16*180=138240000' },
          { type: 'keyformula', content: 'V_{B}=138240000/8=17280000' },
          { type: 'text', content: 'Natija: **17 280 000 bayt ≈ 16,48 MiB** (yoki 17,28 MB o‘nlik hisobda). Agar ikki kanalli stereo bo‘lsa, bu hajm ikki baravar bo‘ladi.' },
          { type: 'trap', content: 'Darslikda oraliq hisob **17 280 000 bayt** deb to‘g‘ri yozilgan, ammo yakuniy «1,64 Mb» javobida **o‘nlik nuqta/vergul va birlik xatosi** mavjud. Shu yakuniy javobni testga to‘g‘ri javob sifatida ko‘chirmang.' },
        ],
      },
      { type: 'note', content: 'Shuningdek, PDF 37-sahifadagi 768×484 piksel, 1024 rang (10 bit), 30 kadr/s, 2 minut misoli uchun xom video hajmi 13 381 632 000 **bit** = 1 672 704 000 **bayt** ≈ 1,56 GiB. Bu faqat siqilmagan video piksellari; haqiqiy MP4 kabi faylda kodek va audio oqimi hajmni o‘zgartiradi.' },
      { type: 'source', content: 'ICT 7-sinf (2021), PDF 34–39 (bosma 34–39-betlar); audio 36-betdagi bosma xato va video 37-betdagi bit/bayt farqi qayta hisoblangan.' },
    ],
  },
]
