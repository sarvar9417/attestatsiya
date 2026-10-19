/**
 * M02 focused source-backed expansions based on the uploaded ICT and
 * Cambridge+ school textbooks. Page citations refer to PDF-page indices,
 * not the printed page number. These blocks are theory, not item sign-offs.
 */
import type { TheoryBlock } from '../topicContent'

export const M02_SOURCE_THEORY: Readonly<Record<string, readonly TheoryBlock[]>> = {
  'M02.01': [
    { type: 'heading', content: 'Texnik taʼminotni tanlash va tashxislash' },
    { type: 'definition', content: '**Ichki qurilmalar** (CPU, RAM, plata, xotira kontrolleri) hisoblash va resurslarga xizmat qiladi; **tashqi qurilmalar** maʼlumotni kiritish, chiqarish yoki saqlashda ishlatiladi. Tasnifni faqat qurilmaning jismoniy joyiga emas, asosiy funksiyasiga ko‘ra qiling. @@ICT 10-sinf, PDF 6–11; Cambridge+ 10–11-sinf, PDF 32–34@@' },
    { type: 'example', content: 'Muammo: ovoz yozish kerak, lekin mikrofon ulanmagan. Karnayni almashtirish yordam bermaydi, chunki karnay — chiqarish qurilmasi, mikrofon — kiritish qurilmasi. Muammoni vazifa → qurilma funksiyasi → interfeys → drayver tartibida tekshiring. @@ICT 10-sinf, PDF 8–11@@' },
    { type: 'heading', content: 'Kiritishning maxsus texnologiyalari: OCR, OMR, MICR' },
    { type: 'definition', content: '**OCR** — skanerlangan rasm ichidagi belgilarni matn sifatida tanishga xizmat qiladi. **OMR** — oldindan belgilangan joylarda qo‘yilgan belgilarni o‘qishga mos. **MICR** — maxsus magnitli siyoh bilan bosilgan belgilarni, jumladan bank cheklaridagi kodlarni o‘qishda ishlatiladi. Bu uch vazifa bir-biriga teng emas. @@Cambridge+ 9-sinf, PDF 29–31; Cambridge+ 10–11-sinf, PDF 38–40@@' },
    { type: 'case', content: 'Vaziyat: 500 ta test javob varaqasi, har birida oldindan belgilangan A–D katakchalari bor. Belgilarni avtomatik aniqlash uchun OMR mos; qo‘lyozma inshoni qidiriladigan elektron matnga o‘tkazish uchun esa OCR o‘rinliroq. @@Cambridge+ 9-sinf, PDF 29–31@@' },
    { type: 'heading', content: 'Birlamchi va ikkilamchi xotira' },
    { type: 'definition', content: '**RAM** ish jarayonidagi maʼlumotlarni vaqtincha saqlaydi va odatda energiya uzilganda maʼlumoti yo‘qoladi. **ROM** boshlang‘ich yo‘riqnomalar uchun mo‘ljallangan o‘zgarmas yoki cheklangan tarzda yoziladigan xotira sinfi. **SSD/HDD** uzoq muddatli fayl saqlash vositalari bo‘lib, ular RAM bilan bir xil vazifa bajarmaydi. @@Cambridge+ 9-sinf, PDF 13–16, 39–45; ICT 10-sinf, PDF 11–16@@' },
    { type: 'trap', content: '«HDD hajmi katta bo‘lsa, RAM ham ko‘p bo‘ladi» degan mulohaza noto‘g‘ri: doimiy saqlash hajmi va operativ xotira hajmi mustaqil parametrlar. Shuningdek, protsessor takt chastotasi yagona samaradorlik mezoni emas. @@Cambridge+ 9-sinf, PDF 13–16@@' },
    { type: 'heading', content: 'Protsessor chastotasi: SI old qo‘shimchalari' },
    { type: 'trap', content: 'ICT 10-sinf (2021) darsligining **bosma 17-betidagi** “1000 Hz = 1 MHz” tengligi xato. To‘g‘ri zanjir: **1000 Hz = 1 kHz**, **1000 kHz = 1 MHz**, **1000 MHz = 1 GHz**. Demak **1 MHz = 1 000 000 Hz**; kilo (k) = 10³, mega (M) = 10⁶, giga (G) = 10⁹. Bitta protsessor takti bitta tayyor ko‘rsatma yoki bitta amal bilan doimo teng emas: ish unumdorligi arxitektura va dasturga ham bog‘liq.' },
    { type: 'case', content: 'Darslikning **bosma 15–16-betlarida** axborot tashuvchilar sig‘imi yozuvlari orasida `Gb` va `ГБ` shakllari aralash uchraydi. **b = bit**, **B = bayt**, **1 B = 8 bit**. Agar aniq **128 Gb** desak, o‘nlik o‘lchovda bu **16 GB**; **128 GB** bilan bir xil emas. Saqlash qurilmalaridagi harf kattaligi va birlik konvensiyasini tekshirmasdan sig‘imlarni saralamang.' },
    { type: 'source', content: 'Manba izi: Fayziyeva va boshq., “Informatika va axborot texnologiyalari”, 10-sinf, 2021; bosma 15–17-betlar, asl PDF matni (Sarvar Drive: ICT 10_sinf-2021_compressed.pdf). Hz/kHz/MHz/GHz aniqliklari xalqaro SI prefikslari asosida tuzatildi. Grafik sahifa va original qurilma yorliqlari individual vizual ekspertizasidan o‘tkazilishi kerak.' },
    { type: 'heading', content: 'Chop etish va ekran tavsiflarini baholash' },
    { type: 'text', content: 'Chop etish qurilmasini tanlashda hujjat hajmi, rangli chop etish talabi, xarajat, bosma tezligi va sifatni birgalikda baholang. Ekran aniqligi piksellar soniga bog‘liq; lekin ekranning fizik diagonali hamda piksellar soni alohida parametrlar. @@ICT 10-sinf, PDF 9–11; Cambridge+ 9-sinf, PDF 31–38@@' },
  ],
  'M02.02': [
    { type: 'heading', content: 'Operatsion tizimning besh asosiy roli' },
    { type: 'definition', content: 'OT protsessor va jarayonlar, RAM, doimiy saqlash, kiritish-chiqarish qurilmalari, foydalanuvchi interfeysi va fayl resurslaridan foydalanishni boshqaradi. Dasturlarni ishga tushirish hamda apparat bilan ishlash uchun umumiy xizmatlar yaratadi. @@ICT 10-sinf, PDF 24–28; Cambridge+ 10–11-sinf, PDF 49–56@@' },
    { type: 'table', content: '| Mezoni | CLI | GUI |\n|---|---|---|\n| Muloqot | Buyruqlarni matn bilan kiritish | Oyna, belgi, menyu orqali |\n| Tipik kuchli jihat | Takrorlanuvchi ishlarni buyruqlar bilan avtomatlashtirish | Ko‘rgazmali va tez o‘rganiladigan boshqaruv |\n| Ehtiyot nuqta | Buyruq sintaksisi muhim | Vizual interfeysning qulayligi resurs talabiga bog‘liq |', headers:['Mezoni','CLI','GUI'], rows:[['Muloqot','Buyruqlarni matn bilan kiritish','Oyna, belgi, menyu orqali'],['Tipik kuchli jihat','Takrorlanuvchi ishlarni buyruqlar bilan avtomatlashtirish','Ko‘rgazmali va tez o‘rganiladigan boshqaruv'],['Ehtiyot nuqta','Buyruq sintaksisi muhim','Vizual interfeysning qulayligi resurs talabiga bog‘liq']] },
    { type: 'example', content: 'CLI va GUI bir-birini inkor qilmaydi: bir xil OT buyruqlar qatori hamda grafik interfeysni taqdim etishi mumkin. Turini baholashda «qaysi OT?» va «qaysi boshqaruv interfeysi?» savollarini alohida ko‘ring. @@ICT 10-sinf, PDF 24–26; Cambridge+ 9-sinf, PDF 11–13@@' },
    { type: 'heading', content: 'OT, drayver va dastur orasidagi masʼuliyat' },
    { type: 'text', content: 'Printerga hujjat yuborishda amaliy dastur chop etish so‘rovini beradi, OT vazifani boshqaradi, drayver qurilma bilan aloqa uchun mos ko‘rsatmalarni taʼminlaydi. Muammo chiqsa, OT holati, drayver va qurilma ulanishini ajratib tekshiring. @@Cambridge+ 9-sinf, PDF 11–13; Cambridge+ 10–11-sinf, PDF 54–59@@' },
    { type: 'source', content: 'OT oilalari va fayl tizimlari misollari darslik davriga bog‘liq: ICT 10-sinf PDF 24–27. Ayrim nomlar yoki versiyalar hozir eskirgan bo‘lishi mumkin; imtihon savolini darslik kontekstida talqin qiling.' },
  ],
  'M02.03': [
    { type: 'heading', content: 'Fayl, papka, manzil va kengaytma' },
    { type: 'definition', content: '**Fayl** nomlangan maʼlumot birligi; **papka** fayllar va boshqa papkalarni ierarxik guruhlaydi. **Kengaytma** fayl turi haqida maʼlumot beradi, lekin nomning oxirini o‘zgartirishning o‘zi faylning haqiqiy ichki formatini o‘zgartirmaydi. @@ICT 5-sinf, PDF 43–47@@' },
    { type: 'example', content: 'Misol: `D:\\Dars\\9-sinf\\referat.docx` yozuvida disk, papkalar ketma-ketligi va kengaytmali fayl nomi ajraladi. Manzilni o‘qishda papka nomi bilan fayl nomini chalkashtirmang. @@ICT 5-sinf, PDF 43–47@@' },
    { type: 'heading', content: 'Amallar natijasini farqlash' },
    { type: 'table',content:'| Amal | Natija |\n|---|---|\n| Nusxalash | Asl nusxa qoladi, ikkinchi nusxa hosil bo‘ladi |\n| Ko‘chirish | Asl joyidan yangi manzilga o‘tadi |\n| Qayta nomlash | Nomi o‘zgaradi, mazmuni majburiy o‘zgarmaydi |\n| O‘chirish | Operatsion tizim va sozlamaga qarab savatga yoki butunlay o‘chirishga olib keladi |',headers:['Amal','Natija'],rows:[['Nusxalash','Asl nusxa qoladi, ikkinchi nusxa hosil bo‘ladi'],['Ko‘chirish','Asl joyidan yangi manzilga o‘tadi'],['Qayta nomlash','Nomi o‘zgaradi, mazmuni majburiy o‘zgarmaydi'],['O‘chirish','Operatsion tizim va sozlamaga qarab savatga yoki butunlay o‘chirishga olib keladi']]},
    { type: 'trap', content: 'Faylning yo‘li — u qaysi joyda ekanini ko‘rsatuvchi manzil. Kengaytma — odatda formatni anglatadi. Ular bir xil tushuncha emas. Shuningdek, `Save as` va oddiy `Save` amallari har doim bir xil natija bermaydi. @@ICT 5-sinf, PDF 43–47@@' },
    { type: 'heading', content: 'Fayl tizimini tanish' },
    { type: 'text', content: 'Fayl tizimi maʼlumotlarni saqlash qurilmasida nomlash, joylashtirish va manzillashni tashkil etadi. ICT 10-sinfda FAT32, NTFS, ext3, ReiserFS, ISO-9660 va UDF misollari uchraydi. Savolda fayl tizimini apparat qurilmaning nomi bilan adashtirmang. @@ICT 10-sinf, PDF 25–27@@' },
  ],
  'M02.04': [
    { type: 'heading', content: 'Tizimli, amaliy va utilita dasturlar' },
    { type: 'definition', content: '**Tizimli dastur** boshqa dasturlar ishlashi uchun muhit va apparatga xizmat yaratadi. **Amaliy dastur** foydalanuvchining bevosita vazifasiga xizmat qiladi. **Utilita** — texnik xizmat, himoya, diagnostika yoki maʼlumotni boshqarish ishlarini bajaradigan yordamchi dastur. @@ICT 5-sinf, PDF 39–42; ICT 10-sinf, PDF 28–31; Cambridge+ 10–11-sinf, PDF 55–60@@' },
    { type: 'case', content: 'Bir kompyuterda matn protsessori, OT, antivirus va printer drayveri ishlatilmoqda. Matn protsessori — amaliy; OT va drayver — tizimli; antivirus — xizmat ko‘rsatuvchi utilita. Dastur nomi emas, uning vazifasi to‘g‘ri tasnif mezonidir. @@Cambridge+ 9-sinf, PDF 9–13; Cambridge+ 10–11-sinf, PDF 55–60@@' },
    { type: 'heading', content: 'Til tarjimonlari' },
    { type: 'definition', content: '**Kompilyator** odatda manba kodni boshqa, bajariladigan yoki oraliq ko‘rinishga tarjima qiladi. **Interpretator** dastur bajarilish jarayonida kodni yoki oraliq buyruqlarni talqin qiladi. Java misolida manba kod baytkodga kompilyatsiya qilinib, JVM uni bajarishga yordam beradi; sodda «Java faqat interpretatsiya qilinadi» deyish yetarli emas. @@Cambridge+ 10–11-sinf, PDF 43–47@@' },
    { type: 'heading', content: 'Tayyor va buyurtma dasturiy taʼminot' },
    { type: 'text', content: 'Tayyor dastur keng foydalanuvchilar ehtiyoji uchun ishlab chiqiladi; buyurtma dastur maʼlum tashkilot yoki mijozning maxsus ish jarayoniga mos yaratiladi. Tanlashda funksional moslik, narx, texnik qo‘llab-quvvatlash, moslashuvchanlik va yangilanish xarajatini birga baholang. @@Cambridge+ 10–11-sinf, PDF 59–61@@' },
    { type: 'heading', content: 'Xizmat ko‘rsatishdagi xatolar' },
    { type: 'trap', content: 'Antivirus har qanday tahdidni mutlaq bartaraf etmaydi; zaxira nusxa esa zararli dasturdan himoyalanishning o‘rnini bosa olmaydi. Diagnostika, zaxiralash va zararli dastur tekshiruvi turli ehtiyojlarga xizmat qiladi. @@ICT 10-sinf, PDF 28–31; Cambridge+ 10–11-sinf, PDF 56–60@@' },
  ],
}
