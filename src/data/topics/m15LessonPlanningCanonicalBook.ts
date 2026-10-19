/**
 * TASK-287: M15.04 pedagogy lesson types and planning full original chapter,
 * grounded in Mirzayeva chapter 6 with explicit source caveats.
 */
import type { TheoryBlock } from '../topicContent'

export const M15_04_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Ta’limni tashkil etish shakli, dars turi, metod va dars tahlili yo‘nalishini farqlash; didaktik maqsadga ko‘ra darslarni tasniflash; o‘lchanadigan natija, oldingi bilim, amaliy vazifa, baholash mezoni va refleksiyani yagona reja sifatida loyihalash; sinfda xavfsiz va inklyuziv muhitni tashkil qilish."
  },
  {
    "type": "intro",
    "content": "Darsning muvaffaqiyati ko‘p slayd yoki ko‘p savol berish bilan emas, o‘quvchilar nimani mustaqil bajara olishi va buni qanday dalil bilan ko‘rsatishi bilan belgilanadi. Bir darsda yangi mavzu, mashq va teskari aloqa bo‘lishi mumkin — uning turini yetakchi didaktik maqsad aniqlaydi."
  },
  {
    "type": "heading",
    "content": "1. Dars va ta’limni tashkil etish shakli"
  },
  {
    "type": "definition",
    "content": "==Ta’limni tashkil etish shakli== o‘qituvchi va o‘quvchilar faoliyatining tashqi tartibi va uyushtirilishini bildiradi. ==Dars== belgilangan vaqt va o‘quv maqsadida olib boriladigan o‘quv jarayonining keng tarqalgan shakli. ==Dars turi== esa odatda uning **yetakchi didaktik maqsadi** bilan ajratiladi."
  },
  {
    "type": "table",
    "content": "| Tushuncha | Savol | Informatika darsidagi namuna |\n|---|---|---|\n| Tashkiliy shakl | Qanday uyushtirilgan? | Sinf-dars, to‘garak, ekskursiya |\n| Dars turi | Asosiy o‘quv maqsadi qanday? | Yangi bilimni o‘rganish |\n| Metod | Qanday yo‘l bilan o‘rgatiladi? | Munozara, ko‘rsatish, amaliy mashq |\n| Vosita | Nimadan foydalaniladi? | Kompyuter, darslik, algoritm sxemasi |\n| Tahlil turi | O‘tgan darsning nimasi tekshiriladi? | Didaktik, uslubiy, psixologik |"
  },
  {
    "type": "trap",
    "content": "«Laboratoriya mashg‘uloti», «guruhda ishlash» yoki «ekskursiya» degan yozuv alohida didaktik maqsad emas va darsning yetakchi didaktik maqsadini avtomatik belgilamaydi. Metod, shakl va maqsad — boshqa mezonlar."
  },
  {
    "type": "heading",
    "content": "2. Darslarning yetakchi maqsadga ko‘ra tasnifi"
  },
  {
    "type": "table",
    "content": "| Dars turi | Maqsad | O‘quvchi faoliyati |\n|---|---|---|\n| Yangi bilimni o‘rganish | Yangi tushuncha va munosabat | Qoidani o‘z so‘zi bilan izohlash |\n| Mustahkamlash va takrorlash | Eski bilimni qayta qo‘llash | Bir nechta o‘xshash vazifani bajarish |\n| Umumlashtirish va tizimlashtirish | Bilimlar orasidagi bog‘lanish | Bir nechta usulni taqqoslash |\n| Ko‘nikma va malaka hosil qilish | Amalni mustaqil bajarish | Model, kod yoki jadval yaratish |\n| Bilimlarni tekshirish (nazorat) | Erishilgan natijani aniqlash | Ishni mezon asosida topshirish |\n| Aralash (kombinatsiyalashgan) | Bir nechta maqsadni uyg‘unlashtirish | Faollashtirish, yangilik, mashq, teskari aloqa |"
  },
  {
    "type": "text",
    "content": "Bu ro‘yxat Mirzayeva va qo‘shimcha «Dars turlari» konspektlarida uchraydigan tasnifga mos didaktik yondashuvdir; boshqa pedagogika manbalarida nomlar yoki guruhlash usullari qisman farqlanishi mumkin."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** Informatika o‘qituvchisi avvalgi «katak manzili»ni eslatdi, keyin `SUM`ni ilk bor ko‘rsatdi, mashq qildirdi va mini-savol berdi. Bir necha faoliyat borligi uchun dars aralash xususiyatda, lekin o‘qituvchi uning yetakchi o‘quv natijasini alohida aniqlashi shart."
  },
  {
    "type": "heading",
    "content": "3. Yangi bilim va mustahkamlash farqi"
  },
  {
    "type": "definition",
    "content": "==Yangi bilimni o‘rganish== ilgari o‘quvchiga noma’lum asosiy tushunchani shakllantirishga qaratiladi. ==Mustahkamlash== allaqachon o‘rganilgan bilimni bir necha vaziyatda qo‘llab, ishonchli ko‘nikmaga aylantiradi."
  },
  {
    "type": "table",
    "content": "| Holat | Yetakchi tur | Dalil |\n|---|---|---|\n| «Algoritm» ilk bora izohlanmoqda | Yangi bilim | Ta’rif va xossalarga izoh |\n| Avval o‘rganilgan operatorlar bilan 6 mashq | Mustahkamlash | Xatolar kamayishi |\n| Barcha operatorlarni qaror sxemasiga ajratish | Umumlashtirish | Xossalarni bog‘lash |\n| Berilgan talab asosida mustaqil dastur | Amaliy ko‘nikma | Ishlaydigan yechim |\n| Oldingi bobdan mustaqil sinov | Nazorat | Rubrikaga mos baholash |"
  },
  {
    "type": "trap",
    "content": "Bir xil mashqni ko‘p bajarish har doim **umumlashtirish** emas: umumlashtirish tushunchalararo mantiqiy bog‘lanishni ochib beradi. Nazorat darsi esa natijani aniqlaydi, faqat vaqtni test bilan band qilish emas."
  },
  {
    "type": "heading",
    "content": "4. Aralash dars va uning mantiqiy tuzilishi"
  },
  {
    "type": "text",
    "content": "Aralash darsda tashkiliy tayyorgarlik, oldingi bilimni faollashtirish, yangi mavzuni anglash, mustahkamlash va yakuniy teskari aloqa bog‘lanadi. Barcha darslar uchun mutlaqo bir xil «daqiqalik» sxema majburiy emas; o‘quv natijasiga qarab vaqt moslashtiriladi."
  },
  {
    "type": "table",
    "content": "| Bosqich | O‘qituvchi harakati | O‘quvchi dalili |\n|---|---|---|\n| Faollashtirish | Qisqa diagnostika | Oldingi xatoni izohlaydi |\n| Yangi bilim | Misol/model | Qoida nima sababdan ishlashini aytadi |\n| Birgalikdagi mashq | Namunani tahlil qiladi | Qadamlarni tushuntiradi |\n| Mustaqil amaliyot | Vazifa va mezon beradi | O‘zi yechim yaratadi |\n| Yakun | Qisqa refleksiya | Qaysi bilim o‘zgarganini ko‘rsatadi |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** Mavzu «Katak diapazoni». Boshlanishda A1 ni o‘qish tekshiriladi; 8 daqiqa davomida A2:C6 mazmuni ochiladi; keyin 9 va 15 katakli diapazonlar sanaladi; yakunda o‘quvchi mustaqil ikkita misol yechadi. Bosqichlar soni dars turining o‘zi emas, maqsadga xizmat qiladigan struktura."
  },
  {
    "type": "heading",
    "content": "5. Rejalashtirish: avval o‘lchanadigan natija"
  },
  {
    "type": "definition",
    "content": "==O‘quv natijasi== dars oxirida o‘quvchi qanday faoliyatni bajara olishini bildiradi. «Tushunadi» kabi ichki holatni bevosita baholash qiyin; «taqqoslaydi», «hisoblaydi», «asoslaydi», «yaratadi» kabi kuzatiladigan fe’llar aniqroq."
  },
  {
    "type": "table",
    "content": "| Noaniq ifoda | O‘lchanadigan natija | Dalil |\n|---|---|---|\n| Excelni biladi | C5 manzilining ustun/qatorini topadi | 5 misoldan 4 tasini to‘g‘ri yechadi |\n| Algoritmni tushunadi | Tarmoqlanishni blok-sxemada ko‘rsatadi | To‘g‘ri «ha/yo‘q» yo‘li |\n| Tarmoqni o‘rganadi | LAN va WANni ikki belgi bilan solishtiradi | Taqqoslash jadvali |\n| Axborot xavfsizligini biladi | Fishing xabaridagi xavf belgilarini ajratadi | Izohli tahlil |"
  },
  {
    "type": "text",
    "content": "Maqsad, faoliyat va baholash **bir-biriga mos** bo‘lishi zarur. Agar maqsad «algoritm tuza oladi» bo‘lsa, dars yakunida faqat «algoritm nima?» definitsiyasi so‘ralishi yetarli dalil emas."
  },
  {
    "type": "trap",
    "content": "Darsning «mavzusi» bilan «kutilayotgan o‘quv natijasi» bir xil emas. Mavzu – nima o‘rganiladi; natija – o‘quvchi undan foydalanib nima qila oladi."
  },
  {
    "type": "heading",
    "content": "6. Diagnostika va boshlang‘ich tayyorgarlik"
  },
  {
    "type": "text",
    "content": "Reja tuzishda o‘quvchilarning avvalgi bilimi, tili, qurilmaga kirish imkoniyati va xavfsizlik ehtiyoji ko‘riladi. Diagnostika katta nazorat ishi bo‘lishi shart emas; 3 ta qisqa savol, xato kod yoki oldingi amaliy topshiriqni ko‘rsatish ham yetarli ma’lumot berishi mumkin."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** 7-sinfda Excel `AVERAGE` mavzusi boshlanmoqda. O‘quvchilarning yarmi `=` bilan boshlanadigan formulani bilmaydi. Reja avval katak manzili va formula haqida tayanch misol bilan boyitiladi; shu yondashuv izchillik va tushunarlilikka xizmat qiladi."
  },
  {
    "type": "heading",
    "content": "7. Dars rejasining zarur tarkibi"
  },
  {
    "type": "table",
    "content": "| Reja elementi | Savol | Natija |\n|---|---|---|\n| Mavzu va sinf | Kimga, nima? | Mazmun chegarasi |\n| O‘quv natijasi | Nima qila oladi? | Kuzatiladigan fe’l |\n| Oldingi bilim | Qaysi tayanch kerak? | Qisqa diagnostika |\n| Resurs | Qaysi vosita zarur? | Darslik, internet, qurilma |\n| Faoliyat va metod | Qanday o‘rganadi? | Namoyish, mashq, muloqot |\n| Vaqt/alternativa | Ish qachon, nima bo‘lsa-chi? | Amaliy taqsimot va zaxira |\n| Baholash | Qanday dalil? | Rubrika, yechim, chiqish chiptasi |\n| Refleksiya | Keyingi safar nima? | Tahrirlanadigan reja |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** «Fayllarni tartiblash» darsi: (1) natija – o‘quvchi uch xil papka ierarxiyasidan xavfsiz va topilishi osonini asoslaydi; (2) oldingi bilim – fayl kengaytmasi; (3) amaliyot – jamoa fayllarini mantiqan guruhlash; (4) baholash – nomlash qoidasi, manzil va qidirish bo‘yicha rubrika."
  },
  {
    "type": "heading",
    "content": "8. Vaqtni va o‘tishlarni boshqarish"
  },
  {
    "type": "text",
    "content": "Dars vaqtini vazifalarning murakkabligi va o‘quvchilar tezligiga mos rejalang. Har bir faoliyatga boshlanish signali, bajarish sharti, tugallash mezoni va keyingi faoliyatga o‘tish ko‘rsatmasi bo‘lishi foydali."
  },
  {
    "type": "example",
    "content": "Kompyuter laboratoriyasida guruhlar o‘rtasida fayl almashinuvi 5 daqiqa cho‘zildi. Keyingi reja uchun fayllarni oldindan joylashtirish, nomlash qoidasi va offline zaxira nusxa tayyorlash darsning kutilmagan texnik to‘xtashini kamaytiradi."
  },
  {
    "type": "trap",
    "content": "Hamma darsni faqat taqdimot uchun sarflash o‘quvchining mustaqil mashq va teskari aloqa vaqtini qisqartiradi. O‘qituvchi faolligi bilan o‘quvchi faolligini farqlang."
  },
  {
    "type": "heading",
    "content": "9. Sinfni boshqarish: tartib va hamkorlik"
  },
  {
    "type": "definition",
    "content": "==Sinfni boshqarish== – xavfsiz, hurmatli, faol va maqsadga yo‘naltirilgan o‘qish muhitini tashkil etishdir. Bu faqat «jimlikni saqlash» emas: ko‘rsatma, guruh vazifalari, kelishilgan qoidalar va konstruktiv qayta aloqani o‘z ichiga oladi."
  },
  {
    "type": "table",
    "content": "| Muammo | Oldini oluvchi yondashuv | Sinfdagi dalil |\n|---|---|---|\n| Navbat kutish | Guruh roli va vaqt jadvali | Har bir bola vazifali |\n| Vazifa noaniq | Bosqich va misolni ko‘rsatish | Savollar qisqaradi |\n| Baland ovoz | O‘zaro kelishilgan muloqot qoidasi | Xotirjam fikr almashuv |\n| Qurilmada chalg‘ish | Faoliyat aniq va nazorat qilinadigan | Jarayon maqsadga mos |\n| Bir o‘quvchi ustunlik qiladi | Juftlikdagi rol almashinuvi | Hamma ishtirok etadi |"
  },
  {
    "type": "case",
    "content": "**Vaziyat.** Guruhdagi tajribali o‘quvchi kodning hammasini o‘zi yozmoqda. «Haydovchi–nazoratchi» rollarini almashish, har birining fikrini tinglash va tayyor kodni izohlash talabini qo‘yish hamkorlikni kuchaytiradi."
  },
  {
    "type": "heading",
    "content": "10. Inklyuziv yondashuv va moslashtirish"
  },
  {
    "type": "text",
    "content": "Bir sinfdagi o‘quvchilar oldingi bilim, texnik vosita, til yoki qo‘shimcha ko‘mak ehtiyojiga ko‘ra farqlanadi. Maqsadni saqlagan holda topshiriq murakkabligini bosqichlash, vizual ko‘rsatma, juftlik, qo‘shimcha vaqt yoki alternativ usul berish mumkin."
  },
  {
    "type": "example",
    "content": "Vizual dasturni mustaqil boshqarishga qiynalgan o‘quvchiga algoritm qadamlarini raqamlangan matn yoki blok-sxema orqali tushuntirishga ruxsat berish mumkin. Yakuniy baholash esa belgilangan kompetensiyaga mos bo‘lishi kerak."
  },
  {
    "type": "trap",
    "content": "«Differensiallashtirish» – ba’zi o‘quvchilarga faqat oson vazifa berish degani emas. Har bir o‘quvchiga mazmunli intellektual o‘sish imkoniyati kerak."
  },
  {
    "type": "heading",
    "content": "11. Informatika laboratoriyasining xavfsizligi"
  },
  {
    "type": "text",
    "content": "Kompyuter bilan ishlashda jihozdan to‘g‘ri foydalanish, ergonomika, elektr xavfsizligi, hisobga kirish va maxfiy ma’lumotni saqlash qoidalari darsning ajralmas qismidir. Parollarni sinfdoshiga ko‘rsatish yoki baholar ro‘yxatini ochiq ulashishga yo‘l qo‘ymang."
  },
  {
    "type": "table",
    "content": "| Holat | Oldindan chora | Alternativ reja |\n|---|---|---|\n| Internet uzilishi | Lokal fayllar | Offline simulyatsiya |\n| Qurilma yetishmasligi | Navbat/juftlik jadvali | Qog‘ozdagi algoritm |\n| Login muammosi | Texnik yo‘riqnoma | Demo hisob yoki ish varaqasi |\n| Ko‘z va tana charchashi | Harakat tanaffusi, ergonomika | Ekransiz mini-topshiriq |\n| Maxfiy fayl xatari | Ruxsatlarni cheklash | Anonim ma’lumot |"
  },
  {
    "type": "heading",
    "content": "12. Baholash va qayta aloqa"
  },
  {
    "type": "definition",
    "content": "==Formativ baholash== o‘rganish jarayonida keyingi qadamni yaxshilashga xizmat qiladigan dalil yig‘ish; ==summativ baholash== ma’lum bosqich yakunidagi natijani umumlashtirish uchun ishlatiladi. Ulardan biri dars turi bilan aynan bir narsa emas."
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** O‘quvchi Excel formulada katak manzilini to‘g‘ri, lekin amallar tartibini noto‘g‘ri qo‘lladi. «Xato» deyish o‘rniga, «Qavs qo‘shilganda nima o‘zgarishini ikkita qiymatda tekshir» deb maqsadli qayta aloqa bering. Keyingi sinov avvalgi xatoning bartaraf etilganini ko‘rsatadi."
  },
  {
    "type": "table",
    "content": "| Usul | Qachon? | Qanday dalil? |\n|---|---|---|\n| Exit ticket | Dars yakunida | 1–2 yangi masala |\n| Kuzatuv ro‘yxati | Amaliyot jarayonida | Qadamlarni bajarish |\n| Rubrika | Loyiha natijasi | Mezonlar bo‘yicha yechim |\n| O‘zaro tekshirish | Juftlikda | Asosli fikr-mulohaza |\n| Refleksiya | Darsdan keyin | Keyingi reja o‘zgarishi |"
  },
  {
    "type": "heading",
    "content": "13. Dars tahlili va dars turi — boshqa tasniflar"
  },
  {
    "type": "table",
    "content": "| Tahlil yo‘nalishi | Yetakchi savol | Dars turi bilan bog‘lanishi |\n|---|---|---|\n| Didaktik | Maqsad, mazmun, izchillik o‘rinlimi? | Har qanday dars turiga qo‘llanadi |\n| Uslubiy | Metod va vosita nega tanlandi? | Har qanday darsga |\n| Psixologik | Diqqat, motivatsiya, ruhiy muhit qanday? | Har qanday darsga |\n| Pedagogik | Muomala, tarbiyaviy ta’sir va odob qanday? | Har qanday darsga |\n| Metodologik | Yondashuvning konseptual asoslari qanaqa? | Berilgan manba tasnifiga bog‘liq |"
  },
  {
    "type": "text",
    "content": "«dars tahlili turlari.pdf» — ikkilamchi konspekt bo‘lib, undagi besh yo‘nalish darsning didaktik maqsad tasnifi bilan bir xil emas. Bu atamalarning nomini normativ maqomli yagona rasmiy tasnif sifatida taqdim etish to‘g‘ri emas; o‘quv topshirig‘ida aynan nima baholanayotganini aniqlang."
  },
  {
    "type": "heading",
    "content": "14. Darsni takomillashtirish va refleksiya"
  },
  {
    "type": "case",
    "content": "**Vaziyat.** Dars rejasidagi asosiy natija «o‘quvchi diapazonni hisoblay oladi», lekin 70% o‘quvchi yakuniy vazifada xato qildi. O‘qituvchi keyingi darsda avvalgi bilim va misollarni qayta ko‘rib chiqadi, kichik guruh bilan qayta ishlaydi va boshqa vazifa bilan natijani tekshiradi."
  },
  {
    "type": "trap",
    "content": "Refleksiya – faqat «dars yaxshi o‘tdi» deb yozish emas. Aniq dalil: qaysi natija chiqdi, kim qaysi xatoga duch keldi, keyingi darsda nima o‘zgaradi?"
  },
  {
    "type": "heading",
    "content": "15. Attestatsiya vaziyatlari va mustaqil mashqlar"
  },
  {
    "type": "exam",
    "content": "Savol qaysi tasnifni so‘rayotganini ajrating: **dars turi** – yetakchi didaktik maqsad; **tashkiliy shakl** – sinf, guruh, ekskursiya; **metod** – tushuntirish, mashq; **dars tahlili** – didaktik, uslubiy, psixologik va boshqalar."
  },
  {
    "type": "task",
    "content": "**1-mashq.** O‘qituvchi yangi dasturlash operatorini tushuntirib, avvalgi vazifani eslatdi va qisqa test qildi. Yetakchi didaktik maqsad qaysi? Qaysi ma’lumot yetishmayapti?"
  },
  {
    "type": "task",
    "content": "**2-mashq.** O‘quvchilar elektron jadvalning oldingi 5 funksiyasini o‘zaro bog‘liq tizimga ajratib, qachon qaysisini ishlatishini izohlaydi. Qaysi dars turiga yaqin?"
  },
  {
    "type": "task",
    "content": "**3-mashq.** «O‘quvchi algoritm haqida tasavvurga ega» maqsadini o‘lchanadigan natijaga aylantiring; ikki baholash mezonini yozing."
  },
  {
    "type": "task",
    "content": "**4-mashq.** Internet uzilib qoldi. Oldindan tayyorlangan offline resurs bilan asosiy o‘quv natijasini qanday saqlaysiz?"
  },
  {
    "type": "task",
    "content": "**5-mashq.** Kichik guruhda bir o‘quvchi hamma ishni egalladi. Sinfni boshqarishda qanday ikki aniq harakat kerak?"
  },
  {
    "type": "task",
    "content": "**6-mashq.** «O‘qituvchi mavzuni ilmiy ketma-ketlikda tushuntirdi» hamda «o‘quvchilar xavotiri kamaydi». Bu ikki xulosa qaysi dars tahlili jihatlariga tegishli?"
  },
  {
    "type": "answers",
    "content": "**Javoblar va izohlar.** 1) Yetakchi natija yangi operatorni ilk tushunish bo‘lsa — yangi bilim; darsda bir nechta bosqich borligi aralash tuzilmani ham ko‘rsatishi mumkin. 2) Umumlashtirish/tizimlashtirish, faqat bir xil mashqni takrorlash emas. 3) «Shartli algoritmni blok-sxemada tasvirlay oladi»; tarmoqlanish yo‘li va natija to‘g‘ri. 4) Qog‘ozdagi misol, lokal fayl, natija mezonini saqlash. 5) Rollar almashuvi va barcha ishtirokchilardan qisqa izoh. 6) Birinchisi didaktik, ikkinchisi psixologik tahlil."
  },
  {
    "type": "summary",
    "content": "Yaxshi dars rejasining skeleti – o‘lchanadigan maqsad, oldingi tayyorgarlik, mazmun, faoliyat, xavfsiz boshqaruv, baholash va refleksiya. Dars turini metod yoki tashkiliy shakl bilan aralashtirmang; bir darsda bir nechta faoliyat bo‘lishi mumkin."
  },
  {
    "type": "source",
    "content": "**Manba izi:** F. O. Mirzayeva «Pedagogika nazariyasi va tarixi», 6-mavzu «Ta’limni tashkil etish shakllari va turlari», bosma 99–110-betlar va o‘qituvchining darsga tayyorlanishi bo‘yicha amaliy vazifa, taxminan 220-bet — https://drive.google.com/file/d/1GG9dH4_kdMyj5cqKML21lQoZufO40E38/view ; qo‘shimcha o‘quv konspekti «Dars turlari.pdf» — https://drive.google.com/file/d/1L4PXxcviDgk5_iaOW5zLCG7536I6z0Ya/view . Informatika misollari va mashqlar mustaqil didaktik qayta bayon; tasniflar yagona majburiy normativ hujjat sifatida talqin etilmaydi. Sahifama-sahifa to‘liq ko‘chirma emas."
  }
]
