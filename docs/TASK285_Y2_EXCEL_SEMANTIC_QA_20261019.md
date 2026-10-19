# TASK-285 — Expert semantic review: Python Y2 uniqueness and Excel circular reference

Date: **2026-10-19**. Project: Informatika Attestatsiya 2026.

## Authoritative references

- [Excel relative and absolute references](https://support.microsoft.com/en-us/excel/switch-between-relative-absolute-and-mixed-references)
- [Excel circular references](https://support.microsoft.com/en-us/excel/remove-or-allow-a-circular-reference-in-excel)
- [Python expression precedence and floor division](https://docs.python.org/3/reference/expressions.html)
- [Python nested lists](https://docs.python.org/3/tutorial/datastructures.html)
- Official specification: https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view

## Audit performed

Reviewed published S2.OFFICE application questions, S3.ALGO examples, and S4.CODE Y2 matchings for semantic reliability. Scanned the published **Y2** bank for semantically duplicate right-side numeric answers after stripping explanatory parentheticals. Exactly **two** numeric-collision questions were found among the scanned published matching bank:

| Original question | Group/cognitive | Defect | Historic exam items at audit |
|---|---|---|---:|
| `12eb6f56-f305-b7c7-e2ec-b0d68c0ac2e9` | S4.CODE / mulohaza | Two different Python expressions yield the same numerical result, with a parenthetical hint added to one right-side label. Matching depends on the hint rather than a uniquely computed result | 0 |
| `b4dcdda7-1c0b-a57b-ce0f-f296fbd17a99` | S4.CODE / mulohaza | Three expressions yield the same numerical result, differentiated only by editorial parenthetical hints | 0 |

A separate published Excel question `9fedf9a4-6ac2-44c7-b318-6fb2f8af6a57` (S2.OFFICE / qollash, historic exam items **0**) stated that employee salaries occupy B3:B6 **and** that a formula including B3 was entered **in B3**, a direct circular reference. Its keyed tax formula is conceptually right when **entered in the result column C3**, but the original problem statement describes an invalid workflow. The source is a Drive-imported test. Preserve the original record for provenance.

### Correction strategy: no silent answer-key changes

Three **new**, source-referenced, lesson-linked `review` candidates were created in live Supabase with prefix:

`expert-audit:20261019:precision-review:<original-question-UUID>|<official-reference-URL>`

1. Excel: formula is explicitly placed in **C3**, copied down to C6, with employee salaries in B3:B6 and tax rate in B1. Absolute/relative cell references have one correct option.
2. Python Y2 arithmetic: four pairwise-distinct independently calculated results. Recomputed in Python runtime; all different.
3. Python Y2 nested-list indexing: four pairwise-distinct independently calculated results. Recomputed in Python runtime; all different.

Production read-back: **3/3 review**, 1 Y1 with 4 unique options and a keyed answer, 2 Y2 with 4 unique left labels and 4 unique right labels with four UUID-anchored keyed pairs. **3/3 valid lesson/construct mappings.**

Previously staged expert revisions: 21; total new expert review candidates: **24**. None of these 24 were automatically published, and no historic exam or published question was changed during this task.

## Conditional release only

- Review/approve each replacement separately, with editorial signoff and original source verification.
- Then the optional **manual-only** `supabase/maintenance/task285_archive_semantically_ambiguous_items_AFTER_APPROVAL.sql` may archive exactly the three affected originals.
- The script must fail closed if a replacement is not published, a source exam has already used an original, a replacement mapping/answer structure is wrong, or the active blueprint's bank becomes too small.
- **Never automatically run this maintenance file in CI or production on merge.**
- Production official mock RPC remains on v2 until a separate controlled DB release. No frontend deploy is requested.

## Follow-up research

- S4.CODE Y2 questions with abstract term→definition matching inside `mulohaza` require construct/cognitive depth review; don't blanket-retag by keyword.
- Other formula wordings may contain references to the cell holding the formula; find those before users encounter them.
- Continue pedagogika and methodology semantic validation independently against professional standards and source textbooks.

**Key confidentiality:** Full items, correct-option IDs and precise replacement answer pairs are kept in restricted Supabase tables only, NOT in this GitHub record.
