# Nazariya: yagona kitob ketma-ketligi — 2026-10-19

## Tasdiqlangan UI nosozligi

- **M02**: katta, mahalliy darslikka tayangan kitob asosiy ekranda; serverdagi faqat `## Tekshirilgan qo‘shimcha:` bilan belgilangan manbaviy material pastdagi `<details>` panelida va qo‘shimcha bosishni talab qilgan.
- **M15**: mahalliy kuratsiyalangan nazariya + 8 mavzuning yozib qo‘yilgan manbaviy izohlari BookReader ichida; shu bilan birga published lesson ichidagi `## Chuqurlashtirilgan nazariya — manba korpusi` segmenti boshqa ochiluvchi panelda yashirilgan. Ayrim mahalliy M15 boblari ham M01 kitobi kabi batafsil emas.
- **M14**: `Kasb standarti — manbaviy jadval va misollar` ostida takrorlanmagan legacy mazmun asosiy published darsdan ajratilgan.
- Darsni faqat bir xil **dizayn** bilan ta'minlash matnni to‘ldirmaydi: `TASK284TheoryDepthInventory` testi M03.01 va M15.02 kitoblari M01.02 dan ancha qisqaligini bildiradi.

## Ushbu kodning amaldagi o‘zgarishi

1. M02/M15 uchun `getLessonDetail` **boshlang‘ich ochilish vaqtida** o‘qiladi. Kitob dastlab ko‘ringandan keyin uning sahifalari asinxron kengayib ketmaydi; API ishdan chiqsa, mavjud mahalliy kitob to‘liq saqlanadi.
2. Yangi kontent faqat `status=published` va tegishli manba-marker mavjud bo‘lganda qo‘shiladi. Qisqa server konspekti hech qachon M02/M15 ning asosiy kuratsiyalangan nazariyasini almashtirmaydi. Draft/review content oshkor qilinmaydi; answer keys va original savollar o‘zgarmaydi.
3. Qo‘shilgan nazariya takrorini normalizatsiyalangan tip+matn bo‘yicha olib tashlab, **bitta BookReader** ichida o‘qiladi. Quyi `<details>` navigatsiyasi yo‘q.
4. M14 dagi manbaviy jadval/misollar asosiy published book ichida, manba ilovalari bilan birga joylashadi.
5. M14/M16 ning published chuqurlashtirilgan segmentlari ham bitta darsda ko‘rsatiladi; nashr qilinmagan matn ko‘rsatilmaydi.

## Cheklovlar / keyingi sifat darvozasi

Bu ish **UI va mavjud nashr qilingan materiallarni to‘g‘ri birlashtirish**ni hal qiladi, ammo avtomatik tarzda har bir nazariyani darslikning har bir sahifasiga tenglashtirmaydi. Buning uchun Drive’dagi darsliklarning bosma/fizik sahifalarini alohida mavzu-mavzu tekshirish, dalil/diagramma/jadval/kodlarni solishtirish va ekspert tasdig‘i zarur.

E'tibor: M02/M15 bo‘yicha yangi dastlabki API o‘qish sabab server javobini kutish mavjud; offline yoki xato holatda mahalliy kitob yo‘qolmaydi. M01/M03/M04/M06/M07/M08/M09/M10/M11/M12/M13 ning mavjud navigatsiyasi o‘zgartirilmaydi.

**Release:** aynan oxirgi PR commitida frontend lint, typecheck, unit, build va E2E, backend va database CI muvaffaqiyatli bo‘lmasa merge qilinmasin. No production DB/migration, savollarni publish qilish yoki deploy.
