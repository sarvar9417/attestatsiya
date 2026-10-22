# M08 — four Y3 source-aligned candidate reviews (2026-10-22)

**Scope:** AI-assisted, owner-delegated content review of four **private** candidate revisions. This is *not* an independent human expert opinion, verbatim source extraction, publication certificate, or live database release.

## Normative blueprint and textbook source evidence

The actual user-provided `Informatika Testlar spesifikatsiyasi.pdf`, PDF p. 4, explicitly includes **3 Python/JavaScript questions** in section 4 and skills for language syntax, variables, conditional branches, iteration, functions and arrays. This section justifies S4.CODE as the topic scope, **not** an unconditional Y3 format or a fixed score/difficulty for an original candidate.

The following independently inspected source pages establish the underlying syntax/skills, not the word-for-word source of the new question.

| Candidate family | Confirmed original construct/lesson | User-uploaded supporting pages (physical PDF numbering) |
| --- | --- | --- |
| `J03-023` | `S4.CODE.05`, JavaScript conditional logic | Specification p. 4; `10-11-sinf informatika (Cambridge +)(1).pdf` pp. 318 and 322 (`console.log`, `else if`, array/indexing) |
| `P03-023` | `S4.CODE.02`, Python conditional logic | Specification p. 4; `ICT 9_sinf-2020(1).pdf` pp. 80 and 84 (`if/elif/else`, `for`) |
| `J06-019` | `S4.CODE.05`, JavaScript arrays and mutation | Specification p. 4; Cambridge 10–11 pp. 318 and 322 (`console.log`, `push`, `length` and indexing) |
| `P06-023` | `S4.CODE.03`, Python lists and arrays | Specification p. 4; `ICT 10_sinf-2021(1).pdf` pp. 111, 113 and 114 (lists, `for`, `len`, `append`) |

**Editorial source alignment changes:** The former J03 candidate used `for...of`; the private V2 uses an indexed `for` loop, retaining exactly the same four outputs. The former P06 candidate used a list-comprehension shortcut; V2 uses a standard `for` loop, `if` filter and `append`. The other two candidates retain their code. Neither source book is claimed to reproduce these *particular* scripts.

## Recomputed private execution

- Four V2 candidates, 2 Python and 2 JavaScript, were independently executed using bounded local Python 3 and Node.js.
- All four programs exit successfully with no stderr, produce exactly four output lines, and all **16/16 lines** match the corresponding private order key.
- All four Y3 option sets contain four distinct visible results; each correct key is a permutation of option indexes 0–3.
- The four original production question UUID/source reference pairs were previously checked. Their source lessons are published; construct mapping is exactly `S4.CODE.05`/`S4.CODE.02`/`S4.CODE.05`/`S4.CODE.03`. Three originals have one prior historical exam reference each and one has none; zero original revision links were present as of this check.
- Private V2 file: `Attestatsiya_M08_Y3_4_moslashtirilgan_REVIEW_v2.json`; companion metadata: `Attestatsiya_M08_Y3_4_source_qa_v2.json`. **Neither private artifact is committed to GitHub.**

## Source-evidence release gate

`src/lib/content/m08Y3ReviewPreflight.ts` now requires, beyond its existing Y3 and historical-attempt safeguards, **an explicit PDF-page source map**:
- the 2026 specification's PDF page 4,
- at least one language-appropriate textbook from the user-provided corpus,
- an actual file from the inspected allowlist and a 1-based PDF page in its page count,
- a concrete supported-skill description and a mandatory qualifier `topic_and_syntax_not_verbatim_source`.

This is a **metadata eligibility gate only**. It verifies declared page numbers and corpus identity; it cannot verify page content or the semantic correctness of a future question. The actual four source pages were separately checked during this audit, and runtime correctness was tested independently.

The original private V1 JSON has no per-question `source_evidence` and is therefore **not eligible for the enhanced gate**. Use the new private V2 only.

## Production release decision

**AI source-topic and runtime review: PASS; publication: NOT EXECUTED.** The new code and answer keys have not been inserted into production. Preserve all three historical `exam_items` references and immutable source-question lineage. Publication remains contingent on an authorized guarded transaction, a final comparison of source and successor fields, editorial authority and postflight fingerprints. Avoid writing fabricated human signoffs or external 'official past paper' attributions.

**No database modifications** were made while preparing this V2 review and public QA code.

## Repository CI prerequisite addressed

A separate database CI blocker was traced to invalid migration timestamp prefixes for TASK402/TASK403; the intended applied production versions were confirmed through Supabase's migration list. These filenames were corrected without changing SQL in [PR #554](https://github.com/sarvar9417/attestatsiya/pull/554) (merge commit `de72a378e7f1308cd816c5e9ab642958fc358cd4`), which passed full CI. This M08-specific PR does not alter database schema, migration history, production question content, or answer keys.
