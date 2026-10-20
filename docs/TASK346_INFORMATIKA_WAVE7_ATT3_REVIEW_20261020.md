# TASK-346 QA7 — Attestatsiya test №3 manba ekspertizasi

Date: 2026-10-20. **Review-only, not learner release.**

## Manba va haqiqiy ko‘rib chiqish

- Original: Google Drive `Attestatsiya test №3.pdf`, ID `1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC`, 4 fizik sahifa.
- Page 1: labirint sxemasi, /22 tarmoq maskasi, 3-sonli to‘plamlar jadvali.
- Page 2: uch xonali son algoritmi, HTML rowspan/colspan, tasvir hajmi, Excel `СРЗНАЧ`.
- Page 3: Scratch yoshi va JavaScriptning ketma-ket operatorlari.
- Page 4: prefiksli ikkilik kodlash jadvali va 26-bit xabar.

**10 ta manbadan olingan, ekspert tomonidan qayta ifodalangan, qisqa savol nomzodi** faqat `attest_ingest.telegram_informatika_pdf_question_candidates`ga kiritildi. Bu asl PDF matnining to‘liq va so‘zma-so‘z ko‘chirmasi emas; har bir savol `paraphrased_expert_staging` flagi bilan human editorial tekshiruvni talab qiladi.

- Q1 labirintda **boshlang‘ich katak manbada aniq belgilanmagan**. Original diagramma o‘quvchi platformasida ham yo‘q. Q1 raqamli javob taklifisiz, `insufficient_problem_data` va visual-asset blocker bilan saqlanadi.
- Q8 Scratchdagi yosh sharti o‘qildi, lekin asl skript screenshoti o‘quvchi assetiga hali ulanmagan. Rasmsiz manba-staged test nashr qilinmaydi.
- Q2 — /22 ni 255.255.252.0 (A);
- Q3 — to‘plamlar kesishmasi: 330 + 270 − 520 = 80 ming (A);
- Q4 — to‘rtta variantning barchasi 116 ni beradi, ammo eng kichik uch xonali kirish 156 (D);
- Q5 — HTML jadvalining birlashtirilmagan 4 katagi yig‘indisi 165; `165 × 4 = 660` (A);
- Q6 — 16000 bayt × 8 / (320 × 400) = 1 bit/piksel, 2 rang (B);
- Q7 — `СРЗНАЧ(A1:A8) − 2 = 400/8 − 2 = 48` (B);
- Q8 — yosh 11 bo‘lsa, `8 < yosh < 17` rost, birinchi `yosh ekansiz` chiqadi (A);
- Q9 — JS: 25 → 24 → 39 → 38 (A);
- Q10 — prefiks kodlar `1011 1111 1100 1111 1110 00 1101` → `CGDGFAE` (B).

**9 ta mustaqil hisoblangan javob va o‘zbekcha tushuntirish** faqat `attest_ingest.telegram_informatika_pdf_independent_qa`da, `confirmed_by_human=false`. Asl savollarning `answer_key=NULL` va `review_state='needs_answer_and_visual_review'`. Diagramma/rasm original PDFdan bor, lekin foydalanuvchi ilovasidagi asset/rights yo‘q. Private `pdf_visual_index`ga #1 (p1) va #8 (p3) qo‘shildi.

### Reliz shartlari
1. Asl rasmga huquq hamda media-bog‘lash tekshirilib, #1 ning boshlang‘ich koordinatasi aniqlashtiriladi.
2. Q2–Q10 uchun savol rewording, distractor va izoh manba bilan tahririy qayta solishtiriladi. Formula natijalari hozir faqat **AI mustaqil tahlili**, manbada tasdiqlangan rasmiy javob kalitlari emas.
3. 2026 rasmiy construct, kognitiv daraja va Y1/Y2/Y3 metadata mosligi tekshiriladi.
4. Tahririy inson tasdig‘isiz `public.questions` ga nashr, learner mock poolga kirish yoki javob kalitini brauzerga yuborish **taqiqlanadi**.

### Testlar va kod
- `supabase/migrations/20261021120000_task346_att3_independent_qa.sql` — private, guarded, idempotent new source data (expert-authored paraphrases).
- `supabase/tests/telegram_informatika_att3_source_qa7.test.sql` — RLS, source count, review count, no keys, images missing.
- `scripts/tests/test_telegram_informatika_att3_qa7.py` — standard-library independent set/IP/Scratch/JS/HTML/base code calculations; arbitrary source code is never evaluated.

### Joriy yopiq pool (QA7)
- **530** question/exercise candidates from **30** PDFs in the Drive PDF inventory of **320**.
- **77** privately proposed multiple-choice PDF solutions (previously 68), **18** privately proposed free-response PDF explanations.
- **92** Excel formula review rows (85 computed, 7 source-defective).
- **0** new original source-verified PDF keys, **0** new public learner questions / lessons in this task.

No deploy requested. Potential GitHub auto-deploy after merging `main` depends on repository settings; this task did not trigger an explicit deploy.
