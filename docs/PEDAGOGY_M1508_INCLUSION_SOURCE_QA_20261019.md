# M15.08 — inklyuziv ta’lim va korreksion pedagogika: manba–nazariya QA (2026-10-19)

**Scope:** `M15.08` o‘quv nazariyasining statik source notes qismi. Published savollar, javob kalitlari, DB va imtihon baholash logikasi o‘zgartirilmaydi.

## Birlamchi/o‘quv darslik dalillari

- [F.U. Qodirova, D.A. Pulatova, *Inklyuziv ta’lim: nazariya va metodika* (Chirchiq, 2022)](https://drive.google.com/file/d/1J67WL90Qh6uULzmI7yYIR0OJ6diTg3cX/view): to‘liq matn extraction qaytdi (506 667 belgi). «Kirish» va «Inklyuziv ta’lim» qismida turli individual ta’lim ehtiyojlariga moslashuvchan muhit, ta’limga teng kirish va ishtirok masalalari yoritiladi. **Fizik sahifa tasvirlari ushbu o‘zgarishda tekshirilmagan**; nashrning 2022-yildagi normativ iqtiboslarini bugungi huquqiy holat sifatida talqin qilmaymiz.
- [«Inklyuziv_talim_va_korreksion_pedagogika_qollanma.docx»](https://docs.google.com/document/d/1-mz2ykvhEuG4dudIDq-k0zYofeLvbz2g/edit): matni o‘qildi; «Inklyuziv ta’lim», «Korreksion pedagogika», «O‘qituvchining vazifalari» qismlarida muhitni moslashtirish va maxsus pedagogika yo‘nalishlari izohlangan. **Ikkilamchi konspekt**; rasmiy normativ yoki attestatsiya uchun o‘zi mustaqil javob kaliti emas.

## Mavzu faktlarini tekshirish

| Platformaga qo‘shilgan da’vo | Dalil turi | Holat |
|---|---|---|
| Inklyuziya faqat bir sinfda o‘tirish emas, teng ishtirok va ehtiyojga moslashtirishdir | Qodirova–Pulatova «Kirish», inklyuziv ta’lim ta’riflari | O‘qilgan matn bilan mos |
| Korreksion yo‘nalishlar inklyuziv ta’limning sinonimi emas | DOCXning ikki alohida ta’rifi + darslikning pedagogik-psixologik yondashuvi | Didaktik farqlash, mustaqil normativ ta’rif emas |
| Surdopedagogika/eshitish, tiflopedagogika/ko‘rish, logopediya/nutq | DOCXdagi yo‘nalishlar jadvali | Ikkilamchi manba bilan mos, atama-yuridik audit ochiq |
| Informatika darsida yozma ko‘rsatma, ekran o‘qigichga mos matn, bosqichli yo‘riqnoma | Manbadan chiqarilgan amaliy misol | **Illyustrativ tavsiya**, kitobdan aynan ko‘chirma emas |
| O‘qituvchi kuzatuvdan tibbiy tashxis qo‘ymasligi | Pedagogik xavfsizlik/rol chegarasi | **Tavsiyaviy guard**, attestatsiya uchun normativ iqtibos emas |

## Tekshiruvlar

- `src/data/pedagogyStudyNotes.ts` — M15.08 kengaytirilgan source notes; faqat matn va misollar.
- `src/tests/PedagogyBloomSource.test.ts` — 3 regression: ikki alohida manba izlari, accessibility table and goal preservation, atama va tibbiy tashxisni cheklash.
- CI `quality`, `backend`, `database` natijalari va haqiqiy brauzer UX hali PR bo‘yicha qayta tasdiqlanadi.
- Fizik PDF sahifalarining validatsiyasi, amaldagi huquqiy asoslar va savol-javoblarning mustaqil tekshiruvi hali ochiq.

**Release hold:** PR review o‘tkazilmaguncha merge/deploy yo‘q; ishlab turgan published savollarning birortasi o‘zgartirilmagan.
