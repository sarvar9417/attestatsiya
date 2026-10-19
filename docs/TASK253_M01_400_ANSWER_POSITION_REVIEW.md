# TASK-253 — 400 savoldagi javob joylashuvi namunasi va xavfsiz qayta tartiblash

Sana: 2026-10-19. **Status: REVIEW-ONLY; source/published bank unchanged.**

## Qayta sanab isbotlangan xavf

Manba: `Axborot_va_axborot_jarayonlari_LaTeX/Axborot_va_raqamli_savodxonlik_400_TEST.json`.

Barcha **400/400** itemning `answer_index` (0=A, 1=B, 2=C, 3=D) qiymati

```
(chapter + number - 2) % 4
```

formulaga teng. Savol to‘plamidagi 400 javob A/B/C/D bo‘yicha aynan 100 tadan bo‘lingani **haqiqiy tasodifiylik** emas. Bob va savolning ketma-ket raqami ma'lum bo‘lsa, to‘g‘ri javobning joyi matnni bilmasdan topiladi. Bu **mualliflik manbasi** uchun yuqori xavfli sifat kamchiligi.

## Tizim chegarasi

- `src/data/topics/m01.ts` savollarni `correctIndex` bilan statik kodga joylagan; indekslar source bilan bir xil.
- `TopicView.tsx`da nazariya sahifasidan mavzu testiga tugma hozir `/exam/mavzu/...` manziliga yuboradi; shu eski komponent ichida `setPhase('test')` chaqiruvi topilmadi.
- Shu sabab **server-authoritative imtihon banki ham aynan shu indekslarni ishlatadi** yoki **joriy imtihonda javob oldindan topiladi** deb tasdiqlash mumkin emas. Bu boshqa tekshiruv bo‘lishi kerak.
- 570 ta private AXB prod-import banki **400 ta public source bankiga teng emas**. Ular orasida savol tekst/fingerprint/revision/variant tartibi haqiqiy ma’lumotlar bo‘yicha ajratilmaguncha avtomatik migratsiya yo‘q.

## Xavfsiz candidate-only vosita

`scripts/stage-m01-answer-options.mjs` **faqat o‘qiydi**; joriy source JSON, `m01.ts`, migration va production bazani yozmaydi.

```sh
node scripts/stage-m01-answer-options.mjs
node scripts/stage-m01-answer-options.mjs --emit-review > /tmp/m01-review.json
```

Ikkinchi buyruq **inson ko‘rishi uchun nusxa**ni stdout’ga beradi; script faylni o‘zi yozmaydi. Har bir savolning 4 variantidagi indekslar Fisher–Yates orqali reproducible bo‘ladi; `answer_index` va `answer` birgalikda qayta hisoblanadi. Savol matni, to‘g‘ri javobning **matni**, noto‘g‘ri variantlarning to‘plami, explanation, manba, konsept, ID va bob o‘zgarmasligi `src/tests/M01AnswerOptionReviewCandidate.test.ts` bilan tekshiriladi.

Mahalliy algoritmik sanash: eski pattern **400**, yangi nomzodda pattern bilan tasodifiy mos tushadiganlar **111**, javob joyi o‘zgarganlar **289**, yangi A/B/C/D taqsimoti **113/96/87/104**. Yakuniy GitHub CI tasdig‘i talab qilinadi. Bu ochiq deterministik algoritm **kriptografik xavfsiz imtihon randomizeri emas** va server-side option-ID binding o‘rnini bosa olmaydi.

## Keyingi release gate

1. M01 static practice savollari va 570 private bank o‘rtasida item ID/fingerprint/variant order qamrovini haqiqiy manba asosida tekshirish.
2. Server-authoritative Y1, Y2, Y3 testlarida har bir attempt uchun variant tartibi, qayta yuklaganda barqarorlik, to‘g‘ri `option_id` saqlanishi, natijadan oldin kalitlar oshkor etilmasligini alohida QA’dan o‘tkazish.
3. Ekspert darslik, javob/distractor va spetsifikatsiya tekshiruvidan so‘ng **yangi revision** tayyorlash. Ochiq bankdagi to‘g‘ri javob matnini buzadigan yoki production published variantlarini joyida tahrirlaydigan o‘zgarish qilinmaydi.

**Release:** No merge to published question bank, no production migration/deploy, no automatic editorial approval.
