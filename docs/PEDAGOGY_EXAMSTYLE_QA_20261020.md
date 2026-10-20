# Pedagogika imtihon-uslubi chuqur QA — 2026-10-20

## Audit doirasi va manbalar

- Rasmiy tayanch: `Informatika Testlar spesifikatsiyasi.pdf`, 2026, 6–8-betlar; 5 KS, 7 umumiy pedagogika, 3 informatika metodikasi. 50-savollik imtihon uchun bilish/qo‘llash/mulohaza = 8/35/7.
- Uslub namunasi: Drive `Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf` (2024), `Pedagogik mahorat to'plam 2025.pdf`, `Pedmahorat to'plam 2025 kuzgi.pdf`, `PedKasb tushgan testlar PedMahoratGuli ...pdf` (2026), hamda foydalanuvchi yuklagan `Tushgan testlar 07.04.2026.pdf`. To‘plamlardagi «real tushgan» degan da’volar yoki manba kalitlari mustaqil rasmiy tasdiq emas. Test matnlarini nusxalash o‘rniga ushbu testlarning pedagogik **uslub va strukturasi** o‘rganiladi.
- Fakt va nazariya asoslari: productiondagi M14–M16, jami 18 ta canonical published dars; kasbiy standart, pedagogika va metodika manbalari. PDFdagi ayrim savol-javoblar (masalan, 2026 darsni rejalash misoli) bir-biriga mos bo‘lmasligi mumkin, shuning uchun xom PDF kaliti ko‘chirilmaydi.

## Production read-only SQL, ish boshidagi holat

| Blok | Published Y1 | Published Y2 | Published Y3 | REVIEW Y1 | Y1 stem < 70 belgi | Y1 stem >= 180 belgi |
|---|---:|---:|---:|---:|---:|---:|
| KS | 130 | 8 | 2 | 13 | 21 | 1 |
| PM.GEN | 223 | 3 | 7 | 17 | 43 | 1 |
| PM.MET | 73 | 0 | 4 | 2 | 19 | 0 |
| **Jami** | **426** | **11** | **13** | **32** | **83** | **2** |

426/426 Y1 uchun to‘rt xil variant, key-UUID mosligi tekshiruvdan o‘tdi. **0** uniquely-longest correct answer. Bu faqat mashina yordamidagi shartlar. Aynan `<70` savolga avtomatik «xato» hukmi chiqarilmaydi; ularni alohida kontekst va kognitiv vazifa bo‘yicha tekshirish kerak.

## Tarixiy savol korpusi
Private PDF inbox jami 649: 195 `independently_verified` (40 linked, 155 unlinked), 335 `accepted_general` kaliti tekshirilmagan, 119 karantinda. 119 ichida 39 answer-parse-bleed, 29 answer-key-unverified, 27 exact duplicate, 22 near duplicate, 2 source-key conflict. Faqat original, tekshirilgan yangi savolga aylantirish mumkin. Asl kalit/manba yozuvlariga yoki tarixiy urinishlarga tegilmasin.

## Kalibrlash qoidalari
1. Real pedagogik vaziyat va qaror dalillari; yodlash, qo‘llash va mulohaza nisbatini maqsadga mos belgilash.
2. Y1: bitta asosli to‘g‘ri javob, 4 xil plausibly-related variant, uzunlikdan, negatsiya yoki mutlaq so‘zlardan javobni taxmin qilib bo‘lmaydi.
3. Y2: bir ma’noli mosliklar va bitta-to-bitta kalit; Y3: mantiqiy zarur ketma-ketlik va UUID-based order.
4. Manba va kanonik darsga aniq bog‘lash; manba qarama-qarshiligida tekshirilmagan kalitni nashr qilmaslik.
5. Yangi material avval `review` statusda, mavjud `published` immutable, oldingi attempt/keys saqlanadi.
6. E2E: 15 practice va 50 mock, variantlarni aralashtirish, topic preflight, mavzuga mos kalit, natija UX.


## 2026-10-20 — live production review-bank staging evidence (2 controlled batches)

- `20261020083000_pedagogy_examstyle_review_12.sql`: 6 Y1, 3 Y2, 3 Y3. GitHub source persisted; full transaction rehearsal with `ROLLBACK` **PASS**, then production Supabase migration **success**.
- `20261020084000_pedagogy_examstyle_review_7.sql`: 7 Y1; same full `ROLLBACK` rehearsal **PASS**, then production Supabase migration **success**.
- The new 19 originals now cover **18/18 official pedagogy constructs**, all **19 REVIEW** with real `source_lesson_id`, 19 question keys, 0 duplicate options or invalid format counts, Y2 four unique bijective pairs, Y3 four keyed UUID sequence positions. The read-only regression `supabase/tests/pedagogy_examstyle_review_20261020.test.sql` passed against production.
- Production published counts **remain unchanged at 450**: 140 KS, 233 PM.GEN, 77 PM.MET. Total professional REVIEW is now 51 (previously 32); no prior published question or historical exam attempt overwritten.
- Owner's instruction authorized content work; **19 REVIEW does not mean learner-visible**. Must not claim semantic independent signoff or production question publication. Original/source-based authored items not historical exam transcripts.

## 2026-10-20 — verified quality triage observations

- Existing 426 Y1 have no missing source reference or explanation shorter than 25 characters. Mechanical 4-distinct-choice/key-UUID issues: 0.
- All published 11 Y2 and 13 Y3 pass four-pair/four-step shape checks (but semantic uniqueness requires case-by-case review). One repeated **generic stem** was found among two published KS Y2: `Baholash va qayta aloqa tushunchalarini mos vazifa bilan juftlang.` These are not necessarily exact content duplicates; inspect side options and answer mapping separately before deciding.
- Risky **semantic distractor cues** found in published items with source references `reserve-2026:T060-R6-PMMET-B09` (one-word correct `Vosita`, other alternatives with `har doim`/`faqat`), `reserve-2026:T060-R6-PMMET-B10` (too many obviously irrelevant choices), `reserve-2026:T060-R5-PMGEN-B13` (short/absolute distractors). These are *review candidates*, not silently marked incorrect. Improve through immutable review revisions, source-check correctness, and preserve learner attempt history.
- The published bank remains mostly short: 83 Y1 stems under 70 characters, 2 at least 180; realistic scenario sampling and construct discrimination are the main follow-up editorial concerns. This is not proof every short question is poor.
- 119 previously rejected/quarantined private historic PDF candidates remain unchanged and hidden from students.

## Release boundary

This PR may be merged **after CI** to retain migration and audit provenance, but 19 items were deliberately staged REVIEW, not auto-published. The larger 450-item semantic distractor-by-distractor review and candidate authoring to correct shallow active questions **remain in progress**. `review` -> `published` needs legitimate source/key/editorial checks and production learner E2E.
