## TASK-250 — M02 Y1 test savollari uchun source review

| ID | Status | Natija | Ochiq ish |
|---|---|---|---|
| TASK-250 | IN_PROGRESS | 4 kanonik guruhdagi 34 legacy Y1 savol uchun darslikning sahifa nomzodi, 6 risk flag, regression gate | Savol, kalit va barcha muqobil javoblar ekspert tasdig‘i; 528 ta alohida KTD review bankini hali nashr qilmaslik |

## TASK-249 — M01.05/M01.06 darslik manbalari

| ID | Status | Natija | Ochiq ish |
| --- | --- | --- | --- |
| TASK-249 | IN_PROGRESS | M01.05 100 + M01.06 110 item source trace; avvalgi boblar bilan jami 400/400 provenance holati; 239 topic-supported, 149 partial, 12 source-gap; 400-ID regression gate | Har bir savolning to‘g‘ri kaliti, distractor va izohi ekspert tasdig‘idan o‘tishi; topilmagan 12 page debt; productionga import/publish qilinmagan |

## TASK-248 — M01.04 savollarini darslik sahifalari bilan tekshirish

| ID | Status | Qamrov | Qolgan talab |
| --- | --- | --- | --- |
| TASK-248 | IN_PROGRESS | `ARS-03` dagi 70 item: 42 topic-supported, 25 partial, 3 source-gap, `M0104ItemSourceTrace.test.ts` | Barcha variant/explanationlar ekspert ko‘rigidan o‘tishi; M01.05 100 va M01.06 110 source-review; production publish/deploy yo‘q |

## TASK-247 — M01 400 savol source/numeric QA

| ID | Status | Scope | Open gate |
| --- | --- | --- | --- |
| TASK-247 | IN_PROGRESS | M01.02 va M01.03 uchun 120 individual PDF sahifa reyestri; 81 oldingi + 84 yangi = 165 hisobli savol mustaqil formula bilan nazorat qilinadi | 81 topic-supported / 34 partial / 5 source-gap; 280 boshqa savol source-trace va barcha 400 itemning ekspert tekshiruvi; ishlab chiqarish muhitiga o‘zgartirish yo‘q |

## TASK-244 — Y2 matching UX va javob kontrakti

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-244 | IN_PROGRESS | TASK-240 | Mavzu testlarida takror/o‘rinsiz/bo‘sh Y2 moslashtirishni bloklash, tanlovlar qayta renderda barqarorligi, klaviatura uchun label va testlar; source-validity expert approval alohida. Merge/deploy yo‘q. |

## TASK-243 — M02 nazariya va dizayn auditi (2026-10-19)

| ID | Status | Scope | Natija / qolgan talab |
| --- | --- | --- | --- |
| TASK-243 | IN_PROGRESS (release BLOCKED) | M02.01–04, 2026 spetsifikatsiyasi, 9 legacy bo‘lim va 13 ICT/Cambridge+ manbadan M02 qamrovi | 36 ta tarixiy/statik matn va kalitga oid aniqlashtirish; 7 noto‘g‘ri `Y2`→`Y1` static savol; 2 source jadvalning to‘liq ko‘rinishi; sarlavha sahifa oxirida qolmasligi; regressiya testlari va `docs/TASK243_M02_SOURCE_AND_DESIGN_AUDIT_20261019.md`. To‘liq source-concordance, auth E2E, real mobil/desktop UI va yakuniy CI hali release shartlari. Merge/deploy/DB write yo‘q. |

## TASK-242 — M01 nazariya manba va dizayn auditi (2026-10-19)

| ID | Status | Scope | Natija / qolgan shart |
| --- | --- | --- | --- |
| TASK-242 | IN_PROGRESS (review gate) | M01.01–M01.12, 2026 spetsifikatsiyasi, ICT/Cambridge+ 5–11, LaTeX konverter, kitob UI | 10 ta misol sarlavhasi + `\\difficulty` noto‘g‘ri renderi tuzatildi; 12 mavzu, 10 diagramma va dastlabki manba qamrovi regressiya bilan himoyalandi. To‘liq sahifama-sahifa ekspert tekshiruvi, mobil/desktop real UI va authenticated learner E2E hali ochiq. `docs/TASK242_M01_SOURCE_AND_DESIGN_AUDIT_20261019.md`. Merge/deploy/production migration yo‘q. |

## TASK-240 — Informatika savollar banki chuqur sifat nazorati

| ID | Status | Dependency | Natija yoki qolgan shart |
|---|---|---|---|
| TASK-240 | DONE | TASK-060, TASK-063 | 5 966 aktiv savol bo‘yicha avtomatik chuqur QA va source-corpus solishtiruvi bajarildi. Ekspert dalilisiz xato published qilingan 380 ta S5.WEB/GV2 savol productionda immutable archive + yangi review revision orqali karantinga olindi; publication/fingerprint/immutability guard, regression, audit SQL va `docs/TASK240_INFORMATIKA_QUESTION_BANK_DEEP_QA.md` qo‘shildi. Ochiq ekspert release shartlari hisobotda qayd etilgan. |

## TASK-239 — Office V2 grafik savollarini yakunlash
| ID | Status | Dependency | Natija / release sharti |
|---|---|---|---|
| TASK-239 | IN_PROGRESS (release BLOCKED) | M03 9 review dars / 270 review/draft savollar | PR #178: 7 SVG, frontend allowlist, 7 draft→review migratsiya va testlar; qolgan: CI, Vercel deploy limiti, tasdiqlangan ekspert QA, production smoke. **Kontentni avtomatik publish qilish mumkin emas.** |

## TASK-230–238 — Shaxsiy test konstruktori: kod, QA va release

| ID | Status | Dependency | Natija yoki qolgan shart |
|---|---|---|---|
| TASK-230 | DONE | TASK-210 | Published/active construct filtri va exact SQL quotas |
| TASK-231 | DONE | TASK-230 | Owner-only finished analytics: lesson/A–E/Y1–Y3 |
| TASK-232 | DONE | TASK-231 | Active exam resume, saved answers, idempotent start |
| TASK-233 | DONE | TASK-232 | Learning-only submitted feedback va exact equal quotas |
| TASK-234 | DONE | TASK-233 | Admin-only source-backed, keyless coverage |
| TASK-235 | DONE | TASK-234 | Fresh database/backend/frontend/Playwright mobile CI; PR #168 merged |
| TASK-236 | DONE | TASK-235 | Owner isolation, prefinish secrecy va keyless resume regressions; PR #172 merged |
| TASK-237 | BLOCKED | TASK-236 | Authenticated staging learner/admin acceptance: independent, cost-approved Supabase staging kerak |
| TASK-238 | BLOCKED | TASK-237 | Production migrations va Vercel release: owner release authorization va smoke kerak |

> TASK-230–236 kodi GitHub main branch'iga merge qilingan; PR #168 commit 75a079744211 va PR #172 commit 792dd6a2aee0. TASK-230–234 yangi migrations productionga qo‘llanmagan. Staging qoidalari docs/TASK237_CUSTOM_BUILDER_STAGING_ACCEPTANCE.md.

## TASK-214 — Grafika va veb-texnologiyalar: qo‘shimcha Y2/Y3

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-214 | IN_PROGRESS | TASK-213 review-only bank | 5 × (8 Y2 + 8 Y3) = 80 yangi original topshiriq; jami 380 (280/50/50), bazaga qo‘shimcha review migratsiyalari va testlari. Qolgan ekspert ko‘rigi / release shartlari: `docs/TASK214_GRAPHICS_WEB_380_Y2_Y3.md`. |

## TASK-213 — Grafika va veb-texnologiyalar V2 integratsiyasi

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-213 | IN_PROGRESS | M10/M11 original lessons + active `S5.WEB` constructs | 6 review lessons + 300 review questions (Y1/Y2/Y3), 8 SVG, additive migrations, fresh DB invariant, guarded editorial approval and production verification; see `docs/TASK213_GRAPHICS_WEB_V2_INTEGRATION.md` |

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
| T-025 | DONE | T-024 | 270-savollik versiyalangan migration production `plyqezulrfowyblsfpzy` Supabase’ga apply qilindi; remote history exact version bilan reconciled va generated savollar soni 270 bilan verifikatsiya qilindi |
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
| T-037 | DONE | T-025, T-033, T-034 | Production Supabase reconcile: 4 pending migration productionga atomik apply qilindi; 270 generated savol, onboarding, mastery/SRS, question-key policy va backend DB health verifikatsiya qilindi |
| T-038 | DONE | T-037 | Frontend + Fastify backend bitta `attestatsiya` Vercel projectida: root `/api/*`, production same-origin API, bitta env boundary; production deploy READY, `/api/health` va `/api/content/modules` yashil, eski `attestatsiya-backend` project PAUSED |
| T-039 | DONE | T-034, T-035, T-038 | Adaptive practice selector: 10 savol, 50/25/15/10 target, immediate exact retry yo‘q, exposure penalty va fallback audit metadata |
| T-040 | DONE | T-039 | Published savol → objective/source/cognitive/difficulty coverage auditi; M01 matrix, orphan/mis-tagged va traceability issue report, admin `/admin/coverage` |
| T-041 | DONE | T-040 | Objective-complete topic-test assembler: configurable 10–50, required/critical objective hard slots, insufficient-pool no-session guard, key/taxonomy validation va low-exposure preference |
| T-042 | DONE | T-038 | Single-Vercel cleanup: standalone backend Vercel config olib tashlandi, root `/api/*` entry CI typecheck bilan himoyalandi, production same-origin API regressiya testi qo‘shildi, backend README/project state bitta origin bilan reconcile qilindi; CI #792 yashil |\n| TASK-043 | DONE | T-041, T-042 | Xususiy M01 professional bank import/audit: 570 savolni public Gitga answer key sizdirmasdan admin-only batch import qilish, REVIEW staging, objective/source metadata, idempotency va audit log |\n| TASK-044 | DONE | TASK-043 | M01 50-savollik section mock: topic/critical objective coverage, deterministic feasibility, unseen preference, 45/50 + critical floor, audited assembly metadata |
| TASK-045 | DONE | TASK-044 | Rasmiy 2026 full mock: 50 savol, 120 daqiqa, active blueprint bo‘yicha exact group×cognitive kvota, preflight feasibility, unseen preference, audit metadata |
| TASK-046 | DONE | TASK-045 | Xususiy 570 savollik professional bank payloadini strukturaviy validatsiya, taksonomiya tekshiruvi, formula-risk auditi va xavfsiz importga tayyorlash |
| TASK-047 | DONE | TASK-046 | M09 ma’lumotlar bazasi bo‘limi uchun 5 ta active S4.DB konstruktni qamrab oluvchi source-backed darslar, source trace va DB regressiya testi |
| TASK-048 | DONE | TASK-047 | M14 kasb standarti uchun 7 ta KS konstruktga source-backed darslar, rasmiy source registry va DB regressiya |
| TASK-049 | DONE | TASK-048 | M16 informatika o‘qitish metodikasi uchun PM.MET.01–03 source-backed darslar, source trace va DB regressiya |
| TASK-050 | DONE | TASK-049 | M15 umumiy pedagogika uchun PM.GEN.01–08 source-backed darslar, source trace, final source-gap closure va DB regressiya |
| TASK-051 | DONE | TASK-050 | M02 kompyuter tizimlari uchun S2.HW.01–04 source-backed darslar, source trace va DB regressiya |
| TASK-052 | DONE | TASK-051 | M03 Microsoft Office uchun S2.OFFICE.01–04 source-backed darslar, source trace va DB regressiya |
| TASK-053 | DONE | TASK-052 | A3: M04/M05/M06 uchun S3.LOGIC, S3.NUM va S3.ALGO source-backed darslar va DB regressiya |
| TASK-054 | DONE | TASK-053 | A4: M07/M08 uchun S4.BLOCK va S4.CODE source-backed dasturlash darslari va DB regressiya |
| TASK-055 | DONE | TASK-054 | M10/M11 uchun S5.WEB.01–06 source-backed grafika va veb darslari, aniq construct mapping va DB regressiya; PR #82 |
| TASK-056 | DONE | TASK-055 | M12/M13 uchun S6.NET.01–05 va S7.SEC.01–06 source-backed tarmoq, xavfsizlik va raqamli xizmat darslari; PR #84 |
| TASK-057 | DONE | TASK-056 | 77/77 active official construct uchun published lesson coverage CI invariant; topilgan S1.INFO.06 bo‘shlig‘i source-backed uzatish tezligi darsi bilan yopildi; PR #85 |
| TASK-058 | DONE | TASK-057 | Project state/TASKS reconciliation: auth va production activation blockerlarini, qolgan question-bank coverage ishini aniq qayd etish; PR #86 |
| TASK-059 | DONE | TASK-057 | Blueprint bo‘yicha real question-pool feasibility auditi: production assembler eligibility bilan bir xil published+keyed+active taxonomy qoidalari, group × cognitive exact deficit, AC-CNT-04 release reserve va admin UI; PR #87 |
| TASK-060 | DONE | TASK-059 | Source-backed savol banklarini spetsifikatsiya bo‘yicha kengaytirish yakunlandi: private AXB 570/570 productionda (540 published, 30 review quarantine); 17 ta exact gapfill + 334 ta reserve = 351 ta public source-backed Y1 savol qo‘shildi; official 50/50 feasibility va AC-CNT-04 har required group×cognitive slot uchun ≥20 candidate bilan 0-deficit |
| TASK-061 | DONE | TASK-057 | Yuqori amaliy og‘irlikdagi S5.WEB/S6.NET/S7.SEC darslariga worked code, IP/maska hisoblash, xavfsizlik scenario va Web-Freelance workflow qo‘shildi; 7 ta lesson uchun DB regression invariant |
| TASK-062 | DONE | TASK-060 | Rasmiy S1.INFO taxonomy reconciliation: “axborotni saralash va xulosa chiqarish” S1.INFO.08 bilan yopildi; private AXB 570/570 strukturaviy auditdan o‘tdi va productionga xavfsiz import qilindi; keyingi source/construct review natijalari TASK-060/TASK-063 da yuritiladi |
| TASK-063 | DONE | TASK-062 | Private bank + multi-format reconciliation yakunlandi: 540 AXB published, 30 supplementary review-only quarantine; 24 ta Y2 + 24 ta Y3 source-backed savol productionga published qilindi; M02/M05 canonical stable lesson ID/construct mapping production drifti xavfsiz reconcile qilindi; regression testi Y2/Y3 key shape, check_answer va source-lesson mappingni qoplaydi |
| TASK-064 | DONE | T-016 | Password recovery stability kodi current main’ga PR #112 bilan merge qilindi va production Vercel deployment `dpl_8uzytLVAJKAReW7zrWbr8Rs6gNz5` READY; recovery token snapshoti rerender/fallback race’ni yopadi, reset redirect canonical va URL secret boundary qattiqlashtirilgan. Final real-email acceptance B-AUTH-001 da alohida qoladi |

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
| B-AUTH-001 | OPEN — signup/recovery code tuzatishlari PR #90/#94 bilan main’ga merge qilingan; yakuniy production acceptance uchun Supabase redirect allowlist + SMTP/email template va real-email E2E (register → verify → login → forgot → reset → login) hali talab qilinadi |
| B-PROD-001 | RESOLVED — Supabase `sarvar9417` connection orqali production project `plyqezulrfowyblsfpzy` ko‘rinadi; 2026-10-12 kuni S1.INFO.08 reconciliation migrationi muvaffaqiyatli apply qilindi va private bank import qilindi |
| B-CONTENT-001 | RESOLVED — TASK-060/TASK-063 production auditi: official 50-question exact group×cognitive feasibility 0-deficit; AC-CNT-04 bo‘yicha har required slot uchun ≥20 eligible published+keyed+active-taxonomy candidate; Y1 bank ustiga 24 Y2 + 24 Y3 source-backed item qo‘shildi |

## Test talabi

Har task uchun kamida:
- happy path
- permission/validation failure
- chegaraviy holat
## Pedagogika source-bank sifat nazorati — 2026-10-16

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| TASK-200 | IN_PROGRESS | TASK-050, TASK-060 | 4 tarixiy PDFdan 15 ta yangi, uzunligi mutanosib, manbasi verified Y1 savol production REVIEWga import qilindi (7 KS + 8 PM.GEN); SQL regressiya passed; 649 candidate qolgan qamrov, published bank bias remediation, expert approval va Testlar/Maxsus pedagogika UI acceptance hali OPEN. Batafsil: docs/TASK200_PEDAGOGY_BALANCED_BATCH.md |

| TASK-201 | IN_PROGRESS | TASK-200 | Pedagogika chuqur audit: KS/PM editorial publication gate, immutable published question snapshotlari, 15-item distinct construct/random tie-break, yangi SQL security regressiya va production verifikatsiya. 118 biased legacy Y1 hamda editorial review UI alohida OPEN. Audit: docs/TASK201_PEDAGOGY_DEEP_AUDIT.md |

| TASK-203 | IN_PROGRESS | TASK-202 | 424 production published questions; 249 owner-batch approvals (82 AI-edited wrong-option sets), no review. Git parity via six maintenance-only replay scripts, QA regression and precise provenance; CI and one merge required. Existing 118 legacy proposals and PR #127 security blockers remain separate. Docs: docs/TASK203_PEDAGOGY_OWNER_APPROVAL_PARITY.md |
| TASK-202 | IN_PROGRESS | TASK-201 | Bitta yakuniy pedagogika release branchida: 649 PDF private source triage, 155 tekshirilgan unlinked source uchun original REVIEW authoring UI, barcha KS/PM savollari bo‘yicha paginated editor va source filters, human editorial checklist, 118 length-biased published itemlar uchun review revision queue, safe atomik publish/archive va Y1/Y2/Y3 key xavfsizligi; **human signoff + final CI + one merge + one deploy** hali OPEN. PR #121 DRAFT; yakunda yangi user buyrug‘isiz release taqiqlangan. See docs/TASK202_ONE_FINAL_PEDAGOGY_RELEASE.md |


| TASK-211 | IN_PROGRESS | TASK-056 | M13 “Axborot xavfsizligi va raqamli xizmatlar”: 7 yangi nazariya, 210 source-backed didaktik test, `review` migratsiya, oldingi published kontent saqlangan. Draft PR #145. Ekspert tasdiqlashi, local migration DB QA, lesson resolver/topic test E2E va alohida production release tasdig‘i OPEN. Docs: `docs/content/TASK-211-M13-AXR.md`. |

## TASK-210 — Universal shaxsiy test konstruktori

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-210 | IN_PROGRESS | T-013, T-014, T-015 (DONE) | RFC + backend/API + atomic DB generator, answer-leak guard, universal UI, history and SQL/backend/Playwright regressiyalar branchda ishlangan va CI yashil. Preset CRUD/RLS, microtopic filtr, analytics, resume, production verification OPEN. [RFC](docs/TASK210_UNIVERSAL_CUSTOM_TEST_BUILDER.md), [status](PROJECT_STATE.md), [PR #144](https://github.com/sarvar9417/attestatsiya/pull/144). |

| TASK-212 | IN_PROGRESS | TASK-202/TASK-203 (audit only) | Pedagogika hub va 2026 spesifikatsiya 18-maqsad xaritasi; M15/M16 matn tuzatishlari, nullable verdict regressiyasi; 2026-10-18 production SELECT auditida 424 published, 26 KS review; M14ning 7/7 mavzusida published-keyed 20 pool deficit (3+3+2+6+4+4+4). Editorial expert approval, full preflight, mobil E2E va release hali OPEN. DRAFT PR #149; docs/TASK212_PEDAGOGY_UNIFIED_READINESS_AUDIT_20261018.md. |
