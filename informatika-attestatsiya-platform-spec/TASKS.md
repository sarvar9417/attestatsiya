# TASKS.md — atomik backlog

## Qoidalar

- Statuslar: `READY`, `WAITING`, `CLAIMED`, `IN_PROGRESS`, `BLOCKED`, `IN_REVIEW`, `DONE`.
- Dependency `DONE` bo‘lmasdan task boshlanmaydi.
- Task egasi `PROJECT_STATE.md`ga yoziladi.
- “Done” ustunidagi barcha bandlar test bilan isbotlanadi.
- Har task `AGENTS.md` handoff formatida tugatiladi.

## M0 — Foundation

| ID | Status | Dependency | Deliverable | Done |
|---|---|---|---|---|
| TASK-001 | READY | — | Git repo, Next.js TypeScript strict, pnpm, Node 24 pin, formatter/linter, Vitest | Clean install; `dev`, `build`, `lint`, `typecheck`, `test` green; lockfile committed |
| TASK-002 | WAITING | 001 | Supabase CLI local setup, config, base migration, seed harness | `db:start`, `db:reset`, `db:stop`; clean reset works |
| TASK-003 | WAITING | 001,002 | CI pipeline | Fresh runner’da install, DB reset, lint, type, unit, build pass |
| TASK-004 | WAITING | 001 | App route groups, layout, design tokens, i18n skeleton | Public/auth/learner/admin layouts; Uzbek default; responsive shell |
| TASK-005 | WAITING | 001 | Typed error, request ID, structured logging adapters | Stable error envelope; secret redaction unit test |
| TASK-006 | WAITING | 001 | `.env.example`, scripts, contributor setup docs | Secret yo‘q; clean-clone setup boshqa coder tomonidan verified |

## M1 — Schema, identity va curriculum

| ID | Status | Dependency | Deliverable | Done |
|---|---|---|---|---|
| TASK-010 | WAITING | 002 | Enum, specification, module va blueprint migrations | 2026 50/module/cognitive constraints DB testdan o‘tadi |
| TASK-011 | WAITING | 002,005 | Profile, role, basic audit va RLS | Learner own profile; role self-escalation rad; admin test |
| TASK-012 | WAITING | 010 | Source va locator schema/RLS | Page constraint; private source learnerga yopiq |
| TASK-013 | WAITING | 010 | Curriculum node, objective, prerequisite, mastery config schema | Unique codes; cycle service validator; 16 module seed |
| TASK-014 | WAITING | 012,013 | Lesson/stimulus/question revision schema | Published immutable; source-required publish constraints/functions |
| TASK-015 | WAITING | 011,014 | Assessment session/question/response/submission schema | Ownership RLS; unique position/revision; state constraints |
| TASK-016 | WAITING | 013,015 | Evidence/mastery/review/error schema | Append-only evidence; unique pending review; status audit |
| TASK-017 | WAITING | 011 | Idempotency, job run va extended audit schema | Duplicate key behavior; append-only audit |
| TASK-018 | WAITING | 010–017 | Generated DB TypeScript types va repository base | Generation reproducible; no manual generated edit |
| TASK-019 | WAITING | 010–018 | Full pgTAP RLS/constraint suite | Role matrix, IDOR, immutability, security-definer tests green |

## M2 — Content CMS vertical slice

| ID | Status | Dependency | Deliverable | Done |
|---|---|---|---|---|
| TASK-020 | WAITING | 004,011,018,019 | Auth UI, profile va server role guards | Register/login/reset/logout; unauthorized route tests |
| TASK-021 | WAITING | 012,018–020 | Source registry API va admin UI | CRUD, locator, validation, audit, permission E2E |
| TASK-022 | WAITING | 014,018–020 | Lesson revision/workflow services va API | Draft→review→approve→publish; self-approve rad |
| TASK-023 | WAITING | 004,022 | Rich block schema, renderer va lesson editor | Allowlist blocks; XSS test; mobile/desktop preview |
| TASK-024 | WAITING | 014,018,019 | Y1/Y2/Y3 Zod schema va scoring domain | Valid/invalid fixtures; all scoring branches unit tested |
| TASK-025 | WAITING | 004,024 | Question/stimulus renderers va admin preview | Y1/Y2/Y3 keyboard accessible; randomization mapping test |
| TASK-026 | WAITING | 021,024 | Question revision/workflow API | Source/objective required; validation; immutable publish |
| TASK-027 | WAITING | 022,023,025,026 | Review queue, comments, diff va publish UI | Full author→reviewer→publisher E2E; unresolved comment blocks |
| TASK-028 | WAITING | 017,021,026 | JSON import dry-run/commit | Hash-bound token; no auto-publish; atomic/error report tests |
| TASK-029 | WAITING | 013,026 | Content coverage va assembly-pool admin report | Module→objective→cognitive matrix; deficit exact |

## M3 — Learner vertical slice

| ID | Status | Dependency | Deliverable | Done |
|---|---|---|---|---|
| TASK-030 | WAITING | 013,020 | Onboarding va learner settings | Required fields, skip diagnostic, plan state E2E |
| TASK-031 | WAITING | 013,022,023,030 | Learner curriculum/module/lesson read | Lock reasons, published-only, source reference |
| TASK-032 | WAITING | 004,030,031 | Dashboard skeleton va module progress | Empty/loading/error; mobile/desktop |
| TASK-033 | WAITING | 015,024,031 | Lesson progress va quick-check session | Completion sharti; lesson read alone mastery bermaydi |
| TASK-034 | WAITING | 015,024,026 | Basic practice session assembler/service | Published eligible distinct items; insufficient pool error |
| TASK-035 | WAITING | 017,024,034 | Practice response, submit, feedback API | Idempotent; first submit immutable; correct answer only after submit |
| TASK-036 | WAITING | 025,035 | Learner practice UI Y1/Y2/Y3 | Autosave indicator; retry separate; accessibility interaction |
| TASK-037 | WAITING | 016,035 | Error notebook service/UI basic | Objective/misconception group; new-question remediation |
| TASK-038 | WAITING | 035,036 | Offline-aware answer queue va conflict recovery | Network simulation; stale revision; no silent loss |
| TASK-039 | WAITING | 030–038 | Pilot learner E2E suite | Onboard→lesson→all types→feedback→error notebook pass |

## M4 — Mastery, SRS va adaptiv tizim

| ID | Status | Dependency | Deliverable | Done |
|---|---|---|---|---|
| TASK-040 | WAITING | 016,035 | Mastery evidence writer/classifier | First/guided/retry/invalid cases exact; append idempotent |
| TASK-041 | WAITING | 040 | Versioned mastery calculator | Threshold/weight/null-level/regression unit tests |
| TASK-042 | WAITING | 017,041 | 1/3/7/14/30 review scheduler/job | Timezone-safe due; retry-safe; pass/fail flow |
| TASK-043 | WAITING | 034,041,042 | Adaptive practice selector | 50/25/15/10 target, fallback audit, exposure penalty tests |
| TASK-044 | WAITING | 041 | Blueprint-weighted readiness service | Confidence/evidence; insufficient-data behavior |
| TASK-045 | WAITING | 032,036,041–044 | Mastery/review/readiness UI va E2E | Provisional unlock; stable after reviews; regression UI |

## M5 — Mock exam

| ID | Status | Dependency | Deliverable | Done |
|---|---|---|---|---|
| TASK-050 | WAITING | 010,026,029 | Candidate pool feasibility service/report | Module×cognitive deficit; impossible blueprint rad |
| TASK-051 | WAITING | 024,050 | Deterministic constraint-based exam generator | 1,000+ seeded invariant/property runs green |
| TASK-052 | WAITING | 015,017,051 | Mock session create/read API | Atomic 50 snapshot; no answer key; same idempotency result |
| TASK-053 | WAITING | 015,052 | Optimistic autosave API | Revision conflict; ownership; burst/idempotency tests |
| TASK-054 | WAITING | 017,052 | Server timer, expiry va safety finalizer | Client clock irrelevant; late response rad; job idempotent |
| TASK-055 | WAITING | 024,052–054 | Atomic final submit va scoring | 2/0, blank, double-submit, timeout; max 100 |
| TASK-056 | WAITING | 004,025,052–055 | Responsive mock exam UI | Navigator/timer/flag/submit; keyboard/mobile; answer status |
| TASK-057 | WAITING | 044,055,056 | Result va item-review UI | 4 section, 16 module, cognitive, time, next action; finalized-only |
| TASK-058 | WAITING | 051–057 | Full exam E2E/invariant suite | Network loss, refresh, timeout, duplicate submit, leakage pass |

## M6 — Analytics, security va operations

| ID | Status | Dependency | Deliverable | Done |
|---|---|---|---|---|
| TASK-060 | WAITING | 040,055 | Daily learner/item aggregate jobs | Idempotent date rebuild; minimum sample suppression |
| TASK-061 | WAITING | 029,060 | Item analysis va content health UI | Distractor/time/difficulty flags; permission |
| TASK-062 | WAITING | 017,021,027 | Audit log admin UI | Filter/diff; unauthorized hidden; secret/key redaction |
| TASK-063 | WAITING | 019,028,038,058 | Security hardening | RLS/IDOR/XSS/CSRF/upload/rate/headers/answer leak suite |
| TASK-064 | WAITING | 039,045,057 | Accessibility va performance hardening | WCAG checklist; p75/p95 target test evidence |
| TASK-065 | WAITING | 031,038 | PWA install/cache/offline shell | Offline lesson; exam constraints; update strategy |
| TASK-066 | WAITING | 005,017,042,054,060 | Monitoring, metrics va scheduled jobs | Alerts; job locks; structured no-secret logs |
| TASK-067 | WAITING | 003,063–066 | Staging deploy pipeline | Migration+smoke; preview isolation; release artifact |
| TASK-068 | WAITING | 067 | Backup va restore rehearsal | Isolated restore + core E2E + recorded duration |
| TASK-069 | WAITING | 058,061–068 | Technical release gate | Barcha MVP technical blocker evidence green |

## M7 — Kontent

| ID | Status | Dependency | Deliverable | Done |
|---|---|---|---|---|
| TASK-070 | WAITING | 021 | 13 informatika darslik source/locator import | Checksum, metadata, primary ranges verified |
| TASK-071 | WAITING | 013,070 | 2026 complete curriculum/objective seed | M01–M16 code, prerequisite, mastery config validated |
| TASK-072 | WAITING | 027,070,071 | M01 pilot lessons va ≥100 savol | All type/cognitive; 2-person review; source 100% |
| TASK-073 | WAITING | 027,070,071 | M05 pilot lessons va ≥100 savol | Calculation verification; all type/cognitive |
| TASK-074 | WAITING | 027,070,071 | M08 pilot lessons va ≥100 savol | Python/JS code verified; all type/cognitive |
| TASK-075 | WAITING | 072–074,029 | Pilot content feasibility va beta | No critical content error; closed beta feedback resolved |
| TASK-076 | WAITING | 075 | M02–M13 lessons va question bank | Har microtopic target yoki approved override; specialty pool feasible |
| TASK-077 | BLOCKED | B-001,021 | 5 pedagogik/kasbiy source ingest | Official/recommended source locator verified |
| TASK-078 | WAITING | 071,077 | M14–M16 lessons va question bank | 15-slot pool feasible; human expert review |
| TASK-079 | WAITING | 069,076,078 | ≥3 000 approved savol va 20 mock audit | Every slot ≥20; 20 assemblies invariant pass; content sign-off |
| TASK-080 | WAITING | 079 | Production content activation | Active spec, cache invalidation, smoke, rollback pointer |

## Task tanlash

Coder faqat:

1. status `READY`;
2. yoki barcha dependency `DONE` bo‘lib `WAITING`dan `READY`ga o‘tkazilgan

taskni oladi. Bir nechta AI coder ishlaganda project coordinator har merge’dan so‘ng ochilgan tasklarni `READY` qiladi.
