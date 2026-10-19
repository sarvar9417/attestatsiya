/**
 * M15.02: substantive source-guided didactic principles chapter.
 * Rephrased from Mirzayeva theory lectures; applied ICT examples are original.
 * Neither page-complete nor an endorsement of one exclusive taxonomy.
 */
import type { TheoryBlock } from '../topicContent'

export const M15_02_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Ta’lim tamoyilini metod, qonuniyat va ta’lim shaklidan farqlash; ilmiylik, izchillik, ko‘rgazmalilik, onglilik-faollik, tushunarlilik, yosh va individual xususiyat, amaliyot bilan bog‘lash, mustahkamlik va tarbiyalovchi ta’limni sinf vaziyatlarida tanish; tamoyillar uyg‘unligini dalil bilan asoslash."
  },
  {
    "type": "intro",
    "content": "Darsda hamma o‘quvchiga bir xil slaydni ko‘rsatish hali samarali o‘qitish degani emas. Bir vaqtning o‘zida ilmiy tushuntirish, yosh imkoniyatiga moslik, mustaqil faoliyat va fikr-mulohaza zarur. Ushbu bobda har bir didaktik tamoyilning mohiyati, kuzatiladigan belgilari va buzilish oqibatlari misollar bilan tushuntiriladi."
  },
  {
    "type": "heading",
    "content": "1. Didaktika, qonuniyat va tamoyil"
  },
  {
    "type": "definition",
    "content": "==Didaktika== ta’limning mazmuni, qonuniyatlari, tamoyillari, metodlari, shakllari va natijalarini o‘rganuvchi pedagogika sohasi. ==Tamoyil== o‘qitish jarayonini loyihalash va tashkil etish uchun me’yoriy yo‘nalish, ==qonuniyat== esa ta’lim hodisalari orasidagi nisbatan barqaror bog‘lanishni ifodalaydi."
  },
  {
    "type": "table",
    "content": "| Tushuncha | Savol | Informatika darsidagi misol |\n|---|---|---|\n| Qonuniyat | Qanday bog‘lanish kuzatiladi? | Mashq va qayta aloqa faoliyatga ta’sir etadi |\n| Tamoyil | Qanday talabga rioya qilamiz? | Mavzuni bosqichma-bosqich beramiz |\n| Metod | Qanday harakat bilan o‘qitamiz? | Suhbat, namoyish, amaliy mashq |\n| Shakl | O‘quv faoliyati qanday uyushtiriladi? | Yakka, juftlik, guruh, frontal |\n| Vosita | Nimalardan foydalanamiz? | Kompyuter, sxema, darslik, simulyator |"
  },
  {
    "type": "trap",
    "content": "«Ko‘rgazmalilik» — tamoyil; «namoyish qilish» — shu tamoyilni amalga oshirishi mumkin bo‘lgan metod; «slayd» — vosita. Testda ular sinonim deb berilsa, tasnifni tekshiring."
  },
  {
    "type": "heading",
    "content": "2. Tamoyillarning o‘zaro bog‘liqligi"
  },
  {
    "type": "text",
    "content": "Bitta dars odatda bir necha tamoyilga tayanadi. Masalan, ma’lumotni saralashda ilmiylik tushunchani to‘g‘ri beradi; ko‘rgazmalilik jadvaldagi natijani ko‘rsatadi; onglilik o‘quvchini sababni tushuntirishga undaydi; amaliyot esa mustaqil filtrdan foydalanish bilan tekshiriladi."
  },
  {
    "type": "diagram",
    "content": "Maqsad → ilmiy asos → tushunarli tartib → faol mashq → qayta aloqa → mustahkam natija. Ushbu yozma sxema tamoyillar ketma-ket raqam bilan yodlanishini emas, ularning o‘zaro xizmat qilishini tasvirlaydi."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** O‘qituvchi 20 ta yangi terminni 10 daqiqada aytib berdi; o‘quvchilar hech birini mustaqil qo‘llay olmadi. Bu yerda faqat ilmiy atama aytilgan bo‘lishi mumkin, lekin tushunarlilik, faollik va mustahkamlik uchun yetarli sharoit yaratilmagan."
  },
  {
    "type": "heading",
    "content": "3. Ilmiylik tamoyili"
  },
  {
    "type": "definition",
    "content": "==Ilmiylik== o‘quv mazmunining ilmiy asoslangan, dalillarga mos, terminlari izchil va zamonaviy tushunchalarga zid bo‘lmasligini talab qiladi. O‘quvchi uchun soddalashtirish mumkin, lekin soddalashtirish mazmunni buzmasligi kerak."
  },
  {
    "type": "example",
    "content": "Kompyuterning «xotirasi» haqida gapirganda RAM, saqlash qurilmasi va protsessor keshini bitta narsa deb atamaslik — ilmiylik. Birinchi darsda umumiy ta'rif berib, keyin taqqoslash mumkin."
  },
  {
    "type": "trap",
    "content": "Darsda ko‘p xorijiy termin ishlatishning o‘zi ilmiylik emas. Termin to‘g‘ri bo‘lishi, izohlanishi va tekshiriladigan misolga bog‘lanishi kerak."
  },
  {
    "type": "heading",
    "content": "4. Tizimlilik va izchillik"
  },
  {
    "type": "definition",
    "content": "==Tizimlilik== bilimlar orasidagi mantiqiy bog‘lanishlarni shakllantirish; ==izchillik== mavzuni oldingi bilimga tayangan holda maqsadga muvofiq ketma-ket o‘rganishni nazarda tutadi."
  },
  {
    "type": "table",
    "content": "| Noto‘g‘ri ketma-ketlik | Yaxshiroq ketma-ketlik |\n|---|---|\n| Formulani yozishdan oldin katak tushunchasi yo‘q | Katak → manzil → operator → formula |\n| Siklni tushuntirishdan oldin shart noma’lum | Ifoda → shart → takrorlash → sikl |\n| Diagramma tanlash, lekin ma’lumot turi noma’lum | Ma’lumot turi → taqqoslash maqsadi → grafik |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** Python uchun «sikl» mavzusini rejalash: 1) takrorlanuvchi harakatni hayotiy misolda ko‘rsating; 2) ketma-ket buyruqni eslang; 3) takrorlash shartini aniqlang; 4) `for` misolini ishlating; 5) `while` bilan farqini ko‘rsating. Bu izchillik ilmiy terminni o‘rinsiz soddalashtirmaydi."
  },
  {
    "type": "heading",
    "content": "5. Onglilik va faollik"
  },
  {
    "type": "definition",
    "content": "==Onglilik== o‘quvchining nima va nima sababdan bajarilayotganini anglashidir. ==Faollik== savol berish, tekshirish, xato topish, asoslash va bilimni qo‘llashda shaxsiy ishtirok etishidir."
  },
  {
    "type": "example",
    "content": "«Ctrl+S nima uchun kerak?» degan savolga «faylni saqlash» deb javob berish — boshlang‘ich bilim. «Nega saqlashni tekshiraman, Save As qachon kerak?» deb tushuntirish — ongli qo‘llash."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** O‘qituvchi kodning natijasini aytib qo‘ydi. Muqobil yondashuv: o‘quvchilardan natijani oldindan taxmin qilish, ishga tushirish va farq sababini muhokama qilishni so‘rash. Bu faol bilish jarayonini kuchaytiradi."
  },
  {
    "type": "trap",
    "content": "Faqat qo‘l ko‘tarish yoki ovoz chiqarish yuqori kognitiv faollikni isbotlamaydi. O‘quvchi qanday fikrlayotgani va dalil bilan javob berayotgani muhim."
  },
  {
    "type": "heading",
    "content": "6. Ko‘rgazmalilik"
  },
  {
    "type": "definition",
    "content": "==Ko‘rgazmalilik== tushunchani anglashni sezgi orqali qabul qilinadigan, o‘qilishi mumkin bo‘lgan vositalar: tasvir, model, chizma, demonstratsiya yoki simulyatsiya bilan qo‘llab-quvvatlash talabidir."
  },
  {
    "type": "table",
    "content": "| O‘quv vazifasi | Ko‘rgazma | Qo‘shimcha tekshiruv |\n|---|---|---|\n| Algoritm tarmoqlanishi | Blok-sxema | Kiruvchi qiymat bo‘yicha yo‘l |\n| Tarmoq aloqasi | Tugunlar sxemasi | Paket qayerdan qayerga ketadi? |\n| Jadval formulasi | Katak manzillari ko‘rinishi | Nusxalanganda manzil o‘zgarishi |\n| Fayl tizimi | Papkalar daraxti | Faylning to‘liq manzilini topish |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** `if x > 0` shartini faqat ovoz bilan aytish o‘rniga oqim diagrammasida «ha/yo‘q» yo‘lini ko‘rsating. Keyin x=-2, 0 va 5 uchun yo‘nalishni o‘quvchining o‘zidan so‘rang. Ko‘rgazma fikrlashga xizmat qilishi kerak."
  },
  {
    "type": "trap",
    "content": "Ko‘rgazmalilik faqat ko‘p video yoki rangli slayd qo‘yish emas. Ortiqcha animatsiya diqqatni asosiy tushunchadan chalg‘itadi; sxema o‘qilishi va undan savol berish muhim."
  },
  {
    "type": "heading",
    "content": "7. Tushunarlilik va mos qiyinlik"
  },
  {
    "type": "definition",
    "content": "==Tushunarlilik== vazifaning tilini, oldingi bilimni, abstraksiya darajasini va yuklamani o‘quvchining imkoniyatlariga moslashtirishni bildiradi. Bunda o‘quvchi uchun mazmunli intellektual qiyinchilik saqlanadi."
  },
  {
    "type": "text",
    "content": "Bir xil mavzuni 5-sinfga fayl va papka tajribasi orqali, yuqori sinfga ruxsatlar va fayl tizimi tasnifi orqali tushuntirish mumkin. Daraja pasaytirilganda ilmiy xatoga yo‘l qo‘yilmaydi."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** Boshlovchi o‘quvchiga 40 qatorli algoritmni izohsiz berish tushunarsizlik tug‘diradi. Avval 5 qatorli model, keyin bo‘laklarga ajratish va mustaqil birlashtirish qo‘llanadi."
  },
  {
    "type": "heading",
    "content": "8. Yosh va individual xususiyatlarni hisobga olish"
  },
  {
    "type": "text",
    "content": "Yoshga mos ta’lim bilan individuallashtirish aynan bitta narsa emas. Bir yoshdagi o‘quvchilarda ham tayyorgarlik, til, o‘qish tezligi va ko‘mak ehtiyoji turlicha bo‘lishi mumkin; yondashuvni dalilga qarab o‘zgartirish zarur."
  },
  {
    "type": "table",
    "content": "| Ehtiyoj | Qo‘llab-quvvatlash misoli | Natijani tekshirish |\n|---|---|---|\n| Matnni o‘qishda qiyinchilik | Qisqa bosqich, ovozli izoh | Vazifani mustaqil tushuntiradimi? |\n| Dastlabki bilim yetishmaydi | Tayanch misol, mini-test | Oldingi xato kamayadimi? |\n| Tez bajaradi | Murakkabroq mantiqiy vaziyat | Qanday asoslaydi? |\n| Texnik cheklov | Juftlik yoki qog‘oz algoritm | Maqsadga erishdimi? |"
  },
  {
    "type": "trap",
    "content": "Individuallashtirish «har bir o‘quvchiga mutlaqo boshqa dastur» tuzish degani emas. Maqsad bir bo‘lib, material, vaqt yoki qo‘llab-quvvatlash darajasi moslashtirilishi mumkin."
  },
  {
    "type": "heading",
    "content": "9. Nazariya va amaliyot birligi"
  },
  {
    "type": "definition",
    "content": "==Nazariya va amaliyot bog‘liqligi== o‘rganilgan qoida va tushunchani real vazifaga tatbiq etish hamda amaliy kuzatuv asosida nazariyani qayta izohlashdir."
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** «Parol kuchli bo‘lishi kerak» nazariyasidan so‘ng o‘quvchilarga shaxsiy parolni oshkor qilmasdan, namunaviy parolning uzunligi, takrorlanishi va taxmin qilinishini tahlil qildiring. Yakunda nima uchun ayrim belgilarni qo‘shishning o‘zi yetarli emasligini asoslang."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** O‘quvchi Exceldagi `SUM` funksiyasini yoddan aytadi, biroq sinf xarajatlarini hisoblay olmaydi. Mos amaliy topshiriq yordamida formulani diapazonga qo‘llashi va tekshirishi talab etiladi."
  },
  {
    "type": "heading",
    "content": "10. Mustahkamlik va takrorlash"
  },
  {
    "type": "definition",
    "content": "==Mustahkamlik== o‘zlashtirilgan bilimni faqat bir marta qaytarib aytish emas, vaqt o‘tib, turli vaziyatda xatosiz qo‘llash darajasiga yetkazishdir."
  },
  {
    "type": "text",
    "content": "Oraliqli takrorlash, avvalgi mavzuga qaytish, mashqlarni turlicha berish va xatoni tushuntiruvchi qayta aloqa mustahkamlikka xizmat qiladi. Biroq har bir takrorlashni faqat test savoli bilan cheklash zarur emas."
  },
  {
    "type": "quickcheck",
    "content": "1) `for` va `while` farqi qayta izohlanganmi? 2) Oldingi darsdagi algoritmni yangi vazifada ishlata oladimi? 3) Noto‘g‘ri javobning sababini o‘quvchi o‘zi ko‘rsata oladimi?"
  },
  {
    "type": "heading",
    "content": "11. Tarbiyalovchi ta’lim va ijtimoiy mazmun"
  },
  {
    "type": "text",
    "content": "Pedagogik jarayonda ta’lim bilan tarbiya uzviy bog‘liq. Informatika darsida manbani ko‘rsatish, mualliflikka hurmat, jamoada xolis fikr bildirish, raqamli xavfsizlik va maxfiylik tushunchalarni o‘rgatish bilan birga ishlanadi."
  },
  {
    "type": "example",
    "content": "Veb sahifa yaratishda o‘quvchi begona rasmni ruxsatsiz ko‘chirmasligi kerakligini tahlil qiladi. Bu HTML ko‘nikmasi bilan axloqiy va huquqiy mas’uliyatni bog‘laydi."
  },
  {
    "type": "heading",
    "content": "12. Tamoyillarni birlashtirib dars loyihalash"
  },
  {
    "type": "table",
    "content": "| Dars bosqichi | Yetakchi tamoyillar | Tekshiriladigan dalil |\n|---|---|---|\n| Faollashtirish | Izchillik, tushunarlilik | Oldingi bilimga tayana oladimi? |\n| Yangi bilim | Ilmiylik, ko‘rgazmalilik | Tushunchani to‘g‘ri izohlaydimi? |\n| Amaliy mashq | Faollik, nazariya-amaliyot | Masalani mustaqil bajaradimi? |\n| Differensial yordam | Yosh va individual xususiyat | Yordam bilan oldinga siljiyaptimi? |\n| Yakun va qayta aloqa | Mustahkamlik | Xato va sababini angladimi? |"
  },
  {
    "type": "case",
    "content": "**Yaxlit vaziyat.** 7-sinfda diagramma tanlanmoqda. O‘qituvchi avval jadval namunalarini ko‘rsatadi, chiziqli va ustunli diagramma farqini tushuntiradi, ikki guruhga turlicha ma’lumot beradi, tanlov sababini muhokama qiladi va bir hafta keyin boshqa jadval bilan qayta tekshiradi."
  },
  {
    "type": "exam",
    "content": "**Attestatsiya uchun:** «metod» bilan «tamoyil», «ko‘rgazma» bilan «ko‘rgazmalilik», «ilmiy atama» bilan «ilmiylik», «qiyinchilikni kamaytirish» bilan «tushunarlilik»ni adashtirmang. Vaziyatda bir necha tamoyil bo‘lishi mumkin; asosiy pedagogik talabni ajratish uchun nima noto‘g‘ri bajarilganini toping."
  },
  {
    "type": "heading",
    "content": "13. Mustaqil topshiriq va javoblar"
  },
  {
    "type": "task",
    "content": "**1-mashq.** «O‘qituvchi Excel diagrammasini ko‘rsatdi, so‘ng o‘quvchilar o‘z jadvalini chizdi». Kamida ikkita tamoyilni dalili bilan nomlang."
  },
  {
    "type": "task",
    "content": "**2-mashq.** «Sikl»dan avval o‘quvchilar «shart»ni bilmaydi. Qaysi tamoyil birinchi navbatda qayta ko‘rib chiqiladi? 3 bosqichli dars tuzing."
  },
  {
    "type": "task",
    "content": "**3-mashq.** Bir o‘quvchi topshiriqni tez, ikkinchisi sekin bajarmoqda. Maqsadni o‘zgartirmasdan ikkita yordam variantini taklif qiling."
  },
  {
    "type": "task",
    "content": "**4-mashq.** Faqat ta’rifni yodlab olgan o‘quvchi bilimini yangi real vaziyatda qo‘llay olmayapti. Qanday tamoyillar sust ishlangan?"
  },
  {
    "type": "task",
    "content": "**5-mashq.** «Darsda 15 ta video namoyish qilindi, ammo o‘quvchilar birorta tushunchani tushuntira olmadi». Namoyish miqdori va didaktik sifatni farqlang."
  },
  {
    "type": "task",
    "content": "**6-mashq.** O‘qituvchi sinf bilan onlayn material ulashadi, lekin o‘quvchining shaxsiy ma’lumoti ham chiqib ketmoqda. Ta’lim-tarbiya birligi va xavfsizlik nuqtai nazaridan tuzatishni ayting."
  },
  {
    "type": "answers",
    "content": "**Javob va izoh.** 1) Ko‘rgazmalilik — tayyor ko‘rsatish; amaliyot/faollik — shaxsiy diagramma yaratish. 2) Izchillik va tizimlilik; oldin shart, so‘ng takrorlash namunasi va mustaqil sikl. 3) Differensial misol/yordam, kengaytirilgan vazifa. 4) Nazariya-amaliyot bog‘lanishi va mustahkamlik. 5) Mazmun va qayta aloqa bo‘lmasa, soni ko‘p video natija bermaydi. 6) Maxfiy ma’lumotni olib tashlash, xavfsiz havola, raqamli mas’uliyatni muhokama qilish."
  },
  {
    "type": "summary",
    "content": "Ta’lim tamoyillari o‘qituvchining metod tanlashini tekshirish uchun **mazmuniy mezon**dir. Ular bir-birini inkor etmaydi; ilmiy mazmunni yoshga mos va faol yo‘l bilan o‘rgatib, amaliy qo‘llash va qayta aloqa orqali mustahkamlashga xizmat qiladi."
  },
  {
    "type": "source",
    "content": "**Manba izi:** F.O. Mirzayeva, «Pedagogika nazariyasi va tarixi» darslik/ma’ruza to‘plami, «Yaxlit pedagogik jarayon», «Ta’lim jarayonining mohiyati» va «Ta’lim tamoyillari va qonuniyatlari» bo‘limlari (matnli nusxa, bosma taxminan 39–50 va seminar vazifalari taxminan 208–209-betlar), https://drive.google.com/file/d/1GG9dH4_kdMyj5cqKML21lQoZufO40E38/view . Tamoyillarning guruhlanishi manbalarda farq qilishi mumkin; informatika darsiga qo‘llanadigan vaziyatlar, mashqlar va javoblar original pedagogik talqin, sahifama-sahifa to‘liq ko‘chirma emas."
  }
]
