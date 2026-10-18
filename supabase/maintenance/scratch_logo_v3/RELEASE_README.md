# M07 Scratch/LOGO 3.0–3.1: production release reconciliation

This directory versions the **already user-approved and published** Scratch/LOGO supplement and native Y2/Y3 question bank. The GitHub PR does **not** itself run these maintenance SQL imports on production.

## Production state verified 2026-10-18

- M07: **12 published lessons**, **313 published questions**.
- Retained preexisting bank: **205**; 3.0 adds **60 native Y1**, and 3.1 adds **24 native Y2** + **24 native Y3**.
- The 3.1 set is **48 unique questions** distributed across all 12 lessons (2 Y2 and 2 Y3 per lesson).
- Y2 keys: 4-to-4 UUID `pairs` with distinct sides; Y3 keys: ordered 4 UUIDs in `order`. Automated database shape checks validated 24/24 in each format.
- All 48 are `published`; no duplicate new records should be inserted when the replay scripts are rerun.
- Supplemental group `S4.EXT` (clones, costumes, sensors, lists/My Blocks) is not part of official section-mock quotas; Pen and LOGO remain `S4.BLOCK`.

## Replay scripts (MAINTENANCE ONLY)

1. `scratch_logo_v3_additive_review.sql`: the original six lesson + 60 Y1 inserts, produces **review** status. On production existing UUIDs are `ON CONFLICT DO NOTHING`; no publication rollback.
2. `scratch_logo_v3_1_y2_y3_review.sql`: 48 native Y2/Y3; the twelve source lessons must **already be published**. New rows are **review**. Existing UUIDs are validated by source marker and format, then skipped.
3. `scratch_logo_v3_1_readonly_audit.sql`: read-only QA. Run on production before any future rollout.

**Important:** The older 2.0 PR introduces draft 2.0 lessons on a **fresh database**. Hence a fresh deployment must first obtain an explicitly reviewed/published canonical M07 foundation. It must **not** blindly run the 3.1 replay while chapters 7–12 are still unpublished. No published questions, student answers, or attempt history should be rewritten as part of migration replay.

## Editorial and product limitations

- The source 3.0 PDF bank includes only native Y1 until the separate Y2/Y3 supplement.
- Geometry SVG/image attachments and live browser E2E for matching/ordering are separate QA requirements; database integrity tests do **not** establish visual usability.
- The full darslik-to-question line-by-line editorial audit remains pending.

## CI and merge

Merge the related PR through GitHub's required status checks; do not force-push or bypass branch protection. Historical blocker: GitHub reported `Required status check "quality" is expected` even though the `quality` workflow job passed.