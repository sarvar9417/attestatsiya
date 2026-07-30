# TASKS.md — atomik backlog

> Loyiha React+Vite, Supabase, files/ spec bo'yicha.

## Qoidalar

- Statuslar: `READY`, `CLAIMED`, `IN_PROGRESS`, `BLOCKED`, `DONE`
- Dependency `DONE` bo'lmasdan task boshlanmaydi
- "Done" bandlari test bilan isbotlanadi

## P0 — Xavfsizlik va barqarorlashtirish

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| TASK-P0-001 | DONE | — | Secretlarni repodan chiqarish, safety checkpoint, root README, stack/taksonomiya ADR, auditga mos project state |
| TASK-P0-002 | DONE | TASK-P0-001 | GitHub CI: secret scan, lint, unit, build va Playwright smoke |
| TASK-P0-003 | DONE | TASK-P0-001, remote migration audit | Bitta toza UUID migration baseline va rasmiy 2026 seed |
| TASK-P0-004 | DONE | TASK-P0-003 | Role escalation, exam membership va idempotent submit xavfsizlik tuzatishlari |
| TASK-P0-005 | DONE | TASK-P0-001 | Admin route deny-by-default guard va xavfsiz bo‘lmagan client mock’ni production bundle’dan chiqarish |

## Oldingi foundation natijalari — audit holati

| ID | Status | Deliverable |
|----|--------|-------------|
| T-001 | DONE | React+Vite+TypeScript strict+Vitest+Playwright |
| T-002 | DONE | Supabase remote project (plyqezulrfowyblsfpzy) |
| T-003 | DONE | Eski BIGINT liniya arxivlandi; UUID baseline fresh va drift-upgrade ssenariylarida isbotlandi |
| T-004 | DONE | `submit_answer` owner/membership tekshiradi, answer immutable va retry idempotent |
| T-005 | DONE | Remote seed 16 modul, 15 guruh, 50/120 va 8/35/7 kontraktiga reconcile qilindi |
| T-006 | BLOCKED | Frontend role guard yopilgan, ammo admin panel eski type/schema'ga tayangan |
| T-007 | BLOCKED | 49 unit + 4 smoke E2E o'tadi, ammo domain/RLS va product-flow qamrovi yetarli emas |

## Phase 1 — Core app (keyingi)

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| T-008 | DONE | TASK-P0-003 | database.types.ts UUID schema bo'yicha yangilash |
| T-009 | DONE | T-008 | ExamRunner + Y1/Y2/Y3 komponentlarini UUID schema ga moslash |
| T-010 | READY | T-008, T-009 | contentTree.ts, topicContent.ts ni UUID schema ga moslash |
| T-011 | BLOCKED | T-010 | Learning moduli (mavzu o'qish, test) |
| T-012 | BLOCKED | T-010 | Y1/Y2/Y3 generatorlar (axborotHajmi, sanoqSistema, mantiqAmal, ipMaska) |
| T-013 | BLOCKED | T-011, T-012 | ExamRunner bilan imtihon ishga tushirish (RPC orqali) |
| T-014 | BLOCKED | T-013 | Natija ekrani (ball, toifa qarori, guruh kesimi) |
| T-015 | BLOCKED | T-014 | Mock exam UI (timer, navigator, flag) |

## Blockerlar

| ID | Tavsif |
|----|--------|
| B-SEC-001 | RESOLVED — repodan chiqarildi va Supabase tomonda rotate qilindi |
| B-DB-001 | RESOLVED — HTTPS read-only audit remote migratsiya metadata jadvali mavjud emasligini ko‘rsatdi |
| B-DB-002 | RESOLVED — legacy liniya arxivlandi, faol UUID baseline va migration history yaratildi |
| B-QA-001 | RESOLVED — CI secret scan, lint, typecheck, unit, build va E2E bilan yashil |
| B-001 | Y1/Y2/Y3 generatorlar yozilmagan (konstrukt kodlari va parametrlar asosida savol generatsiyasi) |
| B-002 | RESOLVED — TypeScript types remote UUID schema bo'yicha generatsiya qilindi |
| B-003 | RESOLVED — server-scored ExamRunner UUID RPC kontraktiga o‘tkazildi |

## Test talabi

Har task uchun kamida:
- happy path
- permission/validation failure
- chegaraviy holat
