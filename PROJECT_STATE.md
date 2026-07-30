# PROJECT_STATE.md — joriy holat

> Living document. Har coder task boshlaganda va tugatganda yangilaydi.

## Holat

- Loyiha bosqichi: `DEVELOPMENT`
- Joriy milestone: `M0 — Foundation (adapted)`
- Oxirgi yangilanish: `2026-07-30`
- Production mavjud: `yo'q`
- Database project mavjud: `ha (plyqezulrfowyblsfpzy, Singapore)`
- Deployment mavjud: `yo'q`

## Tasdiqlangan asos

- **Stack:** React + Vite, TypeScript strict, Tailwind CSS, Zustand
- **Database:** Supabase (PostgreSQL), UUID PK, enum turlari, RLS
- **Autentifikatsiya:** anonymous kirish, auth.uid() orqali auto-profile
- **Kontent tuzilmasi:** 16 modul (M01–M16), 117 subtopic, contentTree.ts va topicContent.ts to'liq
- **Imtihon:** 50 savol, 150 daqiqa, Y1/Y2/Y3 formatlar
- **Kognitiv:** bilish (35) + qo'llash (5) + mulohaza (10) = 50
- **DB yozuv operatsiyalari:** faqat RPC (security definer), direct insert/update emas
- **question_keys:** clientga ko'rinmaydi (faqat staff)
- **Til:** o'zbek lotin yozuvi

## DB holati

| Jadval | Soni |
|--------|------|
| subjects | 1 (Informatika) |
| modules | 9 (M01–M09) |
| constructs | 74 (S1–S9, 76 dan 2 tasi duplicate slug sabab o'tkazib yuborilgan) |
| lessons | 3 (M01 ga tegishli) |
| lesson_constructs | 4 |
| blueprints | 1 (2026, 50 savol) |
| blueprint_quotas | 9 (barcha guruh uchun) |
| questions | 5 (Y1 sample) |
| question_options | 20 |
| question_keys | 5 |
| RPC functions | 18 (start_exam, submit_answer, finish_exam va h.k.) |

## Faol tasklar

| Task | Egasi | Holat | Boshlangan vaqt | Branch |
|------|-------|-------|-----------------|--------|
| DB migratsiyalari (UUID schema) | AI | DONE | 2026-07-30 | main |
| RPC funksiyalari | AI | DONE | 2026-07-30 | main |
| Seed ma'lumot | AI | DONE | 2026-07-30 | main |
| Admin panel (QuestionsPage) | AI | DONE | 2026-07-29 | main |
| E2E testlar (Playwright) | AI | DONE | 2026-07-29 | main |
| Unit testlar (Vitest) | AI | DONE | 2026-07-29 | main |

## Bloklovchilar

| ID | Tavsif | Status |
|----|--------|--------|
| B-001 | Y1/Y2/Y3 generatorlar (axborotHajmi, sanoqSistema, mantiqAmal, ipMaska) yozilmagan | OPEN |
| B-002 | ExamRunner + UUID schema moslash | OPEN |
| B-003 | TypeScript database.types.ts UUID schema bo'yicha yangilanmagan | OPEN |

## Keyingi bajariladigan task

1. TypeScript database.types.ts ni UUID schema bo'yicha yangilash
2. ExamRunner + Y1/Y2/Y3 komponentlarini UUID schema ga moslash
3. Y1/Y2/Y3 generatorlarini yozish (axborotHajmi, sanoqSistema, mantiqAmal, ipMaska)
4. Natija ekrani (ball, toifa qarori, guruh kesimi)

## So'nggi tugallangan tasklar

| Task | Tugallangan vaqt | Izoh |
|------|-----------------|------|
| DB UUID schema migratsiyalari | 2026-07-30 | 6 ta migration: extensions/content/assessment/progress/quality/RLS |
| RPC funksiyalari | 2026-07-30 | 18 ta RPC: start_exam, submit_answer, finish_exam, get_review, SM-2 va h.k. |
| Seed ma'lumot | 2026-07-30 | 1 subject, 9 modul, 74 konstrukt, 1 blueprint, 9 kvota, 5 savol |
| Admin QuestionsPage | 2026-07-29 | Status transition UI (draft→review→approved→published→archived) |
| E2E testlar | 2026-07-29 | 4 Playwright test (auth, tablar, parol tiklash, validatsiya) |
| topicContent to'ldirish | 2026-07-30 | 16 modul, 117 subtopic uchun content yozildi: 350+ theory blok, 400+ test savol |

## Environment holati

| Muhit | URL | Database | Holat |
|-------|-----|----------|-------|
| Local | `http://localhost:5173` | Remote Supabase (plyqezulrfowyblsfpzy) | Ishlayapti |
| Production | TBD | TBD | Yaratilmagan |

## Muhim havolalar

- **Supabase project:** https://supabase.com/dashboard/project/plyqezulrfowyblsfpzy
- **DB connection:** secret manager yoki lokal `.env` orqali boshqariladi
- **Service Role Token:** repoda saqlanmaydi; Supabase secret manager orqali boshqariladi
- **files/ spec:** `files/00-README.md` dan boshlanadi
