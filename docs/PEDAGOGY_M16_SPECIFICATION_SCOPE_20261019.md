# M16 informatika metodikasi: 2026-yilgi spetsifikatsiya bilan moslashtirish

## Tekshirilgan asos

Sarvar Drive: [*Informatika Testlar spesifikatsiyasi.pdf* (Toshkent, 2026)](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view), 2-jadval, «2.2. Informatika o‘qitish metodikasi». Unda **3 ta imtihon topshirig‘i** va uchta kompetensiya: fan mazmunini o‘qitish yondashuvlari, metodni vaziyatga mos tanlash, ta’limiy vaziyatdagi qarorni baholash qayd qilingan. Platformadagi M16.01–M16.03 uchta o‘quv mavzusi *har biridan bitta savol chiqishini kafolatlamaydi*.

Spetsifikatsiyada asosiy tavsiya etilgan darslik sifatida **Mamarajabov M.E. va boshq., *Informatika o‘qitish metodikasi* (Bookmany print, 2023, 460 bet)** keltirilgan. Bu darslikning asl PDF matni/sahifalari ushbu bosqichda mavjudligi tasdiqlanmadi; shuning uchun yangi vaziyatli misollar **editorial amaliy misollar** bo‘lib, *kitobdan iqtibos sifatida ko‘rsatilmaydi*. Rasmiy spetsifikatsiya testlarni kitobdan bevosita ko‘chirish shart emasligini, mazmun va yondashuvga moslik kerakligini belgilaydi.

## O‘zgarishlar

- **M16.01:** mazmunni yosh va bosqichga moslashtirish; noto‘g‘ri 1 topic = 1 official question taxminini rad etish.
- **M16.02:** o‘quv natijasiga mos ko‘rgazmali, amaliy va vaziyatli metod tanlash hamda interfaol metodning mutlaq ustunligini rad etish.
- **M16.03:** qarorda dalil, maqsad, xavfsizlik, muqobil variant va natija bahosi; kompyuter cheklovi bo‘lgan sinf misoli.
- **Test:** uchalasi uchun manba izlari va didaktik xavfsizlikni tekshiruvchi Vitest regression.

## Ochilgan sifat cheklovlari

1. Mamarajabov (2023) darsligining barcha boblari bilan alohida sahifama-sahifa crosswalk ochiq.
2. M16 published/review bankining to‘liq soni va har bir answer key hali read-only production tekshiruvidan o‘tishi kerak.
3. Informatika metodikasi uchun murakkab didaktik vaziyatli Y2/Y3 savollari expert review’siz e’lon qilinmaydi.
4. CI (lint, unit, build, E2E), mobile QA, xavfsiz merge va deployment gate ochiq.
5. Ushbu PR production question/answer keys, attempt results, database va deploymentga tegmaydi.
