# QA19 — Original Test #13 Excel pie-chart and Photoshop facts

Original source: owner-connected `Attestatsiya test 6.pdf` (inner heading Test #13), physical pages 7 and 15. Both source pages were inspected as source images, and their essential question data are now independently transcribed into private text-only candidates. Original PDF/images are not committed to GitHub.

## Page 7, source Q7: Excel

The source screenshot gives A1=2, B1=4, A2 formula `=(B1-A1)/2`, B2 formula `=2-A1/2`, C2 formula `=(C1-A1)*2-4`. Original pie chart displays 25%, 25%, 50% sectors for A2/B2/C2. Thus A2=B2=1 and C2=2, so `(C1-2)*2-4=2` implies **C1=5**, corresponding to original **option B**. All cell formulas and chart proportions are now explicitly encoded as source-derived text. Figure index changed to `source_text_only`, `content_publish_ready=false`; independent proposal B requires human editorial review.

## Page 15, source Q15: Photoshop

The original table lists four statements: F7 shows/hides the Layers panel; Shift+N alone creates a layer; clicking an eye icon controls layer visibility; Opacity adjusts layer transparency. Expert evaluation is True, False, True, True: creating a new layer commonly uses Ctrl+Shift+N, not Shift+N. Original option **A** displays this pattern. Four statements and the eye icon's meaning were transcribed into the private source stem. Figure index is `source_text_only`, `content_publish_ready=false`, unapproved option A independently proposed.

The four standard-library regression tests in `scripts/tests/test_informatika_test13_spreadsheet_photoshop_qa19.py` check all numerical/technical assertions and publication gates.

**No answer keys were promoted, no third-party source media uploaded, no learner question release, no production deploy or schema migration.** Human editorial approval is still required.
