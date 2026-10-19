# TASK-290 — Pedagogik qobiliyatlar va ta’lim texnologiyalari: manbali o‘quv boblari

**Sana:** 2026-10-19. **Status:** PR uchun nazariya+regressiya tayyor; CI qabulidan keyingina merge. Deploy yo‘q.

## Muammo va o‘zgarish
M15.07 va M15.08 nazariyasi avval 6 ta qisqa statik blokdan iborat bo‘lgan, qo‘shimcha o‘quv manbasi qaydlari esa `pedagogyStudyNotes` orqali ulanadi. Endi yangi bob darsning birinchi ochiladigan o‘qish oqimiga kiritiladi; avvalgi qisqa konspekt alohida takrorlanmaydi, lekin manba izohlari keyin ham mavjud bo‘ladi.

| ID | Yangi blok | Tabiiy bo‘lim | Ta’lim tarkibi |
|---|---:|---:|---|
| M15.07 — Pedagogik qobiliyatlar | 61 | 11 | Didaktik, akademik, perseptiv, kommunikativ, empatiya, tashkilotchilik, tasavvur, diqqat, obro‘, refleksiya |
| M15.08 — Ta’lim texnologiyalari | 61 | 11 | Muammoli, loyiha, hamkorlik, evristik, differensial, inklyuziv, aralash ta’lim, baholash va refleksiya |
| **Jami** | **122** | **22** | 22 amaliy vaziyat/mashq va tekshirish yo‘nalishlari |

### Manba va auditorlik chegarasi
- [Xoliqov, «Pedagogik mahorat», pedagogik qobiliyatlar](https://drive.google.com/file/d/1urZe1IJjLVco-KysxtIvg46Ej89XreuK/view) — didaktik va perseptiv qobiliyatlar, ta’sir va kasbiy rivojlanish haqidagi asos.
- [«Pedagogik qobilyatlar umumiy»](https://drive.google.com/file/d/1vx6tDQ62fQ8AomiVexBsplHHhpCpJuqZ/view) — tasniflar, mualliflar farqi. «Avtoritar» tarixiy terminini zo‘ravonlikni oqlash deb talqin qilishga yo‘l qo‘yilmaydi.
- [F.O. Mirzayeva, «Pedagogika nazariyasi va tarixi»](https://drive.google.com/file/d/1GG9dH4_kdMyj5cqKML21lQoZufO40E38/view) — didaktika, ta’lim shakllari va metodlar.
- [Qodirova/Pulatova, «Inklyuziv ta’lim: nazariya va metodika» (2022)](https://drive.google.com/file/d/1J67WL90Qh6uULzmI7yYIR0OJ6diTg3cX/view) — imkoniyat, ishtirok va moslashuv.

Matn mustaqil pedagogik bayon; ko‘rsatilgan bosma yoki fizik PDF sahifalari va rasm/jadvallarning har biri bilan 1:1 moslik da’vo qilinmaydi. Qobiliyatlarning muallif tasniflari aralashtirilmasin; o‘quvchi sha’ni va shaxsiy ma’lumoti himoyalansin.

### Texnik xavfsizlik
- `topicContent.ts` dagi M15.07–08 canonical chapter `kind: chapter`, `source`, uzun bob bilan almashtiriladi.
- `withPedagogyStudyNotes` original qaydlarni keyin qo‘shaveradi, savollar serverda qoladi; frontendga maxfiy javob kaliti kiritilmaydi.
- `TASK290PedagogyCanonicalBooks.test.ts` bo‘limlar, material ketma-ketligi, manba, izohlar va qo‘shni darslarga ta’sirsizlikni tekshiradi.
- DB migratsiya/publish yo‘q, Vercel deploy taqiqlangan.
- Butun platforma bo‘yicha darslik bilan mustaqil sahifama-sahifa ekspert tekshiruvi va avtorizatsiyalangan desktop/mobile UI smoke ochiq qoladi.

**Handoff:** TASK-290; natija ikki kitob (61+61), testlar, audit. Migratsiya yo‘q. Qolgan xavf — editorial source-page trace va real learner UX.
