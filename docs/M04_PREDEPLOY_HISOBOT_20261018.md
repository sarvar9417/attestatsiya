# M04 — “Mantiqiy mulohazalar va modellar”: deployoldi texnik tayyorgarlik

**Sana:** 2026-10-18  
**Manzillar:** `sarvar9417/attestatsiya` (GitHub), `attestatsiya100%` (Supabase)  
**Holat:** deployoldi tayyorgarlik; **hali deploy va release amalga oshirilmagan**.

## 1. Egasi tomonidan tasdiqlangan qoida

Foydalanuvchi ekspert imzosini majburiy deb hisoblamaydi. Shunga qaramay, javoblarning mantiqiy to‘g‘riligi, database yaxlitligi, grafiklarning ko‘rinishi, CI va ishlab turgan platforma sinovi majburiy texnik shart bo‘lib qoladi. “Ekspert tasdig‘i shart emas” avtomatik ravishda “noto‘g‘ri savollarni nashr qilish mumkin” degani emas.

## 2. Real bazaning tekshirilgan ko‘rsatkichlari

- M04 ostida **6 ta nashr qilingan va mazmunli nazariya darsi** mavjud.
- Avvaldan mavjud nashr qilingan bank: **62 ta** savol.
- 300 savolli yangi nashrdan 295 tasi import qilingan: **236 nashrda**, **52 diagrammali savol `review`da**, **7 aynan takrorlangan savol `archived`da**.
- Qo‘shimcha manbalar asosida yozilgan **60 ta** savol: 48 Y1, 6 Y2, 6 Y3 — `review`da.
- **`specgap-2026`** guruhi: 8 Y1, 2 Y2, 2 Y3 — `review`da. Ushbu 12 savol oldingi 112 talik hisobotdan tashqarida edi.
- Natija: **298 ta allaqachon nashrdagi savol**, **124 ta `review`dagi nomzod**, **7 ta arxivdagi takror**.
- 6 darsning har birida `topic_test_preview` funksiyasi **20 tadan** mavzu testi uchun yetarli nomzod savollarni qaytardi. Bu haqiqiy foydalanuvchi tizimida bosib ko‘rilgan test emas.

## 3. Deployoldi QA natijalari

- **124/124** `review` savolning kaliti, Y1/Y2/Y3 opsiyalar tuzilishi, construct/dars bog‘lanishi, material/stem bilan grafik ID mosligi va takrorlanmaslik holati SQL orqali tekshirildi.
- **52/52** mantiqiy sxema savoli haqiqiy databasedagi javob kaliti bilan solishtirilib, formula, G1/G2, holatlar soni, oraliq signal va signal yo‘nalishi tahlil qilindi.
- **60/60** yangi source audit savolining Y1/Y2/Y3 strukturasi manba JSONda qayta tekshirildi.
- `specgap-2026` ichidagi **2 ta Y2** savolda o‘ng ustunning `side` belgilari noto‘g‘ri edi; 4A + 4B bo‘lib tuzatildi; kalit identifikatorlari o‘zgarmadi.
- 124 nomzod ichida **0 ta aynan bir xil stem**, ular va oldindan published bank o‘rtasida ham **0 ta aynan takrorlangan stem** topildi.
- Hech bir `review` savolida hali foydalanuvchi `exam_items` yozuvi mavjud emas.
- SQL **atomar nashr repetitsiyasi** `BEGIN/ROLLBACK` bilan o‘tkazildi: nazorat tranzaksiyasida 124 savolni nashrga o‘tkazish mumkinligi aniqlandi, lekin `ROLLBACK`dan keyin barchasi `review`da qoldi.
- Grafik render uchun Vitest testi kengaytirildi: `G001..G052` har biri, G1 va ikkinchi element belgilari, yo‘q identifikatorning xavfsiz holati.

**Chegara:** avtomatik QA barcha savollarning didaktik mukammalligini yoki pedagog tomonidan 100% qo‘lda ko‘rilganini tasdiqlamaydi. CI Playwright umumiy smoke ham ishlab turgan productionda M04 kirish → test → baholash → progress real foydalanuvchi sinovining o‘rnini bosmaydi.

## 4. Birlashtiriladigan repository fayllari

| Fayl | Vazifasi |
|---|---|
| `src/tests/m04LearnerIntegration.test.tsx` | 52 grafik sxemaning UI regressiya testi |
| `supabase/maintenance/m04_release_gate_20261018.sql` | 6 dars va 124 savolning holatini faqat o‘qish orqali qattiq tekshirish |
| `supabase/maintenance/m04_postdeploy_publish_20261018.sql` | **Faqat deploydan keyin** va qo‘lda tekshirish tasdiqlangandan so‘ng atomar nashr |
| `supabase/maintenance/m04_postdeploy_rollback_20261018.sql` | Favqulodda holatda **faqat yangi 124 ta** savolni qaytarish; foydalanuvchi urinishlari bo‘lsa bloklash |
| `docs/M04_PREDEPLOY_HISOBOT_20261018.md` | Ushbu hujjat, manbalarga va tekshiruvlarga izoh |

Ochiq GitHub'ga **javoblar, xususiy savollar JSONi yoki yopiq kalitlar** yuklanmaydi.

## 5. Deploydan keyingi majburiy tartib

1. GitHub `main` ning kerakli commit SHAsi frontend **va** backend production deployiga chiqqanini aniqlang; oldingi deploy yetarli emas.
2. Autentifikatsiyalangan o‘quvchi sifatida `M04.01`–`M04.06` nazariyalari chiqishi, telefon va kompyuterda o‘qilishi, xususan 52 SVG chizma yo‘qolmasligini tekshiring.
3. Y1, Y2 va Y3 savolni haqiqiy test sessiyasida boshlab, javob yuborib, to‘g‘ri natija, xato izohi va progress qayd etilishini tekshiring. Javob kaliti test davomida oshkor bo‘lmasin.
4. `m04_release_gate_20261018.sql` ni productionga qayta qo‘llang.
5. Operator **shu tranzaksiya ichida** `SET LOCAL app.m04_deployment_verified = 'true';` signali bilan `m04_postdeploy_publish_20261018.sql` ni ishga tushiradi. Unda oldingi gate ham atomar qayta tekshiriladi.
6. Nashrdan keyin **422 published savol** (298+124), M04 nazariya 6 dars, 0 `review` nomzod tekshirilsin. Zaruratda rollback oldingi 298 nashrdagi savolni **aslo** o‘zgartirmasligi kerak.

**Qaror:** Deployoldi QA tugagach, nashrga tayyor. Frontend/backend production tasdig‘igacha **124 ta review savolni avtomatik publish qilish mumkin emas**, chunki grafik yoki Y2/Y3 ko‘rinishi noto‘g‘ri bo‘lishi mumkin.