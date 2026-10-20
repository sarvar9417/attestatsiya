# TASK-280 — Office M03 manba-uslub va 270 savol QA

Rasmiy asos: 2026 spetsifikatsiya PDF 3-bet, Office (Word, Excel, PowerPoint) 5 ta imtihon savoli; rasmiy Y1/Y2/Y3 ulushi Office bo'yicha belgilab berilmagan.

## Source evidence ledger
- 2025 kuzgi demo / yechimlari PDF 6-bet: Word jadval BEFORE/AFTER va ikki buyruq. O'quv demo, rasmiy tushgan deb tasdiqlanmagan.
- 2026 10 000 so'mlik demo PDF 11-bet: Excel D5→C6 aralash havola va natija 16; PDF 12-bet ustunli diagrammadan pie chart ulushi. Tijorat demo, rasmiy deb tasdiqlanmagan.
- 13.04.2026 tushgan savollar nomli PDF 3-bet: aralash havola; 17-bet WordArt/SmartArt tasvirli moslashtirish; 20-bet Excel xato kodlarini moslash. Uchinchi tomon to'plami — independent provenance unverified.
- 2019 Test.pdf 47–52-bet: Excel formula, nusxa, vaziyatli arifmetika; eski versiya savollarini rasmiy yangi standart deb qabul qilmaslik zarur.

## Existing 270 bank — automatic audit (NOT independent expert signoff)
- 270 individual rows in supabase/audits/20261020_m03_270_individual_qa.csv.
- 92 short (<40 chars) explanations; 24 cognitive/difficulty recalibration candidates.
- 54 Y2 bijections and 54 Y3 permutations structurally validated but semantic ambiguity still requires human checking.
- Broad, repeated chapter-level source references need per-question page and factual verification.
- 270 existing questions immutable; no mass-publish or status escalation of previous material.

## 36 original pilot
- Word 8, Excel 20, PowerPoint 8; Y1 24, Y2 6, Y3 6.
- Real screenshot patterns: table and formula copying, chart ratios, errors mapping, Word two-tool transformation, Office application workflow.
- Structured answers are stored server-side in question_keys. Review status only; published revisions untouched.
- Migration idempotent, fresh database without Office V2 review lessons will NOTICE and skip. Production with those nine source lessons will import.

## Release gates and limitations
1. Expert must sign per-question science/answer/distractors/source/screenshot; no AI-only publication.
2. Independent visual mobile+desktop check for 2025/2026 styled simulations and seven older missing assets.
3. Review revised replacement candidates for weak existing items (92 short explanations and 24 difficulty warnings) rather than silently overwriting published versions.
4. Production apply only through reviewed migration; check idempotence, options, native mapping, grading, and learner key secrecy.
5. No claim of full 270-question expert signoff is made by this report.
