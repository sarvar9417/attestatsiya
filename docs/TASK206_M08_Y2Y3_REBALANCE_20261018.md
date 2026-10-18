# TASK-206 — M08 Python / JavaScript Y2–Y3 bankini qayta muvozanatlash
Sana: 2026-10-18. Repository: `sarvar9417/attestatsiya`. Modul: `M08`; rasmiy konstruktlar: `S4.CODE.01–05`.

## Qaror va spetsifikatsiya
Bu **tayyorlov bankining ichki pedagogik nisbati**, rasmiy 2026 attestatsiya imtihonining Y1/Y2/Y3 bo‘yicha majburiy foizi emas. `M08.examQuestionCount=3` va 50 savollik rasmiy mock blueprint **o‘zgartirilmadi**.

| Test formati | Avvalgi review | Yangi review | Har bir bob |
|---|---:|---:|---:|
| Y1 — to‘g‘ri javob | 392 | **252** | 18 |
| Y2 — moslashtirish | 14 | **84** | 6 |
| Y3 — ketma-ketlik | 14 | **84** | 6 |
| Jami | 420 | **420** | 30 |

## Ish bajarilishi
- 14 bobning har biridan oldingi **10 ta unpublished Y1** savol statusi `review → archived` (fizik o‘chirish YO‘Q).
- Har bir bobga 5 ta yangi **native Y2** (4 ta chap + 4 ta o‘ng; `question_keys.payload.pairs`) va 5 ta **native Y3** (4 ta haqiqiy kod natijasi; `payload.order`) qo‘shildi.
- Jami **70 ta yangi Y2** + **70 ta yangi Y3**, yangi savollar `review`, `is_generated=true`; savol kalitlari faqat server `question_keys` jadvalida.
- 70 ta Y3 topshirig‘ining Python 3 va Node.js kodlari mahalliy bajarilib, to‘rt chiqish va ularning o‘ziga xosligi tekshirildi.
- 70 ta Y2 haqiqiy operator/metod semantikasi bo‘yicha original mualliflik moslashtirish savollari; **mustaqil fan eksperti tasdig‘i hali yo‘q**.
- Mavjud beshta `published` M08 darsi, avvaldan mavjud `S4.CODE` banki va foydalanuvchilarning tarixiy yozuvlari o‘zgarmadi.
- M08 katalogini almashtirish TASK-205 dagi 14 bobning **hammasi expert-published** bo‘lish shartiga bog‘langan; hozir review materiallar learner sahifasiga chiqmaydi.

## Xavfsiz database staging (haqiqatan bajarilgan)
Supabase: `attestatsiya100%` — `plyqezulrfowyblsfpzy`.
14 ta alohida, atomik, idempotent qayta-ijro tekshiruvi bor **xususiy migratsiya**:
`task206_m08_pyjs_v2_rebalance_p01_review` ... `p07_review`,
`task206_m08_pyjs_v2_rebalance_j01_review` ... `j07_review`.

Har bir migratsiya to‘g‘ri eski `review` va `source_lesson_id/construct_id`ga tayanadi. Eski savolni archiving qilishdan oldin uning `exam_items`, `mastery_evidence`, `question_reports`, `question_stats` bog‘lanishlari yo‘qligi tekshiriladi. Replay xavfsizligi va har bir bob uchun 18/6/6 invarianti hamda 30 review + 10 archived kuzatiladi.

**MUHIM:** Private 140 ta yangi savol matnlari, 140 ta retired ID va barcha server-side keys PUBLIC Gitga commit qilinmaydi. Ularning authoring nusxalari foydalanuvchi artefakti va yopiq shaxsiy Library `/Attestatsiya/M08-TASK206/` ichida saqlanadi. Gitda esa public read-only SQL audit va ushbu tavsif saqlanadi. Production migratsiya tarixi bilan Gitdagi public migratsiyalarni ko‘r-ko‘rona `supabase db push` qilish mumkin emas.

## Production read-only audit, 2026-10-18
Tekshirish skripti: `supabase/maintenance/20261018_task206_pyjs_y2y3_balance_audit.sql`.

| Mezon | Tekshirilgan |
|---|---:|
| Review savollar | **420** |
| Y1 / Y2 / Y3 | **252 / 84 / 84** |
| Archived eski Y1 | **140** |
| Boblar | **14** (har birida 18 / 6 / 6 + 10 archived) |
| Review darslar | **17** |
| Unexpected published | **0** |
| Broken source / key / lesson link | **0** |
| Invalid Y1 / Y2 / Y3 key-option | **0 / 0 / 0** |

## Qolgan release gate
- [x] 420 ta review va 14 × (18/6/6) savollar taqsimoti.
- [x] 140 ta eski Y1 arxivda saqlangan, yo‘qolmagan.
- [x] 70 ta yangi Y3 kodining avtomatik ishlash sinovi.
- [x] DB option/key/source invariantlari va 0 published.
- [ ] Mustaqil pedagogik/source/provenance ekspert tekshiruvi (yangi 70 Y2 + 70 Y3 ham).
- [ ] E2E brauzer preview (native Y2 drag/matching va Y3 ordering, mobil UI, server authoritative scoring).
- [ ] Official 50/50 blueprint mock feasibility / no-key-leak audit.
- [ ] TASK-205 bilan birga CI + preview release signoff.
- [ ] Xususiy ma’lumot importining fresh staging DB replay rejasi; repository migration parity.
- [ ] Owner final release approvalla va keyingi production publish.

**Qat’iy qoida:** staging tugadi degani `published`, merge yoki deployga ruxsat degani emas. PR draft qolishi kerak. Published reviziyalar/attemptlar daxlsiz.

## Handoff
Task: TASK-206 M08 format balansini tuzatish.
DB: 14 ta private reviewed-staging migratsiya; yangi savollar review; eski Y1 archived.
Repo: public read-only SQL QA, ushbu audit hujjati. Parent: TASK-205 PR #153.
Risk: semantik ekspertiza, server/brauzer E2E, private migration parity, production release darvozalari.
