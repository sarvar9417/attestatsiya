# TASK-278 — M15: mavjud nazariya izohlarini bosh darslikka kiritish

Sana: 2026-10-19. Status: UI/code improvement; **source certification still open**.

## Tasdiqlangan nuqson

Oldingi M15.01–M15.08 BookReader faqat 4–6 ta yadro blokini ko‘rsatgan; asosiy tushuntirishlar, hayotiy misollar, jadvallar va manba izlarining yana 5–12 bloki BookReader'dan **keyingi yopiq accordion** ichida edi. Shuning uchun foydalanuvchi darsni qisqa deb ko‘rgan va mundarija/progress butun mavjud matnni qamramagan.

## Xavfsiz va chegaralangan tuzatish

- Eski `pedagogyStudyNotes.ts` dagi **allaqachon UI'da mavjud** 8 to‘plamni `withExistingPedagogyNotes` yordamida original `getTopicContent`dan keyin qo‘shish; original va savollar saqlanadi.
- `TopicView` `BookReader` aynan shu kengaytirilgan bloklarni ishlatadi; yopiq dublikat accordion olib tashlanadi. Serverdagi ixtiyoriy published supplement o‘zgarishsiz qoladi.
- Sakkizta test mavzuni, manba bloklari ketma-ketligini va quiz references invariantini nazorat qiladi.

## Manba va release chegarasi

Bu ish **yangi nazariya yozmaydi, PDFning 100% tekshirilganini bildirmaydi, M15 uchun ekspert tasdig‘i bermaydi**. Manba asosidagi kengaytmalar, Mirzayeva'dagi metodlar tafovuti va boshqa yangi tahrirlar #256 draft PRda qoladi. Ushbu tor PRdagi UI sxemasi pedagogika faqat bitta darsga tiqilib qolmasligini yaxshilaydi, lekin real authenticated desktop/mobile ko‘rigi va kitoblardagi matn/rasmlar ekspertizasi ochiq.

No DB write, no published revision, no answer key, no deploy.

## CI qayta tekshiruvi

PR #258 required Actions `quality` jobini `main`ga qo‘shgach, bu branch'dagi kontentni o‘zgartirmay yangi test-merge kontekstida frontend/backend/database/quality CI qayta ishga tushirildi. Merge faqat ushbu tekshiruv muvaffaqiyatli yakunlanganida.
