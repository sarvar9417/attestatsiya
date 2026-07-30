# TIZIM REJASI — Informatika Attestatsiya Platformasi

> **Sana:** 2026-07-30
> **Asos:** 28 ta `.md` hujjat + rasmiy spetsifikatsiya PDF matni + mavjud kod bazasi va migratsiyalar
> **Maqsad:** Uch xil bir-biriga zid spetsifikatsiyani bitta ishlaydigan tizimga birlashtirish

---

## 0. Xulosa — bir paragrafda

Platformada **kod muammosi yo'q, haqiqat manbasi muammosi bor.** TypeScript 0 xato,
43 test o'tadi, Y1/Y2/Y3 renderlari accessibility talabiga mos. Lekin repoda
**uchta bir-biriga zid kontent taksonomiyasi**, **ikkita bir-birini buzadigan
migratsiya to'plami**, va **bazaga umuman ulanmagan frontend** bor. Bazadagi seed
rasmiy spetsifikatsiyaga **hech bir raqamda mos kelmaydi**. Shu holatda yangi
funksiya yozish — poydevorsiz devor qurish. Rejaning mag'zi: avval haqiqatni bitta
qilish (1-hafta), keyin qurish.

---

## 1. Haqiqat manbasi — rasmiy spetsifikatsiya

`darsliklar/extracted/Informatika Testlar spesifikatsiyasi.txt` — bu yagona
o'zgarmas haqiqat. Barcha boshqa hujjat unga bo'ysunadi.

### 1.1 O'zgarmas raqamlar

| Nima | Qiymat | Manba |
|---|---|---|
| Jami savol | **50** | III bo'lim |
| Mutaxassislik fani | **35** | III bo'lim |
| Kasb standarti | **5** (36–40-savollar) | 2-jadval |
| Pedagogik mahorat | **10** (41–50) = 7 umumiy pedagogika + 3 metodika | 2-jadval |
| Vaqt | **120 daqiqa** | III bo'lim |
| Ball | to'g'ri **2**, noto'g'ri **0**, jami **100** | IV bo'lim |
| Bilish | **8** | 3-jadval |
| Qo'llash | **35** | 3-jadval |
| Mulohaza | **7** | 3-jadval |
| Formatlar | **Y1, Y2, Y3** | III bo'lim |

### 1.2 Mutaxassislik fanining 7 mazmun sohasi — savol raqamlari qat'iy

Bu eng muhim, ko'pincha e'tibordan chetda qolgan fakt: **imtihon savollari
raqamlangan va har raqam diapazoni aniq mazmun sohasiga tegishli.** Ya'ni
blueprint kvotasi mavzu darajasida emas, aynan shu guruh darajasida bo'lishi shart.

| Mazmun soha | Savollar | Guruhlar | Savol |
|---|---|---|:---:|
| 1. Axborot va raqamli savodxonlik asoslari | 1–3 | `S1.INFO` | 3 |
| 2. Kompyuter tizimlari va dasturiy muhit | 4–10 | `S2.HW` (2) + `S2.OFFICE` (5) | 7 |
| 3. Mantiqiy fikrlash va algoritmlash | 11–18 | `S3.LOGIC` (3) + `S3.NUM` (2) + `S3.ALGO` (3) | 8 |
| 4. Dasturlash va ma'lumotlar bilan ishlash | 19–26 | `S4.BLOCK` (3) + `S4.CODE` (3) + `S4.DB` (2) | 8 |
| 5. Grafika va veb-texnologiyalar | 27–31 | `S5.WEB` | 5 |
| 6. Kompyuter tizimlari va tarmoqlari | 32–33 | `S6.NET` | 2 |
| 7. Axborot xavfsizligi va raqamli xizmatlar | 34–35 | `S7.SEC` | 2 |
| Kasb standarti | 36–40 | `KS` | 5 |
| Umumiy pedagogika | 41–47 | `PM.GEN` | 7 |
| Informatika metodikasi | 48–50 | `PM.MET` | 3 |
| **Jami** | **1–50** | **15 guruh** | **50** |

`files/04-BLUEPRINT.md` dagi 15 guruhli jadval **rasmiy spetsifikatsiyaga aynan
mos** — u to'g'ri va o'zgartirilmaydi.

### 1.3 Muhim ogohlantirish — kognitiv taqsimot

Rasmiy spetsifikatsiya kognitiv taqsimotni **faqat global darajada** beradi
(8/35/7). **Har guruh uchun kognitiv kvota rasmiy emas.**
`files/04-BLUEPRINT.md` dagi per-guruh ustunlar (`S1.INFO: 1/2/0` va h.k.) —
bizning dizayn qarorimiz. Ular:

- jami 8/35/7 ni beradi ✅ (tekshirildi);
- lekin `ADR` sifatida hujjatlashtirilishi kerak, "rasmiy" deb ko'rsatilmasligi kerak;
- savol banki yetishmasa yumshatilishi mumkin, global 8/35/7 esa **hech qachon** yumshatilmaydi.

---

## 2. Aniqlangan muammolar — dalillar bilan

### 🔴 P0-1 — Bazadagi seed rasmiy spetsifikatsiyaga zid

[supabase/seed.sql](supabase/seed.sql) da:

| Nima | Seed'da | Rasmiy | Holat |
|---|---|---|---|
| Vaqt | **150 daqiqa** | 120 | ❌ |
| Bilish | **33** | 8 | ❌ |
| Qo'llash | **5** | 35 | ❌ |
| Mulohaza | **12** | 7 | ❌ |
| Guruhlar | 9 ta (`S1`…`S9`) | 15 ta | ❌ |
| Modullar | 9 ta o'ylab topilgan | — | ❌ |

Seed'dagi 9 modul (`Axborot tizimlari`, `Kompyuter tarmoqlari`, `Sun'iy intellekt`,
`Web texnologiyalar`…) va 76 konstrukt (`S8.ML`, `S9.API`, `S4.ACID`, `S3.CRYPTO`…)
**spetsifikatsiyada mavjud emas**. Bu universitet IT kursining tuzilishi, attestatsiya
spetsifikatsiyasi emas. `S8` (Sun'iy intellekt) va `S9` (Web/mobil) imtihonda
alohida blok sifatida **yo'q**.

**Ta'siri:** bazadagi butun kontent skeleti — modullar, konstruktlar, blueprint,
5 ta namuna savol — qayta yozilishi kerak.

### 🔴 P0-2 — Ikkita migratsiya to'plami bir-birini buzadi

```
20260729000000_init_schema.sql     → 17 jadval: subtopics, options, attempts,
                                      question_versions, mock_exams, review_queue…
20260730000001..0007_*.sql         → 19 jadval: subjects, constructs,
                                      question_options, question_keys, exams,
                                      exam_items, user_construct_stats…
```

Ikkalasi ham `modules`, `lessons`, `questions` jadvallarini yaratadi.
`supabase db reset` toza bazada **xato bilan to'xtaydi**. Ya'ni hozir loyihani
noldan tiklash imkoni yo'q — bu `AC-OPS-02` (`MVP-BLOCKER`) ning buzilishi.

### 🔴 P0-3 — Frontend baza bilan ulanmagan

Kod so'ragan jadvallar (`grep .from(...)`):

```
specification_versions (8×)   ← faqat ESKI schemada
questions (5×)                ← ikkalasida, lekin ustunlari boshqa
modules (4×)                  ← ikkalasida, lekin ustunlari boshqa
subtopics (3×)                ← faqat ESKI
options (3×)                  ← faqat ESKI
users (1×)                    ← faqat ESKI (yangida: profiles)
question_versions (1×)        ← faqat ESKI
```

**RPC chaqiruvlari: 0 ta.** 18 ta RPC yozilgan (`start_exam`, `submit_answer`,
`finish_exam`, `get_review`, SM-2…), ularning **hech biri chaqirilmaydi**.

[src/components/learning/MockExamView.tsx:28](src/components/learning/MockExamView.tsx#L28)
`generateExamQuestions()` — 50 savolni **klientda**, statik
[src/data/contentTree.ts](src/data/contentTree.ts) dan yasaydi. Javob kaliti
brauzerda. Bu `ADR-007` (server authoritative) va `AC-EX-10` ning to'liq buzilishi.

**Ya'ni:** admin panel eski schemani so'raydi, baza yangi schemada, imtihon esa
umuman bazasiz ishlaydi. Uch qism uch xil dunyoda.

### 🔴 P0-4 — Haqiqiy ish git'da yo'q

```
HEAD (16772327) "Initial commit: attestatsiya platform base"
   └── 806 fayl — lekin bu BOSHQA loyiha (ingliz tili platformasi:
       30_day/, public/audio/listening/a1-colors.mp3, docs/A2_IMPROVEMENT_ROADMAP.md)

Working tree:
   751 fayl o'chirilgan (eski loyiha)
    38 element UNTRACKED ← attestatsiya ishining HAMMASI
```

`src/pages/`, `src/components/learning/`, `src/data/`, `supabase/migrations/`,
`files/`, `informatika-attestatsiya-platform-spec/` — barchasi versiya nazoratidan
tashqarida. Bitta noto'g'ri `git checkout` — hammasi yo'qoladi.

### 🟠 P1-5 — Maxfiy kalitlar ochiq matnda

[PROJECT_STATE.md:88-89](PROJECT_STATE.md#L88-L89):

```
DB connection: [REDACTED — secret manager orqali boshqariladi]
Service Role Token: [REDACTED — repoda saqlanmaydi]
```

Fayl hozir untracked, lekin `git add -A` bir marta ishlatilsa commit tarixiga
tushadi va rotate qilmasdan chiqarib bo'lmaydi. `SECURITY_PRIVACY.md` §15 va
`AC-FND-04` (`MVP-BLOCKER`) buzilgan.

### 🟠 P1-6 — Uchta taksonomiya

| Manba | Tuzilish | Baho |
|---|---|---|
| `files/` | 9 bo'lim, 76 konstrukt, **15 blueprint guruh** | ✅ Blueprint rasmiyga aynan mos |
| `informatika-attestatsiya-platform-spec/` | **16 modul** M01–M16, mikro-mavzular, prerequisite | ✅ O'quv dekompozitsiyasi kuchli |
| `supabase/seed.sql` | 9 o'ylab topilgan modul, 9 guruh | ❌ Rasmiyga zid |

Birinchi ikkitasi **bir-biriga zid emas — ular turli o'qlar.** 3-bo'limda hal qilinadi.

### 🟠 P1-7 — Hujjatlar bir-birini inkor qiladi

| Mavzu | Zid hujjatlar |
|---|---|
| Roadmap | `roadmap.md`, `PLAN.md`, `files/07-ROADMAP.md`, `spec/IMPLEMENTATION_ROADMAP.md` — **4 ta** |
| Loyiha holati | `PROJECT_STATE.md` (9 modul, 150 daq) va `spec/PROJECT_STATE.md` (16 modul, 120 daq) |
| DB schema | `DATABASE_SCHEMA.md` (eski), `spec/DATABASE_SCHEMA.md`, `files/02-DATABASE.md` — **3 ta** |
| Tasklar | `TASKS.md` (T-001…T-015) va `spec/TASKS.md` (TASK-001…TASK-080) |
| Framework | Ikkala spec **Next.js** deydi; kod **React+Vite** |
| Auth | `files/` — anonim kirish; `spec/` — email/parol majburiy |
| Mastery | `files/` — SM-2, konstrukt darajasida; `spec/` — evidence-based, mikro-mavzu darajasida |

Qo'shimcha: [KOD_BAZASI_TAHLILI.md](KOD_BAZASI_TAHLILI.md) **eskirgan** — u eski
schemani tahlil qiladi (`options.is_correct` leakage haqidagi da'vo yangi
schemada allaqachon to'g'rilangan: `question_keys` faqat `editor/admin` uchun) va
mavjud bo'lmagan route'larni ("`/profile` ✅") bor deb ko'rsatadi. Aslida
[src/App.tsx:54-59](src/App.tsx#L54-L59) da faqat 4 route bor:
`/`, `/learn`, `/learn/:moduleId`, `/exam`. `TopicLessonPage.tsx` va `Profile.tsx`
hech qayerdan import qilinmagan — o'lik kod.

### ✅ Ishlayotgan, saqlanadigan qismlar

| Nima | Holat |
|---|---|
| `tsc --noEmit` | 0 xato |
| Vitest | 43/43 o'tadi |
| Y1/Y2/Y3 renderlari | Y2 native `<select>`, Y3 `↑↓` tugmalari — drag'siz ishlaydi ✅ |
| `contentTree.ts` BLUEPRINT | 50 / 120 daq / 8-35-7 — **to'g'ri** |
| Yangi migratsiya RLS | `question_keys` staff-only — **to'g'ri** |
| 18 RPC | Server-authoritative, kalit `get_review` ortida — sifatli, faqat ulanmagan |
| `Topics/` | 3.5 MB, 25 mavzu, tizimlashtirilgan |
| `darsliklar/extracted/` | 15 darslik + spetsifikatsiya, **matn sifatida** — muallif korpusi tayyor |

---

## 3. Asosiy arxitektura qarori — ikki o'qli model

**Muammo:** blueprint 15 guruhda, o'quv kontenti 16 modulda. Qaysi biri?

**Javob: ikkalasi ham. Ular turli maqsad uchun.**

- **Baholash o'qi** — rasmiy, o'zgarmas. Imtihon savol raqamlari shu o'qqa bog'langan.
- **O'quv o'qi** — pedagogik, bizning qarorimiz. Vertikal mavzular, prerequisite, mastery.
- **Konstrukt** — ikkisini bog'laydigan yagona nuqta. Savol konstruktga tegishli.

```
                       ┌─────────────────────────────┐
                       │  QUESTION (savol)            │
                       │  construct_id ──────┐        │
                       └─────────────────────┼────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │  CONSTRUCT (~76)             │
                              │  baholanadigan atom          │
                              │  spetsifikatsiya bandi       │
                              └───┬──────────────────────┬───┘
                                  │                      │
              ┌───────────────────▼──────┐   ┌───────────▼────────────────────┐
              │  BAHOLASH O'QI            │   │  O'QUV O'QI                     │
              │  (rasmiy, o'zgarmas)      │   │  (pedagogik, bizning qarorimiz) │
              ├───────────────────────────┤   ├────────────────────────────────┤
              │ blueprint_group (15)      │   │ module (16, M01–M16)            │
              │  ↳ savol raqami diapazoni │   │  ↳ topic                        │
              │  ↳ kvota: soni + kognitiv │   │     ↳ microtopic                │
              │                           │   │        ↳ learning_objective     │
              │ start_exam SHUNI o'qiydi  │   │        ↳ lesson                 │
              │                           │   │ mastery SHUNI hisoblaydi        │
              └───────────────────────────┘   └────────────────────────────────┘
```

**Qoidalar:**

1. Har konstrukt **aynan bitta** blueprint guruhga tegishli (`construct.group_code`).
2. Har konstrukt **bir yoki bir necha** mikro-mavzu tomonidan o'rgatiladi
   (`microtopic_constructs` — many-to-many).
3. Imtihon generatori **faqat** `blueprint_quotas` va `construct.group_code` bilan ishlaydi.
   Modullarni bilishi shart emas.
4. Mastery **faqat** mikro-mavzu darajasida hisoblanadi. Blueprint guruhini bilishi shart emas.
5. Dashboard'dagi "Blueprint strip" — 15 katak, kengligi savol soniga proporsional
   (3:2:5:3:2:3:3:3:2:5:2:2:5:7:3). Bu ikki o'qning ko'rinadigan ulanish nuqtasi:
   guruh to'lishi = shu guruh konstruktlarini o'rgatuvchi mikro-mavzular mastery'si.

**Nima uchun bu to'g'ri:** modul → guruh xaritalash bir-biriga to'g'ri tushmaydi.
Masalan rasmiy spetsifikatsiyada "Grafika va veb-texnologiyalar" — **5 savolli
bitta guruh** (`S5.WEB`). `spec/CONTENT_BLUEPRINT.md` esa uni M10 (grafika, 2) va
M11 (HTML/CSS, 3) ga bo'lgan. Ikkinchisi o'rgatish uchun to'g'ri, birinchisi
imtihon uchun to'g'ri. Bitta jadvalga siqib bo'lmaydi — shuning uchun ikki o'q.

### 3.1 Tasdiqlangan qarorlar (yangi ADR sifatida yoziladi)

| ADR | Qaror | Sabab |
|---|---|---|
| ADR-017 | **React + Vite** saqlanadi, Next.js'ga o'tilmaydi | Kod tayyor, `tsc` toza. SEO keyin: `/konstrukt/[slug]` sahifalari uchun build-time prerender qo'shiladi |
| ADR-018 | **Ikki o'qli taksonomiya** (yuqoridagi) | Rasmiy blueprint va pedagogik dekompozitsiya bir-birini almashtira olmaydi |
| ADR-019 | **Barcha yozish faqat RPC** (`security definer`) | 18 RPC tayyor. Klient `insert/update` qilmaydi. `files/` ning eng kuchli qarori |
| ADR-020 | **Anonim kirish → email upgrade** | `files/01-ARCHITECTURE.md`. Bepul ommaviy loyiha uchun to'g'ri: `auth.uid()` o'zgarmaydi, progress yo'qolmaydi |
| ADR-021 | **Mastery: SM-2 konstrukt darajasida + evidence mikro-mavzu darajasida** | 6-bo'limga qarang. `files/` va `spec/` ni birlashtiradi |
| ADR-022 | **Per-guruh kognitiv kvota — dizayn qarori, rasmiy emas** | Spetsifikatsiya faqat global 8/35/7 beradi |
| ADR-023 | **Eski migratsiya (`20260729*`) va seed o'chiriladi** | Bazada 5 savol bor. Forward-migration qiymati nolga teng |

---

## 4. Hujjatlarni tozalash — yagona haqiqat

Hozir 28 `.md`, ularning yarmi bir-birini inkor qiladi. Yangi tuzilish:

```
docs/
├── 00-SPECIFICATION.md      ← rasmiy PDF dan olingan o'zgarmas faktlar (1-bo'lim)
├── 01-DECISIONS.md          ← ADR-001…023 (spec/DECISIONS.md + yangi 7 ta)
├── 02-ARCHITECTURE.md       ← ikki o'qli model, React+Vite, RPC-only
├── 03-DATABASE.md           ← YAGONA schema (5-bo'lim)
├── 04-RPC.md                ← files/03-RPC.md, ikki o'qqa moslashtirilgan
├── 05-DOMAIN-RULES.md       ← spec/DOMAIN_RULES.md + SM-2 (6-bo'lim)
├── 06-CONTENT-STANDARD.md   ← spec/CONTENT_AUTHORING_STANDARD.md (o'zgarishsiz)
├── 07-FRONTEND.md           ← files/05-FRONTEND.md (dizayn tili) + spec/UX_SPEC.md (a11y)
├── 08-ADMIN.md              ← files/06-ADMIN.md + spec/ADMIN_CMS.md
├── 09-SECURITY.md           ← spec/SECURITY_PRIVACY.md (o'zgarishsiz)
├── 10-TESTING.md            ← spec/TESTING_QA.md (o'zgarishsiz)
├── 11-ROADMAP.md            ← 7-bo'lim (yagona roadmap)
└── 12-GLOSSARY.md           ← spec/GLOSSARY.md (o'zgarishsiz)

AGENTS.md          ← ildizda qoladi (mavjud versiya yaxshi)
PROJECT_STATE.md   ← ildizda qoladi, TOZALANADI (maxfiy kalitlar olib tashlanadi)
TASKS.md           ← ildizda qoladi, yagona backlog
```

**Arxivga (`docs/archive/`, faqat tarix uchun):**
`YAGONA_PLATFORMA_TAKLIFI.md`, `KOD_BAZASI_TAHLILI.md`, `roadmap.md`, `PLAN.md`,
`DATABASE_SCHEMA.md`, va `files/` + `informatika-attestatsiya-platform-spec/`
papkalarining o'zi.

**Ustuvorlik tartibi (zidlik bo'lsa):**
`00-SPECIFICATION.md` → `01-DECISIONS.md` → `05-DOMAIN-RULES.md` →
`03-DATABASE.md` / `04-RPC.md` → qolganlar.

---

## 5. Yagona database schemasi

`files/02-DATABASE.md` ni asos qilamiz (RPC'lar unga yozilgan), ikki o'q uchun
kengaytiramiz. Jami **28 jadval**.

### 5.1 Baholash o'qi (rasmiy)

```sql
subjects                 -- 1 qator: informatika
blueprints               -- versiyalangan: 2026, total=50, duration_min=120
blueprint_quotas         -- 15 qator, group_code, question_count, n_bilish/qollash/mulohaza
                         -- + question_number_from, question_number_to  ← YANGI
constructs               -- ~76, group_code (15 guruhdan biri), code, slug
```

Constraint'lar (migratsiyada, kodda emas):

```sql
-- Jami 50
alter table blueprint_quotas add constraint quota_cognitive_sum
  check (n_bilish + n_qollash + n_mulohaza = question_count);

-- Savol raqami diapazoni kvotaga mos
alter table blueprint_quotas add constraint quota_range_matches_count
  check (question_number_to - question_number_from + 1 = question_count);
```

Blueprint darajasidagi invariantlar (`validate_blueprint(blueprint_id)` funksiyasi,
`activate` dan oldin chaqiriladi):
`sum(question_count) = 50`, `sum(n_bilish) = 8`, `sum(n_qollash) = 35`,
`sum(n_mulohaza) = 7`, savol raqamlari 1–50 ni uzluksiz qoplaydi va kesishmaydi.

### 5.2 O'quv o'qi (pedagogik)

```sql
modules                  -- 16: M01–M16, exam_section
curriculum_nodes         -- topic/microtopic daraxti, code (M08.03), parent_id
curriculum_prerequisites -- node_id, prerequisite_node_id, requirement
learning_objectives      -- curriculum_node_id, code (M12.05.LO01), is_critical
microtopic_constructs    -- ⭐ IKKI O'QNI BOG'LOVCHI: (curriculum_node_id, construct_id)
mastery_configs          -- threshold, weight, review_intervals[]
lessons                  -- curriculum_node_id, body (bloklar)
lesson_revisions         -- immutable published
```

### 5.3 Kontent

```sql
sources                  -- 15 darslik + spetsifikatsiya + 5 pedagogik manba
source_locators          -- pdf_page_from/to, chapter_title
questions                -- construct_id, group_code (denorm), format, cognitive, difficulty
question_options         -- OMMAVIY o'qish mumkin (kalit bu yerda YO'Q)
question_keys            -- ⛔ RLS: faqat editor/admin. get_review ortida
question_revisions       -- immutable published, content_hash
question_sources         -- ADR-011: published savol manbasiz bo'lmaydi
stimuli                  -- kod/jadval/rasm, bir necha savolga umumiy
tags                     -- misconception, skill
```

### 5.4 O'quvchi

```sql
profiles                 -- auth.users trigger, joriy toifa, exam_date, daily_goal
exams                    -- kind, blueprint_id, started_at, duration_sec, breakdown
exam_items               -- snapshot: question_id, construct_id, order_idx, user_answer
user_construct_stats     -- SM-2: ease, interval_days, due_at  (konstrukt darajasida)
mastery_evidence         -- append-only, is_independent_first_attempt (mikro-mavzu)
mastery_records          -- not_started/learning/provisional/stable/regressed
review_schedules         -- 1/3/7/14/30 kun
error_notebook_entries   -- objective + misconception bo'yicha
user_lesson_progress
user_module_progress
```

### 5.5 Sifat va audit

```sql
question_stats           -- p_value, discrimination, option_dist (attempts >= 30)
question_reports         -- foydalanuvchi xato xabari
audit_log                -- append-only, kalit o'zgarishi majburiy yoziladi
idempotency_keys
job_runs
```

### 5.6 Xavfsizlik qoidalari (istisnosiz)

1. Har jadvalda `enable row level security`.
2. `question_keys` — `anon` va `authenticated` uchun **hech qanday** siyosat yo'q.
3. `exams`, `exam_items`, `user_*` — faqat `select` siyosati. Yozish faqat RPC.
4. Har `security definer` funksiyada `set search_path = ''` va `auth.uid()` tekshiruvi.
5. Migratsiyadan keyin majburiy tekshiruv: RLS'siz jadval yo'q, siyosatsiz jadval yo'q,
   `set role anon; select count(*) from question_keys` → **0**.

---

## 6. Mastery — ikki tizimni birlashtirish

`files/` SM-2 ni konstrukt darajasida, `spec/` evidence-based mastery'ni mikro-mavzu
darajasida beradi. **Ikkalasi kerak, ular turli savolga javob beradi.**

| | SM-2 (`user_construct_stats`) | Evidence mastery (`mastery_records`) |
|---|---|---|
| Daraja | Konstrukt (~76) | Mikro-mavzu (~120) |
| Savol | "Bu konstruktni **qachon** takrorlash kerak?" | "Bu mavzu **o'zlashtirildimi**?" |
| Kirish | Har javob (`apply_sm2`) | Faqat mustaqil birinchi urinish |
| Chiqish | `due_at`, `interval_days` | `provisional` / `stable` / `regressed` |
| Ishlatiladi | Takrorlash navbati, adaptiv tanlash | Keyingi mavzuni ochish, readiness |

### 6.1 Evidence turlari (`ADR-012`)

| Tur | Mastery'ga kiradi? | Shart |
|---|:---:|---|
| **Independent first attempt** | ✅ | Kalit/tushuntirish oldin ko'rilmagan + shu savolga birinchi javob + hint yo'q + session `invalid` emas |
| **Guided production** | ❌ | Hint bilan |
| **Corrected retry** | ❌ | Tushuntirishdan keyin |

Bu farq `question_exposures.answer_revealed_at` orqali aniqlanadi — shuning uchun
u jadval **majburiy**, ixtiyoriy emas.

### 6.2 Mastery hisoblash

```
level_score = correct_distinct / attempted_distinct     (evidence yo'q → null, 0 emas)
overall     = bilish×0.20 + qo'llash×0.50 + mulohaza×0.30
```

Oyna: so'nggi 90 kun, har kognitiv daraja uchun so'nggi 20 distinct savol.

**Provisional** (hammasi bajarilishi shart):
≥15 distinct mustaqil savol · ≥8 qo'llash/mulohaza · `overall ≥ 0.90` ·
qo'llash+mulohaza `≥ 0.80` · har critical objective ≥2 marta to'g'ri ·
faol misconception remediation o'tgan.

**Stable:** 1 → 3 → 7 → 14 → 30 kunlik reviewlar o'tgach.
Tolerance: 1-kunlik uchun +1 kun, qolganlari intervalning 50% gacha.

**Regression:** 2 ketma-ket review fail · yoki so'nggi 10 evidence aniqligi `< 0.70` ·
yoki critical objective bo'yicha 2 ketma-ket xato.

### 6.3 Adaptiv tanlash (10 savollik session)

| Maqsad | Ulush |
|---|:---:|
| Ayni mikro-mavzuning zaif objective | 50% |
| Muddati kelgan takrorlash (`due_at <= now()`) | 25% |
| Yangi / kam ko'rilgan savol | 15% |
| Kuchli objective nazorati | 10% |

Rounding — eng katta qoldiq usuli, deterministik. Pool yetishmasa nisbat
yumshatiladi va `session.metadata.fallback` ga yoziladi.

**Statistik shovqin himoyasi** (`files/07-ROADMAP.md` dagi muhim nuance):
konstrukt `attempts < 5` bo'lsa **"zaif" deb belgilanmaydi** — bitta mockda
`S3.NUM` atigi 2 savol, ikkisi ham xato bo'lishi shunchaki tasodif bo'lishi mumkin.
Undan oldin UI "ma'lumot yig'ilmoqda" deydi.

---

## 7. Imtihon generatori — dead-end'siz

**Greedy random tanlov taqiqlanadi.** Sabab: guruh × kognitiv kesishmasida
oxirgi slotga mos savol qolmasligi mumkin va algoritm boshi berk ko'chaga kiradi.

```
assemble(blueprint, user, seed):
  1. pool = published + eligible savollar
  2. assertFeasible(pool, quotas)          → yetmasa BLUEPRINT_POOL_INSUFFICIENT
                                              + guruh/kognitiv kesimida deficit hisoboti
  3. slots = expandGroupSlots(quotas)      → 50 slot, har biri (group, cognitive)
  4. guruhlarni eng kam moslashuvchanlik bo'yicha saralash
  5. seeded deterministic constraint assignment
  6. har slotga savol: exposure penalty + difficulty soft cost
  7. validateHardInvariants(selected)
  8. transaction: exams + exam_items + assembly_audit(seed, pool_count, fallback)
```

**Hard invariantlar** (buzilsa imtihon yaratilmaydi):
jami aynan 50 · har guruh soni kvotaga aynan teng · kognitiv aynan 8/35/7 ·
savol raqamlari guruh diapazoniga mos · dublikat yo'q · faqat `published` ·
`archived` yo'q · ball 2×50 · javob kaliti klient payload'ida yo'q.

**Soft maqsadlar** (invariantni buzmaydi): qiyinlik 20% oson / 60% o'rta / 20% qiyin ·
format xilma-xilligi · foydalanuvchi ko'rmagan savol · bitta stimulusdan ko'pi bilan 1 savol.

**Test talabi:** 1000+ seeded property test. Bir xil seed → bir xil natija.

### 7.1 Taymer

`started_at` va `duration_sec` **serverda**. Klient taymeri faqat ko'rsatish uchun.
`submit_answer` har chaqiruvda server vaqtini tekshiradi →
`now() > started_at + duration_sec` bo'lsa `{error: 'vaqt_tugadi'}`.
`finish_exam` **idempotent** — taymer va foydalanuvchi tugmasi bir vaqtda ishlashi mumkin.
Safety job muddati o'tgan faol sessiyalarni yopadi.
Klient soatini o'zgartirish hech narsa bermaydi.

### 7.2 Ball chegaralari

| Joriy toifa | Ball | Qaror |
|---|:---:|---|
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

**86+ ball** — vazir jamg'armasi ustamasi va "Yil o'qituvchisi" saralashining
birinchi bosqichi mezoni. Natija ekranida ko'rsatiladi.

**Muhim:** navbatdan tashqari attestatsiyada toifa tushirilmaydi. Foydalanuvchi
joriy toifasini profilida bir marta tanlaydi; tanlanmagan bo'lsa barcha variant ko'rsatiladi.

---

## 8. Bajarish rejasi

Har bosqich **qabul mezoni bajarilmasa tugallangan hisoblanmaydi.** Bosqichni
yarim qoldirib keyingisiga o'tish — loyihaning eng katta xavfi.

### 🔴 Bosqich 0 — Poydevorni to'g'rilash (1 hafta) — BLOKLOVCHI

Bu bosqich tugamasdan **hech qanday yangi funksiya yozilmaydi.**

| # | Vazifa |
|:-:|---|
| 0.1 | **Git'ni qutqarish.** Yangi orphan branch: `git checkout --orphan attestatsiya`. Eski ingliz tili loyihasini o'chirish. `.gitignore`ga `darsliklar/` (711 MB) qo'shish. Attestatsiya ishini to'liq commit qilish |
| 0.2 | **Maxfiy kalitlarni rotate qilish.** Supabase'da DB parol + service role token yangilash. `PROJECT_STATE.md` dan o'chirish. `.env` ni tekshirish. `git log -S` bilan tarixda yo'qligini tasdiqlash |
| 0.3 | **Eski migratsiyani o'chirish.** `20260729000000_init_schema.sql` va `20260729220000_users_and_fixes.sql` → o'chirish. Bazada `drop schema public cascade; create schema public;` |
| 0.4 | **Yagona schema.** `20260730*` to'plamini 5.1–5.5 bo'yicha kengaytirish: `microtopic_constructs`, `curriculum_nodes`, `learning_objectives`, `mastery_configs`, `mastery_evidence`, `question_exposures`, `question_sources`, `blueprint_quotas.question_number_from/to` |
| 0.5 | **To'g'ri seed.** 1 subject · 16 modul · 15 blueprint guruh (1.2-jadval) · ~76 konstrukt (rasmiy spetsifikatsiya bandlaridan) · mikro-mavzular · `microtopic_constructs` xaritasi · 15 source. Namuna savollarni **o'chirish** |
| 0.6 | **Hujjatlarni birlashtirish.** 4-bo'lim bo'yicha `docs/` yaratish, eskilarini arxivlash |
| 0.7 | `supabase gen types typescript` → `src/lib/database.types.ts` (qo'lda yozilgani o'rniga) |
| 0.8 | **O'lik kodni o'chirish:** `TopicLessonPage.tsx`, `Profile.tsx` (import qilinmagan) |

**Qabul mezoni:**
- [ ] `supabase db reset` toza bazada **xatosiz** o'tadi
- [ ] `select sum(question_count), sum(n_bilish), sum(n_qollash), sum(n_mulohaza) from blueprint_quotas` → `50 | 8 | 35 | 7`
- [ ] `select count(*) from blueprint_quotas` → `15`
- [ ] `select count(*) from modules` → `16`
- [ ] `select count(*) from constructs` → `76`
- [ ] Har konstrukt `group_code` 15 guruhdan birida: `select count(*) from constructs c left join blueprint_quotas q using(group_code) where q.id is null` → `0`
- [ ] Har konstrukt kamida bitta mikro-mavzuga bog'langan
- [ ] `set role anon; select count(*) from question_keys` → `0`
- [ ] RLS'siz yoki siyosatsiz jadval yo'q
- [ ] `git log` da faqat attestatsiya loyihasi
- [ ] Repoda maxfiy kalit yo'q (secret scan)
- [ ] `tsc` 0 xato, testlar yashil

---

### 🟠 Bosqich 1 — Sinov dvigateli (1.5 hafta)

Kontent hali yo'q, lekin mexanizm **to'liq serverda** ishlaydi.

| # | Vazifa |
|:-:|---|
| 1.1 | RPC'larni yangi schemaga moslash: `start_exam` 15 guruh × kognitiv kvota bo'yicha; `generate_topic_test` mikro-mavzu konstruktlari bo'yicha |
| 1.2 | `assertFeasible` + `BLUEPRINT_POOL_INSUFFICIENT` deficit hisoboti |
| 1.3 | Constraint-based generator (7-bo'lim), seeded deterministik |
| 1.4 | **`MockExamView` ni qayta yozish:** klient generatsiyasini o'chirish, `start_exam` RPC ga o'tish |
| 1.5 | `ExamRunner` — bitta konteyner, rejim propi bilan (mashq/mavzu/bo'lim/mock/takrorlash) |
| 1.6 | Server taymeri + 30 soniyada drift tekshiruvi + `finish_exam` idempotentligi |
| 1.7 | Offline navbat: javob `localStorage` ga, 5 soniyada qayta yuborish |
| 1.8 | Natija ekrani: ball, toifa qarori, 15 guruh kesimi, Blueprint strip |
| 1.9 | Qo'lda 30 ta test savoli (har formatdan) — vaqtinchalik, mexanizmni sinash uchun |

**Qabul mezoni:**
- [ ] 1000+ seeded generator testi: jami 50, kognitiv 8/35/7, guruh kvotalari aynan, dublikat yo'q
- [ ] Bir xil seed → bir xil imtihon
- [ ] Savol yetmasa imtihon **yaratilmaydi**, deficit hisoboti qaytadi
- [ ] `submit_answer` mock rejimida faqat `{saved: true}` (tushuntirish yo'q)
- [ ] `get_review` tugamagan sinovda `sinov_tugamagan` xatosi
- [ ] `finish_exam` ikki marta → `already_finished: true`, ball o'zgarmaydi
- [ ] Vaqt tugagach `submit_answer` → `{error: 'vaqt_tugadi'}`
- [ ] Boshqa foydalanuvchining `exam_id` → `sinov_topilmadi`
- [ ] **DevTools Network'da javob kaliti hech qayerda yo'q** (E2E test)
- [ ] Klient soatini 2 soat oldinga surish natijaga ta'sir qilmaydi
- [ ] Tarmoqni o'chirib javob berish → qayta ulanganda saqlanadi

---

### 🟡 Bosqich 2 — Generatorlar va savol zaxirasi (1.5 hafta)

Eng katta xavf — kontent yozish to'xtashi. Shuning uchun generatorlar erta.

| Generator | Konstruktlar | Beradi |
|---|---|:---:|
| `axborotHajmi.ts` | `S1.INFO.04/05/06` | ~60 |
| `sanoqSistema.ts` | `S3.NUM.01/02/03` | ~60 |
| `mantiqAmal.ts` | `S3.LOGIC.02/04` | ~40 |
| `ipMaska.ts` | `S6.NET.03` | ~20 |
| **Jami** | **9 konstrukt** | **~180 savol qo'lda yozmasdan** |

Har generator: `generate(seed) → { stem, options, key, explanation }`.
Natija `questions.is_generated = true`, avtomatik `published` (formula bilan tekshirilgan).

**`KS.*` va `PM.*` uchun generator yozilmaydi** — bu savollar vaziyat tahliliga
asoslanadi, LLM ularda ishonchsiz. Har birini qo'lda yozish va tekshirish kerak.

**Ustuvorlik:** `KS` (5) + `PM.GEN` (7) + `PM.MET` (3) = **imtihonning 30%i (15 savol)**,
lekin bozorda material eng kam. **Kontent yozishni shu uchtadan boshlash.**

**Qabul mezoni:**
- [ ] Har generator 100 savol chiqaradi, dublikat yo'q
- [ ] Generator javoblari mustaqil hisoblagich bilan tekshirilgan
- [ ] `KS.*` + `PM.*` uchun ≥60 qo'lda savol, ekspert tekshirgan
- [ ] Har konstruktda ≥4 published savol: `... group by construct_id having count(*) < 4` → bo'sh
- [ ] `start_exam('mock')` xatosiz 50 savol qaytaradi

---

### 🟡 Bosqich 3 — O'quv oqimi (2 hafta)

| # | Vazifa |
|:-:|---|
| 3.1 | Onboarding: ism · imtihon sanasi · joriy toifa · kunlik vaqt (10/20/30/45/60) · diagnostika taklifi |
| 3.2 | Dashboard: bugungi action · due review · readiness (confidence bilan) · **Blueprint strip** · 16 modul progress · so'nggi mock |
| 3.3 | Curriculum → modul → mikro-mavzu → dars route'lari |
| 3.4 | Dars renderi: 11 blok turi (`paragraph`, `heading`, `bullet_list`, `ordered_list`, `callout`, `formula`, `code`, `table`, `image`, `worked_example`, `common_error`) |
| 3.5 | Dars strukturasi: maqsad → oldingi bilim → tushuntirish → qoida → misol → "ko'p uchraydigan xato" → quick check → keyingi action |
| 3.6 | `generate_topic_test` bilan mavzu testi (har konstruktdan majburiy 1 savol) |
| 3.7 | Practice feedback: sabab · qadamlar · nega bu variant xato · **manba nomi/sahifasi** · "yangi o'xshash savol" |
| 3.8 | Xatolar daftari |
| 3.9 | Dizayn tili: `--siyoh #14213D`, `--qogoz #F7F8FA`, `--sirlangan #1B5E9E`, `--zar #C77D0A`, `--yashil #256B54`, `--qizil #A8322D`. Archivo + IBM Plex Sans/Mono. `font-variant-numeric: tabular-nums` barcha ball va taymerda |

**Qabul mezoni:**
- [ ] Mavzu testi shu mavzuning **har** konstruktidan ≥1 savol oladi
- [ ] Bir konstruktdan 0 to'g'ri bo'lsa, umumiy 80% bo'lsa ham `mastered_at` yozilmaydi
- [ ] Ikkinchi urinishda savollar birinchisidan farq qiladi
- [ ] Blueprint strip kengliklari 3:2:5:3:2:3:3:3:2:5:2:2:5:7:3 nisbatida
- [ ] 360px kenglikda gorizontal skroll yo'q
- [ ] Klaviatura bilan to'liq navigatsiya, `:focus-visible` ko'rinadi
- [ ] Kontrast ≥4.5:1, axe kritik buzilish yo'q

---

### 🟡 Bosqich 4 — Mastery va adaptivlik (1.5 hafta)

| # | Vazifa |
|:-:|---|
| 4.1 | Evidence klassifikatori (independent / guided / retry) + `question_exposures` |
| 4.2 | Versiyalangan mastery kalkulyatori (6.2) |
| 4.3 | SM-2 (konstrukt) + review scheduler 1/3/7/14/30 (mikro-mavzu) |
| 4.4 | Adaptiv selector 50/25/15/10 + `attempts < 5` shovqin himoyasi |
| 4.5 | Readiness: `0.60×unseen_accuracy + 0.25×retention + 0.15×coverage`, blueprint bo'yicha vaznlangan |
| 4.6 | Kirish diagnostikasi (25 savol) |

**Qabul mezoni:**
- [ ] Tushuntirishdan keyingi to'g'ri javob mastery'ni **oshirmaydi**
- [ ] Bir savolga ikkinchi marta javob evidence hisoblanmaydi
- [ ] `provisional` keyingi mikro-mavzuni ochadi
- [ ] 5 review o'tgach `stable`
- [ ] 2 ketma-ket fail → `regressed` + remediation reja
- [ ] `attempts < 5` konstrukt "zaif" deb belgilanmaydi
- [ ] Readiness "taxminiy" belgisi, evidence soni va confidence bilan ko'rsatiladi
- [ ] UI'da "50/50 kafolat" yozilmaydi

---

### 🟢 Bosqich 5 — Admin CMS (2 hafta)

| # | Vazifa |
|:-:|---|
| 5.1 | Rol tekshiruvi: `user` → **404** (403 emas, admin panel mavjudligini oshkor qilmaslik) |
| 5.2 | Dashboard: bayroqli savollar (eng muhim vidjet) · review navbati · manbasiz draftlar · coverage matritsasi · mock readiness |
| 5.3 | Savol muharriri: split view (forma | learner preview) |
| 5.4 | **Nashr shartlari server tomonda:** `stem` bo'sh emas · Y1 ≥4 variant aynan 1 to'g'ri · Y2 har chap element juftlangan · Y3 tartib to'liq · `explanation` ≥80 belgi · konstrukt biriktirilgan · **manba biriktirilgan** |
| 5.5 | Workflow: `draft → in_review → changes_requested → draft` / `→ approved → published → archived`. Author o'zini approve qilmaydi. Published immutable (trigger) |
| 5.6 | Dublikat aniqlash: content hash (bloklaydi) + leksik o'xshashlik (ogohlantiradi) |
| 5.7 | Bulk import: JSON, dry-run → hisobot → commit, **har doim `draft`** |
| 5.8 | Psixometrika: `p_value`, `discrimination`, `option_dist`, `attempts >= 30` da hisoblanadi |
| 5.9 | Audit log — **kalit o'zgarishi majburiy yoziladi** |

**Bayroq chegaralari:**

| Shart | Belgi | Ma'nosi |
|---|---|---|
| `discrimination < 0` | 🔴 kritik | Deyarli har doim javob kaliti xato |
| `discrimination < 0.1` | 🟠 | Kuchli/zaifni ajratmaydi |
| `p_value < 0.25` | 🟠 | Juda qiyin yoki noaniq |
| `p_value > 0.90` | 🟡 | Juda oson |
| Biror variant 0% | 🟡 | O'lik distraktor |

**Qabul mezoni:**
- [ ] `user` roli `/admin` ga kirsa 404
- [ ] Tushuntirishsiz savol nashr etilmaydi (server tekshiradi)
- [ ] Manbasiz savol nashr etilmaydi
- [ ] Author o'z revisionini approve qila olmaydi
- [ ] Published qatorni `update` qilish trigger bilan rad etiladi
- [ ] Manfiy diskriminatsiyali savol dashboardda kritik bayroq bilan
- [ ] Import hech qachon avtomatik publish qilmaydi

---

### 🟢 Bosqich 6 — Kontent ishlab chiqarish (doimiy, 3-bosqichdan parallel)

`darsliklar/extracted/` da 15 darslik **matn sifatida** tayyor — bu muallif korpusi.
`Topics/` da 3.5 MB tizimlashtirilgan material.

**Huquqiy chegara — har bosqichda:**
- Cambridge yoki RTM darsliklaridan matn, rasm, mashq **ko'chirilmaydi**
- Rasmiy imtihon savollari qayta nashr qilinmaydi — spetsifikatsiya **konstrukti**
  asosida o'z savolimiz yoziladi (konstruktning o'zi ochiq davlat hujjati)
- Spetsifikatsiya PDF'iga havola beriladi, saytga joylashtirilmaydi
- Har savol izohi **qayta yozilgan** bo'ladi, ko'chirilgan emas

**Savol zaxirasi maqsadlari:**

| Bosqich | Konstruktga | Jami | Nima ishlaydi |
|---|:---:|:---:|---|
| Minimal | 4 | ~300 | Mavzu testi |
| Qulay | 7 | ~530 | Mock takrorlanmaydi |
| To'liq | 10 | ~760 | 3+ mock, SM-2 erkin |
| Production | 20/slot | ≥3000 | 20 audit qilingan mock kombinatsiya |

**Pilot modullar (mexanizmni turli tomondan sinaydi):**
`M01` nazariy/atama · `M05` formula/hisoblash · `M08` kod bloki/sintaksis.
Har biri ≥100 savol, barcha format va kognitiv daraja, 2+ reviewer.

---

### 🟢 Bosqich 7 — Xavfsizlik, SEO va ochilish (1.5 hafta)

| # | Vazifa |
|:-:|---|
| 7.1 | Xavfsizlik audit: RLS matritsasi · IDOR · rol escalation · XSS · upload · rate limit · CSP va security headers |
| 7.2 | **Javob kaliti leakage E2E** — barcha network javoblarida `correct*` maydoni yo'qligi |
| 7.3 | Backup restore mashqi |
| 7.4 | `/konstrukt/[slug]` — 76 SEO sahifa (build-time prerender) |
| 7.5 | `/spetsifikatsiya` — rasmiy formatni tushuntiruvchi sahifa |
| 7.6 | `sitemap.xml`, `robots.txt`, Open Graph |
| 7.7 | Har savol yonida "xato xabar berish" tugmasi |
| 7.8 | PWA/offline shell |
| 7.9 | Performance: LCP < 2.5s (3G), dastlabki JS < 150 KB gzip |

**Qabul mezoni:**
- [ ] Xavfsizlik nazorat ro'yxati to'liq yopilgan
- [ ] `curl` bilan olingan HTML'da konstrukt sahifasi matni bor
- [ ] Lighthouse SEO ≥95, Performance ≥85 (mobil)
- [ ] Backup'dan tiklash sinovdan o'tgan va vaqti yozilgan

---

## 9. Xavflar va ularni yumshatish

| Xavf | Ehtimol | Yumshatish |
|---|:---:|---|
| **Poydevor tuzatilmasdan funksiya yozilishi** | **Juda yuqori** | Bosqich 0 qat'iy blokirovka. Qabul mezoni bajarilmasa 1-bosqich boshlanmaydi |
| Kontent yozish to'xtaydi | Yuqori | Generatorlar 2-bosqichda → ~180 savol darhol. `KS`/`PM` birinchi navbatda |
| LLM savollarida xato javob | Yuqori | Har birini qo'lda tekshirish. Psixometrika (`discrimination < 0`) keyin ushlaydi |
| Uch taksonomiya qaytadan aralashadi | Yuqori | ADR-018 + `microtopic_constructs` schema darajasida majburlaydi |
| Savollar nusxalanadi | O'rta | Kalit RPC ortida. Qiymat diagnostikada, savolda emas |
| Mavsumiy yuklama (fevral–aprel) | O'rta | Statik build + CDN. Supabase faqat baza va auth |
| Tekin tarif egress chegarasi | O'rta | Rasm va WASM Supabase Storage'da emas |
| Spetsifikatsiya o'zgaradi | Past | `blueprints` versiyalangan, `exams.blueprint_id` eski natijani saqlaydi |
| Darslik copyright | Past | Paraphrase, private source, ko'chirish taqiqi |

---

## 10. Darhol bajariladigan 5 qadam

Ertaga boshlanadigan tartib:

1. **`git checkout --orphan attestatsiya`** — 38 untracked element commit qilinadi,
   806 fayllik ingliz tili loyihasi tarixi tashlab yuboriladi, `darsliklar/`
   `.gitignore`ga qo'shiladi. *(Eng shoshilinch: hozir hech qanday himoya yo'q.)*

2. **Maxfiy kalitlarni rotate qilish** — Supabase DB parol + service role token.
   `PROJECT_STATE.md:88-89` dan o'chirish.

3. **`20260729*` migratsiyalarni o'chirish** va bazani `drop schema public cascade`
   bilan tozalash. Bazada 5 ta namuna savol bor — yo'qotadigan narsa yo'q.

4. **To'g'ri seed yozish** — 15 blueprint guruh (1.2-jadval), 16 modul, ~76 konstrukt
   rasmiy spetsifikatsiyaning "Baholanadigan konstruktlar" bandlaridan,
   `microtopic_constructs` xaritasi. Keyin tekshiruv: `50 | 8 | 35 | 7`.

5. **`MockExamView.tsx:28` ni o'ldirish** — `generateExamQuestions()` klient
   funksiyasini `start_exam` RPC chaqiruvi bilan almashtirish. Bu bitta o'zgarish
   javob kaliti brauzerdan chiqib ketishini to'xtatadi.

---

## Ilova A — Hujjatlardan olingan eng qimmatli qarorlar

Birlashtirilgan rejaga kirgan, tashlab yuborilmasligi kerak bo'lgan g'oyalar:

**`files/` dan:**
- Anonim kirish → email upgrade (`auth.uid()` o'zgarmaydi, progress yo'qolmaydi)
- Barcha yozish `security definer` RPC orqali, klient hech qachon ball yozmaydi
- `question_keys` alohida jadval, `anon`/`user` uchun siyosat **yo'q**
- Blueprint kvotalari bazada, kodda emas → spetsifikatsiya o'zgarsa eski natija buzilmaydi
- **Blueprint strip** — 15 katak, kenglik savol soniga proporsional (signature element)
- Psixometrika: `discrimination < 0` deyarli har doim kalit xatosi
- `attempts < 5` bo'lgan konstrukt "zaif" deb belgilanmaydi (statistik shovqin)
- Parametrik generatorlar 9 konstrukt uchun ~180 savol beradi
- Kontent yozishni `KS`/`PM` dan boshlash (imtihonning 30%i, material eng kam)
- Xato matni ayblovsiz: "Javob saqlanmadi. Internetni tekshiring — qayta urinamiz."

**`informatika-attestatsiya-platform-spec/` dan:**
- Independent first attempt / guided / corrected retry farqi (`ADR-012`)
- Published revision immutable → tarixiy attemptlar buzilmaydi
- Constraint-based generator, greedy random taqiqi
- Har published savol manbaga bog'lanadi (`ADR-011`)
- RLS matritsasi va uch qatlamli avtorizatsiya (route → service → RLS)
- Idempotency-Key barcha mutationda
- Readiness — kafolat emas, confidence va evidence soni bilan
- `given_<context>_when_<action>_then_<result>` test nomlash
- Progress "UI necha foiz" emas, qabul mezoni bilan o'lchanadi

**Mavjud koddan:** Y1/Y2/Y3 renderlari (Y2 native `select`, Y3 `↑↓` — drag'siz
ishlaydi), `contentTree.ts` BLUEPRINT konstantasi, 43 o'tayotgan test.
