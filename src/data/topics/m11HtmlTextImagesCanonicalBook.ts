/** TASK-305: original source-guided HTML text, lists and images book. */
import type { TheoryBlock } from '../topicContent'
export const M11_02_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "HTML matn teglarining semantik farqini, ro‘yxat va rasm, src/alt, CSS fon, UTF-8, nisbiy yo‘l va responsivlikni tushunish hamda haqiqiy HTML maqola yaratish."
  },
  {
    "type": "intro",
    "content": "O‘quv materialini faqat chiroyli shrift va rasm qilib qo‘yish yetarli emas. Matnning ma’nosini HTML bilan, ko‘rinishini CSS bilan boshqarish va rasmni ko‘rmaydigan foydalanuvchiga ham muqobil mazmun berish zarur."
  },
  {
    "type": "table",
    "content": "| Element | Mazmun | Misol |\n|---|---|---|\n| p | Abzas | Bir fikr |\n| strong | Semantik muhimlik | Muhim eslatma |\n| em | Mazmuniy urg‘u | Ta’kid |\n| ol | Tartibli ro‘yxat | Ketma-ket ish |\n| ul | Tartibsiz ro‘yxat | Jihozlar |\n| img | Tasvir | src+alt |\n| figure/figcaption | Izohli figura | Natija grafigi |"
  },
  {
    "type": "heading",
    "content": "1. Abzas va matn ma’nosi"
  },
  {
    "type": "definition",
    "content": "p paragraf, h1–h6 sarlavha, strong muhimlik va em urg‘u ma’nosini bildiradi. b/i biror qo‘shimcha semantik ahamiyat yuklamasdan ko‘rishdagi e’tiborni boshqarish maqsadida ham ishlatilishi mumkin; taqdim etish va semantika vazifasini farqlang."
  },
  {
    "type": "case",
    "content": "Ko‘rsatmadagi «Muhim!»ni strong bilan, atamaga nutqiy urg‘uni em bilan bering. Sarlavhani p ichida font-size katta qilib yasash o‘rniga h2 tanlang."
  },
  {
    "type": "trap",
    "content": "Matnni bold qilish har doim zaruriy ma’no hosil qilmaydi, screen reader tushunadigan semantik tartibni unutmayin."
  },
  {
    "type": "task",
    "content": "1-mashq. Bir maqolani sarlavha, abzas, muhim eslatma va ta’kidga ajrating."
  },
  {
    "type": "code",
    "content": "<h2>Mavzu</h2><p>Bu yerda <strong>muhim</strong> fikr va <em>urg‘u</em> bor.</p>"
  },
  {
    "type": "heading",
    "content": "2. b, i, u, mark va small"
  },
  {
    "type": "definition",
    "content": "b, i matnning odatiy vizual ko‘rinishiga ta’sir qiladi; u ba’zi kontekstlarda semantik belgi bilan farqlanadi. u no-proza annotatsiya, mark kontekstga muvofiq belgilash, small esa qo‘shimcha izoh yoki mayda qaydga mos bo‘lishi mumkin. Amalda CSS ko‘rinishni mustaqil belgilaydi."
  },
  {
    "type": "solved",
    "content": "Qidiruv natijasidagi mos so‘zni mark bilan belgilang, mualliflik mayda izohini small bilan yozing. Faqat dekorativ tagiga chizish havola bilan chalkashmasin."
  },
  {
    "type": "trap",
    "content": "Faqat vizual qalin yozuvga ishonib struktura berish ma’lumotni semantik yo‘qotadi."
  },
  {
    "type": "task",
    "content": "2-mashq. strong, em va mark uchun turli foydalanish vaziyatini yozing."
  },
  {
    "type": "code",
    "content": "<p><mark>Topilgan so‘z</mark> va <small>Izoh</small>.</p>"
  },
  {
    "type": "heading",
    "content": "3. Ro‘yxat: ul, ol, li"
  },
  {
    "type": "definition",
    "content": "ul tartibi muhim bo‘lmagan bandlar, ol tartibi muhim bo‘lgan bosqichlar; har ikki tur ichida li bandlari keladi. Ro‘yxatdagi semantik tartib CSS bilan marker ko‘rinishini o‘zgartirsangiz ham saqlanadi. Ichki ro‘yxat ham li ichida bo‘lishi kerak."
  },
  {
    "type": "example",
    "content": "Algoritmning bajarish qadamlarini ol bilan, sinf jihozlari ro‘yxatini ul bilan yozing. Bitta qadam ichiga tegishli subqadamlarni nested ol bilan kiriting."
  },
  {
    "type": "trap",
    "content": "Faqat raqamlarni matnga yozish ol kabi mantiqiy tartib bermaydi; li bevosita to‘g‘ri konteynerda bo‘lsin."
  },
  {
    "type": "task",
    "content": "3-mashq. To‘rtta qadam va ikki kichik band uchun to‘g‘ri HTML skeletini yozing."
  },
  {
    "type": "code",
    "content": "<ol><li>Birinchi qadam</li><li>Ikkinchi qadam</li></ol>"
  },
  {
    "type": "heading",
    "content": "4. Rasm img: src va alt"
  },
  {
    "type": "definition",
    "content": "img void element sifatida yopuvchi tegsiz yoziladi; src keng tarqalgan asosiy manba atributi, srcset responsiv rasm manbalarini berishi mumkin. Alt foydalanuvchi rasmni ko‘ra olmaganda ma’no beradi; muhim rasmga kontekstli qisqa tavsif, faqat bezakka bo‘sh alt mos."
  },
  {
    "type": "case",
    "content": "«Kompyuter tarmog‘i» sxemasida alt matn tugunlar va ulanish mazmunini ifodalasin. Faol link rasm bo‘lsa alt havolaning maqsadini bildirishi kerak."
  },
  {
    "type": "trap",
    "content": "img alt «rasm.jpg» foydali emas; faqat src emas, srcset orqali ham rasmga manba beriladigan holatlar bo‘lishi mumkin."
  },
  {
    "type": "task",
    "content": "4-mashq. Ikki mazmunli rasm va bir dekorativ rasm uchun alt qiymatini tanlang."
  },
  {
    "type": "code",
    "content": "<img src=\"tarmoq.png\" alt=\"Uch kompyuterga ulangan marshrutizator\">"
  },
  {
    "type": "heading",
    "content": "5. Rasm o‘lchami va sifat"
  },
  {
    "type": "definition",
    "content": "HTML width/height ko‘rinish uchun o‘lcham yoki nisbat haqida ma’lumot beradi; haqiqiy fayl piksel soni bundan boshqa bo‘lishi mumkin. Responsive CSS rasmni konteynerga moslaydi; aspect-ratio buzmaslik, format va yuklanish tezligini tekshirish kerak."
  },
  {
    "type": "solved",
    "content": "1280×720 rasm mobil sahifada max-width:100%, height:auto bilan moslashadi. Katta asl faylni kichkina width orqali ko‘rsatish internet trafikini avtomatik kamaytirmaydi."
  },
  {
    "type": "trap",
    "content": "Rasmni 5000 pxdan 300 px ko‘rinishga tushirish faylning yuklash hajmini avtomatik kichraytirmaydi."
  },
  {
    "type": "task",
    "content": "5-mashq. Bir katta rasmni mobil va desktop uchun moslash tartibini yozing."
  },
  {
    "type": "heading",
    "content": "6. Figure, figcaption va vizual manba"
  },
  {
    "type": "definition",
    "content": "figure mustaqil rasm/jadval yoki boshqa ko‘rgazmani, figcaption esa uning izohini taqdim etishi mumkin. Manbaga havola yozish huquqiy ruxsatning o‘rnini bosmaydi; lekin manbaning shaffofligini oshiradi."
  },
  {
    "type": "example",
    "content": "Sinf tajribasi grafiki bilan figcaption «2026-yil sinf natijalari (n=24)» izohini bering, manba va birlikni aniqlang."
  },
  {
    "type": "trap",
    "content": "Figure yozishning o‘zi diagrammadagi noto‘g‘ri o‘q yoki manipulyativ miqyosni tuzatmaydi."
  },
  {
    "type": "task",
    "content": "6-mashq. Rasm uchun figure/figcaption kodini va muallif manbasi matnini tuzing."
  },
  {
    "type": "code",
    "content": "<figure><img src=\"tajriba.png\" alt=\"Ikki guruh natijasi taqqoslanmoqda\"><figcaption>Tajriba natijalari</figcaption></figure>"
  },
  {
    "type": "heading",
    "content": "7. CSS orqali fon va matn kontrasti"
  },
  {
    "type": "definition",
    "content": "HTML sahifa strukturasini beradi, CSS esa background-color, color, font-size, line-height kabi ko‘rinish xususiyatlarini boshqaradi. Inline, internal va external CSS turli tashkil etish usullari; ko‘p sahifada bir xil stil uchun external stylesheet foydali."
  },
  {
    "type": "case",
    "content": "Qoramtir fon ustida och matn tanlab, telefon ekranida kontrastni tekshiring; rang biror maqomning yagona belgisi bo‘lmasin."
  },
  {
    "type": "trap",
    "content": "Eskirgan bgcolor atributi orqali butun dizayn qurish HTMLning mazmun va CSSning uslub vazifasini chalkashtiradi."
  },
  {
    "type": "task",
    "content": "7-mashq. Bitta p uchun CSS orqali rang va fon berib, o‘qilish sinovini yozing."
  },
  {
    "type": "code",
    "content": "body { color: #17202a; background-color: #fff; line-height: 1.5; }"
  },
  {
    "type": "heading",
    "content": "8. Belgi kodlash va o‘zbekcha yozuv"
  },
  {
    "type": "definition",
    "content": "UTF-8 turli alifbolarni, jumladan o‘zbek lotin va kirill belgilarini kodlash imkonini beradi. HTMLning head qismida meta charset='utf-8' ko‘rsatish brauzer uchun muhim; real fayl ham shu kodlashda saqlanishi kerak."
  },
  {
    "type": "solved",
    "content": "«O‘qituvchi», «g‘oya», «матн» bir sahifada to‘g‘ri aks etsin; charsetni va fayl saqlash encodingini tekshiring."
  },
  {
    "type": "trap",
    "content": "Faqat meta charsetni yozish noto‘g‘ri kodlangan eski fayl baytlarini avtomatik tuzatmaydi."
  },
  {
    "type": "task",
    "content": "8-mashq. Bitta sahifada lotin-kirill aralash matnning to‘g‘ri ko‘rinishini sinang."
  },
  {
    "type": "heading",
    "content": "9. Havola bilan rasmni bog‘lash"
  },
  {
    "type": "definition",
    "content": "a elementi ichiga img joylashtirilsa surat bosiladigan havolaga aylanadi. Tasvirning alt matni link nima qilishi yoki qayerga olib borishini ifodalashi mumkin; keyboard focus va ko‘rinadigan belgi ham foydali."
  },
  {
    "type": "example",
    "content": "Maktab logotipini bosh sahifaga havola qiling; alt «Maktabning bosh sahifasi» kabi maqsadni ko‘rsatsin."
  },
  {
    "type": "trap",
    "content": "Rasmga title qo‘yish alt yoki keyboard bilan boshqaruvning to‘liq o‘rnini bosa olmaydi."
  },
  {
    "type": "task",
    "content": "9-mashq. Rasmli havola uchun a, img, href, alt ishlatilgan kod yozing."
  },
  {
    "type": "code",
    "content": "<a href=\"/\"><img src=\"logo.png\" alt=\"Bosh sahifaga o‘tish\"></a>"
  },
  {
    "type": "heading",
    "content": "10. Relativ yo‘l va fayllarni tartiblash"
  },
  {
    "type": "definition",
    "content": "Rasm src manzili joriy HTML faylga nisbatan yozilishi mumkin: images/logo.png va ../images/logo.png turli joyni anglatadi. Harf registri ayrim serverlarda muhim; lokal kompyuterda ishlagan nisbiy yo‘l hostingda xato berishi mumkin."
  },
  {
    "type": "case",
    "content": "site/index.html va site/images/logo.png fayllari uchun img src='images/logo.png' mos keladi, agar fayl shu joyda bo‘lsa."
  },
  {
    "type": "trap",
    "content": "Nisbiy manzilni lokal diskdagi absolute C:\\ yo‘li bilan ommaviy veb sahifaga joylash keng tarqalgan xato."
  },
  {
    "type": "task",
    "content": "10-mashq. Ikki papkali sayt uchun uchta rasm yo‘lini tekshiring."
  },
  {
    "type": "heading",
    "content": "11. Sahifa ko‘rinishi, responsivlik va matn"
  },
  {
    "type": "definition",
    "content": "Viewport meta, foizli kenglik va CSS max-width yordamida sahifa turli ekranlarda o‘qilishi mumkin. Mutlaq px birliklari ba’zi elementlar uchun mos, biroq butun joylashuvning faqat bir ekran o‘lchamiga qattiq bog‘lanishi muammo tug‘diradi."
  },
  {
    "type": "solved",
    "content": "Desktopdagi ikki ustun mobil ekranda bitta ustun bo‘lishini CSS layout orqali ta’minlang; matnni zoom qilganda qirqilib qolmasin."
  },
  {
    "type": "trap",
    "content": "«Telefon brauzerida ochildi» sahifaning barcha interaktiv elementi yoki alt tavsifi mos degani emas."
  },
  {
    "type": "task",
    "content": "11-mashq. Mobil va desktop uchun sarlavha, rasm va ro‘yxatni test qilish bandlarini tuzing."
  },
  {
    "type": "heading",
    "content": "12. Yakuniy HTML matn–rasm loyihasi"
  },
  {
    "type": "definition",
    "content": "O‘quv mavzusi haqida HTML maqola yarating: h1/h2, p, strong/em, mark, ol/ul, bitta figure+img/alt, matnli havola va external CSS bilan fon/kontrast. Faylni lokal brauzerda ochib havolalar, rasm yo‘li va klaviatura orqali navbat bilan tekshiring."
  },
  {
    "type": "example",
    "content": "«Internet xavfsizligi» maqolasini yakunlashdan oldin rasmni ko‘rsatmasdan alt izohini o‘qing, keyboard Tab bilan havolaga boring."
  },
  {
    "type": "trap",
    "content": "Ko‘rkam ekran surati imlo, mualliflik, alt va responsive sifat o‘tdi degani emas."
  },
  {
    "type": "task",
    "content": "12-mashq. Semantika, media, manba, rang va qurilmaviy moslik uchun 5 mezonli rubrika tuzing."
  },
  {
    "type": "summary",
    "content": "HTML mazmun va semantika, CSS tashqi ko‘rinishni boshqaradi. h1/h2 mazmun bosqichi, strong/em semantik urg‘u; ol ketma-ketlik, ul erkin ro‘yxat. img src yoki srcset manbasi va kontekstli alt bilan ishlaydi. Mobil moslik, UTF-8 va rasmning nisbiy yo‘lini real qurilmada sinab ko‘ring."
  },
  {
    "type": "answers",
    "content": "1) strong muhimlik, em urg‘u; 2) mark qidiruvdagi moslik; 3) ol ketma-ketlik, ul jihoz; 4) img alt kontekstli; 5) max-width va height:auto; 6) figure izohli mazmun; 7) CSS fon/kontrast; 8) meta va real UTF-8; 9) a ichida img alt link maqsadi; 10) papka yo‘li tekshiriladi; 11) mobil/desktop; 12) rubrika 5 mezon. Ochiq vazifalarda muqobil yechimlar bo‘lishi mumkin."
  },
  {
    "type": "source",
    "content": "Manbalar: Cambridge+ 8-sinf vebsayt yaratish va tasvirlarni kiritish mavzusi (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); Cambridge+ 9-sinf 21-bob HTML/CSS (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); MDN HTML Images and alt (https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images). Mualliflik qayta bayon va mustaqil kodlar; fizik PDFdagi barcha sahifa va rasm 1:1 tasdiqlanmagan."
  }
]
