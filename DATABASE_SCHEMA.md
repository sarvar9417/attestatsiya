## TASK-347 — Group Mock Test (branch-only, not deployed)

- Tables: `group_mock_rooms`, `group_mock_items`, `group_mock_members`,
  `group_mock_answers`, `group_mock_messages` (all RLS-enabled with
  direct learner table grants revoked).
- RPCs: `group_mock_eligible` (private helper), `group_mock_bank`,
  `group_mock_create`, `group_mock_join`, `group_mock_start`,
  `group_mock_answer`, `group_mock_step`, `group_mock_message`,
  `group_mock_state`. Server-authoritative answer visibility and roster.
- Migration: `20261021001500_task347_group_mock.sql`; **not applied** to production.
- SQL regression: `supabase/tests/group_mock.test.sql` (fresh DB pending).
- Personal and official exam tables, mastery and published revision remain untouched.

# Database Schema — Attestatsiya

## Supabase Project

- **URL:** `https://julclavaqxzffslmaard.supabase.co`
- **Region:** Northeast Asia (Tokyo)

## Tables

### Auditoriya

| Table | Description | RLS |
|---|---|---|
| `roles` | Foydalanuvchi rollari (student, content_author, expert, admin) | ✅ |
| `users` | Public foydalanuvchi profillari (auth.users dan trigger orqali sinx) | ✅ |
| `specification_versions` | Spetsifikatsiya versiyalari (2026, 2027...) | ❌ |

### Kontent

| Table | Description | RLS |
|---|---|---|
| `modules` | 16 modul (M01–M16) | ✅ (o'qish hamma, yozish admin) |
| `subtopics` | Mikro-mavzular (modulga bog'langan) | ✅ |
| `lessons` | Darslar (nazariya, Markdown) | ✅ |
| `sources` | Manbalar (darsliklar, PDF) | ✅ |
| `source_references` | Dars-manba bog'lamasi (sahifa bilan) | ✅ |
| `stimuli` | Kod/rasm/jadval — bir necha savolga umumiy | ✅ |

### Savollar

| Table | Description | RLS |
|---|---|---|
| `questions` | Y1/Y2/Y3 savollar (draft→review→approved→published→archived) | ✅ |
| `options` | Variantlar (is_correct flag) | ✅ |
| `question_versions` | Versiya tarixi (JSONB snapshot) | ✅ |

### O'quvchi faoliyati

| Table | Description | RLS |
|---|---|---|
| `attempts` | Urinishlar (test, imtihon) | ✅ (faqat o'z) |
| `attempt_answers` | Har bir savolga berilgan javob | ✅ |
| `mastery_records` | O'zlashtirish (learning→temporary→stable) | ✅ |
| `review_queue` | SRS takrorlash navbati (FSRS) | ✅ |
| `mock_exams` | 50 savollik sinov imtihonlari | ✅ |
| `mock_exam_questions` | Imtihon savollari va javoblari | ✅ |

## Migrations

```
20260729000000_init_schema.sql   — Asosiy sxema (barcha jadvallar, RLS, indekslar)
20260729220000_users_and_fixes.sql — public.users + auth.users trigger
```

## RLS Policies

- **content_readable:** Barcha kontent hamma o'qiy oladi (published/approved questions)
- **user_own_data:** O'quvchi faqat o'z attempt/mastery/mock data'sini ko'radi
- **author_all:** content_author + admin CRUD lessons, questions
- **admin_all:** Admin to'liq CRUD modules

## TypeScript Types

`src/lib/database.types.ts` — manual (supabase gen types ishlatilmagan)

## pgTAP Tests

- `supabase/tests/schema.test.sql` — jadval, RLS, constraint tekshirish
- `supabase/tests/rls.test.sql` — policy, seed data, trigger, index tekshirish

## Setup

```bash
# DB password bilan (Dashboard → Settings → Database)
SUPABASE_DB_PASSWORD=... supabase db push

# yoki Dashboard SQL Editor orqali migration fayllarini qo'lda ishga tushirish
```

## TASK-210 — Shaxsiy test konstruktori (branch-only, NOT deployed)

- `public.exam_kind` enumga `custom` qiymati qo‘shiladi; `exams`, `exam_items`, `submit_answer`, `finish_exam`, `get_review` va `selection_meta`dan foydalaniladi. Rasmiy mock blueprint o‘zgarmaydi.
- `public.custom_exam_preflight(p_config jsonb)`: auth.uid() talab qiladi, faqat aggregate mavjudlik (`ready, requested, available, slots, gaps`) qaytaradi; savol ID/kalitlari yo‘q.
- `public.generate_custom_exam(p_config jsonb)`: exact per-lesson/difficulty quotas, published/source-backed/active taxonomy va valid key eligibility, all-or-nothing `exams`+ `exam_items` transaction; `question_id` unikalligi va server authoritative timer.
- `public.submit_answer` `custom` uchun yakunlanmaguncha `{saved:true}` qaytaradi — `correct` yoki `explanation_md` oshkor etmaydi. Avvalgi kindlar uchun hardening saqlangan.
- Hozircha yangi user-owned preset table qo‘shilmadi; alohida migration va RLS keyingi task.
- Migrationlar: `supabase/migrations/20261018230000_task210_custom_exam.sql`, `20261018231000_task210_custom_exam_feedback_guard.sql`. New SQL regression `supabase/tests/custom_exam.test.sql` CI’da yuradi.
