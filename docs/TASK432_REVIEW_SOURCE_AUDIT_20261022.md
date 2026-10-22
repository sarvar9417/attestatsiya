# TASK-432 — `review` savollar: manba va nashr xavfsizligi auditi (2026-10-22)

## Ko‘lam
Pedagogika bo‘limlari: `KS`, `PM.GEN`, `PM.MET`. Boshlang‘ich 114 ta review savol: 112 ta Y1, 2 ta Y2. Barcha savollarning option/key strukturasi qayta tekshirildi: 0 xato.

## Haqiqiy manba va javob solishtiruvi
Manba to‘plamlarini Google Drive'dan **asl matn** ko‘rinishida o‘qib solishtirildi.

- `19Kl2gE81pDj7Z3XQeNW0BK-HwCeqogdV` — «Pedagogik mahorat to'plam 2025.pdf»: savollar 7, 14 va 24; savollar va keltirilgan «Javob»lar manbadagi kalitga mos.
- `1Ou7t67cqHbYcgGg8DSOtTFVxXO39TdY9` — «Pedmahorat to'plam 2025 kuzgi.pdf»: savollar 2 va 48; manbada «Refleksiya» va «Perseptiv qobiliyati» deb ko‘rsatilgan.
- 5 ta sifat tekshiruvidan o‘tgan savol nashr qilindi. Bu to‘plamlar Telegram asosidagi **norasmiy** to‘plam; ular rasmiy davlat attestatsiyasi javob kaliti emas. Muharrir **AI**, mustaqil inson ekspertizasi da’vo qilinmaydi.
- `1O9wk2V0S6vKWa-EtcVhtOb-4v7wx3JiE` — «2026 tushgan test 1.pdf»: reviewdagi 12 ta savolning manba fayli mavjud, **rasmiy javob kaliti yo‘q**.
- `1XePcFEJBnu0vliKiLiewkLdvtX8Bxz6g` — «Yutuqli test.pdf»: 12 ta review savoli Telegram manba ma’lumotlariga tayanadi, ammo mustaqil tasdiqlangan javob kaliti yo‘q.

24 ta shunday savol `editorial_evidence_missing` / `high` ochiq sifatsizlik bayrog‘i bilan review holatida qoldirildi. Boshqa 85 ta review savolning `independent_editorial_review_required` belgisi saqlandi. 1 review savolda qo‘shimcha eski versiya statusi bayrog‘i bor.

## Foydali kontent tahriri
2026 yilgi to‘plamning 12-savoliga tegishli `4450dcf6-4f99-4d35-b8f5-7218de240284` review savolida uchta noto‘g‘ri javob «Faqat» bilan boshlanar edi. Ular boshqa haqiqiy dars turlari bilan almashtirildi. Kuchli javob-oshkorlik signali 1 dan 0 ga tushdi; ochiq manba-dalil tekshiruvi bekor qilinmadi.

## SQL bypass topildi va yopildi
Avval ishonchli SQL sesiyasi umumiy owner AI waiver bilan yuqori darajali ochiq manba-dalil xatosi bor savolni **nashr qila olardi**. Holat rollback sinovida qaytarildi, haqiqiy baza saqlandi.

Migration: `supabase/migrations/20261022051624_task432_prevent_unverified_pedagogy_source_publication.sql`. Yangi trigger:
- `review → published` va to‘g‘ridan-to‘g‘ri `published` kirgizishda mazkur yuqori/kritik source/answer evidence xatolarini bloklaydi;
- waiver bu xatoni chetlab o‘ta olmaydi;
- allaqachon `published` bo‘lgan tarixiy yozuvlar va test urinishlariga tegmaydi;
- javob va sifat ma’lumotini o‘qigani uchun funksiya `anon/authenticated` to‘g‘ridan-to‘g‘ri bajarishiga ochilmagan.

`supabase/tests/task432_pedagogy_source_evidence_publish_gate.test.sql` sintetik savol bilan manba xatosi bor / xatosi bartaraf etilgan ikki yo‘lni test qiladi va transaction rollback qiladi.

## Yopilmagan ish
109 ta review savol tekshiruvda saqlangan. Manba va ekspertiza bo‘yicha bayroqlar dalillar bilan alohida hal qilinishi kerak. Jarayonning yopiq flagi tekshiruvdan o‘tganini anglatadi; foydalanuvchidan mustaqil inson ekspertizasi bo‘lganini da’vo qilish mumkin emas.
