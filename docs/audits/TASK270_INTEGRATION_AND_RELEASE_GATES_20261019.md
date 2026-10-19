# TASK-270 — Integratsiya va release oldi tekshiruv reyestri

**19.10.2026. Bu hujjat production release tasdig‘i emas.** GitHubdagi kod tuzatishlari, darslik dalillari va sinovlarni productiondagi ilmiy-uslubiy tasdiqdan alohida hisobga olamiz.

## Joriy merge natijalari

- PR #220: 12 ta published M07 Scratch/LOGO darsi uchun qat’iy katalog sharti `main`da.
- PR #221: ICT6 mavzularini modulga yo‘naltirish source-auditi `main`da.
- PR #222: M01 58 juftlik va besh muammoli savolning source-review reyestri `main`da.
- PR #235: M07 tenglik holati, M09.04–05 kanonik nazariya va eski Y2/Y3 ko‘rinishidagi statik MCQlar normalizatsiyasi `main`da.
- PR #240: M03 Word/Excel manbaga bog‘langan tuzatish va to‘rtta zero-topic test preflight regressiyasi `main`da.

## Shu branchda birlashtirilganlar

1. **Y2 legacy:** 22 published + 4 review tarixiy `side=a` yozuvlari *faqat o‘qish paytida* 4/4 formatga ko‘rsatilishi, immutable bazaga yozmasligi, kalitlarni oshkor qilmasligi uchun barcha seeded legacy published Y2 regressiyasi. 4 ta review savoli avtomatik publish qilinmaydi.
2. **Statik mashq badge:** native Y2/Y3 bo‘lmagan, ammo kognitiv darajasi Y2/Y3 bo‘lgan eski to‘rt variantli savollar Y1 interfeysida javob beriladi; ko‘rsatiladigan «Qo‘llash/Mulohaza» darajasi `cognitiveLevel` orqali saqlanadi.
3. **M09:** ICT11 (2021) bosma 4–52 betlarga bog‘langan 25 ta *Y1 draft_candidate* va ichki test; 20 ta dastlabki chalg‘ituvchi variantlar bir mavzuli ehtimoliy variantlar bilan qayta yozildi. Manba/kalit/dedup ekspert tasdiqlari haligacha ochiq.

## Qat’iy farqlar va ochiq release shartlari

| Masala | Tasdiqlangan holat | Qolgan ish |
|---|---|---|
| M09 5 dars | 25/100 published usable, 75 deficit; 309 construct-mapped review *occurrence*; 0 expert approval (TASK-261) | 25 yangi draft + mavjud reviewlarni manba/kalit/semantika bo‘yicha mustaqil tekshirish, keyin xavfsiz nashr |
| M11.01 HTML | 7/20 published; 13 source-cited draft, 8 review Y2/Y3 (TASK-260) | Barcha distractor va key’lar, source lesson revision, brauzer kod tekshiruvi, review signoff |
| Global topic test | TASK-251 25 mavzuda 339 o‘rin deficiti | Exact production preflightni takror hisoblash, har lesson 20/20 *published+keyed* bilan yopish |
| M01 manba | 400/400 audit reyestri; 239 supported, 149 partial, 12 gap (TASK-249); 5 HIGH tahririy risk | Darslik sahifalarini va barcha kalit/distraktorlarni mustaqil tekshirish |
| Y1 «19 duplicate» | Case-insensitive false positive (TASK-254) | Harf registri semantikasini saqlash, avtomatik almashtirmaslik |
| Pedagogika | 18 mavzu uchun source-bank ishlari davomida | Har bir manba sahifasi, professor/ekspert verdict, keylar va 18/18 tasdiq |
| UX/E2E | Unit+GitHub CI mavjud | Authenticated actual mobile, keyboard, real email/SMTP, 50/120 official mock, learner resume va natijalar |
| Release | `vercel.json`da deploymentEnabled=false | Userning alohida production ruxsati, migration/rollback reja, real tizim acceptance |

## Xavfsizlik chegarasi

Bu branch **hech qanday** `question_keys`, published revision, `exams`, `attempts` yoki production DBni yozmaydi. Review savol loyihalari avtomatik testbank emas. Manual prod deploy yo‘q. CI muvaffaqiyati mutaxassis tasdig‘ining o‘rnini bosmaydi. PR merge ham production deployga teng emas.
