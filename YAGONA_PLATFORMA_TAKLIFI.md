# 🎯 Informatika Attestatsiyasi — Yagona Mukammal Platforma Taklifi

> **Loyiha:** `attestatsiya`  
> **Versiya:** 1.0  
> **Asos:** 20 ta .md spetsifikatsiya hujjati + mavjud kod bazasi tahlili

---

## 📋 Mundarija

1. [Umumiy ko'rinish](#1-umumiy-korinish)
2. [Platforma arxitekturasi](#2-platforma-arxitekturasi)
3. [Kontent tuzilishi](#3-kontent-tuzilishi)
4. [O'quvchi interfeysi](#4-oquvchi-interfeysi)
5. [Admin/CMS interfeysi](#5-admincms-interfeysi)
6. [Mastery va adaptiv tizim](#6-mastery-va-adaptiv-tizim)
7. [Mock exam va attestatsiya](#7-mock-exam-va-attestatsiya)
8. [Database sxemasi](#8-database-sxemasi)
9. [Xavfsizlik](#9-xavfsizlik)
10. [Implementatsiya rejasi](#10-implementatsiya-rejasi)

---

## 1. Umumiy ko'rinish

### 1.1 Maqsad

O'zbekiston informatika o'qituvchilarini attestatsiyaning 50 savollik malaka sinoviga tayyorlash uchun **vertikal mavzular asosidagi, manbasi tekshiriladigan, adaptiv o'quv platformasi**.

### 1.2 Asosiy tamoyillar

| Tamoyil | Tavsif |
|---------|--------|
| **Vertikal mavzular** | Sinflar bo'yicha emas, mavzuni boshlang'ichdan murakkabgacha to'liq o'rgatish |
| **Manba tekshiruvi** | Har bir dars va savol rasmiy darslik yoki manba sahifasiga bog'langan |
| **Haqiqiy mastery** | Faqat birinchi mustaqil urinish mastery hisobiga kiradi |
| **Server authoritative** | Imtihon vaqti, scoring, javob kaliti — hammasi serverda |
| **Mobile-first** | 360px dan boshlab, arzon Android telefonlarda ishlaydi |
| **O'zbek tili** | Barcha interfeys va kontent o'zbek lotin yozuvida |

### 1.3 Foydalanuvchi rollari

| Rol | Vakolat |
|-----|---------|
| **Learner (o'quvchi)** | O'rganish, test, mock exam, natijalar |
| **Author (muallif)** | Dars va savol yaratish (draft) |
| **Reviewer (ekspert)** | Mazmun, javob, manbani tekshirish |
| **Publisher (nashr etuvchi)** | Approved revisionni nashr qilish |
| **Admin** | Foydalanuvchi, spetsifikatsiya, platforma boshqaruvi |

### 1.4 Imtihon formati (o'zgarmas haqiqat)

| Blok | Savol soni |
|------|:----------:|
| Mutaxassislik fani (specialty) | 35 |
| Kasb standarti (professional_standard) | 5 |
| Umumiy pedagogika (pedagogy) | 7 |
| Informatika metodikasi (methodology) | 3 |
| **Jami** | **50** |

- **Vaqt:** 120 daqiqa
- **Ball:** 2 ball × 50 = 100 ball
- **Kognitiv taqsimot:** 8 bilish (knowledge) + 35 qo'llash (application) + 7 mulohaza (reasoning)
- **Savol formatlari:** Y1 (yagona tanlov), Y2 (moslashtirish), Y3 (ketma-ketlik)

### 1.5 Texnologik stack

| Qatlam | Tanlov | Izoh |
|--------|--------|------|
| **Framework** | React + Vite | Next.js emas, vaqt tejash uchun |
| **Til** | TypeScript strict | `any` taqiqlangan |
| **UI** | Tailwind CSS + shadcn/ui | Aksessuar, mobile-first |
| **State** | Zustand + localStorage | Hozircha; keyin Supabase |
| **Database** | PostgreSQL (Supabase) | RLS, indekslar, migratsiyalar |
| **Auth** | Supabase Auth | Anonymous → email upgrade |
| **Storage** | Supabase Storage | Private source fayllar |
| **Validation** | Zod | Runtime type safety |
| **Test** | Vitest + Playwright + pgTAP | 3 qatlamli test |
| **CI/CD** | GitHub Actions | Quality gate |

---

## 2. Platforma arxitekturasi

### 2.1 Modular monolith

```
┌─────────────────────────────────────────────────────┐
│                   BRAUZER (React SPA)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Learner  │  │  Admin   │  │  Question        │  │
│  │  UI       │  │  CMS     │  │  Renderers       │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                SERVER LAYER (Route handlers)        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Auth    │  │  Exam    │  │  Content/Admin    │  │
│  │  API     │  │  API     │  │  API              │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              DOMAIN SERVICES                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Mastery │  │  Scoring │  │  Exam Generator   │  │
│  │  Service │  │  Service │  │  (constraint)     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  SRS     │  │  Adaptive│  │  Analytics        │  │
│  │  Service │  │  Selector│  │  Service          │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              DATABASE (PostgreSQL + Supabase)       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Identity│  │  Content │  │  Learning         │  │
│  │  & Auth  │  │  Schema  │  │  & Assessment     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 2.2 Papka tuzilishi

```
src/
├── components/
│   ├── ui/          # shadcn/ui primitivlar
│   ├── layout/      # Sidebar, BottomNav, Header
│   ├── learning/    # Lesson, Topic, Exam views
│   │   └── questions/  # Y1Question, Y2Question, Y3Question
│   └── admin/       # AdminLayout, CMS komponentlari
├── hooks/           # useAuth, useOnlineStatus, useSwipe, useInView
├── lib/             # Supabase client, validation, errors, sentry
├── data/            # Static contentTree, topicContent
├── pages/           # Route sahifalari
├── store/           # Zustand store (progress, auth)
├── utils/           # tashkentDate, toastStore, theme
├── styles/          # index.css, tailwind config
├── tests/           # Unit, integration, E2E
└── domain/          # Sof TypeScript domain logikasi
    ├── mastery/     # Mastery hisoblash
    ├── scoring/     # Y1/Y2/Y3 scoring
    ├── exam/        # Generator, blueprint
    ├── srs/         # Review scheduler
    └── validation/  # Zod schemalar
```

### 2.3 Route xaritasi

#### Public
| Route | Komponent | Render |
|-------|-----------|--------|
| `/` | Landing page | Static |
| `/auth` | Login/Register | Dynamic |
| `/reset-password` | Parolni tiklash | Dynamic |

#### Learner
| Route | Komponent | Render |
|-------|-----------|--------|
| `/dashboard` | DashboardPage | Dynamic |
| `/modules/:code` | ModulePage | ISR |
| `/learn/:lessonCode` | TopicLessonPage | ISR |
| `/practice/:sessionId` | Practice session | Dynamic |
| `/review` | SRS review queue | Dynamic |
| `/errors` | Xatolar daftari | Dynamic |
| `/exam` | Mock exam list | Dynamic |
| `/exam/:sessionId` | Exam runner | Dynamic |
| `/results/:sessionId` | Natijalar | Dynamic |
| `/profile` | Profil | Dynamic |

#### Admin
| Route | Komponent |
|-------|-----------|
| `/admin` | AdminDashboard |
| `/admin/specifications` | SpecsPage |
| `/admin/modules` | ModulesPage |
| `/admin/questions` | QuestionsPage |
| `/admin/sources` | SourcesPage |
| `/admin/reviews` | Review queue |

---

## 3. Kontent tuzilishi

### 3.1 Ierarxiya

```
Spetsifikatsiya (specification_versions)
  └── 16 modul (M01–M16)
        ├── Topic (mavzu)
        │     └── Microtopic (mikro-mavzu)
        │           ├── Learning objective (LO)
        │           ├── Dars (lesson revision)
        │           └── Savollar (question revisions)
        ├── Topic
        └── ...
```

### 3.2 16 modul ro'yxati

| Kod | Nomi | Section | Imtihonda |
|-----|------|---------|:---------:|
| M01 | Axborot va raqamli savodxonlik | specialty | 3 |
| M02 | Kompyuter tizimlari va dasturiy muhit | specialty | 2 |
| M03 | Microsoft Office | specialty | 5 |
| M04 | Mantiqiy fikrlash va modellashtirish | specialty | 3 |
| M05 | Sanoq sistemalari | specialty | 2 |
| M06 | Algoritmlash | specialty | 3 |
| M07 | Scratch va LOGO | specialty | 3 |
| M08 | Python va JavaScript | specialty | 3 |
| M09 | MB, MS Access va SQL | specialty | 2 |
| M10 | Kompyuter grafikasi va media | specialty | 2 |
| M11 | HTML va CSS | specialty | 3 |
| M12 | Kompyuter tarmoqlari va internet | specialty | 2 |
| M13 | Axborot xavfsizligi va raqamli xizmatlar | specialty | 2 |
| M14 | Kasb standarti | professional_standard | 5 |
| M15 | Umumiy pedagogika | pedagogy | 7 |
| M16 | Informatika o'qitish metodikasi | methodology | 3 |

### 3.3 Kontent formatlari

#### Dars bloklari
Ruxsat etilgan rich-content bloklari:
- `paragraph` — matn paragrafi
- `heading` — sarlavha
- `bullet_list` / `ordered_list` — ro'yxatlar
- `callout` — muhim eslatma
- `formula` — matematik formula (LaTeX)
- `code` — kod bloki (til bilan)
- `table` — jadval
- `image` — rasm
- `worked_example` — tushuntirilgan misol
- `common_error` — ko'p uchraydigan xato

#### Dars strukturasi
1. Maqsad (1–3 learning objective)
2. Oldingi bilim (prerequisite)
3. Qisqa tushuntirish
4. Atama yoki qoida
5. Tushuntirilgan misol
6. "Ko'p uchraydigan xato"
7. 3–5 savollik quick check
8. Keyingi action

### 3.4 Savol formatlari

#### Y1 — Single choice
- 4 ta variant (3–5 oralig'ida ruxsat)
- Aynan bitta to'g'ri javob
- Distractorlar real xato tushunchadan
- `"Barchasi to'g'ri"` ishlatilmaydi

#### Y2 — Matching
- 3–6 ta chap element
- O'ng elementlar soni chapga teng yoki +2 gacha
- Birinchi urinishda 2 ball, aks holda 0
- Mobile: select fallback, majburiy

#### Y3 — Ordering
- 3–8 ta element
- Yagona to'g'ri tartib
- ↑↓ tugmalari (asosiy), drag (qo'shimcha)

### 3.5 Manba bog'lash

Har bir published lesson va question revision:
```
source_id        → darslik ID
source_locator   → PDF sahifa, bob/dars nomi
is_primary       → asosiy manba
note             → qisqa izoh
```

---

## 4. O'quvchi interfeysi

### 4.1 UX tamoyillari

- Bir ekranda bitta asosiy vazifa
- Mobile-first (360px → 768px → 1024px+)
- Drag-and-drop hech qachon yagona interaction emas
- Xato jazolash emas, keyingi o'rganish actioni
- Correct answer exam tugamay oshkor qilinmaydi
- WCAG 2.2 AA maqsadi

### 4.2 Dizayn tili

**Ranglar:**
```css
--siyoh:     #14213D    /* matn, sarlavha */
--qogoz:     #F7F8FA    /* sahifa foni */
--sirlangan: #1B5E9E    /* asosiy: havola, tugma */
--zar:       #C77D0A    /* diqqat, jarayon */
--yashil:    #256B54    /* o'zlashtirildi */
--qizil:     #A8322D    /* xato */
--chiziq:    #DDE1E8    /* chegara */
--kul:       #6B7280    /* ikkilamchi matn */
```

**Shriftlar:**
- Display: **Archivo** (sarlavha, ball)
- Body: **IBM Plex Sans** (dars matni, interfeys)
- Mono: **IBM Plex Mono** (kod, taymer, konstrukt kodi)

### 4.3 Navigation

**Mobile:** Pastki bottom navigation (5 ta: Bosh sahifa, Kurs, Takrorlash, Sinov, Profil)  
**Desktop:** Chap sidebar + content area

Exam vaqtida global navigation yashiriladi.

### 4.4 Onboarding flow

1. Ism kiritish
2. Imtihon sanasi (ixtiyoriy)
3. Kunlik vaqt (10/20/30/45/60 daqiqa)
4. Diagnostika taklifi (skip mumkin)

### 4.5 Dashboard

1. Bugungi asosiy action
2. Due review soni
3. Taxminiy readiness (masalan: "68% — ishonchlilik: o'rta")
4. Blueprint strip (15 guruh mastery)
5. 16 modul progress
6. So'nggi mock natija

### 4.6 Curriculum ekrani

Har modul:
- Code va nomi
- Imtihondagi savol soni
- Mastery status (rang + text: boshlanmagan/o'rganilmoqda/vaqtinchalik/barqaror/qayta)
- Due review
- Lock sababi (agar prerequisite bo'lsa)

### 4.7 Lesson ekrani

```
< Bo'limga qaytish
Mavzu sarlavhasi                  [ ~15 daq ]
Learning objectives
─────────────────────────────────────────
Dars matni (structured blocks)
─────────────────────────────────────────
[ Testni boshlash ]     ← sticky footer
```

### 4.8 Practice feedback

**Xato:**
1. "Javob noto'g'ri."
2. Qisqa sabab
3. Zarur qadamlar
4. Tanlangan variant nima uchun xato
5. Manba nomi/locator
6. "Yangi o'xshash savolda tekshirish"

**Correct:**
- Qisqa tasdiq
- Ortiqcha animatsiyasiz

---

## 5. Admin/CMS interfeysi

### 5.1 Admin dashboard

Kartalar:
- Published question count
- Review queue (open items)
- Source'siz draftlar
- Invalid content flaglari
- Module coverage matrix
- Mock assembly readiness
- Critical item flags (discrimination < 0, p-value anomaly)

### 5.2 Question bank (asosiy CMS)

**Filterlar:**
- Specification, module, microtopic, objective
- Question type (Y1/Y2/Y3)
- Cognitive level
- Difficulty (1–5)
- Status (draft→published)
- Author/reviewer
- Source
- Misconception tag
- Flag holati

**Muharrir (split view):**
```
┌─ Savol ────────────────────┬─ Preview ──────────┐
│ stem_md (markdown)          │  Learner view      │
│ konstrukt   [select]        │                    │
│ format      Y1 / Y2 / Y3    │                    │
│ kognitiv    [select]        │                    │
│ qiyinlik    1—5             │                    │
├─────────────────────────────┤                    │
│ Variantlar                  │                    │
│ Javob kaliti                │                    │
│ Tushuntirish (majburiy)     │                    │
│ Manba                       │                    │
└─────────────────────────────┴────────────────────┘
```

### 5.3 Workflow

```
draft → in_review → changes_requested → draft (loop)
                    → approved → published → archived
```

**Qoidalar:**
- Author o'z kontentini approve qila olmaydi
- Reviewer va author bir xil user bo'lmasligi kerak
- Publisher approve bo'lmagan revisionni publish qila olmaydi
- Published revision immutable

### 5.4 Duplicate detection

1. Exact normalized content hash (blok)
2. Same objective + high lexical similarity (warning)
3. Reviewer manual decision

### 5.5 Bulk import

- JSON format, max 500 question/file
- Dry-run → validation report → commit
- Always draft (never auto-publish)

---

## 6. Mastery va adaptiv tizim

### 6.1 Evidence turlari

| Tur | Ta'rif | Mastery hisobiga? |
|-----|--------|:-----------------:|
| **Independent first attempt** | Birinchi marta ko'rilgan savolga mustaqil javob | ✅ |
| **Guided production** | Hint yoki yo'naltirish bilan javob | ❌ |
| **Corrected retry** | Explanation'dan keyingi urinish | ❌ |

### 6.2 Mastery hisoblash

**Evidence window:** So'nggi 90 kun, har cognitive level uchun 20 ta distinct independent question

**Level score:**
```
level_score = correct_distinct / attempted_distinct
```

**Overall score:**
```
overall = knowledge×0.20 + application×0.50 + reasoning×0.30
```

**Provisional mastery sharti:**
1. ≥15 distinct independent savol
2. ≥8 application/reasoning savoli
3. overall ≥ 0.90
4. application+reasoning ≥ 0.80
5. Har critical objective ≥2 marta to'g'ri
6. Active misconception remediation passed

**Stable mastery:** 1→3→7→14→30 kun reviewlardan keyin

**Mastery statuslar:**
```
not_started → learning → provisional → stable
                              ↓
                         regressed (agar review fail)
```

### 6.3 SRS (Spaced Repetition)

**1/3/7/14/30 kunlik interval:**
- 1-kun review: +1 kun tolerance
- Qolganlari: intervalning 50% gacha kechikish mumkin

**Review pass sharti:**
- ≥8 distinct savol
- ≥4 higher-order (application/reasoning)
- Overall accuracy ≥ 0.80
- Critical objective xato bo'lmasligi

### 6.4 Adaptive selector (10 savollik session)

| Target | Foiz |
|--------|:----:|
| Ayni mikro-mavzuning zaif objective | 50% |
| Due review | 25% |
| Yangi/kam exposure savol | 15% |
| Kuchli objective nazorati | 10% |

**Qoidalar:**
- Published va active specification'ga eligible
- Bir sessionda revision takrorlanmaydi
- Xato savolning aynan o'zi immediate retry sifatida berilmaydi
- Pool yetishmasa nisbat yumshatiladi, metadata'da fallback yoziladi

---

## 7. Mock exam va attestatsiya

### 7.1 Blueprint (15 guruh)

| Group | Savol | Bilish | Qo'llash | Mulohaza |
|-------|:----:|:-----:|:--------:|:--------:|
| S1.INFO | 3 | 1 | 2 | 0 |
| S2.HW | 2 | 1 | 1 | 0 |
| S2.OFFICE | 5 | 0 | 5 | 0 |
| S3.LOGIC | 3 | 0 | 2 | 1 |
| S3.NUM | 2 | 0 | 2 | 0 |
| S3.ALGO | 3 | 0 | 2 | 1 |
| S4.BLOCK | 3 | 0 | 3 | 0 |
| S4.CODE | 3 | 0 | 2 | 1 |
| S4.DB | 2 | 0 | 2 | 0 |
| S5.WEB | 5 | 1 | 4 | 0 |
| S6.NET | 2 | 0 | 2 | 0 |
| S7.SEC | 2 | 1 | 1 | 0 |
| KS | 5 | 1 | 3 | 1 |
| PM.GEN | 7 | 2 | 4 | 1 |
| PM.MET | 3 | 1 | 0 | 2 |
| **Jami** | **50** | **8** | **35** | **7** |

### 7.2 Assembly algoritmi

Greedy random tanlov **taqiqlanadi** (dead-end beradi). Algoritm:

1. Candidate poolni module × cognitive × type kesimida hisoblash
2. Hard-rule feasibility precheck
3. Modullarni eng kam candidate flexibility bo'yicha saralash
4. Seeded deterministic constraint assignment
5. Har bucketdan exposure penalty va difficulty soft cost bo'yicha tanlash
6. Yakuniy invariant validator
7. Sessionni transaction'da saqlash
8. Assembly audit (seed, pool count, fallback)

`BLUEPRINT_POOL_INSUFFICIENT` xatosi → deficit report

### 7.3 Timer

- `started_at` va `expires_at` serverda
- UI har 30 soniyada server time drift tekshiradi
- Browser timer faqat display
- `now >= expires_at` → mutation auto-finalize
- Client clock manipulation himoyasi

### 7.4 Ball chegaralari

| Joriy toifa | Ball | Qaror |
|-------------|:----:|-------|
| Oliy | ≥80 | Saqlanadi |
| Oliy | <80 | 1-toifaga tushiriladi |
| 1-toifa | ≥80 | Oliy beriladi |
| 1-toifa | 70–79 | Saqlanadi |
| 1-toifa | <70 | 2-toifaga tushiriladi |
| 2-toifa | ≥70 | 1-toifa beriladi |
| 2-toifa | 60–69 | Saqlanadi |
| 2-toifa | <60 | Mutaxassisga tushiriladi |
| Mutaxassis | ≥60 | 2-toifa beriladi |
| Mutaxassis | 55–59 | Saqlanadi |
| Mutaxassis | <55 | O'tmadi |

---

## 8. Database sxemasi

### 8.1 Identity & Auth

| Jadval | Maqsad | RLS |
|--------|--------|:---:|
| `profiles` | Foydalanuvchi profili (auth.users trigger) | ✅ |
| `user_roles` | Rollar (learner/author/reviewer/publisher/admin) | ✅ |
| `audit_logs` | Append-only audit | ✅ |
| `idempotency_keys` | Idempotency protection | ✅ |

### 8.2 Specification & Curriculum

| Jadval | Maqsad |
|--------|--------|
| `specification_versions` | Spetsifikatsiya versiyalari |
| `modules` | 16 modul (M01–M16) |
| `curriculum_nodes` | Topic/microtopic daraxti |
| `curriculum_prerequisites` | Prerequisite bog'lamalar |
| `learning_objectives` | Learning objectives |
| `mastery_configs` | Mastery sozlamalari (threshold, weight) |

### 8.3 Content

| Jadval | Maqsad |
|--------|--------|
| `sources` | Darsliklar, manbalar |
| `source_locators` | Manba ichidagi joy (sahifa, bob) |
| `lessons` | Darslar |
| `lesson_revisions` | Dars versiyalari (immutable published) |
| `questions` | Savollar |
| `question_revisions` | Savol versiyalari (payload, key, explanation) |
| `stimuli` | Kod/rasm/jadval stimulus |
| `tags` | Misconception, skill, content tags |

### 8.4 Learning & Assessment

| Jadval | Maqsad |
|--------|--------|
| `assessment_sessions` | Practice, checkpoint, review, mock exam |
| `assessment_session_questions` | Session savollari (snapshot) |
| `session_question_responses` | Javoblar (optimistic revision) |
| `practice_submissions` | Practice submission tarixi |
| `question_exposures` | Savol exposure tracking |
| `mastery_evidence` | Append-only mastery evidence |
| `mastery_records` | Mastery holati |
| `review_schedules` | SRS review schedule |
| `error_notebook_entries` | Xatolar daftari |

### 8.5 Muhim indekslar

```sql
curriculum_nodes(module_id, sort_order)
learning_objectives(curriculum_node_id, sort_order)
question_revisions(cognitive_level, question_type, difficulty) WHERE published
question_revision_specifications(specification_id, module_id, eligible)
assessment_sessions(user_id, created_at DESC)
mastery_evidence(user_id, curriculum_node_id, occurred_at DESC)
review_schedules(user_id, due_at) WHERE pending
```

### 8.6 RLS matritsasi

| Data | Learner | Author | Reviewer | Admin |
|------|:-------:|:------:|:--------:|:-----:|
| Own profile/progress | own | own | own | all |
| Published lesson | read | read | read | read |
| Question answer payload | ❌ | assigned | assigned | all |
| Own sessions | own | own | own | all |
| Draft content | ❌ | authored | assigned | all |
| Role/audit | own roles | own | own | all |

---

## 9. Xavfsizlik

### 9.1 Correct answer leakage

- `question_revisions.payload` (correct answer) learner uchun SELECT qilinmaydi
- Learner DTO correct keyni olib tashlaydi (server-side transformation)
- Cache, error body, browser devtools'da answer yo'q
- Exam final bo'lmaguncha explanation yo'q

### 9.2 API xavfsizlik

- Barcha mutation `Idempotency-Key` header talab qiladi
- Session cookie: `httpOnly`, `secure`, `sameSite`
- CORS faqat known origin
- CSP default deny-ga yaqin
- Rate limiting: auth, assessment, admin endpointlarida

### 9.3 Input validation

- Zod schema barcha tashqi input uchun
- Raw HTML qabul qilinmaydi (rich content JSON block)
- File upload: MIME + magic bytes tekshiruvi
- SQL parameterized (Supabase query API)

### 9.4 Security release checklist

- [ ] Barcha public table RLS decision/test
- [ ] IDOR/role escalation test pass
- [ ] XSS/import/upload validation
- [ ] CSP va security headers
- [ ] Rate limit critical endpoints
- [ ] Correct-answer leakage E2E
- [ ] Backup restore rehearsal

---

## 10. Implementatsiya rejasi

### 10.1 Milestonelar

#### M0 — Foundation (1–2 hafta)
- ✅ Git repo, toolchain (TypeScript strict, Vitest, Tailwind)
- ✅ App shell, route layout
- ✅ Lokal Supabase, first migration
- ✅ CI pipeline

#### M1 — Schema & Identity (1–2 hafta)
- Auth (anonymous → email upgrade)
- Profile, roles, audit
- Specification, module, curriculum schema
- Content revision schema
- RLS va pgTAP testlar

#### M2 — Content CMS (2–3 hafta)
- Source registry va locator
- Lesson editor (rich blocks)
- Y1/Y2/Y3 editor
- Review workflow (draft→approve→publish)
- Import dry-run/commit

#### M3 — Learner Practice (2–3 hafta)
- Onboarding va dashboard
- Curriculum/lesson view
- Y1/Y2/Y3 question renderers
- Practice session va feedback
- Error notebook

#### M4 — Mastery & SRS (1–2 hafta)
- Evidence classifier (first/guided/retry)
- Mastery calculator (versioned)
- Review scheduler (1/3/7/14/30)
- Adaptive selector
- Readiness estimate

#### M5 — Mock Exam (2–3 hafta)
- Feasibility service
- Constraint-based generator
- Server timer va autosave
- Final submit va scoring
- Result UI (section/module/cognitive)

#### M6 — Analytics & Hardening (1–2 hafta)
- Item statistics (p-value, discrimination)
- Content coverage dashboard
- Security audit
- Performance optimization
- PWA/offline shell

#### M7 — Content Release (doimiy)
- M01–M16 to'liq kontent
- ≥3 000 approved savol
- Har blueprint slot ≥20 candidate
- 20 audited mock combinations
- Production launch

### 10.2 Parallel yo'laklar

```
M0 Foundation
  ↓
Schema/RLS ───→ Backend/Domain ──→ Integration
      │               │                  ↑
      ├── Admin UI ───┘                  │
      ├── Learner UI ────────────────────┘
      └── Content/Seed ──────────────────┘
```

### 10.3 Pilot modullar (M2–M3 da sinov)

1. **M01** — Axborot va kodlash (nazariy, atama, manba)
2. **M05** — Sanoq sistemalari (hisoblash, formula)
3. **M08** — Python (kod bloki, sintaksis, output)

Har pilot modul ≥100 savol, barcha type/cognitive, 2+ reviewer bilan.

### 10.4 Release ketma-ketligi

1. Internal technical alpha — synthetic/pilot kontent
2. Content author alpha — CMS bilan
3. Closed learner beta — M01/M05/M08
4. Informatika 35-savol beta — M01–M13
5. Full 50-savol RC — M14–M16 (pedagogika va kasb standarti)
6. Production

---

## 🏆 Xulosa

**Bu taklif** mavjud barcha spetsifikatsiya hujjatlarining eng yaxshi elementlarini birlashtiradi:

- **files/ papkasidan:** anonim auth flow, SM-2 algoritmi, RPC security definer, psixometrika, ball chegaralari
- **informatika-attestatsiya-platform-spec/ papkasidan:** to'liq domain qoidalari, mastery tizimi, immutable revision, modular monolit arxitektura, RLS matritsasi
- **Mavjud koddan:** Y1/Y2/Y3 renderers, contentTree, progressStore, UI komponentlari
- **Topics/ papkasidan:** 25 mavzu bo'yicha 3.5 MB tizimlashtirilgan kontent (15 ta darslikdan)

**Eng muhim afzalliklar:**
1. ✅ **Server-authoritative** — imtihon vaqti, scoring, javob kaliti serverda
2. ✅ **HaEqiy mastery** — faqat birinchi mustaqil urinish hisobga olinadi
3. ✅ **Immutable published revision** — tarixiy attemptlar buzilmaydi
4. ✅ **Constraint-based exam generator** — dead-end xatosiz, invariant test bilan
5. ✅ **Mobile-first + accessible** — 360px dan WCAG 2.2 AA gacha
6. ✅ **100% manba tekshiruvi** — har savol darslik sahifasiga bog'langan
7. ✅ **RLS defense-in-depth** — har jadvalda, har qatlamda xavfsizlik
