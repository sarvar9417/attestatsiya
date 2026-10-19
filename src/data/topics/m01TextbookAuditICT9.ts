/**
 * TASK-244 | original, page-verified notes from 9-sinf ICT (2020).
 *
 * Only information literacy and file-size exercises belong in M01 here.
 * The 9-sinf textbook's logic, modelling, algorithms and Python curricula
 * primarily belong to M04, M06 and M08; see the audit concordance.
 *
 * PDF index = printed textbook page + 1 for the relevant chapters.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const ICT9_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.02',
    beforeHeading: 'Analog va raqamli axborot',
    blocks: [
      { type: 'subheading', content: '9-sinf: obyekt, xossa, xossaning qiymati va axborot modeli' },
      { type: 'table', content: '| Atama | Nimani anglatadi? | O‘quv vaziyati |\n|---|---|---|\n| Obyekt | O‘rganilayotgan narsa, hodisa yoki jarayon | Kutubxonadagi kitob |\n| Xossa | Obyektni tavsiflash mezoni | Sahifalar soni |\n| Xossaning qiymati | Shu mezon bo‘yicha kuzatilgan maʼlumot | 160 sahifa |\n| Axborot modeli | Maqsadga kerakli belgilar asosidagi soddalashtirilgan tavsif | Kitob nomi, muallifi, sahifalar soni yozilgan katalog |',
        headers: ['Atama', 'Nimani anglatadi?', 'O‘quv vaziyati'],
        rows: [
          ['Obyekt', 'O‘rganilayotgan narsa, hodisa yoki jarayon', 'Kutubxonadagi kitob'],
          ['Xossa', 'Obyektni tavsiflash mezoni', 'Sahifalar soni'],
          ['Xossaning qiymati', 'Shu mezon bo‘yicha kuzatilgan maʼlumot', '160 sahifa'],
          ['Axborot modeli', 'Maqsadga kerakli belgilar asosidagi soddalashtirilgan tavsif', 'Kitob nomi, muallifi, sahifalar soni yozilgan katalog'],
        ],
      },
      { type: 'note', content: 'Kitobdagi obyekt–xossa–qiymat ajratilishi axborotni yig‘ish va tasniflash uchun foydali. Modelning turlari, statik/dinamik va modellashtirish metodlari **M04.06** mavzusida batafsil o‘rganiladi; M01da ularning to‘liq takrori qilinmaydi.' },
      { type: 'source', content: 'ICT 9-sinf (2020), PDF 21–22 (bosma 20–21-betlar), «Model va uning turlari»; obyekt nomi, xossa, qiymat jadvali va modelning soddalashtirilgan tavsifi. Misol original.' },
    ],
  },
  {
    topicId: 'M01.07',
    beforeHeading: 'Grafik masalasi',
    blocks: [
      { type: 'subheading', content: '9-sinf: 46 sahifali referat va 51 MB mobil trafik masalasi' },
      { type: 'solved', label: 'Referatni elektron pochta orqali yuborish — shartli fayl hajmi', content: '',
        children: [
          { type: 'text', content: 'Darslikdagi vaziyat: **46 sahifa**, har sahifada **40 satr**, har satrda **67 belgi**. Hisoblashning maxsus sharti — **1 belgi = 1 bayt**; fayl formati, ilovalar, pochta xizmati va protokolning qo‘shimcha xarajati hisobga olinmaydi. Mavjud mobil trafik **51 MB**.' },
          { type: 'keyformula', content: 'N=46\\cdot40\\cdot67=123280\\ \\text{belgi}' },
          { type: 'keyformula', content: 'V=123280\\ \\text{B}\\approx0.118\\ \\text{MiB}' },
          { type: 'text', content: '**Natija:** shartdagi ideal matn hajmi 51 MBdan ancha kichik, shuning uchun mazkur taxminlar ostida **yuborish mumkin**. Darslikdagi taxminan 0,118 «Mbayt» — 1024² ga bo‘lish natijasi; aniq birlik **MiB**. 123 280 bayt esa o‘nlik hisobda 0,12328 MB.' },
          { type: 'trap', content: 'Haqiqiy Word/PDF hujjatida formatlash, shrift, rasm, fayl metamaʼlumoti hamda e-mail biriktirmasining kodlanishi tufayli trafik **belgilar sonigagina teng emas**. «51 MB mobil paket» bilan faylning 0,118 MiB natijasini birlikka keltirmasdan solishtirmang. Bu masala real pochta limiti kafolati emas.' },
        ],
      },
      { type: 'source', content: 'ICT 9-sinf (2020), PDF 19–20 (bosma 18–19-betlar), 8–9-dars «Masalalarni kompyuterda yechish bosqichlari», Bunyod referati haqidagi 3-masala; hisoblash sharti va zamonaviy formatga doir farq ajratildi.' },
    ],
  },
  {
    topicId: 'M01.06',
    beforeHeading: 'Audioaxborot: namunalash, bit chuqurligi va hajm',
    blocks: [
      { type: 'subheading', content: '9-sinf: 2048 × 1366 piksel, to‘rt rangli ekranning xom axborot hajmi' },
      { type: 'solved', label: '4 xil rangli ekran, 2048 × 1366', content: '',
        children: [
          { type: 'text', content: 'Kitobda berilgan mustaqil masala: tasvir **2048 × 1366 piksel**, ekranda **faqat 4 xil rang** mavjud. Har bir pikselga eng qisqa, qatʼiy uzunlikdagi rang kodini ajratamiz. Siqish va fayl sarlavhasi hisobga olinmaydi.' },
          { type: 'keyformula', content: 'i=\\log_2 4=2\\ \\text{bit/piksel}' },
          { type: 'keyformula', content: 'V=2048\\cdot1366\\cdot2=5595136\\ \\text{bit}' },
          { type: 'keyformula', content: 'V=5595136/8=699392\\ \\text{B}=683\\ \\text{KiB}' },
          { type: 'trap', content: '4 ta rangni 4 bit bilan kodlash shart emas: **4 rang uchun 2 bit yetadi**. Real ekranning fizik framebufferi RGB/RGBA kabi kattaroq bit chuqurligini ishlatishi mumkin. Bu mashqda esa aynan **to‘rt holatli minimal kodlangan, siqilmagan tasvir maʼlumoti** hisoblanmoqda.' },
        ],
      },
      { type: 'source', content: 'ICT 9-sinf (2020), PDF 27 (bosma 26-bet), «12-dars. Amaliy mashg‘ulot», 1-topshiriq: 2048 × 1366 ekran, 4 rang. Yechim darslikdagi shart asosida mustaqil hisoblandi.' },
    ],
  },
]
