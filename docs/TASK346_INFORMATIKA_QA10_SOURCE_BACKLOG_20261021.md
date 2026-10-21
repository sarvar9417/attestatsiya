# TASK-346 QA10 — Informatika PDF pages and missing Access candidates

**2026-10-21. Review-only; no deploy or learner release.**

## Grounded sources

- [kodlash takrorlash savollari.pdf](https://drive.google.com/file/d/1KCIUxnlOCiAfksahckMmUwDWcp03UOwf/view), 7 original physical pages: source question nos. 1–7/p1, 8–14/p2, 15–18/p3, 19–24/p4, 25/p5, 26–27/p6, 28–32/p7.
- [MS Access savollar.pdf](https://drive.google.com/file/d/130SJl3LEn14uvVajDGbhCody_cOuwwbN/view), 9 original physical pages, including embedded tables and screenshots. Original pages 2 and 5–9 were inspected this pass; earlier QA9 inspected the rest.

Original binary PDF/image material remains private.

## Completed on private Supabase staging

1. Verified physical page locations and source-visual status for **25** formerly unchecked kodlash candidates. All **32/32** now have exact page numbers and visual-review flags. Existing issue blockers and absent original author keys are unchanged.
2. Added **5 missing** MS Access questions (external original sequence 15,16,17,18,20) as expert-paraphrased, unkeyed candidates; matching source index pages 6,6,7,8,9. External #20 is embedded exam question **#24** in the original page-9 screenshot; kept both identifiers separately.
3. Re-expressed the relevant visual data as safe, independently reworded text for Access questions 16 (food name/weight filter), 18 (one-to-one choices) and 20 (course/age table). Each is marked source_text_only, not content_publish_ready. Access #15 and #17 still need source images for complete comprehension.
4. Added **6 independent proposal answers**, never official source keys: Access #4: 3 rows; #5: 1 row (both conditional on SQL dialect adaptation); #15: salary difference 1,600,000; #16: 1 row (Apple); #18: B employee/passport; #20: B, student ID 3.
5. Source questions #4 and #5 use SQL LIMIT 3 in a Microsoft Access exercise. Access SQL does not accept LIMIT in this form (TOP 3 is used instead). Preserved independent conditional calculations but marked both original sources invalid_source_formula and blocked learner release. No silent source repair.
6. Verified original source page for Access #12 Boolean Yes/No question without altering the unapproved proposal.

## QA test

See scripts/tests/test_telegram_informatika_source_qa10.py. Ten pure standard-library unit tests passed locally: 32 source physical page locators, source defect preservation, conditional Access query math, LIMIT versus TOP syntax distinction, oldest/youngest salary difference, foods filter, relationship answer, image-internal vs source-external number and publication isolation. The script neither runs untrusted source SQL nor writes to databases.

## Actual post-change database counts

| Private review state | Count |
| --- | ---: |
| PDF question candidates | **582** (was 577) |
| Visually checked candidates | **218** |
| MCQ solution proposals | **99** |
| Free-response solution proposals | **51** |
| Defect blocker records | **37** |
| Next action: fix source defects | **41** |
| Next action: bind source visuals | **20** |
| Next action: inspect original page | **362** |
| Next action: editorial review | **159** |
| Source answer keys in candidate bank | **0** |
| Learner-release-ready candidates | **0** |

The priority queues sum to 582. Counts of visual dependencies can increase when genuine missing PDF questions are restored; this is not a regression. AI independently proposed answers are not original author keys and do not authorize automatic publication.

## Remaining release gates

Source reuse rights and original asset-to-question pairing for 20 visual candidates; source-defect correction with provenance; the remaining 362 page checks; 159 editorial cases; official attestation specification alignment. Two older ingest-table RLS advisories remain for a separately validated, deploy-safe change.

**No original PDF screenshots in Git, no learner table writes, no original key promotion, no production migration, and no manual Vercel deploy.**
