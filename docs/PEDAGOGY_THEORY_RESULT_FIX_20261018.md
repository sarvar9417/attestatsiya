# Attestatsiya — pedagogika nazariyasi va natija oynasi (2026-10-18)

**Branch:** `work/pedagogy-theory-result-navigation-20261018`  
**Release holati:** tayyorlov; **productionga merge/deploy va Supabase migration apply QILINMADI**.  
**Maqsad:** 15 savollik pedagogika + kasb standarti mashqidan keyin to‘liq navigatsiya va scroll; M15 umumiy pedagogika qo‘llanmasini manba asosida boyitish.

## 1. Topilgan UI sabab va tuzatish

- `App.tsx` /exam marshrutini `overflow-hidden` konteynerida ochadi; bu aktiv, butun ekranli sinov uchun kerak.
- `ExamRunner.tsx` `result` bosqichida odatiy uzun hujjatni render qiladi, lekin natijaning o‘zida scroll konteyneri bo‘lmagan.
- UI height-chain: `main#main-content` -> `animate-page-enter` -> `ExamRunner` natija konteyneri; ota konteyner cheklangan bo‘lgani uchun pastki qismga yetib bo‘lmagan.
- Tuzatish: `min-h-0` + `h-full` height chain, natijaning `overflow-y-auto` mustaqil scroll maydoni.
- `ExamResultActions` sticky navigatsiyasi: bosh sahifa, testlarga/bo‘limga qaytish, nazariya, natijalar tarixi, yangi sinov; route manzillari mashq turiga mos.
- `ProfessionalPracticePage` boshlanish ekranida M15 nazariyasiga bevosita kirish.

## 2. M15 nazariyasi: avvalgi bazani saqlash

`M15` moduli va `M15.01–M15.08` darslar bazada avvaldan bor. Ular qayta yaratilmaydi; ikki **append-only, idempotent** migratsiya orqali mavjud published darslar boyitiladi. `lesson_constructs`, test savollari, to‘g‘ri javoblar, foydalanuvchi progressi va rasmiy 5/7/3 kvotalari o‘zgarmaydi.

| Dars | Yangi nazariyaning asosiy yo‘nalishi | Manbalar |
|---|---|---|
| M15.01 | Pedagogik mahorat komponentlari; pedagogika, didaktika va metodikani ajratish | Xoliqov, Pedagogik qobiliyatlar |
| M15.02 | Induksiya, deduksiya, analogiya; tamoyil–metod–vosita–shakl | 2025 kuzgi test korpusi, dars turlari |
| M15.03 | Tarbiya maqsadlari, metodlari, pedagogik ta’sir ketma-ketligi | Xoliqov, 2024 bahorgi korpus |
| M15.04 | Olti dars turi, besh dars tahlili, refleksiya tartibi | Dars turlari; dars tahlili turlari |
| M15.05 | Sinf rahbari, ota-ona va hamkasblar bilan hamkorlik | Kasbiy standart qo‘llanmasi |
| M15.06 | Etika, takt, nutq, texnika, refleksiya va muloqot | Xoliqov; PEDMAHORAT.docx; 2025 testlar |
| M15.07 | Didaktik, akademik, perseptiv, kommunikativ va boshqa qobiliyatlar | Pedagogik qobiliyatlar, Xoliqov |
| M15.08 | Inklyuziya, differensiallash, moslashtirish va ta’lim texnologiyalari | Qodirova/Pulatova; kasbiy standart |

Kontent — manbalardan original sintez: tarixiy test savollari yoki noma’lum javoblarni ko‘chirmaydi. Test korpusidagi “Javob:” markerlari ekspert tasdig‘i bilan teng emas.

## 3. Yuborilgan manbalar inventari va cheklovlari

**Nazariy mazmuni tekshirilgan asosiy manbalar**:
- `Xoliqov Pedagogik mahorat.pdf` — 28 sahifa;
- `Pedagogik qobilyatlar umumiy.pdf` — 13 sahifa;
- `Dars turlari.pdf` — 2 sahifa;
- `dars tahlili turlari.pdf` — 1 sahifa;
- `4-Inklyuziv-talim-nazariya-va-metodika.pdf` — 259 sahifa (kirish va umumiy metodika materiallari; barcha sahifalar ekspert muharrirlikdan o‘tgani haqida da’vo yo‘q);
- `Pedagogning kasbiy standarti - qollanma.pdf` — 13 sahifa;
- `PEDMAHORAT.docx` — 820 ta paragraf, ayrim kommunikativ materiallar ko‘rildi.

**Vaziyat va attestatsiya signali sifatida ishlatilgan**: `Pedmahorat to‘plam 2025 kuzgi(1).pdf` (24 sahifa), `Pedagogik mahorat to‘plam 2025(1).pdf` (43 sahifa), `Attestatsiya to‘plam ped mahorat @PedMahoratGuli(2).pdf` (81 sahifa). Bular normativ manba emas; javoblarning barchasi mustaqil tasdiqlangan deb qaralmaydi.

**Kengroq korpus sifatida topshirilgan, hali to‘liq editorial audit talab qiladigan**: `PedKasb tushgan testlar PedMahoratGuli (1) (1) (1)(1).pdf`, `kasb standarti (2).pdf`, `PedMahorat demo.pdf`, `Pedagogika testi 3.pdf`, `Pedmahorat 4.pdf`, `pedagogika6.pdf`, `Attestatsiya-2026. Robiya Xatamova 1.pdf` (24 sahifa, matn qatlami yo‘q), `ChatExport_2026-10-11.zip` (Telegram export, 42 messages HTML sahifa). So‘nggi materiallar manba/kategoriya auditidan o‘tkazilmasdan savol bankiga avtomatik kiritilmaydi.

## 4. Tasdiqlashdan oldingi QA / release gate

- [x] O‘zgarishlar faqat alohida Git branchda.
- [x] Natija scroll konteyneri va sticky navigatsiya kodi tayyor.
- [x] Natija navigatsiyasi uchun 2 ta unit-test yozilgan.
- [x] M15 uchun 8 ta manbaviy boyitish bo‘limi 2 ta SQL migratsiyaga yozilgan.
- [ ] Preview build va unit testlarning yakuniy tekshiruvi.
- [ ] Haqiqiy hisobdan 15 savolni yakunlab desktop va mobil viewportlarda scroll/tugmalarni qo‘lda tekshirish.
- [ ] Fresh/staging DBda SQL migration va M15.01–M15.08 kontent renderini tekshirish.
- [ ] Barcha yuborilgan fayllar bo‘yicha chuqur editorial coverage va manba-aniqlik auditi.
- [ ] Foydalanuvchining alohida **production release tasdig‘i**.

**Muhim:** Git branchga push Vercelda avtomatik preview deployment yaratishi mumkin. Preview production release emas. `main`ga merge ham, production DB migration ham user tasdig‘isiz bajarilmaydi.
