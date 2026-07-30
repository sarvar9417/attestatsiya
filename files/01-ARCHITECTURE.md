# 01 — Arxitektura

## Stack

| Qatlam | Tanlov | Versiya |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| React | React | 19.x |
| Til | TypeScript, `strict: true` | 5.x |
| Uslub | Tailwind CSS | 4.x |
| Komponent | shadcn/ui | latest |
| Klient kesh | TanStack Query | 5.x |
| Validatsiya | Zod | 3.x |
| Baza, auth | Supabase (Postgres 15, anonymous auth, RLS) | — |
| Hosting | Vercel | — |

**Qo'shmang:** Redux, Prisma, tRPC, ORM. Supabase klienti va RPC yetarli.
Ortiqcha qatlam RLS mantig'ini yashiradi.

---

## Papka tuzilmasi

```
app/
  layout.tsx
  page.tsx                          landing (statik)
  (public)/
    bolimlar/
      page.tsx                      9 bo'lim
      [module]/
        page.tsx                    mavzular + qulf holati
        [lesson]/
          page.tsx                  dars matni
          test/page.tsx             mavzu testi
        imtihon/page.tsx            bo'lim imtihoni
    mock/
      page.tsx                      boshlash ekrani
      [examId]/
        page.tsx                    sinov, taymer
        natija/page.tsx             ball + tahlil
    takrorlash/page.tsx             SM-2 navbati
    zaif-nuqtalar/page.tsx
    diagnostika/page.tsx
    kabinet/
      page.tsx
      tarix/page.tsx
    spetsifikatsiya/page.tsx        SEO, statik
    konstrukt/[slug]/page.tsx       SEO, ~60 statik sahifa
  admin/
    layout.tsx                      rol tekshiruvi shu yerda
    page.tsx
    kontent/{bolimlar,darslar,konstruktlar}/page.tsx
    savollar/page.tsx
    savollar/[id]/page.tsx
    blueprint/page.tsx
    sifat/page.tsx
    hisobotlar/page.tsx
    foydalanuvchilar/page.tsx
    analitika/page.tsx
  api/
    cron/stats/route.ts             psixometrika qayta hisoblash

components/
  exam/
    ExamRunner.tsx                  umumiy sinov konteyneri
    Y1Choice.tsx
    Y2Match.tsx
    Y3Order.tsx
    ExamTimer.tsx
    QuestionPalette.tsx             belgilangan/javob berilgan holat
    ResultBreakdown.tsx
  lesson/
    LessonBody.tsx                  MDX render
    ConstructBadge.tsx
    ModuleCard.tsx
    BlueprintStrip.tsx              signature element, 05-FRONTEND.md ga qarang
  admin/
    QuestionEditor.tsx
    StatsTable.tsx
    ReportQueue.tsx
  ui/                               shadcn

lib/
  supabase/
    client.ts                       brauzer klienti
    server.ts                       RSC / server action klienti
    admin.ts                        service role, 'server-only'
  exam/
    blueprint.ts                    kvotani o'qish, tekshirish
    scoring.ts                      ball, toifa qarori
    answers.ts                      Y1/Y2/Y3 javob normalizatsiyasi
  srs/
    sm2.ts
  psychometrics/
    pvalue.ts
    discrimination.ts
  auth/
    roles.ts
    guards.ts

types/
  database.types.ts                 supabase gen types typescript

supabase/
  migrations/
    001_extensions_enums.sql
    002_content.sql
    003_assessment.sql
    004_progress.sql
    005_quality.sql
    006_rls.sql
    007_functions.sql
  seed/
    01_subject_modules.sql
    02_constructs.sql
    03_blueprint.sql
```

---

## Route xaritasi va render rejimi

| Route | Render | Sabab |
|---|---|---|
| `/` | Static | SEO |
| `/spetsifikatsiya` | Static | SEO, o'zgarmaydi |
| `/konstrukt/[slug]` | Static (`generateStaticParams`) | ~60 SEO sahifa |
| `/bolimlar`, `/bolimlar/[module]` | ISR, `revalidate: 3600` | Kontent kam o'zgaradi |
| `/bolimlar/[module]/[lesson]` | ISR, `revalidate: 3600` | Dars matni |
| Test/mock/kabinet sahifalari | Dynamic, `force-dynamic` | Foydalanuvchiga xos |
| `/admin/*` | Dynamic | Har doim yangi ma'lumot |

Qulf holati (`unlocked/locked`) ISR sahifada **klient tomonda** olinadi — aks holda
kesh har foydalanuvchi uchun buziladi.

---

## Autentifikatsiya

Supabase anonymous sign-in. Oqim:

```
1. Birinchi tashrif → supabase.auth.signInAnonymously()
2. profiles jadvalida qator avtomatik yaratiladi (trigger)
3. Foydalanuvchi darhol ishlay boshlaydi, progress saqlanadi
4. Xohlasa: supabase.auth.updateUser({ email, password })
   → anonim hisob doimiy hisobga aylanadi, user_id o'zgarmaydi,
     shuning uchun progress yo'qolmaydi
```

**Muhim:** `auth.uid()` anonim va ro'yxatdan o'tgan foydalanuvchi uchun bir xil
ishlaydi. RLS siyosatlarida farq qilmaydi.

### Rol tekshiruvi

`app/admin/layout.tsx` da server tomonda:

```ts
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'admin' && profile?.role !== 'editor') notFound()
```

`middleware.ts` da faqat sessiya yangilanadi. Rol tekshiruvi layout'da — chunki
middleware'da baza so'rovi har request'ni sekinlashtiradi.

---

## Ma'lumot oqimlari

### A. Mavzu testi

```
Klient  → rpc('generate_topic_test', { p_lesson_id })
Server  → mavzuga bog'langan har konstruktdan majburiy 1 savol
        → qolgan slotlar: foydalanuvchining zaif konstruktlaridan
        → oldingi urinishlardagi savollarni chetlab o'tadi
        → exams + exam_items yozadi
        → savollarni KALITSIZ qaytaradi
Klient  → javob beradi → rpc('submit_answer') → { correct, explanation }
Klient  → rpc('finish_exam') → ball + konstrukt kesimi
Server  → o'zlashtirish shartini tekshiradi:
            umumiy >= 75%  VA  har konstruktda kamida 1 to'g'ri
        → shart bajarilsa user_lesson_progress.mastered_at yoziladi
```

### B. Mock test

```
Klient  → rpc('start_exam', { p_kind: 'mock' })
Server  → faol blueprint_quotas ni o'qiydi (15 guruh)
        → har guruh uchun kognitiv kvota bo'yicha savol tanlaydi
        → jami aynan 50 ta bo'lishini tekshiradi
        → exam yozadi, duration_sec = 7200
Klient  → taymer, palitra, belgilash
        → har javobda submit_answer → { saved: true }   (tushuntirish YO'Q)
Taymer  → finish_exam (idempotent)
Klient  → /natija → rpc('get_review') → kalit + tushuntirish ochiladi
```

### C. Offline chidamlilik

Sinov davomida ulanish uzilishi mumkin. Klient:

1. Javobni darhol `localStorage` navbatiga yozadi
2. `submit_answer` ni chaqiradi
3. Xato bo'lsa — navbatda qoladi, 5 soniyada qayta urinadi
4. `exam_items.client_answered_at` — klient vaqti, `answered_at` — server vaqti

Taymer **server vaqtiga** tayanadi: `exams.started_at + duration_sec`. Klient
taymeri faqat ko'rsatish uchun. `finish_exam` server vaqtini tekshiradi.

---

## Xatolarni boshqarish

| Holat | Xatti-harakat |
|---|---|
| RPC xatosi | Toast, qayta urinish tugmasi. Sahifa yiqilmaydi. |
| Sinov topilmadi | `/mock` ga qaytarish |
| Vaqt tugagan sinovga javob | `submit_answer` `{ error: 'vaqt_tugadi' }` qaytaradi |
| Ikki marta `finish_exam` | Ikkinchisi bir xil natijani qaytaradi (idempotent) |
| RLS rad etdi | Konsolga log, foydalanuvchiga umumiy xabar |

Xato matnlari o'zbekcha, ayblovsiz va aniq. `05-FRONTEND.md` dagi copy qoidalariga
qarang.
