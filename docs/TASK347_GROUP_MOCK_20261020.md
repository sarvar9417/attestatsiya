# TASK-347 — Guruhli Mock Test (2026-10-20)

## Owner va status
- Owner: ChatGPT, user confirmed 2026-10-20.
- Branch: `task/TASK-347-group-mock`.
- Status: **MERGED TO MAIN via PR #352 (2026-10-20), GitHub quality PASS**. Authenticated staging acceptance and production release remain pending.
- Merge commit: `72ce5b67d9e918312e5ea65f973246561ea811fc`. Production Supabase migration and explicit Vercel deploy were **not** performed as part of the merge.

## Requirement
User can create a code-joined shared room; everyone sees the same current question.
After everyone submits, all members see correct answer, detailed explanation and a
per-person breakdown. Host can override an unresponsive user and advance between
reveal phases. Realtime-like 2.5-second polling ensures cross-client state sync.
Chat and leaderboard are included. It is a collaborative practice mode, **not**
an official independently-proctored examination or mastery evidence.

## Three generation modes
1. **Specification:** newest active `blueprints` row, exactly 50 questions, exact
   `blueprint_quotas` for `group_code × cognitive`. Fails closed on shortage.
2. **Topics:** published lesson/active construct, difficulty 1–5, 1–100 requested
   questions, no repeated lesson. Choose randomly from published/source-backed
   keyed bank. The selected difficulty count is exact.
3. **Manual:** browse published/source-backed question stems by lesson; choose
   ordered individual question IDs (1–100, unique). Hidden keys inaccessible.

All three additionally reuse the exact official-mock v4 quality eligibility helper
(excluding high/critical open findings, malformed Y1/Y2/Y3 keys, source gaps and
unreviewed revisions). Manual bank previews randomize option order so Y3's saved
source order cannot imply the correct sequence.

All three take a snapshot of question data, option order, answer key and
explanation into private server-side `group_mock_items`. The published bank is
not modified; prior exam semantics are unchanged.

## Security and progression
- Membership requires Supabase account and 8-hex-character code.
- Up to 40 members per room, with at most five unfinished rooms per host.
- Only lobby permits new join; host controls start/next/early reveal.
- A row-level lock serializes answers and reveal; each member may answer a
  question only once. Correctness and answer key never returned by submit.
- `group_mock_state` checks membership; while question is active its response
  lacks other participants' answer text, correctness, key and explanation.
- Direct PostgREST table access revoked; five tables have RLS enabled with
  no direct learner policies. Explicitly gated functions only.
- Chat max 500 characters with 2-second per-sender limiter; messages are
  rendered as React text, not interpreted HTML. Up to latest 60 messages loaded.
- Scoring: 2/0 points, exact Y1/Y2/Y3 match. Collaborative scores do not
  alter `mastery_records`, personal `exams` or official exam history.
- 2.5-second polling is not instant Supabase Realtime. Clients refresh via
  the server; network disconnection displays previous view and resumes later.

## Changed components
- `supabase/migrations/20261021001500_task347_group_mock.sql`
- `supabase/tests/group_mock.test.sql`
- `src/features/group-mock/groupMockApi.ts` and privacy test
- `src/pages/GroupMockPage.tsx`
- `src/App.tsx` protected route and sidebar menu entry.

## Verification / release gates
1. GitHub CI `npm run lint`, `npm run typecheck`, `npm run test`,
   `npm run build` must pass. Both SQL tests are included in database CI.
2. Fresh local Supabase migrations, `group_mock.test.sql` regression and
   generated database types must be verified.
3. Two actual authenticated browser sessions must validate join/answer/
   auto-reveal/discussion/mobile/reconnect/50-question blueprint.
4. Apply migration only under explicit production release approval; do not
   claim feature live until deployed and authenticated smoke tested.
5. Existing published question editorial rules and immutable revision
   guarantees must remain in force.

## Rollback
Before applying migration: delete/revert branch commits. After applying
migration: first disable/revoke `group_mock_*` RPC calls, then drop the five
new tables/functions in dependency order in a reviewed forward-fix migration
(after exporting any live history if needed). No existing content tables are
modified by this feature.
