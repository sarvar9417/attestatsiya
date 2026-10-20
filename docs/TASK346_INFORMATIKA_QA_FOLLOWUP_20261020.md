# TASK-346 — Informatika review corpus QA continuation

2026-10-20. Scope: private content-quality staging, no publication.

## Verified progress
- Existing corpus remains 4,470 unique poll candidates, 580 theory snippets, 316 PDF attachment records and 228 extracted PDF fragments.
- A limited AST-based Python expression checker found 20 uniquely matching computed answers from 136 print-containing poll candidates. The results are isolated in attest_ingest.telegram_informatika_numeric_qa. They are computational proposals, not source-issued solutions or editorial approvals.
- A private security-invoker view provides 118 exclusive-pattern module suggestions. Original module_hint fields are unchanged.
- Telegram messages were matched by same sender, preceding photo message ID, and 0–1 second timing. 484 exact adjacent photo relations were stored in attest_ingest.telegram_informatika_missing_media. Photo bytes are absent from the export; the relationship does not itself prove the picture is required for solving a question.
- 20/20 candidate answer-choice match checks, and database quality invariants passed.

## Reproducibility
- New migrations: numeric_qa_staging, module_suggestion_view and missing_media_links.
- Scripts: scripts/telegram_numeric_review.py; scripts/tests/test_telegram_numeric_review.py.
- Database regression: supabase/tests/telegram_informatika_followup_qa.test.sql.

## Publication safeguards
- Existing public lessons, published questions and exam blueprints were not modified.
- Both new staging tables have RLS enabled and no anon/authenticated access.
- Numeric suggestions are explicitly marked as AI/computation and unpublished.
- The view gives tentative module assignments only.
- No approval, merge, or deployment has been performed.

## Remaining
- Inspect the missing photographs and 320 PDFs visually and semantically, verify all keys and distractors, reconcile textbook topics, run full CI and authenticated UI tests before any learner release.
- 116 of the 136 print-containing candidates were not uniquely resolved by the restricted checker.
- Remaining 2,248 originally unclassified candidates need manual classification after the 118 proposals are reviewed.

## Qo'shimcha PDF tajribasi
- PDF nomzodlari 228 tadan 261 taga, manba soni 18 dan 20 taga o'sdi.
- "Axborot kodlash test.pdf": 20 savol matni va 4 tadan javob varianti review-only tarzda ajratildi.
- "HTML savollar 1.pdf": 13 HTML/kodli savol matni; variantlar hujjatda yo'q, shu sabab `answer_options_missing_or_unreliable` bilan tekshirishga qoldi.
- Kodlash PDFidagi 20 savoldan 18 ta mustaqil hisoblandi va `attest_ingest.telegram_informatika_pdf_independent_qa` ga izohli taklif sifatida joylashtirildi; 2 ta talqini noaniq savol avtomatik hal qilinmadi. 18 ta taklif ham `confirmed_by_human=false`; source `answer_key` to'ldirilmadi.
- `supabase/migrations/20261020203000_task346_pdf_independent_qa.sql` va `scripts/tests/test_telegram_pdf_math_review.py` bilan nazorat qilinadi.

## 3-bosqich — keyingi manbalar va 2 betlik Sanoq PDF vizual QA
- Dastlabki 261 candidate ustiga 20 ta `Sanoq sistemalari savollar.pdf`, 40 ta `Excelda Matematik va Mantiqiy funksiyalarga oid savollar.pdf`, 2 ta oldin raqamlar tutashib ketgan `Internet test.pdf` (#15, #29), 4 ta `MS EXCEL savollar.pdf` (#9, #13, #17, #19) qo'shildi. Jami **327 PDF candidates / 22 source PDFs**. Barchasida source `answer_key=NULL`.
- `MS EXCEL savollar.pdf`da #8, #12, #16, #18 oldingi savolga keyingi savol yopishganligi asl PDF matni bilan taqqoslanib ajratildi. Bu faqat private candidate matni, public learner content emas.
- Original `Sanoq sistemalari savollar.pdf` 2 bet / A4, asl sahifalar render orqali birma-bir vizual ko'rildi. #1–10 1-bet, #11–20 2-bet. `source_page_number` hamda `source_visually_checked=true` **faqat shu 20 savol** uchun yozildi. Yangi migration: `20261020205000_task346_pdf_visual_source_locator.sql`.
- #7 savolda yo'qolgan `B` variant asl 1-betdan tiklandi; #11 dagi `3^12` daraja belgisi 2-betdan tiklandi. Boshqa sahifalar original rasm ko'rilmasdan `checked` qilinmadi.
- 16 ta yechim mustaqil matematik hisob-kitobdan `attest_ingest.telegram_informatika_pdf_independent_qa`ga `needs_editorial_review` va `confirmed_by_human=false` bilan qo'shildi. Shu bilan PDF independent QA jami **34** (oldingi 18 + yangi 16). Telegram computation QA alohida 20.
- #4 (9 asosli son ichida A raqami), #6 (filtrlash sharti/variant nomuvofiqligi), #8 (ko'paytma va mavjud ikkilik variantlar), #9 (daraja-asos va 0 soni variantlari) source-level chalkashlik tufayli QA'da bloklandi. Ularga `pdf_independent_qa`ga yechim yozilmadi, savol muallifi/ekspert tekshiruvi zarur.
- QA SQL 0 ta nomuvofiqlik: 327 PDF nomzodda 0 ta original key, 20/20 page-locator, 4/4 unresolved flag, 34 mustaqil yechim private, `anon/authenticated` uchun ruxsat yo'q. Yangi regressiya `supabase/tests/telegram_informatika_visual_source_qa.test.sql`.

### Muhim chegaralar
- `source_visually_checked=true` faqat asl PDF sahifasi ko'rilganini tasdiqlaydi. Savol ekspert tomonidan tasdiqlangan yoki published degani emas.
- Excelning 40 ta formulasi to'rt variantli test emas, javobi keyin alohida tasdiqlanadigan mashq. Ularni soxta variant bilan to'ldirish va attestatsiya mockiga qo'shish mumkin emas.
- Qolgan PDFlar, rasmlar, Telegramdagi javob manbasi, semantic duplicate, yakuniy ekspert tasdig'i va authenticated UX ochiq. **Merge/deploy yo'q.**
