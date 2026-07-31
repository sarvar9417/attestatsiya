# PROJECT_STATE.md — joriy holat

> Living document. Har coder task boshlaganda va tugatganda yangilaydi.

## Holat

- Loyiha bosqichi: `DEVELOPMENT`
- Joriy milestone: `P0 — xavfsizlik va barqarorlashtirish`
- Oxirgi yangilanish: `2026-07-31`
- Production mavjud: `ha`
- Database project mavjud: `ha (plyqezulrfowyblsfpzy, Singapore)`
- Deployment mavjud: `ha (frontend: attestatsiya-five.vercel.app; backend: attestatsiya-backend.vercel.app)`

## Tasdiqlangan asos

- **Stack:** React + Vite, TypeScript strict, Tailwind CSS, Zustand
- **Database:** Supabase (PostgreSQL), UUID PK, enum turlari, RLS
- **Autentifikatsiya:** email/parol ishlaydi; barcha auth amallari
  frontend → Fastify backend → Supabase orqali (browser supabase-js
  auth ishlatmaydi); anonymous upgrade hali implement qilinmagan
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
| T-016 | AI sessiya | DONE | 2026-07-31 | task/T-016-auth-frontend |
| T-017 | AI sessiya | DONE | 2026-07-31 | task/TASK-017-m01-content-db |
| T-018 | AI sessiya | DONE | 2026-07-31 | task/TASK-018-vercel-env-fix |
| T-019 | AI sessiya | DONE | 2026-07-31 | task/TASK-020-qora-ekran-tuzatishlar |
| T-021 | AI sessiya | DONE | 2026-07-31 | task/TASK-021-backend-git-deploy |
| T-022 | AI sessiya | DONE | 2026-07-31 | task/TASK-022-backend-own-repo |
| T-012 | — | READY | — | task/T-012-generators |

## Auth va learner trafigi backend'ga ko'chirildi (2026-07-31)

- **To'liq backend auth:** register/login/logout/refresh/parol tiklash/
  tasdiqlash xati/profile tahrirlash — `backend/src/routes/auth.ts` +
  `auth.service.ts` (Supabase Auth admin API, service-role, server tomonda).
  Browser supabase-js auth ishlatmaydi.
- **Session:** `src/features/auth/sessionStore.ts` — localStorage
  (`attestatsiya.session.v1`), `storage` event orqali tab'lararo sinxron.
- **Avtomatik refresh:** `src/lib/apiClient.ts` — 401 bo'lganda mutex bilan
  `POST /api/auth/refresh`, muvaffaqiyatli bo'lsa qayta urinish; login/refresh
  endpointlarida refresh chaqirilmaydi; refresh ishlamasa `SESSION_EXPIRED`.
- **useAuth rewrite:** supabase'siz; recovery link `/reset-password#access_token=`
  tokenini taniydi va parol yangilangach hash'ni tozalaydi.
- **AdminGuard:** real rol tekshiruvi (admin/editor ruxsat; boshqalar
  "Ruxsat yo'q" sahifasi). `Profile.tsx` — ism/familiya tahrirlash formasi.
- **Learner single-gateway:** `supabaseExamGateway` va `createFallbackGateway`
  olib tashlandi; ExamRunner faqat `backendGateway` ishlatadi; progressGateway
  fallbacksiz; `resolveIds.ts` o'chirildi (backend code→UUID resolve qiladi).
- **Route'lar:** `/auth`, `/reset-password`, `/profile` App.tsx'ga qo'shildi
  (avval mavjud sahifalar route'siz edi).
- **Testlar:** +20 backend auth test (jami 78), +40 frontend (sessionStore,
  authClient, useAuth, AdminGuard rol, apiClient refresh, progress fallback
  olib tashlangan) — jami 185 frontend test yashil; lint yashil; typecheck'da
  faqat 66 ta pre-existing admin legacy xato (T-006).
- **Blocker (o'zgarmagan):** `npm run build` legacy admin TS xatolari sabab
  yiqiladi (T-006; auth taskdan tashqari).

## Frontend ↔ Backend API integratsiyasi (2026-07-31)

- **Tuzatildi:** `ExamRunner` fallback bug'i — backend tushganda `ApiError`
  (NETWORK_ERROR) tanimaganligi sababli Supabase RPC fallback hech qachon
  ishga tushmasdi. Endi `createFallbackGateway`/`isNetworkError`
  `src/features/exam/examGateway.ts` da, `ApiError` uchun ishlaydi.
- **Barcha backend endpointlar uchun frontend client:** `getReview` va
  `getDueReviews` `ExamGateway` kontraktiga qo'shildi (backendGateway HTTP);
  progress single-gateway `src/features/progress/` da; content API client
  `src/features/content/contentApi.ts` da.
- **progressSync.ts** backend orqali (`/api/progress/sync`,
  `/api/progress/modules`, `/api/exam/due-reviews`) ishlaydi; RPC fallback
  2026-07-31 da olib tashlandi.
- **Integration testlar:** barcha backend endpointlar frontend client orqali
  real payload shakllari bilan tekshiriladi
  (`src/tests/apiIntegration.test.ts` va b.).
- **Env hujjati:** `.env.example` ga `VITE_API_BASE_URL`; README'ga backend
  ishga tushirish va fallback izohi qo'shildi.
- Lint yashil; typecheck'da 0 ta yangi xato; 185 frontend + 78 backend test o'tadi.
- **Blocker:** `npm run build` hali admin legacy sahifalaridagi 66 ta
  pre-existing TS xatosi sabab yiqiladi (T-006 ga bog'liq; bu taskdan tashqari).

## Gibrid katalog — contentTree UUID schema moslashuvi (T-010, 2026-07-31)

- **Gibrid katalog:** statik `contentTree.ts` UI tuzilma manbai bo'lib qoladi;
  backend published modullari (UUID schema) meta-ma'lumotni qoplaydi.
  DB to'lguncha UI buzilmaydi, to'lgach rasmiy ma'lumot ko'rsatiladi.
- **`src/features/content/catalog.ts`:** `mergeCatalog(staticModules, apiModules)`
  — sof funksiya. Qoidalar: modullar statik tartibda, `code` bo'yicha bog'lanadi;
  DB topilsa title/description/section/examQuestionCount/uuid/lessonCount
  qoplanadi; DB `summary_uz` null bo'lsa statik description; DB'da bor, statikda
  yo'q modul qo'shilmaydi (subtopik tuzilmasi yo'q).
- **`src/hooks/useCatalog.ts`:** darhol statik katalog bilan render, keyin
  `GET /api/content/modules` javobi kelgach qoplash; API xatosida statik
  saqlanadi (`online=false`).
- **Consumer'lar:** LearningPage, ModulePage, TopicExamPage, DashboardPage
  `MODULES` o'rniga `useCatalog()` ishlatadi; LearningPage header'i endi
  dinamik "N modul · M mavzu". Route'siz legacy `TopicLessonPage` o'zgarmadi.
- **Backend contract kengayishi:** `GET /api/content/modules` va
  `/modules/:id` endi `exam_question_count` qaytaradi
  (`backend/src/schemas/content.ts`, `content.service.ts`, frontend
  `moduleSummarySchema`/`moduleDetailSchema` — strict schema, DB rasmiy manba).
- **Testlar:** +8 `catalog.test.ts` (merge qoidalari: DB overlay, null fallback,
  DB-only modul tashlanadi, tartib saqlanadi), +3 `useCatalog.test.tsx`
  (statik seed, DB overlay, API xatosi), +4 backend `content.test.ts` route
  testlari (exam_question_count/lesson_count, section filter, lesson_count=0,
  bo'sh natija). Jami 196 frontend + 82 backend test yashil; lint yashil;
  typecheck'da 0 yangi xato.
- **Blocker (o'zgarmagan):** `npm run build` legacy admin TS xatolari sabab
  yiqiladi (T-006).

## Learning moduli — mavzu o'qish va server testi (T-011, 2026-07-31)

- **Xavfsiz mavzu testi:** `/exam/topic/:moduleId/:subtopicId` (eski static
  mock imtihon — javob kaliti brauzerga tushardi, timer client'da) o'chirildi;
  `TopicExamPage.tsx` olib tashlandi. Mavzu testi endi ExamRunner orqali:
  `navigate('/exam/mavzu/M01?lessonId=M01.01')` — savollar serverda tanlanadi,
  javoblar serverda baholanadi (`generate_topic_test` RPC, code→UUID resolve).
- **ExamRunner kengayishi:** `backUrl` prop'i — yakuniy natija ekranida
  "Modulga qaytish" havolasi; `onFinished(result)` prop'i — sinov yakunida
  chaqiriladi.
- **Progress integratsiyasi (ExamPage):** mavzu sinovi yakunida
  `completeTopic(moduleId, lessonId, correct, total)` + `syncTopicProgress`
  (serverga `mark_lesson_read`). Savol soni `breakdown` (togri/jami) dan,
  bo'lmasa 2 ball/savol (blueprint points_per_item) dan chiqariladi.
- **Kontent oqimi o'zgarmadi:** TopicView nazariya o'qish (BookReader/scroll),
  "Bilimni tekshirish" → server testi; mavzu savollari bazada bo'lmasa backend
  NO_QUESTIONS → intro ekranida tushunarli xato xabari.
- **Testlar:** +2 `ExamPage.test.tsx` (mavzu: `startTopicExam('M01.01')`
  chaqiruvi, yakunda progressStore'da M01.01 3/3/100 yozilishi, "Modulga
  qaytish" → `/learn/M01`; lessonId yo'q bo'lsa boshlanmaslik). Jami 198
  frontend test yashil; lint yashil; typecheck'da 0 yangi xato.
- **Blocker (o'zgarmagan):** `npm run build` legacy admin TS xatolari sabab
  yiqiladi (T-006). Mavzu testlari uchun savol bazasi hali to'lmagan
  (T-012 generatorlar buni to'ldiradi).

## User auth frontend mustahkamlash (T-016, 2026-07-31)

- **Auth sahifasi (`src/pages/Auth.tsx`):** client validatsiya (email format,
  parol ≥6, signup'da parolni tasdiqlash maydoni, ism ≥2), show/hide parol
  toggle (Eye/EyeOff), `autocomplete` atributlari (username/current-password/
  new-password/name), login/signup'da `noValidate` + field-level xatolar.
  `EMAIL_NOT_CONFIRMED` (ApiError code) → maxsus "Email tasdiqlash" ekrani
  (resend 60s cooldown bilan, kirishga qaytish). Login muvaffaqiyatida
  `returnTo` yoki `/` ga redirect; login qilgan foydalanuvchi `/auth` ga
  kira olmaydi (`<Navigate replace>`). `?expired=1` → "Session muddati tugadi"
  banner (URL tozalanadi, banner qoladi).
- **Profil sahifasi (`src/pages/Profile.tsx`):** ism/familiya formasi (mavjud)
  + email va rol badge; yangi "Parolni o'zgartirish" bo'limi (yangi parol +
  tasdiqlash, show/hide, autocomplete="new-password", `updatePassword` orqali;
  maydonlar tozalanishi). Saqlash tasdiqlari 3 soniyada avto-yashirinadi.
  Chiqish `signOut()` + `navigate('/', { replace: true })` — hard reload
  olib tashlandi.
- **Route himoyasi:** yangi `src/components/auth/ProtectedRoute.tsx` — `/profile`
  login talab qiladi; session yo'q bo'lsa `/auth?returnTo=<manzil>` ga
  `replace` yo'naltirish, login'dan keyin foydalanuvchi qaytariladi.
- **Session expiry:** `sessionStore`'da `SESSION_EXPIRED_EVENT`; apiClient
  refresh muvaffaqiyatsiz bo'lganda hodisani yuboradi; yangi
  `SessionExpiredHandler` (App darajasida) foydalanuvchini `/auth?expired=1`
  ga yo'naltiradi (auth/reset-password sahifalaridan tashqari).
- **useAuth:** `toError` endi `ApiError`ni o'zgartirmasdan uzatadi (code
  saqlanadi); `signOut` navigatsiyani chaqiruvchiga qoldiradi (toza SPA
  o'tish, `window.location.assign` olib tashlandi).
- **Testlar:** +24 frontend — `AuthPage.test.tsx` (10: login redirect,
  returnTo, EMAIL_NOT_CONFIRMED + resend + qaytish, email validatsiyasi,
  parol mos kelmasligi, signup success, qisqa parol, expired banner,
  login bo'lgan foydalanuvchini qaytarish, reset modal), `Profile.test.tsx`
  (7: email/rol, ism update, qisqa ism, parol update + maydon tozalanishi,
  mos kelmaslik, qisqa parol, chiqish), `ProtectedRoute.test.tsx` (3),
  `sessionExpired.test.ts` (3: event + SESSION_EXPIRED, login endpointida
  hodisa yo'q, sessionsiz 401). useAuth'da signOut/location testlari
  yangilandi + ApiError code testi. Jami 233 frontend test.
- **Test holati:** 232/233 o'tadi; yagona muvaffaqiyatsiz `BookReader`
  diagramma testi pre-existing flaky (git stash bilan toza tree'da ham
  yiqilishi isbotlandi, yakka holda o'tadi) — T-016'ga aloqasi yo'q.
  Lint yashil; typecheck'da 0 yangi xato (66 pre-existing admin legacy,
  T-006).
- **Eslatma:** backend `update-password` joriy parolni tekshirmaydi (session
  o'zi isbot) va `me` javobida `email_confirmed` yo'q — shuning uchun parol
  bo'limida faqat yangi parol + tasdiqlash, email tasdiqlash badge'isi
  backend kengaytirilgach qo'shiladi.

### T-016 audit tuzatishlari (2026-07-31, 2-bosqich)

- **apiClient refresh semantikasi aniqlandi:** `RefreshOutcome = 'ok' | 'invalid' | 'network'`.
  Tarmoq uzilishi (fetch reject / NETWORK_ERROR) sessionni **saqlaydi** —
  foydalanuvchi vaqtincha uzilishda tizimdan chiqarib tashlanmaydi; faqat
  refresh token rad etilganda session tozalanadi va `SESSION_EXPIRED` hodisasi
  yuboriladi. useAuth `refreshIfNeeded` ham xuddi shunday (isNetworkError).
- **Auth.tsx:** `sanitizeReturnTo()` — faqat ichki yo'llarga ruxsat (open
  redirect yopildi: `//` bilan boshlanadigan tashqi URL reject qilinadi);
  resend interval `resendIntervalRef`'da saqlanadi va unmount'da tozalanadi;
  reset modal emaili EMAIL_RE bilan tekshiriladi.
- **ResetPassword.tsx qayta yozildi:** parolni tasdiqlash maydoni, show/hide
  parol, ≥6 + moslik validatsiyasi, recovery token bo'lmasa va session bo'lmasa
  "Parolni tiklash" info ekrani (/auth havolasi bilan), muvaffaqiyatda 3s dan
  keyin `/` ga auto-navigatsiya, loading holati.
- **E2E (`src/tests/e2e/app.spec.ts`) yangilandi:** auth `/auth` da ekani uchun
  barcha 4 eski test o'lik edi; o'rniga 6 yangi backend-independent test
  (login forma, signup tab, client validatsiya, reset modal validatsiyasi,
  protected route `/profile` → `/auth?returnTo=%2Fprofile`, `?expired=1` banner).
  Natija: 6/6 o'tadi.
- **sessionExpired.test.ts:** +1 test — refresh tarmoq xatosida session
  saqlanadi va `SESSION_EXPIRED` yuborilmaydi (NETWORK_ERROR, statusCode 0).
- **Muhit:** `localhost:3001` ni band qilgan stray vite dev-server tozalandi
  (backendga kirishni to'sardi); backend health = `degraded` —
  **Supabase service key "Invalid API key"** (backend/.env dagi key loyihaga
  mos kelmaydi) — live login/register e2e shu sababdan bloklangan.
  Frontend muammosiz render bo'ladi, barcha frontend testlar o'tadi.
- **Topilma (T-016 emas):** repo `index.html` EnglishPath brendi bilan
  commitlangan (HEAD'da ham shunday) — loyiha shellining qolib ketgan nusxasi,
  src/ va app esa attestatsiya. Alohida task sifatida almashtirilishi kerak.

### Live backend tekshiruvi va tuzatish (2026-07-31, 3-bosqich)

- **Supabase credential tuzatildi:** backend/.env'ga to'g'ri project
  (`plyqezulrfowyblsfpzy`) secret key yozildi (yangi `sb_secret_` formati;
  eski JWT va `sbp_` kalitlar "Invalid API key" berardi). Health: `healthy`.
- **TOPILGAN BUG — shared supabase client ifloslanishi:** `login`
  (`signInWithPassword`) va `refresh` (`refreshSession`) umumiy service-role
  client'ida bajarilar edi. Ular client'ning session holatini o'zgartirib,
  keyingi REST so'rovlarini user-scope qilib yuborardi (service-role o'rniga)
  → live DB'da RLS update'ni blokladi → **profile update 0 satrga ta'sir
  qilmasdan "muvaffaqiyatli" qaytardi** (ism hech qachon o'zgarmasdi).
  Debug: `profData: []` — xato yo'q, lekin yozuv yo'q.
- **Tuzatish:** `createServiceClient()` (`backend/src/lib/supabase.ts`) —
  har user-auth operatsiyasi (login/refresh/reset-password) uchun yangi
  client. Umumiy client faqat admin/DB ishlarida qoladi.
  Backend testlar: 90/90 o'tadi. Live curl zanjiri endi to'liq ishlaydi:
  register (display_name yoziladi) → confirm → login → me → **update
  ("Updated Name" DB'ga yozildi)** → refresh (200) → logout.
- **Live RLS tekshiruvi:** user-scope UPDATE live DB'da 0 satr qaytaradi
  (SELECT ishlaydi) — migratsiyadagi `profiles_self_update` bilan farq bor;
  backend service-role ishlatgani uchun frontend uchun muammo emas, lekin
  live DB va migratsiya mosligi alohida task sifatida tekshirilishi kerak.
- **Logout qayd:** logout refresh tokenni revoke qiladi (global), lekin
  access token 1 soatgacha yaroqli (JWT tabiati) — /me logout'dan keyin ham
  200 qaytaradi. Frontend session'ni lokal tozalaydi; kritik emas.
- **Eslatma:** `localhost:3001`'dagi stray vite dev-server tozalandi —
  backendga kirishni to'sardi (HTML qaytarardi).
- **Repo tuzatish:** stash incidentida yo'qolgan 29 hujjat HEAD'dan
  qaytarildi (DATABASE_SCHEMA.md, informatika-attestatsiya-platform-spec/*,
  roadmap.md va b.). Ataylab o'chirilgan 2 fayl qoldi (resolveIds.ts,
  TopicExamPage.tsx — PROJECT_STATE'da qayd qilingan).

### Session yuklash bug'i va tuzatish (2026-07-31, 4-bosqich)

- **Foydalanuvchi xabari:** /profile ochilganda `/auth?returnTo=%2Fprofile` ga
  qaytarilib, login forma chiqardi — login qilingan bo'lsa ham.
- **Sabab (sessionStore.loadInitial):** localStorage'dagi muddati o'tgan
  session yuklanishda tashlab yuborilar edi. Shu sababli refresh_token
  yo'qolib, `refreshIfNeeded` silent-refresh'ni umuman bosa olmas edi →
  har bir reload'da login talab qilinardi.
- **Tuzatish:** `loadInitial` endi muddati o'tgan session'ni SAQLAYDI;
  refresh useAuth mount'ida refresh_token bilan bajariladi (silent re-login).
- **Qo'shimcha (useAuth):** tab'lararo refresh race — boshqa tab yangi
  session yozgan bo'lsa, eski token rad etilishi yangi session'ni buzmasi
  uchun `latest.refresh_token === current.refresh_token` sharti qo'shildi.
- **Testlar:** sessionStore loadInitial testi qayta yozildi (expired
  session saqlanadi), useAuth'ga race-guard testi qo'shildi.
- **Live e2e (`src/tests/e2e/live-auth.spec.ts`):** real backend bilan —
  UI login → /profile ochiladi; localStorage'da expires_at o'tkazib
  reload qilinsa, auto-refresh ishlaydi va profil ochiladi (login
  sahifasiga tushmaydi). 7/7 e2e o'tadi.

### Login'siz "kirilgandek" ko'rinish — demo rejim ildiz sababi (2026-07-31, 5-bosqich)

- **Foydalanuvchi xabari:** /profile → /auth qaytarganda "app ishlayapti,
  login qilingan bo'lsa ham login so'rayapti" — jiddiy xato deb hisoblandi.
- **Ildiz sabab:** `DEMO_MODE=true` (faqat lokal .env) — token bo'lmasa
  backend exam/progress/auth-me'da avtomatik demo token berardi; content
  route'lari esa ochiq edi (dizayn bo'yicha). App login'siz to'liq ishlab,
  "kirilgandek" tuyulardi, lekin /profile real session talab qilardi.
- **1-tuzatish (UX):** Sidebar va mobil header'ga `Demo rejim` belgisi,
  /auth'ga returnTo bilan kelganda tushuntirish banneri.
- **2-tuzatish (to'liq qulflash):**
  - `App.tsx` — `/`, `/learn`, `/learn/:moduleId`, `/exam*` route'lari
    ProtectedRoute bilan himoyalandi (ilgari faqat /profile).
  - `backend/.env` — `DEMO_MODE=false` (production default bilan moslashadi).
  - Demo rejim belgilari olib tashlandi (endi login'siz faqat /auth va
    /exam-demo ochiq).
- **Natija:** chiqish bosilganda session tozalanadi → barcha sahifalar
  `/auth?returnTo=` ga yo'naltiriladi; exam/progress API login'siz 401.
- **Testlar:** live-auth'ga yangi regressiya testi — login → /learn ochiq →
  Chiqish → /auth; /learn va / ga qaytilsa yana /auth; localStorage toza.
- **Baseline:** frontend vitest 239/239, e2e 8/8, backend 99/99, lint/tsc toza.

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

## M01 kontenti DB → backend → frontend oqimi (T-017, 2026-07-31)

- **Migratsiyalar:** `000012_m01_content_seed.sql` (12 dars + 783 blok +
  400 savol + 1600 option + 400 key, idempotent, remote'ga push qilingan),
  `000013_fix_question_keys_rls.sql` (000011 broken policy forward-fix),
  `000014_source_lesson_links.sql` (schema: `questions.source_lesson_id`),
  `000015_m01_source_lesson_backfill.sql` (400 slug-based UPDATE).
- **Backend:** `GET /api/content/lessons/:id/questions` (published savollar,
  kalitsiz), `POST /api/content/questions/check` (server-authoritative,
  `question_keys` faqat service-role bilan o'qiladi). `LessonResponse` ga
  `blocks`/`blocks_kind` qo'shildi (getModule/getLesson).
- **Frontend:** `contentApi` yangi kontraktlar (zod strict), `lessonContentGateway`
  (backend-first, tarmoq/xato → statik fallback), `TopicView` test fazasi
  backend savollari bilan ishlaydi (correctIndex server natijasidan o'rnatiladi).
- **Testlar:** backend 90/90 (content.test.ts: questions + check endpointlar),
  frontend 232/233 (contentApi + lessonContentGateway). Faqat pre-existing
  `BookReader` diagramma timeout testi yiqiladi (clean tree'da ham).
- **Live tekshiruv:** M01.02 → 60 savol (Y1), key leak yo'q; check to'g'ri
  javob + izoh qaytardi.
- **Eslatma:** `backend/.env` dagi eski `SUPABASE_SERVICE_KEY` (sbp_...) noto'g'ri
  edi — CLI orqali olingan haqiqiy service_role key bilan almashtirildi
  (.env gitignore'da).

## Dars testi 20 random + shuffle va admin urinishlar (T-018, 2026-07-31)

- **Migratsiya:** `20260731000016_lesson_test_pool_20.sql` (remote'ga push
  qilingan). `exam_items.option_order uuid[]` — har urinish uchun
  aralashtirilgan variant tartibi (side guruhi ichida random);
  `generate_topic_test` — `source_lesson_id` bo'yicha random 20 ta savol,
  yetmay qolsa dars konstruktlari orqali to'ldirish, darsda <20 bo'lsa —
  borlari; `exam_payload` — `option_order` tartibini ko'rsatadi va item
  tartibini integer bo'yicha (eski text-sort xatosi tuzatildi); eski
  exam'lar (`option_order` null) natural tartibda ko'rsatiladi.
- **Migratsiya:** `20260731000017_topic_test_duration.sql` — mavzu testi
  umumiy vaqti: `duration_sec = savollar_soni × 120` (har savolga 2 daqiqa;
  20 savol → 40 daqiqa). Vaqt umumiy — bitta savolga alohida cheklov yo'q.
  Deadline server-authoritative: `submit_answer` `vaqt_tugadi` qaytaradi,
  frontend timer 0 ga yetganda `finish_exam` chaqiradi (ExamRunner line 221).
  <20 savol bo'lsa vaqt ham haqiqiy sonda hisoblanadi.
- **Backend:** `GET /api/admin/attempts` (kind/lesson_id/user_id/from/to
  filter + pagination; email, display_name, lesson_slug, answered_count),
  `GET /api/admin/attempts/:id` (har bir savol: matn, ko'rsatilgan variant
  tartibi, user javobi, `correct_option_id` + izoh — faqat admin). Role
  tekshiruvi: token → `profiles.role = 'admin'`, aks holda 403.
- **Frontend:** `src/features/admin/attemptsApi.ts` (zod strict kontraktlar),
  `src/pages/admin/AttemptsPage.tsx` (filter bar, jadval, pagination,
  detal paneli — to'g'ri/noto'g'ri javoblar rang bilan belgilanadi),
  AdminLayout NAV + `/admin/attempts` route. ExamRunner o'zgarishsiz —
  `duration_sec` avtomatik ishlaydi (timer + auto-finish mavjud edi).
  Mavzu testi intro ekranida "Vaqt cheklovi yo'q" o'rniga haqiqiy cheklov
  ko'rsatiladi: `ExamGateway.previewTopicTest` (backendGateway) dars
  pool'idan `min(savollar, 20) × 2 daqiqa` hisoblaydi — "20 ta savol ·
  40 daqiqa"; preview olib bo'lmasa "Umumiy vaqt: har bir savol uchun
  2 daqiqa" fallback. (3 ta yangi test: 60 savol → 20×40, <20 → haqiqiy
  son, xato → null.)
- **Testlar:** backend 99/99 (admin.test.ts: 9 ta — 401/403/404, list,
  kod→UUID resolve, 400, detal variant tartibi, eski exam natural tartib);
  frontend 238/239 (attemptsApi.test.ts: 5 ta). Lint 0 xato, tsc clean
  (yangi fayllar); faqat pre-existing BookReader timeout.
- **Live E2E:** ikkita urinish → har birida 20 ta distinct savol, takror
  urinishda ~5/20 overlap (random); umumiy savolda variant tartibi har
  urinishda farq qiladi (0/5 bir xil); submit/finish → DB'da `user_answer`,
  `is_correct`, `score`, `time_spent_sec`, `answered_at` saqlanadi;
  admin list/detail real ma'lumotlarni qaytardi (answered_count javob
  berilgan item'lar soni — `.not('answered_at', 'is', null)`).
  000017 push'idan so'ng: M01.02 exam start → 20 item, `duration_sec 2400`
  javobda ham, `exams` jadvalida ham (40 daqiqa).
- **Eslatma:** local docker mavjud emas — migratsiya remote'ga `supabase
  db push --linked --yes` orqali qo'llandi (sintaksis va xatti-harakat
  live tekshirildi). Backend `backend/.env` PORT=3001.

## Vercel deploy va routing tuzatish (TASK-018, 2026-07-31)

- **Deploy:** frontend `attestatsiya` → https://attestatsiya-five.vercel.app (login forma ishlaydi,
  qora ekran yo'q); backend `attestatsiya-backend` → https://attestatsiya-backend.vercel.app
  (`/api/health` → `healthy`, DB ulangan). Frontend env: `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL` (Production + Preview). Backend env:
  `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `AUTH_REDIRECT_URL` (Production).
- **Qora ekran sababi (yechildi):** `vercel.json`'dagi `@` secret reference nomlari kichik
  harfda, Vercel loyihasida katta harfda edi — nom mos kelmasligi sabab "Secret does not
  exist" xatosi. Env block olib tashlandi; Vercel env var'lar build'ga to'g'ridan-to'g'ri
  beriladi.
- **Backend routing bug (topildi va yechildi, PR #9):** Vercel CLI 58.4.4 (va remote
  builder) `api/[...all].ts` uchun `^/api/([^/]+)$` — faqat BIR segmentli — route
  generatsiya qiladi; ko'p segmentli `/api/auth/login` kabi yo'llar platforma 404
  qaytarardi. Bu fastify preset yoki `outputDirectory`'ga bog'liq emas (3 throwaway
  loyihada — fastify'li/fastify'siz, outputDirectory'li/li'siz — bir xil natija).
  Yechim: `backend/vercel.json`'ga
  `"rewrites": [{"source": "/api/:path*", "destination": "/api/[...all]"}]` qo'shildi.
  Rewrite asl URL'ni saqlaydi (`req.url = /api/auth/me?path=auth%2Fme`), Fastify
  pathname bo'yicha to'g'ri route qiladi.
- **Live tasdiqlash (to'liq oqim):** register → confirm (SDK `admin.updateUserById`,
  `email_confirmed_at` yoziladi) → login (`access_token`) → `/api/progress/modules` real
  data (M01, topic_count 12) → `/api/content/modules` 200 → exam start (mavzu M01.02:
  20 item, `duration_sec` 2400, Y1 format, 4 variant) → finish (`max_score` 40,
  `S1.INFO` breakdown). `/api/auth/me`, `/api/exam/due-reviews`, `/api/progress/modules`
  auth'siz 401 (TOKEN_REQUIRED) qaytaradi.
- **Brauzer e2e (Playwright):** `src/tests/e2e/live-auth.spec.ts` deployed backend'ga
  qarshi yashil (2/2): login → dashboard → profil; muddati o'tgan session reload'da
  auto-refresh; chiqish → barcha sahifalar `/auth`ga qaytaradi.
- **Eslatma (T-019, TASK-020'da yechildi):** `POST /api/auth/register` noto'g'ri body bilan
  400 o'rniga 500 qaytarar edi — asl sabab `setErrorHandler` route'lardan keyin
  chaqirilgani (route context'lari default handler'ni ushlab qolgan) + zod 3.25.x
  `errors` API'si; endi 400 `VALIDATION_ERROR` qaytadi (regressiya testlari bilan).
- **Xavfsizlik eslatmasi:** Vercel token, Supabase service key chatda yozilgan —
  hammasi ishlagach token va service key'ni rotate qilish tavsiya etiladi (repo toza,
  `check-secrets` o'tdi).

## To'q ko'k ekran va manifest xatosi tuzatish (TASK-020, 2026-07-31)

- **Foydalanuvchi xabari:** konsolda `Manifest: Line 1, column 1, Syntax error`, ekran
  to'q ko'k (hech narsa ko'rinmaydi). Chuqur tahlil frontend + backend + live serverlar
  bo'yicha o'tkazildi, 3 ta asosiy sabab topildi:
- **1) `public/` katalogi umuman yo'q edi** — `/manifest.json`, `/favicon.svg`,
  `/apple-touch-icon.png`, `/og-image.png` 404 bo'lgan; root `vercel.json` SPA rewrite
  (`/(.*) → /index.html`) tufayli `/manifest.json` index.html (HTML) qaytargach brauzer
  "Manifest: Line 1, column 1, Syntax error" bergan. Yechim: `public/` yaratildi —
  `manifest.json` (Attestatsiya), `favicon.svg`, `robots.txt`, `apple-touch-icon.png`,
  `og-image.png` (`scripts/gen_assets.mjs` — sof node:zlib PNG encoder, qo'shimcha
  dependency'siz, qayta generatsiya mumkin). Vercel real statik faylni rewrite'dan oldin
  beradi.
- **2) index.html'da EnglishPath brendi qolgan edi** (title/og EnglishPath, `lang="en"`,
  `theme-color #1a56db` ko'k, noto'g'ri supabase preconnect) — Attestatsiya brendiga
  almashtirildi: `lang="uz"`, to'g'ri supabase preconnect, `theme-color` #ffffff default
  (dark rejimda inline skript #030712 qo'yadi; theme.ts ham moslashtirildi).
- **3) apiClient'da fetch timeout yo'q edi** — backend javob bermasa loading abadiy
  qolib, to'q ekran ko'rinardi. Endi `fetchWithTimeout` (AbortController, 20s) barcha
  so'rovlarda (refresh ham); AbortError → aniq "Server javob bermadi" xabari.
- **T-019 asl ildiz sababi topildi (backend zod 500):** `setErrorHandler` route'lardan
  KEYIN chaqirilgani uchun Fastify route context'lar yaratilganda default handler'ni
  snapshot qilib olgan (fastify/lib/context.js — `errorHandler || server[kErrorHandler]`)
  → global handler hech qachon ishlamagan; qo'shimcha: zod 3.25.x (v4-core transitional)
  `error.errors` o'rniga `issues` ishlatadi. Yechim: (1) `setErrorHandler` route'lardan
  oldin ko'chirildi; (2) `errors.ts` ga `getZodIssues()` strukturaviy tekshiruv
  (`name === 'ZodError'` + `issues`/`errors` massivlari), sendError'da 400
  VALIDATION_ERROR branch; (3) handler ichi try/catch bilan himoyalandi.
- **Validatsiya:** frontend tsc + build yashil, 242 test; backend tsc + `tsconfig.api.json`
  yashil, 102 test (3 ta yangi regressiya — `backend/src/lib/__tests__/error-handler.test.ts`:
  register {} → 400, login noto'g'ri email → 400, logout tokensiz → 401 global handler
  orqali). Live `app.inject` tekshiruvida register {} endi 400 VALIDATION_ERROR
  (avval 500 Fastify default format).
- **Eslatma:** foydalanuvchi to'q ekranni eski bundle keshidan ham ko'rgan bo'lishi
  mumkin — yangi deploy yangi asset hash'lar bilan keladi; bitta hard refresh
  (Cmd+Shift+R) yetarli bo'ladi.

## Backend GitHub auto-deploy (TASK-021, 2026-07-31)

> ⚠️ Bu bo'lim tarixiy holatni tasvirlaydi — keyinroq TASK-022 da backend alohida
> `attestatsiya-backend` repoga ko'chirildi va Vercel qayta ulandi. Quyidagi
> monorepo ulanish (repo: attestatsiya, rootDirectory: backend) endi mavjud emas.

- **Backend loyihasi (attestatsiya-backend) Vercel GitHub integratsiyasiga ulandi:**
  `POST /v9/projects/prj_xDVzqUZyqVP33Eiy2OoMqoes6fgI/link` bilan
  `{"type":"github","repo":"attestatsiya","org":"sarvar9417"}` — endi har
  `main`'ga push'da avtomatik production deploy bo'ladi.
- **`rootDirectory: backend`** (PATCH /v9/projects/{id}) — build `backend/` katalogidan
  bajariladi, `backend/vercel.json` ishlatiladi (rewrites + buildCommand/outputDirectory).
- **`productionBranch: main`** — ulanishda avtomatik o'rnatildi.
- **Env var'lar (production):** SUPABASE_URL, SUPABASE_SERVICE_KEY, AUTH_REDIRECT_URL —
  avvalgi CLI deploy'lardagi kabi. Preview env var'lari hali yo'q — PR preview'lari
  env'siz ishga tushadi (kerak bo'lsa alohida qo'shilishi mumkin).
- **Eslatma:** bundan oldin backend faqat qo'lda `vercel deploy --prod --token` bilan
  deploy qilinardi (GitHub integratsiya ulanmagan edi); frontend (attestatsiya)
  allaqachon ulangan edi. Endi ikkala loyiha ham main push'da avtomatik deploy bo'ladi.

## Backend alohida repo'ga ko'chirildi (TASK-022, 2026-07-31)

- **Backend endi mustaqil GitHub repoda:** `sarvar9417/attestatsiya-backend` (public,
  to'liq ko'chirish — asosiy repodagi `backend/` katalogi o'chirildi). Asosiy repo
  `attestatsiya` faqat frontend (va supabase migrations, hujjatlar) uchun.
- **Yangi repo tarkibi:** `src/`, `api/[...all].ts`, `vercel.json`, tsconfig'lar,
  `vitest.config.ts`, `package-lock.json`, `.env.example` (faqat placeholder'lar),
  `README.md`, `.gitignore` (node_modules/.env/.vercel/dist/coverage/*.log),
  `.github/workflows/ci.yml` (npm ci + check:secrets + tsc + tsc:api + vitest run,
  placeholder env bilan — testlar .env'siz ishlaydi), `scripts/check-secrets.mjs`
  (`sb_secret_` va JWT pattern'lar).
- **Vercel qayta ulandi:** attestatsiya-backend loyihasi endi yangi repoga bog'langan
  (`POST /link` → `{type: github, repo: attestatsiya-backend, org: sarvar9417}`);
  eski monorepo bog'lanishi o'chirildi; `rootDirectory` bekor qilindi (repo o'zi
  backend ildizi); `productionBranch: main`.
- **Auto-deploy tasdiqlandi:** yangi repoga push (`e82a477`) → Vercel production
  deploy avtomatik (sha: e82a4773, ref: main, target: production, READY). Jonli:
  `/api/health` healthy (DB env'lar ishlayapti), `register {}` → 400 VALIDATION_ERROR.
- **Env var'lar (Vercel, production):** SUPABASE_URL, SUPABASE_SERVICE_KEY,
  AUTH_REDIRECT_URL — o'zgarmadi (loyiha darajasida).
- **Env var'lar (Vercel, preview, 2026-07-31 qo'shildi):** SUPABASE_URL va
  SUPABASE_SERVICE_KEY (type sensitive) — production qiymatlari preview
target'iga ko'chirildi (API orqali; decrypt API bo'sh qaytgani uchun qiymatlar
lokal `.env`dan olindi — production bilan bir xil manba). Endi PR preview'lari
runtime'da env'siz 500 bermaydi. `AUTH_REDIRECT_URL` preview'ga ataylab
qo'shilmadi: ixtiyoriy (config'da default) va preview frontend URL'i har
deploy'da dinamik. Eslatma: Vercel'da key rotatsiyasi bo'lsa preview'ni ham
yangilash kerak.
- **SSO himoyasi:** `ssoProtection: all_except_custom_domains` — barcha custom
  bo'lmagan domaynlar (preview URL'lari, GitHub PR preview'lari ham) Vercel
auth talab qiladi; production `attestatsiya-backend.vercel.app` (custom alias)
ochiq. Preview'lar faqat Vercel'ga login bo'lgan tekshiruvchilarga ko'rinadi
(standart sozlama; xohlasangiz alohida o'chirish mumkin).
- **Lokal (yangi tuzilma, 2026-07-31):** `~/Desktop/attestatsiya` papkasi ichida
  ikkita alohida repo: `frontend/` (attestatsiya repo — frontend + supabase +
  hujjatlar) va `backend/` (attestatsiya-backend repo). Backend `.env`
  `~/Desktop/attestatsiya/backend/.env` da (gitignore'da). Lokal backend
  `~/Desktop/attestatsiya/backend` da ishlaydi (`npm run dev`, PORT=3001).
  Har ikkala repo'ning GitHub/Vercel ulanishi o'zgarmadi.
- **Asosiy repoda:** 44 backend fayli olib tashlandi; README/CI frontend'ga
  bog'liq emasligi uchun o'zgarmadi; faqat PROJECT_STATE.md va TASKS.md yangilandi.

## Vercel platformani to'liq jonli tekshiruv va tuzatishlar (2026-07-31)

- **Asosiy sabab ("platforma ishlamayapti" shikoyati):** Supabase Auth `site_url`
  `http://localhost:3000` edi va redirect allow-list bo'sh edi — ro'yxatdan o'tish
  tasdiqlash xatidagi link localhost'ga yo'nalardi; resend/reset `redirect_to`'lari
  esa "Invalid redirect" xatosiga uchragan bo'lardi.
- **Tuzatishlar (Supabase Management API orqali):** `site_url` →
  `https://attestatsiya-five.vercel.app`; `uri_allow_list` (vergul bilan ajratilgan
  string) → `https://attestatsiya-five.vercel.app,https://attestatsiya-five.vercel.app/reset-password,http://localhost:3000`.
  Eslatma: Management API'dagi maydon `additional_redirect_urls` EMAS —
  `uri_allow_list` (string, vergul bilan ajratiladi); noto'g'ri maydon jimgina
  qabul qilinmaydi (site_url o'tdi, allow-list qolmadi — shu aniqlangan edi).
- **AUTH_REDIRECT_URL (Vercel backend, production):** masked/tekshirib
  bo'lmaydigan qiymat o'chirilib, `https://attestatsiya-five.vercel.app` bilan
  almashtirildi (sensitive env'da PATCH ishlamaydi — DELETE + POST qilindi);
  production redeploy qo'llandi. Bu resend-confirmation va reset-password
  redirect'larida ishlatiladi.
- **Email strategiya:** Supabase default email provayderi (foydalanuvchi tanlovi).
  Free-tier chegara: 2 xat/soat — `over_email_send_rate_limit` (429). Backend endi
  buni aniq `EMAIL_RATE_LIMITED` (429, "Xat yuborish chegarasiga yetildi. Bir necha
  daqiqadan keyin qayta urinib ko'ring.") xabari bilan qaytaradi (`mapAuthError`
  yangi branch + 2 test; backend 104/104 yashil).
- **Jonli tasdiqlash:** frontend 0 konsol xato + himoya kodi bundle'da;
  backend healthy; register → admin confirm → login → me → progress/modules to'liq
  oqim ishlaydi; test foydalanuvchilar tozalandi. Route himoyasi ishlab turibdi
  (bundle'da `auth?returnTo`/`SESSION_EXPIRED`/`expired=1` kodlari bor).

## E2E tekshiruv — mock imtihon cheklovi (2026-07-31)

- **Brauzer render:** login/ro'yxatdan o'tish formasi to'liq ko'rinadi, 0 konsol
  xato, failed request yo'q (`attestatsiya-five.vercel.app`).
- **To'liq API oqim ishladi:** register (201) → admin confirm → login (200,
  access_token) → `/api/auth/me` → `/api/exam/start` (bolim/M01 → 15 savol,
  1800s) → `/api/exam/submit` (saved:true) → `/api/exam/finish` (breakdown).
  Test foydalanuvchilari tozalandi.
- **Ma'lum cheklov — mock imtihon (`kind=mock`) 503 `INSUFFICIENT_POOL`:
  "Savollar bazasi yetarli emas"** — Dashboard'dagi "Sinov imtihoni — 50 savol ·
  120 daqiqa" tugmasi shu yo'lni ishlatadi. Ildiz sabab: blueprint 50 savolni
  13+ guruh bo'yicha (`S1.INFO`, `S2.HW`, `S2.OFFICE`, `S3.LOGIC`, `S3.NUM`,
  `S3.ALGO`, `S4.BLOCK` …) `bilish`/`qollash`/`mulohaza` taqsimoti bilan talab
  qiladi; DB'da esa faqat M01 kontenti (`S1.INFO`, 400 savol, hammasi `bilish`)
  bor, boshqa guruhlarda 0–1 savol. Qaror (foydalanuvchi): **hozircha
  qoldiriladi** — keyingi modullar (M02–M16) kontenti import qilinganda mock
  imtihon ishlay boshlaydi. Agar oldinroq kerak bo'lsa: (a) blueprint
  quota'larini mavjud kontentga moslash (migration + ADR) yoki (b) `start_exam`
  RPC'sida mock uchun qat'iy 50-savol shartini yumshatish (kod + migration +
  testlar).

## Ochiq masalalar — M01 kontenti

- M01.01 (appendix) ga savol biriktirilmagan: `generate_topic_test` da
  `savol_yoq` xatosi qaytadi, UI buni "Bu mavzu uchun savollar mavjud emas"
  deb ko'rsatadi. Boshqa 11 mavzuda `source_lesson_id` orqali savol pool'i
  mavjud (M01.02 → 60).
- `scripts/` da eski (endi yo'q bo'lgan `chapters/` papkasiga tayangan)
  m01 pipeline qoldiqlari bor: `rebuild_m01*.py`, `fix_m01_content.py`,
  `generate_m01.py`, `clean_m01.py`, `audit_m01.py`, `m01_*.txt`,
  `m01_content.json`. Ular hech qayerdan chaqirilmaydi.
- Frontend `tsc` da pre-existing admin sahifa xatolari qolmoqda (66 ta,
  eski `QuestionFormModal/ModulesPage/QuestionsPage/SourcesPage/SpecsPage`
  schema nomlaridan) — T-017/T-018 ga tegishli emas.

## Environment holati

| Muhit | URL | Database | Holat |
|-------|-----|----------|-------|
| Local frontend | `http://localhost:3000` (vite) | Remote Supabase (plyqezulrfowyblsfpzy) | M01 12 dars + 400 savol DB'da; dars testi 20 random/shuffle |
| Local backend | `http://localhost:3001` (`~/Desktop/attestatsiya/backend`) | Remote Supabase | Alohida repo: `sarvar9417/attestatsiya-backend`; /api/admin/attempts faol |
| Production (frontend) | https://attestatsiya-five.vercel.app | Remote Supabase | Deploy; login forma ishlaydi, qora ekran yo'q |
| Production (backend) | https://attestatsiya-backend.vercel.app | Remote Supabase | /api/health healthy; barcha /api/* route'lar Fastify'ga yetib boradi |

## Muhim havolalar

- **Supabase project:** https://supabase.com/dashboard/project/plyqezulrfowyblsfpzy
- **DB connection:** secret manager yoki lokal `.env` orqali boshqariladi
- **Service Role Token:** repoda saqlanmaydi; Supabase secret manager orqali boshqariladi
- **files/ spec:** `files/00-README.md` dan boshlanadi
