# Pedagogika published savollar: semantik ekspertiza navbati — 2026-10-19

**Production audit: faqat SELECT.** Savollarning `published` statusi, to‘g‘ri kalitlari, variantlari, foydalanuvchi urinishlari, yangi versiyalari yoki boshqa production ma’lumotlariga yozuv kiritilmagan.

## Qamrov va navbat

- **450** published pedagogika savoli: KS 140, PM.GEN 233, PM.MET 77.
- **247** savolda `question_editorial_checks` yozuvi yo‘q. Bu noto‘g‘ri javob bor degani emas.
- Eng katta mavzu navbatlari: PM.MET.03 **21**, PM.MET.02 **20**, KS.03 **17**, KS.04 **16**, KS.05/07/PM.MET.01 har biri **15** ta.
- Published Y1 **426** ta, har birida 4 variant; ichki normallashtirilgan variant takrori kuzatilmadi.
- **85** Y1’da kalitga mos variant boshqalardan qat’iy uzunroq. 76 tasida uzunlik farqi 30% dan kichik, qolgan 9 tasida 30% dan katta. Bu faqat tahririy signal.
- 450 savol matnining konstruktdagi dastlabki trigram+token similarity saralashi: **2 ta yuqori o‘xshash juftlik**. KS.03 dagi ikkita Y2 savolning stem’i aynan bir xil, lekin variantlari va matching mazmuni bir xil emas; **PM.GEN.01** didaktikaga oid quyidagi ikkita Y1 savol yuqori o‘xshash: `a32d2489-60b9-472e-8d61-802173e4deb2` va `b663fc1c-a246-42b1-91a6-942e2bc80790`. Ularning muharrir tasdig‘i yo‘q. Boshqa didaktika Y1’lari bilan ham semantik takrorlash ko‘rilishi shart. Hech biri avtomatik arxivlanmaydi.

## SQL navbat algoritmi

`supabase/audits/pedagogy_published_editorial_queue_20261019.sql`:

- Read-only transaction, 450 published savolning savol ID, guruh, konstrukt, format, ichki provenance oilasi, mavjud tahririy yozuv, tushuntirish uzunligi va Y1 javob uzunligi signallarini ko‘rsatadi.
- Prioritet: muharrirlik yozuvi yo‘qligi (+100), to‘rt tekshiruv bayrog‘i to‘liq emasligi (+10), izoh juda qisqaligi (+25), to‘g‘ri Y1 eng uzunligi (+20), katta farq (+15), stem aynan bir xil (+30), Y1 shakl/kalit strukturasi buzilishi (+100).
- Manba sahifasi ushbu SQL bilan tasdiqlanmaydi. `source_reference` ning ichki identifikator sifatidagi cheklovi mustaqil ravishda qayd qilingan.
- SQL production’da `SELECT` sifatida sinab ko‘rildi; saralashda KS.03 bir xil Y2 matni va Y1 uzunlik signallari keldi.

## Ekspertning item-by-item qabul mezonlari

1. Rasmiy 2026 spetsifikatsiyadagi tegishli konstrukt va kognitiv vazifa bilan moslik.
2. Darslikning aniq nashri, beti, bo‘limi va ishonchli matn yoki rasmli dalili.
3. To‘g‘ri javobni tasdiqlaydigan dalil, har bir distractor nima uchun noto‘g‘riligining qisqa izohi.
4. Y2/Y3 struktura, maxfiy answer-key va reproducible scorer qoidalariga moslik.
5. Y1 javob uzunligi, mazmunan bir xil variant, turli shakldagi semantik dublikat, asossiz «hamisha» kabi tuzoqlar.
6. Zarur bo‘lsa, immutable oldingi savolga tegmasdan review holatidagi yangi tahririy variant yaratish; keyin inson ekspert tasdig‘i va ruxsat bilan nashr qilish.

## Manba farqlari

- M14.03 uchun Komil Jalilov (2020) *Baholash nazariyasi asoslari*, obyekt/mezon/ipsativ farqlari; `docs/PEDAGOGY_M14_M15_SOURCE_RECONCILIATION_20261019.md` ga qarang.
- M15.01 didaktika: Mirzayeva 2-mavzu konspekti va rasmiy tavsiya qilingan umumiy pedagogika darsliklari bilan betma-bet tasdiq zarur.
- M16: 2026 spetsifikatsiya va Mamarajabov–Toshtemirov–Yuldashev (2023); `docs/PEDAGOGY_M16_SPECIFICATION_SCOPE_20261019.md` ga qarang.

**Qolgan ish:** barcha 450 itemning ekspert xulosalari va 18 mavzuga betma-bet crosswalk. Ushbu PR avtomatik reviewer flags yaratmaydi.
