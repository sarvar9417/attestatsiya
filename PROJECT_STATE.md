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
| — | — | T-009 tugadi; kontent taksonomiyasini remote UUID bilan bog‘lash navbatda | — | — |

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

## Ochiq masalalar — M01 kontenti

- M01 ning barcha 12 mavzusida test savoli yo'q: eski 33 savol yangi bob
  tuzilmasiga mos kelmagani uchun o'chirildi. UI buni "test hali qo'shilmagan"
  deb ochiq ko'rsatadi; savol banki yangi manba bo'yicha to'ldirilishi kerak.
- `scripts/` da eski (endi yo'q bo'lgan `chapters/` papkasiga tayangan)
  m01 pipeline qoldiqlari bor: `rebuild_m01*.py`, `fix_m01_content.py`,
  `generate_m01.py`, `clean_m01.py`, `audit_m01.py`, `m01_*.txt`,
  `m01_content.json`. Ular hech qayerdan chaqirilmaydi.
- `src/pages/ExamDemoPage.tsx` (boshqa agent ishlayotgan, commit qilinmagan)
  hozir `tsc` ni yiqitadi: 6 xato, shundan biri `"knowlege"` yozuv xatosi.

## Environment holati

| Muhit | URL | Database | Holat |
|-------|-----|----------|-------|
| Local | `http://localhost:5173` | Remote Supabase (plyqezulrfowyblsfpzy) | Secure ExamRunner tayyor; real mock uchun savol banki 5/50 |
| Production | TBD | TBD | Yaratilmagan |

## Muhim havolalar

- **Supabase project:** https://supabase.com/dashboard/project/plyqezulrfowyblsfpzy
- **DB connection:** secret manager yoki lokal `.env` orqali boshqariladi
- **Service Role Token:** repoda saqlanmaydi; Supabase secret manager orqali boshqariladi
- **files/ spec:** `files/00-README.md` dan boshlanadi
