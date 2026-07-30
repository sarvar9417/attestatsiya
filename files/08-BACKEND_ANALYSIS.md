# Backend arxitektura tahlili

## 1. Hozirgi holat: Supabase BaaS

```
┌─────────────────────────────────────────────────┐
│                  BROWSER (React SPA)             │
│                                                   │
│  Auth ──supabase-js──► Supabase Auth              │
│  Data ──REST/RLS────► PostgreSQL                  │
│  Progress ──localStorage (zustand persist)        │
│  Admin ──direct CRUD──► Supabase API              │
│  Content ──static──► topicContent.ts / Topics/     │
└─────────────────────────────────────────────────┘
```

**Bor:**
- ✅ PostgreSQL (25+ jadval, UUID schema)
- ✅ RPC functions (start_exam, submit_answer, finish_exam, SM-2)
- ✅ Auth + RLS
- ✅ question_keys (kalitlar alohida jadvalda)

**Yo'q (frontend hali ishlatmayapti):**
- ❌ `start_exam` RPC → hali client-side random
- ❌ `submit_answer` RPC → hali kalitlar clientda
- ❌ `finish_exam` RPC → hali localStorage
- ❌ `question_keys` → hali options.is_correct ishlatiladi
- ❌ Sync progress → hali localStorage

---

## 2. Nima uchun backend kerak?

### Xavfsizlik
| Muammo | Hozir | Backend bilan |
|--------|-------|--------------|
| Savol kalitlari | `options.is_correct` clientga boradi | `question_keys` serverda qoladi |
| Imtihon vaqti | Client soati, o'zgartirish mumkin | Server timeri, buzib bo'lmaydi |
| Javob tekshirish | Client-side | Server-side (RPC submit_answer) |
| Rate limiting | Yo'q | Serverda |

### Ma'lumotlar yaxlitligi
| Muammo | Hozir | Backend bilan |
|--------|-------|--------------|
| Progress | localStorage (faqat bitta device) | Serverda sync |
| SM-2 | Yo'q | RPC apply_sm2 |
| Analytics | Yo'q | Serverda to'planadi |

### Kengayish
| Xususiyat | Nima beradi |
|-----------|------------|
| API Gateway | Rate limiting, caching, validation |
| Background jobs | Hisobotlar, email, eksport |
| Webhooks | CI/CD, LMS integratsiyasi |
| Admin API | Audit log, bulk operations |

---

## 3. Taklif qilinadigan arxitektura

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER (React SPA)                   │
│                                                           │
│  ┌───────────┐  ┌────────────┐  ┌───────────────────┐   │
│  │ supabase-js│  │ REST/API   │  │ WebSocket (future)│   │
│  └─────┬─────┘  └─────┬──────┘  └───────────────────┘   │
└────────┼───────────────┼─────────────────────────────────┘
         │               │
         ▼               ▼
┌─────────────────────────────────────────────────────────┐
│              API GATEWAY (Express/Fastify)                │
│                                                           │
│  ┌────────┐  ┌─────────┐  ┌────────┐  ┌─────────────┐   │
│  │ Rate   │  │ Request │  │ Auth   │  │ Response    │   │
│  │ Limit  │  │ Validate│  │ Verify │  │ Cache       │   │
│  └────────┘  └─────────┘  └────────┘  └─────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
┌──────────────┐ ┌────────┐ ┌──────────┐
│  PostgreSQL  │ │ Redis  │ │  Storage │
│  (Supabase)  │ │ (Cache)│ │ (Files)  │
│              │ │        │ │          │
│  ├─start_exam│ │ -exam  │ │ -images  │
│  ├─submit    │ │ -sess  │ │ -exports │
│  ├─SM-2      │ │ -queue │ │          │
│  └─finish    │ └────────┘ └──────────┘
└──────────────┘
```

---

## 4. Backend modullari

### 4.1. Auth Service
```typescript
// auth.service.ts
- POST /auth/register
- POST /auth/login  
- POST /auth/refresh
- POST /auth/logout
- GET  /auth/me
- POST /auth/reset-password
```
*Izoh: Supabase auth yetarli, lekin custom session management uchun*

### 4.2. Exam Service (eng muhim)
```typescript
// exam.service.ts
- POST /exam/start          → start_exam RPC
- POST /exam/submit         → submit_answer RPC  
- POST /exam/finish         → finish_exam RPC
- GET  /exam/:id/review     → get_review RPC
- GET  /exam/:id/status     → remaining time, answered count
```
*Bu service xavfsizlikni ta'minlaydi: server timer, server validation*

### 4.3. Progress Service
```typescript
// progress.service.ts
- GET  /progress/modules          → user_module_progress
- GET  /progress/lessons          → user_lesson_progress
- GET  /progress/constructs       → user_construct_stats (SM-2)
- GET  /progress/due-reviews      → get_due_reviews RPC
- POST /progress/sync             → batch sync (device → server)
```
*Bu service localStorage → server sync qiladi*

### 4.4. Content Service
```typescript
// content.service.ts
- GET  /content/modules           → published modules
- GET  /content/modules/:id       → module + lessons
- GET  /content/lessons/:id       → lesson with body_mdx
- GET  /content/constructs        → blueprint constructs
```
*Bu service static topicContent.ts ni database bilan almashtiradi*

### 4.5. Admin Service
```typescript
// admin.service.ts
- CRUD /admin/modules
- CRUD /admin/lessons
- CRUD /admin/questions
- CRUD /admin/blueprints
- GET  /admin/stats
- POST /admin/import              → bulk import (Topics → lessons)
```
*Bu service client-side CRUD → server-side CRUD qiladi*

### 4.6. Analytics Service
```typescript
// analytics.service.ts
- GET  /analytics/overview        → platform stats
- GET  /analytics/modules/:id     → module stats
- GET  /analytics/questions       → question stats (p-value, discrimination)
- GET  /analytics/users           → user activity
```

---

## 5. Express vs Fastify

| Xususiyat | Express | Fastify |
|-----------|---------|---------|
| Performance | ~29K req/s | ~76K req/s |
| Plugin system | Middleware | Encapsulated plugins |
| TypeScript | Manual | Built-in |
| Validation | Joi/Zod | Built-in (JSON Schema) |
| Swagger | Manual | Auto-generated |
| Community | Larger | Growing |
| Learning curve | Low | Medium |

**Tavsiya: Fastify** — TypeScript bilan native integration, auto-validation, auto-swagger

---

## 6. Implementatsiya rejasi

### Milestone 1: API Gateway + Exam Service (1 hafta)
1. Fastify project scaffolding
2. Exam endpoints (start, submit, finish, review)
3. Frontend: MockExamView → API ga ulash
4. Server-authoritative timer

### Milestone 2: Progress Sync (3 kun)
1. Progress endpoints  
2. Frontend: useProgressStore → API ga sync
3. Cross-device progress

### Milestone 3: Content Service (1 hafta)
1. Content endpoints
2. Static content → database migratsiyasi
3. Frontend: topicContent.ts → API

### Milestone 4: Admin Service (1 hafta)
1. Admin CRUD endpoints
2. Frontend: direct Supabase → API
3. Audit log integration

### Milestone 5: Advanced (ongoing)
1. Analytics
2. Redis caching
3. Background jobs
4. Webhooks

---

## 7. Xulosa

**Backend kerakmi?** — HA, lekin:

⚠️ **Muhim:** UUID schema (20260730000000) da RPC functions *allaqachon mavjud*. 
Eng katta ish — frontendni UUID schema'ga o'tkazish va RPC larni ishlatish.

**Tavsiya qilinadigan yo'nalish:**

```
Qisqa muddat (1-2 hafta):
  ├── Frontendni UUID schema'ga o'tkazish
  ├── MockExamView → start_exam RPC
  ├── progress → server sync
  └── options.is_correct → question_keys

Uzoq muddat (1-2 oy):
  ├── Fastify API server
  ├── Redis caching
  ├── Analytics
  └── Admin API
```
