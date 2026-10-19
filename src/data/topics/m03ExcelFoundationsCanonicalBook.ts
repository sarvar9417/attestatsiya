/**
 * TASK-287: M03.04 original, source-guided Excel foundations full book.
 * Uses independently written pedagogical explanations and source references;
 * preserves exam questions through getTopicContent integration.
 */
import type { TheoryBlock } from '../topicContent'

export const M03_04_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Elektron jadvalning vazifasini va qaysi masalalarda foydali ekanini izohlash; Workbook, Worksheet, Column, Row, Cell, Range tushunchalarini farqlash; katak manzillari, qiymat turlari, formula satri, nusxalash, formatlash, tartiblash, filtr va diagramma bilan ishlash; ma’lumotning aniqligi hamda model cheklovlarini tekshirish."
  },
  {
    "type": "intro",
    "content": "Elektron jadval – faqat son yoziladigan kataklar to‘plami emas. U xarajatni rejalash, jadvalni qayta hisoblash, ma’lumotni tozalash, solishtirish va qaror qabul qilishga tayanch bo‘ladi. Bir marta to‘g‘ri tuzilgan hisoblash modeli ma’lumot o‘zgarganda natijani yangilashi mumkin."
  },
  {
    "type": "heading",
    "content": "1. Elektron jadval qachon kerak?"
  },
  {
    "type": "definition",
    "content": "==Elektron jadval== — katakli tuzilma asosida ma’lumotni saqlash, hisoblash va tahlil qilish dasturi. Excel, LibreOffice Calc yoki boshqa dasturlar shu turga kiradi. Microsoft Excel keng tarqalgan misol, ammo tushunchalarni birgina brend bilan cheklamang."
  },
  {
    "type": "table",
    "content": "| Vaziyat | Elektron jadvalning foydasi | Cheklov |\n|---|---|---|\n| Sinf xarajatlari | Yig‘indi va foizni avtomatik hisoblash | Kirishdagi xato natijani buzadi |\n| Baholar tahlili | Saralash, o‘rtacha va trend | Ballni noto‘g‘ri talqin qilish mumkin |\n| Kichik inventar | Miqdor, narx, qiymatni ko‘rish | Katta ko‘p foydalanuvchili tizimda baza yaxshiroq |\n| Tadbir rejasi | Sana, mas’ul, holat filtri | Reja hamisha qo‘lda yangilanadi |\n| Tajriba natijasi | Ustunli/chiziqli diagramma | Grafik sababiyatni avtomatik isbotlamaydi |"
  },
  {
    "type": "example",
    "content": "Maktab tadbiri uchun 12 ta xarajat mavjud. Har birini kalkulyatorda qayta-qayta hisoblash o‘rniga «Nomi», «Miqdor», «Birlik narxi» va «Jami» ustunlarini tuzing. Narx yangilansa, tegishli formulali jami qayta hisoblanadi."
  },
  {
    "type": "trap",
    "content": "Excel – matn protsessori yoki ma’lumotlar bazasini boshqarish tizimining to‘liq o‘rnini bosmaydi. Kichik jadval qulay bo‘lsa ham, murakkab ko‘p foydalanuvchili aloqador ma’lumotlar bazasi uchun maxsus tizim talab qilinishi mumkin."
  },
  {
    "type": "heading",
    "content": "2. Workbook va Worksheet: fayl bilan varaq farqi"
  },
  {
    "type": "definition",
    "content": "==Workbook== — Excel ish kitobi (odatda .xlsx fayl); u bir nechta ==Worksheet== — ish varag‘ini saqlashi mumkin. Varaq – satrlar va ustunlardan tuzilgan jadval; uning nomi pastki yorliqda ko‘rinadi."
  },
  {
    "type": "table",
    "content": "| Element | Vazifa | Misol |\n|---|---|---|\n| Workbook | Butun fayl | tadbir_byudjeti.xlsx |\n| Worksheet | Fayl ichidagi varaq | Yanvar, Fevral |\n| Column | Vertikal ustun | A, B, C … XFD |\n| Row | Gorizontal qator | 1, 2, 3 … 1048576 |\n| Cell | Ustun-qator kesishgan joy | C5 |\n| Range | Kataklar to‘plami | B2:D8 |\n| Active Cell | Ayni tanlangan katak | Belgilangan katak atrofidagi ramka |"
  },
  {
    "type": "text",
    "content": "Zamonaviy Excel .xlsx ish varag‘ida **16 384 ustun (A–XFD)** va **1 048 576 qator** mavjud. Eski formatlar va boshqa jadval dasturlarida bu chegaralar farq qilishi mumkin. Workbook bir nechta varaqqa ega bo‘lsa, ularning nomi vazifani ifodalashi maqsadga muvofiq."
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** Yillik to‘garak byudjeti uchun bitta «Togarak_2026.xlsx» ish kitobi yarating, «Sentabr», «Oktabr» va «Xulosa» varaqlarini qo‘shing. «Xulosa»ni «Sentabr»ning o‘zi deb qabul qilmang: ular aynan bir workbook ichidagi alohida worksheetlardir."
  },
  {
    "type": "heading",
    "content": "3. Interfeysning foydali elementlari"
  },
  {
    "type": "table",
    "content": "| Element | Nima ko‘rsatadi? | Foydalanish |\n|---|---|---|\n| Ribbon | Home, Insert, Data, Formulas buyruqlari | Formatlash, diagramma, filtr |\n| Name Box | Tanlangan katak manzili yoki nomi | A100 kabi joyga o‘tish |\n| Formula Bar | Katakning haqiqiy kiritilgan qiymati/formulasi | =A2*B2 ni tekshirish |\n| Sheet Tabs | Varaqlar ro‘yxati | Oylar orasida o‘tish |\n| Status Bar | Tanlangan sonlar uchun statistik ma’lumot | Sum, Average kabi tezkor tekshiruv |\n| Fill Handle | Tanlangan katakning kichik tutqichi | Ketma-ketlik va formulani ko‘chirish |"
  },
  {
    "type": "example",
    "content": "B2 katakda 3400 soni ko‘rinmoqda, lekin Formula Bar’da `=C2*D2` yozilgan. Demak, 3400 kiritilgan doimiy son emas — hisoblangan natija. Formulani tahrirlashdan oldin C2 va D2 ga e’tibor bering."
  },
  {
    "type": "trap",
    "content": "Name Box va Formula Bar bir xil emas. Birinchisi tanlangan katakning **manzilini**, ikkinchisi uning **tarkibini** ko‘rsatadi."
  },
  {
    "type": "heading",
    "content": "4. Katak manzili va diapazonni o‘qish"
  },
  {
    "type": "definition",
    "content": "==Cell Reference== ustun harfi va qator raqamidan tashkil topadi: **C5** – C ustunining 5-qatori. ==Range== diapazonning yuqori chap va quyi o‘ng manzili bilan belgilanadi: **A2:C6**. Ikki nuqta diapazon chegaralarini bildiradi."
  },
  {
    "type": "table",
    "content": "| Yozuv | Mazmuni | Hisoblashdagi roli |\n|---|---|---|\n| A1 | A ustuni, 1-qator | Bitta katak |\n| C5 | C ustuni, 5-qator | Bitta katak |\n| A2:C6 | A–C ustunlar, 2–6-qatorlar | 15 ta katak |\n| B:B | B ustunidagi barcha kataklar | Butun ustun |\n| 2:2 | 2-qatordagi kataklar | Butun qator |\n| Sheet2!B4 | Ikkinchi varaqning B4 katagi | Varaqlararo havola |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** «B3:D5» ichida ustunlar B, C, D – 3 ta; qatorlar 3, 4, 5 – 3 ta. Demak, kesishmalar soni 3×3=9. Diapazon yozilganda ikki chegaraning ikkalasi ham kiritiladi."
  },
  {
    "type": "trap",
    "content": "«C5»ni «5-ustun, C-qator» deb o‘qimang: harflar ustunni, sonlar qatorni bildiradi. A2:C6 diapazoni faqat A2 va C6 kataklaridan iborat emas."
  },
  {
    "type": "heading",
    "content": "5. Ma’lumot turlari va katakning haqiqiy qiymati"
  },
  {
    "type": "definition",
    "content": "Katakka **matn**, **son**, **sana/vaqt**, **mantiqiy qiymat** yoki **formula** kiritilishi mumkin. Sana ko‘pincha maxsus sonli qiymat sifatida saqlanib, sanaga mos formatda ko‘rsatiladi. Katakning ko‘rinishi bilan uning hisoblashdagi turi farqlanishi mumkin."
  },
  {
    "type": "table",
    "content": "| Kiritish | Odatdagi talqin | Ehtiyotkorlik |\n|---|---|---|\n| 120 | Son | Hisoblash mumkin |\n| 12% | Sonli foiz | Ichki qiymat odatda 0,12 |\n| 01.09.2026 | Sana (sozlamaga bog‘liq) | Lokal formatni tekshirish |\n| 00125 | Identifikator yoki son | Oldingi nollar yo‘qolishi mumkin |\n| =A2+B2 | Formula | Natijaga bog‘liq |\n| '00125 | Matn sifatida kiritish | Identifikator saqlanadi |"
  },
  {
    "type": "case",
    "content": "**Vaziyat.** O‘quvchining shaxsiy kodi «000783» bilan boshlanadi. Uni oddiy son deb kiritish dasturda «783»ga aylanishi mumkin. Kod hisoblash uchun son emas, identifikator bo‘lsa, matn sifatida saqlash mantiqan to‘g‘ri."
  },
  {
    "type": "heading",
    "content": "6. Formula va funksiya bilan birinchi tanishuv"
  },
  {
    "type": "definition",
    "content": "==Formula== odatda `=` belgisi bilan boshlanadigan hisoblash ifodasi. ==Funksiya== dasturdagi nomlangan tayyor hisoblash vositasi, masalan SUM, AVERAGE yoki COUNT. Funksiyalar keyingi bobda chuqur o‘rganiladi; bu yerda kataklar bilan asosiy mantiq muhim."
  },
  {
    "type": "table",
    "content": "| Formula | Mazmuni | Eslatma |\n|---|---|---|\n| =A2+B2 | Ikki qiymat yig‘indisi | Qiymat o‘zgarsa natija ham o‘zgaradi |\n| =B2*C2 | Narx × miqdor | `*` – ko‘paytirish belgisi |\n| =SUM(D2:D6) | D2–D6 yig‘indisi | Diapazon chegaralari kiritilgan |\n| =AVERAGE(B2:B8) | O‘rtacha arifmetik | Bo‘sh va matn qiymatlari alohida talqin qilinadi |\n| =A1/$C$1 | Belgilangan katak bilan hisoblash | Mutlaq manzil ko‘chirishda saqlanadi |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** B2=4 dona, C2=7500 so‘m bo‘lsa, D2 ga `=B2*C2` yozing. D2=30000 bo‘ladi. B2 ni 6 ga o‘zgartirsangiz, formula o‘zgarishsiz turib natija 45000 ga yangilanadi. Bu — elektron jadvalning asosiy afzalligi."
  },
  {
    "type": "trap",
    "content": "`SUM` va `COUNT` boshqa-boshqa amal: biri qiymatlar yig‘indisini, ikkinchisi son sifatida kiritilgan kataklar sonini hisoblaydi. `=A2+B2` dagi ikki katak birikib matn bo‘lishi shart emas."
  },
  {
    "type": "heading",
    "content": "7. Nisbiy, mutlaq va aralash havolalar"
  },
  {
    "type": "definition",
    "content": "==Nisbiy havola== A1 kabi — formula boshqa joyga ko‘chirilsa mos ravishda o‘zgaradi. ==Mutlaq havola== `$A$1` — ustun ham, qator ham mahkamlanadi. ==Aralash havola== `$A1` yoki `A$1` — faqat ustun yoki qator mahkamlanadi."
  },
  {
    "type": "table",
    "content": "| Havola | Ustun | Qator |\n|---|---|---|\n| A1 | Nisbiy | Nisbiy |\n| $A$1 | Mutlaq | Mutlaq |\n| $A1 | Mutlaq | Nisbiy |\n| A$1 | Nisbiy | Mutlaq |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** B2 dagi miqdorni yagona D1 narx bilan ko‘paytirmoqchisiz: `=B2*$D$1`. Formulani C3 ga bir qator pastga ko‘chirishga emas, odatda shu ustundagi keyingi natija katagiga tushirsangiz, B2 nisbiy o‘zgaradi, D1 o‘zgarmaydi. F4 (Windows Excel, mos tahrir rejimida) turini almashtirishga yordam beradi."
  },
  {
    "type": "trap",
    "content": "Katakni faqat **ko‘chirish** bilan formula **nusxalab boshqa joyga joylash** ayrim hollarda farqli natija beradi. Mutlaq havola ma’lumotning o‘zini emas, formula manzilining ko‘chishdagi xatti-harakatini belgilaydi."
  },
  {
    "type": "heading",
    "content": "8. Avtoto‘ldirish va format"
  },
  {
    "type": "text",
    "content": "**Fill Handle** yordamida ketma-ket son, sana yoki formulani mos qatorlarga yoyish mumkin. **Number Format** esa sonni foiz, valyuta, sana yoki oddiy son shaklida ko‘rsatadi; formatlash ko‘pincha ichki qiymatni o‘zgartirmaydi."
  },
  {
    "type": "table",
    "content": "| Amal | Natija | Tekshirish |\n|---|---|---|\n| Drag Fill Handle | Takror yoki ketma-ketlik | Kutilgan qadammi? |\n| AutoFit Column Width | Ustun enini moslash | #### belgisi yo‘qmi? |\n| Number Format → Percentage | Sonni foiz ko‘rinishda berish | 0,15 → 15% |\n| Currency / Accounting | Pul ko‘rinishi | Valyuta birligi to‘g‘rimi? |\n| Merge & Center | Tanlangan kataklarni birlashtiradi | Ma’lumot yo‘qolmayaptimi? |"
  },
  {
    "type": "case",
    "content": "**Vaziyat.** 01.01, 02.01, 03.01 ketma-ketlik uchun Fill Handle ishlatildi, ammo dastur bir xil qiymatni ko‘paytirdi. Ketma-ketlik turini va mahalliy sana formatini qayta tekshiring."
  },
  {
    "type": "heading",
    "content": "9. Saralash, filtrlash va tekshirish"
  },
  {
    "type": "definition",
    "content": "==Sort== ma’lumot qatorlarini tanlangan mezon bo‘yicha qayta tartiblaydi. ==Filter== ma’lum shartga mos kelmagan qatorlarni vaqtincha yashiradi, ma’lumotni avtomatik o‘chirmaydi. ==Validation== kiritilayotgan qiymatni qoidaga soladi; ==Verification== kiritilgan ma’lumotni asl manba bilan solishtirishdir."
  },
  {
    "type": "table",
    "content": "| Vazifa | To‘g‘ri amal | Xavf |\n|---|---|---|\n| Baholarni kattadan kichikka | Sort descending | Barcha bog‘langan ustunlar bilan saralash |\n| Faqat «7-A» sinfini ko‘rish | Filter | Yashirin qatorni o‘chirilgan deb o‘ylash |\n| 0–100 oralig‘ini talab qilish | Data Validation | Cheklov xatosiz yozilganmi? |\n| Jurnal bilan natijani solishtirish | Verify | Asl manbani tekshirish |\n| Takror kodlarni aniqlash | Remove Duplicates / conditional check | Bir xil kod haqiqatan ortiqchami? |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** A ustunda ism, B ustunda sinf, C ustunda ball berilgan. Jadvalni faqat C ustunini ajratib saralamang, aks holda ball ismdan ajralishi mumkin. Sarlavha bilan butun jadvalni belgilang → Data → Sort → ball bo‘yicha tanlang, moslikni tekshiring."
  },
  {
    "type": "trap",
    "content": "Sort ma’lumot qatorlarining tartibini o‘zgartiradi, Filter esa faqat ko‘rinadigan satrlarni cheklaydi. «Filtr natijasida ko‘rinmayapti» degani «fayldan o‘chirildi» degani emas."
  },
  {
    "type": "heading",
    "content": "10. Jadvaldan diagrammaga o‘tish"
  },
  {
    "type": "text",
    "content": "Ustunli diagramma kategoriyalar miqdorini taqqoslashga, chiziqli diagramma vaqt bo‘yicha o‘zgarishga, doiraviy diagramma butunning tarkibiga mos kelishi mumkin. Kategoriya nomlarini ham tanlang; o‘q belgilarini, birliklar va sarlavhani tekshiring."
  },
  {
    "type": "example",
    "content": "Uch oyda 18, 22 va 25 ta kitob o‘qilgan bo‘lsa, chiziqli diagramma o‘sish yo‘nalishini ko‘rsatadi. Ammo uchta kuzatuv natijasidan «bundan keyin har oy albatta oshadi» deyish mumkin emas."
  },
  {
    "type": "trap",
    "content": "Grafikda o‘q noldan boshlanmagan bo‘lsa, kichik farq juda katta ko‘rinishi mumkin. Grafikni doim jadvaldagi asl raqamlar bilan solishtiring."
  },
  {
    "type": "heading",
    "content": "11. Ish kitobini saqlash, ulashish va xavfsizlik"
  },
  {
    "type": "text",
    "content": "Ish kitobini aniq nom bilan .xlsx formatda saqlang. CSV kabi oddiy matn formatiga eksport qilinganda formulalar, bir nechta varaqlar va formatlashning katta qismi yo‘qolishi mumkin. Ulashishdan oldin yashirin varaqlar, izohlar, shaxsiy ma’lumotlar va kirish ruxsatlarini tekshiring."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** Sinfning shaxsiy natijalarini hamma kiradigan faylga joylash noto‘g‘ri. Ta’lim maqsadi uchun umumlashtirilgan/shaxsi aniqlanmaydigan umumlashtirilgan ma’lumotdan foydalanib, asl faylga kirishni cheklash kerak."
  },
  {
    "type": "heading",
    "content": "12. Amaliy topshiriqlar va mustaqil tekshiruv"
  },
  {
    "type": "task",
    "content": "**1. Boshlang‘ich.** Yangi ish kitobini «tadbir.xlsx» deb saqlang; «Reja» va «Xarajat» varaqlarini yarating. B2, C5, D7 kataklarini Name Box orqali toping."
  },
  {
    "type": "task",
    "content": "**2. Diapazon.** A2:C6 va D4:F8 diapazonlari nechta katakdan iborat? Ustun va qator chegaralarini alohida hisoblang."
  },
  {
    "type": "task",
    "content": "**3. Hisoblash.** B2=5, C2=2400 bo‘lganda D2 ga formula yozing. Miqdor 8 bo‘lganda natija qanday o‘zgaradi?"
  },
  {
    "type": "task",
    "content": "**4. Mutlaq havola.** Narxlar B2:B5 da, soliq yoki umumiy koeffitsiyent E1 da. Formulani ko‘chirganda koeffitsiyent o‘zgarmasligi uchun manzilni yozing."
  },
  {
    "type": "task",
    "content": "**5. Ma’lumot sifati.** Bir qator faqat bir ustun bo‘yicha sort qilingani uchun o‘quvchi ballari almashib ketdi. Nima sabab? Tuzatish yo‘lini yozing."
  },
  {
    "type": "task",
    "content": "**6. Tahlil.** Uch oy xarajatini jadvalga kiritib mos grafikni tanlang. Grafikdagi trenddan qanday xulosa chiqarish mumkin va mumkin emas?"
  },
  {
    "type": "answers",
    "content": "**Izohli javoblar.** 1) Workbook va ikki worksheet; nom qutisi faol manzilni ko‘rsatadi. 2) Ikkalasi ham 3×5=15 katak. 3) `=B2*C2`: 12000, so‘ng 19200. 4) E1 uchun `$E$1`; nisbiy narx manzili ko‘chadi. 5) Butun bog‘langan jadvalni yagona qator yozuvlari bilan saralash kerak. 6) Chiziqli grafik vaqt trendini ko‘rsatadi, ammo kelajakni kafolatlamaydi."
  },
  {
    "type": "summary",
    "content": "Elektron jadvalning tayanch modeli: ish kitobi → varaq → ustun va qator → katak → diapazon → qiymat/formula → qayta hisoblash → tekshiruv. Darsning keyingi Excel formulalari bo‘limida funksiyalar chuqurroq ko‘riladi; bu bobdan keyin kataklar va manzillar aniq farqlanishi kerak."
  },
  {
    "type": "source",
    "content": "**Manba izi:** Cambridge+ «Informatika va axborot texnologiyalari», 10–11-sinf (2021), 8-bob «Elektron jadvallar» (bosma 103-betdan), ayniqsa «8.01 Elektron jadval yaratish», katak, diapazon, funksiya, validation/verification, import/eksport tushunchalari — https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view ; Cambridge+ 7-sinf elektron jadval va diagrammalar amaliyoti — https://drive.google.com/file/d/1RhIRuHi8i7i18mkrd3eQQt2lJrbnfCkS/view . Mazmun mustaqil pedagogik qayta bayon bo‘lib, sahifama-sahifa to‘liq ko‘chirma emas; darslik rasmlari va ko‘rinishi alohida vizual tekshiruvni talab qiladi."
  }
]
