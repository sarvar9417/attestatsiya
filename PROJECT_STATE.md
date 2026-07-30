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
| modules | 9 ta DB moduli; learner daraxtidagi 16 modul bilan mos emas |
| constructs | 74 (S1–S9, 76 dan 2 tasi duplicate slug sabab o'tkazib yuborilgan) |
| lessons | 3 (M01 ga tegishli) |
| lesson_constructs | 4 |
| blueprints | 1 (2026, ammo seed'da 150 daqiqa — noto'g'ri) |
| blueprint_quotas | 9; rasmiy ikki o'qli modelga moslashtirilmagan |
| questions | 5 (Y1 sample) |
| question_options | 20 |
| question_keys | 5 |
| RPC functions | 18 (start_exam, submit_answer, finish_exam va h.k.) |

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

## Faol tasklar

| Task | Egasi | Holat | Boshlangan vaqt | Branch |
|------|-------|-------|-----------------|--------|
| TASK-P0-003 DB baseline | Codex | IN_PROGRESS | 2026-07-30 | task/TASK-P0-003-db-baseline |

## Bloklovchilar

| ID | Tavsif | Status |
|----|--------|--------|
| B-SEC-001 | Lokal hujjatlardan credential olib tashlandi; Supabase credentiallari rotate qilindi | RESOLVED |
| B-DB-001 | HTTPS audit remote migration metadata jadvali yo‘qligini tasdiqladi | RESOLVED |
| B-DB-002 | BIGINT va UUID migration liniyalarini squash/archivlash ishlari ketmoqda | IN_PROGRESS |
| B-QA-001 | CI secret scan, lint, typecheck, unit, build va E2E bilan yashil | RESOLVED |
| B-001 | Y1/Y2/Y3 generatorlar (axborotHajmi, sanoqSistema, mantiqAmal, ipMaska) yozilmagan | OPEN |
| B-002 | ExamRunner + UUID schema moslash | OPEN |
| B-003 | TypeScript database.types.ts UUID schema bo'yicha yangilanmagan | OPEN |

## Keyingi bajariladigan task

1. P0-003 branch CI natijasini tekshirish
2. Remote’da UUID baseline versiyasini applied sifatida ro‘yxatdan o‘tkazish
3. Taxonomy va rasmiy 2026 seed migratsiyalarini qo‘llash
4. DB role escalation va submit idempotency tuzatishlari

## Auditda tasdiqlangan natijalar

| Task | Tugallangan vaqt | Izoh |
|------|-----------------|------|
| Safety checkpoint | 2026-07-30 | `4caa968`; raw darsliklar va secretlar commitga kiritilmagan |
| TASK-P0-001 Foundation recovery | 2026-07-30 | Root README, ADR-017/018, Node/npm pin va avtomatik secret scan |
| TASK-P0-002 CI quality gate | 2026-07-30 | PR #1 da secret scan, lint, typecheck, 49 unit test, build va 4 Playwright smoke testi yashil |
| TASK-P0-005 UI security boundary | 2026-07-30 | Admin deny-by-default; client mock production bundle'dan chiqarildi; bundle regression check qo'shildi |
| Build audit | 2026-07-30 | TypeScript + Vite build o'tadi |
| Unit test audit | 2026-07-30 | GitHub CI'da repoga kirgan 49 Vitest test o'tadi |
| E2E smoke audit | 2026-07-30 | 4 auth smoke testi o'tadi; product flow qamrovi hali yo'q |

## Environment holati

| Muhit | URL | Database | Holat |
|-------|-----|----------|-------|
| Local | `http://localhost:5173` | Remote Supabase (plyqezulrfowyblsfpzy) | Frontend ishlaydi; remote yozuvlar auditgacha muzlatilgan |
| Production | TBD | TBD | Yaratilmagan |

## Muhim havolalar

- **Supabase project:** https://supabase.com/dashboard/project/plyqezulrfowyblsfpzy
- **DB connection:** secret manager yoki lokal `.env` orqali boshqariladi
- **Service Role Token:** repoda saqlanmaydi; Supabase secret manager orqali boshqariladi
- **files/ spec:** `files/00-README.md` dan boshlanadi
