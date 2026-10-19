/** TASK-273 — source-grounded original Office theory additions for M03.
 * Cambridge+ grade 9/10–11 study chapters, not full page-level verification.
 */
import type { TheoryBlock } from '../topicContent'

export const M03_OFFICE_TEXTBOOK_ADDITIONS: Record<string, TheoryBlock[]> = {
  "M03.01": [
    { type: "heading", content: "Word hujjatining tuzilishi va ishlash jarayoni" },
    { type: "table", content: "| Element | Asosiy vazifasi | Amaliy tekshiruv |\n|---|---|---|\n| Hujjat | Matn, obyekt va bo‘limlardan tashkil topadi | Saqlangan fayl qayta ochiladimi? |\n| Abzas | Mustaqil matn bloki | Yangi abzats haqiqatan yaratilganmi? |\n| Bo‘lim (section) | Sahifa parametrlari o‘zgarishi mumkin bo‘lgan qism | Sarlavhali sahifa alohida formatlandimi? |\n| Stil (style) | Bir xil formatni qayta qo‘llash | Sarlavhalar izchilmi? |\n| Izoh va o‘zgarishni kuzatish | Hamkorlikda tahrirlash | Muallif tuzatishni ko‘ra oladimi? |" },
    { type: "example", content: "Hujjatda ikki bo‘limning sahifa yo‘nalishi turlicha bo‘lishi kerak bo‘lsa, oddiy sahifa uzilishi yetarli bo‘lmasligi mumkin. Bo‘lim ajratib, faqat zarur qismdagi sahifa sozlamasini o‘zgartiring." },
    { type: "trap", content: "**Save** amaldagi faylni saqlaydi, **Save As** boshqa nom yoki joyda nusxa yaratishga imkon beradi. **Enter** yangi abzas, **Shift+Enter** esa yumshoq satr uzilishini hosil qilishi mumkin — bu tushunchalar bir xil emas." },
    { type: "source", content: "Manba doirasi: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), matnli hujjatlar bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Foydalanuvchi amallarining aniq menyu nomlari dastur nashriga qarab farqlanishi mumkin; misollar qayta bayon." },
  ],
  "M03.02": [
    { type: "heading", content: "Matn formatlash darajalari" },
    { type: "table", content: "| Daraja | Sozlama namunasi | Qaysi obyektga ta’sir qiladi? |\n|---|---|---|\n| Belgi | Shrift, rang, qalinlik | Ajratilgan belgilar |\n| Abzas | Tekislash, interval, chekinish | Abzas tuzilishi |\n| Sahifa | Maydon, yo‘nalish, o‘lcham | Sahifa yoki bo‘lim |\n| Stil | Bir nechta format birikmasi | Stil qo‘llangan matn |\n| Ro‘yxat | Marker va daraja | Ro‘yxat bandlari |" },
    { type: "example", content: "Bir nechta bo‘limda bir xil sarlavha formatini qo‘lda takrorlash o‘rniga Heading stili orqali yozing. Keyin avtomatik mundarija yaratish va sarlavha uslubini birgalikda yangilash osonlashadi." },
    { type: "trap", content: "**Justify** satrlarni ikki chet bo‘yicha tekislashga urinadi; bu so‘z orasidagi bo‘shliqlarni o‘zgartirishi mumkin. **Line spacing** va **paragraph spacing** turli parametrlar. Har bir satr oxirida Enter bosish professional formatlash emas." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), matnli hujjatlar bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Sarlavha va formatlash misollari original o‘quv bayoni." },
  ],
  "M03.03": [
    { type: "heading", content: "Rasm, jadval va sahifa obyekti bilan ishlash" },
    { type: "table", content: "| Obyekt | Nega kerak? | Sifat mezoni |\n|---|---|---|\n| Jadval | Tuzilgan ma’lumotni ixcham ko‘rsatish | Sarlavhalar aniq, satrlar mos |\n| Rasm | Vizual ko‘rsatish | O‘qilishi va nisbatlari saqlangan |\n| Caption | Rasm yoki jadval nomi | Manbaga va matndagi murojaatga mos |\n| Text wrapping | Rasm yonidagi matn oqimini boshqarish | Hech bir matn yo‘qolmagan |\n| Page break | Keyingi sahifadan boshlash | Bo‘sh Enterlar ishlatilmagan |" },
    { type: "example", content: "Rasm joylashuvi buzilsa, uni bo‘sh joylar bilan siljitmang. Matn bilan o‘ralish parametrini tekshirib, nisbati saqlangan holatda joylashtiring; zarur bo‘lsa alternativ matn yozing." },
    { type: "trap", content: "Rasmni ko‘rinishidan kattalashtirish uning haqiqiy ruxsatini oshirmaydi. Skreenshot jadvaldagi matnni foydalanuvchi uchun tahrirlanadigan haqiqiy jadvalga aylantirmaydi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), matnli hujjatlar bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Hujjatdagi obyektlar va matnni joylashtirish mavzulari; amaliy sifat mezonlari original izoh." },
  ],
  "M03.04": [
    { type: "heading", content: "Excel katak manzili va jadval tuzilishi" },
    { type: "table", content: "| Tushuncha | Misol | Izoh |\n|---|---|---|\n| Ustun | B | Harf bilan belgilanadi |\n| Satr | 7 | Son bilan belgilanadi |\n| Katak | B7 | Ustun va satr kesishmasi |\n| Diapazon | A1:C5 | To‘rtburchak kataklar guruhi |\n| Formula | =A1+B1 | Hisoblangan qiymat |\n| Varaqlar | Sheet1 | Ishchi kitob ichidagi qism |" },
    { type: "example", content: "Bir ishchi kitobda bir nechta varaq bo‘lsa, B7 manzili tegishli varaq doirasida tushuniladi. Bitta varaqdagi qiymat o‘zgarganida unga bog‘liq formulalarning natijasi qayta hisoblanishi mumkin." },
    { type: "trap", content: "**Ishchi kitob (workbook)** va **varaq (worksheet)** bir narsa emas. Katakning ko‘rsatilgan formatini almashtirish hamma vaqt haqiqiy ma’lumot turini o‘zgartirmaydi." },
    { type: "source", content: "Manba: Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), elektron jadvallar, ma’lumotni saralash, filtrlash va tahlil bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Excelning obyekt tuzilishi va elektron jadvallar bo‘yicha original umumlashtirish." },
  ],
  "M03.05": [
    { type: "heading", content: "Formula nusxalash: nisbiy, absolyut va aralash manzil" },
    { type: "table", content: "| Yozilish | Nusxalashda o‘zgarish | Maqsad |\n|---|---|---|\n| A1 | Ustun va satr o‘zgarishi mumkin | Nisbiy manzil |\n| $A$1 | Ikkalasi mahkamlanadi | Absolyut manzil |\n| $A1 | Ustun mahkamlanadi | Aralash manzil |\n| A$1 | Satr mahkamlanadi | Aralash manzil |" },
    { type: "example", content: "A2 da narx, B2 da son, E1 da umumiy soliq foizi bo‘lsa, =A2*B2*(1+$E$1) formulasi pastga ko‘chirilganda narx va son satrga mos o‘zgaradi, E1 esa saqlanadi. Bu formulani bitta aniq holatda sinab ko‘ring." },
    { type: "trap", content: "Formula boshidagi `=` amaldagi hisob yozilishini bildiradi. `SUM`, `AVERAGE`, `COUNT` bilan `COUNTA` funksiyalarining vazifasi bir xil emas. Funksiyalar argument ajratgichi dastur til va mintaqa sozlamasiga qarab `,` yoki `;` bo‘lishi mumkin." },
    { type: "source", content: "Manba: Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), elektron jadvallar, ma’lumotni saralash, filtrlash va tahlil bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Nisbiy va absolyut manzil haqidagi misol mustaqil yaratilgan." },
  ],
  "M03.06": [
    { type: "heading", content: "Saralash va filtrlash — ikki xil amal" },
    { type: "table", content: "| Amal | Natija | Asl jadvalga ta’sir |\n|---|---|---|\n| Saralash | Qatorlar tartibi o‘zgaradi | Butun qatorlar birga saralanishi shart |\n| Filtrlash | Mezon mos kelmagan qatorlar yashiriladi | Ma’lumotlar o‘chmaydi |\n| Qidirish | Mos matn/qiymatni topadi | Tartibni avtomatik o‘zgartirmaydi |\n| Shartli formatlash | Qiymatga ko‘ra ko‘rinishni o‘zgartiradi | Ma’lumotni o‘chirmaydi |" },
    { type: "example", content: "«Balli 80 dan yuqori o‘quvchilar»ni ko‘rsatish uchun filtr, ularni ball bo‘yicha kamayish tartibida chiqarish uchun saralash ishlating. Familiya bilan ballni alohida saralash qator bog‘lanishini buzishi mumkin." },
    { type: "trap", content: "Filtrlash qatorlarni bazadan o‘chirib tashlamaydi. Murakkab saralashda birinchi va ikkinchi mezonning ustuvorligi farq qiladi; barcha satr ustunlari birgalikda qolishi kerak." },
    { type: "source", content: "Manba: Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), elektron jadvallar, ma’lumotni saralash, filtrlash va tahlil bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Ma’lumotlar saralash/filtrlash mazmuni; vaziyat amaliy ta’limiy misol." },
  ],
  "M03.07": [
    { type: "heading", content: "Diagramma turini ma’lumot vazifasiga qarab tanlang" },
    { type: "table", content: "| Diagramma | Qachon mos? | Misol |\n|---|---|---|\n| Ustunli | Kategoriyalar miqdorini taqqoslash | Sinflar bo‘yicha test soni |\n| Chiziqli | Vaqt bo‘yicha o‘zgarish | Oylar kesimida o‘sish |\n| Doiraviy | Bir butunning tarkibi | Byudjet ulushlari |\n| Nuqtali (XY) | Ikki sonli o‘zgaruvchi bog‘lanishi | Vaqt va o‘lchangan tezlik |" },
    { type: "example", content: "Test balli 5 ta sinf bo‘yicha solishtirilsa ustunli diagramma o‘rinli; 12 oy bo‘yicha o‘zgarishni ko‘rsatishda chiziqli diagramma ma’qul. Diagramma sarlavhasi, o‘qlar, birlik va manbani tekshiring." },
    { type: "trap", content: "Doiraviy diagramma mustaqil yig‘indiga kiradigan toifalarda foydali, ammo juda ko‘p bo‘lakda o‘qish qiyinlashadi. Gistogramma va oddiy ustunli diagramma turli ma’lumot turlariga xizmat qiladi." },
    { type: "source", content: "Manba: Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), elektron jadvallar, ma’lumotni saralash, filtrlash va tahlil bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Grafik taqdim qilish tanlovi haqidagi misollar original qayta bayon." },
  ],
  "M03.08": [
    { type: "heading", content: "Taqdimotning axborot tuzilishi va vizual izchilligi" },
    { type: "table", content: "| Qism | Tekshiruv savoli |\n|---|---|\n| Sarlavha | Auditoriya mavzuni darhol tushunadimi? |\n| Slayd tartibi | Bir g‘oya keyingisiga mantiqan o‘tadimi? |\n| Shrift va rang | Matn o‘qiladimi, kontrast yetarlimi? |\n| Grafika | Tasvir g‘oyani tushuntiradimi? |\n| Manba | Rasm va faktlar kelib chiqishi qayd etilganmi? |" },
    { type: "example", content: "Algoritm haqida 10 slaydda matnni to‘liq ko‘chirish o‘rniga maqsad, shart, algoritm, blok-sxema, izohlovchi misol va xulosa ketma-ketligini ishlating. Aytishga mo‘ljallangan nutq bilan ekrandagi qisqa matnni farqlang." },
    { type: "trap", content: "Barcha matnni juda kichik shriftga sig‘dirish ham, faqat bezakli rasm qo‘shish ham axborot sifati emas. Bir xil slayd shabloni foydali, ammo mazmunga nomos shakllardan qochish kerak." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), taqdimot va multimedia bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Taqdimot dizayni bo‘yicha original metodik umumlashtirish; fizik PDF sahifalari mustaqil tekshirilmagan." },
  ],
  "M03.09": [
    { type: "heading", content: "Taqdimotdagi obyekt va multimedia sifatini tekshirish" },
    { type: "table", content: "| Obyekt | Vazifasi | Sifat xatari |\n|---|---|---|\n| Matn | Qisqa asosiy fikr | Juda mayda shrift |\n| Rasm | Ko‘rgazmali izoh | Cho‘zilgan nisbat va past aniqlik |\n| Audio | Nutq yoki tovush | Tovush eshitilmasligi |\n| Video | Harakatni ko‘rsatish | Fayl topilmasligi yoki kodek muammosi |\n| Giperhavola | Qo‘shimcha resursga o‘tish | Noto‘g‘ri yoki eskirgan URL |" },
    { type: "example", content: "Video boshqa kompyuterda ishlamasa, media fayli taqdimotga qanday bog‘langanini, formatini va namoyish qilinadigan qurilmadagi mosligini tekshiring. Oldindan oflayn namoyish sinovi o‘tkazish foydali." },
    { type: "trap", content: "Audio/video **konteyneri** va ichidagi **kodek** har doim bir tushuncha emas. Havola ishlashi uchun internet kerakmi yoki fayl mahalliy mavjudmi — taqdimotdan oldin tekshiring." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), taqdimot va multimedia bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Multimedia obyektlari haqida original tushuntirish." },
  ],
  "M03.10": [
    { type: "heading", content: "Slaydlararo o‘tish va obyekt animatsiyasi farqi" },
    { type: "table", content: "| Tushuncha | Qaerga ta’sir qiladi? | Misol |\n|---|---|---|\n| Transition | Bir slayddan boshqasiga o‘tish | Fade |\n| Entrance | Slayddagi obyekt kirishi | Matn paydo bo‘ladi |\n| Emphasis | Turgan obyektga urg‘u | Rang o‘zgaradi |\n| Exit | Obyekt chiqishi | Rasm yo‘qoladi |\n| Motion path | Obyekt yo‘nalish bo‘yicha yurishi | Ko‘rsatkich harakatlanadi |" },
    { type: "example", content: "Algoritm bosqichlarini birma-bir ochish auditoriya e’tiborini ketma-ketlikka qaratishi mumkin. Ammo juda ko‘p animatsiya asosiy fikrni soya ostida qoldirsa, statik slayd afzal." },
    { type: "trap", content: "**O‘tish effekti** butun slayd almashinuviga, **animatsiya** esa slayd ichidagi obyektga tegishli. Avtomatik va bosish orqali boshlanishni, davomiylik va ketma-ketlikni alohida tekshiring." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), taqdimot va multimedia bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Taqdimot va multimedia bo‘limlari; animatsiya nomlari ilova versiyasiga qarab farqlanishi mumkin." },
  ],
}
