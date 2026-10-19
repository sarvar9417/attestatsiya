# TASK-264 — M09 bo‘yicha 25 ta manbaga bog‘langan yangi savol loyihasi

**Holat: REDAKSION NAVBAT. Bu 25 ta savol productionda mavjud yoki nashr qilingan degani emas.**

## Manba va darslar

Asosiy manba: *Informatika va axborot texnologiyalari*, 11-sinf (2021), Sarvar Drive ID `1CFmUVZnq7S7YmZxHGaI1q58ogdD-2fEi`. Tegishli bo‘limlar bevosita o‘qildi: ma’lumotlar bazasi/MBBT (bosma 4–12-betlar), Access jadval va ma’lumot turlari (15–29), jadvallarni bog‘lash (30–35), Query Design va oddiy so‘rov (44–50), Like/Not Like/Between mezonlari (51–52).

| Published kanonik dars | Avvalgi usable/20 | Bo‘sh o‘rin | Yangi Y1 REVIEW loyihalari |
|---|---:|---:|---:|
| M09.01 | 3 | 17 | 5 |
| M09.02 | 5 | 15 | 5 |
| M09.03 | 6 | 14 | 5 |
| M09.04 | 7 | 13 | 5 |
| M09.05 | 4 | 16 | 5 |
| **Jami** | **25** | **75** | **25** |

JSON: `docs/audits/TASK264_M09_25_REVIEW_Y1_CANDIDATES.json`. Har bir loyiha yangi ID, original savol matni, to‘rtta variant, lesson UUID, asosiy konstrukt guruhi, mavzu maqsadi va manbaning bosma betlarini o‘z ichiga oladi. Public Gitga javob kalitlari, muallif tasdiqlari yoki `published` flaglari kiritilmadi.

## Muhim xavfsizlik va sifat chegaralari

1. **75 bo‘sh o‘rin hali yopilmadi.** 25 ta yangi draft faqat tahririy tekshiruv navbatini shakllantiradi; e’lon qilingan, kalitli, tasdiqlangan pool 25/100 holatida o‘zgarishsiz qoladi.
2. **Avvalgi 309 mapped review occurrence** 309 ta noyob ekspert tasdiqlagan test degani emas. Yangi 25 ta savol barcha review + published savollar bilan normalizatsiyalangan matn/fingerprint/semantik takror tekshiruvidan o‘tkaziladi.
3. **Konstrukt mosligi:** S4.DB oilasi qayd etilgan, lekin individual `construct_id`, murakkablik, original manba sahifasi, natija va noto‘g‘ri variantlar uchun mustaqil ekspert tasdig‘i talab qilinadi.
4. **Y2/Y3:** 25 tasi haqiqiy Y1 savol loyihasi; Y2/Y3 talabini sun’iy belgilash yoki oddiy MCQ kombinatsiyasini moslashtirish/tartiblash deb sotish taqiqlanadi.
5. **Ruxsat:** production bazaga SQL migratsiya, published revision, foydalanuvchi natijalari va Vercel deploy yo‘q. Ekspert xulosasi va himoyalangan serverda kalitlarni kiritishdan so‘nggina alohida release qarori mumkin.

## Avtomatik tekshiruv

`src/tests/TASK264M09ReviewCandidates.test.ts` quyidagilarni himoya qiladi: 25 noyob ID/matn, har bir darsga 5 tadan, manba betlari chegaralari, 4 noyob variant, qiyinchilik intervali, maxfiy kalitlar yoki noto‘g‘ri approval flaglari yo‘qligi.

**Ochiq:** har bir variantni mustaqil yechish/aniq manbaga moslash; autentifikatsiyalangan 20/20 preflight; published/review bank bo‘yicha dedup va revision; real mobil/browser E2E.
