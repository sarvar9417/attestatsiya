# TASK-346 QA33 — Six Access screenshot solutions, source-bound

**Date:** 2026-10-21. Original user-connected [Access takrorlash savollari.pdf](https://drive.google.com/file/d/1sH3-BRvavsci_OfwB2Eu5Y3DIYeSpWJP/view), physical pages **5, 6, 8, 9, and 10**, independently inspected from private original page images.

Original source figures remain in private QA30 archive. Source answer keys were not supplied. No learner publication or media-rights assertion.

## Independently calculated MCQ propositions (zero-based indices)

| Original source # | PDF page | Independent source-matching option | Why |
| ---: | ---: | --- | --- |
| **7** | 5 | **C**, option index 2 | Access Grid on same Criteria line: `jami_kg >= 18` AND `mamlakati Like '*a*'`. Source rows ID1 Shaftoli/Uzbekistan (25kg), ID5 Mango/Braziliya (22kg). Original third screenshot has exactly these IDs and source-consistent weights; a competing screenshot changes Mango weight to 10, incompatible with source. |
| **8** | 6 | **D**, option index 3 | `meva_nomi Not Like '*a*o*'` AND `narxi>15000` retains Banan (22000), Kivi (28000), Mandarin (24000). Grid Show checkboxes select only ID, meva_nomi, narxi; fourth screenshot is the only displayed three-row, three-column result. |
| **13** | 9 | **B**, option index 1 | SQL price <18000 AND product_name Like `*l*e*` matches only Apple, 14000, Uzbekistan. SELECT projection has **three** columns only (product_name, price, region); the second screenshot respects this, while the others add unselected unit/total_cost columns. |

## Independent free-response propositions

- Source **Q12**, PDF p8: **4 results** — Apple, Carrot, Pineapple and Tomato. Their `total_cost` is under 1,000,000 and regions (Uzbekistan, Russia, Columbia) each contain the letter `u`. Lemon is above cost limit; Orange's China does not match.
- Source **Q14**, PDF p10: **grandfather ID34** — G‘olibov E.E. is ID53. Parents include 14 and 71; ID14 has parents 34 (male Komilov D.O.) and 78 (female Tolibova G.E.); 34 is the male grandfather shown by the original relation tables.
- Source **Q15**, PDF p10: **maternal-aunt ID2911**, strictly *conditional*: Soliyeva P.A. ID1974's mother is ID1588, whose parents are ID1616 and ID2349; daughter ID2911 has the same parents, making her the mother's sister. The original question inaccurately defines `xola` to include a father's sister (*amma*). The existing `ambiguous_or_nonunique_answer` **publication blocker must remain**. This is **not** an official answer key or silent fix to the source.

All six proposed solutions were inserted into private `attest_ingest` QA tables, with `confirmed_by_human=false`, `human_approved=false`, `publish_ready=false`; learner answer keys remain null. No original PDF screenshot was committed to Git.

**Regressions:** `scripts/tests/test_informatika_access_visual_qa33.py` contains eight independent offline source-math/figure checks (8/8 passed locally), with zero production credentials or source image copying. Prior source checks, figure binding and editorial approval remain necessary before learner release.
