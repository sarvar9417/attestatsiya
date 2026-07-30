# 07 — Yo'l xaritasi

Har bosqich **tugallangan deb hisoblanadi**, faqat qabul mezonlari bajarilganda.
Bosqichni yarim qoldirib keyingisiga o'tmang — bu loyihaning eng katta xavfi.

---

## Bosqich 0 — Poydevor

**Vazifalar**
1. Next.js 15 loyihasi, TypeScript strict, Tailwind, shadcn/ui
2. Supabase loyihasi, `.env.local`
3. `02-DATABASE.md` dagi migratsiyalarni yozish va yugurtirish
4. `03-RPC.md` dagi funksiyalarni yozish va yugurtirish
5. `04-BLUEPRINT.md` dagi seed: subject, 9 modul, 76 konstrukt, blueprint kvotalari
6. `supabase gen types typescript` → `types/database.types.ts`
7. Anonim auth ishlashi

**Qabul mezonlari**
- [ ] `anon` roli bilan `select * from question_keys` → 0 qator
- [ ] RLS tekshirish so'rovlari (02-DATABASE.md oxirida) bo'sh natija beradi
- [ ] `select sum(question_count) from blueprint_quotas` → 50
- [ ] `select sum(n_bilish), sum(n_qollash), sum(n_mulohaza)` → 8, 35, 7
- [ ] `select count(*) from constructs` → 76
- [ ] Yangi tashrifda `profiles` da qator avtomatik paydo bo'ladi

---

## Bosqich 1 — Sinov dvigateli

Bu eng muhim bosqich. Kontent yo'q, lekin mexanizm to'liq ishlaydi.

**Vazifalar**
1. `ExamRunner` konteyneri, rejim propi bilan
2. `Y1Choice`, `Y2Match`, `Y3Order` — uchalasi ham drag'siz ishlaydi
3. `ExamTimer` — server vaqtiga tayanadi
4. `QuestionPalette` — javob berilgan/belgilangan holat
5. `start_exam` → `submit_answer` → `finish_exam` → `get_review` to'liq zanjiri
6. Natija ekrani: ball, toifa qarori, guruh kesimi
7. Offline navbat: `localStorage` + qayta yuborish

**Qo'lda 20 ta test savoli kiriting** (har formatdan), mexanizmni sinash uchun.
Bular vaqtinchalik, keyin almashtiriladi.

**Qabul mezonlari**
- [ ] Mock rejimida `submit_answer` faqat `{saved: true}` qaytaradi
- [ ] `get_review` tugamagan sinovda xato beradi
- [ ] `finish_exam` ikki marta chaqirilsa bir xil natija (`already_finished: true`)
- [ ] Vaqt tugagach `submit_answer` → `{error: 'vaqt_tugadi'}`
- [ ] Boshqa foydalanuvchi sinoviga kirish → `sinov_topilmadi`
- [ ] Brauzer tarmog'ini o'chirib javob berish → qayta ulanganda saqlanadi
- [ ] DevTools Network'da javob kaliti hech qayerda ko'rinmaydi

---

## Bosqich 2 — Generatorlar va birinchi savol zaxirasi

**Vazifalar**
1. `lib/exam/generators/` — 9 ta parametrik generator:
   - `axborotHajmi.ts` (S1.INFO.04, .05, .06)
   - `sanoqSistema.ts` (S3.NUM.01, .02, .03)
   - `mantiqAmal.ts` (S3.LOGIC.02, .04)
   - `ipMaska.ts` (S6.NET.03)
2. Har generator: `generate(seed): { stem, options, key, explanation }`
3. Bulk import skripti → `is_generated = true`, `status = 'published'`
4. Qo'lda: `KS.*` va `PM.*` uchun 60 savol (bular generatorsiz)

**Qabul mezonlari**
- [ ] Har generator 100 ta savol chiqaradi va hech biri takrorlanmaydi
- [ ] Generator javoblarini mustaqil hisoblagich bilan tekshirdingiz
- [ ] `select count(*) from questions where status = 'published'` ≥ 240
- [ ] Har konstruktda kamida 4 savol:
      `select construct_id, count(*) from questions where status='published'
       group by 1 having count(*) < 4` → bo'sh natija
- [ ] `start_exam('mock')` xatosiz 50 savol qaytaradi

---

## Bosqich 3 — Kontent va o'quv oqimi

**Vazifalar**
1. Bo'lim va mavzu sahifalari
2. MDX dars renderi
3. `generate_topic_test` bilan mavzu testi
4. O'zlashtirish sharti va progress ko'rsatkichlari
5. **8 va 9-bo'lim darslarini birinchi yozing** (ball zichligi eng yuqori)
6. Blueprint strip komponenti

**Qabul mezonlari**
- [ ] Mavzu testi shu mavzudagi **har** konstruktdan kamida 1 savol oladi
- [ ] Bir konstruktdan 0 to'g'ri javob bo'lsa, umumiy 80% bo'lsa ham
      `mastered_at` yozilmaydi
- [ ] Ikkinchi urinishda savollar birinchisidan farq qiladi
- [ ] Blueprint strip kengliklari 3:2:5:3:2:3:3:3:2:5:2:2:5:7:3 nisbatida

---

## Bosqich 4 — Adaptivlik

**Vazifalar**
1. Kirish diagnostikasi (25 savol)
2. SM-2 takrorlash sahifasi
3. Zaif nuqtalar sahifasi
4. Kabinet: "Bugungi reja"

**Kumulyativ diagnostika — muhim nuance:** bitta mockda `S3.NUM` atigi 2 savol.
Ikkalasi ham noto'g'ri bo'lsa, bu statistik shovqin bo'lishi mumkin. Zaiflik
xulosasini **kamida 5 urinish** to'plangandan keyin chiqaring. Undan oldin
"ma'lumot yig'ilmoqda" deb ko'rsating.

**Qabul mezonlari**
- [ ] `attempts < 5` bo'lgan konstrukt "zaif" deb belgilanmaydi
- [ ] `due_at` kelgan konstruktlar takrorlash navbatida chiqadi
- [ ] Noto'g'ri javobdan keyin konstrukt ertaga qaytadi (`interval_days = 0`)

---

## Bosqich 5 — Admin panel

`06-ADMIN.md` bo'yicha to'liq. Psixometrika modulini oxiriga qoldirmang —
u savol sifatini nazorat qiladi va sizda allaqachon ma'lumot yig'ilgan bo'ladi.

**Qabul mezonlari**
- [ ] `user` roli `/admin` ga kirsa 404
- [ ] Tushuntirishsiz savol nashr etilmaydi (server tomonda tekshiriladi)
- [ ] Manfiy diskriminatsiyali savol dashboardda kritik bayroq bilan chiqadi
- [ ] Cron ishlagach `question_stats` yangilanadi

---

## Bosqich 6 — SEO va ochilish

**Vazifalar**
1. `/konstrukt/[slug]` — 76 statik sahifa
2. `/spetsifikatsiya` — rasmiy formatni tushuntiruvchi sahifa
3. `sitemap.xml`, `robots.txt`, Open Graph
4. Xato xabar tugmasi (har savol yonida)
5. Telegram e'loni

**SEO sahifasida nima bo'lishi kerak:** konstrukt nomi, u qaysi guruhga tegishli,
imtihonda nechta savol, qaysi mavzu uni qoplaydi, 2–3 namuna savol (javobsiz,
lekin "mashq qilish" havolasi bilan).

**Qabul mezonlari**
- [ ] `curl` bilan olingan HTML'da sahifa matni bor (JS'siz ko'rinadi)
- [ ] Lighthouse SEO ≥ 95, Performance ≥ 85 (mobil)
- [ ] Barcha konstrukt sahifasi `sitemap.xml` da

---

## Bosqich 7 — Interaktiv modullar

Qiymat tartibida:

| Modul | Konstrukt | Texnologiya |
|---|---|---|
| HTML/CSS jonli muharrir | S5.WEB.04–06 | `iframe srcdoc` |
| Sanoq sistemalari konvertori | S3.NUM.* | sof TS |
| IP/maska kalkulyatori | S6.NET.03 | sof TS |
| Rostlik jadvali quruvchi | S3.LOGIC.04 | sof TS |
| Python konsoli | S4.CODE.01–03 | Pyodide, `dynamic import` |
| SQL mashqi | S4.DB.01, .04, .05 | sql.js |
| Excel formula simulyatori | S2.OFFICE.02 | HyperFormula |

Bularning aksariyati sof TypeScript — arzon va tez. Pyodide (~10 MB) faqat
kerak bo'lganda yuklansin.

---

## Huquqiy chegara — har bosqichda amal qiling

- Cambridge yoki RTM darsliklaridan matn, rasm, mashq **ko'chirmang**
- Rasmiy imtihon savollarini qayta nashr qilmang — spetsifikatsiya
  **konstrukti** asosida o'z savolingizni yozing (konstruktning o'zi ochiq
  davlat hujjati, undan foydalanish mumkin)
- Spetsifikatsiya PDF'iga havola bering, uni saytga joylashtirmang

---

## Xavflar va yumshatish

| Xavf | Ehtimol | Yumshatish |
|---|---|---|
| Kontent yozish to'xtaydi | **Yuqori** | Generatorlar 2-bosqichda, 180 savol darhol |
| Savollar nusxalanadi | Yuqori | Kalit RPC ortida; qiymat diagnostikada |
| LLM savollarida xato javob | Yuqori | Har birini qo'lda tekshiring; psixometrika ushlaydi |
| Mavsumiy yuklama (fevral–aprel) | O'rta | Statik CDN, ISR, Supabase faqat baza |
| Tekin tarif egress chegarasi | O'rta | Rasm va WASM Supabase'da emas |
| Spetsifikatsiya o'zgaradi | Past | Blueprint versiyalangan, eski natija buzilmaydi |
