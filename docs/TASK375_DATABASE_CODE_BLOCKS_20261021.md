# TASK-375 — Database code-block normalization

## Outcome

Production question stems were audited for executable code or pseudocode that
was rendered as a single prose line. The release replaced 59 published Y1 rows
with immutable presentation-only revisions:

- 37 long inline-backtick snippets became language-labelled fenced blocks;
- 22 unmarked Pascal-style `FOR` traces became fenced, indented blocks;
- short identifiers, single expressions and spreadsheet formulas stayed inline;
- 59 source rows are archived and 59 successors are published;
- option wording, explanations and correct-answer meaning are unchanged;
- historical attempts continue to reference the archived source IDs.

The reported Python example now renders as:

```python
for i in range(3):
    print(i, end=" ")
```

It prints `0 1 2 ` (including the trailing space requested by `end=" "`).

The reported JavaScript example now renders as:

```javascript
for (let i = 0; i < a.length; i++)
  sum += a[i];
```

`i < a.length` is required because a zero-based array of length `n` has valid
indices `0` through `n - 1`; the strict bound prevents reading `a[n]`.

## Immutable release design

`20261021075218_task375_database_code_block_revisions.sql` clones each question,
creates new option UUIDs, remaps `correct_option_id`, verifies equivalence, then
publishes the successor before archiving the source. It records the release as
owner-requested formatting only and does not claim independent human review.

The first production postflight exposed that source quality findings are keyed
by question ID. `20261021075438_task375_carry_quality_findings.sql` therefore
carries all 80 unresolved source findings to their successors. This restores
the prior quality policy: nine HIGH answer-length findings remain blocking, and
official-mock eligibility is 45 rather than the temporarily widened 54.

## Verification evidence

- transactional production-schema migration + regression: PASS / ROLLBACK;
- production apply: PASS;
- production SQL regression: `task375_database_code_blocks_ok`;
- 59 published successors, 59 archived sources;
- 236/236 option rows preserved by side/order/content;
- 59/59 answer keys remapped to successor option IDs;
- semantic mismatches: 0;
- remaining audited long inline code: 0;
- remaining audited unmarked `FOR` pseudocode: 0;
- published snapshot gap: 0;
- unresolved findings: source 80, successor 80;
- Vitest: 190 files, 1,210 tests PASS;
- lint, typecheck, generated-content check, production build and bundle scan: PASS.

Supabase advisors after the change reported only pre-existing informational
RLS-without-policy and unindexed-FK notices; this task adds no table, policy,
function or index. Reference: https://supabase.com/docs/guides/database/database-linter

No Vercel/application deployment was performed.
