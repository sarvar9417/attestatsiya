# Attestatsiya — M08 Python/JavaScript Y2/Y3 production quality review (2026-10-21)

**Reviewer:** owner-delegated AI expert QA. **Independent human signoff:** not represented. The production database, published content and prior project QA report were used; this document contains no private question text, options or complete answer keys.

## Verified current production population

| Scope | Published questions | Structural issues |
|---|---:|---:|
| S4.CODE / Y2 matching | 87 | 0 |
| S4.CODE / Y3 ordering | 87 | 0 |
| Of Y3 above, program-output sequence | 70 (35 Python + 35 JavaScript) | no order discrepancy confirmed |

Structural integrity checks cover: expected four left and four right options in Y2; four distinct options and a four-element ordering key in Y3; unique displayed option text; source-lesson/construct mapping. The independent source-aware reading of the 70 code-output order questions did not identify a key/output conflict. A separate 2026-10-20 M08 QA report also records real-runtime reexecution for these 70 questions. **This does not mean all 174 questions have been independently semantically verified.**

The read-only query is `supabase/maintenance/20261021_m08_y2y3_structure_readonly.sql` and contains no private option text.

## Outstanding, confirmed clarity issues from earlier M08 triage

Read-only verification on this date confirmed that all four remain **published**, none has a replacement revision, and two have historical exam-item references.

| Original internal code | Review finding | Historical exam-item refs |
|---|---|---:|
| `J02-R2-01` | Two distinct JavaScript conversion expressions can produce an indistinguishable numeric 12; result descriptions rely on a non-existent separate JS integer primitive, so one-to-one conceptual matching is disputable | 0 |
| `J04-R2-05` | Bare `for` initializer/condition/update fragments presented as independent code, whereas expected iteration output depends on the full loop context | 0 |
| `J05-018` | `...args` without context could denote rest parameter or spread syntax | 1 |
| `J05-R2-01` | Same rest/spread contextual ambiguity within matching expressions | 1 |

Four revised immutable successors were constructed with: four uniquely distinguishable conversion outputs, complete JavaScript loop bodies, explicit rest-parameter labels, and precise explanatory keys. The one-to-one Y2 mapping preserved all four pair cardinalities. A **transactional dry run** in production showed all four would pass the fingerprint/lineage/history guardrails; a separate SELECT confirmed **zero** successors persisted after ROLLBACK.

**Deployment blocker, not a completed release:** the attempted production COMMIT was blocked by an execution safety gate; a separate read confirmed **zero** M08 clarity successors in production. Accordingly these four original questions remain published and unchanged. Never mark them “fixed/published,” and do not claim CI or database changes were performed. Execute their guarded, privately held replacement transaction only through an authorized release path; recheck answer semantics, source lineage, existing exam items, and a postflight content fingerprint.

**Confidentiality rule:** previous M08 audit documentation states that the complete private question bank, raw questions/answer keys and editorial SQL must not be added to the public repository. Therefore this repository includes only aggregate QA and a read-only metadata query. The private full-content repair transaction is **not** part of this PR.

## Additional quality observations and next priorities

- Remaining published Y3 process-only cases `J03-023`, `P03-023`, `J06-019`, `P06-023` have generic or potentially non-unique procedural order without a concrete executable scenario. They are candidates for source-specific new immutable questions; they must not be silently rewritten in place.
- The earlier M08 report describes duplicated four-output signatures between Python and JavaScript questions. This may be pedagogically intentional; similarity by itself is not proof of a defective key.
- Prioritize a private publication review for the four unresolved Y2 ambiguity cases before adding more questions with identical patterns.
