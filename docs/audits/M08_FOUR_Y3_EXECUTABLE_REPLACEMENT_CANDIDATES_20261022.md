# M08 — four procedural Y3 questions: executable replacement QA (2026-10-22)

**Scope:** owner-delegated AI expert editorial review; **not independent human certification**. This is a prepublication design and runtime verification report, **not** a production release. Keep question text, answers, original source UUIDs and all private review JSON outside public GitHub.

## Previously identified pedagogical ambiguity

Four published `S4.CODE` Y3 items use generic, unanchored process-ordering instructions rather than a fully specified executable scenario:

- `pyjs-2026-v2:J03-023`: generic JavaScript condition / else-if sequencing.
- `pyjs-2026-v2:P03-023`: generic Python if / else sequencing.
- `pyjs-2026-v2:J06-019`: generic JavaScript array modification sequencing.
- `pyjs-2026-v2:P06-023`: generic Python filtering and aggregation sequencing.

The old text and option orders were reviewed in the preceding M08 audit. Such abstractions can be useful in an explanation, but a graded **single ordered answer** needs an unambiguous concrete program or independently established prerequisite ordering. Here replacement with code-output ordering is preferable to declaring alternative procedural orderings universally wrong.

## Four new private review candidates

Created four new, original, small, fully executable programs. Their stems ask for **the sequence of four actual outputs**:

| Internal source code | Replacement design | Independent execution |
| --- | --- | --- |
| `J03-023` | JavaScript four distinct conditional branches on four input scores | Node.js PASS |
| `P03-023` | Python threshold-based if/elif/else for four temperature values | Python 3 PASS |
| `J06-019` | JavaScript array creation, push, item modification and length output | Node.js PASS |
| `P06-023` | Python list filtering, length and aggregation with real output values | Python 3 PASS |

**Deterministic runtime QA:**
- Four standalone programs ran without exception in a local interpreter/runtime.
- Exactly **16 output lines**, matching all 16 private answer-order entries in exact sequence.
- Each case has exactly four distinct visible options (after trimming), and the key indexes form a permutation of 0–3.
- Explanations describe the actual program state transitions and their order.
- Runtime checks are deterministic and use only our new, trusted, self-contained sample code. Do **not** execute arbitrary imported learner/source snippets as part of an administrative pipeline.

The private review package is delivered as a conversation artifact named `Attestatsiya_M08_Y3_4_ekspert_nomzod_REVIEW.json`. It is **intentionally absent from this public repository**. An additional conversation artifact `Attestatsiya_M08_Y3_4_qa_natija.json` contains runtime QA metadata without publishing private answer text.

## Live deployment status and integrity guardrails

**No production rows, answer keys, or historical attempts changed in this task.** Direct re-reading of all four target question rows was denied by the connected execution safety gate; the earlier identified content and IDs must be rechecked via an authorized owner publication workflow before applying any database writes. The private candidates' `previous_question_id` fields are merely proposed provenance links; they are **not verified production lineage** in this turn.

For a future authorized release, use the established immutable question-bank revision workflow:
1. Lock and re-read each exact original; verify `published` status, current source reference, format, options, key, lesson and construct.
2. Reconfirm that each new question's original lesson/construct is correct according to the 2026 assessment specification. A running program alone is not sufficient source verification.
3. Create a new review-version with genuinely distinct output options, checked key option UUIDs and explanation; keep private content off public Git.
4. Record AI provenance without inventing human signoff and verify publication permissions.
5. When approved, atomically publish the successor, archive the original, keep historical `exam_items` intact, and verify fingerprints and source lineage.
6. If owner-specific publication policy or safety authorization blocks a step, stop: **do not force or bypass it**.

## QA boundaries

The 16 output checks establish correctness of the **four proposed illustrative examples**, not correctness of every S4.CODE bank question. Prior M08 reports established the distinction between structural Y2/Y3 verification and independent semantic validation. This audit avoids re-publishing previously identified ambiguous source questions unchanged.
