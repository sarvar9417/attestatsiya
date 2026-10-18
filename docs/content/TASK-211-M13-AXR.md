# TASK-211 — M13: Axborot xavfsizligi va raqamli platformalar

**Status:** REVIEW / NOT RELEASED. The content is staged exclusively in a migration; no live Supabase write, merge, or production deployment is part of this change.

## Content
- Theory: 7 standalone source-derived chapters adapted from the approved LaTeX book into readable Markdown; preserved in `docs/content/m13_axr_2026_lessons.json`.
- Questions: all 210 items, 30/chapter; original JSON retained in `docs/content/m13_axr_2026_questions.json`.
- Import SQL: `supabase/migrations/20261019010000_task211_m13_axr_review_content.sql`.
- QA: `supabase/tests/task211_m13_axr_review_contract.test.sql`.
- Existing canonical M13 lessons, published questions, and previous attempts are **unchanged**.

## Official construct mapping
1→S7.SEC.01 security; 2→S7.SEC.02 malware/phishing; 3→S7.SEC.03 antivirus; 4→S7.SEC.04 e-government; 5–6→S7.SEC.05 SMM/CMS/LMS/MOOC/content/audience; 7→S7.SEC.06 freelance.

## Critical format note
The supplied source marks 7 Y2 and 7 Y3 questions, but **all 14 are four-option selection-of-combination** questions, rather than native two-column/ordering interactive schema. They are deliberately staged as Y1 in DB; their **original** kind is retained within `source_reference` and source JSON. No fake interactive Y2/Y3 format is claimed.

## Before release
1. Editorial review of all source claims, keys, distractors and theoretical markdown vs PDF.
2. Run migration on disposable LOCAL database only (not paid Supabase development, not production).
3. Run DB QA, API/server-side scoring smoke checks, and UI navigation/scroll regression.
4. Prepare conversion of these review lessons to approved/published **as a new release step** after human sign-off; ensure frontend resolves published lesson UUIDs and topic test pool preflight.
5. Do not change immutable published records in-place. Obtain explicit approval for PR merge and production migration/deployment.

## Source note
LaTeX original: `Axborot_xavfsizligi_2026_nazariya.tex`; test original: `Axborot_xavfsizligi_2026_savollar.json`. Content created for didactic practice, not copied from official examination questions.