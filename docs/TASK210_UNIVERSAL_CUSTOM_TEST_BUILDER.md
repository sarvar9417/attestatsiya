# TASK-210 — Universal shaxsiy test konstruktori (2026-10-18)

**Holat:** IN_PROGRESS — server generator + konfigurator UI + SQL/backend/Playwright verification Draft PR #144 da ishlab chiqildi; presets/construct microtopic/results analytics/resume/release hali OPEN.  
**Repository:** `sarvar9417/attestatsiya` · **branch:** `task/TASK-210-custom-test-builder`  
**Product owner talabi:** foydalanuvchi o‘zi bo‘lim / topic / subtopic, son, qiyinchilik va vaqtni belgilab test tuzadi. Informatika va pedagogika / kasb standartlari bir testda bo‘lishi mumkin.  
**Source of truth:** `AGENTS.md`, `informatika-attestatsiya-platform-spec/{DECISIONS,DOMAIN_RULES,PRODUCT_REQUIREMENTS,API_CONTRACTS,DATABASE_SCHEMA}.md`, amaldagi migratsiyalar, `backend/src/services/exam.service.ts`, `src/features/exam/*`.

## 1. Vazifa va chegaralar

Mustaqil `/custom-test` bo‘limida foydalanuvchi quyidagilarni tanlaydi:

1. **Kontent daraxti:** fan yo‘nalishi → bo‘lim (M01–M16) → topic (lesson) → micro-topic / construct. Bir nechta bo‘limni bir testga qo‘shish.
2. **Savollar soni:** 1–100 (admin tomonidan sozlanadigan limit; boshlang‘ich default 20). Har bir tanlangan topic uchun aniq kvota va ixtiyoriy A–E daraja kvotasi.
3. **Daraja:** A–E UI yorliqlari, DBdagi `questions.difficulty=1..5` qiymatlariga mos. **Eslatma:** mavjud bank bo‘yicha ushbu mapping va qamrov alohida tekshirilmaguncha uni sifat tasdig‘i deb atamaslik kerak.
4. **Savol formati:** Y1, Y2, Y3 (faqat bazada mavjud va nashr qilingan tur).
5. **Savol bilan tanishganlik:** barcha, oldin ko‘rilmagan, oldin xato yechilgan; xato qayta ishlashda aynan o‘sha reviziyani takrorlash va yangi kontekstda retest farqlanadi.
6. **Rejim:** `learning`, `exam`, `diagnostic`, `mistakes`; server-authoritative vaqt (yoki vaqt chegarasisiz); noto‘g‘ri javob izohi learningda xavfsiz usulda ko‘rsatiladi.
7. **Taqsimot:** tanlangan topic bo‘yicha qo‘lda belgilangan kvotalar yoki server hisoblab bergan teng/adaptiv taklif. UI avtomatik yaratgan kvotalarni foydalanuvchi ko‘ra oladi.
8. **Test shabloni:** eng ko‘p ishlatiladigan konfiguratsiyani saqlash, yangilash, nomlash, qayta ishga tushirish.

### Ajratilishi shart bo‘lgan rejimlar

- **Shaxsiy test:** erkin konfiguratsiya, belgilangan topic/difficulty/format.
- **Rasmiy mock:** 50 savol, 120 daqiqa, amaldagi rasmiy blueprint; **shaxsiy konstruktor bu generatorning qoidalarini o‘zgartirmaydi**.
- **Mavzu testi / bo‘lim mock:** allaqachon ishlab turgan generatorlarning objective/critical qamrovi saqlanadi.
- Shaxsiy natija **rasmiy imtihonning taxminiy balli emas**; o‘zining mustaqil tarixi va analitikasi bor.

## 2. Mavjud kodga integratsiya

- Frontend: `src/pages/CustomTestPage.tsx` → `src/features/custom-test/*`; `src/App.tsx` protected route; `src/components/layout/Sidebar.tsx` menyu; mobil nav ham tekshiriladi.
- Backend: `backend/src/schemas/custom-exam.ts` (Zod), `backend/src/services/custom-exam.service.ts` (domain va authenticatsiya), `backend/src/routes/custom-exam.ts` (HTTP). `backend/src/app.ts`ga register.
- Database: **yangi timestamped** migratsiya `exam_kind='custom'`; `custom_exam_presets`, `custom_exam_configs`, versiya snapshotlari va `generate_custom_exam` RPC. `exams`, `exam_items`, `submit_answer`, `finish_exam`, `get_review`ni qayta foydalanish.
- API client: `src/features/custom-test/customTestGateway.ts`; `src/features/exam/contracts.ts` va `ExamRunner.tsx` mavjud eksam `kind` enumini qabul qilishi uchun moslashtirish.
- O‘qitish topic ID asosiy kaliti `lessons.id`, savolning topic egasi `questions.source_lesson_id`, learning objectives `lesson_constructs`/ `constructs`. Boshqa bo‘limdagi `construct`ni faqat mavzu bilan bog‘liqligi va nashr holati tasdiqlanganda tanlash.
- `M14` — kasb standartlari, `M15` — pedagogik mahorat, `M16` — informatika metodikasi. Rasmiy qism tarkibini admin UI deklaratsiyasi emas, amaldagi `modules` metadata bilan o‘qish.
- Hozirgi DBda `exam_kind` enum mavjud; `custom` qiymati migratsiyasiz clientdan yuborilmasin.

## 3. Contract (bosqichma-bosqich)

### So‘rov modeli v1

```json
{
  "total_count": 12,
  "topics": [
    {"lesson_id": "UUID", "count": 7, "difficulty_counts": [{"difficulty": 2, "count": 3}, {"difficulty": 4, "count": 4}]},
    {"lesson_id": "UUID", "count": 5, "difficulty_counts": [{"difficulty": 3, "count": 5}]}
  ],
  "formats": ["Y1", "Y2", "Y3"],
  "exposure": "all",
  "mode": "exam",
  "duration_sec": 1800
}
```

**Invariants:** `sum(topics.count)=total_count`, `sum(difficulty_counts.count)=topic.count`; mavzu va daraja takrorlanmaydi; `total_count` 1–100; 1–30 distinct lesson; savollar qaytarilmaydi; boshqa foydalanuvchi presetini o‘qish mumkin emas; server har safar limitni qayta tekshiradi. Foizli aralash rejim uchun butun son kvotalari deterministic largest-remainder asosida hisoblanib foydalanuvchiga ko‘rsatiladi.

### HTTP

- `GET /api/custom-tests/catalog` — published module / published lesson / subtopic daraxti, foydalanuvchi uchun xavfsiz metadata.
- `POST /api/custom-tests/preflight` — sozlamaga mos published + keyli + valid + source-traced savollar soni; qaysi topic/darajada nechta yetishmasligi; **hech qanday javob kaliti yo‘q**.
- `POST /api/custom-tests/start` — faqat preflight mos bo‘lsa **bir transaction**da `exam` + `exam_items` + frozen config va question revision snapshot; javoblarni oshkor etmaydigan odatdagi `ExamSession` contract.
- `GET|POST|PATCH|DELETE /api/custom-tests/presets` — auth bilan o‘z shablonlarini boshqarish (max 30, hajm limitli).
- Mavjud `/api/exam/submit`, `/api/exam/finish`, `/api/exam/:id/review` va history qayta ishlatiladi.

### Preflight semantics

Birinchi navbatda **fail-closed**; yetishmasa 409 + `CUSTOM_POOL_INSUFFICIENT` va masalan: `{requested:40,available:28,gaps:[{lesson_id,difficulty,requested,available}]}`. Hech qachon yashirin savol qo‘shish, kvotani siljitish yoki nashr qilinmagan savolni ko‘rsatish yo‘q. Natija umumiy poolni hisoblagani uchun start paytida **qayta** tekshiriladi; paralel foydalanuvchilar aralashmaydi.

### Savol tanlash va adolat

1. Auth va Zod input validation.
2. Faqat `published` questions, published lesson, active construct, valid answer key, taxonomiya va source revision muvofiqligini tekshirish.
3. Har (topic, difficulty) cell uchun **foydalanuvchi kiritgan son** yig‘iladi; `formats` filteriga rioya qilinadi.
4. Yagona testda `question_id` takrorlanmaydi; yangi savollarga yumshoq prioritet, keyin exposure va turg‘un seed asosida shuffle.
5. `unseen` / `incorrect` filtrlariga noto‘g‘ri moslik bo‘lsa fail-closed.
6. Transaction ichida qisman `exams` yozuvi yaratilmaydi. `expires_at` server tomonidan o‘rnatiladi; `duration_sec=null` bo‘lsa bir o‘tirish safety TTL muhokama qilinadi.
7. Natija payloadida kalit yo‘q; learning feedback faqat tegishli submitted itemdan keyin.
8. Har bir sessionda frozen config, selector_version, seed, savollar ID/revisionlari saqlanadi; audit va reproducibility uchun.

## 4. Natijalar va foydalanuvchi tajribasi

- Qo‘shimcha natija: section/topic/difficulty/format kesimi, vaqt, xato/bo‘sh savollar, o‘rganiladigan keyingi dars havolasi.
- Test natijasi va tarix haqiqiy son bilan; 15 ta savol ishlaganda 30 ta savol deb ko‘rsatmaslik (30 ball alohida).
- Katta ekran / mobilda `scroll`, `Ortga`, `Bosh sahifa`, `Yangi test`, progress 1/N, review flag, resume va aniq yakunlash confirmation.
- To‘g‘ri javob har bir rejim uchun javob oshkor etish siyosati bilan mos; exam/diagnostikada tugashgacha sir.
- Admin nazorati: filter/difficulty metadata qamrovi, yetishmayotgan pool, xatolar, kelishmagan `construct` binding, preset/usage summary; boshqa learnerning shaxsiy xulosalari admin ruxsat nazorati bilan.
- Mastery first independent attempt / guided / corrected retry alohida; bitta qayta ko‘rilgan savolni yangi bilim isboti deb hisoblamaslik.

## 5. Ish bosqichlari va acceptance

| Bosqich | Status | Deliverable va tugallanish sharti |
|---|---|---|
| A. Projekt + validatsiya | **DONE (branch)** | Mazkur RFC, Zod contract, deterministic quota/domain validation va unit testlar |
| B. Preflight + DB | **DONE (branch, CI verified)** | Timestamped migration, RLS, safe catalog, exact pool queries, SQL/RPC atomic start, role tests |
| C. UI + full flow | **MVP DONE (branch, E2E verified)** | `/custom-test` page, per-topic counts, A–E + Y1–Y3, checkable preflight, actual start, mobile UX, resume |
| D. Natijalar va preset | **PARTIAL** | Breakdown, saved presets, history, error-review integration |
| E. QA va release | **CI GREEN; deployment BLOCKED** | Fresh DB migration, pgTAP, backend/frontend tests, Playwright E2E, lint/typecheck/build, branch check + PR review |

**Test matrix:**
- happy: 2 bo‘lim, 3 mavzu, 3 daraja, aniq savollar;
- boundary: 1 va 100; 0/101 va duplicate topic reject;
- availability: `requested > available` 409; no partial write;
- isolation: other user preset / attempt 403 or 404 under RLS;
- security: learner API question key / unpublished data leak = 0;
- deterministic distribution & no repeated revision within session;
- same start retry idempotent (request key) / concurrent starts;
- real time expiration; finish/review authorization; 15 savol / 30 ball display regression;
- tests offline, resume, keyboard and mobile scroll;
- original mock 50/120, section mock and topic exam unaffected.

## 6. Qarorlar / ochiq risklar

1. `questions.difficulty` DBdagi 1–5 ni mavjud kontent sifatida A–E bilan mosligini audit qilish kerak (strict mapping qabul qilinsa ham bank to‘liqligini anglatmaydi).
2. Daraja+format+topic ko‘p filtrlansa pool kam bo‘lishi mumkin; foydalanuvchiga boshqariladigan yumshatish taklif etiladi, ammo avtomatik shart o‘zgartirilmaydi.
3. Published question revision immutable va `question_keys` faqat serverda; shaxsiy generator reviewer gate’ni aylanib o‘tmaydi.
4. Rasmiy baholashning `35 + 5 + (7 + 3)` arxitektura guruhlari saqlanadi; yangi universal test ularga blueprint majburiy kvotalarini tatbiq etmaydi.
5. `main`/production merge yoki deploy **alohida ruxsatsiz amalga oshirilmaydi**. Vercel deployment / DB migration talabi keyingi release qadamida.

## 7. Definition of done

Barcha A–E bosqichlarda kod, migratsiya, E2E test va dokumentatsiya tekshirilib, yangi test foydalanuvchida haqiqatan ishlamaguncha TASK-210 `DONE` emas. Pull request `draft` qoladi va production o‘zgarmaydi.

## 2026-10-18 handoff: amalga oshirilgan qismlar

- `src/pages/CustomTestPage.tsx`: multi-module lesson + 5-level quotas, format, exposure, mode, time, exact preflight and race-safe preview gating.
- `/api/custom-tests/catalog`, `preflight`, `start` server token bilan; Fastify/Zod boundary.
- PostgreSQL `custom_exam_preflight` + `generate_custom_exam`: question answer key payload yuborilmaydi; `submit_answer` custom exam mode’ida completion oldidan feedback chiqarmaydi.
- Shared `ExamRunner`, history/results enum, sidebar/mobile navigation va frontend type contract.
- CI SQL test `supabase/tests/custom_exam.test.sql`, backend `custom-exam-planner.test.ts` va `routes/__tests__/custom-exam.test.ts`, Playwright `custom-test.spec.ts`.
- **Cheklov:** hozirgi learning rejimi immediate hint emas, faqat yakuniy feedback. Preset CRUD, microtopic/construct filter, resume, analytics, remote migration va production smoke keyingi tasklarga qolgan. Branch main/prodga merge qilinmagan.
