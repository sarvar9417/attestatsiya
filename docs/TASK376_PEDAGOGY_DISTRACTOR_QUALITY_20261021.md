# TASK-376 — Pedagogika testlari: noto‘g‘ri javoblar sifat auditi (2026-10-21)

## Natija va release chegarasi
**Bosqich:** read-only database audit + 16 ta Y1 savolga semantic rewrite REVIEW rehearsal, tasdiqlanmagan. **Production data va learner ko‘rinishi o‘zgarmagan.**

Read-only Supabase snapshot:
- Faol KS: 223, PM.GEN: 506, PM.MET: 94 (jami 823 ta published, shu jumladan Y2/Y3).
- Pedagogika flag view: 1 346 savoldan 471 flag (faol va arxivlar birga).
- Faol published flag: 105, ulardan 105/105 uchun REVIEW successor mavjud.
- 105 ta review nusxaning 20 tasida noto‘g‘ri javoblarda shubhali absolyut ifoda bor; 20 ta hech biri avtomatik ravishda «xato» deb tasdiqlanmaydi.
- 365 ta avvalgi semantik taklif «draft»da, hech biri professional pedagog eksperti sign-off’i emas.

## Bajarilgan tahrir
16 ta REVIEW successor ichidagi 16 ta aniq noto‘g‘ri javob varianti qayta ifodalandi. Ishlar holati: kiberbulling, inklyuzivlik, differensiatsiya, rivojlanish diagnostikasi, adolat va teng munosabat, vaqt taqsimoti, guruh ishi, o‘quvchi tashabbusi, faol tinglash, muntazam formativ tekshiruv va informatika amaliy ko‘nikmasi. Noto‘g‘ri variantlar ham mazmunga oid, lekin to‘g‘ri javobning asosiy pedagogik shartini bajarib bermaydigan yondashuv tarzida yozildi.

Foydalanuvchi ko‘rsatgan ota-ona bilan suhbat savoli:
- Asl published savol: `2e951830-a7b7-4788-ac68-1cb3ebf21b31`.
- Mavjud `review` tahriri: `b64b8def-e21f-4e1b-aaeb-97f973cc281e`.
- Mavjud review variantlari allaqachon mazmunan yaqinroq; shu sabab qayta o‘zgartirilmadi va hali nashr qilinmadi.

Qolgan to‘rtta 20-cue signalining qayta yozilmasligi: avtomatik lug‘aviy belgi sifatida keltirilgan «barcha» kabi so‘zlar noto‘g‘ri variantni doim ochiq ko‘rsatmaydi. Har birini kontekstda ko‘rib chiqish zarur.

## Tekshiruv
- Exact source/review UUID, Y1, `review` status, original option matni, wrong-option UUID va minimum matn hajmi **fail-closed**.
- Postflight: to‘rtta noyob variant, aniq bitta correct key.
- Preview script production Supabase'da tranzaksiya sifatida ishga tushirildi: **16/16 mos**, yaroqli, `ROLLBACK` bilan muvaffaqiyatli yakunlandi.
- Published oldingi savollar, published variant va javob kalitlari, tarixiy javoblar o‘zgartirilmagan.
- Structural QA pedagogik validlikni to‘liq tasdiqlamaydi. Human/owner editorial review va testlanishdan keyingina release mumkin.

## Fayllar
- `supabase/maintenance/task376_pedagogy_distractor_revisions_ROLLBACK_ONLY.sql` — qayta yozilgan 16 variant, revision-only preflight/postflight.
- `supabase/maintenance/task376_pedagogy_distractor_audit_READONLY.sql` — to‘liq bo‘lim/flag/readiness auditi.
- `src/tests/task376PedagogyDistractors.test.ts` — no-release/keys/published protection uchun regresiya.

## Qolgan ishlar
1. 105 ta current-published flags orasidagi barcha qolgan masalalarni semantik baholash; unflagged savollardan false-negative tanlamalarini ko‘rish.
2. Savolning target construct bilan mosligi, uchta distractorning realistikligi va **yagona** correct answerni pedagogik ekspertning tasdig‘idan o‘tkazish.
3. Shu audit natijalarini immutable review→published jarayoni orqali foydalanuvchi release ko‘rsatmasiga binoan nashr qilish, original exam historyni saqlash.
4. Yangi published snapshotlar bilan pre/postflight, score/learner e2e qayta tekshirish.

**Ushbu PR production deploy va DB publish qilmaydi.**
