# TASK-201 — Pedagogika chuqur audit, release xavfsizligi va test diversifikatsiyasi

2026-10-16, production Supabase: `plyqezulrfowyblsfpzy`. **Scope:** KS, PM.GEN, PM.MET, PDF source-candidate inbox, `pedagogik_15` practice. Bu security/behavior task; barcha pedagogik savollarni ekspert tekshiruvidan o'tkazish bilan adashtirilmasin.

## Birlamchi manba

Foydalanuvchi yuklagan “Informatika Testlar spesifikatsiyasi.pdf” 2026: 50 ta savol / 120 min; 35 mutaxassislik, 5 KS (36–40), 7 umumiy pedagogika (41–47), 3 metodika (48–50); Y1,Y2,Y3 va umumiy kognitiv 8/35/7. **30 daqiqalik 15 savol testi platformadagi maxsus practice, alohida rasmiy imtihon emas.**

## Production audit (o'zgarishlardan avval)

- Jami KS/PM.GEN/PM.MET bank: **328** = **175 published + 153 review** (all formats).
- Published Y1: **169**; shularning **118 tasida** correct option longest distractordan >30% uzun. Bu mazmuniy xatoni isbotlamaydi, lekin testni taxmin bilan yechishga signaldir.
- 304 Y1 savolda 4 variant va valid correct_option_id: xato 0; variant matni takrorlari: 0; exact normallashtirilgan savol stem duplicate guruhlari: 0. Bu semantik duplicate yo'qligini anglatmaydi.
- Private PDF inbox: **649** (195 verified, 335 accepted_general, 119 rejected); **40 source candidate** review savoliga bog'langan, **155 verified** candidate hali bevosita review savoliga ulanmagan.
- `question_editorial_checks` tasdiq qaydlari: **0**; shuning uchun 153 review savol nashr qilinmaydi.
- Eski gate faqat `authored:pedguli-%` ni himoya qilgan; `authored:pedagogy-pdf-corpus:%` review savollari uchun ayni server-side release guard yo'q.
- Yangi foydalanuvchi uchun `pedagogik_15` selector bir xil savollarni UUID bo'yicha takroriy tanlay olgan (tie-break deterministik).

## TASK-201 patch

1. KS/PM.GEN/PM.MET yangi savollarini publish qilish faqat `review` statusdagi 4 tasdiqli **inson editorial checklist** (answer/source/wording/authorship) + 20+ belgili qayd + `content_fingerprint` bir xil bo'lsa mumkin. Review statusdan tashqarida imzo yozish mumkin emas.
2. Y1 nashrida 4 option, 1 valid server-only key va `maxWords/minWords <= 1.8`, `correctWords <= longestWrongWords * 1.25` himoya shartlari qo'shildi; faqat uzunlik mazmuniy yaqinlikni kafolatlamaydi.
3. Avval published 175 KS/PM savoli uchun immutable `pedagogy_published_revisions` lock backfill; **archived bo'lgandan keyin ham** oldingi savolning answer key, matn, variant, source metadata yoki turi o'zgartirilmaydi. Faqat `published -> archived` ruxsat.
4. Fingerprint endi variant ID, assets, subject va source bilan bog'langan; `status+stem` birgalikdagi UPDATE fingerprintni chetlab o'tolmaydi; SQL NULL holati to'g'ri boshqariladi.
5. `pedagogik_15` random tie-break qo'shildi; har guruh kvotasi 5/7/3, distinct constructlar, source lesson va server authoritative key, 1800 soniya saqlanadi.
6. Regression: unsigned, incomplete, stale, atomic-bypass, weak-length, tampered published/archive, RLS learner-no-access, baseline publish immutability va oddiy security fixture compatibility.

## Hali OPEN (bu PR yakunlamaydi)

- 118 ta legacy nashrdagi length-biased Y1 itemlarni avtomatik overwritе qilish mumkin emas; ekspert ko'rigidan keyin yangi approved revision yaratish kerak. Oldingi attemptlar original snapshotga bog'lanadi.
- 153 review item uchun ekspert approval UI (backend admin-only flow + audit trail) hali yo'q; faqat private service role DB maydoni mavjud, tizim avtomatik imzo chekmaydi.
- 155 verified private PDF candidate va 335 accepted_general uchun semantik editorial review/umumiy pedagogika practice scope alohida.
- Rasmiy 50-savollik mock va 15-Y1 practice alohida; 15 practice Y2/Y3 baholashni qamramaydi.
- Randomized selection matn sifati, distractor plausible-ness yoki real attestatsiya matnini autentifikatsiya qilmaydi.

## Verification/release

Migrations: `20261016224000_task201_pedagogy_editorial_revision_safety.sql`, `20261016230000_task201_professional_15_fair_rotation.sql`.
Test: `supabase/tests/task201_pedagogy_publish_gate.test.sql`, existing professional/constructor/CI chain.
Fresh CI database, backend, quality jobs yashil bo'lmaguncha merge yo'q. Production migration undan keyin remote migration history/behavior va deployment smoke bilan tekshiriladi. 
