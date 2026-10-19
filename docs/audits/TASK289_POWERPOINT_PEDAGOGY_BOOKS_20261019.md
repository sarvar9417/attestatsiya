# TASK-289 — M03 PowerPoint va M15 pedagogika qisqa darslarini to‘liqroq bobga aylantirish

**Qamrov:** avval qisqa konspekt bo‘lgan beshta mavzu asosiy BookReader boshida mustaqil darslik uslubidagi bob sifatida ochiladi.

| Mavzu | Yangi blok | Bo‘lim | Manba doirasi |
|---|---:|---:|---|
| M03.08 PowerPoint interfeysi va dizayni | 52 | 12 | Cambridge+ ICT 9, Uslublar (14), Taqdimot (19) |
| M03.09 Obyektlar va multimedia | 52 | 12 | Cambridge+ ICT 9, Taqdimot (19) |
| M03.10 Animatsiya va o‘tishlar | 51 | 12 | Cambridge+ ICT 9, Taqdimot (19) |
| M15.07 Pedagogik qobiliyatlar | 52 | 12 | Xoliqov «Pedagogik mahorat» |
| M15.08 Ta’lim texnologiyalari | 53 | 12 | Qodirova/Pulatova «Inklyuziv ta’lim» va ilgari tekshirilgan pedagogika izohlari |

**Manba URL:**
- [Cambridge+ ICT 9-sinf, 2021](https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view) — bosma 175–180 va 240–250-betlar atrofidagi mavzular
- [Xoliqov, Pedagogik mahorat](https://drive.google.com/file/d/1urZe1IJjLVco-KysxtIvg46Ej89XreuK/view) — tarixiy qobiliyat tasnifi bilan
- [Qodirova, Pulatova, Inklyuziv ta’lim](https://drive.google.com/file/d/1J67WL90Qh6uULzmI7yYIR0OJ6diTg3cX/view) — teng ishtirok, moslashtirish
- [Korreksion pedagogika konspekti](https://docs.google.com/document/d/1-mz2ykvhEuG4dudIDq-k0zYofeLvbz2g/edit) — ikkilamchi, rasmiy kuchi tasdiqlanmagan

## Arxitektura va QA
- Qisqa eski 5/6-blokli takroriy nazariya *alohida ikkinchi o‘qish* sifatida chiqarilmaydi.
- Original M03 test savollari va javob kalitlari `...original` orqali o‘zgarishsiz saqlanadi. M03 Office manbaviy ilovalari oxirida saqlanadi.
- M15 savollarini tekshiruvchi backend avtoriteti saqlanadi; `getPedagogyStudyNotes` qaydlari bilan darslikdan keyin bog‘lanadi.
- `TASK289PowerPointPedagogyFullBooks.test.ts` o‘qish struktura, 12 bo‘lim, source trace, keys va qo‘shni darslar ta’sirini tekshiradi.
- Sahifama-sahifa asl darslik kontentining to‘liqligi yoki huquqiy normalarning amaldagi statusi **tasdiqlanmagan**. Original informatikaga oid keys va amaliy topshiriqlar qayta bayon.

**Qolgan ish:** M01/M02 tarkiblarining barcha manba betlari bilan solishtirish, M04–M13 va M14/M16 qisqa bo‘limlar, imlo va formulalar hamda savollar bankini alohida audit. GitHub CI 4/4 yashil bo‘lsa merge, deploy yo‘q.
