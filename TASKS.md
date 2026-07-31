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

## Darslik kontenti ekstraksiyasi

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| T-DL-001 | DONE | — | Adabiyotlar.txt, spetsifikatsiya — attestatsiya hujjatlaridan kontent code va adabiyotlar ro'yxati ajratildi |
| T-DL-002 | DONE | T-DL-001 | Cambridge+ (5–11 sinf) va ICT (5–11 sinf) darsliklaridan to'liq matn ekstraksiyasi, 18 fayl |
| T-DL-003 | DONE | T-DL-002 | Content code bo'yicha Cambridge kontentini tartiblash → `barcha_kontent_kodlar_boyicha.txt` (~87K qator) |
| T-DL-004 | DONE | T-DL-003 | 38 ta individual code fayli (1.1.txt–13.2.txt) — Cambridge + ICT + tematik manbalar birlashtirildi (~124K qator) |

## M01 kontenti — qo'llanmadan sinxronizatsiya

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| T-M01-001 | DONE | — | `Axborot_va_axborot_jarayonlari_LaTeX` boblari kitobdagi ketma-ketlikda strukturaviy bloklarga o'girildi (`scripts/latex_to_blocks.py` → `scripts/gen_m01_ts.py` → `src/data/topics/m01.ts`); 22 mavzu, 691 blok |
| T-M01-002 | DONE | T-M01-001 | Kitob dizayni: quti turlari, KaTeX formulalar, jadval, sxemalar va bob mundarijasi (`src/components/learning/theory/`, `.book-*` CSS) |
| T-M01-003 | DONE | T-M01-002 | Bo'limli o'qish rejimi: `\section` bo'yicha sahifalash, sticky holat paneli, mundarija, klaviatura navigatsiyasi va yakunda bitta "Testni boshlash" (`BookReader.tsx`); takroriy CTA'lar olib tashlandi |
| T-M01-004 | DONE | T-M01-003 | Kontent yangi manbaga ko'chirildi: `I_qism_..._yagona.tex` (yagona fayl, 10 raqamli + 4 raqamsiz bob) → 12 mavzu, 783 blok; eski 22 mavzulik kontent va 33 savol butunlay o'chirildi; yangi quti turlari (Tayanch atamalar, Ishlanadigan misollar, Bosqichma-bosqich yechimlar, Bob maqsadi, tahlil qutilari) va 10 ta yangi sxema qo'shildi |

## Phase 1 — Core app (keyingi)

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| T-008 | DONE | TASK-P0-003 | database.types.ts UUID schema bo'yicha yangilash |
| T-009 | DONE | T-008 | ExamRunner + Y1/Y2/Y3 komponentlarini UUID schema ga moslash |
| T-010 | DONE | T-008, T-009 | contentTree.ts, topicContent.ts ni UUID schema ga moslash |
| T-011 | DONE | T-010 | Learning moduli (mavzu o'qish, test) |
| T-012 | READY | T-010 | Y1/Y2/Y3 generatorlar (axborotHajmi, sanoqSistema, mantiqAmal, ipMaska) |
| T-013 | BLOCKED | T-011, T-012 | ExamRunner bilan imtihon ishga tushirish (RPC orqali) |
| T-014 | BLOCKED | T-013 | Natija ekrani (ball, toifa qarori, guruh kesimi) |
| T-015 | BLOCKED | T-014 | Mock exam UI (timer, navigator, flag) |
| T-016 | DONE | — | User auth frontend: login/register/profil/logout UX (validatsiya, EMAIL_NOT_CONFIRMED, redirect), profilga parol o'zgartirish, route himoyasi va session expiry |
| T-017 | DONE | T-011, T-012 | M01 darslik kontenti va 400 savolni frontend → backend → DB oqimiga ko'chirish (lessons.blocks + questions seed + lessonContentGateway) |
| T-018 | DONE | T-017 | Dars testi 20 ta random savol (faqat joriy dars pool'idan) + javoblar aralashishi (option_order) + umumiy vaqt savollar×2 daqiqa (server timer) + admin sinov urinishlarini ko'rish (API + admin panel sahifasi); Vercel deploy (frontend + backend) va ko'p segmentli /api/* routing fix (PR #9 — rewrites) |
| T-019 | DONE | T-018 | Zod validatsiya xatolari 400 `VALIDATION_ERROR` qaytaradi (ilgari 500): ildiz sabab — `setErrorHandler` route'lardan keyin chaqirilgani uchun Fastify route context'lari default handler'ni ushlab qolgan; endi handler route'lardan oldin o'rnatiladi + zod 3.25.x `issues`/`errors` strukturaviy tekshiruvi; regressiya testlari (`error-handler.test.ts`, 3 ta) |
| T-021 | DONE | T-019 | Backend Vercel loyihasi GitHub'ga ulandi (`POST /link`, productionBranch=main, rootDirectory=backend); auto-deploy tasdiqlandi (push → production deploy, preview ham); PR #13 |
| T-022 | DONE | T-021 | Backend alohida `sarvar9417/attestatsiya-backend` (public) repoga ko'chirildi; Vercel qayta ulandi (rootDirectory bekor, repo ildizi); yangi repo CI (tsc + vitest 102 + secrets scan); push → auto-deploy tasdiqlandi; asosiy repodan `backend/` olib tashlandi |

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
