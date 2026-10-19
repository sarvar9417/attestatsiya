# Production pedagogika: read-only bank baseline and editorial gap (2026-10-19)

**Project:** Supabase `attestatsiya100%`. **Operation:** SELECT-only audit. No SQL writes, answers, private learner data, or user profiles accessed. Counts below are an observed snapshot, not an assertion of full content accuracy.

## Published / archived rows

| group_code | Published | Archived | Published Y1 | Published Y2 | Published Y3 |
|---|---:|---:|---:|---:|---:|
| KS | 140 | 74 | 130 | 8 | 2 |
| PM.GEN | 233 | 70 | 223 | 3 | 7 |
| PM.MET | 77 | 49 | 73 | 0 | 4 |
| **Total** | **450** | **193** | **426** | **11** | **13** |

There were no `review` rows in these three groups in the observed SELECT. **This is not a reason to bulk re-run the historical PR #125 review-stage SQL.** Every published row had a populated `source_reference` field and a non-NULL `source_lesson_id`.

## Editorial verification records (published)

| Group | With record / four true flags | Without record |
|---|---:|---:|
| KS | 37 | 103 |
| PM.GEN | 145 | 88 |
| PM.MET | 21 | 56 |
| **Total** | **203** | **247** |

The counted check record flags were `answer_verified`, `reference_verified`, `wording_verified`, and `original_authorship_verified`. They are *database editorial metadata*, not an independent scientific expert sign-off. For 247 published rows the table has no such record. This does **not** prove that those questions are wrong; it means a complete check cannot be claimed from this evidence.

## Mechanical first-pass audit

- All **426 published Y1** rows had **4 side='a' options each** (1,704 entries). This only checks option cardinality.
- Normalized case/whitespace stem fingerprint within a pedagogika group produced **1 group of two published Y2 stems** in KS.03. IDs: `f35ce286-3064-4b17-8ac2-a2bdc2a2d6e6`, `fb83453d-1e42-4ac5-9ce2-864b24ceb022`. The option-text fingerprints **differ**, so they must be semantically checked as separate matching tasks before a dedupe decision; neither item was changed.
- Explicit `source_reference` fields are not verified book/page citations by themselves.

## Reproducible read-only SQL

```sql
select group_code,status::text,count(*) from public.questions
where group_code in ('KS','PM.GEN','PM.MET')
group by group_code,status order by group_code,status;

select q.group_code,
  count(*) filter(where q.status='published') published,
  count(*) filter(where q.status='published' and ec.question_id is not null) has_editorial_record,
  count(*) filter(where q.status='published' and ec.question_id is null) missing_editorial_record
from public.questions q
left join public.question_editorial_checks ec on ec.question_id=q.id
where q.group_code in ('KS','PM.GEN','PM.MET')
group by q.group_code;

select q.group_code,q.format::text,count(*) from public.questions q
where q.group_code in ('KS','PM.GEN','PM.MET') and q.status='published'
group by q.group_code,q.format order by 1,2;
```

## Publication safety gate

1. Check the 247 rows lacking editorial records individually against original books and 2026 specification; do **not** automatically set check flags.
2. Distinguish owner batch approval from independent subject-matter expert review.
3. Compare all answer keys, distractors, explanation text and Y2/Y3 side/order contracts *privately*, preserving key secrecy and immutable revisions.
4. Review the two KS.03 Y2 prompts before considering a dedupe; they have different option sets.
5. Re-run the production SELECT snapshot after each authorized release and log deltas; no automatic publication from this audit.
