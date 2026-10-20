/** TASK-305: original source-guided HTML tables, forms and security chapter. */
import type { TheoryBlock } from '../topicContent'
export const M11_03_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "HTML table/tr/th/td, caption/scope, rowspan/colspan, form action/method, label/id/name, input turlari, validatsiya va ma’lumot maxfiyligi farqlarini real kodda qo‘llash."
  },
  {
    "type": "intro",
    "content": "Jadval va forma HTMLning ikki turli vazifasini bajaradi: biri ma’lumotni tartibli ko‘rsatadi, ikkinchisi foydalanuvchidan qiymat kiritishni so‘raydi. Ushbu bob semantik kod va backend xavfsizligi chegarasini keskin ajratadi."
  },
  {
    "type": "table",
    "content": "| Element | Vazifa | Qoida |\n|---|---|---|\n| th | Jadval sarlavhasi | scope mos |\n| td | Jadval qiymati | Sarlavhaga bog‘liq |\n| caption | Jadval nomi | Mazmunli |\n| label | Input nomi | for=id mos |\n| input name | Jo‘natiladigan maydon nomi | Unikal/aniq |\n| required | Brauzer tekshiruvi | Server ham tekshiradi |"
  },
  {
    "type": "code",
    "content": "<table><caption>III chorak</caption><thead><tr><th scope=\"col\">Fan</th><th scope=\"col\">Ball</th></tr></thead><tbody><tr><th scope=\"row\">Informatika</th><td>86</td></tr></tbody></table>\n<form><label for=\"ism\">Ism</label><input id=\"ism\" name=\"ism\" required><button type=\"submit\">Tekshirish</button></form>"
  },
  {
    "type": "heading",
    "content": "1. Ma’lumot jadvali va maket jadvali farqi"
  },
  {
    "type": "definition",
    "content": "HTML table qator va ustun orasida mantiqiy bog‘liqlik bo‘lgan ma’lumotni ifodalaydi. Saytning butun joylashuvini table yordamida qurish odatda semantik jihatdan mos emas; buning uchun CSS Grid/Flex kabi vositalar mavjud."
  },
  {
    "type": "case",
    "content": "Sinf baholari ustun va qatorlarga ega bo‘lgani uchun table bilan mos, menyuni yonma-yon joylash uchun esa CSS afzal."
  },
  {
    "type": "trap",
    "content": "Jadvalning faqat chegarasi borligi ma’lumotning ustun va satr mazmuni to‘g‘ri bog‘langanini bildirmaydi."
  },
  {
    "type": "task",
    "content": "1-mashq. Ikki vaziyatdan qaysi biri table, qaysisi CSS layout ekanini belgilang."
  },
  {
    "type": "heading",
    "content": "2. table, tr, th va td"
  },
  {
    "type": "definition",
    "content": "table jadvalning o‘zi; tr har bir qator, th sarlavha katagi, td odatiy ma’lumot katagi. Jadvaldagi sarlavha kataklari qator yoki ustun bilan bog‘liq bo‘lishi mumkin; ularni o‘quvchi tushunishi uchun tartib va scope muhim."
  },
  {
    "type": "solved",
    "content": "Fan va baho ustunlariga th, Informatika va 86 qiymatlariga td bering. Yuqoridagi birinchi tr sarlavha qatori bo‘lsin."
  },
  {
    "type": "trap",
    "content": "th qalin ko‘rinishi uchun emas, semantik sarlavha bog‘lanishi uchun kerak; CSS o‘lchamini alohida sozlash mumkin."
  },
  {
    "type": "task",
    "content": "2-mashq. Ikki ustunli uch qator jadval HTML kodini yozing."
  },
  {
    "type": "code",
    "content": "<table><tr><th>Fan</th><th>Ball</th></tr><tr><td>Informatika</td><td>86</td></tr></table>"
  },
  {
    "type": "heading",
    "content": "3. caption, thead, tbody va scope"
  },
  {
    "type": "definition",
    "content": "caption jadval nomini ko‘rsatadi; thead va tbody sarlavha/tana qatorlarini guruhlaydi. th scope=col ustun, scope=row qator sarlavhasini bildirishi mumkin. Murakkab jadvalda sarlavha bilan data bog‘lanishi aniq bo‘lishi kerak."
  },
  {
    "type": "example",
    "content": "Jadval sarlavhasi «III chorak natijalari» bo‘lsin; dars nomini qatorning th scope=row katagiga joylashtiring."
  },
  {
    "type": "trap",
    "content": "Jadvalni faqat rang bilan tushuntirish qulaylikka zarar yetkazishi mumkin; sarlavha nomlari mavjud bo‘lsin."
  },
  {
    "type": "task",
    "content": "3-mashq. Bir qator sarlavhasi va ikkita ustun sarlavhasi bor kod yozing."
  },
  {
    "type": "code",
    "content": "<table><caption>Baholar</caption><thead><tr><th scope=\"col\">Fan</th><th scope=\"col\">Ball</th></tr></thead></table>"
  },
  {
    "type": "heading",
    "content": "4. Rowspan, colspan va izchil tuzilma"
  },
  {
    "type": "definition",
    "content": "colspan bir katakning nechta ustunni, rowspan esa nechta qatorni qamrab olishini bildiradi. Ular jadval geometriyasini murakkablashtiradi, shuning uchun ekrandagi va screen readerdagi bog‘lanishni tekshirish kerak."
  },
  {
    "type": "case",
    "content": "Ikki sinf uchun umumiy «Jami» katagi colspan=2 bo‘lsin; avval har qator ustun sonlari mos kelishini tekshiring."
  },
  {
    "type": "trap",
    "content": "Bir yacheykaga colspan yozish barcha qatorlarning mazmunini avtomatik moslashtirmaydi."
  },
  {
    "type": "task",
    "content": "4-mashq. 3 ustunli jadvalda umumiy sarlavha va alohida qiymatlarni tasvirlang."
  },
  {
    "type": "heading",
    "content": "5. Form: kiritish va yuborish tushunchasi"
  },
  {
    "type": "definition",
    "content": "form foydalanuvchi ma’lumotini to‘plash va yuborish strukturasini belgilaydi. action manzilni, method GET/POST kabi HTTP yuborish turini ko‘rsatadi. Haqiqiy server yo‘q bo‘lsa forma ma’lumotni xavfsiz saqlaydi yoki yetkazadi degan da’vo qilinmasin."
  },
  {
    "type": "solved",
    "content": "Mahalliy mashqda action atributisiz faqat input va button ko‘rsatish mumkin. Real onlayn shakl serverda tekshirilishi, maxfiylik va foydalanuvchi roziligi talab qilishi mumkin."
  },
  {
    "type": "trap",
    "content": "Frontendga required atributini yozish server tekshiruvining o‘rnini bosmaydi."
  },
  {
    "type": "task",
    "content": "5-mashq. Qaysi vazifada GET, qaysisida POST xavfsizlikni hisobga olib ishlatilishini asoslang."
  },
  {
    "type": "code",
    "content": "<form action=\"/submit\" method=\"post\"><label for=\"ism\">Ism</label><input id=\"ism\" name=\"ism\"><button type=\"submit\">Yuborish</button></form>"
  },
  {
    "type": "heading",
    "content": "6. Label bilan inputni bog‘lash"
  },
  {
    "type": "definition",
    "content": "label for qiymati input id bilan mos bo‘lsa, maydon nomi tushunarli va aktivlash oson bo‘ladi. name atributi yuboriladigan ma’lumot kalitini beradi; id sahifa ichida elementi aniqlaydi. Placeholder labelni almashtirmaydi."
  },
  {
    "type": "example",
    "content": "label for=ism va input id=ism name=ism kabi juftlik yozing. Ikkinchi maydon uchun boshqa id tanlang."
  },
  {
    "type": "trap",
    "content": "Foydalanuvchi yozishni boshlagach placeholder ko‘rinmay qolishi mumkin; uni yagona ko‘rsatma deb olmang."
  },
  {
    "type": "task",
    "content": "6-mashq. Uch maydonli forma uchun label/id/name mosligini tekshiring."
  },
  {
    "type": "code",
    "content": "<label for=\"email\">Elektron pochta</label><input id=\"email\" name=\"email\" type=\"email\">"
  },
  {
    "type": "heading",
    "content": "7. Input text, email, number va password"
  },
  {
    "type": "definition",
    "content": "type=text oddiy matn, email elektron pochta shaklini, number son kiritishni, password esa kiritilgan belgilarni ekranda yashirishni qo‘llaydi. type=password ma’lumotni shifrlash yoki xavfsiz uzatishni o‘zi ta’minlamaydi; HTTPS va serverdagi himoya zarur."
  },
  {
    "type": "case",
    "content": "Mashq formasida email maydonini ko‘rib, brauzer noto‘g‘ri format haqida ogohlantirishi mumkin. Lekin bu faqat foydalanuvchiga yordam, yakuniy xavfsizlik emas."
  },
  {
    "type": "trap",
    "content": "Parol belgilarining yulduzcha bilan ko‘rinishi parol avtomatik shifrlangani va server uni xavfsiz saqlagani degani emas."
  },
  {
    "type": "task",
    "content": "7-mashq. Password va email input turlarining UI hamda xavfsizlik farqini yozing."
  },
  {
    "type": "code",
    "content": "<label for=\"parol\">Parol</label><input id=\"parol\" name=\"parol\" type=\"password\" autocomplete=\"new-password\">"
  },
  {
    "type": "heading",
    "content": "8. Radio, checkbox va select"
  },
  {
    "type": "definition",
    "content": "Bir nom ostidagi radio elementlar odatda bitta tanlovga, checkbox esa bir nechta mustaqil tanlovga mos. select va option ro‘yxatdan qiymat tanlash imkonini beradi. Har bir variantning labeli aniq, vazifa shaffof bo‘lsin."
  },
  {
    "type": "solved",
    "content": "«Sinf darajasi» uchun radio tanlovlardan bitta, «qiziqishlar» uchun checkboxlardan ko‘p belgilang; «shahar» uchun select mos."
  },
  {
    "type": "trap",
    "content": "Radio elementlarning name qiymati turlicha bo‘lsa ular bir guruh sifatida ishlamasligi mumkin."
  },
  {
    "type": "task",
    "content": "8-mashq. Yagona va ko‘p tanlovli savollar uchun HTML formalari rejasini yozing."
  },
  {
    "type": "code",
    "content": "<label><input type=\"radio\" name=\"sinf\" value=\"9\"> 9-sinf</label><label><input type=\"radio\" name=\"sinf\" value=\"10\"> 10-sinf</label>"
  },
  {
    "type": "heading",
    "content": "9. required, min, max, pattern va client validation"
  },
  {
    "type": "definition",
    "content": "required maydon bo‘sh qolmasligini, min/max sonli yoki sanali chegarani, pattern esa ayrim matn maydonlari uchun andoza tekshiruvini belgilashi mumkin. Brauzerdagi tekshiruv foydalanuvchi tajribasiga yordam beradi, ammo uni chetlab o‘tish mumkin; server ham validatsiya qilishi kerak."
  },
  {
    "type": "example",
    "content": "O‘quvchining yoshi uchun number min=5 max=100, aloqa manzili uchun email ishlating; server ham kiritmani ruxsat va yaxlitlik bo‘yicha tekshirsin."
  },
  {
    "type": "trap",
    "content": "Faqat pattern ishlatish foydalanuvchi ma’lumoti zararli emasligiga kafolat bermaydi."
  },
  {
    "type": "task",
    "content": "9-mashq. Bir forma uchun ikkita client qoida va ikkita server qoida yozing."
  },
  {
    "type": "code",
    "content": "<input type=\"number\" name=\"yosh\" min=\"5\" max=\"100\" required>"
  },
  {
    "type": "heading",
    "content": "10. Submit, button va yuborish oqimi"
  },
  {
    "type": "definition",
    "content": "button type=submit forma yuborishni ishga tushiradi; oddiy button type=button esa faqat boshqa hodisa bilan ishlashi mumkin. Default xatti-harakatlar brauzer va form kontekstiga bog‘liq. Yuborishdan oldin qaysi ma’lumot ketishi va kim olishi tushunarli bo‘lsin."
  },
  {
    "type": "case",
    "content": "Yuborish tugmasidan oldin maxfiylik izohini, kerak bo‘lsa rozilik checkboxini qo‘shing. Demo sahifada real parol/telefonni to‘plamang."
  },
  {
    "type": "trap",
    "content": "type=submit tugmasini bosishning o‘zi saqlash yoki tasdiqlash muvaffaqiyatli bo‘lganini bildirmaydi."
  },
  {
    "type": "task",
    "content": "10-mashq. Yuborishdan keyin foydalanuvchiga qanday xabar va xato holati berilishini rejalang."
  },
  {
    "type": "code",
    "content": "<button type=\"submit\">Yuborish</button><button type=\"button\">Yordam</button>"
  },
  {
    "type": "heading",
    "content": "11. Kirish imkoniyati va jadval/forma etikasi"
  },
  {
    "type": "definition",
    "content": "Formada label, to‘g‘ri qator tartibi, xato matni va klaviatura orqali foydalanish tekshiriladi. Jadvalda caption, scope va mobil ekran uchun o‘qilishi zarur. Shaxsiy ma’lumot kam yig‘ilsin, maqsadi aytilsin va zarur bo‘lmasa saqlanmasin."
  },
  {
    "type": "solved",
    "content": "Sinf natijalarini saytda ko‘rsatishdan oldin ism va bahoni ommaga chiqarish zaruriyatini qayta tekshiring; muqobil jamlanma statistikani tanlang."
  },
  {
    "type": "trap",
    "content": "Sahifa HTML sintaksis jihatdan to‘g‘ri bo‘lsa ham ma’lumot maxfiyligi yoki accessibility automatik tasdiqlanmaydi."
  },
  {
    "type": "task",
    "content": "11-mashq. Forma/jadval uchun klaviatura, matnli xato va maxfiylikni tekshirish ro‘yxatini yozing."
  },
  {
    "type": "heading",
    "content": "12. Yakuniy amaliy mini-loyiha"
  },
  {
    "type": "definition",
    "content": "Uch qatorli sinf jadvali va ishlaydigan UIga ega, lekin real ma’lumot yubormaydigan demo formani tayyorlang. table, th, td, caption, label, input type, radio, select va buttonlarni maqsadiga mos qo‘llang; sintaksis hamda mobil ko‘rinishni brauzerda tekshiring."
  },
  {
    "type": "example",
    "content": "Fanlar ro‘yxati uchun captionli table, fikr-mulohaza uchun ism/klass/taklif kiritiladigan, submit hodisasini faqat mahalliy tasdiqga bog‘laydigan maket tuzing."
  },
  {
    "type": "trap",
    "content": "Demo formaning UI ko‘rinishini real production backend va parol xavfsizligiga tenglashtirmang."
  },
  {
    "type": "task",
    "content": "12-mashq. Semantika, input/label, validatsiya, ma’lumot xavfsizligi, mobil moslikdan iborat rubrika yarating."
  },
  {
    "type": "summary",
    "content": "Table ko‘rsatish, form kiritish uchun. th/scope sarlavha bog‘lanishini, label for va input id nomlanishini yaxshilaydi; input name yuborish uchun kalitdir. type=password belgilarni yashiradi, ma’lumotni shifrlamaydi. Required, pattern, min/max faqat client yordam; server validation va HTTPS xavfsizlik talabidir."
  },
  {
    "type": "answers",
    "content": "1) sonli qator/ustun ma’lumot table; 2) tr qatorda, th sarlavha, td qiymat; 3) caption nom, scope bog‘lanish; 4) rowspan/colspan qo‘shilishi; 5) form yuborish jarayoni; 6) for=id mos, name ma’lumot kaliti; 7) password encryption emas; 8) radio yagona, checkbox ko‘p; 9) frontend/server tekshiruv; 10) submit natijasi serverdan tasdiq; 11) accessibility va privacy; 12) 5 mezonli rubrika. Ochiq vazifalar bir nechta asosli yechimga ega."
  },
  {
    "type": "source",
    "content": "Manbalar: Cambridge+ 9-sinf 21-bob «Veb-sayt yaratish», HTML table misoli bosma taxminan 281-bet (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf veb dasturlash va HTML form mavzusi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Form server xavfsizligi va kirish imkoniyati bo‘yicha mustaqil mualliflik izohi; fizik PDF barcha bet va sxemalar bo‘yicha 1:1 to‘liqlik tasdiqlanmagan."
  }
]
