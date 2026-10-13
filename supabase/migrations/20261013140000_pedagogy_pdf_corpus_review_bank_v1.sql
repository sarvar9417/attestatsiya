-- Original review-only pedagogy bank distilled from the uploaded PDF corpus
-- and canonical M14/M15/M16 source lessons.
-- 36 Y1 items: 2 per official pedagogy construct.
-- Historical source wording is NOT copied; all stems/options below are original.
-- No item is auto-published.

begin;

do $bank$
declare
  item jsonb;
  v_subject uuid;
  v_construct uuid;
  v_group text;
  v_lesson uuid;
  v_question uuid;
  v_option uuid;
  v_i int;
  v_correct int;
  v_basis uuid;
begin
  for item in
    select * from jsonb_array_elements($json$
[
{"ref":"authored:pedagogy-pdf-corpus:v1:KS.01:001","construct":"KS.01","cognitive":"qollash","difficulty":3,"basis":"08840733-118e-4978-ab5f-238ce26f02ed","stem":"Avvalgi nazorat natijasi sinfning yarmi tayanch ko‘nikmani egallamaganini ko‘rsatdi. Keyingi darsni rejalashtirishda eng asosli qaror qaysi?","options":["Natijaga mos tayanch faoliyat va vaqtni rejalashtirish","Oldingi reja va sur’atni o‘zgartirmasdan davom ettirish","Faqat uy vazifasi hajmini ikki baravar oshirish","Baholash ma’lumotini dars rejasidan alohida saqlash"],"correct":0,"exp":"Rejalashtirish baholash dalillariga tayanib maqsad, sur’at, usul yoki tayanch faoliyatni moslashtirishni talab qiladi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:KS.01:002","construct":"KS.01","cognitive":"mulohaza","difficulty":4,"stem":"Dars rejasida fanlararo bog‘lanish mazmunli tashkil etilganini qaysi holat yaxshiroq ko‘rsatadi?","options":["Boshqa fan ko‘nikmasi vazifani bajarishda amalda qo‘llanadi","Slaydda boshqa fan nomi bir marta eslatib o‘tiladi","Dars oxirida tasodifiy boshqa fan savoli beriladi","Uy vazifasiga boshqa darslik nomi yozib qo‘yiladi"],"correct":0,"exp":"Fanlararo integratsiya boshqa fan nomini tilga olish emas, mazmun yoki kompetensiyani real faoliyatda bog‘lashdir."},

{"ref":"authored:pedagogy-pdf-corpus:v1:KS.02:001","construct":"KS.02","cognitive":"qollash","difficulty":3,"basis":"4104c340-b51d-4b81-b538-ad8d4030bee6","stem":"Guruhli ish qiziqarli o‘tdi, ammo ikki o‘quvchi barcha vazifani bajardi, qolganlar faqat kuzatdi. Ta’lim samaradorligini oshirish uchun nima qilish kerak?","options":["Har bir o‘quvchiga tekshiriladigan rol va natija berish","Guruhli ishni butunlay bekor qilib ma’ruza o‘tish","Faqat faol ikki o‘quvchining ishini baholash","Vazifani o‘zgartirmasdan vaqtni yana uzaytirish"],"correct":0,"exp":"Faol metod samarali bo‘lishi uchun har bir o‘quvchining maqsadga bog‘langan faol ishtiroki tashkil etiladi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:KS.02:002","construct":"KS.02","cognitive":"mulohaza","difficulty":4,"stem":"O‘qituvchi zamonaviy interfaol metodni tanladi, lekin u dars maqsadiga mos kelmadi. Qaysi xulosa to‘g‘ri?","options":["Metodning zamonaviyligi emas, maqsadga mosligi hal qiluvchi","Interfaol metod har qanday maqsadda avtomatik samarali","Faol metod tanlansa baholash rejalashtirilmaydi","Texnologiya ishlatilsa o‘quvchi ehtiyoji hisobga olinmaydi"],"correct":0,"exp":"Samaradorlik metodning nomi bilan emas, maqsad, mazmun, ehtiyoj va baholash bilan uyg‘unligi orqali aniqlanadi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:KS.03:001","construct":"KS.03","cognitive":"qollash","difficulty":3,"basis":"39826d3e-2f47-482d-9b1b-257383487377","stem":"O‘quvchi bir xil xatoni takrorlamoqda. Qaysi qayta aloqa eng foydali?","options":["Xatoni ko‘rsatib, keyingi aniq tuzatish qadamini berish","Faqat noto‘g‘ri ekanini aytib bahoni yozish","Boshqa o‘quvchilarning baholari bilan solishtirish","Izoh bermasdan topshiriqni qayta ko‘chirtirish"],"correct":0,"exp":"Samarali qayta aloqa o‘quvchiga hozirgi holat va keyingi yaxshilash qadamini tushunishga yordam beradi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:KS.03:002","construct":"KS.03","cognitive":"bilish","difficulty":2,"stem":"Yangi bo‘lim boshida o‘quvchilarning tayanch bilimlarini aniqlash uchun o‘tkazilgan qisqa tekshiruv qaysi baholash turiga eng mos?","options":["Diagnostik baholash","Summativ baholash","Faqat yakuniy sertifikatlash","Tasodifiy kuzatuvsiz baholash"],"correct":0,"exp":"Diagnostik baholash o‘qitish sikli boshida boshlang‘ich holatni aniqlash va rejalashtirishni moslashtirishga xizmat qiladi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:KS.04:001","construct":"KS.04","cognitive":"qollash","difficulty":3,"basis":"507c1cca-043f-4687-9235-261c38eeface","stem":"Sinf loyihasida o‘quvchilar bir-birining fikrini mensimayapti. Tarbiyaviy maqsadga mos birinchi yondashuv qaysi?","options":["Hurmatli muloqot va hamkorlik qoidalarini faoliyatda mustahkamlash","Faqat loyiha mahsulotining texnik sifatini baholash","Nizoni e’tiborsiz qoldirib ishni tezroq tugatish","Barcha vazifani faqat eng kuchli o‘quvchiga berish"],"correct":0,"exp":"Tarbiyaviy faoliyat qadriyat, mas’uliyat, hurmat va ijtimoiy xulqni maqsadli rivojlantiradi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:KS.04:002","construct":"KS.04","cognitive":"qollash","difficulty":3,"stem":"O‘quvchilarning o‘zini o‘zi boshqarishini rivojlantirishga qaysi faoliyat ko‘proq mos?","options":["Tadbir vazifalarini kelishib taqsimlash va natijani birga tahlil qilish","Barcha qarorlarni o‘qituvchi yolg‘iz qabul qilishi","O‘quvchilarga faqat tayyor buyruqlar ro‘yxatini berish","Har qanday tashabbusni dars tartibiga xalaqit deb to‘xtatish"],"correct":0,"exp":"O‘zini o‘zi boshqarish mas’uliyatli tanlov, rol va jamoaviy qarorlarda o‘quvchi ishtirokini talab qiladi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:KS.05:001","construct":"KS.05","cognitive":"mulohaza","difficulty":4,"basis":"b3741e9b-13d1-404b-bfb5-354b14387f64","stem":"Bir o‘quvchi sinfdoshlari tomonidan masxara qilinmoqda. O‘qituvchining eng birinchi vazifasi qaysi?","options":["Masxarani to‘xtatib, xavfsiz va hurmatli muhitni tiklash","Vaziyatni dars oxirigacha butunlay e’tiborsiz qoldirish","Jabrlanuvchini boshqa sinfga o‘tkazishni darhol talab qilish","Muammoni faqat baholar bilan bog‘lab tushuntirish"],"correct":0,"exp":"Xavfsiz rivojlantiruvchi muhitda kamsitish va tazyiqqa o‘z vaqtida javob berilib, qadr-qimmat va teng ishtirok himoya qilinadi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:KS.05:002","construct":"KS.05","cognitive":"qollash","difficulty":3,"stem":"Ko‘rish qobiliyati cheklangan o‘quvchi ekran matnini o‘qishda qiynalmoqda. Inklyuziv yondashuv qaysi?","options":["Maqsadni saqlab, foydalanish imkonini beradigan moslashtirish kiritish","O‘quvchini barcha raqamli vazifalardan butunlay ozod qilish","Bir xil sharoitni hamma uchun o‘zgartirmasdan qoldirish","Natija talabini tushuntirmasdan avtomatik yuqori baho qo‘yish"],"correct":0,"exp":"Inklyuzivlik maqsadni bekor qilish emas, ehtiyojga mos va mazmunli teng ishtirok imkonini yaratishdir."},

{"ref":"authored:pedagogy-pdf-corpus:v1:KS.06:001","construct":"KS.06","cognitive":"qollash","difficulty":3,"basis":"1f86e5bb-57ab-41a4-8f88-1e0631c7161e","stem":"O‘qituvchi darsidan keyin “yaxshi o‘tdi” deb yozdi. Refleksiyani kasbiy rivojlanishga aylantirish uchun yana nima kerak?","options":["Natija, kuzatuv va qiyinchilik dalillarini tahlil qilib keyingi qadamni belgilash","Faqat o‘tilgan mavzu nomini qayta yozish","Faqat o‘quvchilar sonini sanab qo‘yish","Darsni tahlil qilmasdan yangi mavzuga o‘tish"],"correct":0,"exp":"Kasbiy refleksiya dalilga tayangan tahlil va aniq rivojlanish qadamiga olib kelishi kerak."},
{"ref":"authored:pedagogy-pdf-corpus:v1:KS.06:002","construct":"KS.06","cognitive":"mulohaza","difficulty":4,"stem":"Hamkasb darsini kuzatgandan keyin o‘qituvchi yangi usulni o‘z darsida sinab ko‘rdi. Kasbiy o‘sish siklini yakunlash uchun keyingi qadam qaysi?","options":["Yangi yondashuv natijasini dalillar bilan qayta baholash","Usulni natijadan qat’i nazar doimiy deb e’lon qilish","Faqat sertifikat nusxasini saqlash","Hamkasb fikrini tekshirmasdan aynan ko‘chirish"],"correct":0,"exp":"Kasbiy rivojlanish o‘rganish → amaliyotga kiritish → natijani qayta baholash sikli bilan davom etadi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:KS.07:001","construct":"KS.07","cognitive":"qollash","difficulty":3,"basis":"7c16312b-9388-42a9-8580-df97e61e5069","stem":"O‘quvchining o‘zlashtirishi pasaydi va muammo uy sharoiti bilan ham bog‘liq bo‘lishi mumkin. Hamkorlikka eng mos yo‘l qaysi?","options":["Ota-ona bilan dalillarni muhokama qilib kelishilgan yordam rejasini tuzish","Ota-onani ayblab faqat ogohlantirish yuborish","Muammoni boshqa o‘quvchilar oldida ochiq muhokama qilish","Faqat bahoni pasaytirib boshqa chorani ko‘rmaslik"],"correct":0,"exp":"Hamkorlik axborot almashish bilan cheklanmaydi; o‘quvchi manfaatiga xizmat qiladigan kelishilgan qaror va choralarni talab qiladi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:KS.07:002","construct":"KS.07","cognitive":"mulohaza","difficulty":4,"stem":"O‘quvchi haqida hamkasb va mutaxassislar bilan ishlaganda qaysi tamoyil eng to‘g‘ri?","options":["Vazifani hal qilish uchun zarur ma’lumotni maxfiylikni saqlab ulashish","O‘quvchi haqidagi barcha ma’lumotni cheklovsiz tarqatish","Muammoni hal qilishda ota-ona fikrini doim chetga surish","Hamkorlik o‘rniga har bir mutaxassis alohida qaror qilishi"],"correct":0,"exp":"Kasbiy hamkorlikda zarur axborot almashiladi, lekin maxfiylik va pedagogik etika saqlanadi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.01:001","construct":"PM.GEN.01","cognitive":"bilish","difficulty":2,"stem":"Didaktika nimani o‘rganishga eng bevosita yo‘naltirilgan?","options":["O‘qitish maqsadi, mazmuni, tamoyili va metodlarini","Faqat maktab binosining texnik holatini","Faqat o‘quvchining tibbiy tashxislarini","Faqat ta’lim muassasasining moliyaviy hisobotini"],"correct":0,"exp":"Didaktika pedagogikaning ta’lim nazariyasiga oid sohasi bo‘lib, o‘qitish maqsadi, mazmuni, tamoyillari, metodlari va shakllarini o‘rganadi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.01:002","construct":"PM.GEN.01","cognitive":"qollash","difficulty":3,"stem":"Tadqiqotchi dars jarayonini oldindan belgilangan mezonlar asosida muntazam qayd etmoqda. Qaysi pedagogik tadqiqot metodi qo‘llanmoqda?","options":["Pedagogik kuzatish","Tasodifiy taxmin","Faqat matematik hisoblash","Hujjatsiz erkin suhbat"],"correct":0,"exp":"Pedagogik kuzatish aniq maqsad va mezon bilan jarayonni izchil hamda tizimli kuzatib dalil to‘plashga xizmat qiladi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.02:001","construct":"PM.GEN.02","cognitive":"qollash","difficulty":3,"basis":"c643cc17-4b41-4007-b56c-7dff252c4b75","stem":"O‘qituvchi mavzuni to‘liq o‘zi tushuntirdi, o‘quvchilar esa fikr bildirish va topshiriq bajarishda deyarli qatnashmadi. Qaysi tamoyil eng ko‘p zaiflashgan?","options":["Onglilik va faollik","Ko‘rgazmalilik","Ilmiylik","Tizimlilik"],"correct":0,"exp":"Onglilik va faollik tamoyili o‘quvchining mazmunni anglab, faol fikrlashi va faoliyatda qatnashishini talab qiladi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.02:002","construct":"PM.GEN.02","cognitive":"qollash","difficulty":3,"stem":"Nazariy qoidani o‘rgangan o‘quvchilar uni real hayotiy masalada qo‘lladilar. Bu holat qaysi tamoyilni eng yaxshi ifodalaydi?","options":["Nazariya va amaliyot birligi","Faqat ko‘rgazmalilik","Faqat yodlash ustuvorligi","Mazmunni tasodifiy tanlash"],"correct":0,"exp":"Nazariya-amaliyot birligi o‘rganilgan tushunchani real yoki amaliy vazifada qo‘llash bilan namoyon bo‘ladi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.03:001","construct":"PM.GEN.03","cognitive":"qollash","difficulty":3,"basis":"89abdcf8-4475-49bf-9b99-cdcf54d0ad1c","stem":"O‘quvchilar byudjet tuzish, resursni tejash va xarajatni rejalashtirish bo‘yicha loyiha bajardilar. Yetakchi tarbiya turi qaysi?","options":["Iqtisodiy tarbiya","Estetik tarbiya","Jismoniy tarbiya","Ekologik tarbiya"],"correct":0,"exp":"Resurs, tejamkorlik va iqtisodiy qarorlarni anglash iqtisodiy tarbiyaning markaziy mazmuniga mos."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.03:002","construct":"PM.GEN.03","cognitive":"qollash","difficulty":3,"stem":"Musiqa va tasviriy san’at namunalarini tahlil qilib go‘zallikni idrok etish va didni rivojlantirish qaysi tarbiya turiga mos?","options":["Estetik tarbiya","Huquqiy tarbiya","Mehnat tarbiyasi","Iqtisodiy tarbiya"],"correct":0,"exp":"Go‘zallikni anglash, estetik his va didni rivojlantirish estetik tarbiyaga tegishli."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.04:001","construct":"PM.GEN.04","cognitive":"qollash","difficulty":3,"basis":"2b7850f3-a0ec-4641-b8ad-c357535522a2","stem":"Darsda avvalgi bilim takrorlandi, yangi mavzu tushuntirildi, amaliy topshiriq bajarildi va yakunda baholash o‘tkazildi. Yetakchi dars turi qaysi?","options":["Aralash dars","Faqat nazorat darsi","Faqat ekskursiya darsi","Faqat laboratoriya darsi"],"correct":0,"exp":"Bir necha didaktik vazifa — takrorlash, yangi bilim, amaliyot va baholash — uyg‘unlashsa aralash darsga mos keladi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.04:002","construct":"PM.GEN.04","cognitive":"qollash","difficulty":3,"stem":"O‘qituvchi darsning mustahkamlash qismida sinf taklifini maqsadga mos deb topib, rejani shu taklifni hisobga olgan holda o‘zgartirdi. Qaysi boshqaruv uslubi ko‘rinadi?","options":["Demokratik uslub","Avtoritar uslub","Liberal uslub","Boshqaruvsiz uslub"],"correct":0,"exp":"Demokratik uslubda o‘quvchi fikri va tashabbusi maqsadga zid bo‘lmasa qaror jarayonida hisobga olinadi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.05:001","construct":"PM.GEN.05","cognitive":"qollash","difficulty":3,"stem":"Sinfda ikki o‘quvchi nizolashdi va voqea talqinlari turlicha. Sinf rahbarining eng asosli birinchi harakati qaysi?","options":["Tomonlarni tinglab sabab va dalillarni xolis aniqlash","Bir tomonni darhol aybdor deb e’lon qilish","Barcha sinf oldida shaxsiy ma’lumotlarni oshkor qilish","Nizoni butunlay e’tiborsiz qoldirish"],"correct":0,"exp":"Sinf rahbari nizoni xolis o‘rganadi, tomonlarni tinglaydi va keyin kelishuv yoki zarur yordam choralarini tashkil etadi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.05:002","construct":"PM.GEN.05","cognitive":"mulohaza","difficulty":4,"stem":"Sinf rahbari ota-onalar bilan faqat muammo chiqqanda bog‘lanadi. Qaysi o‘zgarish hamkorlikni yaxshilaydi?","options":["Muntazam, dalil va yechimga tayangan muloqotni yo‘lga qo‘yish","Faqat salbiy holatlarda keskin ogohlantirish yuborish","Ota-onani o‘quvchi rivoji haqidagi qarorlardan chetlatish","Barcha suhbatlarni boshqa o‘quvchilar oldida o‘tkazish"],"correct":0,"exp":"Samarali sinf rahbarligi ota-ona bilan muntazam, yechimga yo‘naltirilgan va maxfiylikni saqlaydigan hamkorlikni talab qiladi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.06:001","construct":"PM.GEN.06","cognitive":"qollash","difficulty":3,"basis":"853a5583-dc9f-4480-8dc7-c18b24a4a7f6","stem":"O‘quvchi tartibni buzdi. O‘qituvchi uni kamsitmasdan, muloyim va talabchan tarzda diqqatini darsga qaytardi. Qaysi tushuncha eng mos?","options":["Pedagogik takt","Faqat akademik qobiliyat","Faqat darsning texnik vositasi","Summativ baholash"],"correct":0,"exp":"Pedagogik takt — kasbiy axloq tamoyillarini konkret muloqot vaziyatida me’yor va nazokat bilan qo‘llashdir."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.06:002","construct":"PM.GEN.06","cognitive":"bilish","difficulty":2,"stem":"O‘qituvchining yuz va ko‘z ifodasi orqali hissiy holatni ifodalashi nima deyiladi?","options":["Mimika","Pantomimika","Diagnostika","Didaktika"],"correct":0,"exp":"Mimika yuz va ko‘z ifodasi orqali holatni ifodalash bilan bog‘liq; pantomimika esa gavda va harakatlarga taalluqli."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.07:001","construct":"PM.GEN.07","cognitive":"qollash","difficulty":3,"basis":"3174043b-1bd0-495c-9685-a173e6908a1c","stem":"O‘qituvchi mavzuni tushunarli bayon qila oladi, ammo o‘z fanidagi murakkab masalani yecha olmaydi. Qaysi qobiliyatni rivojlantirish zarur?","options":["Akademik (bilish) qobiliyati","Perseptiv qobiliyat","Tashkilotchilik qobiliyati","Kommunikativ qobiliyat"],"correct":0,"exp":"Akademik/bilish qobiliyati o‘qitilayotgan fan mazmunini chuqur bilish va murakkab masalalarni egallash bilan bog‘liq."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.07:002","construct":"PM.GEN.07","cognitive":"qollash","difficulty":3,"stem":"O‘qituvchi o‘quvchining ikkilanishi va noverbal belgilaridan tushunmovchilikni sezdi. Qaysi qobiliyat yetakchi?","options":["Perseptiv qobiliyat","Akademik qobiliyat","Tashkilotchilik qobiliyati","Kinestetik qobiliyat"],"correct":0,"exp":"Perseptiv qobiliyat o‘quvchining ichki holati, qiyinchiligi va ehtiyojini nozik belgilar orqali anglashga xizmat qiladi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.08:001","construct":"PM.GEN.08","cognitive":"qollash","difficulty":3,"stem":"O‘qituvchi tayyor javob bermay, o‘quvchilar oldiga ziddiyatli vaziyat qo‘ydi va yechimni izlashga yo‘naltirdi. Qaysi texnologiya eng mos?","options":["Muammoli ta’lim","Faqat reproduktiv mashq","Faqat nazorat texnologiyasi","Faqat ma’ruza yozdirish"],"correct":0,"exp":"Muammoli ta’lim bilishdagi muammo yoki ziddiyatni qo‘yib, o‘quvchini yechimni fikrlash orqali topishga yo‘naltiradi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.GEN.08:002","construct":"PM.GEN.08","cognitive":"bilish","difficulty":3,"stem":"Muayyan fan bo‘yicha darslar tizimini texnologik model va xarita orqali loyihalash qaysi darajaga mos?","options":["Xususiy-metodik (mezo) daraja","Umumpedagogik (makro) daraja","Lokal (mikro) daraja","Pedagogik texnologiyadan tashqari daraja"],"correct":0,"exp":"Xususiy-metodik yoki mezo daraja muayyan fan/kursni o‘qitish jarayonini loyihalash va rejalashtirishga tegishli."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.MET.01:001","construct":"PM.MET.01","cognitive":"qollash","difficulty":3,"stem":"Algoritm mavzusida o‘quvchilar kodni yodlaydi, lekin qadamlar mantiqini tushuntira olmaydi. Qaysi metodik o‘zgarish maqsadga muvofiq?","options":["Algoritmni qadam, blok-sxema va izlash faoliyati bilan tushuntirish","Kod namunalarini faqat ko‘proq yodlatish","Xatolarni muhokama qilmasdan tayyor javob berish","Mavzuni faqat nazariy ta’rif bilan cheklash"],"correct":0,"exp":"Informatika metodikasida vosita o‘quvchining bajarishi kerak bo‘lgan fikrlash va amaliy harakatiga mos tanlanadi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.MET.01:002","construct":"PM.MET.01","cognitive":"mulohaza","difficulty":4,"stem":"Dasturlash darsida maqsad xatoni topish ko‘nikmasini rivojlantirish. Qaysi yondashuv bunga ko‘proq mos?","options":["Xato kodni tahlil qildirish va tuzatish sababini izohlatish","Har bir xatoga tayyor to‘g‘ri kodni darhol berish","Faqat sintaksis ta’riflarini ko‘chirtirish","Natijani tekshirmasdan kod yozishni tugatish"],"correct":0,"exp":"Debugging ko‘nikmasi xato sababini aniqlash, tekshirish va asoslangan tuzatish orqali shakllanadi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.MET.02:001","construct":"PM.MET.02","cognitive":"qollash","difficulty":3,"stem":"O‘qituvchi muammoni qo‘yadi, sabablarni ko‘rsatadi va yechimni o‘zi bosqichma-bosqich asoslab beradi. Qaysi metod qo‘llanmoqda?","options":["Muammoli bayon","Evristik metod","Tadqiqot metodi","Faqat amaliy mashq"],"correct":0,"exp":"Muammoli bayonda o‘qituvchi muammoni yaratadi va yechimga boruvchi fikrlash jarayonini o‘zi mantiqiy izchillikda namoyish qiladi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.MET.02:002","construct":"PM.MET.02","cognitive":"qollash","difficulty":3,"stem":"O‘qituvchi tayyor yechimni bermay, yo‘naltiruvchi savollar bilan o‘quvchini xulosaga olib kelmoqda. Qaysi metod eng mos?","options":["Evristik metod","Muammoli bayon","Faqat reproduktiv metod","Faqat nazorat metodi"],"correct":0,"exp":"Evristik yondashuvda o‘qituvchi yo‘naltiruvchi savollar orqali o‘quvchini mustaqil yechimga yaqinlashtiradi."},

{"ref":"authored:pedagogy-pdf-corpus:v1:PM.MET.03:001","construct":"PM.MET.03","cognitive":"mulohaza","difficulty":4,"stem":"Informatika darsida amaliy topshiriq natijalari past chiqdi. Pedagogik qarorni baholashning eng to‘g‘ri boshlanishi qaysi?","options":["Maqsad va natija dalilini aniqlab, muammo sababini ajratish","Darhol barcha metod va materiallarni almashtirish","Natijani tahlil qilmasdan o‘quvchini ayblash","Keyingi darsda aynan shu jarayonni o‘zgartirmay takrorlash"],"correct":0,"exp":"Asoslangan qaror maqsad va dalildan boshlanadi; keyin muammo sababi aniqlanib, maqsadli o‘zgarish tanlanadi."},
{"ref":"authored:pedagogy-pdf-corpus:v1:PM.MET.03:002","construct":"PM.MET.03","cognitive":"qollash","difficulty":3,"stem":"Guruhli dasturlash ishida faqat bir o‘quvchi kod yozmoqda. Qaysi o‘zgarish qarorni yaxshiroq asoslaydi?","options":["Rollarni va har bir o‘quvchining individual tekshiriladigan dalilini belgilash","Natijani faqat eng tez yozgan o‘quvchi nomiga rasmiylashtirish","Qolgan o‘quvchilarni faqat kuzatuvchi sifatida qoldirish","Guruh vazifasini maqsadsiz ravishda uzunroq qilish"],"correct":0,"exp":"Pedagogik qaror muammo sababiga mos bo‘lishi kerak; rollar va individual dalil faol ishtirokni tekshirish imkonini beradi."}
]
$json$::jsonb)
  loop
    if exists(select 1 from public.questions where source_reference=item->>'ref') then
      continue;
    end if;

    select c.id,c.subject_id,c.group_code
      into v_construct,v_subject,v_group
      from public.constructs c
     where c.code=item->>'construct' and c.is_active;

    if v_construct is null then
      raise exception 'pedagogy corpus construct missing: %',item->>'construct';
    end if;

    select l.id into v_lesson
      from public.lesson_constructs lc
      join public.lessons l on l.id=lc.lesson_id
     where lc.construct_id=v_construct
       and l.status='published'::public.content_status
       and l.slug=case item->>'construct'
         when 'KS.01' then 'oquv-jarayonini-rejalashtirish'
         when 'KS.02' then 'talim-samaradorligini-taminlash'
         when 'KS.03' then 'ozlashtirishni-baholash-va-qayta-aloqa'
         when 'KS.04' then 'tarbiyaviy-faoliyatni-tashkil-etish'
         when 'KS.05' then 'xavfsiz-rivojlantiruvchi-talim-muhiti'
         when 'KS.06' then 'oz-ozini-rivojlantirish-va-kasbiy-osish'
         when 'KS.07' then 'hamkasblar-va-ota-onalar-bilan-hamkorlik'
         when 'PM.GEN.01' then 'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi'
         when 'PM.GEN.02' then 'pedagogikaning-asosiy-tamoyillari'
         when 'PM.GEN.03' then 'tarbiya-va-uning-turlari'
         when 'PM.GEN.04' then 'dars-turlari-rejalashtirish-va-sinfni-boshqarish'
         when 'PM.GEN.05' then 'sinf-rahbari-hujjatlar-jamoa-va-ota-ona'
         when 'PM.GEN.06' then 'pedagogik-etika-nutq-texnika-va-takt'
         when 'PM.GEN.07' then 'pedagogik-qobiliyat-va-uning-turlari'
         when 'PM.GEN.08' then 'talim-texnologiyalari-va-vaziyatga-mos-tanlov'
         when 'PM.MET.01' then 'informatika-oqitish-yondashuvlari-va-metodikasi'
         when 'PM.MET.02' then 'oqitish-usullari-va-metodlarini-farqlash'
         when 'PM.MET.03' then 'talimiy-vaziyat-va-pedagogik-qarorni-baholash'
       end;

    if v_lesson is null then
      raise exception 'pedagogy corpus canonical lesson missing: %',item->>'construct';
    end if;

    v_question:=gen_random_uuid();
    insert into public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
    ) values(
      v_question,v_subject,v_construct,v_group,'Y1'::public.question_format,
      (item->>'cognitive')::public.cognitive_level,(item->>'difficulty')::int,
      item->>'stem','[]'::jsonb,false,'review'::public.content_status,null,
      item->>'ref',v_lesson
    );

    v_correct:=(item->>'correct')::int;
    for v_i in 0..3 loop
      v_option:=gen_random_uuid();
      insert into public.question_options(id,question_id,content_md,order_idx)
      values(v_option,v_question,item->'options'->>v_i,v_i);

      if v_i=v_correct then
        insert into public.question_keys(question_id,payload,explanation_md)
        values(v_question,jsonb_build_object('correct_option_id',v_option),item->>'exp');
      end if;
    end loop;

    if coalesce(item->>'basis','')<>'' then
      v_basis:=(item->>'basis')::uuid;
      update public.pedagogy_pdf_source_candidates
         set linked_question_id=coalesce(linked_question_id,v_question),
             answer_key_status=case when answer_key_status='source_marker_unverified'
                                    then 'independently_verified' else answer_key_status end,
             verification_basis=case
               when answer_key_status='source_marker_unverified'
               then 'Source answer independently checked against the canonical source lesson before authoring a new review item.'
               else verification_basis
             end,
             reviewed_at=coalesce(reviewed_at,now())
       where id=v_basis
         and duplicate_of_candidate_id is null
         and answer_key_status<>'conflict';
    end if;
  end loop;

  if (select count(*) from public.questions where source_reference like 'authored:pedagogy-pdf-corpus:v1:%')<>36 then
    raise exception 'pedagogy corpus review bank expected 36 items';
  end if;

  if exists(
    select 1
    from public.questions q
    where q.source_reference like 'authored:pedagogy-pdf-corpus:v1:%'
      and (q.status<>'review'::public.content_status
        or q.source_lesson_id is null
        or not exists(select 1 from public.question_keys k where k.question_id=q.id)
        or (select count(*) from public.question_options o where o.question_id=q.id)<>4
        or not exists(
          select 1 from public.lesson_constructs lc
          where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
        ))
  ) then
    raise exception 'pedagogy corpus review bank invariant failed';
  end if;
end
$bank$;

commit;
