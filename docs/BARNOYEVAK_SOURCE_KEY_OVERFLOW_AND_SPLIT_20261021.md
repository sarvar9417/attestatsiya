# Pedagogika PDF: source key-overflow cleanup and Q149/Q150 split (2026-10-21)

## Scope / originals

Barnoyevak Drive original `Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf`, file ID `1BL4lXlgWoaP36f1bF30d85J12EjVWZtT`. Source PDF is a nonofficial educational collection, not an official exam key. The only changed data is **private** `public.pedagogy_pdf_source_candidates` in Supabase project `plyqezulrfowyblsfpzy`. No production scored questions, question_options, question_keys or historical attempts were changed.

## Actual read-and-verified corrections

**Three overlong extracted answers**, source slots 273, 289 and 293, were visually compared against the authenticated source PDF. Previously their `raw_answer_private` was incorrectly concatenated with lengthy subsequent reference tables/chapters. They now contain the **actual source answer only**:

| Source slot | PDF starting page | Correct separated source answer | Previous answer field chars | Current chars |
|---|---:|---|---:|---:|
| 273 | 56 | `1,2,3` | 6,595 | 5 |
| 289 | 65 | `Diksiya` | 1,531 | 7 |
| 293 | 66 | `Tembr` | 2,144 | 5 |

The original PDF remains in Drive unchanged; source file ID, old field lengths and SHA-256 of each overflow were retained in private editor notes. The existing `independently_verified` key status was not expanded to new rows or altered for these three existing independently adjudicated source questions, and all three remain `needs_review` and unlinked to scored questions. Subsequent source reference paragraphs were not declared novel test questions.

**Merged source slot #149** in the original PDF page 30 contained *two* printed question stems. It previously carried the printed #150 answer `demokratik`, erroneously appearing to be the key for printed #149. Based on the original PDF:
- Original private source slot **149** now retains only printed question #149; its key changed from `independently_verified` to **`missing`**, its raw answer was cleared and the stale `canonical_rule_verified` flag removed. It still needs clarification and independent key authoring, without guessing.
- New private source slot **150** contains the complete printed question #150 and its source answer marker `demokratik`, initially staged unverified. The source stamp, original file/printed page, SHA-256 and quality notes are recorded.
- A **separate theory check** against Xoliqov, *Pedagogik mahorat*, `Demokratik uslub` section, Drive `1urZe1IJjLVco-KysxtIvg46Ej89XreuK`, confirms the conceptual answer **demokratik uslub** because the teacher bases activities on students' proposals and welcomes their independent opinions. Thus #150's `answer_key_status` is now **`independently_verified`**, but `editorial_status` remains **`needs_review`** and `linked_question_id` remains null.
- An important original-source error remains: question #150 calls this a **ta'lim shakli**, when the source doctrine categorizes it as the teacher's **pedagogical communication / class leadership style**. An independently authored revised stem was preserved as a suggestion in private `review_notes`, **not** substituted for the original source text. There are three canonical styles (avtoritar, demokratik, liberal) in this source; do not invent an invalid fourth choice merely to satisfy a four-option UI template.

The private source data count is **1,091**, up one because an actual second printed item was recovered. Review candidates are **430** (formerly 429): two original items now await separate editorial assessment rather than one corrupted source record.

## Acceptance and remaining blockers

Verified via SELECT:
- Slots #149, #150, #273, #289 and #293 have correct source status and answer field after write.
- Both source stems #149/#150 match their stored SHA-256 computed from their updated source text (zero mismatches).
- None of the five slots is linked to a public scored `question_id`.
- There is **no reason to label** the recovered and theory-verified #150 as a finished four-option MCQ; distractor authoring and unambiguous stem still require editorial completion.
- Reproducible read-only checks in `scripts/audits/pedagogy_pdf_answer_overflow_and_split_20261021.sql`.

No manual production deployment or arbitrary mass-publishing.
