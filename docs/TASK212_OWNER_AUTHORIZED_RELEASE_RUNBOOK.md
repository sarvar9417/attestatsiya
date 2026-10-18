# TASK-212 — Owner-authorized pedagogy release runbook (2026-10-18)

## Authorization and integrity

Project owner explicitly said **“ekpert tekshiruvi kerka emas qo'shib chiqarvoraver”** and asked to correct the still-common longest-correct-option defect. This is **authorization to release without a separate expert**, NOT an independent expert review or source authentication. Preserve author provenance as **AI-assisted, OWNER release waiver**.

**Immutable rule:** a published question/option/key MUST NOT be overwritten in place. The old question stays as an archived snapshot referenced by historical attempts, and its answer key and explanation stay untouched. The replacement receives new UUIDs and the original correct-answer *text* and explanation are copied unchanged for these 118 revisions.

## Live read-only baseline

- 424 professional published (KS 114; PM.GEN 233; PM.MET 77), plus 26 KS review, all mapped to M14.01–07.
- Published Y1=400 (KS 104; PM.GEN 223; PM.MET 73).
- 118 legacy published Y1 have correct-answer words >1.3× the longest wrong answer; 118 matched private AI-assisted proposed wrong-option triples all pass 4-choice uniqueness and DB max/min 1.8 / correct-vs-wrong 1.25 invariants.
- More stringent **unique-longest** check reveals **179/400 published Y1** with correct uniquely longer than every wrong answer. Publishing 118 proposed revisions lowers this to **72/400** before adding 26 new M14 (none show the cue). Specifically **61 unqueued** existing Y1 and **11 still uniquely longest even after the 118 proposed edits** remain for a separate editorial correction. **Do not claim all length cues removed.**

## Two-manual-script atomic release procedure

This is a privileged maintenance workflow, never an unattended Git migration.

1. Freeze other pedagogy writes. Inspect current 26 KS review, 118 queued proposals, single active admin, 18 canonical lessons and owner permission.
2. Source-aware redraft: `supabase/maintenance/task212_m14_8_editorial_option_rewrites.sql` changes **25 Y1 option texts across 8 REVIEW questions**. One correct-answer text is corrected from “talablari” to “standartlari” to agree with the cited 13-page secondary KS PDF. No answer-option UUID changes. All expected old text is asserted and original published content is untouched.
3. `supabase/maintenance/task212_owner_waived_pedagogy_release.sql` records exact owner waiver in private RLS audit table; patches editorial/atomic publication gates in *narrow* ways to allow that owner's waiver without forging four-boolean independent human signoff. It stages 118 new versions, checks four distinct choices, correctness-pointer integrity, source/construct mapping and word-length invariants; publishes 26 reviews; atomically publishes 118 new and archives 118 old; asserts M14 7/7 ≥20 and 0 remaining >30% published Y1 cues.
4. Use a **single combined transaction** for both scripts; change the first COMMIT to a continuation, remove the second BEGIN, and retain only the final COMMIT. Before execution do a read-only-impact rehearsal by replacing the final COMMIT with ROLLBACK. The latter was executed against production on 2026-10-18 and passed.
5. After live COMMIT, execute `supabase/maintenance/task212_owner_release_verify_readonly.sql`. Expected 144 new published, 118 old archived, total professional published **450**, residual 0 at >30%-longer test; all 7 M14 20+ and pending M14 batch 0. Check fingerprint parity. A backup and ongoing result/history/security smoke remain advisable.
6. Verify exact GitHub PR head PASS CI, current main mergeability, then release the **one final main merge** authorized by owner. Vercel may auto-deploy; **do not manually trigger a second deploy**. Check Vercel deployment ID/SHA/READY, website and backend identity; fail closed on build rate-limit.

## Precise outstanding work after this tranche

**72 uniquely-longest correct-answer instances** remain (61 new additional originals + 11 previously drafted 118 still slightly longest); these are **not disproportionately** longest by >30%, but still can be guessed by a determined test-taker. They require another round of sentence-aware corrections and revisions, not automated generic padding. Also, owner waived external expert work; no source content is falsely certified. Do not use expert-signoff labels for this work.

**Security:** no learner-facing answer-key exposure, no raw draft candidates surfaced, no forced direct status transitions outside the guarded publication path. If production deploy is blocked, do not claim the new unified hub is live.
