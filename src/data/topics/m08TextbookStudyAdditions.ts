/** TASK-273 — Original textbook-grounded programming exercises for M08.
 * Grade-9 national ICT (2020) Python chapters and Cambridge 10/11 ICT (2021)
 * JavaScript and AI chapters. Not a claim of whole-book/page-level coverage.
 */
import type { TheoryBlock } from '../topicContent'

export const M08_TEXTBOOK_STUDY_ADDITIONS: Record<string, TheoryBlock[]> = {
  "M08.01": [
    { type: "heading", content: "Dastur yaratish jarayoni: masaladan sinovgacha" },
    { type: "list", content: "1. Masalani aniq qo‘ying: kirish, chiqish va cheklovlar.\n2. Algoritmni natural til yoki blok-sxemada loyihalang.\n3. Maqsadga mos dasturlash tilini tanlang.\n4. Kodni yozing va sintaksis xatolarini tuzating.\n5. Chegara holatlar bilan sinab, natijani tekshiring.\n6. Xatolar asosida yechimni qayta ishlang." },
    { type: "table", content: "| Tushuncha | Vazifasi | Farqi |\n|---|---|---|\n| Algoritm | Yechim amallari ketma-ketligi | Muayyan til kodidan mustaqil |\n| Dastur kodi | Algoritmning tildagi ifodasi | Sintaksisga bo‘ysunadi |\n| Kompilyator | Dastur tarjimasini bajaradi | Ko‘pincha ishlatishdan oldin bajariladi |\n| Interpretator | Dastur bajarilishiga vositachilik qiladi | Turli amalga oshirishlarda farq bo‘lishi mumkin |\n| Debugger | Kod ishlashini kuzatishga yordam beradi | Xatolarni izlash vositasi |" },
    { type: "example", content: "Ikki sonning kattasini topish uchun avval kiritish, taqqoslash va chiqarish bosqichlarini belgilang. Python yoki JavaScriptda yozilish sintaksisi farq qilishi mumkin, lekin algoritmning mantiqi o‘zgarmaydi." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, N.S. Xaytullayeva, «Informatika va axborot texnologiyalari», 9-sinf, Toshkent: Tasvir, 2020, Python dasturlash bobi va amaliy mashg‘ulotlar (https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view). «Dastur tuzish bosqichlari» va Python muhiti materiallari. Asosiy tushunchalar manba asosidagi original izoh; har bir dasturlash paradigmasining kitobdagi barcha sahifalari tekshirilmagan." },
  ],
  "M08.02": [
    { type: "heading", content: "Python muhiti: interfaol va faylli bajarish" },
    { type: "table", content: "| Rejim | Nima bo‘ladi? | Qachon ishlatiladi? |\n|---|---|---|\n| Interfaol konsol | Buyruq kiritiladi va natija darhol chiqadi | Kichik ifoda va tajribani sinash |\n| Skript fayl (.py) | Bir nechta buyruq faylda saqlanib bajariladi | Qayta ishlatiladigan dastur |\n| Xato kuzatuvi | Xato turini va satrini tekshirish | Tuzatish va qayta sinash |" },
    { type: "code", content: "name = input('Ismingiz: ')\nprint('Salom,', name)" },
    { type: "example", content: "`input()` ko‘pincha matn qaytaradi: foydalanuvchi `12` yozsa ham hisoblashdan oldin `int()` kabi tekshirilgan o‘girish talab qilinishi mumkin. Noto‘g‘ri kiritishda xato chiqishi uchun oldindan sinov rejalang." },
    { type: "trap", content: "**SyntaxError** — kod yozilishi; **NameError** — aniqlanmagan ism; **TypeError** — noto‘g‘ri qiymat turlarining amalda qo‘llanishi. Xato turini bilish butun dastur mantiqi to‘g‘riligini isbotlamaydi." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, N.S. Xaytullayeva, «Informatika va axborot texnologiyalari», 9-sinf, Toshkent: Tasvir, 2020, Python dasturlash bobi va amaliy mashg‘ulotlar (https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view). IDLE interfaol muhiti, fayl yaratish, saqlash va `print()` misollari. Sintaksis misoli mustaqil yozildi." },
  ],
  "M08.03": [
    { type: "heading", content: "Python ma’lumot turi va amal natijasi" },
    { type: "table", content: "| Ifoda | Natija | Nima uchun? |\n|---|---|---|\n| 7 / 2 | 3.5 | Oddiy bo‘lish haqiqiy natija beradi |\n| 7 // 2 | 3 | Butun bo‘lish (pastga yaxlitlash) |\n| 7 % 2 | 1 | Qoldiq |\n| '7' + '2' | '72' | Matnlarni birlashtirish |\n| int('7') + 2 | 9 | Matndan son turiga o‘girish |" },
    { type: "code", content: "age_text = input('Yosh: ')\nage = int(age_text)\nprint('Keyingi yil:', age + 1)" },
    { type: "example", content: "`'5' * 3` natija sonli ko‘paytma emas, satrning takrorlanishi. `5 * 3` esa arifmetik amal; `int('5') * 3` turga o‘girish orqali arifmetik natijaga olib keladi." },
    { type: "trap", content: "O‘zgaruvchi nomini «xotiradagi quti» deb juda sodda tushuntirish mumkin, ammo Python obyekt modeli nuqtai nazaridan nom **qiymatga bog‘lanadi**. Manfiy sonli `//` amali nolga emas, pastga yaxlitlanadi: `-7 // 2 == -4`." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, N.S. Xaytullayeva, «Informatika va axborot texnologiyalari», 9-sinf, Toshkent: Tasvir, 2020, Python dasturlash bobi va amaliy mashg‘ulotlar (https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view). o‘zgaruvchilar, ma’lumot turlari, arifmetik amallar va Python amaliy vazifalari. Jadval yangi tuzilgan." },
  ],
  "M08.04": [
    { type: "heading", content: "JavaScriptda kod qayerda ishga tushadi?" },
    { type: "table", content: "| Vosita | Vazifasi | Chegarasi |\n|---|---|---|\n| `console.log()` | Dastur natijasini ishlab chiquvchi konsolida ko‘rsatish | Sahifada foydalanuvchiga ko‘rinmasligi mumkin |\n| `textContent` | Elementning matnini yangilash | HTML sifatida kodni ishlatmaydi |\n| `addEventListener()` | Foydalanuvchi hodisasiga javob | Voqea ro‘y bermasa chaqirilmaydi |\n| `let` | Qayta qiymat beriladigan bog‘lanish | Blok sohasida amal qiladi |\n| `const` | Bog‘lanishni qayta qiymatlashni cheklaydi | Obyekt ichki xossalarini avtomatik muzlatmaydi |" },
    { type: "code", content: "const tugma = document.querySelector('#hisobla');\ntugma?.addEventListener('click', () => console.log(20 * 2));" },
    { type: "example", content: "JavaScriptdagi konsolga `40` chiqishi matn sahifada ko‘rsatilganini anglatmaydi. Sahifa foydalanuvchisiga ma’lumot berish uchun tegishli DOM elementni yangilash zarur." },
    { type: "trap", content: "`==` va `===` farqini ajrating: qat’iy taqqoslash tur o‘zgartirish qoidalariga kamroq tayanadi. Sahifadagi foydalanuvchi matnini HTML sifatida tekshirmay kiritish xavfsiz emas." },
    { type: "source", content: "Manba: P. Long, S. Lawrey, V. Ellis, «Informatika va axborot texnologiyalari», 10–11-sinf, Toshkent, 2021, 19-bob «Veb uchun dasturlash», jumladan JavaScript va konsol namunalari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). 19-bobda brauzer konsoli, `console.log`, skript va arifmetik amallar; DOM va zamonaviy `let` misollari alohida texnik tushuntirishdir." },
  ],
  "M08.05": [
    { type: "heading", content: "Shart → takrorlash → funksiya → massiv mantiqi" },
    { type: "table", content: "| Tuzilma | Maqsad | Sinov savoli |\n|---|---|---|\n| `if/else` | Shartga ko‘ra yo‘l tanlash | Shart rostmi? |\n| `for` | Takrorlash bosqichlarini boshqarish | Necha marta bajariladi? |\n| `while` | Shart bo‘yicha takrorlash | Shart qachon yolg‘on bo‘ladi? |\n| Funksiya | Amallarni qayta ishlatish | Argument va qaytish qiymati nima? |\n| Massiv | Tartiblangan elementlar | Birinchi indeks qaysi? |" },
    { type: "code", content: "const sonlar = [2, 4, 6];\nconst yigindi = sonlar.reduce((jami, son) => jami + son, 0);\nconsole.log(yigindi); // 12" },
    { type: "example", content: "Ro‘yxatdagi juft sonlarni sanash uchun avval **shart**ni yozing, keyin **sikl** orqali elementlarni ko‘ring. Tayyor yig‘indi funksiyasi tezroq bo‘lishi mumkin, lekin attestatsiya savoli aynan algoritm jarayonini so‘rasa, shart va takrorlashni izohlash muhim." },
    { type: "trap", content: "`while` siklining tugash sharti o‘zgarmasa, cheksiz takrorlanish xavfi bor. Massivning uzunligi 3 bo‘lsa, JavaScriptda birinchi va oxirgi indekslar 0 hamda 2; 3-indeks odatda element emas." },
    { type: "source", content: "Manba: P. Long, S. Lawrey, V. Ellis, «Informatika va axborot texnologiyalari», 10–11-sinf, Toshkent, 2021, 19-bob «Veb uchun dasturlash», jumladan JavaScript va konsol namunalari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). JavaScript operatorlari va hisoblashlar; array/reduce misoli zamonaviy qo‘shimcha misol, 19-bobning aynan ko‘chirmasi emas." },
  ],
  "M08.06": [
    { type: "heading", content: "Takrorlashda chegaraviy xatolar" },
    { type: "code", content: "for i in range(1, 5):\n    print(i)\n# 1, 2, 3, 4" },
    { type: "table", content: "| Kod | Necha marta? | Muhim farq |\n|---|---:|---|\n| range(5) | 5 | 0 dan 4 gacha |\n| range(1, 5) | 4 | 5 kirmaydi |\n| range(2, 10, 2) | 4 | 2, 4, 6, 8 |\n| while x > 0 | Vaziyatga bog‘liq | x o‘zgarishi kerak |" },
    { type: "example", content: "Dastur `while n > 0` bilan yozilib, siklda `n` hech o‘zgarmasa, shart qayta tekshirilganda rostligicha qolishi mumkin. `break` cheklangan holatda yordam beradi, lekin doimiy tekshirish va to‘g‘ri sikl sharti muhimroq." },
    { type: "trap", content: "`continue` joriy takrorlashning qolgan qismini o‘tkazadi, `break` esa eng yaqin sikldan chiqadi. Har ikkisi `return`dan farq qiladi: `return` funksiyaning bajarilishini yakunlaydi." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, N.S. Xaytullayeva, «Informatika va axborot texnologiyalari», 9-sinf, Toshkent: Tasvir, 2020, Python dasturlash bobi va amaliy mashg‘ulotlar (https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view). takrorlash, shart va funksiyalarni o‘qitish sohasi; hozirgi kod misollari qayta yozilgan, butun M08.06 matnining barcha kitob sahifalariga qiyosi hali ochiq." },
  ],
  "M08.07": [
    { type: "heading", content: "Funksiyaning natijasi va ekranga chiqarish farqi" },
    { type: "code", content: "def kvadrat(x):\n    return x * x\n\nnatija = kvadrat(6)\nprint(natija)  # 36" },
    { type: "table", content: "| Amal | Vazifa |\n|---|---|\n| Parametr | Funksiya ta’rifidagi nom |\n| Argument | Chaqirishda berilgan qiymat |\n| return | Natijani chaqiruvchi kodga qaytarish |\n| print | Matnni chiqarish, hisob natijasini avtomatik qaytarmaydi |\n| Lokal o‘zgaruvchi | Funksiya ichida aniqlangan nom |" },
    { type: "example", content: "Funksiya faqat `print(x*x)` qilsa, uning qaytarish qiymati avtomatik ravishda `x*x` bo‘lmaydi. Qaytarilgan natija bilan keyingi hisob ishlashi kerak bo‘lsa, `return`dan foydalaning." },
    { type: "trap", content: "Lokal o‘zgaruvchi bilan tashqi sohaga bir xil nom berish turli bog‘lanishlarni yaratishi mumkin. `global`dan har bir funksiyada foydalanish shart emas; parametr va `return` ko‘pincha kodni aniqroq qiladi." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, N.S. Xaytullayeva, «Informatika va axborot texnologiyalari», 9-sinf, Toshkent: Tasvir, 2020, Python dasturlash bobi va amaliy mashg‘ulotlar (https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view). `def` va funksiya chaqirish misollari. Lokal va qaytarish qiymatlarini farqlash — ularning pedagogik sharhi." },
  ],
  "M08.08": [
    { type: "heading", content: "Python kolleksiyalarining asosiy farqlari" },
    { type: "table", content: "| Tuzilma | Tartib | O‘zgaruvchanlik | Maqsad |\n|---|---|---|---|\n| list | Indekslar tartibli | O‘zgartiriladi | Ketma-ket qiymatlar |\n| tuple | Indekslar tartibli | O‘zgartirilmaydi | O‘zgarmas guruh |\n| dict | Kalitlar bilan murojaat | Yangilanadi | Nomi bilan bog‘langan qiymatlar |\n| set | Oddiy tartibga tayanilmaydi | O‘zgartiriladi | Noyob elementlar |" },
    { type: "code", content: "baholar = [5, 4, 5]\nprint(baholar[0])  # 5\nsoni = {5: 2, 4: 1}\nprint(soni[5])      # 2" },
    { type: "example", content: "Ro‘yxatdan noyob qiymatlarni ajratish uchun `set()` qulay bo‘lishi mumkin, ammo u ro‘yxatdagi tartibni saqlash uchun mo‘ljallanmagan. Keyingi vazifa tartibni talab etsa, qo‘shimcha yechim zarur." },
    { type: "trap", content: "Ro‘yxatdagi indeks 0 dan boshlanadi; lug‘atda esa kalit va ro‘yxat indeksi boshqa tushuncha. Tuple elementlarini to‘g‘ridan-to‘g‘ri almashtirib bo‘lmaydi." },
    { type: "source", content: "Manba doirasi: M.R. Fayziyeva, D.M. Sayfurov, N.S. Xaytullayeva, «Informatika va axborot texnologiyalari», 9-sinf, Toshkent: Tasvir, 2020, Python dasturlash bobi va amaliy mashg‘ulotlar (https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view). Pythonning asosiy ifoda, obyekt, funksiya amaliyoti mavzulari. To‘rt kolleksiyaning aynan bu taqqoslash jadvali manbadan ko‘chirilmagan; alohida nashr/sahifa ekspertizasi talab etiladi." },
  ],
  "M08.09": [
    { type: "heading", content: "Modul, fayl va klasslarni alohida farqlash" },
    { type: "table", content: "| Tushuncha | Vazifasi | Oddiy misol |\n|---|---|---|\n| Modul | Kodni fayllarga ajratish va import qilish | import math |\n| Fayl bilan ishlash | Tashqi ma’lumotni o‘qish yoki yozish | with open(...) |\n| GUI | Tugma va oynali muloqot | Grafik oyna |\n| Klass | Obyektlar uchun atribut va metodlarni belgilash | class Hisob: ... |" },
    { type: "code", content: "from pathlib import Path\np = Path('hisobot.txt')\np.write_text('Natija: 10', encoding='utf-8')\nprint(p.read_text(encoding='utf-8'))" },
    { type: "example", content: "Ekranga `print()` orqali ko‘rsatilgan natija avtomatik faylga yozilmaydi. Faylga yozishda manzil, kodlash va xato sharoiti hisobga olinadi. Katta loyihada umumiy funksiyani modulga ajratish kodni tartiblaydi." },
    { type: "trap", content: "**Faylni o‘qish** va **faylni dastur sifatida bajarish** turli amallar. Har bir modulli loyiha obyektga yo‘naltirilgan bo‘lishi shart emas; modul va klass alohida tuzilma." },
    { type: "source", content: "Manba cheklovi: M.R. Fayziyeva, D.M. Sayfurov, N.S. Xaytullayeva, «Informatika va axborot texnologiyalari», 9-sinf, Toshkent: Tasvir, 2020, Python dasturlash bobi va amaliy mashg‘ulotlar (https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view). Python dasturlash asoslari. Fayl, `pathlib`, GUI va OOP birgalikdagi bu qo‘shimcha bob yuqori bosqichga mo‘ljallangan original izoh; ICT9 PDFdagi barcha bo‘limlar bilan 1:1 verified deb hisoblanmaydi." },
  ],
  "M08.10": [
    { type: "heading", content: "Sun’iy intellekt va ekspert tizimini farqlash" },
    { type: "table", content: "| Tizim | Asosiy g‘oya | Nazorat savoli |\n|---|---|---|\n| Qoidaga asoslangan ekspert tizimi | Mutaxassis bilimini qoida yoki bilim bazasida ifodalash | Qaysi qoida ishga tushdi? |\n| Ma’lumotdan o‘rganuvchi model | Namunalar bo‘yicha matematik parametrlarni moslashtirish | Qaysi ma’lumotlarda sinandi? |\n| Oddiy avtomatlashtirish | Oldindan belgilangan amallar | Tizim yangi naqshni o‘rganadimi? |" },
    { type: "example", content: "O‘simlik kasalligini oldindan yozilgan belgilarga qarab aniqlovchi qoidaviy tizim bilan ko‘plab fotosuratlardan namuna o‘rgangan modelni bir xil o‘qitish jarayoni deb bo‘lmaydi. Ikkalasi xato qilishi mumkin." },
    { type: "trap", content: "Algoritmning murakkabligi uning sun’iy intellekt ekanini avtomatik anglatmaydi. Modelga o‘rgatish ma’lumotidagi xatolar natijaga ta’sir qiladi; yuqori aniqlik ham barcha holatda to‘g‘ri qaror kafolati emas." },
    { type: "source", content: "Manba: P. Long, S. Lawrey, V. Ellis, «Informatika va axborot texnologiyalari», 10–11-sinf (2021), sun’iy intellekt va ekspert tizimi bo‘limlari, jumladan bosma ~200-bet atrofidagi masalalar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Mashinaviy o‘rganish bilan taqqoslash pedagogik izoh; fizik bet lokatorlari mustaqil tasdiq talab qiladi." },
  ],
  "M08.11": [
    { type: "heading", content: "JavaScript ma’lumotlar turi va qat’iy taqqoslash" },
    { type: "code", content: "const qiymat = '5';\nconsole.log( qiymat + 2 ); // '52'\nconsole.log( Number(qiymat) + 2 ); // 7\nconsole.log( qiymat === 5 ); // false" },
    { type: "table", content: "| Ifoda | Natija | Sabab |\n|---|---|---|\n| '5' + 2 | '52' | Matn birlashtirish |\n| Number('5') + 2 | 7 | Raqamga o‘girish |\n| '5' === 5 | false | Qiymat turi farq qiladi |\n| typeof true | 'boolean' | Mantiqiy qiymat turi |" },
    { type: "example", content: "HTML shaklidagi `input.value` odatda matn bo‘ladi. Kiritilgan sonlarni qo‘shishdan oldin ularni son sifatida tekshirish va o‘girish zarur; aks holda `2` va `3` yig‘indisi o‘rniga `23` ko‘rinishi mumkin." },
    { type: "trap", content: "`NaN` (son emas) ham JavaScriptning `number` turidagi maxsus qiymat; `Number('salom')` oddiy son qaytarmaydi. Formadagi foydalanuvchi ma’lumotini tekshirish juda muhim." },
    { type: "source", content: "Manba: P. Long, S. Lawrey, V. Ellis, «Informatika va axborot texnologiyalari», 10–11-sinf, Toshkent, 2021, 19-bob «Veb uchun dasturlash», jumladan JavaScript va konsol namunalari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). JavaScript arifmetik amallar va veb elementlariga kirish; qat’iy taqqoslash/konversiya misollari mualliflik izohi." },
  ],
  "M08.12": [
    { type: "heading", content: "JavaScript algoritmini izohlash va sinash" },
    { type: "code", content: "function katta(a, b) {\n  return a >= b ? a : b;\n}\nconsole.log(katta(5, 3)); // 5" },
    { type: "table", content: "| Konstruksiya | Muhim tekshiruv |\n|---|---|\n| Shart | Ikkala natija yo‘li sinalganmi? |\n| Sikl | Dastlabki qiymat va tugash chegarasi qanday? |\n| Funksiya | Qaytish qiymati keyingi hisobda ishlatiladimi? |\n| Massiv | Bo‘sh massiv va oxirgi indeks qamrab olinganmi? |" },
    { type: "example", content: "Massivdan eng katta sonni topishda boshlang‘ich maksimal qiymatni 0 deb belgilash faqat musbat sonlar uchun yetarli. Agar massivda manfiy sonlar bo‘lsa, boshlang‘ich qiymatni massivning mavjud birinchi elementi bilan aniqlash xavfsizroq; bo‘sh massiv alohida ko‘riladi." },
    { type: "trap", content: "Funksiya `return` bajargandan keyin uning shu chaqiruvdagi boshqa kodlari davom etmaydi. Massivdagi `length` qiymatini eng oxirgi indeks bilan adashtirmang." },
    { type: "source", content: "Manba: P. Long, S. Lawrey, V. Ellis, «Informatika va axborot texnologiyalari», 10–11-sinf, Toshkent, 2021, 19-bob «Veb uchun dasturlash», jumladan JavaScript va konsol namunalari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). JavaScript shart, kod bajarilishi va arifmetik hisoblash; algoritmning chegaraviy sinov namunalari mustaqil original misollar." },
  ],
}
