# TASK-435 — Axborot kodlash 20 original savoldan 18 corrected Y1 release

2026-10-22 source [Axborot kodlash test.pdf](https://drive.google.com/file/d/1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5/view).
18 original sonli / kodlash misollari aniq birliklari bilan originaldan farqlangan **yangi** savol sifatida ekspertcha qayta yozilgan, o‘quvchi versiyasiga eski xatolar uzatilmagan. Q10 parol algoritmida juft/toq raqam talqini va o‘chirish qoidasi noaniq; Q15 raqam yig‘indilarini satrga birlashtirish va ikki asl son noma’lum — review-blocked.

- Production `BEGIN…ROLLBACK` sinovi PASS, keyin `COMMIT` PASS.
- `task435:pdf-editorial:20261022:%` postflight: **18/18 published**, **72 4-option**, **18/18 correct answer + explanation**, **18/18 official_mock_eligible**, **18/18 immutable fingerprint snapshots**.
- `is_generated=true`, AI-assisted source corrections, no fabricated human editorial signature.
- 695 original source candidates, including 20 from this PDF, remain separate and unkeyed. 18 original rows flagged with separate corrected successor published; no originals/old exams overwritten.
- Tests: `scripts/task435-encoding.test.mjs` verifies exact source numbers, validation gates, actual quantitative calculations.
- Notes: Source Q2 left ambiguous about bit/belgi; new Q2 **explicitly assumes 8 bit/character**. Source Q6, 11, 13, 14, 20 were rewritten using explicit MB versus MiB / sample rates for a unique key. Source original defects remain flagged; new question authoring is distinct.
