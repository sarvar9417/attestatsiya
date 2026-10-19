/** TASK-273: Source-grounded information security/digital activity lessons.
 * National ICT grade 8 (2020) and Cambridge+ ICT (2021).
 * No full copyrighted text or unsafe exploit techniques included.
 */
import type { TheoryBlock } from '../topicContent'
export const M13_DIGITAL_TEXTBOOK_ADDITIONS: Record<string, TheoryBlock[]> = {
  "M13.01": [
    { type: "heading", content: "Axborot xavfsizligining uch asosiy maqsadi" },
    { type: "table", content: "| Maqsad | Savol | Buzilish misoli |\n|---|---|---|\n| Maxfiylik | Kim ko‘ra olishi kerak? | Begona odam ma’lumotni o‘qidi |\n| Yaxlitlik | Ma’lumot o‘zgarmadimi? | Yozuv ruxsatsiz tahrirlandi |\n| Mavjudlik | Kerak paytida xizmat ishlaydimi? | Server ishlamay qoldi |" },
    { type: "definition", content: "**Tahdid** zarar keltirishi mumkin bo‘lgan hodisa yoki harakat; **zaiflik** esa undan foydalanish mumkin bo‘lgan himoya nuqsoni. **Xatar** tahdid ehtimoli va mumkin bo‘lgan oqibat bilan baholanadi. Bu uch tushunchani tenglashtirmang." },
    { type: "example", content: "Maktab jurnalida baholarni begona ko‘rishi — maxfiylik, bahoning noqonuniy o‘zgartirilishi — yaxlitlik, jurnalga kirish imkoni bo‘lmasligi — mavjudlik bilan bog‘liq." },
    { type: "source", content: "Manba doirasi: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), axborot xavfsizligi/raqamli faoliyat bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), xavfsiz axborot almashuvi va raqamli xizmatlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Tushunchalar zamonaviy xavfsizlik nazariyasi asosida original qayta bayon." },
  ],
  "M13.02": [
    { type: "heading", content: "Zararli dastur va aldov xabarlarini farqlash" },
    { type: "table", content: "| Xavf | Belgisi | Himoya yo‘nalishi |\n|---|---|---|\n| Virus | Boshqa faylga qo‘shilib tarqalishi mumkin | Tekshirilgan dastur va skanerlash |\n| Worm | Tarmoq orqali mustaqil tarqalishi mumkin | Yangilash, segmentlash |\n| Trojan | Foydali dastur kabi ko‘rinadi | Manbani tekshirish |\n| Ransomware | Ma’lumotga kirishni cheklaydi | Alohida zaxira va himoya |\n| Phishing | Foydalanuvchini aldab maxfiy ma’lumot oladi | Manzil va so‘rovni tekshirish |" },
    { type: "example", content: "O‘qituvchiga «parol darhol yangilanmasa akkaunt yopiladi» degan xabar keldi. Havolani bosib kirish o‘rniga xizmatning o‘z ma’lum manzilidan holatni tekshirish va parol/OTPni boshqalarga bermaslik xavfsizroq." },
    { type: "trap", content: "Har bir phishing xabarida zararli fayl bo‘lishi shart emas; u odamni ma’lumotni o‘zi topshirishga aldashi mumkin. **2FA/MFA** xavfni kamaytiradi, ammo foydalanuvchi tasdiq kodini aldovchiga bersa tahdid saqlanadi." },
    { type: "source", content: "Manba doirasi: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), axborot xavfsizligi/raqamli faoliyat bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), xavfsiz axborot almashuvi va raqamli xizmatlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Misol mudofaa yo‘nalishida original ta’limiy vaziyat, zararli kod yoki ekspluatatsiya ko‘rsatmasi emas." },
  ],
  "M13.03": [
    { type: "heading", content: "Qatlamli himoya va profilaktika" },
    { type: "table", content: "| Himoya qatlami | Vazifa |\n|---|---|\n| Yangilanish | Ma’lum dastur xatolarini tuzatish |\n| Antivirus/EDR | Shubhali faoliyatni aniqlashga yordam |\n| Firewall | Aloqa oqimini qoidalarga ko‘ra cheklash |\n| MFA | Akkauntga kirishda qo‘shimcha tekshiruv |\n| Eng kam huquq | Faqat zarur ruxsatlarni berish |\n| Zaxiralash | Zarardan keyin tiklash imkoniyati |" },
    { type: "example", content: "Antivirus o‘rnatilgan bo‘lsa ham, umumiy parol hamma kompyuterda ishlatilishi katta xavf. Dastur yangilanishi, kuchli akkaunt himoyasi, fayl ruxsatlari va tiklash nusxalari birgalikda foydali." },
    { type: "trap", content: "Antivirus hech bir tahdidni 100% to‘xtatadi, degan kafolat yo‘q. Firewallni fayl virusi bilan tenglashtirmang; zahira nusxasi mavjud bo‘lsa, uni tiklashni sinab ko‘rish ham talab qilinadi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), axborot xavfsizligi/raqamli faoliyat bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), xavfsiz axborot almashuvi va raqamli xizmatlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Zamonaviy mudofaa qatlamlari original umumlashtirilgan." },
  ],
  "M13.04": [
    { type: "heading", content: "Zaxira, sinxronlash, xesh va shifrlash" },
    { type: "table", content: "| Tushuncha | Nima qiladi? | Nima qilmaydi? |\n|---|---|---|\n| Backup | Tiklash uchun alohida nusxa | Har safar avtomatik mukammal tiklanmaydi |\n| Sync | Qurilmalar o‘rtasida bir xil holat | Mustaqil tarixni har doim saqlamaydi |\n| Hash | Ma’lumotdan qayta tiklanmaydigan qisqa iz yaratadi | Maxfiylik uchun shifrlash emas |\n| Encryption | Kalit asosida ma’lumotni o‘qilmaydigan shaklga o‘tkazadi | Fayl yo‘qolishining oldini olmaydi |\n| Raqamli imzo | Mualliflik/yaxlitlikni tekshirishga xizmat qiladi | Kontentni avtomatik maxfiy qilmaydi |" },
    { type: "example", content: "Muhim faylning bir nusxasi ishchi kompyuterda, ikkinchisi tashqi xavfsiz joyda va yana biri alohida muhitda saqlanishi mumkin. Tiklash mashqi bajarilmasa, «backup bor» degan gap tiklanish kafolati emas." },
    { type: "trap", content: "Shifrlash va xeshlash bir xil emas. Shifrlangan fayl kaliti yo‘qolsa, ma’lumotni qaytarish qiyinlashadi; backup bo‘lsa ham zaxiraning o‘ziga ruxsatlar nazorat qilinadi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), axborot xavfsizligi/raqamli faoliyat bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), xavfsiz axborot almashuvi va raqamli xizmatlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Bu bayon muayyan shifrlash algoritmini ishlab chiqarish yo‘riqnomasi emas; ta’limiy tushunchalar farqi." },
  ],
  "M13.05": [
    { type: "heading", content: "Elektron identifikatsiya va raqamli imzo" },
    { type: "table", content: "| Tushuncha | Vazifa |\n|---|---|\n| Elektron identifikatsiya | Foydalanuvchini aniqlash |\n| Autentifikatsiya | Foydalanuvchi da’vosini tekshirish |\n| Avtorizatsiya | Qaysi amal ruxsat etilganini belgilash |\n| Elektron raqamli imzo | Imzo tekshiruvi va hujjat yaxlitligi bilan bog‘liq |\n| Elektron hukumat | Davlat xizmatlarining raqamli kanali |" },
    { type: "example", content: "Shaxs akkauntga kirgani hamma xizmatni tasdiqlashga huquqli ekanini bildirmaydi. Hujjatga elektron imzo qo‘yish uchun tegishli kalitdan xavfsiz foydalanish va imzo tekshiruvini ajratish kerak." },
    { type: "trap", content: "Hujjatga rasm ko‘rinishida imzo surati qo‘yish kriptografik raqamli imzo bilan teng emas. Amal qiluvchi davlat portallari, imzo vositalari va huquqiy tartiblar uchun zamonaviy rasmiy hujjat talab qilinadi." },
    { type: "source", content: "Manba doirasi: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), axborot xavfsizligi/raqamli faoliyat bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), xavfsiz axborot almashuvi va raqamli xizmatlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Amaldagi normativ/huquqiy status 2026-yilga alohida tekshirishni talab qiladi." },
  ],
  "M13.06": [
    { type: "heading", content: "Elektron tijorat, to‘lov xavfsizligi va blockchain" },
    { type: "table", content: "| Tushuncha | Vazifasi | Ehtiyot sharti |\n|---|---|---|\n| Elektron savdo | Internet orqali mahsulot/xizmat savdosi | Sotuvchi va shartlarni tekshirish |\n| To‘lov shlyuzi | To‘lovni qayta ishlash tizimi | Himoyalangan kanal va ruxsatlar |\n| Tranzaksiya | Moliyaviy amal yozuvi | Tasdiq va qaytarish siyosati |\n| Blokcheyn | Bog‘langan bloklar tarixi | Har ma’lumot avtomatik haqiqiy emas |\n| Smart-contract | Kod bilan ifodalangan bajarilish qoidalari | Xato kod va ishonch masalasi |" },
    { type: "example", content: "Onlayn savdoda to‘lov tugmasining mavjudligi savdo halol ekanini kafolatlamaydi. Yetkazish shartlari, qaytarish siyosati, sotuvchi identifikatsiyasi va xavfsiz to‘lov kanalini tekshiring." },
    { type: "trap", content: "Blokcheyn yozuvni keyinroq o‘zgartirishni qiyinlashtirishi mumkin, lekin noto‘g‘ri kiritilgan boshlang‘ich ma’lumotni o‘zi avtomatik rostga aylantirmaydi. Kriptovalyuta va elektron tijorat bir xil tushuncha emas." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), axborot xavfsizligi/raqamli faoliyat bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), xavfsiz axborot almashuvi va raqamli xizmatlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Blockchain mavzusi uchun aniq darslik/nashr sahifasi alohida talab etiladi; mazkur bayon universal rasmiy moliyaviy maslahat emas." },
  ],
  "M13.07": [
    { type: "heading", content: "SMM: maqsad, auditoriya, kontent va o‘lchov" },
    { type: "table", content: "| Bosqich | Savol | Misol |\n|---|---|---|\n| Maqsad | Nima o‘zgarsin? | Onlayn kursga qiziqish |\n| Auditoriya | Kimga murojaat? | O‘qituvchilar |\n| Kontent | Qaysi mazmun? | Qisqa qo‘llanma videosi |\n| Kanal | Qayerda tarqatiladi? | Mos ijtimoiy platforma |\n| O‘lchov | Nima natija berdi? | Ko‘rish, bosish, ro‘yxatdan o‘tish |" },
    { type: "example", content: "Postni 10 000 kishi ko‘rishi ko‘p bo‘lishi mumkin, ammo maqsad kursga ro‘yxatdan o‘tish bo‘lsa, faqat ko‘rish soni bilan samarani baholash yetarli emas. Auditoriya va kerakli harakatni solishtiring." },
    { type: "trap", content: "**Reach** va **impressions** bir xil ko‘rsatkich emas; like yoki follower soni ham har doim sotuv yoki o‘quv natijasini isbotlamaydi. Plattformaning aniq statistikasi vaqt va algoritmga bog‘liq." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, «Informatika va axborot texnologiyalari», 8-sinf, Toshkent: Tasvir, 2020 (https://drive.google.com/file/d/1LkJHiEwsCalXrIQu_YGWzDlTYkkYKcDx/view). I bob — SMM, taxminan bosma 5–22-betlar. Ko‘rsatkichlar bo‘yicha izohlar original ta’limiy sintez." },
  ],
  "M13.08": [
    { type: "heading", content: "CMS: kontent va sayt dizaynini boshqarish" },
    { type: "table", content: "| Qism | Maqsad | Ishdagi ehtiyot |\n|---|---|---|\n| Kontent | Matn, rasm va sahifalar | Mualliflik/yangilanish |\n| Tema | Saytning tashqi ko‘rinishi | Mobil moslashuv |\n| Plugin/modul | Qo‘shimcha imkoniyat | Yangilash va xavfsizlik |\n| Foydalanuvchi roli | Ruxsatlar darajasi | Eng kam zarur huquq |\n| Zaxira | Tiklash | Oldindan sinab ko‘rish |" },
    { type: "example", content: "Sayt muharririga faqat maqola qo‘shish vazifasi berilgan bo‘lsa, unga har bir texnik sozlamani o‘zgartirish huquqini berish shart emas. Kontent va administrator funksiyasini farqlang." },
    { type: "trap", content: "CMS kontentni boshqarishga xizmat qiladi; uni HTML tilining o‘zi yoki hosting xizmati bilan tenglashtirmang. Plugin soni oshgani sayt sifatining avtomatik ko‘rsatkichi emas." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, «Informatika va axborot texnologiyalari», 8-sinf, Toshkent: Tasvir, 2020 (https://drive.google.com/file/d/1LkJHiEwsCalXrIQu_YGWzDlTYkkYKcDx/view). III bob — CMS, taxminan bosma 37–59-betlar; xavfsizlik izohi umumiy original sharh." },
  ],
  "M13.09": [
    { type: "heading", content: "LMS: o‘qish jarayonini boshqaruvchi muhit" },
    { type: "table", content: "| LMS elementi | O‘quv vazifasi |\n|---|---|\n| Kurs | Mavzular ketma-ketligi |\n| Dars materiallari | Nazariya, media, ko‘rsatma |\n| Topshiriq/test | Bilimni tekshirish |\n| Baholash jurnali | Natijani saqlash va kuzatish |\n| Forum/muloqot | Hamkorlik va qayta aloqa |\n| Rol va ruxsat | O‘qituvchi/talaba imkoniyati |" },
    { type: "example", content: "O‘quvchi testdan past natija olgan bo‘lsa, LMS bu natijani ko‘rsatishi va qayta o‘rganish topshiriqlariga yo‘naltirishi mumkin. Platforma mavjudligi dars metodikasi avtomatik samarali degani emas." },
    { type: "trap", content: "**LMS** — o‘quv jarayonini boshqarish tizimi; **CMS** esa umumiy sayt kontentini boshqarish uchun. Ikkalasida ham material bo‘lishi mumkin, ammo yetakchi vazifasi farq qiladi." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, «Informatika va axborot texnologiyalari», 8-sinf, Toshkent: Tasvir, 2020 (https://drive.google.com/file/d/1LkJHiEwsCalXrIQu_YGWzDlTYkkYKcDx/view). IV bob — LMS, taxminan bosma 60–76-betlar. O‘quv vaziyatlari original." },
  ],
  "M13.10": [
    { type: "heading", content: "MOOC va an’anaviy onlayn kurs farqi" },
    { type: "table", content: "| Belgisi | MOOC xususiyati |\n|---|---|\n| Massive | Ko‘p sonli ishtirokchiga mo‘ljallangan |\n| Open | Kursga kirish imkoniyati odatda keng |\n| Online | Masofaviy raqamli format |\n| Course | Natija, material, vazifa va baholash tuzilmasi |" },
    { type: "example", content: "MOOCga ro‘yxatdan o‘tganlar soni bilan kursni tugatganlar soni bir xil emas. O‘rganish samaradorligini baholashda yakunlaganlar foizi, topshiriq natijalari va ishtirok shartlari ajratiladi." },
    { type: "trap", content: "«Ochiq» tushunchasi har bir xizmat/sertifikat mutlaqo bepul degani emas. MOOCning qanday modelda ishlashi platforma va tashkilotga qarab farqlanadi." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, «Informatika va axborot texnologiyalari», 8-sinf, Toshkent: Tasvir, 2020 (https://drive.google.com/file/d/1LkJHiEwsCalXrIQu_YGWzDlTYkkYKcDx/view). V bob — MOOC, taxminan bosma 77–93-betlar; kursning iqtisodiy shartlari konkret platforma bo‘yicha qayta tekshiriladi." },
  ],
  "M13.11": [
    { type: "heading", content: "Web-freelance loyihasini rejalash va topshirish" },
    { type: "table", content: "| Bosqich | Natija | Xavf |\n|---|---|---|\n| Talablarni aniqlash | Vazifa va hajm | Noma’lum scope |\n| Taklif | Vaqt, narx va deliverable | Noto‘g‘ri kutishlar |\n| Ish jarayoni | Versiya va natija | Ma’lumot yo‘qolishi |\n| Sinov | Havola, responsivlik, xato | Mijoz qurilmasida ishlamaslik |\n| Topshirish | Fayl, ruxsat, qo‘llanma | Yagona administrator kaliti |\n| Qayta aloqa | Tuzatish ro‘yxati | Cheksiz kelishilmagan o‘zgarish |" },
    { type: "example", content: "Mijozga sayt tayyorlab berishda faqat skrinshot emas, ishlaydigan sahifa, kerakli fayllar, ruxsatlar, qisqa foydalanish ko‘rsatmasi va qaysi ishlar kelishuvga kirishi haqida aniq ma’lumot berish kerak." },
    { type: "trap", content: "Portfelda boshqalarning ishini o‘ziniki deb ko‘rsatish kasbiy etikaga zid. Narx, to‘lov kafolati va platforma qoidalari o‘zgaruvchan: eski 2020-yilgi misollarni bugungi majburiy qoida deb qabul qilmang." },
    { type: "source", content: "Manba: M.R. Fayziyeva, D.M. Sayfurov, «Informatika va axborot texnologiyalari», 8-sinf, Toshkent: Tasvir, 2020 (https://drive.google.com/file/d/1LkJHiEwsCalXrIQu_YGWzDlTYkkYKcDx/view). VI bob — Web-freelance, taxminan bosma 94–104-betlar; original loyiha boshqaruvi misoli." },
  ],
}
