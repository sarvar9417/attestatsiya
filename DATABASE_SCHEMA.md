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
