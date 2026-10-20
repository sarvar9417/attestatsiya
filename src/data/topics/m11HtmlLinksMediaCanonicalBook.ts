/** TASK-306: source-guided links, iframe and multimedia HTML chapter. */
import type { TheoryBlock } from '../topicContent'
export const M11_04_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "HTML havolalari, nisbiy/fragment URL, target/rel, iframe title/sandbox, audio/video/source/track, kirish imkoniyati va media huquqlarini to‘g‘ri qo‘llash."
  },
  {
    "type": "intro",
    "content": "Havola foydalanuvchini boshqa joyga olib boradi, iframe tashqi mazmunni ichkarida ko‘rsatadi, audio/video esa mediani brauzerda ijro etadi. Bu bob xususiyatlar farqi, xavfsizlik, subtitr va foydalanuvchi nazoratini kod misollari bilan tushuntiradi."
  },
  {
    "type": "table",
    "content": "| HTML vosita | Vazifa | Muhim sifat |\n|---|---|---|\n| a href | Manzilga o‘tish | Ma’noli matn/fokus |\n| iframe | Ichki brauzer kontekti | title, sandbox, privacy |\n| audio/video | Media ijro | controls |\n| source | Muqobil resurs | haqiqiy type/codec |\n| track | Subtitr | VTT va srclang |"
  },
  {
    "type": "heading",
    "content": "1. Havola va gipermatn mantiqi"
  },
  {
    "type": "definition",
    "content": "a elementi href orqali tashqi yoki ichki resurs manzilini beradi. Havola matni foydalanuvchiga nima ochilishini tushuntiradi, href esa haqiqiy yo‘nalishni ifodalaydi. Brauzer URLni tahlil qiladi, undan keyin kerakli resursga murojaat qiladi."
  },
  {
    "type": "case",
    "content": "Maktab saytidagi «Elektron kutubxona» matni /kutubxona manziliga olib borsin; ekran o‘qigich faqat havolalar ro‘yxatini o‘qiganda ham maqsad aniqlansin."
  },
  {
    "type": "trap",
    "content": "«Shu yerga bosing» yoki faylning noaniq nomi havola matnining mazmunini yetkazmasligi mumkin."
  },
  {
    "type": "task",
    "content": "1-mashq. Ikki tashqi va bir ichki havola uchun mazmunli anchor yozing."
  },
  {
    "type": "code",
    "content": "<nav><a href=\"/darslar\">Darslar ro‘yxati</a></nav>"
  },
  {
    "type": "heading",
    "content": "2. Absolyut, nisbiy va fragment URL"
  },
  {
    "type": "definition",
    "content": "https://example.org/guide kabi to‘liq URL absolyut manzil; /darslar sayt ildizidan nisbiy yo‘l, ../index.html yuqori papkadan nisbiy yo‘l. #xulosa hujjatning id=xulosa elementiga o‘tadi. Yo‘lni to‘g‘ri tanlash fayl papkalari bilan bog‘liq."
  },
  {
    "type": "solved",
    "content": "site/lessons/topic.html dan ../index.html havolasi site/index.htmlga chiqadi. <section id=\"xulosa\"> uchun href=\"#xulosa\" yozing."
  },
  {
    "type": "trap",
    "content": "Boshida slash mavjud /files va ./files turli joydan izlanishi mumkin; local test bilan production originni farqlang."
  },
  {
    "type": "task",
    "content": "2-mashq. Hujjatlar daraxtida uch manzilning yakuniy joyini hisoblang."
  },
  {
    "type": "code",
    "content": "<a href=\"#xulosa\">Xulosaga o‘tish</a><section id=\"xulosa\">Xulosa</section>"
  },
  {
    "type": "heading",
    "content": "3. Yangi kontekst: target va rel"
  },
  {
    "type": "definition",
    "content": "target=\"_blank\" odatda yangi browsing context ochadi; yangi oynami yoki tabmi — brauzer sozlamasiga bog‘liq. Hozirgi brauzerlarda implicit noopener mavjud bo‘lsa ham rel=\"noopener\"ni ochiq yozish maqsadni aniq ko‘rsatadi; noreferrer refererni cheklaydi."
  },
  {
    "type": "example",
    "content": "Tashqi qo‘llanma linkida target=\"_blank\" va rel=\"noopener noreferrer\" ishlating, foydalanuvchi yangi tab ochilishini tushunadigan havola matni bo‘lsin."
  },
  {
    "type": "trap",
    "content": "target=\"_blank\" har doim aynan yangi «oyna» ochadi degani noto‘g‘ri; browser bir tab ham ochishi mumkin."
  },
  {
    "type": "task",
    "content": "3-mashq. Tashqi resurs uchun xavfsiz yangi-tab havolani yozing."
  },
  {
    "type": "code",
    "content": "<a href=\"https://example.org/guide\" target=\"_blank\" rel=\"noopener noreferrer\">Tashqi qo‘llanma (yangi tab)</a>"
  },
  {
    "type": "heading",
    "content": "4. Havolalar ishlashi va klaviatura navigatsiyasi"
  },
  {
    "type": "definition",
    "content": "Anchor elementi odatda Tab orqali fokuslanadi va Enter bilan ishga tushiriladi. Fokus ko‘rsatkichi CSSda yo‘qotilmasligi, rang va ostiga chiziq kabi farqlash belgilari yetarli bo‘lishi kerak. Buzilgan va yo‘naltirilgan URLlarni sinab ko‘ring."
  },
  {
    "type": "case",
    "content": "Sahifaning birinchi boshqaruv elementi klaviatura bilan bosilganda kerakli joyga olib borishini tekshiring; tab tartibini qog‘ozda belgilang."
  },
  {
    "type": "trap",
    "content": "A elementi faqat click uchun bo‘lsa href yo‘qligi uning odatiy havola xatti-harakatini o‘zgartiradi."
  },
  {
    "type": "task",
    "content": "4-mashq. Fokus, Enter va buzilgan manzil tekshiruvlarini ketma-ket yozing."
  },
  {
    "type": "heading",
    "content": "5. Iframe: ichki hujjat va tashqi domen"
  },
  {
    "type": "definition",
    "content": "iframe boshqa sahifa yoki hujjatni hozirgi sahifa ichida ko‘rsatish uchun. src manzil, title foydalanuvchiga iframe maqsadini tushuntiradi. Tashqi sayt X-Frame-Options yoki CSP frame-ancestors orqali joylashtirishni taqiqlashi mumkin."
  },
  {
    "type": "solved",
    "content": "Maktab xaritasi iframe orqali qo‘shilganda title=\"Maktab manzili xaritasi\" yozing; tashqi xarita ulanishni rad etsa oddiy havola taqdim eting."
  },
  {
    "type": "trap",
    "content": "Faqat iframe src bo‘lishi tashqi sayt albatta ko‘rinishini anglatmaydi; iframe rasm yoki video uchun yagona yo‘l emas."
  },
  {
    "type": "task",
    "content": "5-mashq. Iframe ishlamasa ko‘rsatiladigan muqobil havola va title yozing."
  },
  {
    "type": "code",
    "content": "<iframe title=\"Maktab manzili xaritasi\" src=\"https://example.org/map\" loading=\"lazy\"></iframe>"
  },
  {
    "type": "heading",
    "content": "6. Iframe sandbox, ruxsat va maxfiylik"
  },
  {
    "type": "definition",
    "content": "sandbox iframe ichidagi imkoniyatlarni cheklashga xizmat qiladi; allow atributi ayrim brauzer xususiyatlariga ruxsat siyosatini aniqlashi mumkin. Tashqi embed tashrifchi ma’lumotini uchinchi tomonga yuborishi mumkin; faqat ishonchli manbani tanlash kerak."
  },
  {
    "type": "example",
    "content": "Ta’limiy tashqi prezentatsiyani joylashtirishdan oldin uni oddiy link orqali ochish variantini ham tayyorlang va kerakli sandbox imkoniyatlarini minimal belgilang."
  },
  {
    "type": "trap",
    "content": "sandboxni noto‘g‘ri kombinatsiya bilan sozlash himoya maqsadini susaytirishi mumkin; faqat misolni nusxalash xavfsizlik auditi emas."
  },
  {
    "type": "task",
    "content": "6-mashq. Iframe ishlatilganda manba, permission, privacy va fallback ro‘yxatini tuzing."
  },
  {
    "type": "heading",
    "content": "7. Audio elementi va controls"
  },
  {
    "type": "definition",
    "content": "audio elementi ovoz oqimini sahifaga qo‘shadi; controls brauzerning odatiy ijro boshqaruvlarini chiqaradi. source child bir nechta mos variantni ko‘rsatishi mumkin; brauzer qo‘llagan formatni tanlaydi. Matnli transkript mazmunni boshqa usulda yetkazadi."
  },
  {
    "type": "case",
    "content": "<audio controls><source src=\"dars.mp3\" type=\"audio/mpeg\"></audio> bilan ovoz qo‘shib, yoniga bir sahifalik transkript joylashtiring."
  },
  {
    "type": "trap",
    "content": "Ovoz brauzerda ochilsa ham avtomatik ijro etilishi foydalanuvchi siyosatiga bog‘liq; autoplayga pedagogik asoslanmasdan suyanmang."
  },
  {
    "type": "task",
    "content": "7-mashq. Tovush ishlamasa ko‘rsatiladigan muqobil matn rejasini yozing."
  },
  {
    "type": "code",
    "content": "<audio controls><source src=\"dars.mp3\" type=\"audio/mpeg\">Audio ijro etilmasa, transkriptga qarang.</audio>"
  },
  {
    "type": "heading",
    "content": "8. Video elementi, poster va subtitles"
  },
  {
    "type": "definition",
    "content": "video controls bilan ijro boshqaruvini, poster bilan video boshlanishidan oldingi ko‘rinadigan tasvirni berishi mumkin. track kind=\"captions\" va WebVTT subtitrga yordam beradi. Media format va kodek mosligini alohida tekshirish kerak."
  },
  {
    "type": "solved",
    "content": "Dars roligi uchun MP4 manba, poster rasm va srclang=\"uz\" li vtt subtitrga havola qo‘shing; ovozsiz tomoshani tekshiring."
  },
  {
    "type": "trap",
    "content": "Video faylining .mp4 nomi barcha brauzerlarda ayni kodek bilan ishlaydi degan kafolat emas."
  },
  {
    "type": "task",
    "content": "8-mashq. Subtitr bilan video, poster va asosiy source tuzilmasini yozing."
  },
  {
    "type": "code",
    "content": "<video controls poster=\"dars.jpg\"><source src=\"dars.mp4\" type=\"video/mp4\"><track kind=\"captions\" src=\"dars-uz.vtt\" srclang=\"uz\" label=\"O‘zbekcha\"></video>"
  },
  {
    "type": "heading",
    "content": "9. Source tanlash va media mosligi"
  },
  {
    "type": "definition",
    "content": "source elementi audio/video uchun type va src bilan muqobil formatlarni tartibda berishi mumkin; pleyer brauzer qaysi variantni ijro eta olishini tekshiradi. Kodek va konteyner farqini ham yodda tuting. Fallback havola zarur."
  },
  {
    "type": "example",
    "content": "Dars videosining ikki versiyasi bor: WebM va MP4. Ikkalasini source sifatida ko‘rsating, lekin haqiqiy kodekni ham o‘z qurilmangizda tekshiring."
  },
  {
    "type": "trap",
    "content": "type=\"video/mp4\"ni yozish faylning real kodlangan formati to‘g‘ri ekanini isbotlamaydi."
  },
  {
    "type": "task",
    "content": "9-mashq. Ikki media formatni tanlash mezonlarini jadvalda solishtiring."
  },
  {
    "type": "code",
    "content": "<video controls><source src=\"dars.webm\" type=\"video/webm\"><source src=\"dars.mp4\" type=\"video/mp4\"></video>"
  },
  {
    "type": "heading",
    "content": "10. Responsiv iframe va video"
  },
  {
    "type": "definition",
    "content": "Embed eni parent konteynerdan oshib ketmasligi, video nisbatini saqlashi va boshqaruvlar telefon ekranida bosilishi kerak. CSS max-width:100% va aspect-ratio kabi xususiyatlar vazifaga qarab qo‘llanadi."
  },
  {
    "type": "case",
    "content": "640×360 video mobil eni 320 pxga sig‘ishi uchun max-width:100%, height:auto bo‘lsin; asl manba fayl hajmi bundan kamaymaydi."
  },
  {
    "type": "trap",
    "content": "Faqat width atributini kichraytirish video oqimi hajmini yoki yuklash tezligini avtomatik pasaytirmaydi."
  },
  {
    "type": "task",
    "content": "10-mashq. 16:9 videoni mobil ekranga mos CSS bilan yozing."
  },
  {
    "type": "code",
    "content": "video, iframe { max-width: 100%; } video { height: auto; }"
  },
  {
    "type": "heading",
    "content": "11. Litsenziya, rozilik va uchinchi tomon resursi"
  },
  {
    "type": "definition",
    "content": "Boshqa muallifning video yoki audiosini havola qilish, embed qilish va o‘z serveringizga qayta joylash turli huquqiy/texnik vaziyat. O‘quvchilar tasviri, shaxsiy ma’lumot va autentifikatsiya tokenlari ochiq iframe URLida bo‘lmasin."
  },
  {
    "type": "solved",
    "content": "Maktab tadbiri videosida qatnashchilarni ochiq saytda ko‘rsatishdan oldin tegishli ruxsat qoidalarini tekshiring; foydalanishga ruxsatli musiqa tanlang."
  },
  {
    "type": "trap",
    "content": "Ommaviy saytga osongina embed qilinadigan video manbaning barcha huquqi o‘qituvchiga tegishli degani emas."
  },
  {
    "type": "task",
    "content": "11-mashq. O‘quv sayti uchun media litsenziyasi va privacy tekshiruv ro‘yxatini yozing."
  },
  {
    "type": "heading",
    "content": "12. Mini-loyiha: manbaviy media kutubxona"
  },
  {
    "type": "definition",
    "content": "HTML sahifada ichki navigatsiya, tashqi mazmunli havola, cheklovli iframe, transcriptli audio, captionli video va muqobil havolalarni birlashtiring. Ekran, mobil, klaviatura va ovozsiz rejimlarda sinov o‘tkazing."
  },
  {
    "type": "example",
    "content": "«Internet madaniyati» sahifasida uch manbaga havola, bir video va bir audio resurs bo‘lsin; barcha resurs manzili ishlashini tekshiring."
  },
  {
    "type": "trap",
    "content": "Tayyor preview izolyatsiya, kirish imkoniyati va mualliflik tekshirildi degani emas."
  },
  {
    "type": "task",
    "content": "12-mashq. Semantika, fokus, media, huquq va responsivlik uchun 0–2 balli rubrika tuzing."
  },
  {
    "type": "summary",
    "content": "Anchor href manzilga o‘tadi; target blank yangi kontekstni brauzer siyosatiga ko‘ra ochadi. iframe title/sandboxga ehtiyoj tug‘diradi, tashqi sayt embedni rad etishi mumkin. Audio/video controls, muqobil source, caption va transkript bilan beriladi. Media huquqi, privacy va mobil moslik tekshiriladi."
  },
  {
    "type": "answers",
    "content": "1) mazmunli havola; 2) fragment id bilan; 3) target/rel izohi; 4) Tab/Enter va fokus; 5) iframe title + link fallback; 6) sandbox/allow cheklovi; 7) controls+transkript; 8) video+track VTT; 9) source media mosligi; 10) max-width va nisbat; 11) litsenziya/rozilik; 12) 5 mezonli rubrika. Turli asosli yechimlar qabul qilinadi."
  },
  {
    "type": "source",
    "content": "Cambridge+ 8-sinf, vebsaytga multimedia qo‘shish (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); Cambridge+ 9-sinf 21-bob HTML sayti (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); MDN iframe (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe), video (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video), track (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track). Original pedagogik misollar; PDF barcha fizik sahifa va grafikasi 1:1 tasdiqlanmagan."
  }
]
