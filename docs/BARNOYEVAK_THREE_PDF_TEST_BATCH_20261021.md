# Barnoyevak pedagogika — third PDF test batch and 45-item staging total

Date: 2026-10-21. Source folder `pedagogika/files`, authenticated `barnoyevak@gmail.com` Google Drive.

## Third test batch — actual database insertion

`Ped mahorat kasb standarti test 6.pdf` (Drive `1mG_yUbO3J4ejta-u7gQtydFPfjS_8SSa`) is a four-page PDF with 15 numbered test items; the source did not provide independently verified answer keys. The original PDF was fetched and start-page positions validated:

- Questions 1–4: page 1.
- Questions 5–8: page 2.
- Questions 9–11: page 3.
- Questions 12–15: page 4.

**All 15 question/option texts were saved to the private** `public.pedagogy_pdf_source_candidates` table, `source_file_name='Ped mahorat kasb standarti test 6.pdf'`, `editorial_status='needs_review'`, `answer_key_status='missing'`, `historical_exam_claim_status='not_claimed'`. Stable source question numbers, start pages and SHA-256 hashes recorded. Saved source text is not exported to the GitHub repository and is not made into publishable scored items.

### Manual editorial flags

- Q3 p1: word wrap splits source words.
- Q4 p1, Q5 p2, Q10 p3, Q11 p3: matching/table layout requires review and may not be converted safely to ordinary multiple choice without visual checking.
- **Q8 p2**: scenario describes public shaming of a child as a disciplinary practice. Flagged `pedagogical_safety_concern_public_shaming`; do not present as recommended pedagogy without substantive rewrite and expert review.
- **Q1 p1**: separate after-class support for a learner with mobility needs needs an inclusive-practice check. **Q13 p4**: potentially ambiguous choice combinations. **Q15 p4**: unfamiliar terminology requires independent verification.
- Distractor quality, topic allocation, near duplicates and answer keys remain unapproved for every item.

## Current verified staging totals

| Source PDF | New private items | Unverified keys | Manual parse flags |
|---|---:|---:|---:|
| `Pedagogika testi 3.pdf` | 15 | 15 | 2 |
| `Pedagogik kompetentlik test 1.pdf` | 15 | 15 | 4 |
| `Ped mahorat kasb standarti test 6.pdf` | 15 | 15 | 5 |
| **TOTAL** | **45** | **45** | **11** |

Supabase readback confirmed 15 unique source slots and 15 different staged SHA-256 hashes per file. **Zero published question links** for all 45; exact cross-source hash comparison returned **0** collisions. That does not rule out paraphrased or semantic duplicate questions.

Prior PDF inbox baseline 953 total / 298 `needs_review`; current result **998 total / 343 `needs_review`**. This increase is correct: these are *new unapproved source records*, not 45 finished test items.

## Required continuation

Independently verify each answer using professional standards or high-quality pedagogy sources; edit stems, improve **plausibility of distractors**, handle matching/ordering clarity, and reject misleading or harmful questions. Only verified individually approved material may be promoted to `questions`/`question_options`/`question_keys`.

The full 64-source manifest was updated for this PDF along with the previous 2 test PDFs and 3 theory PDFs. Repeatable private read-only verification: `scripts/audits/barnoyevak_pedagogika_three_test_sources_readonly.sql`.

No manual production deploy, user-test mutation, automatic publication or fabricated key.
