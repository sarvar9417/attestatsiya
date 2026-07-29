# Platforma QC Roadmap (darslardan keyin)

> 2026-07-27. Darslar bo'limi to'liq QC'dan o'tdi (formula 100%, speaking 100%,
> modelAnswer 100%, 0 bug). Endi qolgan bo'limlar. Holat: ⬜ · 🔄 · ✅

## P1 — Asosiy o'quv kontenti
- [x] **QC-1 Vocabulary tizimi** ✅ O'TDI: 353 so'z 0 muammo/0 dublikat (IPA/misol/tarjima to'liq);
      personal vocab to'g'ri user-izolyatsiya (user_id+RLS+requireAuthedUser, localStorage yo'q);
      SRS = FSRS (lib/srs.ts) + phrases Leitner; 183 test o'tdi (12 fayl).
      Kichik: daraja disbalansi (A1 62% — 218/353).
- [x] **QC-2 Mock Test** ✅ O'TDI: 279 savol (170→279), 0 dublikat/0 muammo; daraja A1:20/A2:60/B1:95/B2:104; bo'lim grammar:127/vocab:92/reading:60; IELTS kontent bor. Kichik: A1 kam.
- [x] **QC-3 Speaking** ✅ O'TDI (+1 REAL BUG FIX): 99 prompt (41→99) 0 muammo; 9 conversation, 6 pronunciation kategoriya toza. **BUG:** SpeakingLadder qulflangan kunlar gating ishlamayotgan edi (bosilardi) — tuzatildi (test 12→16/16). Kichik: B1+ prompt kam (6); grammar-map day 104-108 CEFR warning (validation o'tadi).

## P2 — Qo'llab-quvvatlovchi ko'nikma
- [x] **QC-4 Listening** ✅ 56 dars (27→56), 0 muammo (youtubeId+transcript to'liq).
- [x] **QC-5 Reading** ✅ 26 matn, 0 muammo, daraja balansli.
- [x] **QC-6 Writing** ✅ 79 prompt (11→79), 13 tur, 0 muammo; AI-feedback baholaydi (modelAnswer ixtiyoriy, 0 — kichik).
- [x] **QC-7 Grammar** ✅ 40 topic, 0 muammo (title/mashq/misol/formula to'liq); daraja balansli.

## P3 — Funksiyalar
- [x] **QC-8 weekly_lessons** ✅ 11 test yozildi (guest-rejection, unit-grouping, completed_at, dublikat-toast, parseBlocks) — service mantiqi tasdiqlandi.
- [x] **QC-9 Tandem** ✅ 96 feature test o'tadi (tandem/duel/elo/battle/placement) — mustahkam.
- [~] **QC-10 30-Day Challenge** — struktura OK, lekin faqat 2/30 kun kontenti (day1/day2). Kontent bo'shlig'i (28 kun).
- [~] **QC-11 Films** — 419KB JSON, 1 film. Struktura OK; hajm katta (performance kelajakda).
- [x] **QC-12 Placement Test** ✅ placementService + placement testlari o'tadi.
- [x] **QC-13 Idioms/PhrasalVerbs/Confusable** ✅ (+1 BUG FIX): **Idioms 8 dublikat ID o'chirildi (100→92)**; PhrasalVerbs 110 0-muammo; Confusable 10 0-muammo.
- [ ] **QC-14 Dashboard/Profile/Achievements/Skills**.

## Jurnal
| Sana | Band | Izoh |
|---|---|---|
| 2026-07-27 | — | Roadmap yaratildi; Vocabulary QC boshlandi |
