# 🔄 Ma'lumotlarni Sinxronizatsiya Strategiyasi

**Versiya:** 1.0
**Sana:** 30 Iyul 2026
**Maqsad:** Frontend static kontent ma'lumotlarini Supabase PostgreSQL database bilan sinxronlashtirish

---

## 1. ARXITEKTURA

### 1.1 Ma'lumotlar Oqimi

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Source of Truth)                   │
│                                                                  │
│  contentTree.ts ──→ Module/subtopic structure (117 subtopics)   │
│  topicContent.ts ──→ Lesson content (theory + 420+ questions)   │
│  Topics/ ──────────→ Raw textbook excerpts (76 constructs)      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │  npm run db:sync
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SUPABASE POSTGRESQL (Service Layer)              │
│                                                                  │
│  modules ──────────→ 16 modul (M01-M16)                          │
│  lessons ──────────→ 117 dars (M01.01-M16.03)                    │
│  constructs ───────→ 76 kompetensiya (S1.INFO.01-PM.MET.03)     │
│  lesson_constructs → Dars ↔ konstrukt bog'lanishi               │
│  questions ────────→ 420+ savol (Y1/Y2/Y3)                     │
│  question_options  → Savol variantlari                          │
│  question_keys    → Javob kalitlari + izoh                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │  Fastify Backend API
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (READ-ONLY)                        │
│                                                                  │
│  GET /api/content/modules ────→ Modullar ro'yxati               │
│  GET /api/content/modules/:id → Modul + darslar + konstruktlar  │
│  GET /api/content/lessons/:id → Dars + theory + questions       │
│  GET /api/content/questions  → Savollar                        │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Sync Yo'nalishi

**Unidirectional: Frontend → Database**

- `contentTree.ts` va `topicContent.ts` — **yagona manba (source of truth)**
- Database — **read-only mirror** (backend API orqali)
- Hech qachon database ← frontend (teskari) sinxronizatsiya bo'lmaydi
- Har bir o'zgarish `contentTree.ts` yoki `topicContent.ts` da qilinadi,
  so'ng `npm run db:sync` bilan database ga yoziladi

---

## 2. SINXRONIZATSIYA JADVALLARI

### 2.1 Mavjud Sync (allaqachon ishlaydi)

| Data | Manba | Maqsad | Mexanizm |
|---|---|---|---|
| Modules (16) | seed.sql | `public.modules` | ✅ `INSERT ON CONFLICT DO UPDATE` |
| Constructs (76) | seed.sql | `public.constructs` | ✅ `INSERT ON CONFLICT DO UPDATE` |
| Blueprints | seed.sql | `public.blueprints` | ✅ Idempotent seed |
| Blueprint quotas | seed.sql | `public.blueprint_quotas` | ✅ `DELETE + INSERT` |
| User progress | Frontend → Backend | `user_lesson_progress` | ✅ `sync_progress` RPC |
| Exam sessions | Frontend → RPC | `exams`, `exam_items` | ✅ `start_exam`, `submit_answer` |

### 2.2 Yangi Sync (implementatsiya kerak)

| Data | Manba | Maqsad | Holati |
|---|---|---|---|
| **Lessons (117)** | `contentTree.ts` subtopics | `public.lessons` | 🔴 lessons table EMPTY |
| **Lesson body** | `topicContent.ts` theory | `lessons.body_mdx` | 🔴 body_mdx NULL |
| **Lesson–Construct link** | Blueprint mapping | `lesson_constructs` | 🔴 BO'SH |
| **Questions (420+)** | `topicContent.ts` questions | `public.questions` | 🔴 FAQAT namuna |
| **Question options** | topicContent → options[] | `public.question_options` | 🔴 YO'Q |
| **Question keys** | topicContent → correctIndex | `public.question_keys` | 🔴 YO'Q |

---

## 3. IMPLEMENTATSIYA

### 3.1 Sync Script: `scripts/sync_to_db.ts`

```typescript
// npm run db:sync
// 1. O'qiydi: contentTree.ts, topicContent.ts
// 2. Sinxronlashtiradi: lessons, questions, lesson_constructs
// 3. Idempotent: qayta ishga tushirilsa duplicate yaratmaydi
// 4. Log: nechta yozildi, nechta yangilandi
```

### 3.2 Mapping: contentTree → Database

```typescript
// subtopic (M01.01) → lesson
// module_code + subtopic_code = lesson slug
// subtopic title = lesson title_uz
// order_idx = subtopic number
// body_mdx = topicContent theory blocks (formatted as Markdown)
```

### 3.3 Mapping: Constructs → Lessons

```typescript
// Construct code: S1.INFO.01
// Module code: M01
// Subtopic codes: M01.01, M01.02, ...
// 
// Mapping rule:
//   S1.INFO.01 ──→ M01.01 (Informatika, axborot)
//   S2.HW.01 ────→ M02.01-M02.05 (Kompyuter qurilmalari)
//   S2.OFFICE.01 ─→ M03.01-M03.03 (MS Word)
//   S2.OFFICE.02 ─→ M03.04-M03.05 (MS Excel formulas)
//   etc.
```

---

## 4. ISHLATISH

```bash
# Frontend static data → Database sync
npm run db:sync

# Verifikasiya
curl http://localhost:3001/api/content/lessons/M01.01

# Status tekshirish
npm run db:sync -- --check
```

---

## 5. QOIDALAR

1. **Har doim contentTree.ts ni o'zgartiring, keyin `npm run db:sync`**
2. **Testing:** backend API orqali sync natijasini tekshiring
3. **Rollback:** sync skripti idempotent — qayta ishga tushirish xavfsiz
4. **Version:** har bir sync `audit_log` ga yoziladi

---

## 6. IMPLEMENTATSIYA HOLATI

### ✅ Bajarilgan

| Komponent | Status | Tavsif |
|---|---|---|
| **SYNC_STRATEGY.md** | ✅ | Arxitektura va sync metodologiyasi hujjati |
| **scripts/sync_to_db.ts** | ✅ | Asosiy sync skripti (1150+ satr) |
| **package.json** `db:sync` | ✅ | `tsx scripts/sync_to_db.ts` |
| **Migration: source_reference** | ✅ | `20260730000011_sync_source_reference.sql` |
| **Lesson sync** | ✅ | contentTree subtopics → `lessons` (117 ta, idempotent) |
| **Lesson–Construct link** | ✅ | → `lesson_constructs` (har bir subtopic uchun) |
| **Question sync** | ✅ | topicContent → `questions` + `question_options` + `question_keys` |

### 🔴 Keyingi qadamlar

| Bosqich | Vazifa |
|---|---|
| 5 | **Frontend → Backend API** — `TopicView.tsx` dagi `getTopicContent()` ni `GET /api/content/lessons/:id` bilan almashtirish |
| 6 | **Migration hardening** — `CREATE POLICY IF NOT EXISTS` ishlatish |
| 7 | **Lesson construct cleanup** — re-run da eski bog'lanishlarni tozalash |

## 7. ISHLATISH

```bash
# 1. Migration-ni ishga tushirish (1-marta)
# Dashboard → SQL Editor → 20260730000011_sync_source_reference.sql

# 2. Frontend static data → Database sync
export SUPABASE_URL="$(grep VITE_SUPABASE_URL .env | cut -d= -f2)"
export SUPABASE_SERVICE_KEY="your-service-role-key"
npm run db:sync
```

## 8. QOIDALAR

1. **Har doim contentTree.ts ni o'zgartiring, keyin `npm run db:sync`**
2. **Testing:** backend API orqali sync natijasini tekshiring
3. **Rollback:** sync skripti idempotent — qayta ishga tushirish xavfsiz
4. **Migration:** yangi `source_reference` kolonka sync uchun kerak — birinchi marta ishga tushirishda migration qo'llanilishi shart
