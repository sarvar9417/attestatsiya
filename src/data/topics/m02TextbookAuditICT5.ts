import type { TheoryBlock } from '../topicContent'

/** TASK-245: ICT 5-sinf (2020), PDF 25–48 / bosma 24–47. Original izohlar. */
export const ICT5_M02_BOOK_ADDENDA: Readonly<Record<string, readonly TheoryBlock[]>> = {
  'M02.01': [
    { type: 'heading', content: '5-sinf: qurilmalarni asosiy funksiyasiga ko‘ra farqlash' },
    { type: 'table', content: '', headers: ['Qurilma','Funksiya','Farqi'], rows: [
      ['Skaner','Qog‘ozdan raqamli ko‘rinishga kiritish','Printer esa chiqaradi'],
      ['Printer','Matn yoki tasvirni materialga chop etish','3D printer obyekt yaratadi'],
      ['Plotter','Yirik formatli chizma yoki tasvirni chiqarish','Oddiy printer bilan vazifasi kesishishi mumkin'],
      ['Sensorli ekran','Tasvirni ko‘rsatish va tegishni qabul qilish','Ham kiritish, ham chiqarish'],
    ] },
    { type: 'note', content: 'Kitobdagi CRT, plazma va LCD monitorlari tarixiy texnologiya misollari; zamonaviy OLED yoki LED-orqa yoritishli LCDni faqat shu uchlikka kiritmang.' },
    { type: 'source', content: 'ICT 5-sinf (2020), PDF 25–32, bosma 24–31: monitor, klaviatura, skaner, printer, plotter va boshqa tashqi qurilmalar.' },
  ],
  'M02.02': [
    { type: 'heading', content: '5-sinf: Esc tugmasi va Undo orasidagi farq' },
    { type: 'trap', content: 'Darslik PDF 34da Esc «oxirgi amalni bekor qilish» deb soddalashtirilgan. Odatda **Esc** menyu yoki dialogdan chiqish/joriy tanlovni bekor qilishga xizmat qiladi; matndagi avvalgi tahrirni qaytarish ko‘pincha **Undo (Ctrl+Z)** bilan bajariladi. Vazifa dasturga bog‘liq.' },
    { type: 'note', content: 'PDF 40–41dagi Internet Explorer, «Mening kompyuterim» va Windows menyulari tarixiy interfeys misollari; OT tushunchasini tugma nomlariga bog‘lamang.' },
    { type: 'source', content: 'ICT 5-sinf (2020), PDF 33–35 va 39–42, bosma 32–34 va 38–41: klaviatura, Windows, OT.' },
  ],
  'M02.03': [
    { type: 'heading', content: '5-sinf: fayl asl mazmun, shortcut esa yo‘naltirish' },
    { type: 'table', content: '', headers: ['Tushuncha','Mohiyat'], rows: [
      ['Fayl','Mazmuni saqlangan nomli obyekt'],
      ['Papka','Fayl va papkalarni ierarxik tartiblash'],
      ['Yorliq / shortcut','Boshqa fayl, papka yoki dasturga havola'],
      ['To‘liq manzil','Disk va papkalar ketma-ketligi bilan fayl yo‘li'],
    ] },
    { type: 'trap', content: 'Kitob PDF 44da fayl «yorliq ko‘rinishida saqlanadi» deyiladi. Asl **fayl** bilan unga yo‘naltiruvchi **yorliq** aynan bir narsa emas. Yorliqni o‘chirish odatda asl faylni o‘chirmaydi; fayl kengaytmasini o‘zgartirish esa format konvertatsiyasi emas.' },
    { type: 'source', content: 'ICT 5-sinf (2020), PDF 43–48, bosma 42–47: fayl, papka, yorliq, kengaytma, amallar va Windows yo‘li.' },
  ],
  'M02.04': [
    { type: 'heading', content: '5-sinf: dasturiy taʼminotni vazifaga qarab ajratish' },
    { type: 'case', content: 'OT qurilmalar va boshqa dasturlar ishini boshqaradi — **tizimli dastur**. Matn muharriri foydalanuvchi hujjatini yaratadi — **amaliy dastur**. Antivirus, arxivator va diagnostika vositalari — vazifasiga qarab **utilita**. Ilovaning ikonasi yoki tarixiy nomi sinfini aniqlamaydi.' },
    { type: 'source', content: 'ICT 5-sinf (2020), PDF 39–42, bosma 38–41: dastur, operatsion tizim, interfeys. Utilita taʼrifi qo‘shimcha texnik izoh.' },
  ],
}
