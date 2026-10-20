/** TASK-306: source-guided web design, QA, privacy and release book. */
import type { TheoryBlock } from '../topicContent'
export const M11_07_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Veb loyiha maqsadi, auditoriya, kontent arxitekturasi, wireframe/prototip, semantik HTML/CSS, mobil/a11y, W3C validatorlar, brauzer, performance, security va regressiya sinovlarini real loyiha sxemasiga qo‘llash."
  },
  {
    "type": "intro",
    "content": "Sayt loyihalash foydalanuvchi ehtiyojidan boshlanadi, faqat kodni yozib yoki validatorga yuborib tugamaydi. Tizimli loyiha oldindan reja, semantik va responsiv amalga oshirish, turli odam/qurilmada sinash hamda xavfsiz release chegaralarini talab qiladi."
  },
  {
    "type": "table",
    "content": "| Bosqich | Mahsulot | Tekshiruv |\n|---|---|---|\n| Maqsad | Auditoriya-vazifa | Muvaffaqiyat mezoni |\n| Arxitektura | Sitemap | Topa olish |\n| Dizayn | Wireframe | Mobil layout |\n| Kodlash | HTML/CSS | Semantika |\n| Test | Matriks | A11y/speed/security |\n| Release | Ruxsatli versiya | Regressiya dalillari |"
  },
  {
    "type": "heading",
    "content": "1. Saytning maqsadi va auditoriyasi"
  },
  {
    "type": "definition",
    "content": "Loyihalashda «kim foydalanadi» va «nima topishi yoki bajarishi kerak» savollari yoziladi. Foydalanuvchining qurilmasi, tili, ehtiyojlari va raqamli savodxonligi dizayn va kontent qarorini belgilaydi. Maqsad o‘lchab bo‘ladigan natijaga aylantirilishi kerak."
  },
  {
    "type": "case",
    "content": "Maktab jadvali saytida o‘quvchi ikki bosishda o‘z sinfining dars jadvalini topa olishi sinov vazifasi bo‘lsin."
  },
  {
    "type": "trap",
    "content": "Avval chiroyli rang sxemasini tanlab, foydalanuvchi ehtiyojini keyin o‘ylash katta qayta ishlashga olib kelishi mumkin."
  },
  {
    "type": "task",
    "content": "1-mashq. Bitta real auditoriya, uning vazifasi va muvaffaqiyat o‘lchovini yozing."
  },
  {
    "type": "heading",
    "content": "2. Kontent inventari va ma’lumot arxitekturasi"
  },
  {
    "type": "definition",
    "content": "Saytga kerak bo‘ladigan matn, media, jadval, ma’lumot manbasi va mavzular ro‘yxati kontent inventari deyiladi. Information architecture mazmunni topilishi oson bo‘lgan toifalar va navigatsiyaga ajratadi. Turli foydalanuvchilar topa olishiga sinov qilinadi."
  },
  {
    "type": "solved",
    "content": "Maktab sayti: yangiliklar, dars jadvali, o‘qituvchilar, aloqa. Asosiy menyudan qaysi bo‘lim birinchi topilishini amaliy foydalanuvchidan so‘rang."
  },
  {
    "type": "trap",
    "content": "Saytda ko‘p sahifa bo‘lishi navigatsiya tushunarli degani emas; katta menyu ma’lumot qidirishni sekinlashtirishi mumkin."
  },
  {
    "type": "task",
    "content": "2-mashq. To‘rtta sahifalik sitemap tuzing va har bir sahifaning vazifasini yozing."
  },
  {
    "type": "heading",
    "content": "3. Wireframe va prototip"
  },
  {
    "type": "definition",
    "content": "Wireframe sahifaning dastlabki joylashuv sxemasi; prototip undagi ba’zi navigatsiya yoki interaksiyani sinash imkonini berishi mumkin. Dastlab qora-oq soddalashtirilgan skelet bilan muhim ma’lumot tartibini baholash oson."
  },
  {
    "type": "example",
    "content": "Telefonda jadval qidirish ekrani chizing: sarlavha, sinf tanlash, natija va yordam linki. Keyin bosiladigan prototipda test bajaring."
  },
  {
    "type": "trap",
    "content": "Wireframe o‘zi ishlaydigan real sayt yoki serverning mavjudligini tasdiqlamaydi."
  },
  {
    "type": "task",
    "content": "3-mashq. Mobil birinchi ekran va desktop ekranining wireframe farqini chizing."
  },
  {
    "type": "code",
    "content": "<header>...</header><nav>...</nav><main>...</main><footer>...</footer>"
  },
  {
    "type": "heading",
    "content": "4. Semantik HTML va vizual iyerarxiya"
  },
  {
    "type": "definition",
    "content": "HTML sarlavha, nav, main, section, form va jadval rolini, CSS esa rang va oraliqlarni boshqaradi. Sarlavha darajalari mazmuniy tartib bo‘lishi, rasmlarda mazmunli alt, havolalarda aniq matn bo‘lishi kerak."
  },
  {
    "type": "case",
    "content": "Bosh sahifada h1 sayti nomi, mainda ikki h2 bo‘lim, navda mazmunli linklar bilan skelet tuzing."
  },
  {
    "type": "trap",
    "content": "CSSda font-size katta berish p elementni semantik h1ga aylantirmaydi."
  },
  {
    "type": "task",
    "content": "4-mashq. Uch bo‘limli semantik HTML skeletini yozing."
  },
  {
    "type": "code",
    "content": "<main><h1>Maktab</h1><section><h2>Jadval</h2></section></main>"
  },
  {
    "type": "heading",
    "content": "5. Responsiv dizayn va qurilma sinovi"
  },
  {
    "type": "definition",
    "content": "Telefon, planshet va desktop eni farqli; responsive layout kontent buziladigan joylarga moslashishi kerak. Gorizontal overflow, tugma o‘lchami, matn zoom, rasm nisbatlari va formaning sarlavhasi alohida tekshiriladi."
  },
  {
    "type": "solved",
    "content": "360 px telefon va 1280 px desktop ko‘rinishida saytni oching: navigation menyu, jadval va yuborish tugmasi qirqilmaganini tekshiring."
  },
  {
    "type": "trap",
    "content": "Faqat «mobil» presetni DevToolsda tanlash real sensorli qurilma, klaviatura va zoom sinovining to‘liq o‘rnini bosmaydi."
  },
  {
    "type": "task",
    "content": "5-mashq. 360/768/1280 px uchun uchta muvaffaqiyat mezonini yozing."
  },
  {
    "type": "code",
    "content": "@media (max-width: 600px) { .grid { display: block; } }"
  },
  {
    "type": "heading",
    "content": "6. Kirish imkoniyati: kontrast, fokus, alt, subtitr"
  },
  {
    "type": "definition",
    "content": "Foydalanuvchi ko‘rish, eshitish yoki klaviatura imkoniyatlari farqli bo‘lishi mumkin. Semantik sarlavha, rasm alt, video caption, fokus ko‘rsatkichi va rang kontrasti ularga yordam beradi. WCAG mezonlari umumiy yo‘nalish beradi, lekin foydalanuvchi bilan real sinovni to‘liq almashtirmaydi."
  },
  {
    "type": "example",
    "content": "Faqat qizil va yashil rang bilan noto‘g‘ri/to‘g‘ri belgilangan natijaga «Xato» va «To‘g‘ri» matnini ham qo‘shing."
  },
  {
    "type": "trap",
    "content": "Lighthouse biror accessibility skor berdi, demak sayt real foydalanishda har bir kishiga to‘liq mos degan xulosa noto‘g‘ri."
  },
  {
    "type": "task",
    "content": "6-mashq. Bir sahifaga klaviatura va ekran o‘qigich sinovi uchun ro‘yxat tuzing."
  },
  {
    "type": "heading",
    "content": "7. HTML va CSS validatsiyasi"
  },
  {
    "type": "definition",
    "content": "W3C Nu HTML Checker HTML markup qoidalariga muvofiqlikni, W3C CSS Validator esa CSS grammatikasi/rulsetlarni tekshirishda yordam beradi. Brauzer xato HTMLni ko‘pincha o‘zi tuzatib aks ettirishi mumkin, ammo validator muammo haqida ogohlantiradi."
  },
  {
    "type": "case",
    "content": "HTML faylni Nu Validatorga, CSSni CSS Validatorga bering; natijadagi warnings va errorsni vazifaga muvofiq ajrating."
  },
  {
    "type": "trap",
    "content": "Validator xavfsizlik, tezlik, server ma’lumotlari to‘g‘riligi va accessibilityning barcha talablarini avtomatik tekshiradigan vosita emas."
  },
  {
    "type": "task",
    "content": "7-mashq. W3C HTML va CSS tekshiruvlarining farqini aniq ayting."
  },
  {
    "type": "code",
    "content": "<!-- HTML Validator: https://validator.w3.org/nu/ -->"
  },
  {
    "type": "heading",
    "content": "8. Cross-browser va platforma mosligi"
  },
  {
    "type": "definition",
    "content": "Brauzerlar bir standartga tayanadi, ammo versiya, codec, font, OS va qurilma xususiyatida farq bo‘lishi mumkin. Chrome/Firefox/Safari yoki mos test muhitida havola, forma, media va layoutni sinab, topilgan xatoni qayd eting."
  },
  {
    "type": "solved",
    "content": "Bir video Chrome’da ishlayapti, boshqa brauzerda yo‘q: konteyner/kodek, media source va qurilma qo‘llovini tekshiring."
  },
  {
    "type": "trap",
    "content": "Faqat bir brauzerda yaxshi ko‘rinish barcha qurilmada mutlaq moslikni isbotlamaydi."
  },
  {
    "type": "task",
    "content": "8-mashq. Ikki brauzer uchun 5 bandli sinov matriksini tuzing."
  },
  {
    "type": "heading",
    "content": "9. Performance: resurs hajmi va yuklanish"
  },
  {
    "type": "definition",
    "content": "Rasm va video hajmi, network sharoiti, CSS/JS fayllari hamda server kechikishi sahifa ochilishiga ta’sir qiladi. Lighthouse performance hisobotida laboratoriya metrikalari bor; haqiqiy foydalanuvchi sharoitini ham hisobga olish kerak. Muhim tasvirlarni mos format va o‘lchamda yuboring."
  },
  {
    "type": "example",
    "content": "5 MB banner fotosi 600 KB optimallashgan formatga o‘tsa, tarmoq sharoitiga qarab tezroq yuklanishi mumkin; ko‘rinish sifatini ham tekshiring."
  },
  {
    "type": "trap",
    "content": "Lighthouse 100 ball butun dunyoda har doim 100 ball yoki server nosozligi yo‘qligini anglatmaydi."
  },
  {
    "type": "task",
    "content": "9-mashq. Performance uchun resurs, tarmoq va foydalanuvchi bilan 3 omilli sinov tuzing."
  },
  {
    "type": "heading",
    "content": "10. Sayt xavfsizligi va maxfiylik chegarasi"
  },
  {
    "type": "definition",
    "content": "HTTPS tranzitdagi ma’lumotlarni himoyalashga yordam beradi, lekin ilovaning har qanday xatosini yo‘qotmaydi. XSSga qarshi foydalanuvchi matnini kontekstga mos escaping/sanitization, DB so‘rovida parametrli so‘rovlar va server autentifikatsiyasi kerak. Formadan faqat zarur ma’lumotni yig‘ing."
  },
  {
    "type": "case",
    "content": "Mahalliy demo forma real o‘quvchi paroli yoki shaxsiy hujjatini so‘ramasin. Public sayt uchun HTTPS va server validatsiyasini majburiy sifat mezoni qiling."
  },
  {
    "type": "trap",
    "content": "W3C Validator XSS/SQL injectionga to‘liq qarshi himoyani avtomatik ta’minlamaydi; browser test security audit emas."
  },
  {
    "type": "task",
    "content": "10-mashq. Saytga chiqariladigan ma’lumotning maxfiylik va kiritma tekshiruv ro‘yxatini tuzing."
  },
  {
    "type": "heading",
    "content": "11. Testing, tuzatish va release jarayoni"
  },
  {
    "type": "definition",
    "content": "Test case kirish sharti, amal, kutiladigan natija va haqiqiy natijani yozadi. Xato topilganda minimal takrorlash qadamini va qurilma/brauzerni qayd etib, tuzatishdan keyin regressiya sinovi qiling. Versiya boshqaruvi bilan release nazorati farqli jarayon."
  },
  {
    "type": "solved",
    "content": "Formadagi Yuborish tugmasi kichik ekranda ekrandan chiqib qolsa, eni va OSni yozing; CSS tuzatilgach uch ekran hajmida qayta tekshiring."
  },
  {
    "type": "trap",
    "content": "Bitta muvaffaqiyatli smoke test saytdagi barcha sahifa va vazifalar testdan o‘tdi degani emas."
  },
  {
    "type": "task",
    "content": "11-mashq. Bir xato uchun before/after test case va regression ssenariy yozing."
  },
  {
    "type": "table",
    "content": "| Test | Kutilgan natija | Haqiqiy natija | Holat |\n|---|---|---|---|\n| Mobil forma | Tugma sig‘adi | Tekshiriladi | Ochiq |"
  },
  {
    "type": "heading",
    "content": "12. Yakuniy loyiha va mustaqil rubrika"
  },
  {
    "type": "definition",
    "content": "Saytni maqsad/auditoriya → kontent inventari → sitemap/wireframe → semantik HTML/CSS → test → faqat ruxsatli release ketma-ketligida rivojlantiring. Hujjatda qayta foydalanish, accessibility, xavfsizlik va sifat dalillari bo‘lsin. Productionga joylash uchun alohida ruxsat va jarayon talab qilinadi."
  },
  {
    "type": "example",
    "content": "Sinf tadbiri sayti uchun maket, ikki sahifa, bir formadagi local demo va sinov hisoboti tayyorlang; bu amaliy topshiriqda uni internetga tarqatish shart emas."
  },
  {
    "type": "trap",
    "content": "«Hosting» dars mavzusi mavjudligi platformani avtomatik deploy qilishga ruxsat bermaydi; release faqat loyiha ruxsatidan keyin."
  },
  {
    "type": "task",
    "content": "12-mashq. 5 mezon: foydalanuvchi, semantika, mobil/a11y, test va xavfsizlik bo‘yicha 0–2 balli rubrika yozing."
  },
  {
    "type": "summary",
    "content": "Loyihalash foydalanuvchi va maqsaddan, keyin sitemap/wireframe, semantik HTML/CSS va sinovdan iborat. HTML/CSS validatorlari sintaksis/standartni ko‘radi, lekin XSS, login, accessibility yoki yuqori trafikni to‘liq tekshirmaydi. Performance, cross-browser, keyboard, privacy va regressiya alohida nazoratdir. Ruxsatsiz deploy yo‘q."
  },
  {
    "type": "answers",
    "content": "1) auditoriya/muvaffaqiyat; 2) sitemap; 3) wireframe vs prototip; 4) semantik HTML; 5) 360/768/1280 sinov; 6) alt/kontrast/fokus/caption; 7) HTML va CSS validatorlar farqi; 8) brauzer/kodek sinovi; 9) resurs hajmi; 10) HTTPS + escaping + server; 11) test case/regressiya; 12) ruxsatli release. Ochiq mashqlar asos bilan baholanadi."
  },
  {
    "type": "source",
    "content": "Cambridge+ 9-sinf 21-bob «Veb-sayt yaratish», dizayn va tekshirish (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf veb ishlab chiqish (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view); W3C Nu HTML Checker (https://validator.w3.org/nu/), CSS Validator (https://jigsaw.w3.org/css-validator/), WAI Accessibility (https://www.w3.org/WAI/). Test ssenariylari original; fizik PDFdagi barcha bet/rasm 1:1 tasdiqlanmagan."
  }
]
