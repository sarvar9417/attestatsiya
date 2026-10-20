# TASK-305 — M11.01–M11.03 HTML boshlang‘ich boblari: source-first chuqurlashtirish

**Sana:** 2026-10-19. **Status:** PR/CI; production deploy qilinmaydi.

## Muammo va natija
M11.01–M11.03 ilgari 4–5 ta juda qisqa statik tushuntirish bloki va 5 ta Cambridge+ qo‘shimcha blok bilan cheklangan. BookReader umumiy dizaynni ta’minlasa-da, mavzular chuqur o‘qish, worked examples, xatolar, mustaqil amaliyot va javob yo‘nalishlarisiz qolgan.

| Dars | Yangi asosiy blok | Bo‘lim | Yadro |
|---|---:|---:|---|
| M11.01 Veb va HTML asoslari | 73 | 12 | HTML5 skelet; teg, atribut; semantika; nav, alt, link, UTF-8 va brauzer tekshiruvi |
| M11.02 HTML matn, fon, ro‘yxat va rasm | 73 | 12 | h1, strong, em, mark, ol/ul, img/alt, figure, CSS kontrast, responsivlik |
| M11.03 HTML jadval va forma | 75 | 12 | table/th/td, caption/scope, form, label/id/name, radio, password, validatsiya va xavfsizlik |
| **Jami** | **221** | **36** | Inline ishlaydigan namunaviy kod va har bo‘limda topshiriq |

Yangi, mualliflik HTML darslari to‘liq kitob sifatida birinchi sahifadan boshlanadi, reviewed TASK-273 M11_WEB_TEXTBOOK_ADDITIONS ilovalari oxirida saqlanadi. Avvalgi qisqa seed ikkinchi takroriy dars sifatida ko‘rsatilmaydi; testlarning IDsi, options, correctIndex, Y turi saqlanadi.

## Faktik tuzatishlar
1. M11.01-q2: h1 mutlaq ekranda «eng katta» emas, semantik eng yuqori darajali sarlavha; CSS bilan boshqa vizual o‘lcham berish mumkin.
2. M11.02-q3: img dagi src — oddiy tasvir manzilining keng tarqalgan atributi, ammo srcset bilan muqobil/responsiv manba tanlash mavjud; «src har qanday holatda yakka majburiy atribut» deb ko‘rsatilmadi.
3. M11.03-q2: type=password faqat ekranda niqoblashga xizmat qiladi; avtomatik shifrlash yoki backend maxfiylik himoyasi emas. HTTPS va server validatsiyasi alohida talab etiladi.
4. Eski HTMLning jadvaldagi border atributi va qatorlar bilan maket qilish o‘rniga semantik jadval va CSS orqali dizayn ajratildi.

## Manbalar
- [Cambridge+ 8-sinf informatika](https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view), vebsayt va HTML yaratish modulida skelet va rasm qo‘shish.
- [Cambridge+ 9-sinf informatika](https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view), 21-bob «Veb-sayt yaratish», bosma taxminan 275–289-betlar, jadval bosma taxminan 281-bet.
- [Cambridge+ 10–11-sinf informatika](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view), form va veb dasturlash.
- [MDN img element va alt tavsifi](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img); [MDN rasmlar va manba huquqi](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images).

Amaliy kodlar va izohlar mustaqil mualliflik o‘quv bayoni; yuqoridagi PDFlarning har bir fizik sahifasi/rasmini 1:1 qamrab olish tasdiqlanmagan. Server published source, authenticated learning, fizik betma-bet ekspertiza alohida ochiq.

## Regressiya va merge sharti
- TASK305HtmlFoundationCanonicalBooks.test.ts: 73+73+75 blok; 12 tadan bo‘lim; 3× ilova; birinchi sahifadagi book va to‘liq reader qayta yig‘ilishi; savol ID/correctIndex/Y darajalari; aynan 3 faktik yaxshilanish.
- ESLint, TypeScript, Vitest, build, Playwright E2E, backend, DB va required quality CI to‘liq yashil va current main bilan sinxron bo‘lsa merge.
- Published exam questions/keys, backend va DB migratsiyalariga tegilmadi. Deploy OFF.
- Keyingi navbat: M11.04–M11.07 va nazariya uchun yetarli bo‘lmagan qolgan M04–M13 boblar; darslik manbalarining har bir rasm/sahifasini alohida tasdiqlash.
