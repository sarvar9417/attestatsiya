# TASK-304 — Deep editorial QA: KTD PDF citations, graphics V2, pedagogy

**2026-10-19.** Production Supabase `plyqezulrfowyblsfpzy`.
**Change scope:** independently performed content edits on `review` records only, with immutable question IDs/answer-key UUIDs; this GitHub PR merely stores the audit and **read-only QA SQL**. No frontend deployment, no automatic publication, no user/exam edits.

## Major blocking finding: KTD hardware source-page contradictions

Inspected **all 528** `ktd-540-2026:%` questions remaining in `review`.

A SQL parser found:
- **499** questions contain a numeric source-PDF page range (e.g. `CAM9, PDF 147–149`).
- **490** contain a separate `PDF sahifa <number>` citation.
- **476** have both parseable fields.
- **406/476** have the claimed page **outside** their own cited source range (**85.3% of directly comparable entries**, **76.9% of the 528 cohort**).
- **70/476** have a number inside their cited range (not independent proof the book supports the answer).
- 52 items have at least one missing/unparseable field; source citation may be another document, but its provenance must be explicitly identified before accepting a discrepancy.

Concrete conflicting examples:

| Review question reference | Named textbook range | Separate "PDF sahifa" |
|---|---|---|
| `KTD-01-001` | CAM9 PDF 8–15 | 3 |
| `KTD-01-006` | CAM10/11 PDF 31–35 | 4 |
| `KTD-15-019` | CAM9 PDF 147–149 | 98 |

**Interpretation:** These are internal source-annotation contradictions, **not 406 proven wrong answers**. Do not invent "correct" PDF pages, copy another item's page reference, or treat `PDF sahifa` as independently verified. If the second page number belongs to a different source, identify that PDF and edition. Exact textbook pages and passages need manual verification before any content release.

Current **KTD signed review records for these 528: 0**. The existing production `ktd_quality.guard_ktd_publication()` requires a real authenticated reviewer, exact PDF page, source excerpt, correct-answer reasoning, distractor reasoning and matching immutable fingerprint. **Never bypass or forge this gate.**

## Graphics / HTML / Photoshop review cohort

Inspected all **300** `GV2:%` review questions: 280 Y1, 10 Y2, 10 Y3.
- **135/280 Y1** explanations are under 40 trimmed characters; 10/10 Y2 and 10/10 Y3 explanations are under 40 characters. This is a heuristic for editorial triage, not proof of an erroneous key.
- **9/280 Y1** include an asset. A loose search found 11 stems using "rasm"/"tasvir" language without assets: many can legitimately be answered by supplied dimensions or named operations; **do not automatically label all 11 as missing images**.
- No duplicate exact option-text within a GV2 question, no missing lesson/construct mapping in the cohort. No existing `question_editorial_checks` records for the 300 review items.
- Protected by `public.guard_graphics_web_v2_publication()`: independent answer, source, wording, authorship and up-to-date fingerprint with a real reviewer account.

### Five concrete GV2 questions improved in place, still `review`

| Question UUID | Editorial issue and applied fix | Authority |
|---|---|---|
| `0823609c-81e8-4266-a751-902ea9127e4b` | Ambiguous/weak Photoshop adjustment-layer benefit and absurd distractors: replaced with a reversible non-destructive scenario and three content-adjacent wrong choices; stronger explanation. | [Adobe nondestructive](https://helpx.adobe.com/photoshop/using/nondestructive-editing.html), [Adobe adjustment layers](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/color-adjustment-fill-layers/change-adjustment-and-fill-layer-options.html) |
| `03aef049-ff4e-4c59-bcbe-6ef9acac26a1` | Clarified HTML image `src` and accessible fallback `alt`, plus precise correct-vs-wrong attribute reasoning. | [MDN image element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img) |
| `75a0e2d1-be14-4a7d-b064-5a6b4a5ed683` | Replaced an underspecified image-dependent-sounding "only upper-left corner" prompt with an explicit rectangle/crop scenario; explanation now discriminates from grouping/hue/canvas. | [Adobe nondestructive](https://helpx.adobe.com/photoshop/using/nondestructive-editing.html) |
| `1a87cb16-94e9-4e2c-8a76-87ecaf6012e2` | Explicit raster dimensions rather than an implied unseen picture; calculate pixel decrease (96 to 24 = 75%) with complete explanation. | Arithmetic independently checked |
| `385bb797-8ea7-4ef8-a4bd-aefccc4b483f` | Clarified aspect-ratio and entire-image visibility for `object-fit: contain`; short explanation replaced; false mixed-syntax distractors made uniform. | [MDN object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit) |

## Pedagogy, KS, Informatics methodology

Previous TASK-303 audited 32 pending `KS/PM.GEN/PM.MET` questions, and fixed two stems in review. This task improved **three more** editorial items in review:

| Question UUID | Change |
|---|---|
| `4376803f-bccc-455f-a67c-168b00828fc7` | Problem-based vs interactive learning match options previously contained duplicate mappings and a multi-key distractor (`2–a,d`); made every answer pair one-to-one while retaining the keyed correct pair. |
| `890689d9-8c50-4731-bab7-1aa2b053427a` | "Predicting events" was defined through perceiving another person's state (overlap with perceptive ability); revised into evidence-based prognosis with unambiguous intrapersonal and logical descriptions. |
| `13f48dbb-63f9-4816-aa4e-23f9ccc8bffe` | Made the **scientific evidence** for `ilmiylik` and **active construction** for `onglilik/faollik` explicit, so competing pedagogy principles are less defensible. |

**Two further cognitive misclassifications corrected in review:**
- `3860cfd7-a9bc-4128-9b23-065b6211d940`, KS, direct recall of the planning labor function: `qollash` → `bilish`.
- `9898a914-9c7c-4bfd-aa8a-02c5c74c7324`, PM.GEN, direct recall of pedagogy branches: `qollash` → `bilish`.

The official 2026 certification spec differentiates **recalling concepts/definitions** from **applying concepts in a novel situation**. Changing these while still unpublished avoids incorrectly inflating quota-compatible but pedagogically mislabeled content.

### Post-write checks

Applied to 8 content-edited + 2 cognitive-only records:
- **10/10 PASS**: `review` state, exactly 4 distinct options, 1 keyed correct UUID, active lesson-to-construct mapping, nontrivial explanation, zero historical exam references, zero editorial-signature records.
- Old correct-option key UUID and per-option UUIDs preserved; only incorrect-option **text** was edited where required.
- **32/32** KS+PM review candidates stay `review` — no human reviewer impersonation.
- **1,393** total remaining review candidates, including 528 KTD and 300 GV2, until separately approved. Production mock stays v2.

## Next release decisions

1. KTD: recover and verify **the exact PDFs and page excerpts** for at least 406 contradictory citations; do not bulk replace page numbers. Independent human editorial checks are still required by production guard.
2. GV2: prioritize 155 short explanations, especially Y2/Y3, and review actual code/diagram assets case-by-case. Separate authored text revisions from approval and publication.
3. Pedagogy: source-check each of 32 remaining items, especially community files without official keys; human owner approval is not available to this agent and may not be forged.
4. No changes to users, exam history, old published keys or official_mock-v2/v3; no deploy.

See [Issue #284](https://github.com/sarvar9417/attestatsiya/issues/284) for the continuous expert-quality thread.
