# A2 Darslar — Sifatni Oshirish Roadmap

> Manba: 2026-07-25 A2 professional audit. Holat: ⬜ · 🔄 · ✅
> Har o'zgarishdan keyin: `tsc --noEmit` toza + `lessonsQuality`/`dataValidation` testlari yashil.

## Audit topilmalari (qisqacha)
- Speaking **0/24**, Reading **9/24**, Writing modelAnswer **0/20**, Listening dictation **0/23**.
- `comparatives-superlatives` — 0 ko'nikma, 4 test, section over-claim (76≠47).
- Section-count nomutanosibligi 16 darsda. Formula boyligi 44%.
- CEFR shubha: passive/reported/first-conditional/gerunds → odatda B1.
- Lingvistik yadro kuchli (saqlanadi).

---

## FAZA 1 — 🔴 Kritik (yalang'och dars + produktiv ko'nikma poydevori)

- [x] **A2-1** `comparatives-superlatives` to'liq darsga aylantirildi ✅ (tsc 0, 38 test yashil):
  - [x] `listening` (transcript + 5 savol + vocab)
  - [x] `reading` ("Two Cities" passaj + 5 savol)
  - [x] `writing` (prompt + tips + **modelAnswer** + keyPhrases + structure)
  - [x] `speaking` (prompt + tips + sampleAnswer)
  - [x] testlar 4 → **15** (2 yangi testSection)
  - [x] `exerciseSections` haqiqiy ID'larga moslandi (76→47, over-claim tuzatildi)
  - [x] formulalar boyitildi (4/4 rich) + 'as...as' formula qo'shildi
  - [x] LESSON_INDEX regeneratsiya qilindi

- [x] **A2-2** Speaking bo'limi — **10 darsga qo'shildi** (`sampleAnswer` bilan) ✅:
      modal-verbs, articles, prepositions, questions, countable-uncountable,
      comparatives, past-continuous, present-perfect, first-conditional, a2-review-2.
      → Speaking 0/24 → **10/24**. tsc 0, 38 test.

## FAZA 2 — 🟠 Muhim (receptive + self-assessment)

- [x] **A2-3** Reading — **11 darsga qo'shildi** (passaj + vocab + 5 MC savol, 105 noyob savol ID) ✅:
      questions, adjective-adverb, gerunds-infinitives, time-prepositions, possessives,
      some-any-no-every, present-continuous-future, quantifiers, too-enough, so-such, a2-review-2.
      → Reading 9/24 → **21/24** (qolgan 3 = zamon darslari, listening-fokus). tsc 0, 38 test.
- [x] **A2-4** Writing `modelAnswer` — **21 ta bo'limga** namuna-javob qo'shildi (+ keyPhrases/structure comparatives'da) ✅.
      → modelAnswer 0/20 → **21/21**. tsc 0, 45 test.
- [~] **A2-5** Section-ID data migratsiyasi — DEFER: `resolveSectionItems` runtime fallback (avvalgi sessiya) yetimlarни tiklaydi, funksional jihatdan hal qilingan; qolgan mismatch faqat kosmetik data debt. Past ROI.
- [~] **A2-6** Test sonini muvozanatlash — DEFER: comparatives 4→15 bajarildi (A2-1). Zamon darslarida 34 test — test o'chirish destruktiv, kontent yo'qoladi. Zarur emas.

## FAZA 3 — 🟡 Yaxshilash

- [x] **A2-7** Formulalar boyitildi — 13 darsdagi 47 bare formulaga `explanation`/`whenToUse`/`example` qo'shildi. → **44%→100%** (91/91). tsc 0, 38 test.
- [x] **A2-8** CEFR joylashuv — foydalanuvchi qarori: **B1'ga ko'chirildi**. `gerunds-infinitives`, `first-conditional`, `passive-voice`, `reported-speech` → B1 registriga (level:'B1'). A2 24→20, B1 20→24. Pedagogik tartib: gerund+first-cond boshiga (ko'prik), passive+reported o'rtaga. tsc 0, 39 test, 5788 noyob ID. → A2 reading endi 17/20, writing 17/20, listening 20/20.
- [~] **A2-9** Mashq turi balansi + listening `dictation` — DEFER: katta authoring, joriy balans ishlaydi. Kelajak yaxshilash.
- [~] **A2-10** Lug'at `rule` teglarini birxillashtirish — DEFER: kosmetik, juda past qiymat.

---

## Bajarilish jurnali
| Sana | Band | Izoh |
|---|---|---|
| 2026-07-25 | — | Roadmap yaratildi |
| 2026-07-25 | A2-1 | comparatives to'liq dars (RWLS+15test+sections+formulas), tsc0/38test |
| 2026-07-25 | A2-2 | 10 core darsga Speaking (sampleAnswer), tsc0/38test |
| 2026-07-26 | A2-3 | 11 darsga Reading (passaj+vocab+5Q), Reading 9→21/24, tsc0/38test |
| 2026-07-26 | A2-4 | 21 writing bo'limiga modelAnswer, 0→21, tsc0/45test |
| 2026-07-26 | A2-7 | 13 dars 47 formula boyitildi, 44→100%, tsc0/38test |
| 2026-07-26 | A2-8 | 4 dars A2→B1 ko'chirildi (CEFR), A2 24→20/B1 20→24, tsc0/39test |
| 2026-07-26 | A2-5/6/9/10 | DEFER — kosmetik/past ROI yoki destruktiv (izoh roadmapda) |
