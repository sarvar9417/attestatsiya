# Attestatsiya — qayta tanqidiy audit (2026-10-19)

Audit doirasi: GitHub `main`, Vercel production, Supabase production (read-only), M01 19-boblik mashqlar, M14–M16 va asosiy o‘quvchi navigatsiyasi. **Bu hujjatdagi kuzatuvlar snapshot; natijalar kelgusi deploy/importdan so‘ng o‘zgarishi mumkin.**

## Tasdiqlangan dalillar

- GitHub `main` snapshot: `05739104f96c0fc72823152763ae5d46a1e15ae1` (audit boshida). Yangi pushlar davom etmoqda; branchdan merge paytida yana main parity qilish zarur.
- Vercel productiondagi oxirgi **READY** deploy auditi vaqtida `c3b60c3655093343d7530ec8bf2be901520f4ce7` edi. Main bilan SHA pariteti **yo‘q**. Vercel’ni eskirgan kodning ustidan avtomatik merge yoki deploy bilan almashtirishdan avval amaldagi release sabablarini aniqlash zarur.
- Supabase savollar: jami **6719**, published **4603**, review **1360**, archived **737**, draft **19**. Nashr qilingan savollar ichida kalitsiz **0**; `Y1` formatida to‘rt `side='a'` varianti bo‘lmagan savollar **0** (SQL cross-check).
- Darslar soni va nashr holati mavzular bo‘yicha turlicha: masalan M06 14 published/3 review, M08 19/3, M09 5/6, M13 13/0. Katalog modulga xos nashr siyosatiga qat’iy amal qilishi kerak.
- AXB 19 boblik bankida jami 570 savol, 540 published; 16-bob 3 published, 19-bob 27 published; API generatorlari production Supabase’da ishlashini avvalgi rollback-only smoke-testlar tasdiqlagan.
- **M14 status drift:** 26 ta manba asosida yozilgan `authored:ai-assisted:m14-closed-20261018:%` savol hozir `published` (avval review edi). Audit muallif/imzo tasdiqlarini hali tasdiqlamadi; publication ma’lumoti mustaqil inson ekspertizasi dalili emas.

## Topilgan UI xato va tuzatish

`src/pages/ModulePage.tsx` katalog API’dan yuklanayotganida so‘ralgan bo‘lim statik holatda bo‘lmasa darhol **“Bo‘lim topilmadi”** degan 404 ko‘rsatardi. Holbuki ma’lumot hali yuklanmoqda. Yangi branchda haqiqiy loading status qo‘shildi va `src/tests/AxborotM01Navigation.test.tsx` regressiya testi bilan himoyalandi. Faqat yuklash tugaganidan keyingina not-found chiqariladi.

## Ochiq risk va keyingi gates

1. **P0 Deployment parity:** main SHA va production READY SHA farqi. Vercel deploy qachon va nima sababdan kechikayotganini o‘rganish; tasdiqsiz production deploy qilinmaydi.
2. **P0 Answer-key oracle:** umumiy darsning tezkor javob API’si `correct_option_id` qaytaradi; professional KS/PM bloklari himoyalangan, lekin boshqa fanlarda practice-only va rasmiy 50-test banki kesishishi xavfi mavjud. Rasmiy mock candidate-set va public learning endpoint cross-match qilinmasdan “to‘liq yopiq” deb aytib bo‘lmaydi. Buning uchun mustaqil xususiy bank / holdout siyosati kerak.
3. **P1 M14 nashr izlari:** 26 AI-assisted item uchun haqiqiy tahririy tasdiq yozuvlari, source-page verifikatsiyasi va test tarixi tekshiruvi kerak. Avtomatik revoke yoki re-publish qilishga ruxsat yo‘q.
4. **P1 18/18 pedagogy and overall 15/50 E2E:** CI yagona haqiqiy foydalanuvchi hisobida browser-to-database full-flow o‘rnini bosmaydi.
5. **P1 Katalog pariteti:** M06/M08/M09 turli dars statuslari frontendga `published`dan boshqa holatda tasodifan chiqmasligi tekshirilsin.

## Release siyosati

Bu PR **faqat QA hardening va dokumentatsiya**. Main merge, Vercel production deploy, Supabase production write yoki nashr holatini o‘zgartirish alohida aniq tasdiqsiz amalga oshirilmaydi.
