# TASK-346 QA8 — private original-PDF visual audit, quality regression and release gates

Date: 2026-10-21. **Code/docs only for main; no learner-content publication or manual production deploy.**

## Verified live private inventory

Read-only Supabase inspection of the existing `attest_ingest` review records (after Q17 correction):

| Review metric | Count |
| --- | ---: |
| PDF inventory | 320 |
| PDFs with private candidates | 32 |
| Private PDF question/exercise candidates | 577 |
| Independently derived multiple-choice proposals | 97 |
| Independently worked free-response proposals | 40 |
| Editorial source-defect blocker rows | 30 |
| Per-question visual dependency index rows | 33 |
| Prioritized source-defect-fix queue | 40 |
| Prioritized original asset-binding queue | 20 |
| Prioritized original-page visual-check queue | 378 |
| Prioritized human-editorial queue | 139 |
| Learner-ready private candidate items | **0** |

The queue is *one next action per candidate*. The count of independent release-blocker
records, visual records, and required actions must not be summed as if they were
published questions. The 577 candidates remain private and source keys remain unset.

## Private media evidence — deliberately excluded from public Git

Six source PDFs were fetched from the owner's connected Google Drive in original binary
format, and 21 source-page PNG review crops were retained as a separate private ZIP.

- Attestatsiya test №2.pdf — Drive 1TfX6fDckcXuaqvwuvonzm44elwUgmk8A
- Attestatsiya test №3.pdf — Drive 1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC
- MS Access savollar.pdf — Drive 130SJl3LEn14uvVajDGbhCody_cOuwwbN
- Sanoq sistemalari 1.pdf — Drive 1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP
- Test 20 talik.pdf — Drive 1BSYuhT9RRFpgHpDas-OjLmztqrYjuerB
- kodlash takrorlash savollari.pdf — Drive 1KCIUxnlOCiAfksahckMmUwDWcp03UOwf

Sixteen crops correspond to the earlier visual queue; four are additional coding
questions 11, 18, 25, 26, and one is separate evidence for a robot-labyrinth
with an unspecified initial cell. Each private `manifest.json` entry holds the
source PDF SHA-256, crop SHA-256, page, crop coordinates, and exact Drive file ID.

**Do not commit PDF bytes, full channel exports, private crops or unapproved answer
keys to the public repository.** These crops are not published learner assets.
Before any media binding, verify source reuse rights, crop readability, full page
question association, and review/answer originality.

## Verifier and its guarantees

`scripts/verify_private_pdf_visual_manifest.py` is a standard-library-only local
integrity and provenance validator:

- Rejects changed source PDF or PNG bytes by SHA-256.
- Rejects path traversal, symlinks, duplicate image names or identical crop locations.
- Validates PNG magic, IHDR CRC and dimensions, crop coordinates and positive page number.
- Checks exact Drive ID/URL provenance and `learner_asset_published=false`.
- Has no API/network/DB/publication action. Passing verifies byte integrity **only**;
  it does not authorize redistribution or certify educational accuracy.

Run on an authorized workstation that has the private assets:

```bash
python3 scripts/verify_private_pdf_visual_manifest.py \
  --manifest /path/to/private/manifest.json \
  --source-dir /path/to/private/original_pdfs
python3 -m unittest discover -s scripts/tests -p 'test_telegram_informatika_*qa8.py'
```

Local verification with the actual six source PDFs and 21 review PNGs:
`{"verified_crops":21,"verified_source_pdfs":6,"publishable_assets":0}`.
**18 unit regression tests passed** (9 private manifest tests, 9 independent
source-arithmetic tests).

## Correcting a previous AI review error (important)

Earlier private QA incorrectly labeled coding question **#17** as having multiple
correct alternatives. The assumption that the unit-column sum `2` can be
rendered `02` was unwarranted: the original PDF rule concatenates sums as
ordinary decimal numerals without padding.

The original PDF **physical page 3** was visually checked. Exhaustive testing of
all 900 × 900 = 810,000 pairs of three-digit input numbers confirmed that **only
option C (171814)** can be formed. Example: inputs 897 and 997 give 17,18,14.
The stale `ambiguous_or_nonunique_answer` blocker was conditionally removed,
the false multiple-choice flag corrected, page locator verified, and C saved as
a **private independent AI proposal**, not an official source answer key or
human sign-off. `answer_key` remained NULL.

**Question #30 remains blocked**: total team sizes 44, 48 and 62 all satisfy
the written `n≤24 OR n≥28` condition, so the given options do not have a
unique correct answer.

Other source blockers remain in place when images, code tables, encoding
conventions, correct choices or a unique solution are missing.

## RLS and production gates

Two older private tables, `attest_ingest.pdf_question_candidates` and
`attest_ingest.code_format_backups`, still have RLS disabled. At inspection,
`anon`/`authenticated` did not possess SELECT; a separate DB-consumer review
and RLS-policy migration are needed. **No blind production RLS DDL in this PR.**

- No new public questions or lessons; no answer keys sent to students.
- No third-party source material has been publicly committed.
- No manual production Vercel deployment.
- Follow-up priorities: verify/bind 20 visual-dependent source items privately,
  correct 40 source-defect cases, visually check 378 original pages, and obtain
  editorial signoff for 139 candidates. No candidate is automatically publishable.
