# TASK-431 — IP PDF savollari 5 → 8 source boundary repair

**Original:** [IP_manzil_attestatsiya_savollar.pdf](https://drive.google.com/file/d/154Zv3KzzCKyfMB9bxjuGIzPXK6l5Nu6E/view), 8 PDF pages. Supabase `attest_ingest.telegram_informatika_pdf_question_candidates` dastlab faqat №1–5 ni saqlagan. PDFning **6,7,8 betlari** 2026-10-22 kuni asl manbaning matni va sahifa renderi orqali qayta ko‘rildi; `source_question_no=6,7,8`, `source_page_number=6,7,8` alohida private rows bilan tiklandi. Har biri original matn, beshta mulohaza, PDF URI va module `M12`ni saqlaydi; `extracted_answer_options=[]`, `answer_key=NULL`, `source_visually_checked=true`. Original №1–5 o‘zgarmadi.

**Source inventar yangilandi:** oldingi 695 = 698 candidate. Oldingi hisobotdagi 376 missing options = endi 379; 306 to‘rt variantli, 13 irregular. Barcha 698 private candidates exactly one option-cardinality flag bilan belgilangan. 695 birinchi auditdagi son edi, endi eskirgan; historical counter emas.

## Original IP host qo‘yilishi bilan xatolar

Independent Python IPv4 `ipaddress.ip_interface` tasdiqladi:

| № | Texnik nuqson |
|---|---|
| 2 | A=192.168.10.32/27 — subnetning network identifikatori |
| 3 | A=192.168.5.32/27 — network |
| 5 | A=192.168.20.32/27 — network; B=192.168.20.95/27 — broadcast |
| 6 | A=192.168.0.32/27 — network |
| 7 | A=192.168.10.32/27 — network |

Bu adreslarni **kompyuterning foydalaniladigan host IP manzili** sifatida berish noto‘g‘ri. `invalid_source_formula` release blocker qo‘yildi; o‘quvchi bahosi uchun matnni shunchaki subnet hesabiga aylantirib yuborish mumkin emas. Q6/7/8 manbada faqat beshta mulohazani sanaydi, yakuniy `rost/yolg‘on tanlang` topshirig‘i va A–D variantlari yo‘q; alohida `insufficient_problem_data` blocker mavjud.

## Independent explanatory staging (NOT source key)

- №6: nazariy subnet hisobi rost 1,2,3,5 / yolg‘on 4; A=network, shart nuqsonli.
- №7: rost 1,2,4,5 / yolg‘on 3; A=network, shart nuqsonli.
- №8: rost 2,3,4,5 / yolg‘on 1; yakuniy savol so‘rovi yo‘q.
- Q1–5 dagi ilgari mavjud free-response QA va original source candidate yozuvlari saqlandi.

Private `free_response_qa` 8/8 rows, `human_approved=false`, `publish_ready=false`; learner bankka nashr yo‘q, original HTML/text va test urinishlari saqlangan. **Source correction ≠ learner publish.** 
