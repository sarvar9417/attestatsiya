## Private 570-item professional bank validation (TASK-046, 2026-10-08)

- **Holat:** DONE — local 570/570 extraction+validation passed; PR #71 CI #887 yashil.
- **Branch:** `task/TASK-046-private-bank-validation`.
- **Maqsad:** 19 bob × 30 = 570 savollik xususiy payloadni Git'ga qo‘ymasdan importdan oldin qat’iy tekshirish.
- **Validator:** `npm run content:private-bank:validate -- <private.json>`.
- **Invariantlar:** 570/570 ID, 4 variant, answer-key index, active construct kodi, A–E → cognitive/difficulty kontrakti, source locator va PDF sahifa metadata.
- **Xavfsizlik:** private payload patternlari `.gitignore`ga qo‘shildi; validator faqat aggregate diagnostika va ID-level warning chiqaradi.
- **Formula audit:** sanoq sistemasi, birliklar, bit/s/baud kabi tipografiyasi ekstraksiyada buzilishi mumkin bo‘lgan savollar source PDF bilan REVIEW bosqichida tekshirish uchun flag qilinadi.

## Official 2026 full mock (TASK-045, 2026-10-08)

- **Holat:** DONE — PR #70 merged; CI #878 yashil.
- **Branch:** `task/TASK-045-official-full-mock`.
- **Assembler:** `generate_official_mock()` active blueprint bo‘yicha group_code × cognitive kvotalarni aynan yig‘adi yoki exam yaratmasdan feasibility xatosi qaytaradi.
- **Kontrakt:** 50 savol, 120 daqiqa, 8 bilish + 35 qo‘llash + 7 mulohaza; 15 blueprint quota guruhi saqlanadi.
- **Eligibility:** faqat published + answer-key mavjud + active taxonomy va group-code mos savollar.
- **Tanlash:** unseen → kam exposure → eng eski exposure → stable ID.
- **Audit:** `selection_meta` blueprint versiyasi, quota coverage, cognitive totals, pool va unseen statistikani snapshot qiladi.
- **Xavfsizlik:** start payload answer key chiqarmaydi; RPC faqat authenticated.
- **QA:** PostgreSQL regressiya 3 ta assemblyda 50 unique, exact kvota, 8/35/7, 7200 s va ACL invariantlarini tekshiradi; backend test mock start dedicated RPC va feasibility mappingni tekshiradi.

## M01 50-savollik section mock (TASK-044, 2026-10-08)

- **Holat:** DONE — PR #69 merged; CI #848 yashil.
- **Branch:** `task/TASK-044-m01-section-mock`.
- **Assembler:** `generate_section_mock(module_id)` har safar aynan 50 ta published/keyed/taxonomy-valid savol yig‘adi yoki session yaratmasdan feasibility xatosi qaytaradi.
- **Qamrov:** savol pool'i bor har bir published topic uchun kamida 1 hard slot; har bir critical objective uchun konfiguratsiyadagi `min_questions` hard floor.
- **Tanlash:** unseen → kam exposure → eng eski exposure tartibida; stable ID tie-break bilan auditable.
- **Pass:** 45/50 va barcha critical objective floor'lari bajarilishi shart; natija `selection_meta.completion`da snapshot qilinadi.
- **Perfected unseen:** yetarli yangi pool mavjud bo‘lsa birinchi 50/50 unseen selection metadata bilan isbotlanadi.
- **QA:** DB regressiya testi 20 ta assemblyni tekshiradi: 50 unique item, topic qamrovi, critical qamrov, 45/50 pass boundary, critical-floor fail boundary va RPC permission.
- **Vaqt:** section mock uchun 6000 s (100 min); rasmiy attestatsiya mockining 120 daqiqalik va 50 savollik formati alohida full-mock lane’da saqlanadi.

## M01 professional bank secure import (TASK-043, 2026-10-08)

- **Holat:** DONE — CI #817 quality + backend + database yashil.
- **Branch:** `task/TASK-043-m01-professional-bank`.
- **Maqsad:** 570 savollik xususiy professional bankni public Git tarixiga savol matni/javob kalitlarini kiritmasdan production oqimiga tayyorlash.
- **Import boundary:** faqat faol admin backend orqali `POST /api/admin/question-bank/import`; backend service-role RPC chaqiradi.
- **Staging:** import qilingan savollar avtomatik publish qilinmaydi, `review` holatida qoladi.
- **Idempotency:** `m01-professional-bank:<external_id>` source reference bo‘yicha takroriy import skip qilinadi.
- **Xavfsizlik:** RPC `anon` va `authenticated` uchun yopiq, faqat `service_role`; RPC ichida actor faol admin ekanini ham qayta tekshiradi.
- **Audit:** har import qilingan savol `audit_log`ga external ID, construct va source metadata bilan yoziladi.
- **QA:** schema validation testi va PostgreSQL happy/idempotent/invalid-construct/non-admin/ACL regressiya testi qo‘shildi.
- **Kontent siyosati:** bank payloadi alohida xususiy import artefakti bo‘ladi; public repo ichiga answer key yoki to‘liq bank yozilmaydi.\n- **Handoff:** admin-only endpoint, service-role RPC, CLI uploader va DB regressiya testlari tayyor. Production Supabase migratsiyasi repo merge/deploydan keyin alohida qo‘llanishi kerak; xususiy 570-item payload public Gitga kiritilmaydi.


## Xatolarni qayta ishlash UI (TASK-UI-009, 2026-10-07)

- **Yangi learner route:** `/review` protected route sifatida qo‘shildi.
- **Real backend data:** sahifa `progressGateway.getDueReviews()` orqali
  `GET /api/exam/due-reviews` endpointidan server-calculated review queue oladi.
- **Prioritet:** konstruktlar aniqligi bo‘yicha pastdan yuqoriga tartiblanadi;
  70% dan past natijalar “Mustahkamlash kerak” sifatida ajratiladi.
- **UX:** loading skeleton, empty state, API error, retry, refresh, summary
  metrikalari va mavzularni mustahkamlash linki qo‘shildi.
- **Navigation:** desktop Sidebar va mobile bottom navigation ichiga
  “Xatolarni qayta ishlash / Xatolar” qo‘shildi.
- **Xavfsizlik:** learner sahifaga answer key chiqarilmaydi; fake attempt
  history yaratilmaydi; faqat amaldagi due-review kontrakti ishlatiladi.
- **Test:** ReviewPage server data, empty state va failure→retry holatlari bilan
  testlandi; full CI database + quality + Playwright yashil.

### Handoff

```text
Task: TASK-UI-009
Natija: real server-backed due-review learner sahifasi tayyor
Route: /review
Data source: GET /api/exam/due-reviews
O‘zgargan asosiy fayllar: ReviewPage.tsx, App.tsx, Sidebar.tsx, MobileBottomNav.tsx, ReviewPage.test.tsx
Keyingi tavsiya: learner uchun “Natijalar tarixi”ni qurishdan oldin backendda faqat o‘z attemptlarini list qiladigan endpoint qo‘shish; admin attempts endpointini learnerga ochmaslik
```


## Answer-key Data API hardening (2026-10-07)

- **Invariant aniqlashtirildi:** `question_keys` learner klient uchun hatto savol uning o‘z examida bo‘lsa ham o‘qilmaydi; baholash server-authoritative bo‘lib qoladi.
- **Migration:** `20261007000018_question_keys_staff_only.sql` eski learner-own-exam SELECT policy'ni olib tashlaydi va `editor/admin` uchun staff-only CRUD policy yaratadi.
- **Data API grant:** `authenticated` roliga CRUD privilege beriladi, ammo RLS oddiy learner uchun barcha qatorlarni yopadi; `anon` privilege'lari revoke qilinadi.
- **Regression:** `rls_product_access.test.sql` learner own-exam key uchun ham 0 qator, admin uchun fixture keylar ko‘rinishini talab qiladi.


## Domain/RLS va product-flow qamrovi (T-007, 2026-10-07)

- **RLS matrix:** learner draft modulni va boshqa foydalanuvchining exam ma'lumotini
  ko‘rmasligi, faqat o‘z examini ko‘rishi va hech qanday `question_keys` qatorini
  o‘qimasligi; admin esa staff scope'ni ko‘rishi PostgreSQL regression testi bilan qamrab olindi.
- **Supabase parity:** standalone PostgreSQL CI fixture Supabase API rol grantlarini transaction
  ichida emulyatsiya qiladi; policy semantikasi production RLS bilan tekshiriladi va rollback qilinadi.
- **Protected product flow:** Playwright valid session → mock sinovni boshlash → Y1 javobni
  saqlash → yakunlash → server-authoritative ball, guruh kesimi va foiz natijasini tekshiradi.
- **CI:** secret scan, lint, typecheck, unit, parametric generated-pool invariantlari,
  production build, Playwright E2E, fresh migration chain, generated DB pool va remote drift
  reconciliation to‘liq yashil.

### Handoff

```text
Task: T-007
Natija: domain/RLS va protected product-flow regressiya qamrovi ishlab turibdi
O‘zgargan fayllar: supabase/tests/rls_product_access.test.sql; src/tests/e2e/exam-product-flow.spec.ts; .github/workflows/ci.yml; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo‘q
CI: quality + database — SUCCESS
Qolgan blocker: T-001..T-024 foundation registry bo‘yicha ochiq blocker qolmadi
```


## Admin UUID schema reconciliation (T-006, 2026-10-07)

- **Stale blocker yopildi:** tarixiy T-006 tavsifi admin sahifalari legacy BIGINT/type qatlamiga bog‘langan davrdan qolgan edi.
- **Amaldagi holat:** UUID database types allaqachon T-008 bilan joriy qilingan; AdminDashboard typed Supabase count oqimidan, Modules/Questions/Attempts esa amaldagi UUID/content API kontraktlaridan foydalanadi.
- **Regression evidence:** TASK-UI-005 va TASK-UI-006 admin sahifalari uchun regressiya testlarini qo‘shgan; main branch CI secret scan, lint, typecheck, unit, production build, Playwright smoke va database job bilan yashil.
- **Legacy isolation:** BIGINT sxema faqat archive/pre-baseline va tarixiy import yordamchilarida qolgan; runtime admin source ichida faol legacy BIGINT schema topilmadi.
- **Natija:** T-006 endi blocker emas; T-007 QA/domain/RLS product-flow qamrovi keyingi qolgan asosiy task.

### Handoff

```text
Task: T-006
Natija: admin panel UUID schema/type bilan reconcile qilingan; stale BLOCKED status DONE ga yangilandi
Kod o‘zgarishi: yo‘q — oldingi T-008, TASK-UI-005 va TASK-UI-006 ishlari blocker sababini allaqachon bartaraf qilgan
Tasdiq: main CI success + admin regressiya testlari + runtime source audit
Keyingi task: T-007 — domain/RLS va product-flow QA qamrovini kengaytirish
```

# PROJECT_STATE.md — joriy holat

> Living document. Har coder task boshlaganda va tugatganda yangilaydi.

## Holat

- Loyiha bosqichi: `DEVELOPMENT`
- Joriy milestone: `P0 — xavfsizlik va barqarorlashtirish`
- Oxirgi yangilanish: `2026-10-06`
- Production mavjud: `ha`
- Database project mavjud: `ha (plyqezulrfowyblsfpzy, Singapore)`
- Deployment mavjud: `ha — bitta Vercel project/origin: attestatsiya-five.vercel.app; frontend /, backend /api/*`

## Tasdiqlangan asos

- **Stack:** React + Vite, TypeScript strict, Tailwind CSS, Zustand
- **Database:** Supabase (PostgreSQL), UUID PK, enum turlari, RLS
- **Autentifikatsiya:** email/parol ishlaydi; barcha auth amallari
  frontend → Fastify backend → Supabase orqali (browser supabase-js
  auth ishlatmaydi); anonymous upgrade hali implement qilinmagan
- **Kontent tuzilmasi:** learner o'qi 16 modul (M01–M16); assessment blueprint alohida o'q
- **Imtihon kontrakti:** 50 savol, 120 daqiqa, Y1/Y2/Y3 formatlar
- **Kognitiv kontrakt:** bilish (8) + qo'llash (35) + mulohaza (7) = 50
- **DB yozuv operatsiyalari:** RPC-only maqsad; amaldagi policy va RPC'lar xavfsizlik auditida
- **question_keys:** rasmiy mock client bundle'dan chiqarilgan; practice kontenti mastery uchun authoritative emas
- **Til:** o'zbek lotin yozuvi

## DB holati — oldingi remote kuzatuv, audit talab qilinadi

| Jadval | Soni |
|--------|------|
| subjects | 1 (Informatika) |
| modules | 16 ta learner moduli, `M01`–`M16` |
| constructs | 150 total: 76 active rasmiy + 74 inactive legacy |
| lessons | 3 (M01 ga tegishli) |
| lesson_constructs | 4 |
| blueprints | 1 active (2026, 50 savol, 120 daqiqa, 2 ball) |
| blueprint_quotas | 15; jami 50 / 8 bilish / 35 qo'llash / 7 mulohaza |
| questions | 5 (Y1 sample) |
| question_options | 20 |
| question_keys | 5 |
| RPC/functions | 19 (`start_exam`, `submit_answer`, `finish_exam`, profile guard va h.k.) |

### 2026-07-30 read-only remote audit

- Remote’da eski BIGINT ustunlari yo‘q; UUID sxema faol.
- `supabase_migrations.schema_migrations` remote’da mavjud emas; amaldagi
  sxema CLI migration history bilan baseline qilinmagan.
- 9 ta modulning barchasi `published`.
- Faol blueprint 50 savol va 2 ballni saqlaydi, ammo `duration_min = 150`.
- 9 ta kvota jami `33 bilish / 5 qo‘llash / 12 mulohaza`; rasmiy
  `8 / 35 / 7` kontraktiga zid.
- Audit anon REST orqali faqat o‘qish rejimida bajarildi; remote yozuv
  o‘zgartirilmadi.

### 2026-07-30 P0-003 remote reconciliation

- `supabase_migrations.schema_migrations` yaratildi va `00000/00008/00009`
  versiyalari ro‘yxatdan o‘tkazildi.
- Mavjud UUID sxema `00000` baseline sifatida belgilandi; baseline DDL remote’da
  qayta ishlatilmadi.
- Remote taxonomy `M01`–`M16`, 15 blueprint guruhi va 76 active rasmiy
  konstruktga reconcile qilindi.
- 74 legacy konstrukt va ularga bog‘langan questionlar o‘chirilmay `inactive`
  holatda saqlandi.
- Postflight Management API va anon REST orqali `16 / 15 / 50 / 8-35-7 / 120`
  invariantlari tasdiqlandi.

### 2026-07-30 P0-004 remote security hardening

- `20260730000010_rpc_security_hardening.sql` remote’da qo‘llandi va migration
  history’ga atomik yozildi.
- Oddiy authenticated foydalanuvchi o‘z `role` yoki `is_blocked` qiymatini
  o‘zgartira olmaydi; admin boshqaruv yo‘li saqlandi.
- `submit_answer` exam egasi va question membership’ni kalitdan oldin
  tekshiradi, `finish_exam` bilan bir xil lock tartibidan foydalanadi.
- Birinchi answer immutable: retry avvalgi natijani qaytaradi va SM-2 ni qayta
  hisoblamaydi; anonymous execute huquqi olib tashlandi.
- Remote postflightda trigger, RPC definition va permissionlar tasdiqlandi;
  `profiles=1`, `exams=0`, `exam_items=0`, `user_construct_stats=0` sonlari
  migratsiyadan oldin va keyin o‘zgarmadi.

## Faol tasklar

| Task | Egasi | Holat | Boshlangan vaqt | Branch |
|------|-------|-------|-----------------|--------|
| T-016 | AI sessiya | DONE | 2026-07-31 | task/T-016-auth-frontend |
| T-017 | AI sessiya | DONE | 2026-07-31 | task/TASK-017-m01-content-db |
| T-018 | AI sessiya | DONE | 2026-07-31 | task/TASK-018-vercel-env-fix |
| T-019 | AI sessiya | DONE | 2026-07-31 | task/TASK-020-qora-ekran-tuzatishlar |
| T-021 | AI sessiya | DONE | 2026-07-31 | task/TASK-021-backend-git-deploy |
| T-022 | AI sessiya | DONE | 2026-07-31 | task/TASK-022-backend-own-repo |
| T-012 | AI sessiya | DONE | 2026-10-06 | task/T-012-parametric-generators |
| T-013 | AI sessiya | DONE | 2026-10-06 | task/T-013-exam-runner-start |
| T-014 | AI sessiya | DONE | 2026-10-07 | task/T-014-result-decision |
| T-015 | AI sessiya | DONE | 2026-10-07 | task/T-015-mock-flags |
| T-023 | AI sessiya | DONE | 2026-10-07 | task/T-021-generated-db-pool |
| T-024 | AI sessiya | DONE | 2026-10-07 | task/T-024-generated-sql-artifact |
| T-025 | AI sessiya | BLOCKED | 2026-10-07 | task/T-025-versioned-parametric-migration |
| TASK-UI-001 | AI sessiya | DONE | 2026-10-06 | task/TASK-UI-001-figma-dashboard |
| TASK-UI-005 | AI sessiya | DONE | 2026-10-06 | task/TASK-UI-005-admin-dashboard |
| TASK-UI-006 | AI sessiya | DONE | 2026-10-06 | task/TASK-UI-006-admin-content-pages |
| TASK-UI-007 | AI sessiya | DONE | 2026-10-06 | task/TASK-UI-007-question-form |
| TASK-UI-008 | AI sessiya | DONE | 2026-10-07 | task/TASK-UI-008-auth-profile-refresh |
| TASK-UI-009 | AI sessiya | DONE | 2026-10-07 | task/TASK-UI-009-error-review |

## Generated pool PostgreSQL verification (T-024, 2026-10-07)

- **Maqsad:** T-023 builder chiqargan 270 ta parametrik savol SQL'ini real fresh PostgreSQL CI'da bajarib, faqat TypeScript invariantlariga emas, DB kontraktiga ham bog'lash.
- **CI oqimi:** database job Node 24 + `npm ci` bilan generatorni ishga tushiradi, `supabase/generated/parametric_questions.sql` hosil qiladi va bir xil fresh DB'ga ikki marta qo'llaydi.
- **Idempotency:** generator SQL deterministic UUIDv5 va `ON CONFLICT DO NOTHING` ishlatgani uchun ikkinchi qo'llash row sonini oshirmasligi shart.
- **DB assertionlar:** jami 270 savol; 9 rasmiy konstruktning har birida 30 tadan; 270 ta question key; Y1=4, Y2=8, Y3=3 option kontrakti; Y1/Y2/Y3 payload option FK semantikasi tekshiriladi.
- **Xavfsizlik:** answer key learner-visible `questions` yoki `question_options`ga kiritilmaydi; kalitlar faqat `question_keys`da qoladi va amaldagi RLS siyosati saqlanadi.
- **Registry reconciliation:** T-013, T-014 va T-015 PR #30–#32 orqali merge qilingan real holatga mos ravishda DONE qilindi; B-001 resolved deb belgilandi.

### Handoff

```text
Task: T-024
Natija: generated parametrik pool fresh PostgreSQL CI’da ikki marta apply qilinib, DB invariantlari yashil tasdiqlandi
O'zgargan fayllar: .github/workflows/ci.yml; supabase/tests/parametric_generated_pool.test.sql; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo'q — generated SQL CI artefakti sifatida runtime yaratiladi
Tekshiruv: CI database job generated SQL'ni ikki marta apply qiladi va assertion SQL bilan tekshiradi
Keyingi task: T-025 — Supabase CLI orqali versiyalangan content migration yaratish va remote migration history bilan reconcile qilish
```

## Versioned parametric content migration (T-025, 2026-10-07)

- **Supabase CLI tekshiruvi:** pinned CLI `2.119.0` GitHub Actions runnerida
  `supabase --help`, `supabase migration --help` va
  `supabase migration new --help` orqali tekshirildi.
- **Migration Supabase CLI bilan yaratildi:** 
  `supabase/migrations/20261007052732_parametric_generated_questions.sql`.
  Fayl nomi qo‘lda ixtiro qilinmadi; `supabase migration new
  parametric_generated_questions` natijasidir.
- **Kontent:** T-023 deterministic builder hosil qilgan 270 ta generated savol
  migration ichiga materializatsiya qilindi; published rows append-only va
  answer keylar faqat `question_keys` jadvalida qoladi.
- **Fresh DB verification:** productionga yaqin historical repair/preload
  semantikasi bilan to‘liq migration chain fresh PostgreSQL 17 ga qo‘llandi,
  so‘ng `parametric_generated_pool.test.sql` yashil o‘tdi.
- **Remote blocker:** amaldagi Supabase connector
  `plyqezulrfowyblsfpzy` projectiga `get_project/list_migrations` uchun
  permission bermadi. Shu sabab remote migration history bu sessiyada
  o‘zgartirilmadi va `db push` simulyatsiya qilinmadi.
- **Xavfsizlik qarori:** remote historyni taxmin qilib repair/apply qilish
  qilinmadi; connector access tiklangach avval migration list/history audit,
  keyin dry-run va faqat shundan so‘ng deploy qilinadi.

### Handoff

```text
Task: T-025
Holat: BLOCKED (remote permission)
Tayyor qism: CLI-created versioned 270-question migration + fresh DB verification
Migration: supabase/migrations/20261007052732_parametric_generated_questions.sql
Remote o‘zgarish: YO‘Q
Blocker: Supabase connector plyqezulrfowyblsfpzy projectiga permission bermaydi
Keyingi remote qadam: migration history audit -> dry-run -> apply/push -> postflight count/advisors
Parallel davom ettirilishi mumkin: learner Results/Errors history UI yoki M02 source-backed kontent
```


## Auth va Profile Figma refresh (TASK-UI-008, 2026-10-07)

- Eski PR #28 current main bilan tarixiy konfliktga tushganligi sababli dizayn o‘zgarishlari current main’dan ochilgan yangi branchga xavfsiz qayta qo‘llandi.
- Auth login/signup/session/reset behaviorlari saqlandi; faqat visual hierarchy, indigo design system va responsive states yangilandi.
- Profile sahifasida identity header, account metadata va password security bloklari bir xil design systemga keltirildi.
- Reset Password sahifasi recovery/session guardini saqlagan holda Figma yo‘nalishiga moslashtirildi.
- ResetPassword regressiya testlari recovery guard, client validation va backend updatePassword oqimini qoplaydi.
- **CI:** secret scan, lint, typecheck, unit tests, generated pool invariantlari, build, Playwright smoke va database joblari yashil.

### Handoff

```text
Task: TASK-UI-008
Natija: Auth/Profile/ResetPassword redesign current main asosida refresh qilindi va full CI yashil
O‘zgargan fayllar: src/pages/Auth.tsx; src/pages/Profile.tsx; src/pages/ResetPassword.tsx; src/tests/ResetPassword.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo‘q
Qolgan xavf: yo‘q; eski konfliktli PR #28 merge’dan keyin yopiladi
```

## Question form Figma redesign (TASK-UI-007, 2026-10-06)

- **Modal:** create/edit question form Figma admin design systemga moslashtirildi; responsive dialog, header/footer va construct metadata paneli qo'shildi.
- **Validation:** savol matni va konstrukt majburiyligi alert o'rniga inline error bilan ko'rsatiladi; Supabase load/save xatolari ham modal ichida ko'rinadi.
- **Y1:** mavjud single-answer option/key save flow saqlandi; to'g'ri javob tanlash UI'i aniqlandi.
- **Y2/Y3:** javob shabloni bu forma orqali kiritilmasligi explicit warning bilan ko'rsatildi; mavjud kontent pipeline kontrakti saqlandi.
- **Monitoring:** save exception monitoring saqlandi; DB permission modeli o'zgartirilmadi.
- **Test:** QuestionFormModal.test.tsx construct load, Y2 boundary, empty stem va missing construct validationini qoplaydi.
- **CI:** GitHub Actions CI #199 da secret scan, lint, typecheck, unit test, production build, Playwright smoke va database job'lari yashil o'tdi.

### Handoff

```text
Task: TASK-UI-007
Natija: QuestionFormModal Figma design systemga moslashtirildi
O'zgargan fayllar: src/components/admin/QuestionFormModal.tsx; src/tests/QuestionFormModal.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo'q
Testlar: GitHub CI #199 — secret scan, lint, typecheck, unit, build, Playwright smoke, database
Qolgan xavf yoki blocker: Y2/Y3 answer-key authoring hali content pipeline orqali; modal buni faqat aniq ko'rsatadi
Keyingi tavsiya: learner Results/Errors history route va navigationni real backend review data bilan ishlab chiqish
```

## Admin content pages Figma redesign (TASK-UI-006, 2026-10-06)

- **Modules:** modul/dars inventari, statuslar, create form, loading/error/empty holatlari yangi admin design systemga o'tkazildi.
- **Questions:** search, status filter, status transition, edit/create entry points va savol metadata kartalari redesign qilindi; so'nggi 100 savol chegarasi UI'da aniq ko'rsatildi.
- **Attempts:** filter paneli, real total/page metrikalari, natijalar jadvali, detail view va pagination redesign qilindi; server-authoritative score ma'lumoti saqlandi.
- **Behavior:** mavjud CRUD, status transition, attempts API va admin permission oqimlari o'zgartirilmadi.
- **Test:** AdminContentPages.test.tsx modul+dars render/expand, savol search empty-state, attempts API failure va empty boundary holatlarini qoplaydi.
- **CI:** GitHub Actions CI #189 da secret scan, lint, typecheck, unit test, production build, Playwright smoke va database job'lari yashil o'tdi.

### Handoff

```text
Task: TASK-UI-006
Natija: Modules, Questions, Attempts admin sahifalari Figma design systemga moslashtirildi
O'zgargan fayllar: src/pages/admin/ModulesPage.tsx; QuestionsPage.tsx; AttemptsPage.tsx; src/tests/AdminContentPages.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo'q
Testlar: GitHub CI #189 — secret scan, lint, typecheck, unit, build, Playwright smoke, database
Qolgan xavf yoki blocker: QuestionFormModal hali eski vizual tizimda; learner natijalar uchun alohida history/errors route hali yo'q
Keyingi tavsiya: TASK-UI-007 — QuestionFormModal va admin form komponentlarini redesign qilish
```

## Admin dashboard Figma redesign (TASK-UI-005, 2026-10-06)

- **Admin shell:** AdminLayout desktop va mobile navigatsiya Figma approved indigo/white design systemiga moslashtirildi.
- **Dashboard:** modules/questions/blueprints/profiles count ma'lumotlari mavjud Supabase read-only oqimidan olinadi; loading, error, retry va manual refresh holatlari qo'shildi.
- **Xavfsizlik:** AdminGuard va permission modeli o'zgartirilmadi; yangi DB write yoki soxta analytics kiritilmadi.
- **Test:** AdminDashboard regressiya testlari real count renderi, Supabase failure va refresh oqimini tekshiradi.
- **CI:** GitHub Actions CI #175 da secret scan, lint, typecheck, 256 unit test, production build, Playwright smoke va database job'lari yashil o'tdi.
- **Preview:** Vercel PR preview muvaffaqiyatli build qilindi.

### Handoff

```text
Task: TASK-UI-005
Natija: Figma admin dashboard + responsive admin shell implement qilindi
O'zgargan fayllar: src/components/admin/AdminLayout.tsx; src/pages/admin/AdminDashboard.tsx; src/tests/AdminDashboard.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo'q
Ishga tushirilgan testlar: GitHub CI #175 — secret scan, lint, typecheck, unit, build, Playwright smoke, database
Qolgan xavf yoki blocker: Modules/Questions/Attempts admin sahifalari eski vizual tizimda
Keyingi task: TASK-UI-006 — admin content management sahifalarini redesign qilish
```

## ExamRunner assessment Figma redesign (TASK-UI-004, 2026-10-06)

- **Intro:** mock/module/topic sinov kirish ekrani Figma assessment yo'nalishiga
  mos kartalar, server-authoritative izoh va aniq sinov qoidalari bilan yangilandi.
- **Active exam:** javoblar progressi header ostida ko'rsatiladi; savol canvas'i
  kengaytirildi, mavjud navigator va save/finish oqimi saqlandi.
- **Results:** score hero, foiz progressi va serverdan qaytgan group breakdown
  kartalari yagona Figma vizual tizimiga o'tkazildi.
- **Xavfsizlik:** timer `started_at + duration_sec` server haqiqatiga tayangan,
  answer submission/scoring gatewaylari va answer-key himoyasi o'zgarmadi.
- **Test:** `ExamPage.test.tsx` yangi assessment UI markerlarini tekshiradi va
  avvalgi secure ExamRunner regressiya testlari saqlandi.
- **CI:** GitHub Actions CI #141 da secret scan, lint, typecheck, unit, build,
  Playwright smoke va database job'lari yashil o'tdi.

### Handoff

```text
Task: TASK-UI-004
Natija: ExamRunner intro/active/results Figma assessment dizayniga moslashtirildi
O'zgargan fayllar: src/features/exam/ExamRunner.tsx; src/tests/ExamPage.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo'q
Ishga tushirilgan testlar: GitHub CI #141 — secret scan, lint, typecheck, unit, build, Playwright smoke, database
Qolgan xavf yoki blocker: admin/error-review ekranlari Figma tizimiga hali to'liq moslashtirilmagan
Keyingi ochilgan tasklar: TASK-UI-005 — Admin shell va global visual polish
```


## Lesson TopicView Figma flow (TASK-UI-003, 2026-10-06)

- **Stage navigator:** O'rganish → Bilimni tekshirish → Natija holatlari yagona
  LessonStageBar orqali ko'rsatiladi.
- **Lesson shell:** modul kodi, modul nomi, mavzu nomi va mavzu tartibi Figma
  lesson ekranidagi vizual ierarxiyaga yaqinlashtirildi.
- **Nazariya headeri:** oq card, metadata va o'qish progressi birlashtirildi.
- **Behavior saqlandi:** BookReader, static theory blocks, backend-first test
  savollari, secure ExamPage navigatsiyasi va progress sync o'zgarmadi.
- **Test:** LessonStageBar uchun active/completed/back regressiya testlari.
- **CI:** GitHub Actions CI #131 — secret scan, lint, typecheck, unit, build,
  Playwright smoke va database job'lari yashil.

### Handoff

```text
Task: TASK-UI-003
Natija: TopicView lesson shell Figma flow bilan birlashtirildi
O'zgargan fayllar: src/components/learning/LessonStageBar.tsx; src/components/learning/TopicView.tsx; src/tests/LessonStageBar.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo'q
Ishga tushirilgan testlar: GitHub CI #131 — secret scan, lint, typecheck, unit, build, Playwright smoke, database
Qolgan xavf yoki blocker: secure ExamRunner/Mock/Results UI hali Figma assessment ekranlari bilan to'liq birlashtirilmagan
Keyingi ochilgan tasklar: TASK-UI-004 — ExamRunner/Mock/Results redesign
```


## Learning va Module Figma redesign (TASK-UI-002, 2026-10-06)

- **Learning:** Figma tasdiqlangan yengil EdTech layoutga o'tkazildi; section grouping,
  real catalog, qidiruv va progress saqlandi.
- **Module overview:** modul hero/progress va mavzu ro'yxati soddalashtirildi;
  tugallangan va joriy mavzu holatlari aniq ajratildi.
- **Behavior saqlandi:** TopicView orqali nazariya ochish, progress store va
  server-scored `/exam/bolim/:moduleId` oqimi o'zgarmadi.
- **Test:** `LearningModulePages.test.tsx` qidiruv, real progress, module
  navigatsiyasi, topic ochish, module exam va not-found holatini tekshiradi.
- **CI:** GitHub Actions CI #119 da secret scan, lint, typecheck, 250 unit test,
  build, Playwright smoke va database job'lari yashil o'tdi.

### Handoff

```text
Task: TASK-UI-002
Natija: Learning + Module overview Figma dizayniga moslashtirildi
O'zgargan fayllar: src/pages/LearningPage.tsx; src/pages/ModulePage.tsx; src/tests/LearningModulePages.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo'q
Ishga tushirilgan testlar: GitHub CI #119 — secret scan, lint, typecheck, unit, build, Playwright smoke, database
Qolgan xavf yoki blocker: TopicView/lesson va ExamRunner assessment ekranlari hali yangi Figma tizimiga to'liq moslashtirilmagan
Keyingi ochilgan tasklar: TASK-UI-003 — Lesson/TopicView + Practice/ExamRunner presentation redesign
```


## Figma dashboard foundation (TASK-UI-001, 2026-10-06)

- **Dashboard:** tasdiqlangan Figma yo'nalishiga mos hero, KPI kartalar,
  bo'lim progressi, zaif mavzular va kunlik reja UI'i yaratildi.
- **Real ma'lumot:** katalog, learner progress va auth display name mavjud
  hook/store'lardan olinadi; yangi client mock yoki hardcoded learner natijasi
  kiritilmadi.
- **Sidebar:** Bosh sahifa, O'rganish, Mock test va profil oqimi Figma uslubida
  responsive/collapsible ko'rinishga o'tkazildi; mavjud route'lar saqlandi.
- **Framework:** ADR/README qaroriga muvofiq React + Vite saqlandi; Next.js
  migratsiyasi qilinmadi.
- **Test:** yangi `DashboardPage.test.tsx` real model renderi, tugallanmagan
  modulga navigatsiya va bo'sh katalog holatini tekshiradi.
- **CI:** secret scan, lint, typecheck, unit test, build, Playwright smoke va
  database job'lari GitHub Actions CI #103 da yashil o'tdi.

### Handoff

```text
Task: TASK-UI-001
Natija: Figma dashboard + sidebar foundation implement qilindi
O'zgargan fayllar: src/pages/DashboardPage.tsx; src/components/layout/Sidebar.tsx; src/tests/DashboardPage.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo'q
Ishga tushirilgan testlar: GitHub CI — secret scan, lint, typecheck, unit, build, Playwright smoke, database
Qolgan xavf yoki blocker: yangi Figma Learning/Section/Lesson/Assessment ekranlari hali kodga ko'chirilmagan
Keyingi ochilgan tasklar: TASK-UI-002 tavsiya — Learning + Module page redesign
```


## Parametrik savol generatorlari (T-012, 2026-10-06)

- **Generatorlar:** `axborotHajmi`, `sanoqSistema`, `mantiqAmal`,
  `ipMaska` uchun deterministik seeded generator kutubxonasi yaratildi.
- **Rasmiy konstruktlar:** `S1.INFO.04/.05/.06`, `S3.NUM.01/.02/.03`,
  `S3.LOGIC.02/.04`, `S6.NET.03` — jami 9 ta generator konstrukt qamrab olindi.
- **Formatlar:** generator qatlamida Y1, Y2 va Y3 answer-key invariantlari
  qo‘llab-quvvatlanadi; noma’lum generator yoki konstrukt jim fallback qilmaydi.
- **Hisob tekshiruvi:** axborot hajmi, sanoq sistemasi va IP maska uchun
  generator javobidan mustaqil formulaviy testlar qo‘shildi.
- **Takrorlanmaslik:** har bir generator 0–99 seed oralig‘ida option tartibidan
  mustaqil 100 ta mazmunan turli savol berishi test bilan isbotlandi.
- **Xavfsizlik:** generatorlar learner API payloadiga answer key qo‘shmaydi;
  ular domain/build-time utility sifatida qoladi. DB import alohida task.
- **CI:** secret scan, lint, typecheck, 277 ta unit test, production build,
  Playwright smoke va database reconciliation yashil o‘tdi.

### Handoff

```text
Task: T-012
Natija: 4 parametrik generator + 9 rasmiy konstrukt + Y1/Y2/Y3 invariantlari tayyor
O‘zgargan fayllar: src/lib/exam/generators/*; src/tests/questionGenerators.test.ts; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo‘q
Ishga tushirilgan testlar: GitHub CI — secret scan, lint, typecheck, unit, build, Playwright smoke, database
Qolgan xavf yoki blocker: generator natijalarini draft savol sifatida DBga import qilish bu task scope’iga kirmaydi
Keyingi task: T-013/T-014/T-015 holatini amaldagi server-scored ExamRunner bilan reconciliation qilish
```


## Auth va learner trafigi backend'ga ko'chirildi (2026-07-31)

- **To'liq backend auth:** register/login/logout/refresh/parol tiklash/
  tasdiqlash xati/profile tahrirlash — `backend/src/routes/auth.ts` +
  `auth.service.ts` (Supabase Auth admin API, service-role, server tomonda).
  Browser supabase-js auth ishlatmaydi.
- **Session:** `src/features/auth/sessionStore.ts` — localStorage
  (`attestatsiya.session.v1`), `storage` event orqali tab'lararo sinxron.
- **Avtomatik refresh:** `src/lib/apiClient.ts` — 401 bo'lganda mutex bilan
  `POST /api/auth/refresh`, muvaffaqiyatli bo'lsa qayta urinish; login/refresh
  endpointlarida refresh chaqirilmaydi; refresh ishlamasa `SESSION_EXPIRED`.
- **useAuth rewrite:** supabase'siz; recovery link `/reset-password#access_token=`
  tokenini taniydi va parol yangilangach hash'ni tozalaydi.
- **AdminGuard:** real rol tekshiruvi (admin/editor ruxsat; boshqalar
  "Ruxsat yo'q" sahifasi). `Profile.tsx` — ism/familiya tahrirlash formasi.
- **Learner single-gateway:** `supabaseExamGateway` va `createFallbackGateway`
  olib tashlandi; ExamRunner faqat `backendGateway` ishlatadi; progressGateway
  fallbacksiz; `resolveIds.ts` o'chirildi (backend code→UUID resolve qiladi).
- **Route'lar:** `/auth`, `/reset-password`, `/profile` App.tsx'ga qo'shildi
  (avval mavjud sahifalar route'siz edi).
- **Testlar:** +20 backend auth test (jami 78), +40 frontend (sessionStore,
  authClient, useAuth, AdminGuard rol, apiClient refresh, progress fallback
  olib tashlangan) — jami 185 frontend test yashil; lint yashil; typecheck'da
  faqat 66 ta pre-existing admin legacy xato (T-006).
- **Blocker (o'zgarmagan):** `npm run build` legacy admin TS xatolari sabab
  yiqiladi (T-006; auth taskdan tashqari).

## Frontend ↔ Backend API integratsiyasi (2026-07-31)

- **Tuzatildi:** `ExamRunner` fallback bug'i — backend tushganda `ApiError`
  (NETWORK_ERROR) tanimaganligi sababli Supabase RPC fallback hech qachon
  ishga tushmasdi. Endi `createFallbackGateway`/`isNetworkError`
  `src/features/exam/examGateway.ts` da, `ApiError` uchun ishlaydi.
- **Barcha backend endpointlar uchun frontend client:** `getReview` va
  `getDueReviews` `ExamGateway` kontraktiga qo'shildi (backendGateway HTTP);
  progress single-gateway `src/features/progress/` da; content API client
  `src/features/content/contentApi.ts` da.
- **progressSync.ts** backend orqali (`/api/progress/sync`,
  `/api/progress/modules`, `/api/exam/due-reviews`) ishlaydi; RPC fallback
  2026-07-31 da olib tashlandi.
- **Integration testlar:** barcha backend endpointlar frontend client orqali
  real payload shakllari bilan tekshiriladi
  (`src/tests/apiIntegration.test.ts` va b.).
- **Env hujjati:** `.env.example` ga `VITE_API_BASE_URL`; README'ga backend
  ishga tushirish va fallback izohi qo'shildi.
- Lint yashil; typecheck'da 0 ta yangi xato; 185 frontend + 78 backend test o'tadi.
- **Blocker:** `npm run build` hali admin legacy sahifalaridagi 66 ta
  pre-existing TS xatosi sabab yiqiladi (T-006 ga bog'liq; bu taskdan tashqari).

## Gibrid katalog — contentTree UUID schema moslashuvi (T-010, 2026-07-31)

- **Gibrid katalog:** statik `contentTree.ts` UI tuzilma manbai bo'lib qoladi;
  backend published modullari (UUID schema) meta-ma'lumotni qoplaydi.
  DB to'lguncha UI buzilmaydi, to'lgach rasmiy ma'lumot ko'rsatiladi.
- **`src/features/content/catalog.ts`:** `mergeCatalog(staticModules, apiModules)`
  — sof funksiya. Qoidalar: modullar statik tartibda, `code` bo'yicha bog'lanadi;
  DB topilsa title/description/section/examQuestionCount/uuid/lessonCount
  qoplanadi; DB `summary_uz` null bo'lsa statik description; DB'da bor, statikda
  yo'q modul qo'shilmaydi (subtopik tuzilmasi yo'q).
- **`src/hooks/useCatalog.ts`:** darhol statik katalog bilan render, keyin
  `GET /api/content/modules` javobi kelgach qoplash; API xatosida statik
  saqlanadi (`online=false`).
- **Consumer'lar:** LearningPage, ModulePage, TopicExamPage, DashboardPage
  `MODULES` o'rniga `useCatalog()` ishlatadi; LearningPage header'i endi
  dinamik "N modul · M mavzu". Route'siz legacy `TopicLessonPage` o'zgarmadi.
- **Backend contract kengayishi:** `GET /api/content/modules` va
  `/modules/:id` endi `exam_question_count` qaytaradi
  (`backend/src/schemas/content.ts`, `content.service.ts`, frontend
  `moduleSummarySchema`/`moduleDetailSchema` — strict schema, DB rasmiy manba).
- **Testlar:** +8 `catalog.test.ts` (merge qoidalari: DB overlay, null fallback,
  DB-only modul tashlanadi, tartib saqlanadi), +3 `useCatalog.test.tsx`
  (statik seed, DB overlay, API xatosi), +4 backend `content.test.ts` route
  testlari (exam_question_count/lesson_count, section filter, lesson_count=0,
  bo'sh natija). Jami 196 frontend + 82 backend test yashil; lint yashil;
  typecheck'da 0 yangi xato.
- **Blocker (o'zgarmagan):** `npm run build` legacy admin TS xatolari sabab
  yiqiladi (T-006).

## Learning moduli — mavzu o'qish va server testi (T-011, 2026-07-31)

- **Xavfsiz mavzu testi:** `/exam/topic/:moduleId/:subtopicId` (eski static
  mock imtihon — javob kaliti brauzerga tushardi, timer client'da) o'chirildi;
  `TopicExamPage.tsx` olib tashlandi. Mavzu testi endi ExamRunner orqali:
  `navigate('/exam/mavzu/M01?lessonId=M01.01')` — savollar serverda tanlanadi,
  javoblar serverda baholanadi (`generate_topic_test` RPC, code→UUID resolve).
- **ExamRunner kengayishi:** `backUrl` prop'i — yakuniy natija ekranida
  "Modulga qaytish" havolasi; `onFinished(result)` prop'i — sinov yakunida
  chaqiriladi.
- **Progress integratsiyasi (ExamPage):** mavzu sinovi yakunida
  `completeTopic(moduleId, lessonId, correct, total)` + `syncTopicProgress`
  (serverga `mark_lesson_read`). Savol soni `breakdown` (togri/jami) dan,
  bo'lmasa 2 ball/savol (blueprint points_per_item) dan chiqariladi.
- **Kontent oqimi o'zgarmadi:** TopicView nazariya o'qish (BookReader/scroll),
  "Bilimni tekshirish" → server testi; mavzu savollari bazada bo'lmasa backend
  NO_QUESTIONS → intro ekranida tushunarli xato xabari.
- **Testlar:** +2 `ExamPage.test.tsx` (mavzu: `startTopicExam('M01.01')`
  chaqiruvi, yakunda progressStore'da M01.01 3/3/100 yozilishi, "Modulga
  qaytish" → `/learn/M01`; lessonId yo'q bo'lsa boshlanmaslik). Jami 198
  frontend test yashil; lint yashil; typecheck'da 0 yangi xato.
- **Blocker (o'zgarmagan):** `npm run build` legacy admin TS xatolari sabab
  yiqiladi (T-006). Mavzu testlari uchun savol bazasi hali to'lmagan
  (T-012 generatorlar buni to'ldiradi).

## User auth frontend mustahkamlash (T-016, 2026-07-31)

- **Auth sahifasi (`src/pages/Auth.tsx`):** client validatsiya (email format,
  parol ≥6, signup'da parolni tasdiqlash maydoni, ism ≥2), show/hide parol
  toggle (Eye/EyeOff), `autocomplete` atributlari (username/current-password/
  new-password/name), login/signup'da `noValidate` + field-level xatolar.
  `EMAIL_NOT_CONFIRMED` (ApiError code) → maxsus "Email tasdiqlash" ekrani
  (resend 60s cooldown bilan, kirishga qaytish). Login muvaffaqiyatida
  `returnTo` yoki `/` ga redirect; login qilgan foydalanuvchi `/auth` ga
  kira olmaydi (`<Navigate replace>`). `?expired=1` → "Session muddati tugadi"
  banner (URL tozalanadi, banner qoladi).
- **Profil sahifasi (`src/pages/Profile.tsx`):** ism/familiya formasi (mavjud)
  + email va rol badge; yangi "Parolni o'zgartirish" bo'limi (yangi parol +
  tasdiqlash, show/hide, autocomplete="new-password", `updatePassword` orqali;
  maydonlar tozalanishi). Saqlash tasdiqlari 3 soniyada avto-yashirinadi.
  Chiqish `signOut()` + `navigate('/', { replace: true })` — hard reload
  olib tashlandi.
- **Route himoyasi:** yangi `src/components/auth/ProtectedRoute.tsx` — `/profile`
  login talab qiladi; session yo'q bo'lsa `/auth?returnTo=<manzil>` ga
  `replace` yo'naltirish, login'dan keyin foydalanuvchi qaytariladi.
- **Session expiry:** `sessionStore`'da `SESSION_EXPIRED_EVENT`; apiClient
  refresh muvaffaqiyatsiz bo'lganda hodisani yuboradi; yangi
  `SessionExpiredHandler` (App darajasida) foydalanuvchini `/auth?expired=1`
  ga yo'naltiradi (auth/reset-password sahifalaridan tashqari).
- **useAuth:** `toError` endi `ApiError`ni o'zgartirmasdan uzatadi (code
  saqlanadi); `signOut` navigatsiyani chaqiruvchiga qoldiradi (toza SPA
  o'tish, `window.location.assign` olib tashlandi).
- **Testlar:** +24 frontend — `AuthPage.test.tsx` (10: login redirect,
  returnTo, EMAIL_NOT_CONFIRMED + resend + qaytish, email validatsiyasi,
  parol mos kelmasligi, signup success, qisqa parol, expired banner,
  login bo'lgan foydalanuvchini qaytarish, reset modal), `Profile.test.tsx`
  (7: email/rol, ism update, qisqa ism, parol update + maydon tozalanishi,
  mos kelmaslik, qisqa parol, chiqish), `ProtectedRoute.test.tsx` (3),
  `sessionExpired.test.ts` (3: event + SESSION_EXPIRED, login endpointida
  hodisa yo'q, sessionsiz 401). useAuth'da signOut/location testlari
  yangilandi + ApiError code testi. Jami 233 frontend test.
- **Test holati:** 232/233 o'tadi; yagona muvaffaqiyatsiz `BookReader`
  diagramma testi pre-existing flaky (git stash bilan toza tree'da ham
  yiqilishi isbotlandi, yakka holda o'tadi) — T-016'ga aloqasi yo'q.
  Lint yashil; typecheck'da 0 yangi xato (66 pre-existing admin legacy,
  T-006).
- **Eslatma:** backend `update-password` joriy parolni tekshirmaydi (session
  o'zi isbot) va `me` javobida `email_confirmed` yo'q — shuning uchun parol
  bo'limida faqat yangi parol + tasdiqlash, email tasdiqlash badge'isi
  backend kengaytirilgach qo'shiladi.

### T-016 audit tuzatishlari (2026-07-31, 2-bosqich)

- **apiClient refresh semantikasi aniqlandi:** `RefreshOutcome = 'ok' | 'invalid' | 'network'`.
  Tarmoq uzilishi (fetch reject / NETWORK_ERROR) sessionni **saqlaydi** —
  foydalanuvchi vaqtincha uzilishda tizimdan chiqarib tashlanmaydi; faqat
  refresh token rad etilganda session tozalanadi va `SESSION_EXPIRED` hodisasi
  yuboriladi. useAuth `refreshIfNeeded` ham xuddi shunday (isNetworkError).
- **Auth.tsx:** `sanitizeReturnTo()` — faqat ichki yo'llarga ruxsat (open
  redirect yopildi: `//` bilan boshlanadigan tashqi URL reject qilinadi);
  resend interval `resendIntervalRef`'da saqlanadi va unmount'da tozalanadi;
  reset modal emaili EMAIL_RE bilan tekshiriladi.
- **ResetPassword.tsx qayta yozildi:** parolni tasdiqlash maydoni, show/hide
  parol, ≥6 + moslik validatsiyasi, recovery token bo'lmasa va session bo'lmasa
  "Parolni tiklash" info ekrani (/auth havolasi bilan), muvaffaqiyatda 3s dan
  keyin `/` ga auto-navigatsiya, loading holati.
- **E2E (`src/tests/e2e/app.spec.ts`) yangilandi:** auth `/auth` da ekani uchun
  barcha 4 eski test o'lik edi; o'rniga 6 yangi backend-independent test
  (login forma, signup tab, client validatsiya, reset modal validatsiyasi,
  protected route `/profile` → `/auth?returnTo=%2Fprofile`, `?expired=1` banner).
  Natija: 6/6 o'tadi.
- **sessionExpired.test.ts:** +1 test — refresh tarmoq xatosida session
  saqlanadi va `SESSION_EXPIRED` yuborilmaydi (NETWORK_ERROR, statusCode 0).
- **Muhit:** `localhost:3001` ni band qilgan stray vite dev-server tozalandi
  (backendga kirishni to'sardi); backend health = `degraded` —
  **Supabase service key "Invalid API key"** (backend/.env dagi key loyihaga
  mos kelmaydi) — live login/register e2e shu sababdan bloklangan.
  Frontend muammosiz render bo'ladi, barcha frontend testlar o'tadi.
- **Topilma (T-016 emas):** repo `index.html` EnglishPath brendi bilan
  commitlangan (HEAD'da ham shunday) — loyiha shellining qolib ketgan nusxasi,
  src/ va app esa attestatsiya. Alohida task sifatida almashtirilishi kerak.

### Live backend tekshiruvi va tuzatish (2026-07-31, 3-bosqich)

- **Supabase credential tuzatildi:** backend/.env'ga to'g'ri project
  (`plyqezulrfowyblsfpzy`) secret key yozildi (yangi `sb_secret_` formati;
  eski JWT va `sbp_` kalitlar "Invalid API key" berardi). Health: `healthy`.
- **TOPILGAN BUG — shared supabase client ifloslanishi:** `login`
  (`signInWithPassword`) va `refresh` (`refreshSession`) umumiy service-role
  client'ida bajarilar edi. Ular client'ning session holatini o'zgartirib,
  keyingi REST so'rovlarini user-scope qilib yuborardi (service-role o'rniga)
  → live DB'da RLS update'ni blokladi → **profile update 0 satrga ta'sir
  qilmasdan "muvaffaqiyatli" qaytardi** (ism hech qachon o'zgarmasdi).
  Debug: `profData: []` — xato yo'q, lekin yozuv yo'q.
- **Tuzatish:** `createServiceClient()` (`backend/src/lib/supabase.ts`) —
  har user-auth operatsiyasi (login/refresh/reset-password) uchun yangi
  client. Umumiy client faqat admin/DB ishlarida qoladi.
  Backend testlar: 90/90 o'tadi. Live curl zanjiri endi to'liq ishlaydi:
  register (display_name yoziladi) → confirm → login → me → **update
  ("Updated Name" DB'ga yozildi)** → refresh (200) → logout.
- **Live RLS tekshiruvi:** user-scope UPDATE live DB'da 0 satr qaytaradi
  (SELECT ishlaydi) — migratsiyadagi `profiles_self_update` bilan farq bor;
  backend service-role ishlatgani uchun frontend uchun muammo emas, lekin
  live DB va migratsiya mosligi alohida task sifatida tekshirilishi kerak.
- **Logout qayd:** logout refresh tokenni revoke qiladi (global), lekin
  access token 1 soatgacha yaroqli (JWT tabiati) — /me logout'dan keyin ham
  200 qaytaradi. Frontend session'ni lokal tozalaydi; kritik emas.
- **Eslatma:** `localhost:3001`'dagi stray vite dev-server tozalandi —
  backendga kirishni to'sardi (HTML qaytarardi).
- **Repo tuzatish:** stash incidentida yo'qolgan 29 hujjat HEAD'dan
  qaytarildi (DATABASE_SCHEMA.md, informatika-attestatsiya-platform-spec/*,
  roadmap.md va b.). Ataylab o'chirilgan 2 fayl qoldi (resolveIds.ts,
  TopicExamPage.tsx — PROJECT_STATE'da qayd qilingan).

### Session yuklash bug'i va tuzatish (2026-07-31, 4-bosqich)

- **Foydalanuvchi xabari:** /profile ochilganda `/auth?returnTo=%2Fprofile` ga
  qaytarilib, login forma chiqardi — login qilingan bo'lsa ham.
- **Sabab (sessionStore.loadInitial):** localStorage'dagi muddati o'tgan
  session yuklanishda tashlab yuborilar edi. Shu sababli refresh_token
  yo'qolib, `refreshIfNeeded` silent-refresh'ni umuman bosa olmas edi →
  har bir reload'da login talab qilinardi.
- **Tuzatish:** `loadInitial` endi muddati o'tgan session'ni SAQLAYDI;
  refresh useAuth mount'ida refresh_token bilan bajariladi (silent re-login).
- **Qo'shimcha (useAuth):** tab'lararo refresh race — boshqa tab yangi
  session yozgan bo'lsa, eski token rad etilishi yangi session'ni buzmasi
  uchun `latest.refresh_token === current.refresh_token` sharti qo'shildi.
- **Testlar:** sessionStore loadInitial testi qayta yozildi (expired
  session saqlanadi), useAuth'ga race-guard testi qo'shildi.
- **Live e2e (`src/tests/e2e/live-auth.spec.ts`):** real backend bilan —
  UI login → /profile ochiladi; localStorage'da expires_at o'tkazib
  reload qilinsa, auto-refresh ishlaydi va profil ochiladi (login
  sahifasiga tushmaydi). 7/7 e2e o'tadi.

### Login'siz "kirilgandek" ko'rinish — demo rejim ildiz sababi (2026-07-31, 5-bosqich)

- **Foydalanuvchi xabari:** /profile → /auth qaytarganda "app ishlayapti,
  login qilingan bo'lsa ham login so'rayapti" — jiddiy xato deb hisoblandi.
- **Ildiz sabab:** `DEMO_MODE=true` (faqat lokal .env) — token bo'lmasa
  backend exam/progress/auth-me'da avtomatik demo token berardi; content
  route'lari esa ochiq edi (dizayn bo'yicha). App login'siz to'liq ishlab,
  "kirilgandek" tuyulardi, lekin /profile real session talab qilardi.
- **1-tuzatish (UX):** Sidebar va mobil header'ga `Demo rejim` belgisi,
  /auth'ga returnTo bilan kelganda tushuntirish banneri.
- **2-tuzatish (to'liq qulflash):**
  - `App.tsx` — `/`, `/learn`, `/learn/:moduleId`, `/exam*` route'lari
    ProtectedRoute bilan himoyalandi (ilgari faqat /profile).
  - `backend/.env` — `DEMO_MODE=false` (production default bilan moslashadi).
  - Demo rejim belgilari olib tashlandi (endi login'siz faqat /auth va
    /exam-demo ochiq).
- **Natija:** chiqish bosilganda session tozalanadi → barcha sahifalar
  `/auth?returnTo=` ga yo'naltiriladi; exam/progress API login'siz 401.
- **Testlar:** live-auth'ga yangi regressiya testi — login → /learn ochiq →
  Chiqish → /auth; /learn va / ga qaytilsa yana /auth; localStorage toza.
- **Baseline:** frontend vitest 239/239, e2e 8/8, backend 99/99, lint/tsc toza.

## Tugallangan darslik kontenti ekstraksiyasi

| Task | Holat | Natija |
|------|-------|--------|
| T-DL-001 | DONE | `Adabiyotlar.txt`, `Informatika Testlar spesifikatsiyasi.txt` — attestatsiya spesifikasiyasi ajratildi |
| T-DL-002 | DONE | 13 ta Cambridge+ darslik ekstraksiyasi: 5,6,7,8,9,10-11 sinflar |
| T-DL-003 | DONE | 9 ta ICT (O'zbekiston) darslik ekstraksiyasi: 5–11 sinflar |
| T-DL-004 | DONE | `barcha_kontent_kodlar_boyicha.txt` — Cambridge darsliklaridan content code bo'yicha tartiblangan ~87K qator |
| T-DL-005 | DONE | Individual code fayllari (1.1.txt–13.2.txt) — 38 ta fayl, jami ~124K qator. Har bir content code bo'yicha Cambridge + ICT + tematik manbalar birlashtirildi |

Barcha darslik kontenti: `darsliklar/` katalogida. Ekstraksiyalar `darsliklar/extracted/` da.

## Darslik kontent auditi — yakuniy holat

| Task | Holat | Natija |
|------|-------|--------|
| Kirill → lotin | DONE | Barcha 10 fayldan kirill belgilari tozalandi |
| Ruscha UI → o'zbekcha | DONE | 30 ta ruscha menyu nomi tarjima qilindi |
| Spelling/grammar | DONE | 27 ta xato tuzatildi |
| Deduplikatsiya | DONE | O'rtacha 48% qisqarish bilan takroriy bloklar olib tashlandi |
| Off-topic kontent | DONE | 1.8.txt, 5.2.txt va 12.x dan ortiqcha kontent olib tashlandi |
| topicContent.ts boyitish | DONE | M01–M13, 90+ subtopic, 1787 qator, 136+ test savoli |
| Y2/Y3 → TopicView integratsiyasi | DONE | QuestionCard Y1 (MCQ), Y2 (moslashtirish), Y3 (tartiblash) turlariga mos ishlaydi; 3 ta Y2 savol haqiqiy juftlik formatiga o'tkazildi; 2 ta Y3 savol qo'shildi |
| Subtopic navigatsiyasi | PENDING | — |
| Progress vizualizatsiyasi | PENDING | — |
| Deep linking | PENDING | — |

## Bloklovchilar

| ID | Tavsif | Status |
|----|--------|--------|
| B-SEC-001 | Lokal hujjatlardan credential olib tashlandi; Supabase credentiallari rotate qilindi | RESOLVED |
| B-DB-001 | HTTPS audit remote migration metadata jadvali yo‘qligini tasdiqladi | RESOLVED |
| B-DB-002 | Legacy BIGINT liniya arxivlandi; UUID baseline va remote history sinxron | RESOLVED |
| B-QA-001 | CI secret scan, lint, typecheck, unit, build va E2E bilan yashil | RESOLVED |
| B-001 | Y1/Y2/Y3 generatorlar (axborotHajmi, sanoqSistema, mantiqAmal, ipMaska) yozilmagan | OPEN |
| B-002 | Server-scored ExamRunner UUID RPC kontraktiga o‘tkazildi | RESOLVED |
| B-003 | TypeScript database.types.ts remote UUID schema bo‘yicha generatsiya qilindi | RESOLVED |

## Keyingi bajariladigan task

1. Subtopic navigatsiyasi — prev/next tugmalari va kalit bosish (Left/Right)
2. Progress vizualizatsiyasi — ModulePage da completion badge va progress bar
3. Deep linking — `/learn/:moduleId/:subtopicId` route

## Auditda tasdiqlangan natijalar

| Task | Tugallangan vaqt | Izoh |
|------|-----------------|------|
| Safety checkpoint | 2026-07-30 | `4caa968`; raw darsliklar va secretlar commitga kiritilmagan |
| TASK-P0-001 Foundation recovery | 2026-07-30 | Root README, ADR-017/018, Node/npm pin va avtomatik secret scan |
| TASK-P0-002 CI quality gate | 2026-07-30 | PR #1 da secret scan, lint, typecheck, 49 unit test, build va 4 Playwright smoke testi yashil |
| TASK-P0-003 UUID DB baseline | 2026-07-30 | PR #2; fresh va drift-upgrade PostgreSQL joblari yashil; remote 16/15/50/8-35-7/120 bilan sinxron |
| TASK-P0-004 RPC security | 2026-07-30 | PR #3; local va CI PostgreSQL regressiyalari yashil; remote trigger/RPC/permission postflight tasdiqlandi |
| TASK-P0-005 UI security boundary | 2026-07-30 | Admin deny-by-default; client mock production bundle'dan chiqarildi; bundle regression check qo'shildi |
| T-008 UUID database types | 2026-07-30 | PR #4; Supabase-generated remote kontrakt, typed client boundary va 5 schema regressiya testi |
| T-009 secure ExamRunner | 2026-07-30 | PR #5; keyless runtime contract, Y1/Y2/Y3 UUID payload, server timer/finish va bundle guard |
| T-M01-001 M01 kontent konvertori | 2026-07-30 | LaTeX qo'llanmadan 22 mavzu (19 bob + 3 ilova), 691 blok; `npm run content:m01` qayta yaratadi |
| T-M01-002 Kitob ko'rinishi | 2026-07-30 | Rangli qutilar, KaTeX, strukturaviy jadval, 7 sxema va bob mundarijasi; 22 yangi test |
| T-M01-003 Bo'limli o'qish | 2026-07-30 | Bob `\section` bo'yicha sahifalanadi (3–11 bo'lim); bitta yakuniy CTA; 10/19 bobda test savoli yo'qligi ochiq ko'rsatiladi |
| T-M01-004 Yangi manbaga ko'chish | 2026-07-30 | M01 kontenti yangilangan yagona LaTeX nashridan qayta generatsiya qilindi: 12 mavzu (7 bob + 5 ilova), 783 blok, 279 KaTeX ifodasi, 10 sxema |
| Build audit | 2026-07-30 | TypeScript + Vite build o'tadi |
| Unit test audit | 2026-07-30 | PR #5 clean GitHub CI’da 61 Vitest test o‘tadi |
| E2E smoke audit | 2026-07-30 | 4 auth smoke testi o'tadi; product flow qamrovi hali yo'q |

## M01 kontenti DB → backend → frontend oqimi (T-017, 2026-07-31)

- **Migratsiyalar:** `000012_m01_content_seed.sql` (12 dars + 783 blok +
  400 savol + 1600 option + 400 key, idempotent, remote'ga push qilingan),
  `000013_fix_question_keys_rls.sql` (000011 broken policy forward-fix),
  `000014_source_lesson_links.sql` (schema: `questions.source_lesson_id`),
  `000015_m01_source_lesson_backfill.sql` (400 slug-based UPDATE).
- **Backend:** `GET /api/content/lessons/:id/questions` (published savollar,
  kalitsiz), `POST /api/content/questions/check` (server-authoritative,
  `question_keys` faqat service-role bilan o'qiladi). `LessonResponse` ga
  `blocks`/`blocks_kind` qo'shildi (getModule/getLesson).
- **Frontend:** `contentApi` yangi kontraktlar (zod strict), `lessonContentGateway`
  (backend-first, tarmoq/xato → statik fallback), `TopicView` test fazasi
  backend savollari bilan ishlaydi (correctIndex server natijasidan o'rnatiladi).
- **Testlar:** backend 90/90 (content.test.ts: questions + check endpointlar),
  frontend 232/233 (contentApi + lessonContentGateway). Faqat pre-existing
  `BookReader` diagramma timeout testi yiqiladi (clean tree'da ham).
- **Live tekshiruv:** M01.02 → 60 savol (Y1), key leak yo'q; check to'g'ri
  javob + izoh qaytardi.
- **Eslatma:** `backend/.env` dagi eski `SUPABASE_SERVICE_KEY` (sbp_...) noto'g'ri
  edi — CLI orqali olingan haqiqiy service_role key bilan almashtirildi
  (.env gitignore'da).

## Dars testi 20 random + shuffle va admin urinishlar (T-018, 2026-07-31)

- **Migratsiya:** `20260731000016_lesson_test_pool_20.sql` (remote'ga push
  qilingan). `exam_items.option_order uuid[]` — har urinish uchun
  aralashtirilgan variant tartibi (side guruhi ichida random);
  `generate_topic_test` — `source_lesson_id` bo'yicha random 20 ta savol,
  yetmay qolsa dars konstruktlari orqali to'ldirish, darsda <20 bo'lsa —
  borlari; `exam_payload` — `option_order` tartibini ko'rsatadi va item
  tartibini integer bo'yicha (eski text-sort xatosi tuzatildi); eski
  exam'lar (`option_order` null) natural tartibda ko'rsatiladi.
- **Migratsiya:** `20260731000017_topic_test_duration.sql` — mavzu testi
  umumiy vaqti: `duration_sec = savollar_soni × 120` (har savolga 2 daqiqa;
  20 savol → 40 daqiqa). Vaqt umumiy — bitta savolga alohida cheklov yo'q.
  Deadline server-authoritative: `submit_answer` `vaqt_tugadi` qaytaradi,
  frontend timer 0 ga yetganda `finish_exam` chaqiradi (ExamRunner line 221).
  <20 savol bo'lsa vaqt ham haqiqiy sonda hisoblanadi.
- **Backend:** `GET /api/admin/attempts` (kind/lesson_id/user_id/from/to
  filter + pagination; email, display_name, lesson_slug, answered_count),
  `GET /api/admin/attempts/:id` (har bir savol: matn, ko'rsatilgan variant
  tartibi, user javobi, `correct_option_id` + izoh — faqat admin). Role
  tekshiruvi: token → `profiles.role = 'admin'`, aks holda 403.
- **Frontend:** `src/features/admin/attemptsApi.ts` (zod strict kontraktlar),
  `src/pages/admin/AttemptsPage.tsx` (filter bar, jadval, pagination,
  detal paneli — to'g'ri/noto'g'ri javoblar rang bilan belgilanadi),
  AdminLayout NAV + `/admin/attempts` route. ExamRunner o'zgarishsiz —
  `duration_sec` avtomatik ishlaydi (timer + auto-finish mavjud edi).
  Mavzu testi intro ekranida "Vaqt cheklovi yo'q" o'rniga haqiqiy cheklov
  ko'rsatiladi: `ExamGateway.previewTopicTest` (backendGateway) dars
  pool'idan `min(savollar, 20) × 2 daqiqa` hisoblaydi — "20 ta savol ·
  40 daqiqa"; preview olib bo'lmasa "Umumiy vaqt: har bir savol uchun
  2 daqiqa" fallback. (3 ta yangi test: 60 savol → 20×40, <20 → haqiqiy
  son, xato → null.)
- **Testlar:** backend 99/99 (admin.test.ts: 9 ta — 401/403/404, list,
  kod→UUID resolve, 400, detal variant tartibi, eski exam natural tartib);
  frontend 238/239 (attemptsApi.test.ts: 5 ta). Lint 0 xato, tsc clean
  (yangi fayllar); faqat pre-existing BookReader timeout.
- **Live E2E:** ikkita urinish → har birida 20 ta distinct savol, takror
  urinishda ~5/20 overlap (random); umumiy savolda variant tartibi har
  urinishda farq qiladi (0/5 bir xil); submit/finish → DB'da `user_answer`,
  `is_correct`, `score`, `time_spent_sec`, `answered_at` saqlanadi;
  admin list/detail real ma'lumotlarni qaytardi (answered_count javob
  berilgan item'lar soni — `.not('answered_at', 'is', null)`).
  000017 push'idan so'ng: M01.02 exam start → 20 item, `duration_sec 2400`
  javobda ham, `exams` jadvalida ham (40 daqiqa).
- **Eslatma:** local docker mavjud emas — migratsiya remote'ga `supabase
  db push --linked --yes` orqali qo'llandi (sintaksis va xatti-harakat
  live tekshirildi). Backend `backend/.env` PORT=3001.

## Vercel deploy va routing tuzatish (TASK-018, 2026-07-31)

- **Deploy:** frontend `attestatsiya` → https://attestatsiya-five.vercel.app (login forma ishlaydi,
  qora ekran yo'q); backend `attestatsiya-backend` → https://attestatsiya-backend.vercel.app
  (`/api/health` → `healthy`, DB ulangan). Frontend env: `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL` (Production + Preview). Backend env:
  `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `AUTH_REDIRECT_URL` (Production).
- **Qora ekran sababi (yechildi):** `vercel.json`'dagi `@` secret reference nomlari kichik
  harfda, Vercel loyihasida katta harfda edi — nom mos kelmasligi sabab "Secret does not
  exist" xatosi. Env block olib tashlandi; Vercel env var'lar build'ga to'g'ridan-to'g'ri
  beriladi.
- **Backend routing bug (topildi va yechildi, PR #9):** Vercel CLI 58.4.4 (va remote
  builder) `api/[...all].ts` uchun `^/api/([^/]+)$` — faqat BIR segmentli — route
  generatsiya qiladi; ko'p segmentli `/api/auth/login` kabi yo'llar platforma 404
  qaytarardi. Bu fastify preset yoki `outputDirectory`'ga bog'liq emas (3 throwaway
  loyihada — fastify'li/fastify'siz, outputDirectory'li/li'siz — bir xil natija).
  Yechim: `backend/vercel.json`'ga
  `"rewrites": [{"source": "/api/:path*", "destination": "/api/[...all]"}]` qo'shildi.
  Rewrite asl URL'ni saqlaydi (`req.url = /api/auth/me?path=auth%2Fme`), Fastify
  pathname bo'yicha to'g'ri route qiladi.
- **Live tasdiqlash (to'liq oqim):** register → confirm (SDK `admin.updateUserById`,
  `email_confirmed_at` yoziladi) → login (`access_token`) → `/api/progress/modules` real
  data (M01, topic_count 12) → `/api/content/modules` 200 → exam start (mavzu M01.02:
  20 item, `duration_sec` 2400, Y1 format, 4 variant) → finish (`max_score` 40,
  `S1.INFO` breakdown). `/api/auth/me`, `/api/exam/due-reviews`, `/api/progress/modules`
  auth'siz 401 (TOKEN_REQUIRED) qaytaradi.
- **Brauzer e2e (Playwright):** `src/tests/e2e/live-auth.spec.ts` deployed backend'ga
  qarshi yashil (2/2): login → dashboard → profil; muddati o'tgan session reload'da
  auto-refresh; chiqish → barcha sahifalar `/auth`ga qaytaradi.
- **Eslatma (T-019, TASK-020'da yechildi):** `POST /api/auth/register` noto'g'ri body bilan
  400 o'rniga 500 qaytarar edi — asl sabab `setErrorHandler` route'lardan keyin
  chaqirilgani (route context'lari default handler'ni ushlab qolgan) + zod 3.25.x
  `errors` API'si; endi 400 `VALIDATION_ERROR` qaytadi (regressiya testlari bilan).
- **Xavfsizlik eslatmasi:** Vercel token, Supabase service key chatda yozilgan —
  hammasi ishlagach token va service key'ni rotate qilish tavsiya etiladi (repo toza,
  `check-secrets` o'tdi).

## To'q ko'k ekran va manifest xatosi tuzatish (TASK-020, 2026-07-31)

- **Foydalanuvchi xabari:** konsolda `Manifest: Line 1, column 1, Syntax error`, ekran
  to'q ko'k (hech narsa ko'rinmaydi). Chuqur tahlil frontend + backend + live serverlar
  bo'yicha o'tkazildi, 3 ta asosiy sabab topildi:
- **1) `public/` katalogi umuman yo'q edi** — `/manifest.json`, `/favicon.svg`,
  `/apple-touch-icon.png`, `/og-image.png` 404 bo'lgan; root `vercel.json` SPA rewrite
  (`/(.*) → /index.html`) tufayli `/manifest.json` index.html (HTML) qaytargach brauzer
  "Manifest: Line 1, column 1, Syntax error" bergan. Yechim: `public/` yaratildi —
  `manifest.json` (Attestatsiya), `favicon.svg`, `robots.txt`, `apple-touch-icon.png`,
  `og-image.png` (`scripts/gen_assets.mjs` — sof node:zlib PNG encoder, qo'shimcha
  dependency'siz, qayta generatsiya mumkin). Vercel real statik faylni rewrite'dan oldin
  beradi.
- **2) index.html'da EnglishPath brendi qolgan edi** (title/og EnglishPath, `lang="en"`,
  `theme-color #1a56db` ko'k, noto'g'ri supabase preconnect) — Attestatsiya brendiga
  almashtirildi: `lang="uz"`, to'g'ri supabase preconnect, `theme-color` #ffffff default
  (dark rejimda inline skript #030712 qo'yadi; theme.ts ham moslashtirildi).
- **3) apiClient'da fetch timeout yo'q edi** — backend javob bermasa loading abadiy
  qolib, to'q ekran ko'rinardi. Endi `fetchWithTimeout` (AbortController, 20s) barcha
  so'rovlarda (refresh ham); AbortError → aniq "Server javob bermadi" xabari.
- **T-019 asl ildiz sababi topildi (backend zod 500):** `setErrorHandler` route'lardan
  KEYIN chaqirilgani uchun Fastify route context'lar yaratilganda default handler'ni
  snapshot qilib olgan (fastify/lib/context.js — `errorHandler || server[kErrorHandler]`)
  → global handler hech qachon ishlamagan; qo'shimcha: zod 3.25.x (v4-core transitional)
  `error.errors` o'rniga `issues` ishlatadi. Yechim: (1) `setErrorHandler` route'lardan
  oldin ko'chirildi; (2) `errors.ts` ga `getZodIssues()` strukturaviy tekshiruv
  (`name === 'ZodError'` + `issues`/`errors` massivlari), sendError'da 400
  VALIDATION_ERROR branch; (3) handler ichi try/catch bilan himoyalandi.
- **Validatsiya:** frontend tsc + build yashil, 242 test; backend tsc + `tsconfig.api.json`
  yashil, 102 test (3 ta yangi regressiya — `backend/src/lib/__tests__/error-handler.test.ts`:
  register {} → 400, login noto'g'ri email → 400, logout tokensiz → 401 global handler
  orqali). Live `app.inject` tekshiruvida register {} endi 400 VALIDATION_ERROR
  (avval 500 Fastify default format).
- **Eslatma:** foydalanuvchi to'q ekranni eski bundle keshidan ham ko'rgan bo'lishi
  mumkin — yangi deploy yangi asset hash'lar bilan keladi; bitta hard refresh
  (Cmd+Shift+R) yetarli bo'ladi.

## Backend GitHub auto-deploy (TASK-021, 2026-07-31)

> ⚠️ Bu bo'lim tarixiy holatni tasvirlaydi — keyinroq TASK-022 da backend alohida
> `attestatsiya-backend` repoga ko'chirildi va Vercel qayta ulandi. Quyidagi
> monorepo ulanish (repo: attestatsiya, rootDirectory: backend) endi mavjud emas.

- **Backend loyihasi (attestatsiya-backend) Vercel GitHub integratsiyasiga ulandi:**
  `POST /v9/projects/prj_xDVzqUZyqVP33Eiy2OoMqoes6fgI/link` bilan
  `{"type":"github","repo":"attestatsiya","org":"sarvar9417"}` — endi har
  `main`'ga push'da avtomatik production deploy bo'ladi.
- **`rootDirectory: backend`** (PATCH /v9/projects/{id}) — build `backend/` katalogidan
  bajariladi, `backend/vercel.json` ishlatiladi (rewrites + buildCommand/outputDirectory).
- **`productionBranch: main`** — ulanishda avtomatik o'rnatildi.
- **Env var'lar (production):** SUPABASE_URL, SUPABASE_SERVICE_KEY, AUTH_REDIRECT_URL —
  avvalgi CLI deploy'lardagi kabi. Preview env var'lari hali yo'q — PR preview'lari
  env'siz ishga tushadi (kerak bo'lsa alohida qo'shilishi mumkin).
- **Eslatma:** bundan oldin backend faqat qo'lda `vercel deploy --prod --token` bilan
  deploy qilinardi (GitHub integratsiya ulanmagan edi); frontend (attestatsiya)
  allaqachon ulangan edi. Endi ikkala loyiha ham main push'da avtomatik deploy bo'ladi.

## Backend alohida repo'ga ko'chirildi (TASK-022, 2026-07-31)

- **Backend endi mustaqil GitHub repoda:** `sarvar9417/attestatsiya-backend` (public,
  to'liq ko'chirish — asosiy repodagi `backend/` katalogi o'chirildi). Asosiy repo
  `attestatsiya` faqat frontend (va supabase migrations, hujjatlar) uchun.
- **Yangi repo tarkibi:** `src/`, `api/[...all].ts`, `vercel.json`, tsconfig'lar,
  `vitest.config.ts`, `package-lock.json`, `.env.example` (faqat placeholder'lar),
  `README.md`, `.gitignore` (node_modules/.env/.vercel/dist/coverage/*.log),
  `.github/workflows/ci.yml` (npm ci + check:secrets + tsc + tsc:api + vitest run,
  placeholder env bilan — testlar .env'siz ishlaydi), `scripts/check-secrets.mjs`
  (`sb_secret_` va JWT pattern'lar).
- **Vercel qayta ulandi:** attestatsiya-backend loyihasi endi yangi repoga bog'langan
  (`POST /link` → `{type: github, repo: attestatsiya-backend, org: sarvar9417}`);
  eski monorepo bog'lanishi o'chirildi; `rootDirectory` bekor qilindi (repo o'zi
  backend ildizi); `productionBranch: main`.
- **Auto-deploy tasdiqlandi:** yangi repoga push (`e82a477`) → Vercel production
  deploy avtomatik (sha: e82a4773, ref: main, target: production, READY). Jonli:
  `/api/health` healthy (DB env'lar ishlayapti), `register {}` → 400 VALIDATION_ERROR.
- **Env var'lar (Vercel, production):** SUPABASE_URL, SUPABASE_SERVICE_KEY,
  AUTH_REDIRECT_URL — o'zgarmadi (loyiha darajasida).
- **Env var'lar (Vercel, preview, 2026-07-31 qo'shildi):** SUPABASE_URL va
  SUPABASE_SERVICE_KEY (type sensitive) — production qiymatlari preview
target'iga ko'chirildi (API orqali; decrypt API bo'sh qaytgani uchun qiymatlar
lokal `.env`dan olindi — production bilan bir xil manba). Endi PR preview'lari
runtime'da env'siz 500 bermaydi. `AUTH_REDIRECT_URL` preview'ga ataylab
qo'shilmadi: ixtiyoriy (config'da default) va preview frontend URL'i har
deploy'da dinamik. Eslatma: Vercel'da key rotatsiyasi bo'lsa preview'ni ham
yangilash kerak.
- **SSO himoyasi:** `ssoProtection: all_except_custom_domains` — barcha custom
  bo'lmagan domaynlar (preview URL'lari, GitHub PR preview'lari ham) Vercel
auth talab qiladi; production `attestatsiya-backend.vercel.app` (custom alias)
ochiq. Preview'lar faqat Vercel'ga login bo'lgan tekshiruvchilarga ko'rinadi
(standart sozlama; xohlasangiz alohida o'chirish mumkin).
- **Lokal (yangi tuzilma, 2026-07-31):** `~/Desktop/attestatsiya` papkasi ichida
  ikkita alohida repo: `frontend/` (attestatsiya repo — frontend + supabase +
  hujjatlar) va `backend/` (attestatsiya-backend repo). Backend `.env`
  `~/Desktop/attestatsiya/backend/.env` da (gitignore'da). Lokal backend
  `~/Desktop/attestatsiya/backend` da ishlaydi (`npm run dev`, PORT=3001).
  Har ikkala repo'ning GitHub/Vercel ulanishi o'zgarmadi.
- **Asosiy repoda:** 44 backend fayli olib tashlandi; README/CI frontend'ga
  bog'liq emasligi uchun o'zgarmadi; faqat PROJECT_STATE.md va TASKS.md yangilandi.

## Vercel platformani to'liq jonli tekshiruv va tuzatishlar (2026-07-31)

- **Asosiy sabab ("platforma ishlamayapti" shikoyati):** Supabase Auth `site_url`
  `http://localhost:3000` edi va redirect allow-list bo'sh edi — ro'yxatdan o'tish
  tasdiqlash xatidagi link localhost'ga yo'nalardi; resend/reset `redirect_to`'lari
  esa "Invalid redirect" xatosiga uchragan bo'lardi.
- **Tuzatishlar (Supabase Management API orqali):** `site_url` →
  `https://attestatsiya-five.vercel.app`; `uri_allow_list` (vergul bilan ajratilgan
  string) → `https://attestatsiya-five.vercel.app,https://attestatsiya-five.vercel.app/reset-password,http://localhost:3000`.
  Eslatma: Management API'dagi maydon `additional_redirect_urls` EMAS —
  `uri_allow_list` (string, vergul bilan ajratiladi); noto'g'ri maydon jimgina
  qabul qilinmaydi (site_url o'tdi, allow-list qolmadi — shu aniqlangan edi).
- **AUTH_REDIRECT_URL (Vercel backend, production):** masked/tekshirib
  bo'lmaydigan qiymat o'chirilib, `https://attestatsiya-five.vercel.app` bilan
  almashtirildi (sensitive env'da PATCH ishlamaydi — DELETE + POST qilindi);
  production redeploy qo'llandi. Bu resend-confirmation va reset-password
  redirect'larida ishlatiladi.
- **Email strategiya:** Supabase default email provayderi (foydalanuvchi tanlovi).
  Free-tier chegara: 2 xat/soat — `over_email_send_rate_limit` (429). Backend endi
  buni aniq `EMAIL_RATE_LIMITED` (429, "Xat yuborish chegarasiga yetildi. Bir necha
  daqiqadan keyin qayta urinib ko'ring.") xabari bilan qaytaradi (`mapAuthError`
  yangi branch + 2 test; backend 104/104 yashil).
- **Jonli tasdiqlash:** frontend 0 konsol xato + himoya kodi bundle'da;
  backend healthy; register → admin confirm → login → me → progress/modules to'liq
  oqim ishlaydi; test foydalanuvchilar tozalandi. Route himoyasi ishlab turibdi
  (bundle'da `auth?returnTo`/`SESSION_EXPIRED`/`expired=1` kodlari bor).

## E2E tekshiruv — mock imtihon cheklovi (2026-07-31)

- **Brauzer render:** login/ro'yxatdan o'tish formasi to'liq ko'rinadi, 0 konsol
  xato, failed request yo'q (`attestatsiya-five.vercel.app`).
- **To'liq API oqim ishladi:** register (201) → admin confirm → login (200,
  access_token) → `/api/auth/me` → `/api/exam/start` (bolim/M01 → 15 savol,
  1800s) → `/api/exam/submit` (saved:true) → `/api/exam/finish` (breakdown).
  Test foydalanuvchilari tozalandi.
- **Ma'lum cheklov — mock imtihon (`kind=mock`) 503 `INSUFFICIENT_POOL`:
  "Savollar bazasi yetarli emas"** — Dashboard'dagi "Sinov imtihoni — 50 savol ·
  120 daqiqa" tugmasi shu yo'lni ishlatadi. Ildiz sabab: blueprint 50 savolni
  13+ guruh bo'yicha (`S1.INFO`, `S2.HW`, `S2.OFFICE`, `S3.LOGIC`, `S3.NUM`,
  `S3.ALGO`, `S4.BLOCK` …) `bilish`/`qollash`/`mulohaza` taqsimoti bilan talab
  qiladi; DB'da esa faqat M01 kontenti (`S1.INFO`, 400 savol, hammasi `bilish`)
  bor, boshqa guruhlarda 0–1 savol. Qaror (foydalanuvchi): **hozircha
  qoldiriladi** — keyingi modullar (M02–M16) kontenti import qilinganda mock
  imtihon ishlay boshlaydi. Agar oldinroq kerak bo'lsa: (a) blueprint
  quota'larini mavjud kontentga moslash (migration + ADR) yoki (b) `start_exam`
  RPC'sida mock uchun qat'iy 50-savol shartini yumshatish (kod + migration +
  testlar).

## Ochiq masalalar — M01 kontenti

- M01.01 (appendix) ga savol biriktirilmagan: `generate_topic_test` da
  `savol_yoq` xatosi qaytadi, UI buni "Bu mavzu uchun savollar mavjud emas"
  deb ko'rsatadi. Boshqa 11 mavzuda `source_lesson_id` orqali savol pool'i
  mavjud (M01.02 → 60).
- `scripts/` da eski (endi yo'q bo'lgan `chapters/` papkasiga tayangan)
  m01 pipeline qoldiqlari bor: `rebuild_m01*.py`, `fix_m01_content.py`,
  `generate_m01.py`, `clean_m01.py`, `audit_m01.py`, `m01_*.txt`,
  `m01_content.json`. Ular hech qayerdan chaqirilmaydi.
- Frontend `tsc` da pre-existing admin sahifa xatolari qolmoqda (66 ta,
  eski `QuestionFormModal/ModulesPage/QuestionsPage/SourcesPage/SpecsPage`
  schema nomlaridan) — T-017/T-018 ga tegishli emas.

## Environment holati

| Muhit | URL | Database | Holat |
|-------|-----|----------|-------|
| Local frontend | `http://localhost:3000` (vite) | Remote Supabase (plyqezulrfowyblsfpzy) | M01 12 dars + 400 savol DB'da; dars testi 20 random/shuffle |
| Local backend | `http://localhost:3001` (`~/Desktop/attestatsiya/backend`) | Remote Supabase | Alohida repo: `sarvar9417/attestatsiya-backend`; /api/admin/attempts faol |
| Production (frontend) | https://attestatsiya-five.vercel.app | Remote Supabase | Deploy; login forma ishlaydi, qora ekran yo'q |
| Production (backend) | https://attestatsiya-backend.vercel.app | Remote Supabase | /api/health healthy; barcha /api/* route'lar Fastify'ga yetib boradi |

## Muhim havolalar

- **Supabase project:** https://supabase.com/dashboard/project/plyqezulrfowyblsfpzy
- **DB connection:** secret manager yoki lokal `.env` orqali boshqariladi
- **Service Role Token:** repoda saqlanmaydi; Supabase secret manager orqali boshqariladi
- **files/ spec:** `files/00-README.md` dan boshlanadi


## Blueprint strip (T-026, 2026-10-07)

- Dashboardga 2026 rasmiy baholash blueprintining 15 guruhli proportional strip komponenti qo‘shilmoqda.
- Segment kengliklari `BLUEPRINT_GROUPS.questionCount` dan olinadi; hardcoded alohida nusxa yo‘q.
- Acceptance nisbat: `3:2:5:3:2:3:3:3:2:5:2:2:5:7:3`, jami 50 savol.
- Section legend: mutaxassislik 35, kasb standarti 5, pedagogika 7, metodika 3.
- Test: segment soni, flexGrow, nisbat va jami savol invariantlari tekshirildi; secret scan, lint, typecheck, unit, generated-pool invariantlari, build, Playwright E2E va database job yashil.


```text
Task: T-026
Natija: 2026 Blueprint strip dashboardga qo‘shildi va rasmiy 15-guruh nisbatida render qilinadi
O‘zgargan fayllar: src/components/dashboard/BlueprintStrip.tsx; src/pages/DashboardPage.tsx; src/tests/BlueprintStrip.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo‘q
Testlar: GitHub CI full green
Qolgan blocker: T-025 remote Supabase migration history permission
```


## Learner natijalar tarixi (T-027, 2026-10-07)

- **Yangi protected route:** `/history`.
- **Real backend data:** sahifa mavjud `GET /api/exam/history?page=&page_size=`
  endpointidan faqat autentifikatsiyalangan learnerning yakunlangan urinishlarini oladi.
- **Frontend kontrakti:** `examHistoryResponseSchema` server javobini strict Zod
  bilan tekshiradi; answer key yoki client-side qayta scoring kiritilmagan.
- **UX:** current-page o‘rtacha natija, o‘tgan urinishlar soni, jami urinishlar,
  loading, empty, API error/retry va 20 talik pagination mavjud.
- **Navigation:** desktop Sidebar va mobile bottom navigation ichiga
  `Natijalar tarixi / Natijalar` qo‘shildi.
- **Test qamrovi:** history sahifa server-data, empty, failure→retry va pagination bilan;
  frontend↔backend integration testi `/api/exam/history` URL va payload kontraktini
  tekshiradi. GitHub CI quality + database to‘liq yashil.
- **T-025 holati:** Supabase connector hozir ham `plyqezulrfowyblsfpzy` projectini
  ko‘rsatmayapti; remote migration history reconciliation bloklanganicha qoladi.

### Handoff

```text
Task: T-027
Natija: server-backed learner Natijalar tarixi UI tayyor
Route: /history
Data source: GET /api/exam/history?page=&page_size=
O‘zgargan asosiy fayllar: contracts.ts; examGateway.ts; backendGateway.ts; ExamHistoryPage.tsx; App.tsx; Sidebar.tsx; MobileBottomNav.tsx; ExamHistoryPage.test.tsx; apiIntegration.test.ts
Migratsiyalar: yo‘q
Qolgan blocker: T-025 remote Supabase migration history permission
```


## Monorepo konsolidatsiyasi (T-028, 2026-10-07)

- **Source-of-truth:** `sarvar9417/attestatsiya` endi frontend, Fastify backend,
  Supabase migrations va loyiha hujjatlarini bitta repositoryda saqlaydi.
- **Tuzilma:** frontend mavjud rootda qoladi; backend to‘liq `backend/` ostiga
  ko‘chirildi. Bu frontend Vercel rootini o‘zgartirmasdan monorepo qilishga imkon beradi.
- **Parity:** eski `sarvar9417/attestatsiya-backend` main branchidagi 46 ta
  source/config fayl `backend/`ga byte-for-byte mos ko‘chirildi; nested eski GitHub
  workflow ko‘chirilmadi, chunki root CI uning o‘rnini bosadi.
- **CI:** root workflowga alohida `backend` job qo‘shildi: `npm ci`,
  secret scan, server typecheck, Vercel API-entry typecheck va unit testlar.
- **Local workflow:** root package scriptlari orqali `npm run dev:backend` va
  `npm run check:backend` qo‘shildi.
- **Deploy:** frontend Vercel loyihasi o‘zgarishsiz. Backend production
  `attestatsiya-backend` Vercel projectiga monorepo `main` commit
  `c46437fa6d5e72d6bdd8e638c264e7fcb6fe8ffe` dan `backend/` root bilan
  production deploy qilindi va READY holatiga keldi; custom alias
  `attestatsiya-backend.vercel.app` saqlandi.
- **Legacy repo:** `sarvar9417/attestatsiya-backend` tarixiy/rollback fallback sifatida
  vaqtincha qoladi; yangi backend featurelar monorepodagi `backend/`da qilinadi.
- **Vercel Git integration cheklovi:** production deploy monorepodan bajarildi, ammo
  Vercel MCP mavjud `attestatsiya-backend` projectining Git linkini boshqa repoga
  qayta ulash operatsiyasini bermaydi. Project hali eski repo bilan Git-linked;
  monorepo backend o‘zgarishlari hozircha explicit Vercel deployment orqali chiqariladi
  yoki Vercel dashboardda Git repo `sarvar9417/attestatsiya`, Root Directory `backend`
  qilib bir marta relink qilinadi.


### T-028 Handoff

```text
Task: T-028
Natija: frontend + backend + Supabase artefaktlari bitta sarvar9417/attestatsiya monorepoda
Backend path: backend/
Production backend deploy: READY, source sarvar9417/attestatsiya@c46437f, root backend/
GitHub CI: frontend quality + backend quality + database — yashil
Migratsiyalar: yo‘q
Qolgan operatsion cheklov: Vercel backend project Git linki dashboard/MCP orqali eski repo'dan monorepoga avtomatik relink qilinmadi
Keyingi backend source-of-truth: sarvar9417/attestatsiya/backend
```


## Figma exam shell parity (T-029, 2026-10-07)

- **Maqsad:** oldingi Figma/chat tasdiqlangan test ekraniga faol `ExamRunner`
  shellini yaqinlashtirish; scoring, timer va answer lifecycle biznes qoidalarini
  o‘zgartirmaslik.
- **Design basis:** saqlangan `Dual-Theme Attestatsiya Test Interface` referensi
  bo‘yicha asosiy savol chapda, nomzod ma’lumoti + vaqt + savollar navigatsiyasi
  o‘ngda, 10 ustunli number grid va answered/current/flagged/unanswered legend.
- **Figma MCP:** Academik Starter workspace uchun joriy tool-call limiti tugagan;
  shu sabab yangi live node read qilinmadi. Ish avval tasdiqlangan Figma yo‘nalishi,
  saqlangan reference va mavjud TASK-UI-004 behavior contractiga tayangan.
- **Xavfsizlik:** mavjud auth’da yo‘q `guruh` kabi ma’lumotlar uydirilmaydi;
  nomzod kartasi faqat display name/email/id va fan kabi real platforma
  ma’lumotlarini ko‘rsatadi.
- **Behavior boundary:** answer hali ham explicit `Javobni saqlash` orqali
  serverga yuboriladi; flag scoring payloadiga kirmaydi; timer va final score
  server-authoritative qoladi.
- **Route shell:** `/exam/*` global learner sidebar/mobile bottom navdan ajratilib,
  sinov vaqtida immersive layout ishlatadi.
- **Test natijasi:** frontend secret scan, lint, TypeScript, 297 unit test,
  generated-content invariantlari, production build va Playwright E2E yashil;
  backend va database CI joblari ham yashil.
- **Regression:** eski `Sinovni yakunlash` accessibility contracti saqlandi;
  Figma ko‘rinishida tugma matni `Testni yakunlash`, ammo mavjud test/assistive
  contract buzilmadi.

### T-029 Handoff

```text
Task: T-029
Natija: Figma approved immersive exam shell parity
O‘zgargan fayllar: src/App.tsx; src/features/exam/ExamRunner.tsx; src/index.css; src/tests/MockExamFlags.test.tsx; src/tests/e2e/exam-product-flow.spec.ts; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo‘q
Testlar: GitHub CI quality + backend + database — yashil
Behavior: explicit answer submit, server timer/scoring, local review flag semantikasi saqlandi
Figma live read: Starter tool limit sabab bloklangan; saved approved reference + prior screen contract ishlatildi
Keyingi tavsiya: Natija/Xatolar ekranlarining Figma parity auditini davom ettirish
```


## Post-exam learner flow (T-030, 2026-10-07)

- **Reja manbasi:** oldingi chatlarda tasdiqlangan Figma oqimi
  `Mock Test → Natija → Xatolar` va `UX_SPEC.md` Result/Errors talablari.
- **Figma holati:** `WkjyxZbrAGkolxjYop7VrS` file live o‘qilishi Starter MCP
  call limit sabab bloklangan; shu task mavjud tasdiqlangan visual system,
  T-029 exam shell va repositorydagi UX specdan chetga chiqmaydi.
- **Natija → action:** finalized natija ekranida `Xatolarni qayta ishlash` va
  `Natijalar tarixi` yo‘llari ko‘rsatiladi.
- **Item review:** `Tahlilni ochish` learnerning joriy finalized exam idsi bilan
  `getReview(exam_id)`ni chaqiradi. Savol holati, construct, stem va explanation
  serverdan keladi; review exam tugashidan oldin yuklanmaydi.
- **Xavfsizlik:** client scoring qayta hisoblanmaydi; answer key browserga exam
  tugashidan oldin chiqarilmaydi; mavjud explicit submit va server finish semantikasi
  o‘zgarmadi.
- **Ataylab qo‘shilmagan:** UX specdagi vaqt, 4 section, 16 module va cognitive
  kesimlari joriy finish kontraktida yo‘q, shuning uchun UI’da uydirilmagan.


### T-030 Handoff

```text
Task: T-030
Natija: finalized Natija → savollar tahlili → Xatolar/Natijalar tarixi learner oqimi
O‘zgargan fayllar: src/features/exam/ExamRunner.tsx; src/tests/ExamResultDecision.test.tsx; TASKS.md; PROJECT_STATE.md
API: mavjud GET /api/exam/:id/review, /api/exam/history, /api/exam/due-reviews
Migratsiyalar: yo‘q
Testlar: GitHub CI quality + backend + database — yashil
Xavfsizlik: review faqat finalized result ekranidan; scoring va answer submit server-authoritative
Figma: live read Starter MCP limit sabab bloklangan; approved file/chat flow + UX_SPEC.md ishlatildi
Keyingi UI yo‘nalish: real backend kontraktini kengaytirmasdan uydirma readiness/section/module/cognitive metrikalarini ko‘rsatmaslik
```


## Persistent learner result (T-031, 2026-10-07)

- **Plan basis:** `UX_SPEC.md` dagi `/results/[sessionId]` route va
  oldingi Figma/chat `Natija → Xatolar` oqimi.
- **Backend:** `GET /api/exam/:id/result` faqat autentifikatsiyalangan learnerning
  o‘z finalized attemptini qaytaradi. Query `id` + `user_id` bilan explicit
  filterlanadi va RLS ham faol qoladi; boshqa learner attempti 404 sifatida yashiriladi.
- **Frontend:** protected `/results/:examId` sahifasi serverdagi score, passed,
  lesson metadata va mavjud group breakdownni ko‘rsatadi.
- **History continuity:** `/history` kartalari persistent result detailga bog‘landi.
- **Review boundary:** answer/explanation `getReview(examId)` orqali faqat
  foydalanuvchi finalized result sahifasida `Tahlilni ochish`ni bosganda olinadi.
- **No fabricated analytics:** vaqt sarfi, 4 section, 16 module, cognitive va
  weakest-objective ko‘rsatkichlari joriy server kontraktida yo‘q; UI’da uydirilmaydi.
- **Figma live access:** Starter MCP limit hali faol; mavjud approved visual system
  va repository UX contract source-of-truth sifatida ishlatilmoqda.


### T-031 Handoff

```text
Task: T-031
Natija: persistent /results/:examId learner natija sahifasi va secure single-result API
Backend: GET /api/exam/:id/result; id + authenticated user_id filter; finalized-only
Frontend: ExamResultPage; history → result detail; lazy finalized review
O‘zgargan asosiy fayllar: backend/src/services/exam.service.ts; backend/src/routes/exam.ts; backend/src/schemas/exam.ts; src/features/exam/contracts.ts; examGateway.ts; backendGateway.ts; src/pages/ExamResultPage.tsx; ExamHistoryPage.tsx; App.tsx
Migratsiyalar: yo‘q
Testlar: backend service/route guard; frontend result page; history navigation; API integration
GitHub CI: quality + backend + database — yashil
Xavfsizlik: boshqa learner resulti 404; unfinished result 400; answer key faqat finalized review endpointda
```


## Xatolar → qayta tekshirish oqimi (T-032, 2026-10-07)

- **Reja manbasi:** Figma/chat oqimidagi `Natija → Xatolar` bosqichi va
  `UX_SPEC.md` tamoyili: “Xato jazolash emas, keyingi o‘rganish actioniga aylantiriladi”.
- **Aniqlangan regressiya:** `ExamPage` faqat `mock/bolim/mavzu` kindlarini
  tan olgani uchun `/exam/takrorlash` va `/exam/zaif` yashirin ravishda
  mock examga fallback qilardi.
- **Yechim:** `ExamRunner` va gateway server qo‘llaydigan `takrorlash/zaif`
  kindlarini explicit qo‘llaydi; due-review sahifasida real
  `/exam/takrorlash` CTA mavjud.
- **Xavfsizlik:** review queue clientda savol yoki answer-key qurmaydi; yangi session
  mavjud `POST /api/exam/start { kind: 'takrorlash' }` orqali serverda yaratiladi.
- **Figma live MCP:** Academik Starter plan tool-call limiti hali faol; yangi node
  read qilib bo‘lmadi. Ish oldin tasdiqlangan visual system va repository UX contractiga
  tayangan.


### T-032 Handoff

```text
Task: T-032
Natija: /review → /exam/takrorlash real server-selected retest oqimi
Backend contract: POST /api/exam/start { kind: "takrorlash" | "zaif" }
Frontend: takrorlash/zaif explicit route; mock fallback yo‘q; backUrl=/review
Testlar: ReviewPage CTA, ExamPage focused-kind, API integration
GitHub CI #587: quality + backend + database — SUCCESS
Merge: PR #53, main commit 647fd36351234e3ae980e54b7a61bdf4a7c375b3
Migratsiyalar: yo‘q
Keyingi bajarilmagan blok: onboarding + diagnostika + daily plan
```


## Onboarding + diagnostika (T-033, 2026-10-07)

- **Plan basis:** UX_SPEC Onboarding va PRODUCT_REQUIREMENTS J-01: ism, imtihon
  sanasi (noma'lum mumkin), kunlik 10/20/30/45/60 daqiqa va diagnostika taklifi.
- **DB migration:** `20261007131000_onboarding_profile.sql` profile'ga
  `timezone`, `locale`, `exam_date`, `daily_goal_minutes`,
  `onboarding_completed_at`, `updated_at` qo'shadi; daily goal 5–240 DB
  constraint bilan himoyalanadi.
- **Backend:** `GET/PATCH /api/auth/onboarding`; o'tgan exam_date rad qilinadi.
  Remote schema hali eski bo'lsa GET `available=false` fail-open qaytaradi,
  PATCH esa `ONBOARDING_SCHEMA_PENDING` 503 qaytaradi.
- **Frontend:** standalone `/onboarding` ekran, learner-only OnboardingGate,
  diagnostikani boshlash yoki skip qilish. Admin/editor guarddan o'tadi.
- **Diagnostika:** mavjud DB `start_exam('diagnostika')` RPC'iga frontend/backend
  route support qo'shildi; mock examga yashirin fallback yo'q.
- **Remote blocker:** Supabase connector `plyqezulrfowyblsfpzy` projectini hali
  ko'rsatmaydi. Shu sabab migration productionga bu branchda qo'llanmaydi;
  feature schema mavjud bo'lmaguncha production oqimini bloklamaydi.


### T-033 Handoff

```text
Task: T-033
Kod holati: MERGED
Merge: PR #55, main commit c7770361738d9e6f65f8a6a80d1178e2268c126b
CI: GitHub Actions #630 — quality + backend + database SUCCESS
Frontend: /onboarding + learner OnboardingGate + /exam/diagnostika
Backend: GET/PATCH /api/auth/onboarding; diagnostika start accepted
Migration: supabase/migrations/20261007131000_onboarding_profile.sql
Production migration: YO‘Q
Status: BLOCKED faqat remote activation bo‘yicha
Blocker: Supabase connector plyqezulrfowyblsfpzy projectini hali ko‘rsatmaydi
Safety: schema yo‘q bo‘lsa GET available=false compatibility holati; majburiy gate oddiy network/server xatosida fail-closed
Parallel keyingi ish: mastery/SRS/adaptive foundation remote schema activationdan mustaqil ravishda migration+CI sifatida tayyorlanishi mumkin
```


## Mastery/SRS foundation (T-034, 2026-10-07)

- **Plan basis:** PRODUCT_REQUIREMENTS FR-MASTERY: independent evidence, cognitive
  natijalarni alohida yuritish, explicit mastery status va 1/3/7/14/30 review.
- **Schema:** `mastery_status`, `mastery_evidence_kind`,
  append-only `mastery_evidence`; `user_construct_stats`ga review stage,
  evidence counters va bilish/qollash/mulohaza counterlari qo‘shildi.
- **Scheduler v1:** to‘g‘ri mustaqil evidence review stage'ni 1→5 oshiradi va
  1/3/7/14/30 kunlik due interval beradi. Stage 2–4 provisional, stage 5 stable.
  Provisional/stable'dan xato javob regressed holatiga tushiradi.
- **Evidence boundary:** accepted first answer `exam_items` transition triggeri orqali
  aynan bir append-only evidence yaratadi; idempotent retry duplicate evidence
  yaratmaydi. Learner Data API orqali evidence insert/update/delete qila olmaydi.
- **Cognitive:** bilish/qollash/mulohaza attempts/correct alohida saqlanadi.
- **Read model:** authenticated `GET /api/progress/mastery` answer key yoki
  full question matnini qaytarmasdan construct status, accuracy, SRS stage va
  cognitive countersni beradi.
- **Remote:** mastery/SRS migration production `plyqezulrfowyblsfpzy` Supabase’ga apply qilindi va remote schema audit bilan tasdiqlandi.


### T-034 Handoff

```text
Task: T-034
Natija: mastery evidence + 1/3/7/14/30 SRS foundation va authenticated mastery read model
Migration: supabase/migrations/20261007184500_mastery_srs_foundation.sql
Backend: GET /api/progress/mastery
Frontend: progressGateway.getMastery()
Security: evidence learner uchun read-only; first-answer idempotency duplicate evidence yaratmaydi
CI: GitHub Actions #655 — quality + backend + database SUCCESS
Merge: PR #57, main commit bc2fca87b9600c18293f87a647054486263f813c
Remote apply: HA; production schema audit yashil
Keyingi non-blocked task: adaptive selector + readiness/next-action service
```


## Blueprint-weighted readiness + next action (T-035, 2026-10-07)

- **Plan basis:** UX_SPEC Dashboard va PRODUCT_REQUIREMENTS FR-AN-05:
  readiness blueprint vaznida taxminiy ko‘rsatkich bo‘lishi kerak; “50/50 kafolat”
  yozilmaydi.
- **Readiness v1:** faqat `mastery_evidence.evidence_kind=independent` evidence
  ishlatiladi. Har blueprint group accuracy o‘z `question_count` vazniga ega.
  Evidence yo‘q group score'ga 0 sifatida qo‘shilmaydi — alohida coverage va
  confidence orqali ko‘rsatiladi.
- **Confidence heuristic v1:** insufficient <10 independent yoki <20% coverage;
  low <50 yoki <50%; medium <200 yoki <80%; high >=200 va >=80%.
  Bu rasmiy attestatsiya kafolati emas, versioned product heuristic.
- **Next action priority:** due review → regressed construct → diagnostika
  (insufficient evidence) → learning.
- **Backend:** authenticated `GET /api/progress/readiness`; service-role
  query'lari explicit user_id filter bilan. Answer key yoki full prompt yo‘q.
- **Compatibility:** T-034 remote schema hali productionga apply qilinmagan bo‘lsa
  endpoint fake score bermaydi; `available=false`,
  `unavailable_reason=mastery_schema_pending` qaytaradi.
- **Dashboard:** eski local completion percent “TAYYORLIK” sifatida ko‘rsatilmaydi;
  server readiness, confidence, independent evidence va blueprint coverage
  ko‘rsatiladi; server tavsiya qilgan next action Bugungi reja CTA'iga ulanadi.


### T-035 Handoff

```text
Task: T-035
Natija: blueprint-weighted readiness + confidence/coverage + server next-action
Backend: GET /api/progress/readiness
Frontend: progressGateway.getReadiness(), DashboardPage evidence-based readiness card
Heuristic: confidence only; official attestatsiya score/guarantee emas
CI: GitHub Actions #678 — quality + backend + database SUCCESS
Merge: PR #59, main commit ef84655a3b8f1cc755733173d636b60ffdd8739c
Remote activation dependency: RESOLVED — T-034 mastery schema productionda mavjud
Keyingi non-blocked task: adaptive practice selector (weak + due + new) va revision-repeat himoyasi
```


## Production Supabase reconciliation (T-037, 2026-10-08)

- `plyqezulrfowyblsfpzy` project remote auditda healthy.
- Productionga atomik apply qilindi:
  `20261007000018_question_keys_staff_only`,
  `20261007052732_parametric_generated_questions`,
  `20261007131000_onboarding_profile`,
  `20261007184500_mastery_srs_foundation`.
- Verifikatsiya: generated questions = 270; onboarding profile mavjud;
  mastery status + `mastery_evidence` mavjud; learner-readable eski
  `question_keys_readable` policy yo‘q.
- Production backend health audit: database healthy.
- Remote tarixda oldindan mavjud `20260801000018 exam_batch_finish` migrationi
  tegilmay saqlandi; source reconciliation alohida task.


## Single Vercel application (T-038, 2026-10-08)

- **Talab:** Git monorepo kabi production deploy ham bitta project bo‘lishi shart.
- **Target:** mavjud `attestatsiya` Vercel project.
  Frontend `/`, Fastify backend `/api/*`.
- **Entry:** root `api/[...all].ts` → `backend/src/app.ts`.
- **Frontend API:** productionda `VITE_API_BASE_URL`siz same-origin `/api/*`;
  lokal developmentda default `http://localhost:3001`.
- **Build:** root Vercel install frontend va `backend/` dependenciesni o‘rnatadi;
  Vite output `dist/`, API serverless function shu projectda build qilinadi.
- **Secret boundary:** `SUPABASE_SERVICE_KEY` yagona Vercel projectda faqat
  server runtime env; client bundle VITE-prefixed secret olmaydi.
- **Cutover:** production deploy `dpl_GYeUVSG7eStpAPrEoghAj2y24skf` READY.
  `https://attestatsiya-five.vercel.app` HTTP 200; shu origin ichidagi
  `/api/health` HTTP 200 va database healthy; `/api/content/modules` HTTP 200.
  Production JS bundle eski `attestatsiya-backend.vercel.app` yoki
  `localhost:3001` URLlarini o‘z ichiga olmaydi va relative `/api/*` ishlatadi.
- **Legacy backend deploy:** `attestatsiya-backend` Vercel project PAUSED;
  uning `/api/health` endpointi `503 DEPLOYMENT_PAUSED` qaytaradi. Source/history
  rollback uchun saqlanadi, production traffic unga bog‘liq emas.


### T-038 Handoff

```text
Task: T-038
Natija: frontend + Fastify backend bitta Vercel project/origin
Git: PR #62 merged, main commit 319f3d1492be8b4a998fb051f634629b2bc307e4
Production project: attestatsiya
Production domain: https://attestatsiya-five.vercel.app
Frontend: /
Backend: /api/*
Production deployment: dpl_GYeUVSG7eStpAPrEoghAj2y24skf — READY
Smoke:
  / -> 200
  /api/health -> 200, database healthy
  /api/content/modules -> 200
Bundle audit:
  attestatsiya-backend.vercel.app -> absent
  http://localhost:3001 -> absent
  relative /api/* -> present
Legacy Vercel project: attestatsiya-backend -> PAUSED
GitHub CI PR #62: quality + backend + database SUCCESS
```


## Single Vercel cleanup (T-042, 2026-10-08)

- **Maqsad:** T-038 production cutoverni repository va CI darajasida yakuniy qilish.
- **Standalone config removed:** `backend/vercel.json` olib tashlandi; backendni
  tasodifan ikkinchi Vercel project sifatida deploy qilish yo‘li yopildi.
- **Unified entry checked:** `backend/tsconfig.api.json` endi root
  `api/[...all].ts` entryni ham typecheck qiladi.
- **Frontend regression:** `resolveApiBaseUrl` testlari productionda explicit
  override yo‘q bo‘lsa same-origin `/api/*`, lokalda esa `localhost:3001`
  ishlatilishini lock qiladi.
- **Docs:** `backend/README.md` production backend domenini alohida project
  sifatida ko‘rsatmaydi; yagona production origin `attestatsiya-five.vercel.app`.
- **Runtime:** eski `attestatsiya-backend` Vercel project allaqachon PAUSED;
  uning endpointi 503 `DEPLOYMENT_PAUSED`. Yagona app `/api/health` esa 200.
- **Permanent deletion:** Vercel project deletion platformda foydalanuvchi
  tasdig‘ini talab qiladi; code/runtime cutover deletiondan mustaqil yakunlangan.


### T-042 Handoff

```text
Task: T-042
Natija: bitta Vercel project arxitekturasi repo/CI darajasida qat'iylashtirildi
Production project: attestatsiya
Origin: https://attestatsiya-five.vercel.app
Frontend: /
Backend: /api/*
Removed: backend/vercel.json
CI: GitHub Actions #792 — quality + backend + database SUCCESS
Old Vercel project: attestatsiya-backend PAUSED; permanent delete Vercel user confirmation talab qiladi
```
