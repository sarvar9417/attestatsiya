# TASK-346 QA15 — complete original PDF page verification and fix extracted source boundaries

**2026-10-21, private staging only. No production deploy, no public learners, no official source key assignment.**

## Verified 17 original Drive PDF references

171 additional previously unchecked candidates were reconciled with original PDF page images; this includes 175 examined candidates from 17 file IDs, four of which had already been checked in earlier waves. In total, **all 584 current candidate questions now have source_page_number and source_visually_checked=true**. This means **original page provenance has been inspected**, not that every question is mathematically correct or approved for release.

Distinct PDF source rows examined: Excelda ba'zi misollar tahlili (27), Attestatsiya 7-test (20), O'TGAN MAVZULARDAN TEST (15) and its **identical binary duplicate** (15), HTML savollar 1 (13), Html savollar2 (13), mantiq 4-dars (7), MS PowerPoint testlar (7), Access takrorlash savollari (6), IP_manzil_attestatsiya_savollar (5), Attestatsiya test 6 (4), MS Word dasturida testlar (4), JavaScript 1-fayl tahlili (14), Sanoq sistemalari 1 (21, four previously checked), 13.04.2026 Attetasiya Tushgan savollar (2), Axborot kodlash test (1) (1), Python va Algoritm mavzusi savollari tahlili2 (1).

All original PDFs were read from the user's connected Drive and checked in private page renders. For questions whose text starts on one page and whose diagrams/options continue on the next, source_page_number records the **starting physical page**, and a continuation flag is present. Original image dependencies remain unresolved until authorized media is bound.

## Two fully identical duplicate-PDF pairs

Original SHA-256 hashes, computed from the actual local source PDF bytes:

- O'TGAN MAVZULARDAN TEST.pdf and O'TGAN MAVZULARDAN TEST (1).pdf: `3aaf64b98b89b7a6ea0ec7e35a91061215e06a8224ad3110388c4bffdb45a1d6`
- Axborot kodlash test.pdf and Axborot kodlash test (1).pdf: `a58aa2ce8911f2607e765a4b187176ba0eb95de72c879ea3c7689dc002c596cd`

Both pairs are **byte-identical** in the original downloaded files, not merely similar in text. Their private candidate rows were flagged as duplicates to prevent independent scoring and double ingestion. No original data is deleted. Multiple Drive file IDs for the same bytes require a canonical-source decision before publication.

## Serious extraction repair: IP subnet exercise

Original [IP_manzil_attestatsiya_savollar.pdf](https://drive.google.com/file/d/154Zv3KzzCKyfMB9bxjuGIzPXK6l5Nu6E/view) contains one **full five-statement question on each physical page**. Earlier PDF parsing mistakenly imported statements 1–5 **from source question 1** as five independent question records. The five staged records were source-faithfully reconstructed from **actual complete original questions 1–5**, including A/B host addresses, all five statements, and whether the source asks true or false. The five independently computed answers are stored as proposed **free response explanations**, not author keys.

Three source questions are defective and explicitly blocked: source #2 uses 192.168.10.32/27, a subnet network address rather than an ordinary host; #3 uses 192.168.5.32/27 as host; #5 uses network ID 192.168.20.32/27 and broadcast 192.168.20.95/27 as purported ordinary hosts. Their theoretical mathematical subnet results are recorded with explicit caveats. Questions 1 and 4 admit unambiguous truth evaluations 1,2,3,4 (only 5 false) under normal LAN assumptions. Python standard-library ipaddress checks cover all five cases.

## JavaScript source pollution and expert solutions

Original [JavaScript 1-fayl tahlili.pdf](https://drive.google.com/file/d/1lucZUL4Z4npGWVNt3iAF6Q93YLxqGxNA/view) restarts local exercise numbering across several sections. Four source candidates had adjacent-question or reference-theory text glued to their endings (Q5, Q9, Q13, Q15); those extra fragments were separated without touching original binary PDFs. Fourteen staged exercises are individually original-page located, with explicit duplicate local-numbering flags. The document has additional numbered problems not uniquely keyed by existing (file_id,source_question_no) staging identity; do not claim all original JS exercises were imported.

Thirteen independently evaluated JavaScript output proposals were saved as unapproved Uzbek free-response solutions. Source question #1 references `a` in an if/else snippet without defining it; it was blocked because the standalone result is not a determinable number (and would normally raise ReferenceError).

## SQL/HTML/Excel and source rights

Further image-heavy Excel/PowerPoint/HTML/logic source candidates were physically inspected for page-location integrity. That inspection must NOT be interpreted as a release-ready visual asset or a completed independent computation. Source diagram files and private crops are **not published to public Storage** or committed to this repository.

The regression file `scripts/tests/test_telegram_informatika_source_qa15.py` validates exact page maps, full PDF duplicate evidence, cross-page positions, and IP source network-vs-host validity. Standard library only, no DB/network action.

## Verified private Supabase state after this batch

| Metric | Count |
| --- | ---: |
| Original PDF candidate records | **584** |
| Source-page inspected | **584** |
| Independent MCQ proposals | **176** |
| Independent free-response proposals | **107** |
| Source defect blocker records | **63** |
| Priority queue: source defects | **67** |
| Priority queue: original diagrams | **20** |
| Priority queue: independent solutions | **160** |
| Priority queue: editorial approval | **337** |
| Priority queue: source physical pages remaining | **0** |
| Original source keys assigned | **0** |
| Learner-ready source candidates | **0** |

Priority buckets partition 584 candidates: 67+20+160+337. Still-required source corrections, original media permissions, independent solution calculations, and editorial checks remain separate. No production migration, manual Vercel deployment, or learner-content release occurred.
