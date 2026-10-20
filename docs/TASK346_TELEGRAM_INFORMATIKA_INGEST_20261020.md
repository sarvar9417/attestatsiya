# TASK-346 — Informatika Telegram va PDF manbalarini xavfsiz indekslash

**Manba:** barnoyevak Google Drive -> `Informatika` -> `result.json` va `files/`.
**Sana:** 2026-10-20. **Holat:** PRIVATE REVIEW STAGING (kontent hali published emas).

## Tekshirilgan eksport
- Telegram guruhi: `Informatika Attestatsiya 86+`; 2025-08-30 — 2026-10-20.
- Jami xabar: **51 529**; Telegram poll: **16 804**.
- Bir xil savol matnini deduplikatsiya qilinganda **4 223**, savol+variantlar birga hisoblanganda **4 470** nomzod.
- 4 470 savol ma'lumotlari `attest_ingest.telegram_informatika_polls`da; javoblar kaliti Telegram eksportida yo'q va `answer_key=NULL`.
- Nazariya uchun dastlabki heuristik saralash: **580** xabar, `attest_ingest.telegram_informatika_theory_candidates`.
- PDF manba manifesti: **316 noyob nom**, **380 Telegram PDF tilga olinishi**, `attest_ingest.telegram_informatika_pdf_attachments`.
- Drive `files/` papkasida **535 ilova**, shundan **320 PDF**. Tizimga source locator bilan bog'langan PDF manifesti — fayl matni to'liq ko'rib chiqildi degani emas.

## PDF text candidates
- `attest_ingest.telegram_informatika_pdf_question_candidates`ga matndan ajratilgan dastlabki nomzodlar kiritiladi. Matnni chiqarib bo'lmagan rasm/skanlar va ma'no uchun zarur diagrammalar mustaqil vizual tekshiruvga muhtoj.
- Dastlabki PDF partiyasidan **18 manbaga tegishli 228 savol fragmenti** review-only saqlandi. Ulardan **115 tasi variant ajratish ishonchsiz**, **32 tasi vizual kontent ehtimoliga** flag qilingan; 0 ta tasdiqlangan key. 18/320 PDF deyilganda qolganlarini to'liq ko'rib chiqildi deb talqin qilmaslik kerak.
- Testlar `answer_key=NULL`, `review_state=needs_answer_and_visual_review` bilan saqlanadi; sahifa raqami va korrekt javob yaratilmaydi.

## Sifat va xavfsizlik
- 2026 malaka sinovi: mutaxassislik 35, kasb standarti 5, pedagogik mahorat 10 (7 umumiy pedagogika + 3 metodika); 8 bilish, 35 qo'llash, 7 mulohaza. Har bir savol 2 ball, 120 daqiqa.
- Automatic module classifier — **faqat taxmin** (`module_hint`), spetsifikatsiya konstruktiga yakuniy mapping emas. **2366** noyob poll `REVIEW`da.
- Heuristik flags: 191 rasm/kontekstga ehtimol bog'langan, 672 qisqa stem, 970 to'rt variantli bo'lmagan, 45 takror variantli savol. Flags toifalari ustma-ust keladi.
- Yangi jadvallarda RLS ON; `anon`, `authenticated` o'qish/yazish huquqlari berilmagan. Javob kalitlari learner API bilan ulashilmaydi.
- Mavjud `public.questions`, `public.lessons`, mock blueprint va published revisionlari mutlaqo o'zgartirilmagan.
- Group xabarlari yoki PDF text'ini public GitHub'ga joylashtirmang. Materiallar turli mualliflarga tegishli; learner nazariyasi mustaqil qayta yozilishi va izohli source locator talab qilinadi.
- Barcha manbalar va answer-key variantlari darslik/asl rasm bo'yicha tasdiqlanmaguncha yangi nomzodni nashr etmaslik kerak.

## Qolgan ishlar
1. Noto'g'ri module_hint larni 2026 specs konstruktiga qayta mapping, Telegram bot so'rovlarini original answer key va source bilan verifikatsiya.
2. Qolgan PDF fayllarni text/image/page sifat nazoratidan o'tkazish; bir faylning dublyajlariga dedup; PDF candidate extraction.
3. 580 nazariya parchasi uchun fakt tekshiruv, mualliflikka mos original izohli darslar (M01–M16) va yakuniy ekspertiza.
4. Import PDF namunasida 228 candidate fragmentni source-page/diagram bilan taqqoslash, shu jumladan 115 formatli va 32 vizual belgilangan savolni qayta ajratish.
5. Dastlabki va to'liq user-facing dars/test release uchun code QA, CI, authenticated real UX va permissions tekshiruvi.
6. Private source importni qayta bajarish idempotent; raw import artefaktlari public GitHub'da saqlanmaydi.

## Handoff
Task: TASK-346 — Telegram Informatika import/staging.
Natija: review-only schema + 4470 poll + 580 theory + 316 PDF manifest + 228 PDF question candidate; keyless.
O'zgargan fayllar: ikki migration, private ingest smoke test va ushbu audit.
Migratsiyalar: task346_telegram_informatika_ingest, task346_telegram_informatika_pdf_candidates.
Qolgan blocker: no verified answer key; image-heavy PDF, QA/human editorial source.
Deployment: **yo'q**.
