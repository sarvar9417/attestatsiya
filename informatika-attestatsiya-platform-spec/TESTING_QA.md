# TESTING_QA.md

## 1. Quality gate

Har PR:

```text
format check
lint
TypeScript typecheck
unit tests
changed integration/database tests
build
E2E smoke (tegishli bo‘lsa)
```

Main/release:

```text
all unit/integration
Supabase clean migration
pgTAP RLS
full E2E
accessibility scan
security/secret scan
production build
```

## 2. Test qatlamlari

### Unit

Sof domain function:

- question payload validation;
- Y1/Y2/Y3 scoring;
- first-attempt classification;
- mastery calculation;
- review interval;
- readiness;
- rounding;
- timer state;
- error mapping.

### Property/invariant

Exam generator:

- yuzlab seeded run;
- total 50;
- module count;
- cognitive 8/35/7;
- duplicate yo‘q;
- faqat eligible/published;
- deterministic same seed;
- insufficient pool fail.

Payload:

- random ordering presentation correct answer mappingni buzmasligi;
- Y2 normalize;
- Y3 permutation.

### Database/pgTAP

- schema constraint;
- RLS per role;
- cross-user denial;
- published revision immutable;
- transition constraint;
- unique submission;
- finalization idempotency;
- security-definer permission.

### Integration

- route → service → local database;
- auth/role;
- idempotency;
- optimistic response conflict;
- publish transaction;
- assessment create/save/submit;
- timeout;
- import dry-run/commit.

### E2E

Core learner:

1. register/login;
2. onboarding;
3. lesson;
4. Y1/Y2/Y3 practice;
5. feedback;
6. mastery;
7. review;
8. mock exam;
9. result.

Core content:

1. author draft;
2. reviewer changes;
3. author new edit;
4. approve;
5. publish;
6. learner sees current;
7. old attempt old revision bilan qoladi.

## 3. Critical test cases

### Answer leakage

- assessment GET response’da `correct*` field yo‘q;
- HTML/source map’da key yo‘q;
- error response’da key yo‘q;
- unauthorized direct table SELECT rad.

### Session ownership

User A User B:

- session GET;
- autosave;
- submit;
- result

qila olmaydi.

### Timer

- client clock oldinga/orqaga;
- tab sleep;
- network interruption;
- exact expiry;
- late request;
- safety job;
- double submit.

### Mastery evidence

- correct first independent counts;
- same revision second time counts emas;
- explanation’dan keyingi retry counts emas;
- invalid session counts emas;
- reviewer correction recalculation audit.

### Content

- source’siz publish rad;
- author self-approve rad;
- unresolved comment approve rad;
- approved bo‘lmagan publish rad;
- published row edit/delete rad.

## 4. Fixture strategiyasi

Deterministik fixture:

- 1 active va 1 retired specification;
- 16 module;
- kamida 3 pilot microtopic;
- har Y1/Y2/Y3;
- har cognitive level;
- learner/author/reviewer/publisher/admin;
- 2 learner cross-user test uchun;
- enough pool exam generator fixture.

Seed:

- development demo;
- test minimal;
- production seed alohida.

Testlar execution orderga tayanmaydi.

## 5. Coverage

Coverage raqamining o‘zi maqsad emas, ammo minimum:

- domain: 90% statements/branches;
- server services: 80%;
- critical scoring/mastery/generator: 100% business branch;
- UI visual component: interaction va a11y test.

Generated files coverage’dan chiqariladi.

## 6. Accessibility QA

- automated axe scan;
- keyboard manual script;
- screen reader smoke: Y1/Y2/Y3, timer, feedback;
- focus order;
- 200% zoom;
- contrast;
- reduced motion.

Automated scan manual tekshiruv o‘rnini bosmaydi.

## 7. Performance QA

Scenario:

- dashboard;
- curriculum;
- lesson;
- 50-question exam load;
- answer autosave burst;
- result aggregation;
- admin question search.

Target:

- authenticated typical page p75 LCP ≤ 2.5s;
- answer save p95 server ≤ 500ms normal load;
- exam assembly p95 ≤ 2s 10k bankda;
- DB query N+1 yo‘q;
- payload sanitized va bounded.

Load test synthetic, correct answer log qilinmaydi.

## 8. Security QA

- RLS matrix;
- IDOR;
- role escalation;
- XSS rich blocks/import;
- CSRF;
- upload polyglot/wrong MIME;
- rate limit;
- secret scan;
- dependency audit;
- error stack production’da yashirilgan.

## 9. Content QA

Automated:

- schema;
- answer consistency;
- option uniqueness;
- source;
- objective;
- code parse/lint imkon bo‘lsa;
- formula/unit;
- duplicate hash.

Human:

- fakt;
- official terminology;
- ambiguity;
- cognitive classification;
- distractor quality;
- copyright.

## 10. Bug severity

| Severity | Misol | Release |
|---|---|---|
| S0 | Data/security breach, answer leak | Stop, incident |
| S1 | Noto‘g‘ri score, exam invariant buzilgan | Block |
| S2 | Core flow ishlamaydi, answer yo‘qoladi | Block |
| S3 | Workaround bor UX muammo | Risk bilan |
| S4 | Cosmetic | Keyingi patch |

## 11. Test naming

```text
given_<context>_when_<action>_then_<result>
```

Har regressiya bug uchun avval failing test, keyin fix.

## 12. Release evidence

Release artifact:

- commit SHA;
- migration list;
- test run link;
- E2E result;
- content coverage;
- assembly feasibility;
- backup status;
- known issues;
- approver.
