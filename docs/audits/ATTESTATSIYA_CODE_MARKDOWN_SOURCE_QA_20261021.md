# Attestatsiya: imported code/Excel Markdown display quality — 21 October 2026

## Audit scope and source
Owner-delegated AI expert audit of published question stems and keys. Production Supabase account linked as `sarvar9417`. The question content comes from `Drive:Attestatsiya/darsliklar/20000 LIK informatika.pdf`, PDF pages 7 (Q16) and 10 (Q23). Independent human editorial endorsement **not** claimed. The audit reads source-derived published content; any independent calculations are recorded separately below.

## Confirmed user-visible defect
The published `stem_md` stored the two-character literal backslash+n sequence as a line separator instead of actual LF (Unicode U+000A):
- JavaScript Q16: 13 literal `\n` markers and **zero** real LF characters; the entire fenced JavaScript code block could not be interpreted as intended Markdown source.
- Excel Q23: 7 literal `\n` markers and **zero** real LF characters; Markdown table row delimiters were missing.
- Audit deliberately excluded false positives caused by valid LaTeX `\neg` sequences in logic questions. Counting `\n` without context can mistake TeX operators for newlines.

## Answer verification
- JavaScript Q16: prompt value n=6. Start `s=1`; first loop i=1: s becomes 2 then 8. Iteration update sets i=2, n=5. Second iteration sets s=10 then break. Expected answer **10**; unchanged correct option.
- Excel Q23: G2=25,000×17−18,000×24=−7,000; G3=33,000×13−24,000×18=−3,000. Both cells have negative values and conditional formatting makes both **qizil / qizil**; unchanged correct option.

## Exact immutable replacement
| Source | Old UUID | Published replacement UUID | New actual LF characters |
| --- | --- | --- | ---: |
| Excel PDF p.10 Q23 | `4a65e71a-56b7-cdc4-ab89-bb668062e676` | `bcdc9879-05c7-42ea-b503-3db497fdbc3e` | 7 |
| JavaScript PDF p.7 Q16 | `075c3b96-ce83-1961-db27-59c96422e93e` | `003af5c3-57ea-44cf-838f-ae6bdce7af44` | 13 |

Manual maintenance SQL is at `supabase/maintenance/20261021_drive_literal_newline_2_immutable.sql` and **must not be auto-applied** as a migration.

The script enforces old question identity, reference origin, exact original separator count, no actual original newlines, original Y1 option count and verified correct answer, **exactly one historical `exam_items` link for each source**, no prior revision/quarantine, a complete clone plus new key UUID, revision lineage, archived original and published successor, fingerprint validity and audit trail. The answer text, options, original explanations, cognitive levels and difficulty remain semantically identical.

### Execution safety
1. Transactional dry run with its final COMMIT replaced by ROLLBACK returned two valid trial successors.
2. Independent SELECT verified zero trial successors persisted after rollback.
3. Unmodified guarded script committed successfully.
4. Independent production postflight confirmed two published replacements, two archived originals, newlines counts 7 and 13, **zero** remaining literal backslash+n sequences, correct answer texts unchanged, four options each, matching content fingerprint, one audit entry for each source, and **the existing historical exam item reference retained for each original**.
5. Owner-delegated AI review is recorded; independent human editorial signoff remains explicitly false.

## Further scope
Source-level Y2/Y3 numeric and logic semantics were previously reviewed in PR #514; separate preventative generated-question verification is in PR #510. This change fixes **the two identified Markdown display defects only**, not every past paper or code question.
