# QA21 — Restored 35 original Excel exercises, 29 independent solutions, six source holds

**Review 2026-10-21; private staging only. Source document:** connected owner Drive file [Excelda ba'zi misollar tahlili.pdf](https://drive.google.com/file/d/1ML08CRh4nm0rCWHM7qUEQwx_omYqwGOq/view), 9 physical PDF pages.

## Source extraction defect and guarded private repair

The original PDF contains questions numbered **1 to 35**, but the ingest extraction saved only **27** candidates: original questions **5, 10, 15, 20, 25, 29, 32, 34** had been concatenated into their preceding questions, contaminating formula interpretation. Original printed heading boundaries were confirmed from the source PDFs and 35 independent question entries restored. All 35 now use their physical page locators (p1=1–4; p2=5–9; p3=10–14; p4=15–19; p5=20–24; p6=25–28; p7=29–31; p8=32–33; p9=34–35) and source-visual-check markers. No author answer keys have been assigned.

The original ten spreadsheet pictures, **Q26–35**, were interpreted visually and their numeric cells, mixed absolute references, pie-chart proportions, and formula transfer locations transcribed as private text, with matching `telegram_informatika_pdf_visual_index` entries `source_text_only` and `content_publish_ready=false`. No original PDF figure binary was placed in GitHub.

## Unpublishable original defects: six strict blockers

| Question | Problem in original source |
| ---: | --- |
| **1** | IF returns -4 for many possible A2 values. |
| **4** | INT(A2/2) can never equal 9/2=4.5, so required output 4 impossible. |
| **5** | MIN(A2,2)+1 = 3 for every A2 >= 2; multiple answers. |
| **6** | MAX(A2,7)-2 = 5 for every A2 <= 7; multiple answers. |
| **8** | IF(NOT(A2<0),4+A2,-1) cannot yield 3. |
| **9** | IF(AND(MOD(A2,2)=0,A2<8),A2-2,8) cannot yield 6. |

Real private blockers were inserted with Uzbek source evidence; each has learner publish blocked and false human approval. Defects were **not** silently rewritten into a different question.

## Independently verified 29 private solution proposals

- Numeric A2 questions: **Q2=2, Q3=4, Q7=7, Q10=12**.
- Excel reference copying Q11–17: `=E$1+$C7*H8`; `=$B10-G$2+I9`; `=SUM(E$1:F7)+G8`; `=IF($A10>10, G$2, H10)`; `=AVERAGE(G$1:G8)+$C6`; `=MAX($A$1, F9, H$3)`; `=COUNTIF(G$1:G14, ">5")+H7`.
- Excel arithmetic Q18–25: **3, 1, 7, 1, 2, 5, 1, 6**.
- Original sheet and chart Q26–35: **3010, 8, 302, 18, 14, 180, 5, 9, 2, 5**.

All proposals in `attest_ingest.telegram_informatika_pdf_free_response_qa` have original PDF page provenance, Uzbek reasoning, `review_state='needs_editorial_review'`, `human_approved=false`, `publish_ready=false`. They **are not** official/author-verified keys.

## Repeatable regression and release gates

`scripts/tests/test_informatika_excel35_original_source_qa21.py` implements a pure Python standard-library offline source page partition verifier, finite solution/defect checks, Excel mixed-column/row absolute-reference shifts, INT/MOD/SIGN calculations, spreadsheet copy math, original pie charts and nonpublication gates. No production connections.

**Immediate private DB read-back:** 35 original candidates, 35 visual locators, 29 independent proposals, 6 active source release blockers, 10 original graphics represented in complete text, 0 original author keys. Priority queue for this source: 6 source-defect fixes and 29 human editorial approvals.

**No original PDF media in Git, no student-facing answer keys, no public questions or lessons, no database migrations and no manual production deployment.**
