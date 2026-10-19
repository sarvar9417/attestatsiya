import type { TheoryBlock } from '../topicContent'

/**
 * M02/ICT10 (2021): original editorial corrections, PDF 4–34.
 * Textbook's historically inconsistent examples are labeled, not silently rewritten.
 */
export const ICT10_M02_BOOK_ADDENDA: Readonly<Record<string, readonly TheoryBlock[]>> = {
  'M02.01': [
    { type: 'heading', content: '10-sinf: EHM avlodlaridagi bosma jadval xatosini aniqlash' },
    { type: 'trap', content: 'Darslikning **PDF 6-betida** «EHM 3-avlodi» yonidagi jadvalda **1946–1955** va **elektron lampa** yozuvi turibdi; shu sahifaning o‘zida esa **«Integral sxema»** tasviri berilgan. Bu ichki nomuvofiqlikni yodlash tavsiya etilmaydi: **1-avlod — lampalar; 2-avlod — tranzistorlar; 3-avlod — integral sxemalar; 4-avlod — mikroprotsessor va katta integral sxemalar** bilan bog‘lanadi. Aniq yil chegarasi manbalar bo‘yicha farqlanishi mumkin.' },
    { type: 'case', content: 'Kompyuterga maʼlumot mikrofon/klaviatura orqali **kiritiladi**, CPU hisoblashni **bajaradi**, RAM ish jarayoni maʼlumotini **vaqtincha** saqlaydi, SSD/HDD esa fayllarni **doimiy** saqlaydi. Bitta qurilmaning saqlash hajmini boshqa qurilmaning tezligi bilan almashtirib xulosa chiqarmang.' },
    { type: 'source', content: 'ICT 10-sinf (2021), PDF 4–7 — hisoblash avlodlari va avlod-3 jadvali; PDF 8–18 — kiritish/chiqarish, RAM/ROM, SSD/HDD va CPU.' },
  ],
  'M02.02': [
    { type: 'heading', content: '10-sinf: GUI va CLI atamalarini imlo xatosiz farqlash' },
    { type: 'trap', content: 'Darslik PDF 27dagi mashqda **«GIU»** yozilgan. To‘g‘ri xalqaro atama **GUI (Graphical User Interface)**; unga alternativ **CLI (Command-Line Interface)**. GUI oynalar va menyularga, CLI matn buyruqlariga asoslanadi. Ikkala interfeys bir operatsion tizim tarkibida ham mavjud bo‘lishi mumkin.' },
    { type: 'note', content: 'Windows/macOS/Linux — kompyuter OT oilalari; Android va iOS — mobil OT oilalari. **Android Linux yadrosiga tayangan** degan texnik izoh uni istalgan ish stoli Linux distributivi bilan aynan bir xil OT qilishni anglatmaydi. Kitobdagi versiya va ulushga doir misollar nashr davriga bog‘liq.' },
    { type: 'source', content: 'ICT 10-sinf (2021), PDF 24–28 — OT, fayl tizimi, CLI va bosma «GIU», mobil OT nomlari.' },
  ],
  'M02.03': [
    { type: 'heading', content: '10-sinf: to‘liq manzilni fayl turi bilan adashtirmang' },
    { type: 'case', content: 'Darslik PDF 27: **C:** disk, **\\django\\newproject\\config\\** kataloglar yo‘li va **settings.ru** fayl nomi jadval ustunlarida alohida ko‘rsatilgan. Buning vazifasi — **disk / papka yo‘li / fayl nomi**ni farqlash. Aynan Django Python sozlama modulining keng tarqalgan asl fayli esa **settings.py** bo‘ladi; darslikdagi **settings.ru**ni umumiy Django fayl standarti deb o‘rgatmang.' },
    { type: 'trap', content: 'Fayl nomining oxiridagi kengaytma uning qaysi format deb nomlanganiga ishora qiladi, lekin faqat kengaytmani tahrirlash fayl ichidagi maʼlumotni avtomatik konvertatsiya qilmaydi. To‘liq fayl yo‘li, nom va fayl tizimi ham har xil tushunchalar.' },
    { type: 'source', content: 'ICT 10-sinf (2021), PDF 25–28: fayl tizimi va PDF 27dagi C: / katalog / settings.ru namuna jadvali. Django settings.py — kitob misolini texnik aniqlashtirish.' },
  ],
  'M02.04': [
    { type: 'heading', content: '10-sinf: arxivator, kodek va konvertorni farqlash' },
    { type: 'table', content: '', headers: ['Vosita','Asosiy vazifasi','Misol'], rows: [
      ['Arxivator','Bir yoki bir nechta faylni arxivlash, baʼzan siqish','ZIP, RAR arxiv dasturi'],
      ['Kodek','Audio/video oqimni kodlash yoki dekodlash','Audio yoki video kodek'],
      ['Konvertor','Bir fayl formatidan boshqasiga o‘tkazish','Hujjatni DOCX → PDF eksport qilish'],
      ['Media pleyer','Audio/video faylni ijro etish','Videoni tomosha qilish dasturi'],
    ] },
    { type: 'trap', content: 'Arxivator **har qanday siqishni yo‘qotishli** qiladi deyish noto‘g‘ri. Kodek va fayl formati ham doimo aynan bitta narsa emas. Darslikdagi mahsulot nomlari va sinov muddatlari 2021-yilgi dastur versiyalari kontekstida berilgan; har bir dasturda ayni muddat doim saqlanadi deb bo‘lmaydi.' },
    { type: 'source', content: 'ICT 10-sinf (2021), PDF 28–34: WinRAR arxivator, multimedia kodeklari, audiokonvertor va hujjat konvertori misollari.' },
  ],
}
