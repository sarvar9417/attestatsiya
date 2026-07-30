# DEPLOYMENT_OPERATIONS.md

## 1. Muhitlar

| Muhit | Maqsad | Data |
|---|---|---|
| Local | Development/test | Synthetic seed |
| Preview | Har PR UI/integration | Ephemeral yoki shared non-sensitive |
| Staging | Release candidate | Production-like synthetic/content copy |
| Production | Real user | Real |

Production data local/preview’ga ko‘chirilmaydi.

## 2. Lokal talablar

- Node.js 24 LTS.
- pnpm pinned.
- Docker-compatible runtime.
- Supabase CLI project dependency.

Expected commands:

```bash
pnpm install --frozen-lockfile
pnpm supabase start
pnpm db:reset
pnpm dev
```

Script nomlari bootstrap taskda yaratiladi:

```text
dev
build
start
format
lint
typecheck
test
test:integration
test:e2e
db:start
db:stop
db:reset
db:test
db:types
verify
```

## 3. Environment variables

`.env.example`:

```text
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_DATABASE_URL=
CRON_SECRET=
RATE_LIMIT_SECRET=
OBSERVABILITY_DSN=
STORAGE_MAX_UPLOAD_BYTES=
APP_TIMEZONE=Asia/Tashkent
```

Faqat `NEXT_PUBLIC_*` browserga. Service role hech qachon public prefix olmaydi.

## 4. Migration

Workflow:

1. local migration;
2. clean `db reset`;
3. pgTAP;
4. generated types;
5. staging backup;
6. staging apply;
7. smoke;
8. production backup;
9. production apply;
10. post-migration verification.

Destructive migration expand/contract:

1. yangi nullable column/table;
2. dual read/write;
3. backfill;
4. switch;
5. keyingi release’da old field remove.

## 5. Seed

`seed.sql`:

- role-less demo auth yaratishga tayanmasin yoki local auth script bilan;
- specification;
- module/microtopic/objective;
- source metadata sample;
- pilot content;
- deterministic.

Production content seed/migration bilan code deploy’dan ajratilishi mumkin, lekin version va audit talab qilinadi.

## 6. CI pipeline

PR:

1. install frozen;
2. secret scan;
3. format/lint/typecheck;
4. local Supabase;
5. migration/reset;
6. db tests;
7. unit/integration;
8. build;
9. E2E smoke;
10. preview.

Main:

- full E2E;
- accessibility;
- dependency audit;
- staging deploy;
- migration;
- smoke;
- manual release approval.

## 7. Deploy

Next.js deploy target Node.js server yoki container’ni qo‘llashi kerak. Provider tanlovi app code’ga provider-specific coupling kiritmasin.

Deploy artifact immutable commit SHA bilan.

Database migration app deploy tartibi backward-compatible bo‘ladi.

## 8. Feature flags

Flags:

- new mastery calculation version;
- mock exam availability;
- content module activation;
- analytics;
- import.

Security check yoki RLS feature flag bilan o‘chirilmaydi.

## 9. Monitoring

Alert:

- 5xx rate;
- answer save failure;
- exam assembly failure;
- expired session finalization backlog;
- job failure;
- database connection/storage;
- auth anomaly;
- backup failure.

Dashboard:

- request latency;
- active sessions;
- DB query latency;
- exam create/submit;
- content publish;
- error codes.

## 10. Backup

- managed daily backup;
- production release oldidan on-demand backup;
- 30 kun retention target;
- storage media manifest/checksum;
- quarterly restore rehearsal.

Restore test:

1. isolated environment;
2. latest backup restore;
3. row count/checksum;
4. auth mapping;
5. core E2E;
6. duration va natija yozuvi.

Backup borligi restore isbotisiz yetarli emas.

## 11. Rollback

App:

- old immutable artifact redeploy.

Database:

- migrationni “down”ga ishonib avtomatik qaytarish emas;
- backward-compatible old app;
- forward-fix migration;
- severe data incidentda backup restore.

Content:

- parent current revision’ni old published revisionga audited switch;
- attemptlar o‘z revisionida qoladi.

## 12. Scheduled jobs

Job endpoint:

- secret auth;
- idempotent run key;
- advisory lock;
- timeout;
- structured result.

Joblar:

- review scheduler;
- expired exam finalizer;
- item analytics;
- cleanup expired import/idempotency;
- health verification.

## 13. Production readiness

- custom domain/TLS;
- email flow;
- admin MFA;
- RLS pass;
- backup restore pass;
- privacy/terms;
- support contact;
- incident owner;
- active spec and feasible pool;
- S0–S2 bug yo‘q;
- observability/alert.
