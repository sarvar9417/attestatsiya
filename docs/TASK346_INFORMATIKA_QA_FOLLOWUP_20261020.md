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

## 4-bosqich — Drive PDF inventari va Access manba-rasm nazorati
- `Informatika/files` ichki Drive papkasi qayta ro'yxatga olindi: **320 PDF**. Barchasining ID, URL, nom, hajm, faqat nomga asoslangan kategoriya taklifi yopiq `attest_ingest.telegram_informatika_drive_pdf_inventory`ga kiritildi (320/320). Nom bo'yicha kategoriyalar: 174 assessment, 69 theory, 57 unknown, 12 pedagogy, 5 curriculum, 3 administrative. **Kategoriyalar yakuniy manba ekspertizasi emas**.
- PDFning 22 tasida kamida bittadan savol/mashq candidate mavjud, 298 ta manbada savol fragmenti hali indekslanmagan. **13 ehtimoliy takror guruh / 27 fayl** bir xil normallashgan nom va hajmga ega; SHA256 bayt taqqoslash hali qilinmagan, ularni ishonchli dublyaj deb e'lon qilmaslik kerak.
- `MS Access savollar.pdf` original **9 bet** render qilindi; 20 ta manba topshirig'iga sahifa lokatori qayd etildi: 1–3/P1, 4–6/P2, 7–9/P3, 10–11/P4, 12–14/P5, 15–16/P6, 17/P7, 18–19/P8, 20/P9.
- **19/20** Access topshirig'i jadval, skrinshot yoki rasmga bog'liq: **14 tasi matn + tasvir, 5 tasi image-only**. #12 matnli. Yopiq `attest_ingest.telegram_informatika_pdf_visual_index` jadvalida 20/20 manba ID va bet raqami saqlandi; asset hali learner platformaga yuklanmagan (`content_publish_ready=false`).
- Oldin tushib qolgan **#4, #7, #10, #12, #13** MS Access matn fragmentlari manbadan qo'shildi; avvalgi 10 va yangi 5 candidate'ga fizik sahifa lokatori belgilandi. Rasm kerak bo'lgan 14 tasiga `embedded_pdf_asset_not_in_candidate` qo'shildi; image-only #15–18 va #20 matn savoli deb yasalmadi, manba inventarida qoldi.
- #12 uchun MS Access Yes/No ma'lumot turi bo'yicha `Boolean` izohi bilan bittagina mustaqil javob taklifi qo'shildi; bu **source answer key** yoki ekspert tasdig'i emas.
- Natija: **332 PDF savol/mashq fragmenti / 22 PDF manba**, jami **35 PDF independent AI QA proposal** (oldingi 34 + 1); Telegramdan 4,470 review-only poll / 580 nazariya nomzodi / alohida 20 code QA. **Barcha source answer_key NULL, human approval false**.
- Yangi artefaktlar: `20261020210000_task346_drive_pdf_inventory.sql`, `20261020211000_task346_pdf_visual_dependency_index.sql`, `supabase/tests/telegram_informatika_pdf_inventory.test.sql`. SQL metadata/permission regression live PASS.
- **Open:** image-only va jadval rasmlarini crop+asset pipeline bilan xavfsiz learnerga yetkazish, qolgan 298 PDF mazmuni, original javob kaliti va mustaqil editorial QA. Hech qanday public.question/public.lesson o'zgarishi yoki deployment yo'q.

## 5-bosqich — Telegram nazariya triage, yana 75 PDF savol, tasvir tiklash
- **580 nazariya xabari to'liq metadata/heuristik triage**: 228 aynan normallashgan matn takrori; `telegram_informatika_theory_triage`da 153 mazmunli nazariya nomzodi (122 noyob), 119 reklama/tashkiliy, 109 test e'loni, 106 quiz reytingi, 75 savol/muhokama, 9 havola/kanal e'loni, 9 boshqa suhbat. Hech biri ekspert tomonidan tasdiqlanmagan; views private `security_invoker` + anon/authenticated REVOKE.
- **PDF yangi import**: `Mantiq 2-dars.pdf` 60 savol va mashq fragmenti (matn, formulalar, teng kuchli ifoda belgilari vizual ko'rikda tekshiriladi; hozircha 4 variantli test emas); `O\`TGAN MAVZULARDAN TEST (1).pdf` 15 ta ABCD variantli manba savol fragmenti. 7-savol raqami eski variantga yopishib qolgani matn ajratishda tiklandi. **407 private PDF fragmenti / 24 alohida PDF**. Bu `public.questions` emas; `answer_key` 0, nashr qilinmagan.
- **Aniq takrorni aniqlash**: `telegram_informatika_pdf_duplicate_candidates` private view; hozircha 2 ta normalized exact stem duplicate guruhi (4 candidate). Semantik/parafraz takrorni aniqlamaydi, shu sabab review hali zarur.
- **PDF xom matn mavjudligi auditi**: ilk 20 PDFda `telegram_informatika_pdf_scan_audit` metadata yozilgan, 19 tasida ajratiladigan matn bor, 1 tasi deyarli faqat vizual. Bu 20 faylning to'liq sifat/answer ekspertizasi emas; qolgan ~300 PDF ustida to'liq ko'rik ochiq.
- **MS Access original PDF tasviri**: 9 original sahifadagi 20 savolning o'z manba skrinshotli regionlari (PDF question heading koordinatalaridan) maxsus private ZIPga ajratildi; `scripts/telegram_pdf_figure_crops.py` bilan qayta tiklanadi. **Rasmlar platformaga/Supabase Storage'ga joylanmadi**, real o'quvchi testiga berilmaydi. Manba: `https://drive.google.com/file/d/130SJl3LEn14uvVajDGbhCody_cOuwwbN/view`.
- **SQL manba muammolari**: `telegram_informatika_pdf_source_issues` yopiq jadvalga 7 ta nuqson kiritildi (q1 `toliq_ism` ustuni rasmda yo'q va `LIMIT`, q3 yo'qolgan comparator, q4/q5 Access uchun `LIMIT`, q7 `category`/ `toifasi` ziddiyati, q13 bo'shliqli ustun nomi qavsga olinmagan). MS Access SQL qatorda cheklashda `TOP` ishlatadi: `https://support.microsoft.com/en-gb/access/all-distinct-distinctrow-top-predicates`. Mazkur savollar uchun `learner_publish_blocked=true` va editorial review talab qilinadi.
- **Yangi reproducible/CI materiallari**: migrationlar `20261020213000_task346_theory_triage.sql`, `20261020214000_task346_pdf_scan_audit.sql`, `20261020215000_task346_pdf_duplicate_triage.sql`, `20261020220000_task346_access_source_defects.sql`; test `supabase/tests/telegram_informatika_theory_source_qa.test.sql`; PDF crop script `scripts/telegram_pdf_figure_crops.py`.
- **Kafolatlar**: raw PDF source va image GitHub'ga commit qilinmagan; faqat extractor code, private schema/migration/test va audit. `public.lessons`, `public.questions`ga ushbu partiyada hech qanday edit/publish qilinmadi.
- **Hali ochiq**: 300 ga yaqin PDFning har birini sahifa/rasm bilan ko'rib chiqish, tasvirlarning learner asset pipeline'ga ruxsatli joylashtirilishi, 122 nazariya nomzodini mustaqil qayta yozish va ekspert tasdig'i, barcha testlar answer-key QA, CI/authenticated UX, `main` merge. Bu bosqich hali **100% emas**.

## 6-bosqich — toza CI bootstrap migratsiya muammosini tuzatish
- GitHub Actions `database` jobda source-defect migratsiyasi tashqi kalit (FK) bilan yiqildi: yangi noldan tiklangan Postgres sxemasida shaxsiy Drive manbasidan `telegram_informatika_pdf_question_candidates`ga savollar yuklanmagan. Production private importdagi savollar bo'lgani uchun bir xil eski migratsiya unda muammosiz o'tgan.
- Hali merge qilinmagan `20261020220000_task346_access_source_defects.sql`dagi 7 ta manba muammosini kiritish `VALUES` satrlari `JOIN telegram_informatika_pdf_question_candidates` orqali faqat mavjud parent yozuvlar bo'lsa bajariladigan qilib qayta yozildi (`ON CONFLICT ... DO NOTHING` saqlandi). **Bo'sh CI manbasida 0 issue row — sxema baribir yaratiladi; imported production manbasida 7 ta issue row**. Source savol matni/migratsiya manbalari ommaviy repoga qo'yilmagan.
- Bu `main`ga merge yoki deploy emas; current-head CI to'liq muvaffaqiyati qayta tekshirilishi zarur.

## 7-bosqich — Excel literal formulalar va sanoq/kodlash testidagi mustaqil QA
- `Excelda Matematik funksiyalarga doir savollar uyga vazifa.pdf` (original 1 bet) **52 ta formulasi asl PDF sahifasi bilan tekshirilib** `attest_ingest.telegram_informatika_pdf_question_candidates`ga private, `answer_key=NULL`, `source_visually_checked=true`, page=1 bilan qo'shildi; 4-choice emas, testga aylantirilmasin.
- `telegram_informatika_pdf_formula_worked_qa` private jadvaliga **48 ta manba formulasi uchun mustaqil hisoblangan natija + o'zbekcha didaktik izoh**, **4 ta `invalid_source_formula`** (`FLOOR`ga `significance` yetishmagan) qo'shildi; hammasida `human_approved=false, published=false`. Manba: https://drive.google.com/file/d/1QiqRt1THGPr86C4MraFDpJrSLbjF0K-s/view
- Microsoft `FLOOR(number, significance)`da ikkinchi argument **majburiy**, `FLOOR.MATH` esa boshqa funksiya; `MOD(n,d)` qoldig'i bo'luvchining ishorasini oladi: https://support.microsoft.com/en-us/excel/functions/floor-function va https://support.microsoft.com/en-us/excel/functions/mod-function
- Hisoblash pozitiv/negativ MOD, POWER(81;1/4), ROUND(854;-2)=900, ROUND(9872;-3)=10000 bilan ikkilamchi sinovdan o'tdi. Mahalliy Python 5 unit testi PASS; GitHubga `scripts/telegram_excel_formula_review.py` va `scripts/tests/test_telegram_excel_formula_review.py` qo'shildi.
- `sanoq sistema kodlash test.pdf` original 4 betidan **10 ta ABCD savol** ajratildi; fizik bet lokatori (1–4 P1, 5–7 P2, 8–10 P3) va tasdiqlanmagan source key `NULL`. **8 ta mustaqil hisoblangan variantli izoh** `telegram_informatika_pdf_independent_qa` review-only jadvaliga kiritildi (#1,2,3,5,6,7,8,9). Asl matndagi `ATTESTATIYA` so'zi **11 belgi**: natija 824×11/1024 ≈ 8.8516 KiB ≈ 9 KiB; so'zni `ATTESTATSIYA`ga avtomatik tuzatish noto'g'ri kalit beradi.
- #4 625³ va 25⁵ ifodaning 5-lik yozuvi `4134444444433` bo'lib, **9 ta `4`** bor, ammo mavjud variantlar 8/20/10/15; `source_all_four_choices_incorrect` flag. #10 uzatish tezligi birligi yozilmagan va `transmission_speed_unit_not_defined` flag. Bu 2 savol uchun AI key taklif qilinmadi.
- Ushbu bosqichdan keyin **469 PDF question/exercise fragment / 26 manba PDF**, 43 ta 4-variantli PDF mustaqil hisoblangan QA, alohida 48 ta Excel erkin-javob formula natijasi (to'rt xato bloklangan) va 20 ta Telegram Python QA bor. **0 original PDF answer_key, 0 yangi public savol**.
- Repo: `20261020222000_task346_pdf_formula_worked_qa.sql` migration, `supabase/tests/telegram_informatika_excel_formula_review.test.sql`. CI faqat yashil bo'lsa readiness; draft merge va deploy hali yo'q.
