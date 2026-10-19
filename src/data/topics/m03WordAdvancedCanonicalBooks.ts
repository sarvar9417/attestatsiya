/** TASK-286: source-guided, independently authored Word formatting and objects. */
import type { TheoryBlock } from '../topicContent'
export const M03_02_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Belgini, abzatsni va sahifa formatini farqlash; qalin/kursiv/tagiga chizish, rang va oraliqni ongli tanlash; uslublar (Styles), ro‘yxat, tabulyatsiya, sahifa maketi va Format Painter’dan foydalanish; avtomatik mundarija uchun semantik sarlavha yaratish; bir hujjatda bir xil dizaynni saqlash."
  },
  {
    "type": "intro",
    "content": "Matnni formatlash faqat ko‘rinishni bezash emas: u o‘quvchiga sarlavha, asosiy matn, izoh va jadval orasidagi ierarxiyani tez anglatishi kerak. Bir xil qo‘llanmada har bir sarlavhani qo‘lda o‘zgartirish o‘rniga semantik uslubdan foydalanish tahrirni ham yengillashtiradi."
  },
  {
    "type": "heading",
    "content": "1. Formatlash darajalari va obyekt chegarasi"
  },
  {
    "type": "definition",
    "content": "==Belgi formati== — ajratilgan harf yoki so‘z ko‘rinishi; ==abzats formati== — butun abzatsning tekislanishi, chekinishi va oralig‘i; ==sahifa formati== — maydon, yo‘nalish va qog‘oz o‘lchami; ==stil== esa bir nechta sozlama to‘plami."
  },
  {
    "type": "table",
    "content": "| Daraja | Sozlamalar | Tekshirish nuqtasi |\n|---|---|---|\n| Belgi | Font, size, bold, italic, color | Faqat belgilangan qismmi? |\n| Abzats | Align, indent, line spacing | Butun abzatsga ta’sir qildimi? |\n| Sahifa/bo‘lim | Margins, orientation, size | Boshqa bo‘limlar saqlanganmi? |\n| Stil | Heading 1, Heading 2, Normal | Tuzilma barchaga bir xilmi? |"
  },
  {
    "type": "trap",
    "content": "Shriftning 16 pt bo‘lishi avtomatik «Heading 1» uslubiga aylantirmaydi. Vizual kattalik bilan hujjatning mantiqiy sarlavha darajasi alohida tushunchalar."
  },
  {
    "type": "heading",
    "content": "2. Matn belgilash va shrift"
  },
  {
    "type": "text",
    "content": "Home → Font guruhida shrift turi, kattaligi, rangi, qalin, kursiv, tagiga chizish, kichik/yuqori indeks kabi parametrlar mavjud. Bir xil hujjatda ko‘p shrift turidan foydalanish o‘qishni qiyinlashtiradi."
  },
  {
    "type": "table",
    "content": "| Amal | Qisqa tugma | Muhim farq |\n|---|---|---|\n| Bold | Ctrl+B | Urg‘u uchun qalin |\n| Italic | Ctrl+I | Qiya belgi |\n| Underline | Ctrl+U | Tagiga chizish |\n| Superscript | Ctrl+Shift+= | Yuqori indeks |\n| Subscript | Ctrl+= | Quyi indeks |"
  },
  {
    "type": "example",
    "content": "Matematika ifodasida x² ustidagi 2 yuqori indeks bo‘lishi mumkin; kimyoviy H₂O dagi 2 quyi indeks. Bu ikki amal bir xil bo‘lmagani sababli belgi formatini oldindan aniqlang."
  },
  {
    "type": "solved",
    "content": "**Misol.** «Informatika natijalari» iborasini belgilang → Home → Bold → shrift o‘lchami 16 pt → rangni o‘zgartiring. Agar hujjatda boshqa sarlavhalar bo‘lsa, keyingi bosqichda qo‘lda emas, Heading stili bilan berishni tanlang."
  },
  {
    "type": "heading",
    "content": "3. Abzatsni tekislash"
  },
  {
    "type": "table",
    "content": "| Tekislash | Klavish | Qo‘llanish |\n|---|---|---|\n| Left | Ctrl+L | Oddiy matn |\n| Center | Ctrl+E | Qisqa sarlavha |\n| Right | Ctrl+R | Sana/rekvizit |\n| Justify | Ctrl+J | Hisobotning asosiy abzatsi |"
  },
  {
    "type": "text",
    "content": "Justify so‘zlar orasidagi bo‘shliqlarni o‘zgartirib, matnni ikki chet bo‘ylab tekislaydi. Juda qisqa satrlarda yoki tor ustunlarda bu katta bo‘shliqlar chiqarishi mumkin; natijani tekshiring."
  },
  {
    "type": "trap",
    "content": "Center va Justify bir xil emas. Tekislash ko‘rinishini har bir satrga qo‘shimcha Space bilan hosil qilish noto‘g‘ri yondashuv."
  },
  {
    "type": "heading",
    "content": "4. Chekinish va satr oralig‘i"
  },
  {
    "type": "definition",
    "content": "==Indent== — abzatsning chetdan chekinishi. First Line — faqat birinchi satr; Hanging — birinchi satrdan keyingi satrlar chekinishi. ==Line Spacing== — satrlar oralig‘i; ==Paragraph Spacing== — abzatslardan oldin/keyin masofa."
  },
  {
    "type": "table",
    "content": "| Parametr | Vazifasi | Xatoni aniqlash |\n|---|---|---|\n| First Line | Birinchi satr chekinishi | Har satr oldida Tab qo‘yilmaganmi? |\n| Hanging | Ro‘yxat va bibliografiya | Keyingi satrlar bir tekismi? |\n| Line Spacing | Satr oraliq masofasi | 1.0, 1.15, 1.5 o‘rinlimi? |\n| Before / After | Abzatslar oralig‘i | Bo‘sh Enter ko‘paymaganmi? |"
  },
  {
    "type": "solved",
    "content": "**Misol.** Ilmiy referatning asosiy matniga 1.5 satr oralig‘i va birinchi satrga 1.25 sm chekinish kerak. Matnni belgilang → Paragraph sozlamalariga kiring → First Line va Line Spacing ni belgilang → butun matndagi bir xillikni tekshiring."
  },
  {
    "type": "heading",
    "content": "5. Ro‘yxatlar va darajalar"
  },
  {
    "type": "definition",
    "content": "==Bulleted List== tartib muhim bo‘lmaganda, ==Numbered List== ketma-ket bosqichlarni, ==Multilevel List== bo‘lim va kichik bo‘lim tuzilmasini ifodalash uchun xizmat qiladi."
  },
  {
    "type": "example",
    "content": "Kompyuterni tayyorlash tartibi: 1) qurilmalarni tekshirish; 2) xavfsiz yoqish; 3) dastur ochish. Bu ketma-ketlikni markerli emas, raqamli ro‘yxatda berish mantiqan aniq."
  },
  {
    "type": "trap",
    "content": "Raqamni qo‘lda terish bilan avtomatik raqamlangan ro‘yxat bir xil emas. O‘rtaga yangi band qo‘shilganda avtomatik ro‘yxat qayta raqamlaydi."
  },
  {
    "type": "heading",
    "content": "6. Uslublar (Styles) — strukturaviy format"
  },
  {
    "type": "definition",
    "content": "==Style== takrorlanadigan belgi va abzats parametrlarini nomlangan uslub sifatida boshqaradi. Heading 1, Heading 2 va Normal uslublari oddiy formatni emas, hujjatning mantiqiy tuzilishini ham beradi."
  },
  {
    "type": "table",
    "content": "| Stil | Qayerda ishlatiladi? | Afzallik |\n|---|---|---|\n| Normal | Asosiy matn | Butun hujjatda izchillik |\n| Heading 1 | Bob sarlavhasi | Navigatsiya va mundarija |\n| Heading 2 | Kichik bo‘lim | Ierarxiya |\n| Title | Hujjat nomi | Kirish sahifasi |"
  },
  {
    "type": "solved",
    "content": "**Misol.** 8 ta bobdan iborat qo‘llanmada har bir bob nomiga Heading 1 bering. References → Table of Contents orqali mundarijani yarating. Bob nomi o‘zgarsa, mundarijani yangilang; faqat katta qalin shrift mundarija uchun yetarli bo‘lmasligi mumkin."
  },
  {
    "type": "trap",
    "content": "Mundarijani qo‘lda raqam va nuqtalar bilan terish ortiqcha xatarga olib keladi. Sarlavhalar mantiqiy stili saqlangan hujjatda mundarija avtomatik yangilanadi."
  },
  {
    "type": "heading",
    "content": "7. Format Painter va format tozalash"
  },
  {
    "type": "text",
    "content": "Format Painter bir joydagi mavjud belgi/abzats formatini boshqa tanlangan matnga ko‘chirishga xizmat qiladi. Bu matnning **mazmunini** nusxalash bilan bir xil emas. Clear All Formatting esa qo‘lda berilgan formatlarni olib tashlash uchun qo‘llanadi."
  },
  {
    "type": "solved",
    "content": "**Misol.** Birinchi sarlavha qalin va ko‘k, ikkinchisi oddiy. Birinchi sarlavhani belgilang → Format Painter → ikkinchisini belgilang. Shunga qaramay, ko‘p bobli hujjatda bir xil stilni qo‘llash yanada barqaror."
  },
  {
    "type": "trap",
    "content": "Format Painter ishlatish matnni Clipboard orqali ko‘chirishning o‘rnini bosmaydi. Nusxa ko‘chirish va format nusxalash — alohida amallar."
  },
  {
    "type": "heading",
    "content": "8. Sahifa maketi va bo‘limlar"
  },
  {
    "type": "table",
    "content": "| Buyruq | Odatdagi Ribbon joyi | Vazifasi |\n|---|---|---|\n| Margins | Layout | Sahifa chet masofalari |\n| Orientation | Layout | Portrait/Landscape |\n| Size | Layout | A4 va boshqa qog‘oz |\n| Columns | Layout | Ko‘p ustunli matn |\n| Page Borders | Design | Sahifa chegarasi bezagi |\n| Section Breaks | Layout → Breaks | Turli bo‘lim maketini ajratish |"
  },
  {
    "type": "case",
    "content": "**Vaziyat.** Referatning ko‘p sahifasi Portrait, faqat bitta keng jadval Landscape bo‘lsin. Shu jadval oldi/ketida section break qilib, faqat o‘sha bo‘limning Orientation sozlamasini o‘zgartiring. Oddiy Page Break buning uchun doimo yetarli emas."
  },
  {
    "type": "trap",
    "content": "Design → Page Borders sahifaga bezak chizig‘i qo‘shishi mumkin, lekin qog‘ozning chetlaridagi matn maydonini Layout → Margins boshqaradi. Ikki buyruqni almashtirmang."
  },
  {
    "type": "heading",
    "content": "9. Tabulyatsiya va matn oralig‘i"
  },
  {
    "type": "text",
    "content": "Tab stops tekislash nuqtalarini beradi. Ko‘p Space bilan «ustun» yasash o‘rniga tabulyatsiya yoki haqiqiy jadvaldan foydalaning. Murakkab raqamli ma’lumot uchun jadval qulayroq."
  },
  {
    "type": "example",
    "content": "Rejada «Dars | Sana | Vaqt» qatorlari bir chiziqda turishi kerak. Tab yordamida sodda joylashtirish mumkin; ko‘plab satr va chegaralar kerak bo‘lsa Insert → Table tanlanadi."
  },
  {
    "type": "heading",
    "content": "10. Yakuniy hujjat sifatini tekshirish"
  },
  {
    "type": "table",
    "content": "| Muammo | Sabab | To‘g‘ri tuzatish |\n|---|---|---|\n| Sarlavhalar turlicha | Qo‘lda formatlash | Heading stili |\n| Sahifalar siljiydi | Ko‘p Enter | Page/Section Break |\n| Abzatslar orasida beqaror bo‘shliq | Bo‘sh satrlar | Before/After |\n| Bir joyda g‘ayritabiiy katta oralig‘ | Justify tor satrda | Tekislash/ustun kengligini tekshirish |\n| Ro‘yxat raqami takrorlanadi | Qo‘lda raqamlash | Automatic numbering |"
  },
  {
    "type": "quickcheck",
    "content": "1) Shrift rangi qaysi format darajasiga kiradi? 2) «Heading 2» oddiy 14 pt qalin matndan qanday farq qiladi? 3) Margins bilan Page Bordersni farqlang. 4) Ctrl+J nimani bildiradi? 5) First Line va Hanging Indent farqi?"
  },
  {
    "type": "heading",
    "content": "11. Attestatsiya tipidagi vaziyatlar"
  },
  {
    "type": "exam",
    "content": "Bir betning yo‘nalishini o‘zgartirishda section break; avtomatik mundarija uchun Heading stili; abzats oralig‘ini sozlashda Paragraph Spacing; belgini qalin qilishda Ctrl+B; formatni nusxalashda Format Painter tanlanadi."
  },
  {
    "type": "task",
    "content": "**1.** Uch sarlavhali matn yarating va Heading 1/2 uslublarini qo‘llang, avtomatik mundarija yarating."
  },
  {
    "type": "task",
    "content": "**2.** 250 so‘zli matnni 1.5 interval va First Line 1.25 sm bilan bezang. Sahifa ko‘rinishini tekshiring."
  },
  {
    "type": "task",
    "content": "**3.** Ikki ustunli maketga mos hujjat yarating; oddiy Space bilan ustun yasamang."
  },
  {
    "type": "task",
    "content": "**4.** Birgina keng jadval joylashgan qismni Landscape qilib, qolgan hujjatni Portrait qoldiring."
  },
  {
    "type": "task",
    "content": "**5.** Ro‘yxat o‘rtasiga yangi band qo‘shing va avtomatik raqamlar saqlanishini tekshiring."
  },
  {
    "type": "answers",
    "content": "**Javoblar:** 1) semantik Heading → References mundarija; 2) Paragraph → Line Spacing va Special First Line; 3) Layout → Columns yoki jadval; 4) Section Break → shu bo‘lim Orientation; 5) automatic numbering raqamlarni o‘zi yangilaydi."
  },
  {
    "type": "summary",
    "content": "Word formatlashning asosiy qoidası: belgi, abzats va sahifa darajalarini chalkashtirmang; barcha bo‘limlarda izchil stil, oqilona bo‘shliq va mantiqiy tuzilma yarating. Formatlash hujjat mazmunini tushunishni yengillashtirishi kerak."
  },
  {
    "type": "source",
    "content": "**Manba izi:** Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), 1-bobdagi «Matn bilan ishlash» funksiyalari va restoran menyusi vaziyati, bosma 37–38-betlar; https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view . Cambridge+ 9-sinf — matn bilan ishlash doirasi https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view . Office menyu va klavishlarining ayrimlari versiya/OSga qarab farqlanadi. Ushbu izoh va topshiriqlar qayta bayon; sahifama-sahifa to‘liq ko‘chirma emas."
  }
]
export const M03_03_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Word hujjatiga rasm, jadval, diagramma, SmartArt, WordArt, formula, gipermurojaat, kolontitul, sahifa raqami va izoh obyektlarini maqsadga muvofiq joylashtirish; matn o‘rash, tasvir nisbatini saqlash, ma’lumotni jadvalda tashkil etish va obyektga alternativ matn berish."
  },
  {
    "type": "intro",
    "content": "Rasm yoki jadval qo‘shilgan hujjat faqat ko‘rkam bo‘lishi yetarli emas. Obyekt asosiy fikrga xizmat qilishi, matn oqimini buzmasligi, chop etilganda o‘qilishi va yordamchi texnologiyalar uchun ham tushunarli bo‘lishi kerak."
  },
  {
    "type": "heading",
    "content": "1. Word obyektlari tasnifi"
  },
  {
    "type": "definition",
    "content": "==Obyekt== — hujjat tarkibidagi mustaqil element: rasm, shakl, jadval, diagramma, matematik ifoda, havola yoki media. Obyektlar turli format va joylashtirish qoidalariga ega."
  },
  {
    "type": "table",
    "content": "| Obyekt | Vazifa | Odatdagi menyu |\n|---|---|---|\n| Picture | Vizual tushuntirish | Insert → Pictures |\n| Table | Satr/ustun bo‘yicha tuzilma | Insert → Table |\n| Chart | Sonli ma’lumotni ko‘rsatish | Insert → Chart |\n| SmartArt | Jarayon/munosabat sxemasi | Insert → SmartArt |\n| Equation | Formula | Insert → Equation |\n| Link | Sayt yoki hujjatga o‘tish | Insert → Link |"
  },
  {
    "type": "trap",
    "content": "Rasm ko‘rinishidagi jadval foydalanuvchi tahrirlay oladigan haqiqiy Word jadvali emas. Diagrammani shunchaki bezak sifatida joylashtirish ma’lumotni tushunishni qiyinlashtiradi."
  },
  {
    "type": "heading",
    "content": "2. Rasm kiritish va joylashtirish"
  },
  {
    "type": "text",
    "content": "Rasmni kompyuterdan yoki mos manbadan Insert → Pictures orqali tanlash mumkin. Keyin o‘lcham, matn bilan o‘ralish, kesish (Crop), joylashuv va tasvirni alternativ matn bilan ta’riflash boshqariladi."
  },
  {
    "type": "table",
    "content": "| Text Wrapping | Natija | Xatar |\n|---|---|---|\n| In Line with Text | Matndagi katta belgi kabi | Abzats qatori balandlashishi |\n| Square | To‘rtburchak chegarasida o‘raladi | Tor joyda matn tiqilishi |\n| Tight | Rasm konturiga yaqinroq | Murakkab konturda tushunarsiz oqim |\n| Top and Bottom | Rasm ustida/pastida matn | Bo‘sh joy ko‘payishi |\n| Behind Text | Rasm fon ortida | Matn o‘qilmasligi |\n| In Front of Text | Rasm matnni qoplashi mumkin | Muhim so‘z yashirinishi |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** Hisobotning chap tomonida 4×3 sm rasm, o‘ngida izoh bo‘lsin. Rasmni joylang → nisbat saqlanishini tekshiring → Square wrapping → mos joyga olib boring → Print Preview orqali matn qoplanmaganini tasdiqlang."
  },
  {
    "type": "trap",
    "content": "Rasmni cho‘zib kattalashtirish asl piksel aniqligini oshirmaydi. Burchak tutqichlari orqali nisbatni saqlab o‘lchamlang; ko‘rinish xiralashsa yuqoriroq sifatli rasm kerak bo‘ladi."
  },
  {
    "type": "heading",
    "content": "3. Crop, joylashuv va alternativ matn"
  },
  {
    "type": "definition",
    "content": "==Crop== tasvirning ko‘rinadigan chegarasini qisqartiradi. ==Alternative text (Alt Text)== tasvirning mazmunini ko‘rish imkoniyati cheklangan o‘quvchiga tushuntirishga yordam beradi."
  },
  {
    "type": "example",
    "content": "Blok-sxema rasmi uchun «diagramma» deb yozish yetarli emas; mazmunli alt matnda kirish ma’lumoti, shart, «ha/yo‘q» yo‘li va yakuniy natijani qisqa izohlang."
  },
  {
    "type": "trap",
    "content": "Dekorativ rasm bilan axborot tashuvchi rasm bir xil emas. Jadval yoki formula skrinshotini ko‘rish qiyin bo‘lsa, uni haqiqiy matn/obyekt sifatida qayta yaratish maqsadga muvofiq."
  },
  {
    "type": "heading",
    "content": "4. Haqiqiy jadval tuzilishi"
  },
  {
    "type": "definition",
    "content": "==Table== satrlar (Rows), ustunlar (Columns) va kataklar (Cells) yordamida ma’lumotni tartibli joylaydi. Birinchi qator ko‘pincha sarlavha sifatida ishlatiladi; jadvaldan faqat sahifani bezash uchun foydalanish tavsiya etilmaydi."
  },
  {
    "type": "table",
    "content": "| Amal | Natija | Tekshiruv |\n|---|---|---|\n| Insert Table | Belgilangan ustun/satrlar | Sarlavha qatormi? |\n| Merge Cells | Bir nechta katak bitta bo‘ladi | Ma’no yo‘qolmadimi? |\n| Split Cells | Katak bo‘linadi | Jadval tartibi saqlandimi? |\n| Insert/Delete Row | Yangi/qisqargan satr | Ma’lumot mos qoldimi? |\n| Distribute Columns | Enlar tartiblanadi | Matn kesilmadimi? |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** «Fan | O‘qituvchi | Xona» jadvalini 4 satr va 3 ustunda yarating. Birinchi qatorni sarlavha qiling, boshqa qatorlarga qiymatlar kiriting, jadvalni o‘qishga mos enlar bilan sozlang."
  },
  {
    "type": "trap",
    "content": "Table → Merge Cells bilan Word hujjatlarini qo‘shish boshqa narsa. Bu buyruq faqat jadval ichidagi tanlangan kataklarni birlashtiradi."
  },
  {
    "type": "heading",
    "content": "5. Jadval sarlavhasi va uzoq jadval"
  },
  {
    "type": "text",
    "content": "Bir necha sahifaga cho‘zilgan jadvalda sarlavha satrini keyingi sahifalarda takrorlash foydali. Jadval va rasmning nomi (caption) matnda shu obyektga murojaat qilish uchun ishlatiladi."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** 60 o‘quvchilik natija jadvali uch sahifaga yoyildi. Ikkinchi sahifada ustun nomlari ko‘rinmasa, qiymatlarni noto‘g‘ri talqin qilish oson. Repeat Header Rows imkoniyatini ishlating."
  },
  {
    "type": "heading",
    "content": "6. Diagramma va Chart"
  },
  {
    "type": "definition",
    "content": "==Chart== sonli ma’lumotni ustun, chiziq, doira va boshqa ko‘rinishda taqdim etuvchi obyekt. Diagramma turi **savolga** mos bo‘lishi kerak: taqqoslash, vaqt bo‘yicha o‘zgarish yoki butunning tarkibi."
  },
  {
    "type": "table",
    "content": "| Diagramma | Qulay vaziyat | Cheklov |\n|---|---|---|\n| Ustunli | Sinflar bo‘yicha o‘rtacha ball | O‘qlar to‘g‘ri bo‘lsin |\n| Chiziqli | Oylar bo‘yicha o‘sish | Vaqt oralig‘i bir xilmi? |\n| Doiraviy | 100% tarkib | Mustaqil toifalar, kam bo‘lak |\n| Nuqtali | Ikki sonli o‘zgaruvchi | Korellyatsiya sababiyat emas |"
  },
  {
    "type": "solved",
    "content": "**Misol.** 7-, 8- va 9-sinf o‘rtacha ko‘rsatkichlarini taqqoslang. Insert → Chart → Column; kategoriyalar va qiymatlarni to‘ldiring; sarlavha, o‘qlar va birlikni kiriting. O‘zgargan qiymat diagrammada yangilanishini tekshiring."
  },
  {
    "type": "heading",
    "content": "7. SmartArt, WordArt va Shapes"
  },
  {
    "type": "text",
    "content": "SmartArt jarayon yoki ierarxiyani, Shapes esa erkin chiziladigan sxema elementlarini ifodalaydi. WordArt matnga dekorativ effekt beradi, lekin uzun asosiy matnni WordArtga aylantirish o‘qilishni qiyinlashtiradi."
  },
  {
    "type": "table",
    "content": "| Maqsad | Mos obyekt |\n|---|---|\n| «Kiritish → ishlov → chiqarish» jarayoni | SmartArt Process |\n| Tarmoqlangan qaror | Shapes/Flowchart |\n| Loyihaning bo‘limlar ierarxiyasi | SmartArt Hierarchy |\n| Taqdimotning dekorativ sarlavhasi | WordArt |"
  },
  {
    "type": "trap",
    "content": "SmartArtning chiroyli ko‘rinishi mantiqni isbotlamaydi. Qaror sharti ikki yo‘l bilan ifodalansa, mos Flowchart shakli va belgilar talab qilinadi."
  },
  {
    "type": "heading",
    "content": "8. Matematik formula va maxsus belgilar"
  },
  {
    "type": "definition",
    "content": "==Equation== matematik ifodani maxsus tuzilma sifatida kiritadi. ==Symbol== matnda oddiy klaviaturada topilmaydigan belgilarni qo‘shishga yordam beradi."
  },
  {
    "type": "example",
    "content": "Kasr xato joylashsa, oddiy '/' belgisiga ko‘p bo‘shliq qo‘shish o‘rniga Equation ichidagi Fraction tuzilmasidan foydalanish mumkin. Formula skrinshoti qidiriladigan va tahrirlanadigan haqiqiy formula emas."
  },
  {
    "type": "heading",
    "content": "9. Giperhavola va ichki murojaat"
  },
  {
    "type": "text",
    "content": "Hyperlink orqali veb-sayt, email manzili yoki hujjatning belgilangan joyiga o‘tish mumkin. Havola matni «shu yer» emas, manzil vazifasini ifodalovchi nom bo‘lsa, hujjat qulayroq."
  },
  {
    "type": "solved",
    "content": "**Misol.** Darslikning 3-bobiga havola qo‘shmoqchisiz: avval mos sarlavha yoki bookmarkni belgilang, Insert → Link orqali ichki joyni tanlang. PDF chiqarilganda havola ishlashini sinang."
  },
  {
    "type": "trap",
    "content": "Matn ko‘k va tagiga chizilgan bo‘lishi uning amaldagi Hyperlink ekanini kafolatlamaydi. Link manzilini va ochilishini tekshirish zarur."
  },
  {
    "type": "heading",
    "content": "10. Kolontitul, sahifa raqami va Footnote"
  },
  {
    "type": "table",
    "content": "| Obyekt | Joyi | Vazifasi |\n|---|---|---|\n| Header | Sahifaning yuqori qismi | Hujjat nomi |\n| Footer | Sahifaning quyi qismi | Muallif/tashkilot |\n| Page Number | Yuqori/pastki qism | Sahifalar ketma-ketligi |\n| Footnote | Sahifa pastida | Mahalliy izoh/manba |\n| Endnote | Hujjat/bob oxiri | Yakuniy izohlar |"
  },
  {
    "type": "example",
    "content": "Yigirma sahifali hisobotda «Informatika kafedrasi» footeriga va avtomatik sahifa raqamiga ega bo‘lish izchil hujjat beradi; har bir sahifaga raqamni qo‘lda yozmang."
  },
  {
    "type": "heading",
    "content": "11. Caption va Cross-reference"
  },
  {
    "type": "text",
    "content": "Hujjatda «3-rasm» yoki «2-jadval» kabi nomlarni Caption orqali berish mumkin. Cross-reference tegishli obyektga yoki bo‘limga ichki murojaatni yangilanadigan tarzda qo‘shishga yordam beradi."
  },
  {
    "type": "solved",
    "content": "**Misol.** «1-rasm. Kompyuter tizimi» caption yarating. Matndagi «1-rasmga qarang» iborasini Cross-reference orqali bog‘lang. Oraga yangi rasm qo‘shilganda maydonlarni yangilash kerakligini tekshiring."
  },
  {
    "type": "heading",
    "content": "12. Obyektlar bilan ishlashdagi xavfsizlik"
  },
  {
    "type": "text",
    "content": "Hujjatga qo‘shilgan rasmning mualliflik huquqini, iqtibos manbasini va shaxsiy ma’lumot bor-yo‘qligini tekshiring. Faylni ulashishdan oldin yashirin sharh, o‘zgarishlar tarixi va shaxsni aniqlovchi metama’lumotni ko‘zdan kechirish kerak."
  },
  {
    "type": "trap",
    "content": "Internetdan rasm topilgani uning avtomatik ravishda erkin foydalanishga berilganini anglatmaydi. Manba va foydalanish ruxsatini alohida tekshiring."
  },
  {
    "type": "heading",
    "content": "13. Amaliy va attestatsiya topshiriqlari"
  },
  {
    "type": "exam",
    "content": "Rasm o‘ralishi → Text Wrapping; jadval kataklarini birlashtirish → Merge Cells; sahifa raqami → Page Number; matematik ifoda → Equation; tasvir tavsifi → Alt Text; raqamli diagramma → Chart."
  },
  {
    "type": "task",
    "content": "**1.** 3×4 o‘quvchilar jadvali yarating, sarlavha qatori takrorlansin."
  },
  {
    "type": "task",
    "content": "**2.** Algoritm haqida rasm joylang; nisbatini saqlang, Square wrapping o‘rnating va mazmunli Alt Text yozing."
  },
  {
    "type": "task",
    "content": "**3.** Jadvalga asoslangan ustunli diagramma qo‘shib, «X o‘qi nima?» savoliga javob yozing."
  },
  {
    "type": "task",
    "content": "**4.** «Rasm 1» caption va unga Cross-reference yarating, so‘ng oldiga yangi rasm qo‘shib maydonlarni yangilang."
  },
  {
    "type": "task",
    "content": "**5.** Hisobotda header/footer va avtomatik sahifa raqami ishlating; birinchi sahifani boshqa uslubda qilish zarurmi, asoslang."
  },
  {
    "type": "answers",
    "content": "**Javob yo‘nalishlari:** 1) Insert Table va takror sarlavha; 2) Picture Format → Wrap Text, Alt Text, nisbat; 3) Chart/Column, to‘g‘ri kategoriya yorlig‘i; 4) References → Insert Caption va Cross-reference, fields update; 5) Insert → Header/Footer/Page Number va Different First Page zaruratini tekshirish."
  },
  {
    "type": "summary",
    "content": "Word obyektlarini sifatli ishlatishning asosi — **ma’lumot vazifasi**ga mos obyektni tanlash, hujjatning mantiqiy o‘qilishi va tahrir imkoniyatini saqlash, imkon qadar muqobil matn va manba izini taqdim etish."
  },
  {
    "type": "source",
    "content": "**Manba izi:** Cambridge+ 10–11-sinf, 1-bob, matn bilan ishlash dasturidagi jadvallar, sarlavhalar, kolontitullar, izohlar, bo‘limlar va tasvir ramkalari haqidagi tushuntirishlar, 37–38-betlar, https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view ; Cambridge+ 9-sinf «Matnli hujjatlar» bo‘limi https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view . Amaliy vaziyatlar original, dastur versiyasiga qarab Ribbon nomlari farqlanadi. Sahifama-sahifa to‘liq nusxa emas."
  }
]
