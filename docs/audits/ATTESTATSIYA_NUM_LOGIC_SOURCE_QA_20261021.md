# Informatika expert QA — external-source number systems, logic and code (2026-10-21)

**Reviewer type:** owner-delegated AI subject-matter review. **Independent human endorsement:** none. Published history preserved. This is an audit of the sampled and enumerated populations below, not a declaration that the entire bank is mathematically flawless.

## Read-only DB results
- **S3.NUM / published Y2:** 56 matching questions / 220 key pairs. 188 mathematically recomputed without a mismatch: 128 direct radix conversions and base arithmetic; 24 unknown-radix equations; 24 integer interval tests; 12 legacy-notation conversion pairs. The remaining 32 term/definition pairs received qualitative inspection; no confirmed defect in this pass.
- **S3.NUM / published Y3:** 50 tasks. 32 numeric/expression ordering sequences independently recomputed (including uniqueness/ties), six chained long-division sequences individually verified, four unknown-radix solutions checked. The other eight are procedural sequences, inspected qualitatively.
- **S3.LOGIC / published Y2:** 93 matching questions / 370 pairs. 152 four- or eight-bit Boolean truth vectors independently reconstructed from the displayed expressions using NOT/AND/OR/XOR/implication/equivalence. No vector/key mismatch. Remaining 218 non-vector pairs are not covered by the vector oracle.
- **Source-priority discovery:** 17 S3.NUM, 17 S3.LOGIC and 21 S4.CODE published Y1 questions from Telegram/Drive sources were retrieved for focused editorial review. These counts represent *retrieved questions*, not 55 fully formally proven keys; individual arithmetic, logic and code outputs were manually inspected.
- **False-positive safeguard:** boolean expression tests and radix equation keys were reviewed independently; a temporary audit-parser false positive for Y3 radix equations was caused by matching the intermediate `2·p = ...` rather than the final `p = ...` step, not by production data. The four actual final solutions were checked and correct.

## Confirmed source ambiguity and exact fix

Three published Telegram questions assumed characters **may repeat** while omitting that condition in the learner-visible stem. The keys presume the unrestricted Cartesian product; without repetition the answer can be different, so the learner must see that assumption explicitly.

| Internal audit reference | Former question UUID | Recomputed answer | Verification |
| --- | --- | --- | --- |
| TEL-11884-PASSWORD-R | `174e8d48-5549-435a-9d19-3fc8782108aa` | 3889 | Three earlier initial letters, `3×6⁴+1` |
| TEL-6446-PASSWORD-T | `9b7cd9ab-b332-4741-a4d8-7a27d77979de` | 5185 | Four earlier initial letters, `4×6⁴+1` |
| TEL-27545-WORD-248 | `524d9d2a-afe6-4672-9c5d-059e29aeed84` | OOEO | Zero-index 247 = `3313₄`; A/E/I/O correspond to digits 0/1/2/3 |

The guarded manual SQL file `supabase/maintenance/20261021_telegram_combinatorics_repetition_3_immutable.sql` creates three **immutable replacements** and archives superseded source questions. Answer option values and cognitive classification are unchanged. Each original had zero linked `exam_items` before application. Revision lineage, quarantine reason, owner-delegated AI evidence, published content fingerprint and an audit event are preserved. Human signoff is explicitly **not** claimed.

## Production application verification
1. BEGIN + ROLLBACK dry run created three in-transaction successors and passed postflight assertions.
2. Separate read showed **zero** persisted trial questions after rollback.
3. The same guarded SQL ran with COMMIT.
4. Independent postflight confirmed exactly three successors published, three originals archived, four options per successor, correct key option contents (`3889`, `5185`, `OOEO`), valid published content fingerprints, audit events and quarantine links; historical `exam_items` count remained zero.

## Next expert review targets
Manually authored S4.CODE JavaScript/Python result-finding items and non-vector S3.LOGIC Y2 conceptual pairings require additional semantic checks; run isolated and independently testable examples before touching published answer keys.
