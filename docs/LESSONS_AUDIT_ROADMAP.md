# Darslar Bo'limi — Audit & Tuzatish Roadmap

> Manba: 2026-07-25 professional audit (dasturchi + tester + DB + lingvist + metodist).
> Holat belgilari: ⬜ bajarilmagan · 🔄 jarayonda · ✅ bajarilgan

## Kontekst (audit topilmalari)

- `loadAllLessons()` → **140** dars (118 asosiy + 22 review), lekin `LESSON_INDEX` → **137** → 3 dars UI'da ko'rinmaydi.
- 3 ta yangi dars (`second-conditional-b1`, `basic-relative-clauses-a2`, `advanced-relative-clauses-b2`) commit `fb7de42` da qo'shilgan, lekin index regen qilinmagan, transcript `\\n` bilan buzuq, va audio (`youtubeId`) yo'q.
- Ikkita parallel dars arxitekturasi: static-TS (ishlaydi) + `weekly_lessons` DB (UI'ga ulanmagan).
- Manba fayllarda qattiq `day` qiymatlari dublikat (faqat `loadAllLessons` qayta raqamlaydi).
- Repo'da o'lik fayllar (`*.bak`, `*.safe`), 23 ta bir martalik fix-skript.
- Sifat testi section-ID xatolarini fail qilmaydi (faqat warn).

---

## P0 — Kritik buglar (foydalanuvchiga bevosita ta'sir)

- [ ] **P0-1** 3 darsdagi `\\n` → `\n` transcript tuzatish (`b1SecondConditional`, `a2RelativeClauses`, `b2AdvancedRelativeClauses`).
- [x] **P0-2** "Ovozsiz listening" — QAYTA BAHOLANDI: bug EMAS. Audio transcriptdan TTS (`SpeechSynthesis`) orqali generatsiya qilinadi, `youtubeId` ixtiyoriy. Asl muammo `\\n` segment-parse'ni buzgani edi → P0-1 bilan hal bo'ldi. (Kelajak nice-to-have: `SpeechSynthesis` yo'q brauzerlar uchun graceful fallback → P3.)
- [ ] **P0-3** `LESSON_INDEX` regeneratsiya → 3 dars ro'yxatga qaytsin (`UPDATE_INDEX=1 vitest run lessonsIndex.test.ts`).
- [ ] **P0-4** Data-validation testlar: (a) transcriptda `\\n` yo'q, (b) listening bo'lsa audio bor yoki eksplitsit `noAudio`, (c) `LESSON_INDEX.length === loadAllLessons().length` drift-guard CI'da fail.

## P1 — Arxitektura & tozalash

- [ ] **P1-1** O'lik fayllarni o'chirish: `src/data/daily/a1Part1.ts.safe`, `a0Part1.ts.bak`.
- [x] **P1-2** Section-ID reference — QAYTA BAHOLANDI. 1444 "buzuq" reference (235 dars) aslida ZARARSIZ: `sec.ids` lokal indeks, mashqlar global ID; `resolveSectionItems` pozitsion fallback bilan ishlaydi. `warn→fail` qilish NOTO'G'RI bo'lardi. ✅ Bajarildi: (a) `resolveSectionItems` yaxshilandi — oxirgi section qolgan mashqlarni yutadi (44→ endi pozitsion yo'lda 0 yetim); (b) 5 ta unit-test + regressiya-baseline test qo'shildi. Qolgan **44 dars byId-yo'l data debt'i → P2 migratsiya**.
- [x] **P1-3** `weekly_lessons` — foydalanuvchi qarori: **to'liq UI qurildi va ishga tushirildi**. Yangi: `src/pages/WeeklyPlan.tsx` + `src/components/weeklyPlan/{BlockEditor,WeeklyLessonEditor,WeeklyLessonView,WeeklyUnitCard,WeeklyUnitForm}.tsx`; route `/weekly-plan`, App.tsx lazy, Sidebar nav, i18n `nav.weeklyPlan` (uz/en/ru). Service'dagi `parseBlocks` type-xatosi ham tuzatildi. Hafta+kunlik dars CRUD, bloklar (text/rule/vocab/task/speaking/link), Green/Yellow/Red rejim, progress, status toggle. tsc 0 xato.
- [ ] **P1-4** Manba `day` maydonlarini olib tashlash yoki `getAllLessons`ni ham qayta raqamlashga o'tkazish (dublikat kun raqamlari yo'qolsin).
- [ ] **P1-5** `DailyLesson` uchun yagona Zod sxema → DB (`LessonRow`) va static bir manbadan derive bo'lsin.

## P2 — Kontent balansi (metodik)

- [ ] **P2-1** Speaking qamrovi 14% → 50%+ (hozir 140 darsdan 20 tasida).
- [ ] **P2-2** A2 reading balansini yaxshilash (24 darsdan 9 tasida).
- [ ] **P2-3** Mashq turi balansini oshirish (fill-blank dominatsiyasini kamaytirish, produktiv mashqlar).
- [ ] **P2-4** CEFR lug'at-darajasi semantik validatsiyasi (dars darajasidan yuqori so'z bo'lmasin).

## P3 — Performance & infra

- [ ] **P3-1** Monolit data fayllarni dars-darajali lazy-load'ga bo'lish.
- [ ] **P3-2** Test suite tezligini optimallashtirish. **ILDIZ SABAB TOPILDI (2026-07-25):** vitest `setup` fazasi ~218s — `setup.ts` mazmuni yengil, muammo **Node v25.9.0** (juda yangi) + vitest 3.2.7 + jsdom mos kelmasligida (`--localstorage-file provided without a valid path` ogohlantirishi). Transform 3.4s, testlar 1.2s — normal. Yechim: Node'ni LTS (20/22) ga pin qilish yoki vitest'ni yangilash. **Diqqat:** infra o'zgarishi — alohida ko'rib chiqilsin.
- [ ] **P3-3** 23 fix-skriptni `scripts/archive/` ga ko'chirish; yagona kontent pipeline hujjatlashtirish.

---

## Bajarilish jurnali

| Sana | Band | Izoh |
|---|---|---|
| 2026-07-25 | — | Roadmap yaratildi |
