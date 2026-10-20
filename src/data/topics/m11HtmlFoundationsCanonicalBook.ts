/** TASK-305: source-guided HTML5 semantic foundations and browser basics. */
import type { TheoryBlock } from '../topicContent'
export const M11_01_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "WWW va internetni, HTML/CSS/JS vazifalarini, HTML5 doctype, head/body, teg/element/atribut va semantik elementlarni farqlash; sarlavha, havola, rasm va tekshiruvdan iborat ilk sahifa yaratish."
  },
  {
    "type": "intro",
    "content": "Veb-sahifa tuzishda birinchi maqsad chiroyli rang emas, mazmunning izchil belgilanishi. Ushbu bob HTML skeletini haqiqiy kod namunalari, semantik xatolar, foydalanish qulayligi va brauzer sinovi bilan birgalikda o‘rgatadi."
  },
  {
    "type": "table",
    "content": "| Tushuncha | Maqsad | Misol |\n|---|---|---|\n| HTML | Tuzilma | h1, p, main |\n| CSS | Uslub | color, font-size |\n| JavaScript | Mantiqiy interaksiya | click hodisasi |\n| head | Metadata | title, charset |\n| body | Asosiy ko‘rinadigan kontent | h1, article |"
  },
  {
    "type": "code",
    "content": "<!DOCTYPE html>\n<html lang=\"uz\">\n<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Dars</title></head>\n<body><header><h1>Informatika</h1></header><main><p>Yangi mavzu</p></main></body>\n</html>"
  },
  {
    "type": "heading",
    "content": "1. Veb, sayt, sahifa va brauzer farqi"
  },
  {
    "type": "definition",
    "content": "Veb-sayt o‘zaro bog‘langan sahifa va resurslar yig‘indisi; veb-sahifa brauzer ko‘rsatadigan hujjat. Internet tarmoq infratuzilmasi, WWW esa shu tarmoq ustidagi veb-resurslar tizimi. Brauzer HTMLni o‘qiydi va DOM orqali sahifa mazmunini ifodalaydi."
  },
  {
    "type": "case",
    "content": "Maktab kutubxonasi sayti bosh sahifa, katalog va aloqa sahifasidan iborat; ularga bitta domen ichida turli yo‘llar orqali o‘tiladi."
  },
  {
    "type": "trap",
    "content": "Internet va WWW mutlaq sinonim emas; e-pochta ham internet ustida, ammo veb-sahifa shart emas."
  },
  {
    "type": "task",
    "content": "1-mashq. Uch sahifali saytning mazmuniy xaritasini chizing."
  },
  {
    "type": "heading",
    "content": "2. HTML belgilash tili sifatida"
  },
  {
    "type": "definition",
    "content": "HTML — HyperText Markup Language; u sahifa mazmunining tuzilishini belgilaydi, algoritm uchun umumiy dasturlash tili emas. CSS dizayn va joylashuv, JavaScript esa dinamik xatti-harakatga xizmat qilishi mumkin. Birinchi vazifa: mazmunni semantik tuzilishga ajratish."
  },
  {
    "type": "solved",
    "content": "Fan mavzusi sahifasida HTML sarlavha va abzasni, CSS shrift va bo‘shliqni, JavaScript ixtiyoriy interaktiv savolni boshqaradi."
  },
  {
    "type": "trap",
    "content": "Faqat HTML tegi rangni o‘zgartirishga qaratilgan eskicha attributlar o‘rniga maqsadga mos CSSdan foydalanish afzal."
  },
  {
    "type": "task",
    "content": "2-mashq. HTML, CSS va JavaScript uchun bittadan vazifa misoli keltiring."
  },
  {
    "type": "heading",
    "content": "3. DOCTYPE, html, head va body"
  },
  {
    "type": "definition",
    "content": "HTML5da doctype brauzerga zamonaviy hujjat rejimini bildiradi. html butun sahifaning ildiz elementi, head metadata, title va ulanishlar uchun; body foydalanuvchi ko‘radigan mazmunni saqlaydi. lang atributi hujjat tilini belgilashga yordam beradi."
  },
  {
    "type": "example",
    "content": "O‘zbekcha sahifada doctype va html lang=uz bilan boshlang; head da charset va title, body da sarlavha bo‘lsin."
  },
  {
    "type": "trap",
    "content": "head ichidagi title odatda brauzer yorlig‘ida ko‘rinadi, body ichidagi h1 esa sahifa ichida; ikkalasini adashtirmang."
  },
  {
    "type": "task",
    "content": "3-mashq. Minimal to‘g‘ri HTML5 hujjatini yozing."
  },
  {
    "type": "code",
    "content": "<!DOCTYPE html>\n<html lang=\"uz\">\n<head><meta charset=\"utf-8\"><title>Dars</title></head>\n<body><h1>Dars</h1></body>\n</html>"
  },
  {
    "type": "heading",
    "content": "4. Teg, element va atribut"
  },
  {
    "type": "definition",
    "content": "Teg markeri — burchak qavs ichidagi yozuv; element — boshlanish tegi, kontent va kerak bo‘lsa tugash tegi bilan aniqlanadigan mazmun birligi. Atribut boshlanish tegida yoziladi, masalan a elementidagi href. Ba’zi elementlar img yoki br kabi void turiga kiradi."
  },
  {
    "type": "case",
    "content": "a href=/darslar atributli havolani ko‘rib, a elementni, href atribut nomini va /darslar qiymatini ajrating."
  },
  {
    "type": "trap",
    "content": "Teg nomi, atribut nomi va qiymati bir xil narsa emas; atribut qiymatini matnning kontenti deb adashtirmang."
  },
  {
    "type": "task",
    "content": "4-mashq. a tegida href, title va ko‘rinadigan havola matnini ajratib belgilang."
  },
  {
    "type": "code",
    "content": "<a href=\"/darslar\" title=\"Darslar\">Mavzular</a>"
  },
  {
    "type": "heading",
    "content": "5. Hujjat semantikasi va sarlavha darajalari"
  },
  {
    "type": "definition",
    "content": "h1 eng yuqori semantik sarlavha, h2 ikkinchi daraja, h3 uchinchi daraja. Brauzer odatiy uslubda h1ni katta ko‘rsatishi mumkin, ammo CSS bilan o‘lcham o‘zgartiriladi. Sahifa tuzilmasida sarlavha darajasini tashqi ko‘rinish emas, mazmun tartibi belgilaydi."
  },
  {
    "type": "solved",
    "content": "Bosh sahifada h1 «Informatika», keyingi bo‘limlarda h2 «Mavzular», h3 «Axborot» kabi izchil ketma-ketlik tuzing."
  },
  {
    "type": "trap",
    "content": "h1 «eng katta» degan savol faqat brauzer default ko‘rinishi uchun; haqiqiy semantik toifa — eng yuqori darajali sarlavha."
  },
  {
    "type": "task",
    "content": "5-mashq. Bitta maqola uchun h1, h2, h3 va p elementlari tuzilmasini yozing."
  },
  {
    "type": "code",
    "content": "<main><h1>Informatika</h1><section><h2>Algoritmlar</h2><p>Matn.</p></section></main>"
  },
  {
    "type": "heading",
    "content": "6. main, header, nav, section, article va footer"
  },
  {
    "type": "definition",
    "content": "Semantik HTML5 elementlari ekrandagi joylashuv emas, mazmunning rolini bildiradi. header kirish/bosh, nav asosiy navigatsiya, main yetakchi mazmun, section mavzuli guruh, article mustaqil mazmun, footer pastki ma’lumot uchun ishlatiladi."
  },
  {
    "type": "example",
    "content": "Elektron jurnal maqolasida headerda sayt nomi, navda bo‘limlar, mainda article, pastda manba va aloqa footerda joylashadi."
  },
  {
    "type": "trap",
    "content": "Har bir divni avtomatik section bilan almashtirish to‘g‘ri emas; bo‘lim sarlavhasi va ma’nosi mavjud bo‘lsin."
  },
  {
    "type": "task",
    "content": "6-mashq. Maktab sayti uchun semantik sahifa skeletini tuzing."
  },
  {
    "type": "heading",
    "content": "7. Gipermurojaat va href"
  },
  {
    "type": "definition",
    "content": "a elementi href atributi bilan boshqa sahifa, fayl, pochta yoki sahifa ichidagi idga havola beradi. Nisbiy manzil joriy sahifaga, absolyut URL to‘liq joyga asoslanadi. Havola matni nima ochilishini mazmunli tushuntirishi lozim."
  },
  {
    "type": "case",
    "content": "Mundarijada a href=#xulosa ichki bo‘limga va href=/mavzular umumiy katalogga yo‘naltirsin; maqsadning id qiymatini tekshiring."
  },
  {
    "type": "trap",
    "content": "«Shu yerga» deb yozish mazmunli link nomi o‘rnini bosa olmaydi. Target blank yangi kontekst ochishi va himoya masalalarini keltirishi mumkin."
  },
  {
    "type": "task",
    "content": "7-mashq. Ichki id havola va tashqi to‘liq havolani bitta HTML misolda ko‘rsating."
  },
  {
    "type": "code",
    "content": "<nav><a href=\"#xulosa\">Xulosa</a></nav><section id=\"xulosa\"><h2>Xulosa</h2></section>"
  },
  {
    "type": "heading",
    "content": "8. Rasm va alt atributi"
  },
  {
    "type": "definition",
    "content": "img rasmni ko‘rsatadi; odatda src rasm manzilini, alt esa mazmunli matnli muqobilni beradi. MDN bo‘yicha src yoki srcsetdan kamida biri tasvir manbasini aniqlashi mumkin; src keng ishlatiladigan asosiy atribut. Dekorativ rasmda bo‘sh alt mos bo‘lishi mumkin."
  },
  {
    "type": "solved",
    "content": "Tajriba blok-sxemasida alt «Suv bug‘lanishdan bulutga, keyin yog‘ingarchilikka o‘tishi diagrammasi» kabi mazmunli bo‘lsin."
  },
  {
    "type": "trap",
    "content": "«src har qanday holatda majburiy yagona manba atributi» noto‘g‘ri soddalashtirish; srcset bo‘lsa tanlash boshqacha. Altni fayl nomi bilan to‘ldirmang."
  },
  {
    "type": "task",
    "content": "8-mashq. Bir rasmli sahifaga src, alt, width va height bilan amaliy kod yozing."
  },
  {
    "type": "code",
    "content": "<img src=\"schema.png\" alt=\"Uch bosqichli jarayon sxemasi\" width=\"480\" height=\"240\">"
  },
  {
    "type": "heading",
    "content": "9. Ro‘yxatlar va ma’no"
  },
  {
    "type": "definition",
    "content": "ul tartibsiz, ol tartibli, li ro‘yxat bandini belgilaydi. Ro‘yxat turlari bir-birini almashtirish uchun emas: bosqich ketma-ketligida ol, toifalar yig‘indisida ul afzal. O‘rnatma (nested) ro‘yxat mavzular guruhi uchun bo‘lishi mumkin."
  },
  {
    "type": "example",
    "content": "Darsga tayyorlanishning 3 bosqichini ol yordamida, kerakli jihozlarni esa ul yordamida sanang."
  },
  {
    "type": "trap",
    "content": "Ro‘yxatni faqat tire va bir necha p bilan yozish vizual ko‘rinsa ham semantik ro‘yxat bo‘lib qolmaydi."
  },
  {
    "type": "task",
    "content": "9-mashq. Qaysi vaziyatda tartib axborotning bir qismi ekanini yozing."
  },
  {
    "type": "code",
    "content": "<ol><li>Mavzuni o‘qing</li><li>Misol yeching</li></ol>"
  },
  {
    "type": "heading",
    "content": "10. Brauzer, fayl kengaytmasi va sinov"
  },
  {
    "type": "definition",
    "content": "Oddiy HTML sahifasi UTF-8 kodlangan .html fayl sifatida saqlanishi mumkin. Kod muharririda yozilgan hujjatni brauzerda oching, teglar juftini va fayl manzilini tekshiring. DevTools Elements DOMni ko‘rish va diagnostika qilishda yordam beradi."
  },
  {
    "type": "case",
    "content": "index.html faylini saqlab brauzerda oching, title varaqda va h1 sahifada ko‘rinishini tekshiring. Xato bo‘lsa kod va console xabarlarini tahlil qiling."
  },
  {
    "type": "trap",
    "content": "Notepad nomini faqat .html deb yozish noto‘g‘ri kodlangan faylni avtomatik tuzatmaydi; charsetni yozing."
  },
  {
    "type": "task",
    "content": "10-mashq. Yangi .html hujjat yaratish va sinashning 5 bosqichini yozing."
  },
  {
    "type": "heading",
    "content": "11. Qulaylik, mobil moslik va kontent etikasi"
  },
  {
    "type": "definition",
    "content": "Semantik teg, izchil sarlavha, alt va klaviatura bilan boshqariladigan havola sahifadan foydalanishni yaxshilaydi. Mobil qurilmada viewport meta va responsive CSS o‘qilish uchun ahamiyatli. Manba havolasi va shaxsiy ma’lumotni ham tekshiring."
  },
  {
    "type": "solved",
    "content": "Maktab sayti telefon ekranda tor ko‘rinmoqda: viewport va CSS eni cheklovini tekshiring; rasmning alt tavsifini ham o‘qib ko‘ring."
  },
  {
    "type": "trap",
    "content": "Chiroyli rang va ko‘p animatsiya barcha o‘quvchilarga mazmunni birdek yetkazish kafolati emas."
  },
  {
    "type": "task",
    "content": "11-mashq. Sahifa uchun kirish imkoniyatining to‘rtta asosiy mezonini tuzing."
  },
  {
    "type": "heading",
    "content": "12. Yakuniy mini-loyiha va rubrika"
  },
  {
    "type": "definition",
    "content": "Uch bo‘limli o‘quv sahifasi yarating: semantik skelet, sarlavha/paragraf, ro‘yxat, rasm, havola va manba. Natijani brauzerda oching, telefon ko‘rinishida sinang, barcha havola va rasm altini tekshiring."
  },
  {
    "type": "example",
    "content": "«Algoritmlar» sahifasi uchun header, nav, main, h1 va ikki section ishlating; yakunda manbani ko‘rsating."
  },
  {
    "type": "trap",
    "content": "HTML sintaksis ishlashi sahifadagi faktlar to‘g‘riligi yoki mualliflik huquqi tekshirildi degani emas."
  },
  {
    "type": "task",
    "content": "12-mashq. Mazmun, semantika, havola, qulaylik va sinov uchun 0–2 balli rubrika yozing."
  },
  {
    "type": "summary",
    "content": "Internet tarmoq, WWW veb-resurs tizimi; HTML mazmun, CSS dizayn, JavaScript xatti-harakat. head metadata, body ko‘rinadigan sahifa. h1 semantik jihatdan eng yuqori darajali sarlavha. href havola atributi; img uchun src yoki srcset manba, alt mazmunli muqobil. Oddiy HTMLni brauzer/DevToolsda tekshiring."
  },
  {
    "type": "answers",
    "content": "1) veb-sayt bir nechta sahifadan iborat; 2) HTML tuzilma, CSS uslub, JS hodisa; 3) doctype/html/head/body; 4) a teg, href atribut; 5) h1 semantik eng yuqori; 6) main/nav/section o‘rinli; 7) href va id mos; 8) src/alt va muqobil; 9) ol ketma-ketlik, ul toifalar; 10) UTF-8 .html brauzerda; 11) alt, semantika, mobil, klaviatura; 12) 5 mezonli rubrika. Ochiq javoblar maqsadga qarab farqlanadi."
  },
  {
    "type": "source",
    "content": "Manbalar: Cambridge+ 8-sinf vebsayt HTML modulining bosma taxminan 55–85-betlari (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); Cambridge+ 9-sinf, 21-bob «Veb-sayt yaratish», bosma taxminan 275–289-betlar (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); MDN HTML img/alt (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img). Mustaqil izoh, kod va mashqlar; fizik PDFning har bir sahifasi 1:1 ekspert tasdiqlanmagan."
  }
]
