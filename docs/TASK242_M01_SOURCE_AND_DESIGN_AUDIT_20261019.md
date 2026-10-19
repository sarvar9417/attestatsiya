# TASK-242 — M01 Axborot va raqamli savodxonlik: source + UI QA

**Tekshiruv sanasi:** 2026-10-19  
**Status:** `IN_PROGRESS / EDITORIAL REVIEW PENDING`. Ushbu hujjat release roziligi emas.  
**Work branch:** `task/TASK-242-m01-source-fidelity-and-design` (oldingi nazariya renderer tuzatishlari ustida).  
**Cheklov:** `main` merge, production deploy, production migratsiya va avtomatik publish yo‘q.

## 2026 attestatsiya spetsifikatsiyasiga moslik

Drive’dagi **«Informatika Testlar spesifikatsiyasi.pdf» (2026)** bo‘yicha M01 uchun **3 ta** savol ajratilgan. Asosiy bilim va ko‘nikmalar M01 katalogiga quyidagicha xaritalangan:

| Rasmiy konstrukt | M01 nazariya joyi | Strukturaviy natija |
| --- | --- | --- |
| Informatika, ma’lumot, axborot va bilim farqi | M01.02 | Mavjud |
| Axborot turlari va manbalari | M01.03 | Mavjud |
| Turli axborotni kodlash | M01.05, M01.06 | Mavjud |
| Axborot o‘lchov birliklari, hajmni hisoblash | M01.05, M01.07, M01.09 | Mavjud |
| Axborot hajmi va uzatish tezligi | M01.05, M01.07 | Mavjud |
| Raqamli muhitda axloq va mualliflik huquqi | M01.04 | Mavjud |
| Axborotni saralash, tekshirish, xulosa chiqarish | M01.04, M01.08 | Mavjud |

**Muhim:** `Mavjud` faqat mavzuning strukturaviy/terminologik qamrovini anglatadi. Bu har bir matn, misol yoki savol mazmuni ekspert tomonidan tasdiqlanganini bildirmaydi.

## Tekshirilgan muhit va manba korpusi

- GitHub: `src/data/contentTree.ts`, `src/data/topics/m01.ts`, `BookReader.tsx`, `BookBlock.tsx`, `InlineText.tsx`, `scripts/latex_to_blocks.py` va asl `I_qism_Axborot_va_raqamli_savodxonlik_yagona.tex`.
- Drive: 2026 yilgi sinov spetsifikatsiyasi hamda **13 ta** tegishli 5–11-sinf darslikning o‘qiladigan matnlari (ICT 5, 6, 7, 8, 9, 10, 11; Cambridge+ 5, 6, 7, 8, 9 va 10–11).
- Yuqoridagi darsliklarda kodlash, axborot birliklari, raqamli madaniyat, ma’lumotlarni saralash, tashish tezligi kabi atamalar/mazmun yo‘nalishlari bilan **dastlabki izlash va tanlab kontekst tekshiruvi** amalga oshirildi. Bu 13 darslikning to‘liq sahifama-sahifa o‘rganilishi emas.
- M01 kontent tizimi: 12 katalog mavzusi, shundan 7 ta asosiy bob (M01.02–M01.08) va 5 ta ilova; 10 ta xaritalangan React diagramma; 55 ta generatsiyalangan jadval.
- 13 darslik tavsiya ro‘yxatiga kiritilgan bo‘lsa ham, mavjud M01 yagona LaTeX qo‘llanmasi ularning hamma materialini to‘liq qamragan deb avtomatik xulosa qilinmaydi. Faqat spetsifikatsiyaga daxldor mavzu va konstruktlarga moslik zarur.

## Aniq topilgan xato va tuzatish

`scripts/latex_to_blocks.py` `examplebox` ichidagi sarlavhani ajratmagan: `{1-misol... @@Oddiy@@} ...` kabi ifoda misolning asosiy matniga chiqib qolgan. Bundan tashqari `\\difficulty{}` noto‘g‘ri `@@manba@@` formatiga o‘girilib, darajani bibliografik iz sifatida ko‘rsatgan.

Tuzatish:
1. `examplebox` sarlavhali muhitlar ro‘yxatiga qo‘shildi; unlabeled muhitlar avvalgi qoida bilan ishlaydi.
2. `\\difficulty{}` bibliografik `@@...@@` emas, kalit/daraja `==...==` formatiga o‘tkazildi.
3. Generatsiya qilingan `m01.ts`dagi 10 ta misolning sarlavha va matni asl LaTeX strukturasiga mos ajratildi (saralash tahlili, parity/validatsiya, PIN-kod, siqish).
4. `BookBlock` sarlavhalarida xavfsiz `InlineText` renderer ishlatildi; `==Oddiy==` ko‘rinishida xom belgi chiqmaydi.
5. `src/tests/M01SourceFidelity.test.tsx`da 12 mavzu, barcha sahifa bo‘linmalarining blok saqlanishi, 10 diagramma, 10 sarlavhali misol, bibliografik/daraja formatlarini ajratish va oddiy vizual render regressiyalari qo‘shildi.

## Qolgan release bloklovchi tekshiruvlar

1. ICT va Cambridge+ darsliklarida spetsifikatsiyaga bevosita tegishli **har bir** materialni haqiqiy sahifa dalili bilan bog‘lash; har bir M01 ta’rif/formula va misol uchun manba-reyestrni yakunlash.
2. Ishlatilgan har bir formula, tarixiy ma’lumot, media hajmi, bitrate, kodlash va birlik konvensiyasini mustaqil tekshirish; qaysi biri darslik soddalashtirishi ekanini aniq belgilash.
3. Backenddagi M01 dars testlari uchun faqat published/kaliti to‘g‘ri/construct-mapped savollar bilan authenticated learner E2E: nazariya → test → natija → navigatsiya.
4. Desktop va mobil ekranlarda barcha 12 mavzuning katta jadvallari, sxemalari, formulalari, sarlavhalari va mundarijasini vizual tekshirish.
5. CI lint, typecheck, unit, build va E2E yakuniy commit uchun `PASS`; yangi insoniy editorial/release roziligi.

**Hulosa:** M01 spetsifikatsiyadagi yetti mahorat sohasini strukturaviy qamraydi va 10 ta haqiqiy render xatosi tuzatildi. To‘liq manba-sahifa auditi va foydalanuvchi ko‘ruvi kutilgani uchun **«Fully Completed» deb belgilanmaydi**.
