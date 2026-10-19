/** TASK-306: source-guided CSS fundamentals, color and cascade book. */
import type { TheoryBlock } from '../topicContent'
export const M11_05_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "CSS qoida, selektor, declaration, inline/internal/external, kaskad/specificity, rang nomi/HEX/RGB/HSL, kontrast, background, variables va media queryni amaliy sahifada qo‘llash."
  },
  {
    "type": "intro",
    "content": "CSS hujjatning go‘zalligidan tashqari matnni o‘qish, turli ekranlar va foydalanuvchi sharoitlariga moslashishni ham belgilaydi. Ushbu dars sinflar, id va kaskad nizolaridan amaliy, kontrastli dizayngacha ketadi."
  },
  {
    "type": "table",
    "content": "| Yo‘l | Qayerda? | Kuchli tomoni |\n|---|---|---|\n| Inline | style atributi | Lokal tezkor misol |\n| Internal | head ichida style | Bitta sahifa |\n| External | .css va link | Ko‘p sahifali sayt |\n| class | .nom | Qayta ishlatiladigan stil |\n| id | #nom | Noyob maqsadli element |"
  },
  {
    "type": "code",
    "content": "<link rel=\"stylesheet\" href=\"styles.css\">\np { color: #174ea6; line-height: 1.5; }\n.note { background-color: #fff8dc; }"
  },
  {
    "type": "heading",
    "content": "1. CSSning vazifasi va HTMLdan farqi"
  },
  {
    "type": "definition",
    "content": "CSS (Cascading Style Sheets) hujjat ko‘rinishini belgilaydi: rang, shrift, oraliq va elementlar joylashuvi. HTML tuzilmani, CSS vizual taqdimotni, JavaScript esa kerakli interaktivlikni boshqarishi mumkin. Tashqi stylesheet ko‘plab sahifada bir xil dizaynni yangilashga qulay."
  },
  {
    "type": "case",
    "content": "Barcha sinf sahifalariga bir xil header rangi kerak bo‘lsa, alohida .css faylni link orqali ulash har bir tegda uslub yozishdan ko‘ra boshqarishga qulay."
  },
  {
    "type": "trap",
    "content": "CSSni qo‘shish uchun faqat external yagona mumkin usul emas; inline/internal ham mavjud, lekin maintenance farqi bor."
  },
  {
    "type": "task",
    "content": "1-mashq. Bir HTML element uchun inline, internal va external variantlarni solishtiring."
  },
  {
    "type": "heading",
    "content": "2. Qoidalar, selektor va deklaratsiya"
  },
  {
    "type": "definition",
    "content": "CSS qoida selektor va figurali qavs ichidagi property:value deklaratsiyalaridan tuziladi. Masalan p { color: navy; } barcha p elementlariga mos kelishi mumkin. Xato nuqta-vergul yoki qavs qoidaning qisman ishlamasligiga olib keladi."
  },
  {
    "type": "solved",
    "content": "p { color: #123456; line-height: 1.5; } misolida p selektor, color/line-height property, qiymatlar #123456 va 1.5."
  },
  {
    "type": "trap",
    "content": "CSS xossa nomi bilan unga berilgan qiymatni aralashtirmang; property nomlari belgilangan sintaksisga ega."
  },
  {
    "type": "task",
    "content": "2-mashq. Bir selektor, ikki xossa va ikki qiymatli qoida tuzing."
  },
  {
    "type": "code",
    "content": "p { color: navy; line-height: 1.5; }"
  },
  {
    "type": "heading",
    "content": "3. Element, class va ID selektorlari"
  },
  {
    "type": "definition",
    "content": "Element selektori bir turdagi teglarga, .class umumiy klass nomiga, #id identifikatorga mos keladi. Klass ko‘plab elementda takror ishlatilishi mumkin, id esa hujjatda noyob bo‘lishi kerak. Murakkab selektor yaqinlikni ifodalaydi."
  },
  {
    "type": "example",
    "content": "Maqoladagi barcha p uchun font-size, .note uchun fon, #asosiy-sarlavha uchun maxsus rang bering."
  },
  {
    "type": "trap",
    "content": "IDga bog‘liq haddan ortiq murakkab CSSni qayta foydalanish qiyinlashadi; muhim umumiy dizayn uchun class afzal."
  },
  {
    "type": "task",
    "content": "3-mashq. Element, class va id selektorlarining uchtasini alohida yozing."
  },
  {
    "type": "code",
    "content": "h2 { color: #123; }\n.note { padding: 1rem; }\n#intro { font-weight: 700; }"
  },
  {
    "type": "heading",
    "content": "4. Inline, internal va external stil"
  },
  {
    "type": "definition",
    "content": "Inline style atributi element ichida, internal style head qismida, external CSS esa link rel=stylesheet orqali ulanadi. Ko‘p sahifada umumiy dizayn uchun external fayl foydali; brauzer keshidan ham foydalanishi mumkin."
  },
  {
    "type": "case",
    "content": "index.html va lesson.html fayllarida bir style.css ishlating; rangni bitta joyda o‘zgartirib ikki sahifada tekshiring."
  },
  {
    "type": "trap",
    "content": "«External eng tavsiya» kontekstga bog‘liq; dastlabki kichik misolda internal CSS ham maqsadga mos, asosiy mezon boshqarishdir."
  },
  {
    "type": "task",
    "content": "4-mashq. Bitta p ga uch usuldan qaysi biri qachon foydali bo‘lishini ayting."
  },
  {
    "type": "code",
    "content": "<link rel=\"stylesheet\" href=\"styles.css\">"
  },
  {
    "type": "heading",
    "content": "5. Kaskad, specificity va keyingi qoida"
  },
  {
    "type": "definition",
    "content": "Bir elementga bir nechta mos CSS deklaratsiya bo‘lsa kaskad origin, importance, cascade layer, specificity, scope va source order kabi qoidalar orqali tanlaydi. Bir xil kaskad sharoitida ID odatda classdan, class elementdan ko‘proq xususiylikka ega. !important va cascade layer oddiy qoidani murakkablashtiradi."
  },
  {
    "type": "solved",
    "content": "p { color: green } va .note { color: blue } bir p class=note ga mos bo‘lsa, boshqa omillar teng bo‘lganda .note ustun bo‘ladi."
  },
  {
    "type": "trap",
    "content": "«Oxirida yozilgan CSS har doim g‘olib» noto‘g‘ri: specificity, !important va cascade layer kabi omillar bor."
  },
  {
    "type": "task",
    "content": "5-mashq. Bir elementga mos uch rang qoidasidan qaysi biri yutishini izohlang."
  },
  {
    "type": "code",
    "content": "p { color: green; }\np.note { color: blue; }"
  },
  {
    "type": "heading",
    "content": "6. Meros va default stil"
  },
  {
    "type": "definition",
    "content": "CSSdagi ayrim xossalar, masalan color va font-family, odatda meros bo‘lishi mumkin; border yoki margin esa odatda meros bo‘lmaydi. Brauzerning user-agent stylesheeti sarlavha, abzas va ro‘yxatga oldindan ko‘rinish beradi. DevTools computed styles haqiqiy natijani ko‘rsatadi."
  },
  {
    "type": "example",
    "content": "body { color: #222 } yozilganda ko‘plab ichki matn elementlari shu rangni oladi, lekin har bir elementga margin avtomatik bir xil ko‘chmaydi."
  },
  {
    "type": "trap",
    "content": "Barcha CSS xossalari ota-elementdan bolaga meros o‘tadi deb bo‘lmaydi."
  },
  {
    "type": "task",
    "content": "6-mashq. Color va margin farqini ikki bo‘limli sahifada tekshiring."
  },
  {
    "type": "heading",
    "content": "7. CSS ranglari: nom, HEX va RGB"
  },
  {
    "type": "definition",
    "content": "red/blue kabi nomlar, #RRGGBB HEX, rgb() hamda hsl() sintaksislari rangni ifodalaydi. #FF0000 8-bit kanalli RGB qizilni bildiradi: FF 255, 00 nol. RGBA yoki 8-hex orqali alpha shaffoflikni ifodalash mumkin."
  },
  {
    "type": "case",
    "content": "#00FF00 yashil, #0000FF ko‘k. rgb(255 0 0 / 50%) yarim shaffof qizil kanal ko‘rinishi bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "HEX mustaqil fizik rang modeli emas; ekrandagi ko‘rinish profil/displeyga bog‘liq."
  },
  {
    "type": "task",
    "content": "7-mashq. #3366CC HEXda RGB kanal qiymatlarini hisoblang."
  },
  {
    "type": "code",
    "content": "h1 { color: #ff0000; } /* RGB 255,0,0 */"
  },
  {
    "type": "heading",
    "content": "8. HSL va kontrast"
  },
  {
    "type": "definition",
    "content": "HSLda Hue rang tusi, Saturation to‘yinganlik, Lightness och-to‘qlikni boshqaradi. Rang tanlashda matn/fon kontrasti muhim; WCAG uchun oddiy matnga odatda kamida 4.5:1 kontrast tavsiya etiladi, lekin tegishli istisno/toifa alohida ko‘riladi."
  },
  {
    "type": "solved",
    "content": "Ko‘k tugma va oq matn ko‘rishda aniq ajralib turishi kerak. Contrast checkerda norma bajarilmasa rangni o‘zgartiring."
  },
  {
    "type": "trap",
    "content": "Qizil-yashil ranglar farqi statusni yagona anglash vositasi bo‘lsa ayrim foydalanuvchilar ma’noni yo‘qotadi; ikon/matn qo‘shing."
  },
  {
    "type": "task",
    "content": "8-mashq. Bir tugma uchun rang, kontrast va matnli status mezonlarini tanlang."
  },
  {
    "type": "code",
    "content": ".button { background: #174ea6; color: white; }"
  },
  {
    "type": "heading",
    "content": "9. Background va fon xususiyatlari"
  },
  {
    "type": "definition",
    "content": "background-color fon rangini, background-image rasm yoki gradientni, background-size tasvir o‘lchash usulini boshqaradi. Fonlar ko‘p qatlamli bo‘lishi mumkin; rasm bo‘lmasa matn baribir o‘qilishi uchun asosiy fon rangi kerak."
  },
  {
    "type": "example",
    "content": "Hero fon rasmi yuklanmasa ham matn o‘qilishi uchun mos background-color va kontраст qo‘ying; fonni crop qilish matnni yopmasin."
  },
  {
    "type": "trap",
    "content": "background-size:cover butun asl rasmni kesmasdan ko‘rsatishga kafolat bermaydi, qirralar qirqilishi mumkin."
  },
  {
    "type": "task",
    "content": "9-mashq. Fon rasmi uchun cover va contain farqini misol bilan tushuntiring."
  },
  {
    "type": "code",
    "content": ".hero { background-color: #112; background-image: url(\"banner.jpg\"); background-size: cover; }"
  },
  {
    "type": "heading",
    "content": "10. CSS o‘zgaruvchilari va bir xil dizayn"
  },
  {
    "type": "definition",
    "content": "CSS custom property, masalan --brand-color, ma’lumotni bitta joyda ifodalashga yordam beradi. var(--brand-color) boshqa qoidadagi qiymat sifatida ishlatiladi. Meros/kontekst va fallback qiymatini tushunish muhim."
  },
  {
    "type": "case",
    "content": "rootda --brand:#174ea6 saqlang, h1 va button uchun color/background uslubini shu qiymatdan oling."
  },
  {
    "type": "trap",
    "content": "Custom property barcha qiymatda avtomatik real rangga aylantirilmaydi; noto‘g‘ri yoki topilmagan o‘zgaruvchi deklaratsiyani bekor qilishi mumkin."
  },
  {
    "type": "task",
    "content": "10-mashq. Bitta rang nomi o‘zgarganda uch komponent yangilanishini CSSda yozing."
  },
  {
    "type": "code",
    "content": ":root { --brand: #174ea6; }\nh1 { color: var(--brand); }"
  },
  {
    "type": "heading",
    "content": "11. Media query bilan ranglar va ekran"
  },
  {
    "type": "definition",
    "content": "Media query foydalanuvchi muhiti sharoitiga mos stilni tanlaydi. prefers-color-scheme qorong‘i/yorug‘ mavzuga, max-width kabi so‘rov esa viewport kengligiga nisbatan ishlashi mumkin. Rasm va matn kontrasti har rejimda tekshirilsin."
  },
  {
    "type": "solved",
    "content": "Telefon uchun paddingni kamaytiring, qorong‘i rejimda qora fon ustiga o‘qiladigan och matn bering. Ikkala rejimni real brauzerda sinang."
  },
  {
    "type": "trap",
    "content": "Dark mode faqat ranglarni teskari qilish bilan mukammal bo‘lmaydi: link, border, focus va rasmni ham ko‘rish kerak."
  },
  {
    "type": "task",
    "content": "11-mashq. Dark mode uchun @media qoidasini va fokus kontrasti tekshiruvini yozing."
  },
  {
    "type": "code",
    "content": "@media (prefers-color-scheme: dark) { body { background: #111; color: #eee; } }"
  },
  {
    "type": "heading",
    "content": "12. Sifat nazorati va amaliy rang palitrasi"
  },
  {
    "type": "definition",
    "content": "CSSda selector, property, syntax, specificity va accessibility sifatni birgalikda belgilaydi. Maqsadli palitrani 2–3 asosiy rang bilan yaratib, qoidalarning ustuvorligini DevTools orqali tekshiring. External fayl nomi va link manzilini unutmang."
  },
  {
    "type": "example",
    "content": "Maktab sahifasiga ikki asosiy, bir urg‘u rangi bering, theme o‘zgarganda barcha element o‘qilishini tekshiring."
  },
  {
    "type": "trap",
    "content": "Brauzerda chiroyli ochilishi avvalgi testlar, mobil ekran yoki kontrast audit o‘tganini anglatmaydi."
  },
  {
    "type": "task",
    "content": "12-mashq. Kaskad, kod, rang, kontrast va responsivenessdan iborat 5 mezonli rubrika yarating."
  },
  {
    "type": "summary",
    "content": "CSS sintaksisi selector { property: value; } ko‘rinishida. Kaskadni faqat yozilish tartibi emas, specificity, origin, !important va layer ham boshqaradi. HEX #FF0000 qizil; RGB/HSL turli yozilishlar. Kontrast, dark mode, external stylesheet va mobil sinov yakuniy sifatning tarkibiy qismi."
  },
  {
    "type": "answers",
    "content": "1) CSS ko‘rinish; 2) selector/deklaratsiya; 3) class/id; 4) external ko‘p sahifaga; 5) specificity; 6) inheritance farqi; 7) #3366CC = (51,102,204); 8) WCAG kontrast tekshiruvi; 9) cover qirqishi mumkin; 10) var() va fallback; 11) prefers-color-scheme; 12) 5 mezon. Asoslangan boshqa javoblar ham mumkin."
  },
  {
    "type": "source",
    "content": "Cambridge+ 9-sinf «Veb-sayt yaratish» 21-bobdagi CSS uslublar (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 8-sinf vebsayt (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); MDN CSS cascade (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade), CSS color (https://developer.mozilla.org/en-US/docs/Web/CSS/color), WCAG 2.2 contrast minimum (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Mualliflik sintezi; barcha PDF bet/rasmlari 1:1 verifikatsiyadan o‘tmagan."
  }
]
