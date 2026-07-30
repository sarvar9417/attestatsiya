# PROJECT_STATE.md — joriy holat

> Living document. Har coder task boshlaganda va tugatganda yangilaydi.

## Holat

- Loyiha bosqichi: `DEVELOPMENT`
- Joriy milestone: `P0 — xavfsizlik va barqarorlashtirish`
- Oxirgi yangilanish: `2026-07-30`
- Production mavjud: `yo'q`
- Database project mavjud: `ha (plyqezulrfowyblsfpzy, Singapore)`
- Deployment mavjud: `yo'q`

## Tasdiqlangan asos

- **Stack:** React + Vite, TypeScript strict, Tailwind CSS, Zustand
- **Database:** Supabase (PostgreSQL), UUID PK, enum turlari, RLS
- **Autentifikatsiya:** email/parol ishlaydi; anonymous upgrade hali implement qilinmagan
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
| — | — | T-008 tugadi; secure server-scored ExamRunner navbatda | — | — |

## Bloklovchilar

| ID | Tavsif | Status |
|----|--------|--------|
| B-SEC-001 | Lokal hujjatlardan credential olib tashlandi; Supabase credentiallari rotate qilindi | RESOLVED |
| B-DB-001 | HTTPS audit remote migration metadata jadvali yo‘qligini tasdiqladi | RESOLVED |
| B-DB-002 | Legacy BIGINT liniya arxivlandi; UUID baseline va remote history sinxron | RESOLVED |
| B-QA-001 | CI secret scan, lint, typecheck, unit, build va E2E bilan yashil | RESOLVED |
| B-001 | Y1/Y2/Y3 generatorlar (axborotHajmi, sanoqSistema, mantiqAmal, ipMaska) yozilmagan | OPEN |
| B-002 | ExamRunner + UUID schema moslash | OPEN |
| B-003 | TypeScript database.types.ts remote UUID schema bo‘yicha generatsiya qilindi | RESOLVED |

## Keyingi bajariladigan task

1. Secure server-scored ExamRunner
2. 16 modulni remote lesson/microtopic taksonomiyasi bilan bog‘lash

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
| Build audit | 2026-07-30 | TypeScript + Vite build o'tadi |
| Unit test audit | 2026-07-30 | PR #4 clean GitHub CI’da 54 Vitest test o‘tadi |
| E2E smoke audit | 2026-07-30 | 4 auth smoke testi o'tadi; product flow qamrovi hali yo'q |

## Environment holati

| Muhit | URL | Database | Holat |
|-------|-----|----------|-------|
| Local | `http://localhost:5173` | Remote Supabase (plyqezulrfowyblsfpzy) | UUID baseline va P0-004 RPC security remote bilan sinxron |
| Production | TBD | TBD | Yaratilmagan |

## Muhim havolalar

- **Supabase project:** https://supabase.com/dashboard/project/plyqezulrfowyblsfpzy
- **DB connection:** secret manager yoki lokal `.env` orqali boshqariladi
- **Service Role Token:** repoda saqlanmaydi; Supabase secret manager orqali boshqariladi
- **files/ spec:** `files/00-README.md` dan boshlanadi
