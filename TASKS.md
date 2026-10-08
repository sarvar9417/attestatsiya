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
| T-006 | DONE | Frontend role guard + admin panel UUID schema/type reconciliation yakunlangan; AdminDashboard/Modules/Questions/Attempts typed oqimda, main CI typecheck/build yashil |
| T-007 | DONE | T-006 | RLS learner/admin access matrix + protected mock exam start→answer→finish→server result Playwright product-flow E2E; fresh DB CI bilan tasdiqlangan |

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
| T-012 | DONE | T-010 | Y1/Y2/Y3 generatorlar (axborotHajmi, sanoqSistema, mantiqAmal, ipMaska): 9 rasmiy konstrukt, seeded determinism, 100-seed semantic uniqueness va mustaqil formula testlari |
| T-013 | DONE | T-011, T-012 | ExamRunner bo‘lim/mavzu/mock sinovlarini server gateway → backend RPC oqimida ishga tushiradi; fallback xavfsizligi regressiya testlari bilan yopildi (PR #30) |
| T-014 | DONE | T-013 | Natija ekrani server-authoritative ball, passed qarori va guruh kesimini saqlaydi; client qayta hisoblash regressiyasi yopildi (PR #31) |
| T-015 | DONE | T-014 | Mock exam UI: server-authoritative timer, navigator va client-side review flaglari regressiya testlari bilan yopildi (PR #32) |
| T-016 | DONE | — | User auth frontend: login/register/profil/logout UX (validatsiya, EMAIL_NOT_CONFIRMED, redirect), profilga parol o'zgartirish, route himoyasi va session expiry |
| T-017 | DONE | T-011, T-012 | M01 darslik kontenti va 400 savolni frontend → backend → DB oqimiga ko'chirish (lessons.blocks + questions seed + lessonContentGateway) |
| T-018 | DONE | T-017 | Dars testi 20 ta random savol (faqat joriy dars pool'idan) + javoblar aralashishi (option_order) + umumiy vaqt savollar×2 daqiqa (server timer) + admin sinov urinishlarini ko'rish (API + admin panel sahifasi); Vercel deploy (frontend + backend) va ko'p segmentli /api/* routing fix (PR #9 — rewrites) |
| T-019 | DONE | T-018 | Zod validatsiya xatolari 400 `VALIDATION_ERROR` qaytaradi (ilgari 500): ildiz sabab — `setErrorHandler` route'lardan keyin chaqirilgani uchun Fastify route context'lari default handler'ni ushlab qolgan; endi handler route'lardan oldin o'rnatiladi + zod 3.25.x `issues`/`errors` strukturaviy tekshiruvi; regressiya testlari (`error-handler.test.ts`, 3 ta) |
| T-021 | DONE | T-019 | Backend Vercel loyihasi GitHub'ga ulandi (`POST /link`, productionBranch=main, rootDirectory=backend); auto-deploy tasdiqlandi (push → production deploy, preview ham); PR #13 |
| T-022 | DONE | T-021 | Backend alohida `sarvar9417/attestatsiya-backend` (public) repoga ko'chirildi; Vercel qayta ulandi (rootDirectory bekor, repo ildizi); yangi repo CI (tsc + vitest 102 + secrets scan); push → auto-deploy tasdiqlandi; asosiy repodan `backend/` olib tashlandi |
| T-023 | DONE | T-012 | Parametrik generatorlardan deterministik DB seed pipeline: 9 konstrukt × 30 = 270 savol, UUIDv5, Y1/Y2/Y3 key materialization, append-only SQL builder (PR #35) |
| T-024 | DONE | T-023 | Generated 270-savol SQL fresh PostgreSQL CI’da ikki marta qo‘llandi; idempotency, 9×30 distribution, option/key invariantlari va FK yaxlitligi yashil tasdiqlandi |
| T-025 | DONE | T-024 | 270-savollik versiyalangan migration production `plyqezulrfowyblsfpzy` Supabase’ga apply qilindi; remote history exact version bilan reconciled, `is_generated=true` savollar soni 270 bilan verifikatsiya qilindi |
| T-026 | DONE | — | Dashboard Blueprint strip: 15 rasmiy guruh kengligi 3:2:5:3:2:3:3:3:2:5:2:2:5:7:3 nisbatida, 50 savol va 35/5/7/3 section taqsimoti; CI yashil (PR #46) |
| T-027 | DONE | T-014, TASK-UI-009 | Learner `Natijalar tarixi`: backend `/api/exam/history` kontrakti frontend gatewayga ulandi, protected `/history` sahifasi, pagination, loading/error/empty holatlari va desktop/mobile navigation qo‘shildi; server-authoritative ballardan tashqari qayta hisoblash yo‘q |
| T-028 | DONE | T-027 | Frontend + Fastify backend bitta `sarvar9417/attestatsiya` monorepoda: frontend rootda, backend `backend/` ichida; root CI frontend/backend/database qatlamlarini tekshiradi; production backend monorepo `main` commitidan muvaffaqiyatli deploy qilindi |
| T-029 | DONE | T-015, TASK-UI-004 | Figma tasdiqlangan test interfeysi parity: `/exam/*` immersive shell, asosiy savol chapda, nomzod/vaqt/savol navigatsiyasi o‘ngda, 10 ustunli holat palitrasi va legend, light/dark boshqaruv; server timer/scoring va explicit answer submit xulqi saqlanadi |
| T-030 | DONE | T-029, T-027, TASK-UI-009 | Figma/chat post-exam flow: yakuniy Natija ekranidan server-backed savollar tahlili, Natijalar tarixi va Xatolarni qayta ishlashga aniq next-action yo‘llari; answer key faqat finalized sessiondan keyin review endpoint orqali |
| T-031 | DONE | T-030 | UX_SPEC/Figma persistent Natija route: learner faqat o‘z finalized attemptini `/results/:examId`da qayta ochadi; tarix kartalari detailga olib boradi; result endpoint owner-filtered, review faqat finalized sessiondan olinadi |
| T-032 | DONE | T-031, TASK-UI-009 | Xatolar notebook → real retest: due-review sahifasidan `/exam/takrorlash` server sessioniga aniq CTA; `takrorlash`/`zaif` route’lari mockga yashirin fallback qilmaydi; mavjud server-authoritative scoring/timer saqlanadi |
| T-033 | DONE | T-032, T-016 | Onboarding + diagnostika, imtihon sanasi, kunlik maqsad va learner gate `main`da; `20261007131000_onboarding_profile.sql` production Supabase’ga apply qilindi va schema verifikatsiyasi yashil |
| T-034 | DONE | T-032 | Mastery/SRS foundation: append-only evidence, cognitive counters, learning/provisional/stable/regressed state, deterministic 1/3/7/14/30 interval scheduler va authenticated `/api/progress/mastery` read model; PR #57 full CI yashil |
| T-035 | DONE | T-034 | Blueprint-weighted readiness v1 + confidence/coverage + server-prioritized next action (`due review → regressed → diagnostic → learn`); Dashboard fake completion-as-readiness o‘rniga evidence-based readiness ko‘rsatadi; PR #59 full CI yashil |
| T-037 | DONE | T-025, T-033, T-034 | Production Supabase reconcile: frontend/backend envlar to‘g‘ri projectga ulandi; 4 pending migration atomik apply qilindi; question key learner-read policy olib tashlandi; 270 generated savol, onboarding, mastery/SRS va backend DB health verifikatsiya qilindi |

## UI modernizatsiya — Figma approved design

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| TASK-UI-009 | DONE | TASK-UI-008 | Server-backed Xatolarni qayta ishlash sahifasi: due-review ro‘yxati, accuracy ustuvorligi, loading/error/empty/retry, desktop/mobile navigation va full CI yashil |
| TASK-UI-008 | DONE | TASK-UI-007 | Auth, Profile va Reset Password Figma design systemga moslashtirildi; auth/session/validation behaviori saqlandi; duplicate metadata regressiyalari tuzatildi; ResetPassword testlari va full CI yashil |
| TASK-UI-007 | DONE | TASK-UI-006 | QuestionFormModal va savol yaratish/tahrirlash formasi Figma design systemga moslashtirildi; mavjud Y1 save behaviori saqlandi; validation/error holatlari inline ko‘rsatildi; Y2/Y3 cheklovi aniq ko‘rsatildi; regressiya testlari qo‘shildi |
| TASK-UI-006 | DONE | TASK-UI-005 | Admin Modules, Questions va Attempts sahifalari Figma design systemga moslashtirildi; mavjud CRUD/status transition/filter/detail behaviori saqlandi; loading/error/empty holatlari birxillashtirildi; regressiya testlari qo‘shildi |
| TASK-UI-005 | DONE | TASK-UI-004 | Figma admin yo‘nalishiga mos AdminLayout va AdminDashboard redesign qilindi; mavjud typed Supabase count oqimi saqlandi, loading/error/refresh holatlari qo‘shildi, soxta analytics kiritilmadi, regressiya testlari yozildi |
| TASK-UI-004 | DONE | TASK-UI-003 | Figma assessment yo‘nalishiga mos ExamRunner intro, active status va results UI redesign qilindi; server-authoritative timer/scoring/navigation behaviori saqlandi; regressiya testlari kengaytirildi |
| TASK-UI-003 | DONE | TASK-UI-002 | Figma lesson yo‘nalishiga mos TopicView shell yaratildi: stage navigator va nazariya/test/result holatlari vizual birlashtirildi; mavjud content, BookReader va server-check behaviori o‘zgartirilmadi; regressiya testlari qo‘shildi |
| TASK-UI-002 | DONE | TASK-UI-001 | Figma tasdiqlangan Learning va Module/Section overview ekranlari mavjud catalog/progress oqimi bilan implement qilindi; qidiruv, progress va topic ochish behaviori saqlandi; regressiya testlari qo‘shildi |
| TASK-UI-001 | DONE | T-011, T-016 | Figma tasdiqlangan dashboard va asosiy sidebar vizual tizimi mavjud React+Vite arxitekturasida implement qilindi; real catalog/progress/auth ma'lumotlari saqlandi; responsive holat va regressiya testlari qo'shildi |

## Blockerlar

| ID | Tavsif |
|----|--------|
| B-SEC-001 | RESOLVED — repodan chiqarildi va Supabase tomonda rotate qilindi |
| B-DB-001 | RESOLVED — HTTPS read-only audit remote migratsiya metadata jadvali mavjud emasligini ko‘rsatdi |
| B-DB-002 | RESOLVED — legacy liniya arxivlandi, faol UUID baseline va migration history yaratildi |
| B-QA-001 | RESOLVED — CI secret scan, lint, typecheck, unit, build va E2E bilan yashil |
| B-001 | RESOLVED — T-012/T-023: Y1/Y2/Y3 parametrik generatorlar va deterministik SQL seed pipeline yaratildi |
| B-002 | RESOLVED — TypeScript types remote UUID schema bo'yicha generatsiya qilindi |
| B-003 | RESOLVED — server-scored ExamRunner UUID RPC kontraktiga o‘tkazildi |

## Test talabi

Har task uchun kamida:
- happy path
- permission/validation failure
- chegaraviy holat
