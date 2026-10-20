/** TASK-344: source-complete algorithm books. */
import type { TheoryBlock } from '../topicContent'
import { buildSourceCompleteBook, type SourceCompleteBookSpec } from './sourceCompleteBook'

const algorithmSource = 'Manba izi: B. Boltayev va boshq., “Informatika va axborot texnologiyalari”, 9-sinf (2020), III bob, bosma 27–45-betlar (PDF 28–46). Algoritm xossalari, tasvirlash usullari, chiziqli, tarmoqlanuvchi, takrorlanuvchi va aralash algoritmlar shu bob bilan solishtirildi.'
const lectureSource = 'Qo‘shimcha tekshiruv: “Ma’ruza (Tayyor)”, 8-§ “Algoritmlash asoslari”, PDF 46–55. Misollar qayta bayon qilindi; darslikdagi katta matn ko‘chirilmagan.'

const books: Record<string, SourceCompleteBookSpec> = {
  'M06.01': {
    goal: 'Algoritmni oddiy ko‘rsatmadan farqlash; ijrochi, buyruqlar tizimi, boshlang‘ich ma’lumot va natijani aniqlash; aniqlik, diskretlik, tushunarlilik, natijaviylik va ommaviylik xossalarini misolda tekshirish.',
    intro: 'Algoritm — ma’lum turdagi masalani yechishga olib boradigan, ijrochi tushunadigan aniq va chekli ko‘rsatmalar ketma-ketligi. Taom retsepti, yo‘l-yo‘riq yoki dastur algoritmga o‘xshashi mumkin, lekin xossalar bajarilmasa natija ishonchli chiqmaydi.',
    keywords: ['algoritm', 'ijrochi', 'buyruqlar tizimi', 'diskretlik', 'aniqlik', 'natijaviylik', 'ommaviylik'],
    sections: [
      {
        title: 'Algoritm, ijrochi va muhit',
        explanation: 'Algoritm buyruqlarini bajaradigan shaxs, qurilma yoki dastur **ijrochi** deyiladi. Ijrochi faqat o‘z buyruqlar tizimidagi amallarni bajaradi va muhit holatiga ta’sir qiladi. Bir ijrochi uchun tushunarli buyruq boshqasiga tushunarsiz bo‘lishi mumkin.',
        example: 'Toshbaqa ijrochisi OLDINGA 50 va O‘NGGA 90 ni bajaradi; “chiroyli shakl chiz” bu ijrochi uchun aniq elementar buyruq emas.',
        trap: 'Algoritm faqat kompyuter dasturi emas. Inson ham aniq yo‘riqnomani ijrochi sifatida bajarishi mumkin.',
        task: 'Choy tayyorlash va robotni uch qadam oldinga yuritish vazifalarida ijrochi, muhit va uchta mumkin buyruqni yozing.',
      },
      {
        title: 'Boshlang‘ich ma’lumot va natija',
        explanation: 'Algoritm qanday qiymatlarni qabul qilishi va nimani qaytarishi oldindan belgilanadi. Kirishning turi, birligi va mumkin oralig‘i aniq bo‘lsa, algoritm tekshiriladi. Natija son, matn, qaror, chizma yoki muhitning yangi holati bo‘lishi mumkin.',
        example: 'To‘g‘ri to‘rtburchak yuzasi algoritmi a va b musbat uzunliklarni qabul qiladi, S=a·b ni shu birlikning kvadratida chiqaradi.',
        trap: 'Kirish birligini ko‘rsatmaslik santimetr va metrni aralashtirishi mumkin. Formula to‘g‘ri, yakuniy qiymat baribir noto‘g‘ri chiqadi.',
        task: 'Uch sonning eng kattasini topish algoritmi uchun kirish, chiqish va bitta noto‘g‘ri kirish holatini yozing.',
      },
      {
        title: 'Diskretlik va tushunarlilik',
        explanation: '**Diskretlik** yechimni alohida, tartibli qadamlarga bo‘lishni anglatadi. **Tushunarlilik** esa har qadam ijrochi buyruqlar tizimiga mos bo‘lishini talab qiladi. Qadamlar orasidagi holat o‘zgarishi kuzatilishi kerak.',
        example: '“Sonni kirit; 2 ga ko‘paytir; 5 ni qo‘sh; natijani chiqar” — diskret qadamlar. “Javobni top” esa ichki amallarni yashiradi.',
        trap: 'Ko‘p qadamning o‘zi sifat belgisi emas; qadamlar tartibsiz yoki ijrochiga noma’lum bo‘lsa algoritm bajarilmaydi.',
        task: '“Xonani tartibga keltir” ko‘rsatmasini kamida beshta ijrochi tushunadigan diskret qadamga ajrating.',
      },
      {
        title: 'Aniqlik va determinlanganlik',
        explanation: '**Aniqlik** har buyruq bir ma’noli bo‘lishini, bir xil shartda ijrochi keyingi qadamni bilishini talab qiladi. “Yetarlicha”, “tezroq”, “bir oz” kabi o‘lchovsiz so‘zlar algoritmni noaniq qiladi. Tasodif ishlatilsa ham uning tanlash qoidasi va chegarasi beriladi.',
        example: '“Harorat 30°C dan katta bo‘lsa ventilyatorni yoq, aks holda o‘chir” aniq. “Issiq bo‘lsa yoq”da issiqning chegarasi berilmagan.',
        trap: 'Aniqlik natija har doim bir xil degani emas; turli kirish turli natija berishi mumkin.',
        task: '“Son katta bo‘lsa xabar ber” ko‘rsatmasini aniq chegara va natija bilan qayta yozing.',
      },
      {
        title: 'Cheklilik va natijaviylik',
        explanation: 'Algoritm qabul qilinadigan kirishlarda chekli qadamlardan keyin to‘xtab, vazifaga mos natija berishi kerak. Takrorlashda tugash sharti va unga yaqinlashish mavjud bo‘lsin. Cheksiz sikl rejalashtirilmagan bo‘lsa natijaviylik buziladi.',
        example: 'n dan 0 gacha kamaytiruvchi siklda n har qadamda 1 ga kamayadi; n≥0 bo‘lsa chekli vaqtda 0 ga yetadi.',
        trap: 'WHILE x>0 ichida x o‘zgarmasa, boshlang‘ich x musbat bo‘lganda sikl tugamaydi.',
        task: 'i=1; WHILE i<10: PRINT i algoritmiga tugash uchun qaysi qadam yetishmayotganini yozing.',
      },
      {
        title: 'Ommaviylik va to‘g‘rilik sohasi',
        explanation: '**Ommaviylik** algoritm birgina misolga emas, ma’lum sinfdagi turli kirishlarga ishlashini anglatadi. Bu “barcha mumkin obyekt” degani emas; amal qilish sohasi va cheklovlari beriladi. To‘g‘rilik oddiy, chegara va noto‘g‘ri kirishlarda tekshiriladi.',
        example: 'Kvadrat yuzasi S=a² algoritmi barcha musbat a lar uchun umumiy. Manfiy uzunlik kiritilsa algoritm uni rad etishi yoki cheklovni ko‘rsatishi kerak.',
        trap: 'Bir misolda to‘g‘ri natija ommaviylikni isbotlamaydi. Turli va chegaraviy qiymatlar zarur.',
        task: 'Ikki son yig‘indisi algoritmi uchun uch oddiy, ikki chegaraviy va bitta noto‘g‘ri kirish misolini tuzing.',
      },
    ],
    answers: '2) kirish uchta son, chiqish eng katta son; masalan son bo‘lmagan qiymat rad etiladi. 4) masalan “son 100 dan katta bo‘lsa ‘katta’ deb chiqar”. 5) i ni o‘zgartiruvchi i=i+1 qadami. Qolgan mashqlarda ijrochi, buyruq, chegara va natija aniqligi baholanadi.',
    summary: 'Algoritm ijrochi tushunadigan aniq, diskret va chekli qadamlar orqali natijaga olib keladi. Uning kirish-chiqishi, buyruqlar tizimi va amal qilish sohasi ko‘rsatiladi. Ommaviylik bir sinfdagi turli ma’lumotlarga ishlashni, natijaviylik esa tugash va foydali natijani talab qiladi.',
    sources: [algorithmSource, lectureSource],
  },
  'M06.02': {
    goal: 'Chiziqli, tarmoqlanuvchi, takrorlanuvchi va aralash algoritmlarni boshqaruv oqimi bo‘yicha farqlash; vazifaga mos tuzilmani tanlash va uning bajarilish izini tuzish.',
    intro: 'Algoritm turi buyruqlarning qaysi tartibda bajarilishini ko‘rsatadi. Chiziqli oqimda har qadam bir marta, tarmoqlanishda shartga ko‘ra yo‘llardan biri, siklda esa qadamlar takroran bajariladi. Amaliy masala ko‘pincha bu tuzilmalarni birlashtiradi.',
    keywords: ['chiziqli', 'tarmoqlanuvchi', 'to‘liq tarmoq', 'to‘liqsiz tarmoq', 'sikl', 'takrorlash', 'aralash algoritm'],
    sections: [
      {
        title: 'Chiziqli algoritm',
        explanation: 'Buyruqlar yuqoridan pastga berilgan tartibda bir martadan bajariladi; yo‘l tanlash va orqaga qaytish yo‘q. Hisoblash formulalari, ketma-ket kiritish–hisoblash–chiqarish ishlari bunga misol.',
        example: 'a va b ni kirit; S=a·b ni hisobla; S ni chiqar. a=4,b=7 bo‘lsa iz: kirish 4,7 → S=28 → chiqish 28.',
        trap: 'Formula ichidagi ko‘paytirish va qo‘shish amallari algoritmni avtomatik tarmoqlanuvchi qilmaydi.',
        task: 'Doira uzunligini topish uchun to‘rt bosqichli chiziqli algoritm yozing.',
      },
      {
        title: 'To‘liq tarmoqlanish',
        explanation: 'Shart tekshiriladi va rost/yolg‘on natijaga ko‘ra ikki yo‘ldan biri bajariladi: IF shart THEN A ELSE B. Har bajarilishda faqat bitta tarmoq tanlanadi, keyin umumiy davomga qaytiladi.',
        example: 'Agar ball≥60 bo‘lsa “o‘tdi”, aks holda “o‘tmadi”. ball=75 da birinchi, 42 da ikkinchi tarmoq ishlaydi.',
        trap: 'Ikki mustaqil IF doimo IF–ELSE bilan teng emas; ikkala shart bir vaqtda rost bo‘lsa ikki mustaqil blok ham bajarilishi mumkin.',
        task: 'Son musbat yoki musbat emasligini chiqaradigan to‘liq tarmoqlanish yozing.',
      },
      {
        title: 'To‘liqsiz va ko‘p tarmoqli tanlash',
        explanation: 'To‘liqsiz tarmoqda shart rost bo‘lsa amal bajariladi, yolg‘onda hech narsa qilinmaydi. Ko‘p variantda shartlar izchil tekshiriladi; tartib muhim, chunki birinchi mos tarmoq tanlanishi mumkin.',
        example: 'Agar harorat<0 bo‘lsa “muzlash xavfi” xabari — to‘liqsiz tarmoq. Baho A/B/C uchun chegaralar kattadan kichikka tekshiriladi.',
        trap: 'Chegaralarni noto‘g‘ri tartibda yozish yuqori ballni past toifaga tushirishi mumkin: avval ball≥60 tekshirilib qolsa ball=95 ham shu tarmoqda qoladi.',
        task: '90–100 A, 75–89 B, 60–74 C, qolgan F bo‘lgan ko‘p tarmoqli algoritm tuzing.',
      },
      {
        title: 'Parametrli takrorlash',
        explanation: 'Takrorlanish soni oldindan ma’lum bo‘lsa parametrli sikl qulay: FOR i=1 TO n. Hisoblagich boshlang‘ich qiymat, chegara va qadam bilan o‘zgaradi. Sikl tanasi har iteratsiyada bajariladi.',
        example: '1 dan 5 gacha yig‘indi: s=0; i=1..5 uchun s=s+i. Iz: 1,3,6,10,15.',
        trap: 'Boshlang‘ich s qiymatini bermaslik yoki chegarani noto‘g‘ri kiritish bir iteratsiyani yo‘qotishi mumkin.',
        task: '2,4,6,8,10 sonlarini chiqaradigan parametrli sikl va uning qadam qiymatini yozing.',
      },
      {
        title: 'Shartli takrorlash',
        explanation: 'Takrorlanish soni oldindan noma’lum bo‘lsa shart tekshiriladi. Old shartli WHILE tanaga kirishdan oldin, keyin shartli tuzilma tanadan so‘ng tekshiradi. Sikl holati tugashga yaqinlashishi kerak.',
        example: 'Parol to‘g‘ri bo‘lmaguncha qayta so‘rashda urinishlar soni oldindan aniq emas; lekin xavfsizlik uchun maksimal urinish cheklovi qo‘shiladi.',
        trap: 'Shart boshidan yolg‘on bo‘lsa WHILE tanasi nol marta bajarilishi mumkin; keyin shartli sikl kamida bir marta bajariladi.',
        task: 'n musbat sonini 2 ga bo‘lib, n≤1 bo‘lguncha necha qadam ketishini sanaydigan sikl g‘oyasini yozing.',
      },
      {
        title: 'Aralash va ichma-ich algoritm',
        explanation: 'Haqiqiy vazifada ketma-ketlik, tarmoq va sikl birga ishlaydi. Sikl ichidagi IF har iteratsiyada shartni tekshiradi; ichma-ich siklda ichki sikl tashqi siklning har qadamida to‘liq bajariladi.',
        example: '1..10 sonlari orasida faqat juftlar yig‘indisi: s=0; har i uchun agar i mod 2=0 bo‘lsa s=s+i. Natija 30.',
        trap: 'Ichma-ich siklda bajarilish sonlari qo‘shilmay, ko‘pincha ko‘payadi: n×m.',
        task: '3 qator va 4 ustunli kataklarning har biriga koordinata chiqarish uchun ichma-ich sikl yozing; PRINT necha marta bajariladi?',
      },
    ],
    answers: '1) r ni kirit; π ni tanla; L=2πr; L ni chiqar. 2) IF x>0 THEN “musbat” ELSE “musbat emas”. 4) FOR i=2 TO 10 STEP 2. 6) 3×4=12 marta. Qolgan mashqlarda chegara va tarmoq tartibi tekshiriladi.',
    summary: 'Chiziqli algoritm ketma-ket, tarmoqlanuvchi algoritm shart asosida, sikl esa buyruqlarni takrorlab bajaradi. To‘liq/to‘liqsiz tarmoq va parametrli/shartli sikl vazifaga qarab tanlanadi. Aralash algoritm bir necha tuzilmani aniq oqimda birlashtiradi.',
    sources: [algorithmSource, lectureSource],
  },
  'M06.03': {
    goal: 'Bir algoritmni tabiiy til, formula, jadval, blok-sxema va psevdokodda ifodalash; asosiy blok-sxema shakllarini to‘g‘ri qo‘llash va ifodalar orasidagi mazmunni saqlash.',
    intro: 'Tasvirlash usuli algoritmning o‘zi emas, uni odam yoki kompyuterga tushuntirish vositasidir. Tabiiy til qulay, ammo noaniq bo‘lishi mumkin; blok-sxema oqimni ko‘rsatadi; psevdokod esa dasturlash tiliga bog‘lanmasdan bajarilish tartibini yozadi.',
    keywords: ['tabiiy til', 'blok-sxema', 'psevdokod', 'boshlash/tugatish', 'kiritish/chiqarish', 'jarayon', 'shart', 'oqim chizig‘i'],
    sections: [
      {
        title: 'Tabiiy til va formula',
        explanation: 'Oddiy masala qadamlar bilan tabiiy tilda yoziladi. Hisob bog‘lanishi formula bilan ixcham ko‘rsatiladi. Tabiiy tilda tartib raqami, fe’l va aniq o‘lchov ishlatish noaniqlikni kamaytiradi.',
        example: '“a ni kirit; a² ni hisobla; natijani chiqar” va S=a² bir-birini to‘ldiradi: formula hisobni, qadamlar bajarilish tartibini beradi.',
        trap: 'Formula kirish va chiqarish tartibini to‘liq ko‘rsatmasligi mumkin. Faqat formulani algoritmning barcha qismi deb bo‘lmaydi.',
        task: 'Selsiydan Fahrenheitga o‘tkazish F=1.8C+32 formulasini tabiiy til qadamlariga aylantiring.',
      },
      {
        title: 'Boshlash/tugatish va oqim chizig‘i',
        explanation: 'Blok-sxemada boshlash va tugatish odatda terminal shakli bilan, bajarilish yo‘nalishi esa strelkali oqim chizig‘i bilan ko‘rsatiladi. Har sxemada oqimning qayerdan boshlanishi va qayerda yakunlanishi aniq bo‘lsin.',
        example: 'Boshlash → sonni kiritish → natijani hisoblash → natijani chiqarish → Tugatish.',
        trap: 'Strelkasiz tutashgan bloklar bajarilish yo‘nalishini noaniq qoldiradi. Tugatishsiz sikl tasodifan cheksiz ko‘rinishi mumkin.',
        task: 'Ikki son yig‘indisi uchun bloklar tartibini nomlari bilan yozing.',
      },
      {
        title: 'Kiritish/chiqarish va jarayon bloklari',
        explanation: 'Kiritish/chiqarish parallelogramm, hisoblash yoki qiymat berish jarayoni to‘g‘ri to‘rtburchak bilan ifodalanadi. “x ni kiritish” va “x=x+1” vazifasi har xil blokka tegishli.',
        example: 'Parallelogramm: READ a,b; jarayon: s=a+b; parallelogramm: PRINT s.',
        trap: 'Hisoblashni kiritish blokiga yoki foydalanuvchiga natija ko‘rsatishni jarayon blokiga joylashtirish sxema ma’nosini buzadi.',
        task: 'P=2(a+b) uchun qaysi yozuvlar kiritish, jarayon va chiqarish blokiga tushishini ajrating.',
      },
      {
        title: 'Shart rombi va tarmoqlar',
        explanation: 'Romb ichida rost/yolg‘on qiymatli shart yoziladi; kamida ikki chiqish “ha/yo‘q” yoki “1/0” bilan belgilanadi. Har tarmoqdagi amallar tugagach umumiy oqimga qaytishi yoki alohida tugashi mumkin.',
        example: 'x≥0? Ha → “manfiy emas”; Yo‘q → “manfiy”. Keyin ikkala tarmoq Tugatishga ulanadi.',
        trap: 'Romb ichiga “x ni 2 ga ko‘paytir” kabi hisob amalini yozish to‘g‘ri emas; u rost/yolg‘on savol bo‘lishi kerak.',
        task: 'Sonning juftligini aniqlash uchun romb sharti va ikki chiqishdagi xabarlarni yozing.',
      },
      {
        title: 'Siklni blok-sxemada ifodalash',
        explanation: 'Takrorlashda boshlang‘ich qiymat, shart, tana va yangilash qadamidan oqim yana shartga qaytadi. Shart yolg‘on bo‘lganda sikldan chiqiladi. Parametrli sikl ham shu to‘rtta qism orqali ochib ko‘rsatilishi mumkin.',
        example: 'i=1 → i≤5? → PRINT i → i=i+1 → shartga qaytish; “yo‘q” tarmog‘i Tugatishga boradi.',
        trap: 'Yangilash blokini unutish i qiymatini o‘zgartirmaydi va sikl tugamasligi mumkin.',
        task: '1 dan n gacha yig‘indi blok-sxemasining boshlang‘ich qiymatlari, sharti, tanasi va yangilashini yozing.',
      },
      {
        title: 'Psevdokod va izchillik tekshiruvi',
        explanation: 'Psevdokod READ, SET, IF/ELSE, FOR/WHILE, PRINT kabi aniq, lekin tilga bog‘lanmagan yozuvlardan foydalanadi. Bir masalaning psevdokodi va blok-sxemasi bir xil kirish, shart, yangilash va chiqishga ega bo‘lishi kerak.',
        example: 'READ n; s←0; FOR i←1 TO n DO s←s+i; END FOR; PRINT s. n=3 izida s:0→1→3→6.',
        trap: 'Psevdokodda o‘zgaruvchi qiymatini yangilamaslik yoki END IF/END WHILE chegarasini noaniq yozish boshqaruv oqimini buzadi.',
        task: 'Ikki sonning kichigini chiqarish uchun psevdokod yozing va shu algoritmning blok-sxema bloklarini tartib bilan sanang.',
      },
    ],
    answers: '1) C ni kirit; 1.8·C+32 ni hisobla; F ni chiqar. 2) Boshlash, READ a,b, s=a+b, PRINT s, Tugatish. 4) x mod 2=0? Ha→“juft”, Yo‘q→“toq”. 5) s=0,i=1; i≤n; s=s+i; i=i+1. 6) READ a,b; IF a<b THEN PRINT a ELSE PRINT b.',
    summary: 'Tabiiy til va formula mazmunni, blok-sxema oqimni, psevdokod esa bajariladigan tuzilmani ifodalaydi. Terminal, kiritish/chiqarish, jarayon va shart bloklari vazifasiga mos qo‘llanadi. Bir algoritm turli ko‘rinishda berilganda kirish, shart, qadam va natija saqlanishi shart.',
    sources: [algorithmSource, lectureSource],
  },
  'M06.04': {
    goal: 'Algoritmni bajarilish izi, normal va chegaraviy testlar, invariant hamda tugash sharti bilan tekshirish; ikki yechimni to‘g‘rilik, qadamlar soni, xotira va tushunarlilik mezonlari bo‘yicha taqqoslash.',
    intro: 'Algoritm yozilgach ish tugamaydi. Uni qo‘lda izlash, turli kirishlarda test qilish, tugashini va natija shartga mosligini tekshirish zarur. “Eng maqbul” yechim vazifaga bog‘liq: ba’zan tezlik, ba’zan xotira, sodda tushuntirish yoki xavfsizlik muhimroq.',
    keywords: ['desk check', 'trace table', 'test case', 'chegara', 'invariant', 'tugash', 'samaradorlik', 'optimallashtirish'],
    sections: [
      {
        title: 'Qo‘lda bajarish va iz jadvali',
        explanation: 'Har qadamdan keyin o‘zgaruvchi qiymati jadvalga yoziladi. Bu usul shart qaysi tarmoqni tanlagani, sikl nechta aylangani va qiymat qayerda buzilganini ko‘rsatadi. Iz jadvali dastur kodi bo‘lmasa ham psevdokod uchun ishlaydi.',
        example: 's=0; FOR i=1..3 s=s+2i. Iz: i=1,s=2; i=2,s=6; i=3,s=12. Yakuniy natija 12.',
        trap: 'Faqat yakuniy qiymatni yozish oraliq xatoni ko‘rsatmaydi. Har o‘zgaruvchi va iteratsiya alohida qayd etilsin.',
        task: 'p=1; i=1..4 uchun p=p·i algoritmiga iz jadvali tuzing.',
      },
      {
        title: 'Normal, chegara va noto‘g‘ri test',
        explanation: 'Normal test odatiy kirishni, chegara test ruxsat oralig‘ining eng kichik/katta va burilish qiymatini, noto‘g‘ri test esa qabul qilinmasligi kerak bo‘lgan qiymatni tekshiradi. Kutilgan natija oldindan yoziladi.',
        example: '0–100 ball: 72 normal; 0,59,60,100 chegara; -1,101 va “sakson” noto‘g‘ri testlar.',
        trap: 'Faqat musbat va qulay sonlarni sinash nol, manfiy, bo‘sh yoki maksimal qiymat xatolarini yashiradi.',
        task: 'Oy raqamini (1–12) qabul qiladigan algoritm uchun 2 normal, 4 chegara va 3 noto‘g‘ri test yozing.',
      },
      {
        title: 'Tugash va sikl holati',
        explanation: 'Sikl tugashi uchun shart bir payt yolg‘onga aylanishi va holat unga yaqinlashishi kerak. Variant qiymat deb har iteratsiyada kamayib, pastdan chegaralangan miqdorni tanlash mumkin. Boshlang‘ich holat ham tekshiriladi.',
        example: 'WHILE n>0: n=n-2. n musbat butun bo‘lsa n kamayadi va chekli qadamda 0 yoki manfiyga o‘tadi. n o‘zgarmasa tugash isboti yo‘q.',
        trap: 'Shartning o‘zi mavjudligi sikl tugashini kafolatlamaydi; tanadagi yangilash yo‘nalishi muhim.',
        task: 'WHILE x≠0: x=x+1 algoritmi qaysi boshlang‘ich x larda tugashi yoki tugamasligini tahlil qiling.',
      },
      {
        title: 'Invariant va to‘g‘rilik fikri',
        explanation: 'Invariant — sikl boshlanishida va har iteratsiyadan keyin saqlanadigan xossa. Boshlanishda invariant rost, tana uni saqlaydi va tugash sharti bilan kerakli natijani beradi. Bu yondashuv testdan kuchliroq mantiqiy asos beradi.',
        example: '1..i sonlari yig‘indisi siklida iteratsiyadan keyin s=1+…+i invariant bo‘ladi. i=n ga yetganda s kerakli umumiy yig‘indi.',
        trap: 'Invariantni shunchaki “algoritm to‘g‘ri” deb yozish yetarli emas; u aniq o‘zgaruvchilar munosabati bo‘lishi kerak.',
        task: 'Massivdagi ko‘rilgan elementlar maksimumini topishda har iteratsiyadan keyingi invariantni bir jumlada yozing.',
      },
      {
        title: 'Qadamlar soni va resurslarni taqqoslash',
        explanation: 'Ikki to‘g‘ri algoritm bajaradigan asosiy amallar soni, qo‘shimcha xotira, kod soddaligi va kiritish hajmi o‘sgandagi xulqi bilan taqqoslanadi. Kichik misolda tez ko‘ringan yechim katta ma’lumotda yomonlashishi mumkin.',
        example: '1..n yig‘indisini sikl n ta qo‘shish bilan, n(n+1)/2 formula esa doimiy sonli arifmetik amal bilan topadi. Ammo formula uchun son turi va toshish xavfi tekshiriladi.',
        trap: '“Qisqa kod doimo tez” yoki “kam qadam doimo eng yaxshi” degan da’vo noto‘g‘ri; aniqlik, xotira va cheklovlar ham bor.',
        task: 'Ro‘yxatda qiymat qidirishning boshidan ketma-ket ko‘rish va tartiblangan ro‘yxatda o‘rtadan bo‘lish usullarini shartlari bilan taqqoslang.',
      },
      {
        title: 'Optimallashtirish va qayta regressiya',
        explanation: 'Avval to‘g‘ri, tushunarli yechim yaratiladi; so‘ng o‘lchangan tor joy optimallashtiriladi. O‘zgarishdan keyin avvalgi testlar qayta ishlaydi. Natija va tashqi xulq saqlansa, tezlik yoki xotira yutug‘i dalil bilan qayd etiladi.',
        example: 'Takror hisoblanadigan o‘zgarmas qiymat sikldan tashqariga chiqarildi. Oldin va keyin bir xil test natijalari, keyin bajarilish vaqti o‘lchanadi.',
        trap: 'Testlarsiz optimallashtirish tezroq, lekin noto‘g‘ri algoritm yaratishi mumkin. Taxminiy “tezroq” o‘rniga o‘lchov yozing.',
        task: 'Algoritmni tezlashtirgandan keyin bajariladigan kamida to‘rtta tekshiruvni tartib bilan yozing.',
      },
    ],
    answers: '1) p: 1→1→2→6→24. 3) x<0 bo‘lsa +1 bilan 0 ga yetadi; x=0 tanaga kirmaydi; x>0 bo‘lsa ortib boradi va tugamaydi. 4) max ko‘rilgan qismdagi eng katta qiymatga teng. 6) eski testlar, chegara/noto‘g‘ri testlar, natija tengligi, vaqt/xotira o‘lchovi.',
    summary: 'Algoritm iz jadvali va test holatlari bilan tekshiriladi; tugash uchun holat shartdan chiqishga yaqinlashadi. Invariant to‘g‘rilikni mantiqan asoslaydi. Maqbullik faqat tezlik emas: qadam, xotira, aniqlik, soddalik va vazifa cheklovi birga baholanadi.',
    sources: [algorithmSource, lectureSource],
  },
}

export const M06_ALGORITHM_CANONICAL_BOOKS: Readonly<Record<string, TheoryBlock[]>> = Object.fromEntries(
  Object.entries(books).map(([id, spec]) => [id, buildSourceCompleteBook(spec)]),
)
