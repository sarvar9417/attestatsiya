# Pedagogika P0 bajarilish jurnali — 2026-10-18

**Asos:** foydalanuvchi tasdiqlagan `PEDAGOGIKA_YAKUNIY_TANQIDIY_AUDIT_VA_TALABLAR_2026-10-18.md` (11 bo‘lim). O‘zgartirishlar faqat `work/pedagogy-p0-audit-execution-20261018`, [Draft PR #127](https://github.com/sarvar9417/attestatsiya/pull/127)da. **Merge / production deploy / production Supabase SQL yozish: YO‘Q.**

## 1. Tekshirilgan baza snapshoti (production, faqat SELECT)

- M14: 7 published canonical lessons, 65 published keyed questions / 140 target.
- M15: 8 lessons, 66 / 160; 94 ta yangi M15 test savoli allaqachon `review`da; `published` emas.
- M16: 3 lessons, 44 / 60. Jami 175 / 360, 185 to‘liq 20-lik dars sloti kam (per-lesson).
- Professional review 249; editorial checks **0**. 249 / 249 review questions `author_id=NULL`.
- Published Y1 variant uslubi: 169 dan 118 correct >30% longer than longest wrong; 507 noto‘g‘ri variantdan 249 tasi «Faqat» bilan boshlanadi.
- 649 private pedagogika candidate: 195 independently verified source keys, 335 accepted_general source marker unverified, 119 rejected, shu jumladan ikki ziddiyatli key. Verified unlinked 155.
- Auditda M14–M16ning 18 mavzusida har biri atigi bitta keng konstrukt bor; 0 critical. **Bitta konstrukt “barcha kichik bilimlar qamrovi” isboti emas.**

## 2. P0 implementatsiya

| Talab | Joriy ishchi branch | Yakuniy holat |
|---|---|---|
| P0-01: 18/18 20 published savol | Strict `generate_topic_test` o‘zgartirilmadi; review avtomatik publish qilinmadi | **BLOCKED**: haqiqiy ekspert approval, M14/M16 deficit va 18/18 login E2E kerak |
| P0-02: preflight | `topic_test_preflight(uuid)` read-only DB helper, Fastify endpoint, Zod typed client, theory va exam intro fail-closed CTA, retry; CI tests | **IMPLEMENTED IN DRAFT**; release smoke ham kerak |
| P0-03: objective qamrov | 18 kanonik dars bo‘yicha **78 ta** `review` objective + private mapping jadvali; `source_page=NULL`, `verified_at=NULL`, savol-objective bog‘lanishlari *bo‘sh* | **DRAFT**, fakt/manba-bet tekshiruvi va 1-to-many savol mapping kerak |
| P0-04: 249 review editorial | Hech qanday soxta checklist/approval yo‘q; original review saqlandi | **BLOCKED**: inson mutaxassis tomonidan fakt/key/distractor/manba tekshiruvi |
| P0-05: 118/61 til-uzunlik xatari | Serverda maxfiy `pedagogy_option_quality_flags` view uzunlik, grammatik cue va key/option contract flaglari bilan | **PARTIAL**: yangi revisionlar ekspert qo‘li bilan tayyorlanishi kerak |
| P0-06: authorship provenance | 249 review uchun `pedagogy_question_provenance`: `ai_assisted_draft`, `pdf_source_rewrite`, `pedguli_import`, `other_import_unverified` sinflari; real `authored_by` bor bo‘lsagina yoziladi | **PARTIAL**: reviewer/approver alohida sahifadan to‘ldirilishi, author != reviewer/publisher server tomonidan enforce qilinishi kerak |
| P0-07: release pariteti | Release taqiqlangan, merge/deploy yo‘q | **BLOCKED**: keyingi explicit user approval + full SHA/db parity |
| P0-08: 15/50 exact quota | Avvalgi generatorlar o‘zgartirilmadi; 5+7+3, 35+5+7+3 va 8/35/7 kontrakti mavjud | **NEEDS E2E** |
| P0-09: no key leaks | Yangi preflight faqat son/status/objective code qaytaradi; private quality view learnerga grant qilinmadi | **IMPORTANT OPEN RISK:** `POST /api/content/questions/check` hozir `correct_option_id` qaytaradi va route darajasida auth tekshiruvi yo‘q. Study bank va exam bankdan bir xil savol foydalanilsa, boshqa hisob orqali answer leak xavfi bor. Uni beparvo olib tashlash nazariya quizini buzadi; practice-only/exam holdout dizayni + mustaqil xavfsizlik sinovi talab etiladi |
| P0-10: 18/18 real accept | No production user mutation, no fabricated passing results | **BLOCKED**: staging va test user approval |

## 3. Yangi API kontrakti

`GET /api/content/lessons/:id/topic-test-preflight`

```json
{
  "ready": false,
  "required": 20,
  "available": 8,
  "duration_sec": 2400,
  "reason": "pool_insufficient",
  "coverage": [{"objective":"PM.GEN.01","required":true,"critical":false,"minimum":1,"available":8}],
  "missing_required_objectives": [],
  "critical_objective_gaps": []
}
```

Ushbu JSON **namuna**, live API javobi emas. `ready` testni rejalash uchun oldindan olingan snapshot, uni bosganda `generate_topic_test` qayta verify qiladi. Mavjud broad construct bilan ichki 78 objective qamrovi hali **tasdiqlanmagan**. Backend xato bersa ekranda aniq `tayyorligini tekshirib bo‘lmadi` chiqadi, tugma disabled bo‘ladi.

## 4. Qabul/QA

- `supabase/tests/pedagogy_preflight_objective_drafts.test.sql`: helper imtihon sessiyasi yaratmaydi, M15.01 uchun generator-like published count beradi, answer key chiqmaydi, 78 objective `review`/18 kanonik dars, zero fake signoff, learner RLS closed.
- `supabase/tests/pedagogy_private_quality_flags.test.sql`: length/cue flags, learner RLS closed, review-only seed untouched.
- `src/tests/apiIntegration.test.ts`: 20/20 vs 15/20, typed API and no false success.
- `src/tests/ExamPage.test.tsx`: unavailable/missing ID fail-closed.
- [ ] Y1/Y2/Y3 online browser, mock/15 per-grade official blueprint, 18/18 E2E, JS scroll, 320px mobile and accessibility verification.
- [ ] Source-to-objective fact check with referenced pages, editorial human approvals.
- [ ] `content/questions/check` anti-key-leak design implementation and QA.

## 5. Eslatmalar

1. `review` hech qachon `published` hisoblanmaydi. Hech qanday test sonini pasaytirish yoki `topic_pool_insufficient` himoyasini o‘chirish mumkin emas.
2. `pedagogy_lesson_objectives`dagi 78 konsepsiya auditning mazmun xaritasi asosida **editorial nomzod**; 2026 spetsifikatsiyasining har bandi satrma-satr audit qilindi degan da’vo yo‘q.
3. Har bir published question eski session savol/javob tarixini saqlash uchun faqat `revision + atomic archive` bilan yangilanadi.
4. Yangi DB obyektlari productionda yo‘q; GitHub CI fresh DBda tekshiriladi.
5. CI yashil bo‘lishi, draft PR yoki preview borligi **merge/productionga mustaqil ruxsat emas**.
