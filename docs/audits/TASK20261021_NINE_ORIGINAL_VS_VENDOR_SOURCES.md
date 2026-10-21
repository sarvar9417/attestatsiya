# 2026-10-21 — 9 source gaps: original textbook and authoritative supplemental sources

## Scope and release boundary

**This is editorial evidence, not a final publication certificate.** No production SQL writes, Vercel deploy or changed human signoff. No private answers or full question text are committed to this public repository.

The previously merged 59-row short-explanation source audit had **nine** `gap` flags in the *cited PDF pages' text layer*. This focused review separated actual source evidence from general technical correctness and verified original-source images for the relevant graphics-editor pages.

## Original textbook correction — 1 of 9

**`GV2:GV-ED-027`**: User-provided **`ICT 5_sinf-2020(1).pdf`, physical PDF page 77**, lesson on selections in Paint.NET, directly describes rectangular selection and cropping (`обрезка`). Page 78 gives follow-up clipping exercises. In the same textbook, Photoshop is not the product under discussion. Thus the old `gap` row was a *false negative*. Correct the generic software name *Paint* to *Paint.NET* in the local candidate question to remove ambiguity, without changing answer options or key.

The source claims are grounded in the actual original PDF, including visual inspection. A separate checked image view of `ICT 7_sinf-2021(1).pdf` physical pp.52–54 also confirms Photoshop `Crop Tool` on p.53; **that is a different application** from Paint.NET and should not be used to pretend the original question is about Photoshop.

The 59-row CSV and read-only source matrix were updated: **24 direct, 27 partial, 8 originally unsupported in the specified PDF ranges**, rather than 23/27/9.

## Remaining 8 — technically supported by external vendor/standards sources, NOT retroactively by cited textbooks

| Alias | Exact issue | Primary supplemental evidence |
|---|---|---|
| `GV2:GV-ED-039` | White layer-mask region reveals content | Adobe: https://helpx.adobe.com/photoshop/using/editing-layer-masks.html |
| `GV2:GV-ED-040` | Black layer-mask region hides content | Same Adobe guide |
| `GV2:GV-ED-046` | Gaussian Blur is a **filter**, not the separate Photoshop **Blur Tool** shown in the ICT7 PDF p.54 | Adobe: https://helpx.adobe.com/photoshop/desktop/effects-filters/blur-sharpen-filters/filter-effects-reference.html |
| `GV2:GV-HT-024` | `required` requires appropriate form input; `disabled` generally prevents the field from being submitted | MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required and https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled |
| `GV2:GV-RV-006` | 32bpp RGBA has four 8-bit channels and occupies **4 raw bytes per pixel** | Microsoft WIC: https://learn.microsoft.com/is-is/windows/win32/wic/-wic-codec-native-pixel-formats |
| `GV2:GV-RV-019` | Boolean *union* combines paths into one merged area | Inkscape keyboard reference: https://inkscape.org/my/doc/keys.html |
| `GV2:GV-RV-020` | *intersection* retains the overlapping area | Same official Inkscape reference |
| `GV2:GV-RV-021` | *Bring to front / Raise to Top* changes stacking/z-order | Same official Inkscape reference |

Those references verify the technical concepts; they do **not** constitute proof that the original ICT textbooks teach those exact features within the previously cited page ranges. Keep the original reference **plus clearly labeled supplemental source** in the local question metadata until authoritative school-book/specification equivalence is settled. Do not describe the external documentation as a direct textbook quotation.

The original Q/A keys of all nine match the technical definitions on this first-pass check. This does not imply their difficulty, syllabus coverage or distractor quality is sufficient for publication.

## Optional LOCAL-only remediation (not a migration)

Candidate script: `supabase/maintenance/task20261021_nine_review_source_metadata_LOCAL_ONLY.sql`.

- Requires a deliberate session flag `attest.qa.review_source_patch_20261021=LOCAL_ONLY`; fails closed otherwise.
- Requires **exactly one current `review` edition for each alias** and the existing `expert review required` gate; aborts if already patched, missing or ambiguous.
- Appends a labeled textbook/supplemental evidence locator to `source_reference` for only those nine review questions.
- For `GV-ED-027`, changes only the ambiguous `Paintdagi` prefix to `Paint.NET dasturidagi`.
- Does NOT modify private answer key, options, scores, exam attempts, `published` status, archived historical versions or editorial/human approvals.
- Script is under **maintenance**, deliberately *not* under `supabase/migrations`. It is **not automatically applied by git pull, deploy or Supabase migration push**.

Execute against a **local, seeded, backed-up database only** if you choose to test the candidate changes:

```bash
git checkout main
git pull origin main

# READ ONLY; safe for local QA:
psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f supabase/maintenance/task20261021_source9_and_duplicates_READONLY.sql

# Explicit opt-in LOCAL-only source-reference repair:
PGOPTIONS="-c attest.qa.review_source_patch_20261021=LOCAL_ONLY" \
  psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f supabase/maintenance/task20261021_nine_review_source_metadata_LOCAL_ONLY.sql
```

Use the local DATABASE URL, never the production one. If no local data is seeded, the patch **fails safely** (no nine matching review candidates). The candidate's real write path has **not** been executed on production.

## Read-only verification and duplication risk

The three SELECT queries in `task20261021_source9_and_duplicates_READONLY.sql` were executed against the live metadata as READ ONLY on 2026-10-21:

- 9 present `review` aliases + 9 separate `archived` predecessors.
- 9/9 current Y1 questions have exactly four options and a structurally valid key UUID.
- 0 supplements applied to production; **9/9 publication gates remain present**.
- Current ambiguity of the Paint.NET stem remains unpatched in production (expected).
- 29 current review questions have **same-concept repetition risk** in **ten categories**: CSS box model (7), pixel counts (5), PSD (3), bit depth (2), Lasso (2), mask use (2), mask colors (2), palette bits (2), raw bytes (2), vector Boolean operations (2). These are **not exact duplicate findings** and were **not deleted**. Mock-test assembly should avoid disproportionate repetition from the same cluster.

## Remaining actual closure gates

1. Confirm whether external vendor/standards sources may count as acceptable *supplementary bibliography* under this project's official 2026 specification; don't mislabel it as textbook evidence.
2. Visual check other partial source pages where text alone is insufficient (27 cases from the previous 59 matrix), prioritize items actually selected for official mocks.
3. In local learner staging, run authenticated end-to-end Y2/Y3 matching, ordering and scoring, including native 3x3.
4. Keep review/release workflow honest: human-signed gates cannot be silently replaced by AI-source verification.

**Production deployment: not performed. Production question or migration updates: none.**
