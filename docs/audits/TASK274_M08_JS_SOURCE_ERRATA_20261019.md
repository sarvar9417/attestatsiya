# TASK-274 — M08.04–M08.05 JavaScript fallback mosligi va darslik errata reyestri

**2026-10-19 · Source-checked static fallback QA · no publishing / DB mutation / deployment**

## Aniqlangan xato

2026 attestatsiya kanonik platforma M08.04 va M08.05 darslari **JavaScript** bilan bog‘langan (TASK-262 M08 metadata auditi). Eski `src/data/topicContent.ts` statik zaxira darslarida esa:

- **M08.04** — `Python xatolari, operatorlari va satrlari` (SyntaxError, Python `slice`, `print`);
- **M08.05** — `Python shartlari` (`if/elif/else`, Python `input`).

Shu nomuvofiqlik statik fallback ishlatilganda foydalanuvchiga **noto‘g‘ri fan ko‘nikmasini** o‘rgatishi mumkin. Buni 20/20 published pool yoki live productionda aynan shu sahifa doimo ko‘rinadi, deb qabul qilmaymiz.

## Bevosita tekshirilgan manba

`10-11-sinf informatika (Cambridge +)_compressed.pdf`, Sarvar Drive ID `1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ`, 19-bob **«Veb uchun dasturlash»**, bosma betlar **307–315** (PDF faylning taxminan 316–324-betlari). Matn manba sifatida o‘qildi; bu barcha 2026 attestatsiya variantlari ekspertizasi emas.

| Bosma bet | Bevosita ko‘rilgan mavzu | Platforma manzili |
|---|---|---|
| 307–308 | `<script>`, `document.getElementById`, `alert`, `document.write`, o‘zgaruvchilar | M08.04 |
| 309–310 | `var`, ma’lumot turlari, `console.log`, arifmetik/taqqoslash/mantiqiy operatorlar | M08.04 |
| 311–312 | satr amallari, massiv indekslari va `push` | M08.05 |
| 312–314 | `if/else`, `switch`, `for`, `while`, `do/while` | M08.05 |
| 314–315 | `function`, parametr, `return`, iteratsiya metodlari | M08.05 |

Platforma uchun namunalar **yangi yozildi**; manbadagi `var` ga qo‘shimcha `let/const` zamonaviy JS standartlari misollari hisoblanadi. Ular aynan darslikda bor deb aytilmaydi.

## Darslikda qayta ishlatishdan oldin tekshirish kerak bo‘lgan xatolar

| Manbadagi misol / izoh | Muammo | Tekshiriladigan to‘g‘ri natija |
|---|---|---|
| p.310, `%` bo‘linmaning butun qismi deb izohlangan | JavaScriptda `%` **qoldiq** operatori | `11 % 5 === 1` |
| p.310, `!===` kabi tengsizlik belgisi | JavaScript sintaksisida qo‘shimcha `=` noto‘g‘ri | Qat’iy teng emaslik `!==` |
| p.311, `"Hello World".substring(7,11)` natijasi «World» deyiladi | Indeks 7 «o»dan boshlanadi | **`"orld"`** |
| p.311, `"Hello World".substr(2,4)` natijasi «llo» deyiladi | Ikkinchi parametr 4 ta belgi; oxirgi bo‘sh joy ham kiradi | **`"llo "`** |
| p.312–313, `case 4;`, `default;` | `switch` label ajratgichi noto‘g‘ri | `case 4:`, `default:` |
| p.314, `while(check = true)` | Taqqoslash emas, qiymat tayinlash; ushbu misol cheksiz siklga olib kelishi mumkin | Tayinlashdan foydalanmaslik, `while(check === true)` va shartni yangilash |
| p.312, 5 elementli `colours`ga `push("blue")`dan keyin uzunlik 5 deb yozilgan | Qo‘shish bitta yangi element yaratadi | Uzunlik **6** (indeks 0..5) |

Bu jadval manbani kamchiliklari bilan ham tekshirish kerakligini bildiradi: xato tipografiyani testning **to‘g‘ri javobi** sifatida ko‘chirish taqiqlanadi.

## Amalga oshirilgan dastur o‘zgarishi

- M08.04 statik fallback JS o‘zgaruvchi, `console.log`, `document.write`, `===`, `%` mavzusiga ko‘chirildi.
- M08.05 statik fallback JS shart/sikl/funksiya/massiv mavzusiga ko‘chirildi.
- **10 ta yangi lokal Y1 mini-quiz** IDsi `M08.04-js2021-q*` va `M08.05-js2021-q*` — tarixiy Python mini-quiz IDlariga javob/progress yozib yuborilmaydi.
- `src/tests/TASK274M08JavaScriptSourceAlignment.test.ts` JS natijalari va mappingni haqiqiy runtime mantiqi bilan tekshiradi.

## Release cheklovi

Bu faqat **statik fallback**. Serverdagi published M08.04 0/20 bo‘shliqni to‘ldirmaydi. TASK-262 bo‘yicha M08 jami 55 yetishmayotgan o‘rin, 426 mapped review occurrence va **0 human editorial approval** qoladi. Parallel #250 dagi 56 source-grounded loyihalarni ham avtomatik approval/publish qilish mumkin emas. M08.04 review kalitlari, semantika, Cambridge sahifalari va browser execution mustaqil ekspert tekshiruvidan o‘tishi kerak.

Production SQL, `question_keys`, foydalanuvchi attemptlari va Vercel deployga tegilmadi.
