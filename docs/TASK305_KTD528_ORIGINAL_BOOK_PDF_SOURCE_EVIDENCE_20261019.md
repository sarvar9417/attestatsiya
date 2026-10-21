# TASK-305 — KTD 528 review: original PDF-source evidence reconciliation

**Date:** 2026-10-19. Source of truth: live Supabase `plyqezulrfowyblsfpzy`, user-owned source PDFs in the connected Google Drive **Attestatsiya** folder.

## Executive result

**DO NOT characterize 406 records as 406 incorrect textbook pages.** The earlier apparent conflict was the conflation of **two independent page-number systems** in the same `question_keys.explanation_md`:

- `Manba: CAM9, PDF 147–149`: an attributed page range in a specific textbook.
- `PDF sahifa 98`: an additional page index **without a named PDF**.

Among **528** review-only KTD questions, **499** have a parser-readable named textbook range, **490** an unscoped numeric page, **476** both; **406** of the 476 secondary numbers fall numerically outside their accompanying book ranges. When KTD IDs are sorted, the secondary page indices run **3 to 121**, with **zero decreases** in 490 page references. They may be pages of a separate compiled question booklet; its original PDF and page convention are still unidentified. There is no evidence they must equal the named textbook range.

**Actual production correction, guarded and read back:** For exactly **490** review-only `ktd-540-2026:%` questions, replaced the bare `PDF sahifa N` part of the **explanation only** with `Qo‘shimcha sahifa raqami (qaysi PDFga tegishli ekani aniqlanmagan; darslik sahifasi deb tasdiqlanmagan): N`. Retained the old integer, named textbook reference, original range, stem, key, construct, cognitive, status and option UUIDs. A single atomic guarded SQL block asserted 490 scope and no historical exam use/signed reviewer evidence. Post-write readback: **490 explicitly unscoped, 0 old bare `PDF sahifa` markers, 528/528 still in review, 0 signed KTD reviews, 0 historical exam uses.** No frontend deploy or live mock RPC change.

## Fifteen actual named original PDFs obtained and locally examined

The following are original Drive PDFs, not internet guesses. `PDF pages` are **physical page indices (1-based)**, not the printed textbook's page label.

| Source code | Original textbook PDF | Google Drive original ID | Physical PDF pages |
|---|---|---|---:|
| CAM5 | 5-sinf informatika (Cambridge +) | `1jiQYB3WiZ387MhjbSwUMO1xcDcIvbB1m` | 139 |
| CAM6 | 6-sinf informatika (Cambridge +) | `1sdG2X5bgWXdKDPTCb9zY03SeaJuGxO4l` | 244 |
| CAM7 | 7-sinf informatika (Cambridge +) | `1RhIRuHi8i7i18mkrd3eQQt2lJrbnfCkS` | 147 |
| CAM8 | 8-sinf informatika (Cambridge +) | `1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng` | 153 |
| CAM9 | 9-sinf informatika (Cambridge +) | `10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm` | 316 |
| CAM10/11 | 10–11-sinf informatika (Cambridge +) | `1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ` | 360 |
| ICT5 | Informatika 5-sinf (2020) | `1KPjag_YqjgQbtd4HFEcEkQviJiwaduC9` | 113 |
| ICT6 | Informatika 6-sinf (2021) | `1e7ogcVQypNmSVdnqSZqI5ZqhWLP964vq` | 160 |
| ICT7 | Informatika 7-sinf (2021) | `1QMT7y-6nJLQ-f1-4SySBV8y8JrRpp4q-` | 160 |
| ICT8 | Informatika 8-sinf (2020) | `1LkJHiEwsCalXrIQu_YGWzDlTYkkYKcDx` | 113 |
| ICT9 | Informatika 9-sinf (2020) | `1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe` | 114 |
| ICT10 | Informatika 10-sinf (2021) | `1KNBa9-8wlk-CV8cZPUzEqYgMsvBdZb_3` | 257 |
| ICT11 | Informatika 11-sinf (2021) | `1CFmUVZnq7S7YmZxHGaI1q58ogdD-2fEi` | 340 |
| MAR | Ma'ruza (Tayyor) | `1sNP8-Ltye4BP_pxy64ggA1mQzQv5l1E-` | 96 |
| SPEC | 2026 Informatika specification | `1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ` | 10 |

Using **PyMuPDF** against all 15 original files and a tolerant parser for source aliases and single-page/compound spans, **528/528** KTD named locator records resolve to existing physical PDF pages. This is only a **page-bounds integrity check**; it does **not** establish that the answer appears on that page.

**Physical vs printed page caveat (CAM9):** For instance CAM9 PDF **147–149** covers the **Fayllar boshqaruvi** chapter (printed-page numbering offset), whereas its printed **146** is the **Tasvirlar** chapter later in physical PDF. Treating printed index and PDF physical page as interchangeable produced an earlier false-positive audit impression; this task corrects that distinction. `KTD-15-019`'s `filter` technical term, however, did not appear in the cited physical PDF pages even though the chapter is relevant; it occurs elsewhere in the original PDF. This requires a narrower actual passage citation, not an invented corrected page or a blanket wrong-key conclusion.

## Automatic lexical evidence prioritization for 528 items — NOT a publish approval

Compared stems, current keyed answer phrases and technical terms to text extracted specifically from the ORIGINAL PDF physical pages. The **private workbook** has one row per question, raw source excerpts, next pages to inspect and detailed flags. Do **not** copy answer keys or copyright-protected source PDF bytes to this public GitHub repository.

| Next action | Count | Meaning |
|---|---:|---|
| P0: SPEC is the sole named citation for a hardware/general definition | **9** | Official exam spec sets scope/quotas, not a content-specific keyed-answer textbook; requires another genuine content authority |
| P1: quoted technical term occurs elsewhere in the original PDF but not in the cited range | **38** | Investigate alternative physical pages; do not silently swap links |
| P2: quoted technical term not detected in the cited range or across book | **146** | Check paraphrase, morphology, diagram and edition before claiming missing evidence |
| P3: no sufficient answer-word lexical overlap in current pages | **115** | Inspect passage/diagram; answer may be conceptually equivalent |
| P4: usable **textual lead** in cited pages | **220** | Candidate for independent passage-level human review, **NOT** already approved |
| **Total** | **528** | All remain `review`; no real reviewer signed |

**All 9 P0 items** are from `KTD-18-001..005` and `KTD-18-026..029`, citing `SPEC PDF 3` for abstract classification, reasoning or scanner/OCR definitions. This page sets testing requirements, not answer-key definitions. Do not republish until sourced to relevant primary teaching material with actual page and excerpt.

**Sample P1 research leads** from the original PDF text scan:
- `KTD-02-026/027`: CAM10/11 source cites PDF 32–36; `expansion` occurs at around physical PDF 232.
- `KTD-03-026/028`: CAM10/11 PDF 32–34; `kesh` lexical match at ~234.
- `KTD-04-011/013/014`: ICT10 original cites PDF 15–20; `kesh` seen at ~12.
- `KTD-15-019`: CAM9 cites PDF 147–149; `filter` appears elsewhere (~176, ~268).

These are **leads for opening, reading and verifying the correct passage**; same terminology can appear in an irrelevant context. Mere string appearance is not sufficient to revise a source locator.

## Private item-level audit preserved with the user (not in GitHub)

- Original private 528-question JSONL Google Doc in user Drive's **Attestatsiya** folder: https://docs.google.com/document/d/1qEBWGiPOO7Bs1inGJD8_cxbyviB5g7P0pMuDlln_nT8/edit .
- Generated artifact **`KTD_528_manba_ekspertiza_nazorati_2026-10-19.xlsx`**: 528 item rows, 15-source registry, priority assessment; remains private and is provided to the user through this chat.
- The private dataset includes unpublished answer keys and excerpts; do not upload it, the PDFs, or answer keys into public GitHub.

## Publication guard and next editorial steps

1. KTD reviewer must read and attest original page/excerpt in the exact edition. `ktd_quality.guard_ktd_publication` insists on a real independently authenticated reviewer and key/distractor rationales. Do **not** impersonate or bypass reviewer approval.
2. Triage P0 nine SPEC-only references, P1 thirty-eight off-range search leads, then P2 146 cases. Distinguish printed book page from physical PDF page and screen/rendered diagram.
3. Keep individual item changes in `review` until verified. Never perform blanket status updates or source page shifts based on regex/lexical flags.
4. Separate code/GitHub merge from live DB release. This PR contains **only read-only SQL and source-evidence audit documentation**. No migration, no frontend deploy and no historical exam modification.

See ongoing [expert QA issue #284](https://github.com/sarvar9417/attestatsiya/issues/284) and preceding [TASK-304](./TASK304_KTD_PDF_EVIDENCE_GV2_PEDAGOGY_EXPERT_QA_20261019.md).
