# 2026 Professional 15 practice: source audit and import policy

## Official assessment contract

- 2026 *Informatika va axborot texnologiyalari* attestatsiya specification, table 2.
- Exam slots 36–40: KS 5; 41–47: PM.GEN 7; 48–50: PM.MET 3.
- Full exam: 50 questions / 120 minutes. Dedicated **practice**: 15 questions / 30 minutes (product choice, not an official 15-item timer).
- 2 points per item, max 30 practice points. No invented official standalone passing score.

## Current initial bank (original authorship, not prior-exam replicas)

- 14 KS, 16 PM.GEN, 6 PM.MET questions, version 1.
- Every item has four choices, exact key, explanation, active construct and published source lesson.
- Original pedagogical scenarios were authored for practice; **none are claimed as officially administered historic questions**.
- Official/recommended reference material:
  - KS: [Maktab o‘qituvchisi kasb standarti](https://pedmasterycenter.uz/uploads/files/330e32e9-2877-409f-abfc-175ec9d309f5.pdf)
  - PM.GEN: [Umumiy pedagogika, Mavlonova va boshq., 2018](https://pedmasterycenter.uz/uploads/files/35d42f75-fff8-47ac-92d3-f0a0f9bd9d6f.pdf)
  - PM.GEN: [Pedagogik texnologiyalar va pedagogik mahorat, 2019](https://pedmasterycenter.uz/uploads/files/03ff4260-7061-49e2-a5d4-9f6ee74eebe7.pdf)
  - PM.MET: [Informatika o‘qitish metodikasi, 2023](https://pedmasterycenter.uz/uploads/files/0896d872-7672-4387-8ca0-b671b0f98b5d.pdf)
- Page-level citations remain in M14/M15/M16 lesson bodies. Published question `source_lesson_id` points to those lessons.

## Public Telegram/web historical-material candidates (NOT YET VERIFIED AS REAL EXAM QUESTIONS)

| Public listing | Claimed material | Audit status |
|---|---|---|
| https://t.me/s/Pedagogika_testlar/203 | "Bugun tushgan" pedagogik questions; PDF attachments | DISCOVERED — attachments, year, keys, licensing and exam provenance not verified |
| https://t.me/s/maktablar_uchun_hujjatlar/39048 | 2025 200-item pedagogy/KS compilation | DISCOVERED — uploader's authenticity claims are unverified |
| https://t.me/s/maktablar_uchun_hujjatlar?q=%23attestatsiya_2025 | 2024 fall and 2025 collections | DISCOVERED — claimed dates/answers need independent verification |
| https://t.me/s/pedquiz?q=%23attestatsiya | 2025 quizzes for KS/PM | DISCOVERED — currently an index, not a reviewed original question set |

These are **user-posted, unofficial** materials. A channel's "100% original" assertion is not independent evidence. Public metadata/listings do not grant redistribution rights.

## Next import gates

1. Retrieve actual accessible PDF/quiz bytes from the owner or permitted public download, recording URL, date, uploader and license.
2. Extract candidate item and answer separately; classify by KS / PM.GEN / PM.MET and active construct.
3. Compare claimed answers against the official/current reference, checking for outdated legislation, ambiguous wording and duplicate item families.
4. Import as REVIEW only via existing admin question-bank pipeline; publishing requires an independent content review and proper attribution/license.
5. Keep public Git free of private copyrighted question batches and answer key files. Never label reconstructed practice questions as authenticated prior-exam questions.

## Deployment / acceptance

The PR is not a claim of live production readiness. Activation requires the Attestatsiya Supabase project connection and verification that latest SQL migrations, 36-item seed and frontend/backend deployment are on the **same commit**. Required E2E: authenticated launch; exact 5/7/3; no pre-submit key leakage; answer/finish/review/history; insufficient pool rejection; retry and duplicate submit safety.
