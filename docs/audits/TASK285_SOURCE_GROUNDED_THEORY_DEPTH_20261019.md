# TASK-285 — M03.01 va M15.02 chuqur nazariya audit (2026-10-19)

## Qamrov va muammo

M03.01 (Word) va M15.02 (Ta’lim tamoyillari) dastlab har biri **5 ta asosiy statik nazariya bloki** bilan boshlangan. 2026-10-19 holatidagi `scripts/audit-theory-depth.ts` ularni M01.02 uzoq bobidan kamroq deb belgilagan; bir xil dizayn mazmun to‘liqligini kafolatlamagan.

## Ushbu PR

| Mavzu | Yangi bob | Bo‘limlar | Materiallar |
|---|---:|---:|---|
| M03.01 Word interfeysi, yaratish va tahrirlash | 58 blok | 12 | Interfeys, hujjat tuzilishi, kursor, Find/Replace, clipboard, Save/Save As, ko‘rinish/chop, tekshiruv, xavfsiz hamkorlik, 5 mashq va javob |
| M15.02 Ta’lim tamoyillari | 61 blok | 13 | Qonuniyat/tamoyil/metod farqi, ilmiylik, tizimlilik, ongli faollik, ko‘rgazmalilik, tushunarlilik, individual yondashuv, amaliyot, mustahkamlik, tarbiyalovchi ta’lim, 6 mashq va javob |

- Ikkala bob **asosiy BookReader dastlabida** turadi; eski konspektlar va M03 ofis qo‘shimchalari saqlanadi. M15 nazariya izohlari esa `withPedagogyStudyNotes` orqali o‘z joyida qo‘shiladi.
- Statik testlarning matni, javob kaliti, nashr holati va backend ma’lumotlari o‘zgarmaydi.
- Ilgari mavjud bo‘lmagan mazmun yangi PDF matnidan so‘zma-so‘z ko‘chirilmagan; bo‘limlar mustaqil pedagogik qayta bayon.

## Tekshirilgan manba doiralari

1. [Cambridge+ 5-sinf — «Matnli hujjat bilan ishlashni boshlash»](https://drive.google.com/file/d/1jiQYB3WiZ387MhjbSwUMO1xcDcIvbB1m/view) — hujjat yaratish, matnni belgilash va o‘zgartirish, saqlash, imlo tekshirish, maktab jurnali maqolasi vazifasi.
2. [Cambridge+ 10–11-sinf — Matn bilan ishlash (bosma 37–38-bet)](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view) — matn protsessoridan foydalanish vazifalari, jadval, sarlavha, sharh, uslub, o‘zgarishni yozib olish.
3. [F.O. Mirzayeva — «Pedagogika nazariyasi va tarixi»](https://drive.google.com/file/d/1GG9dH4_kdMyj5cqKML21lQoZufO40E38/view) — ta’lim jarayoni mohiyati, didaktika, tamoyil-qonuniyat farqi, ko‘rgazmalilik, faollik, izchillik, tushunarlilik va seminardagi tasnif mashqlari.

**Chegara:** PDF fizik betlaridan birma-bir ko‘chirish yoki muallif darsligining 100% qamrovi da’vo qilinmaydi. Keltirilgan bet raqamlari matnda ko‘rinadigan bosma raqamlardir; rasmli materiallarni alohida vizual verifikatsiya qilish kerak.

## Keyingi sifat navbati

M03.02 (formatlash), M03.03 (Word obyektlari), M15.03 (tarbiya turlari) va boshqa `brief` mavzularni shu mezon bo‘yicha to‘liq bobga aylantirish. Har bir bobda: manba izi, o‘quv maqsadi, tushunchalar, taqqoslash, kamida bitta ishlangan misol, mustaqil topshiriq, javob va xatolarni ajratish talab qilinsin.

## Tekshiruv

`src/tests/TASK285SourceGroundedBooks.test.ts`: tarkibiy bloklar, boshdagi o‘qish ketma-ketligi, M15 izohlarining saqlanishi, M03.01 test kalitlari va qo‘shni mavzularni o‘zgartirmaslik. Barcha GitHub CI majburiy jarayonlari muvaffaqiyatli bo‘lmaguncha merge taqiqlanadi. Deploy yo‘q.
