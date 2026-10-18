## 2026-10-18 — Technical readiness and migration evidence (pre-merge checkpoint)

- **CI:** commit `9361a4770b90ed449f3ded3a0c5ce45124fad4a6`, GitHub run `39098671181`: database/backend/quality including Playwright **PASS**.
- **Production Supabase migrations:** TASK-202 safe revision/editorial/admin Y1 gates, 12 batches of private distractor proposals, two source-conflict correction reviews, M15 theory deepening and eight-module topic candidate bank plus acceptance gate successfully applied as **one coordinated database release preparation**. No published answer/key changed.
- **Postmigration invariants:** 175 existing published KS/PM questions (all immutable); 249 review KS/PM questions (including 94 new M15 lesson-specific and 2 source-key corrections); 118 private revision queue entries and 118 private proposed answer sets, all 118 pass machine-checkable word-length constraints. Zero human signoffs invented. Both historical conflicting source keys remain rejected and unlinked.
- **Security:** anon/authenticated cannot select private PDF source candidates, private proposal drafts or editorial checks; published revisions remain locked.
- **Scope distinction:** technical learner/admin release can ship with these drafts safely quarantined. These 249 review items are **not learner-published**; full semantic validation, actual expert signoff, and publication remain distinct later content operations. This is not a claim of 249 independently reviewed correct answers.
- **Merge/deploy gate:** exactly one GitHub PR #121 merge and one triggered production rollout; verify deployed SHA, frontend/backend endpoints, and no additional merges/deploys without new user authorization. The Vercel preview status may be blocked by build-rate-limit; never claim production live without READY verification.

# TASK-202 — One final pedagogika release: evidence and hold conditions

**Status: RELEASE CANDIDATE (DRAFT). No merge or production deployment until all agreed editorial and technical gates are complete.**

## User's release contract, 2026-10-18

The user explicitly requests **only ONE final GitHub merge and ONE production Vercel deployment**, after completing the pedagogika work. There must be **NO subsequent merges or deployments until the user explicitly requests them**. All development/test commits stay on `task/TASK-202-pedagogy-single-final-release`; PR #121 remains draft while blockers are open. Production migrations must be applied only in the coordinated final release window; inspect GitHub->Vercel auto-deploy to avoid accidental extra deployments.

## Verified baseline

- Published pedagogika + kasb standarti + metodika: **175**, review **153**, total **328**, all Y1/Y2/Y3.
- Published Y1: **169**; **118** have correct answer >30% longer than every wrong option (automated word count; pedagogic expert must verify semantics).
- Historical private PDF candidates: **649**: 195 independently-verified candidate answers, 335 accepted general pedagogy materials with source answer still unverified, 119 rejected. Of 195 verified, **155** had no linked practice question at audit.
- Review checklist approvals: **0**. A source compiler's historic exam claim must never be mislabeled independently authenticated.
- 2026 official mock: 50 questions / 120 minutes, 35 specialty + 5 professional standard (KS) + 7 general pedagogy (PM.GEN) + 3 informatika teaching methods (PM.MET). Dedicated 15-item 30-minute *practice* is not itself the official exam.

## Implemented in this candidate

1. Complete server-paginated admin question editor listing with status, group, source and text search; no silent 100-item cutoff. The private PDF inbox is paginated with provenance and caution markers; source text and source-provided keys are **never** returned to learners.
2. PDF-based original-question authoring for **independently verified, construct-mapped, nonduplicate** source candidates. Four plausible options with controlled word lengths and unique texts, independent source review and explanation required. Only *review* questions are staged; **never auto-publish**.
3. Human editorial checklist available for all KS/PM and original PDF questions. Options and word count are visible to the editor; the DB enforces a 4/4 signed fingerprint + length checks before publication. **Do not substitute AI assertions for real human signoff.**
4. Existing 118 length-biased published Y1 items are inventoried in a private revision queue; admins can create a separate human-authored review revision, preserving the published source and existing attempts. Only an independently signed, balanced replacement can be published; the old revision is atomically archived. No in-place mutation.
5. Y1 admin-created questions now encode all four response choices with `side='a'`, fixing an incompatibility with the exam assembler. Generic Y2/Y3 editing no longer deletes matching/ordering keys or changes format.
6. Published option/key transplant attempts are blocked (immutable old+new reference checks). SQL regressions cover review-only stage, atomic swap/archival, locking, and private source prerequisites.

## 2026-10-18 assistant source review and code hardening (in branch; NOT RELEASED)

- Two confirmed PDF source-key errors were independently checked against pedagogical literature:
  - 2026 spring, p3, #14: source "sintetik" for reasoning from sought quantity backwards. **Correct: analitik usul**. Mathematics-teaching methodology: https://turan-edu.uz/media/books/2026/01/27/Jumayev_mom_20041_2.pdf
  - 2026 spring, p30, #144: original "mumkin emas" key was **2,4**, incorrectly rejecting discussion and victim support. **Correct: 1,3** (ignoring and intimidation), consistent with https://www.stopbullying.gov/prevention/on-the-spot and UNESCO guidance. Both remain source-conflict records; fresh copyright-safe rewritten Y1 questions are staged REVIEW only.
- New `save_admin_y1_question` RPC prevents partial mutation of text/options/answer key when admin save fails. Backend uses the single transactional call; SQL rollback and API tests added.
- Generic direct publication of a queued revision is now rejected: only `publish_pedagogy_revision` may atomically publish the replacement and archive its source. Null author ID cannot circumvent independent review.
- User-facing sidebar has specific "Maxsus pedagogikadan tayyorlanish" and "Testlar va mock imtihon" entries; dedicated 15-item practice and M14/M15/M16 lessons remain linked.
- Latest known quantitative QA: published Y1 = 169, correct disproportionately longest in 118; review Y1 = 135, disproportionately longest in 61. Unchanged 118 cannot just be excluded: some pedagogic constructs would lack enough balanced published alternatives.
- `PEDAGOGY_RELEASE_FREEZE.md` records strict one-final-merge / one-production-deployment and subsequent freeze.
- **HOLD:** These changes do not constitute independent semantic approval of all 153 review questions, 118 legacy revisions, 155 unlinked source candidates or 335 general pedagogy candidates. Existing published historic attempts must not be modified. No production migration, merge or deploy from this draft branch until the full scope is actually ready and test suite green.

## Release checklist / hard blockers

- [ ] All three CI jobs green **at the exact final candidate SHA** (GitHub database/backend/quality with Playwright).
- [ ] Human editor audits meaning and unique correctness of the 153 review questions; do not falsely mark them published.
- [ ] Human editor reviews and corrects the 118 length-biased published Y1 items, creating approved revision with plausible distractors. An old item is not changed in place.
- [ ] Human editor decides whether each of 155 independently verified yet unlinked candidate questions merits new original practice content, documenting source trace.
- [ ] Accepted_general (335) keys are unverified: quarantine in private general-pedagogy queue until actual independent verification; 119 rejected must not be published.
- [ ] Test 50-item official mock and dedicated 15-item practice exact quota/timing; verify no server answer leakage, option order, results/histories, no duplicate published versions.
- [ ] Validate final production migrations/version parity; backup and contingency; final **one** merge, **one** Vercel production deploy; verify built SHA and health endpoints.
- [ ] After verified rollout, freeze further merge/deploy pending **new, explicit user request**. Do not interpret a generic request for tests or analysis as deploy authorization.

**Semantic limits:** mechanical matching of word counts does not prove pedagogical correctness. Neither a PDF title nor compiler answers establish genuine historical administration. Do not claim completion if any human editorial gate remains open.
